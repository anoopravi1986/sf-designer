/*
 * FancyProductDesigner - part 1/6: vendor libraries & bundler runtime
 * ---------------------------------------------------------------------
 * Bundled third-party code: fabric.js, the fabric-history plugin, and the
 * webpack module-loader runtime this build was produced with.
 *
 * Not modified by StyleFlip - if this ever needs a vendor upgrade, this
 * is the file that gets replaced wholesale. No StyleFlip customizations
 * live in this file.
 *
 * GENERATED FILE NOTICE: public/assets/js/FancyProductDesigner.js is
 * assembled from the 6 files in this folder by scripts/build-fpd.js
 * (run automatically via "npm run build"/"npm start", or manually via
 * "npm run build:fpd"). Edit the files here, not the generated output.
 */
/*! For license information please see main.js.LICENSE.txt */
;(() => {
  var t = {
      106: () => {
        //          setTimeout(() => {
        //     console.log("product updated called")
        //     this.fpdInstance.selectProduct(1, 1);
        // }, 15000);
        
        var t
        ;(fabric.Canvas.prototype.historyProcessing = !0),
          (fabric.Canvas.prototype.initialize =
            ((t = fabric.Canvas.prototype.initialize),
            function () {
              for (
                var e = arguments.length, i = new Array(e), n = 0;
                n < e;
                n++
              )
                i[n] = arguments[n]
              return t.call(this, ...i), this._historyInit(), this
            })),
          (fabric.Canvas.prototype.dispose = (function (t) {
            return function () {
              for (
                var e = arguments.length, i = new Array(e), n = 0;
                n < e;
                n++
              )
                i[n] = arguments[n]
              return t.call(this, ...i), this._historyDispose(), this
            }
          })(fabric.Canvas.prototype.dispose)),
          (fabric.Canvas.prototype._historyNext = function () {
            let t = {
              version: fabric.version,
              objects: this.getElementsJSON(!1, !1)
            }
            return (
              t.objects.forEach(t => {
                t.curved && delete t.path
              }),
              JSON.stringify(t)
            )
          }),
          (fabric.Canvas.prototype._historyEvents = function () {
            return {
              elementAdd: this.historySaveAction,
              elementRemove: this.historySaveAction,
              'object:modified': this.historySaveAction
            }
          }),
          (fabric.Canvas.prototype._historyInit = function () {
            ;(this.historyUndo = []),
              (this.historyRedo = []),
              (this.historyNextState = this._historyNext()),
              this.on(this._historyEvents())
          }),
          (fabric.Canvas.prototype._historyDispose = function () {
            this.off(this._historyEvents())
          }),
          (fabric.Canvas.prototype.historySaveAction = function () {
            if (this.historyProcessing) return
            const t = this.historyNextState
            ;(this.isCustomized = this.initialElementsLoaded),
              this.historyUndo.push(t),
              (this.historyNextState = this._historyNext()),
              this.fire('history:append', { json: t })
          }),
          (fabric.Canvas.prototype.undo = function (t) {
            ;(this.historyProcessing = !0), this.deselectElement()
            const e = this.historyUndo.pop()
            e
              ? (this.historyRedo.push(this._historyNext()),
                (this.historyNextState = e),
                this._loadHistory(e, 'history:undo', t))
              : (this.historyProcessing = !1)
          }),
          (fabric.Canvas.prototype.redo = function (t) {
            ;(this.historyProcessing = !0), this.deselectElement()
            const e = this.historyRedo.pop()
            e
              ? (this.historyUndo.push(this._historyNext()),
                (this.historyNextState = e),
                this._loadHistory(e, 'history:redo', t))
              : (this.historyProcessing = !1)
          }),
          (fabric.Canvas.prototype._loadHistory = function (t, e, i) {
            'string' == typeof t && (t = JSON.parse(t)),
              this.clear(),
              this.addElements(t.objects, () => {
                this.fire(e),
                  (this.historyProcessing = !1),
                  i && 'function' == typeof i && i()
              })
          }),
          (fabric.Canvas.prototype.clearHistory = function () {
            ;(this.historyUndo = []),
              (this.historyRedo = []),
              this.fire('history:clear')
          }),
          (fabric.Canvas.prototype.onHistory = function () {
            ;(this.historyProcessing = !1), this.historySaveAction()
          }),
          (fabric.Canvas.prototype.offHistory = function () {
            this.historyProcessing = !0
          })
      },
      653: () => {
        function t (t, e) {
          !(function (t, e) {
            if (e.has(t))
              throw new TypeError(
                'Cannot initialize the same private elements twice on an object'
              )
          })(t, e),
            e.add(t)
        }
        function e (t, e, i) {
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
        function i (t, e, i) {
          if (!e.has(t))
            throw new TypeError(
              'attempted to get private field on non-instance'
            )
          return i
        }
        var n = new WeakSet(),
          s = new WeakSet()
        class r extends HTMLElement {
          constructor () {
            super(),
              t(this, s),
              t(this, n),
              e(this, 'min', 0),
              e(this, 'max', 10),
              e(this, 'value', 0),
              e(this, 'step', 1),
              e(this, 'inputElem', null)
          }
          connectedCallback () {
            ;(this.inputElem = document.createElement('input')),
              (this.inputElem.type = 'range'),
              (this.inputElem.value = this.getAttribute('value')),
              (this.inputElem.min = this.getAttribute('min')),
              (this.inputElem.max = this.getAttribute('max')),
              (this.inputElem.step = this.getAttribute('step')),
              this.append(this.inputElem),
              this.inputElem.addEventListener(
                'input',
                i(this, n, a).bind(this)
              ),
              i(this, s, o).call(this)
          }
          static get observedAttributes () {
            return ['value', 'step', 'min', 'max']
          }
          attributeChangedCallback (t, e, n) {
            this.inputElem &&
              ((this.inputElem[t] = n), i(this, s, o).call(this))
          }
        }
        function a (t) {
          i(this, s, o).call(this), this.onInput && this.onInput(t)
          const e = new CustomEvent('onInput', {
            detail: Number(this.inputElem.value)
          })
          this.dispatchEvent(e)
        }
        function o () {
          this.inputElem.style.setProperty('--value', this.inputElem.value),
            this.inputElem.style.setProperty('--min', this.inputElem.min),
            this.inputElem.style.setProperty('--max', this.inputElem.max)
        }
        customElements.define('fpd-range-slider', r)
      },
      148: function (t) {
        !(function (e, i, n) {
          'use strict'
          t.exports = (function (t) {
            var e = '$areaSortable',
              i = 'rect',
              n = 'scroll',
              s = 'style',
              r = 'margin',
              a = 'padding',
              o = 'left',
              l = 'right',
              c = 'width',
              h = 'top',
              d = 'bottom',
              u = 'height',
              f = 'nextElementSibling',
              p = 'previousElementSibling',
              g = 'scrollTop',
              m = 'scrollLeft',
              v = 1,
              b = 2,
              y = v + b,
              x = Math,
              w = String,
              C = parseInt,
              S = Object.prototype.hasOwnProperty,
              T = Object.prototype.toString,
              E = /^\s+|\s+$/g,
              A = /mousedown|pointerdown/,
              I = w.prototype.trim
                ? function (t) {
                    return t.trim()
                  }
                : function (t) {
                    return t.replace(E, '')
                  },
              O = null
            function k (t, e) {
              return 0 > t ? -1 : 0 < t ? 1 : e || 0
            }
            function M (t) {
              return 'function' == typeof t
            }
            function P (t) {
              return '[object String]' === T.call(t)
            }
            function _ () {
              var t = !1,
                e = {}
              try {
                Object.defineProperty(e, 'passive', {
                  get: function () {
                    return (t = !0), !1
                  }
                }),
                  window.addEventListener('test', null, e),
                  window.removeEventListener('test', null, e)
              } catch (e) {
                t = !1
              }
              return t
            }
            function D (t, e, i, n) {
              null == O && (O = _()),
                t.attachEvent
                  ? t.attachEvent('on' + e, i)
                  : t.addEventListener(
                      e,
                      i,
                      O ? n : 'object' == typeof n ? !!n.capture : !!n
                    )
            }
            function L (t, e, i, n) {
              null == O && (O = _()),
                t.detachEvent
                  ? t.detachEvent('on' + e, i)
                  : t.removeEventListener(
                      e,
                      i,
                      O ? n : 'object' == typeof n ? !!n.capture : !!n
                    )
            }
            function B (t, e) {
              return t.classList
                ? t.classList.contains(e)
                : -1 !== (' ' + t.className + ' ').indexOf(' ' + e + ' ')
            }
            function F (t, e) {
              t.classList
                ? t.classList.add(e)
                : B(t, e) ||
                  (t.className = '' === t.className ? e : t.className + ' ' + e)
            }
            function j (t, e) {
              t.classList
                ? t.classList.remove(e)
                : (t.className = I(
                    (' ' + t.className + ' ').replace(' ' + e + ' ', ' ')
                  ))
            }
            function R (t, e) {
              return 0 !== t[e] || ((t[e] = 1), 1 === t[e] && ((t[e] = 0), !0))
            }
            function N (t) {
              return (
                (M(window.getComputedStyle)
                  ? window.getComputedStyle(t, null)
                  : t.currentStyle) || {}
              )
            }
            function H (t, e, i) {
              return t.elementsFromPoint(e, i)
            }
            function z (t, e) {
              return e.reduce(function (e, i) {
                return (e[i] = t[s].getPropertyValue(i)), e
              }, {})
            }
            function W (t, i, n) {
              ;(n = n || t[e][s]),
                i.forEach(function (e) {
                  S.call(n, e) && '' !== n[e]
                    ? (t[s][e] = n[e])
                    : t[s].removeProperty(e)
                })
            }
            function V (t, i, n) {
              if (0 < i) {
                t[e] && t[e].animation && t[e].animation.stop()
                var r = 'transform ' + w(i) + 'ms',
                  a = 'translate3d(0,0,0)',
                  l = null,
                  c = function i () {
                    l && clearTimeout(l),
                      (l = null),
                      t[e] &&
                        t[e].animation &&
                        i === t[e].animation.stop &&
                        (t[e].animation = null),
                      t[s].transform === a &&
                        t[s].transition === r &&
                        ((t[s].transition = 'none'), (t[s].transform = 'none'))
                  }
                ;(t[s].transition = 'none'),
                  (t[s].transform =
                    'translate3d(' +
                    w(-(n[o] || 0)) +
                    'px,' +
                    w(-(n[h] || 0)) +
                    'px,0)'),
                  (function (t) {
                    t.offsetWidth
                  })(t),
                  (t[s].transform = a),
                  (t[s].transition = r),
                  (l = setTimeout(c, i)),
                  (t[e].animation = { stop: c })
              }
              return t
            }
            function U (t, n, s, r, a) {
              var o = t[e].r,
                l = n[e][i]
              return x.max(
                0,
                x.min(
                  1,
                  x.max(
                    0,
                    x.min(o[r] + o[a], l[r] - s[r] + l[a]) -
                      x.max(o[r], l[r] - s[r])
                  ) / x.min(o[a], l[a])
                )
              )
            }
            function Y (t, n, s, r, a) {
              var l,
                d,
                f = t[e].r,
                p = n[e][i]
              return (
                (l = x.max(
                  0,
                  x.min(f[o] + f[c], p[o] - s[o] + p[c]) -
                    x.max(f[o], p[o] - s[o])
                )),
                (d = x.max(
                  0,
                  x.min(f[h] + f[u], p[h] - s[h] + p[u]) -
                    x.max(f[h], p[h] - s[h])
                )),
                x.max(
                  0,
                  x.min(1, (l * d) / (x.min(f[c], p[c]) * x.min(f[u], p[u])))
                )
              )
            }
            function G (t, S) {
              var T,
                E,
                I,
                O,
                _,
                G,
                q,
                X,
                Z,
                J,
                Q,
                K,
                $,
                tt,
                et,
                it,
                nt,
                st,
                rt,
                at,
                ot,
                lt,
                ct,
                ht,
                dt,
                ut,
                ft,
                pt,
                gt = !1,
                mt = !1,
                vt = !1,
                bt = !1,
                yt = null,
                xt = null,
                wt = !1,
                Ct = b === S ? c : u,
                St = b === S ? o : h,
                Tt = o === St ? l : d,
                Et = function () {
                  ;(T = null),
                    (E = null),
                    (I = null),
                    (O = null),
                    (_ = null),
                    (G = null),
                    (Z = null),
                    (J = null),
                    (Q = null),
                    (q = null),
                    (X = null),
                    (pt = null),
                    (dt = !1),
                    (ht = 0)
                },
                At = function () {
                  vt &&
                    (xt && (clearInterval(xt), (xt = null)),
                    bt
                      ? (L(pt, 'touchmove', _t, !1),
                        L(pt, 'touchend', Lt, !1),
                        L(pt, 'touchcancel', Lt, !1))
                      : (L(pt, 'mousemove', _t, !1), L(pt, 'mouseup', Lt, !1)),
                    yt && (clearInterval(yt), (yt = null)),
                    T &&
                      T.parentNode &&
                      (T.parentNode.removeChild(T), (T[e] = null)),
                    j(Q, t.options.activeArea || 'dnd-sortable-area'),
                    W(
                      Q,
                      [
                        'width',
                        'height',
                        'max-width',
                        'max-height',
                        'box-sizing',
                        'padding-left',
                        'padding-top',
                        'padding-right',
                        'padding-bottom'
                      ],
                      Q[e].style
                    ),
                    O && j(O, t.options.closestItem || 'dnd-sortable-closest'),
                    j(E, t.options.activeItem || 'dnd-sortable-dragged'),
                    q.forEach(function (t) {
                      W(t, [
                        'position',
                        'box-sizing',
                        'overflow',
                        'top',
                        'left',
                        'width',
                        'height',
                        'transform',
                        'transition'
                      ]),
                        (t[e] = null)
                    }),
                    (Q[e] = null),
                    J && (J[e] = null),
                    (vt = !1))
                },
                It = function (i, n, s) {
                  0 > s
                    ? (_ === n && (_ = i),
                      G === i && (G = T[p]),
                      Q.insertBefore(i, n))
                    : 0 < s &&
                      (_ === i && (_ = i[f]),
                      n[f]
                        ? Q.insertBefore(i, n[f])
                        : (Q.appendChild(i), (G = i))),
                    (i[e].index = n[e].index),
                    Q.insertBefore(T, i),
                    M(t.options.onChange) && t.options.onChange(i)
                }
              ;(ut =
                y === S
                  ? function (t, g, m, v) {
                      var b,
                        y,
                        C,
                        S = g
                      if (wt) {
                        if (0 > m) {
                          for (
                            C = t[f],
                              It(t, g, m),
                              t[e].prev.line = t[e].line,
                              t[e].prev[h] = t[e][i][h],
                              t[e].prev[o] = t[e][i][o],
                              t[e].line = g[e].line,
                              t[e][i][h] = g[e][i][h],
                              t[e][i][o] = g[e][i][o],
                              T[s][h] =
                                w(t[e][i][h] - Q[e][i][h] + Q[e][n][h]) + 'px',
                              T[s][o] =
                                w(t[e][i][o] - Q[e][i][o] + Q[e][n][o]) + 'px';
                            (y = g[f]) && y !== C;

                          )
                            g[e].animation && g[e].animation.stop(),
                              g[e].index++,
                              (g[e].prev.line = g[e].line),
                              (g[e].prev[h] = g[e][i][h]),
                              (g[e].prev[o] = g[e][i][o]),
                              (g[e].line = y[e].line),
                              (g[e][i][h] = y[e][i][h]),
                              (g[e][i][o] = y[e][i][o]),
                              (g[s][h] =
                                w(
                                  g[e][i][h] -
                                    Q[e][i][h] +
                                    Q[e][n][h] -
                                    g[e][r][h]
                                ) + 'px'),
                              (g[s][o] =
                                w(
                                  g[e][i][o] -
                                    Q[e][i][o] +
                                    Q[e][n][o] -
                                    g[e][r][o]
                                ) + 'px'),
                              (g = y)
                          g[e].animation && g[e].animation.stop(),
                            g[e].index++,
                            (g[e].prev.line = g[e].line),
                            (g[e].prev[h] = g[e][i][h]),
                            (g[e].prev[o] = g[e][i][o]),
                            (g[e].line = t[e].prev.line),
                            (g[e][i][h] = t[e].prev[h]),
                            (g[e][i][o] = t[e].prev[o]),
                            (g[s][h] =
                              w(
                                g[e][i][h] -
                                  Q[e][i][h] +
                                  Q[e][n][h] -
                                  g[e][r][h]
                              ) + 'px'),
                            (g[s][o] =
                              w(
                                g[e][i][o] -
                                  Q[e][i][o] +
                                  Q[e][n][o] -
                                  g[e][r][o]
                              ) + 'px')
                        } else if (0 < m) {
                          ;(C = t[f]),
                            It(t, g, m),
                            (g = C),
                            ((y = t)[e].prev.line = y[e].line),
                            (y[e].prev[h] = y[e][i][h]),
                            (y[e].prev[o] = y[e][i][o])
                          do {
                            g[e].animation && g[e].animation.stop(),
                              g[e].index--,
                              (g[e].prev.line = g[e].line),
                              (g[e].prev[h] = g[e][i][h]),
                              (g[e].prev[o] = g[e][i][o]),
                              (g[e].line = y[e].prev.line),
                              (g[e][i][h] = y[e].prev[h]),
                              (g[e][i][o] = y[e].prev[o]),
                              (g[s][h] =
                                w(
                                  g[e][i][h] -
                                    Q[e][i][h] +
                                    Q[e][n][h] -
                                    g[e][r][h]
                                ) + 'px'),
                              (g[s][o] =
                                w(
                                  g[e][i][o] -
                                    Q[e][i][o] +
                                    Q[e][n][o] -
                                    g[e][r][o]
                                ) + 'px'),
                              (y = g),
                              (g = g[f])
                          } while (g && g !== T)
                          ;(t[e].line = y[e].prev.line),
                            (t[e][i][h] = y[e].prev[h]),
                            (t[e][i][o] = y[e].prev[o]),
                            (T[s][h] =
                              w(t[e][i][h] - Q[e][i][h] + Q[e][n][h]) + 'px'),
                            (T[s][o] =
                              w(t[e][i][o] - Q[e][i][o] + Q[e][n][o]) + 'px')
                        }
                        V(S, v, {
                          top: S[e][i][h] - S[e].prev[h],
                          left: S[e][i][o] - S[e].prev[o]
                        })
                      } else
                        0 > m
                          ? ((y = T[p]), (C = g[p] || g), It(t, g, m))
                          : 0 < m &&
                            ((y = t[f]), (C = T[p] || t[f]), It(t, g, m)),
                          (function (t, i, n, s) {
                            for (t = t[0 > n ? f : p]; t; ) {
                              if (
                                (t !== s && (t[e].index += 0 > n ? 1 : -1),
                                t === i)
                              )
                                return
                              t = t[0 > n ? f : p]
                            }
                          })(t, y, m, T),
                          (function (t, o, l, c, h, d, u, p, g) {
                            for (var m, v = 0; t; )
                              t !== h &&
                                (t[e] &&
                                  t[e].animation &&
                                  t[e].animation.stop(),
                                (m = t[e][r][u] + t[e][i][p] + t[e][r][g]),
                                0 < v &&
                                  l[e][a][u] + v + m + l[e][a][g] >
                                    l[e][i][p] &&
                                  (o++, (v = 0)),
                                (t[e].line = o),
                                (t[e].prev[u] = t[e][i][u]),
                                (t[e][i][u] =
                                  l[e][i][u] -
                                  l[e][n][u] +
                                  l[e][a][u] +
                                  v +
                                  t[e][r][u]),
                                ((t === c ? h : t)[s][u] =
                                  w(
                                    t[e][i][u] -
                                      l[e][i][u] +
                                      l[e][n][u] -
                                      (t === c ? 0 : t[e][r][u])
                                  ) + 'px'),
                                (v += m)),
                                (t = t[f])
                          })(
                            (C = (function (t, i) {
                              for (
                                var n;
                                (n = t[p]) && n[e] && n[e].line >= i;

                              )
                                t = n
                              return t
                            })(C, (b = C[e].line))),
                            b,
                            Q,
                            t,
                            T,
                            0,
                            o,
                            c,
                            l
                          ),
                          (function (t, a, o, l, c, h, d, u, p) {
                            for (var g, m, v, b = t, y = t[e].line, C = 0; t; )
                              t !== c &&
                                ((g = t[e].line),
                                (v = t[e][r][d] + t[e][i][u] + t[e][r][p]),
                                g === y
                                  ? (C = x.max(C, v))
                                  : ((a[g] = a[y] + C), (y = g), (C = v))),
                                (t = t[f])
                            for (0 < C && (a[y + 1] = a[y] + C), t = b; t; )
                              t !== c &&
                                ((m = a[(g = t[e].line)]),
                                (t[e].prev[d] = t[e][i][d]),
                                'bottom' === t[e].$.verticalAlign
                                  ? (t[e][i][d] =
                                      o[e][i][d] -
                                      o[e][n][d] +
                                      a[g + 1] -
                                      t[e][i][u] -
                                      t[e][r][p])
                                  : (t[e][i][d] =
                                      o[e][i][d] - o[e][n][d] + m + t[e][r][d]),
                                ((t === l ? c : t)[s][d] =
                                  w(
                                    t[e][i][d] -
                                      (t === l ? 0 : t[e][r][d]) -
                                      o[e][i][d] +
                                      o[e][n][d]
                                  ) + 'px')),
                                (t = t[f])
                          })(C, X, Q, t, T, 0, h, u, d),
                          V(S, v, {
                            top: S[e][i][h] - S[e].prev[h],
                            left: S[e][i][o] - S[e].prev[o]
                          })
                    }
                  : function (t, a, o, l) {
                      var c,
                        h,
                        d,
                        u = a,
                        p = 0,
                        g = 0
                      if (0 > o) {
                        for (
                          h = t[f],
                            It(t, a, o),
                            t[e].prev[St] = t[e][i][St],
                            g = t[e][r][St] - a[e][r][St],
                            t[e][i][St] = a[e][i][St] + g,
                            T[s][St] =
                              w(t[e][i][St] - Q[e][i][St] + Q[e][n][St]) + 'px',
                            p = t[e][i][Ct] - a[e][i][Ct],
                            g += t[e][r][Tt] - a[e][r][Tt];
                          (c = a[f]) && c !== h;

                        )
                          a[e].animation && a[e].animation.stop(),
                            a[e].index++,
                            (a[e].prev[St] = a[e][i][St]),
                            (g += a[e][r][St] - c[e][r][St]),
                            (a[e][i][St] = c[e][i][St] + p + g),
                            (g += a[e][r][Tt] - c[e][r][Tt]),
                            (a[s][St] =
                              w(
                                a[e][i][St] -
                                  Q[e][i][St] +
                                  Q[e][n][St] -
                                  a[e][r][St]
                              ) + 'px'),
                            (p += a[e][i][Ct] - c[e][i][Ct]),
                            (a = c)
                        a[e].animation && a[e].animation.stop(),
                          a[e].index++,
                          (a[e].prev[St] = a[e][i][St]),
                          (a[e][i][St] =
                            t[e].prev[St] + p + g - t[e][r][St] + a[e][r][St]),
                          (a[s][St] =
                            w(
                              a[e][i][St] -
                                Q[e][i][St] +
                                Q[e][n][St] -
                                a[e][r][St]
                            ) + 'px')
                      } else if (0 < o) {
                        ;(h = t[f]),
                          It(t, a, o),
                          (a = h),
                          (g = 0),
                          (p = 0),
                          ((c = t)[e].prev[St] = c[e][i][St])
                        do {
                          a[e].animation && a[e].animation.stop(),
                            a[e].index--,
                            (a[e].prev[St] = a[e][i][St]),
                            (g += a[e][r][St] - c[e][r][St]),
                            (a[e][i][St] = c[e].prev[St] + p + g),
                            (a[s][St] =
                              w(
                                a[e][i][St] -
                                  Q[e][i][St] +
                                  Q[e][n][St] -
                                  a[e][r][St]
                              ) + 'px'),
                            (p += -(c[e][i][Ct] - a[e][i][Ct])),
                            (g += a[e][r][Tt] - c[e][r][Tt]),
                            (c = a),
                            (a = a[f])
                        } while (a && a !== T)
                        ;(t[e][i][St] =
                          c[e].prev[St] + p + g - c[e][r][St] + t[e][r][St]),
                          (T[s][St] =
                            w(t[e][i][St] - Q[e][i][St] + Q[e][n][St]) + 'px')
                      }
                      ;((d = {})[St] = u[e][i][St] - u[e].prev[St]), V(u, l, d)
                    }),
                (ft = y === S ? Y : U)
              var Ot,
                kt,
                Mt,
                Pt = function (f) {
                  mt &&
                    !vt &&
                    t.options.container &&
                    ((A.test(f.type) && 0 !== f.button) ||
                      (Et(),
                      (I = f.target) &&
                      B(I, t.options.handle || 'dnd-sortable-handle') &&
                      (E = (function (t, e) {
                        if (t.closest) return t.closest('.' + e)
                        for (; t; ) {
                          if (B(t, e)) return t
                          t = t.parentNode
                        }
                      })(I, t.options.item || 'dnd-sortable-item'))
                        ? !(Q = E.parentNode) ||
                          (P(t.options.container) &&
                            Q.id !== t.options.container) ||
                          (!P(t.options.container) && Q !== t.options.container)
                          ? Et()
                          : (M(t.options.onStart) && t.options.onStart(E),
                            !M(t.options.itemFilter) ||
                            (E = t.options.itemFilter(E))
                              ? ((vt = !0),
                                (pt = E.ownerDocument || document),
                                f.preventDefault && f.preventDefault(),
                                f.stopPropagation && f.stopPropagation(),
                                f.stopImmediatePropagation &&
                                  f.stopImmediatePropagation(),
                                (bt = f.touches && f.touches.length),
                                (function () {
                                  var f = 0,
                                    p = 0,
                                    y = o,
                                    A = c,
                                    I = l,
                                    O = (Q.tagName || '').toLowerCase()
                                  if (
                                    ((Z = (function (t) {
                                      return (
                                        t.scrollingElement ||
                                        t.documentElement ||
                                        t.body
                                      )
                                    })(pt)),
                                    (J = null),
                                    t.options.autoscroll)
                                  )
                                    for (
                                      J = Q;
                                      J &&
                                      !(
                                        Z === J ||
                                        (b !== S &&
                                          J.scrollHeight > J.clientHeight &&
                                          R(J, g)) ||
                                        (v !== S &&
                                          J.scrollWidth > J.clientWidth &&
                                          R(J, m))
                                      );

                                    )
                                      J = J.parentNode
                                  ;(Q[e] = {
                                    rect: Q.getBoundingClientRect(),
                                    scroll: {
                                      top: Q[g] || 0,
                                      left: Q[m] || 0,
                                      width: Q.scrollWidth,
                                      height: Q.scrollHeight,
                                      top0: Q[g] || 0,
                                      left0: Q[m] || 0
                                    },
                                    $: N(Q),
                                    style: z(Q, [
                                      'width',
                                      'height',
                                      'max-width',
                                      'max-height',
                                      'box-sizing',
                                      'padding-left',
                                      'padding-top',
                                      'padding-right',
                                      'padding-bottom'
                                    ])
                                  }),
                                    (Q[e][a] = {
                                      left: C(Q[e].$.paddingLeft) || 0,
                                      right: C(Q[e].$.paddingRight) || 0
                                    }),
                                    J &&
                                      J !== Q &&
                                      (J[e] = {
                                        rect: J.getBoundingClientRect(),
                                        scroll: {
                                          top: J[g] || 0,
                                          left: J[m] || 0,
                                          width: J.scrollWidth,
                                          height: J.scrollHeight,
                                          top0: J[g] || 0,
                                          left0: J[m] || 0
                                        }
                                      }),
                                    (q = [].map.call(
                                      Q.children,
                                      function (t, n) {
                                        var s,
                                          l = t.getBoundingClientRect(),
                                          d = N(t)
                                        return (
                                          (t[e] = {
                                            index: n,
                                            line: 0,
                                            prev: {},
                                            rect: {
                                              top: l[h],
                                              left: l[o],
                                              width: l[c],
                                              height: l[u]
                                            },
                                            r: {
                                              top: l[h],
                                              left: l[o],
                                              width: l[c],
                                              height: l[u]
                                            },
                                            margin: {
                                              top: C(d.marginTop) || 0,
                                              right: C(d.marginRight) || 0,
                                              bottom: C(d.marginBottom) || 0,
                                              left: C(d.marginLeft) || 0
                                            },
                                            $: d,
                                            style: z(t, [
                                              'position',
                                              'box-sizing',
                                              'overflow',
                                              'top',
                                              'left',
                                              'width',
                                              'height',
                                              'transform',
                                              'transition'
                                            ]),
                                            animation: null
                                          }),
                                          (s =
                                            t[e][r][y] +
                                            t[e][i][A] +
                                            t[e][r][I]),
                                          0 < p &&
                                            Q[e][a][y] + p + s + Q[e][a][I] >
                                              Q[e][i][A] &&
                                            (f++, (p = 0)),
                                          (t[e].line = f),
                                          (p += s),
                                          t
                                        )
                                      }
                                    )).length &&
                                      ((_ = q[0]), (G = q[q.length - 1])),
                                    (y = h),
                                    (A = u),
                                    (I = d),
                                    (X = new Array(q.length)),
                                    q.forEach(function (t) {
                                      var s = t[e].line,
                                        a =
                                          t[e][i][y] -
                                          t[e][r][y] -
                                          Q[e][i][y] +
                                          Q[e][n][y]
                                      X[s] = null == X[s] ? a : x.min(a, X[s])
                                    }),
                                    F(
                                      Q,
                                      t.options.activeArea ||
                                        'dnd-sortable-area'
                                    ),
                                    (Q[s].boxSizing = 'border-box'),
                                    (Q[s][c] = w(Q[e][i][c]) + 'px'),
                                    (Q[s][u] = w(Q[e][i][u]) + 'px'),
                                    (Q[s].maxWidth = w(Q[e][i][c]) + 'px'),
                                    (Q[s].maxHeight = w(Q[e][i][u]) + 'px'),
                                    (E.draggable = !1),
                                    F(
                                      E,
                                      t.options.activeItem ||
                                        'dnd-sortable-dragged'
                                    ),
                                    (wt = !0),
                                    q.forEach(function (t) {
                                      var a = q[0]
                                      ;(t[s].position = 'absolute'),
                                        (t[s].boxSizing = 'border-box'),
                                        (t[s].overflow = 'hidden'),
                                        (t[s][h] =
                                          w(
                                            t[e][i][h] -
                                              Q[e][i][h] +
                                              Q[e][n][h] -
                                              t[e][r][h]
                                          ) + 'px'),
                                        (t[s][o] =
                                          w(
                                            t[e][i][o] -
                                              Q[e][i][o] +
                                              Q[e][n][o] -
                                              t[e][r][o]
                                          ) + 'px'),
                                        (t[s][c] = w(t[e][i][c]) + 'px'),
                                        (t[s][u] = w(t[e][i][u]) + 'px'),
                                        (t[e][i][c] === a[e][i][c] &&
                                          t[e][i][u] === a[e][i][u] &&
                                          t[e][r][h] === a[e][r][h] &&
                                          t[e][r][d] === a[e][r][d] &&
                                          t[e][r][o] === a[e][r][o] &&
                                          t[e][r][l] === a[e][r][l]) ||
                                          (wt = !1)
                                    }),
                                    F(
                                      (T = pt.createElement(
                                        'ul' === O || 'ol' === O
                                          ? 'li'
                                          : 'tr' === O
                                          ? 'td'
                                          : 'tbody' === O ||
                                            'thead' === O ||
                                            'tfoot' === O ||
                                            'table' === O
                                          ? 'tr'
                                          : 'span'
                                      )),
                                      t.options.placeholder ||
                                        'dnd-sortable-placeholder'
                                    ),
                                    (T[s].position = 'absolute'),
                                    (T[s].display = 'block'),
                                    (T[s].boxSizing = 'border-box'),
                                    (T[s].margin = '0'),
                                    Q === J &&
                                      ((Q[s].paddingLeft =
                                        w(Q[e][n][c] - Q[e][i][c]) + 'px'),
                                      (Q[s].paddingTop =
                                        w(Q[e][n][u] - Q[e][i][u]) + 'px'),
                                      (Q[s].paddingRight = '0px'),
                                      (Q[s].paddingBottom = '0px'),
                                      (Q[m] = Q[e][n][o]),
                                      (Q[g] = Q[e][n][h])),
                                    bt
                                      ? (D(pt, 'touchmove', _t, !1),
                                        D(pt, 'touchend', Lt, !1),
                                        D(pt, 'touchcancel', Lt, !1))
                                      : (D(pt, 'mousemove', _t, !1),
                                        D(pt, 'mouseup', Lt, !1)),
                                    (yt = setInterval(Dt, 60))
                                })(),
                                (at = tt =
                                  bt ? f.touches[0].clientX : f.clientX),
                                (ot = et =
                                  bt ? f.touches[0].clientY : f.clientY),
                                (K = tt),
                                ($ = et),
                                (it = 0),
                                (nt = 0),
                                (st = 0),
                                (rt = 0),
                                Q.insertBefore(T, E),
                                (T[s][c] = w(E[e][i][c]) + 'px'),
                                (T[s][u] = w(E[e][i][u]) + 'px'),
                                (T[s][h] =
                                  w(E[e][i][h] - Q[e][i][h] + Q[e][n][h]) +
                                  'px'),
                                (T[s][o] =
                                  w(E[e][i][o] - Q[e][i][o] + Q[e][n][o]) +
                                  'px'),
                                b !== S &&
                                  (E[s][h] =
                                    w(
                                      et -
                                        $ +
                                        E[e][i][h] -
                                        Q[e][i][h] +
                                        Q[e][n][h] -
                                        E[e][r][h]
                                    ) + 'px'),
                                v !== S &&
                                  (E[s][o] =
                                    w(
                                      tt -
                                        K +
                                        E[e][i][o] -
                                        Q[e][i][o] +
                                        Q[e][n][o] -
                                        E[e][r][o]
                                    ) + 'px'))
                              : Et())
                        : Et()))
                },
                _t =
                  ((Ot = function (t) {
                    ;(at = bt ? t.touches[0].clientX : t.clientX),
                      (ot = bt ? t.touches[0].clientY : t.clientY)
                  }),
                  (kt = 60),
                  (Mt = !1),
                  function () {
                    Mt ||
                      (Ot.apply(this, arguments),
                      (Mt = !0),
                      setTimeout(function () {
                        Mt = !1
                      }, kt))
                  }),
                Dt = function () {
                  var a,
                    f,
                    p,
                    C,
                    A,
                    I,
                    M,
                    P,
                    D,
                    L,
                    B,
                    R,
                    N,
                    z,
                    W,
                    V = 0,
                    Y = h,
                    q = u,
                    X = o,
                    gt = c,
                    mt = 0,
                    vt = 0,
                    bt = !1,
                    yt = !1
                  v === S && ((X = h), (gt = u)),
                    (C = (p = at) - tt),
                    (A = (f = ot) - et),
                    (it = 0 === it ? C : it),
                    (nt = 0 === nt ? A : nt),
                    (st = 0 !== C ? k(C) : 0 !== it ? k(it) : st),
                    (rt = 0 !== A ? k(A) : 0 !== nt ? k(nt) : rt),
                    (tt = p),
                    (et = f),
                    (lt = (function (t, i) {
                      return i
                        ? {
                            top: i[g] - i[e][n].top0 || 0,
                            left: i[m] - i[e][n].left0 || 0
                          }
                        : { top: 0, left: 0 }
                    })(0, J)),
                    b !== S &&
                      ((E[e].r[h] = et - $ + E[e][i][h]),
                      (E[s][h] =
                        w(
                          E[e].r[h] -
                            Q[e][i][h] +
                            Q[e][n][h] -
                            E[e][r][h] +
                            lt[h]
                        ) + 'px'),
                      (yt = 0 > A * nt)),
                    v !== S &&
                      ((E[e].r[o] = tt - K + E[e][i][o]),
                      (E[s][o] =
                        w(
                          E[e].r[o] -
                            Q[e][i][o] +
                            Q[e][n][o] -
                            E[e][r][o] +
                            lt[o]
                        ) + 'px'),
                      (bt = 0 > C * it)),
                    t.options.autoscroll &&
                      J &&
                      (!xt || bt || yt) &&
                      (xt && (clearInterval(xt), (xt = null)),
                      Z === J
                        ? ((L = J[e][i][c]),
                          (B = 0),
                          (R = J[e][i][u]),
                          (N = 0),
                          (z = 1.5),
                          (W = 1.5))
                        : ((L = J[e][i][l]),
                          (B = J[e][i][o]),
                          (R = J[e][i][d]),
                          (N = J[e][i][h]),
                          (z = 1.2),
                          (W = 1.2)),
                      v !== S &&
                        ((0 < st &&
                          J[m] + J[e][i][c] < J[e][n][c] &&
                          E[e].r[o] + E[e].r[c] >= L) ||
                          (0 > st && 0 < J[m] && E[e].r[o] <= B)) &&
                        (mt = x.round(st * z * E[e].r[c])),
                      b !== S &&
                        ((0 < rt &&
                          J[g] + J[e][i][u] < J[e][n][u] &&
                          E[e].r[h] + E[e].r[u] >= R) ||
                          (0 > rt && 0 < J[g] && E[e].r[h] <= N)) &&
                        (vt = x.round(rt * W * E[e].r[u])),
                      (mt || vt) &&
                        (xt = (function (t, s, r, a) {
                          var o = J[g] || 0,
                            l = J[m] || 0,
                            h = 0,
                            d = t / (r || a),
                            f = s / (r || a)
                          return setInterval(function () {
                            ;(h += a),
                              (o += f * a),
                              (l += d * a),
                              (J[g] = x.min(
                                x.max(0, o),
                                J[e][n][u] - J[e][i][u]
                              )),
                              (J[m] = x.min(
                                x.max(0, l),
                                J[e][n][c] - J[e][i][c]
                              )),
                              xt && h >= r && (clearInterval(xt), (xt = null))
                          }, a)
                        })(
                          x.abs(mt) > x.abs(vt) ? mt : 0,
                          x.abs(vt) >= x.abs(mt) ? vt : 0,
                          t.options.scrollAnimationMs || 0,
                          16.666666666666668
                        ))),
                    (it = C),
                    (nt = A),
                    (M = E[e].r[o] + E[e].r[c] / 2),
                    (P = E[e].r[h] + E[e].r[u] / 2),
                    (D = E[e].r[X]),
                    (a = (function (t) {
                      for (var e = 1, i = arguments, n = i.length; e < n; ++e)
                        t.push.apply(t, i[e])
                      return t
                    })(
                      H(pt, p, f),
                      v === S ? [] : H(pt, E[e].r[o] + 2, P),
                      v === S ? [] : H(pt, E[e].r[o] + E[e].r[c] - 2, P),
                      b === S ? [] : H(pt, M, E[e].r[h] + 2),
                      b === S ? [] : H(pt, M, E[e].r[h] + E[e].r[u] - 2)
                    ).reduce(function (t, e) {
                      if (e !== E && e !== T && e.parentNode === Q) {
                        var i = ft(E, e, lt, St, Ct)
                        i > V && ((V = i), (t = e))
                      }
                      return t
                    }, null)),
                    y === S
                      ? (!a &&
                          E !== _ &&
                          0 <= _[e][i][X] - lt[X] - (D + E[e][i][gt]) &&
                          _[e][i][X] - lt[X] - (D + E[e][i][gt]) < 25 &&
                          0.7 < (V = U(E, _, lt, Y, q)) &&
                          (a = _),
                        !a &&
                          E !== G &&
                          0 <= D - (G[e][i][X] - lt[X] + G[e][i][gt]) &&
                          D - (G[e][i][X] - lt[X] + G[e][i][gt]) < 25 &&
                          0.7 < (V = U(E, G, lt, Y, q)) &&
                          (a = G),
                        (I = a
                          ? a[e].index - E[e].index
                          : x.abs(rt) >= x.abs(st)
                          ? rt
                          : st))
                      : (!a &&
                          E !== _ &&
                          _[e][i][X] - lt[X] > D + E[e][i][gt] &&
                          (a = _),
                        !a &&
                          E !== G &&
                          D > G[e][i][X] - lt[X] + G[e][i][gt] &&
                          (a = G),
                        (I = b === S ? st : rt)),
                    O &&
                      ((0 > ct && 0 < I && ht < 0.5) ||
                        (0 < ct && 0 > I && ht < 0.5) ||
                        (a && O !== a && ht < V) ||
                        !ft(E, O, lt, St, Ct)) &&
                      (j(O, t.options.closestItem || 'dnd-sortable-closest'),
                      (ht = 0),
                      (O = null)),
                    !O &&
                      a &&
                      V &&
                      ((O = a), (ct = 0 < I ? 1 : -1), (ht = V), (dt = !1)),
                    O &&
                      ((V = V || ft(E, O, lt, St, Ct))
                        ? ((ht = V),
                          V > 0.2
                            ? (F(
                                O,
                                t.options.closestItem || 'dnd-sortable-closest'
                              ),
                              V > 0.5 &&
                                !dt &&
                                ((K -= E[e][i][o]),
                                ($ -= E[e][i][h]),
                                (dt = !0),
                                ut(E, O, ct, t.options.animationMs || 0),
                                (K += E[e][i][o]),
                                ($ += E[e][i][h])))
                            : j(
                                O,
                                t.options.closestItem || 'dnd-sortable-closest'
                              ))
                        : (j(
                            O,
                            t.options.closestItem || 'dnd-sortable-closest'
                          ),
                          (ht = 0),
                          (O = null)))
                },
                Lt = function (e) {
                  var i = E
                  At(), Et(), M(t.options.onEnd) && t.options.onEnd(i)
                }
              ;(t.start = t.options.callable
                ? function () {
                    mt || ((gt = !1), (mt = !0), (t.handle = Pt))
                  }
                : function () {
                    mt ||
                      ((mt = !0),
                      gt ||
                        ((gt = !0),
                        D(document, 'touchstart', Pt, {
                          capture: !0,
                          passive: !1
                        }),
                        D(document, 'mousedown', Pt, {
                          capture: !0,
                          passive: !1
                        })))
                  }),
                (t.stop = function () {
                  ;(t.handle = null),
                    (mt = !1),
                    gt &&
                      (L(document, 'touchstart', Pt, {
                        capture: !0,
                        passive: !1
                      }),
                      L(document, 'mousedown', Pt, {
                        capture: !0,
                        passive: !1
                      }),
                      (gt = !1)),
                    At(),
                    Et()
                })
            }
            function q (t, e) {
              var i = this
              if (!(i instanceof q)) return new q(t, e)
              switch (((i.options = e || {}), (t = w(t)).toLowerCase())) {
                case 'unrestricted':
                  G(i, y)
                  break
                case 'horizontal':
                  G(i, b)
                  break
                case 'vertical':
                  G(i, v)
                  break
                default:
                  throw new TypeError('AreaSortable invalid sort mode:' + t)
              }
              i.start()
            }
            return (
              window.Element &&
                !S.call(window.Element.prototype, e) &&
                (window.Element.prototype[e] = null),
              (q.VERSION = '1.2.2'),
              (q.prototype = {
                constructor: q,
                options: null,
                start: null,
                handle: null,
                stop: null,
                dispose: function () {
                  var t = this
                  return (
                    t.stop && t.stop(),
                    (t.options = null),
                    (t.start = null),
                    (t.handle = null),
                    (t.stop = null),
                    t
                  )
                }
              }),
              q
            )
          })()
        })('undefined' != typeof self && self)
      },
      729: function (t, e) {
        var i, n
        void 0 ===
          (n =
            'function' ==
            typeof (i = function () {
              return function t (e, i, n) {
                var s,
                  r,
                  a = window,
                  o = 'application/octet-stream',
                  l = n || o,
                  c = e,
                  h = !i && !n && c,
                  d = document.createElement('a'),
                  u = function (t) {
                    return String(t)
                  },
                  f = a.Blob || a.MozBlob || a.WebKitBlob || u,
                  p = i || 'download'
                if (
                  ((f = f.call ? f.bind(a) : Blob),
                  'true' === String(this) &&
                    ((l = (c = [c, l])[0]), (c = c[1])),
                  h &&
                    h.length < 2048 &&
                    ((p = h.split('/').pop().split('?')[0]),
                    (d.href = h),
                    -1 !== d.href.indexOf(h)))
                ) {
                  var g = new XMLHttpRequest()
                  return (
                    g.open('GET', h, !0),
                    (g.responseType = 'blob'),
                    (g.onload = function (e) {
                      t(e.target.response, p, o)
                    }),
                    setTimeout(function () {
                      g.send()
                    }, 0),
                    g
                  )
                }
                if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(c)) {
                  if (!(c.length > 2096103.424 && f !== u))
                    return navigator.msSaveBlob
                      ? navigator.msSaveBlob(y(c), p)
                      : x(c)
                  l = (c = y(c)).type || o
                } else if (/([\x80-\xff])/.test(c)) {
                  for (
                    var m = 0, v = new Uint8Array(c.length), b = v.length;
                    m < b;
                    ++m
                  )
                    v[m] = c.charCodeAt(m)
                  c = new f([v], { type: l })
                }
                function y (t) {
                  for (
                    var e = t.split(/[:;,]/),
                      i = e[1],
                      n = ('base64' == e[2] ? atob : decodeURIComponent)(
                        e.pop()
                      ),
                      s = n.length,
                      r = 0,
                      a = new Uint8Array(s);
                    r < s;
                    ++r
                  )
                    a[r] = n.charCodeAt(r)
                  return new f([a], { type: i })
                }
                function x (t, e) {
                  if ('download' in d)
                    return (
                      (d.href = t),
                      d.setAttribute('download', p),
                      (d.className = 'download-js-link'),
                      (d.innerHTML = 'downloading...'),
                      (d.style.display = 'none'),
                      document.body.appendChild(d),
                      setTimeout(function () {
                        d.click(),
                          document.body.removeChild(d),
                          !0 === e &&
                            setTimeout(function () {
                              a.URL.revokeObjectURL(d.href)
                            }, 250)
                      }, 66),
                      !0
                    )
                  if (
                    /(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(
                      navigator.userAgent
                    )
                  )
                    return (
                      /^data:/.test(t) &&
                        (t = 'data:' + t.replace(/^data:([\w\/\-\+]+)/, o)),
                      window.open(t) ||
                        (confirm(
                          'Displaying New Document\n\nUse Save As... to download, then click back to return to this page.'
                        ) &&
                          (location.href = t)),
                      !0
                    )
                  var i = document.createElement('iframe')
                  document.body.appendChild(i),
                    !e &&
                      /^data:/.test(t) &&
                      (t = 'data:' + t.replace(/^data:([\w\/\-\+]+)/, o)),
                    (i.src = t),
                    setTimeout(function () {
                      document.body.removeChild(i)
                    }, 333)
                }
                if (
                  ((s = c instanceof f ? c : new f([c], { type: l })),
                  navigator.msSaveBlob)
                )
                  return navigator.msSaveBlob(s, p)
                if (a.URL) x(a.URL.createObjectURL(s), !0)
                else {
                  if ('string' == typeof s || s.constructor === u)
                    try {
                      return x('data:' + l + ';base64,' + a.btoa(s))
                    } catch (t) {
                      return x('data:' + l + ',' + encodeURIComponent(s))
                    }
                  ;((r = new FileReader()).onload = function (t) {
                    x(this.result)
                  }),
                    r.readAsDataURL(s)
                }
                return !0
              }
            })
              ? i.apply(e, [])
              : i) || (t.exports = n)
      },
      777: (t, e, i) => {
        var n,
          s,
          r,
          a,
          o,
          l,
          c,
          h,
          d,
          u,
          f,
          p,
          g,
          m,
          v,
          b,
          y,
          x,
          w,
          C,
          S,
          T,
          E = E || { version: '5.3.0' }
        if (
          ((e.fabric = E),
          'undefined' != typeof document && 'undefined' != typeof window)
        )
          document instanceof
          ('undefined' != typeof HTMLDocument ? HTMLDocument : Document)
            ? (E.document = document)
            : (E.document = document.implementation.createHTMLDocument('')),
            (E.window = window)
        else {
          var A = new (i(960).JSDOM)(
            decodeURIComponent(
              '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'
            ),
            {
              features: { FetchExternalResources: ['img'] },
              resources: 'usable'
            }
          ).window
          ;(E.document = A.document),
            (E.jsdomImplForWrapper = i(759).implForWrapper),
            (E.nodeCanvas = i(272).Canvas),
            (E.window = A),
            (DOMParser = E.window.DOMParser)
        }
        function I (t, e) {
          var i = t.canvas,
            n = e.targetCanvas,
            s = n.getContext('2d')
          s.translate(0, n.height), s.scale(1, -1)
          var r = i.height - n.height
          s.drawImage(i, 0, r, n.width, n.height, 0, 0, n.width, n.height)
        }
        function O (t, e) {
          var i = e.targetCanvas.getContext('2d'),
            n = e.destinationWidth,
            s = e.destinationHeight,
            r = n * s * 4,
            a = new Uint8Array(this.imageBuffer, 0, r),
            o = new Uint8ClampedArray(this.imageBuffer, 0, r)
          t.readPixels(0, 0, n, s, t.RGBA, t.UNSIGNED_BYTE, a)
          var l = new ImageData(o, n, s)
          i.putImageData(l, 0, 0)
        }
        ;(E.isTouchSupported =
          'ontouchstart' in E.window ||
          'ontouchstart' in E.document ||
          (E.window &&
            E.window.navigator &&
            E.window.navigator.maxTouchPoints > 0)),
          (E.isLikelyNode =
            'undefined' != typeof Buffer && 'undefined' == typeof window),
          (E.SHARED_ATTRIBUTES = [
            'display',
            'transform',
            'fill',
            'fill-opacity',
            'fill-rule',
            'opacity',
            'stroke',
            'stroke-dasharray',
            'stroke-linecap',
            'stroke-dashoffset',
            'stroke-linejoin',
            'stroke-miterlimit',
            'stroke-opacity',
            'stroke-width',
            'id',
            'paint-order',
            'vector-effect',
            'instantiated_by_use',
            'clip-path'
          ]),
          (E.DPI = 96),
          (E.reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)'),
          (E.commaWsp = '(?:\\s+,?\\s*|,\\s*)'),
          (E.rePathCommand =
            /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/gi),
          (E.reNonWord = /[ \n\.,;!\?\-]/),
          (E.fontPaths = {}),
          (E.iMatrix = [1, 0, 0, 1, 0, 0]),
          (E.svgNS = 'http://www.w3.org/2000/svg'),
          (E.perfLimitSizeTotal = 2097152),
          (E.maxCacheSideLimit = 4096),
          (E.minCacheSideLimit = 256),
          (E.charWidthsCache = {}),
          (E.textureSize = 2048),
          (E.disableStyleCopyPaste = !1),
          (E.enableGLFiltering = !0),
          (E.devicePixelRatio =
            E.window.devicePixelRatio ||
            E.window.webkitDevicePixelRatio ||
            E.window.mozDevicePixelRatio ||
            1),
          (E.browserShadowBlurConstant = 1),
          (E.arcToSegmentsCache = {}),
          (E.boundsOfCurveCache = {}),
          (E.cachesBoundsOfCurve = !0),
          (E.forceGLPutImageData = !1),
          (E.initFilterBackend = function () {
            return E.enableGLFiltering &&
              E.isWebglSupported &&
              E.isWebglSupported(E.textureSize)
              ? (new E.WebglFilterBackend({ tileSize: E.textureSize }))
              : E.Canvas2dFilterBackend
              ? new E.Canvas2dFilterBackend()
              : void 0
          }),
          'undefined' != typeof document &&
            'undefined' != typeof window &&
            (window.fabric = E),
          (function () {
            function t (t, e) {
              if (this.__eventListeners[t]) {
                var i = this.__eventListeners[t]
                e ? (i[i.indexOf(e)] = !1) : E.util.array.fill(i, !1)
              }
            }
            function e (t, e) {
              var i = function () {
                e.apply(this, arguments), this.off(t, i)
              }.bind(this)
              this.on(t, i)
            }
            E.Observable = {
              fire: function (t, e) {
                if (!this.__eventListeners) return this
                var i = this.__eventListeners[t]
                if (!i) return this
                for (var n = 0, s = i.length; n < s; n++)
                  i[n] && i[n].call(this, e || {})
                return (
                  (this.__eventListeners[t] = i.filter(function (t) {
                    return !1 !== t
                  })),
                  this
                )
              },
              on: function (t, e) {
                if (
                  (this.__eventListeners || (this.__eventListeners = {}),
                  1 === arguments.length)
                )
                  for (var i in t) this.on(i, t[i])
                else
                  this.__eventListeners[t] || (this.__eventListeners[t] = []),
                    this.__eventListeners[t].push(e)
                return this
              },
              once: function (t, i) {
                if (1 === arguments.length)
                  for (var n in t) e.call(this, n, t[n])
                else e.call(this, t, i)
                return this
              },
              off: function (e, i) {
                if (!this.__eventListeners) return this
                if (0 === arguments.length)
                  for (e in this.__eventListeners) t.call(this, e)
                else if (
                  1 === arguments.length &&
                  'object' == typeof arguments[0]
                )
                  for (var n in e) t.call(this, n, e[n])
                else t.call(this, e, i)
                return this
              }
            }
          })(),
          (E.Collection = {
            _objects: [],
            add: function () {
              if (
                (this._objects.push.apply(this._objects, arguments),
                this._onObjectAdded)
              )
                for (var t = 0, e = arguments.length; t < e; t++)
                  this._onObjectAdded(arguments[t])
              return this.renderOnAddRemove && this.requestRenderAll(), this
            },
            insertAt: function (t, e, i) {
              var n = this._objects
              return (
                i ? (n[e] = t) : n.splice(e, 0, t),
                this._onObjectAdded && this._onObjectAdded(t),
                this.renderOnAddRemove && this.requestRenderAll(),
                this
              )
            },
            remove: function () {
              for (
                var t, e = this._objects, i = !1, n = 0, s = arguments.length;
                n < s;
                n++
              )
                -1 !== (t = e.indexOf(arguments[n])) &&
                  ((i = !0),
                  e.splice(t, 1),
                  this._onObjectRemoved && this._onObjectRemoved(arguments[n]))
              return (
                this.renderOnAddRemove && i && this.requestRenderAll(), this
              )
            },
            forEachObject: function (t, e) {
              for (var i = this.getObjects(), n = 0, s = i.length; n < s; n++)
                t.call(e, i[n], n, i)
              return this
            },
            getObjects: function (t) {
              return void 0 === t
                ? this._objects.concat()
                : this._objects.filter(function (e) {
                    return e.type === t
                  })
            },
            item: function (t) {
              return this._objects[t]
            },
            isEmpty: function () {
              return 0 === this._objects.length
            },
            size: function () {
              return this._objects.length
            },
            contains: function (t, e) {
              return (
                this._objects.indexOf(t) > -1 ||
                (!!e &&
                  this._objects.some(function (e) {
                    return 'function' == typeof e.contains && e.contains(t, !0)
                  }))
              )
            },
            complexity: function () {
              return this._objects.reduce(function (t, e) {
                return t + (e.complexity ? e.complexity() : 0)
              }, 0)
            }
          }),
          (E.CommonMethods = {
            _setOptions: function (t) {
              for (var e in t) this.set(e, t[e])
            },
            _initGradient: function (t, e) {
              !t ||
                !t.colorStops ||
                t instanceof E.Gradient ||
                this.set(e, new E.Gradient(t))
            },
            _initPattern: function (t, e, i) {
              !t || !t.source || t instanceof E.Pattern
                ? i && i()
                : this.set(e, new E.Pattern(t, i))
            },
            _setObject: function (t) {
              for (var e in t) this._set(e, t[e])
            },
            set: function (t, e) {
              return (
                'object' == typeof t ? this._setObject(t) : this._set(t, e),
                this
              )
            },
            _set: function (t, e) {
              this[t] = e
            },
            toggle: function (t) {
              var e = this.get(t)
              return 'boolean' == typeof e && this.set(t, !e), this
            },
            get: function (t) {
              return this[t]
            }
          }),
          (n = e),
          (s = Math.sqrt),
          (r = Math.atan2),
          (a = Math.pow),
          (o = Math.PI / 180),
          (l = Math.PI / 2),
          (E.util = {
            cos: function (t) {
              if (0 === t) return 1
              switch ((t < 0 && (t = -t), t / l)) {
                case 1:
                case 3:
                  return 0
                case 2:
                  return -1
              }
              return Math.cos(t)
            },
            sin: function (t) {
              if (0 === t) return 0
              var e = 1
              switch ((t < 0 && (e = -1), t / l)) {
                case 1:
                  return e
                case 2:
                  return 0
                case 3:
                  return -e
              }
              return Math.sin(t)
            },
            removeFromArray: function (t, e) {
              var i = t.indexOf(e)
              return -1 !== i && t.splice(i, 1), t
            },
            getRandomInt: function (t, e) {
              return Math.floor(Math.random() * (e - t + 1)) + t
            },
            degreesToRadians: function (t) {
              return t * o
            },
            radiansToDegrees: function (t) {
              return t / o
            },
            rotatePoint: function (t, e, i) {
              var n = new E.Point(t.x - e.x, t.y - e.y),
                s = E.util.rotateVector(n, i)
              return new E.Point(s.x, s.y).addEquals(e)
            },
            rotateVector: function (t, e) {
              var i = E.util.sin(e),
                n = E.util.cos(e)
              return { x: t.x * n - t.y * i, y: t.x * i + t.y * n }
            },
            createVector: function (t, e) {
              return new E.Point(e.x - t.x, e.y - t.y)
            },
            calcAngleBetweenVectors: function (t, e) {
              return Math.acos(
                (t.x * e.x + t.y * e.y) /
                  (Math.hypot(t.x, t.y) * Math.hypot(e.x, e.y))
              )
            },
            getHatVector: function (t) {
              return new E.Point(t.x, t.y).multiply(1 / Math.hypot(t.x, t.y))
            },
            getBisector: function (t, e, i) {
              var n = E.util.createVector(t, e),
                s = E.util.createVector(t, i),
                r = E.util.calcAngleBetweenVectors(n, s),
                a =
                  (r *
                    (0 ===
                    E.util.calcAngleBetweenVectors(E.util.rotateVector(n, r), s)
                      ? 1
                      : -1)) /
                  2
              return {
                vector: E.util.getHatVector(E.util.rotateVector(n, a)),
                angle: r
              }
            },
            projectStrokeOnPoints: function (t, e, i) {
              var n = [],
                s = e.strokeWidth / 2,
                r = e.strokeUniform
                  ? new E.Point(1 / e.scaleX, 1 / e.scaleY)
                  : new E.Point(1, 1),
                a = function (t) {
                  var e = s / Math.hypot(t.x, t.y)
                  return new E.Point(t.x * e * r.x, t.y * e * r.y)
                }
              return (
                t.length <= 1 ||
                  t.forEach(function (o, l) {
                    var c,
                      h,
                      d = new E.Point(o.x, o.y)
                    0 === l
                      ? ((h = t[l + 1]),
                        (c = i
                          ? a(E.util.createVector(h, d)).addEquals(d)
                          : t[t.length - 1]))
                      : l === t.length - 1
                      ? ((c = t[l - 1]),
                        (h = i
                          ? a(E.util.createVector(c, d)).addEquals(d)
                          : t[0]))
                      : ((c = t[l - 1]), (h = t[l + 1]))
                    var u,
                      f,
                      p = E.util.getBisector(d, c, h),
                      g = p.vector,
                      m = p.angle
                    if (
                      'miter' === e.strokeLineJoin &&
                      ((u = -s / Math.sin(m / 2)),
                      (f = new E.Point(g.x * u * r.x, g.y * u * r.y)),
                      Math.hypot(f.x, f.y) / s <= e.strokeMiterLimit)
                    )
                      return n.push(d.add(f)), void n.push(d.subtract(f))
                    ;(u = -s * Math.SQRT2),
                      (f = new E.Point(g.x * u * r.x, g.y * u * r.y)),
                      n.push(d.add(f)),
                      n.push(d.subtract(f))
                  }),
                n
              )
            },
            transformPoint: function (t, e, i) {
              return i
                ? new E.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y)
                : new E.Point(
                    e[0] * t.x + e[2] * t.y + e[4],
                    e[1] * t.x + e[3] * t.y + e[5]
                  )
            },
            makeBoundingBoxFromPoints: function (t, e) {
              if (e)
                for (var i = 0; i < t.length; i++)
                  t[i] = E.util.transformPoint(t[i], e)
              var n = [t[0].x, t[1].x, t[2].x, t[3].x],
                s = E.util.array.min(n),
                r = E.util.array.max(n) - s,
                a = [t[0].y, t[1].y, t[2].y, t[3].y],
                o = E.util.array.min(a)
              return {
                left: s,
                top: o,
                width: r,
                height: E.util.array.max(a) - o
              }
            },
            invertTransform: function (t) {
              var e = 1 / (t[0] * t[3] - t[1] * t[2]),
                i = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
                n = E.util.transformPoint({ x: t[4], y: t[5] }, i, !0)
              return (i[4] = -n.x), (i[5] = -n.y), i
            },
            toFixed: function (t, e) {
              return parseFloat(Number(t).toFixed(e))
            },
            parseUnit: function (t, e) {
              var i = /\D{0,2}$/.exec(t),
                n = parseFloat(t)
              switch ((e || (e = E.Text.DEFAULT_SVG_FONT_SIZE), i[0])) {
                case 'mm':
                  return (n * E.DPI) / 25.4
                case 'cm':
                  return (n * E.DPI) / 2.54
                case 'in':
                  return n * E.DPI
                case 'pt':
                  return (n * E.DPI) / 72
                case 'pc':
                  return ((n * E.DPI) / 72) * 12
                case 'em':
                  return n * e
                default:
                  return n
              }
            },
            falseFunction: function () {
              return !1
            },
            getKlass: function (t, e) {
              return (
                (t = E.util.string.camelize(
                  t.charAt(0).toUpperCase() + t.slice(1)
                )),
                E.util.resolveNamespace(e)[t]
              )
            },
            getSvgAttributes: function (t) {
              var e = ['instantiated_by_use', 'style', 'id', 'class']
              switch (t) {
                case 'linearGradient':
                  e = e.concat([
                    'x1',
                    'y1',
                    'x2',
                    'y2',
                    'gradientUnits',
                    'gradientTransform'
                  ])
                  break
                case 'radialGradient':
                  e = e.concat([
                    'gradientUnits',
                    'gradientTransform',
                    'cx',
                    'cy',
                    'r',
                    'fx',
                    'fy',
                    'fr'
                  ])
                  break
                case 'stop':
                  e = e.concat(['offset', 'stop-color', 'stop-opacity'])
              }
              return e
            },
            resolveNamespace: function (t) {
              if (!t) return E
              var e,
                i = t.split('.'),
                s = i.length,
                r = n || E.window
              for (e = 0; e < s; ++e) r = r[i[e]]
              return r
            },
            loadImage: function (t, e, i, n) {
              // if (t) {
              //   console.log('Image created:', s);
              //   var s = E.util.createImage(),
              //     r = function () {
              //       e && e.call(i, s, !1), (s = s.onload = s.onerror = null)
              //     }
              //   ;(s.onload = r),
              //     (s.onerror = function () {
              //       E.log('Error loading ' + s.src),
              //         e && e.call(i, null, !0),
              //         (s = s.onload = s.onerror = null)
              //     }),
              //     0 !== t?.indexOf('data') && null != n && (s.crossOrigin = n),
              //     'data:image/svg' === t.substring(0, 14) &&
              //       ((s.onload = null), E.util.loadImageInDom(s, r)),
              //     (s.src = t)
              // }
              if (t && 'string' != typeof t) {
                console.error('loadImage called with a non-string source:', t);
                e && e.call(i, null, !0);
              }

              else if (t) {
                var s = E.util.createImage();
                ;

                var r = function () {
                  ;
                  e && e.call(i, s, !1);
                  s = s.onload = s.onerror = null;
                };

                s.onload = r;

                s.onerror = function () {
                  console.error('Error loading image:', s.src, s);
                  E.log('Error loading ' + s.src);
                  e && e.call(i, null, !0);
                  s = s.onload = s.onerror = null;
                };

                if (0 !== t?.indexOf('data') && n != null) {
                  s.crossOrigin = n;
                }

                if ('data:image/svg' === t.substring(0, 14)) {
                  s.onload = null;
                  E.util.loadImageInDom(s, r);
                }

                s.src = t;
              }

              else e && e.call(i, t)
            },
            loadImageInDom: function (t, e) {
              var i = E.document.createElement('div')
              ;(i.style.width = i.style.height = '1px'),
                (i.style.left = i.style.top = '-100%'),
                (i.style.position = 'absolute'),
                i.appendChild(t),
                E.document.querySelector('body').appendChild(i),
                (t.onload = function () {
                  e(), i.parentNode.removeChild(i), (i = null)
                })
            },
            enlivenObjects: function (t, e, i, n) {
              var s = [],
                r = 0,
                a = (t = t || []).length
              function o () {
                ++r === a &&
                  e &&
                  e(
                    s.filter(function (t) {
                      return t
                    })
                  )
              }
              a
                ? t.forEach(function (t, e) {
                    t && t.type
                      ? E.util
                          .getKlass(t.type, i)
                          .fromObject(t, function (i, r) {
                            r || (s[e] = i), n && n(t, i, r), o()
                          })
                      : o()
                  })
                : e && e(s)
            },
            enlivenObjectEnlivables: function (t, e, i) {
              var n = E.Object.ENLIVEN_PROPS.filter(function (e) {
                return !!t[e]
              })
              E.util.enlivenObjects(
                n.map(function (e) {
                  return t[e]
                }),
                function (t) {
                  var s = {}
                  n.forEach(function (i, n) {
                    ;(s[i] = t[n]), e && (e[i] = t[n])
                  }),
                    i && i(s)
                }
              )
            },
            enlivenPatterns: function (t, e) {
              function i () {
                ++s === r && e && e(n)
              }
              var n = [],
                s = 0,
                r = (t = t || []).length
              r
                ? t.forEach(function (t, e) {
                    t && t.source
                      ? new E.Pattern(t, function (t) {
                          ;(n[e] = t), i()
                        })
                      : ((n[e] = t), i())
                  })
                : e && e(n)
            },
            groupSVGElements: function (t, e, i) {
              var n
              return t && 1 === t.length
                ? (void 0 !== i && (t[0].sourcePath = i), t[0])
                : (e &&
                    (e.width && e.height
                      ? (e.centerPoint = { x: e.width / 2, y: e.height / 2 })
                      : (delete e.width, delete e.height)),
                  (n = new E.Group(t, e)),
                  void 0 !== i && (n.sourcePath = i),
                  n)
            },
            populateWithProperties: function (t, e, i) {
              if (i && Array.isArray(i))
                for (var n = 0, s = i.length; n < s; n++)
                  i[n] in t && (e[i[n]] = t[i[n]])
            },
            createCanvasElement: function () {
              return E.document.createElement('canvas')
            },
            copyCanvasElement: function (t) {
              var e = E.util.createCanvasElement()
              return (
                (e.width = t.width),
                (e.height = t.height),
                e.getContext('2d').drawImage(t, 0, 0),
                e
              )
            },
            toDataURL: function (t, e, i) {
              return t.toDataURL('image/' + e, i)
            },
            createImage: function () {
              return E.document.createElement('img')
            },
            multiplyTransformMatrices: function (t, e, i) {
              return [
                t[0] * e[0] + t[2] * e[1],
                t[1] * e[0] + t[3] * e[1],
                t[0] * e[2] + t[2] * e[3],
                t[1] * e[2] + t[3] * e[3],
                i ? 0 : t[0] * e[4] + t[2] * e[5] + t[4],
                i ? 0 : t[1] * e[4] + t[3] * e[5] + t[5]
              ]
            },
            qrDecompose: function (t) {
              var e = r(t[1], t[0]),
                i = a(t[0], 2) + a(t[1], 2),
                n = s(i),
                l = (t[0] * t[3] - t[2] * t[1]) / n,
                c = r(t[0] * t[2] + t[1] * t[3], i)
              return {
                angle: e / o,
                scaleX: n,
                scaleY: l,
                skewX: c / o,
                skewY: 0,
                translateX: t[4],
                translateY: t[5]
              }
            },
            calcRotateMatrix: function (t) {
              if (!t.angle) return E.iMatrix.concat()
              var e = E.util.degreesToRadians(t.angle),
                i = E.util.cos(e),
                n = E.util.sin(e)
              return [i, n, -n, i, 0, 0]
            },
            calcDimensionsMatrix: function (t) {
              var e = void 0 === t.scaleX ? 1 : t.scaleX,
                i = void 0 === t.scaleY ? 1 : t.scaleY,
                n = [t.flipX ? -e : e, 0, 0, t.flipY ? -i : i, 0, 0],
                s = E.util.multiplyTransformMatrices,
                r = E.util.degreesToRadians
              return (
                t.skewX && (n = s(n, [1, 0, Math.tan(r(t.skewX)), 1], !0)),
                t.skewY && (n = s(n, [1, Math.tan(r(t.skewY)), 0, 1], !0)),
                n
              )
            },
            composeMatrix: function (t) {
              var e = [1, 0, 0, 1, t.translateX || 0, t.translateY || 0],
                i = E.util.multiplyTransformMatrices
              return (
                t.angle && (e = i(e, E.util.calcRotateMatrix(t))),
                (1 !== t.scaleX ||
                  1 !== t.scaleY ||
                  t.skewX ||
                  t.skewY ||
                  t.flipX ||
                  t.flipY) &&
                  (e = i(e, E.util.calcDimensionsMatrix(t))),
                e
              )
            },
            resetObjectTransform: function (t) {
              ;(t.scaleX = 1),
                (t.scaleY = 1),
                (t.skewX = 0),
                (t.skewY = 0),
                (t.flipX = !1),
                (t.flipY = !1),
                t.rotate(0)
            },
            saveObjectTransform: function (t) {
              return {
                scaleX: t.scaleX,
                scaleY: t.scaleY,
                skewX: t.skewX,
                skewY: t.skewY,
                angle: t.angle,
                left: t.left,
                flipX: t.flipX,
                flipY: t.flipY,
                top: t.top
              }
            },
            isTransparent: function (t, e, i, n) {
              n > 0 && (e > n ? (e -= n) : (e = 0), i > n ? (i -= n) : (i = 0))
              var s,
                r = !0,
                a = t.getImageData(e, i, 2 * n || 1, 2 * n || 1),
                o = a.data.length
              for (s = 3; s < o && 0 != (r = a.data[s] <= 0); s += 4);
              return (a = null), r
            },
            parsePreserveAspectRatioAttribute: function (t) {
              var e,
                i = 'meet',
                n = t.split(' ')
              return (
                n &&
                  n.length &&
                  ('meet' !== (i = n.pop()) && 'slice' !== i
                    ? ((e = i), (i = 'meet'))
                    : n.length && (e = n.pop())),
                {
                  meetOrSlice: i,
                  alignX: 'none' !== e ? e.slice(1, 4) : 'none',
                  alignY: 'none' !== e ? e.slice(5, 8) : 'none'
                }
              )
            },
            clearFabricFontCache: function (t) {
              ;(t = (t || '').toLowerCase())
                ? E.charWidthsCache[t] && delete E.charWidthsCache[t]
                : (E.charWidthsCache = {})
            },
            limitDimsByArea: function (t, e) {
              var i = Math.sqrt(e * t),
                n = Math.floor(e / i)
              return { x: Math.floor(i), y: n }
            },
            capValue: function (t, e, i) {
              return Math.max(t, Math.min(e, i))
            },
            findScaleToFit: function (t, e) {
              return Math.min(e.width / t.width, e.height / t.height)
            },
            findScaleToCover: function (t, e) {
              return Math.max(e.width / t.width, e.height / t.height)
            },
            matrixToSVG: function (t) {
              return (
                'matrix(' +
                t
                  .map(function (t) {
                    return E.util.toFixed(t, E.Object.NUM_FRACTION_DIGITS)
                  })
                  .join(' ') +
                ')'
              )
            },
            removeTransformFromObject: function (t, e) {
              var i = E.util.invertTransform(e),
                n = E.util.multiplyTransformMatrices(i, t.calcOwnMatrix())
              E.util.applyTransformToObject(t, n)
            },
            addTransformToObject: function (t, e) {
              E.util.applyTransformToObject(
                t,
                E.util.multiplyTransformMatrices(e, t.calcOwnMatrix())
              )
            },
            applyTransformToObject: function (t, e) {
              var i = E.util.qrDecompose(e),
                n = new E.Point(i.translateX, i.translateY)
              ;(t.flipX = !1),
                (t.flipY = !1),
                t.set('scaleX', i.scaleX),
                t.set('scaleY', i.scaleY),
                (t.skewX = i.skewX),
                (t.skewY = i.skewY),
                (t.angle = i.angle),
                t.setPositionByOrigin(n, 'center', 'center')
            },
            sizeAfterTransform: function (t, e, i) {
              var n = t / 2,
                s = e / 2,
                r = [
                  { x: -n, y: -s },
                  { x: n, y: -s },
                  { x: -n, y: s },
                  { x: n, y: s }
                ],
                a = E.util.calcDimensionsMatrix(i),
                o = E.util.makeBoundingBoxFromPoints(r, a)
              return { x: o.width, y: o.height }
            },
            mergeClipPaths: function (t, e) {
              var i = t,
                n = e
              i.inverted && !n.inverted && ((i = e), (n = t)),
                E.util.applyTransformToObject(
                  n,
                  E.util.multiplyTransformMatrices(
                    E.util.invertTransform(i.calcTransformMatrix()),
                    n.calcTransformMatrix()
                  )
                )
              var s = i.inverted && n.inverted
              return (
                s && (i.inverted = n.inverted = !1),
                new E.Group([i], { clipPath: n, inverted: s })
              )
            },
            hasStyleChanged: function (t, e, i) {
              return (
                (i = i || !1),
                t.fill !== e.fill ||
                  t.stroke !== e.stroke ||
                  t.strokeWidth !== e.strokeWidth ||
                  t.fontSize !== e.fontSize ||
                  t.fontFamily !== e.fontFamily ||
                  t.fontWeight !== e.fontWeight ||
                  t.fontStyle !== e.fontStyle ||
                  t.textBackgroundColor !== e.textBackgroundColor ||
                  t.deltaY !== e.deltaY ||
                  (i &&
                    (t.overline !== e.overline ||
                      t.underline !== e.underline ||
                      t.linethrough !== e.linethrough))
              )
            },
            stylesToArray: function (t, e) {
              t = E.util.object.clone(t, !0)
              for (
                var i = e.split('\n'), n = -1, s = {}, r = [], a = 0;
                a < i.length;
                a++
              )
                if (t[a])
                  for (var o = 0; o < i[a].length; o++) {
                    n++
                    var l = t[a][o]
                    l &&
                      Object.keys(l).length > 0 &&
                      (E.util.hasStyleChanged(s, l, !0)
                        ? r.push({ start: n, end: n + 1, style: l })
                        : r[r.length - 1].end++),
                      (s = l || {})
                  }
                else n += i[a].length
              return r
            },
            stylesFromArray: function (t, e) {
              if (!Array.isArray(t)) return t
              for (
                var i = e.split('\n'), n = -1, s = 0, r = {}, a = 0;
                a < i.length;
                a++
              )
                for (var o = 0; o < i[a].length; o++)
                  n++,
                    t[s] &&
                      t[s].start <= n &&
                      n < t[s].end &&
                      ((r[a] = r[a] || {}),
                      (r[a][o] = Object.assign({}, t[s].style)),
                      n === t[s].end - 1 && s++)
              return r
            }
          }),
          (function () {
            var t = Array.prototype.join,
              e = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7 },
              i = { m: 'l', M: 'L' }
            function n (t, e, i, n, s, r, a, o, l, c, h) {
              var d = E.util.cos(t),
                u = E.util.sin(t),
                f = E.util.cos(e),
                p = E.util.sin(e),
                g = i * s * f - n * r * p + a,
                m = n * s * f + i * r * p + o
              return [
                'C',
                c + l * (-i * s * u - n * r * d),
                h + l * (-n * s * u + i * r * d),
                g + l * (i * s * p + n * r * f),
                m + l * (n * s * p - i * r * f),
                g,
                m
              ]
            }
            function s (t, e, i, n) {
              var s = Math.atan2(e, t),
                r = Math.atan2(n, i)
              return r >= s ? r - s : 2 * Math.PI - (s - r)
            }
            function r (t, e, i) {
              for (
                var r = i[1],
                  a = i[2],
                  o = i[3],
                  l = i[4],
                  c = i[5],
                  h = (function (t, e, i, r, a, o, l) {
                    var c = Math.PI,
                      h = (l * c) / 180,
                      d = E.util.sin(h),
                      u = E.util.cos(h),
                      f = 0,
                      p = 0,
                      g = -u * t * 0.5 - d * e * 0.5,
                      m = -u * e * 0.5 + d * t * 0.5,
                      v = (i = Math.abs(i)) * i,
                      b = (r = Math.abs(r)) * r,
                      y = m * m,
                      x = g * g,
                      w = v * b - v * y - b * x,
                      C = 0
                    if (w < 0) {
                      var S = Math.sqrt(1 - w / (v * b))
                      ;(i *= S), (r *= S)
                    } else
                      C = (a === o ? -1 : 1) * Math.sqrt(w / (v * y + b * x))
                    var T = (C * i * m) / r,
                      A = (-C * r * g) / i,
                      I = u * T - d * A + 0.5 * t,
                      O = d * T + u * A + 0.5 * e,
                      k = s(1, 0, (g - T) / i, (m - A) / r),
                      M = s(
                        (g - T) / i,
                        (m - A) / r,
                        (-g - T) / i,
                        (-m - A) / r
                      )
                    0 === o && M > 0
                      ? (M -= 2 * c)
                      : 1 === o && M < 0 && (M += 2 * c)
                    for (
                      var P = Math.ceil(Math.abs((M / c) * 2)),
                        _ = [],
                        D = M / P,
                        L =
                          ((8 / 3) * Math.sin(D / 4) * Math.sin(D / 4)) /
                          Math.sin(D / 2),
                        B = k + D,
                        F = 0;
                      F < P;
                      F++
                    )
                      (_[F] = n(k, B, u, d, i, r, I, O, L, f, p)),
                        (f = _[F][5]),
                        (p = _[F][6]),
                        (k = B),
                        (B += D)
                    return _
                  })(i[6] - t, i[7] - e, r, a, l, c, o),
                  d = 0,
                  u = h.length;
                d < u;
                d++
              )
                (h[d][1] += t),
                  (h[d][2] += e),
                  (h[d][3] += t),
                  (h[d][4] += e),
                  (h[d][5] += t),
                  (h[d][6] += e)
              return h
            }
            function a (t, e, i, n) {
              return Math.sqrt((i - t) * (i - t) + (n - e) * (n - e))
            }
            function o (t, e, i, n, s, r, a, o) {
              return function (l) {
                var c,
                  h = (c = l) * c * c,
                  d = (function (t) {
                    return 3 * t * t * (1 - t)
                  })(l),
                  u = (function (t) {
                    return 3 * t * (1 - t) * (1 - t)
                  })(l),
                  f = (function (t) {
                    return (1 - t) * (1 - t) * (1 - t)
                  })(l)
                return {
                  x: a * h + s * d + i * u + t * f,
                  y: o * h + r * d + n * u + e * f
                }
              }
            }
            function l (t, e, i, n, s, r, a, o) {
              return function (l) {
                var c = 1 - l,
                  h =
                    3 * c * c * (i - t) +
                    6 * c * l * (s - i) +
                    3 * l * l * (a - s),
                  d =
                    3 * c * c * (n - e) +
                    6 * c * l * (r - n) +
                    3 * l * l * (o - r)
                return Math.atan2(d, h)
              }
            }
            function c (t, e, i, n, s, r) {
              return function (a) {
                var o,
                  l = (o = a) * o,
                  c = (function (t) {
                    return 2 * t * (1 - t)
                  })(a),
                  h = (function (t) {
                    return (1 - t) * (1 - t)
                  })(a)
                return { x: s * l + i * c + t * h, y: r * l + n * c + e * h }
              }
            }
            function h (t, e, i, n, s, r) {
              return function (a) {
                var o = 1 - a,
                  l = 2 * o * (i - t) + 2 * a * (s - i),
                  c = 2 * o * (n - e) + 2 * a * (r - n)
                return Math.atan2(c, l)
              }
            }
            function d (t, e, i) {
              var n,
                s,
                r = { x: e, y: i },
                o = 0
              for (s = 1; s <= 100; s += 1)
                (n = t(s / 100)), (o += a(r.x, r.y, n.x, n.y)), (r = n)
              return o
            }
            function u (t) {
              for (
                var e,
                  i,
                  n,
                  s,
                  r = 0,
                  u = t.length,
                  f = 0,
                  p = 0,
                  g = 0,
                  m = 0,
                  v = [],
                  b = 0;
                b < u;
                b++
              ) {
                switch (((n = { x: f, y: p, command: (e = t[b])[0] }), e[0])) {
                  case 'M':
                    ;(n.length = 0), (g = f = e[1]), (m = p = e[2])
                    break
                  case 'L':
                    ;(n.length = a(f, p, e[1], e[2])), (f = e[1]), (p = e[2])
                    break
                  case 'C':
                    ;(i = o(f, p, e[1], e[2], e[3], e[4], e[5], e[6])),
                      (s = l(f, p, e[1], e[2], e[3], e[4], e[5], e[6])),
                      (n.iterator = i),
                      (n.angleFinder = s),
                      (n.length = d(i, f, p)),
                      (f = e[5]),
                      (p = e[6])
                    break
                  case 'Q':
                    ;(i = c(f, p, e[1], e[2], e[3], e[4])),
                      (s = h(f, p, e[1], e[2], e[3], e[4])),
                      (n.iterator = i),
                      (n.angleFinder = s),
                      (n.length = d(i, f, p)),
                      (f = e[3]),
                      (p = e[4])
                    break
                  case 'Z':
                  case 'z':
                    ;(n.destX = g),
                      (n.destY = m),
                      (n.length = a(f, p, g, m)),
                      (f = g),
                      (p = m)
                }
                ;(r += n.length), v.push(n)
              }
              return v.push({ length: r, x: f, y: p }), v
            }
            ;(E.util.joinPath = function (t) {
              return t
                .map(function (t) {
                  return t.join(' ')
                })
                .join(' ')
            }),
              (E.util.parsePath = function (t) {
                var n,
                  s,
                  r,
                  a,
                  o,
                  l = [],
                  c = [],
                  h = E.rePathCommand,
                  d = '[-+]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][-+]?\\d+)?\\s*',
                  u = '(' + d + ')' + E.commaWsp,
                  f = '([01])' + E.commaWsp + '?',
                  p = new RegExp(
                    u + '?' + u + '?' + u + f + f + u + '?(' + d + ')',
                    'g'
                  )
                if (!t || !t.match) return l
                for (
                  var g,
                    m = 0,
                    v = (o = t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi)).length;
                  m < v;
                  m++
                ) {
                  ;(a = (n = o[m]).slice(1).trim()), (c.length = 0)
                  var b = n.charAt(0)
                  if (((g = [b]), 'a' === b.toLowerCase()))
                    for (var y; (y = p.exec(a)); )
                      for (var x = 1; x < y.length; x++) c.push(y[x])
                  else for (; (r = h.exec(a)); ) c.push(r[0])
                  x = 0
                  for (var w = c.length; x < w; x++)
                    (s = parseFloat(c[x])), isNaN(s) || g.push(s)
                  var C = e[b.toLowerCase()],
                    S = i[b] || b
                  if (g.length - 1 > C)
                    for (var T = 1, A = g.length; T < A; T += C)
                      l.push([b].concat(g.slice(T, T + C))), (b = S)
                  else l.push(g)
                }
                return l
              }),
              (E.util.makePathSimpler = function (t) {
                var e,
                  i,
                  n,
                  s,
                  a,
                  o,
                  l = 0,
                  c = 0,
                  h = t.length,
                  d = 0,
                  u = 0,
                  f = []
                for (i = 0; i < h; ++i) {
                  switch (((n = !1), (e = t[i].slice(0))[0])) {
                    case 'l':
                      ;(e[0] = 'L'), (e[1] += l), (e[2] += c)
                    case 'L':
                      ;(l = e[1]), (c = e[2])
                      break
                    case 'h':
                      e[1] += l
                    case 'H':
                      ;(e[0] = 'L'), (e[2] = c), (l = e[1])
                      break
                    case 'v':
                      e[1] += c
                    case 'V':
                      ;(e[0] = 'L'), (c = e[1]), (e[1] = l), (e[2] = c)
                      break
                    case 'm':
                      ;(e[0] = 'M'), (e[1] += l), (e[2] += c)
                    case 'M':
                      ;(l = e[1]), (c = e[2]), (d = e[1]), (u = e[2])
                      break
                    case 'c':
                      ;(e[0] = 'C'),
                        (e[1] += l),
                        (e[2] += c),
                        (e[3] += l),
                        (e[4] += c),
                        (e[5] += l),
                        (e[6] += c)
                    case 'C':
                      ;(a = e[3]), (o = e[4]), (l = e[5]), (c = e[6])
                      break
                    case 's':
                      ;(e[0] = 'S'),
                        (e[1] += l),
                        (e[2] += c),
                        (e[3] += l),
                        (e[4] += c)
                    case 'S':
                      'C' === s
                        ? ((a = 2 * l - a), (o = 2 * c - o))
                        : ((a = l), (o = c)),
                        (l = e[3]),
                        (c = e[4]),
                        (e[0] = 'C'),
                        (e[5] = e[3]),
                        (e[6] = e[4]),
                        (e[3] = e[1]),
                        (e[4] = e[2]),
                        (e[1] = a),
                        (e[2] = o),
                        (a = e[3]),
                        (o = e[4])
                      break
                    case 'q':
                      ;(e[0] = 'Q'),
                        (e[1] += l),
                        (e[2] += c),
                        (e[3] += l),
                        (e[4] += c)
                    case 'Q':
                      ;(a = e[1]), (o = e[2]), (l = e[3]), (c = e[4])
                      break
                    case 't':
                      ;(e[0] = 'T'), (e[1] += l), (e[2] += c)
                    case 'T':
                      'Q' === s
                        ? ((a = 2 * l - a), (o = 2 * c - o))
                        : ((a = l), (o = c)),
                        (e[0] = 'Q'),
                        (l = e[1]),
                        (c = e[2]),
                        (e[1] = a),
                        (e[2] = o),
                        (e[3] = l),
                        (e[4] = c)
                      break
                    case 'a':
                      ;(e[0] = 'A'), (e[6] += l), (e[7] += c)
                    case 'A':
                      ;(n = !0),
                        (f = f.concat(r(l, c, e))),
                        (l = e[6]),
                        (c = e[7])
                      break
                    case 'z':
                    case 'Z':
                      ;(l = d), (c = u)
                  }
                  n || f.push(e), (s = e[0])
                }
                return f
              }),
              (E.util.getSmoothPathFromPoints = function (t, e) {
                var i,
                  n = [],
                  s = new E.Point(t[0].x, t[0].y),
                  r = new E.Point(t[1].x, t[1].y),
                  a = t.length,
                  o = 1,
                  l = 0,
                  c = a > 2
                for (
                  e = e || 0,
                    c &&
                      ((o = t[2].x < r.x ? -1 : t[2].x === r.x ? 0 : 1),
                      (l = t[2].y < r.y ? -1 : t[2].y === r.y ? 0 : 1)),
                    n.push(['M', s.x - o * e, s.y - l * e]),
                    i = 1;
                  i < a;
                  i++
                ) {
                  if (!s.eq(r)) {
                    var h = s.midPointFrom(r)
                    n.push(['Q', s.x, s.y, h.x, h.y])
                  }
                  ;(s = t[i]), i + 1 < t.length && (r = t[i + 1])
                }
                return (
                  c &&
                    ((o = s.x > t[i - 2].x ? 1 : s.x === t[i - 2].x ? 0 : -1),
                    (l = s.y > t[i - 2].y ? 1 : s.y === t[i - 2].y ? 0 : -1)),
                  n.push(['L', s.x + o * e, s.y + l * e]),
                  n
                )
              }),
              (E.util.getPathSegmentsInfo = u),
              (E.util.getBoundsOfCurve = function (e, i, n, s, r, a, o, l) {
                var c
                if (
                  E.cachesBoundsOfCurve &&
                  ((c = t.call(arguments)), E.boundsOfCurveCache[c])
                )
                  return E.boundsOfCurveCache[c]
                var h,
                  d,
                  u,
                  f,
                  p,
                  g,
                  m,
                  v,
                  b = Math.sqrt,
                  y = Math.min,
                  x = Math.max,
                  w = Math.abs,
                  C = [],
                  S = [[], []]
                ;(d = 6 * e - 12 * n + 6 * r),
                  (h = -3 * e + 9 * n - 9 * r + 3 * o),
                  (u = 3 * n - 3 * e)
                for (var T = 0; T < 2; ++T)
                  if (
                    (T > 0 &&
                      ((d = 6 * i - 12 * s + 6 * a),
                      (h = -3 * i + 9 * s - 9 * a + 3 * l),
                      (u = 3 * s - 3 * i)),
                    w(h) < 1e-12)
                  ) {
                    if (w(d) < 1e-12) continue
                    0 < (f = -u / d) && f < 1 && C.push(f)
                  } else
                    (m = d * d - 4 * u * h) < 0 ||
                      (0 < (p = (-d + (v = b(m))) / (2 * h)) &&
                        p < 1 &&
                        C.push(p),
                      0 < (g = (-d - v) / (2 * h)) && g < 1 && C.push(g))
                for (var A, I, O, k = C.length, M = k; k--; )
                  (A =
                    (O = 1 - (f = C[k])) * O * O * e +
                    3 * O * O * f * n +
                    3 * O * f * f * r +
                    f * f * f * o),
                    (S[0][k] = A),
                    (I =
                      O * O * O * i +
                      3 * O * O * f * s +
                      3 * O * f * f * a +
                      f * f * f * l),
                    (S[1][k] = I)
                ;(S[0][M] = e),
                  (S[1][M] = i),
                  (S[0][M + 1] = o),
                  (S[1][M + 1] = l)
                var P = [
                  { x: y.apply(null, S[0]), y: y.apply(null, S[1]) },
                  { x: x.apply(null, S[0]), y: x.apply(null, S[1]) }
                ]
                return E.cachesBoundsOfCurve && (E.boundsOfCurveCache[c] = P), P
              }),
              (E.util.getPointOnPath = function (t, e, i) {
                i || (i = u(t))
                for (var n = 0; e - i[n].length > 0 && n < i.length - 2; )
                  (e -= i[n].length), n++
                var s,
                  r = i[n],
                  o = e / r.length,
                  l = r.command,
                  c = t[n]
                switch (l) {
                  case 'M':
                    return { x: r.x, y: r.y, angle: 0 }
                  case 'Z':
                  case 'z':
                    return (
                      ((s = new E.Point(r.x, r.y).lerp(
                        new E.Point(r.destX, r.destY),
                        o
                      )).angle = Math.atan2(r.destY - r.y, r.destX - r.x)),
                      s
                    )
                  case 'L':
                    return (
                      ((s = new E.Point(r.x, r.y).lerp(
                        new E.Point(c[1], c[2]),
                        o
                      )).angle = Math.atan2(c[2] - r.y, c[1] - r.x)),
                      s
                    )
                  case 'C':
                  case 'Q':
                    return (function (t, e) {
                      for (
                        var i,
                          n,
                          s,
                          r = 0,
                          o = 0,
                          l = t.iterator,
                          c = { x: t.x, y: t.y },
                          h = 0.01,
                          d = t.angleFinder;
                        o < e && h > 1e-4;

                      )
                        (i = l(r)),
                          (s = r),
                          (n = a(c.x, c.y, i.x, i.y)) + o > e
                            ? ((r -= h), (h /= 2))
                            : ((c = i), (r += h), (o += n))
                      return (i.angle = d(s)), i
                    })(r, e)
                }
              }),
              (E.util.transformPath = function (t, e, i) {
                return (
                  i &&
                    (e = E.util.multiplyTransformMatrices(e, [
                      1,
                      0,
                      0,
                      1,
                      -i.x,
                      -i.y
                    ])),
                  t.map(function (t) {
                    for (
                      var i = t.slice(0), n = {}, s = 1;
                      s < t.length - 1;
                      s += 2
                    )
                      (n.x = t[s]),
                        (n.y = t[s + 1]),
                        (n = E.util.transformPoint(n, e)),
                        (i[s] = n.x),
                        (i[s + 1] = n.y)
                    return i
                  })
                )
              })
          })(),
          (function () {
            var t = Array.prototype.slice
            function e (t, e, i) {
              if (t && 0 !== t.length) {
                var n = t.length - 1,
                  s = e ? t[n][e] : t[n]
                if (e) for (; n--; ) i(t[n][e], s) && (s = t[n][e])
                else for (; n--; ) i(t[n], s) && (s = t[n])
                return s
              }
            }
            E.util.array = {
              fill: function (t, e) {
                for (var i = t.length; i--; ) t[i] = e
                return t
              },
              invoke: function (e, i) {
                for (
                  var n = t.call(arguments, 2), s = [], r = 0, a = e.length;
                  r < a;
                  r++
                )
                  s[r] = n.length ? e[r][i].apply(e[r], n) : e[r][i].call(e[r])
                return s
              },
              min: function (t, i) {
                return e(t, i, function (t, e) {
                  return t < e
                })
              },
              max: function (t, i) {
                return e(t, i, function (t, e) {
                  return t >= e
                })
              }
            }
          })(),
          (function () {
            function t (e, i, n) {
              if (n)
                if (!E.isLikelyNode && i instanceof Element) e = i
                else if (i instanceof Array) {
                  e = []
                  for (var s = 0, r = i.length; s < r; s++)
                    e[s] = t({}, i[s], n)
                } else if (i && 'object' == typeof i)
                  for (var a in i)
                    'canvas' === a || 'group' === a
                      ? (e[a] = null)
                      : i.hasOwnProperty(a) && (e[a] = t({}, i[a], n))
                else e = i
              else for (var a in i) e[a] = i[a]
              return e
            }
            ;(E.util.object = {
              extend: t,
              clone: function (e, i) {
                return t({}, e, i)
              }
            }),
              E.util.object.extend(E.util, E.Observable)
          })(),
          (function () {
            function t (t, e) {
              var i = t.charCodeAt(e)
              if (isNaN(i)) return ''
              if (i < 55296 || i > 57343) return t.charAt(e)
              if (55296 <= i && i <= 56319) {
                if (t.length <= e + 1)
                  throw 'High surrogate without following low surrogate'
                var n = t.charCodeAt(e + 1)
                if (56320 > n || n > 57343)
                  throw 'High surrogate without following low surrogate'
                return t.charAt(e) + t.charAt(e + 1)
              }
              if (0 === e)
                throw 'Low surrogate without preceding high surrogate'
              var s = t.charCodeAt(e - 1)
              if (55296 > s || s > 56319)
                throw 'Low surrogate without preceding high surrogate'
              return !1
            }
            E.util.string = {
              camelize: function (t) {
                return t.replace(/-+(.)?/g, function (t, e) {
                  return e ? e.toUpperCase() : ''
                })
              },
              capitalize: function (t, e) {
                return (
                  t.charAt(0).toUpperCase() +
                  (e ? t.slice(1) : t.slice(1).toLowerCase())
                )
              },
              escapeXml: function (t) {
                return t
                  .replace(/&/g, '&amp;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&apos;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
              },
              graphemeSplit: function (e) {
                var i,
                  n = 0,
                  s = []
                for (n = 0; n < e.length; n++) !1 !== (i = t(e, n)) && s.push(i)
                return s
              }
            }
          })(),
          (function () {
            var t = Array.prototype.slice,
              e = function () {},
              i = (function () {
                for (var t in { toString: 1 }) if ('toString' === t) return !1
                return !0
              })(),
              n = function (t, e, n) {
                for (var s in e)
                  s in t.prototype &&
                  'function' == typeof t.prototype[s] &&
                  (e[s] + '').indexOf('callSuper') > -1
                    ? (t.prototype[s] = (function (t) {
                        return function () {
                          var i = this.constructor.superclass
                          this.constructor.superclass = n
                          var s = e[t].apply(this, arguments)
                          if (
                            ((this.constructor.superclass = i),
                            'initialize' !== t)
                          )
                            return s
                        }
                      })(s))
                    : (t.prototype[s] = e[s]),
                    i &&
                      (e.toString !== Object.prototype.toString &&
                        (t.prototype.toString = e.toString),
                      e.valueOf !== Object.prototype.valueOf &&
                        (t.prototype.valueOf = e.valueOf))
              }
            function s () {}
            function r (e) {
              for (var i = null, n = this; n.constructor.superclass; ) {
                var s = n.constructor.superclass.prototype[e]
                if (n[e] !== s) {
                  i = s
                  break
                }
                n = n.constructor.superclass.prototype
              }
              return i
                ? arguments.length > 1
                  ? i.apply(this, t.call(arguments, 1))
                  : i.call(this)
                : console.log(
                    'tried to callSuper ' +
                      e +
                      ', method not found in prototype chain',
                    this
                  )
            }
            E.util.createClass = function () {
              var i = null,
                a = t.call(arguments, 0)
              function o () {
                this.initialize.apply(this, arguments)
              }
              'function' == typeof a[0] && (i = a.shift()),
                (o.superclass = i),
                (o.subclasses = []),
                i &&
                  ((s.prototype = i.prototype),
                  (o.prototype = new s()),
                  i.subclasses.push(o))
              for (var l = 0, c = a.length; l < c; l++) n(o, a[l], i)
              return (
                o.prototype.initialize || (o.prototype.initialize = e),
                (o.prototype.constructor = o),
                (o.prototype.callSuper = r),
                o
              )
            }
          })(),
          (c = !!E.document.createElement('div').attachEvent),
          (h = ['touchstart', 'touchmove', 'touchend']),
          (E.util.addListener = function (t, e, i, n) {
            t && t.addEventListener(e, i, !c && n)
          }),
          (E.util.removeListener = function (t, e, i, n) {
            t && t.removeEventListener(e, i, !c && n)
          }),
          (E.util.getPointer = function (t) {
            var e = t.target,
              i = E.util.getScrollLeftTop(e),
              n = (function (t) {
                var e = t.changedTouches
                return e && e[0] ? e[0] : t
              })(t)
            return { x: n.clientX + i.left, y: n.clientY + i.top }
          }),
          (E.util.isTouchEvent = function (t) {
            return h.indexOf(t.type) > -1 || 'touch' === t.pointerType
          }),
          (u =
            'string' ==
            typeof (d = E.document.createElement('div')).style.opacity),
          (f = 'string' == typeof d.style.filter),
          (p = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/),
          (g = function (t) {
            return t
          }),
          u
            ? (g = function (t, e) {
                return (t.style.opacity = e), t
              })
            : f &&
              (g = function (t, e) {
                var i = t.style
                return (
                  t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1),
                  p.test(i.filter)
                    ? ((e =
                        e >= 0.9999 ? '' : 'alpha(opacity=' + 100 * e + ')'),
                      (i.filter = i.filter.replace(p, e)))
                    : (i.filter += ' alpha(opacity=' + 100 * e + ')'),
                  t
                )
              }),
          (E.util.setStyle = function (t, e) {
            var i = t.style
            if (!i) return t
            if ('string' == typeof e)
              return (
                (t.style.cssText += ';' + e),
                e.indexOf('opacity') > -1
                  ? g(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1])
                  : t
              )
            for (var n in e)
              if ('opacity' === n) g(t, e[n])
              else {
                var s =
                  'float' === n || 'cssFloat' === n
                    ? void 0 === i.styleFloat
                      ? 'cssFloat'
                      : 'styleFloat'
                    : n
                i.setProperty(s, e[n])
              }
            return t
          }),
          (function () {
            var t,
              e,
              i,
              n,
              s = Array.prototype.slice,
              r = function (t) {
                return s.call(t, 0)
              }
            try {
              t = r(E.document.childNodes) instanceof Array
            } catch (t) {}
            function a (t, e) {
              var i = E.document.createElement(t)
              for (var n in e)
                'class' === n
                  ? (i.className = e[n])
                  : 'for' === n
                  ? (i.htmlFor = e[n])
                  : i.setAttribute(n, e[n])
              return i
            }
            function o (t) {
              for (
                var e = 0,
                  i = 0,
                  n = E.document.documentElement,
                  s = E.document.body || { scrollLeft: 0, scrollTop: 0 };
                t &&
                (t.parentNode || t.host) &&
                ((t = t.parentNode || t.host) === E.document
                  ? ((e = s.scrollLeft || n.scrollLeft || 0),
                    (i = s.scrollTop || n.scrollTop || 0))
                  : ((e += t.scrollLeft || 0), (i += t.scrollTop || 0)),
                1 !== t.nodeType || 'fixed' !== t.style.position);

              );
              return { left: e, top: i }
            }
            t ||
              (r = function (t) {
                for (var e = new Array(t.length), i = t.length; i--; )
                  e[i] = t[i]
                return e
              }),
              (e =
                E.document.defaultView &&
                E.document.defaultView.getComputedStyle
                  ? function (t, e) {
                      var i = E.document.defaultView.getComputedStyle(t, null)
                      return i ? i[e] : void 0
                    }
                  : function (t, e) {
                      var i = t.style[e]
                      return !i && t.currentStyle && (i = t.currentStyle[e]), i
                    }),
              (i = E.document.documentElement.style),
              (n =
                'userSelect' in i
                  ? 'userSelect'
                  : 'MozUserSelect' in i
                  ? 'MozUserSelect'
                  : 'WebkitUserSelect' in i
                  ? 'WebkitUserSelect'
                  : 'KhtmlUserSelect' in i
                  ? 'KhtmlUserSelect'
                  : ''),
              (E.util.makeElementUnselectable = function (t) {
                return (
                  void 0 !== t.onselectstart &&
                    (t.onselectstart = E.util.falseFunction),
                  n
                    ? (t.style[n] = 'none')
                    : 'string' == typeof t.unselectable &&
                      (t.unselectable = 'on'),
                  t
                )
              }),
              (E.util.makeElementSelectable = function (t) {
                return (
                  void 0 !== t.onselectstart && (t.onselectstart = null),
                  n
                    ? (t.style[n] = '')
                    : 'string' == typeof t.unselectable &&
                      (t.unselectable = ''),
                  t
                )
              }),
              (E.util.setImageSmoothing = function (t, e) {
                ;(t.imageSmoothingEnabled =
                  t.imageSmoothingEnabled ||
                  t.webkitImageSmoothingEnabled ||
                  t.mozImageSmoothingEnabled ||
                  t.msImageSmoothingEnabled ||
                  t.oImageSmoothingEnabled),
                  (t.imageSmoothingEnabled = e)
              }),
              (E.util.getById = function (t) {
                return 'string' == typeof t ? E.document.getElementById(t) : t
              }),
              (E.util.toArray = r),
              (E.util.addClass = function (t, e) {
                t &&
                  -1 === (' ' + t.className + ' ').indexOf(' ' + e + ' ') &&
                  (t.className += (t.className ? ' ' : '') + e)
              }),
              (E.util.makeElement = a),
              (E.util.wrapElement = function (t, e, i) {
                return (
                  'string' == typeof e && (e = a(e, i)),
                  t.parentNode && t.parentNode.replaceChild(e, t),
                  e.appendChild(t),
                  e
                )
              }),
              (E.util.getScrollLeftTop = o),
              (E.util.getElementOffset = function (t) {
                var i,
                  n,
                  s = t && t.ownerDocument,
                  r = { left: 0, top: 0 },
                  a = { left: 0, top: 0 },
                  l = {
                    borderLeftWidth: 'left',
                    borderTopWidth: 'top',
                    paddingLeft: 'left',
                    paddingTop: 'top'
                  }
                if (!s) return a
                for (var c in l) a[l[c]] += parseInt(e(t, c), 10) || 0
                return (
                  (i = s.documentElement),
                  void 0 !== t.getBoundingClientRect &&
                    (r = t.getBoundingClientRect()),
                  (n = o(t)),
                  {
                    left: r.left + n.left - (i.clientLeft || 0) + a.left,
                    top: r.top + n.top - (i.clientTop || 0) + a.top
                  }
                )
              }),
              (E.util.getNodeCanvas = function (t) {
                var e = E.jsdomImplForWrapper(t)
                return e._canvas || e._image
              }),
              (E.util.cleanUpJsdomNode = function (t) {
                if (E.isLikelyNode) {
                  var e = E.jsdomImplForWrapper(t)
                  e &&
                    ((e._image = null),
                    (e._canvas = null),
                    (e._currentSrc = null),
                    (e._attributes = null),
                    (e._classList = null))
                }
              })
          })(),
          (function () {
            function t () {}
            E.util.request = function (e, i) {
              i || (i = {})
              var n = i.method ? i.method.toUpperCase() : 'GET',
                s = i.onComplete || function () {},
                r = new E.window.XMLHttpRequest(),
                a = i.body || i.parameters
              return (
                (r.onreadystatechange = function () {
                  4 === r.readyState && (s(r), (r.onreadystatechange = t))
                }),
                'GET' === n &&
                  ((a = null),
                  'string' == typeof i.parameters &&
                    (e = (function (t, e) {
                      return t + (/\?/.test(t) ? '&' : '?') + e
                    })(e, i.parameters))),
                r.open(n, e, !0),
                ('POST' !== n && 'PUT' !== n) ||
                  r.setRequestHeader(
                    'Content-Type',
                    'application/x-www-form-urlencoded'
                  ),
                r.send(a),
                r
              )
            }
          })(),
          (E.log = console.log),
          (E.warn = console.warn),
          (function () {
            var t = E.util.object.extend,
              e = E.util.object.clone,
              i = []
            function n () {
              return !1
            }
            function s (t, e, i, n) {
              return -i * Math.cos((t / n) * (Math.PI / 2)) + i + e
            }
            E.util.object.extend(i, {
              cancelAll: function () {
                var t = this.splice(0)
                return (
                  t.forEach(function (t) {
                    t.cancel()
                  }),
                  t
                )
              },
              cancelByCanvas: function (t) {
                if (!t) return []
                var e = this.filter(function (e) {
                  return 'object' == typeof e.target && e.target.canvas === t
                })
                return (
                  e.forEach(function (t) {
                    t.cancel()
                  }),
                  e
                )
              },
              cancelByTarget: function (t) {
                var e = this.findAnimationsByTarget(t)
                return (
                  e.forEach(function (t) {
                    t.cancel()
                  }),
                  e
                )
              },
              findAnimationIndex: function (t) {
                return this.indexOf(this.findAnimation(t))
              },
              findAnimation: function (t) {
                return this.find(function (e) {
                  return e.cancel === t
                })
              },
              findAnimationsByTarget: function (t) {
                return t
                  ? this.filter(function (e) {
                      return e.target === t
                    })
                  : []
              }
            })
            var r =
                E.window.requestAnimationFrame ||
                E.window.webkitRequestAnimationFrame ||
                E.window.mozRequestAnimationFrame ||
                E.window.oRequestAnimationFrame ||
                E.window.msRequestAnimationFrame ||
                function (t) {
                  return E.window.setTimeout(t, 1e3 / 60)
                },
              a = E.window.cancelAnimationFrame || E.window.clearTimeout
            function o () {
              return r.apply(E.window, arguments)
            }
            ;(E.util.animate = function (i) {
              i || (i = {})
              var r,
                a = !1,
                l = function () {
                  var t = E.runningAnimations.indexOf(r)
                  return t > -1 && E.runningAnimations.splice(t, 1)[0]
                }
              return (
                (r = t(e(i), {
                  cancel: function () {
                    return (a = !0), l()
                  },
                  currentValue: 'startValue' in i ? i.startValue : 0,
                  completionRate: 0,
                  durationRate: 0
                })),
                E.runningAnimations.push(r),
                o(function (t) {
                  var e,
                    c = t || +new Date(),
                    h = i.duration || 500,
                    d = c + h,
                    u = i.onChange || n,
                    f = i.abort || n,
                    p = i.onComplete || n,
                    g = i.easing || s,
                    m = 'startValue' in i && i.startValue.length > 0,
                    v = 'startValue' in i ? i.startValue : 0,
                    b = 'endValue' in i ? i.endValue : 100,
                    y =
                      i.byValue ||
                      (m
                        ? v.map(function (t, e) {
                            return b[e] - v[e]
                          })
                        : b - v)
                  i.onStart && i.onStart(),
                    (function t (i) {
                      var n = (e = i || +new Date()) > d ? h : e - c,
                        s = n / h,
                        x = m
                          ? v.map(function (t, e) {
                              return g(n, v[e], y[e], h)
                            })
                          : g(n, v, y, h),
                        w = m
                          ? Math.abs((x[0] - v[0]) / y[0])
                          : Math.abs((x - v) / y)
                      if (
                        ((r.currentValue = m ? x.slice() : x),
                        (r.completionRate = w),
                        (r.durationRate = s),
                        !a)
                      ) {
                        if (!f(x, w, s))
                          return e > d
                            ? ((r.currentValue = m ? b.slice() : b),
                              (r.completionRate = 1),
                              (r.durationRate = 1),
                              u(m ? b.slice() : b, 1, 1),
                              p(b, 1, 1),
                              void l())
                            : (u(x, w, s), void o(t))
                        l()
                      }
                    })(c)
                }),
                r.cancel
              )
            }),
              (E.util.requestAnimFrame = o),
              (E.util.cancelAnimFrame = function () {
                return a.apply(E.window, arguments)
              }),
              (E.runningAnimations = i)
          })(),
          (function () {
            function t (t, e, i) {
              var n =
                'rgba(' +
                parseInt(t[0] + i * (e[0] - t[0]), 10) +
                ',' +
                parseInt(t[1] + i * (e[1] - t[1]), 10) +
                ',' +
                parseInt(t[2] + i * (e[2] - t[2]), 10)
              return (
                (n +=
                  ',' + (t && e ? parseFloat(t[3] + i * (e[3] - t[3])) : 1)) +
                ')'
              )
            }
            E.util.animateColor = function (e, i, n, s) {
              var r = new E.Color(e).getSource(),
                a = new E.Color(i).getSource(),
                o = s.onComplete,
                l = s.onChange
              return (
                (s = s || {}),
                E.util.animate(
                  E.util.object.extend(s, {
                    duration: n || 500,
                    startValue: r,
                    endValue: a,
                    byValue: a,
                    easing: function (e, i, n, r) {
                      return t(
                        i,
                        n,
                        s.colorEasing
                          ? s.colorEasing(e, r)
                          : 1 - Math.cos((e / r) * (Math.PI / 2))
                      )
                    },
                    onComplete: function (e, i, n) {
                      if (o) return o(t(a, a, 0), i, n)
                    },
                    onChange: function (e, i, n) {
                      if (l) {
                        if (Array.isArray(e)) return l(t(e, e, 0), i, n)
                        l(e, i, n)
                      }
                    }
                  })
                )
              )
            }
          })(),
          (function () {
            function t (t, e, i, n) {
              return (
                t < Math.abs(e)
                  ? ((t = e), (n = i / 4))
                  : (n =
                      0 === e && 0 === t
                        ? (i / (2 * Math.PI)) * Math.asin(1)
                        : (i / (2 * Math.PI)) * Math.asin(e / t)),
                { a: t, c: e, p: i, s: n }
              )
            }
            function e (t, e, i) {
              return (
                t.a *
                Math.pow(2, 10 * (e -= 1)) *
                Math.sin(((e * i - t.s) * (2 * Math.PI)) / t.p)
              )
            }
            function i (t, e, i, s) {
              return i - n(s - t, 0, i, s) + e
            }
            function n (t, e, i, n) {
              return (t /= n) < 1 / 2.75
                ? i * (7.5625 * t * t) + e
                : t < 2 / 2.75
                ? i * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + e
                : t < 2.5 / 2.75
                ? i * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + e
                : i * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + e
            }
            E.util.ease = {
              easeInQuad: function (t, e, i, n) {
                return i * (t /= n) * t + e
              },
              easeOutQuad: function (t, e, i, n) {
                return -i * (t /= n) * (t - 2) + e
              },
              easeInOutQuad: function (t, e, i, n) {
                return (t /= n / 2) < 1
                  ? (i / 2) * t * t + e
                  : (-i / 2) * (--t * (t - 2) - 1) + e
              },
              easeInCubic: function (t, e, i, n) {
                return i * (t /= n) * t * t + e
              },
              easeOutCubic: function (t, e, i, n) {
                return i * ((t = t / n - 1) * t * t + 1) + e
              },
              easeInOutCubic: function (t, e, i, n) {
                return (t /= n / 2) < 1
                  ? (i / 2) * t * t * t + e
                  : (i / 2) * ((t -= 2) * t * t + 2) + e
              },
              easeInQuart: function (t, e, i, n) {
                return i * (t /= n) * t * t * t + e
              },
              easeOutQuart: function (t, e, i, n) {
                return -i * ((t = t / n - 1) * t * t * t - 1) + e
              },
              easeInOutQuart: function (t, e, i, n) {
                return (t /= n / 2) < 1
                  ? (i / 2) * t * t * t * t + e
                  : (-i / 2) * ((t -= 2) * t * t * t - 2) + e
              },
              easeInQuint: function (t, e, i, n) {
                return i * (t /= n) * t * t * t * t + e
              },
              easeOutQuint: function (t, e, i, n) {
                return i * ((t = t / n - 1) * t * t * t * t + 1) + e
              },
              easeInOutQuint: function (t, e, i, n) {
                return (t /= n / 2) < 1
                  ? (i / 2) * t * t * t * t * t + e
                  : (i / 2) * ((t -= 2) * t * t * t * t + 2) + e
              },
              easeInSine: function (t, e, i, n) {
                return -i * Math.cos((t / n) * (Math.PI / 2)) + i + e
              },
              easeOutSine: function (t, e, i, n) {
                return i * Math.sin((t / n) * (Math.PI / 2)) + e
              },
              easeInOutSine: function (t, e, i, n) {
                return (-i / 2) * (Math.cos((Math.PI * t) / n) - 1) + e
              },
              easeInExpo: function (t, e, i, n) {
                return 0 === t ? e : i * Math.pow(2, 10 * (t / n - 1)) + e
              },
              easeOutExpo: function (t, e, i, n) {
                return t === n
                  ? e + i
                  : i * (1 - Math.pow(2, (-10 * t) / n)) + e
              },
              easeInOutExpo: function (t, e, i, n) {
                return 0 === t
                  ? e
                  : t === n
                  ? e + i
                  : (t /= n / 2) < 1
                  ? (i / 2) * Math.pow(2, 10 * (t - 1)) + e
                  : (i / 2) * (2 - Math.pow(2, -10 * --t)) + e
              },
              easeInCirc: function (t, e, i, n) {
                return -i * (Math.sqrt(1 - (t /= n) * t) - 1) + e
              },
              easeOutCirc: function (t, e, i, n) {
                return i * Math.sqrt(1 - (t = t / n - 1) * t) + e
              },
              easeInOutCirc: function (t, e, i, n) {
                return (t /= n / 2) < 1
                  ? (-i / 2) * (Math.sqrt(1 - t * t) - 1) + e
                  : (i / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
              },
              easeInElastic: function (i, n, s, r) {
                var a = 0
                return 0 === i
                  ? n
                  : 1 == (i /= r)
                  ? n + s
                  : (a || (a = 0.3 * r), -e(t(s, s, a, 1.70158), i, r) + n)
              },
              easeOutElastic: function (e, i, n, s) {
                var r = 0
                if (0 === e) return i
                if (1 == (e /= s)) return i + n
                r || (r = 0.3 * s)
                var a = t(n, n, r, 1.70158)
                return (
                  a.a *
                    Math.pow(2, -10 * e) *
                    Math.sin(((e * s - a.s) * (2 * Math.PI)) / a.p) +
                  a.c +
                  i
                )
              },
              easeInOutElastic: function (i, n, s, r) {
                var a = 0
                if (0 === i) return n
                if (2 == (i /= r / 2)) return n + s
                a || (a = r * (0.3 * 1.5))
                var o = t(s, s, a, 1.70158)
                return i < 1
                  ? -0.5 * e(o, i, r) + n
                  : o.a *
                      Math.pow(2, -10 * (i -= 1)) *
                      Math.sin(((i * r - o.s) * (2 * Math.PI)) / o.p) *
                      0.5 +
                      o.c +
                      n
              },
              easeInBack: function (t, e, i, n, s) {
                return (
                  void 0 === s && (s = 1.70158),
                  i * (t /= n) * t * ((s + 1) * t - s) + e
                )
              },
              easeOutBack: function (t, e, i, n, s) {
                return (
                  void 0 === s && (s = 1.70158),
                  i * ((t = t / n - 1) * t * ((s + 1) * t + s) + 1) + e
                )
              },
              easeInOutBack: function (t, e, i, n, s) {
                return (
                  void 0 === s && (s = 1.70158),
                  (t /= n / 2) < 1
                    ? (i / 2) * (t * t * ((1 + (s *= 1.525)) * t - s)) + e
                    : (i / 2) *
                        ((t -= 2) * t * ((1 + (s *= 1.525)) * t + s) + 2) +
                      e
                )
              },
              easeInBounce: i,
              easeOutBounce: n,
              easeInOutBounce: function (t, e, s, r) {
                return t < r / 2
                  ? 0.5 * i(2 * t, 0, s, r) + e
                  : 0.5 * n(2 * t - r, 0, s, r) + 0.5 * s + e
              }
            }
          })(),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend,
              n = e.util.object.clone,
              s = e.util.toFixed,
              r = e.util.parseUnit,
              a = e.util.multiplyTransformMatrices,
              o = {
                cx: 'left',
                x: 'left',
                r: 'radius',
                cy: 'top',
                y: 'top',
                display: 'visible',
                visibility: 'visible',
                transform: 'transformMatrix',
                'fill-opacity': 'fillOpacity',
                'fill-rule': 'fillRule',
                'font-family': 'fontFamily',
                'font-size': 'fontSize',
                'font-style': 'fontStyle',
                'font-weight': 'fontWeight',
                'letter-spacing': 'charSpacing',
                'paint-order': 'paintFirst',
                'stroke-dasharray': 'strokeDashArray',
                'stroke-dashoffset': 'strokeDashOffset',
                'stroke-linecap': 'strokeLineCap',
                'stroke-linejoin': 'strokeLineJoin',
                'stroke-miterlimit': 'strokeMiterLimit',
                'stroke-opacity': 'strokeOpacity',
                'stroke-width': 'strokeWidth',
                'text-decoration': 'textDecoration',
                'text-anchor': 'textAnchor',
                opacity: 'opacity',
                'clip-path': 'clipPath',
                'clip-rule': 'clipRule',
                'vector-effect': 'strokeUniform',
                'image-rendering': 'imageSmoothing'
              },
              l = { stroke: 'strokeOpacity', fill: 'fillOpacity' },
              c = 'font-size',
              h = 'clip-path'
            function d (t) {
              return t in o ? o[t] : t
            }
            function u (t, i, n, s) {
              var o,
                l = Array.isArray(i)
              if (('fill' !== t && 'stroke' !== t) || 'none' !== i) {
                if ('strokeUniform' === t) return 'non-scaling-stroke' === i
                if ('strokeDashArray' === t)
                  i =
                    'none' === i
                      ? null
                      : i.replace(/,/g, ' ').split(/\s+/).map(parseFloat)
                else if ('transformMatrix' === t)
                  i =
                    n && n.transformMatrix
                      ? a(n.transformMatrix, e.parseTransformAttribute(i))
                      : e.parseTransformAttribute(i)
                else if ('visible' === t)
                  (i = 'none' !== i && 'hidden' !== i),
                    n && !1 === n.visible && (i = !1)
                else if ('opacity' === t)
                  (i = parseFloat(i)),
                    n && void 0 !== n.opacity && (i *= n.opacity)
                else if ('textAnchor' === t)
                  i = 'start' === i ? 'left' : 'end' === i ? 'right' : 'center'
                else if ('charSpacing' === t) o = (r(i, s) / s) * 1e3
                else if ('paintFirst' === t) {
                  var c = i.indexOf('fill'),
                    h = i.indexOf('stroke')
                  ;(i = 'fill'),
                    ((c > -1 && h > -1 && h < c) || (-1 === c && h > -1)) &&
                      (i = 'stroke')
                } else {
                  if ('href' === t || 'xlink:href' === t || 'font' === t)
                    return i
                  if ('imageSmoothing' === t) return 'optimizeQuality' === i
                  o = l ? i.map(r) : r(i, s)
                }
              } else i = ''
              return !l && isNaN(o) ? i : o
            }
            function f (t) {
              return new RegExp('^(' + t.join('|') + ')\\b', 'i')
            }
            function p (t, e) {
              var i,
                n,
                s,
                r,
                a = []
              for (s = 0, r = e.length; s < r; s++)
                (i = e[s]),
                  (n = t.getElementsByTagName(i)),
                  (a = a.concat(Array.prototype.slice.call(n)))
              return a
            }
            function g (t, e) {
              var i,
                n = !0
              return (
                (i = m(t, e.pop())) &&
                  e.length &&
                  (n = (function (t, e) {
                    for (
                      var i, n = !0;
                      t.parentNode && 1 === t.parentNode.nodeType && e.length;

                    )
                      n && (i = e.pop()), (n = m((t = t.parentNode), i))
                    return 0 === e.length
                  })(t, e)),
                i && n && 0 === e.length
              )
            }
            function m (t, e) {
              var i,
                n,
                s = t.nodeName,
                r = t.getAttribute('class'),
                a = t.getAttribute('id')
              if (
                ((i = new RegExp('^' + s, 'i')),
                (e = e.replace(i, '')),
                a &&
                  e.length &&
                  ((i = new RegExp('#' + a + '(?![a-zA-Z\\-]+)', 'i')),
                  (e = e.replace(i, ''))),
                r && e.length)
              )
                for (n = (r = r.split(' ')).length; n--; )
                  (i = new RegExp('\\.' + r[n] + '(?![a-zA-Z\\-]+)', 'i')),
                    (e = e.replace(i, ''))
              return 0 === e.length
            }
            function v (t, e) {
              var i
              if ((t.getElementById && (i = t.getElementById(e)), i)) return i
              var n,
                s,
                r,
                a = t.getElementsByTagName('*')
              for (s = 0, r = a.length; s < r; s++)
                if (e === (n = a[s]).getAttribute('id')) return n
            }
            ;(e.svgValidTagNamesRegEx = f([
              'path',
              'circle',
              'polygon',
              'polyline',
              'ellipse',
              'rect',
              'line',
              'image',
              'text'
            ])),
              (e.svgViewBoxElementsRegEx = f([
                'symbol',
                'image',
                'marker',
                'pattern',
                'view',
                'svg'
              ])),
              (e.svgInvalidAncestorsRegEx = f([
                'pattern',
                'defs',
                'symbol',
                'metadata',
                'clipPath',
                'mask',
                'desc'
              ])),
              (e.svgValidParentsRegEx = f([
                'symbol',
                'g',
                'a',
                'svg',
                'clipPath',
                'defs'
              ])),
              (e.cssRules = {}),
              (e.gradientDefs = {}),
              (e.clipPaths = {}),
              (e.parseTransformAttribute = (function () {
                function t (t, i, n) {
                  t[n] = Math.tan(e.util.degreesToRadians(i[0]))
                }
                var i = e.iMatrix,
                  n = e.reNum,
                  s = e.commaWsp,
                  r =
                    '(?:(?:(matrix)\\s*\\(\\s*(' +
                    n +
                    ')' +
                    s +
                    '(' +
                    n +
                    ')' +
                    s +
                    '(' +
                    n +
                    ')' +
                    s +
                    '(' +
                    n +
                    ')' +
                    s +
                    '(' +
                    n +
                    ')' +
                    s +
                    '(' +
                    n +
                    ')\\s*\\))|(?:(translate)\\s*\\(\\s*(' +
                    n +
                    ')(?:' +
                    s +
                    '(' +
                    n +
                    '))?\\s*\\))|(?:(scale)\\s*\\(\\s*(' +
                    n +
                    ')(?:' +
                    s +
                    '(' +
                    n +
                    '))?\\s*\\))|(?:(rotate)\\s*\\(\\s*(' +
                    n +
                    ')(?:' +
                    s +
                    '(' +
                    n +
                    ')' +
                    s +
                    '(' +
                    n +
                    '))?\\s*\\))|(?:(skewX)\\s*\\(\\s*(' +
                    n +
                    ')\\s*\\))|(?:(skewY)\\s*\\(\\s*(' +
                    n +
                    ')\\s*\\)))',
                  a = new RegExp(
                    '^\\s*(?:(?:' + r + '(?:' + s + '*' + r + ')*)?)\\s*$'
                  ),
                  o = new RegExp(r, 'g')
                return function (n) {
                  var s = i.concat(),
                    l = []
                  if (!n || (n && !a.test(n))) return s
                  n.replace(o, function (n) {
                    var a = new RegExp(r).exec(n).filter(function (t) {
                        return !!t
                      }),
                      o = a[1],
                      c = a.slice(2).map(parseFloat)
                    switch (o) {
                      case 'translate':
                        !(function (t, e) {
                          ;(t[4] = e[0]), 2 === e.length && (t[5] = e[1])
                        })(s, c)
                        break
                      case 'rotate':
                        ;(c[0] = e.util.degreesToRadians(c[0])),
                          (function (t, i) {
                            var n = e.util.cos(i[0]),
                              s = e.util.sin(i[0]),
                              r = 0,
                              a = 0
                            3 === i.length && ((r = i[1]), (a = i[2])),
                              (t[0] = n),
                              (t[1] = s),
                              (t[2] = -s),
                              (t[3] = n),
                              (t[4] = r - (n * r - s * a)),
                              (t[5] = a - (s * r + n * a))
                          })(s, c)
                        break
                      case 'scale':
                        !(function (t, e) {
                          var i = e[0],
                            n = 2 === e.length ? e[1] : e[0]
                          ;(t[0] = i), (t[3] = n)
                        })(s, c)
                        break
                      case 'skewX':
                        t(s, c, 2)
                        break
                      case 'skewY':
                        t(s, c, 1)
                        break
                      case 'matrix':
                        s = c
                    }
                    l.push(s.concat()), (s = i.concat())
                  })
                  for (var c = l[0]; l.length > 1; )
                    l.shift(), (c = e.util.multiplyTransformMatrices(c, l[0]))
                  return c
                }
              })())
            var b = new RegExp(
              '^\\s*(' +
                e.reNum +
                '+)\\s*,?\\s*(' +
                e.reNum +
                '+)\\s*,?\\s*(' +
                e.reNum +
                '+)\\s*,?\\s*(' +
                e.reNum +
                '+)\\s*$'
            )
            function y (t) {
              if (!e.svgViewBoxElementsRegEx.test(t.nodeName)) return {}
              var i,
                n,
                s,
                a,
                o,
                l,
                c = t.getAttribute('viewBox'),
                h = 1,
                d = 1,
                u = t.getAttribute('width'),
                f = t.getAttribute('height'),
                p = t.getAttribute('x') || 0,
                g = t.getAttribute('y') || 0,
                m = t.getAttribute('preserveAspectRatio') || '',
                v = !c || !(c = c.match(b)),
                y = !u || !f || '100%' === u || '100%' === f,
                x = v && y,
                w = {},
                C = '',
                S = 0,
                T = 0
              if (
                ((w.width = 0),
                (w.height = 0),
                (w.toBeParsed = x),
                v &&
                  (p || g) &&
                  t.parentNode &&
                  '#document' !== t.parentNode.nodeName &&
                  ((C = ' translate(' + r(p) + ' ' + r(g) + ') '),
                  (o = (t.getAttribute('transform') || '') + C),
                  t.setAttribute('transform', o),
                  t.removeAttribute('x'),
                  t.removeAttribute('y')),
                x)
              )
                return w
              if (v) return (w.width = r(u)), (w.height = r(f)), w
              if (
                ((i = -parseFloat(c[1])),
                (n = -parseFloat(c[2])),
                (s = parseFloat(c[3])),
                (a = parseFloat(c[4])),
                (w.minX = i),
                (w.minY = n),
                (w.viewBoxWidth = s),
                (w.viewBoxHeight = a),
                y
                  ? ((w.width = s), (w.height = a))
                  : ((w.width = r(u)),
                    (w.height = r(f)),
                    (h = w.width / s),
                    (d = w.height / a)),
                'none' !==
                  (m = e.util.parsePreserveAspectRatioAttribute(m)).alignX &&
                  ('meet' === m.meetOrSlice && (d = h = h > d ? d : h),
                  'slice' === m.meetOrSlice && (d = h = h > d ? h : d),
                  (S = w.width - s * h),
                  (T = w.height - a * h),
                  'Mid' === m.alignX && (S /= 2),
                  'Mid' === m.alignY && (T /= 2),
                  'Min' === m.alignX && (S = 0),
                  'Min' === m.alignY && (T = 0)),
                1 === h && 1 === d && 0 === i && 0 === n && 0 === p && 0 === g)
              )
                return w
              if (
                ((p || g) &&
                  '#document' !== t.parentNode.nodeName &&
                  (C = ' translate(' + r(p) + ' ' + r(g) + ') '),
                (o =
                  C +
                  ' matrix(' +
                  h +
                  ' 0 0 ' +
                  d +
                  ' ' +
                  (i * h + S) +
                  ' ' +
                  (n * d + T) +
                  ') '),
                'svg' === t.nodeName)
              ) {
                for (
                  l = t.ownerDocument.createElementNS(e.svgNS, 'g');
                  t.firstChild;

                )
                  l.appendChild(t.firstChild)
                t.appendChild(l)
              } else
                (l = t).removeAttribute('x'),
                  l.removeAttribute('y'),
                  (o = l.getAttribute('transform') + o)
              return l.setAttribute('transform', o), w
            }
            function x (t, e) {
              var i = 'xlink:href',
                n = v(t, e.getAttribute(i).slice(1))
              if (
                (n && n.getAttribute(i) && x(t, n),
                [
                  'gradientTransform',
                  'x1',
                  'x2',
                  'y1',
                  'y2',
                  'gradientUnits',
                  'cx',
                  'cy',
                  'r',
                  'fx',
                  'fy'
                ].forEach(function (t) {
                  n &&
                    !e.hasAttribute(t) &&
                    n.hasAttribute(t) &&
                    e.setAttribute(t, n.getAttribute(t))
                }),
                !e.children.length)
              )
                for (var s = n.cloneNode(!0); s.firstChild; )
                  e.appendChild(s.firstChild)
              e.removeAttribute(i)
            }
            e.parseSVGDocument = function (t, i, s, r) {
              if (t) {
                !(function (t) {
                  for (
                    var i = p(t, ['use', 'svg:use']), n = 0;
                    i.length && n < i.length;

                  ) {
                    var s = i[n],
                      r = s.getAttribute('xlink:href') || s.getAttribute('href')
                    if (null === r) return
                    var a,
                      o,
                      l,
                      c,
                      h = r.slice(1),
                      d = s.getAttribute('x') || 0,
                      u = s.getAttribute('y') || 0,
                      f = v(t, h).cloneNode(!0),
                      g =
                        (f.getAttribute('transform') || '') +
                        ' translate(' +
                        d +
                        ', ' +
                        u +
                        ')',
                      m = i.length,
                      b = e.svgNS
                    if ((y(f), /^svg$/i.test(f.nodeName))) {
                      var x = f.ownerDocument.createElementNS(b, 'g')
                      for (o = 0, c = (l = f.attributes).length; o < c; o++)
                        (a = l.item(o)),
                          x.setAttributeNS(b, a.nodeName, a.nodeValue)
                      for (; f.firstChild; ) x.appendChild(f.firstChild)
                      f = x
                    }
                    for (o = 0, c = (l = s.attributes).length; o < c; o++)
                      'x' !== (a = l.item(o)).nodeName &&
                        'y' !== a.nodeName &&
                        'xlink:href' !== a.nodeName &&
                        'href' !== a.nodeName &&
                        ('transform' === a.nodeName
                          ? (g = a.nodeValue + ' ' + g)
                          : f.setAttribute(a.nodeName, a.nodeValue))
                    f.setAttribute('transform', g),
                      f.setAttribute('instantiated_by_use', '1'),
                      f.removeAttribute('id'),
                      s.parentNode.replaceChild(f, s),
                      i.length === m && n++
                  }
                })(t)
                var a,
                  o,
                  l = e.Object.__uid++,
                  c = y(t),
                  h = e.util.toArray(t.getElementsByTagName('*'))
                if (
                  ((c.crossOrigin = r && r.crossOrigin),
                  (c.svgUid = l),
                  0 === h.length && e.isLikelyNode)
                ) {
                  var d = []
                  for (
                    a = 0,
                      o = (h = t.selectNodes('//*[name(.)!="svg"]')).length;
                    a < o;
                    a++
                  )
                    d[a] = h[a]
                  h = d
                }
                var u = h.filter(function (t) {
                  return (
                    y(t),
                    e.svgValidTagNamesRegEx.test(
                      t.nodeName.replace('svg:', '')
                    ) &&
                      !(function (t, e) {
                        for (; t && (t = t.parentNode); )
                          if (
                            t.nodeName &&
                            e.test(t.nodeName.replace('svg:', '')) &&
                            !t.getAttribute('instantiated_by_use')
                          )
                            return !0
                        return !1
                      })(t, e.svgInvalidAncestorsRegEx)
                  )
                })
                if (!u || (u && !u.length)) i && i([], {})
                else {
                  var f = {}
                  h
                    .filter(function (t) {
                      return 'clipPath' === t.nodeName.replace('svg:', '')
                    })
                    .forEach(function (t) {
                      var i = t.getAttribute('id')
                      f[i] = e.util
                        .toArray(t.getElementsByTagName('*'))
                        .filter(function (t) {
                          return e.svgValidTagNamesRegEx.test(
                            t.nodeName.replace('svg:', '')
                          )
                        })
                    }),
                    (e.gradientDefs[l] = e.getGradientDefs(t)),
                    (e.cssRules[l] = e.getCSSRules(t)),
                    (e.clipPaths[l] = f),
                    e.parseElements(
                      u,
                      function (t, n) {
                        i &&
                          (i(t, c, n, h),
                          delete e.gradientDefs[l],
                          delete e.cssRules[l],
                          delete e.clipPaths[l])
                      },
                      n(c),
                      s,
                      r
                    )
                }
              }
            }
            var w = new RegExp(
              '(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(' +
                e.reNum +
                '(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|' +
                e.reNum +
                '))?\\s+(.*)'
            )
            i(e, {
              parseFontDeclaration: function (t, e) {
                var i = t.match(w)
                if (i) {
                  var n = i[1],
                    s = i[3],
                    a = i[4],
                    o = i[5],
                    l = i[6]
                  n && (e.fontStyle = n),
                    s &&
                      (e.fontWeight = isNaN(parseFloat(s)) ? s : parseFloat(s)),
                    a && (e.fontSize = r(a)),
                    l && (e.fontFamily = l),
                    o && (e.lineHeight = 'normal' === o ? 1 : o)
                }
              },
              getGradientDefs: function (t) {
                var e,
                  i = p(t, [
                    'linearGradient',
                    'radialGradient',
                    'svg:linearGradient',
                    'svg:radialGradient'
                  ]),
                  n = 0,
                  s = {}
                for (n = i.length; n--; )
                  (e = i[n]).getAttribute('xlink:href') && x(t, e),
                    (s[e.getAttribute('id')] = e)
                return s
              },
              parseAttributes: function (t, n, a) {
                if (t) {
                  var o,
                    f,
                    p,
                    m = {}
                  void 0 === a && (a = t.getAttribute('svgUid')),
                    t.parentNode &&
                      e.svgValidParentsRegEx.test(t.parentNode.nodeName) &&
                      (m = e.parseAttributes(t.parentNode, n, a))
                  var v = n.reduce(function (e, i) {
                      return (o = t.getAttribute(i)) && (e[i] = o), e
                    }, {}),
                    b = i(
                      (function (t, i) {
                        var n = {}
                        for (var s in e.cssRules[i])
                          if (g(t, s.split(' ')))
                            for (var r in e.cssRules[i][s])
                              n[r] = e.cssRules[i][s][r]
                        return n
                      })(t, a),
                      e.parseStyleAttribute(t)
                    )
                  ;(v = i(v, b)),
                    b[h] && t.setAttribute(h, b[h]),
                    (f = p = m.fontSize || e.Text.DEFAULT_SVG_FONT_SIZE),
                    v[c] && (v[c] = f = r(v[c], p))
                  var y,
                    x,
                    w = {}
                  for (var C in v) (x = u((y = d(C)), v[C], m, f)), (w[y] = x)
                  w && w.font && e.parseFontDeclaration(w.font, w)
                  var S = i(m, w)
                  return e.svgValidParentsRegEx.test(t.nodeName)
                    ? S
                    : (function (t) {
                        for (var i in l)
                          if (void 0 !== t[l[i]] && '' !== t[i]) {
                            if (void 0 === t[i]) {
                              if (!e.Object.prototype[i]) continue
                              t[i] = e.Object.prototype[i]
                            }
                            if (0 !== t[i].indexOf('url(')) {
                              var n = new e.Color(t[i])
                              t[i] = n
                                .setAlpha(s(n.getAlpha() * t[l[i]], 2))
                                .toRgba()
                            }
                          }
                        return t
                      })(S)
                }
              },
              parseElements: function (t, i, n, s, r) {
                new e.ElementsParser(t, i, n, s, r).parse()
              },
              parseStyleAttribute: function (t) {
                var e = {},
                  i = t.getAttribute('style')
                return i
                  ? ('string' == typeof i
                      ? (function (t, e) {
                          var i, n
                          t.replace(/;\s*$/, '')
                            .split(';')
                            .forEach(function (t) {
                              var s = t.split(':')
                              ;(i = s[0].trim().toLowerCase()),
                                (n = s[1].trim()),
                                (e[i] = n)
                            })
                        })(i, e)
                      : (function (t, e) {
                          var i, n
                          for (var s in t)
                            void 0 !== t[s] &&
                              ((i = s.toLowerCase()), (n = t[s]), (e[i] = n))
                        })(i, e),
                    e)
                  : e
              },
              parsePointsAttribute: function (t) {
                if (!t) return null
                var e,
                  i,
                  n = []
                for (
                  e = 0,
                    i = (t = (t = t.replace(/,/g, ' ').trim()).split(/\s+/))
                      .length;
                  e < i;
                  e += 2
                )
                  n.push({ x: parseFloat(t[e]), y: parseFloat(t[e + 1]) })
                return n
              },
              getCSSRules: function (t) {
                var i,
                  n,
                  s = t.getElementsByTagName('style'),
                  r = {}
                for (i = 0, n = s.length; i < n; i++) {
                  var a = s[i].textContent
                  '' !== (a = a.replace(/\/\*[\s\S]*?\*\//g, '')).trim() &&
                    a
                      .split('}')
                      .filter(function (t) {
                        return t.trim()
                      })
                      .forEach(function (t) {
                        var s = t.split('{'),
                          a = {},
                          o = s[1]
                            .trim()
                            .split(';')
                            .filter(function (t) {
                              return t.trim()
                            })
                        for (i = 0, n = o.length; i < n; i++) {
                          var l = o[i].split(':'),
                            c = l[0].trim(),
                            h = l[1].trim()
                          a[c] = h
                        }
                        ;(t = s[0].trim()).split(',').forEach(function (t) {
                          '' !== (t = t.replace(/^svg/i, '').trim()) &&
                            (r[t]
                              ? e.util.object.extend(r[t], a)
                              : (r[t] = e.util.object.clone(a)))
                        })
                      })
                }
                return r
              },
              loadSVGFromURL: function (t, i, n, s) {
                ;(t = t.replace(/^\n\s*/, '').trim()),
                  new e.util.request(t, {
                    method: 'get',
                    onComplete: function (t) {
                      var r = t.responseXML
                      if (!r || !r.documentElement) return i && i(null), !1
                      e.parseSVGDocument(
                        r.documentElement,
                        function (t, e, n, s) {
                          i && i(t, e, n, s)
                        },
                        n,
                        s
                      )
                    }
                  })
              },
              loadSVGFromString: function (t, i, n, s) {
                var r = new e.window.DOMParser().parseFromString(
                  t.trim(),
                  'text/xml'
                )
                e.parseSVGDocument(
                  r.documentElement,
                  function (t, e, n, s) {
                    i(t, e, n, s)
                  },
                  n,
                  s
                )
              }
            })
          })(e),
          (E.ElementsParser = function (t, e, i, n, s, r) {
            ;(this.elements = t),
              (this.callback = e),
              (this.options = i),
              (this.reviver = n),
              (this.svgUid = (i && i.svgUid) || 0),
              (this.parsingOptions = s),
              (this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g),
              (this.doc = r)
          }),
          ((m = E.ElementsParser.prototype).parse = function () {
            ;(this.instances = new Array(this.elements.length)),
              (this.numElements = this.elements.length),
              this.createObjects()
          }),
          (m.createObjects = function () {
            var t = this
            this.elements.forEach(function (e, i) {
              e.setAttribute('svgUid', t.svgUid), t.createObject(e, i)
            })
          }),
          (m.findTag = function (t) {
            return E[E.util.string.capitalize(t.tagName.replace('svg:', ''))]
          }),
          (m.createObject = function (t, e) {
            var i = this.findTag(t)
            if (i && i.fromElement)
              try {
                i.fromElement(t, this.createCallback(e, t), this.options)
              } catch (t) {
                E.log(t)
              }
            else this.checkIfDone()
          }),
          (m.createCallback = function (t, e) {
            var i = this
            return function (n) {
              var s
              i.resolveGradient(n, e, 'fill'),
                i.resolveGradient(n, e, 'stroke'),
                n instanceof E.Image &&
                  n._originalElement &&
                  (s = n.parsePreserveAspectRatioAttribute(e)),
                n._removeTransformMatrix(s),
                i.resolveClipPath(n, e),
                i.reviver && i.reviver(e, n),
                (i.instances[t] = n),
                i.checkIfDone()
            }
          }),
          (m.extractPropertyDefinition = function (t, e, i) {
            var n = t[e],
              s = this.regexUrl
            if (s.test(n)) {
              s.lastIndex = 0
              var r = s.exec(n)[1]
              return (s.lastIndex = 0), E[i][this.svgUid][r]
            }
          }),
          (m.resolveGradient = function (t, e, i) {
            var n = this.extractPropertyDefinition(t, i, 'gradientDefs')
            if (n) {
              var s = e.getAttribute(i + '-opacity'),
                r = E.Gradient.fromElement(n, t, s, this.options)
              t.set(i, r)
            }
          }),
          (m.createClipPathCallback = function (t, e) {
            return function (t) {
              t._removeTransformMatrix(), (t.fillRule = t.clipRule), e.push(t)
            }
          }),
          (m.resolveClipPath = function (t, e) {
            var i,
              n,
              s,
              r,
              a = this.extractPropertyDefinition(t, 'clipPath', 'clipPaths')
            if (a) {
              ;(s = []), (n = E.util.invertTransform(t.calcTransformMatrix()))
              for (
                var o = a[0].parentNode, l = e;
                l.parentNode && l.getAttribute('clip-path') !== t.clipPath;

              )
                l = l.parentNode
              l.parentNode.appendChild(o)
              for (var c = 0; c < a.length; c++)
                (i = a[c]),
                  this.findTag(i).fromElement(
                    i,
                    this.createClipPathCallback(t, s),
                    this.options
                  )
              ;(a = 1 === s.length ? s[0] : new E.Group(s)),
                (r = E.util.multiplyTransformMatrices(
                  n,
                  a.calcTransformMatrix()
                )),
                a.clipPath && this.resolveClipPath(a, l)
              var h = E.util.qrDecompose(r)
              ;(a.flipX = !1),
                (a.flipY = !1),
                a.set('scaleX', h.scaleX),
                a.set('scaleY', h.scaleY),
                (a.angle = h.angle),
                (a.skewX = h.skewX),
                (a.skewY = 0),
                a.setPositionByOrigin(
                  { x: h.translateX, y: h.translateY },
                  'center',
                  'center'
                ),
                (t.clipPath = a)
            } else delete t.clipPath
          }),
          (m.checkIfDone = function () {
            0 == --this.numElements &&
              ((this.instances = this.instances.filter(function (t) {
                return null != t
              })),
              this.callback(this.instances, this.elements))
          }),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {})
            function i (t, e) {
              ;(this.x = t), (this.y = e)
            }
            e.Point
              ? e.warn('fabric.Point is already defined')
              : ((e.Point = i),
                (i.prototype = {
                  type: 'point',
                  constructor: i,
                  add: function (t) {
                    return new i(this.x + t.x, this.y + t.y)
                  },
                  addEquals: function (t) {
                    return (this.x += t.x), (this.y += t.y), this
                  },
                  scalarAdd: function (t) {
                    return new i(this.x + t, this.y + t)
                  },
                  scalarAddEquals: function (t) {
                    return (this.x += t), (this.y += t), this
                  },
                  subtract: function (t) {
                    return new i(this.x - t.x, this.y - t.y)
                  },
                  subtractEquals: function (t) {
                    return (this.x -= t.x), (this.y -= t.y), this
                  },
                  scalarSubtract: function (t) {
                    return new i(this.x - t, this.y - t)
                  },
                  scalarSubtractEquals: function (t) {
                    return (this.x -= t), (this.y -= t), this
                  },
                  multiply: function (t) {
                    return new i(this.x * t, this.y * t)
                  },
                  multiplyEquals: function (t) {
                    return (this.x *= t), (this.y *= t), this
                  },
                  divide: function (t) {
                    return new i(this.x / t, this.y / t)
                  },
                  divideEquals: function (t) {
                    return (this.x /= t), (this.y /= t), this
                  },
                  eq: function (t) {
                    return this.x === t.x && this.y === t.y
                  },
                  lt: function (t) {
                    return this.x < t.x && this.y < t.y
                  },
                  lte: function (t) {
                    return this.x <= t.x && this.y <= t.y
                  },
                  gt: function (t) {
                    return this.x > t.x && this.y > t.y
                  },
                  gte: function (t) {
                    return this.x >= t.x && this.y >= t.y
                  },
                  lerp: function (t, e) {
                    return (
                      void 0 === e && (e = 0.5),
                      (e = Math.max(Math.min(1, e), 0)),
                      new i(
                        this.x + (t.x - this.x) * e,
                        this.y + (t.y - this.y) * e
                      )
                    )
                  },
                  distanceFrom: function (t) {
                    var e = this.x - t.x,
                      i = this.y - t.y
                    return Math.sqrt(e * e + i * i)
                  },
                  midPointFrom: function (t) {
                    return this.lerp(t)
                  },
                  min: function (t) {
                    return new i(Math.min(this.x, t.x), Math.min(this.y, t.y))
                  },
                  max: function (t) {
                    return new i(Math.max(this.x, t.x), Math.max(this.y, t.y))
                  },
                  toString: function () {
                    return this.x + ',' + this.y
                  },
                  setXY: function (t, e) {
                    return (this.x = t), (this.y = e), this
                  },
                  setX: function (t) {
                    return (this.x = t), this
                  },
                  setY: function (t) {
                    return (this.y = t), this
                  },
                  setFromPoint: function (t) {
                    return (this.x = t.x), (this.y = t.y), this
                  },
                  swap: function (t) {
                    var e = this.x,
                      i = this.y
                    ;(this.x = t.x), (this.y = t.y), (t.x = e), (t.y = i)
                  },
                  clone: function () {
                    return new i(this.x, this.y)
                  }
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {})
            function i (t) {
              ;(this.status = t), (this.points = [])
            }
            e.Intersection
              ? e.warn('fabric.Intersection is already defined')
              : ((e.Intersection = i),
                (e.Intersection.prototype = {
                  constructor: i,
                  appendPoint: function (t) {
                    return this.points.push(t), this
                  },
                  appendPoints: function (t) {
                    return (this.points = this.points.concat(t)), this
                  }
                }),
                (e.Intersection.intersectLineLine = function (t, n, s, r) {
                  var a,
                    o = (r.x - s.x) * (t.y - s.y) - (r.y - s.y) * (t.x - s.x),
                    l = (n.x - t.x) * (t.y - s.y) - (n.y - t.y) * (t.x - s.x),
                    c = (r.y - s.y) * (n.x - t.x) - (r.x - s.x) * (n.y - t.y)
                  if (0 !== c) {
                    var h = o / c,
                      d = l / c
                    0 <= h && h <= 1 && 0 <= d && d <= 1
                      ? (a = new i('Intersection')).appendPoint(
                          new e.Point(
                            t.x + h * (n.x - t.x),
                            t.y + h * (n.y - t.y)
                          )
                        )
                      : (a = new i())
                  } else
                    a = new i(0 === o || 0 === l ? 'Coincident' : 'Parallel')
                  return a
                }),
                (e.Intersection.intersectLinePolygon = function (t, e, n) {
                  var s,
                    r,
                    a,
                    o,
                    l = new i(),
                    c = n.length
                  for (o = 0; o < c; o++)
                    (s = n[o]),
                      (r = n[(o + 1) % c]),
                      (a = i.intersectLineLine(t, e, s, r)),
                      l.appendPoints(a.points)
                  return l.points.length > 0 && (l.status = 'Intersection'), l
                }),
                (e.Intersection.intersectPolygonPolygon = function (t, e) {
                  var n,
                    s = new i(),
                    r = t.length
                  for (n = 0; n < r; n++) {
                    var a = t[n],
                      o = t[(n + 1) % r],
                      l = i.intersectLinePolygon(a, o, e)
                    s.appendPoints(l.points)
                  }
                  return s.points.length > 0 && (s.status = 'Intersection'), s
                }),
                (e.Intersection.intersectPolygonRectangle = function (t, n, s) {
                  var r = n.min(s),
                    a = n.max(s),
                    o = new e.Point(a.x, r.y),
                    l = new e.Point(r.x, a.y),
                    c = i.intersectLinePolygon(r, o, t),
                    h = i.intersectLinePolygon(o, a, t),
                    d = i.intersectLinePolygon(a, l, t),
                    u = i.intersectLinePolygon(l, r, t),
                    f = new i()
                  return (
                    f.appendPoints(c.points),
                    f.appendPoints(h.points),
                    f.appendPoints(d.points),
                    f.appendPoints(u.points),
                    f.points.length > 0 && (f.status = 'Intersection'),
                    f
                  )
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {})
            function i (t) {
              t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
            }
            function n (t, e, i) {
              return (
                i < 0 && (i += 1),
                i > 1 && (i -= 1),
                i < 1 / 6
                  ? t + 6 * (e - t) * i
                  : i < 0.5
                  ? e
                  : i < 2 / 3
                  ? t + (e - t) * (2 / 3 - i) * 6
                  : t
              )
            }
            e.Color
              ? e.warn('fabric.Color is already defined.')
              : ((e.Color = i),
                (e.Color.prototype = {
                  _tryParsingColor: function (t) {
                    var e
                    t in i.colorNameMap && (t = i.colorNameMap[t]),
                      'transparent' === t && (e = [255, 255, 255, 0]),
                      e || (e = i.sourceFromHex(t)),
                      e || (e = i.sourceFromRgb(t)),
                      e || (e = i.sourceFromHsl(t)),
                      e || (e = [0, 0, 0, 1]),
                      e && this.setSource(e)
                  },
                  _rgbToHsl: function (t, i, n) {
                    ;(t /= 255), (i /= 255), (n /= 255)
                    var s,
                      r,
                      a,
                      o = e.util.array.max([t, i, n]),
                      l = e.util.array.min([t, i, n])
                    if (((a = (o + l) / 2), o === l)) s = r = 0
                    else {
                      var c = o - l
                      switch (
                        ((r = a > 0.5 ? c / (2 - o - l) : c / (o + l)), o)
                      ) {
                        case t:
                          s = (i - n) / c + (i < n ? 6 : 0)
                          break
                        case i:
                          s = (n - t) / c + 2
                          break
                        case n:
                          s = (t - i) / c + 4
                      }
                      s /= 6
                    }
                    return [
                      Math.round(360 * s),
                      Math.round(100 * r),
                      Math.round(100 * a)
                    ]
                  },
                  getSource: function () {
                    return this._source
                  },
                  setSource: function (t) {
                    this._source = t
                  },
                  toRgb: function () {
                    var t = this.getSource()
                    return 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')'
                  },
                  toRgba: function () {
                    var t = this.getSource()
                    return (
                      'rgba(' +
                      t[0] +
                      ',' +
                      t[1] +
                      ',' +
                      t[2] +
                      ',' +
                      t[3] +
                      ')'
                    )
                  },
                  toHsl: function () {
                    var t = this.getSource(),
                      e = this._rgbToHsl(t[0], t[1], t[2])
                    return 'hsl(' + e[0] + ',' + e[1] + '%,' + e[2] + '%)'
                  },
                  toHsla: function () {
                    var t = this.getSource(),
                      e = this._rgbToHsl(t[0], t[1], t[2])
                    return (
                      'hsla(' +
                      e[0] +
                      ',' +
                      e[1] +
                      '%,' +
                      e[2] +
                      '%,' +
                      t[3] +
                      ')'
                    )
                  },
                  toHex: function () {
                    var t,
                      e,
                      i,
                      n = this.getSource()
                    return (
                      (t = 1 === (t = n[0].toString(16)).length ? '0' + t : t),
                      (e = 1 === (e = n[1].toString(16)).length ? '0' + e : e),
                      (i = 1 === (i = n[2].toString(16)).length ? '0' + i : i),
                      t.toUpperCase() + e.toUpperCase() + i.toUpperCase()
                    )
                  },
                  toHexa: function () {
                    var t,
                      e = this.getSource()
                    return (
                      (t =
                        1 ===
                        (t = (t = Math.round(255 * e[3])).toString(16)).length
                          ? '0' + t
                          : t),
                      this.toHex() + t.toUpperCase()
                    )
                  },
                  getAlpha: function () {
                    return this.getSource()[3]
                  },
                  setAlpha: function (t) {
                    var e = this.getSource()
                    return (e[3] = t), this.setSource(e), this
                  },
                  toGrayscale: function () {
                    var t = this.getSource(),
                      e = parseInt(
                        (0.3 * t[0] + 0.59 * t[1] + 0.11 * t[2]).toFixed(0),
                        10
                      ),
                      i = t[3]
                    return this.setSource([e, e, e, i]), this
                  },
                  toBlackWhite: function (t) {
                    var e = this.getSource(),
                      i = (0.3 * e[0] + 0.59 * e[1] + 0.11 * e[2]).toFixed(0),
                      n = e[3]
                    return (
                      (t = t || 127),
                      (i = Number(i) < Number(t) ? 0 : 255),
                      this.setSource([i, i, i, n]),
                      this
                    )
                  },
                  overlayWith: function (t) {
                    t instanceof i || (t = new i(t))
                    var e,
                      n = [],
                      s = this.getAlpha(),
                      r = this.getSource(),
                      a = t.getSource()
                    for (e = 0; e < 3; e++)
                      n.push(Math.round(0.5 * r[e] + 0.5 * a[e]))
                    return (n[3] = s), this.setSource(n), this
                  }
                }),
                (e.Color.reRGBa =
                  /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i),
                (e.Color.reHSLa =
                  /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i),
                (e.Color.reHex =
                  /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i),
                (e.Color.colorNameMap = {
                  aliceblue: '#F0F8FF',
                  antiquewhite: '#FAEBD7',
                  aqua: '#00FFFF',
                  aquamarine: '#7FFFD4',
                  azure: '#F0FFFF',
                  beige: '#F5F5DC',
                  bisque: '#FFE4C4',
                  black: '#000000',
                  blanchedalmond: '#FFEBCD',
                  blue: '#0000FF',
                  blueviolet: '#8A2BE2',
                  brown: '#A52A2A',
                  burlywood: '#DEB887',
                  cadetblue: '#5F9EA0',
                  chartreuse: '#7FFF00',
                  chocolate: '#D2691E',
                  coral: '#FF7F50',
                  cornflowerblue: '#6495ED',
                  cornsilk: '#FFF8DC',
                  crimson: '#DC143C',
                  cyan: '#00FFFF',
                  darkblue: '#00008B',
                  darkcyan: '#008B8B',
                  darkgoldenrod: '#B8860B',
                  darkgray: '#A9A9A9',
                  darkgrey: '#A9A9A9',
                  darkgreen: '#006400',
                  darkkhaki: '#BDB76B',
                  darkmagenta: '#8B008B',
                  darkolivegreen: '#556B2F',
                  darkorange: '#FF8C00',
                  darkorchid: '#9932CC',
                  darkred: '#8B0000',
                  darksalmon: '#E9967A',
                  darkseagreen: '#8FBC8F',
                  darkslateblue: '#483D8B',
                  darkslategray: '#2F4F4F',
                  darkslategrey: '#2F4F4F',
                  darkturquoise: '#00CED1',
                  darkviolet: '#9400D3',
                  deeppink: '#FF1493',
                  deepskyblue: '#00BFFF',
                  dimgray: '#696969',
                  dimgrey: '#696969',
                  dodgerblue: '#1E90FF',
                  firebrick: '#B22222',
                  floralwhite: '#FFFAF0',
                  forestgreen: '#228B22',
                  fuchsia: '#FF00FF',
                  gainsboro: '#DCDCDC',
                  ghostwhite: '#F8F8FF',
                  gold: '#FFD700',
                  goldenrod: '#DAA520',
                  gray: '#808080',
                  grey: '#808080',
                  green: '#008000',
                  greenyellow: '#ADFF2F',
                  honeydew: '#F0FFF0',
                  hotpink: '#FF69B4',
                  indianred: '#CD5C5C',
                  indigo: '#4B0082',
                  ivory: '#FFFFF0',
                  khaki: '#F0E68C',
                  lavender: '#E6E6FA',
                  lavenderblush: '#FFF0F5',
                  lawngreen: '#7CFC00',
                  lemonchiffon: '#FFFACD',
                  lightblue: '#ADD8E6',
                  lightcoral: '#F08080',
                  lightcyan: '#E0FFFF',
                  lightgoldenrodyellow: '#FAFAD2',
                  lightgray: '#D3D3D3',
                  lightgrey: '#D3D3D3',
                  lightgreen: '#90EE90',
                  lightpink: '#FFB6C1',
                  lightsalmon: '#FFA07A',
                  lightseagreen: '#20B2AA',
                  lightskyblue: '#87CEFA',
                  lightslategray: '#778899',
                  lightslategrey: '#778899',
                  lightsteelblue: '#B0C4DE',
                  lightyellow: '#FFFFE0',
                  lime: '#00FF00',
                  limegreen: '#32CD32',
                  linen: '#FAF0E6',
                  magenta: '#FF00FF',
                  maroon: '#800000',
                  mediumaquamarine: '#66CDAA',
                  mediumblue: '#0000CD',
                  mediumorchid: '#BA55D3',
                  mediumpurple: '#9370DB',
                  mediumseagreen: '#3CB371',
                  mediumslateblue: '#7B68EE',
                  mediumspringgreen: '#00FA9A',
                  mediumturquoise: '#48D1CC',
                  mediumvioletred: '#C71585',
                  midnightblue: '#191970',
                  mintcream: '#F5FFFA',
                  mistyrose: '#FFE4E1',
                  moccasin: '#FFE4B5',
                  navajowhite: '#FFDEAD',
                  navy: '#000080',
                  oldlace: '#FDF5E6',
                  olive: '#808000',
                  olivedrab: '#6B8E23',
                  orange: '#FFA500',
                  orangered: '#FF4500',
                  orchid: '#DA70D6',
                  palegoldenrod: '#EEE8AA',
                  palegreen: '#98FB98',
                  paleturquoise: '#AFEEEE',
                  palevioletred: '#DB7093',
                  papayawhip: '#FFEFD5',
                  peachpuff: '#FFDAB9',
                  peru: '#CD853F',
                  pink: '#FFC0CB',
                  plum: '#DDA0DD',
                  powderblue: '#B0E0E6',
                  purple: '#800080',
                  rebeccapurple: '#663399',
                  red: '#FF0000',
                  rosybrown: '#BC8F8F',
                  royalblue: '#4169E1',
                  saddlebrown: '#8B4513',
                  salmon: '#FA8072',
                  sandybrown: '#F4A460',
                  seagreen: '#2E8B57',
                  seashell: '#FFF5EE',
                  sienna: '#A0522D',
                  silver: '#C0C0C0',
                  skyblue: '#87CEEB',
                  slateblue: '#6A5ACD',
                  slategray: '#708090',
                  slategrey: '#708090',
                  snow: '#FFFAFA',
                  springgreen: '#00FF7F',
                  steelblue: '#4682B4',
                  tan: '#D2B48C',
                  teal: '#008080',
                  thistle: '#D8BFD8',
                  tomato: '#FF6347',
                  turquoise: '#40E0D0',
                  violet: '#EE82EE',
                  wheat: '#F5DEB3',
                  white: '#FFFFFF',
                  whitesmoke: '#F5F5F5',
                  yellow: '#FFFF00',
                  yellowgreen: '#9ACD32'
                }),
                (e.Color.fromRgb = function (t) {
                  return i.fromSource(i.sourceFromRgb(t))
                }),
                (e.Color.sourceFromRgb = function (t) {
                  var e = t.match(i.reRGBa)
                  if (e) {
                    var n =
                        (parseInt(e[1], 10) / (/%$/.test(e[1]) ? 100 : 1)) *
                        (/%$/.test(e[1]) ? 255 : 1),
                      s =
                        (parseInt(e[2], 10) / (/%$/.test(e[2]) ? 100 : 1)) *
                        (/%$/.test(e[2]) ? 255 : 1),
                      r =
                        (parseInt(e[3], 10) / (/%$/.test(e[3]) ? 100 : 1)) *
                        (/%$/.test(e[3]) ? 255 : 1)
                    return [
                      parseInt(n, 10),
                      parseInt(s, 10),
                      parseInt(r, 10),
                      e[4] ? parseFloat(e[4]) : 1
                    ]
                  }
                }),
                (e.Color.fromRgba = i.fromRgb),
                (e.Color.fromHsl = function (t) {
                  return i.fromSource(i.sourceFromHsl(t))
                }),
                (e.Color.sourceFromHsl = function (t) {
                  var e = t.match(i.reHSLa)
                  if (e) {
                    var s,
                      r,
                      a,
                      o = (((parseFloat(e[1]) % 360) + 360) % 360) / 360,
                      l = parseFloat(e[2]) / (/%$/.test(e[2]) ? 100 : 1),
                      c = parseFloat(e[3]) / (/%$/.test(e[3]) ? 100 : 1)
                    if (0 === l) s = r = a = c
                    else {
                      var h = c <= 0.5 ? c * (l + 1) : c + l - c * l,
                        d = 2 * c - h
                      ;(s = n(d, h, o + 1 / 3)),
                        (r = n(d, h, o)),
                        (a = n(d, h, o - 1 / 3))
                    }
                    return [
                      Math.round(255 * s),
                      Math.round(255 * r),
                      Math.round(255 * a),
                      e[4] ? parseFloat(e[4]) : 1
                    ]
                  }
                }),
                (e.Color.fromHsla = i.fromHsl),
                (e.Color.fromHex = function (t) {
                  return i.fromSource(i.sourceFromHex(t))
                }),
                (e.Color.sourceFromHex = function (t) {
                  if (t.match(i.reHex)) {
                    var e = t.slice(t.indexOf('#') + 1),
                      n = 3 === e.length || 4 === e.length,
                      s = 8 === e.length || 4 === e.length,
                      r = n ? e.charAt(0) + e.charAt(0) : e.substring(0, 2),
                      a = n ? e.charAt(1) + e.charAt(1) : e.substring(2, 4),
                      o = n ? e.charAt(2) + e.charAt(2) : e.substring(4, 6),
                      l = s
                        ? n
                          ? e.charAt(3) + e.charAt(3)
                          : e.substring(6, 8)
                        : 'FF'
                    return [
                      parseInt(r, 16),
                      parseInt(a, 16),
                      parseInt(o, 16),
                      parseFloat((parseInt(l, 16) / 255).toFixed(2))
                    ]
                  }
                }),
                (e.Color.fromSource = function (t) {
                  var e = new i()
                  return e.setSource(t), e
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'],
              n = ['ns', 'nesw', 'ew', 'nwse'],
              s = {},
              r = 'left',
              a = 'top',
              o = 'right',
              l = 'bottom',
              c = 'center',
              h = { top: l, bottom: a, left: o, right: r, center: c },
              d = e.util.radiansToDegrees,
              u =
                Math.sign ||
                function (t) {
                  return (t > 0) - (t < 0) || +t
                }
            function f (t, e) {
              var i = t.angle + d(Math.atan2(e.y, e.x)) + 360
              return Math.round((i % 360) / 45)
            }
            function p (t, i) {
              var n = i.transform.target,
                s = n.canvas,
                r = e.util.object.clone(i)
              ;(r.target = n), s && s.fire('object:' + t, r), n.fire(t, i)
            }
            function g (t, e) {
              var i = e.canvas,
                n = t[i.uniScaleKey]
              return (i.uniformScaling && !n) || (!i.uniformScaling && n)
            }
            function m (t) {
              return t.originX === c && t.originY === c
            }
            function v (t, e, i) {
              var n = t.lockScalingX,
                s = t.lockScalingY
              return !(
                (!n || !s) &&
                (e || (!n && !s) || !i) &&
                (!n || 'x' !== e) &&
                (!s || 'y' !== e)
              )
            }
            function b (t, e, i, n) {
              return { e: t, transform: e, pointer: { x: i, y: n } }
            }
            function y (t) {
              return function (e, i, n, s) {
                var r = i.target,
                  a = r.getCenterPoint(),
                  o = r.translateToOriginPoint(a, i.originX, i.originY),
                  l = t(e, i, n, s)
                return r.setPositionByOrigin(o, i.originX, i.originY), l
              }
            }
            function x (t, e) {
              return function (i, n, s, r) {
                var a = e(i, n, s, r)
                return a && p(t, b(i, n, s, r)), a
              }
            }
            function w (t, i, n, s, r) {
              var a = t.target,
                o = a.controls[t.corner],
                l = a.canvas.getZoom(),
                c = a.padding / l,
                h = a.toLocalPoint(new e.Point(s, r), i, n)
              return (
                h.x >= c && (h.x -= c),
                h.x <= -c && (h.x += c),
                h.y >= c && (h.y -= c),
                h.y <= c && (h.y += c),
                (h.x -= o.offsetX),
                (h.y -= o.offsetY),
                h
              )
            }
            function C (t) {
              return t.flipX !== t.flipY
            }
            function S (t, e, i, n, s) {
              if (0 !== t[e]) {
                var r = (s / t._getTransformedDimensions()[n]) * t[i]
                t.set(i, r)
              }
            }
            function T (t, e, i, n) {
              var s,
                c = e.target,
                h = c._getTransformedDimensions(0, c.skewY),
                u = w(e, e.originX, e.originY, i, n),
                f = Math.abs(2 * u.x) - h.x,
                p = c.skewX
              f < 2
                ? (s = 0)
                : ((s = d(Math.atan2(f / c.scaleX, h.y / c.scaleY))),
                  e.originX === r && e.originY === l && (s = -s),
                  e.originX === o && e.originY === a && (s = -s),
                  C(c) && (s = -s))
              var g = p !== s
              if (g) {
                var m = c._getTransformedDimensions().y
                c.set('skewX', s), S(c, 'skewY', 'scaleY', 'y', m)
              }
              return g
            }
            function E (t, e, i, n) {
              var s,
                c = e.target,
                h = c._getTransformedDimensions(c.skewX, 0),
                u = w(e, e.originX, e.originY, i, n),
                f = Math.abs(2 * u.y) - h.y,
                p = c.skewY
              f < 2
                ? (s = 0)
                : ((s = d(Math.atan2(f / c.scaleY, h.x / c.scaleX))),
                  e.originX === r && e.originY === l && (s = -s),
                  e.originX === o && e.originY === a && (s = -s),
                  C(c) && (s = -s))
              var g = p !== s
              if (g) {
                var m = c._getTransformedDimensions().x
                c.set('skewY', s), S(c, 'skewX', 'scaleX', 'x', m)
              }
              return g
            }
            function A (t, e, i, n, s) {
              s = s || {}
              var r,
                a,
                o,
                l,
                c,
                d,
                f = e.target,
                p = f.lockScalingX,
                b = f.lockScalingY,
                y = s.by,
                x = g(t, f),
                C = v(f, y, x),
                S = e.gestureScale
              if (C) return !1
              if (S) (a = e.scaleX * S), (o = e.scaleY * S)
              else {
                if (
                  ((r = w(e, e.originX, e.originY, i, n)),
                  (c = 'y' !== y ? u(r.x) : 1),
                  (d = 'x' !== y ? u(r.y) : 1),
                  e.signX || (e.signX = c),
                  e.signY || (e.signY = d),
                  f.lockScalingFlip && (e.signX !== c || e.signY !== d))
                )
                  return !1
                if (((l = f._getTransformedDimensions()), x && !y)) {
                  var T = Math.abs(r.x) + Math.abs(r.y),
                    E = e.original,
                    A =
                      T /
                      (Math.abs((l.x * E.scaleX) / f.scaleX) +
                        Math.abs((l.y * E.scaleY) / f.scaleY))
                  ;(a = E.scaleX * A), (o = E.scaleY * A)
                } else
                  (a = Math.abs((r.x * f.scaleX) / l.x)),
                    (o = Math.abs((r.y * f.scaleY) / l.y))
                m(e) && ((a *= 2), (o *= 2)),
                  e.signX !== c &&
                    'y' !== y &&
                    ((e.originX = h[e.originX]), (a *= -1), (e.signX = c)),
                  e.signY !== d &&
                    'x' !== y &&
                    ((e.originY = h[e.originY]), (o *= -1), (e.signY = d))
              }
              var I = f.scaleX,
                O = f.scaleY
              return (
                y
                  ? ('x' === y && f.set('scaleX', a),
                    'y' === y && f.set('scaleY', o))
                  : (!p && f.set('scaleX', a), !b && f.set('scaleY', o)),
                I !== f.scaleX || O !== f.scaleY
              )
            }
            ;(s.scaleCursorStyleHandler = function (t, e, n) {
              var s = g(t, n),
                r = ''
              if (
                (0 !== e.x && 0 === e.y
                  ? (r = 'x')
                  : 0 === e.x && 0 !== e.y && (r = 'y'),
                v(n, r, s))
              )
                return 'not-allowed'
              var a = f(n, e)
              return i[a] + '-resize'
            }),
              (s.skewCursorStyleHandler = function (t, e, i) {
                var s = 'not-allowed'
                if (0 !== e.x && i.lockSkewingY) return s
                if (0 !== e.y && i.lockSkewingX) return s
                var r = f(i, e) % 4
                return n[r] + '-resize'
              }),
              (s.scaleSkewCursorStyleHandler = function (t, e, i) {
                return t[i.canvas.altActionKey]
                  ? s.skewCursorStyleHandler(t, e, i)
                  : s.scaleCursorStyleHandler(t, e, i)
              }),
              (s.rotationWithSnapping = x(
                'rotating',
                y(function (t, e, i, n) {
                  var s = e,
                    r = s.target,
                    a = r.translateToOriginPoint(
                      r.getCenterPoint(),
                      s.originX,
                      s.originY
                    )
                  if (r.lockRotation) return !1
                  var o,
                    l = Math.atan2(s.ey - a.y, s.ex - a.x),
                    c = Math.atan2(n - a.y, i - a.x),
                    h = d(c - l + s.theta)
                  if (r.snapAngle > 0) {
                    var u = r.snapAngle,
                      f = r.snapThreshold || u,
                      p = Math.ceil(h / u) * u,
                      g = Math.floor(h / u) * u
                    Math.abs(h - g) < f
                      ? (h = g)
                      : Math.abs(h - p) < f && (h = p)
                  }
                  return (
                    h < 0 && (h = 360 + h),
                    (h %= 360),
                    (o = r.angle !== h),
                    (r.angle = h),
                    o
                  )
                })
              )),
              (s.scalingEqually = x(
                'scaling',
                y(function (t, e, i, n) {
                  return A(t, e, i, n)
                })
              )),
              (s.scalingX = x(
                'scaling',
                y(function (t, e, i, n) {
                  return A(t, e, i, n, { by: 'x' })
                })
              )),
              (s.scalingY = x(
                'scaling',
                y(function (t, e, i, n) {
                  return A(t, e, i, n, { by: 'y' })
                })
              )),
              (s.scalingYOrSkewingX = function (t, e, i, n) {
                return t[e.target.canvas.altActionKey]
                  ? s.skewHandlerX(t, e, i, n)
                  : s.scalingY(t, e, i, n)
              }),
              (s.scalingXOrSkewingY = function (t, e, i, n) {
                return t[e.target.canvas.altActionKey]
                  ? s.skewHandlerY(t, e, i, n)
                  : s.scalingX(t, e, i, n)
              }),
              (s.changeWidth = x(
                'resizing',
                y(function (t, e, i, n) {
                  var s = e.target,
                    r = w(e, e.originX, e.originY, i, n),
                    a = s.strokeWidth / (s.strokeUniform ? s.scaleX : 1),
                    o = m(e) ? 2 : 1,
                    l = s.width,
                    c = Math.abs((r.x * o) / s.scaleX) - a
                  return s.set('width', Math.max(c, 0)), l !== c
                })
              )),
              (s.skewHandlerX = function (t, e, i, n) {
                var s,
                  l = e.target,
                  h = l.skewX,
                  d = e.originY
                return (
                  !l.lockSkewingX &&
                  (0 === h
                    ? (s = w(e, c, c, i, n).x > 0 ? r : o)
                    : (h > 0 && (s = d === a ? r : o),
                      h < 0 && (s = d === a ? o : r),
                      C(l) && (s = s === r ? o : r)),
                  (e.originX = s),
                  x('skewing', y(T))(t, e, i, n))
                )
              }),
              (s.skewHandlerY = function (t, e, i, n) {
                var s,
                  o = e.target,
                  h = o.skewY,
                  d = e.originX
                return (
                  !o.lockSkewingY &&
                  (0 === h
                    ? (s = w(e, c, c, i, n).y > 0 ? a : l)
                    : (h > 0 && (s = d === r ? a : l),
                      h < 0 && (s = d === r ? l : a),
                      C(o) && (s = s === a ? l : a)),
                  (e.originY = s),
                  x('skewing', y(E))(t, e, i, n))
                )
              }),
              (s.dragHandler = function (t, e, i, n) {
                var s = e.target,
                  r = i - e.offsetX,
                  a = n - e.offsetY,
                  o = !s.get('lockMovementX') && s.left !== r,
                  l = !s.get('lockMovementY') && s.top !== a
                return (
                  o && s.set('left', r),
                  l && s.set('top', a),
                  (o || l) && p('moving', b(t, e, i, n)),
                  o || l
                )
              }),
              (s.scaleOrSkewActionName = function (t, e, i) {
                var n = t[i.canvas.altActionKey]
                return 0 === e.x
                  ? n
                    ? 'skewX'
                    : 'scaleY'
                  : 0 === e.y
                  ? n
                    ? 'skewY'
                    : 'scaleX'
                  : void 0
              }),
              (s.rotationStyleHandler = function (t, e, i) {
                return i.lockRotation ? 'not-allowed' : e.cursorStyle
              }),
              (s.fireEvent = p),
              (s.wrapWithFixedAnchor = y),
              (s.wrapWithFireEvent = x),
              (s.getLocalPoint = w),
              (e.controlsUtils = s)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.degreesToRadians,
              n = e.controlsUtils
            ;(n.renderCircleControl = function (t, e, i, n, s) {
              n = n || {}
              var r,
                a = this.sizeX || n.cornerSize || s.cornerSize,
                o = this.sizeY || n.cornerSize || s.cornerSize,
                l =
                  void 0 !== n.transparentCorners
                    ? n.transparentCorners
                    : s.transparentCorners,
                c = l ? 'stroke' : 'fill',
                h = !l && (n.cornerStrokeColor || s.cornerStrokeColor),
                d = e,
                u = i
              t.save(),
                (t.fillStyle = n.cornerColor || s.cornerColor),
                (t.strokeStyle = n.cornerStrokeColor || s.cornerStrokeColor),
                a > o
                  ? ((r = a), t.scale(1, o / a), (u = (i * a) / o))
                  : o > a
                  ? ((r = o), t.scale(a / o, 1), (d = (e * o) / a))
                  : (r = a),
                (t.lineWidth = 1),
                t.beginPath(),
                t.arc(d, u, r / 2, 0, 2 * Math.PI, !1),
                t[c](),
                h && t.stroke(),
                t.restore()
            }),
              (n.renderSquareControl = function (t, e, n, s, r) {
                s = s || {}
                var a = this.sizeX || s.cornerSize || r.cornerSize,
                  o = this.sizeY || s.cornerSize || r.cornerSize,
                  l =
                    void 0 !== s.transparentCorners
                      ? s.transparentCorners
                      : r.transparentCorners,
                  c = l ? 'stroke' : 'fill',
                  h = !l && (s.cornerStrokeColor || r.cornerStrokeColor),
                  d = a / 2,
                  u = o / 2
                t.save(),
                  (t.fillStyle = s.cornerColor || r.cornerColor),
                  (t.strokeStyle = s.cornerStrokeColor || r.cornerStrokeColor),
                  (t.lineWidth = 1),
                  t.translate(e, n),
                  t.rotate(i(r.angle)),
                  t[c + 'Rect'](-d, -u, a, o),
                  h && t.strokeRect(-d, -u, a, o),
                  t.restore()
              })
          })(e),
          (function (t) {
            localStorage.setItem('fpdInstance', '')
            ;('use strict')
            var e = t.fabric || (t.fabric = {})
            ;(e.Control = function (t) {
              for (var e in t) this[e] = t[e]
            }),
              (e.Control.prototype = {
                visible: !0,
                actionName: 'scale',
                angle: 0,
                x: 0,
                y: 0,
                offsetX: 0,
                offsetY: 0,
                sizeX: null,
                sizeY: null,
                touchSizeX: null,
                touchSizeY: null,
                cursorStyle: 'crosshair',
                withConnection: !1,
                actionHandler: function () {},
                mouseDownHandler: function () {},
                mouseUpHandler: function () {},
                getActionHandler: function () {
                  return this.actionHandler
                },
                getMouseDownHandler: function () {
                  return this.mouseDownHandler
                },
                getMouseUpHandler: function () {
                  return this.mouseUpHandler
                },
                cursorStyleHandler: function (t, e) {
                  return e.cursorStyle
                },
                getActionName: function (t, e) {
                  return e.actionName
                },
                getVisibility: function (t, e) {
                  var i = t._controlsVisibility
                  return i && void 0 !== i[e] ? i[e] : this.visible
                },
                setVisibility: function (t) {
                  this.visible = t
                },
                positionHandler: function (t, i) {
                  return e.util.transformPoint(
                    {
                      x: this.x * t.x + this.offsetX,
                      y: this.y * t.y + this.offsetY
                    },
                    i
                  )
                },
                calcCornerCoords: function (t, i, n, s, r) {
                  var a,
                    o,
                    l,
                    c,
                    h = r ? this.touchSizeX : this.sizeX,
                    d = r ? this.touchSizeY : this.sizeY
                  if (h && d && h !== d) {
                    var u = Math.atan2(d, h),
                      f = Math.sqrt(h * h + d * d) / 2,
                      p = u - e.util.degreesToRadians(t),
                      g = Math.PI / 2 - u - e.util.degreesToRadians(t)
                    ;(a = f * e.util.cos(p)),
                      (o = f * e.util.sin(p)),
                      (l = f * e.util.cos(g)),
                      (c = f * e.util.sin(g))
                  } else
                    (f = 0.7071067812 * (h && d ? h : i)),
                      (p = e.util.degreesToRadians(45 - t)),
                      (a = l = f * e.util.cos(p)),
                      (o = c = f * e.util.sin(p))
                  return {
                    tl: { x: n - c, y: s - l },
                    tr: { x: n + a, y: s - o },
                    bl: { x: n - a, y: s + o },
                    br: { x: n + c, y: s + l }
                  }
                },
                render: function (t, i, n, s, r) {
                  'circle' === ((s = s || {}).cornerStyle || r.cornerStyle)
                    ? e.controlsUtils.renderCircleControl.call(
                        this,
                        t,
                        i,
                        n,
                        s,
                        r
                      )
                    : e.controlsUtils.renderSquareControl.call(
                        this,
                        t,
                        i,
                        n,
                        s,
                        r
                      )
                }
              })
          })(e),
          (function () {
            function t (t, e) {
              var i,
                n,
                s,
                r,
                a = t.getAttribute('style'),
                o = t.getAttribute('offset') || 0
              if (
                ((o =
                  (o = parseFloat(o) / (/%$/.test(o) ? 100 : 1)) < 0
                    ? 0
                    : o > 1
                    ? 1
                    : o),
                a)
              ) {
                var l = a.split(/\s*;\s*/)
                for ('' === l[l.length - 1] && l.pop(), r = l.length; r--; ) {
                  var c = l[r].split(/\s*:\s*/),
                    h = c[0].trim(),
                    d = c[1].trim()
                  'stop-color' === h ? (i = d) : 'stop-opacity' === h && (s = d)
                }
              }
              return (
                i || (i = t.getAttribute('stop-color') || 'rgb(0,0,0)'),
                s || (s = t.getAttribute('stop-opacity')),
                (n = (i = new E.Color(i)).getAlpha()),
                (s = isNaN(parseFloat(s)) ? 1 : parseFloat(s)),
                (s *= n * e),
                { offset: o, color: i.toRgb(), opacity: s }
              )
            }
            var e = E.util.object.clone
            ;(E.Gradient = E.util.createClass({
              offsetX: 0,
              offsetY: 0,
              gradientTransform: null,
              gradientUnits: 'pixels',
              type: 'linear',
              initialize: function (t) {
                t || (t = {}), t.coords || (t.coords = {})
                var e,
                  i = this
                Object.keys(t).forEach(function (e) {
                  i[e] = t[e]
                }),
                  this.id
                    ? (this.id += '_' + E.Object.__uid++)
                    : (this.id = E.Object.__uid++),
                  (e = {
                    x1: t.coords.x1 || 0,
                    y1: t.coords.y1 || 0,
                    x2: t.coords.x2 || 0,
                    y2: t.coords.y2 || 0
                  }),
                  'radial' === this.type &&
                    ((e.r1 = t.coords.r1 || 0), (e.r2 = t.coords.r2 || 0)),
                  (this.coords = e),
                  (this.colorStops = t.colorStops.slice())
              },
              addColorStop: function (t) {
                for (var e in t) {
                  var i = new E.Color(t[e])
                  this.colorStops.push({
                    offset: parseFloat(e),
                    color: i.toRgb(),
                    opacity: i.getAlpha()
                  })
                }
                return this
              },
              toObject: function (t) {
                var e = {
                  type: this.type,
                  coords: this.coords,
                  colorStops: this.colorStops,
                  offsetX: this.offsetX,
                  offsetY: this.offsetY,
                  gradientUnits: this.gradientUnits,
                  gradientTransform: this.gradientTransform
                    ? this.gradientTransform.concat()
                    : this.gradientTransform
                }
                return E.util.populateWithProperties(this, e, t), e
              },
              toSVG: function (t, i) {
                var n,
                  s,
                  r,
                  a,
                  o = e(this.coords, !0),
                  l = ((i = i || {}), e(this.colorStops, !0)),
                  c = o.r1 > o.r2,
                  h = this.gradientTransform
                    ? this.gradientTransform.concat()
                    : E.iMatrix.concat(),
                  d = -this.offsetX,
                  u = -this.offsetY,
                  f = !!i.additionalTransform,
                  p =
                    'pixels' === this.gradientUnits
                      ? 'userSpaceOnUse'
                      : 'objectBoundingBox'
                if (
                  (l.sort(function (t, e) {
                    return t.offset - e.offset
                  }),
                  'objectBoundingBox' === p
                    ? ((d /= t.width), (u /= t.height))
                    : ((d += t.width / 2), (u += t.height / 2)),
                  'path' === t.type &&
                    'percentage' !== this.gradientUnits &&
                    ((d -= t.pathOffset.x), (u -= t.pathOffset.y)),
                  (h[4] -= d),
                  (h[5] -= u),
                  (a = 'id="SVGID_' + this.id + '" gradientUnits="' + p + '"'),
                  (a +=
                    ' gradientTransform="' +
                    (f ? i.additionalTransform + ' ' : '') +
                    E.util.matrixToSVG(h) +
                    '" '),
                  'linear' === this.type
                    ? (r = [
                        '<linearGradient ',
                        a,
                        ' x1="',
                        o.x1,
                        '" y1="',
                        o.y1,
                        '" x2="',
                        o.x2,
                        '" y2="',
                        o.y2,
                        '">\n'
                      ])
                    : 'radial' === this.type &&
                      (r = [
                        '<radialGradient ',
                        a,
                        ' cx="',
                        c ? o.x1 : o.x2,
                        '" cy="',
                        c ? o.y1 : o.y2,
                        '" r="',
                        c ? o.r1 : o.r2,
                        '" fx="',
                        c ? o.x2 : o.x1,
                        '" fy="',
                        c ? o.y2 : o.y1,
                        '">\n'
                      ]),
                  'radial' === this.type)
                ) {
                  if (c)
                    for (
                      (l = l.concat()).reverse(), n = 0, s = l.length;
                      n < s;
                      n++
                    )
                      l[n].offset = 1 - l[n].offset
                  var g = Math.min(o.r1, o.r2)
                  if (g > 0) {
                    var m = g / Math.max(o.r1, o.r2)
                    for (n = 0, s = l.length; n < s; n++)
                      l[n].offset += m * (1 - l[n].offset)
                  }
                }
                for (n = 0, s = l.length; n < s; n++) {
                  var v = l[n]
                  r.push(
                    '<stop ',
                    'offset="',
                    100 * v.offset + '%',
                    '" style="stop-color:',
                    v.color,
                    void 0 !== v.opacity ? ';stop-opacity: ' + v.opacity : ';',
                    '"/>\n'
                  )
                }
                return (
                  r.push(
                    'linear' === this.type
                      ? '</linearGradient>\n'
                      : '</radialGradient>\n'
                  ),
                  r.join('')
                )
              },
              toLive: function (t) {
                var e,
                  i,
                  n,
                  s = E.util.object.clone(this.coords)
                if (this.type) {
                  for (
                    'linear' === this.type
                      ? (e = t.createLinearGradient(s.x1, s.y1, s.x2, s.y2))
                      : 'radial' === this.type &&
                        (e = t.createRadialGradient(
                          s.x1,
                          s.y1,
                          s.r1,
                          s.x2,
                          s.y2,
                          s.r2
                        )),
                      i = 0,
                      n = this.colorStops.length;
                    i < n;
                    i++
                  ) {
                    var r = this.colorStops[i].color,
                      a = this.colorStops[i].opacity,
                      o = this.colorStops[i].offset
                    void 0 !== a && (r = new E.Color(r).setAlpha(a).toRgba()),
                      e.addColorStop(o, r)
                  }
                  return e
                }
              }
            })),
              E.util.object.extend(E.Gradient, {
                fromElement: function (e, i, n, s) {
                  var r = parseFloat(n) / (/%$/.test(n) ? 100 : 1)
                  ;(r = r < 0 ? 0 : r > 1 ? 1 : r), isNaN(r) && (r = 1)
                  var a,
                    o,
                    l,
                    c,
                    h = e.getElementsByTagName('stop'),
                    d =
                      'userSpaceOnUse' === e.getAttribute('gradientUnits')
                        ? 'pixels'
                        : 'percentage',
                    u = e.getAttribute('gradientTransform') || '',
                    f = [],
                    p = 0,
                    g = 0
                  for (
                    'linearGradient' === e.nodeName ||
                    'LINEARGRADIENT' === e.nodeName
                      ? ((a = 'linear'),
                        (o = (function (t) {
                          return {
                            x1: t.getAttribute('x1') || 0,
                            y1: t.getAttribute('y1') || 0,
                            x2: t.getAttribute('x2') || '100%',
                            y2: t.getAttribute('y2') || 0
                          }
                        })(e)))
                      : ((a = 'radial'),
                        (o = (function (t) {
                          return {
                            x1:
                              t.getAttribute('fx') ||
                              t.getAttribute('cx') ||
                              '50%',
                            y1:
                              t.getAttribute('fy') ||
                              t.getAttribute('cy') ||
                              '50%',
                            r1: 0,
                            x2: t.getAttribute('cx') || '50%',
                            y2: t.getAttribute('cy') || '50%',
                            r2: t.getAttribute('r') || '50%'
                          }
                        })(e))),
                      l = h.length;
                    l--;

                  )
                    f.push(t(h[l], r))
                  return (
                    (c = E.parseTransformAttribute(u)),
                    (function (t, e, i, n) {
                      var s, r
                      Object.keys(e).forEach(function (t) {
                        'Infinity' === (s = e[t])
                          ? (r = 1)
                          : '-Infinity' === s
                          ? (r = 0)
                          : ((r = parseFloat(e[t], 10)),
                            'string' == typeof s &&
                              /^(\d+\.\d+)%|(\d+)%$/.test(s) &&
                              ((r *= 0.01),
                              'pixels' === n &&
                                (('x1' !== t && 'x2' !== t && 'r2' !== t) ||
                                  (r *= i.viewBoxWidth || i.width),
                                ('y1' !== t && 'y2' !== t) ||
                                  (r *= i.viewBoxHeight || i.height)))),
                          (e[t] = r)
                      })
                    })(0, o, s, d),
                    'pixels' === d && ((p = -i.left), (g = -i.top)),
                    new E.Gradient({
                      id: e.getAttribute('id'),
                      type: a,
                      coords: o,
                      colorStops: f,
                      gradientUnits: d,
                      gradientTransform: c,
                      offsetX: p,
                      offsetY: g
                    })
                  )
                }
              })
          })(),
          (function () {
            'use strict'
            var t = E.util.toFixed
            E.Pattern = E.util.createClass({
              repeat: 'repeat',
              offsetX: 0,
              offsetY: 0,
              crossOrigin: '',
              patternTransform: null,
              initialize: function (t, e) {
                if (
                  (t || (t = {}),
                  (this.id = E.Object.__uid++),
                  this.setOptions(t),
                  !t.source || (t.source && 'string' != typeof t.source))
                )
                  e && e(this)
                else {
                  var i = this
                  ;(this.source = E.util.createImage()),
                    E.util.loadImage(
                      t.source,
                      function (t, n) {
                        ;(i.source = t), e && e(i, n)
                      },
                      null,
                      this.crossOrigin
                    )
                }
              },
              toObject: function (e) {
                var i,
                  n,
                  s = E.Object.NUM_FRACTION_DIGITS
                return (
                  'string' == typeof this.source.src
                    ? (i = this.source.src)
                    : 'object' == typeof this.source &&
                      this.source.toDataURL &&
                      (i = this.source.toDataURL()),
                  (n = {
                    type: 'pattern',
                    source: i,
                    repeat: this.repeat,
                    crossOrigin: this.crossOrigin,
                    offsetX: t(this.offsetX, s),
                    offsetY: t(this.offsetY, s),
                    patternTransform: this.patternTransform
                      ? this.patternTransform.concat()
                      : null
                  }),
                  E.util.populateWithProperties(this, n, e),
                  n
                )
              },
              toSVG: function (t) {
                var e =
                    'function' == typeof this.source
                      ? this.source()
                      : this.source,
                  i = e.width / t.width,
                  n = e.height / t.height,
                  s = this.offsetX / t.width,
                  r = this.offsetY / t.height,
                  a = ''
                return (
                  ('repeat-x' !== this.repeat && 'no-repeat' !== this.repeat) ||
                    ((n = 1), r && (n += Math.abs(r))),
                  ('repeat-y' !== this.repeat && 'no-repeat' !== this.repeat) ||
                    ((i = 1), s && (i += Math.abs(s))),
                  e.src ? (a = e.src) : e.toDataURL && (a = e.toDataURL()),
                  '<pattern id="SVGID_' +
                    this.id +
                    '" x="' +
                    s +
                    '" y="' +
                    r +
                    '" width="' +
                    i +
                    '" height="' +
                    n +
                    '">\n<image x="0" y="0" width="' +
                    e.width +
                    '" height="' +
                    e.height +
                    '" xlink:href="' +
                    a +
                    '"></image>\n</pattern>\n'
                )
              },
              setOptions: function (t) {
                for (var e in t) this[e] = t[e]
              },
              toLive: function (t) {
                var e = this.source
                if (!e) return ''
                if (void 0 !== e.src) {
                  if (!e.complete) return ''
                  if (0 === e.naturalWidth || 0 === e.naturalHeight) return ''
                }
                return t.createPattern(e, this.repeat)
              }
            })
          })(),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.toFixed
            e.Shadow
              ? e.warn('fabric.Shadow is already defined.')
              : ((e.Shadow = e.util.createClass({
                  color: 'rgb(0,0,0)',
                  blur: 0,
                  offsetX: 0,
                  offsetY: 0,
                  affectStroke: !1,
                  includeDefaultValues: !0,
                  nonScaling: !1,
                  initialize: function (t) {
                    for (var i in ('string' == typeof t &&
                      (t = this._parseShadow(t)),
                    t))
                      this[i] = t[i]
                    this.id = e.Object.__uid++
                  },
                  _parseShadow: function (t) {
                    var i = t.trim(),
                      n = e.Shadow.reOffsetsAndBlur.exec(i) || []
                    return {
                      color: (
                        i.replace(e.Shadow.reOffsetsAndBlur, '') || 'rgb(0,0,0)'
                      ).trim(),
                      offsetX: parseFloat(n[1], 10) || 0,
                      offsetY: parseFloat(n[2], 10) || 0,
                      blur: parseFloat(n[3], 10) || 0
                    }
                  },
                  toString: function () {
                    return [
                      this.offsetX,
                      this.offsetY,
                      this.blur,
                      this.color
                    ].join('px ')
                  },
                  toSVG: function (t) {
                    var n = 40,
                      s = 40,
                      r = e.Object.NUM_FRACTION_DIGITS,
                      a = e.util.rotateVector(
                        { x: this.offsetX, y: this.offsetY },
                        e.util.degreesToRadians(-t.angle)
                      ),
                      o = new e.Color(this.color)
                    return (
                      t.width &&
                        t.height &&
                        ((n =
                          100 * i((Math.abs(a.x) + this.blur) / t.width, r) +
                          20),
                        (s =
                          100 * i((Math.abs(a.y) + this.blur) / t.height, r) +
                          20)),
                      t.flipX && (a.x *= -1),
                      t.flipY && (a.y *= -1),
                      '<filter id="SVGID_' +
                        this.id +
                        '" y="-' +
                        s +
                        '%" height="' +
                        (100 + 2 * s) +
                        '%" x="-' +
                        n +
                        '%" width="' +
                        (100 + 2 * n) +
                        '%" >\n\t<feGaussianBlur in="SourceAlpha" stdDeviation="' +
                        i(this.blur ? this.blur / 2 : 0, r) +
                        '"></feGaussianBlur>\n\t<feOffset dx="' +
                        i(a.x, r) +
                        '" dy="' +
                        i(a.y, r) +
                        '" result="oBlur" ></feOffset>\n\t<feFlood flood-color="' +
                        o.toRgb() +
                        '" flood-opacity="' +
                        o.getAlpha() +
                        '"/>\n\t<feComposite in2="oBlur" operator="in" />\n\t<feMerge>\n\t\t<feMergeNode></feMergeNode>\n\t\t<feMergeNode in="SourceGraphic"></feMergeNode>\n\t</feMerge>\n</filter>\n'
                    )
                  },
                  toObject: function () {
                    if (this.includeDefaultValues)
                      return {
                        color: this.color,
                        blur: this.blur,
                        offsetX: this.offsetX,
                        offsetY: this.offsetY,
                        affectStroke: this.affectStroke,
                        nonScaling: this.nonScaling
                      }
                    var t = {},
                      i = e.Shadow.prototype
                    return (
                      [
                        'color',
                        'blur',
                        'offsetX',
                        'offsetY',
                        'affectStroke',
                        'nonScaling'
                      ].forEach(function (e) {
                        this[e] !== i[e] && (t[e] = this[e])
                      }, this),
                      t
                    )
                  }
                })),
                (e.Shadow.reOffsetsAndBlur =
                  /(?:\s|^)(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(\d+(?:\.\d*)?(?:px)?)?(?:\s?|$)(?:$|\s)/))
          })(e),
          (function () {
            'use strict'
            if (E.StaticCanvas)
              E.warn('fabric.StaticCanvas is already defined.')
            else {
              var t = E.util.object.extend,
                e = E.util.getElementOffset,
                i = E.util.removeFromArray,
                n = E.util.toFixed,
                s = E.util.transformPoint,
                r = E.util.invertTransform,
                a = E.util.getNodeCanvas,
                o = E.util.createCanvasElement,
                l = new Error('Could not initialize `canvas` element')
              ;(E.StaticCanvas = E.util.createClass(E.CommonMethods, {
                initialize: function (t, e) {
                  e || (e = {}),
                    (this.renderAndResetBound = this.renderAndReset.bind(this)),
                    (this.requestRenderAllBound =
                      this.requestRenderAll.bind(this)),
                    this._initStatic(t, e)
                },
                backgroundColor: '',
                backgroundImage: null,
                overlayColor: '',
                overlayImage: null,
                includeDefaultValues: !0,
                stateful: !1,
                renderOnAddRemove: !0,
                controlsAboveOverlay: !1,
                allowTouchScrolling: !1,
                imageSmoothingEnabled: !0,
                viewportTransform: E.iMatrix.concat(),
                backgroundVpt: !0,
                overlayVpt: !0,
                enableRetinaScaling: !0,
                vptCoords: {},
                skipOffscreen: !0,
                clipPath: void 0,
                _initStatic: function (t, e) {
                  var i = this.requestRenderAllBound
                  ;(this._objects = []),
                    this._createLowerCanvas(t),
                    this._initOptions(e),
                    this.interactive || this._initRetinaScaling(),
                    e.overlayImage && this.setOverlayImage(e.overlayImage, i),
                    e.backgroundImage &&
                      this.setBackgroundImage(e.backgroundImage, i),
                    e.backgroundColor &&
                      this.setBackgroundColor(e.backgroundColor, i),
                    e.overlayColor && this.setOverlayColor(e.overlayColor, i),
                    this.calcOffset()
                },
                _isRetinaScaling: function () {
                  return E.devicePixelRatio > 1 && this.enableRetinaScaling
                },
                getRetinaScaling: function () {
                  return this._isRetinaScaling()
                    ? Math.max(1, E.devicePixelRatio)
                    : 1
                },
                _initRetinaScaling: function () {
                  if (this._isRetinaScaling()) {
                    var t = E.devicePixelRatio
                    this.__initRetinaScaling(
                      t,
                      this.lowerCanvasEl,
                      this.contextContainer
                    ),
                      this.upperCanvasEl &&
                        this.__initRetinaScaling(
                          t,
                          this.upperCanvasEl,
                          this.contextTop
                        )
                  }
                },
                __initRetinaScaling: function (t, e, i) {
                  e.setAttribute('width', this.width * t),
                    e.setAttribute('height', this.height * t),
                    i.scale(t, t)
                },
                calcOffset: function () {
                  return (this._offset = e(this.lowerCanvasEl)), this
                },
                setOverlayImage: function (t, e, i) {
                  return this.__setBgOverlayImage('overlayImage', t, e, i)
                },
                setBackgroundImage: function (t, e, i) {
                  return this.__setBgOverlayImage('backgroundImage', t, e, i)
                },
                setOverlayColor: function (t, e) {
                  return this.__setBgOverlayColor('overlayColor', t, e)
                },
                setBackgroundColor: function (t, e) {
                  return this.__setBgOverlayColor('backgroundColor', t, e)
                },
                __setBgOverlayImage: function (t, e, i, n) {
                  return (
                    'string' == typeof e
                      ? E.util.loadImage(
                          e,
                          function (e, s) {
                            if (e) {
                              var r = new E.Image(e, n)
                              ;(this[t] = r), (r.canvas = this)
                            }
                            i && i(e, s)
                          },
                          this,
                          n && n.crossOrigin
                        )
                      : (n && e.setOptions(n),
                        (this[t] = e),
                        e && (e.canvas = this),
                        i && i(e, !1)),
                    this
                  )
                },
                __setBgOverlayColor: function (t, e, i) {
                  return (
                    (this[t] = e),
                    this._initGradient(e, t),
                    this._initPattern(e, t, i),
                    this
                  )
                },
                _createCanvasElement: function () {
                  var t = o()
                  if (!t) throw l
                  if ((t.style || (t.style = {}), void 0 === t.getContext))
                    throw l
                  return t
                },
                _initOptions: function (t) {
                  var e = this.lowerCanvasEl
                  this._setOptions(t),
                    (this.width = this.width || parseInt(e.width, 10) || 0),
                    (this.height = this.height || parseInt(e.height, 10) || 0),
                    this.lowerCanvasEl.style &&
                      ((e.width = this.width),
                      (e.height = this.height),
                      (e.style.width = this.width + 'px'),
                      (e.style.height = this.height + 'px'),
                      (this.viewportTransform = this.viewportTransform.slice()))
                },
                _createLowerCanvas: function (t) {
                  t && t.getContext
                    ? (this.lowerCanvasEl = t)
                    : (this.lowerCanvasEl =
                        E.util.getById(t) || this._createCanvasElement()),
                    E.util.addClass(this.lowerCanvasEl, 'lower-canvas'),
                    (this._originalCanvasStyle = this.lowerCanvasEl.style),
                    this.interactive &&
                      this._applyCanvasStyle(this.lowerCanvasEl),
                    (this.contextContainer =
                      this.lowerCanvasEl.getContext('2d'))
                },
                getWidth: function () {
                  return this.width
                },
                getHeight: function () {
                  return this.height
                },
                setWidth: function (t, e) {
                  return this.setDimensions({ width: t }, e)
                },
                setHeight: function (t, e) {
                  return this.setDimensions({ height: t }, e)
                },
                setDimensions: function (t, e) {
                  var i
                  for (var n in ((e = e || {}), t))
                    (i = t[n]),
                      e.cssOnly ||
                        (this._setBackstoreDimension(n, t[n]),
                        (i += 'px'),
                        (this.hasLostContext = !0)),
                      e.backstoreOnly || this._setCssDimension(n, i)
                  return (
                    this._isCurrentlyDrawing &&
                      this.freeDrawingBrush &&
                      this.freeDrawingBrush._setBrushStyles(this.contextTop),
                    this._initRetinaScaling(),
                    this.calcOffset(),
                    e.cssOnly || this.requestRenderAll(),
                    this
                  )
                },
                _setBackstoreDimension: function (t, e) {
                  return (
                    (this.lowerCanvasEl[t] = e),
                    this.upperCanvasEl && (this.upperCanvasEl[t] = e),
                    this.cacheCanvasEl && (this.cacheCanvasEl[t] = e),
                    (this[t] = e),
                    this
                  )
                },
                _setCssDimension: function (t, e) {
                  return (
                    (this.lowerCanvasEl.style[t] = e),
                    this.upperCanvasEl && (this.upperCanvasEl.style[t] = e),
                    this.wrapperEl && (this.wrapperEl.style[t] = e),
                    this
                  )
                },
                getZoom: function () {
                  return this.viewportTransform[0]
                },
                setViewportTransform: function (t) {
                  var e,
                    i,
                    n,
                    s = this._activeObject,
                    r = this.backgroundImage,
                    a = this.overlayImage
                  for (
                    this.viewportTransform = t, i = 0, n = this._objects.length;
                    i < n;
                    i++
                  )
                    (e = this._objects[i]).group || e.setCoords(!0)
                  return (
                    s && s.setCoords(),
                    r && r.setCoords(!0),
                    a && a.setCoords(!0),
                    this.calcViewportBoundaries(),
                    this.renderOnAddRemove && this.requestRenderAll(),
                    this
                  )
                },
                zoomToPoint: function (t, e) {
                  var i = t,
                    n = this.viewportTransform.slice(0)
                  ;(t = s(t, r(this.viewportTransform))), (n[0] = e), (n[3] = e)
                  var a = s(t, n)
                  return (
                    (n[4] += i.x - a.x),
                    (n[5] += i.y - a.y),
                    this.setViewportTransform(n)
                  )
                },
                setZoom: function (t) {
                  return this.zoomToPoint(new E.Point(0, 0), t), this
                },
                absolutePan: function (t) {
                  var e = this.viewportTransform.slice(0)
                  return (
                    (e[4] = -t.x), (e[5] = -t.y), this.setViewportTransform(e)
                  )
                },
                relativePan: function (t) {
                  return this.absolutePan(
                    new E.Point(
                      -t.x - this.viewportTransform[4],
                      -t.y - this.viewportTransform[5]
                    )
                  )
                },
                getElement: function () {
                  return this.lowerCanvasEl
                },
                _onObjectAdded: function (t) {
                  this.stateful && t.setupState(),
                    t._set('canvas', this),
                    t.setCoords(),
                    this.fire('object:added', { target: t }),
                    t.fire('added')
                },
                _onObjectRemoved: function (t) {
                  this.fire('object:removed', { target: t }),
                    t.fire('removed'),
                    delete t.canvas
                },
                clearContext: function (t) {
                  return t.clearRect(0, 0, this.width, this.height), this
                },
                getContext: function () {
                  return this.contextContainer
                },
                clear: function () {
                  return (
                    this.remove.apply(this, this.getObjects()),
                    (this.backgroundImage = null),
                    (this.overlayImage = null),
                    (this.backgroundColor = ''),
                    (this.overlayColor = ''),
                    this._hasITextHandlers &&
                      (this.off('mouse:up', this._mouseUpITextHandler),
                      (this._iTextInstances = null),
                      (this._hasITextHandlers = !1)),
                    this.clearContext(this.contextContainer),
                    this.fire('canvas:cleared'),
                    this.renderOnAddRemove && this.requestRenderAll(),
                    this
                  )
                },
                renderAll: function () {
                  var t = this.contextContainer
                  return this.renderCanvas(t, this._objects), this
                },
                renderAndReset: function () {
                  ;(this.isRendering = 0), this.renderAll()
                },
                requestRenderAll: function () {
                  return (
                    this.isRendering ||
                      (this.isRendering = E.util.requestAnimFrame(
                        this.renderAndResetBound
                      )),
                    this
                  )
                },
                calcViewportBoundaries: function () {
                  var t = {},
                    e = this.width,
                    i = this.height,
                    n = r(this.viewportTransform)
                  return (
                    (t.tl = s({ x: 0, y: 0 }, n)),
                    (t.br = s({ x: e, y: i }, n)),
                    (t.tr = new E.Point(t.br.x, t.tl.y)),
                    (t.bl = new E.Point(t.tl.x, t.br.y)),
                    (this.vptCoords = t),
                    t
                  )
                },
                cancelRequestedRender: function () {
                  this.isRendering &&
                    (E.util.cancelAnimFrame(this.isRendering),
                    (this.isRendering = 0))
                },
                renderCanvas: function (t, e) {
                  var i = this.viewportTransform,
                    n = this.clipPath
                  this.cancelRequestedRender(),
                    this.calcViewportBoundaries(),
                    this.clearContext(t),
                    E.util.setImageSmoothing(t, this.imageSmoothingEnabled),
                    this.fire('before:render', { ctx: t }),
                    this._renderBackground(t),
                    t.save(),
                    t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                    this._renderObjects(t, e),
                    t.restore(),
                    !this.controlsAboveOverlay &&
                      this.interactive &&
                      this.drawControls(t),
                    n &&
                      ((n.canvas = this),
                      n.shouldCache(),
                      (n._transformDone = !0),
                      n.renderCache({ forClipping: !0 }),
                      this.drawClipPathOnCanvas(t)),
                    this._renderOverlay(t),
                    this.controlsAboveOverlay &&
                      this.interactive &&
                      this.drawControls(t),
                    this.fire('after:render', { ctx: t })
                },
                drawClipPathOnCanvas: function (t) {
                  var e = this.viewportTransform,
                    i = this.clipPath
                  t.save(),
                    t.transform(e[0], e[1], e[2], e[3], e[4], e[5]),
                    (t.globalCompositeOperation = 'destination-in'),
                    i.transform(t),
                    t.scale(1 / i.zoomX, 1 / i.zoomY),
                    t.drawImage(
                      i._cacheCanvas,
                      -i.cacheTranslationX,
                      -i.cacheTranslationY
                    ),
                    t.restore()
                },
                _renderObjects: function (t, e) {
                  var i, n
                  for (i = 0, n = e.length; i < n; ++i) e[i] && e[i].render(t)
                },
                _renderBackgroundOrOverlay: function (t, e) {
                  var i = this[e + 'Color'],
                    n = this[e + 'Image'],
                    s = this.viewportTransform,
                    r = this[e + 'Vpt']
                  if (i || n) {
                    if (i) {
                      t.save(),
                        t.beginPath(),
                        t.moveTo(0, 0),
                        t.lineTo(this.width, 0),
                        t.lineTo(this.width, this.height),
                        t.lineTo(0, this.height),
                        t.closePath(),
                        (t.fillStyle = i.toLive ? i.toLive(t, this) : i),
                        r && t.transform(s[0], s[1], s[2], s[3], s[4], s[5]),
                        t.transform(1, 0, 0, 1, i.offsetX || 0, i.offsetY || 0)
                      var a = i.gradientTransform || i.patternTransform
                      a && t.transform(a[0], a[1], a[2], a[3], a[4], a[5]),
                        t.fill(),
                        t.restore()
                    }
                    n &&
                      (t.save(),
                      r && t.transform(s[0], s[1], s[2], s[3], s[4], s[5]),
                      n.render(t),
                      t.restore())
                  }
                },
                _renderBackground: function (t) {
                  this._renderBackgroundOrOverlay(t, 'background')
                },
                _renderOverlay: function (t) {
                  this._renderBackgroundOrOverlay(t, 'overlay')
                },
                getCenter: function () {
                  return { top: this.height / 2, left: this.width / 2 }
                },
                getCenterPoint: function () {
                  return new E.Point(this.width / 2, this.height / 2)
                },
                centerObjectH: function (t) {
                  return this._centerObject(
                    t,
                    new E.Point(this.getCenterPoint().x, t.getCenterPoint().y)
                  )
                },
                centerObjectV: function (t) {
                  return this._centerObject(
                    t,
                    new E.Point(t.getCenterPoint().x, this.getCenterPoint().y)
                  )
                },
                centerObject: function (t) {
                  var e = this.getCenterPoint()
                  return this._centerObject(t, e)
                },
                viewportCenterObject: function (t) {
                  var e = this.getVpCenter()
                  return this._centerObject(t, e)
                },
                viewportCenterObjectH: function (t) {
                  var e = this.getVpCenter()
                  return (
                    this._centerObject(
                      t,
                      new E.Point(e.x, t.getCenterPoint().y)
                    ),
                    this
                  )
                },
                viewportCenterObjectV: function (t) {
                  var e = this.getVpCenter()
                  return this._centerObject(
                    t,
                    new E.Point(t.getCenterPoint().x, e.y)
                  )
                },
                getVpCenter: function () {
                  var t = this.getCenterPoint(),
                    e = r(this.viewportTransform)
                  return s(t, e)
                },
                _centerObject: function (t, e) {
                  return (
                    t.setPositionByOrigin(e, 'center', 'center'),
                    t.setCoords(),
                    this.renderOnAddRemove && this.requestRenderAll(),
                    this
                  )
                },
                toDatalessJSON: function (t) {
                  return this.toDatalessObject(t)
                },
                toObject: function (t) {
                  return this._toObjectMethod('toObject', t)
                },
                toDatalessObject: function (t) {
                  return this._toObjectMethod('toDatalessObject', t)
                },
                _toObjectMethod: function (e, i) {
                  var n = this.clipPath,
                    s = { version: E.version, objects: this._toObjects(e, i) }
                  return (
                    n &&
                      !n.excludeFromExport &&
                      (s.clipPath = this._toObject(this.clipPath, e, i)),
                    t(s, this.__serializeBgOverlay(e, i)),
                    E.util.populateWithProperties(this, s, i),
                    s
                  )
                },
                _toObjects: function (t, e) {
                  return this._objects
                    .filter(function (t) {
                      return !t.excludeFromExport
                    })
                    .map(function (i) {
                      return this._toObject(i, t, e)
                    }, this)
                },
                _toObject: function (t, e, i) {
                  var n
                  this.includeDefaultValues ||
                    ((n = t.includeDefaultValues),
                    (t.includeDefaultValues = !1))
                  var s = t[e](i)
                  return (
                    this.includeDefaultValues || (t.includeDefaultValues = n), s
                  )
                },
                __serializeBgOverlay: function (t, e) {
                  var i = {},
                    n = this.backgroundImage,
                    s = this.overlayImage,
                    r = this.backgroundColor,
                    a = this.overlayColor
                  return (
                    r && r.toObject
                      ? r.excludeFromExport || (i.background = r.toObject(e))
                      : r && (i.background = r),
                    a && a.toObject
                      ? a.excludeFromExport || (i.overlay = a.toObject(e))
                      : a && (i.overlay = a),
                    n &&
                      !n.excludeFromExport &&
                      (i.backgroundImage = this._toObject(n, t, e)),
                    s &&
                      !s.excludeFromExport &&
                      (i.overlayImage = this._toObject(s, t, e)),
                    i
                  )
                },
                svgViewportTransformation: !0,
                toSVG: function (t, e) {
                  t || (t = {}), (t.reviver = e)
                  var i = []
                  return (
                    this._setSVGPreamble(i, t),
                    this._setSVGHeader(i, t),
                    this.clipPath &&
                      i.push(
                        '<g clip-path="url(#' +
                          this.clipPath.clipPathId +
                          ')" >\n'
                      ),
                    this._setSVGBgOverlayColor(i, 'background'),
                    this._setSVGBgOverlayImage(i, 'backgroundImage', e),
                    this._setSVGObjects(i, e),
                    this.clipPath && i.push('</g>\n'),
                    this._setSVGBgOverlayColor(i, 'overlay'),
                    this._setSVGBgOverlayImage(i, 'overlayImage', e),
                    i.push('</svg>'),
                    i.join('')
                  )
                },
                _setSVGPreamble: function (t, e) {
                  e.suppressPreamble ||
                    t.push(
                      '<?xml version="1.0" encoding="',
                      e.encoding || 'UTF-8',
                      '" standalone="no" ?>\n',
                      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
                      '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
                    )
                },
                _setSVGHeader: function (t, e) {
                  var i,
                    s = e.width || this.width,
                    r = e.height || this.height,
                    a = 'viewBox="0 0 ' + this.width + ' ' + this.height + '" ',
                    o = E.Object.NUM_FRACTION_DIGITS
                  e.viewBox
                    ? (a =
                        'viewBox="' +
                        e.viewBox.x +
                        ' ' +
                        e.viewBox.y +
                        ' ' +
                        e.viewBox.width +
                        ' ' +
                        e.viewBox.height +
                        '" ')
                    : this.svgViewportTransformation &&
                      ((i = this.viewportTransform),
                      (a =
                        'viewBox="' +
                        n(-i[4] / i[0], o) +
                        ' ' +
                        n(-i[5] / i[3], o) +
                        ' ' +
                        n(this.width / i[0], o) +
                        ' ' +
                        n(this.height / i[3], o) +
                        '" ')),
                    t.push(
                      '<svg ',
                      'xmlns="http://www.w3.org/2000/svg" ',
                      'xmlns:xlink="http://www.w3.org/1999/xlink" ',
                      'version="1.1" ',
                      'width="',
                      s,
                      '" ',
                      'height="',
                      r,
                      '" ',
                      a,
                      'xml:space="preserve">\n',
                      '<desc>Created with Fabric.js ',
                      E.version,
                      '</desc>\n',
                      '<defs>\n',
                      this.createSVGFontFacesMarkup(),
                      this.createSVGRefElementsMarkup(),
                      this.createSVGClipPathMarkup(e),
                      '</defs>\n'
                    )
                },
                createSVGClipPathMarkup: function (t) {
                  var e = this.clipPath
                  return e
                    ? ((e.clipPathId = 'CLIPPATH_' + E.Object.__uid++),
                      '<clipPath id="' +
                        e.clipPathId +
                        '" >\n' +
                        this.clipPath.toClipPathSVG(t.reviver) +
                        '</clipPath>\n')
                    : ''
                },
                createSVGRefElementsMarkup: function () {
                  var t = this
                  return ['background', 'overlay']
                    .map(function (e) {
                      var i = t[e + 'Color']
                      if (i && i.toLive) {
                        var n = t[e + 'Vpt'],
                          s = t.viewportTransform,
                          r = {
                            width: t.width / (n ? s[0] : 1),
                            height: t.height / (n ? s[3] : 1)
                          }
                        return i.toSVG(r, {
                          additionalTransform: n ? E.util.matrixToSVG(s) : ''
                        })
                      }
                    })
                    .join('')
                },
                createSVGFontFacesMarkup: function () {
                  var t,
                    e,
                    i,
                    n,
                    s,
                    r,
                    a,
                    o,
                    l = '',
                    c = {},
                    h = E.fontPaths,
                    d = []
                  for (
                    this._objects.forEach(function t (e) {
                      d.push(e), e._objects && e._objects.forEach(t)
                    }),
                      a = 0,
                      o = d.length;
                    a < o;
                    a++
                  )
                    if (
                      ((e = (t = d[a]).fontFamily),
                      -1 !== t.type.indexOf('text') &&
                        !c[e] &&
                        h[e] &&
                        ((c[e] = !0), t.styles))
                    )
                      for (s in (i = t.styles))
                        for (r in (n = i[s]))
                          !c[(e = n[r].fontFamily)] && h[e] && (c[e] = !0)
                  for (var u in c)
                    l += [
                      '\t\t@font-face {\n',
                      "\t\t\tfont-family: '",
                      u,
                      "';\n",
                      "\t\t\tsrc: url('",
                      h[u],
                      "');\n",
                      '\t\t}\n'
                    ].join('')
                  return (
                    l &&
                      (l = [
                        '\t<style type="text/css">',
                        '<![CDATA[\n',
                        l,
                        ']]>',
                        '</style>\n'
                      ].join('')),
                    l
                  )
                },
                _setSVGObjects: function (t, e) {
                  var i,
                    n,
                    s,
                    r = this._objects
                  for (n = 0, s = r.length; n < s; n++)
                    (i = r[n]).excludeFromExport || this._setSVGObject(t, i, e)
                },
                _setSVGObject: function (t, e, i) {
                  t.push(e.toSVG(i))
                },
                _setSVGBgOverlayImage: function (t, e, i) {
                  this[e] &&
                    !this[e].excludeFromExport &&
                    this[e].toSVG &&
                    t.push(this[e].toSVG(i))
                },
                _setSVGBgOverlayColor: function (t, e) {
                  var i = this[e + 'Color'],
                    n = this.viewportTransform,
                    s = this.width,
                    r = this.height
                  if (i)
                    if (i.toLive) {
                      var a = i.repeat,
                        o = E.util.invertTransform(n),
                        l = this[e + 'Vpt'] ? E.util.matrixToSVG(o) : ''
                      t.push(
                        '<rect transform="' + l + ' translate(',
                        s / 2,
                        ',',
                        r / 2,
                        ')"',
                        ' x="',
                        i.offsetX - s / 2,
                        '" y="',
                        i.offsetY - r / 2,
                        '" ',
                        'width="',
                        'repeat-y' === a || 'no-repeat' === a
                          ? i.source.width
                          : s,
                        '" height="',
                        'repeat-x' === a || 'no-repeat' === a
                          ? i.source.height
                          : r,
                        '" fill="url(#SVGID_' + i.id + ')"',
                        '></rect>\n'
                      )
                    } else
                      t.push(
                        '<rect x="0" y="0" width="100%" height="100%" ',
                        'fill="',
                        i,
                        '"',
                        '></rect>\n'
                      )
                },
                sendToBack: function (t) {
                  if (!t) return this
                  var e,
                    n,
                    s,
                    r = this._activeObject
                  if (t === r && 'activeSelection' === t.type)
                    for (e = (s = r._objects).length; e--; )
                      (n = s[e]), i(this._objects, n), this._objects.unshift(n)
                  else i(this._objects, t), this._objects.unshift(t)
                  return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                bringToFront: function (t) {
                  if (!t) return this
                  var e,
                    n,
                    s,
                    r = this._activeObject
                  if (t === r && 'activeSelection' === t.type)
                    for (s = r._objects, e = 0; e < s.length; e++)
                      (n = s[e]), i(this._objects, n), this._objects.push(n)
                  else i(this._objects, t), this._objects.push(t)
                  return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                sendBackwards: function (t, e) {
                  if (!t) return this
                  var n,
                    s,
                    r,
                    a,
                    o,
                    l = this._activeObject,
                    c = 0
                  if (t === l && 'activeSelection' === t.type)
                    for (o = l._objects, n = 0; n < o.length; n++)
                      (s = o[n]),
                        (r = this._objects.indexOf(s)) > 0 + c &&
                          ((a = r - 1),
                          i(this._objects, s),
                          this._objects.splice(a, 0, s)),
                        c++
                  else
                    0 !== (r = this._objects.indexOf(t)) &&
                      ((a = this._findNewLowerIndex(t, r, e)),
                      i(this._objects, t),
                      this._objects.splice(a, 0, t))
                  return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                _findNewLowerIndex: function (t, e, i) {
                  var n, s
                  if (i) {
                    for (n = e, s = e - 1; s >= 0; --s)
                      if (
                        t.intersectsWithObject(this._objects[s]) ||
                        t.isContainedWithinObject(this._objects[s]) ||
                        this._objects[s].isContainedWithinObject(t)
                      ) {
                        n = s
                        break
                      }
                  } else n = e - 1
                  return n
                },
                bringForward: function (t, e) {
                  if (!t) return this
                  var n,
                    s,
                    r,
                    a,
                    o,
                    l = this._activeObject,
                    c = 0
                  if (t === l && 'activeSelection' === t.type)
                    for (n = (o = l._objects).length; n--; )
                      (s = o[n]),
                        (r = this._objects.indexOf(s)) <
                          this._objects.length - 1 - c &&
                          ((a = r + 1),
                          i(this._objects, s),
                          this._objects.splice(a, 0, s)),
                        c++
                  else
                    (r = this._objects.indexOf(t)) !==
                      this._objects.length - 1 &&
                      ((a = this._findNewUpperIndex(t, r, e)),
                      i(this._objects, t),
                      this._objects.splice(a, 0, t))
                  return this.renderOnAddRemove && this.requestRenderAll(), this
                },
                _findNewUpperIndex: function (t, e, i) {
                  var n, s, r
                  if (i) {
                    for (n = e, s = e + 1, r = this._objects.length; s < r; ++s)
                      if (
                        t.intersectsWithObject(this._objects[s]) ||
                        t.isContainedWithinObject(this._objects[s]) ||
                        this._objects[s].isContainedWithinObject(t)
                      ) {
                        n = s
                        break
                      }
                  } else n = e + 1
                  return n
                },
                moveTo: function (t, e) {
                  return (
                    i(this._objects, t),
                    this._objects.splice(e, 0, t),
                    this.renderOnAddRemove && this.requestRenderAll()
                  )
                },
                dispose: function () {
                  return (
                    this.isRendering &&
                      (E.util.cancelAnimFrame(this.isRendering),
                      (this.isRendering = 0)),
                    this.forEachObject(function (t) {
                      t.dispose && t.dispose()
                    }),
                    (this._objects = []),
                    this.backgroundImage &&
                      this.backgroundImage.dispose &&
                      this.backgroundImage.dispose(),
                    (this.backgroundImage = null),
                    this.overlayImage &&
                      this.overlayImage.dispose &&
                      this.overlayImage.dispose(),
                    (this.overlayImage = null),
                    (this._iTextInstances = null),
                    (this.contextContainer = null),
                    this.lowerCanvasEl.classList.remove('lower-canvas'),
                    E.util.setStyle(
                      this.lowerCanvasEl,
                      this._originalCanvasStyle
                    ),
                    delete this._originalCanvasStyle,
                    this.lowerCanvasEl.setAttribute('width', this.width),
                    this.lowerCanvasEl.setAttribute('height', this.height),
                    E.util.cleanUpJsdomNode(this.lowerCanvasEl),
                    (this.lowerCanvasEl = void 0),
                    this
                  )
                },
                toString: function () {
                  return (
                    '#<fabric.Canvas (' +
                    this.complexity() +
                    '): { objects: ' +
                    this._objects.length +
                    ' }>'
                  )
                }
              })),
                t(E.StaticCanvas.prototype, E.Observable),
                t(E.StaticCanvas.prototype, E.Collection),
                t(E.StaticCanvas.prototype, E.DataURLExporter),
                t(E.StaticCanvas, {
                  EMPTY_JSON: '{"objects": [], "background": "white"}',
                  supports: function (t) {
                    var e = o()
                    if (!e || !e.getContext) return null
                    var i = e.getContext('2d')
                    return i && 'setLineDash' === t
                      ? void 0 !== i.setLineDash
                      : null
                  }
                }),
                (E.StaticCanvas.prototype.toJSON =
                  E.StaticCanvas.prototype.toObject),
                E.isLikelyNode &&
                  ((E.StaticCanvas.prototype.createPNGStream = function () {
                    var t = a(this.lowerCanvasEl)
                    return t && t.createPNGStream()
                  }),
                  (E.StaticCanvas.prototype.createJPEGStream = function (t) {
                    var e = a(this.lowerCanvasEl)
                    return e && e.createJPEGStream(t)
                  }))
            }
          })(),
          (E.BaseBrush = E.util.createClass({
            color: 'rgb(0, 0, 0)',
            width: 1,
            shadow: null,
            strokeLineCap: 'round',
            strokeLineJoin: 'round',
            strokeMiterLimit: 10,
            strokeDashArray: null,
            limitedToCanvasSize: !1,
            _setBrushStyles: function (t) {
              ;(t.strokeStyle = this.color),
                (t.lineWidth = this.width),
                (t.lineCap = this.strokeLineCap),
                (t.miterLimit = this.strokeMiterLimit),
                (t.lineJoin = this.strokeLineJoin),
                t.setLineDash(this.strokeDashArray || [])
            },
            _saveAndTransform: function (t) {
              var e = this.canvas.viewportTransform
              t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5])
            },
            _setShadow: function () {
              if (this.shadow) {
                var t = this.canvas,
                  e = this.shadow,
                  i = t.contextTop,
                  n = t.getZoom()
                t && t._isRetinaScaling() && (n *= E.devicePixelRatio),
                  (i.shadowColor = e.color),
                  (i.shadowBlur = e.blur * n),
                  (i.shadowOffsetX = e.offsetX * n),
                  (i.shadowOffsetY = e.offsetY * n)
              }
            },
            needsFullRender: function () {
              return new E.Color(this.color).getAlpha() < 1 || !!this.shadow
            },
            _resetShadow: function () {
              var t = this.canvas.contextTop
              ;(t.shadowColor = ''),
                (t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
            },
            _isOutSideCanvas: function (t) {
              return (
                t.x < 0 ||
                t.x > this.canvas.getWidth() ||
                t.y < 0 ||
                t.y > this.canvas.getHeight()
              )
            }
          })),
          (E.PencilBrush = E.util.createClass(E.BaseBrush, {
            decimate: 0.4,
            drawStraightLine: !1,
            straightLineKey: 'shiftKey',
            initialize: function (t) {
              ;(this.canvas = t), (this._points = [])
            },
            needsFullRender: function () {
              return this.callSuper('needsFullRender') || this._hasStraightLine
            },
            _drawSegment: function (t, e, i) {
              var n = e.midPointFrom(i)
              return t.quadraticCurveTo(e.x, e.y, n.x, n.y), n
            },
            onMouseDown: function (t, e) {
              this.canvas._isMainEvent(e.e) &&
                ((this.drawStraightLine = e.e[this.straightLineKey]),
                this._prepareForDrawing(t),
                this._captureDrawingPath(t),
                this._render())
            },
            onMouseMove: function (t, e) {
              if (
                this.canvas._isMainEvent(e.e) &&
                ((this.drawStraightLine = e.e[this.straightLineKey]),
                (!0 !== this.limitedToCanvasSize ||
                  !this._isOutSideCanvas(t)) &&
                  this._captureDrawingPath(t) &&
                  this._points.length > 1)
              )
                if (this.needsFullRender())
                  this.canvas.clearContext(this.canvas.contextTop),
                    this._render()
                else {
                  var i = this._points,
                    n = i.length,
                    s = this.canvas.contextTop
                  this._saveAndTransform(s),
                    this.oldEnd &&
                      (s.beginPath(), s.moveTo(this.oldEnd.x, this.oldEnd.y)),
                    (this.oldEnd = this._drawSegment(
                      s,
                      i[n - 2],
                      i[n - 1],
                      !0
                    )),
                    s.stroke(),
                    s.restore()
                }
            },
            onMouseUp: function (t) {
              return (
                !this.canvas._isMainEvent(t.e) ||
                ((this.drawStraightLine = !1),
                (this.oldEnd = void 0),
                this._finalizeAndAddPath(),
                !1)
              )
            },
            _prepareForDrawing: function (t) {
              var e = new E.Point(t.x, t.y)
              this._reset(),
                this._addPoint(e),
                this.canvas.contextTop.moveTo(e.x, e.y)
            },
            _addPoint: function (t) {
              return !(
                (this._points.length > 1 &&
                  t.eq(this._points[this._points.length - 1])) ||
                (this.drawStraightLine &&
                  this._points.length > 1 &&
                  ((this._hasStraightLine = !0), this._points.pop()),
                this._points.push(t),
                0)
              )
            },
            _reset: function () {
              ;(this._points = []),
                this._setBrushStyles(this.canvas.contextTop),
                this._setShadow(),
                (this._hasStraightLine = !1)
            },
            _captureDrawingPath: function (t) {
              var e = new E.Point(t.x, t.y)
              return this._addPoint(e)
            },
            _render: function (t) {
              var e,
                i,
                n = this._points[0],
                s = this._points[1]
              if (
                ((t = t || this.canvas.contextTop),
                this._saveAndTransform(t),
                t.beginPath(),
                2 === this._points.length && n.x === s.x && n.y === s.y)
              ) {
                var r = this.width / 1e3
                ;(n = new E.Point(n.x, n.y)),
                  (s = new E.Point(s.x, s.y)),
                  (n.x -= r),
                  (s.x += r)
              }
              for (
                t.moveTo(n.x, n.y), e = 1, i = this._points.length;
                e < i;
                e++
              )
                this._drawSegment(t, n, s),
                  (n = this._points[e]),
                  (s = this._points[e + 1])
              t.lineTo(n.x, n.y), t.stroke(), t.restore()
            },
            convertPointsToSVGPath: function (t) {
              var e = this.width / 1e3
              return E.util.getSmoothPathFromPoints(t, e)
            },
            _isEmptySVGPath: function (t) {
              return 'M 0 0 Q 0 0 0 0 L 0 0' === E.util.joinPath(t)
            },
            createPath: function (t) {
              var e = new E.Path(t, {
                fill: null,
                stroke: this.color,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeMiterLimit: this.strokeMiterLimit,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray
              })
              return (
                this.shadow &&
                  ((this.shadow.affectStroke = !0),
                  (e.shadow = new E.Shadow(this.shadow))),
                e
              )
            },
            decimatePoints: function (t, e) {
              if (t.length <= 2) return t
              var i,
                n = this.canvas.getZoom(),
                s = Math.pow(e / n, 2),
                r = t.length - 1,
                a = t[0],
                o = [a]
              for (i = 1; i < r - 1; i++)
                Math.pow(a.x - t[i].x, 2) + Math.pow(a.y - t[i].y, 2) >= s &&
                  ((a = t[i]), o.push(a))
              return o.push(t[r]), o
            },
            _finalizeAndAddPath: function () {
              this.canvas.contextTop.closePath(),
                this.decimate &&
                  (this._points = this.decimatePoints(
                    this._points,
                    this.decimate
                  ))
              var t = this.convertPointsToSVGPath(this._points)
              if (this._isEmptySVGPath(t)) this.canvas.requestRenderAll()
              else {
                var e = this.createPath(t)
                this.canvas.clearContext(this.canvas.contextTop),
                  this.canvas.fire('before:path:created', { path: e }),
                  this.canvas.add(e),
                  this.canvas.requestRenderAll(),
                  e.setCoords(),
                  this._resetShadow(),
                  this.canvas.fire('path:created', { path: e })
              }
            }
          })),
          (E.CircleBrush = E.util.createClass(E.BaseBrush, {
            width: 10,
            initialize: function (t) {
              ;(this.canvas = t), (this.points = [])
            },
            drawDot: function (t) {
              var e = this.addPoint(t),
                i = this.canvas.contextTop
              this._saveAndTransform(i), this.dot(i, e), i.restore()
            },
            dot: function (t, e) {
              ;(t.fillStyle = e.fill),
                t.beginPath(),
                t.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1),
                t.closePath(),
                t.fill()
            },
            onMouseDown: function (t) {
              ;(this.points.length = 0),
                this.canvas.clearContext(this.canvas.contextTop),
                this._setShadow(),
                this.drawDot(t)
            },
            _render: function () {
              var t,
                e,
                i = this.canvas.contextTop,
                n = this.points
              for (this._saveAndTransform(i), t = 0, e = n.length; t < e; t++)
                this.dot(i, n[t])
              i.restore()
            },
            onMouseMove: function (t) {
              ;(!0 === this.limitedToCanvasSize && this._isOutSideCanvas(t)) ||
                (this.needsFullRender()
                  ? (this.canvas.clearContext(this.canvas.contextTop),
                    this.addPoint(t),
                    this._render())
                  : this.drawDot(t))
            },
            onMouseUp: function () {
              var t,
                e,
                i = this.canvas.renderOnAddRemove
              this.canvas.renderOnAddRemove = !1
              var n = []
              for (t = 0, e = this.points.length; t < e; t++) {
                var s = this.points[t],
                  r = new E.Circle({
                    radius: s.radius,
                    left: s.x,
                    top: s.y,
                    originX: 'center',
                    originY: 'center',
                    fill: s.fill
                  })
                this.shadow && (r.shadow = new E.Shadow(this.shadow)), n.push(r)
              }
              var a = new E.Group(n)
              ;(a.canvas = this.canvas),
                this.canvas.fire('before:path:created', { path: a }),
                this.canvas.add(a),
                this.canvas.fire('path:created', { path: a }),
                this.canvas.clearContext(this.canvas.contextTop),
                this._resetShadow(),
                (this.canvas.renderOnAddRemove = i),
                this.canvas.requestRenderAll()
            },
            addPoint: function (t) {
              var e = new E.Point(t.x, t.y),
                i =
                  E.util.getRandomInt(
                    Math.max(0, this.width - 20),
                    this.width + 20
                  ) / 2,
                n = new E.Color(this.color)
                  .setAlpha(E.util.getRandomInt(0, 100) / 100)
                  .toRgba()
              return (e.radius = i), (e.fill = n), this.points.push(e), e
            }
          })),
          (E.SprayBrush = E.util.createClass(E.BaseBrush, {
            width: 10,
            density: 20,
            dotWidth: 1,
            dotWidthVariance: 1,
            randomOpacity: !1,
            optimizeOverlapping: !0,
            initialize: function (t) {
              ;(this.canvas = t), (this.sprayChunks = [])
            },
            onMouseDown: function (t) {
              ;(this.sprayChunks.length = 0),
                this.canvas.clearContext(this.canvas.contextTop),
                this._setShadow(),
                this.addSprayChunk(t),
                this.render(this.sprayChunkPoints)
            },
            onMouseMove: function (t) {
              ;(!0 === this.limitedToCanvasSize && this._isOutSideCanvas(t)) ||
                (this.addSprayChunk(t), this.render(this.sprayChunkPoints))
            },
            onMouseUp: function () {
              var t = this.canvas.renderOnAddRemove
              this.canvas.renderOnAddRemove = !1
              for (var e = [], i = 0, n = this.sprayChunks.length; i < n; i++)
                for (
                  var s = this.sprayChunks[i], r = 0, a = s.length;
                  r < a;
                  r++
                ) {
                  var o = new E.Rect({
                    width: s[r].width,
                    height: s[r].width,
                    left: s[r].x + 1,
                    top: s[r].y + 1,
                    originX: 'center',
                    originY: 'center',
                    fill: this.color
                  })
                  e.push(o)
                }
              this.optimizeOverlapping && (e = this._getOptimizedRects(e))
              var l = new E.Group(e)
              this.shadow && l.set('shadow', new E.Shadow(this.shadow)),
                this.canvas.fire('before:path:created', { path: l }),
                this.canvas.add(l),
                this.canvas.fire('path:created', { path: l }),
                this.canvas.clearContext(this.canvas.contextTop),
                this._resetShadow(),
                (this.canvas.renderOnAddRemove = t),
                this.canvas.requestRenderAll()
            },
            _getOptimizedRects: function (t) {
              var e,
                i,
                n,
                s = {}
              for (i = 0, n = t.length; i < n; i++)
                s[(e = t[i].left + '' + t[i].top)] || (s[e] = t[i])
              var r = []
              for (e in s) r.push(s[e])
              return r
            },
            render: function (t) {
              var e,
                i,
                n = this.canvas.contextTop
              for (
                n.fillStyle = this.color,
                  this._saveAndTransform(n),
                  e = 0,
                  i = t.length;
                e < i;
                e++
              ) {
                var s = t[e]
                void 0 !== s.opacity && (n.globalAlpha = s.opacity),
                  n.fillRect(s.x, s.y, s.width, s.width)
              }
              n.restore()
            },
            _render: function () {
              var t,
                e,
                i = this.canvas.contextTop
              for (
                i.fillStyle = this.color,
                  this._saveAndTransform(i),
                  t = 0,
                  e = this.sprayChunks.length;
                t < e;
                t++
              )
                this.render(this.sprayChunks[t])
              i.restore()
            },
            addSprayChunk: function (t) {
              this.sprayChunkPoints = []
              var e,
                i,
                n,
                s,
                r = this.width / 2
              for (s = 0; s < this.density; s++) {
                ;(e = E.util.getRandomInt(t.x - r, t.x + r)),
                  (i = E.util.getRandomInt(t.y - r, t.y + r)),
                  (n = this.dotWidthVariance
                    ? E.util.getRandomInt(
                        Math.max(1, this.dotWidth - this.dotWidthVariance),
                        this.dotWidth + this.dotWidthVariance
                      )
                    : this.dotWidth)
                var a = new E.Point(e, i)
                ;(a.width = n),
                  this.randomOpacity &&
                    (a.opacity = E.util.getRandomInt(0, 100) / 100),
                  this.sprayChunkPoints.push(a)
              }
              this.sprayChunks.push(this.sprayChunkPoints)
            }
          })),
          (E.PatternBrush = E.util.createClass(E.PencilBrush, {
            getPatternSrc: function () {
              var t = E.util.createCanvasElement(),
                e = t.getContext('2d')
              return (
                (t.width = t.height = 25),
                (e.fillStyle = this.color),
                e.beginPath(),
                e.arc(10, 10, 10, 0, 2 * Math.PI, !1),
                e.closePath(),
                e.fill(),
                t
              )
            },
            getPatternSrcFunction: function () {
              return String(this.getPatternSrc).replace(
                'this.color',
                '"' + this.color + '"'
              )
            },
            getPattern: function (t) {
              return t.createPattern(
                this.source || this.getPatternSrc(),
                'repeat'
              )
            },
            _setBrushStyles: function (t) {
              this.callSuper('_setBrushStyles', t),
                (t.strokeStyle = this.getPattern(t))
            },
            createPath: function (t) {
              var e = this.callSuper('createPath', t),
                i = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2)
              return (
                (e.stroke = new E.Pattern({
                  source: this.source || this.getPatternSrcFunction(),
                  offsetX: -i.x,
                  offsetY: -i.y
                })),
                e
              )
            }
          })),
          (function () {
            var t = E.util.getPointer,
              e = E.util.degreesToRadians,
              i = E.util.isTouchEvent
            for (var n in ((E.Canvas = E.util.createClass(E.StaticCanvas, {
              initialize: function (t, e) {
                e || (e = {}),
                  (this.renderAndResetBound = this.renderAndReset.bind(this)),
                  (this.requestRenderAllBound =
                    this.requestRenderAll.bind(this)),
                  this._initStatic(t, e),
                  this._initInteractive(),
                  this._createCacheCanvas()
              },
              uniformScaling: !0,
              uniScaleKey: 'shiftKey',
              centeredScaling: !1,
              centeredRotation: !1,
              centeredKey: 'altKey',
              altActionKey: 'shiftKey',
              interactive: !0,
              selection: !0,
              selectionKey: 'shiftKey',
              altSelectionKey: null,
              selectionColor: 'rgba(100, 100, 255, 0.3)',
              selectionDashArray: [],
              selectionBorderColor: 'rgba(255, 255, 255, 0.3)',
              selectionLineWidth: 1,
              selectionFullyContained: !1,
              hoverCursor: 'move',
              moveCursor: 'move',
              defaultCursor: 'default',
              freeDrawingCursor: 'crosshair',
              notAllowedCursor: 'not-allowed',
              containerClass: 'canvas-container',
              perPixelTargetFind: !1,
              targetFindTolerance: 0,
              skipTargetFind: !1,
              isDrawingMode: !1,
              preserveObjectStacking: !1,
              snapAngle: 0,
              snapThreshold: null,
              stopContextMenu: !1,
              fireRightClick: !1,
              fireMiddleClick: !1,
              targets: [],
              enablePointerEvents: !1,
              _hoveredTarget: null,
              _hoveredTargets: [],
              _initInteractive: function () {
                ;(this._currentTransform = null),
                  (this._groupSelector = null),
                  this._initWrapperElement(),
                  this._createUpperCanvas(),
                  this._initEventListeners(),
                  this._initRetinaScaling(),
                  (this.freeDrawingBrush =
                    E.PencilBrush && new E.PencilBrush(this)),
                  this.calcOffset()
              },
              _chooseObjectsToRender: function () {
                var t,
                  e,
                  i,
                  n = this.getActiveObjects()
                if (n.length > 0 && !this.preserveObjectStacking) {
                  ;(e = []), (i = [])
                  for (var s = 0, r = this._objects.length; s < r; s++)
                    (t = this._objects[s]),
                      -1 === n.indexOf(t) ? e.push(t) : i.push(t)
                  n.length > 1 && (this._activeObject._objects = i),
                    e.push.apply(e, i)
                } else e = this._objects
                return e
              },
              renderAll: function () {
                !this.contextTopDirty ||
                  this._groupSelector ||
                  this.isDrawingMode ||
                  (this.clearContext(this.contextTop),
                  (this.contextTopDirty = !1)),
                  this.hasLostContext &&
                    (this.renderTopLayer(this.contextTop),
                    (this.hasLostContext = !1))
                var t = this.contextContainer
                return this.renderCanvas(t, this._chooseObjectsToRender()), this
              },
              renderTopLayer: function (t) {
                t.save(),
                  this.isDrawingMode &&
                    this._isCurrentlyDrawing &&
                    (this.freeDrawingBrush && this.freeDrawingBrush._render(),
                    (this.contextTopDirty = !0)),
                  this.selection &&
                    this._groupSelector &&
                    (this._drawSelection(t), (this.contextTopDirty = !0)),
                  t.restore()
              },
              renderTop: function () {
                var t = this.contextTop
                return (
                  this.clearContext(t),
                  this.renderTopLayer(t),
                  this.fire('after:render'),
                  this
                )
              },
              _normalizePointer: function (t, e) {
                var i = t.calcTransformMatrix(),
                  n = E.util.invertTransform(i),
                  s = this.restorePointerVpt(e)
                return E.util.transformPoint(s, n)
              },
              isTargetTransparent: function (t, e, i) {
                if (
                  t.shouldCache() &&
                  t._cacheCanvas &&
                  t !== this._activeObject
                ) {
                  var n = this._normalizePointer(t, { x: e, y: i }),
                    s = Math.max(t.cacheTranslationX + n.x * t.zoomX, 0),
                    r = Math.max(t.cacheTranslationY + n.y * t.zoomY, 0)
                  return E.util.isTransparent(
                    t._cacheContext,
                    Math.round(s),
                    Math.round(r),
                    this.targetFindTolerance
                  )
                }
                var a = this.contextCache,
                  o = t.selectionBackgroundColor,
                  l = this.viewportTransform
                return (
                  (t.selectionBackgroundColor = ''),
                  this.clearContext(a),
                  a.save(),
                  a.transform(l[0], l[1], l[2], l[3], l[4], l[5]),
                  t.render(a),
                  a.restore(),
                  (t.selectionBackgroundColor = o),
                  E.util.isTransparent(a, e, i, this.targetFindTolerance)
                )
              },
              _isSelectionKeyPressed: function (t) {
                return Array.isArray(this.selectionKey)
                  ? !!this.selectionKey.find(function (e) {
                      return !0 === t[e]
                    })
                  : t[this.selectionKey]
              },
              _shouldClearSelection: function (t, e) {
                var i = this.getActiveObjects(),
                  n = this._activeObject
                return (
                  !e ||
                  (e &&
                    n &&
                    i.length > 1 &&
                    -1 === i.indexOf(e) &&
                    n !== e &&
                    !this._isSelectionKeyPressed(t)) ||
                  (e && !e.evented) ||
                  (e && !e.selectable && n && n !== e)
                )
              },
              _shouldCenterTransform: function (t, e, i) {
                var n
                if (t)
                  return (
                    'scale' === e ||
                    'scaleX' === e ||
                    'scaleY' === e ||
                    'resizing' === e
                      ? (n = this.centeredScaling || t.centeredScaling)
                      : 'rotate' === e &&
                        (n = this.centeredRotation || t.centeredRotation),
                    n ? !i : i
                  )
              },
              _getOriginFromCorner: function (t, e) {
                var i = { x: t.originX, y: t.originY }
                return (
                  'ml' === e || 'tl' === e || 'bl' === e
                    ? (i.x = 'right')
                    : ('mr' !== e && 'tr' !== e && 'br' !== e) ||
                      (i.x = 'left'),
                  'tl' === e || 'mt' === e || 'tr' === e
                    ? (i.y = 'bottom')
                    : ('bl' !== e && 'mb' !== e && 'br' !== e) || (i.y = 'top'),
                  i
                )
              },
              _getActionFromCorner: function (t, e, i, n) {
                if (!e || !t) return 'drag'
                var s = n.controls[e]
                return s.getActionName(i, s, n)
              },
              _setupCurrentTransform: function (t, i, n) {
                if (i) {
                  var s = this.getPointer(t),
                    r = i.__corner,
                    a = i.controls[r],
                    o =
                      n && r
                        ? a.getActionHandler(t, i, a)
                        : E.controlsUtils.dragHandler,
                    l = this._getActionFromCorner(n, r, t, i),
                    c = this._getOriginFromCorner(i, r),
                    h = t[this.centeredKey],
                    d = {
                      target: i,
                      action: l,
                      actionHandler: o,
                      corner: r,
                      scaleX: i.scaleX,
                      scaleY: i.scaleY,
                      skewX: i.skewX,
                      skewY: i.skewY,
                      offsetX: s.x - i.left,
                      offsetY: s.y - i.top,
                      originX: c.x,
                      originY: c.y,
                      ex: s.x,
                      ey: s.y,
                      lastX: s.x,
                      lastY: s.y,
                      theta: e(i.angle),
                      width: i.width * i.scaleX,
                      shiftKey: t.shiftKey,
                      altKey: h,
                      original: E.util.saveObjectTransform(i)
                    }
                  this._shouldCenterTransform(i, l, h) &&
                    ((d.originX = 'center'), (d.originY = 'center')),
                    (d.original.originX = c.x),
                    (d.original.originY = c.y),
                    (this._currentTransform = d),
                    this._beforeTransform(t)
                }
              },
              setCursor: function (t) {
                this.upperCanvasEl.style.cursor = t
              },
              _drawSelection: function (t) {
                var e = this._groupSelector,
                  i = new E.Point(e.ex, e.ey),
                  n = E.util.transformPoint(i, this.viewportTransform),
                  s = new E.Point(e.ex + e.left, e.ey + e.top),
                  r = E.util.transformPoint(s, this.viewportTransform),
                  a = Math.min(n.x, r.x),
                  o = Math.min(n.y, r.y),
                  l = Math.max(n.x, r.x),
                  c = Math.max(n.y, r.y),
                  h = this.selectionLineWidth / 2
                this.selectionColor &&
                  ((t.fillStyle = this.selectionColor),
                  t.fillRect(a, o, l - a, c - o)),
                  this.selectionLineWidth &&
                    this.selectionBorderColor &&
                    ((t.lineWidth = this.selectionLineWidth),
                    (t.strokeStyle = this.selectionBorderColor),
                    (a += h),
                    (o += h),
                    (l -= h),
                    (c -= h),
                    E.Object.prototype._setLineDash.call(
                      this,
                      t,
                      this.selectionDashArray
                    ),
                    t.strokeRect(a, o, l - a, c - o))
              },
              findTarget: function (t, e) {
                if (!this.skipTargetFind) {
                  var n,
                    s,
                    r = this.getPointer(t, !0),
                    a = this._activeObject,
                    o = this.getActiveObjects(),
                    l = i(t),
                    c = (o.length > 1 && !e) || 1 === o.length
                  if (((this.targets = []), c && a._findTargetCorner(r, l)))
                    return a
                  if (
                    o.length > 1 &&
                    !e &&
                    a === this._searchPossibleTargets([a], r)
                  )
                    return a
                  if (
                    1 === o.length &&
                    a === this._searchPossibleTargets([a], r)
                  ) {
                    if (!this.preserveObjectStacking) return a
                    ;(n = a), (s = this.targets), (this.targets = [])
                  }
                  var h = this._searchPossibleTargets(this._objects, r)
                  return (
                    t[this.altSelectionKey] &&
                      h &&
                      n &&
                      h !== n &&
                      ((h = n), (this.targets = s)),
                    h
                  )
                }
              },
              _checkTarget: function (t, e, i) {
                if (e && e.visible && e.evented && e.containsPoint(t)) {
                  if (
                    (!this.perPixelTargetFind && !e.perPixelTargetFind) ||
                    e.isEditing
                  )
                    return !0
                  if (!this.isTargetTransparent(e, i.x, i.y)) return !0
                }
              },
              _searchPossibleTargets: function (t, e) {
                for (var i, n, s = t.length; s--; ) {
                  var r = t[s],
                    a = r.group ? this._normalizePointer(r.group, e) : e
                  if (this._checkTarget(a, r, e)) {
                    ;(i = t[s]).subTargetCheck &&
                      i instanceof E.Group &&
                      (n = this._searchPossibleTargets(i._objects, e)) &&
                      this.targets.push(n)
                    break
                  }
                }
                return i
              },
              restorePointerVpt: function (t) {
                return E.util.transformPoint(
                  t,
                  E.util.invertTransform(this.viewportTransform)
                )
              },
              getPointer: function (e, i) {
                if (this._absolutePointer && !i) return this._absolutePointer
                if (this._pointer && i) return this._pointer
                var n,
                  s = t(e),
                  r = this.upperCanvasEl,
                  a = r.getBoundingClientRect(),
                  o = a.width || 0,
                  l = a.height || 0
                ;(o && l) ||
                  ('top' in a &&
                    'bottom' in a &&
                    (l = Math.abs(a.top - a.bottom)),
                  'right' in a &&
                    'left' in a &&
                    (o = Math.abs(a.right - a.left))),
                  this.calcOffset(),
                  (s.x = s.x - this._offset.left),
                  (s.y = s.y - this._offset.top),
                  i || (s = this.restorePointerVpt(s))
                var c = this.getRetinaScaling()
                return (
                  1 !== c && ((s.x /= c), (s.y /= c)),
                  (n =
                    0 === o || 0 === l
                      ? { width: 1, height: 1 }
                      : { width: r.width / o, height: r.height / l }),
                  { x: s.x * n.width, y: s.y * n.height }
                )
              },
              _createUpperCanvas: function () {
                var t = this.lowerCanvasEl.className.replace(
                    /\s*lower-canvas\s*/,
                    ''
                  ),
                  e = this.lowerCanvasEl,
                  i = this.upperCanvasEl
                i
                  ? (i.className = '')
                  : ((i = this._createCanvasElement()),
                    (this.upperCanvasEl = i)),
                  E.util.addClass(i, 'upper-canvas ' + t),
                  this.wrapperEl.appendChild(i),
                  this._copyCanvasStyle(e, i),
                  this._applyCanvasStyle(i),
                  (this.contextTop = i.getContext('2d'))
              },
              getTopContext: function () {
                return this.contextTop
              },
              _createCacheCanvas: function () {
                ;(this.cacheCanvasEl = this._createCanvasElement()),
                  this.cacheCanvasEl.setAttribute('width', this.width),
                  this.cacheCanvasEl.setAttribute('height', this.height),
                  (this.contextCache = this.cacheCanvasEl.getContext('2d'))
              },
              _initWrapperElement: function () {
                ;(this.wrapperEl = E.util.wrapElement(
                  this.lowerCanvasEl,
                  'div',
                  { class: this.containerClass }
                )),
                  E.util.setStyle(this.wrapperEl, {
                    width: this.width + 'px',
                    height: this.height + 'px',
                    position: 'relative'
                  }),
                  E.util.makeElementUnselectable(this.wrapperEl)
              },
              _applyCanvasStyle: function (t) {
                ;
                // var e = this.width || t.width,
                //   i = this.height || t.height
                var e = (this.width || t.width) + 200; // +100px wider
                var i = this.height || t.height;
                E.util.setStyle(t, {
                  position: 'absolute',
                  width: e + 'px',
                  height: i + 'px',
                  left: 0,
                  top: 0,
                  'touch-action': this.allowTouchScrolling
                    ? 'manipulation'
                    : 'none',
                  '-ms-touch-action': this.allowTouchScrolling
                    ? 'manipulation'
                    : 'none'
                }),
                  (t.width = e),
                  (t.height = i),
                  E.util.makeElementUnselectable(t)
              },
              _copyCanvasStyle: function (t, e) {
                e.style.cssText = t.style.cssText
              },
              getSelectionContext: function () {
                return this.contextTop
              },
              getSelectionElement: function () {
                return this.upperCanvasEl
              },
              getActiveObject: function () {
                return this._activeObject
              },
              getActiveObjects: function () {
                var t = this._activeObject
                return t
                  ? 'activeSelection' === t.type && t._objects
                    ? t._objects.slice(0)
                    : [t]
                  : []
              },
              _onObjectRemoved: function (t) {
                t === this._activeObject &&
                  (this.fire('before:selection:cleared', { target: t }),
                  this._discardActiveObject(),
                  this.fire('selection:cleared', { target: t }),
                  t.fire('deselected')),
                  t === this._hoveredTarget &&
                    ((this._hoveredTarget = null), (this._hoveredTargets = [])),
                  this.callSuper('_onObjectRemoved', t)
              },
              _fireSelectionEvents: function (t, e) {
                var i = !1,
                  n = this.getActiveObjects(),
                  s = [],
                  r = []
                t.forEach(function (t) {
                  ;-1 === n.indexOf(t) &&
                    ((i = !0),
                    t.fire('deselected', { e, target: t }),
                    r.push(t))
                }),
                  n.forEach(function (n) {
                    ;-1 === t.indexOf(n) &&
                      ((i = !0),
                      n.fire('selected', { e, target: n }),
                      s.push(n))
                  }),
                  t.length > 0 && n.length > 0
                    ? i &&
                      this.fire('selection:updated', {
                        e,
                        selected: s,
                        deselected: r
                      })
                    : n.length > 0
                    ? this.fire('selection:created', { e, selected: s })
                    : t.length > 0 &&
                      this.fire('selection:cleared', { e, deselected: r })
              },
              setActiveObject: function (t, e) {
                var i = this.getActiveObjects()
                return (
                  this._setActiveObject(t, e),
                  this._fireSelectionEvents(i, e),
                  this
                )
              },
              _setActiveObject: function (t, e) {
                return (
                  this._activeObject !== t &&
                  !!this._discardActiveObject(e, t) &&
                  !t.onSelect({ e }) &&
                  ((this._activeObject = t), !0)
                )
              },
              _discardActiveObject: function (t, e) {
                var i = this._activeObject
                if (i) {
                  if (i.onDeselect({ e: t, object: e })) return !1
                  this._activeObject = null
                }
                return !0
              },
              discardActiveObject: function (t) {
                var e = this.getActiveObjects(),
                  i = this.getActiveObject()
                return (
                  e.length &&
                    this.fire('before:selection:cleared', { target: i, e: t }),
                  this._discardActiveObject(t),
                  this._fireSelectionEvents(e, t),
                  this
                )
              },
              dispose: function () {
                var t = this.wrapperEl
                return (
                  this.removeListeners(),
                  t.removeChild(this.upperCanvasEl),
                  t.removeChild(this.lowerCanvasEl),
                  (this.contextCache = null),
                  (this.contextTop = null),
                  ['upperCanvasEl', 'cacheCanvasEl'].forEach(
                    function (t) {
                      E.util.cleanUpJsdomNode(this[t]), (this[t] = void 0)
                    }.bind(this)
                  ),
                  t.parentNode &&
                    t.parentNode.replaceChild(
                      this.lowerCanvasEl,
                      this.wrapperEl
                    ),
                  delete this.wrapperEl,
                  E.StaticCanvas.prototype.dispose.call(this),
                  this
                )
              },
              clear: function () {
                return (
                  this.discardActiveObject(),
                  this.clearContext(this.contextTop),
                  this.callSuper('clear')
                )
              },
              drawControls: function (t) {
                var e = this._activeObject
                e && e._renderControls(t)
              },
              _toObject: function (t, e, i) {
                var n = this._realizeGroupTransformOnObject(t),
                  s = this.callSuper('_toObject', t, e, i)
                return this._unwindGroupTransformOnObject(t, n), s
              },
              _realizeGroupTransformOnObject: function (t) {
                if (
                  t.group &&
                  'activeSelection' === t.group.type &&
                  this._activeObject === t.group
                ) {
                  var e = {}
                  return (
                    [
                      'angle',
                      'flipX',
                      'flipY',
                      'left',
                      'scaleX',
                      'scaleY',
                      'skewX',
                      'skewY',
                      'top'
                    ].forEach(function (i) {
                      e[i] = t[i]
                    }),
                    E.util.addTransformToObject(
                      t,
                      this._activeObject.calcOwnMatrix()
                    ),
                    e
                  )
                }
                return null
              },
              _unwindGroupTransformOnObject: function (t, e) {
                e && t.set(e)
              },
              _setSVGObject: function (t, e, i) {
                var n = this._realizeGroupTransformOnObject(e)
                this.callSuper('_setSVGObject', t, e, i),
                  this._unwindGroupTransformOnObject(e, n)
              },
              setViewportTransform: function (t) {
                this.renderOnAddRemove &&
                  this._activeObject &&
                  this._activeObject.isEditing &&
                  this._activeObject.clearContextTop(),
                  E.StaticCanvas.prototype.setViewportTransform.call(this, t)
              }
            })),
            E.StaticCanvas))
              'prototype' !== n && (E.Canvas[n] = E.StaticCanvas[n])
          })(),
          (function () {
            var t = E.util.addListener,
              e = E.util.removeListener,
              i = { passive: !1 }
            function n (t, e) {
              return t.button && t.button === e - 1
            }
            E.util.object.extend(E.Canvas.prototype, {
              mainTouchId: null,
              _initEventListeners: function () {
                this.removeListeners(),
                  this._bindEvents(),
                  this.addOrRemove(t, 'add')
              },
              _getEventPrefix: function () {
                return this.enablePointerEvents ? 'pointer' : 'mouse'
              },
              addOrRemove: function (t, e) {
                var n = this.upperCanvasEl,
                  s = this._getEventPrefix()
                t(E.window, 'resize', this._onResize),
                  t(n, s + 'down', this._onMouseDown),
                  t(n, s + 'move', this._onMouseMove, i),
                  t(n, s + 'out', this._onMouseOut),
                  t(n, s + 'enter', this._onMouseEnter),
                  t(n, 'wheel', this._onMouseWheel),
                  t(n, 'contextmenu', this._onContextMenu),
                  t(n, 'dblclick', this._onDoubleClick),
                  t(n, 'dragover', this._onDragOver),
                  t(n, 'dragenter', this._onDragEnter),
                  t(n, 'dragleave', this._onDragLeave),
                  t(n, 'drop', this._onDrop),
                  this.enablePointerEvents ||
                    t(n, 'touchstart', this._onTouchStart, i),
                  'undefined' != typeof eventjs &&
                    e in eventjs &&
                    (eventjs[e](n, 'gesture', this._onGesture),
                    eventjs[e](n, 'drag', this._onDrag),
                    eventjs[e](n, 'orientation', this._onOrientationChange),
                    eventjs[e](n, 'shake', this._onShake),
                    eventjs[e](n, 'longpress', this._onLongPress))
              },
              removeListeners: function () {
                this.addOrRemove(e, 'remove')
                var t = this._getEventPrefix()
                e(E.document, t + 'up', this._onMouseUp),
                  e(E.document, 'touchend', this._onTouchEnd, i),
                  e(E.document, t + 'move', this._onMouseMove, i),
                  e(E.document, 'touchmove', this._onMouseMove, i)
              },
              _bindEvents: function () {
                this.eventsBound ||
                  ((this._onMouseDown = this._onMouseDown.bind(this)),
                  (this._onTouchStart = this._onTouchStart.bind(this)),
                  (this._onMouseMove = this._onMouseMove.bind(this)),
                  (this._onMouseUp = this._onMouseUp.bind(this)),
                  (this._onTouchEnd = this._onTouchEnd.bind(this)),
                  (this._onResize = this._onResize.bind(this)),
                  (this._onGesture = this._onGesture.bind(this)),
                  (this._onDrag = this._onDrag.bind(this)),
                  (this._onShake = this._onShake.bind(this)),
                  (this._onLongPress = this._onLongPress.bind(this)),
                  (this._onOrientationChange =
                    this._onOrientationChange.bind(this)),
                  (this._onMouseWheel = this._onMouseWheel.bind(this)),
                  (this._onMouseOut = this._onMouseOut.bind(this)),
                  (this._onMouseEnter = this._onMouseEnter.bind(this)),
                  (this._onContextMenu = this._onContextMenu.bind(this)),
                  (this._onDoubleClick = this._onDoubleClick.bind(this)),
                  (this._onDragOver = this._onDragOver.bind(this)),
                  (this._onDragEnter = this._simpleEventHandler.bind(
                    this,
                    'dragenter'
                  )),
                  (this._onDragLeave = this._simpleEventHandler.bind(
                    this,
                    'dragleave'
                  )),
                  (this._onDrop = this._onDrop.bind(this)),
                  (this.eventsBound = !0))
              },
              _onGesture: function (t, e) {
                this.__onTransformGesture && this.__onTransformGesture(t, e)
              },
              _onDrag: function (t, e) {
                this.__onDrag && this.__onDrag(t, e)
              },
              _onMouseWheel: function (t) {
                this.__onMouseWheel(t)
              },
              _onMouseOut: function (t) {
                var e = this._hoveredTarget
                this.fire('mouse:out', { target: e, e: t }),
                  (this._hoveredTarget = null),
                  e && e.fire('mouseout', { e: t })
                var i = this
                this._hoveredTargets.forEach(function (n) {
                  i.fire('mouse:out', { target: e, e: t }),
                    n && e.fire('mouseout', { e: t })
                }),
                  (this._hoveredTargets = [])
              },
              _onMouseEnter: function (t) {
                this._currentTransform ||
                  this.findTarget(t) ||
                  (this.fire('mouse:over', { target: null, e: t }),
                  (this._hoveredTarget = null),
                  (this._hoveredTargets = []))
              },
              _onOrientationChange: function (t, e) {
                this.__onOrientationChange && this.__onOrientationChange(t, e)
              },
              _onShake: function (t, e) {
                this.__onShake && this.__onShake(t, e)
              },
              _onLongPress: function (t, e) {
                this.__onLongPress && this.__onLongPress(t, e)
              },
              _onDragOver: function (t) {
                t.preventDefault()
                var e = this._simpleEventHandler('dragover', t)
                this._fireEnterLeaveEvents(e, t)
              },
              _onDrop: function (t) {
                return (
                  this._simpleEventHandler('drop:before', t),
                  this._simpleEventHandler('drop', t)
                )
              },
              _onContextMenu: function (t) {
                return (
                  this.stopContextMenu &&
                    (t.stopPropagation(), t.preventDefault()),
                  !1
                )
              },
              _onDoubleClick: function (t) {
                this._cacheTransformEventData(t),
                  this._handleEvent(t, 'dblclick'),
                  this._resetTransformEventData(t)
              },
              getPointerId: function (t) {
                var e = t.changedTouches
                return e
                  ? e[0] && e[0].identifier
                  : this.enablePointerEvents
                  ? t.pointerId
                  : -1
              },
              _isMainEvent: function (t) {
                return (
                  !0 === t.isPrimary ||
                  (!1 !== t.isPrimary &&
                    (('touchend' === t.type && 0 === t.touches.length) ||
                      !t.changedTouches ||
                      t.changedTouches[0].identifier === this.mainTouchId))
                )
              },
              _onTouchStart: function (n) {
                n.preventDefault(),
                  null === this.mainTouchId &&
                    (this.mainTouchId = this.getPointerId(n)),
                  this.__onMouseDown(n),
                  this._resetTransformEventData()
                var s = this.upperCanvasEl,
                  r = this._getEventPrefix()
                t(E.document, 'touchend', this._onTouchEnd, i),
                  t(E.document, 'touchmove', this._onMouseMove, i),
                  e(s, r + 'down', this._onMouseDown)
              },
              _onMouseDown: function (n) {
                this.__onMouseDown(n), this._resetTransformEventData()
                var s = this.upperCanvasEl,
                  r = this._getEventPrefix()
                e(s, r + 'move', this._onMouseMove, i),
                  t(E.document, r + 'up', this._onMouseUp),
                  t(E.document, r + 'move', this._onMouseMove, i)
              },
              _onTouchEnd: function (n) {
                if (!(n.touches.length > 0)) {
                  this.__onMouseUp(n),
                    this._resetTransformEventData(),
                    (this.mainTouchId = null)
                  var s = this._getEventPrefix()
                  e(E.document, 'touchend', this._onTouchEnd, i),
                    e(E.document, 'touchmove', this._onMouseMove, i)
                  var r = this
                  this._willAddMouseDown &&
                    clearTimeout(this._willAddMouseDown),
                    (this._willAddMouseDown = setTimeout(function () {
                      t(r.upperCanvasEl, s + 'down', r._onMouseDown),
                        (r._willAddMouseDown = 0)
                    }, 400))
                }
              },
              _onMouseUp: function (n) {
                this.__onMouseUp(n), this._resetTransformEventData()
                var s = this.upperCanvasEl,
                  r = this._getEventPrefix()
                this._isMainEvent(n) &&
                  (e(E.document, r + 'up', this._onMouseUp),
                  e(E.document, r + 'move', this._onMouseMove, i),
                  t(s, r + 'move', this._onMouseMove, i))
              },
              _onMouseMove: function (t) {
                !this.allowTouchScrolling &&
                  t.preventDefault &&
                  t.preventDefault(),
                  this.__onMouseMove(t)
              },
              _onResize: function () {
                this.calcOffset()
              },
              _shouldRender: function (t) {
                var e = this._activeObject
                return (
                  !!(!!e != !!t || (e && t && e !== t)) ||
                  (e && e.isEditing, !1)
                )
              },
              __onMouseUp: function (t) {
                var e,
                  i = this._currentTransform,
                  s = this._groupSelector,
                  r = !1,
                  a = !s || (0 === s.left && 0 === s.top)
                if (
                  (this._cacheTransformEventData(t),
                  (e = this._target),
                  this._handleEvent(t, 'up:before'),
                  n(t, 3))
                )
                  this.fireRightClick && this._handleEvent(t, 'up', 3, a)
                else {
                  if (n(t, 2))
                    return (
                      this.fireMiddleClick && this._handleEvent(t, 'up', 2, a),
                      void this._resetTransformEventData()
                    )
                  if (this.isDrawingMode && this._isCurrentlyDrawing)
                    this._onMouseUpInDrawingMode(t)
                  else if (this._isMainEvent(t)) {
                    if (
                      (i &&
                        (this._finalizeCurrentTransform(t),
                        (r = i.actionPerformed)),
                      !a)
                    ) {
                      var o = e === this._activeObject
                      this._maybeGroupObjects(t),
                        r ||
                          (r =
                            this._shouldRender(e) ||
                            (!o && e === this._activeObject))
                    }
                    var l, c
                    if (e) {
                      if (
                        ((l = e._findTargetCorner(
                          this.getPointer(t, !0),
                          E.util.isTouchEvent(t)
                        )),
                        e.selectable &&
                          e !== this._activeObject &&
                          'up' === e.activeOn)
                      )
                        this.setActiveObject(e, t), (r = !0)
                      else {
                        var h = e.controls[l],
                          d = h && h.getMouseUpHandler(t, e, h)
                        d && d(t, i, (c = this.getPointer(t)).x, c.y)
                      }
                      e.isMoving = !1
                    }
                    if (i && (i.target !== e || i.corner !== l)) {
                      var u = i.target && i.target.controls[i.corner],
                        f = u && u.getMouseUpHandler(t, e, h)
                      ;(c = c || this.getPointer(t)), f && f(t, i, c.x, c.y)
                    }
                    this._setCursorFromEvent(t, e),
                      this._handleEvent(t, 'up', 1, a),
                      (this._groupSelector = null),
                      (this._currentTransform = null),
                      e && (e.__corner = 0),
                      r ? this.requestRenderAll() : a || this.renderTop()
                  }
                }
              },
              _simpleEventHandler: function (t, e) {
                var i = this.findTarget(e),
                  n = this.targets,
                  s = { e, target: i, subTargets: n }
                if ((this.fire(t, s), i && i.fire(t, s), !n)) return i
                for (var r = 0; r < n.length; r++) n[r].fire(t, s)
                return i
              },
              _handleEvent: function (t, e, i, n) {
                var s = this._target,
                  r = this.targets || [],
                  a = {
                    e: t,
                    target: s,
                    subTargets: r,
                    button: i || 1,
                    isClick: n || !1,
                    pointer: this._pointer,
                    absolutePointer: this._absolutePointer,
                    transform: this._currentTransform
                  }
                'up' === e &&
                  ((a.currentTarget = this.findTarget(t)),
                  (a.currentSubTargets = this.targets)),
                  this.fire('mouse:' + e, a),
                  s && s.fire('mouse' + e, a)
                for (var o = 0; o < r.length; o++) r[o].fire('mouse' + e, a)
              },
              _finalizeCurrentTransform: function (t) {
                var e = this._currentTransform,
                  i = e.target,
                  n = { e: t, target: i, transform: e, action: e.action }
                i._scaling && (i._scaling = !1),
                  i.setCoords(),
                  (e.actionPerformed ||
                    (this.stateful && i.hasStateChanged())) &&
                    this._fire('modified', n)
              },
              _onMouseDownInDrawingMode: function (t) {
                ;(this._isCurrentlyDrawing = !0),
                  this.getActiveObject() &&
                    this.discardActiveObject(t).requestRenderAll()
                var e = this.getPointer(t)
                this.freeDrawingBrush.onMouseDown(e, { e: t, pointer: e }),
                  this._handleEvent(t, 'down')
              },
              _onMouseMoveInDrawingMode: function (t) {
                if (this._isCurrentlyDrawing) {
                  var e = this.getPointer(t)
                  this.freeDrawingBrush.onMouseMove(e, { e: t, pointer: e })
                }
                this.setCursor(this.freeDrawingCursor),
                  this._handleEvent(t, 'move')
              },
              _onMouseUpInDrawingMode: function (t) {
                var e = this.getPointer(t)
                ;(this._isCurrentlyDrawing = this.freeDrawingBrush.onMouseUp({
                  e: t,
                  pointer: e
                })),
                  this._handleEvent(t, 'up')
              },
              __onMouseDown: function (t) {
                this._cacheTransformEventData(t),
                  this._handleEvent(t, 'down:before')
                var e = this._target
                if (n(t, 3))
                  this.fireRightClick && this._handleEvent(t, 'down', 3)
                else if (n(t, 2))
                  this.fireMiddleClick && this._handleEvent(t, 'down', 2)
                else if (this.isDrawingMode) this._onMouseDownInDrawingMode(t)
                else if (this._isMainEvent(t) && !this._currentTransform) {
                  var i = this._pointer
                  this._previousPointer = i
                  var s = this._shouldRender(e),
                    r = this._shouldGroup(t, e)
                  if (
                    (this._shouldClearSelection(t, e)
                      ? this.discardActiveObject(t)
                      : r &&
                        (this._handleGrouping(t, e), (e = this._activeObject)),
                    !this.selection ||
                      (e &&
                        (e.selectable ||
                          e.isEditing ||
                          e === this._activeObject)) ||
                      (this._groupSelector = {
                        ex: this._absolutePointer.x,
                        ey: this._absolutePointer.y,
                        top: 0,
                        left: 0
                      }),
                    e)
                  ) {
                    var a = e === this._activeObject
                    e.selectable &&
                      'down' === e.activeOn &&
                      this.setActiveObject(e, t)
                    var o = e._findTargetCorner(
                      this.getPointer(t, !0),
                      E.util.isTouchEvent(t)
                    )
                    if (
                      ((e.__corner = o), e === this._activeObject && (o || !r))
                    ) {
                      this._setupCurrentTransform(t, e, a)
                      var l = e.controls[o],
                        c =
                          ((i = this.getPointer(t)),
                          l && l.getMouseDownHandler(t, e, l))
                      c && c(t, this._currentTransform, i.x, i.y)
                    }
                  }
                  this._handleEvent(t, 'down'),
                    (s || r) && this.requestRenderAll()
                }
              },
              _resetTransformEventData: function () {
                ;(this._target = null),
                  (this._pointer = null),
                  (this._absolutePointer = null)
              },
              _cacheTransformEventData: function (t) {
                this._resetTransformEventData(),
                  (this._pointer = this.getPointer(t, !0)),
                  (this._absolutePointer = this.restorePointerVpt(
                    this._pointer
                  )),
                  (this._target = this._currentTransform
                    ? this._currentTransform.target
                    : this.findTarget(t) || null)
              },
              _beforeTransform: function (t) {
                var e = this._currentTransform
                this.stateful && e.target.saveState(),
                  this.fire('before:transform', { e: t, transform: e })
              },
              __onMouseMove: function (t) {
                var e, i
                if (
                  (this._handleEvent(t, 'move:before'),
                  this._cacheTransformEventData(t),
                  this.isDrawingMode)
                )
                  this._onMouseMoveInDrawingMode(t)
                else if (this._isMainEvent(t)) {
                  var n = this._groupSelector
                  n
                    ? ((i = this._absolutePointer),
                      (n.left = i.x - n.ex),
                      (n.top = i.y - n.ey),
                      this.renderTop())
                    : this._currentTransform
                    ? this._transformObject(t)
                    : ((e = this.findTarget(t) || null),
                      this._setCursorFromEvent(t, e),
                      this._fireOverOutEvents(e, t)),
                    this._handleEvent(t, 'move'),
                    this._resetTransformEventData()
                }
              },
              _fireOverOutEvents: function (t, e) {
                var i = this._hoveredTarget,
                  n = this._hoveredTargets,
                  s = this.targets,
                  r = Math.max(n.length, s.length)
                this.fireSyntheticInOutEvents(t, e, {
                  oldTarget: i,
                  evtOut: 'mouseout',
                  canvasEvtOut: 'mouse:out',
                  evtIn: 'mouseover',
                  canvasEvtIn: 'mouse:over'
                })
                for (var a = 0; a < r; a++)
                  this.fireSyntheticInOutEvents(s[a], e, {
                    oldTarget: n[a],
                    evtOut: 'mouseout',
                    evtIn: 'mouseover'
                  })
                ;(this._hoveredTarget = t),
                  (this._hoveredTargets = this.targets.concat())
              },
              _fireEnterLeaveEvents: function (t, e) {
                var i = this._draggedoverTarget,
                  n = this._hoveredTargets,
                  s = this.targets,
                  r = Math.max(n.length, s.length)
                this.fireSyntheticInOutEvents(t, e, {
                  oldTarget: i,
                  evtOut: 'dragleave',
                  evtIn: 'dragenter'
                })
                for (var a = 0; a < r; a++)
                  this.fireSyntheticInOutEvents(s[a], e, {
                    oldTarget: n[a],
                    evtOut: 'dragleave',
                    evtIn: 'dragenter'
                  })
                this._draggedoverTarget = t
              },
              fireSyntheticInOutEvents: function (t, e, i) {
                var n,
                  s,
                  r,
                  a = i.oldTarget,
                  o = a !== t,
                  l = i.canvasEvtIn,
                  c = i.canvasEvtOut
                o &&
                  ((n = { e, target: t, previousTarget: a }),
                  (s = { e, target: a, nextTarget: t })),
                  (r = t && o),
                  a && o && (c && this.fire(c, s), a.fire(i.evtOut, s)),
                  r && (l && this.fire(l, n), t.fire(i.evtIn, n))
              },
              __onMouseWheel: function (t) {
                this._cacheTransformEventData(t),
                  this._handleEvent(t, 'wheel'),
                  this._resetTransformEventData()
              },
              _transformObject: function (t) {
                var e = this.getPointer(t),
                  i = this._currentTransform
                ;(i.reset = !1),
                  (i.shiftKey = t.shiftKey),
                  (i.altKey = t[this.centeredKey]),
                  this._performTransformAction(t, i, e),
                  i.actionPerformed && this.requestRenderAll()
              },
              _performTransformAction: function (t, e, i) {
                var n = i.x,
                  s = i.y,
                  r = e.action,
                  a = !1,
                  o = e.actionHandler
                o && (a = o(t, e, n, s)),
                  'drag' === r &&
                    a &&
                    ((e.target.isMoving = !0),
                    this.setCursor(e.target.moveCursor || this.moveCursor)),
                  (e.actionPerformed = e.actionPerformed || a)
              },
              _fire: E.controlsUtils.fireEvent,
              _setCursorFromEvent: function (t, e) {
                if (!e) return this.setCursor(this.defaultCursor), !1
                var i = e.hoverCursor || this.hoverCursor,
                  n =
                    this._activeObject &&
                    'activeSelection' === this._activeObject.type
                      ? this._activeObject
                      : null,
                  s =
                    (!n || !n.contains(e)) &&
                    e._findTargetCorner(this.getPointer(t, !0))
                s
                  ? this.setCursor(this.getCornerCursor(s, e, t))
                  : (e.subTargetCheck &&
                      this.targets
                        .concat()
                        .reverse()
                        .map(function (t) {
                          i = t.hoverCursor || i
                        }),
                    this.setCursor(i))
              },
              getCornerCursor: function (t, e, i) {
                var n = e.controls[t]
                return n.cursorStyleHandler(i, n, e)
              }
            })
          })(),
          (v = Math.min),
          (b = Math.max),
          E.util.object.extend(E.Canvas.prototype, {
            _shouldGroup: function (t, e) {
              var i = this._activeObject
              return (
                i &&
                this._isSelectionKeyPressed(t) &&
                e &&
                e.selectable &&
                this.selection &&
                (i !== e || 'activeSelection' === i.type) &&
                !e.onSelect({ e: t })
              )
            },
            _handleGrouping: function (t, e) {
              var i = this._activeObject
              i.__corner ||
                ((e !== i || ((e = this.findTarget(t, !0)) && e.selectable)) &&
                  (i && 'activeSelection' === i.type
                    ? this._updateActiveSelection(e, t)
                    : this._createActiveSelection(e, t)))
            },
            _updateActiveSelection: function (t, e) {
              var i = this._activeObject,
                n = i._objects.slice(0)
              i.contains(t)
                ? (i.removeWithUpdate(t),
                  (this._hoveredTarget = t),
                  (this._hoveredTargets = this.targets.concat()),
                  1 === i.size() && this._setActiveObject(i.item(0), e))
                : (i.addWithUpdate(t),
                  (this._hoveredTarget = i),
                  (this._hoveredTargets = this.targets.concat())),
                this._fireSelectionEvents(n, e)
            },
            _createActiveSelection: function (t, e) {
              var i = this.getActiveObjects(),
                n = this._createGroup(t)
              ;(this._hoveredTarget = n),
                this._setActiveObject(n, e),
                this._fireSelectionEvents(i, e)
            },
            _createGroup: function (t) {
              var e = this._objects,
                i =
                  e.indexOf(this._activeObject) < e.indexOf(t)
                    ? [this._activeObject, t]
                    : [t, this._activeObject]
              return (
                this._activeObject.isEditing &&
                  this._activeObject.exitEditing(),
                new E.ActiveSelection(i, { canvas: this })
              )
            },
            _groupSelectedObjects: function (t) {
              var e,
                i = this._collectObjects(t)
              1 === i.length
                ? this.setActiveObject(i[0], t)
                : i.length > 1 &&
                  ((e = new E.ActiveSelection(i.reverse(), { canvas: this })),
                  this.setActiveObject(e, t))
            },
            _collectObjects: function (t) {
              for (
                var e,
                  i = [],
                  n = this._groupSelector.ex,
                  s = this._groupSelector.ey,
                  r = n + this._groupSelector.left,
                  a = s + this._groupSelector.top,
                  o = new E.Point(v(n, r), v(s, a)),
                  l = new E.Point(b(n, r), b(s, a)),
                  c = !this.selectionFullyContained,
                  h = n === r && s === a,
                  d = this._objects.length;
                d-- &&
                !(
                  (e = this._objects[d]) &&
                  e.selectable &&
                  e.visible &&
                  ((c && e.intersectsWithRect(o, l, !0)) ||
                    e.isContainedWithinRect(o, l, !0) ||
                    (c && e.containsPoint(o, null, !0)) ||
                    (c && e.containsPoint(l, null, !0))) &&
                  (i.push(e), h)
                );

              );
              return (
                i.length > 1 &&
                  (i = i.filter(function (e) {
                    return !e.onSelect({ e: t })
                  })),
                i
              )
            },
            _maybeGroupObjects: function (t) {
              this.selection &&
                this._groupSelector &&
                this._groupSelectedObjects(t),
                this.setCursor(this.defaultCursor),
                (this._groupSelector = null)
            }
          }),
          E.util.object.extend(E.StaticCanvas.prototype, {
            toDataURL: function (t) {
              t || (t = {})
              var e = t.format || 'png',
                i = t.quality || 1,
                n =
                  (t.multiplier || 1) *
                  (t.enableRetinaScaling ? this.getRetinaScaling() : 1),
                s = this.toCanvasElement(n, t)
              return E.util.toDataURL(s, e, i)
            },
            toCanvasElement: function (t, e) {
              t = t || 1
              var i = ((e = e || {}).width || this.width) * t,
                n = (e.height || this.height) * t,
                s = this.getZoom(),
                r = this.width,
                a = this.height,
                o = s * t,
                l = this.viewportTransform,
                c = (l[4] - (e.left || 0)) * t,
                h = (l[5] - (e.top || 0)) * t,
                d = this.interactive,
                u = [o, 0, 0, o, c, h],
                f = this.enableRetinaScaling,
                p = E.util.createCanvasElement(),
                g = this.contextTop
              return (
                (p.width = i),
                (p.height = n),
                (this.contextTop = null),
                (this.enableRetinaScaling = !1),
                (this.interactive = !1),
                (this.viewportTransform = u),
                (this.width = i),
                (this.height = n),
                this.calcViewportBoundaries(),
                this.renderCanvas(p.getContext('2d'), this._objects),
                (this.viewportTransform = l),
                (this.width = r),
                (this.height = a),
                this.calcViewportBoundaries(),
                (this.interactive = d),
                (this.enableRetinaScaling = f),
                (this.contextTop = g),
                p
              )
            }
          }),
          E.util.object.extend(E.StaticCanvas.prototype, {
            loadFromJSON: function (t, e, i) {
              if (t) {
                var n =
                    'string' == typeof t
                      ? JSON.parse(t)
                      : E.util.object.clone(t),
                  s = this,
                  r = n.clipPath,
                  a = this.renderOnAddRemove
                return (
                  (this.renderOnAddRemove = !1),
                  delete n.clipPath,
                  this._enlivenObjects(
                    n.objects,
                    function (t) {
                      s.clear(),
                        s._setBgOverlay(n, function () {
                          r
                            ? s._enlivenObjects([r], function (i) {
                                ;(s.clipPath = i[0]),
                                  s.__setupCanvas.call(s, n, t, a, e)
                              })
                            : s.__setupCanvas.call(s, n, t, a, e)
                        })
                    },
                    i
                  ),
                  this
                )
              }
            },
            __setupCanvas: function (t, e, i, n) {
              var s = this
              e.forEach(function (t, e) {
                s.insertAt(t, e)
              }),
                (this.renderOnAddRemove = i),
                delete t.objects,
                delete t.backgroundImage,
                delete t.overlayImage,
                delete t.background,
                delete t.overlay,
                this._setOptions(t),
                this.renderAll(),
                n && n()
            },
            _setBgOverlay: function (t, e) {
              var i = {
                backgroundColor: !1,
                overlayColor: !1,
                backgroundImage: !1,
                overlayImage: !1
              }
              if (
                t.backgroundImage ||
                t.overlayImage ||
                t.background ||
                t.overlay
              ) {
                var n = function () {
                  i.backgroundImage &&
                    i.overlayImage &&
                    i.backgroundColor &&
                    i.overlayColor &&
                    e &&
                    e()
                }
                this.__setBgOverlay('backgroundImage', t.backgroundImage, i, n),
                  this.__setBgOverlay('overlayImage', t.overlayImage, i, n),
                  this.__setBgOverlay('backgroundColor', t.background, i, n),
                  this.__setBgOverlay('overlayColor', t.overlay, i, n)
              } else e && e()
            },
            __setBgOverlay: function (t, e, i, n) {
              var s = this
              if (!e) return (i[t] = !0), void (n && n())
              'backgroundImage' === t || 'overlayImage' === t
                ? E.util.enlivenObjects([e], function (e) {
                    ;(s[t] = e[0]), (i[t] = !0), n && n()
                  })
                : this['set' + E.util.string.capitalize(t, !0)](e, function () {
                    ;(i[t] = !0), n && n()
                  })
            },
            _enlivenObjects: function (t, e, i) {
              t && 0 !== t.length
                ? E.util.enlivenObjects(
                    t,
                    function (t) {
                      e && e(t)
                    },
                    null,
                    i
                  )
                : e && e([])
            },
            _toDataURL: function (t, e) {
              this.clone(function (i) {
                e(i.toDataURL(t))
              })
            },
            _toDataURLWithMultiplier: function (t, e, i) {
              this.clone(function (n) {
                i(n.toDataURLWithMultiplier(t, e))
              })
            },
            clone: function (t, e) {
              var i = JSON.stringify(this.toJSON(e))
              this.cloneWithoutData(function (e) {
                e.loadFromJSON(i, function () {
                  t && t(e)
                })
              })
            },
            cloneWithoutData: function (t) {
              var e = E.util.createCanvasElement()
              ;(e.width = this.width), (e.height = this.height)
              var i = new E.Canvas(e)
              this.backgroundImage
                ? (i.setBackgroundImage(this.backgroundImage.src, function () {
                    i.renderAll(), t && t(i)
                  }),
                  (i.backgroundImageOpacity = this.backgroundImageOpacity),
                  (i.backgroundImageStretch = this.backgroundImageStretch))
                : t && t(i)
            }
          }),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend,
              n = e.util.object.clone,
              s = e.util.toFixed,
              r = e.util.string.capitalize,
              a = e.util.degreesToRadians,
              o = !e.isLikelyNode
            e.Object ||
              ((e.Object = e.util.createClass(e.CommonMethods, {
                type: 'object',
                originX: 'left',
                originY: 'top',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                scaleX: 1,
                scaleY: 1,
                flipX: !1,
                flipY: !1,
                opacity: 1,
                angle: 0,
                skewX: 0,
                skewY: 0,
                cornerSize: 20,
                touchCornerSize: 24,
                transparentCorners: !0,
                hoverCursor: null,
                moveCursor: null,
                padding: 0,
                borderColor: 'rgb(178,204,255)',
                borderDashArray: null,
                cornerColor: 'rgb(178,204,255)',
                cornerStrokeColor: null,
                cornerStyle: 'rect',
                cornerDashArray: null,
                centeredScaling: !1,
                centeredRotation: !0,
                fill: 'rgb(0,0,0)',
                fillRule: 'nonzero',
                globalCompositeOperation: 'source-over',
                backgroundColor: '',
                selectionBackgroundColor: '',
                stroke: null,
                strokeWidth: 1,
                strokeDashArray: null,
                strokeDashOffset: 0,
                strokeLineCap: 'butt',
                strokeLineJoin: 'miter',
                strokeMiterLimit: 4,
                shadow: null,
                borderOpacityWhenMoving: 0.4,
                borderScaleFactor: 1,
                minScaleLimit: 0,
                selectable: !0,
                evented: !0,
                visible: !0,
                hasControls: !0,
                hasBorders: !0,
                perPixelTargetFind: !1,
                includeDefaultValues: !0,
                lockMovementX: !1,
                lockMovementY: !1,
                lockRotation: !1,
                lockScalingX: !1,
                lockScalingY: !1,
                lockSkewingX: !1,
                lockSkewingY: !1,
                lockScalingFlip: !1,
                excludeFromExport: !1,
                objectCaching: o,
                statefullCache: !1,
                noScaleCache: !0,
                strokeUniform: !1,
                dirty: !0,
                __corner: 0,
                paintFirst: 'fill',
                activeOn: 'down',
                stateProperties:
                  'top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow visible backgroundColor skewX skewY fillRule paintFirst clipPath strokeUniform'.split(
                    ' '
                  ),
                cacheProperties:
                  'fill stroke strokeWidth strokeDashArray width height paintFirst strokeUniform strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit backgroundColor clipPath'.split(
                    ' '
                  ),
                colorProperties: 'fill stroke backgroundColor'.split(' '),
                clipPath: void 0,
                inverted: !1,
                absolutePositioned: !1,
                initialize: function (t) {
                  t && this.setOptions(t)
                },
                _createCacheCanvas: function () {
                  ;(this._cacheProperties = {}),
                    (this._cacheCanvas = e.util.createCanvasElement()),
                    (this._cacheContext = this._cacheCanvas.getContext('2d')),
                    this._updateCacheCanvas(),
                    (this.dirty = !0)
                },
                _limitCacheSize: function (t) {
                  var i = e.perfLimitSizeTotal,
                    n = t.width,
                    s = t.height,
                    r = e.maxCacheSideLimit,
                    a = e.minCacheSideLimit
                  if (n <= r && s <= r && n * s <= i)
                    return n < a && (t.width = a), s < a && (t.height = a), t
                  var o = n / s,
                    l = e.util.limitDimsByArea(o, i),
                    c = e.util.capValue,
                    h = c(a, l.x, r),
                    d = c(a, l.y, r)
                  return (
                    n > h &&
                      ((t.zoomX /= n / h), (t.width = h), (t.capped = !0)),
                    s > d &&
                      ((t.zoomY /= s / d), (t.height = d), (t.capped = !0)),
                    t
                  )
                },
                _getCacheCanvasDimensions: function () {
                  var t = this.getTotalObjectScaling(),
                    e = this._getTransformedDimensions(0, 0),
                    i = (e.x * t.scaleX) / this.scaleX,
                    n = (e.y * t.scaleY) / this.scaleY
                  return {
                    width: i + 2,
                    height: n + 2,
                    zoomX: t.scaleX,
                    zoomY: t.scaleY,
                    x: i,
                    y: n
                  }
                },
                _updateCacheCanvas: function () {
                  var t = this.canvas
                  if (this.noScaleCache && t && t._currentTransform) {
                    var i = t._currentTransform.target,
                      n = t._currentTransform.action
                    if (this === i && n.slice && 'scale' === n.slice(0, 5))
                      return !1
                  }
                  var s,
                    r,
                    a = this._cacheCanvas,
                    o = this._limitCacheSize(this._getCacheCanvasDimensions()),
                    l = e.minCacheSideLimit,
                    c = o.width,
                    h = o.height,
                    d = o.zoomX,
                    u = o.zoomY,
                    f = c !== this.cacheWidth || h !== this.cacheHeight,
                    p = this.zoomX !== d || this.zoomY !== u,
                    g = f || p,
                    m = 0,
                    v = 0,
                    b = !1
                  if (f) {
                    var y = this._cacheCanvas.width,
                      x = this._cacheCanvas.height,
                      w = c > y || h > x
                    ;(b =
                      w || ((c < 0.9 * y || h < 0.9 * x) && y > l && x > l)),
                      w &&
                        !o.capped &&
                        (c > l || h > l) &&
                        ((m = 0.1 * c), (v = 0.1 * h))
                  }
                  return (
                    this instanceof e.Text &&
                      this.path &&
                      ((g = !0),
                      (b = !0),
                      (m += this.getHeightOfLine(0) * this.zoomX),
                      (v += this.getHeightOfLine(0) * this.zoomY)),
                    !!g &&
                      (b
                        ? ((a.width = Math.ceil(c + m)),
                          (a.height = Math.ceil(h + v)))
                        : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0),
                          this._cacheContext.clearRect(
                            0,
                            0,
                            a.width,
                            a.height
                          )),
                      (s = o.x / 2),
                      (r = o.y / 2),
                      (this.cacheTranslationX =
                        Math.round(a.width / 2 - s) + s),
                      (this.cacheTranslationY =
                        Math.round(a.height / 2 - r) + r),
                      (this.cacheWidth = c),
                      (this.cacheHeight = h),
                      this._cacheContext.translate(
                        this.cacheTranslationX,
                        this.cacheTranslationY
                      ),
                      this._cacheContext.scale(d, u),
                      (this.zoomX = d),
                      (this.zoomY = u),
                      !0)
                  )
                },
                setOptions: function (t) {
                  this._setOptions(t),
                    this._initGradient(t.fill, 'fill'),
                    this._initGradient(t.stroke, 'stroke'),
                    this._initPattern(t.fill, 'fill'),
                    this._initPattern(t.stroke, 'stroke')
                },
                transform: function (t) {
                  var e =
                      (this.group && !this.group._transformDone) ||
                      (this.group &&
                        this.canvas &&
                        t === this.canvas.contextTop),
                    i = this.calcTransformMatrix(!e)
                  t.transform(i[0], i[1], i[2], i[3], i[4], i[5])
                },
                toObject: function (t) {
                  var i = e.Object.NUM_FRACTION_DIGITS,
                    n = {
                      type: this.type,
                      version: e.version,
                      originX: this.originX,
                      originY: this.originY,
                      left: s(this.left, i),
                      top: s(this.top, i),
                      width: s(this.width, i),
                      height: s(this.height, i),
                      fill:
                        this.fill && this.fill.toObject
                          ? this.fill.toObject()
                          : this.fill,
                      stroke:
                        this.stroke && this.stroke.toObject
                          ? this.stroke.toObject()
                          : this.stroke,
                      strokeWidth: s(this.strokeWidth, i),
                      strokeDashArray: this.strokeDashArray
                        ? this.strokeDashArray.concat()
                        : this.strokeDashArray,
                      strokeLineCap: this.strokeLineCap,
                      strokeDashOffset: this.strokeDashOffset,
                      strokeLineJoin: this.strokeLineJoin,
                      strokeUniform: this.strokeUniform,
                      strokeMiterLimit: s(this.strokeMiterLimit, i),
                      scaleX: s(this.scaleX, i),
                      scaleY: s(this.scaleY, i),
                      angle: s(this.angle, i),
                      flipX: this.flipX,
                      flipY: this.flipY,
                      opacity: s(this.opacity, i),
                      shadow:
                        this.shadow && this.shadow.toObject
                          ? this.shadow.toObject()
                          : this.shadow,
                      visible: this.visible,
                      backgroundColor: this.backgroundColor,
                      fillRule: this.fillRule,
                      paintFirst: this.paintFirst,
                      globalCompositeOperation: this.globalCompositeOperation,
                      skewX: s(this.skewX, i),
                      skewY: s(this.skewY, i)
                    }
                  return (
                    this.clipPath &&
                      !this.clipPath.excludeFromExport &&
                      ((n.clipPath = this.clipPath.toObject(t)),
                      (n.clipPath.inverted = this.clipPath.inverted),
                      (n.clipPath.absolutePositioned =
                        this.clipPath.absolutePositioned)),
                    e.util.populateWithProperties(this, n, t),
                    this.includeDefaultValues ||
                      (n = this._removeDefaultValues(n)),
                    n
                  )
                },
                toDatalessObject: function (t) {
                  return this.toObject(t)
                },
                _removeDefaultValues: function (t) {
                  var i = e.util.getKlass(t.type).prototype
                  return (
                    i.stateProperties.forEach(function (e) {
                      'left' !== e &&
                        'top' !== e &&
                        (t[e] === i[e] && delete t[e],
                        Array.isArray(t[e]) &&
                          Array.isArray(i[e]) &&
                          0 === t[e].length &&
                          0 === i[e].length &&
                          delete t[e])
                    }),
                    t
                  )
                },
                toString: function () {
                  return '#<fabric.' + r(this.type) + '>'
                },
                getObjectScaling: function () {
                  if (!this.group)
                    return { scaleX: this.scaleX, scaleY: this.scaleY }
                  var t = e.util.qrDecompose(this.calcTransformMatrix())
                  return {
                    scaleX: Math.abs(t.scaleX),
                    scaleY: Math.abs(t.scaleY)
                  }
                },
                getTotalObjectScaling: function () {
                  var t = this.getObjectScaling(),
                    e = t.scaleX,
                    i = t.scaleY
                  if (this.canvas) {
                    var n = this.canvas.getZoom(),
                      s = this.canvas.getRetinaScaling()
                    ;(e *= n * s), (i *= n * s)
                  }
                  return { scaleX: e, scaleY: i }
                },
                getObjectOpacity: function () {
                  var t = this.opacity
                  return this.group && (t *= this.group.getObjectOpacity()), t
                },
                _set: function (t, i) {
                  var n = 'scaleX' === t || 'scaleY' === t,
                    s = this[t] !== i,
                    r = !1
                  return (
                    n && (i = this._constrainScale(i)),
                    'scaleX' === t && i < 0
                      ? ((this.flipX = !this.flipX), (i *= -1))
                      : 'scaleY' === t && i < 0
                      ? ((this.flipY = !this.flipY), (i *= -1))
                      : 'shadow' !== t || !i || i instanceof e.Shadow
                      ? 'dirty' === t &&
                        this.group &&
                        this.group.set('dirty', i)
                      : (i = new e.Shadow(i)),
                    (this[t] = i),
                    s &&
                      ((r = this.group && this.group.isOnACache()),
                      this.cacheProperties.indexOf(t) > -1
                        ? ((this.dirty = !0), r && this.group.set('dirty', !0))
                        : r &&
                          this.stateProperties.indexOf(t) > -1 &&
                          this.group.set('dirty', !0)),
                    this
                  )
                },
                setOnGroup: function () {},
                getViewportTransform: function () {
                  return this.canvas && this.canvas.viewportTransform
                    ? this.canvas.viewportTransform
                    : e.iMatrix.concat()
                },
                isNotVisible: function () {
                  return (
                    0 === this.opacity ||
                    (!this.width && !this.height && 0 === this.strokeWidth) ||
                    !this.visible
                  )
                },
                render: function (t) {
                  this.isNotVisible() ||
                    (this.canvas &&
                      this.canvas.skipOffscreen &&
                      !this.group &&
                      !this.isOnScreen()) ||
                    (t.save(),
                    this._setupCompositeOperation(t),
                    this.drawSelectionBackground(t),
                    this.transform(t),
                    this._setOpacity(t),
                    this._setShadow(t, this),
                    this.shouldCache()
                      ? (this.renderCache(), this.drawCacheOnCanvas(t))
                      : (this._removeCacheCanvas(),
                        (this.dirty = !1),
                        this.drawObject(t),
                        this.objectCaching &&
                          this.statefullCache &&
                          this.saveState({ propertySet: 'cacheProperties' })),
                    t.restore())
                },
                renderCache: function (t) {
                  ;(t = t || {}),
                    (this._cacheCanvas && this._cacheContext) ||
                      this._createCacheCanvas(),
                    this.isCacheDirty() &&
                      (this.statefullCache &&
                        this.saveState({ propertySet: 'cacheProperties' }),
                      this.drawObject(this._cacheContext, t.forClipping),
                      (this.dirty = !1))
                },
                _removeCacheCanvas: function () {
                  ;(this._cacheCanvas = null),
                    (this._cacheContext = null),
                    (this.cacheWidth = 0),
                    (this.cacheHeight = 0)
                },
                hasStroke: function () {
                  return (
                    this.stroke &&
                    'transparent' !== this.stroke &&
                    0 !== this.strokeWidth
                  )
                },
                hasFill: function () {
                  return this.fill && 'transparent' !== this.fill
                },
                needsItsOwnCache: function () {
                  return (
                    !(
                      'stroke' !== this.paintFirst ||
                      !this.hasFill() ||
                      !this.hasStroke() ||
                      'object' != typeof this.shadow
                    ) || !!this.clipPath
                  )
                },
                shouldCache: function () {
                  return (
                    (this.ownCaching =
                      this.needsItsOwnCache() ||
                      (this.objectCaching &&
                        (!this.group || !this.group.isOnACache()))),
                    this.ownCaching
                  )
                },
                willDrawShadow: function () {
                  return (
                    !!this.shadow &&
                    (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY)
                  )
                },
                drawClipPathOnCache: function (t, i) {
                  if (
                    (t.save(),
                    i.inverted
                      ? (t.globalCompositeOperation = 'destination-out')
                      : (t.globalCompositeOperation = 'destination-in'),
                    i.absolutePositioned)
                  ) {
                    var n = e.util.invertTransform(this.calcTransformMatrix())
                    t.transform(n[0], n[1], n[2], n[3], n[4], n[5])
                  }
                  i.transform(t),
                    t.scale(1 / i.zoomX, 1 / i.zoomY),
                    t.drawImage(
                      i._cacheCanvas,
                      -i.cacheTranslationX,
                      -i.cacheTranslationY
                    ),
                    t.restore()
                },
                drawObject: function (t, e) {
                  var i = this.fill,
                    n = this.stroke
                  e
                    ? ((this.fill = 'black'),
                      (this.stroke = ''),
                      this._setClippingProperties(t))
                    : this._renderBackground(t),
                    this._render(t),
                    this._drawClipPath(t, this.clipPath),
                    (this.fill = i),
                    (this.stroke = n)
                },
                _drawClipPath: function (t, e) {
                  e &&
                    ((e.canvas = this.canvas),
                    e.shouldCache(),
                    (e._transformDone = !0),
                    e.renderCache({ forClipping: !0 }),
                    this.drawClipPathOnCache(t, e))
                },
                drawCacheOnCanvas: function (t) {
                  t.scale(1 / this.zoomX, 1 / this.zoomY),
                    t.drawImage(
                      this._cacheCanvas,
                      -this.cacheTranslationX,
                      -this.cacheTranslationY
                    )
                },
                isCacheDirty: function (t) {
                  if (this.isNotVisible()) return !1
                  if (
                    this._cacheCanvas &&
                    this._cacheContext &&
                    !t &&
                    this._updateCacheCanvas()
                  )
                    return !0
                  if (
                    this.dirty ||
                    (this.clipPath && this.clipPath.absolutePositioned) ||
                    (this.statefullCache &&
                      this.hasStateChanged('cacheProperties'))
                  ) {
                    if (this._cacheCanvas && this._cacheContext && !t) {
                      var e = this.cacheWidth / this.zoomX,
                        i = this.cacheHeight / this.zoomY
                      this._cacheContext.clearRect(-e / 2, -i / 2, e, i)
                    }
                    return !0
                  }
                  return !1
                },
                _renderBackground: function (t) {
                  if (this.backgroundColor) {
                    var e = this._getNonTransformedDimensions()
                    ;(t.fillStyle = this.backgroundColor),
                      t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y),
                      this._removeShadow(t)
                  }
                },
                _setOpacity: function (t) {
                  this.group && !this.group._transformDone
                    ? (t.globalAlpha = this.getObjectOpacity())
                    : (t.globalAlpha *= this.opacity)
                },
                _setStrokeStyles: function (t, e) {
                  var i = e.stroke
                  i &&
                    ((t.lineWidth = e.strokeWidth),
                    (t.lineCap = e.strokeLineCap),
                    (t.lineDashOffset = e.strokeDashOffset),
                    (t.lineJoin = e.strokeLineJoin),
                    (t.miterLimit = e.strokeMiterLimit),
                    i.toLive
                      ? 'percentage' === i.gradientUnits ||
                        i.gradientTransform ||
                        i.patternTransform
                        ? this._applyPatternForTransformedGradient(t, i)
                        : ((t.strokeStyle = i.toLive(t, this)),
                          this._applyPatternGradientTransform(t, i))
                      : (t.strokeStyle = e.stroke))
                },
                _setFillStyles: function (t, e) {
                  var i = e.fill
                  i &&
                    (i.toLive
                      ? ((t.fillStyle = i.toLive(t, this)),
                        this._applyPatternGradientTransform(t, e.fill))
                      : (t.fillStyle = i))
                },
                _setClippingProperties: function (t) {
                  ;(t.globalAlpha = 1),
                    (t.strokeStyle = 'transparent'),
                    (t.fillStyle = '#000000')
                },
                _setLineDash: function (t, e) {
                  e &&
                    0 !== e.length &&
                    (1 & e.length && e.push.apply(e, e), t.setLineDash(e))
                },
                _renderControls: function (t, i) {
                  var n,
                    s,
                    r,
                    o = this.getViewportTransform(),
                    l = this.calcTransformMatrix()
                  ;(s =
                    void 0 !== (i = i || {}).hasBorders
                      ? i.hasBorders
                      : this.hasBorders),
                    (r =
                      void 0 !== i.hasControls
                        ? i.hasControls
                        : this.hasControls),
                    (l = e.util.multiplyTransformMatrices(o, l)),
                    (n = e.util.qrDecompose(l)),
                    t.save(),
                    t.translate(n.translateX, n.translateY),
                    (t.lineWidth = 1 * this.borderScaleFactor),
                    this.group ||
                      (t.globalAlpha = this.isMoving
                        ? this.borderOpacityWhenMoving
                        : 1),
                    this.flipX && (n.angle -= 180),
                    t.rotate(a(this.group ? n.angle : this.angle)),
                    i.forActiveSelection || this.group
                      ? s && this.drawBordersInGroup(t, n, i)
                      : s && this.drawBorders(t, i),
                    r && this.drawControls(t, i),
                    t.restore()
                },
                _setShadow: function (t) {
                  if (this.shadow) {
                    var i,
                      n = this.shadow,
                      s = this.canvas,
                      r = (s && s.viewportTransform[0]) || 1,
                      a = (s && s.viewportTransform[3]) || 1
                    ;(i = n.nonScaling
                      ? { scaleX: 1, scaleY: 1 }
                      : this.getObjectScaling()),
                      s &&
                        s._isRetinaScaling() &&
                        ((r *= e.devicePixelRatio), (a *= e.devicePixelRatio)),
                      (t.shadowColor = n.color),
                      (t.shadowBlur =
                        (n.blur *
                          e.browserShadowBlurConstant *
                          (r + a) *
                          (i.scaleX + i.scaleY)) /
                        4),
                      (t.shadowOffsetX = n.offsetX * r * i.scaleX),
                      (t.shadowOffsetY = n.offsetY * a * i.scaleY)
                  }
                },
                _removeShadow: function (t) {
                  this.shadow &&
                    ((t.shadowColor = ''),
                    (t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0))
                },
                _applyPatternGradientTransform: function (t, e) {
                  if (!e || !e.toLive) return { offsetX: 0, offsetY: 0 }
                  var i = e.gradientTransform || e.patternTransform,
                    n = -this.width / 2 + e.offsetX || 0,
                    s = -this.height / 2 + e.offsetY || 0
                  return (
                    'percentage' === e.gradientUnits
                      ? t.transform(this.width, 0, 0, this.height, n, s)
                      : t.transform(1, 0, 0, 1, n, s),
                    i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                    { offsetX: n, offsetY: s }
                  )
                },
                _renderPaintInOrder: function (t) {
                  'stroke' === this.paintFirst
                    ? (this._renderStroke(t), this._renderFill(t))
                    : (this._renderFill(t), this._renderStroke(t))
                },
                _render: function () {},
                _renderFill: function (t) {
                  this.fill &&
                    (t.save(),
                    this._setFillStyles(t, this),
                    'evenodd' === this.fillRule ? t.fill('evenodd') : t.fill(),
                    t.restore())
                },
                _renderStroke: function (t) {
                  if (this.stroke && 0 !== this.strokeWidth) {
                    if (
                      (this.shadow &&
                        !this.shadow.affectStroke &&
                        this._removeShadow(t),
                      t.save(),
                      this.strokeUniform && this.group)
                    ) {
                      var e = this.getObjectScaling()
                      t.scale(1 / e.scaleX, 1 / e.scaleY)
                    } else
                      this.strokeUniform &&
                        t.scale(1 / this.scaleX, 1 / this.scaleY)
                    this._setLineDash(t, this.strokeDashArray),
                      this._setStrokeStyles(t, this),
                      t.stroke(),
                      t.restore()
                  }
                },
                _applyPatternForTransformedGradient: function (t, i) {
                  var n,
                    s = this._limitCacheSize(this._getCacheCanvasDimensions()),
                    r = e.util.createCanvasElement(),
                    a = this.canvas.getRetinaScaling(),
                    o = s.x / this.scaleX / a,
                    l = s.y / this.scaleY / a
                  ;(r.width = o),
                    (r.height = l),
                    (n = r.getContext('2d')).beginPath(),
                    n.moveTo(0, 0),
                    n.lineTo(o, 0),
                    n.lineTo(o, l),
                    n.lineTo(0, l),
                    n.closePath(),
                    n.translate(o / 2, l / 2),
                    n.scale(
                      s.zoomX / this.scaleX / a,
                      s.zoomY / this.scaleY / a
                    ),
                    this._applyPatternGradientTransform(n, i),
                    (n.fillStyle = i.toLive(t)),
                    n.fill(),
                    t.translate(
                      -this.width / 2 - this.strokeWidth / 2,
                      -this.height / 2 - this.strokeWidth / 2
                    ),
                    t.scale(
                      (a * this.scaleX) / s.zoomX,
                      (a * this.scaleY) / s.zoomY
                    ),
                    (t.strokeStyle = n.createPattern(r, 'no-repeat'))
                },
                _findCenterFromElement: function () {
                  return {
                    x: this.left + this.width / 2,
                    y: this.top + this.height / 2
                  }
                },
                _assignTransformMatrixProps: function () {
                  if (this.transformMatrix) {
                    var t = e.util.qrDecompose(this.transformMatrix)
                    ;(this.flipX = !1),
                      (this.flipY = !1),
                      this.set('scaleX', t.scaleX),
                      this.set('scaleY', t.scaleY),
                      (this.angle = t.angle),
                      (this.skewX = t.skewX),
                      (this.skewY = 0)
                  }
                },
                _removeTransformMatrix: function (t) {
                  var i = this._findCenterFromElement()
                  this.transformMatrix &&
                    (this._assignTransformMatrixProps(),
                    (i = e.util.transformPoint(i, this.transformMatrix))),
                    (this.transformMatrix = null),
                    t &&
                      ((this.scaleX *= t.scaleX),
                      (this.scaleY *= t.scaleY),
                      (this.cropX = t.cropX),
                      (this.cropY = t.cropY),
                      (i.x += t.offsetLeft),
                      (i.y += t.offsetTop),
                      (this.width = t.width),
                      (this.height = t.height)),
                    this.setPositionByOrigin(i, 'center', 'center')
                },
                clone: function (t, i) {
                  var n = this.toObject(i)
                  this.constructor.fromObject
                    ? this.constructor.fromObject(n, t)
                    : e.Object._fromObject('Object', n, t)
                },
                cloneAsImage: function (t, i) {
                  var n = this.toCanvasElement(i)
                  return t && t(new e.Image(n)), this
                },
                toCanvasElement: function (t) {
                  t || (t = {})
                  var i = e.util,
                    n = i.saveObjectTransform(this),
                    s = this.group,
                    r = this.shadow,
                    a = Math.abs,
                    o =
                      (t.multiplier || 1) *
                      (t.enableRetinaScaling ? e.devicePixelRatio : 1)
                  delete this.group,
                    t.withoutTransform && i.resetObjectTransform(this),
                    t.withoutShadow && (this.shadow = null)
                  var l,
                    c,
                    h,
                    d,
                    u = e.util.createCanvasElement(),
                    f = this.getBoundingRect(!0, !0),
                    p = this.shadow,
                    g = { x: 0, y: 0 }
                  p &&
                    ((c = p.blur),
                    (l = p.nonScaling
                      ? { scaleX: 1, scaleY: 1 }
                      : this.getObjectScaling()),
                    (g.x = 2 * Math.round(a(p.offsetX) + c) * a(l.scaleX)),
                    (g.y = 2 * Math.round(a(p.offsetY) + c) * a(l.scaleY))),
                    (h = f.width + g.x),
                    (d = f.height + g.y),
                    (u.width = Math.ceil(h)),
                    (u.height = Math.ceil(d))
                  var m = new e.StaticCanvas(u, {
                    enableRetinaScaling: !1,
                    renderOnAddRemove: !1,
                    skipOffscreen: !1
                  })
                  'jpeg' === t.format && (m.backgroundColor = '#fff'),
                    this.setPositionByOrigin(
                      new e.Point(m.width / 2, m.height / 2),
                      'center',
                      'center'
                    )
                  var v = this.canvas
                  m.add(this)
                  var b = m.toCanvasElement(o || 1, t)
                  return (
                    (this.shadow = r),
                    this.set('canvas', v),
                    s && (this.group = s),
                    this.set(n).setCoords(),
                    (m._objects = []),
                    m.dispose(),
                    (m = null),
                    b
                  )
                },
                toDataURL: function (t) {
                  return (
                    t || (t = {}),
                    e.util.toDataURL(
                      this.toCanvasElement(t),
                      t.format || 'png',
                      t.quality || 1
                    )
                  )
                },
                isType: function (t) {
                  return arguments.length > 1
                    ? Array.from(arguments).includes(this.type)
                    : this.type === t
                },
                complexity: function () {
                  return 1
                },
                toJSON: function (t) {
                  return this.toObject(t)
                },
                rotate: function (t) {
                  var e =
                    ('center' !== this.originX || 'center' !== this.originY) &&
                    this.centeredRotation
                  return (
                    e && this._setOriginToCenter(),
                    this.set('angle', t),
                    e && this._resetOrigin(),
                    this
                  )
                },
                centerH: function () {
                  return this.canvas && this.canvas.centerObjectH(this), this
                },
                viewportCenterH: function () {
                  return (
                    this.canvas && this.canvas.viewportCenterObjectH(this), this
                  )
                },
                centerV: function () {
                  return this.canvas && this.canvas.centerObjectV(this), this
                },
                viewportCenterV: function () {
                  return (
                    this.canvas && this.canvas.viewportCenterObjectV(this), this
                  )
                },
                center: function () {
                  return this.canvas && this.canvas.centerObject(this), this
                },
                viewportCenter: function () {
                  return (
                    this.canvas && this.canvas.viewportCenterObject(this), this
                  )
                },
                getLocalPointer: function (t, i) {
                  i = i || this.canvas.getPointer(t)
                  var n = new e.Point(i.x, i.y),
                    s = this._getLeftTopCoords()
                  return (
                    this.angle &&
                      (n = e.util.rotatePoint(n, s, a(-this.angle))),
                    { x: n.x - s.x, y: n.y - s.y }
                  )
                },
                _setupCompositeOperation: function (t) {
                  this.globalCompositeOperation &&
                    (t.globalCompositeOperation = this.globalCompositeOperation)
                },
                dispose: function () {
                  e.runningAnimations &&
                    e.runningAnimations.cancelByTarget(this)
                }
              })),
              e.util.createAccessors && e.util.createAccessors(e.Object),
              i(e.Object.prototype, e.Observable),
              (e.Object.NUM_FRACTION_DIGITS = 2),
              (e.Object.ENLIVEN_PROPS = ['clipPath']),
              (e.Object._fromObject = function (t, i, s, r) {
                var a = e[t]
                ;(i = n(i, !0)),
                  e.util.enlivenPatterns([i.fill, i.stroke], function (t) {
                    void 0 !== t[0] && (i.fill = t[0]),
                      void 0 !== t[1] && (i.stroke = t[1]),
                      e.util.enlivenObjectEnlivables(i, i, function () {
                        var t = r ? new a(i[r], i) : new a(i)
                        s && s(t)
                      })
                  })
              }),
              (e.Object.__uid = 0))
          })(e),
          (y = E.util.degreesToRadians),
          (x = { left: -0.5, center: 0, right: 0.5 }),
          (w = { top: -0.5, center: 0, bottom: 0.5 }),
          E.util.object.extend(E.Object.prototype, {
            translateToGivenOrigin: function (t, e, i, n, s) {
              var r,
                a,
                o,
                l = t.x,
                c = t.y
              return (
                'string' == typeof e ? (e = x[e]) : (e -= 0.5),
                'string' == typeof n ? (n = x[n]) : (n -= 0.5),
                'string' == typeof i ? (i = w[i]) : (i -= 0.5),
                'string' == typeof s ? (s = w[s]) : (s -= 0.5),
                (a = s - i),
                ((r = n - e) || a) &&
                  ((o = this._getTransformedDimensions()),
                  (l = t.x + r * o.x),
                  (c = t.y + a * o.y)),
                new E.Point(l, c)
              )
            },
            translateToCenterPoint: function (t, e, i) {
              var n = this.translateToGivenOrigin(t, e, i, 'center', 'center')
              return this.angle ? E.util.rotatePoint(n, t, y(this.angle)) : n
            },
            translateToOriginPoint: function (t, e, i) {
              var n = this.translateToGivenOrigin(t, 'center', 'center', e, i)
              return this.angle ? E.util.rotatePoint(n, t, y(this.angle)) : n
            },
            getCenterPoint: function () {
              var t = new E.Point(this.left, this.top)
              return this.translateToCenterPoint(t, this.originX, this.originY)
            },
            getPointByOrigin: function (t, e) {
              var i = this.getCenterPoint()
              return this.translateToOriginPoint(i, t, e)
            },
            toLocalPoint: function (t, e, i) {
              var n,
                s,
                r = this.getCenterPoint()
              return (
                (n =
                  void 0 !== e && void 0 !== i
                    ? this.translateToGivenOrigin(r, 'center', 'center', e, i)
                    : new E.Point(this.left, this.top)),
                (s = new E.Point(t.x, t.y)),
                this.angle && (s = E.util.rotatePoint(s, r, -y(this.angle))),
                s.subtractEquals(n)
              )
            },
            setPositionByOrigin: function (t, e, i) {
              var n = this.translateToCenterPoint(t, e, i),
                s = this.translateToOriginPoint(n, this.originX, this.originY)
              this.set('left', s.x), this.set('top', s.y)
            },
            adjustPosition: function (t) {
              var e,
                i,
                n = y(this.angle),
                s = this.getScaledWidth(),
                r = E.util.cos(n) * s,
                a = E.util.sin(n) * s
              ;(e =
                'string' == typeof this.originX
                  ? x[this.originX]
                  : this.originX - 0.5),
                (i = 'string' == typeof t ? x[t] : t - 0.5),
                (this.left += r * (i - e)),
                (this.top += a * (i - e)),
                this.setCoords(),
                (this.originX = t)
            },
            _setOriginToCenter: function () {
              ;(this._originalOriginX = this.originX),
                (this._originalOriginY = this.originY)
              var t = this.getCenterPoint()
              ;(this.originX = 'center'),
                (this.originY = 'center'),
                (this.left = t.x),
                (this.top = t.y)
            },
            _resetOrigin: function () {
              var t = this.translateToOriginPoint(
                this.getCenterPoint(),
                this._originalOriginX,
                this._originalOriginY
              )
              ;(this.originX = this._originalOriginX),
                (this.originY = this._originalOriginY),
                (this.left = t.x),
                (this.top = t.y),
                (this._originalOriginX = null),
                (this._originalOriginY = null)
            },
            _getLeftTopCoords: function () {
              return this.translateToOriginPoint(
                this.getCenterPoint(),
                'left',
                'top'
              )
            }
          }),
          (function () {
            var t = E.util,
              e = t.degreesToRadians,
              i = t.multiplyTransformMatrices,
              n = t.transformPoint
            t.object.extend(E.Object.prototype, {
              oCoords: null,
              aCoords: null,
              lineCoords: null,
              ownMatrixCache: null,
              matrixCache: null,
              controls: {},
              _getCoords: function (t, e) {
                return e
                  ? t
                    ? this.calcACoords()
                    : this.calcLineCoords()
                  : ((this.aCoords && this.lineCoords) || this.setCoords(!0),
                    t ? this.aCoords : this.lineCoords)
              },
              getCoords: function (t, e) {
                return (
                  (i = this._getCoords(t, e)),
                  [
                    new E.Point(i.tl.x, i.tl.y),
                    new E.Point(i.tr.x, i.tr.y),
                    new E.Point(i.br.x, i.br.y),
                    new E.Point(i.bl.x, i.bl.y)
                  ]
                )
                var i
              },
              intersectsWithRect: function (t, e, i, n) {
                var s = this.getCoords(i, n)
                return (
                  'Intersection' ===
                  E.Intersection.intersectPolygonRectangle(s, t, e).status
                )
              },
              intersectsWithObject: function (t, e, i) {
                return (
                  'Intersection' ===
                    E.Intersection.intersectPolygonPolygon(
                      this.getCoords(e, i),
                      t.getCoords(e, i)
                    ).status ||
                  t.isContainedWithinObject(this, e, i) ||
                  this.isContainedWithinObject(t, e, i)
                )
              },
              isContainedWithinObject: function (t, e, i) {
                for (
                  var n = this.getCoords(e, i),
                    s = e ? t.aCoords : t.lineCoords,
                    r = 0,
                    a = t._getImageLines(s);
                  r < 4;
                  r++
                )
                  if (!t.containsPoint(n[r], a)) return !1
                return !0
              },
              isContainedWithinRect: function (t, e, i, n) {
                var s = this.getBoundingRect(i, n)
                return (
                  s.left >= t.x &&
                  s.left + s.width <= e.x &&
                  s.top >= t.y &&
                  s.top + s.height <= e.y
                )
              },
              containsPoint: function (t, e, i, n) {
                var s = this._getCoords(i, n),
                  r =
                    ((e = e || this._getImageLines(s)),
                    this._findCrossPoints(t, e))
                return 0 !== r && r % 2 == 1
              },
              isOnScreen: function (t) {
                if (!this.canvas) return !1
                var e = this.canvas.vptCoords.tl,
                  i = this.canvas.vptCoords.br
                return (
                  !!this.getCoords(!0, t).some(function (t) {
                    return t.x <= i.x && t.x >= e.x && t.y <= i.y && t.y >= e.y
                  }) ||
                  !!this.intersectsWithRect(e, i, !0, t) ||
                  this._containsCenterOfCanvas(e, i, t)
                )
              },
              _containsCenterOfCanvas: function (t, e, i) {
                var n = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 }
                return !!this.containsPoint(n, null, !0, i)
              },
              isPartiallyOnScreen: function (t) {
                if (!this.canvas) return !1
                var e = this.canvas.vptCoords.tl,
                  i = this.canvas.vptCoords.br
                return (
                  !!this.intersectsWithRect(e, i, !0, t) ||
                  (this.getCoords(!0, t).every(function (t) {
                    return (
                      (t.x >= i.x || t.x <= e.x) && (t.y >= i.y || t.y <= e.y)
                    )
                  }) &&
                    this._containsCenterOfCanvas(e, i, t))
                )
              },
              _getImageLines: function (t) {
                return {
                  topline: { o: t.tl, d: t.tr },
                  rightline: { o: t.tr, d: t.br },
                  bottomline: { o: t.br, d: t.bl },
                  leftline: { o: t.bl, d: t.tl }
                }
              },
              _findCrossPoints: function (t, e) {
                var i,
                  n,
                  s,
                  r = 0
                for (var a in e)
                  if (
                    !(
                      ((s = e[a]).o.y < t.y && s.d.y < t.y) ||
                      (s.o.y >= t.y && s.d.y >= t.y) ||
                      (s.o.x === s.d.x && s.o.x >= t.x
                        ? (n = s.o.x)
                        : ((i = (s.d.y - s.o.y) / (s.d.x - s.o.x)),
                          (n =
                            -(t.y - 0 * t.x - (s.o.y - i * s.o.x)) / (0 - i))),
                      n >= t.x && (r += 1),
                      2 !== r)
                    )
                  )
                    break
                return r
              },
              getBoundingRect: function (e, i) {
                var n = this.getCoords(e, i)
                return t.makeBoundingBoxFromPoints(n)
              },
              getScaledWidth: function () {
                return this._getTransformedDimensions().x
              },
              getScaledHeight: function () {
                return this._getTransformedDimensions().y
              },
              _constrainScale: function (t) {
                return Math.abs(t) < this.minScaleLimit
                  ? t < 0
                    ? -this.minScaleLimit
                    : this.minScaleLimit
                  : 0 === t
                  ? 1e-4
                  : t
              },
              scale: function (t) {
                return (
                  this._set('scaleX', t),
                  this._set('scaleY', t),
                  this.setCoords()
                )
              },
              scaleToWidth: function (t, e) {
                var i = this.getBoundingRect(e).width / this.getScaledWidth()
                return this.scale(t / this.width / i)
              },
              scaleToHeight: function (t, e) {
                var i = this.getBoundingRect(e).height / this.getScaledHeight()
                return this.scale(t / this.height / i)
              },
              calcLineCoords: function () {
                var i = this.getViewportTransform(),
                  s = this.padding,
                  r = e(this.angle),
                  a = t.cos(r) * s,
                  o = t.sin(r) * s,
                  l = a + o,
                  c = a - o,
                  h = this.calcACoords(),
                  d = {
                    tl: n(h.tl, i),
                    tr: n(h.tr, i),
                    bl: n(h.bl, i),
                    br: n(h.br, i)
                  }
                return (
                  s &&
                    ((d.tl.x -= c),
                    (d.tl.y -= l),
                    (d.tr.x += l),
                    (d.tr.y -= c),
                    (d.bl.x -= l),
                    (d.bl.y += c),
                    (d.br.x += c),
                    (d.br.y += l)),
                  d
                )
              },
              calcOCoords: function () {
                var t = this._calcRotateMatrix(),
                  e = this._calcTranslateMatrix(),
                  n = this.getViewportTransform(),
                  s = i(n, e),
                  r = i(s, t),
                  a =
                    ((r = i(r, [1 / n[0], 0, 0, 1 / n[3], 0, 0])),
                    this._calculateCurrentDimensions()),
                  o = {}
                return (
                  this.forEachControl(function (t, e, i) {
                    o[e] = t.positionHandler(a, r, i)
                  }),
                  o
                )
              },
              calcACoords: function () {
                var t = this._calcRotateMatrix(),
                  e = this._calcTranslateMatrix(),
                  s = i(e, t),
                  r = this._getTransformedDimensions(),
                  a = r.x / 2,
                  o = r.y / 2
                return {
                  tl: n({ x: -a, y: -o }, s),
                  tr: n({ x: a, y: -o }, s),
                  bl: n({ x: -a, y: o }, s),
                  br: n({ x: a, y: o }, s)
                }
              },
              setCoords: function (t) {
                return (
                  (this.aCoords = this.calcACoords()),
                  (this.lineCoords = this.group
                    ? this.aCoords
                    : this.calcLineCoords()),
                  t ||
                    ((this.oCoords = this.calcOCoords()),
                    this._setCornerCoords && this._setCornerCoords()),
                  this
                )
              },
              _calcRotateMatrix: function () {
                return t.calcRotateMatrix(this)
              },
              _calcTranslateMatrix: function () {
                var t = this.getCenterPoint()
                return [1, 0, 0, 1, t.x, t.y]
              },
              transformMatrixKey: function (t) {
                var e = '_',
                  i = ''
                return (
                  !t &&
                    this.group &&
                    (i = this.group.transformMatrixKey(t) + e),
                  i +
                    this.top +
                    e +
                    this.left +
                    e +
                    this.scaleX +
                    e +
                    this.scaleY +
                    e +
                    this.skewX +
                    e +
                    this.skewY +
                    e +
                    this.angle +
                    e +
                    this.originX +
                    e +
                    this.originY +
                    e +
                    this.width +
                    e +
                    this.height +
                    e +
                    this.strokeWidth +
                    this.flipX +
                    this.flipY
                )
              },
              calcTransformMatrix: function (t) {
                var e = this.calcOwnMatrix()
                if (t || !this.group) return e
                var n = this.transformMatrixKey(t),
                  s = this.matrixCache || (this.matrixCache = {})
                return s.key === n
                  ? s.value
                  : (this.group &&
                      (e = i(this.group.calcTransformMatrix(!1), e)),
                    (s.key = n),
                    (s.value = e),
                    e)
              },
              calcOwnMatrix: function () {
                var e = this.transformMatrixKey(!0),
                  i = this.ownMatrixCache || (this.ownMatrixCache = {})
                if (i.key === e) return i.value
                var n = this._calcTranslateMatrix(),
                  s = {
                    angle: this.angle,
                    translateX: n[4],
                    translateY: n[5],
                    scaleX: this.scaleX,
                    scaleY: this.scaleY,
                    skewX: this.skewX,
                    skewY: this.skewY,
                    flipX: this.flipX,
                    flipY: this.flipY
                  }
                return (i.key = e), (i.value = t.composeMatrix(s)), i.value
              },
              _getNonTransformedDimensions: function () {
                var t = this.strokeWidth
                return { x: this.width + t, y: this.height + t }
              },
              _getTransformedDimensions: function (e, i) {
                void 0 === e && (e = this.skewX),
                  void 0 === i && (i = this.skewY)
                var n,
                  s,
                  r,
                  a = 0 === e && 0 === i
                if (
                  (this.strokeUniform
                    ? ((s = this.width), (r = this.height))
                    : ((s = (n = this._getNonTransformedDimensions()).x),
                      (r = n.y)),
                  a)
                )
                  return this._finalizeDimensions(
                    s * this.scaleX,
                    r * this.scaleY
                  )
                var o = t.sizeAfterTransform(s, r, {
                  scaleX: this.scaleX,
                  scaleY: this.scaleY,
                  skewX: e,
                  skewY: i
                })
                return this._finalizeDimensions(o.x, o.y)
              },
              _finalizeDimensions: function (t, e) {
                return this.strokeUniform
                  ? { x: t + this.strokeWidth, y: e + this.strokeWidth }
                  : { x: t, y: e }
              },
              _calculateCurrentDimensions: function () {
                var t = this.getViewportTransform(),
                  e = this._getTransformedDimensions()
                return n(e, t, !0).scalarAdd(2 * this.padding)
              }
            })
          })(),
          E.util.object.extend(E.Object.prototype, {
            sendToBack: function () {
              return (
                this.group
                  ? E.StaticCanvas.prototype.sendToBack.call(this.group, this)
                  : this.canvas && this.canvas.sendToBack(this),
                this
              )
            },
            bringToFront: function () {
              return (
                this.group
                  ? E.StaticCanvas.prototype.bringToFront.call(this.group, this)
                  : this.canvas && this.canvas.bringToFront(this),
                this
              )
            },
            sendBackwards: function (t) {
              return (
                this.group
                  ? E.StaticCanvas.prototype.sendBackwards.call(
                      this.group,
                      this,
                      t
                    )
                  : this.canvas && this.canvas.sendBackwards(this, t),
                this
              )
            },
            bringForward: function (t) {
              return (
                this.group
                  ? E.StaticCanvas.prototype.bringForward.call(
                      this.group,
                      this,
                      t
                    )
                  : this.canvas && this.canvas.bringForward(this, t),
                this
              )
            },
            moveTo: function (t) {
              return (
                this.group && 'activeSelection' !== this.group.type
                  ? E.StaticCanvas.prototype.moveTo.call(this.group, this, t)
                  : this.canvas && this.canvas.moveTo(this, t),
                this
              )
            }
          }),
          (function () {
            function t (t, e) {
              if (e) {
                if (e.toLive) return t + ': url(#SVGID_' + e.id + '); '
                var i = new E.Color(e),
                  n = t + ': ' + i.toRgb() + '; ',
                  s = i.getAlpha()
                return (
                  1 !== s && (n += t + '-opacity: ' + s.toString() + '; '), n
                )
              }
              return t + ': none; '
            }
            var e = E.util.toFixed
            E.util.object.extend(E.Object.prototype, {
              getSvgStyles: function (e) {
                var i = this.fillRule ? this.fillRule : 'nonzero',
                  n = this.strokeWidth ? this.strokeWidth : '0',
                  s = this.strokeDashArray
                    ? this.strokeDashArray.join(' ')
                    : 'none',
                  r = this.strokeDashOffset ? this.strokeDashOffset : '0',
                  a = this.strokeLineCap ? this.strokeLineCap : 'butt',
                  o = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
                  l = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
                  c = void 0 !== this.opacity ? this.opacity : '1',
                  h = this.visible ? '' : ' visibility: hidden;',
                  d = e ? '' : this.getSvgFilter(),
                  u = t('fill', this.fill)
                return [
                  t('stroke', this.stroke),
                  'stroke-width: ',
                  n,
                  '; ',
                  'stroke-dasharray: ',
                  s,
                  '; ',
                  'stroke-linecap: ',
                  a,
                  '; ',
                  'stroke-dashoffset: ',
                  r,
                  '; ',
                  'stroke-linejoin: ',
                  o,
                  '; ',
                  'stroke-miterlimit: ',
                  l,
                  '; ',
                  u,
                  'fill-rule: ',
                  i,
                  '; ',
                  'opacity: ',
                  c,
                  ';',
                  d,
                  h
                ].join('')
              },
              getSvgSpanStyles: function (e, i) {
                var n = '; ',
                  s = e.fontFamily
                    ? 'font-family: ' +
                      (-1 === e.fontFamily.indexOf("'") &&
                      -1 === e.fontFamily.indexOf('"')
                        ? "'" + e.fontFamily + "'"
                        : e.fontFamily) +
                      n
                    : '',
                  r = e.strokeWidth ? 'stroke-width: ' + e.strokeWidth + n : '',
                  a = e.fontSize ? 'font-size: ' + e.fontSize + 'px' + n : '',
                  o = e.fontStyle ? 'font-style: ' + e.fontStyle + n : '',
                  l = e.fontWeight ? 'font-weight: ' + e.fontWeight + n : '',
                  c = e.fill ? t('fill', e.fill) : '',
                  h = e.stroke ? t('stroke', e.stroke) : '',
                  d = this.getSvgTextDecoration(e)
                return (
                  d && (d = 'text-decoration: ' + d + n),
                  [
                    h,
                    r,
                    s,
                    a,
                    o,
                    l,
                    d,
                    c,
                    e.deltaY ? 'baseline-shift: ' + -e.deltaY + '; ' : '',
                    i ? 'white-space: pre; ' : ''
                  ].join('')
                )
              },
              getSvgTextDecoration: function (t) {
                return ['overline', 'underline', 'line-through']
                  .filter(function (e) {
                    return t[e.replace('-', '')]
                  })
                  .join(' ')
              },
              getSvgFilter: function () {
                return this.shadow
                  ? 'filter: url(#SVGID_' + this.shadow.id + ');'
                  : ''
              },
              getSvgCommons: function () {
                return [
                  this.id ? 'id="' + this.id + '" ' : '',
                  this.clipPath
                    ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" '
                    : ''
                ].join('')
              },
              getSvgTransform: function (t, e) {
                var i = t ? this.calcTransformMatrix() : this.calcOwnMatrix()
                return 'transform="' + E.util.matrixToSVG(i) + (e || '') + '" '
              },
              _setSVGBg: function (t) {
                if (this.backgroundColor) {
                  var i = E.Object.NUM_FRACTION_DIGITS
                  t.push(
                    '\t\t<rect ',
                    this._getFillAttributes(this.backgroundColor),
                    ' x="',
                    e(-this.width / 2, i),
                    '" y="',
                    e(-this.height / 2, i),
                    '" width="',
                    e(this.width, i),
                    '" height="',
                    e(this.height, i),
                    '"></rect>\n'
                  )
                }
              },
              toSVG: function (t) {
                return this._createBaseSVGMarkup(this._toSVG(t), { reviver: t })
              },
              toClipPathSVG: function (t) {
                return (
                  '\t' +
                  this._createBaseClipPathSVGMarkup(this._toSVG(t), {
                    reviver: t
                  })
                )
              },
              _createBaseClipPathSVGMarkup: function (t, e) {
                var i = (e = e || {}).reviver,
                  n = e.additionalTransform || '',
                  s = [this.getSvgTransform(!0, n), this.getSvgCommons()].join(
                    ''
                  ),
                  r = t.indexOf('COMMON_PARTS')
                return (t[r] = s), i ? i(t.join('')) : t.join('')
              },
              _createBaseSVGMarkup: function (t, e) {
                var i,
                  n,
                  s = (e = e || {}).noStyle,
                  r = e.reviver,
                  a = s ? '' : 'style="' + this.getSvgStyles() + '" ',
                  o = e.withShadow
                    ? 'style="' + this.getSvgFilter() + '" '
                    : '',
                  l = this.clipPath,
                  c = this.strokeUniform
                    ? 'vector-effect="non-scaling-stroke" '
                    : '',
                  h = l && l.absolutePositioned,
                  d = this.stroke,
                  u = this.fill,
                  f = this.shadow,
                  p = [],
                  g = t.indexOf('COMMON_PARTS'),
                  m = e.additionalTransform
                return (
                  l &&
                    ((l.clipPathId = 'CLIPPATH_' + E.Object.__uid++),
                    (n =
                      '<clipPath id="' +
                      l.clipPathId +
                      '" >\n' +
                      l.toClipPathSVG(r) +
                      '</clipPath>\n')),
                  h && p.push('<g ', o, this.getSvgCommons(), ' >\n'),
                  p.push(
                    '<g ',
                    this.getSvgTransform(!1),
                    h ? '' : o + this.getSvgCommons(),
                    ' >\n'
                  ),
                  (i = [
                    a,
                    c,
                    s ? '' : this.addPaintOrder(),
                    ' ',
                    m ? 'transform="' + m + '" ' : ''
                  ].join('')),
                  (t[g] = i),
                  u && u.toLive && p.push(u.toSVG(this)),
                  d && d.toLive && p.push(d.toSVG(this)),
                  f && p.push(f.toSVG(this)),
                  l && p.push(n),
                  p.push(t.join('')),
                  p.push('</g>\n'),
                  h && p.push('</g>\n'),
                  r ? r(p.join('')) : p.join('')
                )
              },
              addPaintOrder: function () {
                return 'fill' !== this.paintFirst
                  ? ' paint-order="' + this.paintFirst + '" '
                  : ''
              }
            })
          })(),
          (function () {
            var t = E.util.object.extend,
              e = 'stateProperties'
            function i (e, i, n) {
              var s = {}
              n.forEach(function (t) {
                s[t] = e[t]
              }),
                t(e[i], s, !0)
            }
            function n (t, e, i) {
              if (t === e) return !0
              if (Array.isArray(t)) {
                if (!Array.isArray(e) || t.length !== e.length) return !1
                for (var s = 0, r = t.length; s < r; s++)
                  if (!n(t[s], e[s])) return !1
                return !0
              }
              if (t && 'object' == typeof t) {
                var a,
                  o = Object.keys(t)
                if (
                  !e ||
                  'object' != typeof e ||
                  (!i && o.length !== Object.keys(e).length)
                )
                  return !1
                for (s = 0, r = o.length; s < r; s++)
                  if (
                    'canvas' !== (a = o[s]) &&
                    'group' !== a &&
                    !n(t[a], e[a])
                  )
                    return !1
                return !0
              }
            }
            E.util.object.extend(E.Object.prototype, {
              hasStateChanged: function (t) {
                var i = '_' + (t = t || e)
                return (
                  Object.keys(this[i]).length < this[t].length ||
                  !n(this[i], this, !0)
                )
              },
              saveState: function (t) {
                var n = (t && t.propertySet) || e,
                  s = '_' + n
                return this[s]
                  ? (i(this, s, this[n]),
                    t && t.stateProperties && i(this, s, t.stateProperties),
                    this)
                  : this.setupState(t)
              },
              setupState: function (t) {
                var i = (t = t || {}).propertySet || e
                return (
                  (t.propertySet = i),
                  (this['_' + i] = {}),
                  this.saveState(t),
                  this
                )
              }
            })
          })(),
          (function () {
            var t = E.util.degreesToRadians
            E.util.object.extend(E.Object.prototype, {
              _findTargetCorner: function (t, e) {
                if (
                  !this.hasControls ||
                  this.group ||
                  !this.canvas ||
                  this.canvas._activeObject !== this
                )
                  return !1
                var i,
                  n,
                  s,
                  r = t.x,
                  a = t.y,
                  o = Object.keys(this.oCoords),
                  l = o.length - 1
                for (this.__corner = 0; l >= 0; l--)
                  if (
                    ((s = o[l]),
                    this.isControlVisible(s) &&
                      ((n = this._getImageLines(
                        e ? this.oCoords[s].touchCorner : this.oCoords[s].corner
                      )),
                      0 !== (i = this._findCrossPoints({ x: r, y: a }, n)) &&
                        i % 2 == 1))
                  )
                    return (this.__corner = s), s
                return !1
              },
              forEachControl: function (t) {
                for (var e in this.controls) t(this.controls[e], e, this)
              },
              _setCornerCoords: function () {
                var t = this.oCoords
                for (var e in t) {
                  var i = this.controls[e]
                  ;(t[e].corner = i.calcCornerCoords(
                    this.angle,
                    this.cornerSize,
                    t[e].x,
                    t[e].y,
                    !1
                  )),
                    (t[e].touchCorner = i.calcCornerCoords(
                      this.angle,
                      this.touchCornerSize,
                      t[e].x,
                      t[e].y,
                      !0
                    ))
                }
              },
              drawSelectionBackground: function (e) {
                if (
                  !this.selectionBackgroundColor ||
                  (this.canvas && !this.canvas.interactive) ||
                  (this.canvas && this.canvas._activeObject !== this)
                )
                  return this
                e.save()
                var i = this.getCenterPoint(),
                  n = this._calculateCurrentDimensions(),
                  s = this.canvas.viewportTransform
                return (
                  e.translate(i.x, i.y),
                  e.scale(1 / s[0], 1 / s[3]),
                  e.rotate(t(this.angle)),
                  (e.fillStyle = this.selectionBackgroundColor),
                  e.fillRect(-n.x / 2, -n.y / 2, n.x, n.y),
                  e.restore(),
                  this
                )
              },
              drawBorders: function (t, e) {
                e = e || {}
                var i = this._calculateCurrentDimensions(),
                  n = this.borderScaleFactor,
                  s = i.x + n,
                  r = i.y + n,
                  a =
                    void 0 !== e.hasControls ? e.hasControls : this.hasControls,
                  o = !1
                return (
                  t.save(),
                  (t.strokeStyle = e.borderColor || this.borderColor),
                  this._setLineDash(
                    t,
                    e.borderDashArray || this.borderDashArray
                  ),
                  t.strokeRect(-s / 2, -r / 2, s, r),
                  a &&
                    (t.beginPath(),
                    this.forEachControl(function (e, i, n) {
                      e.withConnection &&
                        e.getVisibility(n, i) &&
                        ((o = !0),
                        t.moveTo(e.x * s, e.y * r),
                        t.lineTo(e.x * s + e.offsetX, e.y * r + e.offsetY))
                    }),
                    o && t.stroke()),
                  t.restore(),
                  this
                )
              },
              drawBordersInGroup: function (t, e, i) {
                i = i || {}
                var n = E.util.sizeAfterTransform(this.width, this.height, e),
                  s = this.strokeWidth,
                  r = this.strokeUniform,
                  a = this.borderScaleFactor,
                  o = n.x + s * (r ? this.canvas.getZoom() : e.scaleX) + a,
                  l = n.y + s * (r ? this.canvas.getZoom() : e.scaleY) + a
                return (
                  t.save(),
                  this._setLineDash(
                    t,
                    i.borderDashArray || this.borderDashArray
                  ),
                  (t.strokeStyle = i.borderColor || this.borderColor),
                  t.strokeRect(-o / 2, -l / 2, o, l),
                  t.restore(),
                  this
                )
              },
              drawControls: function (t, e) {
                ;(e = e || {}), t.save()
                var i,
                  n,
                  s = this.canvas.getRetinaScaling()
                return (
                  t.setTransform(s, 0, 0, s, 0, 0),
                  (t.strokeStyle = t.fillStyle =
                    e.cornerColor || this.cornerColor),
                  this.transparentCorners ||
                    (t.strokeStyle =
                      e.cornerStrokeColor || this.cornerStrokeColor),
                  this._setLineDash(
                    t,
                    e.cornerDashArray || this.cornerDashArray
                  ),
                  this.setCoords(),
                  this.group && (i = this.group.calcTransformMatrix()),
                  this.forEachControl(function (s, r, a) {
                    ;(n = a.oCoords[r]),
                      s.getVisibility(a, r) &&
                        (i && (n = E.util.transformPoint(n, i)),
                        s.render(t, n.x, n.y, e, a))
                  }),
                  t.restore(),
                  this
                )
              },
              isControlVisible: function (t) {
                return (
                  this.controls[t] && this.controls[t].getVisibility(this, t)
                )
              },
              setControlVisible: function (t, e) {
                return (
                  this._controlsVisibility || (this._controlsVisibility = {}),
                  (this._controlsVisibility[t] = e),
                  this
                )
              },
              setControlsVisibility: function (t) {
                for (var e in (t || (t = {}), t))
                  this.setControlVisible(e, t[e])
                return this
              },
              onDeselect: function () {},
              onSelect: function () {}
            })
          })(),
          E.util.object.extend(E.StaticCanvas.prototype, {
            FX_DURATION: 500,
            fxCenterObjectH: function (t, e) {
              var i = function () {},
                n = (e = e || {}).onComplete || i,
                s = e.onChange || i,
                r = this
              return E.util.animate({
                target: this,
                startValue: t.left,
                endValue: this.getCenterPoint().x,
                duration: this.FX_DURATION,
                onChange: function (e) {
                  t.set('left', e), r.requestRenderAll(), s()
                },
                onComplete: function () {
                  t.setCoords(), n()
                }
              })
            },
            fxCenterObjectV: function (t, e) {
              var i = function () {},
                n = (e = e || {}).onComplete || i,
                s = e.onChange || i,
                r = this
              return E.util.animate({
                target: this,
                startValue: t.top,
                endValue: this.getCenterPoint().y,
                duration: this.FX_DURATION,
                onChange: function (e) {
                  t.set('top', e), r.requestRenderAll(), s()
                },
                onComplete: function () {
                  t.setCoords(), n()
                }
              })
            },
            fxRemove: function (t, e) {
              var i = function () {},
                n = (e = e || {}).onComplete || i,
                s = e.onChange || i,
                r = this
              return E.util.animate({
                target: this,
                startValue: t.opacity,
                endValue: 0,
                duration: this.FX_DURATION,
                onChange: function (e) {
                  t.set('opacity', e), r.requestRenderAll(), s()
                },
                onComplete: function () {
                  r.remove(t), n()
                }
              })
            }
          }),
          E.util.object.extend(E.Object.prototype, {
            animate: function () {
              if (arguments[0] && 'object' == typeof arguments[0]) {
                var t,
                  e,
                  i = [],
                  n = []
                for (t in arguments[0]) i.push(t)
                for (var s = 0, r = i.length; s < r; s++)
                  (t = i[s]),
                    (e = s !== r - 1),
                    n.push(this._animate(t, arguments[0][t], arguments[1], e))
                return n
              }
              return this._animate.apply(this, arguments)
            },
            _animate: function (t, e, i, n) {
              var s,
                r = this
              ;(e = e.toString()),
                (i = i ? E.util.object.clone(i) : {}),
                ~t.indexOf('.') && (s = t.split('.'))
              var a =
                  r.colorProperties.indexOf(t) > -1 ||
                  (s && r.colorProperties.indexOf(s[1]) > -1),
                o = s ? this.get(s[0])[s[1]] : this.get(t)
              'from' in i || (i.from = o),
                a ||
                  (e = ~e.indexOf('=')
                    ? o + parseFloat(e.replace('=', ''))
                    : parseFloat(e))
              var l = {
                target: this,
                startValue: i.from,
                endValue: e,
                byValue: i.by,
                easing: i.easing,
                duration: i.duration,
                abort:
                  i.abort &&
                  function (t, e, n) {
                    return i.abort.call(r, t, e, n)
                  },
                onChange: function (e, a, o) {
                  s ? (r[s[0]][s[1]] = e) : r.set(t, e),
                    n || (i.onChange && i.onChange(e, a, o))
                },
                onComplete: function (t, e, s) {
                  n || (r.setCoords(), i.onComplete && i.onComplete(t, e, s))
                }
              }
              return a
                ? E.util.animateColor(l.startValue, l.endValue, l.duration, l)
                : E.util.animate(l)
            }
          }),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend,
              n = e.util.object.clone,
              s = { x1: 1, x2: 1, y1: 1, y2: 1 }
            function r (t, e) {
              var i = t.origin,
                n = t.axis1,
                s = t.axis2,
                r = t.dimension,
                a = e.nearest,
                o = e.center,
                l = e.farthest
              return function () {
                switch (this.get(i)) {
                  case a:
                    return Math.min(this.get(n), this.get(s))
                  case o:
                    return (
                      Math.min(this.get(n), this.get(s)) + 0.5 * this.get(r)
                    )
                  case l:
                    return Math.max(this.get(n), this.get(s))
                }
              }
            }
            e.Line
              ? e.warn('fabric.Line is already defined')
              : ((e.Line = e.util.createClass(e.Object, {
                  type: 'line',
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 0,
                  cacheProperties: e.Object.prototype.cacheProperties.concat(
                    'x1',
                    'x2',
                    'y1',
                    'y2'
                  ),
                  initialize: function (t, e) {
                    t || (t = [0, 0, 0, 0]),
                      this.callSuper('initialize', e),
                      this.set('x1', t[0]),
                      this.set('y1', t[1]),
                      this.set('x2', t[2]),
                      this.set('y2', t[3]),
                      this._setWidthHeight(e)
                  },
                  _setWidthHeight: function (t) {
                    t || (t = {}),
                      (this.width = Math.abs(this.x2 - this.x1)),
                      (this.height = Math.abs(this.y2 - this.y1)),
                      (this.left =
                        'left' in t ? t.left : this._getLeftToOriginX()),
                      (this.top = 'top' in t ? t.top : this._getTopToOriginY())
                  },
                  _set: function (t, e) {
                    return (
                      this.callSuper('_set', t, e),
                      void 0 !== s[t] && this._setWidthHeight(),
                      this
                    )
                  },
                  _getLeftToOriginX: r(
                    {
                      origin: 'originX',
                      axis1: 'x1',
                      axis2: 'x2',
                      dimension: 'width'
                    },
                    { nearest: 'left', center: 'center', farthest: 'right' }
                  ),
                  _getTopToOriginY: r(
                    {
                      origin: 'originY',
                      axis1: 'y1',
                      axis2: 'y2',
                      dimension: 'height'
                    },
                    { nearest: 'top', center: 'center', farthest: 'bottom' }
                  ),
                  _render: function (t) {
                    t.beginPath()
                    var e = this.calcLinePoints()
                    t.moveTo(e.x1, e.y1),
                      t.lineTo(e.x2, e.y2),
                      (t.lineWidth = this.strokeWidth)
                    var i = t.strokeStyle
                    ;(t.strokeStyle = this.stroke || t.fillStyle),
                      this.stroke && this._renderStroke(t),
                      (t.strokeStyle = i)
                  },
                  _findCenterFromElement: function () {
                    return {
                      x: (this.x1 + this.x2) / 2,
                      y: (this.y1 + this.y2) / 2
                    }
                  },
                  toObject: function (t) {
                    return i(
                      this.callSuper('toObject', t),
                      this.calcLinePoints()
                    )
                  },
                  _getNonTransformedDimensions: function () {
                    var t = this.callSuper('_getNonTransformedDimensions')
                    return (
                      'butt' === this.strokeLineCap &&
                        (0 === this.width && (t.y -= this.strokeWidth),
                        0 === this.height && (t.x -= this.strokeWidth)),
                      t
                    )
                  },
                  calcLinePoints: function () {
                    var t = this.x1 <= this.x2 ? -1 : 1,
                      e = this.y1 <= this.y2 ? -1 : 1,
                      i = t * this.width * 0.5,
                      n = e * this.height * 0.5
                    return {
                      x1: i,
                      x2: t * this.width * -0.5,
                      y1: n,
                      y2: e * this.height * -0.5
                    }
                  },
                  _toSVG: function () {
                    var t = this.calcLinePoints()
                    return [
                      '<line ',
                      'COMMON_PARTS',
                      'x1="',
                      t.x1,
                      '" y1="',
                      t.y1,
                      '" x2="',
                      t.x2,
                      '" y2="',
                      t.y2,
                      '" />\n'
                    ]
                  }
                })),
                (e.Line.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
                  'x1 y1 x2 y2'.split(' ')
                )),
                (e.Line.fromElement = function (t, n, s) {
                  s = s || {}
                  var r = e.parseAttributes(t, e.Line.ATTRIBUTE_NAMES),
                    a = [r.x1 || 0, r.y1 || 0, r.x2 || 0, r.y2 || 0]
                  n(new e.Line(a, i(r, s)))
                }),
                (e.Line.fromObject = function (t, i) {
                  var s = n(t, !0)
                  ;(s.points = [t.x1, t.y1, t.x2, t.y2]),
                    e.Object._fromObject(
                      'Line',
                      s,
                      function (t) {
                        delete t.points, i && i(t)
                      },
                      'points'
                    )
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.degreesToRadians
            e.Circle
              ? e.warn('fabric.Circle is already defined.')
              : ((e.Circle = e.util.createClass(e.Object, {
                  type: 'circle',
                  radius: 0,
                  startAngle: 0,
                  endAngle: 360,
                  cacheProperties: e.Object.prototype.cacheProperties.concat(
                    'radius',
                    'startAngle',
                    'endAngle'
                  ),
                  _set: function (t, e) {
                    return (
                      this.callSuper('_set', t, e),
                      'radius' === t && this.setRadius(e),
                      this
                    )
                  },
                  toObject: function (t) {
                    return this.callSuper(
                      'toObject',
                      ['radius', 'startAngle', 'endAngle'].concat(t)
                    )
                  },
                  _toSVG: function () {
                    var t,
                      n = (this.endAngle - this.startAngle) % 360
                    if (0 === n)
                      t = [
                        '<circle ',
                        'COMMON_PARTS',
                        'cx="0" cy="0" ',
                        'r="',
                        this.radius,
                        '" />\n'
                      ]
                    else {
                      var s = i(this.startAngle),
                        r = i(this.endAngle),
                        a = this.radius
                      t = [
                        '<path d="M ' +
                          e.util.cos(s) * a +
                          ' ' +
                          e.util.sin(s) * a,
                        ' A ' + a + ' ' + a,
                        ' 0 ',
                        +(n > 180 ? '1' : '0') + ' 1',
                        ' ' + e.util.cos(r) * a + ' ' + e.util.sin(r) * a,
                        '" ',
                        'COMMON_PARTS',
                        ' />\n'
                      ]
                    }
                    return t
                  },
                  _render: function (t) {
                    t.beginPath(),
                      t.arc(
                        0,
                        0,
                        this.radius,
                        i(this.startAngle),
                        i(this.endAngle),
                        !1
                      ),
                      this._renderPaintInOrder(t)
                  },
                  getRadiusX: function () {
                    return this.get('radius') * this.get('scaleX')
                  },
                  getRadiusY: function () {
                    return this.get('radius') * this.get('scaleY')
                  },
                  setRadius: function (t) {
                    return (
                      (this.radius = t),
                      this.set('width', 2 * t).set('height', 2 * t)
                    )
                  }
                })),
                (e.Circle.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
                  'cx cy r'.split(' ')
                )),
                (e.Circle.fromElement = function (t, i) {
                  var n,
                    s = e.parseAttributes(t, e.Circle.ATTRIBUTE_NAMES)
                  if (!('radius' in (n = s) && n.radius >= 0))
                    throw new Error(
                      'value of `r` attribute is required and can not be negative'
                    )
                  ;(s.left = (s.left || 0) - s.radius),
                    (s.top = (s.top || 0) - s.radius),
                    i(new e.Circle(s))
                }),
                (e.Circle.fromObject = function (t, i) {
                  e.Object._fromObject('Circle', t, i)
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {})
            e.Triangle
              ? e.warn('fabric.Triangle is already defined')
              : ((e.Triangle = e.util.createClass(e.Object, {
                  type: 'triangle',
                  width: 100,
                  height: 100,
                  _render: function (t) {
                    var e = this.width / 2,
                      i = this.height / 2
                    t.beginPath(),
                      t.moveTo(-e, i),
                      t.lineTo(0, -i),
                      t.lineTo(e, i),
                      t.closePath(),
                      this._renderPaintInOrder(t)
                  },
                  _toSVG: function () {
                    var t = this.width / 2,
                      e = this.height / 2
                    return [
                      '<polygon ',
                      'COMMON_PARTS',
                      'points="',
                      [-t + ' ' + e, '0 ' + -e, t + ' ' + e].join(','),
                      '" />'
                    ]
                  }
                })),
                (e.Triangle.fromObject = function (t, i) {
                  return e.Object._fromObject('Triangle', t, i)
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = 2 * Math.PI
            e.Ellipse
              ? e.warn('fabric.Ellipse is already defined.')
              : ((e.Ellipse = e.util.createClass(e.Object, {
                  type: 'ellipse',
                  rx: 0,
                  ry: 0,
                  cacheProperties: e.Object.prototype.cacheProperties.concat(
                    'rx',
                    'ry'
                  ),
                  initialize: function (t) {
                    this.callSuper('initialize', t),
                      this.set('rx', (t && t.rx) || 0),
                      this.set('ry', (t && t.ry) || 0)
                  },
                  _set: function (t, e) {
                    switch ((this.callSuper('_set', t, e), t)) {
                      case 'rx':
                        ;(this.rx = e), this.set('width', 2 * e)
                        break
                      case 'ry':
                        ;(this.ry = e), this.set('height', 2 * e)
                    }
                    return this
                  },
                  getRx: function () {
                    return this.get('rx') * this.get('scaleX')
                  },
                  getRy: function () {
                    return this.get('ry') * this.get('scaleY')
                  },
                  toObject: function (t) {
                    return this.callSuper('toObject', ['rx', 'ry'].concat(t))
                  },
                  _toSVG: function () {
                    return [
                      '<ellipse ',
                      'COMMON_PARTS',
                      'cx="0" cy="0" ',
                      'rx="',
                      this.rx,
                      '" ry="',
                      this.ry,
                      '" />\n'
                    ]
                  },
                  _render: function (t) {
                    t.beginPath(),
                      t.save(),
                      t.transform(1, 0, 0, this.ry / this.rx, 0, 0),
                      t.arc(0, 0, this.rx, 0, i, !1),
                      t.restore(),
                      this._renderPaintInOrder(t)
                  }
                })),
                (e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
                  'cx cy rx ry'.split(' ')
                )),
                (e.Ellipse.fromElement = function (t, i) {
                  var n = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES)
                  ;(n.left = (n.left || 0) - n.rx),
                    (n.top = (n.top || 0) - n.ry),
                    i(new e.Ellipse(n))
                }),
                (e.Ellipse.fromObject = function (t, i) {
                  e.Object._fromObject('Ellipse', t, i)
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend
            e.Rect
              ? e.warn('fabric.Rect is already defined')
              : ((e.Rect = e.util.createClass(e.Object, {
                  stateProperties: e.Object.prototype.stateProperties.concat(
                    'rx',
                    'ry'
                  ),
                  type: 'rect',
                  rx: 0,
                  ry: 0,
                  cacheProperties: e.Object.prototype.cacheProperties.concat(
                    'rx',
                    'ry'
                  ),
                  initialize: function (t) {
                    this.callSuper('initialize', t), this._initRxRy()
                  },
                  _initRxRy: function () {
                    this.rx && !this.ry
                      ? (this.ry = this.rx)
                      : this.ry && !this.rx && (this.rx = this.ry)
                  },
                  _render: function (t) {
                    var e = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                      i = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                      n = this.width,
                      s = this.height,
                      r = -this.width / 2,
                      a = -this.height / 2,
                      o = 0 !== e || 0 !== i,
                      l = 0.4477152502
                    t.beginPath(),
                      t.moveTo(r + e, a),
                      t.lineTo(r + n - e, a),
                      o &&
                        t.bezierCurveTo(
                          r + n - l * e,
                          a,
                          r + n,
                          a + l * i,
                          r + n,
                          a + i
                        ),
                      t.lineTo(r + n, a + s - i),
                      o &&
                        t.bezierCurveTo(
                          r + n,
                          a + s - l * i,
                          r + n - l * e,
                          a + s,
                          r + n - e,
                          a + s
                        ),
                      t.lineTo(r + e, a + s),
                      o &&
                        t.bezierCurveTo(
                          r + l * e,
                          a + s,
                          r,
                          a + s - l * i,
                          r,
                          a + s - i
                        ),
                      t.lineTo(r, a + i),
                      o &&
                        t.bezierCurveTo(r, a + l * i, r + l * e, a, r + e, a),
                      t.closePath(),
                      this._renderPaintInOrder(t)
                  },
                  toObject: function (t) {
                    return this.callSuper('toObject', ['rx', 'ry'].concat(t))
                  },
                  _toSVG: function () {
                    return [
                      '<rect ',
                      'COMMON_PARTS',
                      'x="',
                      -this.width / 2,
                      '" y="',
                      -this.height / 2,
                      '" rx="',
                      this.rx,
                      '" ry="',
                      this.ry,
                      '" width="',
                      this.width,
                      '" height="',
                      this.height,
                      '" />\n'
                    ]
                  }
                })),
                (e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
                  'x y rx ry width height'.split(' ')
                )),
                (e.Rect.fromElement = function (t, n, s) {
                  if (!t) return n(null)
                  s = s || {}
                  var r = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES)
                  ;(r.left = r.left || 0),
                    (r.top = r.top || 0),
                    (r.height = r.height || 0),
                    (r.width = r.width || 0)
                  var a = new e.Rect(i(s ? e.util.object.clone(s) : {}, r))
                  ;(a.visible = a.visible && a.width > 0 && a.height > 0), n(a)
                }),
                (e.Rect.fromObject = function (t, i) {
                  return e.Object._fromObject('Rect', t, i)
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend,
              n = e.util.array.min,
              s = e.util.array.max,
              r = e.util.toFixed,
              a = e.util.projectStrokeOnPoints
            e.Polyline
              ? e.warn('fabric.Polyline is already defined')
              : ((e.Polyline = e.util.createClass(e.Object, {
                  type: 'polyline',
                  points: null,
                  exactBoundingBox: !1,
                  cacheProperties:
                    e.Object.prototype.cacheProperties.concat('points'),
                  initialize: function (t, e) {
                    ;(e = e || {}),
                      (this.points = t || []),
                      this.callSuper('initialize', e),
                      this._setPositionDimensions(e)
                  },
                  _projectStrokeOnPoints: function () {
                    return a(this.points, this, !0)
                  },
                  _setPositionDimensions: function (t) {
                    var e,
                      i = this._calcDimensions(t),
                      n = this.exactBoundingBox ? this.strokeWidth : 0
                    ;(this.width = i.width - n),
                      (this.height = i.height - n),
                      t.fromSVG ||
                        (e = this.translateToGivenOrigin(
                          {
                            x: i.left - this.strokeWidth / 2 + n / 2,
                            y: i.top - this.strokeWidth / 2 + n / 2
                          },
                          'left',
                          'top',
                          this.originX,
                          this.originY
                        )),
                      void 0 === t.left &&
                        (this.left = t.fromSVG ? i.left : e.x),
                      void 0 === t.top && (this.top = t.fromSVG ? i.top : e.y),
                      (this.pathOffset = {
                        x: i.left + this.width / 2 + n / 2,
                        y: i.top + this.height / 2 + n / 2
                      })
                  },
                  _calcDimensions: function () {
                    var t = this.exactBoundingBox
                        ? this._projectStrokeOnPoints()
                        : this.points,
                      e = n(t, 'x') || 0,
                      i = n(t, 'y') || 0
                    return {
                      left: e,
                      top: i,
                      width: (s(t, 'x') || 0) - e,
                      height: (s(t, 'y') || 0) - i
                    }
                  },
                  toObject: function (t) {
                    return i(this.callSuper('toObject', t), {
                      points: this.points.concat()
                    })
                  },
                  _toSVG: function () {
                    for (
                      var t = [],
                        i = this.pathOffset.x,
                        n = this.pathOffset.y,
                        s = e.Object.NUM_FRACTION_DIGITS,
                        a = 0,
                        o = this.points.length;
                      a < o;
                      a++
                    )
                      t.push(
                        r(this.points[a].x - i, s),
                        ',',
                        r(this.points[a].y - n, s),
                        ' '
                      )
                    return [
                      '<' + this.type + ' ',
                      'COMMON_PARTS',
                      'points="',
                      t.join(''),
                      '" />\n'
                    ]
                  },
                  commonRender: function (t) {
                    var e,
                      i = this.points.length,
                      n = this.pathOffset.x,
                      s = this.pathOffset.y
                    if (!i || isNaN(this.points[i - 1].y)) return !1
                    t.beginPath(),
                      t.moveTo(this.points[0].x - n, this.points[0].y - s)
                    for (var r = 0; r < i; r++)
                      (e = this.points[r]), t.lineTo(e.x - n, e.y - s)
                    return !0
                  },
                  _render: function (t) {
                    this.commonRender(t) && this._renderPaintInOrder(t)
                  },
                  complexity: function () {
                    return this.get('points').length
                  }
                })),
                (e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat()),
                (e.Polyline.fromElementGenerator = function (t) {
                  return function (n, s, r) {
                    if (!n) return s(null)
                    r || (r = {})
                    var a = e.parsePointsAttribute(n.getAttribute('points')),
                      o = e.parseAttributes(n, e[t].ATTRIBUTE_NAMES)
                    ;(o.fromSVG = !0), s(new e[t](a, i(o, r)))
                  }
                }),
                (e.Polyline.fromElement =
                  e.Polyline.fromElementGenerator('Polyline')),
                (e.Polyline.fromObject = function (t, i) {
                  return e.Object._fromObject('Polyline', t, i, 'points')
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.projectStrokeOnPoints
            e.Polygon
              ? e.warn('fabric.Polygon is already defined')
              : ((e.Polygon = e.util.createClass(e.Polyline, {
                  type: 'polygon',
                  _projectStrokeOnPoints: function () {
                    return i(this.points, this)
                  },
                  _render: function (t) {
                    this.commonRender(t) &&
                      (t.closePath(), this._renderPaintInOrder(t))
                  }
                })),
                (e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat()),
                (e.Polygon.fromElement =
                  e.Polyline.fromElementGenerator('Polygon')),
                (e.Polygon.fromObject = function (t, i) {
                  e.Object._fromObject('Polygon', t, i, 'points')
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.array.min,
              n = e.util.array.max,
              s = e.util.object.extend,
              r = e.util.object.clone,
              a = e.util.toFixed
            e.Path
              ? e.warn('fabric.Path is already defined')
              : ((e.Path = e.util.createClass(e.Object, {
                  type: 'path',
                  path: null,
                  cacheProperties: e.Object.prototype.cacheProperties.concat(
                    'path',
                    'fillRule'
                  ),
                  stateProperties:
                    e.Object.prototype.stateProperties.concat('path'),
                  initialize: function (t, e) {
                    delete (e = r(e || {})).path,
                      this.callSuper('initialize', e),
                      this._setPath(t || [], e)
                  },
                  _setPath: function (t, i) {
                    ;(this.path = e.util.makePathSimpler(
                      Array.isArray(t) ? t : e.util.parsePath(t)
                    )),
                      e.Polyline.prototype._setPositionDimensions.call(
                        this,
                        i || {}
                      )
                  },
                  _renderPathCommands: function (t) {
                    var e,
                      i = 0,
                      n = 0,
                      s = 0,
                      r = 0,
                      a = 0,
                      o = 0,
                      l = -this.pathOffset.x,
                      c = -this.pathOffset.y
                    t.beginPath()
                    for (var h = 0, d = this.path.length; h < d; ++h)
                      switch ((e = this.path[h])[0]) {
                        case 'L':
                          ;(s = e[1]), (r = e[2]), t.lineTo(s + l, r + c)
                          break
                        case 'M':
                          ;(i = s = e[1]),
                            (n = r = e[2]),
                            t.moveTo(s + l, r + c)
                          break
                        case 'C':
                          ;(s = e[5]),
                            (r = e[6]),
                            (a = e[3]),
                            (o = e[4]),
                            t.bezierCurveTo(
                              e[1] + l,
                              e[2] + c,
                              a + l,
                              o + c,
                              s + l,
                              r + c
                            )
                          break
                        case 'Q':
                          t.quadraticCurveTo(
                            e[1] + l,
                            e[2] + c,
                            e[3] + l,
                            e[4] + c
                          ),
                            (s = e[3]),
                            (r = e[4]),
                            (a = e[1]),
                            (o = e[2])
                          break
                        case 'z':
                        case 'Z':
                          ;(s = i), (r = n), t.closePath()
                      }
                  },
                  _render: function (t) {
                    this._renderPathCommands(t), this._renderPaintInOrder(t)
                  },
                  toString: function () {
                    return (
                      '#<fabric.Path (' +
                      this.complexity() +
                      '): { "top": ' +
                      this.top +
                      ', "left": ' +
                      this.left +
                      ' }>'
                    )
                  },
                  toObject: function (t) {
                    return s(this.callSuper('toObject', t), {
                      path: this.path.map(function (t) {
                        return t.slice()
                      })
                    })
                  },
                  toDatalessObject: function (t) {
                    var e = this.toObject(['sourcePath'].concat(t))
                    return e.sourcePath && delete e.path, e
                  },
                  _toSVG: function () {
                    return [
                      '<path ',
                      'COMMON_PARTS',
                      'd="',
                      e.util.joinPath(this.path),
                      '" stroke-linecap="round" ',
                      '/>\n'
                    ]
                  },
                  _getOffsetTransform: function () {
                    var t = e.Object.NUM_FRACTION_DIGITS
                    return (
                      ' translate(' +
                      a(-this.pathOffset.x, t) +
                      ', ' +
                      a(-this.pathOffset.y, t) +
                      ')'
                    )
                  },
                  toClipPathSVG: function (t) {
                    var e = this._getOffsetTransform()
                    return (
                      '\t' +
                      this._createBaseClipPathSVGMarkup(this._toSVG(), {
                        reviver: t,
                        additionalTransform: e
                      })
                    )
                  },
                  toSVG: function (t) {
                    var e = this._getOffsetTransform()
                    return this._createBaseSVGMarkup(this._toSVG(), {
                      reviver: t,
                      additionalTransform: e
                    })
                  },
                  complexity: function () {
                    return this.path.length
                  },
                  _calcDimensions: function () {
                    for (
                      var t,
                        s,
                        r = [],
                        a = [],
                        o = 0,
                        l = 0,
                        c = 0,
                        h = 0,
                        d = 0,
                        u = this.path.length;
                      d < u;
                      ++d
                    ) {
                      switch ((t = this.path[d])[0]) {
                        case 'L':
                          ;(c = t[1]), (h = t[2]), (s = [])
                          break
                        case 'M':
                          ;(o = c = t[1]), (l = h = t[2]), (s = [])
                          break
                        case 'C':
                          ;(s = e.util.getBoundsOfCurve(
                            c,
                            h,
                            t[1],
                            t[2],
                            t[3],
                            t[4],
                            t[5],
                            t[6]
                          )),
                            (c = t[5]),
                            (h = t[6])
                          break
                        case 'Q':
                          ;(s = e.util.getBoundsOfCurve(
                            c,
                            h,
                            t[1],
                            t[2],
                            t[1],
                            t[2],
                            t[3],
                            t[4]
                          )),
                            (c = t[3]),
                            (h = t[4])
                          break
                        case 'z':
                        case 'Z':
                          ;(c = o), (h = l)
                      }
                      s.forEach(function (t) {
                        r.push(t.x), a.push(t.y)
                      }),
                        r.push(c),
                        a.push(h)
                    }
                    var f = i(r) || 0,
                      p = i(a) || 0
                    return {
                      left: f,
                      top: p,
                      width: (n(r) || 0) - f,
                      height: (n(a) || 0) - p
                    }
                  }
                })),
                (e.Path.fromObject = function (t, i) {
                  if ('string' == typeof t.sourcePath) {
                    var n = t.sourcePath
                    e.loadSVGFromURL(n, function (n) {
                      var s = n[0]
                      s.setOptions(t),
                        t.clipPath
                          ? e.util.enlivenObjects([t.clipPath], function (t) {
                              ;(s.clipPath = t[0]), i && i(s)
                            })
                          : i && i(s)
                    })
                  } else e.Object._fromObject('Path', t, i, 'path')
                }),
                (e.Path.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(['d'])),
                (e.Path.fromElement = function (t, i, n) {
                  var r = e.parseAttributes(t, e.Path.ATTRIBUTE_NAMES)
                  ;(r.fromSVG = !0), i(new e.Path(r.d, s(r, n)))
                }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.array.min,
              n = e.util.array.max
            e.Group ||
              ((e.Group = e.util.createClass(e.Object, e.Collection, {
                type: 'group',
                strokeWidth: 0,
                subTargetCheck: !1,
                cacheProperties: [],
                useSetOnGroup: !1,
                initialize: function (t, e, i) {
                  ;(e = e || {}),
                    (this._objects = []),
                    i && this.callSuper('initialize', e),
                    (this._objects = t || [])
                  for (var n = this._objects.length; n--; )
                    this._objects[n].group = this
                  if (i) this._updateObjectsACoords()
                  else {
                    var s = e && e.centerPoint
                    void 0 !== e.originX && (this.originX = e.originX),
                      void 0 !== e.originY && (this.originY = e.originY),
                      s || this._calcBounds(),
                      this._updateObjectsCoords(s),
                      delete e.centerPoint,
                      this.callSuper('initialize', e)
                  }
                  this.setCoords()
                },
                _updateObjectsACoords: function () {
                  for (var t = this._objects.length; t--; )
                    this._objects[t].setCoords(!0)
                },
                _updateObjectsCoords: function (t) {
                  t = t || this.getCenterPoint()
                  for (var e = this._objects.length; e--; )
                    this._updateObjectCoords(this._objects[e], t)
                },
                _updateObjectCoords: function (t, e) {
                  var i = t.left,
                    n = t.top
                  t.set({ left: i - e.x, top: n - e.y }),
                    (t.group = this),
                    t.setCoords(!0)
                },
                toString: function () {
                  return '#<fabric.Group: (' + this.complexity() + ')>'
                },
                addWithUpdate: function (t) {
                  var i = !!this.group
                  return (
                    this._restoreObjectsState(),
                    e.util.resetObjectTransform(this),
                    t &&
                      (i &&
                        e.util.removeTransformFromObject(
                          t,
                          this.group.calcTransformMatrix()
                        ),
                      this._objects.push(t),
                      (t.group = this),
                      t._set('canvas', this.canvas)),
                    this._calcBounds(),
                    this._updateObjectsCoords(),
                    (this.dirty = !0),
                    i ? this.group.addWithUpdate() : this.setCoords(),
                    this
                  )
                },
                removeWithUpdate: function (t) {
                  return (
                    this._restoreObjectsState(),
                    e.util.resetObjectTransform(this),
                    this.remove(t),
                    this._calcBounds(),
                    this._updateObjectsCoords(),
                    this.setCoords(),
                    (this.dirty = !0),
                    this
                  )
                },
                _onObjectAdded: function (t) {
                  ;(this.dirty = !0),
                    (t.group = this),
                    t._set('canvas', this.canvas)
                },
                _onObjectRemoved: function (t) {
                  ;(this.dirty = !0), delete t.group
                },
                _set: function (t, i) {
                  var n = this._objects.length
                  if (this.useSetOnGroup)
                    for (; n--; ) this._objects[n].setOnGroup(t, i)
                  if ('canvas' === t) for (; n--; ) this._objects[n]._set(t, i)
                  e.Object.prototype._set.call(this, t, i)
                },
                toObject: function (t) {
                  var i = this.includeDefaultValues,
                    n = this._objects
                      .filter(function (t) {
                        return !t.excludeFromExport
                      })
                      .map(function (e) {
                        var n = e.includeDefaultValues
                        e.includeDefaultValues = i
                        var s = e.toObject(t)
                        return (e.includeDefaultValues = n), s
                      }),
                    s = e.Object.prototype.toObject.call(this, t)
                  return (s.objects = n), s
                },
                toDatalessObject: function (t) {
                  var i,
                    n = this.sourcePath
                  if (n) i = n
                  else {
                    var s = this.includeDefaultValues
                    i = this._objects.map(function (e) {
                      var i = e.includeDefaultValues
                      e.includeDefaultValues = s
                      var n = e.toDatalessObject(t)
                      return (e.includeDefaultValues = i), n
                    })
                  }
                  var r = e.Object.prototype.toDatalessObject.call(this, t)
                  return (r.objects = i), r
                },
                render: function (t) {
                  ;(this._transformDone = !0),
                    this.callSuper('render', t),
                    (this._transformDone = !1)
                },
                shouldCache: function () {
                  var t = e.Object.prototype.shouldCache.call(this)
                  if (t)
                    for (var i = 0, n = this._objects.length; i < n; i++)
                      if (this._objects[i].willDrawShadow())
                        return (this.ownCaching = !1), !1
                  return t
                },
                willDrawShadow: function () {
                  if (e.Object.prototype.willDrawShadow.call(this)) return !0
                  for (var t = 0, i = this._objects.length; t < i; t++)
                    if (this._objects[t].willDrawShadow()) return !0
                  return !1
                },
                isOnACache: function () {
                  return (
                    this.ownCaching || (this.group && this.group.isOnACache())
                  )
                },
                drawObject: function (t) {
                  for (var e = 0, i = this._objects.length; e < i; e++)
                    this._objects[e].render(t)
                  this._drawClipPath(t, this.clipPath)
                },
                isCacheDirty: function (t) {
                  if (this.callSuper('isCacheDirty', t)) return !0
                  if (!this.statefullCache) return !1
                  for (var e = 0, i = this._objects.length; e < i; e++)
                    if (this._objects[e].isCacheDirty(!0)) {
                      if (this._cacheCanvas) {
                        var n = this.cacheWidth / this.zoomX,
                          s = this.cacheHeight / this.zoomY
                        this._cacheContext.clearRect(-n / 2, -s / 2, n, s)
                      }
                      return !0
                    }
                  return !1
                },
                _restoreObjectsState: function () {
                  var t = this.calcOwnMatrix()
                  return (
                    this._objects.forEach(function (i) {
                      e.util.addTransformToObject(i, t),
                        delete i.group,
                        i.setCoords()
                    }),
                    this
                  )
                },
                destroy: function () {
                  return (
                    this._objects.forEach(function (t) {
                      t.set('dirty', !0)
                    }),
                    this._restoreObjectsState()
                  )
                },
                dispose: function () {
                  this.callSuper('dispose'),
                    this.forEachObject(function (t) {
                      t.dispose && t.dispose()
                    }),
                    (this._objects = [])
                },
                toActiveSelection: function () {
                  if (this.canvas) {
                    var t = this._objects,
                      i = this.canvas
                    this._objects = []
                    var n = this.toObject()
                    delete n.objects
                    var s = new e.ActiveSelection([])
                    return (
                      s.set(n),
                      (s.type = 'activeSelection'),
                      i.remove(this),
                      t.forEach(function (t) {
                        ;(t.group = s), (t.dirty = !0), i.add(t)
                      }),
                      (s.canvas = i),
                      (s._objects = t),
                      (i._activeObject = s),
                      s.setCoords(),
                      s
                    )
                  }
                },
                ungroupOnCanvas: function () {
                  return this._restoreObjectsState()
                },
                setObjectsCoords: function () {
                  return (
                    this.forEachObject(function (t) {
                      t.setCoords(!0)
                    }),
                    this
                  )
                },
                _calcBounds: function (t) {
                  for (
                    var e,
                      i,
                      n,
                      s,
                      r = [],
                      a = [],
                      o = ['tr', 'br', 'bl', 'tl'],
                      l = 0,
                      c = this._objects.length,
                      h = o.length;
                    l < c;
                    ++l
                  ) {
                    for (
                      n = (e = this._objects[l]).calcACoords(), s = 0;
                      s < h;
                      s++
                    )
                      (i = o[s]), r.push(n[i].x), a.push(n[i].y)
                    e.aCoords = n
                  }
                  this._getBounds(r, a, t)
                },
                _getBounds: function (t, s, r) {
                  var a = new e.Point(i(t), i(s)),
                    o = new e.Point(n(t), n(s)),
                    l = a.y || 0,
                    c = a.x || 0,
                    h = o.x - a.x || 0,
                    d = o.y - a.y || 0
                  ;(this.width = h),
                    (this.height = d),
                    r || this.setPositionByOrigin({ x: c, y: l }, 'left', 'top')
                },
                _toSVG: function (t) {
                  for (
                    var e = ['<g ', 'COMMON_PARTS', ' >\n'],
                      i = 0,
                      n = this._objects.length;
                    i < n;
                    i++
                  )
                    e.push('\t\t', this._objects[i].toSVG(t))
                  return e.push('</g>\n'), e
                },
                getSvgStyles: function () {
                  var t =
                      void 0 !== this.opacity && 1 !== this.opacity
                        ? 'opacity: ' + this.opacity + ';'
                        : '',
                    e = this.visible ? '' : ' visibility: hidden;'
                  return [t, this.getSvgFilter(), e].join('')
                },
                toClipPathSVG: function (t) {
                  for (var e = [], i = 0, n = this._objects.length; i < n; i++)
                    e.push('\t', this._objects[i].toClipPathSVG(t))
                  return this._createBaseClipPathSVGMarkup(e, { reviver: t })
                }
              })),
              (e.Group.fromObject = function (t, i) {
                var n = t.objects,
                  s = e.util.object.clone(t, !0)
                delete s.objects,
                  'string' != typeof n
                    ? e.util.enlivenObjects(n, function (n) {
                        e.util.enlivenObjectEnlivables(t, s, function () {
                          i && i(new e.Group(n, s, !0))
                        })
                      })
                    : e.loadSVGFromURL(n, function (r) {
                        var a = e.util.groupSVGElements(r, t, n),
                          o = s.clipPath
                        delete s.clipPath,
                          a.set(s),
                          o
                            ? e.util.enlivenObjects([o], function (t) {
                                ;(a.clipPath = t[0]), i && i(a)
                              })
                            : i && i(a)
                      })
              }))
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {})
            e.ActiveSelection ||
              ((e.ActiveSelection = e.util.createClass(e.Group, {
                type: 'activeSelection',
                initialize: function (t, i) {
                  ;(i = i || {}), (this._objects = t || [])
                  for (var n = this._objects.length; n--; )
                    this._objects[n].group = this
                  i.originX && (this.originX = i.originX),
                    i.originY && (this.originY = i.originY),
                    this._calcBounds(),
                    this._updateObjectsCoords(),
                    e.Object.prototype.initialize.call(this, i),
                    this.setCoords()
                },
                toGroup: function () {
                  var t = this._objects.concat()
                  this._objects = []
                  var i = e.Object.prototype.toObject.call(this),
                    n = new e.Group([])
                  if (
                    (delete i.type,
                    n.set(i),
                    t.forEach(function (t) {
                      t.canvas.remove(t), (t.group = n)
                    }),
                    (n._objects = t),
                    !this.canvas)
                  )
                    return n
                  var s = this.canvas
                  return s.add(n), (s._activeObject = n), n.setCoords(), n
                },
                onDeselect: function () {
                  return this.destroy(), !1
                },
                toString: function () {
                  return (
                    '#<fabric.ActiveSelection: (' + this.complexity() + ')>'
                  )
                },
                shouldCache: function () {
                  return !1
                },
                isOnACache: function () {
                  return !1
                },
                _renderControls: function (t, e, i) {
                  t.save(),
                    (t.globalAlpha = this.isMoving
                      ? this.borderOpacityWhenMoving
                      : 1),
                    this.callSuper('_renderControls', t, e),
                    void 0 === (i = i || {}).hasControls &&
                      (i.hasControls = !1),
                    (i.forActiveSelection = !0)
                  for (var n = 0, s = this._objects.length; n < s; n++)
                    this._objects[n]._renderControls(t, i)
                  t.restore()
                }
              })),
              (e.ActiveSelection.fromObject = function (t, i) {
                e.util.enlivenObjects(t.objects, function (n) {
                  delete t.objects, i && i(new e.ActiveSelection(n, t, !0))
                })
              }))
          })(e),
          (function (t) {
            'use strict'
            var e = E.util.object.extend
            t.fabric || (t.fabric = {}),
              t.fabric.Image
                ? E.warn('fabric.Image is already defined.')
                : ((E.Image = E.util.createClass(E.Object, {
                    type: 'image',
                    strokeWidth: 0,
                    srcFromAttribute: !1,
                    _lastScaleX: 1,
                    _lastScaleY: 1,
                    _filterScalingX: 1,
                    _filterScalingY: 1,
                    minimumScaleTrigger: 0.5,
                    stateProperties: E.Object.prototype.stateProperties.concat(
                      'cropX',
                      'cropY'
                    ),
                    cacheProperties: E.Object.prototype.cacheProperties.concat(
                      'cropX',
                      'cropY'
                    ),
                    cacheKey: '',
                    cropX: 0,
                    cropY: 0,
                    imageSmoothing: !0,
                    initialize: function (t, e) {
                      e || (e = {}),
                        (this.filters = []),
                        (this.cacheKey = 'texture' + E.Object.__uid++),
                        this.callSuper('initialize', e),
                        this._initElement(t, e)
                    },
                    getElement: function () {
                      return this._element || {}
                    },
                    setElement: function (t, e) {
                      return (
                        this.removeTexture(this.cacheKey),
                        this.removeTexture(this.cacheKey + '_filtered'),
                        (this._element = t),
                        (this._originalElement = t),
                        this._initConfig(e),
                        0 !== this.filters.length && this.applyFilters(),
                        this.resizeFilter && this.applyResizeFilters(),
                        this
                      )
                    },
                    removeTexture: function (t) {
                      var e = E.filterBackend
                      e && e.evictCachesForKey && e.evictCachesForKey(t)
                    },
                    dispose: function () {
                      this.callSuper('dispose'),
                        this.removeTexture(this.cacheKey),
                        this.removeTexture(this.cacheKey + '_filtered'),
                        (this._cacheContext = void 0),
                        [
                          '_originalElement',
                          '_element',
                          '_filteredEl',
                          '_cacheCanvas'
                        ].forEach(
                          function (t) {
                            E.util.cleanUpJsdomNode(this[t]), (this[t] = void 0)
                          }.bind(this)
                        )
                    },
                    getCrossOrigin: function () {
                      return (
                        this._originalElement &&
                        (this._originalElement.crossOrigin || null)
                      )
                    },
                    getOriginalSize: function () {
                      var t = this.getElement()
                      return {
                        width: t.naturalWidth || t.width,
                        height: t.naturalHeight || t.height
                      }
                    },
                    _stroke: function (t) {
                      if (this.stroke && 0 !== this.strokeWidth) {
                        var e = this.width / 2,
                          i = this.height / 2
                        t.beginPath(),
                          t.moveTo(-e, -i),
                          t.lineTo(e, -i),
                          t.lineTo(e, i),
                          t.lineTo(-e, i),
                          t.lineTo(-e, -i),
                          t.closePath()
                      }
                    },
                    toObject: function (t) {
                      var i = []
                      this.filters.forEach(function (t) {
                        t && i.push(t.toObject())
                      })
                      var n = e(
                        this.callSuper(
                          'toObject',
                          ['cropX', 'cropY'].concat(t)
                        ),
                        {
                          src: this.getSrc(),
                          crossOrigin: this.getCrossOrigin(),
                          filters: i
                        }
                      )
                      return (
                        this.resizeFilter &&
                          (n.resizeFilter = this.resizeFilter.toObject()),
                        n
                      )
                    },
                    hasCrop: function () {
                      return (
                        this.cropX ||
                        this.cropY ||
                        this.width < this._element.width ||
                        this.height < this._element.height
                      )
                    },
                    _toSVG: function () {
                      var t,
                        e = [],
                        i = [],
                        n = this._element,
                        s = -this.width / 2,
                        r = -this.height / 2,
                        a = '',
                        o = ''
                      if (!n) return []
                      if (this.hasCrop()) {
                        var l = E.Object.__uid++
                        e.push(
                          '<clipPath id="imageCrop_' + l + '">\n',
                          '\t<rect x="' +
                            s +
                            '" y="' +
                            r +
                            '" width="' +
                            this.width +
                            '" height="' +
                            this.height +
                            '" />\n',
                          '</clipPath>\n'
                        ),
                          (a = ' clip-path="url(#imageCrop_' + l + ')" ')
                      }
                      if (
                        (this.imageSmoothing ||
                          (o = '" image-rendering="optimizeSpeed'),
                        i.push(
                          '\t<image ',
                          'COMMON_PARTS',
                          'xlink:href="',
                          this.getSvgSrc(!0),
                          '" x="',
                          s - this.cropX,
                          '" y="',
                          r - this.cropY,
                          '" width="',
                          n.width || n.naturalWidth,
                          '" height="',
                          n.height || n.height,
                          o,
                          '"',
                          a,
                          '></image>\n'
                        ),
                        this.stroke || this.strokeDashArray)
                      ) {
                        var c = this.fill
                        ;(this.fill = null),
                          (t = [
                            '\t<rect ',
                            'x="',
                            s,
                            '" y="',
                            r,
                            '" width="',
                            this.width,
                            '" height="',
                            this.height,
                            '" style="',
                            this.getSvgStyles(),
                            '"/>\n'
                          ]),
                          (this.fill = c)
                      }
                      return 'fill' !== this.paintFirst
                        ? e.concat(t, i)
                        : e.concat(i, t)
                    },
                    getSrc: function (t) {
                      var e = t ? this._element : this._originalElement
                      return e
                        ? e.toDataURL
                          ? e.toDataURL()
                          : this.srcFromAttribute
                          ? e.getAttribute('src')
                          : e.src
                        : this.src || ''
                    },
                    setSrc: function (t, e, i) {
                      return (
                        E.util.loadImage(
                          t,
                          function (t, n) {
                            this.setElement(t, i),
                              this._setWidthHeight(),
                              e && e(this, n)
                          },
                          this,
                          i && i.crossOrigin
                        ),
                        this
                      )
                    },
                    toString: function () {
                      return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
                    },
                    applyResizeFilters: function () {
                      var t = this.resizeFilter,
                        e = this.minimumScaleTrigger,
                        i = this.getTotalObjectScaling(),
                        n = i.scaleX,
                        s = i.scaleY,
                        r = this._filteredEl || this._originalElement
                      if (
                        (this.group && this.set('dirty', !0),
                        !t || (n > e && s > e))
                      )
                        return (
                          (this._element = r),
                          (this._filterScalingX = 1),
                          (this._filterScalingY = 1),
                          (this._lastScaleX = n),
                          void (this._lastScaleY = s)
                        )
                      E.filterBackend ||
                        (E.filterBackend = E.initFilterBackend())
                      var a = E.util.createCanvasElement(),
                        o = this._filteredEl
                          ? this.cacheKey + '_filtered'
                          : this.cacheKey,
                        l = r.width,
                        c = r.height
                      ;(a.width = l),
                        (a.height = c),
                        (this._element = a),
                        (this._lastScaleX = t.scaleX = n),
                        (this._lastScaleY = t.scaleY = s),
                        E.filterBackend.applyFilters(
                          [t],
                          r,
                          l,
                          c,
                          this._element,
                          o
                        ),
                        (this._filterScalingX =
                          a.width / this._originalElement.width),
                        (this._filterScalingY =
                          a.height / this._originalElement.height)
                    },
                    applyFilters: function (t) {
                      if (
                        ((t = (t = t || this.filters || []).filter(function (
                          t
                        ) {
                          return t && !t.isNeutralState()
                        })),
                        this.set('dirty', !0),
                        this.removeTexture(this.cacheKey + '_filtered'),
                        0 === t.length)
                      )
                        return (
                          (this._element = this._originalElement),
                          (this._filteredEl = null),
                          (this._filterScalingX = 1),
                          (this._filterScalingY = 1),
                          this
                        )
                      var e = this._originalElement,
                        i = e.naturalWidth || e.width,
                        n = e.naturalHeight || e.height
                      if (this._element === this._originalElement) {
                        var s = E.util.createCanvasElement()
                        ;(s.width = i),
                          (s.height = n),
                          (this._element = s),
                          (this._filteredEl = s)
                      } else
                        (this._element = this._filteredEl),
                          this._filteredEl
                            .getContext('2d')
                            .clearRect(0, 0, i, n),
                          (this._lastScaleX = 1),
                          (this._lastScaleY = 1)
                      return (
                        E.filterBackend ||
                          (E.filterBackend = E.initFilterBackend()),
                        E.filterBackend.applyFilters(
                          t,
                          this._originalElement,
                          i,
                          n,
                          this._element,
                          this.cacheKey
                        ),
                        (this._originalElement.width === this._element.width &&
                          this._originalElement.height ===
                            this._element.height) ||
                          ((this._filterScalingX =
                            this._element.width / this._originalElement.width),
                          (this._filterScalingY =
                            this._element.height /
                            this._originalElement.height)),
                        this
                      )
                    },
                    _render: function (t) {
                      E.util.setImageSmoothing(t, this.imageSmoothing),
                        !0 !== this.isMoving &&
                          this.resizeFilter &&
                          this._needsResize() &&
                          this.applyResizeFilters(),
                        this._stroke(t),
                        this._renderPaintInOrder(t)
                    },
                    drawCacheOnCanvas: function (t) {
                      E.util.setImageSmoothing(t, this.imageSmoothing),
                        E.Object.prototype.drawCacheOnCanvas.call(this, t)
                    },
                    shouldCache: function () {
                      return this.needsItsOwnCache()
                    },
                    _renderFill: function (t) {
                      var e = this._element
                      if (e) {
                        var i = this._filterScalingX,
                          n = this._filterScalingY,
                          s = this.width,
                          r = this.height,
                          a = Math.min,
                          o = Math.max,
                          l = o(this.cropX, 0),
                          c = o(this.cropY, 0),
                          h = e.naturalWidth || e.width,
                          d = e.naturalHeight || e.height,
                          u = l * i,
                          f = c * n,
                          p = a(s * i, h - u),
                          g = a(r * n, d - f),
                          m = -s / 2,
                          v = -r / 2,
                          b = a(s, h / i - l),
                          y = a(r, d / n - c)
                        e && t.drawImage(e, u, f, p, g, m, v, b, y)
                      }
                    },
                    _needsResize: function () {
                      var t = this.getTotalObjectScaling()
                      return (
                        t.scaleX !== this._lastScaleX ||
                        t.scaleY !== this._lastScaleY
                      )
                    },
                    _resetWidthHeight: function () {
                      this.set(this.getOriginalSize())
                    },
                    _initElement: function (t, e) {
                      this.setElement(E.util.getById(t), e),
                        E.util.addClass(this.getElement(), E.Image.CSS_CANVAS)
                    },
                    _initConfig: function (t) {
                      t || (t = {}), this.setOptions(t), this._setWidthHeight(t)
                    },
                    _initFilters: function (t, e) {
                      t && t.length
                        ? E.util.enlivenObjects(
                            t,
                            function (t) {
                              e && e(t)
                            },
                            'fabric.Image.filters'
                          )
                        : e && e()
                    },
                    _setWidthHeight: function (t) {
                      t || (t = {})
                      var e = this.getElement()
                      ;(this.width = t.width || e.naturalWidth || e.width || 0),
                        (this.height =
                          t.height || e.naturalHeight || e.height || 0)
                    },
                    parsePreserveAspectRatioAttribute: function () {
                      var t,
                        e = E.util.parsePreserveAspectRatioAttribute(
                          this.preserveAspectRatio || ''
                        ),
                        i = this._element.width,
                        n = this._element.height,
                        s = 1,
                        r = 1,
                        a = 0,
                        o = 0,
                        l = 0,
                        c = 0,
                        h = this.width,
                        d = this.height,
                        u = { width: h, height: d }
                      return (
                        !e || ('none' === e.alignX && 'none' === e.alignY)
                          ? ((s = h / i), (r = d / n))
                          : ('meet' === e.meetOrSlice &&
                              ((t =
                                (h -
                                  i *
                                    (s = r =
                                      E.util.findScaleToFit(
                                        this._element,
                                        u
                                      ))) /
                                2),
                              'Min' === e.alignX && (a = -t),
                              'Max' === e.alignX && (a = t),
                              (t = (d - n * r) / 2),
                              'Min' === e.alignY && (o = -t),
                              'Max' === e.alignY && (o = t)),
                            'slice' === e.meetOrSlice &&
                              ((t =
                                i -
                                h /
                                  (s = r =
                                    E.util.findScaleToCover(this._element, u))),
                              'Mid' === e.alignX && (l = t / 2),
                              'Max' === e.alignX && (l = t),
                              (t = n - d / r),
                              'Mid' === e.alignY && (c = t / 2),
                              'Max' === e.alignY && (c = t),
                              (i = h / s),
                              (n = d / r))),
                        {
                          width: i,
                          height: n,
                          scaleX: s,
                          scaleY: r,
                          offsetLeft: a,
                          offsetTop: o,
                          cropX: l,
                          cropY: c
                        }
                      )
                    }
                  })),
                  (E.Image.CSS_CANVAS = 'canvas-img'),
                  (E.Image.prototype.getSvgSrc = E.Image.prototype.getSrc),
                  (E.Image.fromObject = function (t, e) {
                    var i = E.util.object.clone(t)
                    E.util.loadImage(
                      i.src,
                      function (t, n) {
                        n
                          ? e && e(null, !0)
                          : E.Image.prototype._initFilters.call(
                              i,
                              i.filters,
                              function (n) {
                                ;(i.filters = n || []),
                                  E.Image.prototype._initFilters.call(
                                    i,
                                    [i.resizeFilter],
                                    function (n) {
                                      ;(i.resizeFilter = n[0]),
                                        E.util.enlivenObjectEnlivables(
                                          i,
                                          i,
                                          function () {
                                            var n = new E.Image(t, i)
                                            e(n, !1)
                                          }
                                        )
                                    }
                                  )
                              }
                            )
                      },
                      null,
                      i.crossOrigin
                    )
                  }),
                  (E.Image.fromURL = function (t, e, i) {
                    E.util.loadImage(
                      t,
                      function (t, n) {
                        e && e(new E.Image(t, i), n)
                      },
                      null,
                      i && i.crossOrigin
                    )
                  }),
                  (E.Image.ATTRIBUTE_NAMES = E.SHARED_ATTRIBUTES.concat(
                    'x y width height preserveAspectRatio xlink:href crossOrigin image-rendering'.split(
                      ' '
                    )
                  )),
                  (E.Image.fromElement = function (t, i, n) {
                    var s = E.parseAttributes(t, E.Image.ATTRIBUTE_NAMES)
                    E.Image.fromURL(
                      s['xlink:href'],
                      i,
                      e(n ? E.util.object.clone(n) : {}, s)
                    )
                  }))
          })(e),
          E.util.object.extend(E.Object.prototype, {
            _getAngleValueForStraighten: function () {
              var t = this.angle % 360
              return t > 0
                ? 90 * Math.round((t - 1) / 90)
                : 90 * Math.round(t / 90)
            },
            straighten: function () {
              return this.rotate(this._getAngleValueForStraighten())
            },
            fxStraighten: function (t) {
              var e = function () {},
                i = (t = t || {}).onComplete || e,
                n = t.onChange || e,
                s = this
              return E.util.animate({
                target: this,
                startValue: this.get('angle'),
                endValue: this._getAngleValueForStraighten(),
                duration: this.FX_DURATION,
                onChange: function (t) {
                  s.rotate(t), n()
                },
                onComplete: function () {
                  s.setCoords(), i()
                }
              })
            }
          }),
          E.util.object.extend(E.StaticCanvas.prototype, {
            straightenObject: function (t) {
              return t.straighten(), this.requestRenderAll(), this
            },
            fxStraightenObject: function (t) {
              return t.fxStraighten({ onChange: this.requestRenderAllBound })
            }
          }),
          (function () {
            'use strict'
            function t (t, e) {
              var i = 'precision ' + e + ' float;\nvoid main(){}',
                n = t.createShader(t.FRAGMENT_SHADER)
              return (
                t.shaderSource(n, i),
                t.compileShader(n),
                !!t.getShaderParameter(n, t.COMPILE_STATUS)
              )
            }
            function e (t) {
              t && t.tileSize && (this.tileSize = t.tileSize),
                this.setupGLContext(this.tileSize, this.tileSize),
                this.captureGPUInfo()
            }
            ;(E.isWebglSupported = function (e) {
              if (E.isLikelyNode) return !1
              e = e || E.WebglFilterBackend.prototype.tileSize
              var i = document.createElement('canvas'),
                n = i.getContext('webgl') || i.getContext('experimental-webgl'),
                s = !1
              if (n) {
                ;(E.maxTextureSize = n.getParameter(n.MAX_TEXTURE_SIZE)),
                  (s = E.maxTextureSize >= e)
                for (var r = ['highp', 'mediump', 'lowp'], a = 0; a < 3; a++)
                  if (t(n, r[a])) {
                    E.webGlPrecision = r[a]
                    break
                  }
              }
              return (this.isSupported = s), s
            }),
              (E.WebglFilterBackend = e),
              (e.prototype = {
                tileSize: 2048,
                resources: {},
                setupGLContext: function (t, e) {
                  this.dispose(),
                    this.createWebGLCanvas(t, e),
                    (this.aPosition = new Float32Array([
                      0, 0, 0, 1, 1, 0, 1, 1
                    ])),
                    this.chooseFastestCopyGLTo2DMethod(t, e)
                },
                chooseFastestCopyGLTo2DMethod: function (t, e) {
                  var i,
                    n = void 0 !== window.performance
                  try {
                    new ImageData(1, 1), (i = !0)
                  } catch (t) {
                    i = !1
                  }
                  var s = 'undefined' != typeof ArrayBuffer,
                    r = 'undefined' != typeof Uint8ClampedArray
                  if (n && i && s && r) {
                    var a = E.util.createCanvasElement(),
                      o = new ArrayBuffer(t * e * 4)
                    if (E.forceGLPutImageData)
                      return (this.imageBuffer = o), void (this.copyGLTo2D = O)
                    var l,
                      c,
                      h = {
                        imageBuffer: o,
                        destinationWidth: t,
                        destinationHeight: e,
                        targetCanvas: a
                      }
                    ;(a.width = t),
                      (a.height = e),
                      (l = window.performance.now()),
                      I.call(h, this.gl, h),
                      (c = window.performance.now() - l),
                      (l = window.performance.now()),
                      O.call(h, this.gl, h),
                      c > window.performance.now() - l
                        ? ((this.imageBuffer = o), (this.copyGLTo2D = O))
                        : (this.copyGLTo2D = I)
                  }
                },
                createWebGLCanvas: function (t, e) {
                  var i = E.util.createCanvasElement()
                  ;(i.width = t), (i.height = e)
                  var n = {
                      alpha: !0,
                      premultipliedAlpha: !1,
                      depth: !1,
                      stencil: !1,
                      antialias: !1
                    },
                    s = i.getContext('webgl', n)
                  s || (s = i.getContext('experimental-webgl', n)),
                    s &&
                      (s.clearColor(0, 0, 0, 0),
                      (this.canvas = i),
                      (this.gl = s))
                },
                applyFilters: function (t, e, i, n, s, r) {
                  var a,
                    o = this.gl
                  r && (a = this.getCachedTexture(r, e))
                  var l = {
                      originalWidth: e.width || e.originalWidth,
                      originalHeight: e.height || e.originalHeight,
                      sourceWidth: i,
                      sourceHeight: n,
                      destinationWidth: i,
                      destinationHeight: n,
                      context: o,
                      sourceTexture: this.createTexture(o, i, n, !a && e),
                      targetTexture: this.createTexture(o, i, n),
                      originalTexture:
                        a || this.createTexture(o, i, n, !a && e),
                      passes: t.length,
                      webgl: !0,
                      aPosition: this.aPosition,
                      programCache: this.programCache,
                      pass: 0,
                      filterBackend: this,
                      targetCanvas: s
                    },
                    c = o.createFramebuffer()
                  return (
                    o.bindFramebuffer(o.FRAMEBUFFER, c),
                    t.forEach(function (t) {
                      t && t.applyTo(l)
                    }),
                    (function (t) {
                      var e = t.targetCanvas,
                        i = e.width,
                        n = e.height,
                        s = t.destinationWidth,
                        r = t.destinationHeight
                      ;(i === s && n === r) || ((e.width = s), (e.height = r))
                    })(l),
                    this.copyGLTo2D(o, l),
                    o.bindTexture(o.TEXTURE_2D, null),
                    o.deleteTexture(l.sourceTexture),
                    o.deleteTexture(l.targetTexture),
                    o.deleteFramebuffer(c),
                    s.getContext('2d').setTransform(1, 0, 0, 1, 0, 0),
                    l
                  )
                },
                dispose: function () {
                  this.canvas && ((this.canvas = null), (this.gl = null)),
                    this.clearWebGLCaches()
                },
                clearWebGLCaches: function () {
                  ;(this.programCache = {}), (this.textureCache = {})
                },
                createTexture: function (t, e, i, n, s) {
                  var r = t.createTexture()
                  return (
                    t.bindTexture(t.TEXTURE_2D, r),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_MAG_FILTER,
                      s || t.NEAREST
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_MIN_FILTER,
                      s || t.NEAREST
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_WRAP_S,
                      t.CLAMP_TO_EDGE
                    ),
                    t.texParameteri(
                      t.TEXTURE_2D,
                      t.TEXTURE_WRAP_T,
                      t.CLAMP_TO_EDGE
                    ),
                    n
                      ? t.texImage2D(
                          t.TEXTURE_2D,
                          0,
                          t.RGBA,
                          t.RGBA,
                          t.UNSIGNED_BYTE,
                          n
                        )
                      : t.texImage2D(
                          t.TEXTURE_2D,
                          0,
                          t.RGBA,
                          e,
                          i,
                          0,
                          t.RGBA,
                          t.UNSIGNED_BYTE,
                          null
                        ),
                    r
                  )
                },
                getCachedTexture: function (t, e) {
                  if (this.textureCache[t]) return this.textureCache[t]
                  var i = this.createTexture(this.gl, e.width, e.height, e)
                  return (this.textureCache[t] = i), i
                },
                evictCachesForKey: function (t) {
                  this.textureCache[t] &&
                    (this.gl.deleteTexture(this.textureCache[t]),
                    delete this.textureCache[t])
                },
                copyGLTo2D: I,
                captureGPUInfo: function () {
                  if (this.gpuInfo) return this.gpuInfo
                  var t = this.gl,
                    e = { renderer: '', vendor: '' }
                  if (!t) return e
                  var i = t.getExtension('WEBGL_debug_renderer_info')
                  if (i) {
                    var n = t.getParameter(i.UNMASKED_RENDERER_WEBGL),
                      s = t.getParameter(i.UNMASKED_VENDOR_WEBGL)
                    n && (e.renderer = n.toLowerCase()),
                      s && (e.vendor = s.toLowerCase())
                  }
                  return (this.gpuInfo = e), e
                }
              })
          })(),
          (function () {
            'use strict'
            var t = function () {}
            function e () {}
            ;(E.Canvas2dFilterBackend = e),
              (e.prototype = {
                evictCachesForKey: t,
                dispose: t,
                clearWebGLCaches: t,
                resources: {},
                applyFilters: function (t, e, i, n, s) {
                  var r = s.getContext('2d')
                  r.drawImage(e, 0, 0, i, n)
                  var a = {
                    sourceWidth: i,
                    sourceHeight: n,
                    imageData: r.getImageData(0, 0, i, n),
                    originalEl: e,
                    originalImageData: r.getImageData(0, 0, i, n),
                    canvasEl: s,
                    ctx: r,
                    filterBackend: this
                  }
                  return (
                    t.forEach(function (t) {
                      t.applyTo(a)
                    }),
                    (a.imageData.width === i && a.imageData.height === n) ||
                      ((s.width = a.imageData.width),
                      (s.height = a.imageData.height)),
                    r.putImageData(a.imageData, 0, 0),
                    a
                  )
                }
              })
          })(),
          (E.Image = E.Image || {}),
          (E.Image.filters = E.Image.filters || {}),
          (E.Image.filters.BaseFilter = E.util.createClass({
            type: 'BaseFilter',
            vertexSource:
              'attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvoid main() {\nvTexCoord = aPosition;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}',
            fragmentSource:
              'precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D uTexture;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\n}',
            initialize: function (t) {
              t && this.setOptions(t)
            },
            setOptions: function (t) {
              for (var e in t) this[e] = t[e]
            },
            createProgram: function (t, e, i) {
              ;(e = e || this.fragmentSource),
                (i = i || this.vertexSource),
                'highp' !== E.webGlPrecision &&
                  (e = e.replace(
                    /precision highp float/g,
                    'precision ' + E.webGlPrecision + ' float'
                  ))
              var n = t.createShader(t.VERTEX_SHADER)
              if (
                (t.shaderSource(n, i),
                t.compileShader(n),
                !t.getShaderParameter(n, t.COMPILE_STATUS))
              )
                throw new Error(
                  'Vertex shader compile error for ' +
                    this.type +
                    ': ' +
                    t.getShaderInfoLog(n)
                )
              var s = t.createShader(t.FRAGMENT_SHADER)
              if (
                (t.shaderSource(s, e),
                t.compileShader(s),
                !t.getShaderParameter(s, t.COMPILE_STATUS))
              )
                throw new Error(
                  'Fragment shader compile error for ' +
                    this.type +
                    ': ' +
                    t.getShaderInfoLog(s)
                )
              var r = t.createProgram()
              if (
                (t.attachShader(r, n),
                t.attachShader(r, s),
                t.linkProgram(r),
                !t.getProgramParameter(r, t.LINK_STATUS))
              )
                throw new Error(
                  'Shader link error for "${this.type}" ' +
                    t.getProgramInfoLog(r)
                )
              var a = this.getAttributeLocations(t, r),
                o = this.getUniformLocations(t, r) || {}
              return (
                (o.uStepW = t.getUniformLocation(r, 'uStepW')),
                (o.uStepH = t.getUniformLocation(r, 'uStepH')),
                { program: r, attributeLocations: a, uniformLocations: o }
              )
            },
            getAttributeLocations: function (t, e) {
              return { aPosition: t.getAttribLocation(e, 'aPosition') }
            },
            getUniformLocations: function () {
              return {}
            },
            sendAttributeData: function (t, e, i) {
              var n = e.aPosition,
                s = t.createBuffer()
              t.bindBuffer(t.ARRAY_BUFFER, s),
                t.enableVertexAttribArray(n),
                t.vertexAttribPointer(n, 2, t.FLOAT, !1, 0, 0),
                t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW)
            },
            _setupFrameBuffer: function (t) {
              var e,
                i,
                n = t.context
              t.passes > 1
                ? ((e = t.destinationWidth),
                  (i = t.destinationHeight),
                  (t.sourceWidth === e && t.sourceHeight === i) ||
                    (n.deleteTexture(t.targetTexture),
                    (t.targetTexture = t.filterBackend.createTexture(n, e, i))),
                  n.framebufferTexture2D(
                    n.FRAMEBUFFER,
                    n.COLOR_ATTACHMENT0,
                    n.TEXTURE_2D,
                    t.targetTexture,
                    0
                  ))
                : (n.bindFramebuffer(n.FRAMEBUFFER, null), n.finish())
            },
            _swapTextures: function (t) {
              t.passes--, t.pass++
              var e = t.targetTexture
              ;(t.targetTexture = t.sourceTexture), (t.sourceTexture = e)
            },
            isNeutralState: function () {
              var t = this.mainParameter,
                e = E.Image.filters[this.type].prototype
              if (t) {
                if (Array.isArray(e[t])) {
                  for (var i = e[t].length; i--; )
                    if (this[t][i] !== e[t][i]) return !1
                  return !0
                }
                return e[t] === this[t]
              }
              return !1
            },
            applyTo: function (t) {
              t.webgl
                ? (this._setupFrameBuffer(t),
                  this.applyToWebGL(t),
                  this._swapTextures(t))
                : this.applyTo2d(t)
            },
            retrieveShader: function (t) {
              return (
                t.programCache.hasOwnProperty(this.type) ||
                  (t.programCache[this.type] = this.createProgram(t.context)),
                t.programCache[this.type]
              )
            },
            applyToWebGL: function (t) {
              var e = t.context,
                i = this.retrieveShader(t)
              0 === t.pass && t.originalTexture
                ? e.bindTexture(e.TEXTURE_2D, t.originalTexture)
                : e.bindTexture(e.TEXTURE_2D, t.sourceTexture),
                e.useProgram(i.program),
                this.sendAttributeData(e, i.attributeLocations, t.aPosition),
                e.uniform1f(i.uniformLocations.uStepW, 1 / t.sourceWidth),
                e.uniform1f(i.uniformLocations.uStepH, 1 / t.sourceHeight),
                this.sendUniformData(e, i.uniformLocations),
                e.viewport(0, 0, t.destinationWidth, t.destinationHeight),
                e.drawArrays(e.TRIANGLE_STRIP, 0, 4)
            },
            bindAdditionalTexture: function (t, e, i) {
              t.activeTexture(i),
                t.bindTexture(t.TEXTURE_2D, e),
                t.activeTexture(t.TEXTURE0)
            },
            unbindAdditionalTexture: function (t, e) {
              t.activeTexture(e),
                t.bindTexture(t.TEXTURE_2D, null),
                t.activeTexture(t.TEXTURE0)
            },
            getMainParameter: function () {
              return this[this.mainParameter]
            },
            setMainParameter: function (t) {
              this[this.mainParameter] = t
            },
            sendUniformData: function () {},
            createHelpLayer: function (t) {
              if (!t.helpLayer) {
                var e = document.createElement('canvas')
                ;(e.width = t.sourceWidth),
                  (e.height = t.sourceHeight),
                  (t.helpLayer = e)
              }
            },
            toObject: function () {
              var t = { type: this.type },
                e = this.mainParameter
              return e && (t[e] = this[e]), t
            },
            toJSON: function () {
              return this.toObject()
            }
          })),
          (E.Image.filters.BaseFilter.fromObject = function (t, e) {
            var i = new E.Image.filters[t.type](t)
            return e && e(i), i
          }),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.ColorMatrix = n(i.BaseFilter, {
              type: 'ColorMatrix',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nuniform mat4 uColorMatrix;\nuniform vec4 uConstants;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor *= uColorMatrix;\ncolor += uConstants;\ngl_FragColor = color;\n}',
              matrix: [
                1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0
              ],
              mainParameter: 'matrix',
              colorsOnly: !0,
              initialize: function (t) {
                this.callSuper('initialize', t),
                  (this.matrix = this.matrix.slice(0))
              },
              applyTo2d: function (t) {
                var e,
                  i,
                  n,
                  s,
                  r,
                  a = t.imageData.data,
                  o = a.length,
                  l = this.matrix,
                  c = this.colorsOnly
                for (r = 0; r < o; r += 4)
                  (e = a[r]),
                    (i = a[r + 1]),
                    (n = a[r + 2]),
                    c
                      ? ((a[r] = e * l[0] + i * l[1] + n * l[2] + 255 * l[4]),
                        (a[r + 1] =
                          e * l[5] + i * l[6] + n * l[7] + 255 * l[9]),
                        (a[r + 2] =
                          e * l[10] + i * l[11] + n * l[12] + 255 * l[14]))
                      : ((s = a[r + 3]),
                        (a[r] =
                          e * l[0] +
                          i * l[1] +
                          n * l[2] +
                          s * l[3] +
                          255 * l[4]),
                        (a[r + 1] =
                          e * l[5] +
                          i * l[6] +
                          n * l[7] +
                          s * l[8] +
                          255 * l[9]),
                        (a[r + 2] =
                          e * l[10] +
                          i * l[11] +
                          n * l[12] +
                          s * l[13] +
                          255 * l[14]),
                        (a[r + 3] =
                          e * l[15] +
                          i * l[16] +
                          n * l[17] +
                          s * l[18] +
                          255 * l[19]))
              },
              getUniformLocations: function (t, e) {
                return {
                  uColorMatrix: t.getUniformLocation(e, 'uColorMatrix'),
                  uConstants: t.getUniformLocation(e, 'uConstants')
                }
              },
              sendUniformData: function (t, e) {
                var i = this.matrix,
                  n = [
                    i[0],
                    i[1],
                    i[2],
                    i[3],
                    i[5],
                    i[6],
                    i[7],
                    i[8],
                    i[10],
                    i[11],
                    i[12],
                    i[13],
                    i[15],
                    i[16],
                    i[17],
                    i[18]
                  ],
                  s = [i[4], i[9], i[14], i[19]]
                t.uniformMatrix4fv(e.uColorMatrix, !1, n),
                  t.uniform4fv(e.uConstants, s)
              }
            })),
              (e.Image.filters.ColorMatrix.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Brightness = n(i.BaseFilter, {
              type: 'Brightness',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform float uBrightness;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += uBrightness;\ngl_FragColor = color;\n}',
              brightness: 0,
              mainParameter: 'brightness',
              applyTo2d: function (t) {
                if (0 !== this.brightness) {
                  var e,
                    i = t.imageData.data,
                    n = i.length,
                    s = Math.round(255 * this.brightness)
                  for (e = 0; e < n; e += 4)
                    (i[e] = i[e] + s),
                      (i[e + 1] = i[e + 1] + s),
                      (i[e + 2] = i[e + 2] + s)
                }
              },
              getUniformLocations: function (t, e) {
                return { uBrightness: t.getUniformLocation(e, 'uBrightness') }
              },
              sendUniformData: function (t, e) {
                t.uniform1f(e.uBrightness, this.brightness)
              }
            })),
              (e.Image.filters.Brightness.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend,
              n = e.Image.filters,
              s = e.util.createClass
            ;(n.Convolute = s(n.BaseFilter, {
              type: 'Convolute',
              opaque: !1,
              matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
              fragmentSource: {
                Convolute_3_1:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
                Convolute_3_0:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
                Convolute_5_1:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
                Convolute_5_0:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
                Convolute_7_1:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
                Convolute_7_0:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
                Convolute_9_1:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
                Convolute_9_0:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}'
              },
              retrieveShader: function (t) {
                var e = Math.sqrt(this.matrix.length),
                  i = this.type + '_' + e + '_' + (this.opaque ? 1 : 0),
                  n = this.fragmentSource[i]
                return (
                  t.programCache.hasOwnProperty(i) ||
                    (t.programCache[i] = this.createProgram(t.context, n)),
                  t.programCache[i]
                )
              },
              applyTo2d: function (t) {
                var e,
                  i,
                  n,
                  s,
                  r,
                  a,
                  o,
                  l,
                  c,
                  h,
                  d,
                  u,
                  f,
                  p = t.imageData,
                  g = p.data,
                  m = this.matrix,
                  v = Math.round(Math.sqrt(m.length)),
                  b = Math.floor(v / 2),
                  y = p.width,
                  x = p.height,
                  w = t.ctx.createImageData(y, x),
                  C = w.data,
                  S = this.opaque ? 1 : 0
                for (d = 0; d < x; d++)
                  for (h = 0; h < y; h++) {
                    for (
                      r = 4 * (d * y + h), e = 0, i = 0, n = 0, s = 0, f = 0;
                      f < v;
                      f++
                    )
                      for (u = 0; u < v; u++)
                        (a = h + u - b),
                          (o = d + f - b) < 0 ||
                            o >= x ||
                            a < 0 ||
                            a >= y ||
                            ((l = 4 * (o * y + a)),
                            (c = m[f * v + u]),
                            (e += g[l] * c),
                            (i += g[l + 1] * c),
                            (n += g[l + 2] * c),
                            S || (s += g[l + 3] * c))
                    ;(C[r] = e),
                      (C[r + 1] = i),
                      (C[r + 2] = n),
                      (C[r + 3] = S ? g[r + 3] : s)
                  }
                t.imageData = w
              },
              getUniformLocations: function (t, e) {
                return {
                  uMatrix: t.getUniformLocation(e, 'uMatrix'),
                  uOpaque: t.getUniformLocation(e, 'uOpaque'),
                  uHalfSize: t.getUniformLocation(e, 'uHalfSize'),
                  uSize: t.getUniformLocation(e, 'uSize')
                }
              },
              sendUniformData: function (t, e) {
                t.uniform1fv(e.uMatrix, this.matrix)
              },
              toObject: function () {
                return i(this.callSuper('toObject'), {
                  opaque: this.opaque,
                  matrix: this.matrix
                })
              }
            })),
              (e.Image.filters.Convolute.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Grayscale = n(i.BaseFilter, {
              type: 'Grayscale',
              fragmentSource: {
                average:
                  'precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat average = (color.r + color.b + color.g) / 3.0;\ngl_FragColor = vec4(average, average, average, color.a);\n}',
                lightness:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;\ngl_FragColor = vec4(average, average, average, col.a);\n}',
                luminosity:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;\ngl_FragColor = vec4(average, average, average, col.a);\n}'
              },
              mode: 'average',
              mainParameter: 'mode',
              applyTo2d: function (t) {
                var e,
                  i,
                  n = t.imageData.data,
                  s = n.length,
                  r = this.mode
                for (e = 0; e < s; e += 4)
                  'average' === r
                    ? (i = (n[e] + n[e + 1] + n[e + 2]) / 3)
                    : 'lightness' === r
                    ? (i =
                        (Math.min(n[e], n[e + 1], n[e + 2]) +
                          Math.max(n[e], n[e + 1], n[e + 2])) /
                        2)
                    : 'luminosity' === r &&
                      (i = 0.21 * n[e] + 0.72 * n[e + 1] + 0.07 * n[e + 2]),
                    (n[e] = i),
                    (n[e + 1] = i),
                    (n[e + 2] = i)
              },
              retrieveShader: function (t) {
                var e = this.type + '_' + this.mode
                if (!t.programCache.hasOwnProperty(e)) {
                  var i = this.fragmentSource[this.mode]
                  t.programCache[e] = this.createProgram(t.context, i)
                }
                return t.programCache[e]
              },
              getUniformLocations: function (t, e) {
                return { uMode: t.getUniformLocation(e, 'uMode') }
              },
              sendUniformData: function (t, e) {
                t.uniform1i(e.uMode, 1)
              },
              isNeutralState: function () {
                return !1
              }
            })),
              (e.Image.filters.Grayscale.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Invert = n(i.BaseFilter, {
              type: 'Invert',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform int uInvert;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nif (uInvert == 1) {\ngl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n} else {\ngl_FragColor = color;\n}\n}',
              invert: !0,
              mainParameter: 'invert',
              applyTo2d: function (t) {
                var e,
                  i = t.imageData.data,
                  n = i.length
                for (e = 0; e < n; e += 4)
                  (i[e] = 255 - i[e]),
                    (i[e + 1] = 255 - i[e + 1]),
                    (i[e + 2] = 255 - i[e + 2])
              },
              isNeutralState: function () {
                return !this.invert
              },
              getUniformLocations: function (t, e) {
                return { uInvert: t.getUniformLocation(e, 'uInvert') }
              },
              sendUniformData: function (t, e) {
                t.uniform1i(e.uInvert, this.invert)
              }
            })),
              (e.Image.filters.Invert.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend,
              n = e.Image.filters,
              s = e.util.createClass
            ;(n.Noise = s(n.BaseFilter, {
              type: 'Noise',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform float uStepH;\nuniform float uNoise;\nuniform float uSeed;\nvarying vec2 vTexCoord;\nfloat rand(vec2 co, float seed, float vScale) {\nreturn fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n}\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\ngl_FragColor = color;\n}',
              mainParameter: 'noise',
              noise: 0,
              applyTo2d: function (t) {
                if (0 !== this.noise) {
                  var e,
                    i,
                    n = t.imageData.data,
                    s = n.length,
                    r = this.noise
                  for (e = 0, s = n.length; e < s; e += 4)
                    (i = (0.5 - Math.random()) * r),
                      (n[e] += i),
                      (n[e + 1] += i),
                      (n[e + 2] += i)
                }
              },
              getUniformLocations: function (t, e) {
                return {
                  uNoise: t.getUniformLocation(e, 'uNoise'),
                  uSeed: t.getUniformLocation(e, 'uSeed')
                }
              },
              sendUniformData: function (t, e) {
                t.uniform1f(e.uNoise, this.noise / 255),
                  t.uniform1f(e.uSeed, Math.random())
              },
              toObject: function () {
                return i(this.callSuper('toObject'), { noise: this.noise })
              }
            })),
              (e.Image.filters.Noise.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Pixelate = n(i.BaseFilter, {
              type: 'Pixelate',
              blocksize: 4,
              mainParameter: 'blocksize',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform float uBlocksize;\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nfloat blockW = uBlocksize * uStepW;\nfloat blockH = uBlocksize * uStepW;\nint posX = int(vTexCoord.x / blockW);\nint posY = int(vTexCoord.y / blockH);\nfloat fposX = float(posX);\nfloat fposY = float(posY);\nvec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\nvec4 color = texture2D(uTexture, squareCoords);\ngl_FragColor = color;\n}',
              applyTo2d: function (t) {
                var e,
                  i,
                  n,
                  s,
                  r,
                  a,
                  o,
                  l,
                  c,
                  h,
                  d,
                  u = t.imageData,
                  f = u.data,
                  p = u.height,
                  g = u.width
                for (i = 0; i < p; i += this.blocksize)
                  for (n = 0; n < g; n += this.blocksize)
                    for (
                      s = f[(e = 4 * i * g + 4 * n)],
                        r = f[e + 1],
                        a = f[e + 2],
                        o = f[e + 3],
                        h = Math.min(i + this.blocksize, p),
                        d = Math.min(n + this.blocksize, g),
                        l = i;
                      l < h;
                      l++
                    )
                      for (c = n; c < d; c++)
                        (f[(e = 4 * l * g + 4 * c)] = s),
                          (f[e + 1] = r),
                          (f[e + 2] = a),
                          (f[e + 3] = o)
              },
              isNeutralState: function () {
                return 1 === this.blocksize
              },
              getUniformLocations: function (t, e) {
                return {
                  uBlocksize: t.getUniformLocation(e, 'uBlocksize'),
                  uStepW: t.getUniformLocation(e, 'uStepW'),
                  uStepH: t.getUniformLocation(e, 'uStepH')
                }
              },
              sendUniformData: function (t, e) {
                t.uniform1f(e.uBlocksize, this.blocksize)
              }
            })),
              (e.Image.filters.Pixelate.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.extend,
              n = e.Image.filters,
              s = e.util.createClass
            ;(n.RemoveColor = s(n.BaseFilter, {
              type: 'RemoveColor',
              color: '#FFFFFF',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uLow;\nuniform vec4 uHigh;\nvarying vec2 vTexCoord;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\nif(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {\ngl_FragColor.a = 0.0;\n}\n}',
              distance: 0.02,
              useAlpha: !1,
              applyTo2d: function (t) {
                var i,
                  n,
                  s,
                  r,
                  a = t.imageData.data,
                  o = 255 * this.distance,
                  l = new e.Color(this.color).getSource(),
                  c = [l[0] - o, l[1] - o, l[2] - o],
                  h = [l[0] + o, l[1] + o, l[2] + o]
                for (i = 0; i < a.length; i += 4)
                  (n = a[i]),
                    (s = a[i + 1]),
                    (r = a[i + 2]),
                    n > c[0] &&
                      s > c[1] &&
                      r > c[2] &&
                      n < h[0] &&
                      s < h[1] &&
                      r < h[2] &&
                      (a[i + 3] = 0)
              },
              getUniformLocations: function (t, e) {
                return {
                  uLow: t.getUniformLocation(e, 'uLow'),
                  uHigh: t.getUniformLocation(e, 'uHigh')
                }
              },
              sendUniformData: function (t, i) {
                var n = new e.Color(this.color).getSource(),
                  s = parseFloat(this.distance),
                  r = [
                    0 + n[0] / 255 - s,
                    0 + n[1] / 255 - s,
                    0 + n[2] / 255 - s,
                    1
                  ],
                  a = [n[0] / 255 + s, n[1] / 255 + s, n[2] / 255 + s, 1]
                t.uniform4fv(i.uLow, r), t.uniform4fv(i.uHigh, a)
              },
              toObject: function () {
                return i(this.callSuper('toObject'), {
                  color: this.color,
                  distance: this.distance
                })
              }
            })),
              (e.Image.filters.RemoveColor.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass,
              s = {
                Brownie: [
                  0.5997, 0.34553, -0.27082, 0, 0.186, -0.0377, 0.86095,
                  0.15059, 0, -0.1449, 0.24113, -0.07441, 0.44972, 0, -0.02965,
                  0, 0, 0, 1, 0
                ],
                Vintage: [
                  0.62793, 0.32021, -0.03965, 0, 0.03784, 0.02578, 0.64411,
                  0.03259, 0, 0.02926, 0.0466, -0.08512, 0.52416, 0, 0.02023, 0,
                  0, 0, 1, 0
                ],
                Kodachrome: [
                  1.12855, -0.39673, -0.03992, 0, 0.24991, -0.16404, 1.08352,
                  -0.05498, 0, 0.09698, -0.16786, -0.56034, 1.60148, 0, 0.13972,
                  0, 0, 0, 1, 0
                ],
                Technicolor: [
                  1.91252, -0.85453, -0.09155, 0, 0.04624, -0.30878, 1.76589,
                  -0.10601, 0, -0.27589, -0.2311, -0.75018, 1.84759, 0, 0.12137,
                  0, 0, 0, 1, 0
                ],
                Polaroid: [
                  1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0,
                  -0.016, -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0
                ],
                Sepia: [
                  0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272,
                  0.534, 0.131, 0, 0, 0, 0, 0, 1, 0
                ],
                BlackWhite: [
                  1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0,
                  -1, 0, 0, 0, 1, 0
                ]
              }
            for (var r in s)
              (i[r] = n(i.ColorMatrix, {
                type: r,
                matrix: s[r],
                mainParameter: !1,
                colorsOnly: !0
              })),
                (e.Image.filters[r].fromObject =
                  e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric,
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.BlendColor = n(i.BaseFilter, {
              type: 'BlendColor',
              color: '#F95C63',
              mode: 'multiply',
              alpha: 1,
              fragmentSource: {
                multiply: 'gl_FragColor.rgb *= uColor.rgb;\n',
                screen:
                  'gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n',
                add: 'gl_FragColor.rgb += uColor.rgb;\n',
                diff: 'gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n',
                subtract: 'gl_FragColor.rgb -= uColor.rgb;\n',
                lighten:
                  'gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n',
                darken:
                  'gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n',
                exclusion:
                  'gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n',
                overlay:
                  'if (uColor.r < 0.5) {\ngl_FragColor.r *= 2.0 * uColor.r;\n} else {\ngl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n}\nif (uColor.g < 0.5) {\ngl_FragColor.g *= 2.0 * uColor.g;\n} else {\ngl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n}\nif (uColor.b < 0.5) {\ngl_FragColor.b *= 2.0 * uColor.b;\n} else {\ngl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n}\n',
                tint: 'gl_FragColor.rgb *= (1.0 - uColor.a);\ngl_FragColor.rgb += uColor.rgb;\n'
              },
              buildSource: function (t) {
                return (
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ngl_FragColor = color;\nif (color.a > 0.0) {\n' +
                  this.fragmentSource[t] +
                  '}\n}'
                )
              },
              retrieveShader: function (t) {
                var e,
                  i = this.type + '_' + this.mode
                return (
                  t.programCache.hasOwnProperty(i) ||
                    ((e = this.buildSource(this.mode)),
                    (t.programCache[i] = this.createProgram(t.context, e))),
                  t.programCache[i]
                )
              },
              applyTo2d: function (t) {
                var i,
                  n,
                  s,
                  r,
                  a,
                  o,
                  l,
                  c = t.imageData.data,
                  h = c.length,
                  d = 1 - this.alpha
                ;(i =
                  (l = new e.Color(this.color).getSource())[0] * this.alpha),
                  (n = l[1] * this.alpha),
                  (s = l[2] * this.alpha)
                for (var u = 0; u < h; u += 4)
                  switch (
                    ((r = c[u]), (a = c[u + 1]), (o = c[u + 2]), this.mode)
                  ) {
                    case 'multiply':
                      ;(c[u] = (r * i) / 255),
                        (c[u + 1] = (a * n) / 255),
                        (c[u + 2] = (o * s) / 255)
                      break
                    case 'screen':
                      ;(c[u] = 255 - ((255 - r) * (255 - i)) / 255),
                        (c[u + 1] = 255 - ((255 - a) * (255 - n)) / 255),
                        (c[u + 2] = 255 - ((255 - o) * (255 - s)) / 255)
                      break
                    case 'add':
                      ;(c[u] = r + i), (c[u + 1] = a + n), (c[u + 2] = o + s)
                      break
                    case 'diff':
                    case 'difference':
                      ;(c[u] = Math.abs(r - i)),
                        (c[u + 1] = Math.abs(a - n)),
                        (c[u + 2] = Math.abs(o - s))
                      break
                    case 'subtract':
                      ;(c[u] = r - i), (c[u + 1] = a - n), (c[u + 2] = o - s)
                      break
                    case 'darken':
                      ;(c[u] = Math.min(r, i)),
                        (c[u + 1] = Math.min(a, n)),
                        (c[u + 2] = Math.min(o, s))
                      break
                    case 'lighten':
                      ;(c[u] = Math.max(r, i)),
                        (c[u + 1] = Math.max(a, n)),
                        (c[u + 2] = Math.max(o, s))
                      break
                    case 'overlay':
                      ;(c[u] =
                        i < 128
                          ? (2 * r * i) / 255
                          : 255 - (2 * (255 - r) * (255 - i)) / 255),
                        (c[u + 1] =
                          n < 128
                            ? (2 * a * n) / 255
                            : 255 - (2 * (255 - a) * (255 - n)) / 255),
                        (c[u + 2] =
                          s < 128
                            ? (2 * o * s) / 255
                            : 255 - (2 * (255 - o) * (255 - s)) / 255)
                      break
                    case 'exclusion':
                      ;(c[u] = i + r - (2 * i * r) / 255),
                        (c[u + 1] = n + a - (2 * n * a) / 255),
                        (c[u + 2] = s + o - (2 * s * o) / 255)
                      break
                    case 'tint':
                      ;(c[u] = i + r * d),
                        (c[u + 1] = n + a * d),
                        (c[u + 2] = s + o * d)
                  }
              },
              getUniformLocations: function (t, e) {
                return { uColor: t.getUniformLocation(e, 'uColor') }
              },
              sendUniformData: function (t, i) {
                var n = new e.Color(this.color).getSource()
                ;(n[0] = (this.alpha * n[0]) / 255),
                  (n[1] = (this.alpha * n[1]) / 255),
                  (n[2] = (this.alpha * n[2]) / 255),
                  (n[3] = this.alpha),
                  t.uniform4fv(i.uColor, n)
              },
              toObject: function () {
                return {
                  type: this.type,
                  color: this.color,
                  mode: this.mode,
                  alpha: this.alpha
                }
              }
            })),
              (e.Image.filters.BlendColor.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric,
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.BlendImage = n(i.BaseFilter, {
              type: 'BlendImage',
              image: null,
              mode: 'multiply',
              alpha: 1,
              vertexSource:
                'attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nuniform mat3 uTransformMatrix;\nvoid main() {\nvTexCoord = aPosition;\nvTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}',
              fragmentSource: {
                multiply:
                  'precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.rgba *= color2.rgba;\ngl_FragColor = color;\n}',
                mask: 'precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.a = color2.a;\ngl_FragColor = color;\n}'
              },
              retrieveShader: function (t) {
                var e = this.type + '_' + this.mode,
                  i = this.fragmentSource[this.mode]
                return (
                  t.programCache.hasOwnProperty(e) ||
                    (t.programCache[e] = this.createProgram(t.context, i)),
                  t.programCache[e]
                )
              },
              applyToWebGL: function (t) {
                var e = t.context,
                  i = this.createTexture(t.filterBackend, this.image)
                this.bindAdditionalTexture(e, i, e.TEXTURE1),
                  this.callSuper('applyToWebGL', t),
                  this.unbindAdditionalTexture(e, e.TEXTURE1)
              },
              createTexture: function (t, e) {
                return t.getCachedTexture(e.cacheKey, e._element)
              },
              calculateMatrix: function () {
                var t = this.image,
                  e = t._element.width,
                  i = t._element.height
                return [
                  1 / t.scaleX,
                  0,
                  0,
                  0,
                  1 / t.scaleY,
                  0,
                  -t.left / e,
                  -t.top / i,
                  1
                ]
              },
              applyTo2d: function (t) {
                var i,
                  n,
                  s,
                  r,
                  a,
                  o,
                  l,
                  c,
                  h,
                  d,
                  u,
                  f = t.imageData,
                  p = t.filterBackend.resources,
                  g = f.data,
                  m = g.length,
                  v = f.width,
                  b = f.height,
                  y = this.image
                p.blendImage || (p.blendImage = e.util.createCanvasElement()),
                  (d = (h = p.blendImage).getContext('2d')),
                  h.width !== v || h.height !== b
                    ? ((h.width = v), (h.height = b))
                    : d.clearRect(0, 0, v, b),
                  d.setTransform(y.scaleX, 0, 0, y.scaleY, y.left, y.top),
                  d.drawImage(y._element, 0, 0, v, b),
                  (u = d.getImageData(0, 0, v, b).data)
                for (var x = 0; x < m; x += 4)
                  switch (
                    ((a = g[x]),
                    (o = g[x + 1]),
                    (l = g[x + 2]),
                    (c = g[x + 3]),
                    (i = u[x]),
                    (n = u[x + 1]),
                    (s = u[x + 2]),
                    (r = u[x + 3]),
                    this.mode)
                  ) {
                    case 'multiply':
                      ;(g[x] = (a * i) / 255),
                        (g[x + 1] = (o * n) / 255),
                        (g[x + 2] = (l * s) / 255),
                        (g[x + 3] = (c * r) / 255)
                      break
                    case 'mask':
                      g[x + 3] = r
                  }
              },
              getUniformLocations: function (t, e) {
                return {
                  uTransformMatrix: t.getUniformLocation(e, 'uTransformMatrix'),
                  uImage: t.getUniformLocation(e, 'uImage')
                }
              },
              sendUniformData: function (t, e) {
                var i = this.calculateMatrix()
                t.uniform1i(e.uImage, 1),
                  t.uniformMatrix3fv(e.uTransformMatrix, !1, i)
              },
              toObject: function () {
                return {
                  type: this.type,
                  image: this.image && this.image.toObject(),
                  mode: this.mode,
                  alpha: this.alpha
                }
              }
            })),
              (e.Image.filters.BlendImage.fromObject = function (t, i) {
                e.Image.fromObject(t.image, function (n) {
                  var s = e.util.object.clone(t)
                  ;(s.image = n), i(new e.Image.filters.BlendImage(s))
                })
              })
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = Math.pow,
              n = Math.floor,
              s = Math.sqrt,
              r = Math.abs,
              a = Math.round,
              o = Math.sin,
              l = Math.ceil,
              c = e.Image.filters,
              h = e.util.createClass
            ;(c.Resize = h(c.BaseFilter, {
              type: 'Resize',
              resizeType: 'hermite',
              scaleX: 1,
              scaleY: 1,
              lanczosLobes: 3,
              getUniformLocations: function (t, e) {
                return {
                  uDelta: t.getUniformLocation(e, 'uDelta'),
                  uTaps: t.getUniformLocation(e, 'uTaps')
                }
              },
              sendUniformData: function (t, e) {
                t.uniform2fv(
                  e.uDelta,
                  this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]
                ),
                  t.uniform1fv(e.uTaps, this.taps)
              },
              retrieveShader: function (t) {
                var e = this.getFilterWindow(),
                  i = this.type + '_' + e
                if (!t.programCache.hasOwnProperty(i)) {
                  var n = this.generateShader(e)
                  t.programCache[i] = this.createProgram(t.context, n)
                }
                return t.programCache[i]
              },
              getFilterWindow: function () {
                var t = this.tempScale
                return Math.ceil(this.lanczosLobes / t)
              },
              getTaps: function () {
                for (
                  var t = this.lanczosCreate(this.lanczosLobes),
                    e = this.tempScale,
                    i = this.getFilterWindow(),
                    n = new Array(i),
                    s = 1;
                  s <= i;
                  s++
                )
                  n[s - 1] = t(s * e)
                return n
              },
              generateShader: function (t) {
                for (
                  var e = new Array(t), i = this.fragmentSourceTOP, n = 1;
                  n <= t;
                  n++
                )
                  e[n - 1] = n + '.0 * uDelta'
                return (
                  (i += 'uniform float uTaps[' + t + '];\n'),
                  (i += 'void main() {\n'),
                  (i += '  vec4 color = texture2D(uTexture, vTexCoord);\n'),
                  (i += '  float sum = 1.0;\n'),
                  e.forEach(function (t, e) {
                    ;(i +=
                      '  color += texture2D(uTexture, vTexCoord + ' +
                      t +
                      ') * uTaps[' +
                      e +
                      '];\n'),
                      (i +=
                        '  color += texture2D(uTexture, vTexCoord - ' +
                        t +
                        ') * uTaps[' +
                        e +
                        '];\n'),
                      (i += '  sum += 2.0 * uTaps[' + e + '];\n')
                  }),
                  (i += '  gl_FragColor = color / sum;\n'),
                  (i += '}')
                )
              },
              fragmentSourceTOP:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\n',
              applyTo: function (t) {
                t.webgl
                  ? (t.passes++,
                    (this.width = t.sourceWidth),
                    (this.horizontal = !0),
                    (this.dW = Math.round(this.width * this.scaleX)),
                    (this.dH = t.sourceHeight),
                    (this.tempScale = this.dW / this.width),
                    (this.taps = this.getTaps()),
                    (t.destinationWidth = this.dW),
                    this._setupFrameBuffer(t),
                    this.applyToWebGL(t),
                    this._swapTextures(t),
                    (t.sourceWidth = t.destinationWidth),
                    (this.height = t.sourceHeight),
                    (this.horizontal = !1),
                    (this.dH = Math.round(this.height * this.scaleY)),
                    (this.tempScale = this.dH / this.height),
                    (this.taps = this.getTaps()),
                    (t.destinationHeight = this.dH),
                    this._setupFrameBuffer(t),
                    this.applyToWebGL(t),
                    this._swapTextures(t),
                    (t.sourceHeight = t.destinationHeight))
                  : this.applyTo2d(t)
              },
              isNeutralState: function () {
                return 1 === this.scaleX && 1 === this.scaleY
              },
              lanczosCreate: function (t) {
                return function (e) {
                  if (e >= t || e <= -t) return 0
                  if (e < 1.1920929e-7 && e > -1.1920929e-7) return 1
                  var i = (e *= Math.PI) / t
                  return ((o(e) / e) * o(i)) / i
                }
              },
              applyTo2d: function (t) {
                var e = t.imageData,
                  i = this.scaleX,
                  n = this.scaleY
                ;(this.rcpScaleX = 1 / i), (this.rcpScaleY = 1 / n)
                var s,
                  r = e.width,
                  o = e.height,
                  l = a(r * i),
                  c = a(o * n)
                'sliceHack' === this.resizeType
                  ? (s = this.sliceByTwo(t, r, o, l, c))
                  : 'hermite' === this.resizeType
                  ? (s = this.hermiteFastResize(t, r, o, l, c))
                  : 'bilinear' === this.resizeType
                  ? (s = this.bilinearFiltering(t, r, o, l, c))
                  : 'lanczos' === this.resizeType &&
                    (s = this.lanczosResize(t, r, o, l, c)),
                  (t.imageData = s)
              },
              sliceByTwo: function (t, i, s, r, a) {
                var o,
                  l,
                  c = t.imageData,
                  h = 0.5,
                  d = !1,
                  u = !1,
                  f = i * h,
                  p = s * h,
                  g = e.filterBackend.resources,
                  m = 0,
                  v = 0,
                  b = i,
                  y = 0
                for (
                  g.sliceByTwo ||
                    (g.sliceByTwo = document.createElement('canvas')),
                    ((o = g.sliceByTwo).width < 1.5 * i || o.height < s) &&
                      ((o.width = 1.5 * i), (o.height = s)),
                    (l = o.getContext('2d')).clearRect(0, 0, 1.5 * i, s),
                    l.putImageData(c, 0, 0),
                    r = n(r),
                    a = n(a);
                  !d || !u;

                )
                  (i = f),
                    (s = p),
                    r < n(f * h) ? (f = n(f * h)) : ((f = r), (d = !0)),
                    a < n(p * h) ? (p = n(p * h)) : ((p = a), (u = !0)),
                    l.drawImage(o, m, v, i, s, b, y, f, p),
                    (m = b),
                    (v = y),
                    (y += p)
                return l.getImageData(m, v, r, a)
              },
              lanczosResize: function (t, e, a, o, c) {
                var h = t.imageData.data,
                  d = t.ctx.createImageData(o, c),
                  u = d.data,
                  f = this.lanczosCreate(this.lanczosLobes),
                  p = this.rcpScaleX,
                  g = this.rcpScaleY,
                  m = 2 / this.rcpScaleX,
                  v = 2 / this.rcpScaleY,
                  b = l((p * this.lanczosLobes) / 2),
                  y = l((g * this.lanczosLobes) / 2),
                  x = {},
                  w = {},
                  C = {}
                return (function t (l) {
                  var S, T, E, A, I, O, k, M, P, _, D
                  for (w.x = (l + 0.5) * p, C.x = n(w.x), S = 0; S < c; S++) {
                    for (
                      w.y = (S + 0.5) * g,
                        C.y = n(w.y),
                        I = 0,
                        O = 0,
                        k = 0,
                        M = 0,
                        P = 0,
                        T = C.x - b;
                      T <= C.x + b;
                      T++
                    )
                      if (!(T < 0 || T >= e)) {
                        ;(_ = n(1e3 * r(T - w.x))), x[_] || (x[_] = {})
                        for (var L = C.y - y; L <= C.y + y; L++)
                          L < 0 ||
                            L >= a ||
                            ((D = n(1e3 * r(L - w.y))),
                            x[_][D] ||
                              (x[_][D] = f(s(i(_ * m, 2) + i(D * v, 2)) / 1e3)),
                            (E = x[_][D]) > 0 &&
                              ((I += E),
                              (O += E * h[(A = 4 * (L * e + T))]),
                              (k += E * h[A + 1]),
                              (M += E * h[A + 2]),
                              (P += E * h[A + 3])))
                      }
                    ;(u[(A = 4 * (S * o + l))] = O / I),
                      (u[A + 1] = k / I),
                      (u[A + 2] = M / I),
                      (u[A + 3] = P / I)
                  }
                  return ++l < o ? t(l) : d
                })(0)
              },
              bilinearFiltering: function (t, e, i, s, r) {
                var a,
                  o,
                  l,
                  c,
                  h,
                  d,
                  u,
                  f,
                  p,
                  g = 0,
                  m = this.rcpScaleX,
                  v = this.rcpScaleY,
                  b = 4 * (e - 1),
                  y = t.imageData.data,
                  x = t.ctx.createImageData(s, r),
                  w = x.data
                for (l = 0; l < r; l++)
                  for (c = 0; c < s; c++)
                    for (
                      h = m * c - (a = n(m * c)),
                        d = v * l - (o = n(v * l)),
                        p = 4 * (o * e + a),
                        u = 0;
                      u < 4;
                      u++
                    )
                      (f =
                        y[p + u] * (1 - h) * (1 - d) +
                        y[p + 4 + u] * h * (1 - d) +
                        y[p + b + u] * d * (1 - h) +
                        y[p + b + 4 + u] * h * d),
                        (w[g++] = f)
                return x
              },
              hermiteFastResize: function (t, e, i, a, o) {
                for (
                  var c = this.rcpScaleX,
                    h = this.rcpScaleY,
                    d = l(c / 2),
                    u = l(h / 2),
                    f = t.imageData.data,
                    p = t.ctx.createImageData(a, o),
                    g = p.data,
                    m = 0;
                  m < o;
                  m++
                )
                  for (var v = 0; v < a; v++) {
                    for (
                      var b = 4 * (v + m * a),
                        y = 0,
                        x = 0,
                        w = 0,
                        C = 0,
                        S = 0,
                        T = 0,
                        E = 0,
                        A = (m + 0.5) * h,
                        I = n(m * h);
                      I < (m + 1) * h;
                      I++
                    )
                      for (
                        var O = r(A - (I + 0.5)) / u,
                          k = (v + 0.5) * c,
                          M = O * O,
                          P = n(v * c);
                        P < (v + 1) * c;
                        P++
                      ) {
                        var _ = r(k - (P + 0.5)) / d,
                          D = s(M + _ * _)
                        ;(D > 1 && D < -1) ||
                          ((y = 2 * D * D * D - 3 * D * D + 1) > 0 &&
                            ((E += y * f[3 + (_ = 4 * (P + I * e))]),
                            (w += y),
                            f[_ + 3] < 255 && (y = (y * f[_ + 3]) / 250),
                            (C += y * f[_]),
                            (S += y * f[_ + 1]),
                            (T += y * f[_ + 2]),
                            (x += y)))
                      }
                    ;(g[b] = C / x),
                      (g[b + 1] = S / x),
                      (g[b + 2] = T / x),
                      (g[b + 3] = E / w)
                  }
                return p
              },
              toObject: function () {
                return {
                  type: this.type,
                  scaleX: this.scaleX,
                  scaleY: this.scaleY,
                  resizeType: this.resizeType,
                  lanczosLobes: this.lanczosLobes
                }
              }
            })),
              (e.Image.filters.Resize.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Contrast = n(i.BaseFilter, {
              type: 'Contrast',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform float uContrast;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));\ncolor.rgb = contrastF * (color.rgb - 0.5) + 0.5;\ngl_FragColor = color;\n}',
              contrast: 0,
              mainParameter: 'contrast',
              applyTo2d: function (t) {
                if (0 !== this.contrast) {
                  var e,
                    i = t.imageData.data,
                    n = i.length,
                    s = Math.floor(255 * this.contrast),
                    r = (259 * (s + 255)) / (255 * (259 - s))
                  for (e = 0; e < n; e += 4)
                    (i[e] = r * (i[e] - 128) + 128),
                      (i[e + 1] = r * (i[e + 1] - 128) + 128),
                      (i[e + 2] = r * (i[e + 2] - 128) + 128)
                }
              },
              getUniformLocations: function (t, e) {
                return { uContrast: t.getUniformLocation(e, 'uContrast') }
              },
              sendUniformData: function (t, e) {
                t.uniform1f(e.uContrast, this.contrast)
              }
            })),
              (e.Image.filters.Contrast.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Saturation = n(i.BaseFilter, {
              type: 'Saturation',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform float uSaturation;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat rgMax = max(color.r, color.g);\nfloat rgbMax = max(rgMax, color.b);\ncolor.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\ncolor.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\ncolor.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\ngl_FragColor = color;\n}',
              saturation: 0,
              mainParameter: 'saturation',
              applyTo2d: function (t) {
                if (0 !== this.saturation) {
                  var e,
                    i,
                    n = t.imageData.data,
                    s = n.length,
                    r = -this.saturation
                  for (e = 0; e < s; e += 4)
                    (i = Math.max(n[e], n[e + 1], n[e + 2])),
                      (n[e] += i !== n[e] ? (i - n[e]) * r : 0),
                      (n[e + 1] += i !== n[e + 1] ? (i - n[e + 1]) * r : 0),
                      (n[e + 2] += i !== n[e + 2] ? (i - n[e + 2]) * r : 0)
                }
              },
              getUniformLocations: function (t, e) {
                return { uSaturation: t.getUniformLocation(e, 'uSaturation') }
              },
              sendUniformData: function (t, e) {
                t.uniform1f(e.uSaturation, -this.saturation)
              }
            })),
              (e.Image.filters.Saturation.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Vibrance = n(i.BaseFilter, {
              type: 'Vibrance',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform float uVibrance;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat max = max(color.r, max(color.g, color.b));\nfloat avg = (color.r + color.g + color.b) / 3.0;\nfloat amt = (abs(max - avg) * 2.0) * uVibrance;\ncolor.r += max != color.r ? (max - color.r) * amt : 0.00;\ncolor.g += max != color.g ? (max - color.g) * amt : 0.00;\ncolor.b += max != color.b ? (max - color.b) * amt : 0.00;\ngl_FragColor = color;\n}',
              vibrance: 0,
              mainParameter: 'vibrance',
              applyTo2d: function (t) {
                if (0 !== this.vibrance) {
                  var e,
                    i,
                    n,
                    s,
                    r = t.imageData.data,
                    a = r.length,
                    o = -this.vibrance
                  for (e = 0; e < a; e += 4)
                    (i = Math.max(r[e], r[e + 1], r[e + 2])),
                      (n = (r[e] + r[e + 1] + r[e + 2]) / 3),
                      (s = ((2 * Math.abs(i - n)) / 255) * o),
                      (r[e] += i !== r[e] ? (i - r[e]) * s : 0),
                      (r[e + 1] += i !== r[e + 1] ? (i - r[e + 1]) * s : 0),
                      (r[e + 2] += i !== r[e + 2] ? (i - r[e + 2]) * s : 0)
                }
              },
              getUniformLocations: function (t, e) {
                return { uVibrance: t.getUniformLocation(e, 'uVibrance') }
              },
              sendUniformData: function (t, e) {
                t.uniform1f(e.uVibrance, -this.vibrance)
              }
            })),
              (e.Image.filters.Vibrance.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Blur = n(i.BaseFilter, {
              type: 'Blur',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\nconst float nSamples = 15.0;\nvec3 v3offset = vec3(12.9898, 78.233, 151.7182);\nfloat random(vec3 scale) {\nreturn fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n}\nvoid main() {\nvec4 color = vec4(0.0);\nfloat total = 0.0;\nfloat offset = random(v3offset);\nfor (float t = -nSamples; t <= nSamples; t++) {\nfloat percent = (t + offset - 0.5) / nSamples;\nfloat weight = 1.0 - abs(percent);\ncolor += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}',
              blur: 0,
              mainParameter: 'blur',
              applyTo: function (t) {
                t.webgl
                  ? ((this.aspectRatio = t.sourceWidth / t.sourceHeight),
                    t.passes++,
                    this._setupFrameBuffer(t),
                    (this.horizontal = !0),
                    this.applyToWebGL(t),
                    this._swapTextures(t),
                    this._setupFrameBuffer(t),
                    (this.horizontal = !1),
                    this.applyToWebGL(t),
                    this._swapTextures(t))
                  : this.applyTo2d(t)
              },
              applyTo2d: function (t) {
                t.imageData = this.simpleBlur(t)
              },
              simpleBlur: function (t) {
                var i,
                  n,
                  s = t.filterBackend.resources,
                  r = t.imageData.width,
                  a = t.imageData.height
                s.blurLayer1 ||
                  ((s.blurLayer1 = e.util.createCanvasElement()),
                  (s.blurLayer2 = e.util.createCanvasElement())),
                  (i = s.blurLayer1),
                  (n = s.blurLayer2),
                  (i.width === r && i.height === a) ||
                    ((n.width = i.width = r), (n.height = i.height = a))
                var o,
                  l,
                  c,
                  h,
                  d = i.getContext('2d'),
                  u = n.getContext('2d'),
                  f = 0.06 * this.blur * 0.5
                for (
                  d.putImageData(t.imageData, 0, 0),
                    u.clearRect(0, 0, r, a),
                    h = -15;
                  h <= 15;
                  h++
                )
                  (c = f * (l = h / 15) * r + (o = (Math.random() - 0.5) / 4)),
                    (u.globalAlpha = 1 - Math.abs(l)),
                    u.drawImage(i, c, o),
                    d.drawImage(n, 0, 0),
                    (u.globalAlpha = 1),
                    u.clearRect(0, 0, n.width, n.height)
                for (h = -15; h <= 15; h++)
                  (c = f * (l = h / 15) * a + (o = (Math.random() - 0.5) / 4)),
                    (u.globalAlpha = 1 - Math.abs(l)),
                    u.drawImage(i, o, c),
                    d.drawImage(n, 0, 0),
                    (u.globalAlpha = 1),
                    u.clearRect(0, 0, n.width, n.height)
                t.ctx.drawImage(i, 0, 0)
                var p = t.ctx.getImageData(0, 0, i.width, i.height)
                return (
                  (d.globalAlpha = 1), d.clearRect(0, 0, i.width, i.height), p
                )
              },
              getUniformLocations: function (t, e) {
                return { delta: t.getUniformLocation(e, 'uDelta') }
              },
              sendUniformData: function (t, e) {
                var i = this.chooseRightDelta()
                t.uniform2fv(e.delta, i)
              },
              chooseRightDelta: function () {
                var t,
                  e = 1,
                  i = [0, 0]
                return (
                  this.horizontal
                    ? this.aspectRatio > 1 && (e = 1 / this.aspectRatio)
                    : this.aspectRatio < 1 && (e = this.aspectRatio),
                  (t = e * this.blur * 0.12),
                  this.horizontal ? (i[0] = t) : (i[1] = t),
                  i
                )
              }
            })),
              (i.Blur.fromObject = e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Gamma = n(i.BaseFilter, {
              type: 'Gamma',
              fragmentSource:
                'precision highp float;\nuniform sampler2D uTexture;\nuniform vec3 uGamma;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec3 correction = (1.0 / uGamma);\ncolor.r = pow(color.r, correction.r);\ncolor.g = pow(color.g, correction.g);\ncolor.b = pow(color.b, correction.b);\ngl_FragColor = color;\ngl_FragColor.rgb *= color.a;\n}',
              gamma: [1, 1, 1],
              mainParameter: 'gamma',
              initialize: function (t) {
                ;(this.gamma = [1, 1, 1]),
                  i.BaseFilter.prototype.initialize.call(this, t)
              },
              applyTo2d: function (t) {
                var e,
                  i = t.imageData.data,
                  n = this.gamma,
                  s = i.length,
                  r = 1 / n[0],
                  a = 1 / n[1],
                  o = 1 / n[2]
                for (
                  this.rVals ||
                    ((this.rVals = new Uint8Array(256)),
                    (this.gVals = new Uint8Array(256)),
                    (this.bVals = new Uint8Array(256))),
                    e = 0,
                    s = 256;
                  e < s;
                  e++
                )
                  (this.rVals[e] = 255 * Math.pow(e / 255, r)),
                    (this.gVals[e] = 255 * Math.pow(e / 255, a)),
                    (this.bVals[e] = 255 * Math.pow(e / 255, o))
                for (e = 0, s = i.length; e < s; e += 4)
                  (i[e] = this.rVals[i[e]]),
                    (i[e + 1] = this.gVals[i[e + 1]]),
                    (i[e + 2] = this.bVals[i[e + 2]])
              },
              getUniformLocations: function (t, e) {
                return { uGamma: t.getUniformLocation(e, 'uGamma') }
              },
              sendUniformData: function (t, e) {
                t.uniform3fv(e.uGamma, this.gamma)
              }
            })),
              (e.Image.filters.Gamma.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.Composed = n(i.BaseFilter, {
              type: 'Composed',
              subFilters: [],
              initialize: function (t) {
                this.callSuper('initialize', t),
                  (this.subFilters = this.subFilters.slice(0))
              },
              applyTo: function (t) {
                ;(t.passes += this.subFilters.length - 1),
                  this.subFilters.forEach(function (e) {
                    e.applyTo(t)
                  })
              },
              toObject: function () {
                return e.util.object.extend(this.callSuper('toObject'), {
                  subFilters: this.subFilters.map(function (t) {
                    return t.toObject()
                  })
                })
              },
              isNeutralState: function () {
                return !this.subFilters.some(function (t) {
                  return !t.isNeutralState()
                })
              }
            })),
              (e.Image.filters.Composed.fromObject = function (t, i) {
                var n = (t.subFilters || []).map(function (t) {
                    return new e.Image.filters[t.type](t)
                  }),
                  s = new e.Image.filters.Composed({ subFilters: n })
                return i && i(s), s
              })
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.Image.filters,
              n = e.util.createClass
            ;(i.HueRotation = n(i.ColorMatrix, {
              type: 'HueRotation',
              rotation: 0,
              mainParameter: 'rotation',
              calculateMatrix: function () {
                var t = this.rotation * Math.PI,
                  i = e.util.cos(t),
                  n = e.util.sin(t),
                  s = 1 / 3,
                  r = Math.sqrt(s) * n,
                  a = 1 - i
                ;(this.matrix = [
                  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0
                ]),
                  (this.matrix[0] = i + a / 3),
                  (this.matrix[1] = s * a - r),
                  (this.matrix[2] = s * a + r),
                  (this.matrix[5] = s * a + r),
                  (this.matrix[6] = i + s * a),
                  (this.matrix[7] = s * a - r),
                  (this.matrix[10] = s * a - r),
                  (this.matrix[11] = s * a + r),
                  (this.matrix[12] = i + s * a)
              },
              isNeutralState: function (t) {
                return (
                  this.calculateMatrix(),
                  i.BaseFilter.prototype.isNeutralState.call(this, t)
                )
              },
              applyTo: function (t) {
                this.calculateMatrix(),
                  i.BaseFilter.prototype.applyTo.call(this, t)
              }
            })),
              (e.Image.filters.HueRotation.fromObject =
                e.Image.filters.BaseFilter.fromObject)
          })(e),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {}),
              i = e.util.object.clone
            if (e.Text) e.warn('fabric.Text is already defined')
            else {
              var n =
                'fontFamily fontWeight fontSize text underline overline linethrough textAlign fontStyle lineHeight textBackgroundColor charSpacing styles direction path pathStartOffset pathSide pathAlign'.split(
                  ' '
                )
              ;(e.Text = e.util.createClass(e.Object, {
                _dimensionAffectingProps: [
                  'fontSize',
                  'fontWeight',
                  'fontFamily',
                  'fontStyle',
                  'lineHeight',
                  'text',
                  'charSpacing',
                  'textAlign',
                  'styles',
                  'path',
                  'pathStartOffset',
                  'pathSide',
                  'pathAlign'
                ],
                _reNewline: /\r?\n/,
                _reSpacesAndTabs: /[ \t\r]/g,
                _reSpaceAndTab: /[ \t\r]/,
                _reWords: /\S+/g,
                type: 'text',
                fontSize: 40,
                fontWeight: 'normal',
                fontFamily: 'Times New Roman',
                underline: !1,
                overline: !1,
                linethrough: !1,
                textAlign: 'left',
                fontStyle: 'normal',
                lineHeight: 1.16,
                superscript: { size: 0.6, baseline: -0.35 },
                subscript: { size: 0.6, baseline: 0.11 },
                textBackgroundColor: '',
                stateProperties: e.Object.prototype.stateProperties.concat(n),
                cacheProperties: e.Object.prototype.cacheProperties.concat(n),
                stroke: null,
                shadow: null,
                path: null,
                pathStartOffset: 0,
                pathSide: 'left',
                pathAlign: 'baseline',
                _fontSizeFraction: 0.222,
                offsets: {
                  underline: 0.1,
                  linethrough: -0.315,
                  overline: -0.88
                },
                _fontSizeMult: 1.13,
                charSpacing: 0,
                styles: null,
                _measuringContext: null,
                deltaY: 0,
                direction: 'ltr',
                _styleProperties: [
                  'stroke',
                  'strokeWidth',
                  'fill',
                  'fontFamily',
                  'fontSize',
                  'fontWeight',
                  'fontStyle',
                  'underline',
                  'overline',
                  'linethrough',
                  'deltaY',
                  'textBackgroundColor'
                ],
                __charBounds: [],
                CACHE_FONT_SIZE: 400,
                MIN_TEXT_WIDTH: 2,
                initialize: function (t, e) {
                  ;(this.styles = (e && e.styles) || {}),
                    (this.text = t),
                    (this.__skipDimension = !0),
                    this.callSuper('initialize', e),
                    this.path && this.setPathInfo(),
                    (this.__skipDimension = !1),
                    this.initDimensions(),
                    this.setCoords(),
                    this.setupState({ propertySet: '_dimensionAffectingProps' })
                },
                setPathInfo: function () {
                  var t = this.path
                  t && (t.segmentsInfo = e.util.getPathSegmentsInfo(t.path))
                },
                getMeasuringContext: function () {
                  return (
                    e._measuringContext ||
                      (e._measuringContext =
                        (this.canvas && this.canvas.contextCache) ||
                        e.util.createCanvasElement().getContext('2d')),
                    e._measuringContext
                  )
                },
                _splitText: function () {
                  var t = this._splitTextIntoLines(this.text)
                  return (
                    (this.textLines = t.lines),
                    (this._textLines = t.graphemeLines),
                    (this._unwrappedTextLines = t._unwrappedLines),
                    (this._text = t.graphemeText),
                    t
                  )
                },
                initDimensions: function () {
                  this.__skipDimension ||
                    (this._splitText(),
                    this._clearCache(),
                    this.path
                      ? ((this.width = this.path.width),
                        (this.height = this.path.height))
                      : ((this.width =
                          this.calcTextWidth() ||
                          this.cursorWidth ||
                          this.MIN_TEXT_WIDTH),
                        (this.height = this.calcTextHeight())),
                    -1 !== this.textAlign.indexOf('justify') &&
                      this.enlargeSpaces(),
                    this.saveState({ propertySet: '_dimensionAffectingProps' }))
                },
                enlargeSpaces: function () {
                  for (
                    var t, e, i, n, s, r, a, o = 0, l = this._textLines.length;
                    o < l;
                    o++
                  )
                    if (
                      ('justify' === this.textAlign ||
                        (o !== l - 1 && !this.isEndOfWrapping(o))) &&
                      ((n = 0),
                      (s = this._textLines[o]),
                      (e = this.getLineWidth(o)) < this.width &&
                        (a = this.textLines[o].match(this._reSpacesAndTabs)))
                    ) {
                      ;(i = a.length), (t = (this.width - e) / i)
                      for (var c = 0, h = s.length; c <= h; c++)
                        (r = this.__charBounds[o][c]),
                          this._reSpaceAndTab.test(s[c])
                            ? ((r.width += t),
                              (r.kernedWidth += t),
                              (r.left += n),
                              (n += t))
                            : (r.left += n)
                    }
                },
                isEndOfWrapping: function (t) {
                  return t === this._textLines.length - 1
                },
                missingNewlineOffset: function () {
                  return 1
                },
                toString: function () {
                  return (
                    '#<fabric.Text (' +
                    this.complexity() +
                    '): { "text": "' +
                    this.text +
                    '", "fontFamily": "' +
                    this.fontFamily +
                    '" }>'
                  )
                },
                _getCacheCanvasDimensions: function () {
                  var t = this.callSuper('_getCacheCanvasDimensions'),
                    e = this.fontSize
                  return (t.width += e * t.zoomX), (t.height += e * t.zoomY), t
                },
                _render: function (t) {
                  var e = this.path
                  e && !e.isNotVisible() && e._render(t),
                    this._setTextStyles(t),
                    this._renderTextLinesBackground(t),
                    this._renderTextDecoration(t, 'underline'),
                    this._renderText(t),
                    this._renderTextDecoration(t, 'overline'),
                    this._renderTextDecoration(t, 'linethrough')
                },
                _renderText: function (t) {
                  'stroke' === this.paintFirst
                    ? (this._renderTextStroke(t), this._renderTextFill(t))
                    : (this._renderTextFill(t), this._renderTextStroke(t))
                },
                _setTextStyles: function (t, e, i) {
                  // Must be the CanvasTextBaseline enum value "alphabetic"
                  // (not "alphabetical"). The typo floods the console on every
                  // text paint and freezes canvas select/drag.
                  if (((t.textBaseline = 'alphabetic'), this.path))
                    switch (this.pathAlign) {
                      case 'center':
                        t.textBaseline = 'middle'
                        break
                      case 'ascender':
                        t.textBaseline = 'top'
                        break
                      case 'descender':
                        t.textBaseline = 'bottom'
                    }
                  t.font = this._getFontDeclaration(e, i)
                },
                calcTextWidth: function () {
                  for (
                    var t = this.getLineWidth(0),
                      e = 1,
                      i = this._textLines.length;
                    e < i;
                    e++
                  ) {
                    var n = this.getLineWidth(e)
                    n > t && (t = n)
                  }
                  return t
                },
                _renderTextLine: function (t, e, i, n, s, r) {
                  this._renderChars(t, e, i, n, s, r)
                },
                _renderTextLinesBackground: function (t) {
                  if (
                    this.textBackgroundColor ||
                    this.styleHas('textBackgroundColor')
                  ) {
                    for (
                      var e,
                        i,
                        n,
                        s,
                        r,
                        a,
                        o,
                        l = t.fillStyle,
                        c = this._getLeftOffset(),
                        h = this._getTopOffset(),
                        d = 0,
                        u = 0,
                        f = this.path,
                        p = 0,
                        g = this._textLines.length;
                      p < g;
                      p++
                    )
                      if (
                        ((e = this.getHeightOfLine(p)),
                        this.textBackgroundColor ||
                          this.styleHas('textBackgroundColor', p))
                      ) {
                        ;(n = this._textLines[p]),
                          (i = this._getLineLeftOffset(p)),
                          (u = 0),
                          (d = 0),
                          (s = this.getValueOfPropertyAt(
                            p,
                            0,
                            'textBackgroundColor'
                          ))
                        for (var m = 0, v = n.length; m < v; m++)
                          (r = this.__charBounds[p][m]),
                            (a = this.getValueOfPropertyAt(
                              p,
                              m,
                              'textBackgroundColor'
                            )),
                            f
                              ? (t.save(),
                                t.translate(r.renderLeft, r.renderTop),
                                t.rotate(r.angle),
                                (t.fillStyle = a),
                                a &&
                                  t.fillRect(
                                    -r.width / 2,
                                    (-e / this.lineHeight) *
                                      (1 - this._fontSizeFraction),
                                    r.width,
                                    e / this.lineHeight
                                  ),
                                t.restore())
                              : a !== s
                              ? ((o = c + i + d),
                                'rtl' === this.direction &&
                                  (o = this.width - o - u),
                                (t.fillStyle = s),
                                s && t.fillRect(o, h, u, e / this.lineHeight),
                                (d = r.left),
                                (u = r.width),
                                (s = a))
                              : (u += r.kernedWidth)
                        a &&
                          !f &&
                          ((o = c + i + d),
                          'rtl' === this.direction && (o = this.width - o - u),
                          (t.fillStyle = a),
                          t.fillRect(o, h, u, e / this.lineHeight)),
                          (h += e)
                      } else h += e
                    ;(t.fillStyle = l), this._removeShadow(t)
                  }
                },
                getFontCache: function (t) {
                  var i = t.fontFamily.toLowerCase()
                  e.charWidthsCache[i] || (e.charWidthsCache[i] = {})
                  var n = e.charWidthsCache[i],
                    s =
                      t.fontStyle.toLowerCase() +
                      '_' +
                      (t.fontWeight + '').toLowerCase()
                  return n[s] || (n[s] = {}), n[s]
                },
                _measureChar: function (t, e, i, n) {
                  var s,
                    r,
                    a,
                    o,
                    l = this.getFontCache(e),
                    c = i + t,
                    h =
                      this._getFontDeclaration(e) ===
                      this._getFontDeclaration(n),
                    d = e.fontSize / this.CACHE_FONT_SIZE
                  if (
                    (i && void 0 !== l[i] && (a = l[i]),
                    void 0 !== l[t] && (o = s = l[t]),
                    h && void 0 !== l[c] && (o = (r = l[c]) - a),
                    void 0 === s || void 0 === a || void 0 === r)
                  ) {
                    var u = this.getMeasuringContext()
                    this._setTextStyles(u, e, !0)
                  }
                  return (
                    void 0 === s &&
                      ((o = s = u.measureText(t).width), (l[t] = s)),
                    void 0 === a &&
                      h &&
                      i &&
                      ((a = u.measureText(i).width), (l[i] = a)),
                    h &&
                      void 0 === r &&
                      ((r = u.measureText(c).width), (l[c] = r), (o = r - a)),
                    { width: s * d, kernedWidth: o * d }
                  )
                },
                getHeightOfChar: function (t, e) {
                  return this.getValueOfPropertyAt(t, e, 'fontSize')
                },
                measureLine: function (t) {
                  var e = this._measureLine(t)
                  return (
                    0 !== this.charSpacing &&
                      (e.width -= this._getWidthOfCharSpacing()),
                    e.width < 0 && (e.width = 0),
                    e
                  )
                },
                _measureLine: function (t) {
                  var i,
                    n,
                    s,
                    r,
                    a,
                    o,
                    l = 0,
                    c = this._textLines[t],
                    h = new Array(c.length),
                    d = 0,
                    u = this.path,
                    f = 'right' === this.pathSide
                  for (this.__charBounds[t] = h, i = 0; i < c.length; i++)
                    (n = c[i]),
                      (r = this._getGraphemeBox(n, t, i, s)),
                      (h[i] = r),
                      (l += r.kernedWidth),
                      (s = n)
                  if (
                    ((h[i] = {
                      left: r ? r.left + r.width : 0,
                      width: 0,
                      kernedWidth: 0,
                      height: this.fontSize
                    }),
                    u)
                  ) {
                    switch (
                      ((o = u.segmentsInfo[u.segmentsInfo.length - 1].length),
                      ((a = e.util.getPointOnPath(
                        u.path,
                        0,
                        u.segmentsInfo
                      )).x += u.pathOffset.x),
                      (a.y += u.pathOffset.y),
                      this.textAlign)
                    ) {
                      case 'left':
                        d = f ? o - l : 0
                        break
                      case 'center':
                        d = (o - l) / 2
                        break
                      case 'right':
                        d = f ? 0 : o - l
                    }
                    for (
                      d += this.pathStartOffset * (f ? -1 : 1),
                        i = f ? c.length - 1 : 0;
                      f ? i >= 0 : i < c.length;
                      f ? i-- : i++
                    )
                      (r = h[i]),
                        d > o ? (d %= o) : d < 0 && (d += o),
                        this._setGraphemeOnPath(d, r, a),
                        (d += r.kernedWidth)
                  }
                  return { width: l, numOfSpaces: 0 }
                },
                _setGraphemeOnPath: function (t, i, n) {
                  var s = t + i.kernedWidth / 2,
                    r = this.path,
                    a = e.util.getPointOnPath(r.path, s, r.segmentsInfo)
                  ;(i.renderLeft = a.x - n.x),
                    (i.renderTop = a.y - n.y),
                    (i.angle =
                      a.angle + ('right' === this.pathSide ? Math.PI : 0))
                },
                _getGraphemeBox: function (t, e, i, n, s) {
                  var r,
                    a = this.getCompleteStyleDeclaration(e, i),
                    o = n ? this.getCompleteStyleDeclaration(e, i - 1) : {},
                    l = this._measureChar(t, a, n, o),
                    c = l.kernedWidth,
                    h = l.width
                  0 !== this.charSpacing &&
                    ((h += r = this._getWidthOfCharSpacing()), (c += r))
                  var d = {
                    width: h,
                    left: 0,
                    height: a.fontSize,
                    kernedWidth: c,
                    deltaY: a.deltaY
                  }
                  if (i > 0 && !s) {
                    var u = this.__charBounds[e][i - 1]
                    d.left = u.left + u.width + l.kernedWidth - l.width
                  }
                  return d
                },
                getHeightOfLine: function (t) {
                  if (this.__lineHeights[t]) return this.__lineHeights[t]
                  for (
                    var e = this._textLines[t],
                      i = this.getHeightOfChar(t, 0),
                      n = 1,
                      s = e.length;
                    n < s;
                    n++
                  )
                    i = Math.max(this.getHeightOfChar(t, n), i)
                  return (this.__lineHeights[t] =
                    i * this.lineHeight * this._fontSizeMult)
                },
                calcTextHeight: function () {
                  for (
                    var t, e = 0, i = 0, n = this._textLines.length;
                    i < n;
                    i++
                  )
                    (t = this.getHeightOfLine(i)),
                      (e += i === n - 1 ? t / this.lineHeight : t)
                  return e
                },
                _getLeftOffset: function () {
                  return 'ltr' === this.direction
                    ? -this.width / 2
                    : this.width / 2
                },
                _getTopOffset: function () {
                  return -this.height / 2
                },
                _renderTextCommon: function (t, e) {
                  t.save()
                  for (
                    var i = 0,
                      n = this._getLeftOffset(),
                      s = this._getTopOffset(),
                      r = 0,
                      a = this._textLines.length;
                    r < a;
                    r++
                  ) {
                    var o = this.getHeightOfLine(r),
                      l = o / this.lineHeight,
                      c = this._getLineLeftOffset(r)
                    this._renderTextLine(
                      e,
                      t,
                      this._textLines[r],
                      n + c,
                      s + i + l,
                      r
                    ),
                      (i += o)
                  }
                  t.restore()
                },
                _renderTextFill: function (t) {
                  ;(this.fill || this.styleHas('fill')) &&
                    this._renderTextCommon(t, 'fillText')
                },
                _renderTextStroke: function (t) {
                  ;((this.stroke && 0 !== this.strokeWidth) ||
                    !this.isEmptyStyles()) &&
                    (this.shadow &&
                      !this.shadow.affectStroke &&
                      this._removeShadow(t),
                    t.save(),
                    this._setLineDash(t, this.strokeDashArray),
                    t.beginPath(),
                    this._renderTextCommon(t, 'strokeText'),
                    t.closePath(),
                    t.restore())
                },
                _renderChars: function (t, i, n, s, r, a) {
                  var o,
                    l,
                    c,
                    h,
                    d,
                    u = this.getHeightOfLine(a),
                    f = -1 !== this.textAlign.indexOf('justify'),
                    p = '',
                    g = 0,
                    m = this.path,
                    v =
                      !f &&
                      0 === this.charSpacing &&
                      this.isEmptyStyles(a) &&
                      !m,
                    b = 'ltr' === this.direction,
                    y = 'ltr' === this.direction ? 1 : -1,
                    x = i.canvas.getAttribute('dir')
                  if (
                    (i.save(),
                    x !== this.direction &&
                      (i.canvas.setAttribute('dir', b ? 'ltr' : 'rtl'),
                      (i.direction = b ? 'ltr' : 'rtl'),
                      (i.textAlign = b ? 'left' : 'right')),
                    (r -= (u * this._fontSizeFraction) / this.lineHeight),
                    v)
                  )
                    return (
                      this._renderChar(t, i, a, 0, n.join(''), s, r, u),
                      void i.restore()
                    )
                  for (var w = 0, C = n.length - 1; w <= C; w++)
                    (h = w === C || this.charSpacing || m),
                      (p += n[w]),
                      (c = this.__charBounds[a][w]),
                      0 === g
                        ? ((s += y * (c.kernedWidth - c.width)), (g += c.width))
                        : (g += c.kernedWidth),
                      f && !h && this._reSpaceAndTab.test(n[w]) && (h = !0),
                      h ||
                        ((o = o || this.getCompleteStyleDeclaration(a, w)),
                        (l = this.getCompleteStyleDeclaration(a, w + 1)),
                        (h = e.util.hasStyleChanged(o, l, !1))),
                      h &&
                        (m
                          ? (i.save(),
                            i.translate(c.renderLeft, c.renderTop),
                            i.rotate(c.angle),
                            this._renderChar(t, i, a, w, p, -g / 2, 0, u),
                            i.restore())
                          : ((d = s), this._renderChar(t, i, a, w, p, d, r, u)),
                        (p = ''),
                        (o = l),
                        (s += y * g),
                        (g = 0))
                  i.restore()
                },
                _applyPatternGradientTransformText: function (t) {
                  var i,
                    n = e.util.createCanvasElement(),
                    s = this.width + this.strokeWidth,
                    r = this.height + this.strokeWidth
                  return (
                    (n.width = s),
                    (n.height = r),
                    (i = n.getContext('2d')).beginPath(),
                    i.moveTo(0, 0),
                    i.lineTo(s, 0),
                    i.lineTo(s, r),
                    i.lineTo(0, r),
                    i.closePath(),
                    i.translate(s / 2, r / 2),
                    (i.fillStyle = t.toLive(i)),
                    this._applyPatternGradientTransform(i, t),
                    i.fill(),
                    i.createPattern(n, 'no-repeat')
                  )
                },
                handleFiller: function (t, e, i) {
                  var n, s
                  return i.toLive
                    ? 'percentage' === i.gradientUnits ||
                      i.gradientTransform ||
                      i.patternTransform
                      ? ((n = -this.width / 2),
                        (s = -this.height / 2),
                        t.translate(n, s),
                        (t[e] = this._applyPatternGradientTransformText(i)),
                        { offsetX: n, offsetY: s })
                      : ((t[e] = i.toLive(t, this)),
                        this._applyPatternGradientTransform(t, i))
                    : ((t[e] = i), { offsetX: 0, offsetY: 0 })
                },
                _setStrokeStyles: function (t, e) {
                  return (
                    (t.lineWidth = e.strokeWidth),
                    (t.lineCap = this.strokeLineCap),
                    (t.lineDashOffset = this.strokeDashOffset),
                    (t.lineJoin = this.strokeLineJoin),
                    (t.miterLimit = this.strokeMiterLimit),
                    this.handleFiller(t, 'strokeStyle', e.stroke)
                  )
                },
                _setFillStyles: function (t, e) {
                  return this.handleFiller(t, 'fillStyle', e.fill)
                },
                _renderChar: function (t, e, i, n, s, r, a) {
                  var o,
                    l,
                    c = this._getStyleDeclaration(i, n),
                    h = this.getCompleteStyleDeclaration(i, n),
                    d = 'fillText' === t && h.fill,
                    u = 'strokeText' === t && h.stroke && h.strokeWidth
                  ;(u || d) &&
                    (e.save(),
                    d && (o = this._setFillStyles(e, h)),
                    u && (l = this._setStrokeStyles(e, h)),
                    (e.font = this._getFontDeclaration(h)),
                    c && c.textBackgroundColor && this._removeShadow(e),
                    c && c.deltaY && (a += c.deltaY),
                    d && e.fillText(s, r - o.offsetX, a - o.offsetY),
                    u && e.strokeText(s, r - l.offsetX, a - l.offsetY),
                    e.restore())
                },
                setSuperscript: function (t, e) {
                  return this._setScript(t, e, this.superscript)
                },
                setSubscript: function (t, e) {
                  return this._setScript(t, e, this.subscript)
                },
                _setScript: function (t, e, i) {
                  var n = this.get2DCursorLocation(t, !0),
                    s = this.getValueOfPropertyAt(
                      n.lineIndex,
                      n.charIndex,
                      'fontSize'
                    ),
                    r = this.getValueOfPropertyAt(
                      n.lineIndex,
                      n.charIndex,
                      'deltaY'
                    ),
                    a = { fontSize: s * i.size, deltaY: r + s * i.baseline }
                  return this.setSelectionStyles(a, t, e), this
                },
                _getLineLeftOffset: function (t) {
                  var e = this.getLineWidth(t),
                    i = this.width - e,
                    n = this.textAlign,
                    s = this.direction,
                    r = 0,
                    a = this.isEndOfWrapping(t)
                  return 'justify' === n ||
                    ('justify-center' === n && !a) ||
                    ('justify-right' === n && !a) ||
                    ('justify-left' === n && !a)
                    ? 0
                    : ('center' === n && (r = i / 2),
                      'right' === n && (r = i),
                      'justify-center' === n && (r = i / 2),
                      'justify-right' === n && (r = i),
                      'rtl' === s && (r -= i),
                      r)
                },
                _clearCache: function () {
                  ;(this.__lineWidths = []),
                    (this.__lineHeights = []),
                    (this.__charBounds = [])
                },
                _shouldClearDimensionCache: function () {
                  var t = this._forceClearCache
                  return (
                    t || (t = this.hasStateChanged('_dimensionAffectingProps')),
                    t && ((this.dirty = !0), (this._forceClearCache = !1)),
                    t
                  )
                },
                getLineWidth: function (t) {
                  if (void 0 !== this.__lineWidths[t])
                    return this.__lineWidths[t]
                  var e = this.measureLine(t).width
                  return (this.__lineWidths[t] = e), e
                },
                _getWidthOfCharSpacing: function () {
                  return 0 !== this.charSpacing
                    ? (this.fontSize * this.charSpacing) / 1e3
                    : 0
                },
                getValueOfPropertyAt: function (t, e, i) {
                  var n = this._getStyleDeclaration(t, e)
                  return n && void 0 !== n[i] ? n[i] : this[i]
                },
                _renderTextDecoration: function (t, e) {
                  if (this[e] || this.styleHas(e)) {
                    for (
                      var i,
                        n,
                        s,
                        r,
                        a,
                        o,
                        l,
                        c,
                        h,
                        d,
                        u,
                        f,
                        p,
                        g,
                        m,
                        v,
                        b = this._getLeftOffset(),
                        y = this._getTopOffset(),
                        x = this.path,
                        w = this._getWidthOfCharSpacing(),
                        C = this.offsets[e],
                        S = 0,
                        T = this._textLines.length;
                      S < T;
                      S++
                    )
                      if (
                        ((i = this.getHeightOfLine(S)),
                        this[e] || this.styleHas(e, S))
                      ) {
                        ;(l = this._textLines[S]),
                          (g = i / this.lineHeight),
                          (r = this._getLineLeftOffset(S)),
                          (d = 0),
                          (u = 0),
                          (c = this.getValueOfPropertyAt(S, 0, e)),
                          (v = this.getValueOfPropertyAt(S, 0, 'fill')),
                          (h = y + g * (1 - this._fontSizeFraction)),
                          (n = this.getHeightOfChar(S, 0)),
                          (a = this.getValueOfPropertyAt(S, 0, 'deltaY'))
                        for (var E = 0, A = l.length; E < A; E++)
                          if (
                            ((f = this.__charBounds[S][E]),
                            (p = this.getValueOfPropertyAt(S, E, e)),
                            (m = this.getValueOfPropertyAt(S, E, 'fill')),
                            (s = this.getHeightOfChar(S, E)),
                            (o = this.getValueOfPropertyAt(S, E, 'deltaY')),
                            x && p && m)
                          )
                            t.save(),
                              (t.fillStyle = v),
                              t.translate(f.renderLeft, f.renderTop),
                              t.rotate(f.angle),
                              t.fillRect(
                                -f.kernedWidth / 2,
                                C * s + o,
                                f.kernedWidth,
                                this.fontSize / 15
                              ),
                              t.restore()
                          else if (
                            (p !== c || m !== v || s !== n || o !== a) &&
                            u > 0
                          ) {
                            var I = b + r + d
                            'rtl' === this.direction &&
                              (I = this.width - I - u),
                              c &&
                                v &&
                                ((t.fillStyle = v),
                                t.fillRect(
                                  I,
                                  h + C * n + a,
                                  u,
                                  this.fontSize / 15
                                )),
                              (d = f.left),
                              (u = f.width),
                              (c = p),
                              (v = m),
                              (n = s),
                              (a = o)
                          } else u += f.kernedWidth
                        ;(I = b + r + d),
                          'rtl' === this.direction && (I = this.width - I - u),
                          (t.fillStyle = m),
                          p &&
                            m &&
                            t.fillRect(
                              I,
                              h + C * n + a,
                              u - w,
                              this.fontSize / 15
                            ),
                          (y += i)
                      } else y += i
                    this._removeShadow(t)
                  }
                },
                _getFontDeclaration: function (t, i) {
                  var n = t || this,
                    s = this.fontFamily,
                    r = e.Text.genericFonts.indexOf(s.toLowerCase()) > -1,
                    a =
                      void 0 === s ||
                      s.indexOf("'") > -1 ||
                      s.indexOf(',') > -1 ||
                      s.indexOf('"') > -1 ||
                      r
                        ? n.fontFamily
                        : '"' + n.fontFamily + '"'
                  return [
                    e.isLikelyNode ? n.fontWeight : n.fontStyle,
                    e.isLikelyNode ? n.fontStyle : n.fontWeight,
                    i ? this.CACHE_FONT_SIZE + 'px' : n.fontSize + 'px',
                    a
                  ].join(' ')
                },
                render: function (t) {
                  this.visible &&
                    ((this.canvas &&
                      this.canvas.skipOffscreen &&
                      !this.group &&
                      !this.isOnScreen()) ||
                      (this._shouldClearDimensionCache() &&
                        this.initDimensions(),
                      this.callSuper('render', t)))
                },
                _splitTextIntoLines: function (t) {
                  ;
                  
                  for (
                    var i = t.split(this._reNewline),
                      n = new Array(i.length),
                      s = ['\n'],
                      r = [],
                      a = 0;
                    a < i.length;
                    a++
                  )
                    (n[a] = e.util.string.graphemeSplit(i[a])),
                      (r = r.concat(n[a], s))
                  return (
                    r.pop(),
                    {
                      _unwrappedLines: n,
                      lines: i,
                      graphemeText: r,
                      graphemeLines: n
                    }
                  )
                },
                toObject: function (t) {
                  var i = n.concat(t),
                    s = this.callSuper('toObject', i)
                  return (
                    (s.styles = e.util.stylesToArray(this.styles, this.text)),
                    s.path && (s.path = this.path.toObject()),
                    s
                  )
                },
                set: function (t, e) {
                  this.callSuper('set', t, e)
                  var i = !1,
                    n = !1
                  if ('object' == typeof t)
                    for (var s in t)
                      'path' === s && this.setPathInfo(),
                        (i =
                          i || -1 !== this._dimensionAffectingProps.indexOf(s)),
                        (n = n || 'path' === s)
                  else
                    (i = -1 !== this._dimensionAffectingProps.indexOf(t)),
                      (n = 'path' === t)
                  return (
                    n && this.setPathInfo(),
                    i && (this.initDimensions(), this.setCoords()),
                    this
                  )
                },
                complexity: function () {
                  return 1
                }
              })),
                (e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
                  'x y dx dy font-family font-style font-weight font-size letter-spacing text-decoration text-anchor'.split(
                    ' '
                  )
                )),
                (e.Text.DEFAULT_SVG_FONT_SIZE = 16),
                (e.Text.fromElement = function (t, n, s) {
                  if (!t) return n(null)
                  var r = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES),
                    a = r.textAnchor || 'left'
                  if (
                    (((s = e.util.object.extend(s ? i(s) : {}, r)).top =
                      s.top || 0),
                    (s.left = s.left || 0),
                    r.textDecoration)
                  ) {
                    var o = r.textDecoration
                    ;-1 !== o.indexOf('underline') && (s.underline = !0),
                      -1 !== o.indexOf('overline') && (s.overline = !0),
                      -1 !== o.indexOf('line-through') && (s.linethrough = !0),
                      delete s.textDecoration
                  }
                  'dx' in r && (s.left += r.dx),
                    'dy' in r && (s.top += r.dy),
                    'fontSize' in s ||
                      (s.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE)
                  var l = ''
                  'textContent' in t
                    ? (l = t.textContent)
                    : 'firstChild' in t &&
                      null !== t.firstChild &&
                      'data' in t.firstChild &&
                      null !== t.firstChild.data &&
                      (l = t.firstChild.data),
                    (l = l.replace(/^\s+|\s+$|\n+/g, '').replace(/\s+/g, ' '))
                  var c = s.strokeWidth
                  s.strokeWidth = 0
                  var h = new e.Text(l, s),
                    d = h.getScaledHeight() / h.height,
                    u =
                      ((h.height + h.strokeWidth) * h.lineHeight - h.height) *
                      d,
                    f = h.getScaledHeight() + u,
                    p = 0
                  'center' === a && (p = h.getScaledWidth() / 2),
                    'right' === a && (p = h.getScaledWidth()),
                    h.set({
                      left: h.left - p,
                      top:
                        h.top -
                        (f - h.fontSize * (0.07 + h._fontSizeFraction)) /
                          h.lineHeight,
                      strokeWidth: void 0 !== c ? c : 1
                    }),
                    n(h)
                }),
                (e.Text.fromObject = function (t, n) {
                  var s = i(t),
                    r = t.path
                  return (
                    delete s.path,
                    e.Object._fromObject(
                      'Text',
                      s,
                      function (i) {
                        ;(i.styles = e.util.stylesFromArray(t.styles, t.text)),
                          r
                            ? e.Object._fromObject(
                                'Path',
                                r,
                                function (t) {
                                  i.set('path', t), n(i)
                                },
                                'path'
                              )
                            : n(i)
                      },
                      'text'
                    )
                  )
                }),
                (e.Text.genericFonts = [
                  'sans-serif',
                  'serif',
                  'cursive',
                  'fantasy',
                  'monospace'
                ]),
                e.util.createAccessors && e.util.createAccessors(e.Text)
            }
          })(e),
          E.util.object.extend(E.Text.prototype, {
            isEmptyStyles: function (t) {
              if (!this.styles) return !0
              if (void 0 !== t && !this.styles[t]) return !0
              var e = void 0 === t ? this.styles : { line: this.styles[t] }
              for (var i in e)
                for (var n in e[i]) for (var s in e[i][n]) return !1
              return !0
            },
            styleHas: function (t, e) {
              if (!this.styles || !t || '' === t) return !1
              if (void 0 !== e && !this.styles[e]) return !1
              var i = void 0 === e ? this.styles : { 0: this.styles[e] }
              for (var n in i)
                for (var s in i[n]) if (void 0 !== i[n][s][t]) return !0
              return !1
            },
            cleanStyle: function (t) {
              if (!this.styles || !t || '' === t) return !1
              var e,
                i,
                n = this.styles,
                s = 0,
                r = !0,
                a = 0
              for (var o in n) {
                for (var l in ((e = 0), n[o])) {
                  var c
                  s++,
                    (c = n[o][l]).hasOwnProperty(t)
                      ? (i ? c[t] !== i && (r = !1) : (i = c[t]),
                        c[t] === this[t] && delete c[t])
                      : (r = !1),
                    0 !== Object.keys(c).length ? e++ : delete n[o][l]
                }
                0 === e && delete n[o]
              }
              for (var h = 0; h < this._textLines.length; h++)
                a += this._textLines[h].length
              r && s === a && ((this[t] = i), this.removeStyle(t))
            },
            removeStyle: function (t) {
              if (this.styles && t && '' !== t) {
                var e,
                  i,
                  n,
                  s = this.styles
                for (i in s) {
                  for (n in (e = s[i]))
                    delete e[n][t],
                      0 === Object.keys(e[n]).length && delete e[n]
                  0 === Object.keys(e).length && delete s[i]
                }
              }
            },
            _extendStyles: function (t, e) {
              var i = this.get2DCursorLocation(t)
              this._getLineStyle(i.lineIndex) ||
                this._setLineStyle(i.lineIndex),
                this._getStyleDeclaration(i.lineIndex, i.charIndex) ||
                  this._setStyleDeclaration(i.lineIndex, i.charIndex, {}),
                E.util.object.extend(
                  this._getStyleDeclaration(i.lineIndex, i.charIndex),
                  e
                )
            },
            get2DCursorLocation: function (t, e) {
              void 0 === t && (t = this.selectionStart)
              for (
                var i = e ? this._unwrappedTextLines : this._textLines,
                  n = i.length,
                  s = 0;
                s < n;
                s++
              ) {
                if (t <= i[s].length) return { lineIndex: s, charIndex: t }
                t -= i[s].length + this.missingNewlineOffset(s)
              }
              return {
                lineIndex: s - 1,
                charIndex: i[s - 1].length < t ? i[s - 1].length : t
              }
            },
            getSelectionStyles: function (t, e, i) {
              void 0 === t && (t = this.selectionStart || 0),
                void 0 === e && (e = this.selectionEnd || t)
              for (var n = [], s = t; s < e; s++)
                n.push(this.getStyleAtPosition(s, i))
              return n
            },
            getStyleAtPosition: function (t, e) {
              var i = this.get2DCursorLocation(t)
              return (
                (e
                  ? this.getCompleteStyleDeclaration(i.lineIndex, i.charIndex)
                  : this._getStyleDeclaration(i.lineIndex, i.charIndex)) || {}
              )
            },
            setSelectionStyles: function (t, e, i) {
              void 0 === e && (e = this.selectionStart || 0),
                void 0 === i && (i = this.selectionEnd || e)
              for (var n = e; n < i; n++) this._extendStyles(n, t)
              return (this._forceClearCache = !0), this
            },
            _getStyleDeclaration: function (t, e) {
              var i = this.styles && this.styles[t]
              return i ? i[e] : null
            },
            getCompleteStyleDeclaration: function (t, e) {
              for (
                var i, n = this._getStyleDeclaration(t, e) || {}, s = {}, r = 0;
                r < this._styleProperties.length;
                r++
              )
                s[(i = this._styleProperties[r])] =
                  void 0 === n[i] ? this[i] : n[i]
              return s
            },
            _setStyleDeclaration: function (t, e, i) {
              this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function (t, e) {
              delete this.styles[t][e]
            },
            _getLineStyle: function (t) {
              return !!this.styles[t]
            },
            _setLineStyle: function (t) {
              this.styles[t] = {}
            },
            _deleteLineStyle: function (t) {
              delete this.styles[t]
            }
          }),
          (function () {
            function t (t) {
              t.textDecoration &&
                (t.textDecoration.indexOf('underline') > -1 &&
                  (t.underline = !0),
                t.textDecoration.indexOf('line-through') > -1 &&
                  (t.linethrough = !0),
                t.textDecoration.indexOf('overline') > -1 && (t.overline = !0),
                delete t.textDecoration)
            }
            ;(E.IText = E.util.createClass(E.Text, E.Observable, {
              type: 'i-text',
              selectionStart: 0,
              selectionEnd: 0,
              selectionColor: 'rgba(17,119,255,0.3)',
              isEditing: !1,
              editable: !0,
              editingBorderColor: 'rgba(102,153,255,0.25)',
              cursorWidth: 2,
              cursorColor: '',
              cursorDelay: 1e3,
              cursorDuration: 600,
              caching: !0,
              hiddenTextareaContainer: null,
              _reSpace: /\s|\n/,
              _currentCursorOpacity: 0,
              _selectionDirection: null,
              _abortCursorAnimation: !1,
              __widthOfSpace: [],
              inCompositionMode: !1,
              initialize: function (t, e) {
                this.callSuper('initialize', t, e), this.initBehavior()
              },
              setSelectionStart: function (t) {
                ;(t = Math.max(t, 0)), this._updateAndFire('selectionStart', t)
              },
              setSelectionEnd: function (t) {
                ;(t = Math.min(t, this.text.length)),
                  this._updateAndFire('selectionEnd', t)
              },
              _updateAndFire: function (t, e) {
                this[t] !== e && (this._fireSelectionChanged(), (this[t] = e)),
                  this._updateTextarea()
              },
              _fireSelectionChanged: function () {
                this.fire('selection:changed'),
                  this.canvas &&
                    this.canvas.fire('text:selection:changed', { target: this })
              },
              initDimensions: function () {
                this.isEditing && this.initDelayedCursor(),
                  this.clearContextTop(),
                  this.callSuper('initDimensions')
              },
              render: function (t) {
                this.clearContextTop(),
                  this.callSuper('render', t),
                  (this.cursorOffsetCache = {}),
                  this.renderCursorOrSelection()
              },
              _render: function (t) {
                this.callSuper('_render', t)
              },
              clearContextTop: function (t) {
                if (this.isEditing && this.canvas && this.canvas.contextTop) {
                  var e = this.canvas.contextTop,
                    i = this.canvas.viewportTransform
                  e.save(),
                    e.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
                    this.transform(e),
                    this._clearTextArea(e),
                    t || e.restore()
                }
              },
              renderCursorOrSelection: function () {
                if (this.isEditing && this.canvas && this.canvas.contextTop) {
                  var t = this._getCursorBoundaries(),
                    e = this.canvas.contextTop
                  this.clearContextTop(!0),
                    this.selectionStart === this.selectionEnd
                      ? this.renderCursor(t, e)
                      : this.renderSelection(t, e),
                    e.restore()
                }
              },
              _clearTextArea: function (t) {
                var e = this.width + 4,
                  i = this.height + 4
                t.clearRect(-e / 2, -i / 2, e, i)
              },
              _getCursorBoundaries: function (t) {
                void 0 === t && (t = this.selectionStart)
                var e = this._getLeftOffset(),
                  i = this._getTopOffset(),
                  n = this._getCursorBoundariesOffsets(t)
                return { left: e, top: i, leftOffset: n.left, topOffset: n.top }
              },
              _getCursorBoundariesOffsets: function (t) {
                if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache)
                  return this.cursorOffsetCache
                var e,
                  i,
                  n,
                  s,
                  r = 0,
                  a = 0,
                  o = this.get2DCursorLocation(t)
                ;(n = o.charIndex), (i = o.lineIndex)
                for (var l = 0; l < i; l++) r += this.getHeightOfLine(l)
                e = this._getLineLeftOffset(i)
                var c = this.__charBounds[i][n]
                return (
                  c && (a = c.left),
                  0 !== this.charSpacing &&
                    n === this._textLines[i].length &&
                    (a -= this._getWidthOfCharSpacing()),
                  (s = { top: r, left: e + (a > 0 ? a : 0) }),
                  'rtl' === this.direction && (s.left *= -1),
                  (this.cursorOffsetCache = s),
                  this.cursorOffsetCache
                )
              },
              renderCursor: function (t, e) {
                var i = this.get2DCursorLocation(),
                  n = i.lineIndex,
                  s = i.charIndex > 0 ? i.charIndex - 1 : 0,
                  r = this.getValueOfPropertyAt(n, s, 'fontSize'),
                  a = this.scaleX * this.canvas.getZoom(),
                  o = this.cursorWidth / a,
                  l = t.topOffset,
                  c = this.getValueOfPropertyAt(n, s, 'deltaY')
                ;(l +=
                  ((1 - this._fontSizeFraction) * this.getHeightOfLine(n)) /
                    this.lineHeight -
                  r * (1 - this._fontSizeFraction)),
                  this.inCompositionMode && this.renderSelection(t, e),
                  (e.fillStyle =
                    this.cursorColor ||
                    this.getValueOfPropertyAt(n, s, 'fill')),
                  (e.globalAlpha = this.__isMousedown
                    ? 1
                    : this._currentCursorOpacity),
                  e.fillRect(t.left + t.leftOffset - o / 2, l + t.top + c, o, r)
              },
              renderSelection: function (t, e) {
                for (
                  var i = this.inCompositionMode
                      ? this.hiddenTextarea.selectionStart
                      : this.selectionStart,
                    n = this.inCompositionMode
                      ? this.hiddenTextarea.selectionEnd
                      : this.selectionEnd,
                    s = -1 !== this.textAlign.indexOf('justify'),
                    r = this.get2DCursorLocation(i),
                    a = this.get2DCursorLocation(n),
                    o = r.lineIndex,
                    l = a.lineIndex,
                    c = r.charIndex < 0 ? 0 : r.charIndex,
                    h = a.charIndex < 0 ? 0 : a.charIndex,
                    d = o;
                  d <= l;
                  d++
                ) {
                  var u,
                    f = this._getLineLeftOffset(d) || 0,
                    p = this.getHeightOfLine(d),
                    g = 0,
                    m = 0
                  if (
                    (d === o && (g = this.__charBounds[o][c].left),
                    d >= o && d < l)
                  )
                    m =
                      s && !this.isEndOfWrapping(d)
                        ? this.width
                        : this.getLineWidth(d) || 5
                  else if (d === l)
                    if (0 === h) m = this.__charBounds[l][h].left
                    else {
                      var v = this._getWidthOfCharSpacing()
                      m =
                        this.__charBounds[l][h - 1].left +
                        this.__charBounds[l][h - 1].width -
                        v
                    }
                  ;(u = p),
                    (this.lineHeight < 1 || (d === l && this.lineHeight > 1)) &&
                      (p /= this.lineHeight)
                  var b = t.left + f + g,
                    y = m - g,
                    x = p,
                    w = 0
                  this.inCompositionMode
                    ? ((e.fillStyle = this.compositionColor || 'black'),
                      (x = 1),
                      (w = p))
                    : (e.fillStyle = this.selectionColor),
                    'rtl' === this.direction && (b = this.width - b - y),
                    e.fillRect(b, t.top + t.topOffset + w, y, x),
                    (t.topOffset += u)
                }
              },
              getCurrentCharFontSize: function () {
                var t = this._getCurrentCharIndex()
                return this.getValueOfPropertyAt(t.l, t.c, 'fontSize')
              },
              getCurrentCharColor: function () {
                var t = this._getCurrentCharIndex()
                return this.getValueOfPropertyAt(t.l, t.c, 'fill')
              },
              _getCurrentCharIndex: function () {
                var t = this.get2DCursorLocation(this.selectionStart, !0),
                  e = t.charIndex > 0 ? t.charIndex - 1 : 0
                return { l: t.lineIndex, c: e }
              }
            })),
              (E.IText.fromObject = function (e, i) {
                var n = E.util.stylesFromArray(e.styles, e.text),
                  s = Object.assign({}, e, { styles: n })
                if ((t(s), s.styles))
                  for (var r in s.styles)
                    for (var a in s.styles[r]) t(s.styles[r][a])
                E.Object._fromObject('IText', s, i, 'text')
              })
          })(),
          (C = E.util.object.clone),
          E.util.object.extend(E.IText.prototype, {
            initBehavior: function () {
              this.initAddedHandler(),
                this.initRemovedHandler(),
                this.initCursorSelectionHandlers(),
                this.initDoubleClickSimulation(),
                (this.mouseMoveHandler = this.mouseMoveHandler.bind(this))
            },
            onDeselect: function () {
              this.isEditing && this.exitEditing(), (this.selected = !1)
            },
            initAddedHandler: function () {
              var t = this
              this.on('added', function () {
                var e = t.canvas
                e &&
                  (e._hasITextHandlers ||
                    ((e._hasITextHandlers = !0), t._initCanvasHandlers(e)),
                  (e._iTextInstances = e._iTextInstances || []),
                  e._iTextInstances.push(t))
              })
            },
            initRemovedHandler: function () {
              var t = this
              this.on('removed', function () {
                var e = t.canvas
                e &&
                  ((e._iTextInstances = e._iTextInstances || []),
                  E.util.removeFromArray(e._iTextInstances, t),
                  0 === e._iTextInstances.length &&
                    ((e._hasITextHandlers = !1), t._removeCanvasHandlers(e)))
              })
            },
            _initCanvasHandlers: function (t) {
              ;(t._mouseUpITextHandler = function () {
                t._iTextInstances &&
                  t._iTextInstances.forEach(function (t) {
                    t.__isMousedown = !1
                  })
              }),
                t.on('mouse:up', t._mouseUpITextHandler)
            },
            _removeCanvasHandlers: function (t) {
              t.off('mouse:up', t._mouseUpITextHandler)
            },
            _tick: function () {
              this._currentTickState = this._animateCursor(
                this,
                1,
                this.cursorDuration,
                '_onTickComplete'
              )
            },
            _animateCursor: function (t, e, i, n) {
              var s
              return (
                (s = {
                  isAborted: !1,
                  abort: function () {
                    this.isAborted = !0
                  }
                }),
                t.animate('_currentCursorOpacity', e, {
                  duration: i,
                  onComplete: function () {
                    s.isAborted || t[n]()
                  },
                  onChange: function () {
                    t.canvas &&
                      t.selectionStart === t.selectionEnd &&
                      t.renderCursorOrSelection()
                  },
                  abort: function () {
                    return s.isAborted
                  }
                }),
                s
              )
            },
            _onTickComplete: function () {
              var t = this
              this._cursorTimeout1 && clearTimeout(this._cursorTimeout1),
                (this._cursorTimeout1 = setTimeout(function () {
                  t._currentTickCompleteState = t._animateCursor(
                    t,
                    0,
                    this.cursorDuration / 2,
                    '_tick'
                  )
                }, 100))
            },
            initDelayedCursor: function (t) {
              var e = this,
                i = t ? 0 : this.cursorDelay
              this.abortCursorAnimation(),
                (this._currentCursorOpacity = 1),
                (this._cursorTimeout2 = setTimeout(function () {
                  e._tick()
                }, i))
            },
            abortCursorAnimation: function () {
              var t = this._currentTickState || this._currentTickCompleteState,
                e = this.canvas
              this._currentTickState && this._currentTickState.abort(),
                this._currentTickCompleteState &&
                  this._currentTickCompleteState.abort(),
                clearTimeout(this._cursorTimeout1),
                clearTimeout(this._cursorTimeout2),
                (this._currentCursorOpacity = 0),
                t && e && e.clearContext(e.contextTop || e.contextContainer)
            },
            selectAll: function () {
              return (
                (this.selectionStart = 0),
                (this.selectionEnd = this._text.length),
                this._fireSelectionChanged(),
                this._updateTextarea(),
                this
              )
            },
            getSelectedText: function () {
              return this._text
                .slice(this.selectionStart, this.selectionEnd)
                .join('')
            },
            findWordBoundaryLeft: function (t) {
              var e = 0,
                i = t - 1
              if (this._reSpace.test(this._text[i]))
                for (; this._reSpace.test(this._text[i]); ) e++, i--
              for (; /\S/.test(this._text[i]) && i > -1; ) e++, i--
              return t - e
            },
            findWordBoundaryRight: function (t) {
              var e = 0,
                i = t
              if (this._reSpace.test(this._text[i]))
                for (; this._reSpace.test(this._text[i]); ) e++, i++
              for (; /\S/.test(this._text[i]) && i < this._text.length; )
                e++, i++
              return t + e
            },
            findLineBoundaryLeft: function (t) {
              for (var e = 0, i = t - 1; !/\n/.test(this._text[i]) && i > -1; )
                e++, i--
              return t - e
            },
            findLineBoundaryRight: function (t) {
              for (
                var e = 0, i = t;
                !/\n/.test(this._text[i]) && i < this._text.length;

              )
                e++, i++
              return t + e
            },
            searchWordBoundary: function (t, e) {
              for (
                var i = this._text,
                  n = this._reSpace.test(i[t]) ? t - 1 : t,
                  s = i[n],
                  r = E.reNonWord;
                !r.test(s) && n > 0 && n < i.length;

              )
                s = i[(n += e)]
              return r.test(s) && (n += 1 === e ? 0 : 1), n
            },
            selectWord: function (t) {
              t = t || this.selectionStart
              var e = this.searchWordBoundary(t, -1),
                i = this.searchWordBoundary(t, 1)
              ;(this.selectionStart = e),
                (this.selectionEnd = i),
                this._fireSelectionChanged(),
                this._updateTextarea(),
                this.renderCursorOrSelection()
            },
            selectLine: function (t) {
              t = t || this.selectionStart
              var e = this.findLineBoundaryLeft(t),
                i = this.findLineBoundaryRight(t)
              return (
                (this.selectionStart = e),
                (this.selectionEnd = i),
                this._fireSelectionChanged(),
                this._updateTextarea(),
                this
              )
            },
            enterEditing: function (t) {
              if (!this.isEditing && this.editable)
                return (
                  this.canvas &&
                    (this.canvas.calcOffset(),
                    this.exitEditingOnOthers(this.canvas)),
                  (this.isEditing = !0),
                  this.initHiddenTextarea(t),
                  this.hiddenTextarea.focus(),
                  (this.hiddenTextarea.value = this.text),
                  this._updateTextarea(),
                  this._saveEditingProps(),
                  this._setEditingProps(),
                  (this._textBeforeEdit = this.text),
                  this._tick(),
                  this.fire('editing:entered'),
                  this._fireSelectionChanged(),
                  this.canvas
                    ? (this.canvas.fire('text:editing:entered', {
                        target: this
                      }),
                      this.initMouseMoveHandler(),
                      this.canvas.requestRenderAll(),
                      this)
                    : this
                )
            },
            exitEditingOnOthers: function (t) {
              t._iTextInstances &&
                t._iTextInstances.forEach(function (t) {
                  ;(t.selected = !1), t.isEditing && t.exitEditing()
                })
            },
            initMouseMoveHandler: function () {
              this.canvas.on('mouse:move', this.mouseMoveHandler)
            },
            mouseMoveHandler: function (t) {
              if (this.__isMousedown && this.isEditing) {
                document.activeElement !== this.hiddenTextarea &&
                  this.hiddenTextarea.focus()
                var e = this.getSelectionStartFromPointer(t.e),
                  i = this.selectionStart,
                  n = this.selectionEnd
                ;((e === this.__selectionStartOnMouseDown && i !== n) ||
                  (i !== e && n !== e)) &&
                  (e > this.__selectionStartOnMouseDown
                    ? ((this.selectionStart = this.__selectionStartOnMouseDown),
                      (this.selectionEnd = e))
                    : ((this.selectionStart = e),
                      (this.selectionEnd = this.__selectionStartOnMouseDown)),
                  (this.selectionStart === i && this.selectionEnd === n) ||
                    (this.restartCursorIfNeeded(),
                    this._fireSelectionChanged(),
                    this._updateTextarea(),
                    this.renderCursorOrSelection()))
              }
            },
            _setEditingProps: function () {
              ;(this.hoverCursor = 'text'),
                this.canvas &&
                  (this.canvas.defaultCursor = this.canvas.moveCursor = 'text'),
                (this.borderColor = this.editingBorderColor),
                (this.hasControls = this.selectable = !1),
                (this.lockMovementX = this.lockMovementY = !0)
            },
            fromStringToGraphemeSelection: function (t, e, i) {
              var n = i.slice(0, t),
                s = E.util.string.graphemeSplit(n).length
              if (t === e) return { selectionStart: s, selectionEnd: s }
              var r = i.slice(t, e)
              return {
                selectionStart: s,
                selectionEnd: s + E.util.string.graphemeSplit(r).length
              }
            },
            fromGraphemeToStringSelection: function (t, e, i) {
              var n = i.slice(0, t).join('').length
              return t === e
                ? { selectionStart: n, selectionEnd: n }
                : {
                    selectionStart: n,
                    selectionEnd: n + i.slice(t, e).join('').length
                  }
            },
            _updateTextarea: function () {
              if (((this.cursorOffsetCache = {}), this.hiddenTextarea)) {
                if (!this.inCompositionMode) {
                  var t = this.fromGraphemeToStringSelection(
                    this.selectionStart,
                    this.selectionEnd,
                    this._text
                  )
                  ;(this.hiddenTextarea.selectionStart = t.selectionStart),
                    (this.hiddenTextarea.selectionEnd = t.selectionEnd)
                }
                this.updateTextareaPosition()
              }
            },
            updateFromTextArea: function () {
              if (this.hiddenTextarea) {
                ;(this.cursorOffsetCache = {}),
                  (this.text = this.hiddenTextarea.value),
                  this._shouldClearDimensionCache() &&
                    (this.initDimensions(), this.setCoords())
                var t = this.fromStringToGraphemeSelection(
                  this.hiddenTextarea.selectionStart,
                  this.hiddenTextarea.selectionEnd,
                  this.hiddenTextarea.value
                )
                ;(this.selectionEnd = this.selectionStart = t.selectionEnd),
                  this.inCompositionMode ||
                    (this.selectionStart = t.selectionStart),
                  this.updateTextareaPosition()
              }
            },
            updateTextareaPosition: function () {
              if (this.selectionStart === this.selectionEnd) {
                var t = this._calcTextareaPosition()
                ;(this.hiddenTextarea.style.left = t.left),
                  (this.hiddenTextarea.style.top = t.top)
              }
            },
            _calcTextareaPosition: function () {
              if (!this.canvas) return { x: 1, y: 1 }
              var t = this.inCompositionMode
                  ? this.compositionStart
                  : this.selectionStart,
                e = this._getCursorBoundaries(t),
                i = this.get2DCursorLocation(t),
                n = i.lineIndex,
                s = i.charIndex,
                r =
                  this.getValueOfPropertyAt(n, s, 'fontSize') * this.lineHeight,
                a = e.leftOffset,
                o = this.calcTransformMatrix(),
                l = { x: e.left + a, y: e.top + e.topOffset + r },
                c = this.canvas.getRetinaScaling(),
                h = this.canvas.upperCanvasEl,
                d = h.width / c,
                u = h.height / c,
                f = d - r,
                p = u - r,
                g = h.clientWidth / d,
                m = h.clientHeight / u
              return (
                (l = E.util.transformPoint(l, o)),
                ((l = E.util.transformPoint(
                  l,
                  this.canvas.viewportTransform
                )).x *= g),
                (l.y *= m),
                l.x < 0 && (l.x = 0),
                l.x > f && (l.x = f),
                l.y < 0 && (l.y = 0),
                l.y > p && (l.y = p),
                (l.x += this.canvas._offset.left),
                (l.y += this.canvas._offset.top),
                {
                  left: l.x + 'px',
                  top: l.y + 'px',
                  fontSize: r + 'px',
                  charHeight: r
                }
              )
            },
            _saveEditingProps: function () {
              this._savedProps = {
                hasControls: this.hasControls,
                borderColor: this.borderColor,
                lockMovementX: this.lockMovementX,
                lockMovementY: this.lockMovementY,
                hoverCursor: this.hoverCursor,
                selectable: this.selectable,
                defaultCursor: this.canvas && this.canvas.defaultCursor,
                moveCursor: this.canvas && this.canvas.moveCursor
              }
            },
            _restoreEditingProps: function () {
              this._savedProps &&
                ((this.hoverCursor = this._savedProps.hoverCursor),
                (this.hasControls = this._savedProps.hasControls),
                (this.borderColor = this._savedProps.borderColor),
                (this.selectable = this._savedProps.selectable),
                (this.lockMovementX = this._savedProps.lockMovementX),
                (this.lockMovementY = this._savedProps.lockMovementY),
                this.canvas &&
                  ((this.canvas.defaultCursor = this._savedProps.defaultCursor),
                  (this.canvas.moveCursor = this._savedProps.moveCursor)))
            },
            exitEditing: function () {
              var t = this._textBeforeEdit !== this.text,
                e = this.hiddenTextarea
              return (
                (this.selected = !1),
                (this.isEditing = !1),
                (this.selectionEnd = this.selectionStart),
                e &&
                  (e.blur && e.blur(),
                  e.parentNode && e.parentNode.removeChild(e)),
                (this.hiddenTextarea = null),
                this.abortCursorAnimation(),
                this._restoreEditingProps(),
                (this._currentCursorOpacity = 0),
                this._shouldClearDimensionCache() &&
                  (this.initDimensions(), this.setCoords()),
                this.fire('editing:exited'),
                t && this.fire('modified'),
                this.canvas &&
                  (this.canvas.off('mouse:move', this.mouseMoveHandler),
                  this.canvas.fire('text:editing:exited', { target: this }),
                  t && this.canvas.fire('object:modified', { target: this })),
                this
              )
            },
            _removeExtraneousStyles: function () {
              for (var t in this.styles)
                this._textLines[t] || delete this.styles[t]
            },
            removeStyleFromTo: function (t, e) {
              var i,
                n,
                s = this.get2DCursorLocation(t, !0),
                r = this.get2DCursorLocation(e, !0),
                a = s.lineIndex,
                o = s.charIndex,
                l = r.lineIndex,
                c = r.charIndex
              if (a !== l) {
                if (this.styles[a])
                  for (i = o; i < this._unwrappedTextLines[a].length; i++)
                    delete this.styles[a][i]
                if (this.styles[l])
                  for (i = c; i < this._unwrappedTextLines[l].length; i++)
                    (n = this.styles[l][i]) &&
                      (this.styles[a] || (this.styles[a] = {}),
                      (this.styles[a][o + i - c] = n))
                for (i = a + 1; i <= l; i++) delete this.styles[i]
                this.shiftLineStyles(l, a - l)
              } else if (this.styles[a]) {
                n = this.styles[a]
                var h,
                  d,
                  u = c - o
                for (i = o; i < c; i++) delete n[i]
                for (d in this.styles[a])
                  (h = parseInt(d, 10)) >= c && ((n[h - u] = n[d]), delete n[d])
              }
            },
            shiftLineStyles: function (t, e) {
              var i = C(this.styles)
              for (var n in this.styles) {
                var s = parseInt(n, 10)
                s > t &&
                  ((this.styles[s + e] = i[s]),
                  i[s - e] || delete this.styles[s])
              }
            },
            restartCursorIfNeeded: function () {
              ;(this._currentTickState &&
                !this._currentTickState.isAborted &&
                this._currentTickCompleteState &&
                !this._currentTickCompleteState.isAborted) ||
                this.initDelayedCursor()
            },
            insertNewlineStyleObject: function (t, e, i, n) {
              var s,
                r = {},
                a = !1,
                o = this._unwrappedTextLines[t].length === e
              for (var l in (i || (i = 1),
              this.shiftLineStyles(t, i),
              this.styles[t] && (s = this.styles[t][0 === e ? e : e - 1]),
              this.styles[t])) {
                var c = parseInt(l, 10)
                c >= e &&
                  ((a = !0),
                  (r[c - e] = this.styles[t][l]),
                  (o && 0 === e) || delete this.styles[t][l])
              }
              var h = !1
              for (
                a && !o && ((this.styles[t + i] = r), (h = !0)), h && i--;
                i > 0;

              )
                n && n[i - 1]
                  ? (this.styles[t + i] = { 0: C(n[i - 1]) })
                  : s
                  ? (this.styles[t + i] = { 0: C(s) })
                  : delete this.styles[t + i],
                  i--
              this._forceClearCache = !0
            },
            insertCharStyleObject: function (t, e, i, n) {
              this.styles || (this.styles = {})
              var s = this.styles[t],
                r = s ? C(s) : {}
              for (var a in (i || (i = 1), r)) {
                var o = parseInt(a, 10)
                o >= e && ((s[o + i] = r[o]), r[o - i] || delete s[o])
              }
              if (((this._forceClearCache = !0), n))
                for (; i--; )
                  Object.keys(n[i]).length &&
                    (this.styles[t] || (this.styles[t] = {}),
                    (this.styles[t][e + i] = C(n[i])))
              else if (s)
                for (var l = s[e ? e - 1 : 1]; l && i--; )
                  this.styles[t][e + i] = C(l)
            },
            insertNewStyleBlock: function (t, e, i) {
              for (
                var n = this.get2DCursorLocation(e, !0), s = [0], r = 0, a = 0;
                a < t.length;
                a++
              )
                '\n' === t[a] ? (s[++r] = 0) : s[r]++
              for (
                s[0] > 0 &&
                  (this.insertCharStyleObject(
                    n.lineIndex,
                    n.charIndex,
                    s[0],
                    i
                  ),
                  (i = i && i.slice(s[0] + 1))),
                  r &&
                    this.insertNewlineStyleObject(
                      n.lineIndex,
                      n.charIndex + s[0],
                      r
                    ),
                  a = 1;
                a < r;
                a++
              )
                s[a] > 0
                  ? this.insertCharStyleObject(n.lineIndex + a, 0, s[a], i)
                  : i &&
                    this.styles[n.lineIndex + a] &&
                    i[0] &&
                    (this.styles[n.lineIndex + a][0] = i[0]),
                  (i = i && i.slice(s[a] + 1))
              s[a] > 0 &&
                this.insertCharStyleObject(n.lineIndex + a, 0, s[a], i)
            },
            setSelectionStartEndWithShift: function (t, e, i) {
              i <= t
                ? (e === t
                    ? (this._selectionDirection = 'left')
                    : 'right' === this._selectionDirection &&
                      ((this._selectionDirection = 'left'),
                      (this.selectionEnd = t)),
                  (this.selectionStart = i))
                : i > t && i < e
                ? 'right' === this._selectionDirection
                  ? (this.selectionEnd = i)
                  : (this.selectionStart = i)
                : (e === t
                    ? (this._selectionDirection = 'right')
                    : 'left' === this._selectionDirection &&
                      ((this._selectionDirection = 'right'),
                      (this.selectionStart = e)),
                  (this.selectionEnd = i))
            },
            setSelectionInBoundaries: function () {
              var t = this.text.length
              this.selectionStart > t
                ? (this.selectionStart = t)
                : this.selectionStart < 0 && (this.selectionStart = 0),
                this.selectionEnd > t
                  ? (this.selectionEnd = t)
                  : this.selectionEnd < 0 && (this.selectionEnd = 0)
            }
          }),
          E.util.object.extend(E.IText.prototype, {
            initDoubleClickSimulation: function () {
              ;(this.__lastClickTime = +new Date()),
                (this.__lastLastClickTime = +new Date()),
                (this.__lastPointer = {}),
                this.on('mousedown', this.onMouseDown)
            },
            onMouseDown: function (t) {
              if (this.canvas) {
                this.__newClickTime = +new Date()
                var e = t.pointer
                this.isTripleClick(e) &&
                  (this.fire('tripleclick', t), this._stopEvent(t.e)),
                  (this.__lastLastClickTime = this.__lastClickTime),
                  (this.__lastClickTime = this.__newClickTime),
                  (this.__lastPointer = e),
                  (this.__lastIsEditing = this.isEditing),
                  (this.__lastSelected = this.selected)
              }
            },
            isTripleClick: function (t) {
              return (
                this.__newClickTime - this.__lastClickTime < 500 &&
                this.__lastClickTime - this.__lastLastClickTime < 500 &&
                this.__lastPointer.x === t.x &&
                this.__lastPointer.y === t.y
              )
            },
            _stopEvent: function (t) {
              t.preventDefault && t.preventDefault(),
                t.stopPropagation && t.stopPropagation()
            },
            initCursorSelectionHandlers: function () {
              this.initMousedownHandler(),
                this.initMouseupHandler(),
                this.initClicks()
            },
            doubleClickHandler: function (t) {
              this.isEditing &&
                this.selectWord(this.getSelectionStartFromPointer(t.e))
            },
            tripleClickHandler: function (t) {
              this.isEditing &&
                this.selectLine(this.getSelectionStartFromPointer(t.e))
            },
            initClicks: function () {
              this.on('mousedblclick', this.doubleClickHandler),
                this.on('tripleclick', this.tripleClickHandler)
            },
            _mouseDownHandler: function (t) {
              !this.canvas ||
                !this.editable ||
                (t.e.button && 1 !== t.e.button) ||
                ((this.__isMousedown = !0),
                this.selected &&
                  ((this.inCompositionMode = !1), this.setCursorByClick(t.e)),
                this.isEditing &&
                  ((this.__selectionStartOnMouseDown = this.selectionStart),
                  this.selectionStart === this.selectionEnd &&
                    this.abortCursorAnimation(),
                  this.renderCursorOrSelection()))
            },
            _mouseDownHandlerBefore: function (t) {
              !this.canvas ||
                !this.editable ||
                (t.e.button && 1 !== t.e.button) ||
                (this.selected = this === this.canvas._activeObject)
            },
            initMousedownHandler: function () {
              this.on('mousedown', this._mouseDownHandler),
                this.on('mousedown:before', this._mouseDownHandlerBefore)
            },
            initMouseupHandler: function () {
              this.on('mouseup', this.mouseUpHandler)
            },
            mouseUpHandler: function (t) {
              if (
                ((this.__isMousedown = !1),
                !(
                  !this.editable ||
                  this.group ||
                  (t.transform && t.transform.actionPerformed) ||
                  (t.e.button && 1 !== t.e.button)
                ))
              ) {
                if (this.canvas) {
                  var e = this.canvas._activeObject
                  if (e && e !== this) return
                }
                this.__lastSelected && !this.__corner
                  ? ((this.selected = !1),
                    (this.__lastSelected = !1),
                    this.enterEditing(t.e),
                    this.selectionStart === this.selectionEnd
                      ? this.initDelayedCursor(!0)
                      : this.renderCursorOrSelection())
                  : (this.selected = !0)
              }
            },
            setCursorByClick: function (t) {
              var e = this.getSelectionStartFromPointer(t),
                i = this.selectionStart,
                n = this.selectionEnd
              t.shiftKey
                ? this.setSelectionStartEndWithShift(i, n, e)
                : ((this.selectionStart = e), (this.selectionEnd = e)),
                this.isEditing &&
                  (this._fireSelectionChanged(), this._updateTextarea())
            },
            getSelectionStartFromPointer: function (t) {
              for (
                var e,
                  i = this.getLocalPointer(t),
                  n = 0,
                  s = 0,
                  r = 0,
                  a = 0,
                  o = 0,
                  l = 0,
                  c = this._textLines.length;
                l < c && r <= i.y;
                l++
              )
                (r += this.getHeightOfLine(l) * this.scaleY),
                  (o = l),
                  l > 0 &&
                    (a +=
                      this._textLines[l - 1].length +
                      this.missingNewlineOffset(l - 1))
              ;(s = this._getLineLeftOffset(o) * this.scaleX),
                (e = this._textLines[o]),
                'rtl' === this.direction &&
                  (i.x = this.width * this.scaleX - i.x + s)
              for (
                var h = 0, d = e.length;
                h < d &&
                ((n = s),
                (s += this.__charBounds[o][h].kernedWidth * this.scaleX) <=
                  i.x);
                h++
              )
                a++
              return this._getNewSelectionStartFromOffset(i, n, s, a, d)
            },
            _getNewSelectionStartFromOffset: function (t, e, i, n, s) {
              var r = t.x - e,
                a = i - t.x,
                o = n + (a > r || a < 0 ? 0 : 1)
              return (
                this.flipX && (o = s - o),
                o > this._text.length && (o = this._text.length),
                o
              )
            }
          }),
          E.util.object.extend(E.IText.prototype, {
            initHiddenTextarea: function () {
              ;(this.hiddenTextarea = E.document.createElement('textarea')),
                this.hiddenTextarea.setAttribute('autocapitalize', 'off'),
                this.hiddenTextarea.setAttribute('autocorrect', 'off'),
                this.hiddenTextarea.setAttribute('autocomplete', 'off'),
                this.hiddenTextarea.setAttribute('spellcheck', 'false'),
                this.hiddenTextarea.setAttribute(
                  'data-fabric-hiddentextarea',
                  ''
                ),
                this.hiddenTextarea.setAttribute('wrap', 'off')
              var t = this._calcTextareaPosition()
              ;(this.hiddenTextarea.style.cssText =
                'position: absolute; top: ' +
                t.top +
                '; left: ' +
                t.left +
                '; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; padding-top: ' +
                t.fontSize +
                ';'),
                this.hiddenTextareaContainer
                  ? this.hiddenTextareaContainer.appendChild(
                      this.hiddenTextarea
                    )
                  : E.document.body.appendChild(this.hiddenTextarea),
                E.util.addListener(
                  this.hiddenTextarea,
                  'keydown',
                  this.onKeyDown.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'keyup',
                  this.onKeyUp.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'input',
                  this.onInput.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'copy',
                  this.copy.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'cut',
                  this.copy.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'paste',
                  this.paste.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'compositionstart',
                  this.onCompositionStart.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'compositionupdate',
                  this.onCompositionUpdate.bind(this)
                ),
                E.util.addListener(
                  this.hiddenTextarea,
                  'compositionend',
                  this.onCompositionEnd.bind(this)
                ),
                !this._clickHandlerInitialized &&
                  this.canvas &&
                  (E.util.addListener(
                    this.canvas.upperCanvasEl,
                    'click',
                    this.onClick.bind(this)
                  ),
                  (this._clickHandlerInitialized = !0))
            },
            keysMap: {
              9: 'exitEditing',
              27: 'exitEditing',
              33: 'moveCursorUp',
              34: 'moveCursorDown',
              35: 'moveCursorRight',
              36: 'moveCursorLeft',
              37: 'moveCursorLeft',
              38: 'moveCursorUp',
              39: 'moveCursorRight',
              40: 'moveCursorDown'
            },
            keysMapRtl: {
              9: 'exitEditing',
              27: 'exitEditing',
              33: 'moveCursorUp',
              34: 'moveCursorDown',
              35: 'moveCursorLeft',
              36: 'moveCursorRight',
              37: 'moveCursorRight',
              38: 'moveCursorUp',
              39: 'moveCursorLeft',
              40: 'moveCursorDown'
            },
            ctrlKeysMapUp: { 67: 'copy', 88: 'cut' },
            ctrlKeysMapDown: { 65: 'selectAll' },
            onClick: function () {
              this.hiddenTextarea && this.hiddenTextarea.focus()
            },
            onKeyDown: function (t) {
              if (this.isEditing) {
                var e =
                  'rtl' === this.direction ? this.keysMapRtl : this.keysMap
                if (t.keyCode in e) this[e[t.keyCode]](t)
                else {
                  if (
                    !(t.keyCode in this.ctrlKeysMapDown) ||
                    (!t.ctrlKey && !t.metaKey)
                  )
                    return
                  this[this.ctrlKeysMapDown[t.keyCode]](t)
                }
                t.stopImmediatePropagation(),
                  t.preventDefault(),
                  t.keyCode >= 33 && t.keyCode <= 40
                    ? ((this.inCompositionMode = !1),
                      this.clearContextTop(),
                      this.renderCursorOrSelection())
                    : this.canvas && this.canvas.requestRenderAll()
              }
            },
            onKeyUp: function (t) {
              !this.isEditing || this._copyDone || this.inCompositionMode
                ? (this._copyDone = !1)
                : t.keyCode in this.ctrlKeysMapUp &&
                  (t.ctrlKey || t.metaKey) &&
                  (this[this.ctrlKeysMapUp[t.keyCode]](t),
                  t.stopImmediatePropagation(),
                  t.preventDefault(),
                  this.canvas && this.canvas.requestRenderAll())
            },
            onInput: function (t) {
              var e = this.fromPaste
              if (
                ((this.fromPaste = !1),
                t && t.stopPropagation(),
                this.isEditing)
              ) {
                var i,
                  n,
                  s,
                  r,
                  a,
                  o = this._splitTextIntoLines(
                    this.hiddenTextarea.value
                  ).graphemeText,
                  l = this._text.length,
                  c = o.length,
                  h = c - l,
                  d = this.selectionStart,
                  u = this.selectionEnd,
                  f = d !== u
                if ('' === this.hiddenTextarea.value)
                  return (
                    (this.styles = {}),
                    this.updateFromTextArea(),
                    this.fire('changed'),
                    void (
                      this.canvas &&
                      (this.canvas.fire('text:changed', { target: this }),
                      this.canvas.requestRenderAll())
                    )
                  )
                var p = this.fromStringToGraphemeSelection(
                    this.hiddenTextarea.selectionStart,
                    this.hiddenTextarea.selectionEnd,
                    this.hiddenTextarea.value
                  ),
                  g = d > p.selectionStart
                f
                  ? ((i = this._text.slice(d, u)), (h += u - d))
                  : c < l &&
                    (i = g
                      ? this._text.slice(u + h, u)
                      : this._text.slice(d, d - h)),
                  (n = o.slice(p.selectionEnd - h, p.selectionEnd)),
                  i &&
                    i.length &&
                    (n.length &&
                      ((s = this.getSelectionStyles(d, d + 1, !1)),
                      (s = n.map(function () {
                        return s[0]
                      }))),
                    f
                      ? ((r = d), (a = u))
                      : g
                      ? ((r = u - i.length), (a = u))
                      : ((r = u), (a = u + i.length)),
                    this.removeStyleFromTo(r, a)),
                  n.length &&
                    (e &&
                      n.join('') === E.copiedText &&
                      !E.disableStyleCopyPaste &&
                      (s = E.copiedTextStyle),
                    this.insertNewStyleBlock(n, d, s)),
                  this.updateFromTextArea(),
                  this.fire('changed'),
                  this.canvas &&
                    (this.canvas.fire('text:changed', { target: this }),
                    this.canvas.requestRenderAll())
              }
            },
            onCompositionStart: function () {
              this.inCompositionMode = !0
            },
            onCompositionEnd: function () {
              this.inCompositionMode = !1
            },
            onCompositionUpdate: function (t) {
              ;(this.compositionStart = t.target.selectionStart),
                (this.compositionEnd = t.target.selectionEnd),
                this.updateTextareaPosition()
            },
            copy: function () {
              this.selectionStart !== this.selectionEnd &&
                ((E.copiedText = this.getSelectedText()),
                E.disableStyleCopyPaste
                  ? (E.copiedTextStyle = null)
                  : (E.copiedTextStyle = this.getSelectionStyles(
                      this.selectionStart,
                      this.selectionEnd,
                      !0
                    )),
                (this._copyDone = !0))
            },
            paste: function () {
              this.fromPaste = !0
            },
            _getClipboardData: function (t) {
              return (t && t.clipboardData) || E.window.clipboardData
            },
            _getWidthBeforeCursor: function (t, e) {
              var i,
                n = this._getLineLeftOffset(t)
              return (
                e > 0 &&
                  (n += (i = this.__charBounds[t][e - 1]).left + i.width),
                n
              )
            },
            getDownCursorOffset: function (t, e) {
              var i = this._getSelectionForOffset(t, e),
                n = this.get2DCursorLocation(i),
                s = n.lineIndex
              if (
                s === this._textLines.length - 1 ||
                t.metaKey ||
                34 === t.keyCode
              )
                return this._text.length - i
              var r = n.charIndex,
                a = this._getWidthBeforeCursor(s, r),
                o = this._getIndexOnLine(s + 1, a)
              return (
                this._textLines[s].slice(r).length +
                o +
                1 +
                this.missingNewlineOffset(s)
              )
            },
            _getSelectionForOffset: function (t, e) {
              return t.shiftKey &&
                this.selectionStart !== this.selectionEnd &&
                e
                ? this.selectionEnd
                : this.selectionStart
            },
            getUpCursorOffset: function (t, e) {
              var i = this._getSelectionForOffset(t, e),
                n = this.get2DCursorLocation(i),
                s = n.lineIndex
              if (0 === s || t.metaKey || 33 === t.keyCode) return -i
              var r = n.charIndex,
                a = this._getWidthBeforeCursor(s, r),
                o = this._getIndexOnLine(s - 1, a),
                l = this._textLines[s].slice(0, r),
                c = this.missingNewlineOffset(s - 1)
              return -this._textLines[s - 1].length + o - l.length + (1 - c)
            },
            _getIndexOnLine: function (t, e) {
              for (
                var i,
                  n,
                  s = this._textLines[t],
                  r = this._getLineLeftOffset(t),
                  a = 0,
                  o = 0,
                  l = s.length;
                o < l;
                o++
              )
                if ((r += i = this.__charBounds[t][o].width) > e) {
                  n = !0
                  var c = r - i,
                    h = r,
                    d = Math.abs(c - e)
                  a = Math.abs(h - e) < d ? o : o - 1
                  break
                }
              return n || (a = s.length - 1), a
            },
            moveCursorDown: function (t) {
              ;(this.selectionStart >= this._text.length &&
                this.selectionEnd >= this._text.length) ||
                this._moveCursorUpOrDown('Down', t)
            },
            moveCursorUp: function (t) {
              ;(0 === this.selectionStart && 0 === this.selectionEnd) ||
                this._moveCursorUpOrDown('Up', t)
            },
            _moveCursorUpOrDown: function (t, e) {
              var i = this['get' + t + 'CursorOffset'](
                e,
                'right' === this._selectionDirection
              )
              e.shiftKey
                ? this.moveCursorWithShift(i)
                : this.moveCursorWithoutShift(i),
                0 !== i &&
                  (this.setSelectionInBoundaries(),
                  this.abortCursorAnimation(),
                  (this._currentCursorOpacity = 1),
                  this.initDelayedCursor(),
                  this._fireSelectionChanged(),
                  this._updateTextarea())
            },
            moveCursorWithShift: function (t) {
              var e =
                'left' === this._selectionDirection
                  ? this.selectionStart + t
                  : this.selectionEnd + t
              return (
                this.setSelectionStartEndWithShift(
                  this.selectionStart,
                  this.selectionEnd,
                  e
                ),
                0 !== t
              )
            },
            moveCursorWithoutShift: function (t) {
              return (
                t < 0
                  ? ((this.selectionStart += t),
                    (this.selectionEnd = this.selectionStart))
                  : ((this.selectionEnd += t),
                    (this.selectionStart = this.selectionEnd)),
                0 !== t
              )
            },
            moveCursorLeft: function (t) {
              ;(0 === this.selectionStart && 0 === this.selectionEnd) ||
                this._moveCursorLeftOrRight('Left', t)
            },
            _move: function (t, e, i) {
              var n
              if (t.altKey) n = this['findWordBoundary' + i](this[e])
              else {
                if (!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode)
                  return (this[e] += 'Left' === i ? -1 : 1), !0
                n = this['findLineBoundary' + i](this[e])
              }
              if (void 0 !== n && this[e] !== n) return (this[e] = n), !0
            },
            _moveLeft: function (t, e) {
              return this._move(t, e, 'Left')
            },
            _moveRight: function (t, e) {
              return this._move(t, e, 'Right')
            },
            moveCursorLeftWithoutShift: function (t) {
              var e = !0
              return (
                (this._selectionDirection = 'left'),
                this.selectionEnd === this.selectionStart &&
                  0 !== this.selectionStart &&
                  (e = this._moveLeft(t, 'selectionStart')),
                (this.selectionEnd = this.selectionStart),
                e
              )
            },
            moveCursorLeftWithShift: function (t) {
              return 'right' === this._selectionDirection &&
                this.selectionStart !== this.selectionEnd
                ? this._moveLeft(t, 'selectionEnd')
                : 0 !== this.selectionStart
                ? ((this._selectionDirection = 'left'),
                  this._moveLeft(t, 'selectionStart'))
                : void 0
            },
            moveCursorRight: function (t) {
              ;(this.selectionStart >= this._text.length &&
                this.selectionEnd >= this._text.length) ||
                this._moveCursorLeftOrRight('Right', t)
            },
            _moveCursorLeftOrRight: function (t, e) {
              var i = 'moveCursor' + t + 'With'
              ;(this._currentCursorOpacity = 1),
                e.shiftKey ? (i += 'Shift') : (i += 'outShift'),
                this[i](e) &&
                  (this.abortCursorAnimation(),
                  this.initDelayedCursor(),
                  this._fireSelectionChanged(),
                  this._updateTextarea())
            },
            moveCursorRightWithShift: function (t) {
              return 'left' === this._selectionDirection &&
                this.selectionStart !== this.selectionEnd
                ? this._moveRight(t, 'selectionStart')
                : this.selectionEnd !== this._text.length
                ? ((this._selectionDirection = 'right'),
                  this._moveRight(t, 'selectionEnd'))
                : void 0
            },
            moveCursorRightWithoutShift: function (t) {
              var e = !0
              return (
                (this._selectionDirection = 'right'),
                this.selectionStart === this.selectionEnd
                  ? ((e = this._moveRight(t, 'selectionStart')),
                    (this.selectionEnd = this.selectionStart))
                  : (this.selectionStart = this.selectionEnd),
                e
              )
            },
            removeChars: function (t, e) {
              void 0 === e && (e = t + 1),
                this.removeStyleFromTo(t, e),
                this._text.splice(t, e - t),
                (this.text = this._text.join('')),
                this.set('dirty', !0),
                this._shouldClearDimensionCache() &&
                  (this.initDimensions(), this.setCoords()),
                this._removeExtraneousStyles()
            },
            insertChars: function (t, e, i, n) {
              void 0 === n && (n = i), n > i && this.removeStyleFromTo(i, n)
              var s = E.util.string.graphemeSplit(t)
              this.insertNewStyleBlock(s, i, e),
                (this._text = [].concat(
                  this._text.slice(0, i),
                  s,
                  this._text.slice(n)
                )),
                (this.text = this._text.join('')),
                this.set('dirty', !0),
                this._shouldClearDimensionCache() &&
                  (this.initDimensions(), this.setCoords()),
                this._removeExtraneousStyles()
            }
          }),
          (S = E.util.toFixed),
          (T = /  +/g),
          E.util.object.extend(E.Text.prototype, {
            _toSVG: function () {
              var t = this._getSVGLeftTopOffsets(),
                e = this._getSVGTextAndBg(t.textTop, t.textLeft)
              return this._wrapSVGTextAndBg(e)
            },
            toSVG: function (t) {
              return this._createBaseSVGMarkup(this._toSVG(), {
                reviver: t,
                noStyle: !0,
                withShadow: !0
              })
            },
            _getSVGLeftTopOffsets: function () {
              return {
                textLeft: -this.width / 2,
                textTop: -this.height / 2,
                lineTop: this.getHeightOfLine(0)
              }
            },
            _wrapSVGTextAndBg: function (t) {
              var e = this.getSvgTextDecoration(this)
              return [
                t.textBgRects.join(''),
                '\t\t<text xml:space="preserve" ',
                this.fontFamily
                  ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" '
                  : '',
                this.fontSize ? 'font-size="' + this.fontSize + '" ' : '',
                this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : '',
                this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : '',
                e ? 'text-decoration="' + e + '" ' : '',
                'style="',
                this.getSvgStyles(!0),
                '"',
                this.addPaintOrder(),
                ' >',
                t.textSpans.join(''),
                '</text>\n'
              ]
            },
            _getSVGTextAndBg: function (t, e) {
              var i,
                n = [],
                s = [],
                r = t
              this._setSVGBg(s)
              for (var a = 0, o = this._textLines.length; a < o; a++)
                (i = this._getLineLeftOffset(a)),
                  (this.textBackgroundColor ||
                    this.styleHas('textBackgroundColor', a)) &&
                    this._setSVGTextLineBg(s, a, e + i, r),
                  this._setSVGTextLineText(n, a, e + i, r),
                  (r += this.getHeightOfLine(a))
              return { textSpans: n, textBgRects: s }
            },
            _createTextCharSpan: function (t, e, i, n) {
              var s = t !== t.trim() || t.match(T),
                r = this.getSvgSpanStyles(e, s),
                a = r ? 'style="' + r + '"' : '',
                o = e.deltaY,
                l = '',
                c = E.Object.NUM_FRACTION_DIGITS
              return (
                o && (l = ' dy="' + S(o, c) + '" '),
                [
                  '<tspan x="',
                  S(i, c),
                  '" y="',
                  S(n, c),
                  '" ',
                  l,
                  a,
                  '>',
                  E.util.string.escapeXml(t),
                  '</tspan>'
                ].join('')
              )
            },
            _setSVGTextLineText: function (t, e, i, n) {
              var s,
                r,
                a,
                o,
                l,
                c = this.getHeightOfLine(e),
                h = -1 !== this.textAlign.indexOf('justify'),
                d = '',
                u = 0,
                f = this._textLines[e]
              n += (c * (1 - this._fontSizeFraction)) / this.lineHeight
              for (var p = 0, g = f.length - 1; p <= g; p++)
                (l = p === g || this.charSpacing),
                  (d += f[p]),
                  (a = this.__charBounds[e][p]),
                  0 === u
                    ? ((i += a.kernedWidth - a.width), (u += a.width))
                    : (u += a.kernedWidth),
                  h && !l && this._reSpaceAndTab.test(f[p]) && (l = !0),
                  l ||
                    ((s = s || this.getCompleteStyleDeclaration(e, p)),
                    (r = this.getCompleteStyleDeclaration(e, p + 1)),
                    (l = E.util.hasStyleChanged(s, r, !0))),
                  l &&
                    ((o = this._getStyleDeclaration(e, p) || {}),
                    t.push(this._createTextCharSpan(d, o, i, n)),
                    (d = ''),
                    (s = r),
                    (i += u),
                    (u = 0))
            },
            _pushTextBgRect: function (t, e, i, n, s, r) {
              var a = E.Object.NUM_FRACTION_DIGITS
              t.push(
                '\t\t<rect ',
                this._getFillAttributes(e),
                ' x="',
                S(i, a),
                '" y="',
                S(n, a),
                '" width="',
                S(s, a),
                '" height="',
                S(r, a),
                '"></rect>\n'
              )
            },
            _setSVGTextLineBg: function (t, e, i, n) {
              for (
                var s,
                  r,
                  a = this._textLines[e],
                  o = this.getHeightOfLine(e) / this.lineHeight,
                  l = 0,
                  c = 0,
                  h = this.getValueOfPropertyAt(e, 0, 'textBackgroundColor'),
                  d = 0,
                  u = a.length;
                d < u;
                d++
              )
                (s = this.__charBounds[e][d]),
                  (r = this.getValueOfPropertyAt(
                    e,
                    d,
                    'textBackgroundColor'
                  )) !== h
                    ? (h && this._pushTextBgRect(t, h, i + c, n, l, o),
                      (c = s.left),
                      (l = s.width),
                      (h = r))
                    : (l += s.kernedWidth)
              r && this._pushTextBgRect(t, r, i + c, n, l, o)
            },
            _getFillAttributes: function (t) {
              var e = t && 'string' == typeof t ? new E.Color(t) : ''
              return e && e.getSource() && 1 !== e.getAlpha()
                ? 'opacity="' +
                    e.getAlpha() +
                    '" fill="' +
                    e.setAlpha(1).toRgb() +
                    '"'
                : 'fill="' + t + '"'
            },
            _getSVGLineTopOffset: function (t) {
              for (var e, i = 0, n = 0; n < t; n++) i += this.getHeightOfLine(n)
              return (
                (e = this.getHeightOfLine(n)),
                {
                  lineTop: i,
                  offset:
                    ((this._fontSizeMult - this._fontSizeFraction) * e) /
                    (this.lineHeight * this._fontSizeMult)
                }
              )
            },
            getSvgStyles: function (t) {
              return (
                E.Object.prototype.getSvgStyles.call(this, t) +
                ' white-space: pre;'
              )
            }
          }),
          (function (t) {
            'use strict'
            var e = t.fabric || (t.fabric = {})
            ;(e.Textbox = e.util.createClass(e.IText, e.Observable, {
              type: 'textbox',
              minWidth: 20,
              dynamicMinWidth: 2,
              __cachedLines: null,
              lockScalingFlip: !0,
              noScaleCache: !1,
              _dimensionAffectingProps:
                e.Text.prototype._dimensionAffectingProps.concat('width'),
              _wordJoiners: /[ \t\r]/,
              splitByGrapheme: !1,
              initDimensions: function () {
                this.__skipDimension ||
                  (this.isEditing && this.initDelayedCursor(),
                  this.clearContextTop(),
                  this._clearCache(),
                  (this.dynamicMinWidth = 0),
                  (this._styleMap = this._generateStyleMap(this._splitText())),
                  this.dynamicMinWidth > this.width &&
                    this._set('width', this.dynamicMinWidth),
                  -1 !== this.textAlign.indexOf('justify') &&
                    this.enlargeSpaces(),
                  (this.height = this.calcTextHeight()),
                  this.saveState({ propertySet: '_dimensionAffectingProps' }))
              },
              _generateStyleMap: function (t) {
                for (
                  var e = 0, i = 0, n = 0, s = {}, r = 0;
                  r < t.graphemeLines.length;
                  r++
                )
                  '\n' === t.graphemeText[n] && r > 0
                    ? ((i = 0), n++, e++)
                    : !this.splitByGrapheme &&
                      this._reSpaceAndTab.test(t.graphemeText[n]) &&
                      r > 0 &&
                      (i++, n++),
                    (s[r] = { line: e, offset: i }),
                    (n += t.graphemeLines[r].length),
                    (i += t.graphemeLines[r].length)
                return s
              },
              styleHas: function (t, i) {
                if (this._styleMap && !this.isWrapping) {
                  var n = this._styleMap[i]
                  n && (i = n.line)
                }
                return e.Text.prototype.styleHas.call(this, t, i)
              },
              isEmptyStyles: function (t) {
                if (!this.styles) return !0
                var e,
                  i,
                  n = 0,
                  s = !1,
                  r = this._styleMap[t],
                  a = this._styleMap[t + 1]
                for (var o in (r && ((t = r.line), (n = r.offset)),
                a && ((s = a.line === t), (e = a.offset)),
                (i = void 0 === t ? this.styles : { line: this.styles[t] })))
                  for (var l in i[o])
                    if (l >= n && (!s || l < e))
                      for (var c in i[o][l]) return !1
                return !0
              },
              _getStyleDeclaration: function (t, e) {
                if (this._styleMap && !this.isWrapping) {
                  var i = this._styleMap[t]
                  if (!i) return null
                  ;(t = i.line), (e = i.offset + e)
                }
                return this.callSuper('_getStyleDeclaration', t, e)
              },
              _setStyleDeclaration: function (t, e, i) {
                var n = this._styleMap[t]
                ;(t = n.line), (e = n.offset + e), (this.styles[t][e] = i)
              },
              _deleteStyleDeclaration: function (t, e) {
                var i = this._styleMap[t]
                ;(t = i.line), (e = i.offset + e), delete this.styles[t][e]
              },
              _getLineStyle: function (t) {
                var e = this._styleMap[t]
                return !!this.styles[e.line]
              },
              _setLineStyle: function (t) {
                var e = this._styleMap[t]
                this.styles[e.line] = {}
              },
              _wrapText: function (t, e) {
                var i,
                  n = []
                for (this.isWrapping = !0, i = 0; i < t.length; i++)
                  n = n.concat(this._wrapLine(t[i], i, e))
                return (this.isWrapping = !1), n
              },
              _measureWord: function (t, e, i) {
                var n,
                  s = 0
                i = i || 0
                for (var r = 0, a = t.length; r < a; r++)
                  (s += this._getGraphemeBox(
                    t[r],
                    e,
                    r + i,
                    n,
                    !0
                  ).kernedWidth),
                    (n = t[r])
                return s
              },
              _wrapLine: function (t, i, n, s) {
                var r = 0,
                  a = this.splitByGrapheme,
                  o = [],
                  l = [],
                  c = a
                    ? e.util.string.graphemeSplit(t)
                    : t.split(this._wordJoiners),
                  h = '',
                  d = 0,
                  u = a ? '' : ' ',
                  f = 0,
                  p = 0,
                  g = 0,
                  m = !0,
                  v = this._getWidthOfCharSpacing()
                ;(s = s || 0), 0 === c.length && c.push([]), (n -= s)
                for (var b = 0; b < c.length; b++)
                  (h = a ? c[b] : e.util.string.graphemeSplit(c[b])),
                    (f = this._measureWord(h, i, d)),
                    (d += h.length),
                    (r += p + f - v) > n && !m
                      ? (o.push(l), (l = []), (r = f), (m = !0))
                      : (r += v),
                    m || a || l.push(u),
                    (l = l.concat(h)),
                    (p = a ? 0 : this._measureWord([u], i, d)),
                    d++,
                    (m = !1),
                    f > g && (g = f)
                return (
                  b && o.push(l),
                  g + s > this.dynamicMinWidth &&
                    (this.dynamicMinWidth = g - v + s),
                  o
                )
              },
              isEndOfWrapping: function (t) {
                return (
                  !this._styleMap[t + 1] ||
                  this._styleMap[t + 1].line !== this._styleMap[t].line
                )
              },
              missingNewlineOffset: function (t) {
                return this.splitByGrapheme
                  ? this.isEndOfWrapping(t)
                    ? 1
                    : 0
                  : 1
              },
              _splitTextIntoLines: function (t) {
                for (
                  var i = e.Text.prototype._splitTextIntoLines.call(this, t),
                    n = this._wrapText(i.lines, this.width),
                    s = new Array(n.length),
                    r = 0;
                  r < n.length;
                  r++
                )
                  s[r] = n[r].join('')
                return (i.lines = s), (i.graphemeLines = n), i
              },
              getMinWidth: function () {
                return Math.max(this.minWidth, this.dynamicMinWidth)
              },
              _removeExtraneousStyles: function () {
                var t = {}
                for (var e in this._styleMap)
                  this._textLines[e] && (t[this._styleMap[e].line] = 1)
                for (var e in this.styles) t[e] || delete this.styles[e]
              },
              toObject: function (t) {
                return this.callSuper(
                  'toObject',
                  ['minWidth', 'splitByGrapheme'].concat(t)
                )
              }
            })),
              (e.Textbox.fromObject = function (t, i) {
                var n = e.util.stylesFromArray(t.styles, t.text),
                  s = Object.assign({}, t, { styles: n })
                return e.Object._fromObject('Textbox', s, i, 'text')
              })
          })(e),
          (function () {
            var t = E.controlsUtils,
              e = t.scaleSkewCursorStyleHandler,
              i = t.scaleCursorStyleHandler,
              n = t.scalingEqually,
              s = t.scalingYOrSkewingX,
              r = t.scalingXOrSkewingY,
              a = t.scaleOrSkewActionName,
              o = E.Object.prototype.controls
            if (
              ((o.ml = new E.Control({
                x: -0.5,
                y: 0,
                cursorStyleHandler: e,
                actionHandler: r,
                getActionName: a
              })),
              (o.mr = new E.Control({
                x: 0.5,
                y: 0,
                cursorStyleHandler: e,
                actionHandler: r,
                getActionName: a
              })),
              (o.mb = new E.Control({
                x: 0,
                y: 0.5,
                cursorStyleHandler: e,
                actionHandler: s,
                getActionName: a
              })),
              (o.mt = new E.Control({
                x: 0,
                y: -0.5,
                cursorStyleHandler: e,
                actionHandler: s,
                getActionName: a
              })),
              (o.tl = new E.Control({
                x: -0.5,
                y: -0.5,
                cursorStyleHandler: i,
                actionHandler: n
              })),
              (o.tr = new E.Control({
                x: 0.5,
                y: -0.5,
                cursorStyleHandler: i,
                actionHandler: n
              })),
              (o.bl = new E.Control({
                x: -0.5,
                y: 0.5,
                cursorStyleHandler: i,
                actionHandler: n
              })),
              (o.br = new E.Control({
                x: 0.5,
                y: 0.5,
                cursorStyleHandler: i,
                actionHandler: n
              })),
              (o.mtr = new E.Control({
                x: 0,
                y: -0.5,
                actionHandler: t.rotationWithSnapping,
                cursorStyleHandler: t.rotationStyleHandler,
                offsetY: -40,
                withConnection: !0,
                actionName: 'rotate'
              })),
              E.Textbox)
            ) {
              var l = (E.Textbox.prototype.controls = {})
              ;(l.mtr = o.mtr),
                (l.tr = o.tr),
                (l.br = o.br),
                (l.tl = o.tl),
                (l.bl = o.bl),
                (l.mt = o.mt),
                (l.mb = o.mb),
                (l.mr = new E.Control({
                  x: 0.5,
                  y: 0,
                  actionHandler: t.changeWidth,
                  cursorStyleHandler: e,
                  actionName: 'resizing'
                })),
                (l.ml = new E.Control({
                  x: -0.5,
                  y: 0,
                  actionHandler: t.changeWidth,
                  cursorStyleHandler: e,
                  actionName: 'resizing'
                }))
            }
          })()
      },
      331: function (t) {
        t.exports = (function () {
          'use strict'
          var t = function () {},
            e = Object.prototype.hasOwnProperty,
            i = Array.prototype.slice
          function n (t, n, s) {
            for (
              var r, a, o = 0, l = (s = i.call(arguments, 2)).length;
              o < l;
              o++
            )
              for (r in (a = s[o])) (t && !e.call(a, r)) || (n[r] = a[r])
          }
          var s = function (e, i, s, r) {
            var a = this
            return (
              'string' != typeof e && ((r = s), (s = i), (i = e), (e = null)),
              'function' != typeof i &&
                ((r = s),
                (s = i),
                (i = function () {
                  return a.apply(this, arguments)
                })),
              n(!1, i, a, r),
              (i.prototype = (function (e, i) {
                var s
                return (
                  'function' == typeof Object.create
                    ? (s = Object.create(e))
                    : ((t.prototype = e), (s = new t()), (t.prototype = null)),
                  i && n(!0, s, i),
                  s
                )
              })(a.prototype, s)),
              (i.prototype.constructor = i),
              (i.class_ = e || a.class_),
              (i.super_ = a),
              i
            )
          }
          function r () {}
          ;(r.class_ = 'Nevis'), (r.super_ = Object), (r.extend = s)
          var a = r,
            o = a.extend(
              function (t, e, i) {
                ;(this.qrious = t),
                  (this.element = e),
                  (this.element.qrious = t),
                  (this.enabled = Boolean(i))
              },
              {
                draw: function (t) {},
                getElement: function () {
                  return (
                    this.enabled || ((this.enabled = !0), this.render()),
                    this.element
                  )
                },
                getModuleSize: function (t) {
                  var e = this.qrious,
                    i = e.padding || 0,
                    n = Math.floor((e.size - 2 * i) / t.width)
                  return Math.max(1, n)
                },
                getOffset: function (t) {
                  var e = this.qrious,
                    i = e.padding
                  if (null != i) return i
                  var n = this.getModuleSize(t),
                    s = Math.floor((e.size - n * t.width) / 2)
                  return Math.max(0, s)
                },
                render: function (t) {
                  this.enabled && (this.resize(), this.reset(), this.draw(t))
                },
                reset: function () {},
                resize: function () {}
              }
            ),
            l = o.extend({
              draw: function (t) {
                var e,
                  i,
                  n = this.qrious,
                  s = this.getModuleSize(t),
                  r = this.getOffset(t),
                  a = this.element.getContext('2d')
                for (
                  a.fillStyle = n.foreground,
                    a.globalAlpha = n.foregroundAlpha,
                    e = 0;
                  e < t.width;
                  e++
                )
                  for (i = 0; i < t.width; i++)
                    t.buffer[i * t.width + e] &&
                      a.fillRect(s * e + r, s * i + r, s, s)
              },
              reset: function () {
                var t = this.qrious,
                  e = this.element.getContext('2d'),
                  i = t.size
                ;(e.lineWidth = 1),
                  e.clearRect(0, 0, i, i),
                  (e.fillStyle = t.background),
                  (e.globalAlpha = t.backgroundAlpha),
                  e.fillRect(0, 0, i, i)
              },
              resize: function () {
                var t = this.element
                t.width = t.height = this.qrious.size
              }
            }),
            c = a.extend(null, {
              BLOCK: [
                0, 11, 15, 19, 23, 27, 31, 16, 18, 20, 22, 24, 26, 28, 20, 22,
                24, 24, 26, 28, 28, 22, 24, 24, 26, 26, 28, 28, 24, 24, 26, 26,
                26, 28, 28, 24, 26, 26, 26, 28, 28
              ]
            }),
            h = a.extend(null, {
              BLOCKS: [
                1, 0, 19, 7, 1, 0, 16, 10, 1, 0, 13, 13, 1, 0, 9, 17, 1, 0, 34,
                10, 1, 0, 28, 16, 1, 0, 22, 22, 1, 0, 16, 28, 1, 0, 55, 15, 1,
                0, 44, 26, 2, 0, 17, 18, 2, 0, 13, 22, 1, 0, 80, 20, 2, 0, 32,
                18, 2, 0, 24, 26, 4, 0, 9, 16, 1, 0, 108, 26, 2, 0, 43, 24, 2,
                2, 15, 18, 2, 2, 11, 22, 2, 0, 68, 18, 4, 0, 27, 16, 4, 0, 19,
                24, 4, 0, 15, 28, 2, 0, 78, 20, 4, 0, 31, 18, 2, 4, 14, 18, 4,
                1, 13, 26, 2, 0, 97, 24, 2, 2, 38, 22, 4, 2, 18, 22, 4, 2, 14,
                26, 2, 0, 116, 30, 3, 2, 36, 22, 4, 4, 16, 20, 4, 4, 12, 24, 2,
                2, 68, 18, 4, 1, 43, 26, 6, 2, 19, 24, 6, 2, 15, 28, 4, 0, 81,
                20, 1, 4, 50, 30, 4, 4, 22, 28, 3, 8, 12, 24, 2, 2, 92, 24, 6,
                2, 36, 22, 4, 6, 20, 26, 7, 4, 14, 28, 4, 0, 107, 26, 8, 1, 37,
                22, 8, 4, 20, 24, 12, 4, 11, 22, 3, 1, 115, 30, 4, 5, 40, 24,
                11, 5, 16, 20, 11, 5, 12, 24, 5, 1, 87, 22, 5, 5, 41, 24, 5, 7,
                24, 30, 11, 7, 12, 24, 5, 1, 98, 24, 7, 3, 45, 28, 15, 2, 19,
                24, 3, 13, 15, 30, 1, 5, 107, 28, 10, 1, 46, 28, 1, 15, 22, 28,
                2, 17, 14, 28, 5, 1, 120, 30, 9, 4, 43, 26, 17, 1, 22, 28, 2,
                19, 14, 28, 3, 4, 113, 28, 3, 11, 44, 26, 17, 4, 21, 26, 9, 16,
                13, 26, 3, 5, 107, 28, 3, 13, 41, 26, 15, 5, 24, 30, 15, 10, 15,
                28, 4, 4, 116, 28, 17, 0, 42, 26, 17, 6, 22, 28, 19, 6, 16, 30,
                2, 7, 111, 28, 17, 0, 46, 28, 7, 16, 24, 30, 34, 0, 13, 24, 4,
                5, 121, 30, 4, 14, 47, 28, 11, 14, 24, 30, 16, 14, 15, 30, 6, 4,
                117, 30, 6, 14, 45, 28, 11, 16, 24, 30, 30, 2, 16, 30, 8, 4,
                106, 26, 8, 13, 47, 28, 7, 22, 24, 30, 22, 13, 15, 30, 10, 2,
                114, 28, 19, 4, 46, 28, 28, 6, 22, 28, 33, 4, 16, 30, 8, 4, 122,
                30, 22, 3, 45, 28, 8, 26, 23, 30, 12, 28, 15, 30, 3, 10, 117,
                30, 3, 23, 45, 28, 4, 31, 24, 30, 11, 31, 15, 30, 7, 7, 116, 30,
                21, 7, 45, 28, 1, 37, 23, 30, 19, 26, 15, 30, 5, 10, 115, 30,
                19, 10, 47, 28, 15, 25, 24, 30, 23, 25, 15, 30, 13, 3, 115, 30,
                2, 29, 46, 28, 42, 1, 24, 30, 23, 28, 15, 30, 17, 0, 115, 30,
                10, 23, 46, 28, 10, 35, 24, 30, 19, 35, 15, 30, 17, 1, 115, 30,
                14, 21, 46, 28, 29, 19, 24, 30, 11, 46, 15, 30, 13, 6, 115, 30,
                14, 23, 46, 28, 44, 7, 24, 30, 59, 1, 16, 30, 12, 7, 121, 30,
                12, 26, 47, 28, 39, 14, 24, 30, 22, 41, 15, 30, 6, 14, 121, 30,
                6, 34, 47, 28, 46, 10, 24, 30, 2, 64, 15, 30, 17, 4, 122, 30,
                29, 14, 46, 28, 49, 10, 24, 30, 24, 46, 15, 30, 4, 18, 122, 30,
                13, 32, 46, 28, 48, 14, 24, 30, 42, 32, 15, 30, 20, 4, 117, 30,
                40, 7, 47, 28, 43, 22, 24, 30, 10, 67, 15, 30, 19, 6, 118, 30,
                18, 31, 47, 28, 34, 34, 24, 30, 20, 61, 15, 30
              ],
              FINAL_FORMAT: [
                30660, 29427, 32170, 30877, 26159, 25368, 27713, 26998, 21522,
                20773, 24188, 23371, 17913, 16590, 20375, 19104, 13663, 12392,
                16177, 14854, 9396, 8579, 11994, 11245, 5769, 5054, 7399, 6608,
                1890, 597, 3340, 2107
              ],
              LEVELS: { L: 1, M: 2, Q: 3, H: 4 }
            }),
            d = a.extend(null, {
              EXPONENT: [
                1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38,
                76, 152, 45, 90, 180, 117, 234, 201, 143, 3, 6, 12, 24, 48, 96,
                192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238,
                193, 159, 35, 70, 140, 5, 10, 20, 40, 80, 160, 93, 186, 105,
                210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188,
                101, 202, 137, 15, 30, 60, 120, 240, 253, 231, 211, 187, 107,
                214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175,
                67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208, 189, 103, 206,
                129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151,
                51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169, 79, 158, 33,
                66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73,
                146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99, 198, 145,
                63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171,
                75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87, 174, 65, 130,
                25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83,
                166, 81, 162, 89, 178, 121, 242, 249, 239, 195, 155, 43, 86,
                172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243,
                251, 235, 203, 139, 11, 22, 44, 88, 176, 125, 250, 233, 207,
                131, 27, 54, 108, 216, 173, 71, 142, 0
              ],
              LOG: [
                255, 0, 1, 25, 2, 50, 26, 198, 3, 223, 51, 238, 27, 104, 199,
                75, 4, 100, 224, 14, 52, 141, 239, 129, 28, 193, 105, 248, 200,
                8, 76, 113, 5, 138, 101, 47, 225, 36, 15, 33, 53, 147, 142, 218,
                240, 18, 130, 69, 29, 181, 194, 125, 106, 39, 249, 185, 201,
                154, 9, 120, 77, 228, 114, 166, 6, 191, 139, 98, 102, 221, 48,
                253, 226, 152, 37, 179, 16, 145, 34, 136, 54, 208, 148, 206,
                143, 150, 219, 189, 241, 210, 19, 92, 131, 56, 70, 64, 30, 66,
                182, 163, 195, 72, 126, 110, 107, 58, 40, 84, 250, 133, 186, 61,
                202, 94, 155, 159, 10, 21, 121, 43, 78, 212, 229, 172, 115, 243,
                167, 87, 7, 112, 192, 247, 140, 128, 99, 13, 103, 74, 222, 237,
                49, 197, 254, 24, 227, 165, 153, 119, 38, 184, 180, 124, 17, 68,
                146, 217, 35, 32, 137, 46, 55, 63, 209, 91, 149, 188, 207, 205,
                144, 135, 151, 178, 220, 252, 190, 97, 242, 86, 211, 171, 20,
                42, 93, 158, 132, 60, 57, 83, 71, 109, 65, 162, 31, 45, 67, 216,
                183, 123, 164, 118, 196, 23, 73, 236, 127, 12, 111, 246, 108,
                161, 59, 82, 41, 157, 85, 170, 251, 96, 134, 177, 187, 204, 62,
                90, 203, 89, 95, 176, 156, 169, 160, 81, 11, 245, 22, 235, 122,
                117, 44, 215, 79, 174, 213, 233, 230, 231, 173, 232, 116, 214,
                244, 234, 168, 80, 88, 175
              ]
            }),
            u = a.extend(null, {
              BLOCK: [
                3220, 1468, 2713, 1235, 3062, 1890, 2119, 1549, 2344, 2936,
                1117, 2583, 1330, 2470, 1667, 2249, 2028, 3780, 481, 4011, 142,
                3098, 831, 3445, 592, 2517, 1776, 2234, 1951, 2827, 1070, 2660,
                1345, 3177
              ]
            }),
            f = a.extend(
              function (t) {
                var e,
                  i,
                  n,
                  s,
                  r,
                  a = t.value.length
                for (
                  this._badness = [],
                    this._level = h.LEVELS[t.level],
                    this._polynomial = [],
                    this._value = t.value,
                    this._version = 0,
                    this._stringBuffer = [];
                  this._version < 40 &&
                  (this._version++,
                  (n = 4 * (this._level - 1) + 16 * (this._version - 1)),
                  (s = h.BLOCKS[n++]),
                  (r = h.BLOCKS[n++]),
                  (e = h.BLOCKS[n++]),
                  (i = h.BLOCKS[n]),
                  !(a <= (n = e * (s + r) + r - 3 + (this._version <= 9))));

                );
                ;(this._dataBlock = e),
                  (this._eccBlock = i),
                  (this._neccBlock1 = s),
                  (this._neccBlock2 = r)
                var o = (this.width = 17 + 4 * this._version)
                ;(this.buffer = f._createArray(o * o)),
                  (this._ecc = f._createArray(e + (e + i) * (s + r) + r)),
                  (this._mask = f._createArray((o * (o + 1) + 1) / 2)),
                  this._insertFinders(),
                  this._insertAlignments(),
                  (this.buffer[8 + o * (o - 8)] = 1),
                  this._insertTimingGap(),
                  this._reverseMask(),
                  this._insertTimingRowAndColumn(),
                  this._insertVersion(),
                  this._syncMask(),
                  this._convertBitStream(a),
                  this._calculatePolynomial(),
                  this._appendEccToData(),
                  this._interleaveBlocks(),
                  this._pack(),
                  this._finish()
              },
              {
                _addAlignment: function (t, e) {
                  var i,
                    n = this.buffer,
                    s = this.width
                  for (n[t + s * e] = 1, i = -2; i < 2; i++)
                    (n[t + i + s * (e - 2)] = 1),
                      (n[t - 2 + s * (e + i + 1)] = 1),
                      (n[t + 2 + s * (e + i)] = 1),
                      (n[t + i + 1 + s * (e + 2)] = 1)
                  for (i = 0; i < 2; i++)
                    this._setMask(t - 1, e + i),
                      this._setMask(t + 1, e - i),
                      this._setMask(t - i, e - 1),
                      this._setMask(t + i, e + 1)
                },
                _appendData: function (t, e, i, n) {
                  var s,
                    r,
                    a,
                    o = this._polynomial,
                    l = this._stringBuffer
                  for (r = 0; r < n; r++) l[i + r] = 0
                  for (r = 0; r < e; r++) {
                    if (255 !== (s = d.LOG[l[t + r] ^ l[i]]))
                      for (a = 1; a < n; a++)
                        l[i + a - 1] =
                          l[i + a] ^ d.EXPONENT[f._modN(s + o[n - a])]
                    else for (a = i; a < i + n; a++) l[a] = l[a + 1]
                    l[i + n - 1] = 255 === s ? 0 : d.EXPONENT[f._modN(s + o[0])]
                  }
                },
                _appendEccToData: function () {
                  var t,
                    e = 0,
                    i = this._dataBlock,
                    n = this._calculateMaxLength(),
                    s = this._eccBlock
                  for (t = 0; t < this._neccBlock1; t++)
                    this._appendData(e, i, n, s), (e += i), (n += s)
                  for (t = 0; t < this._neccBlock2; t++)
                    this._appendData(e, i + 1, n, s), (e += i + 1), (n += s)
                },
                _applyMask: function (t) {
                  var e,
                    i,
                    n,
                    s,
                    r = this.buffer,
                    a = this.width
                  switch (t) {
                    case 0:
                      for (s = 0; s < a; s++)
                        for (n = 0; n < a; n++)
                          (n + s) & 1 ||
                            this._isMasked(n, s) ||
                            (r[n + s * a] ^= 1)
                      break
                    case 1:
                      for (s = 0; s < a; s++)
                        for (n = 0; n < a; n++)
                          1 & s || this._isMasked(n, s) || (r[n + s * a] ^= 1)
                      break
                    case 2:
                      for (s = 0; s < a; s++)
                        for (e = 0, n = 0; n < a; n++, e++)
                          3 === e && (e = 0),
                            e || this._isMasked(n, s) || (r[n + s * a] ^= 1)
                      break
                    case 3:
                      for (i = 0, s = 0; s < a; s++, i++)
                        for (3 === i && (i = 0), e = i, n = 0; n < a; n++, e++)
                          3 === e && (e = 0),
                            e || this._isMasked(n, s) || (r[n + s * a] ^= 1)
                      break
                    case 4:
                      for (s = 0; s < a; s++)
                        for (e = 0, i = (s >> 1) & 1, n = 0; n < a; n++, e++)
                          3 === e && ((e = 0), (i = !i)),
                            i || this._isMasked(n, s) || (r[n + s * a] ^= 1)
                      break
                    case 5:
                      for (i = 0, s = 0; s < a; s++, i++)
                        for (3 === i && (i = 0), e = 0, n = 0; n < a; n++, e++)
                          3 === e && (e = 0),
                            (n & s & 1) + !(!e | !i) ||
                              this._isMasked(n, s) ||
                              (r[n + s * a] ^= 1)
                      break
                    case 6:
                      for (i = 0, s = 0; s < a; s++, i++)
                        for (3 === i && (i = 0), e = 0, n = 0; n < a; n++, e++)
                          3 === e && (e = 0),
                            ((n & s & 1) + (e && e === i)) & 1 ||
                              this._isMasked(n, s) ||
                              (r[n + s * a] ^= 1)
                      break
                    case 7:
                      for (i = 0, s = 0; s < a; s++, i++)
                        for (3 === i && (i = 0), e = 0, n = 0; n < a; n++, e++)
                          3 === e && (e = 0),
                            ((e && e === i) + ((n + s) & 1)) & 1 ||
                              this._isMasked(n, s) ||
                              (r[n + s * a] ^= 1)
                  }
                },
                _calculateMaxLength: function () {
                  return (
                    this._dataBlock * (this._neccBlock1 + this._neccBlock2) +
                    this._neccBlock2
                  )
                },
                _calculatePolynomial: function () {
                  var t,
                    e,
                    i = this._eccBlock,
                    n = this._polynomial
                  for (n[0] = 1, t = 0; t < i; t++) {
                    for (n[t + 1] = 1, e = t; e > 0; e--)
                      n[e] = n[e]
                        ? n[e - 1] ^ d.EXPONENT[f._modN(d.LOG[n[e]] + t)]
                        : n[e - 1]
                    n[0] = d.EXPONENT[f._modN(d.LOG[n[0]] + t)]
                  }
                  for (t = 0; t <= i; t++) n[t] = d.LOG[n[t]]
                },
                _checkBadness: function () {
                  var t,
                    e,
                    i,
                    n,
                    s,
                    r = 0,
                    a = this._badness,
                    o = this.buffer,
                    l = this.width
                  for (s = 0; s < l - 1; s++)
                    for (n = 0; n < l - 1; n++)
                      ((o[n + l * s] &&
                        o[n + 1 + l * s] &&
                        o[n + l * (s + 1)] &&
                        o[n + 1 + l * (s + 1)]) ||
                        !(
                          o[n + l * s] ||
                          o[n + 1 + l * s] ||
                          o[n + l * (s + 1)] ||
                          o[n + 1 + l * (s + 1)]
                        )) &&
                        (r += f.N2)
                  var c = 0
                  for (s = 0; s < l; s++) {
                    for (i = 0, a[0] = 0, t = 0, n = 0; n < l; n++)
                      t === (e = o[n + l * s]) ? a[i]++ : (a[++i] = 1),
                        (c += (t = e) ? 1 : -1)
                    r += this._getBadness(i)
                  }
                  c < 0 && (c = -c)
                  var h = 0,
                    d = c
                  for (d += d << 2, d <<= 1; d > l * l; ) (d -= l * l), h++
                  for (r += h * f.N4, n = 0; n < l; n++) {
                    for (i = 0, a[0] = 0, t = 0, s = 0; s < l; s++)
                      t === (e = o[n + l * s]) ? a[i]++ : (a[++i] = 1), (t = e)
                    r += this._getBadness(i)
                  }
                  return r
                },
                _convertBitStream: function (t) {
                  var e,
                    i,
                    n = this._ecc,
                    s = this._version
                  for (i = 0; i < t; i++) n[i] = this._value.charCodeAt(i)
                  var r = (this._stringBuffer = n.slice()),
                    a = this._calculateMaxLength()
                  t >= a - 2 && ((t = a - 2), s > 9 && t--)
                  var o = t
                  if (s > 9) {
                    for (r[o + 2] = 0, r[o + 3] = 0; o--; )
                      (e = r[o]),
                        (r[o + 3] |= 255 & (e << 4)),
                        (r[o + 2] = e >> 4)
                    ;(r[2] |= 255 & (t << 4)),
                      (r[1] = t >> 4),
                      (r[0] = 64 | (t >> 12))
                  } else {
                    for (r[o + 1] = 0, r[o + 2] = 0; o--; )
                      (e = r[o]),
                        (r[o + 2] |= 255 & (e << 4)),
                        (r[o + 1] = e >> 4)
                    ;(r[1] |= 255 & (t << 4)), (r[0] = 64 | (t >> 4))
                  }
                  for (o = t + 3 - (s < 10); o < a; )
                    (r[o++] = 236), (r[o++] = 17)
                },
                _getBadness: function (t) {
                  var e,
                    i = 0,
                    n = this._badness
                  for (e = 0; e <= t; e++) n[e] >= 5 && (i += f.N1 + n[e] - 5)
                  for (e = 3; e < t - 1; e += 2)
                    n[e - 2] === n[e + 2] &&
                      n[e + 2] === n[e - 1] &&
                      n[e - 1] === n[e + 1] &&
                      3 * n[e - 1] === n[e] &&
                      (0 === n[e - 3] ||
                        e + 3 > t ||
                        3 * n[e - 3] >= 4 * n[e] ||
                        3 * n[e + 3] >= 4 * n[e]) &&
                      (i += f.N3)
                  return i
                },
                _finish: function () {
                  var t, e
                  this._stringBuffer = this.buffer.slice()
                  var i = 0,
                    n = 3e4
                  for (
                    e = 0;
                    e < 8 &&
                    (this._applyMask(e),
                    (t = this._checkBadness()) < n && ((n = t), (i = e)),
                    7 !== i);
                    e++
                  )
                    this.buffer = this._stringBuffer.slice()
                  i !== e && this._applyMask(i),
                    (n = h.FINAL_FORMAT[i + ((this._level - 1) << 3)])
                  var s = this.buffer,
                    r = this.width
                  for (e = 0; e < 8; e++, n >>= 1)
                    1 & n &&
                      ((s[r - 1 - e + 8 * r] = 1),
                      e < 6 ? (s[8 + r * e] = 1) : (s[8 + r * (e + 1)] = 1))
                  for (e = 0; e < 7; e++, n >>= 1)
                    1 & n &&
                      ((s[8 + r * (r - 7 + e)] = 1),
                      e ? (s[6 - e + 8 * r] = 1) : (s[7 + 8 * r] = 1))
                },
                _interleaveBlocks: function () {
                  var t,
                    e,
                    i = this._dataBlock,
                    n = this._ecc,
                    s = this._eccBlock,
                    r = 0,
                    a = this._calculateMaxLength(),
                    o = this._neccBlock1,
                    l = this._neccBlock2,
                    c = this._stringBuffer
                  for (t = 0; t < i; t++) {
                    for (e = 0; e < o; e++) n[r++] = c[t + e * i]
                    for (e = 0; e < l; e++) n[r++] = c[o * i + t + e * (i + 1)]
                  }
                  for (e = 0; e < l; e++) n[r++] = c[o * i + t + e * (i + 1)]
                  for (t = 0; t < s; t++)
                    for (e = 0; e < o + l; e++) n[r++] = c[a + t + e * s]
                  this._stringBuffer = n
                },
                _insertAlignments: function () {
                  var t,
                    e,
                    i,
                    n = this._version,
                    s = this.width
                  if (n > 1)
                    for (t = c.BLOCK[n], i = s - 7; ; ) {
                      for (
                        e = s - 7;
                        e > t - 3 && (this._addAlignment(e, i), !(e < t));

                      )
                        e -= t
                      if (i <= t + 9) break
                      ;(i -= t),
                        this._addAlignment(6, i),
                        this._addAlignment(i, 6)
                    }
                },
                _insertFinders: function () {
                  var t,
                    e,
                    i,
                    n,
                    s = this.buffer,
                    r = this.width
                  for (t = 0; t < 3; t++) {
                    for (
                      e = 0,
                        n = 0,
                        1 === t && (e = r - 7),
                        2 === t && (n = r - 7),
                        s[n + 3 + r * (e + 3)] = 1,
                        i = 0;
                      i < 6;
                      i++
                    )
                      (s[n + i + r * e] = 1),
                        (s[n + r * (e + i + 1)] = 1),
                        (s[n + 6 + r * (e + i)] = 1),
                        (s[n + i + 1 + r * (e + 6)] = 1)
                    for (i = 1; i < 5; i++)
                      this._setMask(n + i, e + 1),
                        this._setMask(n + 1, e + i + 1),
                        this._setMask(n + 5, e + i),
                        this._setMask(n + i + 1, e + 5)
                    for (i = 2; i < 4; i++)
                      (s[n + i + r * (e + 2)] = 1),
                        (s[n + 2 + r * (e + i + 1)] = 1),
                        (s[n + 4 + r * (e + i)] = 1),
                        (s[n + i + 1 + r * (e + 4)] = 1)
                  }
                },
                _insertTimingGap: function () {
                  var t,
                    e,
                    i = this.width
                  for (e = 0; e < 7; e++)
                    this._setMask(7, e),
                      this._setMask(i - 8, e),
                      this._setMask(7, e + i - 7)
                  for (t = 0; t < 8; t++)
                    this._setMask(t, 7),
                      this._setMask(t + i - 8, 7),
                      this._setMask(t, i - 8)
                },
                _insertTimingRowAndColumn: function () {
                  var t,
                    e = this.buffer,
                    i = this.width
                  for (t = 0; t < i - 14; t++)
                    1 & t
                      ? (this._setMask(8 + t, 6), this._setMask(6, 8 + t))
                      : ((e[8 + t + 6 * i] = 1), (e[6 + i * (8 + t)] = 1))
                },
                _insertVersion: function () {
                  var t,
                    e,
                    i,
                    n,
                    s = this.buffer,
                    r = this._version,
                    a = this.width
                  if (r > 6)
                    for (t = u.BLOCK[r - 7], e = 17, i = 0; i < 6; i++)
                      for (n = 0; n < 3; n++, e--)
                        1 & (e > 11 ? r >> (e - 12) : t >> e)
                          ? ((s[5 - i + a * (2 - n + a - 11)] = 1),
                            (s[2 - n + a - 11 + a * (5 - i)] = 1))
                          : (this._setMask(5 - i, 2 - n + a - 11),
                            this._setMask(2 - n + a - 11, 5 - i))
                },
                _isMasked: function (t, e) {
                  var i = f._getMaskBit(t, e)
                  return 1 === this._mask[i]
                },
                _pack: function () {
                  var t,
                    e,
                    i,
                    n = 1,
                    s = 1,
                    r = this.width,
                    a = r - 1,
                    o = r - 1,
                    l =
                      (this._dataBlock + this._eccBlock) *
                        (this._neccBlock1 + this._neccBlock2) +
                      this._neccBlock2
                  for (e = 0; e < l; e++)
                    for (
                      t = this._stringBuffer[e], i = 0;
                      i < 8;
                      i++, t <<= 1
                    ) {
                      128 & t && (this.buffer[a + r * o] = 1)
                      do {
                        s
                          ? a--
                          : (a++,
                            n
                              ? 0 !== o
                                ? o--
                                : ((n = !n), 6 == (a -= 2) && (a--, (o = 9)))
                              : o !== r - 1
                              ? o++
                              : ((n = !n), 6 == (a -= 2) && (a--, (o -= 8)))),
                          (s = !s)
                      } while (this._isMasked(a, o))
                    }
                },
                _reverseMask: function () {
                  var t,
                    e,
                    i = this.width
                  for (t = 0; t < 9; t++) this._setMask(t, 8)
                  for (t = 0; t < 8; t++)
                    this._setMask(t + i - 8, 8), this._setMask(8, t)
                  for (e = 0; e < 7; e++) this._setMask(8, e + i - 7)
                },
                _setMask: function (t, e) {
                  var i = f._getMaskBit(t, e)
                  this._mask[i] = 1
                },
                _syncMask: function () {
                  var t,
                    e,
                    i = this.width
                  for (e = 0; e < i; e++)
                    for (t = 0; t <= e; t++)
                      this.buffer[t + i * e] && this._setMask(t, e)
                }
              },
              {
                _createArray: function (t) {
                  var e,
                    i = []
                  for (e = 0; e < t; e++) i[e] = 0
                  return i
                },
                _getMaskBit: function (t, e) {
                  var i
                  return (
                    t > e && ((i = t), (t = e), (e = i)),
                    (i = e),
                    (i += e * e),
                    (i >>= 1) + t
                  )
                },
                _modN: function (t) {
                  for (; t >= 255; ) t = ((t -= 255) >> 8) + (255 & t)
                  return t
                },
                N1: 3,
                N2: 3,
                N3: 40,
                N4: 10
              }
            ),
            p = f,
            g = o.extend({
              draw: function () {
                this.element.src = this.qrious.toDataURL()
              },
              reset: function () {
                this.element.src = ''
              },
              resize: function () {
                var t = this.element
                t.width = t.height = this.qrious.size
              }
            }),
            m = a.extend(
              function (t, e, i, n) {
                ;(this.name = t),
                  (this.modifiable = Boolean(e)),
                  (this.defaultValue = i),
                  (this._valueTransformer = n)
              },
              {
                transform: function (t) {
                  var e = this._valueTransformer
                  return 'function' == typeof e ? e(t, this) : t
                }
              }
            ),
            v = a.extend(null, {
              abs: function (t) {
                return null != t ? Math.abs(t) : null
              },
              hasOwn: function (t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
              },
              noop: function () {},
              toUpperCase: function (t) {
                return null != t ? t.toUpperCase() : null
              }
            }),
            b = a.extend(
              function (t) {
                ;(this.options = {}),
                  t.forEach(function (t) {
                    this.options[t.name] = t
                  }, this)
              },
              {
                exists: function (t) {
                  return null != this.options[t]
                },
                get: function (t, e) {
                  return b._get(this.options[t], e)
                },
                getAll: function (t) {
                  var e,
                    i = this.options,
                    n = {}
                  for (e in i) v.hasOwn(i, e) && (n[e] = b._get(i[e], t))
                  return n
                },
                init: function (t, e, i) {
                  var n, s
                  for (n in ('function' != typeof i && (i = v.noop),
                  this.options))
                    v.hasOwn(this.options, n) &&
                      ((s = this.options[n]),
                      b._set(s, s.defaultValue, e),
                      b._createAccessor(s, e, i))
                  this._setAll(t, e, !0)
                },
                set: function (t, e, i) {
                  return this._set(t, e, i)
                },
                setAll: function (t, e) {
                  return this._setAll(t, e)
                },
                _set: function (t, e, i, n) {
                  var s = this.options[t]
                  if (!s) throw new Error('Invalid option: ' + t)
                  if (!s.modifiable && !n)
                    throw new Error('Option cannot be modified: ' + t)
                  return b._set(s, e, i)
                },
                _setAll: function (t, e, i) {
                  if (!t) return !1
                  var n,
                    s = !1
                  for (n in t)
                    v.hasOwn(t, n) && this._set(n, t[n], e, i) && (s = !0)
                  return s
                }
              },
              {
                _createAccessor: function (t, e, i) {
                  var n = {
                    get: function () {
                      return b._get(t, e)
                    }
                  }
                  t.modifiable &&
                    (n.set = function (n) {
                      b._set(t, n, e) && i(n, t)
                    }),
                    Object.defineProperty(e, t.name, n)
                },
                _get: function (t, e) {
                  return e['_' + t.name]
                },
                _set: function (t, e, i) {
                  var n = '_' + t.name,
                    s = i[n],
                    r = t.transform(null != e ? e : t.defaultValue)
                  return (i[n] = r), r !== s
                }
              }
            ),
            y = b,
            x = a.extend(
              function () {
                this._services = {}
              },
              {
                getService: function (t) {
                  var e = this._services[t]
                  if (!e)
                    throw new Error(
                      'Service is not being managed with name: ' + t
                    )
                  return e
                },
                setService: function (t, e) {
                  if (this._services[t])
                    throw new Error(
                      'Service is already managed with name: ' + t
                    )
                  e && (this._services[t] = e)
                }
              }
            ),
            w = new y([
              new m('background', !0, 'white'),
              new m('backgroundAlpha', !0, 1, v.abs),
              new m('element'),
              new m('foreground', !0, 'black'),
              new m('foregroundAlpha', !0, 1, v.abs),
              new m('level', !0, 'L', v.toUpperCase),
              new m('mime', !0, 'image/png'),
              new m('padding', !0, null, v.abs),
              new m('size', !0, 100, v.abs),
              new m('value', !0, '')
            ]),
            C = new x(),
            S = a.extend(
              function (t) {
                w.init(t, this, this.update.bind(this))
                var e = w.get('element', this),
                  i = C.getService('element'),
                  n = e && i.isCanvas(e) ? e : i.createCanvas(),
                  s = e && i.isImage(e) ? e : i.createImage()
                ;(this._canvasRenderer = new l(this, n, !0)),
                  (this._imageRenderer = new g(this, s, s === e)),
                  this.update()
              },
              {
                get: function () {
                  return w.getAll(this)
                },
                set: function (t) {
                  w.setAll(t, this) && this.update()
                },
                toDataURL: function (t) {
                  return this.canvas.toDataURL(t || this.mime)
                },
                update: function () {
                  var t = new p({ level: this.level, value: this.value })
                  this._canvasRenderer.render(t), this._imageRenderer.render(t)
                }
              },
              {
                use: function (t) {
                  C.setService(t.getName(), t)
                }
              }
            )
          Object.defineProperties(S.prototype, {
            canvas: {
              get: function () {
                return this._canvasRenderer.getElement()
              }
            },
            image: {
              get: function () {
                return this._imageRenderer.getElement()
              }
            }
          })
          var T = S,
            E = a
              .extend({ getName: function () {} })
              .extend({
                createCanvas: function () {},
                createImage: function () {},
                getName: function () {
                  return 'element'
                },
                isCanvas: function (t) {},
                isImage: function (t) {}
              })
              .extend({
                createCanvas: function () {
                  return document.createElement('canvas')
                },
                createImage: function () {
                  return document.createElement('img')
                },
                isCanvas: function (t) {
                  return t instanceof HTMLCanvasElement
                },
                isImage: function (t) {
                  return t instanceof HTMLImageElement
                }
              })
          return T.use(new E()), T
        })()
      },
      933: (t, e, i) => {
        var n
        !(function () {
          function s (t, e, i) {
            return t.call.apply(t.bind, arguments)
          }
          function r (t, e, i) {
            if (!t) throw Error()
            if (2 < arguments.length) {
              var n = Array.prototype.slice.call(arguments, 2)
              return function () {
                var i = Array.prototype.slice.call(arguments)
                return Array.prototype.unshift.apply(i, n), t.apply(e, i)
              }
            }
            return function () {
              return t.apply(e, arguments)
            }
          }
          function a (t, e, i) {
            return (a =
              Function.prototype.bind &&
              -1 != Function.prototype.bind.toString().indexOf('native code')
                ? s
                : r).apply(null, arguments)
          }
          var o =
            Date.now ||
            function () {
              return +new Date()
            }
          function l (t, e) {
            ;(this.a = t), (this.o = e || t), (this.c = this.o.document)
          }
          var c = !!window.FontFace
          function h (t, e, i, n) {
            if (((e = t.c.createElement(e)), i))
              for (var s in i)
                i.hasOwnProperty(s) &&
                  ('style' == s
                    ? (e.style.cssText = i[s])
                    : e.setAttribute(s, i[s]))
            return n && e.appendChild(t.c.createTextNode(n)), e
          }
          function d (t, e, i) {
            ;(t = t.c.getElementsByTagName(e)[0]) ||
              (t = document.documentElement),
              t.insertBefore(i, t.lastChild)
          }
          function u (t) {
            t.parentNode && t.parentNode.removeChild(t)
          }
          function f (t, e, i) {
            ;(e = e || []), (i = i || [])
            for (
              var n = t.className.split(/\s+/), s = 0;
              s < e.length;
              s += 1
            ) {
              for (var r = !1, a = 0; a < n.length; a += 1)
                if (e[s] === n[a]) {
                  r = !0
                  break
                }
              r || n.push(e[s])
            }
            for (e = [], s = 0; s < n.length; s += 1) {
              for (r = !1, a = 0; a < i.length; a += 1)
                if (n[s] === i[a]) {
                  r = !0
                  break
                }
              r || e.push(n[s])
            }
            t.className = e
              .join(' ')
              .replace(/\s+/g, ' ')
              .replace(/^\s+|\s+$/, '')
          }
          function p (t, e) {
            for (
              var i = t.className.split(/\s+/), n = 0, s = i.length;
              n < s;
              n++
            )
              if (i[n] == e) return !0
            return !1
          }
          function g (t, e, i) {
            function n () {
              o && s && r && (o(a), (o = null))
            }
            e = h(t, 'link', { rel: 'stylesheet', href: e, media: 'all' })
            var s = !1,
              r = !0,
              a = null,
              o = i || null
            c
              ? ((e.onload = function () {
                  ;(s = !0), n()
                }),
                (e.onerror = function () {
                  ;(s = !0), (a = Error('Stylesheet failed to load')), n()
                }))
              : setTimeout(function () {
                  ;(s = !0), n()
                }, 0),
              d(t, 'head', e)
          }
          function m (t, e, i, n) {
            var s = t.c.getElementsByTagName('head')[0]
            if (s) {
              var r = h(t, 'script', { src: e }),
                a = !1
              return (
                (r.onload = r.onreadystatechange =
                  function () {
                    a ||
                      (this.readyState &&
                        'loaded' != this.readyState &&
                        'complete' != this.readyState) ||
                      ((a = !0),
                      i && i(null),
                      (r.onload = r.onreadystatechange = null),
                      'HEAD' == r.parentNode.tagName && s.removeChild(r))
                  }),
                s.appendChild(r),
                setTimeout(function () {
                  a || ((a = !0), i && i(Error('Script load timeout')))
                }, n || 5e3),
                r
              )
            }
            return null
          }
          function v () {
            ;(this.a = 0), (this.c = null)
          }
          function b (t) {
            return (
              t.a++,
              function () {
                t.a--, x(t)
              }
            )
          }
          function y (t, e) {
            ;(t.c = e), x(t)
          }
          function x (t) {
            0 == t.a && t.c && (t.c(), (t.c = null))
          }
          function w (t) {
            this.a = t || '-'
          }
          function C (t, e) {
            ;(this.c = t), (this.f = 4), (this.a = 'n')
            var i = (e || 'n4').match(/^([nio])([1-9])$/i)
            i && ((this.a = i[1]), (this.f = parseInt(i[2], 10)))
          }
          function S (t) {
            var e = []
            t = t.split(/,\s*/)
            for (var i = 0; i < t.length; i++) {
              var n = t[i].replace(/['"]/g, '')
              ;-1 != n.indexOf(' ') || /^\d/.test(n)
                ? e.push("'" + n + "'")
                : e.push(n)
            }
            return e.join(',')
          }
          function T (t) {
            return t.a + t.f
          }
          function E (t) {
            var e = 'normal'
            return (
              'o' === t.a ? (e = 'oblique') : 'i' === t.a && (e = 'italic'), e
            )
          }
          function A (t) {
            var e = 4,
              i = 'n',
              n = null
            return (
              t &&
                ((n = t.match(/(normal|oblique|italic)/i)) &&
                  n[1] &&
                  (i = n[1].substr(0, 1).toLowerCase()),
                (n = t.match(/([1-9]00|normal|bold)/i)) &&
                  n[1] &&
                  (/bold/i.test(n[1])
                    ? (e = 7)
                    : /[1-9]00/.test(n[1]) &&
                      (e = parseInt(n[1].substr(0, 1), 10)))),
              i + e
            )
          }
          function I (t, e) {
            ;(this.c = t),
              (this.f = t.o.document.documentElement),
              (this.h = e),
              (this.a = new w('-')),
              (this.j = !1 !== e.events),
              (this.g = !1 !== e.classes)
          }
          function O (t) {
            if (t.g) {
              var e = p(t.f, t.a.c('wf', 'active')),
                i = [],
                n = [t.a.c('wf', 'loading')]
              e || i.push(t.a.c('wf', 'inactive')), f(t.f, i, n)
            }
            k(t, 'inactive')
          }
          function k (t, e, i) {
            t.j && t.h[e] && (i ? t.h[e](i.c, T(i)) : t.h[e]())
          }
          function M () {
            this.c = {}
          }
          function P (t, e) {
            ;(this.c = t),
              (this.f = e),
              (this.a = h(this.c, 'span', { 'aria-hidden': 'true' }, this.f))
          }
          function _ (t) {
            d(t.c, 'body', t.a)
          }
          function D (t) {
            return (
              'display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:' +
              S(t.c) +
              ';font-style:' +
              E(t) +
              ';font-weight:' +
              t.f +
              '00;'
            )
          }
          function L (t, e, i, n, s, r) {
            ;(this.g = t),
              (this.j = e),
              (this.a = n),
              (this.c = i),
              (this.f = s || 3e3),
              (this.h = r || void 0)
          }
          function B (t, e, i, n, s, r, a) {
            ;(this.v = t),
              (this.B = e),
              (this.c = i),
              (this.a = n),
              (this.s = a || 'BESbswy'),
              (this.f = {}),
              (this.w = s || 3e3),
              (this.u = r || null),
              (this.m = this.j = this.h = this.g = null),
              (this.g = new P(this.c, this.s)),
              (this.h = new P(this.c, this.s)),
              (this.j = new P(this.c, this.s)),
              (this.m = new P(this.c, this.s)),
              (t = D((t = new C(this.a.c + ',serif', T(this.a))))),
              (this.g.a.style.cssText = t),
              (t = D((t = new C(this.a.c + ',sans-serif', T(this.a))))),
              (this.h.a.style.cssText = t),
              (t = D((t = new C('serif', T(this.a))))),
              (this.j.a.style.cssText = t),
              (t = D((t = new C('sans-serif', T(this.a))))),
              (this.m.a.style.cssText = t),
              _(this.g),
              _(this.h),
              _(this.j),
              _(this.m)
          }
          ;(w.prototype.c = function (t) {
            for (var e = [], i = 0; i < arguments.length; i++)
              e.push(arguments[i].replace(/[\W_]+/g, '').toLowerCase())
            return e.join(this.a)
          }),
            (L.prototype.start = function () {
              var t = this.c.o.document,
                e = this,
                i = o(),
                n = new Promise(function (n, s) {
                  !(function r () {
                    o() - i >= e.f
                      ? s()
                      : t.fonts
                          .load(
                            (function (t) {
                              return E(t) + ' ' + t.f + '00 300px ' + S(t.c)
                            })(e.a),
                            e.h
                          )
                          .then(
                            function (t) {
                              1 <= t.length ? n() : setTimeout(r, 25)
                            },
                            function () {
                              s()
                            }
                          )
                  })()
                }),
                s = null,
                r = new Promise(function (t, i) {
                  s = setTimeout(i, e.f)
                })
              Promise.race([r, n]).then(
                function () {
                  s && (clearTimeout(s), (s = null)), e.g(e.a)
                },
                function () {
                  e.j(e.a)
                }
              )
            })
          var F = { D: 'serif', C: 'sans-serif' },
            j = null
          function R () {
            if (null === j) {
              var t = /AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(
                window.navigator.userAgent
              )
              j =
                !!t &&
                (536 > parseInt(t[1], 10) ||
                  (536 === parseInt(t[1], 10) && 11 >= parseInt(t[2], 10)))
            }
            return j
          }
          function N (t, e, i) {
            for (var n in F)
              if (F.hasOwnProperty(n) && e === t.f[F[n]] && i === t.f[F[n]])
                return !0
            return !1
          }
          function H (t) {
            var e,
              i = t.g.a.offsetWidth,
              n = t.h.a.offsetWidth
            ;(e = i === t.f.serif && n === t.f['sans-serif']) ||
              (e = R() && N(t, i, n)),
              e
                ? o() - t.A >= t.w
                  ? R() &&
                    N(t, i, n) &&
                    (null === t.u || t.u.hasOwnProperty(t.a.c))
                    ? z(t, t.v)
                    : z(t, t.B)
                  : (function (t) {
                      setTimeout(
                        a(function () {
                          H(this)
                        }, t),
                        50
                      )
                    })(t)
                : z(t, t.v)
          }
          function z (t, e) {
            setTimeout(
              a(function () {
                u(this.g.a), u(this.h.a), u(this.j.a), u(this.m.a), e(this.a)
              }, t),
              0
            )
          }
          function W (t, e, i) {
            ;(this.c = t),
              (this.a = e),
              (this.f = 0),
              (this.m = this.j = !1),
              (this.s = i)
          }
          B.prototype.start = function () {
            ;(this.f.serif = this.j.a.offsetWidth),
              (this.f['sans-serif'] = this.m.a.offsetWidth),
              (this.A = o()),
              H(this)
          }
          var V = null
          function U (t) {
            0 == --t.f &&
              t.j &&
              (t.m
                ? ((t = t.a).g &&
                    f(
                      t.f,
                      [t.a.c('wf', 'active')],
                      [t.a.c('wf', 'loading'), t.a.c('wf', 'inactive')]
                    ),
                  k(t, 'active'))
                : O(t.a))
          }
          function Y (t) {
            ;(this.j = t),
              (this.a = new M()),
              (this.h = 0),
              (this.f = this.g = !0)
          }
          function G (t, e, i, n, s) {
            var r = 0 == --t.h
            ;(t.f || t.g) &&
              setTimeout(function () {
                var t = s || null,
                  o = n || {}
                if (0 === i.length && r) O(e.a)
                else {
                  ;(e.f += i.length), r && (e.j = r)
                  var l,
                    c = []
                  for (l = 0; l < i.length; l++) {
                    var h = i[l],
                      d = o[h.c],
                      u = e.a,
                      p = h
                    if (
                      (u.g &&
                        f(u.f, [u.a.c('wf', p.c, T(p).toString(), 'loading')]),
                      k(u, 'fontloading', p),
                      (u = null),
                      null === V)
                    )
                      if (window.FontFace) {
                        p = /Gecko.*Firefox\/(\d+)/.exec(
                          window.navigator.userAgent
                        )
                        var g =
                          /OS X.*Version\/10\..*Safari/.exec(
                            window.navigator.userAgent
                          ) && /Apple/.exec(window.navigator.vendor)
                        V = p ? 42 < parseInt(p[1], 10) : !g
                      } else V = !1
                    ;(u = V
                      ? new L(a(e.g, e), a(e.h, e), e.c, h, e.s, d)
                      : new B(a(e.g, e), a(e.h, e), e.c, h, e.s, t, d)),
                      c.push(u)
                  }
                  for (l = 0; l < c.length; l++) c[l].start()
                }
              }, 0)
          }
          function q (t, e) {
            ;(this.c = t), (this.a = e)
          }
          function X (t, e) {
            ;(this.c = t), (this.a = e)
          }
          function Z (t, e) {
            ;(this.c = t || J), (this.a = []), (this.f = []), (this.g = e || '')
          }
          ;(W.prototype.g = function (t) {
            var e = this.a
            e.g &&
              f(
                e.f,
                [e.a.c('wf', t.c, T(t).toString(), 'active')],
                [
                  e.a.c('wf', t.c, T(t).toString(), 'loading'),
                  e.a.c('wf', t.c, T(t).toString(), 'inactive')
                ]
              ),
              k(e, 'fontactive', t),
              (this.m = !0),
              U(this)
          }),
            (W.prototype.h = function (t) {
              var e = this.a
              if (e.g) {
                var i = p(e.f, e.a.c('wf', t.c, T(t).toString(), 'active')),
                  n = [],
                  s = [e.a.c('wf', t.c, T(t).toString(), 'loading')]
                i || n.push(e.a.c('wf', t.c, T(t).toString(), 'inactive')),
                  f(e.f, n, s)
              }
              k(e, 'fontinactive', t), U(this)
            }),
            (Y.prototype.load = function (t) {
              ;(this.c = new l(this.j, t.context || this.j)),
                (this.g = !1 !== t.events),
                (this.f = !1 !== t.classes),
                (function (t, e, i) {
                  var n = [],
                    s = i.timeout
                  !(function (t) {
                    t.g && f(t.f, [t.a.c('wf', 'loading')]), k(t, 'loading')
                  })(e),
                    (n = (function (t, e, i) {
                      var n,
                        s = []
                      for (n in e)
                        if (e.hasOwnProperty(n)) {
                          var r = t.c[n]
                          r && s.push(r(e[n], i))
                        }
                      return s
                    })(t.a, i, t.c))
                  var r = new W(t.c, e, s)
                  for (t.h = n.length, e = 0, i = n.length; e < i; e++)
                    n[e].load(function (e, i, n) {
                      G(t, r, e, i, n)
                    })
                })(this, new I(this.c, t), t)
            }),
            (q.prototype.load = function (t) {
              function e () {
                if (r['__mti_fntLst' + n]) {
                  var i,
                    s = r['__mti_fntLst' + n](),
                    a = []
                  if (s)
                    for (var o = 0; o < s.length; o++) {
                      var l = s[o].fontfamily
                      null != s[o].fontStyle && null != s[o].fontWeight
                        ? ((i = s[o].fontStyle + s[o].fontWeight),
                          a.push(new C(l, i)))
                        : a.push(new C(l))
                    }
                  t(a)
                } else
                  setTimeout(function () {
                    e()
                  }, 50)
              }
              var i = this,
                n = i.a.projectId,
                s = i.a.version
              if (n) {
                var r = i.c.o
                m(
                  this.c,
                  (i.a.api || 'https://fast.fonts.net/jsapi') +
                    '/' +
                    n +
                    '.js' +
                    (s ? '?v=' + s : ''),
                  function (s) {
                    s
                      ? t([])
                      : ((r['__MonotypeConfiguration__' + n] = function () {
                          return i.a
                        }),
                        e())
                  }
                ).id = '__MonotypeAPIScript__' + n
              } else t([])
            }),
            (X.prototype.load = function (t) {
              var e,
                i,
                n = this.a.urls || [],
                s = this.a.families || [],
                r = this.a.testStrings || {},
                a = new v()
              for (e = 0, i = n.length; e < i; e++) g(this.c, n[e], b(a))
              var o = []
              for (e = 0, i = s.length; e < i; e++)
                if ((n = s[e].split(':'))[1])
                  for (var l = n[1].split(','), c = 0; c < l.length; c += 1)
                    o.push(new C(n[0], l[c]))
                else o.push(new C(n[0]))
              y(a, function () {
                t(o, r)
              })
            })
          var J = 'https://fonts.googleapis.com/css'
          function Q (t) {
            ;(this.f = t), (this.a = []), (this.c = {})
          }
          var K = {
              latin: 'BESbswy',
              'latin-ext': 'çöüğş',
              cyrillic: 'йяЖ',
              greek: 'αβΣ',
              khmer: 'កខគ',
              Hanuman: 'កខគ'
            },
            $ = {
              thin: '1',
              extralight: '2',
              'extra-light': '2',
              ultralight: '2',
              'ultra-light': '2',
              light: '3',
              regular: '4',
              book: '4',
              medium: '5',
              'semi-bold': '6',
              semibold: '6',
              'demi-bold': '6',
              demibold: '6',
              bold: '7',
              'extra-bold': '8',
              extrabold: '8',
              'ultra-bold': '8',
              ultrabold: '8',
              black: '9',
              heavy: '9',
              l: '3',
              r: '4',
              b: '7'
            },
            tt = { i: 'i', italic: 'i', n: 'n', normal: 'n' },
            et =
              /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/
          function it (t, e) {
            ;(this.c = t), (this.a = e)
          }
          var nt = { Arimo: !0, Cousine: !0, Tinos: !0 }
          function st (t, e) {
            ;(this.c = t), (this.a = e)
          }
          function rt (t, e) {
            ;(this.c = t), (this.f = e), (this.a = [])
          }
          ;(it.prototype.load = function (t) {
            var e = new v(),
              i = this.c,
              n = new Z(this.a.api, this.a.text),
              s = this.a.families
            !(function (t, e) {
              for (var i = e.length, n = 0; n < i; n++) {
                var s = e[n].split(':')
                3 == s.length && t.f.push(s.pop())
                var r = ''
                2 == s.length && '' != s[1] && (r = ':'), t.a.push(s.join(r))
              }
            })(n, s)
            var r = new Q(s)
            !(function (t) {
              for (var e = t.f.length, i = 0; i < e; i++) {
                var n = t.f[i].split(':'),
                  s = n[0].replace(/\+/g, ' '),
                  r = ['n4']
                if (2 <= n.length) {
                  var a
                  if (((a = []), (o = n[1])))
                    for (
                      var o, l = (o = o.split(',')).length, c = 0;
                      c < l;
                      c++
                    ) {
                      var h
                      if ((h = o[c]).match(/^[\w-]+$/))
                        if (null == (d = et.exec(h.toLowerCase()))) h = ''
                        else {
                          if (
                            ((h = null == (h = d[2]) || '' == h ? 'n' : tt[h]),
                            null == (d = d[1]) || '' == d)
                          )
                            d = '4'
                          else var d = $[d] || (isNaN(d) ? '4' : d.substr(0, 1))
                          h = [h, d].join('')
                        }
                      else h = ''
                      h && a.push(h)
                    }
                  0 < a.length && (r = a),
                    3 == n.length &&
                      ((a = []),
                      0 < (n = (n = n[2]) ? n.split(',') : a).length &&
                        (n = K[n[0]]) &&
                        (t.c[s] = n))
                }
                for (
                  t.c[s] || ((n = K[s]) && (t.c[s] = n)), n = 0;
                  n < r.length;
                  n += 1
                )
                  t.a.push(new C(s, r[n]))
              }
            })(r),
              g(
                i,
                (function (t) {
                  if (0 == t.a.length) throw Error('No fonts to load!')
                  if (-1 != t.c.indexOf('kit=')) return t.c
                  for (var e = t.a.length, i = [], n = 0; n < e; n++)
                    i.push(t.a[n].replace(/ /g, '+'))
                  return (
                    (e = t.c + '?family=' + i.join('%7C')),
                    0 < t.f.length && (e += '&subset=' + t.f.join(',')),
                    0 < t.g.length && (e += '&text=' + encodeURIComponent(t.g)),
                    e
                  )
                })(n),
                b(e)
              ),
              y(e, function () {
                t(r.a, r.c, nt)
              })
          }),
            (st.prototype.load = function (t) {
              var e = this.a.id,
                i = this.c.o
              e
                ? m(
                    this.c,
                    (this.a.api || 'https://use.typekit.net') + '/' + e + '.js',
                    function (e) {
                      if (e) t([])
                      else if (
                        i.Typekit &&
                        i.Typekit.config &&
                        i.Typekit.config.fn
                      ) {
                        e = i.Typekit.config.fn
                        for (var n = [], s = 0; s < e.length; s += 2)
                          for (
                            var r = e[s], a = e[s + 1], o = 0;
                            o < a.length;
                            o++
                          )
                            n.push(new C(r, a[o]))
                        try {
                          i.Typekit.load({ events: !1, classes: !1, async: !0 })
                        } catch (t) {}
                        t(n)
                      }
                    },
                    2e3
                  )
                : t([])
            }),
            (rt.prototype.load = function (t) {
              var e = this.f.id,
                i = this.c.o,
                n = this
              e
                ? (i.__webfontfontdeckmodule__ ||
                    (i.__webfontfontdeckmodule__ = {}),
                  (i.__webfontfontdeckmodule__[e] = function (e, i) {
                    for (var s = 0, r = i.fonts.length; s < r; ++s) {
                      var a = i.fonts[s]
                      n.a.push(
                        new C(
                          a.name,
                          A(
                            'font-weight:' + a.weight + ';font-style:' + a.style
                          )
                        )
                      )
                    }
                    t(n.a)
                  }),
                  m(
                    this.c,
                    (this.f.api || 'https://f.fontdeck.com/s/css/js/') +
                      (function (t) {
                        return t.o.location.hostname || t.a.location.hostname
                      })(this.c) +
                      '/' +
                      e +
                      '.js',
                    function (e) {
                      e && t([])
                    }
                  ))
                : t([])
            })
          var at = new Y(window)
          ;(at.a.c.custom = function (t, e) {
            return new X(e, t)
          }),
            (at.a.c.fontdeck = function (t, e) {
              return new rt(e, t)
            }),
            (at.a.c.monotype = function (t, e) {
              return new q(e, t)
            }),
            (at.a.c.typekit = function (t, e) {
              return new st(e, t)
            }),
            (at.a.c.google = function (t, e) {
              return new it(e, t)
            })
          var ot = { load: a(at.load, at) }
          void 0 ===
            (n = function () {
              return ot
            }.call(e, i, e, t)) || (t.exports = n)
        })()
      },
      960: () => {},
      759: () => {},
      272: () => {}
    },
    e = {}
  function i (n) {
    var s = e[n]
    if (void 0 !== s) return s.exports
    var r = (e[n] = { exports: {} })
    return t[n].call(r.exports, r, r.exports, i), r.exports
  }