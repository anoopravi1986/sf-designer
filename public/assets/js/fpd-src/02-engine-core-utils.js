
/*
 * FancyProductDesigner - part 2/6: engine core & shared utilities
 * ---------------------------------------------------------------------
 * Product-designer engine internals: shared helper functions, the base
 * product/view classes, and the core FancyProductDesigner engine class
 * used during initialization. Mostly vendor code; contains one StyleFlip
 * customization (the backend-driven image gallery loader) marked with
 * "===== CUSTOM (StyleFlip)" banner comments below.
 */

  ;(i.n = t => {
    var e = t && t.__esModule ? () => t.default : () => t
    return i.d(e, { a: e }), e
  }),
    (i.d = (t, e) => {
      for (var n in e)
        i.o(e, n) &&
          !i.o(t, n) &&
          Object.defineProperty(t, n, { enumerable: !0, get: e[n] })
    }),
    (i.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (() => {
      'use strict'
      const t = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : '',
            e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : '',
            n =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : document.body
          n === document.body && n.classList.add('fpd-overflow-hidden'),
            'prompt' === i
              ? (t = `\n            <input type="text" placeholder="${t}" />\n            <span class="fpd-btn"></span>\n        `)
              : 'confirm' === i &&
                (t = `\n            <div class="fpd-confirm-msg text-lg">${t}</div>\n            <span class="fpd-btn fpd-confirm"></span>\n        `)
          let s = `\n        <div class="fpd-modal-inner fpd-shadow-3">\n            <div class="fpd-modal-close">\n                <span class="fa-solid fa-close"></span>\n            </div>\n            <div class="fpd-modal-content">${t}</div>\n        </div>\n    `
          const r = document.createElement('div')
          return (
            (r.className =
              'fpd-modal-internal fpd-modal-overlay fpd-container ' +
              (e ? 'fpd-fullscreen' : '')),
            (r.innerHTML = s),
            (r.dataset.type = i),
            n.append(r),
            G(r.querySelector('.fpd-modal-close'), ['click'], t => {
              n.classList.remove('fpd-overflow-hidden'), r.remove()
            }),
            r
          )
        },
        e = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : '',
            e =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1],
            i = document.body.querySelector('.fpd-snackbar-wrapper')
          i ||
            ((i = document.createElement('div')),
            (i.className = 'fpd-snackbar-wrapper'),
            document.body.append(i))
          let n = document.createElement('div')
          return (
            (n.className = 'fpd-snackbar fpd-shadow-1'),
            (n.innerHTML = '<p>' + t + '</p>'),
            n.addEventListener('click', t => {
              n.remove(), (n = null)
            }),
            i.append(n),
            e &&
              setTimeout(() => {
                n && (n.remove(), (n = null))
              }, 5e3),
            n
          )
        },
        n = e
      function s (t) {
        return (
          (s =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function (t) {
                  return typeof t
                }
              : function (t) {
                  return t &&
                    'function' == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? 'symbol'
                    : typeof t
                }),
          s(t)
        )
      }
      window.FPDSnackbar = e
      var r = /^\s+/,
        a = /\s+$/
      function o (t, e) {
        if (((e = e || {}), (t = t || '') instanceof o)) return t
        if (!(this instanceof o)) return new o(t, e)
        var i = (function (t) {
          var e,
            i,
            n,
            o = { r: 0, g: 0, b: 0 },
            l = 1,
            c = null,
            h = null,
            d = null,
            u = !1,
            f = !1
          return (
            'string' == typeof t &&
              (t = (function (t) {
                t = t.replace(r, '').replace(a, '').toLowerCase()
                var e,
                  i = !1
                if (T[t]) (t = T[t]), (i = !0)
                else if ('transparent' == t)
                  return { r: 0, g: 0, b: 0, a: 0, format: 'name' }
                return (e = j.rgb.exec(t))
                  ? { r: e[1], g: e[2], b: e[3] }
                  : (e = j.rgba.exec(t))
                  ? { r: e[1], g: e[2], b: e[3], a: e[4] }
                  : (e = j.hsl.exec(t))
                  ? { h: e[1], s: e[2], l: e[3] }
                  : (e = j.hsla.exec(t))
                  ? { h: e[1], s: e[2], l: e[3], a: e[4] }
                  : (e = j.hsv.exec(t))
                  ? { h: e[1], s: e[2], v: e[3] }
                  : (e = j.hsva.exec(t))
                  ? { h: e[1], s: e[2], v: e[3], a: e[4] }
                  : (e = j.hex8.exec(t))
                  ? {
                      r: k(e[1]),
                      g: k(e[2]),
                      b: k(e[3]),
                      a: D(e[4]),
                      format: i ? 'name' : 'hex8'
                    }
                  : (e = j.hex6.exec(t))
                  ? {
                      r: k(e[1]),
                      g: k(e[2]),
                      b: k(e[3]),
                      format: i ? 'name' : 'hex'
                    }
                  : (e = j.hex4.exec(t))
                  ? {
                      r: k(e[1] + '' + e[1]),
                      g: k(e[2] + '' + e[2]),
                      b: k(e[3] + '' + e[3]),
                      a: D(e[4] + '' + e[4]),
                      format: i ? 'name' : 'hex8'
                    }
                  : !!(e = j.hex3.exec(t)) && {
                      r: k(e[1] + '' + e[1]),
                      g: k(e[2] + '' + e[2]),
                      b: k(e[3] + '' + e[3]),
                      format: i ? 'name' : 'hex'
                    }
              })(t)),
            'object' == s(t) &&
              (R(t.r) && R(t.g) && R(t.b)
                ? ((e = t.r),
                  (i = t.g),
                  (n = t.b),
                  (o = {
                    r: 255 * I(e, 255),
                    g: 255 * I(i, 255),
                    b: 255 * I(n, 255)
                  }),
                  (u = !0),
                  (f = '%' === String(t.r).substr(-1) ? 'prgb' : 'rgb'))
                : R(t.h) && R(t.s) && R(t.v)
                ? ((c = P(t.s)),
                  (h = P(t.v)),
                  (o = (function (t, e, i) {
                    ;(t = 6 * I(t, 360)), (e = I(e, 100)), (i = I(i, 100))
                    var n = Math.floor(t),
                      s = t - n,
                      r = i * (1 - e),
                      a = i * (1 - s * e),
                      o = i * (1 - (1 - s) * e),
                      l = n % 6
                    return {
                      r: 255 * [i, a, r, r, o, i][l],
                      g: 255 * [o, i, i, a, r, r][l],
                      b: 255 * [r, r, o, i, i, a][l]
                    }
                  })(t.h, c, h)),
                  (u = !0),
                  (f = 'hsv'))
                : R(t.h) &&
                  R(t.s) &&
                  R(t.l) &&
                  ((c = P(t.s)),
                  (d = P(t.l)),
                  (o = (function (t, e, i) {
                    var n, s, r
                    function a (t, e, i) {
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
                    if (
                      ((t = I(t, 360)),
                      (e = I(e, 100)),
                      (i = I(i, 100)),
                      0 === e)
                    )
                      n = s = r = i
                    else {
                      var o = i < 0.5 ? i * (1 + e) : i + e - i * e,
                        l = 2 * i - o
                      ;(n = a(l, o, t + 1 / 3)),
                        (s = a(l, o, t)),
                        (r = a(l, o, t - 1 / 3))
                    }
                    return { r: 255 * n, g: 255 * s, b: 255 * r }
                  })(t.h, c, d)),
                  (u = !0),
                  (f = 'hsl')),
              t.hasOwnProperty('a') && (l = t.a)),
            (l = A(l)),
            {
              ok: u,
              format: t.format || f,
              r: Math.min(255, Math.max(o.r, 0)),
              g: Math.min(255, Math.max(o.g, 0)),
              b: Math.min(255, Math.max(o.b, 0)),
              a: l
            }
          )
        })(t)
        ;(this._originalInput = t),
          (this._r = i.r),
          (this._g = i.g),
          (this._b = i.b),
          (this._a = i.a),
          (this._roundA = Math.round(100 * this._a) / 100),
          (this._format = e.format || i.format),
          (this._gradientType = e.gradientType),
          this._r < 1 && (this._r = Math.round(this._r)),
          this._g < 1 && (this._g = Math.round(this._g)),
          this._b < 1 && (this._b = Math.round(this._b)),
          (this._ok = i.ok)
      }
      function l (t, e, i) {
        ;(t = I(t, 255)), (e = I(e, 255)), (i = I(i, 255))
        var n,
          s,
          r = Math.max(t, e, i),
          a = Math.min(t, e, i),
          o = (r + a) / 2
        if (r == a) n = s = 0
        else {
          var l = r - a
          switch (((s = o > 0.5 ? l / (2 - r - a) : l / (r + a)), r)) {
            case t:
              n = (e - i) / l + (e < i ? 6 : 0)
              break
            case e:
              n = (i - t) / l + 2
              break
            case i:
              n = (t - e) / l + 4
          }
          n /= 6
        }
        return { h: n, s, l: o }
      }
      function c (t, e, i) {
        ;(t = I(t, 255)), (e = I(e, 255)), (i = I(i, 255))
        var n,
          s,
          r = Math.max(t, e, i),
          a = Math.min(t, e, i),
          o = r,
          l = r - a
        if (((s = 0 === r ? 0 : l / r), r == a)) n = 0
        else {
          switch (r) {
            case t:
              n = (e - i) / l + (e < i ? 6 : 0)
              break
            case e:
              n = (i - t) / l + 2
              break
            case i:
              n = (t - e) / l + 4
          }
          n /= 6
        }
        return { h: n, s, v: o }
      }
      function h (t, e, i, n) {
        var s = [
          M(Math.round(t).toString(16)),
          M(Math.round(e).toString(16)),
          M(Math.round(i).toString(16))
        ]
        return n &&
          s[0].charAt(0) == s[0].charAt(1) &&
          s[1].charAt(0) == s[1].charAt(1) &&
          s[2].charAt(0) == s[2].charAt(1)
          ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0)
          : s.join('')
      }
      function d (t, e, i, n) {
        return [
          M(_(n)),
          M(Math.round(t).toString(16)),
          M(Math.round(e).toString(16)),
          M(Math.round(i).toString(16))
        ].join('')
      }
      function u (t, e) {
        e = 0 === e ? 0 : e || 10
        var i = o(t).toHsl()
        return (i.s -= e / 100), (i.s = O(i.s)), o(i)
      }
      function f (t, e) {
        e = 0 === e ? 0 : e || 10
        var i = o(t).toHsl()
        return (i.s += e / 100), (i.s = O(i.s)), o(i)
      }
      function p (t) {
        return o(t).desaturate(100)
      }
      function g (t, e) {
        e = 0 === e ? 0 : e || 10
        var i = o(t).toHsl()
        return (i.l += e / 100), (i.l = O(i.l)), o(i)
      }
      function m (t, e) {
        e = 0 === e ? 0 : e || 10
        var i = o(t).toRgb()
        return (
          (i.r = Math.max(
            0,
            Math.min(255, i.r - Math.round((-e / 100) * 255))
          )),
          (i.g = Math.max(
            0,
            Math.min(255, i.g - Math.round((-e / 100) * 255))
          )),
          (i.b = Math.max(
            0,
            Math.min(255, i.b - Math.round((-e / 100) * 255))
          )),
          o(i)
        )
      }
      function v (t, e) {
        e = 0 === e ? 0 : e || 10
        var i = o(t).toHsl()
        return (i.l -= e / 100), (i.l = O(i.l)), o(i)
      }
      function b (t, e) {
        var i = o(t).toHsl(),
          n = (i.h + e) % 360
        return (i.h = n < 0 ? 360 + n : n), o(i)
      }
      function y (t) {
        var e = o(t).toHsl()
        return (e.h = (e.h + 180) % 360), o(e)
      }
      function x (t, e) {
        if (isNaN(e) || e <= 0)
          throw new Error('Argument to polyad must be a positive number')
        for (var i = o(t).toHsl(), n = [o(t)], s = 360 / e, r = 1; r < e; r++)
          n.push(o({ h: (i.h + r * s) % 360, s: i.s, l: i.l }))
        return n
      }
      function w (t) {
        var e = o(t).toHsl(),
          i = e.h
        return [
          o(t),
          o({ h: (i + 72) % 360, s: e.s, l: e.l }),
          o({ h: (i + 216) % 360, s: e.s, l: e.l })
        ]
      }
      function C (t, e, i) {
        ;(e = e || 6), (i = i || 30)
        var n = o(t).toHsl(),
          s = 360 / i,
          r = [o(t)]
        for (n.h = (n.h - ((s * e) >> 1) + 720) % 360; --e; )
          (n.h = (n.h + s) % 360), r.push(o(n))
        return r
      }
      function S (t, e) {
        e = e || 6
        for (
          var i = o(t).toHsv(), n = i.h, s = i.s, r = i.v, a = [], l = 1 / e;
          e--;

        )
          a.push(o({ h: n, s, v: r })), (r = (r + l) % 1)
        return a
      }
      ;(o.prototype = {
        isDark: function () {
          return this.getBrightness() < 128
        },
        isLight: function () {
          return !this.isDark()
        },
        isValid: function () {
          return this._ok
        },
        getOriginalInput: function () {
          return this._originalInput
        },
        getFormat: function () {
          return this._format
        },
        getAlpha: function () {
          return this._a
        },
        getBrightness: function () {
          var t = this.toRgb()
          return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3
        },
        getLuminance: function () {
          var t,
            e,
            i,
            n = this.toRgb()
          return (
            (t = n.r / 255),
            (e = n.g / 255),
            (i = n.b / 255),
            0.2126 *
              (t <= 0.03928 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4)) +
              0.7152 *
                (e <= 0.03928
                  ? e / 12.92
                  : Math.pow((e + 0.055) / 1.055, 2.4)) +
              0.0722 *
                (i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4))
          )
        },
        setAlpha: function (t) {
          return (
            (this._a = A(t)),
            (this._roundA = Math.round(100 * this._a) / 100),
            this
          )
        },
        toHsv: function () {
          var t = c(this._r, this._g, this._b)
          return { h: 360 * t.h, s: t.s, v: t.v, a: this._a }
        },
        toHsvString: function () {
          var t = c(this._r, this._g, this._b),
            e = Math.round(360 * t.h),
            i = Math.round(100 * t.s),
            n = Math.round(100 * t.v)
          return 1 == this._a
            ? 'hsv(' + e + ', ' + i + '%, ' + n + '%)'
            : 'hsva(' + e + ', ' + i + '%, ' + n + '%, ' + this._roundA + ')'
        },
        toHsl: function () {
          var t = l(this._r, this._g, this._b)
          return { h: 360 * t.h, s: t.s, l: t.l, a: this._a }
        },
        toHslString: function () {
          var t = l(this._r, this._g, this._b),
            e = Math.round(360 * t.h),
            i = Math.round(100 * t.s),
            n = Math.round(100 * t.l)
          return 1 == this._a
            ? 'hsl(' + e + ', ' + i + '%, ' + n + '%)'
            : 'hsla(' + e + ', ' + i + '%, ' + n + '%, ' + this._roundA + ')'
        },
        toHex: function (t) {
          return h(this._r, this._g, this._b, t)
        },
        toHexString: function (t) {
          return '#' + this.toHex(t)
        },
        toHex8: function (t) {
          return (function (t, e, i, n, s) {
            var r = [
              M(Math.round(t).toString(16)),
              M(Math.round(e).toString(16)),
              M(Math.round(i).toString(16)),
              M(_(n))
            ]
            return s &&
              r[0].charAt(0) == r[0].charAt(1) &&
              r[1].charAt(0) == r[1].charAt(1) &&
              r[2].charAt(0) == r[2].charAt(1) &&
              r[3].charAt(0) == r[3].charAt(1)
              ? r[0].charAt(0) +
                  r[1].charAt(0) +
                  r[2].charAt(0) +
                  r[3].charAt(0)
              : r.join('')
          })(this._r, this._g, this._b, this._a, t)
        },
        toHex8String: function (t) {
          return '#' + this.toHex8(t)
        },
        toRgb: function () {
          return {
            r: Math.round(this._r),
            g: Math.round(this._g),
            b: Math.round(this._b),
            a: this._a
          }
        },
        toRgbString: function () {
          return 1 == this._a
            ? 'rgb(' +
                Math.round(this._r) +
                ', ' +
                Math.round(this._g) +
                ', ' +
                Math.round(this._b) +
                ')'
            : 'rgba(' +
                Math.round(this._r) +
                ', ' +
                Math.round(this._g) +
                ', ' +
                Math.round(this._b) +
                ', ' +
                this._roundA +
                ')'
        },
        toPercentageRgb: function () {
          return {
            r: Math.round(100 * I(this._r, 255)) + '%',
            g: Math.round(100 * I(this._g, 255)) + '%',
            b: Math.round(100 * I(this._b, 255)) + '%',
            a: this._a
          }
        },
        toPercentageRgbString: function () {
          return 1 == this._a
            ? 'rgb(' +
                Math.round(100 * I(this._r, 255)) +
                '%, ' +
                Math.round(100 * I(this._g, 255)) +
                '%, ' +
                Math.round(100 * I(this._b, 255)) +
                '%)'
            : 'rgba(' +
                Math.round(100 * I(this._r, 255)) +
                '%, ' +
                Math.round(100 * I(this._g, 255)) +
                '%, ' +
                Math.round(100 * I(this._b, 255)) +
                '%, ' +
                this._roundA +
                ')'
        },
        toName: function () {
          return 0 === this._a
            ? 'transparent'
            : !(this._a < 1) && (E[h(this._r, this._g, this._b, !0)] || !1)
        },
        toFilter: function (t) {
          var e = '#' + d(this._r, this._g, this._b, this._a),
            i = e,
            n = this._gradientType ? 'GradientType = 1, ' : ''
          if (t) {
            var s = o(t)
            i = '#' + d(s._r, s._g, s._b, s._a)
          }
          return (
            'progid:DXImageTransform.Microsoft.gradient(' +
            n +
            'startColorstr=' +
            e +
            ',endColorstr=' +
            i +
            ')'
          )
        },
        toString: function (t) {
          var e = !!t
          t = t || this._format
          var i = !1,
            n = this._a < 1 && this._a >= 0
          return e ||
            !n ||
            ('hex' !== t &&
              'hex6' !== t &&
              'hex3' !== t &&
              'hex4' !== t &&
              'hex8' !== t &&
              'name' !== t)
            ? ('rgb' === t && (i = this.toRgbString()),
              'prgb' === t && (i = this.toPercentageRgbString()),
              ('hex' !== t && 'hex6' !== t) || (i = this.toHexString()),
              'hex3' === t && (i = this.toHexString(!0)),
              'hex4' === t && (i = this.toHex8String(!0)),
              'hex8' === t && (i = this.toHex8String()),
              'name' === t && (i = this.toName()),
              'hsl' === t && (i = this.toHslString()),
              'hsv' === t && (i = this.toHsvString()),
              i || this.toHexString())
            : 'name' === t && 0 === this._a
            ? this.toName()
            : this.toRgbString()
        },
        clone: function () {
          return o(this.toString())
        },
        _applyModification: function (t, e) {
          var i = t.apply(null, [this].concat([].slice.call(e)))
          return (
            (this._r = i._r),
            (this._g = i._g),
            (this._b = i._b),
            this.setAlpha(i._a),
            this
          )
        },
        lighten: function () {
          return this._applyModification(g, arguments)
        },
        brighten: function () {
          return this._applyModification(m, arguments)
        },
        darken: function () {
          return this._applyModification(v, arguments)
        },
        desaturate: function () {
          return this._applyModification(u, arguments)
        },
        saturate: function () {
          return this._applyModification(f, arguments)
        },
        greyscale: function () {
          return this._applyModification(p, arguments)
        },
        spin: function () {
          return this._applyModification(b, arguments)
        },
        _applyCombination: function (t, e) {
          return t.apply(null, [this].concat([].slice.call(e)))
        },
        analogous: function () {
          return this._applyCombination(C, arguments)
        },
        complement: function () {
          return this._applyCombination(y, arguments)
        },
        monochromatic: function () {
          return this._applyCombination(S, arguments)
        },
        splitcomplement: function () {
          return this._applyCombination(w, arguments)
        },
        triad: function () {
          return this._applyCombination(x, [3])
        },
        tetrad: function () {
          return this._applyCombination(x, [4])
        }
      }),
        (o.fromRatio = function (t, e) {
          if ('object' == s(t)) {
            var i = {}
            for (var n in t)
              t.hasOwnProperty(n) && (i[n] = 'a' === n ? t[n] : P(t[n]))
            t = i
          }
          return o(t, e)
        }),
        (o.equals = function (t, e) {
          return !(!t || !e) && o(t).toRgbString() == o(e).toRgbString()
        }),
        (o.random = function () {
          return o.fromRatio({
            r: Math.random(),
            g: Math.random(),
            b: Math.random()
          })
        }),
        (o.mix = function (t, e, i) {
          i = 0 === i ? 0 : i || 50
          var n = o(t).toRgb(),
            s = o(e).toRgb(),
            r = i / 100
          return o({
            r: (s.r - n.r) * r + n.r,
            g: (s.g - n.g) * r + n.g,
            b: (s.b - n.b) * r + n.b,
            a: (s.a - n.a) * r + n.a
          })
        }),
        (o.readability = function (t, e) {
          var i = o(t),
            n = o(e)
          return (
            (Math.max(i.getLuminance(), n.getLuminance()) + 0.05) /
            (Math.min(i.getLuminance(), n.getLuminance()) + 0.05)
          )
        }),
        (o.isReadable = function (t, e, i) {
          var n,
            s,
            r,
            a,
            l,
            c = o.readability(t, e)
          switch (
            ((s = !1),
            ((r = i),
            'AA' !==
              (a = (
                (r = r || { level: 'AA', size: 'small' }).level || 'AA'
              ).toUpperCase()) &&
              'AAA' !== a &&
              (a = 'AA'),
            'small' !== (l = (r.size || 'small').toLowerCase()) &&
              'large' !== l &&
              (l = 'small'),
            (n = { level: a, size: l })).level + n.size)
          ) {
            case 'AAsmall':
            case 'AAAlarge':
              s = c >= 4.5
              break
            case 'AAlarge':
              s = c >= 3
              break
            case 'AAAsmall':
              s = c >= 7
          }
          return s
        }),
        (o.mostReadable = function (t, e, i) {
          var n,
            s,
            r,
            a,
            l = null,
            c = 0
          ;(s = (i = i || {}).includeFallbackColors),
            (r = i.level),
            (a = i.size)
          for (var h = 0; h < e.length; h++)
            (n = o.readability(t, e[h])) > c && ((c = n), (l = o(e[h])))
          return o.isReadable(t, l, { level: r, size: a }) || !s
            ? l
            : ((i.includeFallbackColors = !1),
              o.mostReadable(t, ['#fff', '#000'], i))
        })
      var T = (o.names = {
          aliceblue: 'f0f8ff',
          antiquewhite: 'faebd7',
          aqua: '0ff',
          aquamarine: '7fffd4',
          azure: 'f0ffff',
          beige: 'f5f5dc',
          bisque: 'ffe4c4',
          black: '000',
          blanchedalmond: 'ffebcd',
          blue: '00f',
          blueviolet: '8a2be2',
          brown: 'a52a2a',
          burlywood: 'deb887',
          burntsienna: 'ea7e5d',
          cadetblue: '5f9ea0',
          chartreuse: '7fff00',
          chocolate: 'd2691e',
          coral: 'ff7f50',
          cornflowerblue: '6495ed',
          cornsilk: 'fff8dc',
          crimson: 'dc143c',
          cyan: '0ff',
          darkblue: '00008b',
          darkcyan: '008b8b',
          darkgoldenrod: 'b8860b',
          darkgray: 'a9a9a9',
          darkgreen: '006400',
          darkgrey: 'a9a9a9',
          darkkhaki: 'bdb76b',
          darkmagenta: '8b008b',
          darkolivegreen: '556b2f',
          darkorange: 'ff8c00',
          darkorchid: '9932cc',
          darkred: '8b0000',
          darksalmon: 'e9967a',
          darkseagreen: '8fbc8f',
          darkslateblue: '483d8b',
          darkslategray: '2f4f4f',
          darkslategrey: '2f4f4f',
          darkturquoise: '00ced1',
          darkviolet: '9400d3',
          deeppink: 'ff1493',
          deepskyblue: '00bfff',
          dimgray: '696969',
          dimgrey: '696969',
          dodgerblue: '1e90ff',
          firebrick: 'b22222',
          floralwhite: 'fffaf0',
          forestgreen: '228b22',
          fuchsia: 'f0f',
          gainsboro: 'dcdcdc',
          ghostwhite: 'f8f8ff',
          gold: 'ffd700',
          goldenrod: 'daa520',
          gray: '808080',
          green: '008000',
          greenyellow: 'adff2f',
          grey: '808080',
          honeydew: 'f0fff0',
          hotpink: 'ff69b4',
          indianred: 'cd5c5c',
          indigo: '4b0082',
          ivory: 'fffff0',
          khaki: 'f0e68c',
          lavender: 'e6e6fa',
          lavenderblush: 'fff0f5',
          lawngreen: '7cfc00',
          lemonchiffon: 'fffacd',
          lightblue: 'add8e6',
          lightcoral: 'f08080',
          lightcyan: 'e0ffff',
          lightgoldenrodyellow: 'fafad2',
          lightgray: 'd3d3d3',
          lightgreen: '90ee90',
          lightgrey: 'd3d3d3',
          lightpink: 'ffb6c1',
          lightsalmon: 'ffa07a',
          lightseagreen: '20b2aa',
          lightskyblue: '87cefa',
          lightslategray: '789',
          lightslategrey: '789',
          lightsteelblue: 'b0c4de',
          lightyellow: 'ffffe0',
          lime: '0f0',
          limegreen: '32cd32',
          linen: 'faf0e6',
          magenta: 'f0f',
          maroon: '800000',
          mediumaquamarine: '66cdaa',
          mediumblue: '0000cd',
          mediumorchid: 'ba55d3',
          mediumpurple: '9370db',
          mediumseagreen: '3cb371',
          mediumslateblue: '7b68ee',
          mediumspringgreen: '00fa9a',
          mediumturquoise: '48d1cc',
          mediumvioletred: 'c71585',
          midnightblue: '191970',
          mintcream: 'f5fffa',
          mistyrose: 'ffe4e1',
          moccasin: 'ffe4b5',
          navajowhite: 'ffdead',
          navy: '000080',
          oldlace: 'fdf5e6',
          olive: '808000',
          olivedrab: '6b8e23',
          orange: 'ffa500',
          orangered: 'ff4500',
          orchid: 'da70d6',
          palegoldenrod: 'eee8aa',
          palegreen: '98fb98',
          paleturquoise: 'afeeee',
          palevioletred: 'db7093',
          papayawhip: 'ffefd5',
          peachpuff: 'ffdab9',
          peru: 'cd853f',
          pink: 'ffc0cb',
          plum: 'dda0dd',
          powderblue: 'b0e0e6',
          purple: '800080',
          rebeccapurple: '663399',
          red: 'f00',
          rosybrown: 'bc8f8f',
          royalblue: '4169e1',
          saddlebrown: '8b4513',
          salmon: 'fa8072',
          sandybrown: 'f4a460',
          seagreen: '2e8b57',
          seashell: 'fff5ee',
          sienna: 'a0522d',
          silver: 'c0c0c0',
          skyblue: '87ceeb',
          slateblue: '6a5acd',
          slategray: '708090',
          slategrey: '708090',
          snow: 'fffafa',
          springgreen: '00ff7f',
          steelblue: '4682b4',
          tan: 'd2b48c',
          teal: '008080',
          thistle: 'd8bfd8',
          tomato: 'ff6347',
          turquoise: '40e0d0',
          violet: 'ee82ee',
          wheat: 'f5deb3',
          white: 'fff',
          whitesmoke: 'f5f5f5',
          yellow: 'ff0',
          yellowgreen: '9acd32'
        }),
        E = (o.hexNames = (function (t) {
          var e = {}
          for (var i in t) t.hasOwnProperty(i) && (e[t[i]] = i)
          return e
        })(T))
      function A (t) {
        return (t = parseFloat(t)), (isNaN(t) || t < 0 || t > 1) && (t = 1), t
      }
      function I (t, e) {
        ;(function (t) {
          return (
            'string' == typeof t && -1 != t.indexOf('.') && 1 === parseFloat(t)
          )
        })(t) && (t = '100%')
        var i = (function (t) {
          return 'string' == typeof t && -1 != t.indexOf('%')
        })(t)
        return (
          (t = Math.min(e, Math.max(0, parseFloat(t)))),
          i && (t = parseInt(t * e, 10) / 100),
          Math.abs(t - e) < 1e-6 ? 1 : (t % e) / parseFloat(e)
        )
      }
      function O (t) {
        return Math.min(1, Math.max(0, t))
      }
      function k (t) {
        return parseInt(t, 16)
      }
      function M (t) {
        return 1 == t.length ? '0' + t : '' + t
      }
      function P (t) {
        return t <= 1 && (t = 100 * t + '%'), t
      }
      function _ (t) {
        return Math.round(255 * parseFloat(t)).toString(16)
      }
      function D (t) {
        return k(t) / 255
      }
      var L,
        B,
        F,
        j =
          ((B =
            '[\\s|\\(]+(' +
            (L = '(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)') +
            ')[,|\\s]+(' +
            L +
            ')[,|\\s]+(' +
            L +
            ')\\s*\\)?'),
          (F =
            '[\\s|\\(]+(' +
            L +
            ')[,|\\s]+(' +
            L +
            ')[,|\\s]+(' +
            L +
            ')[,|\\s]+(' +
            L +
            ')\\s*\\)?'),
          {
            CSS_UNIT: new RegExp(L),
            rgb: new RegExp('rgb' + B),
            rgba: new RegExp('rgba' + F),
            hsl: new RegExp('hsl' + B),
            hsla: new RegExp('hsla' + F),
            hsv: new RegExp('hsv' + B),
            hsva: new RegExp('hsva' + F),
            hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
          })
      function R (t) {
        return !!j.CSS_UNIT.exec(t)
      }
      let itemsLoaded = false;
      let itemsLoadInFlight = false;
      let uploadedImagesMenuListener = null;

// ===================================================================
      // ===== CUSTOM (StyleFlip): backend-driven image gallery ==========
      // Loads uploaded images from the StyleFlip backend (instead of/in
      // addition to the vendor's local-only gallery), reconciles them
      // against the fpd_uploaded_images localStorage cache, and renders
      // each item with a custom three-dot menu (share / delete / download
      // / "Uploaded by ..." label).
      // ===================================================================
      async function loadItems(force) {
        // force=true bypasses the one-time-per-session gate below and
        // re-fetches/re-renders even if this already ran once - used
        // for an explicit reload (after an upload finishes, or every
        // time the Images tab is opened) rather than the normal
        // once-per-page-load call this function otherwise gets from
        // every single $(t) invocation across every module (see
        // itemsLoaded's declaration comment).
        // One in-flight request is enough (Images tab + Angular may both
        // ask at once). force=true only bypasses the completed-load gate.
        if (itemsLoadInFlight) return;
        if (itemsLoaded && !force) return;
        itemsLoadInFlight = true;
        try {
          // 👇 Call your API (replace with your real endpoint)
          const response = await fetch("https://styleflip-backend-jdm5.ithemes.xyz/api/image/getByUserId/70011");
          const data = await response.json();
          ;

          // The uploads grid also restores a separate cache from
          // localStorage['fpd_uploaded_images'] on init (see the Ri class
          // constructor further down), independent of the backend. That
          // meant images deleted from the database kept reappearing,
          // since nothing ever pruned the local cache. Now that the DB is
          // the source of truth (this fetch), reconcile the cache against
          // it: drop any cached entry whose URL the API no longer
          // returns. If the API returns no images, this empties the
          // cache entirely.
          try {
            const validUrls = new Set(
              Array.isArray(data) ? data.map(item => item.image) : []
            );
            const cachedRaw = window.localStorage.getItem('fpd_uploaded_images');
            if (cachedRaw) {
              const cached = JSON.parse(cachedRaw);
              const stillValid = cached.filter(item => validUrls.has(item.url));
              window.localStorage.setItem('fpd_uploaded_images', JSON.stringify(stillValid));
            }
          } catch (e) {
            console.error('❌ Failed to reconcile fpd_uploaded_images cache:', e);
          }

          // Prefer the Images module that is actually open in the main
          // sidebar. A second fpd-module-uploads (with its own
          // #extracontainer-data) lives in the upload-zone secondary panel;
          // document.querySelector('#extracontainer-data') hits that hidden
          // copy first, so thumbnails rendered there never appear in the UI.
          let container =
            document.querySelector(
              '.fpd-module-content fpd-module-images.fpd-active #extracontainer-data'
            ) ||
            document.querySelector(
              '.fpd-module-content #extracontainer-data'
            )
          // This function only ever appended items, never removed any -
          // harmless for the original once-per-session call (container
          // starts empty), but a `force` reload needs the grid wiped
          // first or every existing item gets duplicated alongside the
          // fresh set. Clearing unconditionally (not just when
          // data.length is 0) also drops stale items if the reload
          // genuinely returns fewer/no images now.
          if (!container) {
            return;
          }
          container.innerHTML = '';

          function formatTimeAgo(uploadedAt) {
            if (!uploadedAt) return;
            const now = new Date();
            const past = new Date(uploadedAt);
            const diffMs = now - past;
            const seconds = Math.floor(diffMs / 1000);
            const minutes = Math.floor(diffMs / (1000 * 60));
            const hours   = Math.floor(diffMs / (1000 * 60 * 60));
            const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (seconds < 60) {
              return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
            }
            if (minutes < 60) {
              return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
            }
            if (hours < 24) {
              return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
            }
            if (days < 30) {
              return `${days} day${days !== 1 ? "s" : ""} ago`;
            }
            const options = { day: "numeric", month: "short", year: "numeric" };
            return `on ${past.toLocaleDateString("en-GB", options)}`;
          }

          if (uploadedImagesMenuListener && uploadedImagesMenuListener.length) {
            uploadedImagesMenuListener.forEach(fn => document.removeEventListener('click', fn));
          }
          uploadedImagesMenuListener = [];

          if(Array.isArray(data) && data.length > 0){
            data.forEach(t => {
              ;
              const e = document.createElement("div");
              e.className = "fpd-item fpd-hover-thumbnail ts mt-1 bg-[#f6f6f6] item-data-click";
              e.dataset.source = t.image;
              e.dataset.time = t.createdAt;
              e.dataset.imageId = t._id;
  
              if (!t.disableDraggable) e.classList.add("fpd-draggable");
  
              if (t.title) {
                e.dataset.title = t.title;
                e.setAttribute("aria-label", t.title);
              }
  
              const imageUrl = t.image || t.url || t.thumbnailUrl;
              if (!imageUrl) return;
              const i = document.createElement("picture");
              i.dataset.img = t.thumbnailUrl ? t.thumbnailUrl : imageUrl;
              i.style.backgroundImage = `url("${imageUrl}")`;
              e.append(i);
              e.dataset.source = imageUrl;
  
              if (!t.disablePrice) {
                const priceSpan = document.createElement("span");
                priceSpan.className = "fpd-price";
                priceSpan.innerHTML = t.price || 0;
                e.append(priceSpan);
  
                // Assuming J is your utility function for toggling classes
                J(priceSpan, ["fpd-hidden"], !Boolean(t.price));
              }
  
              if (t.removable) {
                const trash = document.createElement("span");
                trash.className = "fa-solid fa-trash";
                e.append(trash);
              }
              // --- Add three dots (ellipsis) menu for share link ---
            let threeDot = document.createElement('span');
            threeDot.className = 'fpd-three-dot-menu';
            threeDot.innerHTML = `
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="10" r="2" fill="#888"/>
                <circle cx="10" cy="10" r="2" fill="#888"/>
                <circle cx="16" cy="10" r="2" fill="#888"/>
              </svg>
            `;
            threeDot.style.cursor = 'pointer';
            threeDot.style.marginLeft = '8px';
            threeDot.style.verticalAlign = 'middle';
            // Share menu popup
          
            let shareMenu = document.createElement('div')
            shareMenu.className = 'fpd-share-menu';
            shareMenu.style.display = 'none';
            shareMenu.style.position = 'fixed';
            shareMenu.style.background = '#fff';
            shareMenu.style.border = '1px solid #eee';
            shareMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            shareMenu.style.padding = '10px 16px';
            shareMenu.style.borderRadius = '8px';
            shareMenu.style.zIndex = '9999';
            shareMenu.style.marginTop = '-80px';
            ;
            let title = document.createElement('h4');
                  title.textContent = t.title;
                  title.className = 'font-bold mb-1 text-capitalize text-[1rem]';
                  function formatTimeAgo(uploadedAt) {
                    if(t.createdAt){
                      const now = new Date();
                      const past = new Date(uploadedAt);
                      
                      const diffMs = now - past;
                      const seconds = Math.floor(diffMs / 1000);
                      const minutes = Math.floor(diffMs / (1000 * 60));
                      const hours   = Math.floor(diffMs / (1000 * 60 * 60));
                      const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                      ;
                      if (seconds < 60) {
                        return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
                      }
                      if (minutes < 60) {
                        return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
                      }
                      if (hours < 24) {
                        ;
                        return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
                      }
                      if (days < 30) {
                        return `${days} day${days !== 1 ? "s" : ""} ago`;
                      }

                      // older than a month → show full date
                      const options = { day: "numeric", month: "short", year: "numeric" };
                      ;
                      return `on ${past.toLocaleDateString("en-GB", options)}`;
                    }
                  }
                  const para = document.createElement('p');
                  para.className = 'mt-2';
                  let uploadedAt = t?.createdAt;
                  const timeupload = formatTimeAgo(uploadedAt);
                  ;
                  para.textContent = `Uploaded by Anoop ${timeupload}`;

            let buttonDonw = document.createElement('button');
                  buttonDonw.className = 'download-button flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 text-black text-[0.9rem]';
                  buttonDonw.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;" class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                    </svg>
                    Download Image
                  `;

                  const buttonDel = document.createElement('button');
                  buttonDel.className = 'delete-button flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 text-black text-[0.9rem]';
                  buttonDel.innerHTML = `
                    <span class="fpd-icon-bin"></span>
                    Delete
                  `;

                  let buttonShare = document.createElement('button');
                  buttonShare.className = 'fpd-share-link-btn flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 text-black text-[0.9rem]';
                  buttonShare.innerHTML = `
                    <span class="fpd-icon-share"></span>
                    Share
                  `;
                    ;
                    // 👇 finally append item into container
                    e.append(threeDot);
                    e.append(shareMenu);
                    if (container) container.append(e);

                  // Delete the .fpd-item element
            buttonDel.addEventListener('click', function (e) {
              e.stopPropagation(); // Prevent triggering the outside click close
               const itemEl = e.target.closest('.ts'); // Adjust selector if needed
              const title = itemEl?.getAttribute('data-title');
              ;
              if (!title) {
                ;
                return;
              }

              // 2. Remove the element from the DOM
              itemEl.remove();

              // 3. Get data from localStorage
              const saved = localStorage.getItem('clothing-designer'); // Replace with your actual key
              let dataArray = saved ? JSON.parse(saved) : [];

              // 4. Filter out the item with the matching title
              const updatedArray = dataArray.filter(item => item.title !== title);

              // 5. Save updated data back to localStorage
              localStorage.setItem('clothing-designer', JSON.stringify(updatedArray));

              alert(`Removed design titled "${title}"`);
            });

            buttonShare.addEventListener('click', function (e) {
              e.stopPropagation();

              // Same-origin /api avoids CORS; never send Content-Type on GET
              // (that forces a preflight many customer networks block).
              fetch(`/api/sharedproduct/search?title=${encodeURIComponent(t.title)}&design_id=${encodeURIComponent(t?.design_id ?? '')}`, {
                method: 'GET'
              })
                .then(response => response.json())
                .then(data => {
                  ;

                  // Ensure valid product data
                  if (data && Array.isArray(data.product) && data.product.length > 0) {
                    const firstProduct = data.product[0];
                    const urlBase = window.location.origin;
                    const shareUrl = `${urlBase}/savedesign?design_id=${encodeURIComponent(data.design_id)}&title=${encodeURIComponent(data.title)}`;

                    // Update share link field
                    const urlField = document.querySelector('.fpd-share-link-url');
                    const copyBtn = document.querySelector('.fpd-share-link-btn');

                    if (urlField) {
                      urlField.textContent = shareUrl;
                    }

                    // Clipboard copy logic
                    if (navigator.clipboard && copyBtn) {
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        // copyBtn.textContent = 'Copied!';
                        const copyEl = document.querySelector('#copyData');
                        if (copyEl) {
                          copyEl.style.display = 'block';

                          setTimeout(() => {
                            copyEl.style.display = 'none';
                          }, 1000); // 10 seconds
                        }
                        // setTimeout(() => {
                        //   copyBtn.textContent = 'Copy Link';
                        // }, 1200);
                      }).catch(err => {
                        console.error('Clipboard copy failed:', err);
                        window.prompt('Copy this link:', shareUrl);
                      });
                    } else {
                      window.prompt('Copy this link:', shareUrl);
                    }
                  } else {
                    alert('No product found with this title.');
                  }
                })
                .catch(err => {
                  console.error('Error searching product:', err);
                  alert('Error searching product.');
                });

            });

            const actionContainer = document.createElement('div');
            actionContainer.className = 'flex flex-col items-start gap-1 action-container-box'; // tailwind for vertical stack with gap
            actionContainer.appendChild(title);
            actionContainer.appendChild(para);
            actionContainer.appendChild(buttonDonw);
            actionContainer.appendChild(buttonShare);
            actionContainer.appendChild(buttonDel);
            shareMenu.appendChild(actionContainer);

            const titleInfomation = document.createElement('div');
            titleInfomation.className = 'fixed bg-white text-black text-sm ml-[0px] p-2 rounded shadow-md z-[999] border border-[#ccc] border-solid rounded-[6px] shadow-custom-light sharebox hidden'

            
            
            // Hide menu on click outside
            const hideShareMenu = function (ev) {
              if (!shareMenu.contains(ev.target) && ev.target !== threeDot && !threeDot.contains(ev.target)) {
                shareMenu.style.display = 'none';
              }
            };
            document.addEventListener('click', hideShareMenu);
            uploadedImagesMenuListener.push(hideShareMenu);

            const onUploadItemClick = function (ev) {
              if (ev.target.closest(".fpd-three-dot-menu")) {
                if (ev.target.closest(".fpd-three-dot-menu") !== threeDot) return;

                const activeElementData = ev.target.closest('.fpd-active');
                ;
                ev.stopPropagation();
                if(activeElementData && activeElementData.tagName === 'FPD-MODULE-SAVE-LOAD'){
                  
                  // Toggle menu
                  const isOpen = shareMenu.style.display === 'block';
                  // Close all other open share menus (optional, for multiple items)
                  document.querySelectorAll('.fpd-share-menu').forEach(menu => menu.style.display = 'none');
                  shareMenu.style.display = isOpen ? 'none' : 'block';
      
                  if (!isOpen) {
                    // Add a one-time event listener to close the menu when clicking outside
                    const closeMenu = function(event) {
                      if (!shareMenu.contains(event.target) && event.target !== threeDot) {
                        shareMenu.style.display = 'none';
                        document.removeEventListener('click', closeMenu);
                      }
                    };
                    setTimeout(() => { // Timeout to allow this click to finish
                      document.addEventListener('click', closeMenu);
                    }, 0);
                  }
                }
                else {
                  const parentItem = ev.target.closest('.fpd-item');
                  ;
                  if (!parentItem) return;

                  const dataSource = parentItem.getAttribute('data-source');
                  const dataTitle = parentItem.getAttribute('data-title');
                  const uploadedAt = parentItem.getAttribute('data-time');
                  if (dataSource && dataTitle) {
                    // Remove any existing info box
                    const existingBox = document.querySelector('.titleInformation');
                    existingBox?.remove();

                    // Create info box
                    const titleInformation = document.createElement('div');
                    titleInformation.className = 'titleInformation fixed bg-white text-black text-sm ml-[0px] p-2 rounded shadow-md z-[999] border border-[#ccc] border-solid rounded-[6px] shadow-custom-light sharebox';
                    titleInformation.style.display = 'block';

                    const title = document.createElement('h4');
                    title.textContent = dataTitle;
                    title.className = 'mb-1 font-bold text-capitalize';

                    const para = document.createElement('p');
                    para.className = 'mt-2';
                    const timeupload = formatTimeAgo(uploadedAt);
                    ;
                    para.textContent = `Uploaded by Anoop ${timeupload}`; // replace with real content if needed

                    let buttonDonw = document.createElement('button');
                    buttonDonw.className = 'flex items-center w-full gap-2 p-2 text-left download-button hover:bg-gray-100';
                    buttonDonw.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;" class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                      </svg>
                      Download Image
                    `;

                    let buttonDel = document.createElement('button');
                    buttonDel.className = 'flex items-center w-full gap-2 p-2 text-left delete-button hover:bg-gray-100';
                    buttonDel.innerHTML = `
                      <span class="fpd-icon-bin"></span>
                      Delete
                    `;


                    // Delete the .fpd-item element
                    buttonDel.addEventListener('click', function (e) {
                      e.stopPropagation(); // Prevent triggering the outside click close
                      if (parentItem) {
                        ;
                        ;
                        parentItem.remove();
                        titleInformation.remove();
                        document.body.classList.remove('photo-box-open');
                        let imageId = parentItem?.getAttribute('data-image-id');

                         fetch(`https://styleflip-backend-jdm5.ithemes.xyz/api/image/deleteByUserId/${imageId}`, {
                            method: "DELETE", // or DELETE if backend expects delete
                            headers: {
                              "Content-Type": "application/json",
                            },
                          })
                            .then((response) => {
                              if (!response.ok) throw new Error("Failed to delete");
                              return response.json();
                            })
                            .then((data) => {
                              ;
                            })
                            .catch((error) => {
                              console.error("❌ API Error:", error);
                            });
                      }
                    });

                    // Download the image from data-source
                    buttonDonw.addEventListener('click', function (e) {
                      e.stopPropagation(); // Prevent triggering the outside click close

                      if (dataSource) {
                        ;

                        fetch(dataSource, { mode: 'cors' }) // Add CORS handling if needed
                          .then(response => {
                            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                            return response.blob();
                          })
                          .then(blob => {
                            const blobUrl = URL.createObjectURL(blob);

                            const link = document.createElement('a');
                            link.href = blobUrl;
                            link.download = (dataTitle || 'downloaded-image') + '.jpg'; // you can use .png if needed
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            URL.revokeObjectURL(blobUrl); // Clean up
                          })
                          .catch(error => {
                            console.error("Download failed:", error);
                            alert("Image could not be downloaded.");
                          });
                      }
                    });



                    const actionContainer = document.createElement('div');
                    actionContainer.className = 'flex flex-col items-start gap-1 action-container-box'; // tailwind for vertical stack with gap
                    actionContainer.appendChild(buttonDonw);
                    actionContainer.appendChild(buttonDel);



                    titleInformation.appendChild(title);
                    titleInformation.appendChild(para);
                    titleInformation.appendChild(actionContainer);

                    document.body.appendChild(titleInformation);
                    document.body.classList.add('photo-box-open');

                    // Position next to the clicked element
                    const rect = ev.target.getBoundingClientRect();
                    titleInformation.style.position = 'absolute';
                    titleInformation.style.top = `${rect.bottom + window.scrollY + 5}px`;
                    titleInformation.style.left = `${rect.left + window.scrollX}px`;

                    // Close on outside click
                    const closeBox = (e) => {
                      const target = e.target;
                      if (!titleInformation.contains(target) && !threeDot.contains(target)) {
                        titleInformation.remove();
                        document.body.classList.remove('photo-box-open');
                        document.removeEventListener('click', closeBox);
                      }
                    };

                    setTimeout(() => {
                      document.addEventListener('click', closeBox);
                    }, 10); // ensure it doesn’t trigger immediately
                  }
                }
                ;
              }
              else if(ev.target.closest(".download-button")) {
                const downloadUrl = e.dataset.source;
                if (downloadUrl && ev.target.closest('.fpd-item') === e) {
                  ;

                  fetch(downloadUrl, { mode: 'cors' }) // Add CORS handling if needed
                    .then(response => {
                      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                      return response.blob();
                    })
                    .then(blob => {
                      const blobUrl = URL.createObjectURL(blob);

                      const link = document.createElement('a');
                      link.href = blobUrl;
                      link.download = (e.dataset.title || t.title || 'downloaded-image') + '.jpg'; // you can use .png if needed
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      URL.revokeObjectURL(blobUrl); // Clean up
                    })
                    .catch(error => {
                      console.error("Download failed:", error);
                      alert("Image could not be downloaded.");
                    });
                }
              }
            };
            document.addEventListener('click', onUploadItemClick);
            uploadedImagesMenuListener.push(onUploadItemClick);
            });
          }
          itemsLoaded = true;
        } catch (error) {
          itemsLoaded = false;
          console.error("Error loading items:", error);
        } finally {
          itemsLoadInFlight = false;
        }
      }

      // Always available for Images-tab opens and upload-success reloads.
      window.fpdReloadUploadedImages = loadItems;

      const N = t => '[object Object]' === Object.prototype.toString.call(t),
        H = (t, e) => {
          if (t && 'object' == typeof t) {
            let s = !0
            for (var i = 0; i < e.length; ++i) {
              var n = e[i]
              if (!t.hasOwnProperty(n)) {
                s = !1
                break
              }
            }
            return s
          }
          return !1
        },
        z = (t, e) => {
          const i = { ...t, ...e }
          if (Object.keys(e).length)
            for (const n of Object.keys(i))
              N(i[n]) && t[n] && e[n] && (i[n] = z(t[n], e[n]))
          return i
        },
        W = (t, e, i) => {
          if (!e) return
          const n = (Array.isArray(e) ? e : e.match(/([^[.\]])+/g)).reduce(
            (t, e) => t && t[e],
            t
          )
          return void 0 === n ? i : n
        },
        V = t =>
          /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(
            t
          ),
        U = t => {
          for (var e = t.concat(), i = 0; i < e.length; ++i)
            for (var n = i + 1; n < e.length; ++n)
              e[i] === e[n] && e.splice(n--, 1)
          return e
        },
        Y = t => 0 === t || ('string' == typeof t && '0' === t),
        G = function (t) {
          let e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : [],
            i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : () => {},
            n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3]
          e = 'string' == typeof e ? [e] : e
          const s = new AbortController(),
            { signal: r } = s
          e.forEach(e => {
            t instanceof HTMLElement || t instanceof window.constructor
              ? (t.addEventListener(e, i, { capture: n, signal: r }),
                (t.abortController = s))
              : Array.from(t).length
              ? t &&
                t.forEach &&
                t.forEach(t => {
                  t.addEventListener(e, i, { capture: n, signal: r }),
                    (t.abortController = s)
                })
              : (t.addEventListener(e, i, { capture: n, signal: r }),
                (t.abortController = s))
          })
        },
        q = function (t, e) {
          let i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
          window && t.dispatchEvent(new CustomEvent(e, { detail: i })),
            window.jQuery &&
              t.container &&
              jQuery(t.container).trigger(e, Object.values(i))
        },
        X = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : []
          return (
            t &&
              (t instanceof HTMLElement
                ? e.forEach(e => {
                    t.classList.add(e)
                  })
                : t.forEach(t => {
                    e.forEach(e => {
                      t.classList.add(e)
                    })
                  })),
            t
          )
        },
        Z = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : []
          return (
            t &&
              (t instanceof HTMLElement
                ? e.forEach(e => {
                    t.classList.remove(e)
                  })
                : t.forEach(t => {
                    e.forEach(e => {
                      t.classList.remove(e)
                    })
                  })),
            t
          )
        },
        J = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : [],
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : [],
            i =
              !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
          return (
            t &&
              (t instanceof HTMLElement
                ? e.forEach(e => {
                    t.classList.toggle(e, i)
                  })
                : t.forEach(t => {
                    e.forEach(e => {
                      t.classList.toggle(e, i)
                    })
                  })),
            t
          )
        },
        Q = t =>
          void 0 === t ||
          null == t ||
          ('string' == typeof t
            ? !t.trim().length
            : Array.isArray(t)
            ? !t.length
            : 'object' == typeof t && !Object.keys(t).length),
        K = () => {
          var t = !0
          try {
            window.localStorage.length,
              window.localStorage.setItem('fpd-storage', 'just-testing')
          } catch (e) {
            t = !1
          }
          return t
        },
        $ = function () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          if (!t.url) return
          const e = document.createElement('div');
          (e.className = 'fpd-item fpd-hover-thumbnail ts mt-1 bg-[#f6f6f6] item-data-click'),
            (e.dataset.source = t.url),
            t.disableDraggable || e.classList.add('fpd-draggable'),
            t.title &&
              ((e.dataset.title = t.title),
              e.setAttribute('aria-label', t.title))
          const i = document.createElement('picture')
          ;(i.dataset.img = t.thumbnailUrl ? t.thumbnailUrl : t.url),
            e.append(i)
          const n = new Image()
          if (
            ((n.onerror = () => {
              e.remove()
            }),
            (n.src = i.dataset.img),
            !t.disablePrice)
          ) {
            const i = document.createElement('span')
            ;(i.className = 'fpd-price'),
              (i.innerHTML = t.price),
              e.append(i),
              J(i, ['fpd-hidden'], !Boolean(t.price))
          }

          if (t.removable) {
            const trash = document.createElement('span');
            trash.className = 'fa-solid fa-trash';
            e.append(trash);
          }
                    // --- Add three dots (ellipsis) menu for share link ---
          const threeDot = document.createElement('span');
          threeDot.className = 'fpd-three-dot-menu';
          threeDot.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="4" cy="10" r="2" fill="#888"/>
              <circle cx="10" cy="10" r="2" fill="#888"/>
              <circle cx="16" cy="10" r="2" fill="#888"/>
            </svg>
          `;
          threeDot.style.cursor = 'pointer';
          threeDot.style.marginLeft = '8px';
          threeDot.style.verticalAlign = 'middle';
          // Share menu popup
         
          const shareMenu = document.createElement('div')
          shareMenu.className = 'fpd-share-menu';
          shareMenu.style.display = 'none';
          shareMenu.style.position = 'fixed';
          shareMenu.style.background = '#fff';
          shareMenu.style.border = '1px solid #eee';
          shareMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          shareMenu.style.padding = '10px 16px';
          shareMenu.style.borderRadius = '8px';
          shareMenu.style.zIndex = '9999';
          shareMenu.style.marginTop = '-80px';
          ;
          const title = document.createElement('h4');
                title.textContent = t.title;
                title.className = 'font-bold mb-1 text-capitalize text-[1rem]';
                function formatTimeAgo(uploadedAt) {
                  if(t.uploadedAt){
                    const now = new Date();
                    const past = new Date(uploadedAt);
                    const diffMs = now - past;

                    const seconds = Math.floor(diffMs / 1000);
                    const minutes = Math.floor(diffMs / (1000 * 60));
                    const hours = Math.floor(diffMs / (1000 * 60 * 60));
                    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                    if (seconds < 60) return `${seconds} sec ago`;
                    if (minutes < 60) return `${minutes} min ago`;
                    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

                    // Format as: on 7 Aug 2025
                    const options = { day: 'numeric', month: 'short', year: 'numeric' };
                    return `on ${past.toLocaleDateString('en-GB', options)}`;
                  }
                }
                const para = document.createElement('p');
                para.className = 'mt-2';
                const uploadedAt = t?.uploadedAt;
                para.textContent = `Uploaded by Anoop ${formatTimeAgo(uploadedAt)}`;

          const buttonDonw = document.createElement('button');
                buttonDonw.className = 'download-button flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 text-black text-[0.9rem]';
                buttonDonw.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;" class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                  </svg>
                  Download Image
                `;

                const buttonDel = document.createElement('button');
                buttonDel.className = 'delete-button flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 text-black text-[0.9rem]';
                buttonDel.innerHTML = `
                  <span class="fpd-icon-bin"></span>
                  Delete
                `;

                const buttonShare = document.createElement('button');
                buttonShare.className = 'fpd-share-link-btn flex items-center gap-2 w-full p-2 text-left hover:bg-gray-100 text-black text-[0.9rem]';
                buttonShare.innerHTML = `
                  <span class="fpd-icon-share"></span>
                  Share
                `;


                // Delete the .fpd-item element
                buttonDel.addEventListener('click', function (e) {
                  e.stopPropagation(); // Prevent triggering the outside click close
                   const itemEl = e.target.closest('.ts'); // Adjust selector if needed
                  const title = itemEl?.getAttribute('data-title');

                  if (!title) {
                    ;
                    return;
                  }

                  // 2. Remove the element from the DOM
                  itemEl.remove();

                  // 3. Get data from localStorage
                  const saved = localStorage.getItem('clothing-designer'); // Replace with your actual key
                  let dataArray = saved ? JSON.parse(saved) : [];

                  // 4. Filter out the item with the matching title
                  const updatedArray = dataArray.filter(item => item.title !== title);

                  // 5. Save updated data back to localStorage
                  localStorage.setItem('clothing-designer', JSON.stringify(updatedArray));

                  alert(`Removed design titled "${title}"`);
                });


                buttonShare.addEventListener('click', function (e) {
                  e.stopPropagation();

                  fetch(`/api/sharedproduct/search?title=${encodeURIComponent(t.title)}&design_id=${encodeURIComponent(t?.design_id ?? '')}`, {
                    method: 'GET'
                  })
                    .then(response => response.json())
                    .then(data => {
                      ;

                      // Ensure valid product data
                      if (data && Array.isArray(data.product) && data.product.length > 0) {
                        const firstProduct = data.product[0];
                        const urlBase = window.location.origin;
                        const shareUrl = `${urlBase}/savedesign?design_id=${encodeURIComponent(data.design_id)}&title=${encodeURIComponent(data.title)}`;

                        // Update share link field
                        const urlField = document.querySelector('.fpd-share-link-url');
                        const copyBtn = document.querySelector('.fpd-share-link-btn');

                        if (urlField) {
                          urlField.textContent = shareUrl;
                        }

                        // Clipboard copy logic
                        if (navigator.clipboard && copyBtn) {
                          navigator.clipboard.writeText(shareUrl).then(() => {
                            // copyBtn.textContent = 'Copied!';
                            const copyEl = document.querySelector('#copyData');
                            if (copyEl) {
                              copyEl.style.display = 'block';

                              setTimeout(() => {
                                copyEl.style.display = 'none';
                              }, 1000); // 10 seconds
                            }
                            // setTimeout(() => {
                            //   copyBtn.textContent = 'Copy Link';
                            // }, 1200);
                          }).catch(err => {
                            console.error('Clipboard copy failed:', err);
                            window.prompt('Copy this link:', shareUrl);
                          });
                        } else {
                          window.prompt('Copy this link:', shareUrl);
                        }
                      } else {
                        alert('No product found with this title.');
                      }
                    })
                    .catch(err => {
                      console.error('Error searching product:', err);
                      alert('Error searching product.');
                    });

                });


                // Download the image from data-source
                buttonDonw.addEventListener('click', function (e) {
                  ;
                  e.stopPropagation(); // Prevent triggering the outside click close

                  if (t.url) {
                    ;

                    fetch(t.url, { mode: 'cors' }) // Add CORS handling if needed
                      .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        return response.blob();
                      })
                      .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = (t.title || 'downloaded-image') + '.jpg'; // you can use .png if needed
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        URL.revokeObjectURL(blobUrl); // Clean up
                      })
                      .catch(error => {
                        console.error("Download failed:", error);
                        alert("Image could not be downloaded.");
                      });
                  }
                });



                const actionContainer = document.createElement('div');
                actionContainer.className = 'flex flex-col items-start gap-1 action-container-box'; // tailwind for vertical stack with gap
                actionContainer.appendChild(title);
                actionContainer.appendChild(para);
                actionContainer.appendChild(buttonDonw);
                actionContainer.appendChild(buttonShare);
                actionContainer.appendChild(buttonDel);
          shareMenu.appendChild(actionContainer);

          const titleInfomation = document.createElement('div');
          titleInfomation.className = 'fixed bg-white text-black text-sm ml-[0px] p-2 rounded shadow-md z-[999] border border-[#ccc] border-solid rounded-[6px] shadow-custom-light sharebox hidden'

          // shareMenu.innerHTML = `<div style=\"font-weight:600;margin-bottom:8px;\">Share Link</div><button class=\"fpd-share-link-btn\" style=\"background:#f2eafd;color:#222;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;font-size:14px;position:relative;z-index:999999999\">Copy Link</button><div class=\"fpd-share-link-url\" style=\"font-size:12px;color:#666;margin-top:6px;word-break:break-all;\"></div>`;
          
          
          // Add to main element
          e.appendChild(threeDot);
          e.appendChild(shareMenu);
          e.appendChild(titleInfomation)
          // Show/hide menu
          // Show/hide menu
          threeDot.onclick = function(ev) {
            const activeElementData = ev.target.closest('.fpd-active');
            ;
            ev.stopPropagation();
            if(activeElementData.tagName === 'FPD-MODULE-SAVE-LOAD'){
              
              // Toggle menu
              const isOpen = shareMenu.style.display === 'block';
              // Close all other open share menus (optional, for multiple items)
              document.querySelectorAll('.fpd-share-menu').forEach(menu => menu.style.display = 'none');
              shareMenu.style.display = isOpen ? 'none' : 'block';
  
              if (!isOpen) {
                // Add a one-time event listener to close the menu when clicking outside
                const closeMenu = function(event) {
                  if (!shareMenu.contains(event.target) && event.target !== threeDot) {
                    shareMenu.style.display = 'none';
                    document.removeEventListener('click', closeMenu);
                  }
                };
                setTimeout(() => { // Timeout to allow this click to finish
                  document.addEventListener('click', closeMenu);
                }, 0);
              }
            }
            else if(activeElementData.tagName === 'DIV'){
              const parentItem = ev.target.closest('.fpd-item');
              ;
              if (!parentItem) return;

              const dataSource = parentItem.getAttribute('data-source');
              const dataTitle = parentItem.getAttribute('data-title');

              if (dataSource && dataTitle) {
                // Remove any existing info box
                const existingBox = document.querySelector('.titleInformation');
                existingBox?.remove();

                // Create info box
                const titleInformation = document.createElement('div');
                titleInformation.className = 'titleInformation fixed bg-white text-black text-sm ml-[0px] p-2 rounded shadow-md z-[999] border border-[#ccc] border-solid rounded-[6px] shadow-custom-light sharebox';
                titleInformation.style.display = 'block';

                const title = document.createElement('h4');
                title.textContent = dataTitle;
                title.className = 'mb-1 font-bold text-capitalize';

                const para = document.createElement('p');
                para.className = 'mt-2';
                para.textContent = 'Uploaded by Anoop S 2 min ago'; // replace with real content if needed

                const buttonDonw = document.createElement('button');
                buttonDonw.className = 'flex items-center w-full gap-2 p-2 text-left download-button hover:bg-gray-100';
                buttonDonw.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" style="width:20px;height:20px;" class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                  </svg>
                  Download Image
                `;

                const buttonDel = document.createElement('button');
                buttonDel.className = 'flex items-center w-full gap-2 p-2 text-left delete-button hover:bg-gray-100';
                buttonDel.innerHTML = `
                  <span class="fpd-icon-bin"></span>
                  Delete
                `;


                // Delete the .fpd-item element
                buttonDel.addEventListener('click', function (e) {
                  e.stopPropagation(); // Prevent triggering the outside click close
                  if (parentItem) {
                    ;
                    parentItem.remove();
                    titleInformation.remove();
                    document.body.classList.remove('photo-box-open');
                  }
                });

                // Download the image from data-source
                buttonDonw.addEventListener('click', function (e) {
                  e.stopPropagation(); // Prevent triggering the outside click close

                  if (dataSource) {
                    ;

                    fetch(dataSource, { mode: 'cors' }) // Add CORS handling if needed
                      .then(response => {
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        return response.blob();
                      })
                      .then(blob => {
                        const blobUrl = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = (dataTitle || 'downloaded-image') + '.jpg'; // you can use .png if needed
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        URL.revokeObjectURL(blobUrl); // Clean up
                      })
                      .catch(error => {
                        console.error("Download failed:", error);
                        alert("Image could not be downloaded.");
                      });
                  }
                });



                const actionContainer = document.createElement('div');
                actionContainer.className = 'flex flex-col items-start gap-1 action-container-box'; // tailwind for vertical stack with gap
                actionContainer.appendChild(buttonDonw);
                actionContainer.appendChild(buttonDel);



                titleInformation.appendChild(title);
                titleInformation.appendChild(para);
                titleInformation.appendChild(actionContainer);

                document.body.appendChild(titleInformation);
                document.body.classList.add('photo-box-open');

                // Position next to the clicked element
                const rect = ev.target.getBoundingClientRect();
                titleInformation.style.position = 'absolute';
                titleInformation.style.top = `${rect.bottom + window.scrollY + 5}px`;
                titleInformation.style.left = `${rect.left + window.scrollX}px`;

                // Close on outside click
                const closeBox = (e) => {
                  const target = e.target;
                  if (!titleInformation.contains(target) && !threeDot.contains(target)) {
                    titleInformation.remove();
                    document.body.classList.remove('photo-box-open');
                    document.removeEventListener('click', closeBox);
                  }
                };

                setTimeout(() => {
                  document.addEventListener('click', closeBox);
                }, 10); // ensure it doesn’t trigger immediately
              }
            }
          };
          
          // Hide menu on click outside
          document.addEventListener('click', function hideShareMenu(ev) {
            if (!shareMenu.contains(ev.target) && ev.target !== threeDot) {
              shareMenu.style.display = 'none';
            }
          });
          // Generate share link
          const urlBase = window.location.origin
        //   const titleSlug = encodeURIComponent((t.title || '').toLowerCase().replace(/\s+/g, '-'));
        //   // If you have manufacturer, add here
        //   const manufacturer = '';
        //   const shareUrl = `${urlBase}/savedesign?manufacturer=${manufacturer}&title=${titleSlug}`;
         
        //   // Copy to clipboard and call API
        //  shareMenu.querySelector('.fpd-share-link-btn').onclick = function(event) {
        //     event.stopPropagation();
        //     event.preventDefault();
        //             console.log('Share button clicked', event);
        //     // Call your API first
        //     fetch('https://styleflip-backend-jdm5.ithemes.xyz/api/sharedproduct/save', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json'
        //       },
        //       body: JSON.stringify({
        //         title: t.title,
        //         base64save: t.url  // Replace with actual base64 if available
        //       })
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //       if (data && data.product && data.product._id) {
        //         // Build the share link with the _id
        //         const urlBase = window.location.origin;
        //         const shareUrl = `${urlBase}/savedesign?id=${data.product._id}&title=${t.title}`;
        //         shareMenu.querySelector('.fpd-share-link-url').textContent = shareUrl;

        //         // Copy to clipboard
        //         if (navigator.clipboard) {
        //           navigator.clipboard.writeText(shareUrl).then(function() {
        //             shareMenu.querySelector('.fpd-share-link-btn').textContent = 'Copied!';
        //             setTimeout(function() {
        //               shareMenu.querySelector('.fpd-share-link-btn').textContent = 'Copy Link';
        //             }, 1200);
        //           });
        //         } else {
        //           // fallback
        //           window.prompt('Copy this link:', shareUrl);
        //         }
        //       } else {
        //         alert('Failed to save product or get share link.');
        //       }
        //     })
        //     .catch(error => {
        //       console.error('API error:', error);
        //       alert('Failed to save product.');
        //     });
        //   };
          // ===== END CUSTOM (StyleFlip: image gallery) =====================

          return e
        },
        tt = function (t, e) {
          let i =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : null
          if (!t.currentViewInstance) return ''
          let n = t.currentViewInstance.options
          if (
            document.querySelector('.fpd-upload-zone-content').contains(e) &&
            t.currentViewInstance.currentUploadZone
          ) {
            const e = t.currentViewInstance.fabricCanvas.getUploadZone(
              t.currentViewInstance.currentUploadZone
            )
            e && e.price && (i = e.price)
          }
          return (
            null == i && (i = W(n, 'customImageParameters.price', 0)),
            i ? ht(i, t.mainOptions.priceFormat) : ''
          )
        },
        et = (e, i, n) => {
          const s = e.currentViewInstance
          let r = s.options.customImageParameters
          const a = s.fabricCanvas.getUploadZone(s.currentUploadZone)
          if (
            (a && (r = z(r, a)),
            i > r.maxW || i < r.minW || n > r.maxH || n < r.minH)
          ) {
            ;(e.loadingCustomImage = !1),
              e.mainBar &&
                (e.mainBar.toggleContentDisplay(!1),
                s.currentUploadZone && e.mainBar.toggleUploadZonePanel(!1))
            let i = e.translator.getTranslation(
              'misc',
              'uploaded_image_size_alert'
            )
            return (
              (i = i
                .replace('%minW', r.minW)
                .replace('%minH', r.minH)
                .replace('%maxW', r.maxW)
                .replace('%maxH', r.maxH)),
              t(i),
              !1
            )
          }
          return !0
        },
        it = t => t.split('.').pop().toLowerCase().split('?')[0],
        nt = t => t.split('/').pop(),
        st = t => ['jpeg', 'jpg', 'png'].includes(it(t)),
        rt = (t, e) => {
          var i = []
          if ('group' == t.type) {
            const e = t.getObjects()
            1 === e.length
              ? (i = !0 === t.colors || 1 === t.colors ? ['#000'] : t.colors)
              : ((i = []),
                e.forEach(t => {
                  const e = o(t.fill)
                  i.push(e.toHexString())
                }))
          } else {
            if (t.__editorMode) return ['#000']
            i =
              t.colorLinkGroup && e.colorLinkGroups[t.colorLinkGroup]
                ? e.colorLinkGroups[t.colorLinkGroup].colors
                : !0 === t.colors || 1 === t.colors
                ? ['#000']
                : t.colors
          }
          return i
        },
        at = t => {
          let e = t.fill
          return 'string' == typeof e
            ? e
            : 'object' == typeof e
            ? e.source
              ? ((e = e.source.src), 'url(' + e + ')')
              : e[0]
            : !0 === t.colors && 'group' === t.type
            ? o(t.getObjects()[0].fill)
            : !1 === e && t.colors && t.colors[0]
            ? t.colors[0]
            : void 0
        },
        ot = (t, e) => {
          ;(null != t && void 0 !== t) || n(e)
        },
        lt = function (t) {
          let e =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : 'inch'
          const i =
            t *
            (arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : 72)
          return 'cm' == e
            ? Math.round(i / 2.54)
            : 'mm' == e
            ? Math.round(i / 25.4)
            : Math.round(i)
        },
        ct = function (t) {
          let e =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : 'inch'
          const i =
            t /
            (arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : 72)
          return 'cm' == e
            ? Math.round(2.54 * i)
            : 'mm' == e
            ? Math.round(25.4 * i)
            : Math.round(i)
        },
        ht = function (t) {
          let e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          if (!isNaN(t) && 'object' == typeof e) {
            const n = e.thousandSep || ',',
              s = e.decimalSep || '.'
            let r = t.toString().split('.'),
              a = r[0],
              o = r[1],
              l = ''
            if (void 0 !== a) {
              for (var i = a.length - 1; i >= 0; i--) l += a.charAt(i)
              for (
                l = l.replace(/(\d{3})/g, '$1' + n),
                  l.slice(-n.length) == n && (l = l.slice(0, -n.length)),
                  a = '',
                  i = l.length - 1;
                i >= 0;
                i--
              )
                a += l.charAt(i)
              void 0 !== o &&
                o.length > 0 &&
                (1 == o.length && (o += '0'), (a += s + o))
            }
            return (
              (a = (e.currency || '&#36;%d').replace('%d', a.toString())), a
            )
          }
          return t
        }
      'undefined' != typeof window &&
        ((window.FPDUtils = {}),
        (window.FPDUtils.showModal = function () {
          t(...arguments)
        }),
        (window.FPDUtils.showMessage = function () {
          n(...arguments)
        }),
        (window.FPDUtils.isUrl = V),
        (window.FPDUtils.pixelToUnit = ct),
        (window.FPDUtils.unitToPixel = lt))
      class dt {
        static defaults = {
          imageLoadTimestamp: !1,
          stageWidth: 900,
          stageHeight: 600,
          editorMode: !1,
          editorBoxParameters: [
            'left',
            'top',
            'angle',
            'fill',
            'width',
            'height',
            'fontSize',
            'price'
          ],
          fonts: [{ name: 'Arial' }, { name: 'Lobster', url: 'google' }],
          facebookAppId: '',
          instagramClientId: '',
          instagramRedirectUri: '',
          instagramTokenUri: '',
          hexNames: {},
          selectedColor: '#f5f5f5',
          boundingBoxColor: '#2185d0',
          outOfBoundaryColor: '#990000',
          replaceInitialElements: !1,
          fileServerURL: null,
          responsive: !0,
          cornerIconColor: '#000000',
          langJSON: {},
          colorPickerPalette: [],
          actions: {
            left: [
              'info',
              'download',
              'print',
              'preview-lightbox',
              'reset-product'
            ],
            center: ['undo', 'redo'],
            right: ['zoom', 'ruler', 'guided-tour']
          },
          mainBarModules: [
            'products',
            'productsnew',
            'images',
            'text',
            'designs',
            'manage-layers'
          ],
          initialActiveModule: '',
          maxValues: {},
          watermark: !1,
          priceFormat: {
            currency: '&#36;%d',
            decimalSep: '.',
            thousandSep: ','
          },
          mainBarContainer: !1,
          modalMode: !1,
          keyboardControl: !0,
          deselectActiveOnOutside: !0,
          uploadZonesTopped: !0,
          loadFirstProductInStage: !0,
          unsavedProductAlert: !1,
          hideDialogOnAdd: !0,
          toolbarPlacement: 'smart',
          snapGridSize: [50, 50],
          fabricCanvasOptions: {},
          namesNumbersDropdown: [],
          namesNumbersEntryPrice: 0,
          colorSelectionPlacement: '',
          bulkVariationsPlacement: '',
          bulkVariations: {},
          toolbarDynamicContext: 'body',
          boundingBoxProps: { strokeWidth: 1 },
          fitImagesInCanvas: !1,
          maxPrice: -1,
          inCanvasTextEditing: !0,
          openTextInputOnSelect: !1,
          designCategories: [],
          optionalView: !1,
          saveActionBrowserStorage: !0,
          pricingRules: [],
          uploadAgreementModal: !1,
          imageEditorSettings: { masks: [] },
          printingBox: null,
          autoOpenInfo: !1,
          guidedTour: null,
          replaceColorsInColorGroup: !1,
          allowedImageTypes: ['jpeg', 'png', 'svg', 'pdf'],
          pixabayApiKey: '51058342-7d101f741357da817a692cac0',
          pixabayHighResImages: !1,
          pixabayLang: 'en',
          sizeTooltip: !1,
          highlightEditableObjects: '',
          applyFillWhenReplacing: !0,
          applySizeWhenReplacing: !1,
          layouts: [],
          dynamicViewsOptions: {
            unit: 'mm',
            formats: [],
            pricePerArea: 0,
            minWidth: 0,
            minHeight: 0,
            maxWidth: 1e4,
            maxHeight: 1e4
          },
          enableDynamicViews: !1,
          disableTextEmojis: !1,
          smartGuides: !0,
          usePrintingBoxAsBounding: !1,
          printingBox: {},
          productsJSON: null,
          productsJSON1: null,
          designsJSON: null,
          customizationRequiredRule: 'any',
          swapProductConfirmation: !1,
          textLinkGroupProps: [],
          textTemplates: [],
          multiSelection: 1,
          multiSelectionColor: '#54dfe6',
          canvasHeight: 'auto',
          maxCanvasHeight: 0.8,
          mobileGesturesBehaviour: 'none',
          imageQualityRatings: null,
          splitMultiSVG: !1,
          cornerControlsStyle: 'advanced',
          downloadFilename: 'Product',
          autoFillUploadZones: !1,
          dragDropImagesToUploadZones: !1,
          responsiveBreakpoints: { small: 768, medium: 1024 },
          dynamicDesigns: {},
          customTextAsTextbox: !1,
          viewThumbnailsWrapper: '',
          rulerUnit: 'px',
          rulerPosition: 'canvas',
          rulerFixed: !1,
          aiService: {
            serverURL: null,
            removeBG: !0,
            superRes: !0,
            text2Img: !0
          },
          cropMasks: [],
          industry: { type: null, opts: {} },
          innerBleed: !1,
          elementParameters: {
            objectCaching: !1,
            z: -1,
            price: 0,
            colors: !1,
            removable: !1,
            draggable: !1,
            rotatable: !1,
            resizable: !1,
            copyable: !1,
            zChangeable: 1,
            boundingBox: !1,
            boundingBoxMode: 'clipping',
            autoCenter: !1,
            replace: '',
            replaceInAllViews: !1,
            autoSelect: !1,
            topped: !1,
            colorPrices: {},
            colorLinkGroup: !1,
            patterns: [],
            sku: '',
            excludeFromExport: !1,
            showInColorSelection: !1,
            locked: !1,
            uniScalingUnlockable: !1,
            fixed: !1,
            shadowColor: '',
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            colorLink3DLayer: !1,
            originX: 'center',
            originY: 'center',
            cornerSize: 24,
            fill: !1,
            lockUniScaling: !0,
            pattern: !1,
            top: 0,
            left: 0,
            angle: 0,
            flipX: !1,
            flipY: !1,
            opacity: 1,
            scaleX: 1,
            scaleY: 1
          },
          textParameters: {
            maxLength: 0,
            curved: !1,
            curvable: !1,
            curveRadius: 80,
            maxCurveRadius: 400,
            curveReverse: !1,
            maxLines: 0,
            textBox: !1,
            textPlaceholder: 1,
            numberPlaceholder: !1,
            letterSpacing: 0,
            chargeAfterEditing: !1,
            minFontSize: 1,
            textTransform: 'none',
            widthFontSize: 0,
            maxFontSize: 200,
            textLinkGroup: '',
            strokeColors: [],
            neonText: !1,
            editable: !0,
            fontFamily: 'Arial',
            fontSize: 18,
            lineHeight: 1,
            fontWeight: 'normal',
            fontStyle: 'normal',
            textDecoration: 'normal',
            padding: 10,
            textAlign: 'left',
            stroke: null,
            strokeWidth: 0,
            charSpacing: 0
          },
          imageParameters: {
            uploadZone: !1,
            filter: null,
            colorMode: 'tint',
            scaleMode: 'fit',
            resizeToW: 0,
            resizeToH: 0,
            advancedEditing: 1,
            uploadZoneMovable: !1,
            uploadZoneRemovable: !1,
            padding: 0,
            minScaleLimit: 0.01
          },
          customImageParameters: {
            minW: 100,
            minH: 100,
            maxW: 1e4,
            maxH: 1e4,
            minDPI: 72,
            maxSize: 10,
            autoCenter: !0
          },
          customTextParameters: { autoCenter: !0, copyable: !0 },
          customAdds: { designs: !0, uploads: !0, texts: !0, drawing: !0 },
          qrCodeProps: {
            autoCenter: !0,
            draggable: !0,
            removable: !0,
            resizable: !0
          }
        }
        static merge () {
          return z(
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          )
        }
        static getParameterKeys () {
          var t = Object.keys(this.defaults.elementParameters),
            e = Object.keys(this.defaults.imageParameters),
            i = Object.keys(this.defaults.textParameters)
          return (t = t.concat(e)).concat(i)
        }
      }
      function ut (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function ft (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      window && (window.FPDOptions = dt)
      var pt = new WeakSet(),
        gt = new WeakSet(),
        mt = new WeakSet(),
        vt = new WeakSet()
      class bt {
        constructor (t) {
          ;
          ut(this, vt),
            ut(this, mt),
            ut(this, gt),
            ut(this, pt),
            (this.fpdInstance = t),
            G(
              t,
              [
                'elementModify',
                'productCreate',
                'elementAdd',
                'elementRemove',
                'viewCreate',
                'viewRemove',
                'elementFillChange',
                'textLinkApply'
              ],
              this.doPricingRules.bind(this)
            )
          // setTimeout(() => {
          //     console.log("product updated called")
          //     this.fpdInstance.selectProduct(1, 1);
          // }, 15000);
        }
        doPricingRules (t) {
          const e = this.fpdInstance.mainOptions.dynamicViewsOptions
            ? this.fpdInstance.mainOptions.dynamicViewsOptions.unit
            : 'mm'
          this.fpdInstance.pricingRulesPrice = 0
          var i = this.fpdInstance.mainOptions.pricingRules
          i &&
            i.length > 0 &&
            i.forEach(t => {
              if (t.property && t.target) {
                var i = []
                'canvasSize' == t.property || 'coverage' == t.property
                  ? (i = this.fpdInstance.viewInstances)
                  : void 0 !== t.target.elements &&
                    '#' === t.target.elements.charAt(0)
                  ? i.push(
                      this.fpdInstance.currentViewInstance.fabricCanvas.getElementByTitle(
                        t.target.elements.replace('#', ''),
                        t.target.views
                      )
                    )
                  : (i =
                      void 0 !== t.target.elements &&
                      -1 !== t.target.elements.search('custom')
                        ? this.fpdInstance.getCustomElements(
                            t.target.elements
                              .replace('custom', '')
                              .toLowerCase(),
                            t.target.views,
                            !1
                          )
                        : this.fpdInstance.getElements(
                            t.target.views,
                            t.target.elements,
                            !1
                          )),
                  (i = i.filter(t => !t.uploadZone))
                var n,
                  s = !1
                ;-1 !==
                  ['elementsLength', 'colorsLength'].indexOf(t.property) &&
                  (s = !0),
                  i.forEach((r, a) => {
                    !r ||
                      (s && a > 0) ||
                      (r.hasOwnProperty('element') && (r = r.element),
                      'textLength' === t.property
                        ? (n = r.text ? r.text.replace(/\s/g, '').length : null)
                        : 'linesLength' === t.property &&
                          (n = r.text ? r.text.split('\n').length : null),
                      'fontSize' === t.property
                        ? (n = r.text ? r.fontSize : null)
                        : 'imageSize' === t.property
                        ? (n =
                            'image' === r.getType() && r.title
                              ? { width: r.width, height: r.height }
                              : null)
                        : 'imageSizeScaled' === t.property
                        ? (n =
                            'image' === r.getType() && r.title
                              ? {
                                  width: r.width * r.scaleX,
                                  height: r.height * r.scaleY
                                }
                              : null)
                        : 'canvasSize' === t.property
                        ? (n = {
                            width: ct(r.options.stageWidth, e),
                            height: ct(r.options.stageHeight, e)
                          })
                        : 'coverage' === t.property
                        ? (n = ft(this, vt, Ct).call(this, r))
                        : 'pattern' === t.property
                        ? (n = r.pattern)
                        : 'elementsLength' === t.property
                        ? (n = i.length)
                        : 'colorsLength' === t.property &&
                          (n = this.fpdInstance.getUsedColors(
                            t.target.views
                          ).length),
                      null != n &&
                        (t.rules.forEach(t => {
                          t.property = n
                        }),
                        'any' === t.type
                          ? t.rules.some(ft(this, pt, yt).bind(this))
                          : t.rules.forEach(ft(this, pt, yt).bind(this))))
                  })
              }
            }),
            this.fpdInstance.calculatePrice()
        }
      }
      function yt (t, e) {
        return (
          !!ft(this, gt, xt).call(this, t.operator, t.property, t.value) &&
          ('number' == typeof t.price &&
            (this.fpdInstance.pricingRulesPrice += t.price),
          !0)
        )
      }
      function xt (t, e, i) {
        if ('object' == typeof i) {
          var n = Object.keys(i),
            s = null
          return (
            n.forEach(n => {
              !1 !== s && (s = ft(this, mt, wt).call(this, t, e[n], i[n]))
            }),
            s
          )
        }
        return ft(this, mt, wt).call(this, t, e, i)
      }
      function wt (t, e, i) {
        return '=' === t
          ? e === i
          : '>' === t
          ? e > i
          : '<' === t
          ? e < i
          : '>=' === t
          ? e >= i
          : '<=' === t
          ? e <= i
          : void 0
      }
      function Ct (t) {
        if (
          !t ||
          !t.fabricCanvas ||
          !H(t.options.printingBox, ['left', 'top', 'width', 'height'])
        )
          return null
        let e, i, n, s
        t.fabricCanvas.forEachObject(t => {
          if (!t.excludeFromExport && !t._ignore) {
            var r = t.getBoundingRect(!0)
            ;(void 0 === e || r.left < e) && (e = r.left),
              (void 0 === i || r.top < i) && (i = r.top),
              (void 0 === n || r.left + r.width > n) && (n = r.left + r.width),
              (void 0 === s || r.top + r.height > s) && (s = r.top + r.height)
          }
        })
        let r = {}
        if (
          (e && (r = { minX: e, minY: i, maxX: n, maxY: s }),
          !H(r, ['minX', 'minY', 'maxX', 'maxY']))
        )
          return null
        const a = t.options.printingBox,
          o = Math.max(a.left, r.minX),
          l = Math.min(a.left + a.width, r.maxX) - o,
          c = Math.max(a.top, r.minY)
        return (
          ((l * (Math.min(a.top + a.height, r.maxY) - c)) /
            (a.width * a.height)) *
          100
        )
      }
      var St = i(777)
      const Tt = (t, e, i, n, s) => {
          ;(n = n || {}),
            t.save(),
            t.translate(e, i),
            t.rotate(St.fabric.util.degreesToRadians(s.angle)),
            (t.fillStyle = n.cornerColor || s.cornerColor),
            t.beginPath(),
            t.roundRect
              ? t.roundRect(-3, -7.5, 6, 15, 4)
              : t.rect(-3, -7.5, 6, 15),
            (t.filter = 'drop-shadow(0px 0px 2px rgba(0,0,0, 0.3))'),
            t.fill(),
            t.restore()
        },
        Et = (t, e, i, n, s) => {
          ;(n = n || {}),
            t.save(),
            t.translate(e, i),
            t.rotate(St.fabric.util.degreesToRadians(s.angle)),
            (t.fillStyle = n.cornerColor || s.cornerColor),
            t.beginPath(),
            t.roundRect
              ? t.roundRect(-7.5, -3, 15, 6, 4)
              : t.rect(-7.5, -3, 15, 6),
            (t.filter = 'drop-shadow(0px 0px 2px rgba(0,0,0, 0.3))'),
            t.fill(),
            t.restore()
        }
      ;(St.fabric.Control.prototype.touchSizeX = 40),
        (St.fabric.Control.prototype.touchSizeY = 40),
        (St.fabric.Object.prototype.transparentCorners = !1),
        (St.fabric.Object.prototype.controls.ml.render = Tt),
        (St.fabric.Object.prototype.controls.mr.render = Tt),
        (St.fabric.Object.prototype.controls.mt.render = Et),
        (St.fabric.Object.prototype.controls.mb.render = Et),
        (St.fabric.Textbox.prototype.controls.ml.render = Tt),
        (St.fabric.Textbox.prototype.controls.mr.render = Tt),
        (St.fabric.Object.prototype.controls.bl.visible = !1),
        (St.fabric.Object.prototype.controls.mtr.withConnection = !1),
        (St.fabric.Object.prototype.controls.mtr.y = 0.5),
        (St.fabric.Object.prototype.controls.mtr.offsetY = 25),
        (St.fabric.Object.prototype.controls.mtr.offsetX = -8),
        (St.fabric.Object.prototype.controls.tl.render =
          St.fabric.Object.prototype.controls.tr.render =
          St.fabric.Object.prototype.controls.mtr.render =
          St.fabric.Object.prototype.controls.br.render =
            function (t, e, i, n, s) {
              St.fabric.controlsUtils.renderCircleControl.call(
                this,
                t,
                e,
                i,
                n,
                s
              )
            }),
        (St.fabric.Object.prototype.controls.cropMaskDoneControl =
          new St.fabric.Control({
            x: 0.5,
            y: -0.5,
            actionName: 'crop-mask-done',
            offsetY: -20,
            offsetX: -45,
            cursorStyle: 'pointer',
            mouseDownHandler: function (t, e) {
              e.target.targetElement
            },
            render: (t, e, i, n, s) => {
              'crop-mask' === s.name &&
                ((n.cornerColor = '#2ecc71'), (n.cornerIconColor = '#fff'))
            },
            cornerSize: 24
          })),
        (St.fabric.Object.prototype.controls.cropMaskCancelControl =
          new St.fabric.Control({
            x: 0.5,
            y: -0.5,
            actionName: 'crop-mask-cancel',
            offsetY: -20,
            offsetX: -12,
            cursorStyle: 'pointer',
            mouseDownHandler: function (t, e) {
              const i = e.target
              i.targetElement &&
                (i.canvas.removeElement(i), (i.targetElement.cropMask = null))
            },
            render: (t, e, i, n, s) => {
              'crop-mask' === s.name &&
                ((n.cornerColor = '#c44d56'), (n.cornerIconColor = '#fff'))
            },
            cornerSize: 24
          }))
      const At = () => {
        const t = function (t, e, i, n, s, r, a) {
          let o =
              arguments.length > 7 && void 0 !== arguments[7]
                ? arguments[7]
                : 8,
            l =
              arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 8
          s = s || {}
          let c = t.sizeX || s.cornerSize || r.cornerSize,
            h = t.sizeY || s.cornerSize || r.cornerSize,
            d = c / 2,
            u = h / 2
          const f = 0.6 * c,
            p = s.cornerIconColor || r.cornerIconColor || '#000000'
          e.save(),
            e.translate(i, n),
            e.rotate(St.fabric.util.degreesToRadians(r.angle)),
            (e.fillStyle = s.cornerColor || r.cornerColor),
            e.beginPath(),
            e.roundRect
              ? e.roundRect(-d + o, -u + l, c, h, 4)
              : e.rect(-d + o, -u + l, c, h),
            (e.filter = 'drop-shadow(0px 0px 2px rgba(0,0,0, 0.3))'),
            e.fill(),
            (e.font = f + 'px FontFPD'),
            (e.fillStyle = p),
            (e.textAlign = 'left'),
            (e.textBaseline = 'top'),
            (e.filter = 'none'),
            e.fillText(a, -0.5 * f + o, -0.5 * f + l),
            e.restore()
        }
        ;(St.fabric.Object.prototype.controls.tl.cursorStyleHandler = () =>
          'pointer'),
          (St.fabric.Object.prototype.controls.tl.mouseDownHandler = function (
            t,
            e
          ) {
            const i = e.target
            'advanced' === i.canvas.viewOptions.cornerControlsStyle &&
              i.canvas.duplicateElement(i)
          }),
          (St.fabric.Object.prototype.controls.tl.actionHandler = null),
          (St.fabric.Object.prototype.controls.tl.render = function (
            e,
            i,
            n,
            s,
            r
          ) {
            t(this, e, i, n, s, r, String.fromCharCode('0xe94d'), -8, -8)
          }),
          (St.fabric.Object.prototype.controls.tr.cursorStyleHandler = () =>
            'pointer'),
          (St.fabric.Object.prototype.controls.tr.mouseDownHandler = function (
            t,
            e
          ) {
            const i = e.target
            i.canvas.removeElement(i)
          }),
          (St.fabric.Object.prototype.controls.tr.actionHandler = null),
          (St.fabric.Object.prototype.controls.tr.render = function (
            e,
            i,
            n,
            s,
            r
          ) {
            t(this, e, i, n, s, r, String.fromCharCode('0xe907'), 8, -8)
          }),
          (St.fabric.Object.prototype.controls.mtr.render = function (
            e,
            i,
            n,
            s,
            r
          ) {
            t(this, e, i, n, s, r, String.fromCharCode('0xe957'))
          }),
          (St.fabric.Object.prototype.controls.br.render = function (
            e,
            i,
            n,
            s,
            r
          ) {
            t(this, e, i, n, s, r, String.fromCharCode('0xe922'))
          })
      }
      var It
      ;(St.fabric.Group.prototype.changeObjectColor = function (t, e) {
        let i = []
        return (
          this.getObjects().forEach(t => {
            const e = o(t.fill)
            i.push(e.toHexString())
          }),
          (i[t] = e),
          this.changeColor(i),
          i
        )
      }),
        (St.fabric.Text.prototype.initialize =
          ((It = St.fabric.Text.prototype.initialize),
          function () {
            for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
              e[i] = arguments[i]
            return It.call(this, ...e), this._TextInit(), this
          })),
        (St.fabric.Text.prototype.toImageSVG = function (t) {
          let e = this.clipPath
          this.clipPath = null
          let i = 1
          if (
            this?.canvas?.viewOptions?.printingBox &&
            this?.canvas?.viewOptions?.output
          ) {
            const t = Math.ceil(
              (25.4 * this.canvas.viewOptions.printingBox.width) /
                this.canvas.viewOptions.output.width
            )
            i = parseInt(300 / t)
          }
          let n = this,
            s = n.width,
            r = n.height
          if (this.shadow?.color) {
            var a = this.shadow
            ;(s += 2 * (Math.abs(a.offsetX) + a.blur)),
              (r += 2 * (Math.abs(a.offsetY) + a.blur))
          }
          let o = n.toDataURL({
            withoutShadow: !1,
            withoutTransform: !0,
            multiplier: i,
            enableRetinaScaling: !1
          })
          return (
            (this.clipPath = e),
            this._createBaseSVGMarkup(
              [
                `<image href="${o}" width = "${s}" height = "${r}" x = "${
                  -s / 2
                }" y="${-r / 2}" style="scale: ${1 / this.scaleX} ${
                  1 / this.scaleY
                }"/>`
              ],
              { reviver: t[0], noStyle: !0, withShadow: !1 }
            )
          )
        }),
        (St.fabric.Text.prototype.toSVG = (function (t) {
          return function () {
            for (var e = arguments.length, i = new Array(e), n = 0; n < e; n++)
              i[n] = arguments[n]
            return this.canvas.printMode &&
              (1 != this.opacity || this.shadow?.color || this.pattern)
              ? this.toImageSVG(i)
              : t.call(this, ...i)
          }
        })(St.fabric.Text.prototype.toSVG)),
        (St.fabric.Text.prototype._constrainScale = (function (t) {
          return function (e) {
            return (
              (e = t.call(this, e)),
              void 0 !== this.minFontSize &&
              parseFloat(Number(e * this.fontSize).toFixed(0)) <
                this.minFontSize
                ? this.minFontSize / this.fontSize
                : void 0 !== this.maxFontSize &&
                  parseFloat(Number(e * this.fontSize).toFixed(0)) >
                    this.maxFontSize
                ? this.maxFontSize / this.fontSize
                : e
            )
          }
        })(St.fabric.Text.prototype._constrainScale)),
        (St.fabric.Text.prototype._TextInit = function () {
          this.on({
            modified: t => {
              ;(t => {
                if (!t.curved && !t.uniScalingUnlockable) {
                  let e = t.fontSize * t.scaleX
                  ;(e = parseFloat(Number(e).toFixed(0))),
                    (t.scaleX = 1),
                    (t.scaleY = 1),
                    t._clearCache(),
                    t.set('fontSize', e),
                    t.canvas &&
                      t.canvas.fire('elementModify', {
                        element: t,
                        options: { fontSize: e }
                      })
                }
              })(this)
            }
          })
        }),
        (St.fabric.Text.prototype._createTextCharSpan = function (t, e, i, n) {
          ;(e.fontWeight = this.fontWeight), (e.fontStyle = this.fontStyle)
          var s = t !== t.trim() || t.match(/  +/g),
            r = this.getSvgSpanStyles(e, s)
          let a = (r +=
              'underline' === this.textDecoration
                ? ' text-decoration: underline;'
                : '')
              ? 'style="' + r + '"'
              : '',
            o = e.deltaY,
            l = '',
            c = St.fabric.Object.NUM_FRACTION_DIGITS
          return (
            o && (l = ' dy="' + St.fabric.util.toFixed(o, c) + '" '),
            [
              '<tspan x="',
              St.fabric.util.toFixed(i, c),
              '" y="',
              St.fabric.util.toFixed(n, c),
              '" ',
              l,
              a,
              '>',
              St.fabric.util.string.escapeXml(t),
              '</tspan>'
            ].join('')
          )
        }),
        (St.fabric.Text.prototype._getSVGLeftTopOffsets = (function (t) {
          return function () {
            for (var e = arguments.length, i = new Array(e), n = 0; n < e; n++)
              i[n] = arguments[n]
            const s = t.call(this, ...i)
            return 'rtl' === this.direction && (s.textLeft = this.width / 2), s
          }
        })(St.fabric.Text.prototype._getSVGLeftTopOffsets)),
        (St.fabric.Text.prototype._renderChars = (function (t) {
          return function () {
            for (var e = arguments.length, i = new Array(e), n = 0; n < e; n++)
              i[n] = arguments[n]
            if ('rtl' === this.direction) {
              const t = i[1]
              t && (t.direction = 'rtl')
            }
            t.call(this, ...i)
          }
        })(St.fabric.Text.prototype._renderChars)),
        (St.fabric.IText.prototype.initialize = (function (t) {
          return function () {
            for (var e = arguments.length, i = new Array(e), n = 0; n < e; n++)
              i[n] = arguments[n]
            return t.call(this, ...i), this._ITextInit(), this
          }
        })(St.fabric.IText.prototype.initialize)),
        (St.fabric.IText.prototype._ITextInit = function () {
          this.on({
            added: () => {
              this.setTextPath && this.setTextPath()
            },
            'editing:entered': () => {
              this.canvas.viewOptions.inCanvasTextEditing || this.exitEditing(),
                this.curved && this.exitEditing()
            },
            changed: () => {
              if (0 != this.maxLines && this.textLines.length > this.maxLines) {
                let t = this.textLines.slice(0, this.maxLines)
                this.set('text', t.join('\n')), this.exitEditing()
              }
              if (
                (0 != this.maxLength &&
                  this.text.length > this.maxLength &&
                  (this.set('text', this.text.substr(0, this.maxLength)),
                  this.exitEditing()),
                this.canvas.viewOptions.disableTextEmojis)
              ) {
                let t = this.text.replace(FPDEmojisRegex, '')
                ;(t = t.replace(String.fromCharCode(65039), '')),
                  this.set('text', t)
              }
              if (this.widthFontSize) {
                let t
                ;(t =
                  this.width > this.widthFontSize
                    ? this.fontSize * (this.widthFontSize / (this.width + 1))
                    : this.fontSize * (this.widthFontSize / (this.width - 1))),
                  t < this.minFontSize
                    ? (t = this.minFontSize)
                    : t > this.maxFontSize && (t = this.maxFontSize),
                  (t = parseInt(t)),
                  this.set('fontSize', t)
              }
            }
          })
        }),
        (St.fabric.Textbox.prototype.initialize = (function (t) {
          return function () {
            for (var e = arguments.length, i = new Array(e), n = 0; n < e; n++)
              i[n] = arguments[n]
            return t.call(this, ...i), this._TextboxInit(), this
          }
        })(St.fabric.Textbox.prototype.initialize)),
        (St.fabric.Textbox.prototype._TextboxInit = function () {
          this.on({
            added: () => {
              if (this._calcWidth) {
                this.set('width', 1e3)
                const t = this.calcTextWidth()
                this.set('width', t), delete this._calcWidth
              }
            }
          })
        })
      const Ot = St.fabric.util.createClass(St.fabric.Group, {
        type: 'neon-text',
        text: '',
        fontFamily: 'Arial',
        fontSize: 40,
        lineHeight: 1,
        charSpacing: 0,
        textAlign: 'left',
        initialize: function (t, e) {
          e || (e = {}),
            (this.text = t),
            (this.texts = []),
            [
              { color: '#fff', offsetX: 0, offsetY: 0, blur: 5 },
              { color: '#fff', offsetX: 0, offsetY: 0, blur: 10 },
              { color: e.fill, offsetX: 0, offsetY: 0, blur: 40 },
              { color: e.fill, offsetX: 0, offsetY: 0, blur: 80 }
            ].forEach((i, n) => {
              const s = new St.fabric.IText(t, {
                left: 0,
                top: 0,
                originX: 'center',
                originY: 'center',
                fontSize: e.fontSize,
                fontFamily: e.fontFamily,
                fill: '#fff',
                shadow: new St.fabric.Shadow(i)
              })
              this.texts.push(s)
            }),
            this.callSuper('initialize', this.texts, e)
        },
        set: function (t, e) {
          ;[
            'fill',
            'fontFamily',
            'text',
            'fontSize',
            'lineHeight',
            'charSpacing',
            'textAlign'
          ].includes(t) &&
            this.texts.forEach(i => {
              'text' == t
                ? (i[t] = e)
                : 'fill' == t
                ? ((this.texts[2].shadow.color = e),
                  (this.texts[3].shadow.color = e))
                : (i[t] = e)
            }),
            setTimeout(() => {
              ;(this.width = this.texts[0].width),
                (this.height = this.texts[0].height),
                this.canvas && this.canvas.renderAll()
            }, 10),
            this.callSuper('set', t, e)
        }
      })
      ;(St.fabric.NeonText = Ot),
        (St.fabric.NeonText.fromObject = function (t, e) {
          return St.fabric.Object._fromObject('NeonText', t, e)
        })
      const kt = function (t, e) {
          let i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 0,
            n =
              arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0
          ;(i = 'number' != typeof i ? 0 : i),
            (n = 'number' != typeof n ? 0 : n)
          let s = 1,
            r = 0 !== i,
            a = 0 !== n
          return (
            (s =
              'cover' ===
              (arguments.length > 4 && void 0 !== arguments[4]
                ? arguments[4]
                : 'fit')
                ? i - t < n - e
                  ? r
                    ? Math.max(i / t, n / e)
                    : 1
                  : a
                  ? Math.max(i / t, n / e)
                  : 1
                : t > e
                ? r
                  ? Math.min(i / t, n / e)
                  : 1
                : a
                ? Math.min(i / t, n / e)
                : 1),
            parseFloat(s.toFixed(10))
          )
        },
        Mt = t => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(t)
      window && (window.FPDFabricUtils = { getScaleByDimesions: kt }),
        (fabric.CurvedText = fabric.util.createClass(fabric.IText, {
          type: 'curved-text',
          initialize: function (t, e) {
            e || (e = {}),
              this.callSuper('initialize', t, e),
              (this.curveRadius = e.curveRadius || 50),
              (this.curveReverse = e.curveReverse || !1),
              (this.effect = e.effect || 'curved'),
              (this.startAngle = e.startAngle || -Math.PI / 2),
              this.on({
                selected: () => {
                  this.path && (this.path.visible = !0)
                },
                deselected: () => {
                  this.path && (this.path.visible = !1)
                }
              })
          },
          _set: function (t, e) {
            return this.callSuper('_set', t, e), this
          },
          _escapeXml: function (t) {
            return t.replace(/[<>&'"]/g, function (t) {
              switch (t) {
                case '<':
                  return '&lt;'
                case '>':
                  return '&gt;'
                case '&':
                  return '&amp;'
                case "'":
                  return '&apos;'
                case '"':
                  return '&quot;'
                default:
                  return t
              }
            })
          },
          _getLetterPositions: function () {
            if (
              !(
                this.textLines?.length > 0 &&
                this.textLines[0].length > 0 &&
                this.curveRadius > 0
              )
            )
              return (
                console.error("ERROR: Can't calculate letter positions."), []
              )
            const t = this.textLines[0],
              e = fabric.util.createCanvasElement().getContext('2d')
            e.font = this.fontSize + 'px ' + this.fontFamily
            const i = [],
              n = 0.1 * this.letterSpacing * this.fontSize
            let s = 0,
              r = 0
            for (let a = 0; a < t.length; a++) {
              const o = e.measureText(t[a]).width
              ;(s +=
                0 === a
                  ? o / 2
                  : n + (e.measureText(t[a - 1] + t[a]).width - o / 2 - r / 2)),
                (r = o),
                i.push({ char: t[a], distance: s })
            }
            const a = this.calcTextWidth() / this.curveRadius / 2 + Math.PI,
              o = this.startAngle + (this.curveReverse ? a : -a - Math.PI)
            return i.map(t => {
              const e =
                o +
                (t.distance / this.curveRadius) * (this.curveReverse ? -1 : 1)
              return {
                char: t.char,
                x: this.curveRadius * Math.cos(e),
                y: this.curveRadius * Math.sin(e),
                rotation: (180 * e) / Math.PI + (this.curveReverse ? 270 : 90)
              }
            })
          },
          toSVG: function () {
            if (
              this.canvas.printMode &&
              (1 != this.opacity || this.shadow?.color || this.pattern)
            ) {
              for (
                var t = arguments.length, e = new Array(t), i = 0;
                i < t;
                i++
              )
                e[i] = arguments[i]
              return this.toImageSVG(e)
            }
            const n = ['<g ', this.getSvgTransform(), this.getSvgFilter()]
            this.clipPath &&
              !this.clipPath.excludeFromExport &&
              n.push(' clip-path="url(#', this.clipPath.clipPathId, ')"'),
              n.push('>')
            const s = this._getLetterPositions(),
              r = [
                'font-family="',
                this.fontFamily
                  ? this._escapeXml(this.fontFamily)
                  : 'Times New Roman',
                '" ',
                'font-size="',
                this.fontSize,
                '" ',
                'font-style="',
                this.fontStyle,
                '" ',
                'font-weight="',
                this.fontWeight,
                '" ',
                'text-decoration="',
                this.textDecoration || '',
                '" ',
                'style="',
                this.getSvgStyles(!0),
                '"',
                this.addPaintOrder()
              ].join('')
            return (
              s.forEach(t => {
                n.push(
                  '<text ',
                  r,
                  'text-anchor="middle" ',
                  'dominant-baseline="middle" ',
                  'transform="translate(',
                  t.x.toFixed(2),
                  ',',
                  t.y.toFixed(2),
                  ') rotate(',
                  t.rotation.toFixed(2),
                  ')"',
                  '>',
                  this._escapeXml(t.char),
                  '</text>\n'
                )
              }),
              n.push('</g>\n'),
              n.join('')
            )
          },
          setTextPath: function () {
            const t = new fabric.Path(
              (0,
              0,
              'M0,0m' +
                -(e = this.curveRadius) +
                ',0a' +
                e +
                ',' +
                e +
                ' 0 1,0 ' +
                2 * e +
                ',0a' +
                e +
                ',' +
                e +
                ' 0 1,0 ' +
                2 * -e +
                ',0'),
              {
                fill: 'transparent',
                strokeWidth: 1,
                stroke: 'rgba(0,0,0, 0.1)',
                visible: !1
              }
            )
            var e
            this.set('path', t), this.updateTextPosition()
          },
          updateTextPosition: function () {
            if (this.path) {
              this.pathSide = this.curveReverse ? 'left' : 'right'
              const t = this.curveReverse
                ? Math.PI * this.curveRadius * 2 * 0.25
                : (Math.PI * this.curveRadius) / 2
              ;(this.pathStartOffset = t - this.calcTextWidth() / 2),
                (this.pathAlign = 'center')
            }
          },
          toObject: function (t) {
            return fabric.util.object.extend(this.callSuper('toObject', t), {
              curveRadius: this.curveRadius,
              curveReverse: this.curveReverse,
              effect: this.effect,
              startAngle: this.startAngle
            })
          }
        })),
        (fabric.CurvedText.fromObject = function (t, e) {
          return fabric.Object._fromObject('CurvedText', t, e)
        }),
        (St.fabric.Object.propertiesToInclude = [
          '_isInitial',
          'lockMovementX',
          'lockMovementY',
          'lockRotation',
          'lockScalingX',
          'lockScalingY',
          'lockScalingFlip',
          'lockUniScaling',
          'resizeType',
          'boundingBox',
          'boundingBoxMode',
          'selectable',
          'evented',
          'title',
          'editable',
          'cornerColor',
          'cornerIconColor',
          'borderColor',
          'isEditable',
          'hasUploadZone',
          'cornerSize',
          'source',
          '_optionsSet'
        ]),
        (St.fabric.Object.prototype._limitModifyOpts = {}),
        (St.fabric.Object.prototype.__editorMode = !1),
        (St.fabric.Object.prototype.initialize = (function (t) {
          return function () {
            for (var e = arguments.length, i = new Array(e), n = 0; n < e; n++)
              i[n] = arguments[n]
            return t.call(this, ...i), this._elementInit(), this
          }
        })(St.fabric.Object.prototype.initialize)),
        (St.fabric.Object.prototype._elementInit = function () {
          this.on({
            added: () => {
              !this.isCustom ||
                this.hasUploadZone ||
                this.replace ||
                (this.copyable = this.originParams.copyable = !0)
            },
            moving: () => {
              this._checkContainment()
            },
            rotating: () => {
              this._checkContainment()
            },
            scaling: () => {
              this._checkContainment()
            },
            selected: () => {
              this._elementControls()
            }
          })
        }),
        (St.fabric.Object.prototype._elementControls = function () {
          let t = Boolean(!this.lockUniScaling || this.__editorMode),
            e = Boolean(!this.lockUniScaling || this.__editorMode),
            i = Boolean(this.copyable || this.__editorMode),
            n = Boolean(this.removable || this.__editorMode),
            s = Boolean(
              (this.resizable || this.__editorMode) &&
                !this.curved &&
                !this.widthFontSize
            ),
            r = Boolean(this.rotatable || this.__editorMode)
          this.textBox && !this.curved && (t = !0),
            this.canvas &&
              'basic' == this.canvas.viewOptions.cornerControlsStyle &&
              ((this.controls.mtr.offsetX = 0), (this.cornerSize = 20)),
            ('printing-boxes' != this.name && 'view-mask' != this.name) ||
              ((t = !1), (e = !1), (r = !1), (i = !1), (n = !1)),
            this.setControlsVisibility({
              ml: t,
              mr: t,
              mt: e,
              mb: e,
              tr: n,
              tl: i,
              mtr: r,
              br: s
            })
        }),
        (St.fabric.Object.prototype._checkContainment = function () {
          if (
            this.canvas &&
            this.canvas.currentBoundingObject &&
            !this.hasUploadZone
          )
            if ((this.setCoords(), 'limitModify' === this.boundingBoxMode)) {
              let t = this.getBoundingRect(),
                e = this.canvas.currentBoundingObject.getBoundingRect(),
                i = e.left,
                n = e.left + e.width - t.width,
                s = e.top,
                r = e.top + e.height - t.height
              this.isContainedWithinObject(this.canvas.currentBoundingObject)
                ? ((this._limitModifyOpts = {
                    left: this.left,
                    top: this.top,
                    angle: this.angle,
                    scaleX: this.scaleX,
                    scaleY: this.scaleY
                  }),
                  'text' == this.getType() &&
                    ((this._limitModifyOpts.fontSize = this.fontSize),
                    (this._limitModifyOpts.lineHeight = this.lineHeight),
                    (this._limitModifyOpts.charSpacing = this.charSpacing)))
                : (t.left > i &&
                    t.left < n &&
                    (this._limitModifyOpts.left = this.left),
                  t.top > s &&
                    t.top < r &&
                    (this._limitModifyOpts.top = this.top),
                  this.setOptions(this._limitModifyOpts))
            } else if (
              'inside' === this.boundingBoxMode ||
              'clipping' === this.boundingBoxMode
            ) {
              var t,
                e = this.isOut
              ;(t = !this.isContainedWithinObject(
                this.canvas.currentBoundingObject
              ))
                ? ('inside' === this.boundingBoxMode &&
                    (this.borderColor =
                      this.canvas.viewOptions.outOfBoundaryColor),
                  (this.isOut = !0))
                : ('inside' === this.boundingBoxMode &&
                    (this.borderColor = this.canvas.viewOptions.selectedColor),
                  (this.isOut = !1)),
                e != this.isOut &&
                  null != e &&
                  (t
                    ? this.canvas.fire('elementOut', { target: this })
                    : this.canvas.fire('elementIn', { target: this })),
                this.canvas.fire('elementCheckContainemt', {
                  target: this,
                  boundingBoxMode: this.boundingBoxMode
                })
            }
        }),
        (St.fabric.Object.prototype._clipElement = function () {
          var t = this.getClippingObject()
          if (t) {
            if (t.type)
              t.clone(t => {
                t.set({ absolutePositioned: !0, opacity: 1 }),
                  (this.clipPath = t)
              })
            else {
              const e = new St.fabric.Rect({
                originX: 'left',
                originY: 'top',
                angle: t.angle || 0,
                left: t.left,
                top: t.top,
                width: t.width,
                height: t.height,
                fill: '#DDD',
                absolutePositioned: !0,
                rx: t.borderRadius,
                ry: t.borderRadius
              })
              this.clipPath = e
            }
            this.canvas.renderAll()
          }
        }),
        (St.fabric.Object.prototype.getType = function (t) {
          return 'text' === (t = t || this.type) ||
            'i-text' === t ||
            'textbox' === t ||
            'neon-text' === t ||
            'engraved-text' === t ||
            'curved-text' === t
            ? 'text'
            : 'image'
        }),
        (St.fabric.Object.prototype.isSVG = function () {
          return (
            'group' === this.type ||
            'path' === this.type ||
            (this.source && this.source.includes('.svg'))
          )
        }),
        (St.fabric.Object.prototype.isColorizable = function () {
          return 'text' === this.getType()
            ? 'text'
            : !!this.source &&
                (1 == this.source.split('.').length
                  ? this.source.includes('data:image/png;')
                    ? 'dataurl'
                    : ((this.fill = this.colors = !1), !1)
                  : (t => this.source.replace(/\?.*$/, ''))().includes(
                      '.png'
                    ) || this.isSVG()
                  ? this.isSVG()
                    ? 'svg'
                    : 'png'
                  : ((this.fill = this.colors = !1), !1))
        }),
        (St.fabric.Object.prototype.isBitmap = function () {
          return 'image' === this.type
        }),
        (St.fabric.Object.prototype.hasColorSelection = function () {
          return (
            (Array.isArray(this.colors) ||
              Boolean(this.colors) ||
              this.colorLinkGroup ||
              this.__editorMode) &&
            !1 !== this.isColorizable()
          )
        }),
        (St.fabric.Object.prototype.checkEditable = function (t) {
          return (
            'object' == typeof (t = t || this).colors ||
            !0 === t.colors ||
            1 == t.colors ||
            t.removable ||
            t.draggable ||
            t.resizable ||
            t.rotatable ||
            t.zChangeable ||
            t.advancedEditing ||
            t.editable ||
            t.uploadZone ||
            (t.colorLinkGroup && t.colorLinkGroup.length > 0) ||
            t.__editorMode
          )
        }),
        (St.fabric.Object.prototype.changeColor = function (t) {
          let e =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
          const i = this.isColorizable()
          if (
            ('string' == typeof t && Mt(t) && (t = o(t).toHexString()),
            'text' === this.getType())
          )
            'object' == typeof t && (t = t[0]),
              this.set('fill', t),
              this.canvas.renderAll(),
              (this.pattern = null)
          else if ('group' == this.type && 'object' == typeof t) {
            const e = this.getObjects()
            t.forEach((t, i) => {
              e[i] && e[i].set('fill', t)
            }),
              this.canvas.renderAll(),
              (this.svgFill = t),
              delete this.fill
          } else
            'object' == typeof t && (t = t[0]),
              'string' != typeof t && (t = !1),
              ('png' != i && 'dataurl' != i) || !t
                ? 'svg' == i && (this.set('fill', t), this.canvas.renderAll())
                : ((this.filters = []),
                  this.filters.push(
                    new St.fabric.Image.filters.BlendColor({
                      mode: this.colorMode,
                      color: t,
                      alpha: 1
                    })
                  ),
                  this.applyFilters(),
                  this.canvas.renderAll(),
                  (this.fill = t))
          this.canvas.fire('elementFillChange', {
            element: this,
            colorLinking: e
          })
        }),
        (St.fabric.Object.prototype.setPattern = function (t) {
          t &&
            (this.canvas.proxyFileServer &&
              (t = this.canvas.proxyFileServer + t),
            St.fabric.util.loadImage(t, t => {
              if (this.isSVG())
                if (this.hasOwnProperty('getObjects')) {
                  const i = this.getObjects()
                  for (var e = 0; e < i.length; ++e)
                    i[e].set(
                      'fill',
                      new St.fabric.Pattern({ source: t, repeat: 'repeat' })
                    )
                } else
                  this.set(
                    'fill',
                    new St.fabric.Pattern({ source: t, repeat: 'repeat' })
                  )
              else if ('text' == this.getType())
                this.set(
                  'fill',
                  new St.fabric.Pattern({ source: t, repeat: 'repeat' })
                )
              else {
                let t = this.fill ? this.fill : this.colors[0]
                ;(t = t || '#000000'), this.set('fill', t)
              }
              this.canvas.renderAll(),
                this.canvas.fire('elementFillChange', { element: this })
            }),
            (this.pattern = t))
        }),
        (St.fabric.Object.prototype.getZIndex = function () {
          return this.canvas.getObjects().indexOf(this)
        }),
        (St.fabric.Object.prototype.centerElement = function () {
          let t =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0],
            e =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1],
            i = this.getBoundingBoxCoords(),
            n = this.left,
            s = this.top
          t &&
            (n = i
              ? i.cp
                ? i.cp.x
                : i.left + 0.5 * i.width
              : 0.5 * this.canvas.viewOptions.stageWidth),
            e &&
              (s = i
                ? i.cp
                  ? i.cp.y
                  : i.top + 0.5 * i.height
                : 0.5 * this.canvas.viewOptions.stageHeight),
            this.setPositionByOrigin(
              new St.fabric.Point(n, s),
              'center',
              'center'
            ),
            this.canvas.renderAll(),
            this.setCoords(),
            this._checkContainment(),
            (this.autoCenter = !1)
        }),
        (St.fabric.Object.prototype.getBoundingBoxCoords = function () {
          if (this.boundingBox || this.uploadZone) {
            if ('object' == typeof this.boundingBox)
              return (
                !!(
                  this.boundingBox.hasOwnProperty('x') &&
                  this.boundingBox.hasOwnProperty('y') &&
                  this.boundingBox.width &&
                  this.boundingBox.height
                ) && {
                  left: this.boundingBox.x,
                  top: this.boundingBox.y,
                  width: this.boundingBox.width,
                  height: this.boundingBox.height,
                  borderRadius: this.boundingBox.borderRadius || 0
                }
              )
            {
              const t = this.canvas.getElementByTitle(this.boundingBox)
              if (t) {
                const e = t.getPointByOrigin('left', 'top')
                return {
                  left: e.x,
                  top: e.y,
                  width: t.width * t.scaleX,
                  height: t.height * t.scaleY,
                  angle: t.angle || 0,
                  cp: t.getCenterPoint()
                }
              }
            }
          }
          return !1
        }),
        (St.fabric.Object.prototype.getClippingObject = function () {
          if (this.boundingBox || this.uploadZone) {
            if ('object' == typeof this.boundingBox)
              return this.getBoundingBoxCoords()
            {
              const t = this.canvas.getElementByTitle(this.boundingBox)
              if (t) return 'image' == t.type ? this.getBoundingBoxCoords() : t
            }
          }
          return !1
        }),
        (St.fabric.Object.prototype.getElementJSON = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : []
          this.canvas &&
            ((e = Object.keys(this.canvas.viewOptions.elementParameters)),
            (e =
              'text' === this.getType()
                ? e.concat(Object.keys(this.canvas.viewOptions.textParameters))
                : e.concat(
                    Object.keys(this.canvas.viewOptions.imageParameters)
                  ))),
            t && (e = e.concat(St.fabric.Object.propertiesToInclude)),
            this.uploadZone &&
              (e.push('customAdds'),
              e.push('designCategories'),
              e.push('designCategories[]')),
            'text' === this.getType() &&
              (e.push('text'), e.push('_initialText')),
            'group' === this.type && e.push('svgFill'),
            e.push('width'),
            e.push('height'),
            e.push('isEditable'),
            e.push('hasUploadZone'),
            e.push('evented'),
            e.push('isCustom'),
            e.push('currentColorPrice'),
            e.push('_isPriced'),
            e.push('originParams'),
            e.push('originSource'),
            e.push('_printingBox'),
            e.push('_optionsSet'),
            e.push('_isQrCode'),
            e.push('cropMask'),
            e.push('isCustomImage'),
            (e = e.sort())
          let i = {}
          return (
            e.forEach(t => {
              void 0 !== this[t] && (i[t] = this[t])
            }),
            i
          )
        }),
        (St.fabric.Object.prototype.alignToPosition = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'left',
            e = this.getPointByOrigin('left', 'top'),
            i = this.getBoundingBoxCoords(),
            n = 'left',
            s = 'top'
          'left' === t
            ? ((e.x = i ? i.left : 0), (e.x += this.padding + 1))
            : 'top' === t
            ? ((e.y = i ? i.top : 0), (e.y += this.padding + 1))
            : 'right' === t
            ? ((e.x = i
                ? i.left + i.width - this.padding
                : this.canvas.viewOptions.stageWidth - this.padding),
              (n = 'right'))
            : ((e.y = i
                ? i.top + i.height - this.padding
                : this.canvas.viewOptions.stageHeight),
              (s = 'bottom')),
            this.setPositionByOrigin(e, n, s),
            this.canvas.renderAll(),
            this._checkContainment()
        }),
        (St.fabric.Object.prototype.toggleUploadZone = function () {
          if (this.hasUploadZone && this.canvas) {
            let i = this.canvas.getObjects(),
              n = !0
            for (var t = 0; t < i.lenth; ++t)
              if (i[t].replace == this.replace) {
                n = !1
                break
              }
            var e = this.canvas.getUploadZone(this.replace)
            e && (e.set('opacity', n ? 1 : 0), (e.evented = n)),
              this.canvas.renderAll()
          }
        }),
        i(106),
        (fabric.Canvas.prototype.panCanvas = !1)
      ;(fabric.Canvas.prototype.snapToObjects = !1),
        (fabric.Canvas.prototype.snapToGrid = !1),
        (fabric.Canvas.prototype.snapGridSize = [50, 50])
      ;(fabric.Canvas.prototype.enableRuler = !1),
        (fabric.Canvas.prototype.rulerBg = 'rgba(0,0,0, 0.6)'),
        (fabric.Canvas.prototype.rulerTickColor = '#ccc')
      ;(St.fabric.Canvas.prototype.viewOptions = {}),
        (St.fabric.Canvas.prototype.elements = []),
        (St.fabric.Canvas.prototype.currentElement = null),
        (St.fabric.Canvas.prototype.responsiveScale = 1),
        (St.fabric.Canvas.prototype.currentBoundingObject = null),
        (St.fabric.Canvas.prototype.initialElementsLoaded = !1),
        (St.fabric.Canvas.prototype.isCustomized = !1),
        (St.fabric.Canvas.prototype.printingBoxObject = null),
        (St.fabric.Canvas.prototype._canvasCreated = !1),
        (St.fabric.Canvas.prototype._doHistory = !1),
        (St.fabric.Canvas.prototype.forbiddenTextChars = /<|>/g),
        (St.fabric.Canvas.prototype.proxyFileServer = ''),
        (St.fabric.Canvas.prototype.initialize = (function (t) {
          return function () {
            for (var e = arguments.length, i = new Array(e), n = 0; n < e; n++)
              i[n] = arguments[n]
            return t.call(this, ...i), this._fpdCanvasInit(), this
          }
        })(St.fabric.Canvas.prototype.initialize)),
        (St.fabric.Canvas.prototype._onTouchStart = (function (t) {
          return function (e) {
            const i = this.findTarget(e)
            ;(!this.allowTouchScrolling || i || this.isDrawingMode) &&
              t.call(this, e)
          }
        })(St.fabric.Canvas.prototype._onTouchStart)),
        (St.fabric.Canvas.prototype._fpdCanvasInit = function () {
          if (this.containerClass.includes('fpd-hidden-canvas')) return
          let t = null
          this.on({
            'after:render': () => {
              this._canvasCreated || this._onCreated(),
                this.viewOptions &&
                  this.viewOptions.highlightEditableObjects &&
                  this.viewOptions.highlightEditableObjects.length > 3 &&
                  ((this.contextContainer.strokeStyle =
                    this.viewOptions.highlightEditableObjects),
                  this.forEachObject(t => {
                    if (
                      t !== this.getActiveObject() &&
                      !t.isMoving &&
                      (('text' === t.getType() && t.editable) || t.uploadZone)
                    ) {
                      const e = t.getBoundingRect()
                      this.contextContainer.setLineDash([5, 15]),
                        this.contextContainer.strokeRect(
                          e.left,
                          e.top,
                          e.width,
                          e.height
                        )
                    } else this.contextContainer.setLineDash([])
                  }))
            },
            'object:added': t => {
              let { target: e } = t
              this._bringToppedElementsToFront()
            },
            'object:moving': e => {
              let { target: i } = e
              ;(t = 'moving'),
                this.fire('elementChange', { type: 'moving', element: i })
            },
            'object:rotating': e => {
              let { target: i } = e
              ;(t = 'rotating'),
                this.fire('elementChange', { type: 'rotating', element: i })
            },
            'object:scaling': e => {
              let { target: i } = e
              ;(t = 'scaling'),
                this.fire('elementChange', { type: 'scaling', element: i })
            },
            'object:modified': e => {
              let { target: i } = e
              const n = i
              if (null !== t) {
                let e = {}
                switch (t) {
                  case 'moving':
                    ;(e.left = Number(n.left)), (e.top = Number(n.top))
                    break
                  case 'scaling':
                    'text' !== n.getType() || n.curved || n.uniScalingUnlockable
                      ? ((e.scaleX = parseFloat(n.scaleX)),
                        (e.scaleY = parseFloat(n.scaleY)))
                      : (e.fontSize = parseInt(n.fontSize))
                    break
                  case 'rotating':
                    e.angle = n.angle
                }
                this.fire('elementModify', { element: n, options: e })
              }
              t = null
            },
            'selection:created': t => {
              let { selected: e } = t
              1 == e.length ? this._onSelected(e[0]) : this._onMultiSelected(e)
            },
            'selection:updated': t => {
              let { selected: e } = t
              1 == e.length ? this._onSelected(e[0]) : this._onMultiSelected(e)
            },
            'mouse:down': t => {
              ;
              if(t.target && t.target.text){
                document.querySelector('.fpd-ungroup1')?.classList.add('fpd-hidden');
                document.querySelector('.fpd-ungroup')?.classList.remove('fpd-hidden');
              }
              else{
                document.querySelector('.fpd-ungroup1')?.classList.remove('fpd-hidden');
                document.querySelector('.fpd-ungroup')?.classList.add('fpd-hidden');
              }
              // let lengthcheck = t.target._objects.length;
              // if(lengthcheck > 1) {
              //   t.target.removable = true;
              //   t.target.cornerSize = 22;
              //   t.target.resizable = true;
              // }
              t.target &&
                t.target.__corner &&
                'function' == typeof t.target.exitEditing &&
                t.target.exitEditing(),
                null == t.target && this.deselectElement()
            },
            elementAdd: () => {
              this.forEachObject(t => {
                !t.clipPath &&
                  ((t.boundingBox && 'clipping' === t.boundingBoxMode) ||
                    t.hasUploadZone) &&
                  t._clipElement()
              })
            },
            'text:changed': t => {
              let { target: e } = t
              this.fire('elementModify', {
                element: e,
                options: { text: e.text }
              })
            }
          })
        }),
        (St.fabric.Canvas.prototype._onCreated = function () {
          var t
          ;(this._canvasCreated = !0),
            ((t, e) => {
              let i,
                n,
                s,
                r,
                a = !1,
                o = null
              t.on({
                'mouse:down': e => {
                  ;(a = !0),
                    e.e.touches &&
                      ((i = e.e.touches[0].clientX),
                      (n = e.e.touches[0].clientY),
                      t.currentElement &&
                        ((s = t.currentElement.scaleX),
                        (r = t.currentElement.scaleY)))
                },
                'mouse:up': function (t) {
                  ;(a = !1), (o = null)
                },
                'mouse:move': function (l) {
                  let c = null
                  if (
                    ('pinchImageScale' == e || 'pinchPanCanvas' == e) &&
                    l.e.touches &&
                    2 == l.e.touches.length
                  ) {
                    let t = l.e.touches[0],
                      e = l.e.touches[1]
                    null === o &&
                      (o = Math.sqrt(
                        Math.pow(e.clientX - t.clientX, 2) +
                          Math.pow(e.clientY - t.clientY, 2)
                      )),
                      (c =
                        Math.sqrt(
                          Math.pow(e.clientX - t.clientX, 2) +
                            Math.pow(e.clientY - t.clientY, 2)
                        ) / o)
                  }
                  if (
                    'pinchImageScale' == e &&
                    null !== c &&
                    t.currentElement &&
                    'image' == t.currentElement.getType() &&
                    t.currentElement.resizable
                  )
                    t.setElementOptions(
                      { scaleX: s * c, scaleY: r * c },
                      t.currentElement
                    )
                  else if ('pinchPanCanvas' == e && l.e.touches && null !== c)
                    t.setResZoom(c)
                  else if (t.panCanvas)
                    if (l.e.touches) {
                      if (1 == l.e.touches.length) {
                        let e = l.e.touches[0].clientX,
                          s = l.e.touches[0].clientY
                        t.relativePan(new fabric.Point(e - i, s - n)),
                          (i = e),
                          (n = s)
                      }
                    } else
                      a &&
                        t.relativePan(
                          new fabric.Point(l.e.movementX, l.e.movementY)
                        )
                }
              })
            })(this, this.viewOptions.mobileGesturesBehaviour),
            (t => {
              let e,
                i = t.getSelectionContext(),
                n = 4,
                s = 1,
                r = 'rgba(255,0,241,0.5)',
                a = 1
              function o (e) {
                c(e - s, 0, e - s, t.getHeight() / a)
              }
              function l (e) {
                c(0, e - s, t.getWidth() / a, e - s)
              }
              function c (n, o, l, c) {
                i.save(),
                  (i.lineWidth = s),
                  (i.strokeStyle = r),
                  i.beginPath(),
                  t.snapToGrid || i.setLineDash([5, 10]),
                  i.moveTo((n + e[4]) * a, (o + e[5]) * a),
                  i.lineTo((l + e[4]) * a, (c + e[5]) * a),
                  i.stroke(),
                  i.restore()
              }
              function h (t, e) {
                ;(t = Math.round(t)), (e = Math.round(e))
                for (var i = t - n, s = t + n; i <= s; i++)
                  if (i === e) return !0
                return !1
              }
              var d = [],
                u = []
              t.on('mouse:down', () => {
                ;(e = t.viewportTransform), (a = t.getZoom())
              }),
                t.on('object:moving', i => {
                  let n = i.target,
                    s = t.getObjects(),
                    r = n.getCenterPoint(),
                    a = r.x,
                    o = r.y,
                    l = n.getBoundingRect(),
                    c = l.height / e[3],
                    f = l.width / e[0],
                    p = !1,
                    g = !1,
                    m = t._currentTransform
                  if ((t.snapToGrid, t.snapToObjects && !t.snapToGrid && m)) {
                    for (var v = s.length; v--; )
                      if (s[v] !== n) {
                        var b = s[v].getCenterPoint(),
                          y = b.x,
                          x = b.y,
                          w = s[v].getBoundingRect(),
                          C = w.height / e[3],
                          S = w.width / e[0]
                        h(y, a) &&
                          ((g = !0),
                          d.push({
                            x: y,
                            y1: x < o ? x - C / 2 - 1 : x + C / 2 + 1,
                            y2: o > x ? o + c / 2 + 1 : o - c / 2 - 1
                          }),
                          n.setPositionByOrigin(
                            new fabric.Point(y, o),
                            'center',
                            'center'
                          )),
                          h(y - S / 2, a - f / 2) &&
                            ((g = !0),
                            d.push({
                              x: y - S / 2,
                              y1: x < o ? x - C / 2 - 1 : x + C / 2 + 1,
                              y2: o > x ? o + c / 2 + 1 : o - c / 2 - 1
                            }),
                            n.setPositionByOrigin(
                              new fabric.Point(y - S / 2 + f / 2, o),
                              'center',
                              'center'
                            )),
                          h(y + S / 2, a + f / 2) &&
                            ((g = !0),
                            d.push({
                              x: y + S / 2,
                              y1: x < o ? x - C / 2 - 1 : x + C / 2 + 1,
                              y2: o > x ? o + c / 2 + 1 : o - c / 2 - 1
                            }),
                            n.setPositionByOrigin(
                              new fabric.Point(y + S / 2 - f / 2, o),
                              'center',
                              'center'
                            )),
                          h(x, o) &&
                            ((p = !0),
                            u.push({
                              y: x,
                              x1: y < a ? y - S / 2 - 1 : y + S / 2 + 1,
                              x2: a > y ? a + f / 2 + 1 : a - f / 2 - 1
                            }),
                            n.setPositionByOrigin(
                              new fabric.Point(a, x),
                              'center',
                              'center'
                            )),
                          h(x - C / 2, o - c / 2) &&
                            ((p = !0),
                            u.push({
                              y: x - C / 2,
                              x1: y < a ? y - S / 2 - 1 : y + S / 2 + 1,
                              x2: a > y ? a + f / 2 + 1 : a - f / 2 - 1
                            }),
                            n.setPositionByOrigin(
                              new fabric.Point(a, x - C / 2 + c / 2),
                              'center',
                              'center'
                            )),
                          h(x + C / 2, o + c / 2) &&
                            ((p = !0),
                            u.push({
                              y: x + C / 2,
                              x1: y < a ? y - S / 2 - 1 : y + S / 2 + 1,
                              x2: a > y ? a + f / 2 + 1 : a - f / 2 - 1
                            }),
                            n.setPositionByOrigin(
                              new fabric.Point(a, x + C / 2 - c / 2),
                              'center',
                              'center'
                            ))
                      }
                    p || (u.length = 0), g || (d.length = 0)
                  }
                }),
                t.on('before:render', () => {
                  t.contextTop && t.clearContext(t.contextTop)
                }),
                t.on('after:render', () => {
                  if (!t.panCanvas)
                    if (t.snapToGrid) {
                      if (
                        ((e = t.viewportTransform),
                        (a = t.getZoom()),
                        t.snapGridSize)
                      ) {
                        const e = Math.round(t.width / a / t.snapGridSize[0])
                        for (let i = 0; i < e; ++i) o(i * t.snapGridSize[0])
                        const i = Math.round(t.height / a / t.snapGridSize[1])
                        for (let e = 0; e < i; ++e) l(e * t.snapGridSize[1])
                      }
                    } else {
                      for (var i = d.length; i--; ) o(d[i].x)
                      for (i = u.length; i--; ) l(u[i].y)
                      d.length = u.length = 0
                    }
                }),
                t.on('mouse:up', () => {
                  ;(d.length = u.length = 0), t.renderAll()
                })
            })(this),
            (t = this).on('after:render', () => {
              if (t.viewOptions && t.enableRuler) {
                const n = 10,
                  s = 100,
                  r = t.viewOptions.rulerUnit,
                  a = t.viewOptions.rulerPosition,
                  o = t.viewOptions.printingBox,
                  l = t.getZoom(),
                  c = t.getSelectionContext()
                if (!c) return
                const h = t.viewOptions.stageWidth,
                  d = t.viewOptions.stageHeight,
                  u = t => {
                    const e = t / n,
                      i = Math.pow(10, Math.floor(Math.log10(e))),
                      s = e / i
                    return s >= 5 ? 5 * i : s >= 2 ? 2 * i : i
                  }
                let f,
                  p = 'cm' == r ? 10 : 1,
                  g = 1,
                  m = 1
                'px' != r &&
                H(o, ['left', 'top', 'width', 'height']) &&
                H(t.viewOptions.output, ['width', 'height'])
                  ? ((f = t.viewOptions.output),
                    (g = f.width / o.width),
                    (m = f.height / o.height))
                  : (p = 1)
                let v = 20 * l,
                  b = 20 * l,
                  y = 0,
                  x = 0,
                  w = t.width - b,
                  C = 0,
                  S = h,
                  T = d,
                  E = h * g,
                  A = d * m
                'pb' == a &&
                  f &&
                  ((y = o.left * l),
                  (x = (o.top - v) * l),
                  (S = o.width * l),
                  (w = (o.left + o.width) * l),
                  (C = o.top * l),
                  (T = o.height * l),
                  (E = f.width),
                  (A = f.height)),
                  (c.fillStyle = t.rulerBg),
                  c.fillRect(y, x, S, v)
                for (var e = 0; e <= E; e += u(E)) {
                  const i = e % s == 0 ? v : v / 3,
                    n = (e * l) / g
                  if ((c.fillRect(y + n, x, 1, i), e % s == 0)) {
                    ;(c.fillStyle = t.rulerTickColor), (c.font = '10px Arial')
                    let i = y + n
                    const s = c.measureText(Math.round(e / p))
                    ;(i += 0 == e ? 2 : -(s.width + 2)),
                      c.fillText(
                        Math.round(e / p) +
                          (0 == e ? ' ' + r.toUpperCase() : ''),
                        i,
                        x + v - 2
                      )
                  }
                }
                ;(c.fillStyle = t.rulerBg), c.fillRect(w, C, b, T)
                for (var i = 0; i <= A; i += u(A)) {
                  const e = i % s == 0 ? b : b / 3,
                    n = (i * l) / m
                  if ((c.fillRect(w, C + n, e, 1), i % s == 0)) {
                    ;(c.fillStyle = t.rulerTickColor), (c.font = '10px Arial')
                    let e = C + n
                    ;(e += 0 == i ? 12 : -2),
                      c.fillText(Math.round(i / p), w, e)
                  }
                }
              }
            }),
            t.on('before:render', () => {
              t.contextTop && t.clearContext(t.contextTop)
            }),
            this._renderPrintingBox()
        }),
        (St.fabric.Canvas.prototype._onSelected = function (t) {
          if ('crop-mask' !== t.name) {
            const t = this.getObjects().find(t => 'crop-mask' === t.name)
            t && this.remove(t)
          }
          if ((this.deselectElement(!1), this.dragStage))
            return this.deselectElement(), !1
          ;(this.currentElement = t),
            this.fire('elementSelect', { element: t }),
            (this.hoverCursor = t.draggable ? 'move' : 'pointer'),
            t.boundingBox && !t.uploadZone && this._renderElementBoundingBox(t)
        }),
        (St.fabric.Canvas.prototype._onMultiSelected = function (t) {
          const e = this.getActiveObject()
          this.viewOptions.multiSelection &&
            (e.set({
              lockScalingX: !Boolean(this.viewOptions.editorMode),
              lockScalingY: !Boolean(this.viewOptions.editorMode),
              lockRotation: !Boolean(this.viewOptions.editorMode),
              hasControls: Boolean(this.viewOptions.editorMode),
              borderDashArray: [8, 8],
              cornerSize: 24,
              transparentCorners: !1,
              borderColor: this.viewOptions.multiSelectionColor,
              borderScaleFactor: 3
            }),
            t.forEach(t => {
              ;((t.draggable || this.viewOptions.editorMode) && t.evented) ||
                e.removeWithUpdate(t)
            }),
            e.setControlsVisibility({ tr: !1, tl: !1, mtr: !1 }),
            this.fire('multiSelect', { activeSelection: e }))
        }),
        (St.fabric.Canvas.prototype._renderElementBoundingBox = function (t) {
          var e = this
          this.currentBoundingObject &&
            (this.remove(this.currentBoundingObject),
            (this.currentBoundingObject = null))
          const i = function () {
            let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null
            t &&
              (e.add(t),
              t.bringToFront(),
              e.fire('boundingBoxToggle', {
                currentBoundingObject: e.currentBoundingObject,
                state: !0
              }))
          }
          if (
            t &&
            (!t._printingBox || !this.viewOptions.printingBox.visibility)
          ) {
            var n = t.getBoundingBoxCoords()
            if (n && 'none' != t.boundingBoxMode) {
              let e = {
                stroke: this.viewOptions.boundingBoxColor,
                strokeWidth: 1,
                strokeLineCap: 'square',
                strokeDashArray: [10, 10],
                fill: !1,
                selectable: !1,
                evented: !1,
                name: 'bounding-box',
                excludeFromExport: !0,
                _ignore: !0,
                rx: n.borderRadius,
                ry: n.borderRadius
              }
              ;(e = z(e, this.viewOptions.boundingBoxProps)),
                t.clipPath && 'rect' != t.clipPath.type
                  ? t.clipPath &&
                    t.clipPath.clone(n => {
                      ;(e = z(e, { fill: 'transparent' })),
                        n.set(e),
                        'group' == n.type &&
                          n.forEachObject(t => {
                            t.set('fill', 'transparent')
                          }),
                        (this.currentBoundingObject = n),
                        i(this.currentBoundingObject),
                        t._checkContainment()
                    })
                  : ((e = z(e, {
                      left: n.left,
                      top: n.top,
                      width: n.width,
                      height: n.height,
                      angle: n.angle || 0,
                      originX: 'left',
                      originY: 'top'
                    })),
                    (this.currentBoundingObject = new St.fabric.Rect(e)),
                    i(this.currentBoundingObject))
            }
            t._checkContainment()
          }
        }),
        (St.fabric.Canvas.prototype._renderPrintingBox = function () {
          if (
            (this.printingBoxObject &&
              (this.remove(this.printingBoxObject),
              (this.printingBoxObject = null)),
            H(this.viewOptions.printingBox, ['left', 'top', 'width', 'height']))
          ) {
            const t = this.viewOptions.printingBox.width,
              e = this.viewOptions.printingBox.height,
              i = 1,
              n =
                this.viewOptions.printingBox.visibility ||
                this.viewOptions.editorMode,
              s = new St.fabric.Rect({
                width: t + i,
                height: e + i,
                stroke: n ? '#db2828' : 'transparent',
                strokeWidth: i,
                strokeLineCap: 'square',
                fill: !1,
                originX: 'left',
                originY: 'top',
                name: 'printing-box',
                visible: !this.printMode
              })
            this.printingBoxObject = new St.fabric.Group([s], {
              left: this.viewOptions.printingBox.left - i,
              top: this.viewOptions.printingBox.top - i,
              evented: !1,
              resizable: !0,
              removable: !1,
              copyable: !1,
              rotatable: !1,
              uniformScaling: !1,
              lockRotation: !0,
              borderColor: 'transparent',
              transparentCorners: !0,
              cornerColor: this.viewOptions.selectedColor,
              cornerIconColor: this.viewOptions.cornerIconColor,
              cornerSize: 24,
              originX: 'left',
              originY: 'top',
              name: 'printing-boxes',
              excludeFromExport: !this.printMode,
              selectable: !1,
              _ignore: !0
            })
            const r = this.viewOptions?.output?.bleed
            if (r && this.viewOptions.innerBleed && n) {
              const n =
                  (this.viewOptions.printingBox.width /
                    this.viewOptions.output.width) *
                  r,
                a = t - n,
                o = e - n,
                l = new St.fabric.Rect({
                  left: s.left,
                  top: s.top,
                  width: a + i,
                  height: o + i,
                  stroke: '#db2828',
                  strokeWidth: n,
                  opacity: 0.2,
                  strokeLineCap: 'square',
                  fill: !1,
                  originX: 'left',
                  originY: 'top',
                  name: 'bleed-box',
                  visible: !this.printMode
                })
              this.printingBoxObject.add(l)
              const c = [4, 4],
                h = '#000000',
                d = [
                  new St.fabric.Line(
                    [
                      0.5 * -t,
                      0.5 * -e + n - 1,
                      0.5 * -t + n,
                      0.5 * -e + n - 1
                    ],
                    { stroke: h, strokeDashArray: c }
                  ),
                  new St.fabric.Line(
                    [
                      0.5 * -t + n - 1,
                      0.5 * -e,
                      0.5 * -t + n - 1,
                      0.5 * -e + n
                    ],
                    { stroke: h, strokeDashArray: c }
                  ),
                  new St.fabric.Line(
                    [0.5 * t, 0.5 * -e + n - 1, 0.5 * t - n, 0.5 * -e + n - 1],
                    { stroke: h, strokeDashArray: c }
                  ),
                  new St.fabric.Line(
                    [0.5 * t - n, 0.5 * -e, 0.5 * t - n, 0.5 * -e + n],
                    { stroke: h, strokeDashArray: c }
                  ),
                  new St.fabric.Line(
                    [0.5 * -t, 0.5 * e - n, 0.5 * -t + n, 0.5 * e - n],
                    { stroke: h, strokeDashArray: c }
                  ),
                  new St.fabric.Line(
                    [0.5 * -t + n - 1, 0.5 * e, 0.5 * -t + n - 1, 0.5 * e - n],
                    { stroke: h, strokeDashArray: c }
                  ),
                  new St.fabric.Line(
                    [0.5 * t, 0.5 * e - n, 0.5 * t - n, 0.5 * e - n],
                    { stroke: h, strokeDashArray: c }
                  ),
                  new St.fabric.Line(
                    [0.5 * t - n, 0.5 * e, 0.5 * t - n, 0.5 * e - n],
                    { stroke: h, strokeDashArray: c }
                  )
                ],
                u = new St.fabric.Group(d, {
                  evented: !1,
                  selectable: !1,
                  name: 'crop-marks'
                })
              this.printingBoxObject.add(u)
            }
            this.add(this.printingBoxObject),
              this.printingBoxObject.setCoords(),
              this.renderAll()
          }
        }),
        (St.fabric.Canvas.prototype._bringToppedElementsToFront = function () {
          // ===== CUSTOM (StyleFlip): only "Knob" layers are forced on top.
          // This runs on every 'object:added', so whatever it brings to the
          // front ends up above any newly added text / uploaded image. It
          // used to do that for EVERY `topped` element - including design
          // artwork that was saved with `topped: 1` (e.g. the "Custom Guitar
          // Skins New" design's draggable, removable "Image" layer), so after
          // opening such a design every new text/image landed BEHIND the
          // artwork. Now only Knob layers - the locked product chrome drawn
          // over the customer's design (Overlay = knobs/pickups/bezel,
          // Group Text / Group Outline = printed labels and outlines) - are
          // re-raised, keeping their relative order. Any other `topped`
          // layer keeps its own position like a normal layer, so new
          // elements go above it and below the Knob layers.
          const isKnobLayer = o =>
            !!o &&
            !!o.topped &&
            (/^(overlay|group text\b|group outline\b)|knob/i.test(
              String(o.title || '').trim()
            ) ||
              (!o.isCustom && !!o.locked))
          let t = this.getObjects(),
            e = []
          t.forEach(t => {
            ;(isKnobLayer(t) ||
              (t.uploadZone && this.viewOptions.uploadZonesTopped)) &&
              e.push(t)
          }),
            e.forEach(t => {
              t.bringToFront()
            }),
            this.currentBoundingObject &&
              this.currentBoundingObject.bringToFront(),
            this.printingBoxObject && this.printingBoxObject.bringToFront()
        }),
        (St.fabric.Canvas.prototype.addElements = function (t, e) {
          let i = -1
          const n = () => {
              if ((i++, i < t.length)) {
                const e = t[i]
                s(e) || this.addElement(e.type, e.source, e.title, e.parameters)
              } else
                this.off('elementAdd', n),
                  void 0 !== e && e.call(e, this),
                  (this.initialElementsLoaded = !0)
            },
            s = e => {
              if (
                void 0 === e.type ||
                void 0 === e.source ||
                void 0 === e.title
              ) {
                const i = t.indexOf(e)
                if (-1 !== i)
                  return (
                    n(),
                    !0
                  )
              } else this.elements.push(e)
              return !1
            }
          t[0]
            ? (this.on('elementAdd', n), n())
            : (void 0 !== e && e.call(e, this),
              (this.initialElementsLoaded = !0))
        }),
        (St.fabric.Canvas.prototype.addElement = function (t, e, i) {
          var n = this
          let s,
            r =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {}
          if (void 0 === t || void 0 === e || void 0 === i) return
          if (
            (this.fire('beforeElementAdd', {
              type: t,
              source: e,
              title: i,
              params: r
            }),
            'text' === t &&
              ((e = (e = e.replace(/(<([^>]+)>)/gi, '')).replace(
                this.forbiddenTextChars,
                ''
              )),
              (i = i.replace(/(<([^>]+)>)/gi, ''))),
            r.colorLinkGroup)
          ) {
            let t = this.getElements()
            if (t) {
              const e = t.find(t => t.colorLinkGroup === r.colorLinkGroup)
              e && e.fill && (r.fill = e.fill)
            }
          }
          if (
            ('string' == typeof r.fill ||
              Array.isArray(r.fill) ||
              (r.fill = !1),
            (s = t.toLowerCase().includes('text')
              ? z(
                  this.viewOptions.elementParameters,
                  this.viewOptions.textParameters
                )
              : z(
                  this.viewOptions.elementParameters,
                  this.viewOptions.imageParameters
                )),
            (r = z(s, r)),
            r.colors &&
              'string' == typeof r.colors &&
              0 == r.colors.indexOf('#'))
          ) {
            var a = r.colors.replace(/\s+/g, '').split(',')
            r.colors = a
          }
          if (
            ((r._isInitial = !this.initialElementsLoaded),
            t.toLowerCase().includes('text'))
          ) {
            var l = r.colors[0] ? r.colors[0] : '#000000'
            r.fill = r.fill ? r.fill : l
          }
          let c = { source: e, title: i, id: String(new Date().getTime()) }
          this.viewOptions.editorMode
            ? ((r.__editorMode = this.viewOptions.editorMode),
              (c.selectable = c.evented = !0))
            : (c = z(c, {
                selectable: !1,
                lockRotation: !0,
                hasRotatingPoint: !1,
                lockScalingX: !0,
                lockScalingY: !0,
                lockMovementX: !0,
                lockMovementY: !0,
                hasControls: !1,
                evented: !1,
                lockScalingFlip: !0
              })),
            (c = z(r, c)),
            c.isCustom &&
              ('engraving' == W(this.viewOptions, 'industry.type') &&
                (c.opacity = W(this.viewOptions, 'industry.opts.opacity', 0.5)),
              (this.isCustomized = !0))
          let h = !1
          if (
            ((('string' == typeof c.boundingBox && c.boundingBox.length > 0) ||
              ('object' == typeof c.boundingBox &&
                H(c.boundingBox, ['width', 'height']) &&
                c.boundingBox.width > 0 &&
                c.boundingBox.height > 0)) &&
              (h = !0),
            this.viewOptions.usePrintingBoxAsBounding &&
              !h &&
              H(this.viewOptions.printingBox, [
                'left',
                'top',
                'width',
                'height'
              ]) &&
              ((c.boundingBox = {
                x: this.viewOptions.printingBox.left - 1,
                y: this.viewOptions.printingBox.top - 1,
                width: this.viewOptions.printingBox.width + 1,
                height: this.viewOptions.printingBox.height + 1
              }),
              (c._printingBox = c.boundingBox)),
            'image' == t || 'path' == t || 'group' == t)
          ) {
            if (-1 === e.search('<svg ')) {
              var d = e.split('?')
              e = c.source = d[0]
            }
            const t = function (t, e, i) {
              let s =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : {}
              t
                ? ((e.originParams = z(e, s)),
                  t.setOptions(e),
                  n.add(t),
                  n.setElementOptions(e, t),
                  (t.originParams.angle = t.angle),
                  (t.originParams.z = t.getZIndex()))
                : n.fire('imageFail', { url: e.source }),
                n.fire('elementAdd', { element: t })
            }
            if (void 0 === e || 0 === e.length)
              return (
                console.log('No image source set for: ' + i),
                n.fire('imageFail', { url: e }),
                void n.fire('elementAdd', { element: void 0 })
              )
            if (-1 !== e.search('<svg'))
              St.fabric.loadSVGFromString(e, (e, i) => {
                var n = St.fabric.util.groupSVGElements(e, i)
                if (c.fill) c.svgFill || (c.svgFill = c.fill), delete c.fill
                else if (!c.fill && !c.svgFill) {
                  if (e) {
                    r.colors = []
                    for (var s = 0; s < e.length; ++s) {
                      var a =
                        e[s].fill.length > 0
                          ? o(e[s].fill).toHexString()
                          : 'transparent'
                      r.colors.push(a)
                    }
                    r.svgFill = r.colors
                  }
                  c.svgFill = r.svgFill
                }
                delete c.boundingBox,
                  delete c.originParams,
                  delete c.colors,
                  delete c.svgFill,
                  delete c.width,
                  delete c.height,
                  delete c.originX,
                  delete c.originY,
                  delete c.objectCaching,
                  t(n, c, !0, { svgFill: r.svgFill })
              })
            else if (e.split('.').includes('svg')) {
              let i = Date.now().toString(),
                n = V(e) ? new URL(this.proxyFileServer + e) : e
              ;(!e.includes('.cloudfront.net/') &&
                !this.viewOptions.imageLoadTimestamp) ||
                this.proxyFileServer ||
                ('object' == typeof n && n.searchParams.append('t', i)),
                'object' == typeof n && (n = n.toString()),
                St.fabric.loadSVGFromURL(n, (e, i) => {
                  var n = e ? St.fabric.util.groupSVGElements(e, i) : null
                  if (c.fill) c.svgFill || (c.svgFill = c.fill), delete c.fill
                  else if (!c.fill && !c.svgFill) {
                    if (e) {
                      r.colors = []
                      for (var s = 0; s < e.length; ++s) {
                        var a =
                          e[s].fill.length > 0
                            ? o(e[s].fill).toHexString()
                            : 'transparent'
                        r.colors.push(a)
                      }
                      r.svgFill = r.colors
                    }
                    c.svgFill = r.svgFill
                  }
                  t(n, c, !0, { svgFill: r.svgFill })
                })
            } else {
              let i,
                n = Date.now().toString()
              e.includes('data:image/')
                ? (i = e)
                : ((i = V(e) ? new URL(this.proxyFileServer + e) : e),
                  this.viewOptions.imageLoadTimestamp &&
                    !this.proxyFileServer &&
                    'object' == typeof i &&
                    i.searchParams.append('t', n),
                  'object' == typeof i && (i = i.toString())),
                new St.fabric.Image.fromURL(
                  i,
                  function (e) {
                    ;(e = '' === e.getSrc() ? null : e), t(e, c, !1)
                  },
                  { crossOrigin: 'anonymous' }
                )
            }
          } else if (t.toLowerCase().includes('text')) {
            var u
            ;(e = e.replace(/\\n/g, '\n')),
              (r.text = r.text ? r.text : e),
              (c._initialText = r.hasOwnProperty('_initialText')
                ? r._initialText
                : r.text),
              (c.originParams = { ...r }),
              r.originParams &&
                r.originParams.text &&
                (c.originParams.text = c._initialText),
              (u = r.curved
                ? new St.fabric.CurvedText(e.replace(/(?:\r\n|\r|\n)/g, ''), c)
                : r.textBox
                ? new St.fabric.Textbox(e, { ...c, splitByGrapheme: !0 })
                : r.neonText
                ? new St.fabric.NeonText(e, c)
                : new St.fabric.IText(e, c)),
              (c.textPlaceholder || c.numberPlaceholder) &&
                (this[
                  c.textPlaceholder ? 'textPlaceholder' : 'numberPlaceholder'
                ] = u),
              this.add(u),
              this.setElementOptions(c, u),
              (u.originParams = z(u.toJSON(), u.originParams)),
              (u.originParams.z = u.getZIndex()),
              this.fire('elementAdd', { element: u })
            return u
          }
        }),
        (St.fabric.Canvas.prototype.deselectElement = function () {
          let t =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]
          this.currentBoundingObject &&
            (this.remove(this.currentBoundingObject),
            this.fire('boudingBoxToggle', {
              boundingBox: this.currentBoundingObject,
              state: !1
            }),
            (this.currentBoundingObject = null)),
            t && this.discardActiveObject(),
            (this.currentElement = null),
            this.fire('elementSelect', { element: null })
        }),
        (St.fabric.Canvas.prototype.resetSize = function () {
          if (!this.wrapperEl || !this.wrapperEl.parentNode) return
          const t = this.wrapperEl.parentNode.clientWidth
          let e =
              window.innerHeight *
              parseFloat(this.viewOptions.maxCanvasHeight || 1),
            i = this.viewOptions.stageHeight,
            n = null
          this.responsiveScale =
            t < this.viewOptions.stageWidth
              ? t / this.viewOptions.stageWidth
              : 1
          let s = i * this.responsiveScale
          return (
            this.viewOptions.canvasHeight &&
              'auto' !== this.viewOptions.canvasHeight &&
              this.viewOptions.canvasHeight.includes('px') &&
              ((n = parseInt(this.viewOptions.canvasHeight)), (e = n)),
            s > e && (this.responsiveScale = e / i),
            (this.responsiveScale = parseFloat(
              Number(this.responsiveScale.toFixed(7))
            )),
            (this.responsiveScale = Math.min(this.responsiveScale, 1)),
            this.viewOptions.responsive || (this.responsiveScale = 1),
            this.setDimensions({
              width: this.viewOptions.stageWidth * this.responsiveScale,
              height: this.viewOptions.stageHeight * this.responsiveScale
            })
              .setZoom(this.responsiveScale)
              .calcOffset()
              .renderAll(),
            this.fire('sizeUpdate', {
              responsiveScale: this.responsiveScale,
              canvasHeight: n || i * this.responsiveScale || i
            }),
            this.responsiveScale
          )
        }),
        (St.fabric.Canvas.prototype.setResZoom = function (t) {
          this.deselectElement()
          var e = new St.fabric.Point(
            0.5 * this.getWidth(),
            0.5 * this.getHeight()
          )
          this.zoomToPoint(e, t * this.responsiveScale),
            1 == t && this.resetZoom()
        }),
        (St.fabric.Canvas.prototype.resetZoom = function () {
          this.deselectElement(),
            this.zoomToPoint(new St.fabric.Point(0, 0), this.responsiveScale),
            this.absolutePan(new St.fabric.Point(0, 0))
        }),
        (St.fabric.Canvas.prototype.getElements = function () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : 'all'
          ;(!(arguments.length > 1 && void 0 !== arguments[1]) ||
            arguments[1]) &&
            this.deselectElement()
          let e = this.getObjects()
          return (
            (e = e.filter(t => !t._ignore)),
            'text' === t
              ? e.filter(t => 'text' === t.getType())
              : 'image' === t
              ? e.filter(t => 'image' === t.getType())
              : e
          )
        }),
        (St.fabric.Canvas.prototype.getElementsJSON = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            e =
              !(arguments.length > 1 && void 0 !== arguments[1]) ||
              arguments[1],
            i = this.getElements('all', e),
            n = []
          return (
            i.forEach(e => {
              if (void 0 !== e.title && void 0 !== e.source) {
                var i = {
                  title: e.title,
                  source: e.source,
                  parameters: e.getElementJSON(),
                  type: e.getType()
                }
                const s =
                  this.viewOptions && this.viewOptions.printingBox
                    ? this.viewOptions.printingBox
                    : null
                if (s && s.hasOwnProperty('left') && s.hasOwnProperty('top')) {
                  let t = e.getPointByOrigin('left', 'top')
                  i.printingBoxCoords = { left: t.x - s.left, top: t.y - s.top }
                }
                t ? e.isEditable && n.push(i) : n.push(i)
              }
            }),
            n
          )
        }),
        (St.fabric.Canvas.prototype.getElementByTitle = function (t) {
          const e = this.getObjects()
          for (var i = 0; i < e.length; ++i) if (e[i].title === t) return e[i]
        }),
        (St.fabric.Canvas.prototype.getElementByID = function (t) {
          const e = this.getObjects()
          for (var i = 0; i < e.length; ++i) if (e[i].id == t) return e[i]
          return !1
        }),
        (St.fabric.Canvas.prototype.reset = function () {
          let t =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]
          this.clear(), t && this.wrapperEl.remove(), this.fire('clear')
        }),
        (St.fabric.Canvas.prototype.removeElement = function (t) {
          'string' == typeof t && (t = this.getElementByTitle(t)),
            this.deselectElement(),
            t.toggleUploadZone && t.toggleUploadZone(),
            this.remove(t),
            this.fire('elementRemove', { element: t })
        }),
        (St.fabric.Canvas.prototype.getElementByReplace = function (t) {
          const e = this.getObjects()
          for (var i = 0; i < e.length; ++i) {
            const n = e[i]
            if (n.replace === t) return n
          }
          return null
        }),
        (St.fabric.Canvas.prototype.setElementOptions = function (t, e) {
          if (!(e = void 0 === e ? this.getActiveObject() : e) || void 0 === t)
            return !1
          'string' == typeof e && (e = this.getElementByTitle(e))
          const i = e.getType()
          if (
            (void 0 !== t.scale && (t.scaleX = t.scaleY = Number(t.scale)),
            'image' == i &&
              !e._isInitial &&
              !e._optionsSet &&
              !e._addToUZ &&
              1 === e.scaleX)
          ) {
            let i = null
            if (Y(e.resizeToW) && Y(e.resizeToH)) {
              if (e.boundingBox) {
                const t = e.getBoundingBoxCoords()
                i = kt(e.width, e.height, t.width, t.height, e.scaleMode)
              } else if (this.viewOptions.fitImagesInCanvas && e.isCustom) {
                const t = 3 * e.cornerSize
                ;(e.width * e.scaleX + t > this.viewOptions.stageWidth ||
                  e.height * e.scaleY + t > this.viewOptions.stageHeight) &&
                  (i = kt(
                    e.width,
                    e.height,
                    this.viewOptions.stageWidth - t,
                    this.viewOptions.stageHeight - t
                  ))
              }
            } else {
              let t = e.resizeToW,
                n = e.resizeToH
              ;(t = isNaN(t)
                ? (parseFloat(t) / 100) * this.viewOptions.stageWidth
                : parseInt(t)),
                (n = isNaN(n)
                  ? (parseFloat(n) / 100) * this.viewOptions.stageHeight
                  : parseInt(n)),
                (i = kt(e.width, e.height, t, n, e.scaleMode))
            }
            null !== i && (t = z(t, { scaleX: i, scaleY: i }))
          }
          if (Boolean(e._addToUZ)) {
            t.z = -1
            let i = this.getElementByTitle(e._addToUZ),
              n = 1
            'image' == e.getType() &&
              (n = kt(
                e.width,
                e.height,
                i.width * i.scaleX,
                i.height * i.scaleY,
                i.scaleMode
              )),
              ((t = z(t, {
                boundingBox: e._addToUZ,
                boundingBoxMode: 'clipping',
                scaleX: n,
                scaleY: n,
                autoCenter: !0,
                removable: !0,
                zChangeable: !1,
                autoSelect: !1,
                copyable: !1,
                hasUploadZone: !0,
                z: this.getElementByTitle(e._addToUZ).getZIndex(),
                rotatable: i.rotatable,
                draggable: i.draggable,
                resizable: i.resizable,
                price: i.price ? i.price : t.price,
                replace: e._addToUZ,
                lockUniScaling: i.lockUniScaling,
                uniScalingUnlockable: i.uniScalingUnlockable,
                advancedEditing: i.advancedEditing,
                originX: i.originX,
                originY: i.originY,
                angle: i.angle
              })).originParams = z(t.originParams, {
                boundingBox: t.boundingBox,
                replace: t.replace,
                rotatable: t.rotatable,
                draggable: t.draggable,
                resizable: t.resizable,
                lockUniScaling: t.lockUniScaling,
                uniScalingUnlockable: t.uniScalingUnlockable,
                price: t.price,
                scaleX: t.scaleX,
                scaleY: t.scaleY,
                hasUploadZone: !0,
                autoCenter: !0,
                originX: t.originX,
                originY: t.originY,
                angle: t.angle
              })),
              delete t[''],
              delete e._addToUZ
          }
          if (
            (t.topped && (t.zChangeable = !1),
            e.checkEditable(t) &&
              (t.isEditable = t.evented = t.selectable = !0),
            (t.uploadZone && !this.viewOptions.editorMode) ||
              (t.draggable && (t.lockMovementX = t.lockMovementY = !1),
              t.rotatable && ((t.lockRotation = !1), (t.hasRotatingPoint = !0)),
              t.resizable && (t.lockScalingX = t.lockScalingY = !1),
              (t.resizable || t.rotatable || t.removable) &&
                (t.hasControls = !0)),
            t.uploadZone &&
              (this.viewOptions.editorMode ||
                (t.uploadZoneMovable &&
                  (t.lockMovementX = t.lockMovementY = !1),
                t.uploadZoneRemovable &&
                  ((t.removable = !0),
                  (t.copyable = !1),
                  (t.hasControls = !0))),
              (t.borderColor = 'transparent'),
              (t.excludeFromExport = !0)),
            // Info / Base / Overlay are product chrome — never move or stretch
            // in customer mode (Google Doc desktop item 2). Applied after the
            // unlock block so those flags cannot reopen the locks.
            // Info also: no reorder / copy / delete — Color change only.
            !this.viewOptions.editorMode &&
              e.title &&
              ['Info', 'Base', 'Overlay'].includes(e.title) &&
              ((t.draggable = t.resizable = t.rotatable = !1),
              (t.lockMovementX = t.lockMovementY = !0),
              (t.lockScalingX = t.lockScalingY = !0),
              (t.lockRotation = !0),
              (t.hasControls = !1),
              'Info' === e.title &&
                ((t.evented = !1),
                (t.selectable = !1),
                (t.isEditable = !1),
                (t.zChangeable = !1),
                (t.copyable = !1),
                (t.removable = !1))),
            t.fixed && Q(t.replace) && (t.replace = e.title),
            !this.viewOptions.editorMode && t.replace && '' != t.replace)
          ) {
            let i = this.getElementByReplace(t.replace)
            if (null !== i && i !== e) {
              if (
                ((t.z = i.getZIndex()),
                (t.left = e.originParams.left = i.left),
                (t.top = e.originParams.top = i.top),
                (t.autoCenter = !1),
                this.viewOptions.applySizeWhenReplacing)
              ) {
                const n = i.getScaledWidth() / e.getScaledWidth()
                ;(t.scaleX = e.originParams.scaleX = n),
                  (t.scaleY = e.originParams.scaleY = n)
              }
              this.viewOptions.applyFillWhenReplacing &&
                !e._isQrCode &&
                (t.fill = t.svgFill = i.fill),
                this.removeElement(i)
            }
          }
          if ('text' === i) {
            if ('string' == typeof t.text) {
              let i = t.text
              if (
                ((i = i.replace(this.forbiddenTextChars, '')),
                0 != e.maxLength &&
                  i.length > e.maxLength &&
                  ((i = i.substr(0, e.maxLength)), e.set('text', i)),
                0 != e.maxLines &&
                  0 != e.maxLines &&
                  i.split('\n').length > e.maxLines)
              ) {
                let t = i.split('\n').slice(0, e.maxLines)
                i = t.join('\n')
              }
              'uppercase' === e.textTransform
                ? (i = i.toUpperCase())
                : 'lowercase' === e.textTransform && (i = i.toLowerCase()),
                e.curved && (i = i.replace(/[\n\r\t]/gm, '')),
                (t.text = i)
            }
            if (
              (t.hasOwnProperty('textDecoration') &&
                (t.underline = 'underline' === t.textDecoration),
              void 0 !== t.letterSpacing &&
                (t.charSpacing = 100 * t.letterSpacing),
              t.fontSize && t.fontSize < e.minFontSize
                ? (t.fontSize = e.minFontSize)
                : t.fontSize &&
                  t.fontSize > e.maxFontSize &&
                  (t.fontSize = e.maxFontSize),
              t.textTransform)
            ) {
              let i = e.text
              'uppercase' === t.textTransform
                ? (i = i.toUpperCase())
                : 'lowercase' === t.textTransform && (i = i.toLowerCase()),
                (t.text = i)
            }
          }
          if (
            t.hasOwnProperty('shadowColor') ||
            t.hasOwnProperty('shadowBlur') ||
            t.hasOwnProperty('shadowOffsetX') ||
            (t.hasOwnProperty('shadowOffsetY') && !e.neonText)
          )
            if (null === t.shadowColor) e.set('shadow', null)
            else {
              let i = {}
              e.shadow && (i = e.shadow.toObject())
              // Blur/offset alone used to build a shadow with undefined color,
              // so Fabric drew nothing — default color/offsets so Blur works.
              let n = {
                color: t.hasOwnProperty('shadowColor')
                  ? t.shadowColor
                  : i.color || '#000000',
                blur: t.hasOwnProperty('shadowBlur')
                  ? Number(t.shadowBlur) || 0
                  : i.blur != null
                    ? i.blur
                    : 0,
                offsetX: t.hasOwnProperty('shadowOffsetX')
                  ? Number(t.shadowOffsetX) || 0
                  : i.offsetX != null
                    ? i.offsetX
                    : 0,
                offsetY: t.hasOwnProperty('shadowOffsetY')
                  ? Number(t.shadowOffsetY) || 0
                  : i.offsetY != null
                    ? i.offsetY
                    : 0
              }
              e.set('shadow', n)
            }
          // Stroke Width on text: high values (vendor max 20) merge glyphs into
          // a solid blob. Cap for text so Width stays a readable outline.
          if (
            'text' === i &&
            t.hasOwnProperty('strokeWidth') &&
            Number(t.strokeWidth) > 5
          ) {
            t.strokeWidth = 5
          }
          if (
            (delete t.paths,
            e.setOptions(t),
            (t.fontSize || t.fontFamily || t.letterSpacing) &&
              e.updateTextPosition &&
              e.updateTextPosition(),
            'i-text' == e.type && e.widthFontSize && e.text.length > 0)
          ) {
            let t
            ;(t =
              e.width > e.widthFontSize
                ? e.fontSize * (e.widthFontSize / (e.width + 1))
                : e.fontSize * (e.widthFontSize / (e.width - 1))),
              t < e.minFontSize
                ? (t = e.minFontSize)
                : t > e.maxFontSize && (t = e.maxFontSize),
              (t = parseInt(t)),
              e.set('fontSize', t)
          }
          if (
            (e.updateTextPosition && e.updateTextPosition(),
            t.autoCenter && e.centerElement(),
            t.hasOwnProperty('lockUniScaling') && e._elementControls(),
            t.filter)
          ) {
            const i = (function (t) {
              let e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {}
              if ('string' == typeof t)
                switch ((t = t.toLowerCase())) {
                  case 'grayscale':
                    return new St.fabric.Image.filters.Grayscale()
                  case 'sepia':
                    return new St.fabric.Image.filters.Sepia()
                  case 'kodachrome':
                    return new St.fabric.Image.filters.Kodachrome()
                  case 'black_white':
                    return new St.fabric.Image.filters.BlackWhite()
                  case 'vintage':
                    return new St.fabric.Image.filters.Vintage()
                  case 'technicolor':
                    return new St.fabric.Image.filters.Technicolor()
                  case 'brightness':
                    return new St.fabric.Image.filters.Brightness(e)
                  case 'contrast':
                    return new St.fabric.Image.filters.Contrast(e)
                  case 'removewhite':
                    return new St.fabric.Image.filters.RemoveColor(e)
                }
              else if (Array.isArray(t))
                return new St.fabric.Image.filters.ColorMatrix({ matrix: t })
              return null
            })(t.filter)
            i && e.applyFilters
              ? ((e.filters = [i]), e.applyFilters())
              : e.applyFilters && ((e.filters = []), e.applyFilters())
          }
          if (void 0 !== t.fill || void 0 !== t.svgFill) {
            const i = void 0 !== t.svgFill ? t.svgFill : t.fill
            e.changeColor(i), (e.pattern = void 0)
          }
          if (
            (void 0 !== t.pattern && e.setPattern(t.pattern),
            e.canvas &&
              t.z >= 0 &&
              (() => {
                let z = t.z
                const objects = e.canvas.getObjects()
                const baseObj = objects.find(o => o.title === 'Base')
                const overlayObj = objects.find(o => o.title === 'Overlay')
                if (baseObj && e !== baseObj) {
                  const baseZ = baseObj.getZIndex()
                  if (z <= baseZ) z = baseZ + 1
                }
                if (overlayObj && e !== overlayObj) {
                  const overlayZ = overlayObj.getZIndex()
                  if (z >= overlayZ) z = overlayZ - 1
                }
                e.moveTo(z)
                this._bringToppedElementsToFront()
              })(),
            t.hasOwnProperty('curved'))
          )
            if (t.curved) {
              if ('i-text' == e.type || 'textbox' == e.type) {
                let t = e.getElementJSON()
                return (
                  delete t.width,
                  this.addElement('text', t.text, e.title, t),
                  void this.removeElement(e)
                )
              }
              e.setTextPath(),
                e == this.getActiveObject() && e.path && (e.path.visible = !0),
                (e.textAlign = 'left'),
                e.set('text', e.text.replace(/[\r\n]+/g, '')),
                e.updateTextPosition()
            } else e.set('path', null)
          t.hasOwnProperty('curveRadius') &&
            e.setTextPath &&
            (e.setTextPath(),
            e == this.getActiveObject() && e.path && (e.path.visible = !0)),
            e.uploadZone
              ? (e.evented = 0 !== e.opacity)
              : e.isEditable &&
                !this.viewOptions.editorMode &&
                (e.evented = !t.locked),
            (e.textPlaceholder || e.numberPlaceholder) && (e.removable = !1)
          for (var n = this.getObjects(), s = 0; s < n.length; ++s) {
            var r = n[s]
            r.uploadZone &&
              r.title == t.replace &&
              ((r.opacity = 0), (r.evented = !1))
          }
          e.setCoords(),
            this.renderAll().calcOffset(),
            this.fire('elementModify', { element: e, options: t }),
            e._checkContainment(),
            this._doHistory && this.historySaveAction(),
            t.autoSelect &&
              e.isEditable &&
              !this.editorMode &&
              this.wrapperEl.offsetParent &&
              setTimeout(() => {
                this.setActiveObject(e), this.renderAll()
              }, 200),
            (e._optionsSet = !0)
        }),
        (St.fabric.Canvas.prototype.duplicateElement = function (t) {
          var e = t.getElementJSON()
          ;(e.top = e.top + 30),
            (e.left = e.left + 30),
            this.viewOptions.editorMode || (e.autoSelect = !0),
            this.addElement(t.getType(), t.source, 'Copy ' + t.title, e)
        }),
        (St.fabric.Canvas.prototype.getUploadZone = function (t) {
          const e = this.getObjects()
          for (var i = 0; i < e.length; ++i)
            if (e[i].uploadZone && e[i].title == t) return e[i]
        }),
        (St.fabric.Canvas.prototype.setMask = function () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : () => {}
          if (t && t.url && t.url.includes('.svg')) {
            const i = this.proxyFileServer + t.url
            ;(this.maskOptions = t),
              St.fabric.loadSVGFromURL(i, (i, n) => {
                let s = null
                i &&
                  ((s = i ? St.fabric.util.groupSVGElements(i, n) : null),
                  s.setOptions({
                    left: t.left ? Number(t.left) : 0,
                    top: t.top ? Number(t.top) : 0,
                    scaleX: t.scaleX ? Number(t.scaleX) : 1,
                    scaleY: t.scaleY ? Number(t.scaleY) : 1,
                    selectable: !0,
                    evented: !1,
                    resizable: !0,
                    lockUniScaling: !1,
                    lockRotation: !0,
                    borderColor: 'transparent',
                    fill: 'rgba(0,0,0,0)',
                    transparentCorners: !0,
                    cornerColor: this.viewOptions.selectedColor,
                    cornerIconColor: this.viewOptions.cornerIconColor,
                    cornerSize: 24,
                    originX: 'left',
                    originY: 'top',
                    name: 'view-mask',
                    objectCaching: !1,
                    excludeFromExport: !0,
                    _ignore: !0
                  }),
                  (this.maskObject = s),
                  (this.clipPath = s),
                  this.resetSize()),
                  e(s)
              })
          } else
            (this.maskObject = this.maskOptions = this.clipPath = null),
              this.renderAll(),
              e(null)
        })
      var Pt = i(933),
        _t = i.n(Pt)
      const Dt = t => {
          let e = ''
          if (t.hasOwnProperty('url')) {
            let i = t.name,
              n = -1 !== t.url.search('.woff') ? 'woff' : 'TrueType',
              s = FancyProductDesigner.proxyFileServer + t.url
            if (
              ((i += ':n4'),
              (e +=
                '@font-face {font-family:"' +
                t.name +
                '"; font-style: normal; font-weight: normal; src:url("' +
                s +
                '") format("' +
                n +
                '");}\n'),
              t.variants)
            ) {
              for (const i in t.variants) {
                let r = {
                  n7: 'font-style: normal; font-weight: bold;',
                  i4: 'font-style: italic; font-weight: normal;',
                  i7: 'font-style: italic; font-weight: bold;'
                }
                ;(s = FancyProductDesigner.proxyFileServer + t.variants[i]),
                  (e +=
                    '@font-face {font-family:"' +
                    t.name +
                    '"; ' +
                    r[i] +
                    ' src:url("' +
                    s +
                    '") format("' +
                    n +
                    '");}\n')
              }
              i += ',' + Object.keys(t.variants).toString()
            }
          }
          return e
        },
        Lt = (t, e) => {
          let i = t.mainOptions.fonts
          if (i && i.length > 0 && 'object' == typeof i[0]) {
            i.sort((t, e) => {
              let i = t.name.toUpperCase(),
                n = e.name.toUpperCase()
              return i < n ? -1 : i > n ? 1 : 0
            })
            let r = [],
              a = [],
              o = 0
            const l = document.createElement('style')
            ;(l.id = 'fpd-fonts'),
              t.container.before(l),
              i.forEach(t => {
                if (t.hasOwnProperty('url'))
                  if ('google' == t.url) r.push(t.name + ':400,400i,700,700i')
                  else {
                    let e = t.name
                    ;(e += ':n4'),
                      t.variants &&
                        (e += ',' + Object.keys(t.variants).toString()),
                      a.push(e),
                      l.append(Dt(t))
                  }
              })
            var n = function (t, n, s) {
                'inactive' == t &&
                  console.log(n + ' font could not be loaded.'),
                  o == r.length + a.length - 1 && e(i),
                  o++
              },
              s = {
                fontactive: function (t, e) {
                  n('active', t)
                },
                fontinactive: function (t, e) {
                  n('inactive', t)
                },
                timeout: 3e3
              }
            r.length > 0 && (s.google = { families: r }),
              a.length > 0 && (s.custom = { families: a }),
              r.length > 0 || a.length > 0 ? _t().load(s) : e(i)
          } else e(i)
        }
      function Bt (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function Ft (t, e, i) {
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
      function jt (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      var Rt = new WeakSet(),
        Nt = new WeakSet()
      class Ht extends EventTarget {
        constructor (e) {
          let i =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            n = arguments.length > 2 ? arguments[2] : void 0,
            s =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {}
          super(),
            Bt(this, Nt),
            Bt(this, Rt),
            Ft(this, 'totalPrice', 0),
            Ft(this, 'truePrice', 0),
            Ft(this, 'additionalPrice', 0),
            Ft(this, 'locked', !1),
            Ft(this, 'mask', null),
            Ft(this, 'viewData', void 0),
            Ft(this, 'onCreatedCallback', void 0),
            Ft(this, 'title', void 0),
            Ft(this, 'thumbnail', void 0),
            Ft(this, 'options', void 0),
            Ft(this, 'names_numbers', void 0),
            Ft(this, 'canvasElem', null),
            Ft(this, 'fabricCanvas', null),
            Ft(this, 'elementsAdded', !1),
            (this.viewData = i),
            (this.onCreatedCallback = n),
            (this.title = i.title),
            (this.thumbnail = i.thumbnail),
            (this.options = i.options),
            (this.mask = i.mask),
            (this.locked =
              void 0 !== i.locked ? i.locked : this.options.optionalView),
            (this.names_numbers = i.names_numbers ? i.names_numbers : null),
            (fabric.Canvas.prototype.snapGridSize = this.options.snapGridSize),
            (fabric.Canvas.prototype.snapToObjects = this.options.smartGuides)
          const r = this.options.selectedColor
          ;(fabric.Object.prototype.borderColor = r),
            (fabric.Object.prototype.cornerColor = r),
            (fabric.Object.prototype.cornerIconColor =
              this.options.cornerIconColor),
            (s = z(
              {
                containerClass: 'fpd-view-stage fpd-view-staage-mains fpd-hidden min-w-[800px]',
                selection: this.options.multiSelection,
                selectionBorderColor: this.options.multiSelectionColor,
                selectionColor: o(this.options.multiSelectionColor)
                  .setAlpha(0.1)
                  .toRgbString(),
                hoverCursor: 'pointer',
                controlsAboveOverlay: !0,
                centeredScaling: !0,
                allowTouchScrolling: !0,
                preserveObjectStacking: !0,
                enablePointerEvents: !1
              },
              s
            )),
            (this.fabricOptions = s),
            (this.canvasElem = document.createElement('canvas')),
            e.append(this.canvasElem),
            (fabric.Canvas.prototype.forbiddenTextChars =
              FancyProductDesigner.forbiddenTextChars),
            (fabric.Canvas.prototype.proxyFileServer =
              FancyProductDesigner.proxyFileServer),
            (this.fabricCanvas = new fabric.Canvas(this.canvasElem, s)),
            (this.fabricCanvas.viewOptions = this.options),
            this.fabricCanvas.setDimensions({
              width: this.options.stageWidth,
              height: this.options.stageHeight
            }),
            this.fabricCanvas.on({
              imageFail: e => {
                let { url: i } = e
                t(
                  `\n                    <p>The image with the URL<br /><i style='font-size: 10px;'>${i}</i><br />can not be loaded into the canvas.</p>\n                    <p><b>Troubleshooting</b>\n                        <ul>\n                            <li>The URL is not correct!</li>\n                            <li>The image has been blocked by <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS' target='_blank'>CORS policy</a>. You need to host the image under the same protocol and domain or enable 'Access-Control-Allow-Origin' on the server where you host the image. <a href='http://enable-cors.org/' target='_blank'>Read more about it here.</a><\n                            /li>\n                        </ul>\n                    </p>\n                `
                )
              }
            }),
            this.toggleLock(Boolean(this.locked))
          const a = t => {
            t.chargeAfterEditing &&
              (t._isPriced ||
                (this.changePrice(t.price, '+'), (t._isPriced = !0)),
              t._initialText === t.text &&
                t._isPriced &&
                (this.changePrice(t.price, '-'), (t._isPriced = !1)))
          }
          // this.fabricCanvas.on({
          //   'object:added': t => {
          //     let e = t.target,
          //         i = e.price;
          //     console.log('object:added', e, i)
          //     // ✅ Check if object is an image and not already scaled
          //     if (e.type === 'image') {
          //       console.log('object:added if', e, i)
          //       const stageW = this.fabricCanvas.getWidth();
          //       const stageH = this.fabricCanvas.getHeight();

          //       const scaleW = stageW / e.width;
          //       const scaleH = stageH / e.height;
          //       const scale = Math.min(scaleW, scaleH); // proportional scaling

          //       console.log('object:added scale', scale, stageW, stageH, e.width, e.height);
                
          //       e.scale(scale);
          //       e.center();
          //       e.setCoords();
          //     }
          //     if (e._addToUZ && '' != e._addToUZ) {
          //       var n = this.fabricCanvas.getElementByTitle(e._addToUZ);
          //       i = n && n.price ? n.price : i;
          //     }

          //     void 0 === i ||
          //       0 === i ||
          //       e.uploadZone ||
          //       e._ignore ||
          //       (e.chargeAfterEditing && !e._isPriced) ||
          //       this.changePrice(i, '+');
          //   },

          //   'object:removed': t => {
          //     const e = t.target;
          //     void 0 === e.price ||
          //       0 === e.price ||
          //       e.uploadZone ||
          //       (e.chargeAfterEditing && !e._isPriced) ||
          //       this.changePrice(e.price, '-');
          //   },

          //   'text:changed': t => {
          //     a(t.target);
          //   },

          //   elementModify: t => {
          //     this.elementsAdded &&
          //       t.options.hasOwnProperty('text') &&
          //       a(t.element);
          //   },

          //   elementFillChange: t => {
          //     jt(this, Nt, Wt).call(this, t.element);
          //   }
          // });
          this.fabricCanvas.on({
            'object:added': t => {
              ;
              
              let e = t.target,
                i = e.price ?? 0;

              ;
              ;
              
              if(e && e.text){
                document.querySelector('.fpd-group-paste-by').classList.add('fpd-hidden');
                document.querySelector('.fpd-group-copy-by').classList.add('fpd-hidden');
              }

              // If object is an image, scale and center it proportionally
              if (e.type === 'image') {
                ;
                const stageW = this.fabricCanvas.getWidth();
                const stageH = this.fabricCanvas.getHeight();

                const scaleW = stageW / e.width;
                const scaleH = stageH / e.height;
                const scale = Math.min(scaleW, scaleH); // proportional scaling
                // const scale = 0.4;
                ;
                e.scale(scale);
                e.center();
                e.setCoords();
              }

              // Handle price calculation if relevant
              if (e._addToUZ && e._addToUZ !== '') {
                var n = this.fabricCanvas.getElementByTitle(e._addToUZ);
                i = n && n.price ? n.price : i;
              }

              if (i !== undefined && i !== 0 && !e.uploadZone && !e._ignore && !(e.chargeAfterEditing && !e._isPriced)) {
                this.changePrice(i, '+');
              }

              // **Keep base locked layer always at the bottom**
              const baseLayer = this.fabricCanvas.getObjects().find(obj => obj.adminLocked === 1);
              if (baseLayer) {
                this.fabricCanvas.sendToBack(baseLayer);
                // Make sure newly added object is above the base layer
                if (e !== baseLayer) {
                  this.fabricCanvas.bringToFront(e);
                }
              }
            },

            'object:removed': t => {
              const e = t.target;
              if (e.price !== undefined && e.price !== 0 && !e.uploadZone && !(e.chargeAfterEditing && !e._isPriced)) {
                this.changePrice(e.price, '-');
              }
            },

            'text:changed': t => {
              a(t.target);
            },

            elementModify: t => {
              if (this.elementsAdded && t.options.hasOwnProperty('text')) {
                a(t.element);
              }
            },

            elementFillChange: t => {
              jt(this, Nt, Wt).call(this, t.element);
            }
          });


        }
        init () {
          this.loadElements(this.viewData.elements, jt(this, Rt, zt).bind(this))
        }
        loadElements (t, e) {
          this.fabricCanvas.initialElementsLoaded &&
            this.fabricCanvas.reset(!1),
            this.fabricCanvas.offHistory(),
            this.fabricCanvas.addElements(t, e)
        }
        toDataURL (t) {
          let e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            i =
              !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
          ;(t = void 0 === t ? function () {} : t),
            (e.onlyExportable =
              void 0 !== e.onlyExportable && e.onlyExportable),
            (e.multiplier = void 0 === e.multiplier ? 1 : e.multiplier),
            (e.backgroundColor =
              void 0 === e.backgroundColor ? 'transparent' : e.backgroundColor),
            (e.watermarkImg = void 0 === e.watermarkImg ? null : e.watermarkImg)
          let n = [],
            s = this.options.highlightEditableObjects
          ;(this.options.highlightEditableObjects = 'transparent'),
            this.fabricCanvas.getObjects().forEach(t => {
              t.excludeFromExport &&
                e.onlyExportable &&
                ((t.visible = !1), n.push(t))
            }),
            i && this.fabricCanvas.deselectElement(),
            this.fabricCanvas
              .setDimensions({
                width: this.options.stageWidth,
                height: this.options.stageHeight
              })
              .setZoom(1),
            this.fabricCanvas.setBackgroundColor(e.backgroundColor, () => {
              e.watermarkImg &&
                (this.fabricCanvas.add(e.watermarkImg),
                e.watermarkImg.center(),
                e.watermarkImg.bringToFront()),
                t(this.fabricCanvas.toDataURL(e)),
                e.watermarkImg && this.fabricCanvas.remove(e.watermarkImg),
                this.fabricCanvas.wrapperEl.offsetParent &&
                  this.fabricCanvas.resetSize(),
                this.fabricCanvas.setBackgroundColor('transparent', () => {
                  this.fabricCanvas.renderAll()
                })
              for (var i = 0; i < n.length; ++i) n[i].visible = !0
              this.fabricCanvas.renderAll(),
                (this.options.highlightEditableObjects = s)
            })
        }
        toSVG () {
          let t,
            e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
            i =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : []
          if (
            ((e.respectPrintingBox =
              void 0 !== e.respectPrintingBox && e.respectPrintingBox),
            (e.watermarkImg =
              void 0 === e.watermarkImg ? null : e.watermarkImg),
            this.fabricCanvas.deselectElement(),
            e.respectPrintingBox &&
              H(this.options.printingBox, ['left', 'top', 'width', 'height']))
          ) {
            let t = 0,
              i = 0
            H(this.options.output, ['bleed', 'width', 'height']) &&
              ((t =
                (this.options.output.bleed / this.options.output.width) *
                this.options.printingBox.width),
              (i =
                (this.options.output.bleed / this.options.output.height) *
                this.options.printingBox.height)),
              (e.viewBox = {
                x: this.options.printingBox.left - t,
                y: this.options.printingBox.top - i,
                width: this.options.printingBox.width + 2 * t,
                height: this.options.printingBox.height + 2 * i
              }),
              this.fabricCanvas
                .setDimensions({
                  width: this.options.printingBox.width,
                  height: this.options.printingBox.height
                })
                .setZoom(1)
          } else
            this.fabricCanvas
              .setDimensions({
                width: this.options.stageWidth,
                height: this.options.stageHeight
              })
              .setZoom(1)
          let n = this.fabricCanvas.backgroundColor
          'transparent' == n && (this.fabricCanvas.backgroundColor = !1),
            e.watermarkImg &&
              (this.fabricCanvas.add(e.watermarkImg),
              e.watermarkImg.center(),
              e.watermarkImg.bringToFront()),
            (t = this.fabricCanvas.toSVG(e, e.reviver)),
            e.watermarkImg && this.fabricCanvas.remove(e.watermarkImg),
            (this.fabricCanvas.backgroundColor = n),
            this.fabricCanvas.wrapperEl.offsetParent &&
              this.fabricCanvas.resetSize()
          const s = document.createElement('div')
          s.innerHTML = t
          const r = s.querySelector('defs')
          s.querySelectorAll('clipPath').forEach(t => {
            r.appendChild(t)
          })
          const a = document.createElement('style')
          let o = '',
            l = ''
          i.forEach(t => {
            t.hasOwnProperty('url') &&
              ('google' == t.url
                ? (o +=
                    t.name.replace(/\s/g, '+') +
                    ':ital,wght@0,400;0,700;1,700&')
                : (l += Dt(t)))
          }),
            o.length > 0 &&
              a.insertAdjacentHTML(
                'beforeend',
                '@import url("https://fonts.googleapis.com/css2?family=' +
                  o.replace(/&/g, '&amp;') +
                  'display=swap");'
              ),
            l.length > 0 && a.insertAdjacentHTML('beforeend', l),
            r.appendChild(a)
          let c = s.innerHTML
          return (c = c.replace(/(?:\r\n|\r|\n)/g, '')), c
        }
        toggleLock () {
          let t =
            !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]
          return (
            (this.locked = t),
            J(this.fabricCanvas.wrapperEl, ['fpd-disabled'], t),
            this.dispatchEvent(
              new CustomEvent('priceChange', {
                detail: { elementPrice: 0, truePrice: this.truePrice }
              })
            ),
            t
          )
        }
        changePrice (t, e) {
          let i =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : null
          if (
            ('number' != typeof t && (t = Number(t)),
            '+' === e ? (this.totalPrice += t) : (this.totalPrice -= t),
            null !== i)
          ) {
            let t = this.additionalPrice
            ;(this.totalPrice -= t),
              (this.additionalPrice = i),
              (this.totalPrice += i)
          }
          return (
            (this.truePrice = this.totalPrice),
            'number' == typeof this.options.maxPrice &&
              -1 != this.options.maxPrice &&
              this.truePrice > this.options.maxPrice &&
              (this.truePrice = Number(this.options.maxPrice)),
            this.truePrice % 1 != 0 &&
              (this.truePrice = Number(this.truePrice.toFixed(2))),
            this.dispatchEvent(
              new CustomEvent('priceChange', {
                detail: { elementPrice: t, truePrice: this.truePrice }
              })
            ),
            this.truePrice
          )
        }
      }
      function zt () {
        ;(this.elementsAdded = !0),
          (this.fabricCanvas._doHistory = !0),
          this.mask && this.fabricCanvas.setMask(this.mask),
          this.onCreatedCallback && this.onCreatedCallback(this),
          this.dispatchEvent(
            new CustomEvent('priceChange', {
              detail: { elementPrice: 0, truePrice: this.truePrice }
            })
          )
      }
      function Wt (t) {
        if (
          this.elementsAdded &&
          t.colorPrices &&
          'object' == typeof t.colors &&
          t.colors.length > 1
        ) {
          void 0 !== t.currentColorPrice &&
            ((t.price -= t.currentColorPrice),
            this.changePrice(t.currentColorPrice, '-'))
          const n = t.fill
          if ('string' == typeof n) {
            var e = n.replace('#', '')
            if (
              t.colorPrices.hasOwnProperty(e) ||
              t.colorPrices.hasOwnProperty(e.toUpperCase())
            ) {
              var i =
                void 0 === t.colorPrices[e]
                  ? t.colorPrices[e.toUpperCase()]
                  : t.colorPrices[e]
              ;(t.currentColorPrice = i),
                (t.price += t.currentColorPrice),
                this.changePrice(t.currentColorPrice, '+')
            } else t.currentColorPrice = 0
          } else t.currentColorPrice = 0
        }
      }
      Ft(Ht, 'relevantOptions', [
        'stageWidth',
        'stageHeight',
        'selectedColor',
        'boundingBoxColor',
        'outOfBoundaryColor',
        'cornerIconColor',
        'customAdds',
        'elementParameters',
        'imageParameters',
        'textParameters',
        'customImageParameters',
        'customTextParameters',
        'maxPrice',
        'optionalView',
        'designCategories',
        'printingBox',
        'output',
        'layouts',
        'usePrintingBoxAsBounding',
        'threeJsPreviewModel',
        'editorMode',
        'imageLoadTimestamp',
        'fitImagesInCanvas',
        'inCanvasTextEditing',
        'applyFillWhenReplacing',
        'disableTextEmojis',
        'cornerControlsStyle',
        'responsive',
        'canvasHeight',
        'maxCanvasHeight',
        'boundingBoxProps',
        'highlightEditableObjects',
        'multiSelection',
        'multiSelectionColor',
        'mobileGesturesBehaviour',
        'smartGuides',
        'snapGridSize',
        'rulerUnit',
        'namesNumbersEntryPrice',
        'applySizeWhenReplacing',
        'rulerPosition',
        'rulerFixed',
        'industry',
        'innerBleed'
      ]),
        (window.FancyProductDesigner = Ht)