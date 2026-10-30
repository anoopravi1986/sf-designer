
/*
 * FancyProductDesigner - part 5/6: element-toolbar interactions
 * ---------------------------------------------------------------------
 * The element toolbar's behavior class (multi-select, alignment,
 * z-ordering) plus supporting view-option helper classes. Contains
 * significant StyleFlip customizations (toast notifications, layer
 * grouping/merging, copy/paste for grouped elements and images) - marked
 * with "===== CUSTOM (StyleFlip)" banner comments below.
 */

      class ma extends EventTarget {
        constructor (t) {
          var e, i
          if (
            (super(),
            Xr(this, ga),
            Xr(this, pa),
            Xr(this, fa),
            Xr(this, ua),
            Xr(this, da),
            Xr(this, ha),
            Xr(this, ca),
            Xr(this, la),
            Xr(this, oa),
            Xr(this, aa),
            Xr(this, ra),
            Xr(this, sa),
            Xr(this, na),
            Xr(this, ia),
            Xr(this, ea),
            Xr(this, ta),
            (function (t, e, i) {
              ;(e = (function (t) {
                var e = (function (t, e) {
                  if ('object' != typeof t || null === t) return t
                  var i = t[Symbol.toPrimitive]
                  if (void 0 !== i) {
                    var n = i.call(t, 'string')
                    if ('object' != typeof n) return n
                    throw new TypeError(
                      '@@toPrimitive must return a primitive value.'
                    )
                  }
                  return String(t)
                })(t)
                return 'symbol' == typeof e ? e : String(e)
              })(e)) in t
                ? Object.defineProperty(t, e, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                  })
                : (t[e] = i)
            })(this, 'currentPlacement', ''),
            (i = { writable: !0, value: void 0 }),
            Zr(this, (e = $r)),
            e.set(this, i),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-element-toolbar')),
            Kr(this, fa, Ma).call(this),
            Object.keys(t.mainOptions.maxValues).forEach(e => {
              const i = this.container.querySelector(
                '[data-control="' + e + '"]'
              )
              i && i.setAttribute('max', t.mainOptions.maxValues[e])
            }),
            Array.isArray(t.mainOptions.fonts) && t.mainOptions.fonts.length)
          ) {

            const e = this.subPanel.querySelector('.fpd-fonts-list');

            t.mainOptions.fonts.forEach(i => {
              let n = typeof i === 'object' ? i.name : i;
              let variants = i.variants || ['regular'];

              const container = document.createElement('div');
              container.className = 'fpd-font-item-container';

              // Font Label (clickable)
              const s = document.createElement('div');
              s.className = 'fpd-item';
              s.dataset.value = n;
              s.style.fontFamily = n;

              const fontLabel = document.createElement('span');
              fontLabel.className = 'fpd-font-name text-[1rem]';
              fontLabel.innerText = n;

              const arrowIcon = document.createElement('span');
              arrowIcon.className = 'fpd-icon-arrow-dropdown text-[1.25rem]';
              arrowIcon.innerText = '';
              arrowIcon.style.display = variants.length > 1 ? 'inline' : 'none';

              s.appendChild(fontLabel);
              s.appendChild(arrowIcon);
              container.appendChild(s);

              // Variant Dropdown
              const variantContainer = document.createElement('div');
              variantContainer.className = 'fpd-font-variant-toggle';
              variantContainer.style.display = 'none';

              variants.forEach(variant => {
                const variantBtn = document.createElement('div');
                variantBtn.className = 'fpd-variant-btn';
                variantBtn.innerHTML = `<span class="text-[1rem]">${variant.charAt(0).toUpperCase() + variant.slice(1)}</span><span class="fpd-check-icon" style="display:none;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4.53 11.9 9 16.38 19.44 5.97a.75.75 0 0 1 1.06 1.06L9.53 17.97c-.3.29-.77.29-1.06 0l-5-5c-.7-.71.35-1.77 1.06-1.07z"></path></svg></span>`;
                variantBtn.dataset.variant = variant;
                variantBtn.style.fontFamily = n;

                variantBtn.addEventListener('click', () => {
                  let fontWeight = /bold/i.test(variant) ? 'bold' : /medium/i.test(variant) ? '500' : 'normal';
                  let fontStyle = /italic/i.test(variant) ? 'italic' : 'normal';

                  // Clear all active states
                  document.querySelectorAll('.fpd-item').forEach(el => el.classList.remove('fpd-active'));
                  document.querySelectorAll('.fpd-variant-btn').forEach(el => el.classList.remove('active'));
                  document.querySelectorAll('.fpd-check-icon').forEach(el => (el.style.display = 'none'));

                  // Set active states
                  s.classList.add('fpd-active');
                  variantBtn.classList.add('active');
                  variantBtn.querySelector('.fpd-check-icon').style.display = 'inline';

                  t.currentViewInstance.fabricCanvas.setElementOptions({
                    fontFamily: n,
                    fontWeight: fontWeight,
                    fontStyle: fontStyle
                  });

                  Kr(this, ta, va).call(this, t.currentElement);
                });

                variantContainer.appendChild(variantBtn);
              });

              container.appendChild(variantContainer);

              // Font Label Click - Open/Close + Auto-Select First
              s.addEventListener('click', () => {
                const isVisible = variantContainer.style.display === 'block';

                // Close all other dropdowns
                document.querySelectorAll('.fpd-font-variant-toggle').forEach(el => (el.style.display = 'none'));
                document.querySelectorAll('.fpd-arrow-icon').forEach(el => (el.innerText = '▾'));

                if (variants.length > 1) {
                  variantContainer.style.display = isVisible ? 'none' : 'block';
                  arrowIcon.innerText = isVisible ? '' : '';

                  if (!isVisible) {
                    const firstVariantBtn = variantContainer.querySelector('.fpd-variant-btn');
                    if (firstVariantBtn && !firstVariantBtn.classList.contains('active')) {
                      firstVariantBtn.click(); // Auto-select first variant
                    }
                  }
                } else {
                  // Single variant — apply directly
                  variantContainer.querySelector('.fpd-variant-btn')?.click();
                }
              });

              e.appendChild(container);
            }),
              G(
                this.subPanel.querySelector('.fpd-panel-font-family input'),
                'keyup',
                t => {
                  const i = t.currentTarget.value
                  ;
                  e.querySelectorAll('.fpd-item').forEach(t => {
                    0 == i.length
                      ? t.classList.remove('fpd-hidden')
                      : t.classList.toggle(
                          'fpd-hidden',
                          !t.innerText.toLowerCase().includes(i.toLowerCase())
                        )
                  })
                }
              )
          } else
            this.navElem.querySelector('.fpd-tool-font-family').style.display =
              'none'
          const s = this.subPanel.querySelector('.fpd-tool-filters')
          for (const e in qr) {
            const i = document.createElement('div'),
              n = qr[e]
            ;(i.className = 'fpd-item'),
              i.setAttribute('aria-label', n.name),
              (i.style.backgroundImage = `url(${n.preview})`),
              s.append(i),
              G(i, 'click', i => {
                t.currentViewInstance.fabricCanvas.setElementOptions({
                  filter: n.array || e
                })
              })
          }
          let copiedGroup = null;
          if (!ma._groupClipboardBound) {
            ma._groupClipboardBound = true;
            document.addEventListener('keydown', ev => {
              if (!ev.ctrlKey) return;
              const key = ev.key ? ev.key.toLowerCase() : '';
              if (key !== 'c' && key !== 'v') return;
              const target = ev.target;
              const tag = target && target.nodeName;
              if (
                tag === 'INPUT' ||
                tag === 'TEXTAREA' ||
                (target && target.isContentEditable)
              )
                return;
              const fabricCanvas = this.fpdInstance.currentViewInstance?.fabricCanvas;
              if (!fabricCanvas) return;
              if (key === 'c') {
                const obj = fabricCanvas.getActiveObject();
                if (obj && obj.type === 'group') {
                  obj.clone(clone => {
                    copiedGroup = clone;
                  });
                }
              } else if (copiedGroup) {
                copiedGroup.clone(cloned => {
                  cloned.set({
                    left: copiedGroup.left + 20,
                    top: copiedGroup.top + 20,
                    originX: 'center',
                    originY: 'center',
                    autoCenter: false,
                    clipPath: null,
                    boundingBox: null,
                    boundingBoxMode: 'none'
                  });
                  fabricCanvas.add(cloned);
                  fabricCanvas.setActiveObject(cloned);
                  fabricCanvas.requestRenderAll();
                });
              }
            });
          }
          const r = this.subPanel.querySelector('.fpd-tool-crop-masks')
          Array.isArray(t.mainOptions.cropMasks) &&
            t.mainOptions.cropMasks.forEach(e => {
              const i = document.createElement('div')
              ;(i.className = 'fpd-item'),
                i.setAttribute('aria-label', nt(e)),
                (i.style.backgroundImage = `url(${e})`),
                r.append(i),
                G(i, 'click', i => {
                  this.toggle(!1),
                    t.advancedImageEditor.loadImage(t.currentElement, e)
                })
            }),
            G(t, 'elementSelect', () => {
              const e = t.currentElement
              Kr(this, ha, Ia).call(this, e)
                ? (Kr(this, da, Oa).call(this, e),
                  Kr(this, ua, ka).call(this),
                  'text' == e.getType() &&
                    (e.off('changed', Kr(this, ua, ka).bind(this)),
                    e.on('changed', Kr(this, ua, ka).bind(this))),
                  Kr(this, ta, va).call(this, e))
                : this.toggle(!1)
            }),
            G(t, 'elementChange', () => {
              'smart' == this.currentPlacement && this.toggle(!1)
            }),
            G(t, 'elementModify', t => {
              ;
              if (!t.currentTarget || !t.currentTarget.currentViewInstance || !t.currentTarget.currentViewInstance.fabricCanvas) return;
              const elementtypedata = t.currentTarget.currentViewInstance.fabricCanvas.getActiveObject();
              if (elementtypedata) {
                let updated = false;

                // Fix scaleX
                if (isNaN(elementtypedata.scaleX)) {
                  elementtypedata.scaleX = 1;
                  updated = true;
                }

                // Fix scaleY
                if (isNaN(elementtypedata.scaleY)) {
                  elementtypedata.scaleY = 1;
                  updated = true;
                }

                if (updated) {
                  ;
                  elementtypedata.setCoords();
                  t.currentTarget.currentViewInstance.fabricCanvas.requestRenderAll();

                  // 🔹 Update related fpd-range-slider inputs
                  document.querySelectorAll(".fpd-panel-transform fpd-range-slider").forEach(slider => {
                    const control = slider.dataset.control; // e.g. "shadowOffsetY", "scaleX", "scaleY"
                    ;
                    if (control === "scaleX") {
                      // slider.setAttribute("value", 1);
                      slider.querySelector(".fpd-slider-number").value = 1;
                      // slider.querySelector("input").dispatchEvent(new Event("input", { bubbles: true }));
                    }

                    if (control === "scaleY") {
                      // slider.setAttribute("value", 1);
                      slider.querySelector(".fpd-slider-number").value = 1;
                      // slider.querySelector("input").dispatchEvent(new Event("input", { bubbles: true }));
                    }
                  });

                  ;
                }
              }
              const elementtypedatatype = elementtypedata?.type;
              ;
              ;
              const { options: e } = t.detail
              ;
              if (elementtypedatatype === 'group') {
                ;
                localStorage.setItem("topvalueforgroup", t.detail.options.top);
                const activeGroup = t.detail.activeObject;
                let groupId = elementtypedata.title;
                groupId = (elementtypedata.title || "").toString().replace(/\s+/g, "_")
                ;
                let allTransforms = {};
                const raw = localStorage.getItem("groupTransforms");
                if (raw) {
                  try {
                    allTransforms = JSON.parse(raw);
                  } catch (e) {
                    console.warn("Corrupt groupTransforms in localStorage, resetting...");
                    allTransforms = {};
                  }
                }
                // Get the existing transform for this group, or defaults
                let savedTransforms = allTransforms[groupId] || {
                  scaleX: 1,
                  scaleY: 1,
                  flipX: false,
                  flipY: false
                };
                const safeOptions = {
                  scaleX: isNaN(t.detail.options?.scaleX) ? 1 : t.detail.options.scaleX,
                  scaleY: isNaN(t.detail.options?.scaleY) ? 1 : t.detail.options.scaleY,
                  flipX: t.detail.options?.flipX ?? false,
                  flipY: t.detail.options?.flipY ?? false,
                  top: t.detail.options?.top ?? 500,
                  left: t.detail.options?.left ?? 500
                };

                // Merge new updates
                savedTransforms = {
                  ...savedTransforms,
                  ...safeOptions
                };

                // Save back under this group’s ID
                allTransforms[groupId] = savedTransforms;
                localStorage.setItem("groupTransforms", JSON.stringify(allTransforms));

                ;

              }
              else{
                localStorage.setItem("groupTransforms", '');
              }

              ;
              void 0 !== e.fontSize &&
                (Kr(this, pa, Pa).call(this, 'fontSize', e.fontSize),
                (this.navElem.querySelector(
                  '.fpd-tool-text-size > input'
                ).value = e.fontSize)),
                void 0 !== e.fontFamily &&
                  (this.navElem.querySelector(
                    '.fpd-tool-font-family fpd-dropdown > input'
                  ).value = e.fontFamily),
                void 0 !== e.scaleX &&
                  Kr(this, pa, Pa).call(
                    this,
                    'scaleX',
                    parseFloat(Number(e.scaleX).toFixed(2))
                  ),
                void 0 !== e.scaleY &&
                  Kr(this, pa, Pa).call(
                    this,
                    'scaleY',
                    parseFloat(Number(e.scaleY).toFixed(2))
                  ),
                void 0 !== e.angle &&
                  Kr(this, pa, Pa).call(this, 'angle', parseInt(e.angle)),
                void 0 !== e.text && Kr(this, pa, Pa).call(this, 'text', e.text)
            }),
            G(document.body, ['mouseup', 'touchend'], () => {
              this.fpdInstance.currentElement && Kr(this, ua, ka).call(this)
            }),
            G(this.subPanel.querySelectorAll('.fpd-number'), 'change', e => {
              const i = e.currentTarget
              let n = {}
              i.value > Number(i.max) && (i.value = Number(i.max)),
                i.value < Number(i.min) && (i.value = Number(i.min))
              let s = Number(i.value)
              i.classList.contains('fpd-slider-number') &&
                (i.previousElementSibling.setAttribute('value', s),
                'scaleX' === i.dataset.control &&
                  t.currentElement &&
                  t.currentElement.lockUniScaling &&
                  ((n.scaleY = s), Kr(this, pa, Pa).call(this, 'scaleY', s))),
                (n[i.dataset.control] = s),
                t.currentViewInstance &&
                  t.currentViewInstance.fabricCanvas.setElementOptions(n)
            }),
            G(
              this.subPanel.querySelectorAll('fpd-range-slider'),
              'onInput',
              e => {
                const i = e.currentTarget,
                  n = e.detail
                if (t.currentViewInstance && t.currentElement) {
                  var s = {},
                    r = i.dataset.control
                  ;(s[r] = n),
                    'scaleX' === r &&
                      t.currentElement &&
                      t.currentElement.lockUniScaling &&
                      ((s.scaleY = n),
                      Kr(this, pa, Pa).call(this, 'scaleY', n)),
                    t.currentViewInstance.fabricCanvas.setElementOptions(s)
                }
                const a = e.currentTarget.nextElementSibling
                a && a.classList.contains('fpd-slider-number') && (a.value = n)
              }
            ),
            G(
              this.subPanel.querySelectorAll('.fpd-panel-tabs > span'),
              'click',
              t => {
                const e = t.currentTarget,
                  i = e.parentNode,
                  n = i.nextElementSibling
                Z(i.querySelectorAll('span'), ['fpd-active']),
                  X(e, ['fpd-active'])
                const s = Array.from(n.children)
                Z(s, ['fpd-active']),
                  X(
                    s.filter(t => t.dataset.id == e.dataset.tab),
                    ['fpd-active']
                  )
              }
            ),
            G(this.subPanel.querySelectorAll('.fpd-toggle'), 'click', e => {
              const i = e.currentTarget
              let n = {}
              J(i, ['fpd-enabled'], !i.classList.contains('fpd-enabled')),
                (n[i.dataset.control] = i.classList.contains('fpd-enabled')
                  ? i.dataset.enabled
                  : i.dataset.disabled),
                ['true', 'false'].includes(n[i.dataset.control]) &&
                  (n[i.dataset.control] = 'true' === n[i.dataset.control]),
                i.classList.contains('fpd-tool-uniscaling-locker') &&
                  Kr(this, la, Ea).call(this, n[i.dataset.control]),
                t.currentViewInstance.fabricCanvas.setElementOptions(n)
            }),
            G(
              this.subPanel.querySelectorAll('.fpd-btn-options'),
              'click',
              e => {
                e.preventDefault()
                const i = e.currentTarget,
                  n = JSON.parse(i.dataset.options),
                  s = Object.keys(n),
                  r = t.currentElement
                    ? t.currentElement[i.dataset.control]
                    : s[0],
                  a = s.indexOf(r) == s.length - 1 ? s[0] : s[s.indexOf(r) + 1],
                  o = {}
                ;(o[i.dataset.control] = a),
                  (i.querySelector('span').className = n[a]),
                  t.currentViewInstance.fabricCanvas.setElementOptions(o)
              }
            ),
            G(
              this.subPanel.querySelectorAll('.fpd-btn-group [data-option]'),
              'click',
              e => {
                e.preventDefault()
                const i = e.currentTarget,
                  n = i.dataset.option
                Z(Array.from(i.parentNode.children), ['fpd-active']),
                  X(i, ['fpd-active'])
                const s = {}
                ;(s[i.parentNode.dataset.control] = n),
                  t.currentViewInstance.fabricCanvas.setElementOptions(s)
              }
            ),
            G(
              this.subPanel.querySelectorAll('.fpd-tools-group > [data-do]'),
              'click',
              e => {
                const i = e.currentTarget.dataset.do
                if ('align-left' == i) t.currentElement.alignToPosition('left')
                else if ('align-right' == i)
                  t.currentElement.alignToPosition('right')
                else if ('align-top' == i)
                  t.currentElement.alignToPosition('top')
                else if ('align-bottom' == i)
                  t.currentElement.alignToPosition('bottom')
                else if ('align-middle' == i)
                  t.currentElement.centerElement(!1, !0)
                else if ('align-center' == i)
                  t.currentElement.centerElement(!0, !1)
                else if ('layer-up' == i || 'layer-down' == i) {
                  // z clamp vs Base/Overlay lives only in setElementOptions
                  // (shared with Layers drag + TextMoveUp/Down).
                  let e = t.currentElement.getZIndex()
                  e = 'layer-up' == i ? e + 1 : e - 1
                  e = e < 0 ? 0 : e
                  t.currentViewInstance.fabricCanvas.setElementOptions({ z: e })
                } else if ('flip-x' == i || 'flip-y' == i) {
                  const e = {}
                  ;
                  'flip-x' == i
                    ? (e.flipX = !t.currentElement.flipX)
                    : (e.flipY = !t.currentElement.flipY),
                    t.currentViewInstance.fabricCanvas.setElementOptions(e)
                }
              }
            ),
            G(
              this.subPanel.querySelector('textarea[data-control="text"]'),
              'keyup',
              e => {
                e.stopPropagation, e.preventDefault()
                var i = e.currentTarget.selectionStart,
                  n = e.currentTarget.selectionEnd
                t.currentViewInstance.fabricCanvas.setElementOptions({
                  text: e.currentTarget.value
                }),
                  (e.currentTarget.selectionStart = i),
                  (e.currentTarget.selectionEnd = n)
              }
            ),
            G(
              this.subPanel.querySelectorAll('.fpd-curved-options > span'),
              'click',
              e => {
                ;
                const allSpans = this.subPanel.querySelectorAll('.fpd-sub-panel .fpd-panel-curved-text .fpd-curved-options > span');
                allSpans.forEach(span => span.classList.remove('fpd-active'));
                e.currentTarget.classList.add('fpd-active');
                const valueoftext = e.currentTarget.getAttribute('data-value');
                ;
                // if(valueoftext === 'curved') {
                //   const activeObj = t.currentViewInstance.fabricCanvas;
                //   const activeObject = activeObj?.getActiveObject();
                //   console.log(t.currentViewInstance.fabricCanvas, "activeObj", activeObject);
                //   if (activeObj) {
                //       // Change Fabric object type
                //        activeObject.type = 'curved-text';
                //       activeObject.set('fabricType', 'curved-text');
                //     console.log("activeObj", activeObj, "activeObject", activeObject);
                //       // Update corresponding toolbar in DOM
                //       const toolbarEl = document.querySelector(`fpd-element-toolbar`);
                //       console.log("toolbarEl", toolbarEl);
                //       if (toolbarEl) {
                //           toolbarEl.dataset.fabricType = 'curved-text';
                //           toolbarEl.classList.add('fpd-show');
                //           console.log("Toolbar updated for curved text:", toolbarEl);
                //       }
                //       let curvedOptions = {curved: true}
                      
                //       // t.currentViewInstance.fabricCanvas.setElementOptions(curvedOptions)
                //       t.currentViewInstance.fabricCanvas.setElementOptions(curvedOptions);

                //       // Force re-add selection
                //       t.currentViewInstance.fabricCanvas.discardActiveObject(); // clear any old state
                //       t.currentViewInstance.fabricCanvas.setActiveObject(activeObject);

                //       // Bring controls back
                //       activeObject.setCoords(); 
                //       t.currentViewInstance.fabricCanvas.requestRenderAll();

                //       // If toolbar depends on event, trigger it manually
                //       t.currentViewInstance.fabricCanvas.fire('selection:created', { target: activeObject });

                //       // t.selectElement(activeObj);
                //       setTimeout(() => {
                //         document.querySelector('fpd-element-toolbar').classList.add('fpd-show');
                //       },8000)
                //   }
                // }
                if (valueoftext === 'curved') {
                  const fabricCanvas = t.currentViewInstance.fabricCanvas;
                  const activeObject = fabricCanvas.getActiveObject();
                  ;
                  if (activeObject) {
                    // Add custom property "curvable"
                    // activeObject.set({
                    //   curvable: 1,
                    //   curved: true,
                    //   effect: "curved",
                    //   // Preserve original flags
                    //   editable: activeObject.editable ?? true,
                    //   transformable: activeObject.transformable ?? true,
                    //   removable: activeObject.removable ?? true,
                    //   resizable: activeObject.resizable ?? true,
                    // });

                    // // Sync type/fabricType (so toolbar updates correctly)
                    // activeObject.type = 'curved-text'; // keep as text
                    // activeObject.set('fabricType', 'curved-text');
                    // activeObject.originParams.type = 'curved-text';
                    // activeObject.originParams.curved = true;
                    
                    // // Reapply coordinates & selection
                    // activeObject.setCoords();
                    // fabricCanvas.add(curvedText);
                    // fabricCanvas.setActiveObject(activeObject);
                    // fabricCanvas.requestRenderAll();

                    const props = activeObject.toObject([
                      'text',
                      'left',
                      'top',
                      'fontSize',
                      'fill',
                      'fontFamily',
                      'fontWeight',
                      'angle',
                      'scaleX',
                      'scaleY',
                      'charSpacing',
                      'lineHeight',
                      'textAlign',
                      'editable',
                      'transformable',
                      'removable',
                      'resizable'
                    ]);

                    // Create a curved text with copied properties
                    const curvedText = new fabric.CurvedText(props.text, {
                      // ...props,
                      left: props.left,
                      top: props.top,
                      fontSize: props.fontSize || 60, 
                      fill: props.fill,
                      fontFamily: props.fontFamily,
                      fontWeight: props.fontWeight,
                      lockUniScaling: true,
                      scalabe: true,
                      curved: true,
                      curveReverse: false,
                      curveRadius: 200,
                      copyable: 1,
                      resizable: 1,
                      curvable: 1,
                      removable: true,
                      editable: true,
                      boundingBox: 'Base',
                      boundingBoxMode: 'clipping',
                      hasControls: true,
                      evented: true,
                      transformable: true,
                      isEditable: true,
                      // isCustom:1,
                      colors: [props.fill || '#000'],
                      charSpacing: props.charSpacing || 0,
                      rotatable: props.rotatable || true,
                      maxCurveRadius: 400,
                      maxFontSize: 200,
                      zChangeable: 1
                      // objectCaching: false,
                    });

                    // Replace the old object
                    fabricCanvas.remove(activeObject);
                    fabricCanvas.add(curvedText);
                    fabricCanvas.setActiveObject(curvedText);
                    fabricCanvas.requestRenderAll();
                    ;
                    // t.currentViewInstance.fabricCanvas.setActiveObject(activeObject);
                    //       t.currentViewInstance.fabricCanvas.renderAll();
                    //  for (let i = activeObject.length - 1; i >= 0; i--) {
                    //   const element = activeObject[i];
                    //   console.log('Type:', element.type, 'Title:', element.title, element);
                    //   if (element.type === 'curved-text') {
                    //     if (element && typeof t.currentViewInstance.fabricCanvas.setActiveObject === 'function') {
                    //       t.currentViewInstance.fabricCanvas.setActiveObject(element);
                    //       t.currentViewInstance.fabricCanvas.renderAll();
                    //       break;
                    //     }
                    //   }
                      // You can access properties like obj.left, obj.top, obj.width, obj.height, etc.
                    // }

                    // Update toolbar
                    const toolbarEl = document.querySelector(`fpd-element-toolbar`);
                    if (toolbarEl) {
                      toolbarEl.dataset.fabricType = 'curved-text';
                      toolbarEl.classList.add('fpd-show');
                      toolbarEl.classList.add('my-transform');
                      toolbarEl.classList.add('fpd-panel-visible');
                      
                       const textTransformDiv = toolbarEl.querySelector('#TextTransform');

                        if (textTransformDiv) {
                          // Find span inside that div
                          const spanEl = textTransformDiv.querySelector('span');

                          if (spanEl) {
                            spanEl.classList.add('fpd-icon-text-transform');
                          }
                        }


                      document.querySelector('.fpd-panel-transform').classList.add('fpd-active');
                      document.querySelector('.fpd-tool-transform').classList.add('fpd-active');
                    }

                    ;

                    // Optional: notify canvas listeners
                    fabricCanvas.fire('object:modified', { target: activeObject });
                  }
                }

                else{

                  const i = e.currentTarget
                  let n = {}
                  'normal' == i.dataset.value
                    ? (n.curved = !1)
                    : ((n.curved = !0),
                      (n.curveReverse = 'curveReverse' == i.dataset.value)),
                    t.currentViewInstance.fabricCanvas.setElementOptions(n);
                    
                    const activeElementOptions = t.currentViewInstance.fabricCanvas._objects.find(obj => obj.type === 'curved-text');
                    ;
  
                    // const fabricCanvas = t.currentViewInstance.fabricCanvas;
                    // console.log("fabricCanvas", fabricCanvas);
                    // const activeObj = t.currentViewInstance.fabricCanvas;
                    // const activeObject = activeObj?.getActiveObject();
                    // console.log(t.currentViewInstance.fabricCanvas, "activeObj", activeObject);
                    // if (activeObj) {
                    //     // Change Fabric object type
                    //      activeObj.type = 'curved-text';
                    //     activeObj.set('fabricType', 'curved-text');
  
                    //     // Update corresponding toolbar in DOM
                    //     const toolbarEl = document.querySelector(`fpd-element-toolbar[data-id="${activeObj.id}"]`);
                    //     if (toolbarEl) {
                    //         toolbarEl.dataset.fabricType = 'curved-text';
                    //         toolbarEl.classList.add('fpd-show');
                    //         console.log("Toolbar updated for curved text:", toolbarEl);
                    //     }
                    // }
                    // t.currentViewInstance.fabricCanvas.addElement(
                    //   'curved-text',
                    //   t.currentViewInstance.fabricCanvas.textPlaceholder.text, // title
                    //   t.currentViewInstance.fabricCanvas.textPlaceholder.text, // actual text
                    //   activeElementOptions
                    // );
                    // const curvedObj = t.currentViewInstance.fabricCanvas.addElement(
                    //     'curved-text',
                    //     activeElementOptions.text, // title
                    //     activeElementOptions.text,
                    //     activeElementOptions
                    // );
  
                    // // Ensure Fabric object type is set
                    // curvedObj.type = 'curved-text';
                    // curvedObj.set('fabricType', 'curved-text');
                    // t.currentViewInstance.fabricCanvas.setActiveObject(curvedObj);
                    
                    t.currentViewInstance.fabricCanvas.renderAll();
  
                    // console.log("Converted text to curved-text with properties:", props);
                    // const fabricCanvas = t.currentViewInstance.fabricCanvas;
  
                    // // Find all elements in the canvas that are linked to the toolbars
                    // fabricCanvas.getObjects().forEach(obj => {
                    //   if (obj && obj.type) {
                    //     // If you specifically want to change only certain elements:
                    //     // if (obj.type === 'text' || obj.type === 'group') { ... }
  
                    //     // Change the internal type property to curved-text
                    //     obj.type = 'curved-text';
  
                    //     // Optional: if using custom property for FPD
                    //     obj.set('fabricType', 'curved-text');
                    //   }
                    // });
                    // fabricCanvas.renderAll();
                }

              }
            ),
            G(this.navElem.querySelector('.fpd-tool-reset'), 'click', e => {
              // let i = t.currentElement.originParams
              // delete i.clipPath,
              //   delete i.path,
              //   t.currentElement.boundingBox &&
              //     ((t.currentElement.scaleX = 1),
              //     (i.boundingBox = t.currentElement.boundingBox)),
              //   t.currentViewInstance.fabricCanvas.setElementOptions(i),
              //   t.deselectElement()
              const currentEl = t.currentElement;
              ;
              this.fpdInstance.actionsBar.doAction('reset-product')
              
            }),


              // ===================================================================
              // ===== CUSTOM (StyleFlip): group/ungroup, copy/paste, toast ======
              // Repurposes the toolbar's group/ungroup buttons to merge selected
              // text elements into a fabric.js group (and back), adds copy/paste
              // for grouped elements and images (Ctrl+C/V and toolbar buttons),
              // z-ordering helpers to keep pasted elements above the base/below
              // any overlay, a lightweight toast notification (showToast, defined
              // below), and syncing the layers panel to show merged groups as a
              // single row (updateFPDLayersToSingleGroup, defined below).
              // Runs through the .fpd-ungroup1 handler further down.
              // ===================================================================
              G(this.navElem.querySelector('.fpd-ungroup'), 'click', e => {
                let groupCounter = 1;
  ;

  const fabricCanvas = this.fpdInstance.currentViewInstance?.fabricCanvas;
  if (!fabricCanvas) return;

  const activeObject = fabricCanvas.getActiveObject();

  // --- VALIDATION ---
  if (!activeObject || activeObject.type !== 'activeSelection') {
    showToast('Please select multiple text elements (Shift + Click).', 5000);
    // alert('Please select multiple text elements (Shift + Click).');
    return;
  }

  // ✅ SAVE VISUAL CENTER (MOST IMPORTANT FIX)
  const centerPoint = activeObject.getCenterPoint();

  // --- SAVE TEXT PROPERTIES BEFORE GROUP ---
  const savedPropsArray = [];

  activeObject._objects.forEach(obj => {
    savedPropsArray.push({
      text: obj.text,
      left: obj.left,
      top: obj.top,
      font: obj.fontFamily,
      textSize: obj.fontSize,
      colors: obj.fill,
      curvable: obj.curvable ?? 1,
      curved: obj.curved ?? false,
      curveSpacing: obj.curveSpacing ?? 0,
      curveRadius: obj.curveRadius ?? 0,
      curveReverse: obj.curveReverse ?? false,
      textAlign: obj.textAlign,
      originX: obj.originX,
      originY: obj.originY,
      fontWeight: obj.fontWeight || 'normal',
      underline: obj.underline || false,
      textTransform: obj.textTransform || 'none'
    });
  });

  localStorage.setItem('propstext', JSON.stringify(savedPropsArray));

  // --- GROUP OBJECTS ---
  const group = activeObject.toGroup();
  fabricCanvas.setActiveObject(group);

  // --- GROUP CONFIG (NO AUTO CENTER, NO CLIPPING) ---
  const groupTitle = `Group Text ${groupCounter++}`;
  const groupId = 'group_' + Date.now();

  group.set({
    title: groupTitle,
    id: groupId,
    autoSelect: true,
    selectable: true,
    hasControls: true,
    removable: true,
    resizable: true,
    draggable: true,
    rotatable: true,
    zChangeable: true,
    locked: false,
    originX: 'center',
    originY: 'center',
    autoCenter: false,   // ❌ IMPORTANT: prevents jump
    lockUniScaling: true,
    textAlign: 'center',

    // 🚫 disable base clipping
    boundingBox: 'Base',
    boundingBoxMode: 'clipping',
    clipPath: null,
    objectCaching: false
  });

  // ✅ RESTORE EXACT POSITION
  group.setPositionByOrigin(centerPoint, 'center', 'center');

  // --- DISABLE CLIPPING ON CHILD OBJECTS ---
  group._objects.forEach(obj => {
    obj.evented = false;
    obj.clipPath = null;
    obj.boundingBox = null;
    obj.boundingBoxMode = 'none';
    obj.objectCaching = false;
  });

  ;
  group.setCoords();
  updateFPDLayersToSingleGroup(group);
  fabricCanvas.requestRenderAll();

  // --- UI TOGGLE ---
  document.querySelector('.fpd-ungroup1')?.classList.remove('fpd-hidden');
  document.querySelector('.fpd-ungroup')?.classList.add('fpd-hidden');
  document.querySelector('.fpd-group-copy-by')?.classList.remove('fpd-hidden');
  document.querySelector('.fpd-group-paste-by')?.classList.remove('fpd-hidden');
  document.querySelector('.fpd-tool-text-format')?.classList.add('fpd-hidden');
  document.querySelector('.fpd-tool-curved-text')?.classList.add('fpd-hidden');
  const toolbarEl = document.querySelector('fpd-element-toolbar');
    if (toolbarEl) {
      toolbarEl.setAttribute('data-fabric-type', 'group');
      toolbarEl.setAttribute('data-element-type', 'image');
    }


  const toolbar = document.querySelector('fpd-element-toolbar');
  if (toolbar) {
    toolbar.classList.remove('fpd-show');
    toolbar.querySelectorAll('[data-fabric-type="image"]').forEach(el => {
      el.setAttribute('data-fabric-type', 'group');
    });
  }
  fabricCanvas.discardActiveObject();

  ;
});

let toastElement = null;
let toastTimeout = null;

function showToast(message, duration = 3000) {

    const container = document.getElementById('toast-container');

    // If toast does not exist → create it
    if (!toastElement) {
        toastElement = document.createElement('div');
        toastElement.style.background = 'rgba(0,0,0,0.85)';
        toastElement.style.color = '#fff';
        toastElement.style.padding = '10px 20px';
        toastElement.style.borderRadius = '6px';
        toastElement.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        toastElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toastElement.style.transform = 'translateY(-20px)';
        toastElement.style.opacity = '0';
        container.appendChild(toastElement);
    }

    // Update message
    toastElement.innerText = message;

    // Show toast
    toastElement.style.opacity = '1';
    toastElement.style.transform = 'translateY(0)';

    // Clear previous timeout if exists
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Set new timeout
    toastTimeout = setTimeout(() => {
        toastElement.style.opacity = '0';
        toastElement.style.transform = 'translateY(-20px)';
    }, duration);
}



function updateFPDLayersToSingleGroup(group) {
  ;
  const layersList = document.querySelector(
    'fpd-module-manage-layers .fpd-list'
  );
  if (!layersList) return;

  const groupTitle = group.title || 'Grouped Text';
  ;
  /* ============================
     REMOVE CHILD TEXT LAYERS
  ============================ */
  layersList.querySelectorAll('.fpd-list-row').forEach(row => {
    ;
    const label =
      row.querySelector('.fpd-cell-1 textarea')?.value?.trim() ||
      row.querySelector('.fpd-cell-1')?.innerText?.trim() ||
      '';
    ;
    // hide text layers that belong to the group
    if (
      label &&
      group._objects.some(obj => label.includes(obj.title || obj.text))
    ) {
      row.remove();
    }
  });
  ;
  /* ============================
     CHECK IF GROUP LAYER EXISTS
  ============================ */
  let groupRow = layersList.querySelector(
    `.fpd-list-row[data-group-id="${groupTitle}"]`
  );

  /* ============================
     CREATE GROUP LAYER ROW
  ============================ */
  if (!groupRow) {
    groupRow = document.createElement('div');
    groupRow.className = 'fpd-list-row fpd-group-layer';
    groupRow.dataset.groupId = groupTitle;

    groupRow.innerHTML = `
      <div class="fpd-cell-0"><span></span></div>
      <div class="fpd-cell-1">${groupTitle}</div>
      <div class="fpd-cell-2">
        <span class="fpd-lock-element">
          <span class="fpd-icon-unlocked"></span>
        </span>
        <span class="fpd-visible-element">
          <span class="fa-solid fa-eye"></span>
        </span>
        <span class="fpd-remove-element" style="cursor:pointer;">
          <span class="fa-solid fa-trash"></span>
        </span>
      </div>
    `;

    // insert at top
    layersList.insertBefore(groupRow, layersList.firstChild);
  }

  /* ============================
     BIND CONTROLS TO GROUP
  ============================ */
  const canvas =
    this?.fpdInstance?.currentViewInstance?.fabricCanvas ||
  window?.fpdInstance?.currentViewInstance?.fabricCanvas;

    ;
  // t.currentViewInstance.fabricCanvas.removeElement(t.currentElement)

  const removeBtn = groupRow.querySelector('.fpd-remove-element');
  const lockBtn = groupRow.querySelector('.fpd-lock-element');
  const visibleBtn = groupRow.querySelector('.fpd-visible-element');

  if (removeBtn) {
    removeBtn.onclick = () => {
      ;
      ;
      t.currentViewInstance.fabricCanvas.removeElement(group);
      groupRow.remove();
    };
  }

  if (lockBtn) {
    lockBtn.onclick = () => {
      group.selectable = !group.selectable;
      lockBtn.innerHTML = group.selectable
        ? `<span class="fpd-icon-unlocked"></span>`
        : `<span class="fpd-icon-locked"></span>`;
      canvas.requestRenderAll();
    };
  }

  if (visibleBtn) {
    visibleBtn.onclick = () => {
      const view = t.currentViewInstance;
      ;
  if (!view || !group) return;

  // 🔑 Get FPD element attached to fabric object
  const element = group.fpdElement || group._objects;

  if (!element) {
    console.warn('FPD element not found on group');
    return;
  }

  // ✅ Toggle visibility on FPD element
  element.visible = !element.visible;

  ;
  // ✅ Sync visibility to fabric object
  group.set('visible', element.visible);

  // ✅ Force FPD + Fabric refresh
  view.fabricCanvas.requestRenderAll();
  view.updateLayers?.(); // safe optional call
   ;
  // ✅ Update UI icon
  visibleBtn.innerHTML = element.visible
    ? `<span class="fa-solid fa-eye"></span>`
    : `<span class="fa-solid fa-eye-slash"></span>`;
    };
      ;
  }
}




              let copiedImage = null;
              G(this.navElem.querySelector('.fpd-group-copy-by'), 'click', e => {
                const fabricCanvas = this.fpdInstance.currentViewInstance?.fabricCanvas;
                if (!fabricCanvas) return;

                const activeObj = fabricCanvas.getActiveObject();
                ;

                if (activeObj.type === 'image') {
                    ;
                    
                    // 🔒 Backup filters
                    const originalFilters = activeObj.filters;

                    // ✅ Force filters to be array
                    activeObj.filters = Array.isArray(activeObj.filters)
                      ? activeObj.filters
                      : [];

                    activeObj.clone(cloned => {
                      copiedImage = cloned;
                      copiedGroup = null;
                      copiedImage.__originalTransform = {
                        title: activeObj.title,
                        id: activeObj.id,
                        left: activeObj.left,
                        top: activeObj.top,
                        scaleX: activeObj.scaleX,
                        scaleY: activeObj.scaleY,
                        angle: activeObj.angle,
                        originX: activeObj.originX,
                        originY: activeObj.originY,
                        flipX: activeObj.flipX,
                        flipY: activeObj.flipY,
                        width: activeObj.width,
                        height: activeObj.height
                      };
                      ;
                      t.showToast?.('Image copied');

                      // 🔁 Restore original filters
                      activeObj.filters = originalFilters;
                    });
                }
                else if (!activeObj || activeObj.type !== 'group') {
                  // alert('Please select a grouped element to copy.');
                  showToast('Please select a grouped element to copy.', 5000);
                  return;
                }
                else if (activeObj.type === 'group'){

                  activeObj.clone(cloned => {
                    copiedGroup = cloned;
                    copiedImage = null;
                    ;
                  });
                }
              });

              function keepBelowOverlay(canvas, obj) {
                const overlay = canvas.getObjects().find(o =>
                  o.title === 'Overlay' || o.boundingBox === 'Base'
                );

                if (overlay) {
                  const overlayIndex = canvas.getObjects().indexOf(overlay);
                  canvas.moveTo(obj, overlayIndex - 1);
                }
              }

              function placeAboveBase(canvas, obj) {
                const objects = canvas.getObjects();
                const baseIndex = objects.findIndex(o => o.title === 'Base');
                ;
                if (baseIndex !== -1) {
                  canvas.moveTo(obj, baseIndex + 1);
                }
              }

              function getTopEditableZ(canvas) {
                let maxZ = 0;

                canvas.getObjects().forEach(o => {
                  if (o.boundingBox === 'Base') return;      // ignore base
                  if (o.zChangeable !== 1) return;           // ignore locked layers
                  maxZ = Math.max(maxZ, o.z || 0);
                });

                return maxZ + 1;
              }



              G(this.navElem.querySelector('.fpd-group-paste-by'), 'click', e => {
                const fabricCanvas = this.fpdInstance.currentViewInstance?.fabricCanvas;
                ;
                if (!fabricCanvas) return;

                // ❌ Nothing copied
                if (!copiedGroup && !copiedImage) {
                  this.showToast('Nothing to paste. Copy a group or image first.', 'error');
                  return;
                }
                /* =========================
                  🖼 IMAGE PASTE (SAFE)
                ========================== */
                if (copiedImage) {
                  ;
                  const viewInstancesss = this.fpdInstance.currentViewInstance;
                  const fabricCanvas = this.fpdInstance.currentViewInstance.fabricCanvas;
                  const zoom = fabricCanvas.getZoom();

                  const tData = copiedImage.__originalTransform || {};
                  ;

                  // Prevent Fabric filter crash
                  copiedImage.filters = Array.isArray(copiedImage.filters)
                    ? copiedImage.filters
                    : [];

                  copiedImage.clone(clonedObj => {
                    ;
                    clonedObj.set({
                      scaleX: tData.scaleX || 1,
                      scaleY: tData.scaleY || 1,

                      angle: tData.angle ?? 0,
                      flipX: tData.flipX ?? false,
                      flipY: tData.flipY ?? false,
                      width: tData.width,
                      height: tData.height,
                      copyable: 1,
                      originX: tData.originX || 'center',
                      originY: tData.originY || 'center',

                      lockUniScaling: true,
                      uniformScaling: true,

                      selectable: true,
                      evented: true,
                      hasControls: true,
                      draggable: true,
                      resizable: true,
                      removable: true,
                      rotatable: true,
                      locked: false,
                      zChangeable: 1,
                      boundingBox: 'Base',
                      clipPath: null,
                      objectCaching: false,
                    });
                    // clonedObj = fabricCanvas._activeObject;
                    
                    // Add FIRST
                    fabricCanvas.add(clonedObj);
                    const topZ = getTopEditableZ(fabricCanvas);


                    // Restore exact position
                    clonedObj.set({
                      z: topZ,
                      title: tData.title + ' Copy',
                      id: tData.id + 'Copy',
                      scaleX: tData.scaleX || 1,
                      scaleY: tData.scaleY || 1,
                      isCustom: true,
                      crossOrigin: 'anonymous'
                    })

                    fabricCanvas.moveTo(clonedObj, fabricCanvas.getObjects().length - 1);
                    ;
                    clonedObj.setPositionByOrigin(
                      { x: tData.left, y: tData.top },
                      clonedObj.originX,
                      clonedObj.originY
                    );

                    clonedObj.setCoords();

                    placeAboveBase(fabricCanvas, clonedObj);
                    keepBelowOverlay(fabricCanvas, clonedObj);
                    
                    fabricCanvas.fire('elementAdd', { element: clonedObj });
                    // fabricCanvas._objects.push(clonedObj);
                    fabricCanvas.setActiveObject(clonedObj);
                    // fabricCanvas.requestRenderAll();
                    
                    fabricCanvas.requestRenderAll();

                    ;

                    // this.showToast?.('Image pasted successfully 🖼️');
                  });
                }


                /* =========================
                  🔹 GROUP PASTE
                ========================== */
                else if (copiedGroup) {
                  ;
                  copiedGroup.clone(clonedObj => {

                    clonedObj.set({
                      left: (copiedGroup.left || 0) + 20,
                      top: (copiedGroup.top || 0) + 20,
                      selectable: true,
                      evented: true,
                      hasControls: true,
                      resizable: true,
                      draggable: true,
                      removable: true,
                      positioned: true,
                      originX: copiedGroup.originX || 'center',
                      originY: copiedGroup.originY || 'center',
                      rotatable: true,
                      lockUniScaling: true,

                      // 🔒 base + no clipping
                      boundingBox: 'Base',
                      clipPath: null,
                      objectCaching: false
                    });

                    // Preserve child behavior
                    if (clonedObj.type === 'group' && Array.isArray(clonedObj._objects)) {
                      clonedObj._objects.forEach(child => {
                        child.set({
                          selectable: false,
                          evented: false,
                          clipPath: null,
                          objectCaching: false
                        });
                      });
                    }

                    fabricCanvas.add(clonedObj);
                    keepBelowOverlay(fabricCanvas, clonedObj);
                    fabricCanvas.setActiveObject(clonedObj);
                    fabricCanvas.requestRenderAll();

                    this.showToast('Group pasted successfully 🎉');
                  });

                  return;
                }

                
              });






          G(this.navElem.querySelector('.fpd-ungroup1'), 'click', e => {
            ;
            const canvas = t.currentViewInstance.fabricCanvas;

            let canvastitle = canvas.getActiveObject()?.title || '';
            canvastitle = canvastitle.toString().replace(/\s+/g, "_");
            ;

            const initialZoom = canvas.getZoom();
            const activeObj = canvas.getActiveObject();

            if (!activeObj || activeObj.type !== 'group') return;

            // Restore original objects
            activeObj._restoreObjectsState();
            canvas.remove(activeObj);

            // Load group-level transforms from localStorage
            const groupTransforms = JSON.parse(localStorage.getItem("groupTransforms") || "{}");
            const savedGroupTransform = groupTransforms[canvastitle] || null;
            ;

            // Load saved props array for text objects
            const savedPropsArray = JSON.parse(localStorage.getItem('propstext') || '[]');
            if (!Array.isArray(savedPropsArray) || savedPropsArray.length === 0) {
              console.warn('No saved props found.');
              return;
            }

            // Loop through each object in group
            // Track last placed object's top + font size
            let lastTop = null;
            let lastFontSize = null;

            activeObj._objects.forEach((obj, index) => {
              ;
              const props = savedPropsArray[index];
              if (!props) return;

              const objectText = obj.text?.trim() || '';
              const savedTitle = props.title?.trim() || '';

              // Match by title if available
              if (savedTitle && objectText !== savedTitle) {
                console.warn(
                  `Skipping restore at index ${index} due to title mismatch: "${objectText}" !== "${savedTitle}"`
                );
                return;
              }

              // ✅ Apply group transform if available, otherwise fallback
              let scaleX, scaleY, flipX, flipY, left, top;

              if (savedGroupTransform) {
                ;
                // let topvalueforgroup = window.localStorage.getItem('topvalueforgroup')
                left = savedGroupTransform.left ?? 500;
                top =  savedGroupTransform.top ?? 500;
                scaleX = savedGroupTransform.scaleX ??  1;
                scaleY = savedGroupTransform.scaleY ??  1;
                flipX  = savedGroupTransform.flipX ?? obj.flipX ?? props.flipX ?? false;
                flipY  = savedGroupTransform.flipY ?? obj.flipY ?? props.flipY ?? false;
              } else {
                ;
                top = obj.top || 500;
                left = obj.left || 500;
                scaleX = obj.scaleX  || 1;
                scaleY = obj.scaleY || 1;
                flipX  = obj.flipX || props.flipX || false;
                flipY  = obj.flipY || props.flipY || false;
                ;
              }
              ;
              // 👉 If not the first object, adjust top relative to previous object
              if (index > 0 && lastTop !== null && lastFontSize !== null) {
                top = lastTop + lastFontSize; // place it below previous
              }

              const fontSize = props.textSize || obj.fontSize || 120;
              const elementType = props.curved ? 'curvedText' : 'text';
              ;
              const restoredText = t.currentViewInstance.fabricCanvas.addElement(
                elementType,
                savedTitle || objectText, // title
                objectText,               // actual text
                {
                  ...props,

                  originX: 'center',
                  originY: 'center',
                  textAlign: 'center',

                  fill: props.colors || obj.fill || '#252525',
                  fontFamily: props.font || obj.fontFamily || 'Arial',
                  fontSize,
                  fontWeight: props.fontWeight || obj.fontWeight || 'bold',
                  underline: props.underline ?? obj.underline ?? false,
                  textTransform: props.textTransform || obj.textTransform || 'capitalize',

                  editable: true,
                  selectable: true,
                  hasControls: true,
                  evented: true,
                  removable: true,

                  scaleX,
                  scaleY,
                  flipX,
                  flipY,
                  top,
                  left,

                  curvable: 1,
                  curved: props.curved || false,
                  curveSpacing: props.curveSpacing || 0,
                  curveRadius: props.curveRadius || 0,
                  curveReverse: props.curveReverse || false,

                  draggable: 1,
                  rotatable: 1,
                  resizable: 1,
                  autoSelect: 1,
                  autoCenter: 0,
                  opacity: 1,
                  angle: obj.angle || 0,
                  locked: 0,
                  z: 1,
                  boundingBox: 'Base'
                }
              );

              // Save for next loop
              lastTop = top;
              lastFontSize = fontSize;
            });


            canvas.discardActiveObject();
            canvas.requestRenderAll();

            // Trigger FPD UI update
            if (typeof t.deselectElement === 'function') {
              t.deselectElement();
            }

            ;
            document.querySelector('.fpd-ungroup1')?.classList.add('fpd-hidden');
            document.querySelector('.fpd-ungroup')?.classList.remove('fpd-hidden');
            document.querySelector('.fpd-group-copy-by')?.classList.add('fpd-hidden');
            document.querySelector('.fpd-group-paste-by')?.classList.add('fpd-hidden');
          });
          // ===== END CUSTOM (StyleFlip: group/ungroup, copy/paste, toast) ===


          G(this.navElem.querySelector('.fpd-tool-duplicate'), 'click', e => {
            t.currentViewInstance.fabricCanvas.duplicateElement(
              t.currentElement
            )
          }),
            G(this.navElem.querySelector('.fpd-tool-remove'), 'click', e => {
              ;
               localStorage.setItem('fpd-upload-image-going-to', false);
              //document.querySelector('.fpd-ungroup1')?.classList.add('fpd-hidden');
              //document.querySelector('.fpd-ungroup')?.classList.remove('fpd-hidden');
              //document.querySelector('.fpd-group-copy-by')?.classList.add('fpd-hidden');
              //document.querySelector('.fpd-group-paste-by')?.classList.add('fpd-hidden');
              t.currentViewInstance.fabricCanvas.removeElement(t.currentElement)
            }),
            G(
              this.subPanel.querySelector(
                '.fpd-panel-color .fpd-remove-shadow'
              ),
              'click',
              e => {
                t.currentViewInstance.fabricCanvas.setElementOptions({
                  shadowColor: null
                })
              }
            ),
            G(this.navElem.querySelector('.fpd-tool-remove-bg'), 'click', e => {
              ;
              ;
              let i = t.currentElement
              t.deselectElement(),
                t.toggleSpinner(
                  !0,
                  t.translator.getTranslation('misc', 'loading_image')
                ),
                Ut({
                  url: t.mainOptions.aiService.serverURL,
                  body: { service: 'removeBG', image: i.source },
                  onSuccess: e => {
                    e && e.new_image
                      ? i.setSrc(
                          e.new_image,
                          () => {
                            ;(i.source = e.new_image),
                              i.canvas.renderAll(),
                              n(
                                t.translator.getTranslation(
                                  'misc',
                                  'ai_remove_bg_success'
                                )
                              )
                          },
                          { crossOrigin: 'anonymous' }
                        )
                      : t.aiRequestError(e.error),
                      t.toggleSpinner(!1)
                  },
                  onError: t.aiRequestError.bind(t)
                })
            }),
            G(
              this.navElem.querySelectorAll('[class^=fpd-tool-]'),
              'click',
              t => {
                const e = t.currentTarget
                ;
                if (e.classList.contains('fpd-tool-transform')) {
                  document.body.classList.add('fpd-toolbar-transform-our');
                  if (e.classList.contains('fpd-active')) {
                      document.body.classList.remove('fpd-toolbar-transform-our');
                      e.classList.remove('fpd-active');
                      const subPanel = document.querySelector('.fpd-sub-panel');
                      if (!subPanel) return;
                      // Step 2: Remove 'fpd-active' from any active children in sub-panel
                      subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
                        el.classList.remove('fpd-active');
                      });
                      
                      const elementtoolbar = document.querySelector('fpd-element-toolbar');
                      if(elementtoolbar){
                        elementtoolbar.classList.remove('fpd-panel-visible')
                      }

                  return;
                  }
                }

                if (e.classList.contains('fpd-tool-font-family') ) {
                  ;
                  if(e.classList.contains('fpd-active')){
                    ;
                    document.querySelector('.fpd-tool-font-family')?.classList.remove('fpd-active');
                    document.querySelector('.fpd-panel-font-family')?.classList.remove('fpd-active');
                    document.querySelector('fpd-element-toolbar').classList.remove('my-font-family', 'fpd-panel-visible');
                    return 0
                  }
                  else{

                    if (document.body.classList.contains('fpd-toolbar-transform-our')) {
                          document.body.classList.remove('fpd-toolbar-transform-our');
                      }
                    document.body.classList.add('fpd-font-family-active');
                  }
                }
                else if(e.classList.contains('fpd-tool-color')){
                  document.body.classList.add('fpd-font-family-active');
                  if (document.body.classList.contains('fpd-toolbar-transform-our')) {
                        document.body.classList.remove('fpd-toolbar-transform-our');
                  }
                  if(e.classList.contains('fpd-active')){
                    ;
                    document.querySelector('.fpd-tool-color')?.classList.remove('fpd-active');
                    document.querySelector('.fpd-panel-color')?.classList.remove('fpd-active');
                    document.querySelector('fpd-element-toolbar').classList.remove('my-color', 'fpd-panel-visible');
                    return 0
                  }
                }
                else if(e.classList.contains('fpd-tool-text-size-customize')){
                  ;
                  if (document.body.classList.contains('fpd-toolbar-transform-our')) {
                        document.body.classList.remove('fpd-toolbar-transform-our');
                    }
                  document.body.classList.add('fpd-tools-custom-data')
                  const panel = document.getElementById('panel-text-size-data');
                  ;
                  if (panel?.classList.contains('fpd-letter-spacing-lineheight')) {
                    panel.classList.remove('fpd-letter-spacing-lineheight');
                  }
                  if(e.classList.contains('fpd-active')){
                     ;
                    document.querySelector('.fpd-tool-text-size-customize')?.classList.remove('fpd-active');
                    document.querySelector('#panel-text-size-data')?.classList.remove('fpd-active');
                    document.querySelector('fpd-element-toolbar').classList.remove('my-text-size', 'fpd-panel-visible');
                    return 0
                  }
                }
                else{ 
                    ;
                    setTimeout(() => {

                      if (document.body.classList.contains('fpd-toolbar-transform-our') && !document.querySelector('.fpd-tool-transform')?.classList.contains('fpd-active')) {
                          ;
                          document.body.classList.remove('fpd-toolbar-transform-our');
                          ;
                      }
                    },1000)
                    document.body.classList.remove('fpd-font-family-active');
                    document.body.classList.remove('fpd-tools-custom-data')
                  }
                // if(e.)
                if (e.dataset.panel) {
                  Z(this.navElem.querySelectorAll('[class^=fpd-tool-]'), [
                    'fpd-active'
                  ]),
                    X(e, ['fpd-active'])
                  const t = Array.from(this.subPanel.children),
                    i = t.filter(t =>
                      t.classList.contains('fpd-panel-' + e.dataset.panel)
                    )
                  Z(t, ['fpd-active']),
                    X(i, ['fpd-active']),
                    'smart' == this.currentPlacement &&
                      (X(this.container, ['fpd-panel-visible']),
                      Kr(this, ua, ka).call(this))
                }
              }
            ),
            G(this.container.querySelector('.fpd-close'), 'click', e => {
              this.toggle(!1), t.deselectElement()
            }),
            G(
              this.container.querySelector('.fpd-close-sub-panel'),
              'click',
              t => {
                Z(Array.from(this.subPanel.children), ['fpd-active']),
                  Z(this.container, ['fpd-panel-visible'])
              }
            )
        }
        toggle () {
          let t =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]
          J(this.container, ['fpd-show'], t),
            J(document.body, ['fpd-toolbar-visible'], t)
        }
      }
      function va (t) {
        if (
          t.hasOwnProperty('fontFamily') &&
          (Kr(this, ea, ba).call(this, !1, !1),
          Array.isArray(this.fpdInstance.mainOptions.fonts) &&
            this.fpdInstance.mainOptions.fonts.length)
        ) {
          const e = this.fpdInstance.mainOptions.fonts.find(
            e => e.name == t.fontFamily
          )
          e?.url && e.url.toLowerCase().includes('.ttf')
            ? e.variants
              ? Kr(this, ea, ba).call(
                  this,
                  Boolean(e.variants.n7),
                  Boolean(e.variants.i4)
                )
              : Kr(this, ea, ba).call(this, !1, !1)
            : 'google' === e?.url &&
              e.variants &&
              Kr(this, ea, ba).call(
                this,
                Boolean(e.variants.includes('bold')),
                Boolean(e.variants.includes('italic'))
              )
        }
      }
      function ba () {
        let t =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],
          e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
        J(
          this.subPanel.querySelector('.fpd-tool-text-bold'),
          ['fpd-disabled'],
          !t
        ),
          J(
            this.subPanel.querySelector('.fpd-tool-text-italic'),
            ['fpd-disabled'],
            !e
          )
      }
      function ya (t) {
        ;
        let e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
        const i = this.navElem.querySelectorAll('.fpd-tools-nav .fpd-tool-' + t)
        return J(i, ['fpd-hidden'], !Boolean(e)), i
      }
      function xa (t, e, i) {
        i = Boolean(i)
        const n = this.subPanel.querySelector('.fpd-panel-' + t)
        return J(n.querySelectorAll('.fpd-tool-' + e), ['fpd-hidden'], !i), t
      }
      function wa (t, e, i) {
        const n = this.subPanel.querySelector('.fpd-panel-' + t)
        J(
          n.querySelectorAll('.fpd-panel-tabs [data-tab="' + e + '"]'),
          ['fpd-hidden'],
          !i
        )
      }
      function Ca (t, e) {
        'png' !== t.isColorizable() && t.changeColor(e)
      }
      function Sa (t, e) {
        ;(this.navElem.querySelector('.fpd-current-fill').style.background = e),
          this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
            { fill: e },
            t
          )
      }
      function Ta (t, e, i) {
        const n = t.changeObjectColor(e, i)
        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
          { fill: n },
          t
        )
      }
      function Ea (t) {
        ;(this.subPanel.querySelector(
          '.fpd-tool-uniscaling-locker > span'
        ).className = t ? 'fpd-icon-locked' : 'fpd-icon-unlocked'),
          J(
            this.subPanel.querySelector('.fpd-tool-scaleY'),
            ['fpd-disabled'],
            t
          )
      }
      function Aa () {
        let t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        const e = this.subPanel.querySelector('.fpd-curved-options')
        Z(e.querySelectorAll('[data-value]'), ['fpd-active']),
          t.curved
            ? t.curveReverse
              ? X(e.querySelectorAll('[data-value="curveReverse"]'), [
                  'fpd-active'
                ])
              : X(e.querySelectorAll('[data-value="curved"]'), ['fpd-active'])
            : X(e.querySelectorAll('[data-value="normal"]'), ['fpd-active']),
          J(
            this.subPanel.querySelector('.fpd-tool-curved-text-radius'),
            ['fpd-hidden'],
            !t.curved
          )
      }
      function Ia (t) {
        return t && !t._ignore && !t.uploadZone
      }
      function Oa (t) {
        let e
        try {
        if (
          (Kr(this, ga, _a).call(this),
          Z(this.container, ['fpd-type-image']),
          t.hasColorSelection())
        ) {
          let i = rt(t, this.fpdInstance)
          if ('group' === t.type && t.getObjects().length > 1) {
            const n = Array.isArray(t.colors) && t.colors.length > 1
            e = Ln({
              colors: i,
              colorNames: this.fpdInstance.mainOptions.hexNames,
              palette: t.colors,
              subPalette: n,
              enablePicker: !!this.fpdInstance.mainOptions.editorMode || !n,
              onChange: (e, i) => {
                Kr(this, oa, Ta).call(this, t, i, e)
              },
              onMove: (e, i) => {
                t.changeObjectColor(i, e)
              }
            })
          } else
            e = Bn(this.fpdInstance, {
              initialColor: t.fill,
              colors: i,
              patterns:
                Array.isArray(t.patterns) &&
                (t.isSVG() || 'text' === t.getType())
                  ? t.patterns
                  : null,
              onMove: e => {
                Kr(this, ra, Ca).call(this, t, e)
              },
              onChange: e => {
                Kr(this, aa, Sa).call(this, t, e)
              },
              onPatternChange: e => {
                ;(this.navElem.querySelector(
                  '.fpd-current-fill'
                ).style.background = `url("${e}")`),
                  this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                    { pattern: e },
                    t
                  )
              }
            })
          e && Jr(this, $r).append(e)
          const n = this.subPanel.querySelector('.fpd-stroke-color-wrapper')
          n.innerHTML = ''
          const s = Bn(this.fpdInstance, {
            colors:
              Array.isArray(t.strokeColors) && t.strokeColors.length > 0
                ? t.strokeColors
                : [t.stroke ? t.stroke : '#000'],
            onMove: e => {
              this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                { stroke: e },
                t
              )
            },
            onChange: e => {
              this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                { stroke: e },
                t
              )
            }
          })
          n.append(s)
          const r = this.subPanel.querySelector('.fpd-shadow-color-wrapper')
          r.innerHTML = ''
          const a = _n({
            initialColor: o(t.shadowColor).isValid()
              ? t.shadowColor
              : '#000000',
            colorNames: this.fpdInstance.mainOptions.hexNames,
            palette: this.fpdInstance.mainOptions.colorPickerPalette,
            onMove: e => {
              this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                { shadowColor: e },
                t
              )
            },
            onChange: e => {
              this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                { shadowColor: e },
                t
              )
            }
          })
          r.append(a);
            ;
            if(t.source){
              ;
              document.querySelector('body').classList.add('notgroup')
              if (t.source.toLowerCase().endsWith('.svg')) {
                  document.querySelector('body').classList.add('is-svg');
              }
              else{
                  document.querySelector('body').classList.remove('is-svg');
              }
            }
            else{
              document.querySelector('body').classList.remove('notgroup')
            }
            ;
            Kr(this, ia, ya).call(this, 'color'),
            Kr(this, sa, wa).call(this, 'color', 'fill', !0),
            Kr(this, sa, wa).call(
              this,
              'color',
              'stroke',
              'text' === t.getType()
            ),
            Kr(this, sa, wa).call(this, 'color', 'shadow', !0)
        }
        !e &&
          (t.isSVG() || 'text' === t.getType()) &&
          t.patterns &&
          t.patterns.length &&
          ((e = Bn(this.fpdInstance, {
            colors: [],
            patterns: t.patterns,
            onPatternChange: e => {
              ;(this.navElem.querySelector(
                '.fpd-current-fill'
              ).style.background = `url("${e}")`),
                this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                  { pattern: e },
                  t
                )
            }
          })),
          Jr(this, $r).append(e),
          Kr(this, ia, ya).call(this, 'color'),
          Kr(this, sa, wa).call(this, 'color', 'fill', !0))
        let i = Boolean(
          (t.resizable && 'image' === t.getType()) ||
            t.uniScalingUnlockable ||
            t.__editorMode
        )
        ;(i || t.rotatable) &&
        console.log("eeee1112",e),
          (Kr(this, ia, ya).call(this, 'transform'),
          Kr(this, na, xa).call(this, 'transform', 'scale', i),
          Kr(this, la, Ea).call(this, t.lockUniScaling),
          Kr(this, na, xa).call(
            this,
            'transform',
            'uniscaling-locker',
            Boolean(t.uniScalingUnlockable || t.__editorMode)
          ),
          Kr(this, na, xa).call(
            this,
            'transform',
            'angle',
            Boolean(t.rotatable || t.__editorMode)
          ),
          Kr(this, na, xa).call(
            this,
            'transform',
            'flip',
            Boolean(i || t.__editorMode)
          ));
          if(t.source == undefined){
              ;
              document.querySelector('body').classList.remove('notgroup')
            }
            else{
              ;
              document.querySelector('body').classList.add('notgroup')
            }
          (t.draggable || t.zChangeable || t.__editorMode) &&
          
            (Kr(this, ia, ya).call(this, 'position'),
            Kr(this, sa, wa).call(
              this,
              'position',
              'arrange',
              true
            ),
            Kr(this, sa, wa).call(
              this,
              'position',
              'align',
              true
            )),
          'text' === t.getType() && (t.editable || t.__editorMode)
            ? (Kr(this, ia, ya).call(this, 'edit-text'),
              Kr(this, ia, ya).call(
                this,
                'text-size',
                Boolean(t.resizable || t.__editorMode) && !t.widthFontSize
              ),
              Kr(this, ia, ya).call(this, 'font-family'),
              Kr(this, ia, ya).call(this, 'text-format'),
              t.curvable &&
                (Kr(this, ia, ya).call(this, 'curved-text'),
                Kr(this, ca, Aa).call(this, t),
                this.subPanel
                  .querySelector('fpd-range-slider[data-control="curveRadius"]')
                  .setAttribute('max', t.maxCurveRadius)),
              (this.subPanel.querySelector(
                'textarea[data-control="text"]'
              ).value = t.text),
              Kr(this, ia, ya).call(
                this,
                'edit-text',
                !t.textPlaceholder && !t.numberPlaceholder
              ))
            : 'text' !== t.getType() && X(this.container, ['fpd-type-image']),
          // Comma after console.log previously discarded the condition and
          // always enabled advanced-editing (filters/crop) for every type.
          t.advancedEditing &&
            t.source &&
            st(t.source) &&
            (Kr(this, ia, ya).call(this, 'advanced-editing'),
            Kr(this, sa, wa).call(this, 'advanced-editing', 'filters', !0),
            Kr(this, sa, wa).call(
              this,
              'advanced-editing',
              'crop',
              Boolean(
                Array.isArray(this.fpdInstance.mainOptions.cropMasks) &&
                  this.fpdInstance.mainOptions.cropMasks.length
              )
            ),
            Kr(this, ia, ya).call(
              this,
              'remove-bg',
              Boolean(
                this.fpdInstance.mainOptions.aiService.serverURL &&
                  this.fpdInstance.mainOptions.aiService.removeBG
              )
            )),
          Kr(this, na, xa).call(
            this,
            'text-size',
            'text-line-spacing',
            !t.curved
          ),
          Kr(this, ia, ya).call(this, 'reset'),
          Kr(this, ia, ya).call(
            this,
            'duplicate',
            t.copyable || t.__editorMode
          ),
          // code comment by anoop and added the static value
          //Kr(this, ia, ya).call(this, 'remove', t.removable || t.__editorMode),
          Kr(this, ia, ya).call(this, 'remove', 'true'),
          this.subPanel.querySelectorAll('.fpd-panel-tabs').forEach(t => {
            const e = t.querySelectorAll('[data-tab]:not(.fpd-hidden)')
            J(t, ['fpd-hidden'], e.length <= 1), e.item(0) && e.item(0).click()
          }),
          this.container.querySelectorAll('[data-control]').forEach(e => {
            const i = e.dataset.control
            if (e.classList.contains('fpd-number')) {
              if (void 0 !== t[i]) {
                var n =
                  e.step && e.step.length > 1
                    ? parseFloat(t[i]).toFixed(2)
                    : parseInt(t[i])
                if (
                  ((e.value = n), e.classList.contains('fpd-slider-number'))
                ) {
                  const s = e.previousElementSibling
                  'fontSize' == i
                    ? (s.setAttribute('min', t.minFontSize),
                      s.setAttribute('max', t.maxFontSize))
                    : ('scaleX' != i && 'scaleY' != i) ||
                      s.setAttribute('min', t.minScaleLimit),
                    s.setAttribute('value', n)
                }
              }
            } else if (e.classList.contains('fpd-toggle'))
              J(e, ['fpd-enabled'], t[i] === e.dataset.enabled)
            else if (e.classList.contains('fpd-btn-options')) {
              const n = JSON.parse(e.dataset.options)
              e.querySelector('span').className = n[t[i]]
            } else if (e.classList.contains('fpd-btn-group')) {
              Z(Array.from(e.children), ['fpd-active'])
              const i = e.dataset.control
              X(e.querySelector('[data-option="' + t[i] + '"]'), ['fpd-active'])
            } else
              'fontFamily' == i
                ? ((this.navElem.querySelector(
                    '.fpd-tool-font-family fpd-dropdown > input'
                  ).value = t[i]),
                  void 0 !== t[i] &&
                    (Z(
                      this.subPanel.querySelectorAll(
                        '.fpd-fonts-list .fpd-item'
                      ),
                      ['fpd-active']
                    ),
                    X(
                      this.subPanel.querySelector(
                        '.fpd-fonts-list .fpd-item[data-value="' + t[i] + '"]'
                      ),
                      ['fpd-active']
                    )))
                : 'fontSize' == i &&
                  (this.navElem.querySelector(
                    '.fpd-tool-text-size > input'
                  ).value = t[i])
            const s = at(t)
            s &&
              (this.navElem.querySelector(
                '.fpd-current-fill'
              ).style.background = s)
          }),
          'sidebar' == this.currentPlacement &&
            this.navElem.querySelector('[data-panel]:not(.fpd-hidden)').click(),
          this.toggle(),
          this.container.querySelectorAll('.fpd-scroll-area').forEach(t => {
            t.scrollLeft = t.scrollTop = 0
          }),
          (this.container.dataset.fabricType = t.type),
          (this.container.dataset.elementType = t.getType())
        } catch (err) {
          console.error('[FPD toolbar render error]', err)
        }
        this.subPanel.querySelectorAll('.fpd-panel-tabs').forEach(t => {
          const e = t.querySelectorAll('[data-tab]:not(.fpd-hidden)')
          J(t, ['fpd-hidden'], e.length <= 1)
        })
      }
      function ka () {
        if (
          'smart' === this.currentPlacement &&
          Kr(this, ha, Ia).call(this, this.fpdInstance.currentElement) &&
          !this.fpdInstance.container.classList.contains('fpd-aie-visible') &&
          (this.toggle(Boolean(this.fpdInstance.currentElement)),
          this.fpdInstance.currentElement)
        ) {
          const t = this.fpdInstance.currentElement,
            e = this.fpdInstance.container.getBoundingClientRect(),
            i = t.getBoundingRect(),
            n = i.top + i.height + t.controls.mtr.offsetY + t.cornerSize
          let s = this.fpdInstance.productStage.getBoundingClientRect().top + n
          s > e.height + e.top && (s = e.height + e.top),
            s > window.innerHeight - this.container.clientHeight &&
              (s = window.innerHeight - this.container.clientHeight)
          const r = t.oCoords,
            a = this.container.offsetWidth / 2
          let o =
            this.fpdInstance.currentViewInstance.fabricCanvas.wrapperEl.getBoundingClientRect()
              .left + r.mt.x
          ;(o = o < a ? a : o),
            (o = o > window.innerWidth - a ? window.innerWidth - a : o),
            (this.container.style.top = s + 'px'),
            (this.container.style.left = o + 'px')
        }
      }
      function Ma () {
        const t = this.fpdInstance.container.dataset.layout
        var e, i, n
        ;(this.container.className = 'fpd-layout-' + t),
          this.fpdInstance.container.classList.contains('fpd-sidebar') ||
            (this.fpdInstance.mainOptions.toolbarPlacement = 'smart'),
          'smart' == this.fpdInstance.mainOptions.toolbarPlacement ||
          this.fpdInstance.container.classList.contains('fpd-layout-small')
            ? ('smart' != this.currentPlacement &&
                ('body' == this.fpdInstance.mainOptions.toolbarDynamicContext
                  ? document.body.appendChild(this.container)
                  : document
                      .querySelector(
                        this.fpdInstance.mainOptions.toolbarDynamicContext
                      )
                      .appendChild(this.container)),
              (this.currentPlacement = 'smart'),
              (this.container.className += ' fpd-container fpd-smart'))
            : ('sidebar' != this.currentPlacement &&
                this.fpdInstance.mainBar.container.appendChild(this.container),
              (this.currentPlacement = 'sidebar'),
              (this.container.className += ' fpd-container fpd-sidebar')),
          (this.navElem = this.container.querySelector('.fpd-tools-nav')),
          (this.subPanel = this.container.querySelector('.fpd-sub-panel')),
          (e = this),
          (i = $r),
          (n = this.subPanel.querySelector('.fpd-color-wrapper')),
          (function (t, e, i) {
            if (e.set) e.set.call(t, i)
            else {
              if (!e.writable)
                throw new TypeError('attempted to set read only private field')
              e.value = i
            }
          })(e, Qr(e, i, 'set'), n),
          Z(this.fpdInstance.container, [
            'fpd-toolbar-smart',
            'fpd-toolbar-sidebar'
          ]),
          X(this.fpdInstance.container, [
            'fpd-toolbar-' + this.currentPlacement
          ])
      }
      function Pa (t, e) {
        this.subPanel
          .querySelectorAll('[data-control="' + t + '"]')
          .forEach(t => {
            ;(t.value = e), t.setAttribute('value', e)
          })
      }
      function _a () {
        ;(Jr(this, $r).innerHTML = ''),
          Z(this.container, ['fpd-panel-visible']),
          X(this.navElem.querySelectorAll('[class^=fpd-tool-]'), [
            'fpd-hidden'
          ]),
          Z(this.navElem.querySelectorAll('[class^=fpd-tool-]'), [
            'fpd-active'
          ]),
          Z(Array.from(this.subPanel.children), ['fpd-active']),
          X(this.subPanel.querySelectorAll('.fpd-panel-tabs > span'), [
            'fpd-hidden'
          ]),
          Z(
            this.subPanel.querySelectorAll(
              '.fpd-panel-tabs-content > *, .fpd-panel-tabs > *'
            ),
            ['fpd-active']
          )
      }
      class Da {
        constructor (t) {
          this.fpdInstance = t
        }
        start () {
          if (
            this.fpdInstance.mainOptions.guidedTour &&
            Object.keys(this.fpdInstance.mainOptions.guidedTour).length
          ) {
            const t = Object.keys(this.fpdInstance.mainOptions.guidedTour)[0]
            this.selectStep(t)
          }
        }
        selectStep = t => {
          const e = document.body.querySelector('.fpd-gt-step')
          e && e.remove()
          let i = Object.keys(this.fpdInstance.mainOptions.guidedTour).indexOf(
              t
            ),
            n = t.split(':'),
            s = null
          if (
            ('module' === n[0]
              ? (s = this.fpdInstance.mainBar.container.querySelector(
                  '.fpd-navigation > [data-module="' + n[1] + '"]'
                ))
              : 'action' === n[0]
              ? (s = document.body.querySelector(
                  '.fpd-btn[data-action="' + n[1] + '"]'
                ))
              : 1 === n.length && (s = document.body.querySelector(n[0])),
            s)
          ) {
            if (0 === s.length)
              return void (
                Object.keys(this.fpdInstance.mainOptions.guidedTour)[i + 1] &&
                this.selectStep(
                  Object.keys(this.fpdInstance.mainOptions.guidedTour)[i + 1]
                )
              )
            const e = document.createElement('div')
            ;(e.className = 'fpd-container fpd-gt-step'),
              (e.innerHTML = `<div class="fpd-gt-pointer">\n                <span class="fpd-icon-arrow-dropdown"></span>\n            </div>\n            <div class="fpd-gt-close">\n                <span class="fa-solid fa-close"></span>\n            </div>\n            <div class="fpd-gt-text">${
                this.fpdInstance.mainOptions.guidedTour[t]
              }</div>\n            <div class="fpd-gt-actions">\n                <div class="fpd-gt-next fpd-btn fpd-primary">${this.fpdInstance.translator.getTranslation(
                'misc',
                'guided_tour_next',
                'Next'
              )}</div>\n                <div class="fpd-gt-back fpd-btn fpd-primary">${this.fpdInstance.translator.getTranslation(
                'misc',
                'guided_tour_back',
                'Back'
              )}</div>\n                <span class="fpd-gt-counter">${
                String(i + 1) +
                '/' +
                Object.keys(this.fpdInstance.mainOptions.guidedTour).length
              }</span>\n            </div>`),
              document.body.append(e)
            let n = s.getBoundingClientRect(),
              r = 0.5 * n.width,
              a = n.left + r,
              o = n.top + n.height
            a < 24 && (a = 24),
              (e.style.left = a + 'px'),
              (e.style.top = o + 'px')
            const l = e.getBoundingClientRect()
            l.width + l.left > window.innerWidth &&
              ((r = window.innerWidth - (l.width + a)),
              (e.style.left = a + r + 'px'),
              (e.querySelector('.fpd-gt-pointer').style.marginLeft =
                Math.abs(r) + 'px')),
              o > window.innerHeight - l.height &&
                ((o -= l.height),
                (e.style.top = o + 'px'),
                X(e, ['fpd-reverse']))
            const c = e.querySelector('.fpd-gt-back'),
              h = Object.keys(this.fpdInstance.mainOptions.guidedTour)[i - 1]
            h
              ? G(c, 'click', t => {
                  this.selectStep(h)
                })
              : X(c, ['fpd-hidden'])
            const d = e.querySelector('.fpd-gt-next'),
              u = Object.keys(this.fpdInstance.mainOptions.guidedTour)[i + 1]
            u
              ? G(d, 'click', t => {
                  this.selectStep(u)
                })
              : X(d, ['fpd-hidden']),
              G(e.querySelector('.fpd-gt-close'), 'click', t => {
                K() && window.localStorage.setItem('fpd-gt-closed', 'yes'),
                  e.remove()
              })
          }
        }
      }
      function La (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function Ba (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      var Fa = new WeakSet(),
        ja = new WeakSet()
      class Ra extends EventTarget {
        constructor (t) {
          if (
            (super(),
            La(this, ja),
            La(this, Fa),
            (e = this),
            (n = !1),
            (i = (function (t) {
              var e = (function (t, e) {
                if ('object' != typeof t || null === t) return t
                var i = t[Symbol.toPrimitive]
                if (void 0 !== i) {
                  var n = i.call(t, 'string')
                  if ('object' != typeof n) return n
                  throw new TypeError(
                    '@@toPrimitive must return a primitive value.'
                  )
                }
                return String(t)
              })(t)
              return 'symbol' == typeof e ? e : String(e)
            })((i = 'enabled'))) in e
              ? Object.defineProperty(e, i, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
                })
              : (e[i] = n),
            (this.fpdInstance = t),
            (this.variations = t.mainOptions.bulkVariations),
            t.mainOptions.bulkVariationsPlacement &&
              'object' == typeof this.variations &&
              ((this.container = document.querySelector(
                t.mainOptions.bulkVariationsPlacement
              )),
              this.container))
          ) {
            this.enabled = !0
            const e = document.createElement('div')
            ;(e.className = 'fpd-head'), this.container.append(e)
            const i = document.createElement('div')
            ;(i.className = 'fpd-headline'),
              (i.innerText = t.translator.getTranslation(
                'misc',
                'bulk_add_variations_title',
                'Bulk Order'
              )),
              e.append(i)
            const n = document.createElement('span')
            ;(n.className = 'fpd-btn'),
              (n.innerText = t.translator.getTranslation(
                'misc',
                'bulk_add_variations_add',
                'Add'
              )),
              e.append(n),
              G(n, 'click', t => {
                Ba(this, Fa, Na).call(this)
              }),
              (this.listElem = document.createElement('div')),
              (this.listElem.className = 'fpd-variations-list'),
              this.container.append(this.listElem),
              X(this.container, ['fpd-bulk-variations', 'fpd-container']),
              Ba(this, Fa, Na).call(this),
              G(t, 'getOrder', () => {
                t._order.bulkVariations = this.getOrderVariations()
              })
          }
          var e, i, n
        }
        getOrderVariations () {
          if (!this.listElem) return !1
          let t = []
          return (
            this.listElem.querySelectorAll('.fpd-row').forEach(e => {
              var i = {}
              e.querySelectorAll('select').forEach(e => {
                Q(e.value) && ((t = !1), X(e, ['fpd-error'])),
                  (i[e.name] = e.value)
              }),
                !1 !== t
                  ? t.push({
                      variation: i,
                      quantity: parseInt(e.querySelector('.fpd-quantity').value)
                    })
                  : n(
                      this.fpdInstance.translator.getTranslation(
                        'misc',
                        'bulk_add_variations_term'
                      )
                    )
            }),
            t
          )
        }
        setup (t) {
          Array.isArray(t) &&
            ((this.listElem.innerHTML = ''),
            t.forEach(t => {
              Ba(this, Fa, Na).call(this, t)
            })),
            Ba(this, ja, Ha).call(this)
        }
      }
      function Na () {
        let t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        const e = document.createElement('div')
        ;(e.className = 'fpd-row'), this.listElem.append(e)
        const i = t.variation || {}
        for (const t in this.variations) {
          const n = document.createElement('select')
          ;(n.name = t),
            (n.innerHTML = `<option value='' disabled selected>${t}</option>`),
            e.append(n),
            this.variations[t].forEach(e => {
              const s = document.createElement('option')
              ;(s.value = e),
                (s.innerText = e),
                i[t] == e && (s.selected = !0),
                n.append(s)
            }),
            G(n, ['change'], t => {
              Z(n, ['fpd-error'])
            })
        }
        const n = document.createElement('input')
        ;(n.className = 'fpd-quantity'),
          (n.type = 'number'),
          (n.min = 1),
          (n.step = 1),
          (n.value = t.quantity || 1),
          e.append(n),
          G(n, 'change', t => {
            n.value < Number(n.min) && (n.value = Number(n.min)),
              '' == n.inputElem && (n.value = 1),
              Ba(this, ja, Ha).call(this)
          })
        const s = document.createElement('span')
        ;(s.className = 'fa-solid fa-close'),
          e.append(s),
          G(s, 'click', t => {
            e.remove(), Ba(this, ja, Ha).call(this)
          }),
          Ba(this, ja, Ha).call(this)
      }
      function Ha () {
        let t = 0
        this.listElem.querySelectorAll('.fpd-quantity').forEach(e => {
          t += parseInt(e.value)
        }),
          this.fpdInstance.setOrderQuantity(parseInt(t))
      }
      function za (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function Wa (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      var Va = new WeakSet(),
        Ua = new WeakSet(),
        Ya = new WeakSet(),
        Ga = new WeakSet(),
        qa = new WeakSet()
      class Xa extends EventTarget {
        constructor (t) {
          super(),
            za(this, qa),
            za(this, Ga),
            za(this, Ya),
            za(this, Ua),
            za(this, Va),
            (this.fpdInstance = t),
            Q(t.mainOptions.colorSelectionPlacement) ||
              ((this.container = document.querySelector(
                t.mainOptions.colorSelectionPlacement
              )),
              this.container &&
                (X(this.container, ['fpd-color-selection', 'fpd-container']),
                G(t, 'productCreate', Wa(this, Va, Za).bind(this)),
                G(t, 'elementAdd', Wa(this, Va, Za).bind(this)))),
            G(t, 'elementRemove', t => {
              const { element: e } = t.detail
              if (e && e.showInColorSelection) {
                const t = this.container.querySelector(
                  '.fpd-cs-item[data-id="' + e.id + '"]'
                )
                t && t.remove()
              }
            })
        }
      }
      function Za () {
        this.container.innerHTML = ''
        const t = this.fpdInstance
          .getElements(0)
          .filter(t => t.showInColorSelection)
        J(this.container, ['fpd-hidden'], 0 == t.length),
          t.forEach(t => {
            Wa(this, Ua, Ja).call(this, t)
          })
      }
      function Ja (t) {
        if (t.hasColorSelection()) {
          const e = document.createElement('div')
          ;(e.className = 'fpd-cs-item'),
            (e.dataset.id = t.id),
            (e.innerHTML = `<div class="fpd-title">${t.title}</div>`),
            this.container.append(e)
          let i,
            n = rt(t, this.fpdInstance)
          if ('group' === t.type && t.getObjects().length > 1) {
            const e = Array.isArray(t.colors) && t.colors.length > 1
            i = Ln({
              colors: n,
              colorNames: this.fpdInstance.mainOptions.hexNames,
              palette: t.colors,
              subPalette: e,
              enablePicker: !e,
              onChange: (e, i) => {
                Wa(this, Ya, Qa).call(this, t, i, e)
              },
              onMove: (e, i) => {
                t.changeObjectColor(i, e)
              }
            })
          } else
            i = Bn(this.fpdInstance, {
              colors: n,
              patterns:
                Array.isArray(t.patterns) &&
                (t.isSVG() || 'text' === t.getType())
                  ? t.patterns
                  : null,
              onMove: e => {
                Wa(this, Ga, Ka).call(this, t, e)
              },
              onChange: e => {
                Wa(this, qa, $a).call(this, t, e)
              },
              onPatternChange: e => {
                this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
                  { pattern: e },
                  t
                )
              }
            })
          i && e.append(i)
        }
      }
      function Qa (t, e, i) {
        const n = t.changeObjectColor(e, i)
        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
          { fill: n },
          t
        )
      }
      function Ka (t, e) {
        'png' !== t.isColorizable() && t.changeColor(e)
      }
      function $a (t, e) {
        this.fpdInstance.currentViewInstance.fabricCanvas.setElementOptions(
          { fill: e },
          t
        )
      }
      window.FPDColorSelection = Xa
      var to = new WeakSet()
      class eo {
        constructor (t) {
          if (
            ((function (t, e) {
              if (e.has(t))
                throw new TypeError(
                  'Cannot initialize the same private elements twice on an object'
                )
            })((e = this), (i = to)),
            i.add(e),
            (this.fpdInstance = t),
            t.mainOptions.viewThumbnailsWrapper)
          ) {
            let e
            'main-wrapper' == t.mainOptions.viewThumbnailsWrapper
              ? ((e = document.createElement('div')),
                this.fpdInstance.mainWrapper.container.append(e))
              : (e = t.mainOptions.viewThumbnailsWrapper),
              (this.container =
                'string' == typeof e ? document.querySelector(e) : e),
              this.container &&
                (X(this.container, ['fpd-view-thumbnails-wrapper']),
                G(
                  this.fpdInstance,
                  ['viewCreate', 'viewRemove', 'viewMove'],
                  (function (t, e, i) {
                    if (!e.has(t))
                      throw new TypeError(
                        'attempted to get private field on non-instance'
                      )
                    return i
                  })(this, to, io).bind(this)
                ))
          }
          var e, i
        }
      }
      function io (t) {
        ;(this.container.innerHTML = ''),
          this.fpdInstance.viewInstances.forEach((t, e) => {
            const i = document.createElement('div')
            ;(i.className = 'fpd-item fpd-tooltip fpd-shadow-1'),
              i.setAttribute('aria-label', t.title),
              (i.style.backgroundImage = `url("${t.thumbnail}")`),
              this.container.append(i),
              G(i, 'click', () => {
                this.fpdInstance.selectView(e)
              })
          }),
          J(
            this.container,
            ['fpd-hidden'],
            this.fpdInstance.viewInstances.length < 2
          )
      }
      class no extends EventTarget {
        constructor (t) {
          super(),
            (this.fpdInstance = t),
            (this.container = t.mainWrapper.container.querySelector(
              '.fpd-advanced-image-editor'
            )),
            (this.currentElement = null),
            (this.fImg = null),
            (this.mask = null),
            (this.fabricCanvas = new fabric.Canvas(
              this.container.querySelector('canvas'),
              { containerClass: 'fpd-aie-canvas', selection: !1 }
            )),
            this.fabricCanvas.setBackgroundColor(
              '#fff',
              this.fabricCanvas.renderAll.bind(this.fabricCanvas)
            ),
            G(this.container.querySelector('.fpd-close'), 'click', () => {
              this.fabricCanvas.clear(), this.toggle(!1)
            }),
            G(this.container.querySelector('.fpd-done'), 'click', () => {
              this.mask.set('fill', 'transparent'),
                (this.fabricCanvas.clipPath = this.mask)
              let e = {
                format: 'png',
                top: this.fImg.top,
                left: this.fImg.left,
                width: this.fImg.getScaledWidth(),
                height: this.fImg.getScaledHeight(),
                multiplier: this.fImg.width / this.fabricCanvas.width
              }
              const i = this.fabricCanvas.toDataURL(e)
              t._downloadRemoteImage(i, 'mask', {}, e => {
                e.url
                  ? this.currentElement.setSrc(
                      e.url,
                      () => {
                        ;(this.currentElement.source = e.url),
                          this.currentElement.canvas.renderAll(),
                          q(t, 'viewCanvasUpdate', {
                            viewInstance: t.currentViewInstance
                          })
                      },
                      { crossOrigin: 'anonymous' }
                    )
                  : e.error && n(e.error),
                  Z(t.viewsNav.container, ['fpd-disabled']),
                  (t.loadingCustomImage = !1),
                  t.toggleSpinner(!1)
              }),
                this.toggle(!1)
            })
        }
        toggle () {
          let t =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]
          ;(this.fabricCanvas.clipPath = null),
            this.fabricCanvas.clear(),
            J(this.container, ['fpd-hidden'], !t),
            J(this.fpdInstance.container, ['fpd-aie-visible'], t)
        }
        loadImage (t, e) {
          ;(this.mask = null),
            (this.currentElement = t),
            this.toggle(),
            this.fabricCanvas.setDimensions({
              width: this.container.offsetWidth,
              height: this.container.offsetHeight
            }),
            fabric.Image.fromURL(
              t.originParams.source,
              t => {
                ;(this.fImg = t),
                  (t.evented = !1),
                  t.width > t.height
                    ? t.scaleToWidth(this.fabricCanvas.width)
                    : t.scaleToHeight(this.fabricCanvas.height),
                  this.fabricCanvas.add(t),
                  t.center(),
                  fabric.loadSVGFromURL(e, (t, e) => {
                    t &&
                      ((this.mask = t
                        ? fabric.util.groupSVGElements(t, e)
                        : null),
                      this.mask.setOptions({
                        selectable: !0,
                        evented: !0,
                        resizable: !0,
                        rotatable: !0,
                        lockUniScaling: !1,
                        lockRotation: !1,
                        borderColor: 'transparent',
                        fill: 'rgba(184,233,134,0.4)',
                        centeredScaling: !0,
                        transparentCorners: !0,
                        absolutePositioned: !1,
                        cornerSize: 24,
                        objectCaching: !1
                      }),
                      this.fabricCanvas.width < this.fabricCanvas.height
                        ? this.mask.scaleToWidth(this.fabricCanvas.width - 100)
                        : this.mask.scaleToHeight(
                            this.fabricCanvas.height - 100
                          ),
                      this.fabricCanvas.add(this.mask),
                      this.mask.center(),
                      this.fabricCanvas.setActiveObject(this.mask))
                  })
              },
              { crossOrigin: 'anonymous' }
            )
        }
      }
      function so (t, e) {
        ro(t, e), e.add(t)
      }
      function ro (t, e) {
        if (e.has(t))
          throw new TypeError(
            'Cannot initialize the same private elements twice on an object'
          )
      }
      function ao (t, e) {
        return (function (t, e) {
          return e.get ? e.get.call(t) : e.value
        })(t, oo(t, e, 'get'))
      }
      function oo (t, e, i) {
        if (!e.has(t))
          throw new TypeError(
            'attempted to ' + i + ' private field on non-instance'
          )
        return e.get(t)
      }
      function lo (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      var co = new WeakMap(),
        ho = new WeakSet(),
        uo = new WeakSet(),
        fo = new WeakSet()
      class po extends EventTarget {
        constructor (t) {
          var e, i
          super(),
            so(this, fo),
            so(this, uo),
            so(this, ho),
            (i = { writable: !0, value: 0 }),
            ro(this, (e = co)),
            e.set(this, i),
            (function (t, e, i) {
              ;(e = (function (t) {
                var e = (function (t, e) {
                  if ('object' != typeof t || null === t) return t
                  var i = t[Symbol.toPrimitive]
                  if (void 0 !== i) {
                    var n = i.call(t, 'string')
                    if ('object' != typeof n) return n
                    throw new TypeError(
                      '@@toPrimitive must return a primitive value.'
                    )
                  }
                  return String(t)
                })(t)
                return 'symbol' == typeof e ? e : String(e)
              })(e)) in t
                ? Object.defineProperty(t, e, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                  })
                : (t[e] = i)
            })(this, 'currentLayout', ''),
            (this.fpdInstance = t)
        }
        init () {
          if (this.fpdInstance.mainOptions.modalMode) {
            ;(this.fpdInstance.mainOptions.maxCanvasHeight = 0.75),
              (this.fpdInstance.mainOptions.canvasHeight = 'auto'),
              (this.fpdInstance.mainOptions.fabricCanvasOptions.allowTouchScrolling =
                !1)
            let t = !1
            X(document.body, ['fpd-modal-mode-active']),
              Z(this.fpdInstance.container, ['fpd-off-canvas', 'fpd-topbar']),
              X(this.fpdInstance.container, ['fpd-sidebar'])
            const e = document.createElement('div')
            ;(e.className =
              'fpd-modal-product-designer fpd-modal-overlay fpd-fullscreen'),
              document.body.append(e),
              (this.fpdInstance.modalWrapper = e)
            const i = document.createElement('div')
            ;(i.className = 'fpd-modal-inner'),
              i.append(this.fpdInstance.container),
              e.append(i)
            const n = document.querySelector(
              this.fpdInstance.mainOptions.modalMode
            )
            G(n, 'click', i => {
              i.preventDefault(),
                X(document.body, [
                  'fpd-overflow-hidden',
                  'fpd-modal-designer-visible'
                ]),
                X(e, ['fpd-show']),
                this.fpdInstance.selectView(0),
                this.fpdInstance.currentViewInstance &&
                  (this.fpdInstance.currentViewInstance.fabricCanvas.resetZoom(),
                  t || this.fpdInstance.doAutoSelect()),
                (t = !0),
                q(this.fpdInstance, 'modalDesignerOpen', {}),
                q(window, 'fpdModalDesignerOpen', {})
            }),
              G(this.fpdInstance, 'modalDesignerClose', () => {
                Z(document.body, [
                  'fpd-overflow-hidden',
                  'fpd-modal-designer-visible'
                ])
              }),
              G(this.fpdInstance, 'priceChange', () => {
                e.querySelector('fpd-actions-bar .fpd-total-price').innerHTML =
                  this.fpdInstance.formatPrice(this.fpdInstance.currentPrice)
              })
          }
          this.fpdInstance.container.classList.add('fpd-container'),
            this.fpdInstance.container.classList.add('fpd-wrapper')
          const t = document.createElement('div')
          ;(t.innerHTML =
            '<div class="fpd-loader-wrapper"> <div class="fpd-loader"> <div class="fpd-loader-circle"></div> <span class="fpd-loader-text" data-defaulttext="Initializing Product Designer">misc.initializing</span> </div> </div>'),
            this.fpdInstance.container.appendChild(t.firstChild.cloneNode(!0)),
            (this.fpdInstance.mainLoader =
              this.fpdInstance.container.querySelector('.fpd-loader-wrapper')),
            (this.fpdInstance.actionsBar = new Ie(this.fpdInstance)),
            (this.fpdInstance.mainBar = new vr(this.fpdInstance)),
            (this.fpdInstance.mainWrapper = new Er(this.fpdInstance)),
            (this.fpdInstance.productStage =
              this.fpdInstance.mainWrapper.container.querySelector(
                '.fpd-product-stage'
              )),
            (this.fpdInstance.viewsNav = new Lr(this.fpdInstance)),
            (this.fpdInstance.viewsGrid = new Wr(this.fpdInstance)),
            (this.fpdInstance.advancedImageEditor = new no(this.fpdInstance)),
            (this.fpdInstance.bulkVariations = new Ra(this.fpdInstance)),
            (this.fpdInstance.colorSelection = new Xa(this.fpdInstance)),
            (this.fpdInstance.viewThumbnails = new eo(this.fpdInstance)),
            (this.fpdInstance.guidedTour = new Da(this.fpdInstance)),
            this.fpdInstance.translator.translateArea(
              this.fpdInstance.container
            ),
            this.dispatchEvent(new CustomEvent('ready')),
            window.addEventListener('resize', lo(this, ho, go).bind(this)),
            lo(this, ho, go).call(this),
            lo(this, uo, mo).call(this),
            lo(this, fo, vo).call(this)
        }
        updateToolbarWrapper () {
          const t = document.querySelector('fpd-element-toolbar')
          t && t.remove(),
            (this.fpdInstance.toolbar = new ma(this.fpdInstance)),
            this.fpdInstance.translator.translateArea(
              this.fpdInstance.toolbar.container
            )
        }
      }
      function go () {
        const t = this.fpdInstance.mainOptions.responsiveBreakpoints
        let e
        var i, n, s
        // Phone landscape: width often exceeds the small breakpoint (768)
        // and flipped the UI to desktop. Use the short side only for short
        // landscape viewports so portrait phones and real desktops are unchanged.
        const isShortLandscape =
          window.matchMedia('(orientation: landscape) and (max-height: 560px)')
            .matches
        const layoutWidth = isShortLandscape
          ? Math.min(window.innerWidth, window.innerHeight)
          : window.innerWidth
        ;(i = this),
          (n = co),
          (s = layoutWidth),
          (function (t, e, i) {
            if (e.set) e.set.call(t, i)
            else {
              if (!e.writable)
                throw new TypeError('attempted to set read only private field')
              e.value = i
            }
          })(i, oo(i, n, 'set'), s),
          ao(this, co) < t.small
            ? (this.fpdInstance.container.classList.remove('fpd-layout-medium'),
              this.fpdInstance.container.classList.remove('fpd-layout-large'),
              this.fpdInstance.container.classList.add('fpd-layout-small'),
              (e = 'small'))
            : ao(this, co) < t.medium
            ? (this.fpdInstance.container.classList.remove('fpd-layout-small'),
              this.fpdInstance.container.classList.remove('fpd-layout-large'),
              this.fpdInstance.container.classList.add('fpd-layout-medium'),
              (e = 'medium'))
            : (this.fpdInstance.container.classList.remove('fpd-layout-medium'),
              this.fpdInstance.container.classList.remove('fpd-layout-small'),
              this.fpdInstance.container.classList.add('fpd-layout-large'),
              (e = 'large')),
          document.documentElement.classList.toggle(
            'fpd-doc-landscape-sheet',
            isShortLandscape && e === 'small'
          ),
          (this.fpdInstance.container.dataset.layout = e),
          e != this.currentLayout &&
            ((this.currentLayout = e),
            this.updateToolbarWrapper(),
            this.fpdInstance.dispatchEvent(
              new CustomEvent('uiLayoutChange', { detail: { layout: e } })
            ))
      }
      function mo () {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
          return
        const t = document.body
        let e
        ;(e = document.createElement('div')),
          (e.className = 'fpd-thumbnail-preview fpd-shadow-1 fpd-hidden'),
          (e.innerHTML = '<picture></picture>')
        const i = document.createElement('div')
        ;(i.className = 'fpd-preview-title'),
          e.append(i),
          t.append(e),
          G(t, ['mouseover', 'mouseout', 'mousemove', 'click'], t => {
            if (this.fpdInstance.draggedPlaceholder)
              return void e.classList.add('fpd-hidden')
            const n = t.target
            if (
              n.classList.contains('fpd-hover-thumbnail') &&
              e.classList.contains('fpd-hidden') &&
              'mouseover' === t.type &&
              n.dataset.source
            ) {
              e.querySelector('.fpd-price') &&
                e.querySelector('.fpd-price').remove(),
                e.querySelector('.fpd-image-quality-ratings') &&
                  e.querySelector('.fpd-image-quality-ratings').remove(),
                (e.querySelector(
                  'picture'
                ).style.backgroundImage = `url("${n.dataset.source}")`),
                n.dataset.title && (i.innerText = n.dataset.title),
                J(i, ['fpd-hidden'], !n.dataset.title),
                J(e, ['fpd-title-enabled'], n.dataset.title)
              const t = n.querySelector('.fpd-price')
              t && e.append(t.cloneNode(!0))
              const s = n.querySelector('.fpd-image-quality-ratings')
              if (s) {
                const t = s.cloneNode(!0),
                  i = document.createElement('span')
                ;(i.className = 'fpd-image-quality-rating-label'),
                  (i.innerText = s.dataset.qualityLabel),
                  t.prepend(i),
                  e.append(t)
              }
              e.classList.remove('fpd-hidden')
            }
            if (
              e.classList.contains('fpd-hidden') ||
              ('mousemove' !== t.type && 'mouseover' !== t.type)
            )
              ('mouseout' !== t.type && 'click' != t.type) ||
                e.classList.add('fpd-hidden')
            else {
              const i =
                t.pageX + 10 + e.offsetWidth > window.innerWidth
                  ? window.innerWidth - e.offsetWidth
                  : t.pageX + 10
              ;(e.style.left = i + 'px'), (e.style.top = t.pageY + 10 + 'px')
            }
          })
      }
      function vo () {
        const t = document.body,
          e = document.createElement('div')
        ;(e.className = 'fpd-main-tooltip'),
          t.append(e),
          (this.fpdInstance.mainTooltip = e),
          t.addEventListener('mouseover', t => {
            const i = t.target
            if (i.classList.contains('fpd-tooltip')) {
              let t = i.getAttribute('aria-label')
              null === t && (t = i.getAttribute('title')), (e.innerHTML = t)
              const n = 5,
                { x: s, y: r, width: a, height: o } = i.getBoundingClientRect()
              let l = Math.floor(r - e.clientHeight - n),
                c = Math.floor(s + a / 2 - e.clientWidth / 2)
              l < 0 && (l = Math.floor(r + o + n)),
                c < 0
                  ? (c = 0)
                  : c > window.outerWidth - e.clientWidth &&
                    (c = window.outerWidth - e.clientWidth - n),
                (e.style.left = `${c}px`),
                (e.style.top = `${l}px`),
                e.classList.add('fpd-show')
            } else e.classList.remove('fpd-show')
          }),
          t.addEventListener('touchstart', t => {
            e.classList.remove('fpd-show')
          })
      }
      class bo {
        constructor (t) {
          const e = document.querySelector(t.mainOptions.editorMode)
          e &&
            (X(e, ['fpd-editor-box-wrapper', 'fpd-container']),
            (this.titleElem = document.createElement('div')),
            (this.titleElem.className = 'fpd-eb-title'),
            e.append(this.titleElem),
            (this.gridElem = document.createElement('div')),
            (this.gridElem.className = 'fpd-eb-grid'),
            e.append(this.gridElem),
            t.mainOptions.editorBoxParameters.forEach(t => {
              const e = document.createElement('div')
              ;(e.innerHTML =
                '<span>' +
                t +
                '</span><input type="text" readonly data-prop="' +
                t +
                '" />'),
                this.gridElem.append(e)
            })),
            G(t, ['elementSelect', 'elementChange'], i => {
              e &&
                (t.currentElement
                  ? ((this.titleElem.innerText = t.currentElement.title),
                    t.mainOptions.editorBoxParameters.forEach(e => {
                      let i = t.currentElement[e]
                      if (void 0 !== i) {
                        ;(i = 'number' == typeof i ? i.toFixed(2) : i),
                          (i =
                            'object' == typeof i && i.source
                              ? i.source.src
                              : i),
                          'fill' === e &&
                            'group' === t.currentElement.type &&
                            (i = t.currentElement.svgFill)
                        const n = this.gridElem.querySelector(
                          'input[data-prop="' + e + '"]'
                        )
                        n && (n.value = i)
                      }
                    }))
                  : (this.titleElem.innerText = ''),
                J(this.gridElem, ['fpd-hidden'], !t.currentElement))
            })
        }
      }
      function yo (t, e) {
        wo(t, e), e.add(t)
      }
      function xo (t, e, i) {
        wo(t, e), e.set(t, i)
      }
      function wo (t, e) {
        if (e.has(t))
          throw new TypeError(
            'Cannot initialize the same private elements twice on an object'
          )
      }
      function Co (t, e, i) {
        return (
          (e = (function (t) {
            var e = (function (t, e) {
              if ('object' != typeof t || null === t) return t
              var i = t[Symbol.toPrimitive]
              if (void 0 !== i) {
                var n = i.call(t, 'string')
                if ('object' != typeof n) return n
                throw new TypeError(
                  '@@toPrimitive must return a primitive value.'
                )
              }
              return String(t)
            })(t)
            return 'symbol' == typeof e ? e : String(e)
          })(e)) in t
            ? Object.defineProperty(t, e, {
                value: i,
                enumerable: !0,
                configurable: !0,
                writable: !0
              })
            : (t[e] = i),
          t
        )
      }
      function So (t, e) {
        return (function (t, e) {
          return e.get ? e.get.call(t) : e.value
        })(t, Eo(t, e, 'get'))
      }
      function To (t, e, i) {
        return (
          (function (t, e, i) {
            if (e.set) e.set.call(t, i)
            else {
              if (!e.writable)
                throw new TypeError('attempted to set read only private field')
              e.value = i
            }
          })(t, Eo(t, e, 'set'), i),
          i
        )
      }
      function Eo (t, e, i) {
        if (!e.has(t))
          throw new TypeError(
            'attempted to ' + i + ' private field on non-instance'
          )
        return e.get(t)
      }
      function Ao (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      var Io = new WeakMap(),
        Oo = new WeakMap(),
        ko = new WeakSet(),
        Mo = new WeakSet(),
        Po = new WeakSet(),
        _o = new WeakSet(),
        Do = new WeakSet(),
        Lo = new WeakSet(),
        Bo = new WeakSet(),
        Fo = new WeakSet(),
        jo = new WeakSet(),
        Ro = new WeakSet(),
        No = new WeakSet()