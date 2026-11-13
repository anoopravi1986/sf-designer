/*
  Desktop Panel Dock — isolated fpd-dpd-* only (see fpd-desktop-panel-dock.css).

  Scope: DESKTOP (>= 991px, non fpd-layout-small) element toolbar for
  image / SVG / group elements (data-element-type="image"). Text elements
  (Add Text Editor), mobile layouts and every other tool are never touched:
  when the toolbar is not eligible, all fpd-dpd-* classes and inline vars
  are removed again, so the original styling applies exactly as before.

  Why this exists
  ---------------
  The toolbar's panels (Opacity, Color, Rotate/Transform, Align/Position)
  had no single source of truth for where they open:
    - Rotate used `body.fpd-toolbar-transform-our .fpd-sub-panel {left:370px}`
      unless `fpd-element-toolbar.my-transform` re-anchored it to left:0.
      The `my-*` class is re-derived on *every* click inside the toolbar
      (home.component.ts), so releasing the Rotate slider dropped
      `my-transform` and the panel jumped 370px right, partly off-screen.
    - Color was `position: fixed; left: 70px` over the sidebar, but only
      while `my-color` survived the same click handler.
    - Align / Opacity were absolutely positioned under the toolbar, i.e.
      on top of the product preview.

  What it does
  ------------
  Measures the free "middle-left" gap between the left sidebar's right edge
  and the product preview's left edge (from the fabric canvas), then docks
  the open panel there through CSS custom properties, clamped to the
  viewport. Re-measures on open/close, resize, sidebar collapse, zoom and
  pointer release, so the position is the same during every interaction.
*/
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var DESKTOP_MQ = '(min-width: 991px)';
  var GUTTER = 12;   // space kept from sidebar / product / viewport edges
  var MIN_W = 260;   // narrowest width the panels still lay out cleanly at
  var MAX_W = 360;   // widest panel width (matches the old Color panel cap)
  var MIN_H = 160;

  var HOST_CLASS = 'fpd-dpd-host';
  var DOCK_CLASS = 'fpd-dpd-docked';
  var VARS = ['--fpd-dpd-left', '--fpd-dpd-top', '--fpd-dpd-width', '--fpd-dpd-max-h'];

  var mq = window.matchMedia ? window.matchMedia(DESKTOP_MQ) : null;
  var toolbar = null;
  var designerHost = null;
  var toolbarObserver = null;
  var resizeObserver = null;
  var frame = 0;

  function isDesktop () {
    return mq ? mq.matches : window.innerWidth >= 991;
  }

  function isEligible (tb) {
    return !!tb &&
      isDesktop() &&
      tb.classList.contains('fpd-smart') &&
      tb.classList.contains('fpd-show') &&
      !tb.classList.contains('fpd-layout-small') &&
      tb.dataset.elementType === 'image';
  }

  function visibleRect (el) {
    if (!el) return null;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0 ? r : null;
  }

  // The element FancyProductDesigner was mounted on keeps `.instance`
  // (see fpd-src/06-engine-main-class.js: `this.container.instance = this`).
  function findDesignerHost () {
    if (designerHost && designerHost.isConnected && designerHost.instance) return designerHost;
    designerHost = null;
    var list = document.querySelectorAll('.fpd-container');
    for (var i = 0; i < list.length; i++) {
      if (list[i].instance && list[i].instance.currentViewInstance !== undefined) {
        designerHost = list[i];
        break;
      }
    }
    return designerHost;
  }

  function sidebarRight (host) {
    var bar = (host && host.querySelector('fpd-main-bar')) || document.querySelector('fpd-main-bar');
    var r = visibleRect(bar);
    return r ? Math.max(0, r.right) : 0;
  }

  // On-screen bounds of the product itself (all non-custom layers, i.e. the
  // product images the customer is designing on), not the whole canvas.
  function productRect (host) {
    try {
      var inst = host && host.instance;
      var view = inst && inst.currentViewInstance;
      var fc = view && view.fabricCanvas;
      if (!fc || !fc.lowerCanvasEl) return null;

      var cr = fc.lowerCanvasEl.getBoundingClientRect();
      var cw = fc.getWidth ? fc.getWidth() : 0;
      if (!cr.width || !cw) return null;
      var s = cr.width / cw;

      var minX = Infinity, maxX = -Infinity;
      fc.getObjects().forEach(function (o) {
        if (!o || o.isCustom || o.visible === false || !o.getBoundingRect) return;
        var b = o.getBoundingRect();
        if (!b || !isFinite(b.left) || !b.width) return;
        minX = Math.min(minX, b.left);
        maxX = Math.max(maxX, b.left + b.width);
      });

      if (minX === Infinity) return { left: cr.left, right: cr.right };
      return {
        left: Math.max(cr.left, cr.left + minX * s),
        right: Math.min(cr.right, cr.left + maxX * s)
      };
    } catch (err) {
      return null;
    }
  }

  function panelsOf (tb) {
    var list = [];
    var sub = tb.querySelector(':scope > .fpd-sub-panel');
    if (sub) list.push(sub);
    var opacity = tb.querySelector('#fpd-opacity-panel');
    if (opacity) list.push(opacity);
    return list;
  }

  function computeDock (tb) {
    var host = findDesignerHost();
    var vw = document.documentElement.clientWidth || window.innerWidth;
    var vh = window.innerHeight;
    var tbRect = tb.getBoundingClientRect();

    var gapLeft = sidebarRight(host);
    var prod = productRect(host);
    var gapRight = prod ? prod.left : tbRect.left;
    if (!(gapRight > gapLeft)) gapRight = gapLeft;

    var avail = gapRight - gapLeft - GUTTER * 2;
    var width = Math.round(Math.max(MIN_W, Math.min(MAX_W, avail)));
    width = Math.min(width, vw - GUTTER * 2);

    // Centre inside the gap; if the gap is narrower than the panel, keep it
    // hugging the sidebar so it eats as little of the product as possible.
    var left = avail >= width
      ? gapLeft + GUTTER + (avail - width) / 2
      : gapLeft + GUTTER;
    left = Math.min(Math.max(left, GUTTER), vw - width - GUTTER);

    // Level with the toolbar strip so panel + strip read as one control —
    // unless the gap is too narrow (small desktops) and the panel would
    // cover the strip's own buttons; then it opens just below the strip.
    var top = Math.max(GUTTER, tbRect.top);
    var coversStrip = left < tbRect.right && left + width > tbRect.left;
    if (coversStrip) top = tbRect.bottom + GUTTER / 2;
    var maxH = Math.max(MIN_H, vh - top - GUTTER);
    if (top + maxH > vh) top = Math.max(GUTTER, vh - maxH - GUTTER);

    return { left: Math.round(left), top: Math.round(top), width: width, maxH: Math.round(maxH) };
  }

  function writeVars (el, dock) {
    var values = [dock.left + 'px', dock.top + 'px', dock.width + 'px', dock.maxH + 'px'];
    for (var i = 0; i < VARS.length; i++) {
      if (el.style.getPropertyValue(VARS[i]) !== values[i]) el.style.setProperty(VARS[i], values[i]);
    }
  }

  function undock (tb) {
    if (!tb) return;
    if (tb.classList.contains(HOST_CLASS)) tb.classList.remove(HOST_CLASS);
    panelsOf(tb).forEach(function (el) {
      if (el.classList.contains(DOCK_CLASS)) el.classList.remove(DOCK_CLASS);
      VARS.forEach(function (v) {
        if (el.style.getPropertyValue(v)) el.style.removeProperty(v);
      });
    });
  }

  function update () {
    frame = 0;
    if (!toolbar || !toolbar.isConnected) {
      attach();
      if (!toolbar) return;
    }

    if (!isEligible(toolbar)) {
      undock(toolbar);
      return;
    }

    var dock = computeDock(toolbar);
    if (!toolbar.classList.contains(HOST_CLASS)) toolbar.classList.add(HOST_CLASS);
    panelsOf(toolbar).forEach(function (el) {
      if (!el.classList.contains(DOCK_CLASS)) el.classList.add(DOCK_CLASS);
      // Only writes when a value actually changed, so the toolbar
      // MutationObserver below cannot feed back into itself.
      writeVars(el, dock);
    });
  }

  function schedule () {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  function attach () {
    var tb = document.querySelector('fpd-element-toolbar');
    if (!tb || tb === toolbar) return;

    if (toolbarObserver) toolbarObserver.disconnect();
    toolbar = tb;

    // Panels open/close by class/style changes on the toolbar subtree
    // (fpd-panel-visible, fpd-active, fpd-opacity-open, inline display...).
    toolbarObserver = new MutationObserver(schedule);
    toolbarObserver.observe(toolbar, {
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ['class', 'style', 'data-element-type']
    });
    schedule();
  }

  function observeLayout () {
    if (!window.ResizeObserver) return;
    if (!resizeObserver) resizeObserver = new ResizeObserver(schedule);
    var host = findDesignerHost();
    var bar = host && host.querySelector('fpd-main-bar');
    var stage = host && host.querySelector('.fpd-product-stage');
    if (bar) resizeObserver.observe(bar);
    if (stage) resizeObserver.observe(stage);
  }

  function init () {
    window.addEventListener('resize', schedule, { passive: true });
    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', schedule);
      else if (mq.addListener) mq.addListener(schedule);
    }
    // Pointer release (end of drag/rotate/pan), zoom slider + wheel zoom,
    // and sidebar collapse transitions can all move the product.
    ['mouseup', 'touchend', 'input', 'wheel', 'transitionend'].forEach(function (type) {
      document.addEventListener(type, schedule, { capture: true, passive: true });
    });

    // The toolbar and designer are created by Angular/FPD after load.
    var tries = 0;
    var timer = window.setInterval(function () {
      attach();
      if (toolbar && findDesignerHost()) {
        observeLayout();
        window.clearInterval(timer);
      } else if (++tries > 240) {
        window.clearInterval(timer);
      }
    }, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
