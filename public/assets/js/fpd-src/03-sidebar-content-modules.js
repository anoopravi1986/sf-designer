
/*
 * FancyProductDesigner - part 3/6: content UI modules
 * ---------------------------------------------------------------------
 * The sidebar module panels for content editing: save/load design,
 * products, product text, saved designs, image gallery, uploads, and the
 * social-image (Facebook/Instagram/Pixabay) and text-to-image panels.
 * Several StyleFlip customizations live here (save/load backend
 * integration, productsnew/designsnew module variants, uploads
 * share/delete/download UI) - marked with "===== CUSTOM (StyleFlip)"
 * banner comments below.
 */

      const Vt = t => {
          let e = t.url
          t.params && (e += '?' + new URLSearchParams(t.params).toString())
          const i = new XMLHttpRequest()
          return (
            (i.responseType = 'json'),
            i.open('GET', e),
            (i.onreadystatechange = e => {
              4 == i.readyState && 200 == i.status
                ? t.onSuccess && t.onSuccess(i.response)
                : 200 !== i.status && t.onError && t.onError(i)
            }),
            i.send(),
            i
          )
        },
        Ut = t => {
          let e = t.url,
            i = { Accept: 'application/json' }
          return (
            t.body instanceof FormData ||
              (i['Content-Type'] = 'application/json'),
            fetch(e, {
              method: 'POST',
              redirect: 'follow',
              headers: i,
              body: t.body instanceof FormData ? t.body : JSON.stringify(t.body)
            })
              .then(t => t.json())
              .then(e => {
                t.onSuccess && t.onSuccess(e)
              })
              .catch(e => {
                t.onError && t.onError(e)
              })
          )
        }
      class Yt extends EventTarget {
        langJSON = null
        constructor () {
          super()
        }
        loadLangJSON () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : null,
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : () => {}
          !1 !== t
            ? 'object' == typeof t
              ? ((this.langJSON = t), e.call(this))
              : Vt({
                  url: t,
                  onSuccess: t => {
                    ;(this.langJSON = t), e.call(this)
                  },
                  onError: i => {
                    alert(
                      'Language JSON "' +
                        t +
                        '" could not be loaded or is not valid. Make sure you set the correct URL in the options and the JSON is valid!'
                    ),
                      e.call(this)
                  }
                })
            : e.call(this)
        }
        translateElement (t) {
          let e = ''
          if (this.langJSON) {
            let i = ''
            if (
              ((i = t.getAttribute('placeholder')
                ? t.getAttribute('placeholder')
                : t.getAttribute('title')
                ? t.getAttribute('title')
                : t.dataset.title
                ? t.dataset.title
                : t.innerHTML),
              !i.includes('.') || /\s/.test(i))
            )
              e = i
            else {
              let n = i.toLowerCase().split('.'),
                s = this.langJSON[n[0]]
              s
                ? ((e = s[n[1]]),
                  void 0 === e &&
                    ((e = t.dataset.defaulttext)))
                : (e = t.dataset.defaulttext)
            }
          } else e = t.dataset.defaulttext
          return (
            t.getAttribute('placeholder')
              ? (t.setAttribute('placeholder', e), (t.innerText = ''))
              : t.getAttribute('title')
              ? t.setAttribute('title', e)
              : t.dataset.title
              ? (t.dataset.title = e)
              : (t.innerHTML = e),
            e
          )
        }
        getTranslation (t, e) {
          let i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : '',
            n = i
          return (
            Q(this.langJSON) ||
              ((t = this.langJSON[t]) && (n = t[e] ? t[e] : i)),
            n.replace(/\n/g, ''),
            n
          )
        }
        translateArea (t) {
          const e = t.querySelectorAll('[data-defaulttext]')
          Array.from(e).forEach(t => {
            this.translateElement(t)
          })
        }
      }
      function Gt (t, e, i) {
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
      function qt (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      var Xt = new WeakSet()
      class Zt extends HTMLElement {
        constructor () {
          var t, e
          super(),
            (function (t, e) {
              if (e.has(t))
                throw new TypeError(
                  'Cannot initialize the same private elements twice on an object'
                )
            })((t = this), (e = Xt)),
            e.add(t),
            Gt(this, 'placeholder', ''),
            Gt(this, 'value', ''),
            Gt(this, 'searchable', !1),
            Gt(this, 'inputElem', null),
            Gt(this, 'listElem', null)
        }
        connectedCallback () {
          ;(this.innerHTML =
            '<input type="text" class="fpd-dropdown-current !text-sm"/> <div class="fpd-dropdown-arrow"><span class="fpd-icon-arrow-dropdown"></span></div> <div class="fpd-dropdown-list"> <div class="fpd-scroll-area"></div> </div> '),
            (this.inputElem = this.querySelector('input.fpd-dropdown-current')),
            (this.listElem = this.querySelector('.fpd-dropdown-list')),
            document.addEventListener('click', t => {
              this.contains(t.target) || this.classList.remove('fpd-active')
            }),
            this.addEventListener('click', () => {
              qt(this, Xt, Jt).call(this), this.classList.toggle('fpd-active')
            }),
            this.querySelector('.fpd-dropdown-arrow').addEventListener(
              'click',
              t => {
                t.stopPropagation(),
                  qt(this, Xt, Jt).call(this),
                  this.classList.toggle('fpd-active')
              }
            ),
            this.inputElem.addEventListener('keyup', t => {
              ;
              if (this.searchable) {
                const e = t.currentTarget.value
                this.listElem.querySelectorAll('.fpd-item').forEach(t => {
                  0 == e.length
                    ? t.classList.remove('fpd-hidden')
                    : t.classList.toggle(
                        'fpd-hidden',
                        !t.innerText.toLowerCase().includes(e.toLowerCase())
                      )
                })
              }
            }),
            window.addEventListener('scroll', () => {
              qt(this, Xt, Jt).call(this)
            })
          const t = e => {
            var i = e.parentNode
            i &&
              (e.addEventListener('scroll', () => {
                qt(this, Xt, Jt).call(this)
              }),
              t(i))
          }
          t(this),
            this.inputElem.setAttribute(
              'placeholder',
              this.getAttribute('placeholder') || ''
            ),
            qt(this, Xt, Jt).call(this)
        }
        static get observedAttributes () {
          return ['searchable', 'placeholder', 'value']
        }
        attributeChangedCallback (t, e, i) {
          e !== i &&
            (this.inputElem &&
              ('placeholder' === t
                ? this.inputElem.setAttribute('placeholder', i)
                : 'value' === t && (this.inputElem.value = i)),
            'searchable' === t &&
              (this.searchable = this.hasAttribute('searchable')))
        }
      }
      function Jt () {
        const t = this.getBoundingClientRect()
        ;(this.listElem.style.width = t.width + 'px'),
          (this.listElem.style.left = t.left + 'px'),
          (this.listElem.style.top = t.top + t.height + 'px')
      }
      customElements.define('fpd-dropdown', Zt), i(653)
      class Qt extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div data-pos="left"> <fpd-actions-menu data-font-icon="fpd-icon-menu"></fpd-actions-menu> </div> <div data-pos="center"> <fpd-actions-menu class="fpd-only-uncollapsed"></fpd-actions-menu> </div> <div data-pos="right"> <fpd-actions-menu data-font-icon="fpd-icon-more"></fpd-actions-menu> </div> <div data-pos="modal"> <span class="fpd-btn fpd-btn-fill fpd-close fpd-done"> <i class="fpd-icon-done"></i> <span class="fpd-label" data-defaulttext="Done">actions.modal_done</span> <span class="fpd-total-price">10.00$</span> </span> <span class="fpd-btn fpd-close"> <i class="fa-solid fa-close"></i> </span> </div>'
        }
      }
      customElements.define('fpd-actions-bar', Qt)
      class Kt extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div> <input class="bg-white" type="text" data-defaulttext="Enter a URL, some text..." placeholder="modules.qr_code_input"/> <div class="fpd-qr-code-colors"> <div class="fpd-qr-code-color-dark"></div> <div class="fpd-qr-code-color-light"></div> </div> <span class="fpd-add-qr-code fpd-btn !bg-[var(--theme-color)]" data-defaulttext="Add QR-Code">modules.qr_code_add_btn</span> </div> '
        }
      }
      customElements.define('fpd-module-qr-code', Kt)
      var $t = function (t, e) {
          if (!(t instanceof e))
            throw new TypeError('Cannot call a class as a function')
        },
        te = (function () {
          function t (t, e) {
            for (var i = 0; i < e.length; i++) {
              var n = e[i]
              ;(n.enumerable = n.enumerable || !1),
                (n.configurable = !0),
                'value' in n && (n.writable = !0),
                Object.defineProperty(t, n.key, n)
            }
          }
          return function (e, i, n) {
            return i && t(e.prototype, i), n && t(e, n), e
          }
        })(),
        ee = function (t, e) {
          if (Array.isArray(t)) return t
          if (Symbol.iterator in Object(t))
            return (function (t, e) {
              var i = [],
                n = !0,
                s = !1,
                r = void 0
              try {
                for (
                  var a, o = t[Symbol.iterator]();
                  !(n = (a = o.next()).done) &&
                  (i.push(a.value), !e || i.length !== e);
                  n = !0
                );
              } catch (t) {
                ;(s = !0), (r = t)
              } finally {
                try {
                  !n && o.return && o.return()
                } finally {
                  if (s) throw r
                }
              }
              return i
            })(t, e)
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }
      ;(String.prototype.startsWith =
        String.prototype.startsWith ||
        function (t) {
          return 0 === this.indexOf(t)
        }),
        (String.prototype.padStart =
          String.prototype.padStart ||
          function (t, e) {
            for (var i = this; i.length < t; ) i = e + i
            return i
          })
      var ie = {
        cb: '0f8ff',
        tqw: 'aebd7',
        q: '-ffff',
        qmrn: '7fffd4',
        zr: '0ffff',
        bg: '5f5dc',
        bsq: 'e4c4',
        bck: '---',
        nch: 'ebcd',
        b: '--ff',
        bvt: '8a2be2',
        brwn: 'a52a2a',
        brw: 'deb887',
        ctb: '5f9ea0',
        hrt: '7fff-',
        chcT: 'd2691e',
        cr: '7f50',
        rnw: '6495ed',
        crns: '8dc',
        crms: 'dc143c',
        cn: '-ffff',
        Db: '--8b',
        Dcn: '-8b8b',
        Dgnr: 'b8860b',
        Dgr: 'a9a9a9',
        Dgrn: '-64-',
        Dkhk: 'bdb76b',
        Dmgn: '8b-8b',
        Dvgr: '556b2f',
        Drng: '8c-',
        Drch: '9932cc',
        Dr: '8b--',
        Dsmn: 'e9967a',
        Dsgr: '8fbc8f',
        DsTb: '483d8b',
        DsTg: '2f4f4f',
        Dtrq: '-ced1',
        Dvt: '94-d3',
        ppnk: '1493',
        pskb: '-bfff',
        mgr: '696969',
        grb: '1e90ff',
        rbrc: 'b22222',
        rwht: 'af0',
        stg: '228b22',
        chs: '-ff',
        gnsb: 'dcdcdc',
        st: '8f8ff',
        g: 'd7-',
        gnr: 'daa520',
        gr: '808080',
        grn: '-8-0',
        grnw: 'adff2f',
        hnw: '0fff0',
        htpn: '69b4',
        nnr: 'cd5c5c',
        ng: '4b-82',
        vr: '0',
        khk: '0e68c',
        vnr: 'e6e6fa',
        nrb: '0f5',
        wngr: '7cfc-',
        mnch: 'acd',
        Lb: 'add8e6',
        Lcr: '08080',
        Lcn: 'e0ffff',
        Lgnr: 'afad2',
        Lgr: 'd3d3d3',
        Lgrn: '90ee90',
        Lpnk: 'b6c1',
        Lsmn: 'a07a',
        Lsgr: '20b2aa',
        Lskb: '87cefa',
        LsTg: '778899',
        Lstb: 'b0c4de',
        Lw: 'e0',
        m: '-ff-',
        mgrn: '32cd32',
        nn: 'af0e6',
        mgnt: '-ff',
        mrn: '8--0',
        mqm: '66cdaa',
        mmb: '--cd',
        mmrc: 'ba55d3',
        mmpr: '9370db',
        msg: '3cb371',
        mmsT: '7b68ee',
        '': '-fa9a',
        mtr: '48d1cc',
        mmvt: 'c71585',
        mnLb: '191970',
        ntc: '5fffa',
        mstr: 'e4e1',
        mccs: 'e4b5',
        vjw: 'dead',
        nv: '--80',
        c: 'df5e6',
        v: '808-0',
        vrb: '6b8e23',
        rng: 'a5-',
        rngr: '45-',
        rch: 'da70d6',
        pgnr: 'eee8aa',
        pgrn: '98fb98',
        ptrq: 'afeeee',
        pvtr: 'db7093',
        ppwh: 'efd5',
        pchp: 'dab9',
        pr: 'cd853f',
        pnk: 'c0cb',
        pm: 'dda0dd',
        pwrb: 'b0e0e6',
        prp: '8-080',
        cc: '663399',
        r: '--',
        sbr: 'bc8f8f',
        rb: '4169e1',
        sbrw: '8b4513',
        smn: 'a8072',
        nbr: '4a460',
        sgrn: '2e8b57',
        ssh: '5ee',
        snn: 'a0522d',
        svr: 'c0c0c0',
        skb: '87ceeb',
        sTb: '6a5acd',
        sTgr: '708090',
        snw: 'afa',
        n: '-ff7f',
        stb: '4682b4',
        tn: 'd2b48c',
        t: '-8080',
        thst: 'd8bfd8',
        tmT: '6347',
        trqs: '40e0d0',
        vt: 'ee82ee',
        whT: '5deb3',
        wht: '',
        hts: '5f5f5',
        w: '-',
        wgrn: '9acd32'
      }
      function ne (t) {
        var e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1
        return (
          (e > 0
            ? t.toFixed(e).replace(/0+$/, '').replace(/\.$/, '')
            : t.toString()) || '0'
        )
      }
      var se = (function () {
          function t (e, i, n, s) {
            $t(this, t)
            var r = this
            if (void 0 === e);
            else if (Array.isArray(e)) this.rgba = e
            else if (void 0 === n) {
              var a = e && '' + e
              a &&
                (function (e) {
                  if (e.startsWith('hsl')) {
                    var i = e.match(/([\-\d\.e]+)/g).map(Number),
                      n = ee(i, 4),
                      s = n[0],
                      a = n[1],
                      o = n[2],
                      l = n[3]
                    void 0 === l && (l = 1),
                      (s /= 360),
                      (a /= 100),
                      (o /= 100),
                      (r.hsla = [s, a, o, l])
                  } else if (e.startsWith('rgb')) {
                    var c = e.match(/([\-\d\.e]+)/g).map(Number),
                      h = ee(c, 4),
                      d = h[0],
                      u = h[1],
                      f = h[2],
                      p = h[3]
                    void 0 === p && (p = 1), (r.rgba = [d, u, f, p])
                  } else
                    e.startsWith('#')
                      ? (r.rgba = t.hexToRgb(e))
                      : (r.rgba = t.nameToRgb(e) || t.hexToRgb(e))
                })(a.toLowerCase())
            } else this.rgba = [e, i, n, void 0 === s ? 1 : s]
          }
          return (
            te(
              t,
              [
                {
                  key: 'printRGB',
                  value: function (t) {
                    var e = (t ? this.rgba : this.rgba.slice(0, 3)).map(
                      function (t, e) {
                        return ne(t, 3 === e ? 3 : 0)
                      }
                    )
                    return t ? 'rgba(' + e + ')' : 'rgb(' + e + ')'
                  }
                },
                {
                  key: 'printHSL',
                  value: function (t) {
                    var e = [360, 100, 100, 1],
                      i = ['', '%', '%', ''],
                      n = (t ? this.hsla : this.hsla.slice(0, 3)).map(function (
                        t,
                        n
                      ) {
                        return ne(t * e[n], 3 === n ? 3 : 1) + i[n]
                      })
                    return t ? 'hsla(' + n + ')' : 'hsl(' + n + ')'
                  }
                },
                {
                  key: 'printHex',
                  value: function (t) {
                    var e = this.hex
                    return t ? e : e.substring(0, 7)
                  }
                },
                {
                  key: 'rgba',
                  get: function () {
                    if (this._rgba) return this._rgba
                    if (!this._hsla) throw new Error('No color is set')
                    return (this._rgba = t.hslToRgb(this._hsla))
                  },
                  set: function (t) {
                    3 === t.length && (t[3] = 1),
                      (this._rgba = t),
                      (this._hsla = null)
                  }
                },
                {
                  key: 'rgbString',
                  get: function () {
                    return this.printRGB()
                  }
                },
                {
                  key: 'rgbaString',
                  get: function () {
                    return this.printRGB(!0)
                  }
                },
                {
                  key: 'hsla',
                  get: function () {
                    if (this._hsla) return this._hsla
                    if (!this._rgba) throw new Error('No color is set')
                    return (this._hsla = t.rgbToHsl(this._rgba))
                  },
                  set: function (t) {
                    3 === t.length && (t[3] = 1),
                      (this._hsla = t),
                      (this._rgba = null)
                  }
                },
                {
                  key: 'hslString',
                  get: function () {
                    return this.printHSL()
                  }
                },
                {
                  key: 'hslaString',
                  get: function () {
                    return this.printHSL(!0)
                  }
                },
                {
                  key: 'hex',
                  get: function () {
                    return (
                      '#' +
                      this.rgba
                        .map(function (t, e) {
                          return e < 3
                            ? t.toString(16)
                            : Math.round(255 * t).toString(16)
                        })
                        .map(function (t) {
                          return t.padStart(2, '0')
                        })
                        .join('')
                    )
                  },
                  set: function (e) {
                    this.rgba = t.hexToRgb(e)
                  }
                }
              ],
              [
                {
                  key: 'hexToRgb',
                  value: function (t) {
                    var e = (t.startsWith('#') ? t.slice(1) : t)
                      .replace(/^(\w{3})$/, '$1F')
                      .replace(/^(\w)(\w)(\w)(\w)$/, '$1$1$2$2$3$3$4$4')
                      .replace(/^(\w{6})$/, '$1FF')
                    if (!e.match(/^([0-9a-fA-F]{8})$/))
                      throw new Error('Unknown hex color; ' + t)
                    var i = e
                      .match(/^(\w\w)(\w\w)(\w\w)(\w\w)$/)
                      .slice(1)
                      .map(function (t) {
                        return parseInt(t, 16)
                      })
                    return (i[3] = i[3] / 255), i
                  }
                },
                {
                  key: 'nameToRgb',
                  value: function (e) {
                    var i = e
                        .toLowerCase()
                        .replace('at', 'T')
                        .replace(/[aeiouyldf]/g, '')
                        .replace('ght', 'L')
                        .replace('rk', 'D')
                        .slice(-5, 4),
                      n = ie[i]
                    return void 0 === n
                      ? n
                      : t.hexToRgb(n.replace(/\-/g, '00').padStart(6, 'f'))
                  }
                },
                {
                  key: 'rgbToHsl',
                  value: function (t) {
                    var e = ee(t, 4),
                      i = e[0],
                      n = e[1],
                      s = e[2],
                      r = e[3]
                    ;(i /= 255), (n /= 255), (s /= 255)
                    var a = Math.max(i, n, s),
                      o = Math.min(i, n, s),
                      l = void 0,
                      c = void 0,
                      h = (a + o) / 2
                    if (a === o) l = c = 0
                    else {
                      var d = a - o
                      switch (
                        ((c = h > 0.5 ? d / (2 - a - o) : d / (a + o)), a)
                      ) {
                        case i:
                          l = (n - s) / d + (n < s ? 6 : 0)
                          break
                        case n:
                          l = (s - i) / d + 2
                          break
                        case s:
                          l = (i - n) / d + 4
                      }
                      l /= 6
                    }
                    return [l, c, h, r]
                  }
                },
                {
                  key: 'hslToRgb',
                  value: function (t) {
                    var e = ee(t, 4),
                      i = e[0],
                      n = e[1],
                      s = e[2],
                      r = e[3],
                      a = void 0,
                      o = void 0,
                      l = void 0
                    if (0 === n) a = o = l = s
                    else {
                      var c = function (t, e, i) {
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
                        },
                        h = s < 0.5 ? s * (1 + n) : s + n - s * n,
                        d = 2 * s - h
                      ;(a = c(d, h, i + 1 / 3)),
                        (o = c(d, h, i)),
                        (l = c(d, h, i - 1 / 3))
                    }
                    var u = [255 * a, 255 * o, 255 * l].map(Math.round)
                    return (u[3] = r), u
                  }
                }
              ]
            ),
            t
          )
        })(),
        re = (function () {
          function t () {
            $t(this, t), (this._events = [])
          }
          return (
            te(
              t,
              [
                {
                  key: 'add',
                  value: function (t, e, i) {
                    t.addEventListener(e, i, !1),
                      this._events.push({ target: t, type: e, handler: i })
                  }
                },
                {
                  key: 'remove',
                  value: function (e, i, n) {
                    this._events = this._events.filter(function (s) {
                      var r = !0
                      return (
                        e && e !== s.target && (r = !1),
                        i && i !== s.type && (r = !1),
                        n && n !== s.handler && (r = !1),
                        r && t._doRemove(s.target, s.type, s.handler),
                        !r
                      )
                    })
                  }
                },
                {
                  key: 'destroy',
                  value: function () {
                    this._events.forEach(function (e) {
                      return t._doRemove(e.target, e.type, e.handler)
                    }),
                      (this._events = [])
                  }
                }
              ],
              [
                {
                  key: '_doRemove',
                  value: function (t, e, i) {
                    t.removeEventListener(e, i, !1)
                  }
                }
              ]
            ),
            t
          )
        })()
      function ae (t, e, i) {
        var n = !1
        function s (t, e, i) {
          return Math.max(e, Math.min(t, i))
        }
        function r (t, r, a) {
          if ((a && (n = !0), n)) {
            t.preventDefault()
            var o = e.getBoundingClientRect(),
              l = o.width,
              c = o.height,
              h = r.clientX,
              d = r.clientY,
              u = s(h - o.left, 0, l),
              f = s(d - o.top, 0, c)
            i(u / l, f / c)
          }
        }
        function a (t, e) {
          1 === (void 0 === t.buttons ? t.which : t.buttons)
            ? r(t, t, e)
            : (n = !1)
        }
        function o (t, e) {
          1 === t.touches.length ? r(t, t.touches[0], e) : (n = !1)
        }
        t.add(e, 'mousedown', function (t) {
          a(t, !0)
        }),
          t.add(e, 'touchstart', function (t) {
            o(t, !0)
          }),
          t.add(window, 'mousemove', a),
          t.add(e, 'touchmove', o),
          t.add(window, 'mouseup', function (t) {
            n = !1
          }),
          t.add(e, 'touchend', function (t) {
            n = !1
          }),
          t.add(e, 'touchcancel', function (t) {
            n = !1
          })
      }
      var oe = 'keydown',
        le = 'mousedown',
        ce = 'focusin'
      function he (t, e) {
        return (e || document).querySelector(t)
      }
      function de (t) {
        t.preventDefault(), t.stopPropagation()
      }
      function ue (t, e, i, n, s) {
        t.add(e, oe, function (t) {
          i.indexOf(t.key) >= 0 && (s && de(t), n(t))
        })
      }
      var fe = (function () {
          function t (e) {
            $t(this, t),
              (this.settings = {
                popup: 'right',
                layout: 'default',
                alpha: !0,
                editor: !0,
                editorFormat: 'hex',
                cancelButton: !1,
                defaultColor: '#0cf'
              }),
              (this._events = new re()),
              (this.onChange = null),
              (this.onDone = null),
              (this.onOpen = null),
              (this.onClose = null),
              this.setOptions(e)
          }
          return (
            te(t, [
              {
                key: 'setOptions',
                value: function (t) {
                  var e = this
                  if (t) {
                    var i = this.settings
                    if (t instanceof HTMLElement) i.parent = t
                    else {
                      i.parent &&
                        t.parent &&
                        i.parent !== t.parent &&
                        (this._events.remove(i.parent),
                        (this._popupInited = !1)),
                        (function (t, e, i) {
                          for (var n in t) e[n] = t[n]
                        })(t, i),
                        t.onChange && (this.onChange = t.onChange),
                        t.onDone && (this.onDone = t.onDone),
                        t.onOpen && (this.onOpen = t.onOpen),
                        t.onClose && (this.onClose = t.onClose)
                      var n = t.color || t.colour
                      n && this._setColor(n)
                    }
                    var s = i.parent
                    if (s && i.popup && !this._popupInited) {
                      var r = function (t) {
                        return e.openHandler(t)
                      }
                      this._events.add(s, 'click', r),
                        ue(this._events, s, [' ', 'Spacebar', 'Enter'], r),
                        (this._popupInited = !0)
                    } else t.parent && !i.popup && this.show()
                  }
                }
              },
              {
                key: 'openHandler',
                value: function (t) {
                  if (this.show()) {
                    t && t.preventDefault(),
                      (this.settings.parent.style.pointerEvents = 'none')
                    var e = t && t.type === oe ? this._domEdit : this.domElement
                    setTimeout(function () {
                      return e.focus()
                    }, 100),
                      this.onOpen && this.onOpen(this.colour)
                  }
                }
              },
              {
                key: 'closeHandler',
                value: function (t) {
                  var e = t && t.type,
                    i = !1
                  if (t)
                    if (e === le || e === ce) {
                      var n = (this.__containedEvent || 0) + 100
                      t.timeStamp > n && (i = !0)
                    } else de(t), (i = !0)
                  else i = !0
                  i &&
                    this.hide() &&
                    ((this.settings.parent.style.pointerEvents = ''),
                    e !== le && this.settings.parent.focus(),
                    this.onClose && this.onClose(this.colour))
                }
              },
              {
                key: 'movePopup',
                value: function (t, e) {
                  this.closeHandler(),
                    this.setOptions(t),
                    e && this.openHandler()
                }
              },
              {
                key: 'setColor',
                value: function (t, e) {
                  this._setColor(t, { silent: e })
                }
              },
              {
                key: '_setColor',
                value: function (t, e) {
                  if (('string' == typeof t && (t = t.trim()), t)) {
                    e = e || {}
                    var i = void 0
                    try {
                      i = new se(t)
                    } catch (t) {
                      if (e.failSilently) return
                      throw t
                    }
                    if (!this.settings.alpha) {
                      var n = i.hsla
                      ;(n[3] = 1), (i.hsla = n)
                    }
                    ;(this.colour = this.color = i),
                      this._setHSLA(null, null, null, null, e)
                  }
                }
              },
              {
                key: 'setColour',
                value: function (t, e) {
                  this.setColor(t, e)
                }
              },
              {
                key: 'show',
                value: function () {
                  if (!this.settings.parent) return !1
                  if (this.domElement) {
                    var t = this._toggleDOM(!0)
                    return this._setPosition(), t
                  }
                  var e,
                    i,
                    n =
                      ((e =
                        this.settings.template ||
                        '<div class="picker_wrapper" tabindex="-1"><div class="picker_arrow"></div><div class="picker_hue picker_slider"><div class="picker_selector"></div></div><div class="picker_sl"><div class="picker_selector"></div></div><div class="picker_alpha picker_slider"><div class="picker_selector"></div></div><div class="picker_editor bg-white"><input aria-label="Type a color name or hex value"/></div><div class="picker_sample"></div><div class="picker_done"><button>Ok</button></div><div class="picker_cancel"><button>Cancel</button></div></div>'),
                      ((i = document.createElement('div')).innerHTML = e),
                      i.firstElementChild)
                  return (
                    (this.domElement = n),
                    (this._domH = he('.picker_hue', n)),
                    (this._domSL = he('.picker_sl', n)),
                    (this._domA = he('.picker_alpha', n)),
                    (this._domEdit = he('.picker_editor input', n)),
                    (this._domSample = he('.picker_sample', n)),
                    (this._domOkay = he('.picker_done button', n)),
                    (this._domCancel = he('.picker_cancel button', n)),
                    n.classList.add('layout_' + this.settings.layout),
                    this.settings.alpha || n.classList.add('no_alpha'),
                    this.settings.editor || n.classList.add('no_editor'),
                    this.settings.cancelButton || n.classList.add('no_cancel'),
                    this._ifPopup(function () {
                      return n.classList.add('popup')
                    }),
                    this._setPosition(),
                    this.colour
                      ? this._updateUI()
                      : this._setColor(this.settings.defaultColor),
                    this._bindEvents(),
                    !0
                  )
                }
              },
              {
                key: 'hide',
                value: function () {
                  return this._toggleDOM(!1)
                }
              },
              {
                key: 'destroy',
                value: function () {
                  this._events.destroy(),
                    this.domElement &&
                      this.settings.parent.removeChild(this.domElement)
                }
              },
              {
                key: '_bindEvents',
                value: function () {
                  var t = this,
                    e = this,
                    i = this.domElement,
                    n = this._events
                  function s (t, e, i) {
                    n.add(t, e, i)
                  }
                  s(i, 'click', function (t) {
                    return t.preventDefault()
                  }),
                    ae(n, this._domH, function (t, i) {
                      return e._setHSLA(t)
                    }),
                    ae(n, this._domSL, function (t, i) {
                      return e._setHSLA(null, t, 1 - i)
                    }),
                    this.settings.alpha &&
                      ae(n, this._domA, function (t, i) {
                        return e._setHSLA(null, null, null, 1 - i)
                      })
                  var r = this._domEdit
                  s(r, 'input', function (t) {
                    e._setColor(this.value, {
                      fromEditor: !0,
                      failSilently: !0
                    })
                  }),
                    s(r, 'focus', function (t) {
                      var e = this
                      e.selectionStart === e.selectionEnd && e.select()
                    }),
                    this._ifPopup(function () {
                      var e = function (e) {
                        return t.closeHandler(e)
                      }
                      s(window, le, e),
                        s(window, ce, e),
                        ue(n, i, ['Esc', 'Escape'], e)
                      var r = function (e) {
                        t.__containedEvent = e.timeStamp
                      }
                      s(i, le, r), s(i, ce, r), s(t._domCancel, 'click', e)
                    })
                  var a = function (e) {
                    t._ifPopup(function () {
                      return t.closeHandler(e)
                    }),
                      t.onDone && t.onDone(t.colour)
                  }
                  s(this._domOkay, 'click', a), ue(n, i, ['Enter'], a)
                }
              },
              {
                key: '_setPosition',
                value: function () {
                  var t = this.settings.parent,
                    e = this.domElement
                  t !== e.parentNode && t.appendChild(e),
                    this._ifPopup(function (i) {
                      'static' === getComputedStyle(t).position &&
                        (t.style.position = 'relative')
                      var n = !0 === i ? 'popup_right' : 'popup_' + i
                      ;[
                        'popup_top',
                        'popup_bottom',
                        'popup_left',
                        'popup_right'
                      ].forEach(function (t) {
                        t === n ? e.classList.add(t) : e.classList.remove(t)
                      }),
                        e.classList.add(n)
                    })
                }
              },
              {
                key: '_setHSLA',
                value: function (t, e, i, n, s) {
                  s = s || {}
                  var r = this.colour,
                    a = r.hsla
                  ;[t, e, i, n].forEach(function (t, e) {
                    ;(t || 0 === t) && (a[e] = t)
                  }),
                    (r.hsla = a),
                    this._updateUI(s),
                    this.onChange && !s.silent && this.onChange(r)
                }
              },
              {
                key: '_updateUI',
                value: function (t) {
                  if (this.domElement) {
                    t = t || {}
                    var e = this.colour,
                      i = e.hsla,
                      n = 'hsl(' + 360 * i[0] + ', 100%, 50%)',
                      s = e.hslString,
                      r = e.hslaString,
                      a = this._domH,
                      o = this._domSL,
                      l = this._domA,
                      c = he('.picker_selector', a),
                      h = he('.picker_selector', o),
                      d = he('.picker_selector', l)
                    b(0, c, i[0]),
                      (this._domSL.style.backgroundColor =
                        this._domH.style.color =
                          n),
                      b(0, h, i[1]),
                      y(0, h, 1 - i[2]),
                      (o.style.color = s),
                      y(0, d, 1 - i[3])
                    var u = s,
                      f = u.replace('hsl', 'hsla').replace(')', ', 0)'),
                      p = 'linear-gradient(' + [u, f] + ')'
                    if (
                      ((this._domA.style.background =
                        p +
                        ', linear-gradient(45deg, lightgrey 25%, transparent 25%, transparent 75%, lightgrey 75%) 0 0 / 2em 2em,\n                   linear-gradient(45deg, lightgrey 25%,       white 25%,       white 75%, lightgrey 75%) 1em 1em / 2em 2em'),
                      !t.fromEditor)
                    ) {
                      var g = this.settings.editorFormat,
                        m = this.settings.alpha,
                        v = void 0
                      switch (g) {
                        case 'rgb':
                          v = e.printRGB(m)
                          break
                        case 'hsl':
                          v = e.printHSL(m)
                          break
                        default:
                          v = e.printHex(m)
                      }
                      this._domEdit.value = v
                    }
                    this._domSample.style.color = r
                  }
                  function b (t, e, i) {
                    e.style.left = 100 * i + '%'
                  }
                  function y (t, e, i) {
                    e.style.top = 100 * i + '%'
                  }
                }
              },
              {
                key: '_ifPopup',
                value: function (t, e) {
                  this.settings.parent && this.settings.popup
                    ? t && t(this.settings.popup)
                    : e && e()
                }
              },
              {
                key: '_toggleDOM',
                value: function (t) {
                  var e = this.domElement
                  if (!e) return !1
                  var i = t ? '' : 'none',
                    n = e.style.display !== i
                  return n && (e.style.display = i), n
                }
              }
            ]),
            t
          )
        })(),
        pe = i(331),
        ge = i.n(pe)
      class me extends EventTarget {
        constructor (t, e) {
          super(),
            (this.fpdInstance = t),
            (this.darkColor = '#000'),
            (this.lightColor = '#fff'),
            (this.container = document.createElement('fpd-module-qr-code')),
            e.append(this.container)
          const i = this.container.querySelector('.fpd-qr-code-color-dark')
          setTimeout(() => {
            // If the user has already tapped a real product/face tile since
            // this page loaded, don't replay a stale saved selection on top
            // of whatever they're now looking at.
            if (window.__fpdUserInteracted) {
              window.localStorage.setItem('productLoader', 'done')
              return
            }
            window.localStorage.setItem('productLoader', '')

            let productIndex = window.localStorage.getItem('productIndex')
            let categoryIndex = window.localStorage.getItem('categoryIndex')
            let childIndex = window.localStorage.getItem('childIndex')

            // getCategoryAndProductIndex() (home.component.ts) resolves to
            // -1/-1/-1 when the current route has no specific product to
            // restore (e.g. the base designer URL with no manufacturer/slug).
            // -1 is still a non-null string once round-tripped through
            // localStorage, so the old `!== null` check let this proceed,
            // land on categoryItems[-1] (always undefined) and fall through
            // to the "missing" warning below on every such load - which is
            // the expected, not an error, case. Skip the whole restore
            // attempt when there's nothing to restore.
            if (
              productIndex !== null &&
              categoryIndex !== null &&
              productIndex !== '-1' &&
              categoryIndex !== '-1'
            ) {
              //  this.fpdInstance.selectProduct(, );
              // Get the FPD dropdown items
              const categoryItems = document.querySelectorAll(
                '.fpd-product-categories .fpd-item'
              )
              const dropdownInput = document.querySelector(
                '.fpd-product-categories .fpd-dropdown-current'
              )

              if (
                categoryItems &&
                dropdownInput &&
                categoryItems[categoryIndex]
              ) {
                const selectedItem = categoryItems[categoryIndex]
                const categoryText = selectedItem.textContent
                ;
                // 👉 Temporarily hide the dropdown UI
                const dropdownWrapper = document.querySelector(
                  '.fpd-product-categories'
                )
                // dropdownWrapper?.setAttribute("hidden", "true");
                dropdownWrapper.style.display = 'none'

                // Update visible input value
                dropdownInput.value = categoryText

                // Dispatch events
                dropdownInput.dispatchEvent(
                  new Event('input', { bubbles: true })
                )
                dropdownInput.dispatchEvent(
                  new Event('change', { bubbles: true })
                )

                // Simulate actual category selection logic
                selectedItem.dispatchEvent(
                  new MouseEvent('click', { bubbles: true })
                )

                setTimeout(() => {
                  // Same check, re-run right before the destructive steps -
                  // the user may have clicked a real product/face tile during
                  // the delay since the outer timeout fired.
                  if (window.__fpdUserInteracted) {
                    dropdownWrapper.style.display = 'block'
                    window.localStorage.setItem('productLoader', 'done')
                    return
                  }
                  const dropdownArrow = document.querySelector(
                    '.fpd-product-categories .fpd-dropdown-arrow'
                  )
                  localStorage.setItem('productLoader', '')
                  dropdownArrow?.click() // FPD uses this to toggle close
                  setTimeout(() => {
                    localStorage.setItem('productLoader', 'done')
                  }, 1000)
                  //    dropdownWrapper?.removeAttribute("hidden");
                  dropdownWrapper.style.display = 'block'

                  const sidebarItems =
                    document.querySelectorAll('.ProductModule')
                  sidebarItems[0].children[Number(productIndex)]?.click()

                  const confirmButton = document.querySelector('.fpd-confirm')
                  confirmButton?.click()
                  // setTimeout(() => {

                  if (Number(childIndex) && !window.__fpdUserInteracted) {
                    const targetItem = document.querySelector(
                      `.skins-det[data-index="${childIndex}"]`
                    )

                    if (targetItem) {
                      targetItem.click()
                      ;
                    } else {
                      console.warn('❌ Item not found.')
                    }
                  }
                  window.localStorage.setItem('productLoader', 'done')
                }, 100)
              } else {
                console.warn(
                  '❌ Could not set category - item or dropdown missing.'
                )
              }
            }
          }, 100);
          // ===================================================================
          // ===== CUSTOM (StyleFlip): restore a shared/saved design from URL ==
          // When the page is opened at .../savedesign?title=...&design_id=...,
          // fetches the saved design from the StyleFlip backend and loads its
          // fabric.js JSON onto the current canvas.
          // ===================================================================
          if (window.location.href.includes("savedesign")) {

                setTimeout(async () => {
          const currentUrl = window.location.href;
          ;

          // Only continue if URL includes "savedesign"
          if (!currentUrl.includes("savedesign")) {
            ;
            return;
          }

          try {
            const titleParam = new URLSearchParams(window.location.search).get("title");
            const idParam = new URLSearchParams(window.location.search).get("design_id");

            if (!titleParam) {
              ;
              return;
            }

            const response = await fetch(`/api/sharedproduct/search?title=${encodeURIComponent(titleParam)}&design_id=${encodeURIComponent(idParam)}`);
            if (!response.ok) {
              throw new Error('Saved design request failed: ' + response.status);
            }
            const data = await response.json();
            const productViews = Array.isArray(data && data.product)
              ? data.product
              : data && data.product
              ? [data.product]
              : null;
            const canvas = t.currentViewInstance && t.currentViewInstance.fabricCanvas;
            if (!canvas) {
              console.error("Canvas not available", t);
              return;
            }
            if (!productViews || !productViews.length) {
              console.error('Saved design response did not include product views', data);
              return;
            }
            t.loadProduct(productViews);
            // const base64Image = data?.base64save;
            // if (!base64Image || typeof base64Image !== 'string' || !base64Image.startsWith('data:image')) {
            //   console.log("No valid base64 image found");
            //   return;
            // }

            // const canvas = t.currentViewInstance && t.currentViewInstance.fabricCanvas;
            // if (!canvas) {
            //   console.error("Canvas not available", t);
            //   return;
            // }

            // // Remove existing images
            // if (typeof canvas.getElements === 'function') {
            //   const elements = canvas.getElements();
            //   if (Array.isArray(elements)) {
            //     elements
            //       .filter(el => el.type === 'image')
            //       .forEach(el => {
            //         if (typeof canvas.removeElement === 'function') {
            //           canvas.removeElement(el);
            //         } else if (typeof canvas.remove === 'function') {
            //           canvas.remove(el);
            //         }
            //       });
            //   }
            // } else if (typeof canvas.getObjects === 'function') {
            //   canvas.getObjects('image').forEach(obj => canvas.remove(obj));
            //   canvas.renderAll && canvas.renderAll();
            // }

            // // Add new image
            // console.log("Adding image to canvas:", canvas.width, canvas.height);
            // fabric.Image.fromURL(base64Image, function (img) {
            //   img.set({
            //     width: canvas.width,
            //     height: canvas.height,
            //     left: 0,
            //     top: 0,
            //     originX: 'center',
            //     originY: 'center',
            //     scaleX: 1,
            //     scaleY: 1,
            //   });
            //   console.log("Image loaded:", img);
            //   canvas.add(img);
            //   canvas.renderAll && canvas.renderAll();
            // }, { crossOrigin: 'anonymous' });

            ;
          } catch (error) {
            console.error("Error fetching or rendering image:", error);
          }
        }, 2000);
          // ===== END CUSTOM (StyleFlip: restore design from URL) ============

          }




          (i.style.backgroundColor = '#000'),
            new fe({
              parent: i,
              popup: 'bottom',
              alpha: !1,
              color: this.darkColor,
              onChange: t => {
                ;(this.darkColor = o(t.rgbaString).toHexString()),
                  (i.style.backgroundColor = this.darkColor)
              }
            })
          const n = this.container.querySelector('.fpd-qr-code-color-light')
          ;(n.style.backgroundColor = this.lightColor),
            new fe({
              parent: n,
              popup: 'bottom',
              alpha: !1,
              color: this.lightColor,
              onChange: t => {
                ;(this.lightColor = o(t.rgbaString).toHexString()),
                  (n.style.backgroundColor = this.lightColor)
              }
            }),
            G(this.container.querySelector('.fpd-btn'), 'click', e => {
              q(this, 'qrCodeModuleBtnClick')
              const i = this.container.querySelector('input[type="text"]').value
              if (i && i.length > 0) {
                const e = new (ge())({
                    background: this.lightColor,
                    backgroundAlpha: 1,
                    foreground: this.darkColor,
                    foregroundAlpha: 1,
                    size: 500,
                    value:
                      this.container.querySelector('input[type="text"]').value
                  }),
                  n = z(t.mainOptions.qrCodeProps, {
                    _addToUZ: t.currentViewInstance.currentUploadZone,
                    _isQrCode: !0
                  })
                t._addCanvasImage(e.toDataURL(), 'QR-Code: ' + i, n)
              }
            })
        }
      }
      var ve = i(729),
        be = i.n(ve)
      // ===================================================================
      // ===== CUSTOM (StyleFlip): save/load design module =================
      // The vendor's stock "Saved Designs" module (fpd-module-save-load),
      // customized to save designs (as a thumbnail + fabric.js JSON) to the
      // StyleFlip backend and generate shareable /savedesign?... links, in
      // addition to the vendor's original browser-localStorage save.
      // ===================================================================
      class ye extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
  this.innerHTML =
    '<div data-moduleicon="folder-open" data-defaulttext="Saved Designs" data-title="modules.save_load"> \
      <div class="fpd-save-design"> \
        <input class="!bg-white !border !border-[#35475a33] !border-solid" type="text" data-defaulttext="Optional: Enter a title" placeholder="modules.save_load_input_placeholder"> \
        <div class="fpd-btn !bg-[var(--theme-color)] w-[100%] text-center !text-sm !normal-case justify-center" style="pointer-events: none; opacity: 0.5;"> \
          <span data-defaulttext="Save Design">modules.save_load_add_btn</span> \
        </div> \
      </div> \
      <div class="fpd-saved-designs fpd-scroll-area"> \
        <div class="fpd-grid fpd-grid-contain"></div> \
      </div> \
    </div>';

  // Enable/disable button based on input
  const input = this.querySelector('input[type="text"]');
  const btn = this.querySelector('.fpd-btn');
  input.addEventListener('input', function() {
    if (input.value.trim()) {
      btn.style.pointerEvents = '';
      btn.style.opacity = '';
    } else {
      btn.style.pointerEvents = 'none';
      btn.style.opacity = '0.5';
    }
  });
}
      }
      function xe (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      customElements.define('fpd-module-save-load', ye)
      var we = new WeakSet()
      class Ce extends EventTarget {
        constructor (t, e) {
          if (
            (super(),
            (function (t, e) {
              if (e.has(t))
                throw new TypeError(
                  'Cannot initialize the same private elements twice on an object'
                )
            })((i = this), (s = we)),
            s.add(i),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-module-save-load')),
            e.append(this.container),
            (this.inputElem = this.container.querySelector('input')),
            (this.gridElem = this.container.querySelector('.fpd-grid')),
            G(this.container.querySelector('.fpd-btn'), 'click', e => {
              const i = kt(
                this.fpdInstance.currentViewInstance.options.stageWidth,
                this.fpdInstance.currentViewInstance.options.stageHeight,
                300,
                300,
                'cover'
              )
              ;
              t.viewInstances[0].toDataURL(
                t => {
                  const e = this.fpdInstance.getProduct(),
                  
                    i = {
                      thumbnail: t,
                      product: e,
                      title: this.inputElem.value || '',
                      uploadedAt: new Date().toISOString(),
                        design_id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5)

                    }
                  if (
                    e &&
                    this.fpdInstance.mainOptions.saveActionBrowserStorage
                  ) {
                    let t = xe(this, we, Se).call(this)
                    t || (t = []),
                      this.addSavedProduct(i)

                      fetch('https://styleflip-backend-jdm5.ithemes.xyz/api/sharedproduct/save', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          title: i.title,
                          base64save: i.thumbnail,
                          product: i.product, // ✅ Added here
                          uploadedAt: i.uploadedAt,
                          design_id: i.design_id
                        })
                      })
                        .then(res => res.json())
                        .then(response => {
                          ;
                          i._id = response.product._id;
                          ;
                          
                        })
                        .catch(err => {
                          console.error('Error saving shared product:', err);
                        });
                        ;
                        ;  // 👈 Check if _id is still here
;
                    t.push(i),
                      window.localStorage.setItem(
                        this.fpdInstance.container.id,
                        JSON.stringify(t)
                      ),
                      n(
                        this.fpdInstance.translator.getTranslation(
                          'misc',
                          'product_saved'
                        )
                      )
                  }
                  e &&
                    (this.fpdInstance.dispatchEvent(
                      new CustomEvent('actionSave', { detail: i })
                    ),
                    (this.fpdInstance.doUnsavedAlert = !1))
                },
                { multiplier: i, format: 'png', backgroundColor: 'transparent' }
              )
            }),
            this.fpdInstance.mainOptions.saveActionBrowserStorage)
          ) {
            ;
            let t = xe(this, we, Se).call(this)
            t &&
              t.length > 0 &&
              t.forEach(t => {
                this.addSavedProduct(t)
              })
          }
          var i, s
        }
        addSavedProduct (t) {
          ;
          let e = t.thumbnail || t.base64save;
          let { product: i, title: n = '' } = t;
          // let e = 
          // let { thumbnail: e, product: i, title: n = '' } = t
          const s = $({
            url: e,
            title: n,
            uploadedAt: t.uploadedAt,
            design_id: t.design_id,
            removable: !0,
            disablePrice: !0,
            disableDraggable: !0
          })
          return (
            this.fpdInstance.lazyBackgroundObserver.observe(
              s.querySelector('picture')
            ),
            (s.product = i),
            this.gridElem.append(s),
            G(s, 'click', t => {
              ;
              this.fpdInstance.loadProduct(s.product),
                (this.fpdInstance.currentProductIndex = -1)
            }),
            G(s.querySelector('.fa-trash'), 'click', t => {
              t.stopPropagation()
              const e = t.currentTarget.parentNode,
                i = Array.from(
                  this.gridElem.querySelectorAll('.fpd-item')
                ).indexOf(e)
              if (this.fpdInstance.mainOptions.saveActionBrowserStorage) {
                let t = xe(this, we, Se).call(this)
                t.splice(i, 1),
                  window.localStorage.setItem(
                    this.fpdInstance.container.id,
                    JSON.stringify(t)
                  )
              }
              this.fpdInstance.dispatchEvent(
                new CustomEvent('actionLoad:Remove', {
                  detail: { index: i, item: e }
                })
              ),
                e.remove()
            }),
            s
          )
        }
      }
      function Se () {
        return (
          !!K() &&
          JSON.parse(window.localStorage.getItem(this.fpdInstance.container.id))
        )
      }
      function Te (t, e, i) {
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
      function Ee (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      window.FPDSaveLoadModule = Ce
      // ===== END CUSTOM (StyleFlip: save/load design module) =============
      var Ae = new WeakSet()
      class Ie extends EventTarget {
        constructor (t) {
          var e, i
          super(),
            (function (t, e) {
              if (e.has(t))
                throw new TypeError(
                  'Cannot initialize the same private elements twice on an object'
                )
            })((e = this), (i = Ae)),
            i.add(e),
            Te(this, 'currentActions', {}),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-actions-bar')),
            t.container.append(this.container),
            (this.leftActionsMenu = this.container.querySelector(
              '[data-pos="left"] fpd-actions-menu'
            )),
            this.leftActionsMenu.setAttribute(
              'placeholder',
              this.fpdInstance.translator.getTranslation('actions', 'menu_file')
            ),
            (this.centerActionsMenu = this.container.querySelector(
              '[data-pos="center"] fpd-actions-menu'
            )),
            (this.rightActionsMenu = this.container.querySelector(
              '[data-pos="right"] fpd-actions-menu'
            )),
            this.rightActionsMenu.setAttribute(
              'placeholder',
              this.fpdInstance.translator.getTranslation('actions', 'menu_more')
            ),
            G(t.container.querySelectorAll('.fpd-close'), 'click', t => {
              Z(this.fpdInstance.modalWrapper, ['fpd-show']),
                this.fpdInstance.dispatchEvent(
                  new CustomEvent('modalDesignerClose')
                )
            }),
            G(t.container.querySelector('.fpd-done'), 'click', t => {
              this.fpdInstance.dispatchEvent(
                new CustomEvent('modalDesignerDone')
              )
            }),
            G(t, ['viewSelect'], t => {
              this.reset()
            }),
            G(window, 'resize', e => {
              t.inTextField || this.reset()
            }),
            G(window, ['resize', 'fpdModalDesignerOpen'], () => {
              this.leftActionsMenu && this.leftActionsMenu.toggleMenus(),
                this.rightActionsMenu && this.rightActionsMenu.toggleMenus()
            }),
            this.setup(t.mainOptions.actions)
        }
        addActionBtn (t, e) {
          let i =
            arguments.length > 2 && void 0 !== arguments[2] && arguments[2]
          if (Ie.availableActions.hasOwnProperty(e)) {
            const n = Ie.availableActions[e],
              s = this.fpdInstance.translator.getTranslation(
                'actions',
                e.replace(/-/g, '_'),
                n.title
              )
            if (i)
              (n.type = e),
                (n.title = s),
                (n.handler = t => {
                  const e = t.currentTarget.querySelector('.fpd-switch')
                  e &&
                    !t.target.classList.contains('fpd-switch') &&
                    (e.checked = !e.checked),
                    this.doAction(t.currentTarget.dataset.action)
                }),
                (t.items = [...t.items, n])
            else {
              const i = document.createElement('div')
              ;(i.className = 'fpd-btn fpd-tooltip'),
                i.setAttribute('aria-label', s),
                (i.dataset.action = e),
                (i.innerHTML = `<i class="${n.icon}"></i><span>${s}</span>`),
                Ie.toggleActions.includes(e) &&
                  i.insertAdjacentHTML(
                    'beforeend',
                    '<input type="checkbox" class="fpd-switch" />'
                  ),
                t.append(i),
                G(i, 'click', t => {
                  const e = t.currentTarget.querySelector('.fpd-switch')
                  e &&
                    !t.target.classList.contains('fpd-switch') &&
                    (e.checked = !e.checked),
                    this.doAction(t.currentTarget.dataset.action)
                })
            }
          }
        }

        doAction (e) {
          ;
          if (this.fpdInstance?.currentViewInstance) {
            ;
            if ((this.fpdInstance.deselectElement(), 'print' === e))
              this.fpdInstance.print()
            else if ('reset-product' === e) {
              var i = t(
                this.fpdInstance.translator.getTranslation(
                  'misc',
                  'reset_confirm'
                ),
                !1,
                'confirm',
                this.fpdInstance.container
              )
              const e = i.querySelector('.fpd-confirm')
              ;(e.innerText = this.fpdInstance.translator.getTranslation(
                'actions',
                'reset_product'
              )),
                G(e, ['click'], () => {
                  ;
                  localStorage.setItem('groupTransforms', '')
                  document.querySelector('.fpd-ungroup1')?.classList.add('fpd-hidden');
                  document.querySelector('.fpd-ungroup')?.classList.remove('fpd-hidden');
                  document.querySelector('.fpd-group-copy-by')?.classList.add('fpd-hidden');
                  document.querySelector('.fpd-group-paste-by')?.classList.add('fpd-hidden');
                  this.fpdInstance.loadProduct(this.fpdInstance.productViews),
                    i.remove()
                })
            } else if ('undo' === e)
              this.fpdInstance.currentViewInstance.fabricCanvas.undo()
            else if ('redo' === e)
              this.fpdInstance.currentViewInstance.fabricCanvas.redo()
            else if ('info' === e)
              t(
                this.fpdInstance.translator.getTranslation(
                  'actions',
                  'info_content'
                ),
                !1,
                '',
                this.fpdInstance.container
              )
            else if ('preview-lightbox' === e)
              (this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler =
                !1),
                this.fpdInstance.getProductDataURL(e => {
                  const i = new Image()
                  ;(i.src = e),
                    (i.onload = () => {
                      const e = t(
                        '<div style="background: url(' +
                          i.src +
                          '); height: 90vh; width:100%; background-size:contain; background-repeat:no-repeat; background-position:center;"></div>',
                        !0
                      )
                      q(this.fpdInstance, 'actionPreviewModalOpen', {
                        modal: e
                      })
                    }),
                    (this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler =
                      this.fpdInstance.mainOptions.rulerFixed),
                    this.fpdInstance.currentViewInstance.fabricCanvas.renderAll()
                })
            else if ('snap' === e)
              (this.fpdInstance.currentViewInstance.fabricCanvas.snapToGrid =
                !this.fpdInstance.currentViewInstance.fabricCanvas.snapToGrid),
                this.fpdInstance.currentViewInstance.fabricCanvas.renderAll()
            else if ('zoom' === e) {
              let zoomWrapper = this.fpdInstance.mainWrapper.container.querySelector('.fpd-zoom-wrapper');

              if (zoomWrapper) {
                  // ✅ Already exists → do nothing OR return
                  return;
              }
              const t =
                this.fpdInstance.mainWrapper.container.querySelector(
                  '.fpd-zoom-wrapper'
                )
              //if (t) return void t.remove()
              const e = document.createElement('div')
              e.className = 'fpd-zoom-wrapper fpd-shadow-1'
              const i =
                  this.fpdInstance.currentViewInstance.fabricCanvas.getZoom() /
                  this.fpdInstance.currentViewInstance.fabricCanvas
                    .responsiveScale,
                n = document.createElement('fpd-range-slider')
              ;(n.className = 'fpd-progress'),
                n.setAttribute('value', i),
                n.setAttribute('step', 0.02),
                n.setAttribute('min', 1),
                n.setAttribute('max', 3),
                (n.onInput = t => {
                  this.fpdInstance.currentViewInstance.fabricCanvas.setResZoom(
                    Number(t.currentTarget.value)
                  )
                }),
                e.append(n)
              const s = document.createElement('div')
              ;(s.className = 'fpd-stage-pan fpd-toggle'),
                (s.innerHTML = '<span class="fpd-icon-drag"></span>'),
                e.append(s),
                G(s, 'click', t => {
                  ;(this.fpdInstance.currentViewInstance.fabricCanvas.panCanvas =
                    !this.fpdInstance.currentViewInstance.fabricCanvas
                      .panCanvas),
                    J(
                      s,
                      ['fpd-active'],
                      this.fpdInstance.currentViewInstance.fabricCanvas
                        .panCanvas
                    )
                })
              const r = document.createElement('div')
              ;(r.className = 'fpd-close'),
                (r.innerHTML = '<span class="fa-solid fa-close"></span>'),
                e.append(r),
                G(r, 'click', t => {
                  e && e.remove()
                }),
                this.fpdInstance.mainWrapper.container.append(e)
            } else if ('download' === e) {
              const e = `<div class="fpd-modal-download">\n\t\t\t<span data-value="jpeg">\n\t\t\t\t<span class="fpd-icon-jpg"></span>\n\t\t\t</span>\n\t\t\t<span data-value="png">\n\t\t\t\t<span class="fpd-icon-png"></span>\n\t\t\t</span>\n\t\t\t<span data-value="pdf">\n\t\t\t\t<span class="fpd-icon-pdf"></span>\n\t\t\t</span>\n\t\t\t<span data-value="svg">\n\t\t\t\t<span class="fpd-icon-svg"></span>\n\t\t\t</span>\n\t\t\t<div class="fpd-switch-wrapper">\n\t\t\t\t<input type="checkbox" class="fpd-switch" id="fpd-action-download-single-view" />\n\t\t\t\t<label for="fpd-action-download-single-view">${this.fpdInstance.translator.getTranslation(
                  'actions',
                  'download_current_view'
                )}</label>\n\t\t\t</div>\n\t\t</div>`,
                i = t(e, !1, '', this.fpdInstance.container)
              G(i.querySelectorAll('span[data-value]'), 'click', t => {
                ;(this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler =
                  !1),
                  this.downloadFile(
                    t.currentTarget.dataset.value,
                    i.querySelector('.fpd-switch').checked
                  ),
                  i.remove(),
                  (this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler =
                    this.fpdInstance.mainOptions.rulerFixed),
                  this.fpdInstance.currentViewInstance.fabricCanvas.renderAll()
              })
            } else if ('ruler' === e)
              (this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler =
                !this.fpdInstance.currentViewInstance.fabricCanvas.enableRuler),
                this.fpdInstance.currentViewInstance.fabricCanvas.renderAll()
            else if ('previous-view' === e)
              this.fpdInstance.selectView(this.fpdInstance.currentViewIndex - 1)
            else if ('next-view' === e)
              this.fpdInstance.selectView(this.fpdInstance.currentViewIndex + 1)
            else if ('guided-tour' === e && this.fpdInstance.guidedTour)
              this.fpdInstance.guidedTour.start()
            else if ('qr-code' === e) {
              const e = this.fpdInstance.container.querySelector(
                '.fpd-modal-internal'
              )
              e && e.remove()
              const i = t('', !1, '', this.fpdInstance.container),
                n = new me(
                  this.fpdInstance,
                  i.querySelector('.fpd-modal-content')
                )
              this.fpdInstance.translator.translateArea(i),
                G(n, 'qrCodeModuleBtnClick', () => {
                  i.remove()
                })
            } else if ('save-load' === e) {
              const e = this.fpdInstance.container.querySelector(
                '.fpd-modal-internal'
              )
              e && e.remove()
              const i = t('', !1, '', this.fpdInstance.container)
              new Ce(this.fpdInstance, i.querySelector('.fpd-modal-content')),
                this.fpdInstance.translator.translateArea(i)
            }
            q(this.fpdInstance, 'actionClick', { action: e })
          }
        }
        downloadFile (t) {
          let e =
            arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
          if (!this.fpdInstance.currentViewInstance) return
          const i = this.fpdInstance.mainOptions.downloadFilename
          if ('jpeg' === t || 'png' === t) {
            document.createElement('a')
            var n = 'jpeg' === t ? '#fff' : 'transparent'
            e
              ? this.fpdInstance.currentViewInstance.toDataURL(
                  e => {
                    be()(e, i + '.' + t, 'image/' + t)
                  },
                  {
                    format: t,
                    backgroundColor: n,
                    watermarkImg: this.fpdInstance.watermarkImg
                  }
                )
              : this.fpdInstance.getProductDataURL(
                  e => {
                    be()(e, i + '.' + t, 'image/' + t)
                  },
                  { format: t, backgroundColor: n }
                )
          } else
            'svg' === t
              ? be()(
                  this.fpdInstance.currentViewInstance.toSVG({
                    suppressPreamble: !1,
                    watermarkImg: this.fpdInstance.watermarkImg
                  }),
                  'Product_' + this.fpdInstance.currentViewIndex + '.svg',
                  'image/svg+xml'
                )
              : ((s =
                  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
                new Promise(function (t, e) {
                  if (
                    null === document.querySelector("script[src='" + s + "']")
                  ) {
                    var i = document.createElement('script')
                    ;(i.onload = () => {
                      t()
                    }),
                      (i.onerror = () => {
                        e()
                      }),
                      (i.src = s),
                      document.body.appendChild(i)
                  } else t()
                })).then(() => {
                  const t = t => {
                    let n
                    t = 'string' == typeof t ? [t] : t
                    for (let i = 0; i < t.length; ++i) {
                      const s = e ? this.fpdInstance.currentViewIndex : i
                      let r =
                          this.fpdInstance.viewInstances[s].options.stageWidth,
                        a =
                          this.fpdInstance.viewInstances[s].options.stageHeight,
                        o = r > a ? 'l' : 'p'
                      0 != i
                        ? n.addPage([r, a], o)
                        : (n = new jspdf.jsPDF({
                            orientation: o,
                            unit: 'px',
                            format: [r, a]
                          })),
                        n.addImage(
                          t[i],
                          'PNG',
                          0,
                          0,
                          n.internal.pageSize.getWidth(),
                          n.internal.pageSize.getHeight()
                        )
                    }
                    n.save(i + '.pdf')
                  }
                  jspdf &&
                    (e
                      ? this.fpdInstance.currentViewInstance.toDataURL(t, {
                          format: 'png',
                          watermarkImg: this.fpdInstance.watermarkImg
                        })
                      : this.fpdInstance.getViewsDataURL(t, { format: 'png' }))
                })
          var s
        }
        reset () {
          const t = this.container.querySelectorAll('.fpd-switch')
          t &&
            t.forEach(t => {
              t.checked = !1
            })
          const e =
            this.fpdInstance.mainWrapper.container.querySelector(
              '.fpd-zoom-wrapper'
            )
          e && e.remove(),
            this.fpdInstance.currentViewInstance &&
              this.fpdInstance.currentViewInstance.fabricCanvas.setResZoom(1)
        }
        setup () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          if (((this.currentActions = t), 'object' == typeof t)) {
            this.container.querySelectorAll('fpd-actions-menu').forEach(t => {
              t.items = []
            })
            for (const e in t) Ee(this, Ae, Oe).call(this, e, t[e])
          }
          this.fpdInstance.translator.translateArea(this.container)
        }
      }
      function Oe (t, e) {
        Array.isArray(e) && e.length
          ? e.forEach(e => {
              let i
              'left' == t
                ? (i = this.leftActionsMenu)
                : 'center' == t
                ? (i = this.centerActionsMenu)
                : 'right' == t && (i = this.rightActionsMenu),
                i && this.addActionBtn(i, e, !0)
            })
          : ('left' != t && 'right' != t) ||
            X(this.container.querySelector('[data-pos="' + t + '"]'), [
              'fpd-visible-hidden'
            ])
      }
      function ke (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function Me (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      Te(Ie, 'toggleActions', ['ruler']),
        Te(Ie, 'availableActions', {
          print: { icon: 'printer', title: 'Print' },
          'reset-product': { icon: 'rotate-ccw', title: 'Reset Product' },
          undo: { icon: 'undo', title: 'Undo' },
          redo: { icon: 'redo', title: 'Redo' },
          info: { icon: 'info', title: 'Info' },
          zoom: { icon: 'zoom-in', title: 'Zoom' },
          // download: { icon: 'arrow-down-to-line', title: 'Download' },
          'preview-lightbox': { icon: 'eye', title: 'Preview Lightbox' },
          ruler: { icon: 'ruler', title: 'Ruler' },
          // 'previous-view': { icon: 'fpd-icon-back', title: 'Previous View' },
          'next-view': { icon: 'fpd-icon-forward', title: 'Next View' },
          'guided-tour': { icon: 'fpd-icon-guided-tour', title: 'Guided Tour' },
          'qr-code': { icon: 'qr-code', title: 'QR-Code' },
          'save-load': { icon: 'save', title: 'Saved Designss' }
        }),
        (window.FPDActions = Ie)
      var Pe = new WeakSet(),
        _e = new WeakSet()
      class De extends HTMLElement {
        constructor () {
          super(), ke(this, _e), ke(this, Pe), (this.items = [])
        }
        connectedCallback () {
          ;(this.innerHTML =
            '<div class="fpd-uncollapsed-menu fpd-visible-hidden fpd-hidden"></div> <div class="fpd-collapsed-menu fpd-hidden"> <div class="fpd-dropdown-btn"> <i></i> <span class="fpd-label"></span> <div class="fpd-dropdown-menu fpd-shadow-1"></div> </div> </div>'),
            (this.uncollapsedMenu = this.querySelector(
              '.fpd-uncollapsed-menu'
            )),
            (this.collapsedMenu = this.querySelector('.fpd-collapsed-menu')),
            (this.collapsedMenu.querySelector(
              '.fpd-dropdown-btn > i'
            ).className = this.dataset.fontIcon || ''),
            G(
              this.collapsedMenu.querySelectorAll('.fpd-dropdown-btn'),
              'click',
              t => {
                const e = t.currentTarget.querySelector('.fpd-dropdown-menu')
                J(e, ['fpd-show'], !e.classList.contains('fpd-show'))
              }
            )
        }
        static get observedAttributes () {
          return ['items', 'placeholder']
        }
        attributeChangedCallback (t, e, i) {
          e !== i &&
            'placeholder' == t &&
            this.collapsedMenu &&
            (this.collapsedMenu.querySelector(
              '.fpd-dropdown-btn > .fpd-label'
            ).innerText = i)
        }
        get items () {
          return this._items
        }
        set items (t) {
          ;(this._items = t), Me(this, Pe, Le).call(this)
        }
        toggleMenus () {
          this.isConnected &&
            this.uncollapsedMenu &&
            (Z(this.uncollapsedMenu, ['fpd-hidden']),
            this.uncollapsedMenu.offsetWidth > this.offsetWidth &&
            !this.classList.contains('fpd-only-uncollapsed')
              ? (X(this.uncollapsedMenu, ['fpd-visible-hidden']),
                X(this.uncollapsedMenu, ['fpd-hidden']),
                Z(this.collapsedMenu, ['fpd-hidden']))
              : (Z(this.uncollapsedMenu, ['fpd-visible-hidden']),
                X(this.collapsedMenu, ['fpd-hidden'])))
        }
      }
      function Le () {
        Me(this, _e, Be).call(this),
          this._items.forEach(t => {
            const e = document.createElement('div')
            ;(e.className = 'fpd-btn fpd-tooltip !flex'),
              e.setAttribute('aria-label', t.title),
              (e.dataset.action = t.type),
              // (e.innerHTML = `<i class="${t.icon}"></i><span>${t.title}</span>`),
              (e.innerHTML = `<i data-lucide="${t.icon}" class="${t.icon}"></i><span>${t.title}</span>`),
              Ie.toggleActions.includes(t.type) &&
                e.insertAdjacentHTML(
                  'beforeend',
                  '<input type="checkbox" class="fpd-switch" />'
                ),
              this.uncollapsedMenu.append(e)
            const i = e.cloneNode(!0)
            this.collapsedMenu.querySelector('.fpd-dropdown-menu').append(i),
              G([e, i], 'click', t.handler)
          }),
          this.toggleMenus()
      }
      function Be () {
        this.isConnected &&
          this.uncollapsedMenu &&
          ((this.uncollapsedMenu.innerHTML = ''),
          (this.collapsedMenu.querySelector('.fpd-dropdown-menu').innerHTML =
            ''))
      }
      customElements.define('fpd-actions-menu', De)
      class Fe extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div class="fpd-navigation fpd-scrollbar-hidden bg-white"></div> <div class="fpd-module-content bg-[#fff]"></div> <div class="fpd-secondary-content"> <div class="fpd-upload-zone-panel"> <div class="fpd-upload-zone-content"></div> <div class="fpd-bottom-nav fpd-module-tabs"> <div class="fpd-add-image" data-module="images"> <span class="fpd-icon-photo"></span> </div> <div class="fpd-add-text" data-module="text"> <span class="fpd-icon-text-secondary"></span> </div> <div class="fpd-add-design" data-module="designs"> <span class="fpd-icon-design-library"></span> </div> </div> </div> </div> <div class="fpd-close"> <span class="fa-solid fa-close"></span> </div> <div class="fpd-draggable-dialog fpd-container fpd-shadow-2"> <div class="fpd-dialog-head"> <div class="fpd-dialog-drag-handle"> <div> <span class="fpd-icon-drag"></span><span class="fpd-dialog-title"></span> </div> </div> <div class="fpd-close-dialog"> <span class="fa-solid fa-close"></span> </div> </div> </div> '
        }
      }
      class Fet extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div class="fpd-navigation fpd-scrollbar-hidden bg-white z-[9]"></div> <div class="fpd-module-content bg-[#000]"></div> <div class="fpd-secondary-content"> <div class="fpd-upload-zone-panel"> <div class="fpd-upload-zone-content"></div> <div class="fpd-bottom-nav fpd-module-tabs"> <div class="fpd-add-image" data-module="images"> <span class="fpd-icon-photo"></span> </div> <div class="fpd-add-text" data-module="text"> <span class="fpd-icon-text-secondary"></span> </div> <div class="fpd-add-design" data-module="designsnew"> <span class="fpd-icon-design-library"></span> </div> </div> </div> </div> <div class="fpd-close"> <span class="fa-solid fa-close"></span> </div> <div class="fpd-draggable-dialog fpd-container fpd-shadow-2"> <div class="fpd-dialog-head"> <div class="fpd-dialog-drag-handle"> <div> <span class="fpd-icon-drag"></span><span class="fpd-dialog-title"></span> </div> </div> <div class="fpd-close-dialog"> <span class="fa-solid fa-close"></span> </div> </div> </div> '
        }
      }
      customElements.define('fpd-main-bar', Fet)
      // customElements.define("fpd-main-bar-dup", Fet);
      ;
      class je extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          ;
          this.innerHTML =
            '<div data-moduleicon="book-copy" data-defaulttext="Products" data-title="Design"><div class="fpd-head"> <div class="fpd-input-back-search input-search-box !shadow-none border border-[#35475a33] border-solid !rounded-[8px] ml-[5px] w-[calc(100% - 22px)]"> <div class="fpd-back fpd-btn !bg-white"> <svg xmlns="http://www.w3.org/2000/svg" class="min-w-[24px] text-black relative top-[-2px]" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg> </div> <div class="fpd-input-search"> <input type="text" class="!text-sm placeholder-gray-500 !pl-2" placeholder="Search" id="searchInput" /> <span class="fpd-icon-magnify"></span> </div> </div> </div><div class="icon-box"><i data-lucide="house"></i></div> <fpd-dropdown class="fpd-product-categories rounded-[8px] border border-[#35475a33] border-solid mt-[8px] bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] md:p-2 mr-[14px] pl-[6px] ml-[5px] w-[calc(100% - 22px)] mb-[5px]" searchable></fpd-dropdown> <div class="fpd-scroll-area"><div class="flex gap-2 ml-[5px] transition-transform duration-300 ease-in-out mb-2" id="data-info"></div> <div class="fpd-grid fpd-grid-contain fpd-padding one-tt ProductModule" id="ProductModule"><div class="searchox bg-white rounded-lg relative flex"><div id="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg></div><div><input type="text" class="appearance-none bg-inherit border-0 box-border text-inherit font-normal min-w-[8px] outline-none w-full" /></div></div> </div> <div id="ProductModule" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div><button id="backbuttonStoP" class="w-[30px] h-[30px] rounded-full p-[2px]"  style="display:none"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-[#0d1216] hover:text-blue-600 transition duration-200 cursor-pointer"><path d="M6.9 10.996h11.596a.75.75 0 0 1 0 1.5H6.9l4.377 4.377a.75.75 0 0 1-1.061 1.06l-4.95-4.95a1.75 1.75 0 0 1 0-2.474l4.95-4.95a.75.75 0 1 1 1.06 1.06L6.9 10.996z" fill="currentColor"></path></svg></button><div id="ProductModule" class="fpd-grid fpd-grid-contain fpd-padding one-tt skins-data ProductModuleMy"></div></div> </div>'
        }
      }
      // ===================================================================
      // ===== CUSTOM (StyleFlip): "Design" tab products module ============
      // A parallel copy of the vendor's products module (fpd-module-products
      // / je above), registered as fpd-module-productsnew and driving the
      // "Design" sidebar tab separately from the main Products tab. See
      // Wes below for the panel logic (this.fpdInstance.productsnew).
      // ===================================================================
      class jaikant extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          ;
          this.innerHTML =
            '<div data-moduleicon="layout-panel-left" data-defaulttext="Designs" data-title="Productsnew"><div class=""> <div class="fpd-head flex items-center"><div id="fpd-reset-button" style="display:none;"><button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-[#0d1216] hover:text-blue-600 transition duration-200 cursor-pointer"><path d="M6.9 10.996h11.596a.75.75 0 0 1 0 1.5H6.9l4.377 4.377a.75.75 0 0 1-1.061 1.06l-4.95-4.95a1.75 1.75 0 0 1 0-2.474l4.95-4.95a.75.75 0 1 1 1.06 1.06L6.9 10.996z" fill="currentColor"></path></svg></button></div> <div id="searchbox-design" class="fpd-input-back-search input-search-box !shadow-none border border-[#35475a33] border-solid !rounded-[8px] ml-[5px] w-[calc(100% - 22px)]"><div class="fpd-back fpd-btn !bg-white"> <svg xmlns="http://www.w3.org/2000/svg" class="min-w-[24px] text-black relative top-[-2px]" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg> </div> <div class="fpd-input-search"> <input type="text" id="searchInputs" class="!text-sm placeholder-gray-500 !pl-2" placeholder="Search" /> <span class="fpd-icon-magnify"></span> </div> </div></div> </div><div class="icon-box"><i data-lucide="house"></i></div> <fpd-dropdown class="fpd-product-categories rounded-[8px] border border-[#35475a33] border-solid mt-[8px] bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] md:p-2 mr-[14px] pl-[6px] ml-[5px] w-[calc(100% - 22px)] mb-[5px]" searchable></fpd-dropdown> <div class="fpd-scroll-area"> <div class="w-full overflow-auto [scrollbar-width:none] scrollbar-hide"><div class="flex gap-2 mt-2 ml-[5px] fixed opacity-0"><div class="border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 rounded-[6px] text-sm text-[#0d1216] cursor-pointer hover:bg-[#40576d12] flex-none">Foods</div><div class="border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none">Collage</div><div class="border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none">Business</div><div class="border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none">Festival</div><div class="border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none">Heart</div></div></div><div class="fpd-grid fpd-grid-contain fpd-padding one-ttt mt-[50px]" id="DesignModule"><div class="searchox bg-white rounded-lg relative flex"><div id="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg></div><div><input type="text" class="appearance-none bg-inherit border-0 box-border text-inherit font-normal min-w-[8px] outline-none w-full" /></div></div> </div> </div> </div>'
        }
      }
      function Re (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function Ne (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      customElements.define('fpd-module-products', je)
      customElements.define('fpd-module-productsnew', jaikant)

      var He = new WeakSet(),
        ze = new WeakSet()
      class We extends EventTarget {
        constructor (t, e) {
          var i, n, s
          super(),
            Re(this, ze),
            Re(this, He),
            (i = this),
            (s = 0),
            (n = (function (t) {
              ;
              var e = (function (t, e) {
                ;
                if ('object' != typeof t || null === t) return t
                var i = t[Symbol.toPrimitive]
                ;
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
            })((n = 'currentCategoryIndex'))) in i
              ? Object.defineProperty(i, n, {
                  value: s,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
                })
              : (i[n] = s),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-module-products')),
            e.append(this.container),
            t.addEventListener('productsSet', t => {
              const e = this.container.querySelector(
                '.fpd-dropdown-list > .fpd-scroll-area'
              )
              ;(e.innerHTML = ''),
                this.fpdInstance.products &&
                  this.fpdInstance.products.length > 0 &&
                  (void 0 !== this.fpdInstance.products[0].category &&
                    this.fpdInstance.products.length > 1 &&
                    (this.container.classList.add('fpd-categories-enabled'),
                    this.fpdInstance.products.forEach((t, i) => {
                      const n = document.createElement('span')
                      ;(n.className = 'fpd-item'),
                        (n.dataset.index = i),
                        (n.innerText = t.category),
                        n.addEventListener('click', t => {
                          localStorage.setItem('valueofTitle', '')
                          ;
                          const elementMyData =
                            document.querySelector('.ProductModule') // Replace with your actual ID
                          ;
                          if (elementMyData) {
                            if (elementMyData.style.display === 'none') {
                              elementMyData.style.display = 'grid' // or
                            }
                          }

                          const elementMyDataMy =
                            document.querySelector('.ProductModuleMy') // Replace with your actual ID
                          ;
                          const backbuttonStoP =
                            document.getElementById('backbuttonStoP')
                          const valueoffpdmoduleproducts =
                            document.querySelector('fpd-module-products')
                          backbuttonStoP.addEventListener('click', t => {
                            valueoffpdmoduleproducts.classList.removeremove(
                              'valueoffpdmoduleproducts-active'
                            )
                            backbuttonStoP.style.display = 'none'
                            elementMyDataMy.style.display = 'none' // or
                            elementMyData.style.display = 'grid'
                            elementMyDataMy.innerHTML = ''
                          })
                          if (elementMyDataMy) {
                            elementMyDataMy.style.display = 'none' // or
                            backbuttonStoP.style.display = 'none'
                            valueoffpdmoduleproducts.classList.remove(
                              'valueoffpdmoduleproducts-active'
                            )
                            elementMyDataMy.innerHTML = ''
                            ;
                          }

                          localStorage.setItem(
                            'fpd-grouped-categories-number',
                            t.currentTarget.dataset.index
                          )
                          var input = document.getElementById('searchInput')
                          ;
                          if (input) {
                            input.value = ''
                            ;
                          }
                          this.selectCategory(t.currentTarget.dataset.index)
                          ;
                          localStorage.setItem('valueofTitleActiveDatais', t.currentTarget.innerText)
                        }),
                        e.append(n)
                    })),
                  Ne(this, He, Ve).call(this),
                  this.selectCategory(0))
            }),
            t.addEventListener('productAdd', (t, e, i, n) => {
              n == this.currentCategoryIndex && Ne(this, ze, Ue).call(this, e)
            })
        }
        removeAddBack () {
          ;
          // alert('Check')
        }
      selectCategory () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
          if (
            ((this.currentCategoryIndex = t),
            (this.container.querySelector('.fpd-grid').innerHTML = ''),
            this.fpdInstance.products && this.fpdInstance.products.length > 0)
          ) {
            // ✅ FIX 1: Category switch hone par scroll top pe reset karo
            const scrollArea = this.container.querySelector('.fpd-scroll-area')
            if (scrollArea) scrollArea.scrollTop = 0

            ;
            let e
            void 0 !== this.fpdInstance.products[0].category
              ? ((e = this.fpdInstance.products[t].products),
                (this.container.querySelector('.fpd-dropdown-current').value =
                  this.fpdInstance.products[t].category))
              : (e = this.fpdInstance.products),
              e.forEach((t, e) => {
                Ne(this, ze, Ue).call(this, t, e)
              })
          }
        }
      }
      // New Function Call
      class Wes extends EventTarget {
        constructor (t, e) {
          var i, n, s
          super(),
            Re(this, ze),
            Re(this, He),
            (i = this),
            (s = 0),
            (n = (function (t) {
              ;
              var e = (function (t, e) {
                ;
                if ('object' != typeof t || null === t) return t
                var i = t[Symbol.toPrimitive]
                ;
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
            })((n = 'currentCategoryIndex'))) in i
              ? Object.defineProperty(i, n, {
                  value: s,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
                })
              : (i[n] = s),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-module-productsnew')),
            e.append(this.container),
            t.addEventListener('productsSet', t => {
              const e = this.container.querySelector(
                '.fpd-dropdown-list > .fpd-scroll-area'
              )
              ;(e.innerHTML = ''),
                this.fpdInstance.productsnew &&
                  this.fpdInstance.productsnew.length > 0 &&
                  (void 0 !== this.fpdInstance.productsnew[0].category &&
                    this.fpdInstance.productsnew.length > 1 &&
                    (this.container.classList.add('fpd-categories-enabled'),
                    this.fpdInstance.productsnew.forEach((t, i) => {
                      ;
                      const n = document.createElement('span')
                      ;(n.className = 'fpd-item'),
                        (n.dataset.index = i),
                        (n.innerText = t.category),
                        n.addEventListener('click', t => {
                          this.selectCategory(t.currentTarget.dataset.index)
                        }),
                        e.append(n)
                    })),
                  Ne(this, He, Ve).call(this),
                  this.selectCategory(0))
            }),
            t.addEventListener('productAddNew', (t, e, i, n) => {
              n == this.currentCategoryIndex && Ne(this, ze, Ue).call(this, e)
            })
        }

      selectCategory () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
          ;
          if (
            ((this.currentCategoryIndex = t),
            (this.container.querySelector('.fpd-grid').innerHTML = ''),
            this.fpdInstance.productsnew &&
              this.fpdInstance.productsnew.length > 0)
          ) {
            // ✅ FIX 1: Category switch hone par scroll top pe reset karo
            const scrollArea = this.container.querySelector('.fpd-scroll-area')
            if (scrollArea) scrollArea.scrollTop = 0

            ;
            let e
            void 0 !== this.fpdInstance.productsnew[0].category
              ? ((e = this.fpdInstance.productsnew[t].products),
                (this.container.querySelector('.fpd-dropdown-current').value =
                  this.fpdInstance.productsnew[t].category))
              : (e = this.fpdInstance.productsnew),
              e.forEach((t, e) => {
                Ne(this, ze, Ue).call(this, t, e)
              })
          }
        }
      }
      // End New Function Call
      function Ve () {
        if (this.fpdInstance.mainOptions.editorMode) return
        let t = this.fpdInstance.products[0],
          e = void 0 === t
        void 0 !== t &&
          (e = !!(
            (!t.hasOwnProperty('category') &&
              this.fpdInstance.products.length < 2) ||
            (t.hasOwnProperty('category') &&
              t.products.length < 2 &&
              this.fpdInstance.products.length < 2)
          )),
          this.fpdInstance.container.classList.toggle(
            'fpd-products-module-hidden',
            e
          )
        const i = this.fpdInstance.mainBar.navElem.querySelector('.fpd-active')
        e &&
          i &&
          'products' == i.dataset.module &&
          i.nextSibling &&
          i.nextSibling.click()
      }
      function Ue (e, i) {
        ;
        localStorage.setItem('UE', false)
        localStorage.setItem('rdatasetindex', 0)
        let typecheck = localStorage.getItem('callModuleItem')
        ;

        if (typecheck === 'products') {
          const savedSubcategories = JSON.parse(
            localStorage.getItem('fpd-grouped-categories') || '[]'
          )
          const fpdgroupedcategoriesnumber =
            localStorage.getItem('fpd-grouped-categories-number') || '0'
          const dataInfoElement = document.getElementById('data-info')
          ;
          const selectedIndex = fpdgroupedcategoriesnumber
          if (dataInfoElement && savedSubcategories[selectedIndex]) {
            const subcategoriesString =
              savedSubcategories[selectedIndex].subcategory

            if (subcategoriesString.trim() !== '') {
              const subcategories = subcategoriesString
                .split(',')
                .map(s => s.trim())

              // Setup slide structure
              let currentOffset = 0

              const wrapper = document.createElement('div')
              wrapper.className = 'relative w-full mt-2 fpd-designs-tags'

              const container = document.createElement('div')
              container.className = 'w-full mt-2 overflow-hidden our-elements'

              const flexWrapper = document.createElement('div')
              flexWrapper.className =
                'flex gap-2 ml-[5px] transition-transform duration-300 ease-in-out'
              flexWrapper.style.transform = `translateX(${currentOffset}px)`
              const realPillEls = []

              subcategories.forEach(sub => {
                const div = document.createElement('div')
                div.className =
                  'capitalize border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none whitespace-nowrap my-class-buttons-sub'
                div.textContent = sub
                flexWrapper.appendChild(div)
                realPillEls.push(div)
                div.addEventListener('click', event => {
                  const allSubcategoryButtons = document.querySelectorAll('.my-class-buttons-sub'); // change this to the correct class for all buttons
                  allSubcategoryButtons.forEach(btn => btn.classList.remove('active'));

                  div.classList.add('active');
                  // alert(`You clicked on: ${sub}`)
                  ;
                  // const filteredData = e.filter(item => item.subcategorytype === sub);

                  const productContainer = document.getElementById('ProductModule')
                  ;

                  if (productContainer) {
                    const items = productContainer.querySelectorAll('.fpd-item')
                    ;
                    items.forEach(item => {
                      // Always reset visibility
                      item.style.display = 'block'
                      ;
                      const subcategoryType =
                        item.getAttribute('data-subcategorytype') || ''
                      ;
                      // Hide if it doesn't match
                      if (subcategoryType !== sub) {
                        ;
                        item.style.display = 'none'
                      } else {
                        ;
                        item.style.display = 'flex'
                      }
                    })
                  }
                })
              })

              // Infinite swipe loop (mobile only - matches the
              // overflow-x:auto/arrow-hiding CSS on
              // fpd-module-products .fpd-designs-tags .our-elements in
              // styles.scss). Clone the pill set once before and once
              // after the real one so swiping past either end lands in a
              // matching clone, then silently snap scrollLeft back into
              // the real (middle) set once the user scrolls into a clone
              // zone. cloneNode(true) doesn't carry over the click
              // listener above, so each clone re-dispatches a real click
              // on its corresponding original pill instead of
              // re-implementing the filter logic a second time.
              if (window.innerWidth <= 768 && realPillEls.length > 1) {
                const makeClones = () =>
                  realPillEls.map(el => {
                    const clone = el.cloneNode(true)
                    clone.addEventListener('click', () => {
                      el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                    })
                    return clone
                  })

                makeClones()
                  .reverse()
                  .forEach(clone =>
                    flexWrapper.insertBefore(clone, flexWrapper.firstChild)
                  )
                makeClones().forEach(clone => flexWrapper.appendChild(clone))

                setTimeout(() => {
                  const realSetWidth = realPillEls.reduce(
                    (sum, el) => sum + el.offsetWidth + 8,
                    0
                  )
                  container.scrollLeft = realSetWidth

                  container.addEventListener('scroll', () => {
                    if (container.scrollLeft <= 4) {
                      container.scrollLeft += realSetWidth
                    } else if (
                      container.scrollLeft >=
                      realSetWidth * 2 - container.offsetWidth - 4
                    ) {
                      container.scrollLeft -= realSetWidth
                    }
                  })
                }, 100)
              }

              container.appendChild(flexWrapper)

              const leftArrow = document.createElement('button')
              leftArrow.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="m14.8 16.382-4.205-4.205a.25.25 0 0 1 0-.354L14.8 7.618a.75.75 0 0 0-1.06-1.06l-4.206 4.204a1.75 1.75 0 0 0 0 2.475l4.206 4.205a.75.75 0 0 0 1.06-1.06"></path></svg>
                            `
              leftArrow.className =
                'absolute left-0 top-[15px] -translate-y-1/2 z-[9] bg-gradient-to-r from-white/0 to-white shadow p-1 rounded-full hover:bg-gray-100 my-bitt'
              leftArrow.disabled = true

              const rightArrow = document.createElement('button')
              rightArrow.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="currentColor" d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"></path></svg>
                            `
              rightArrow.className =
                'absolute right-0 top-[15px] -translate-y-1/2 z-[9] bg-gradient-to-r from-white/0 to-white shadow p-1 rounded-full hover:bg-gray-100'

              function updateArrows () {
                const wrapperWidth = container.offsetWidth
                const contentWidth = flexWrapper.scrollWidth

                if (currentOffset > 0) currentOffset = 0
                if (Math.abs(currentOffset) >= contentWidth - wrapperWidth) {
                  currentOffset = -1 * (contentWidth - wrapperWidth)
                }

                flexWrapper.style.transform = `translateX(${currentOffset}px)`

                leftArrow.disabled = currentOffset === 0
                rightArrow.disabled =
                  Math.abs(currentOffset) >= contentWidth - wrapperWidth - 1
              }

              leftArrow.onclick = () => {
                const tag = flexWrapper.querySelector('div')
                ;
                if (tag) {
                  const scrollAmount = tag.offsetWidth * 2 + 16
                  currentOffset += scrollAmount
                  updateArrows()
                }
              }

              rightArrow.onclick = () => {
                const tag = flexWrapper.querySelector('div')
                ;
                if (tag) {
                  const scrollAmount = tag.offsetWidth * 2 + 16
                  currentOffset -= scrollAmount
                  updateArrows()
                }
              }

              // Clear and inject elements
              dataInfoElement.innerHTML = ''
              wrapper.appendChild(container)
              wrapper.appendChild(leftArrow)
              wrapper.appendChild(rightArrow)
              dataInfoElement.appendChild(wrapper)

              // Initial check
              setTimeout(updateArrows, 100) // Delay ensures widths are calculated
            } else {
              const div = document.createElement('div')
              div.textContent = ''
              div.className = 'text-sm text-gray-500'
              dataInfoElement.innerHTML = ''
              dataInfoElement.appendChild(div)
            }
          }
        }

        ;
        ;
        ;
        localStorage.setItem('definet', t)
        let n = e[0].productThumbnail ? e[0].productThumbnail : e[0].thumbnail,
          s = e[0].productTitle ? e[0].productTitle : e[0].title,
          th = e[0].manufacturer ? e[0].manufacturer : 'Styleflip',
          sct = e[0].subcategorytype ? e[0].subcategorytype : 'General',
          tags = e[0].tags || ''

        const r = document.createElement('div')
        r.className = 'fpd-item fpd-hover-thumbnail text mt-1 bg-[#f6f6f6]'
        r.dataset.title = s
        r.dataset.source = n
        r.dataset.index = i
        r.dataset.manufacturer = th // Add manufacturer data attribute
        r.dataset.subcategorytype = sct
        if (Array.isArray(tags)) {
          r.dataset.tags = tags.join(', ')
        } else {
          r.dataset.tags = tags
        }

        // ========== Append Thumbnail Image ==========
        const a = document.createElement('picture')
        a.className = 'flex'
        a.dataset.img = n
        r.append(a)
        this.fpdInstance.lazyBackgroundObserver.observe(a)

        // ========== Append Manufacturer Name ==========
        const manufacturer = document.createElement('div')
        manufacturer.className =
          'fpd-label text-center mt-2 text-xs font-bold text-gray-900 truncate max-w-[130px] overflow-hidden whitespace-nowrap h-[30px] mb-0'
        manufacturer.title = th
        manufacturer.textContent = th
        r.append(manufacturer)

        // ========== Append Product Name Label ==========
        const label = document.createElement('div')
        label.className =
          'fpd-label text-center mt-0 text-xs text-gray-700 truncate max-w-[130px] overflow-hidden whitespace-nowrap mb-2 h-[30px]'
        label.title = s
        label.textContent = s
        r.append(label)

        // ========== Append Dot Menu ==========
        const dotMenu = document.createElement('div')
        dotMenu.className = 'fpd-dot-menu'
        dotMenu.innerHTML = '&#x22EF;' // horizontal ellipsis (⋯)
        r.appendChild(dotMenu)

        // ========== Append Popup ==========
        const popup = document.createElement('div')
        popup.className = 'fpd-popup'
        popup.innerHTML = `
                    <div class="content-section bg-white border border-[#ccc] rounded-[6px] p-[10px] shadow-custom-light">
                    <div class="mb-2">Manufacturer: <strong>${th}</strong></div>
                    <strong class="text-[1rem]">${s}</strong>
                    <div class="flex items-center mt-2 mb-2">
                        <div><h4>StyleFlip</h4></div>
                        <div class="h-[24px] ml-[10px]"></div>     
                    </div>
                    <hr class="border-[1px] border-t border-solid border-gray-300 my-4" />
                    <div class="hidden items-center my-2 gap-[10px] flex-wrap happt1">
                        <div class="border border-solid border-[#ccc] px-[7px] py-[3px] bg-[#0d121600] rounded-[8px] shadow-[inset_0_0_0_1px_var(--Zya5eQ)] text-[#0d1216] capitalize">design</div>
                        <div class="border border-solid border-[#ccc] px-[7px] py-[3px] bg-[#0d121600] rounded-[8px] shadow-[inset_0_0_0_1px_var(--Zya5eQ)] text-[#0d1216] capitalize">button</div>
                        <div class="border border-solid border-[#ccc] px-[7px] py-[3px] bg-[#0d121600] rounded-[8px] shadow-[inset_0_0_0_1px_var(--Zya5eQ)] text-[#0d1216] capitalize">banner</div>
                        <div class="border border-solid border-[#ccc] px-[7px] py-[3px] bg-[#0d121600] rounded-[8px] shadow-[inset_0_0_0_1px_var(--Zya5eQ)] text-[#0d1216] capitalize">sign</div>
                        <div class="border border-solid border-[#ccc] px-[7px] py-[3px] bg-[#0d121600] rounded-[8px] shadow-[inset_0_0_0_1px_var(--Zya5eQ)] text-[#0d1216] capitalize">graphic</div>
                    </div>
                    
                    </div>
                `
        r.appendChild(popup)

        // Toggle popup on dot click
        dotMenu.addEventListener('click', event => {
          ;
          const parent = event.currentTarget.closest('.fpd-active')
          ;
          event.stopPropagation()
          localStorage.setItem('fpdMenuClicked', 'true')
          popup.classList.toggle('visible')
          if (parent) {
            parent.classList.toggle('backdrop-test')
          }
        })

        // Hide popup on click outside
        document.addEventListener('click', event => {
          popup.classList.remove('visible')
          document.querySelectorAll('.backdrop-test').forEach(el => {
            el.classList.remove('backdrop-test')
          })
        })

        // ========== Main Click Logic ==========
        r.addEventListener('click', e => {
          // Real user tap (not a synthetic .click() from the page-load restore
          // sequence below) - flags that the user has taken over navigation so
          // the delayed restore steps back off instead of hijacking the view.
          if (e.isTrusted) window.__fpdUserInteracted = true
          // 'valueofTitle' remembers which face the user picked last, so that
          // reopening the same product can jump straight back to it. But it
          // must not leak into a *different* product tile click, otherwise
          // that product skips its own face listing and tries to match a
          // face with the previous product's face title (see the
          // valueofTitle lookup further down) - showing whatever face
          // happens to share that title (e.g. a generic "Overlay" face)
          // instead of this product's face listing.
          localStorage.setItem('valueofTitle', '');
          localStorage.setItem('clickedTitleProdcutInside', '');
          ;
          ;
          // This handler is shared by both the Products tab (We, container
          // <fpd-module-products>) and the Design tab (Wes, container
          // <fpd-module-productsnew>) - selectProduct() below picks between
          // this.products and this.productsnew based on this value, so it
          // must reflect whichever grid was actually tapped. It used to be
          // derived from e.target.closest('div').parentElement.id, but most
          // of a tile's visible area (thumbnail/title/manufacturer) are
          // child <div>s with no id, so a tap there resolved to '' - hence
          // deriving it from this.container's tag name instead, which is
          // stable regardless of where inside the tile the user tapped.
          const parentDivId =
            this.container.tagName.toLowerCase() === 'fpd-module-productsnew'
              ? 'DesignModule'
              : 'ProductModule'
          const clickedTitle = e.currentTarget.dataset.title;
          localStorage.setItem('clickedTitleProdcutInside', clickedTitle);
          localStorage.setItem('parentDivId', parentDivId)

          ;

          const elementMyData = document.querySelector('.ProductModule') // Replace with your actual ID
          const backbuttonStoP = document.getElementById('backbuttonStoP')
          const elementMyDataMy = document.querySelector('.ProductModuleMy')
          const valueoffpdmoduleproducts = document.querySelector(
            'fpd-module-products'
          )
          ;
          if (elementMyData) {
            if (elementMyData.style.display === 'none') {
              elementMyData.style.display = 'grid' // or "block" depending on your layout
            } else if (elementMyDataMy && elementMyDataMy.querySelector('.fpd-item')) {
              // Only drill down into the sub-grid when it already has real
              // content (a genuine category drill-down). Previously this ran
              // unconditionally on every plain product click too, hiding the
              // whole visible flat products grid and revealing an empty
              // sub-grid synchronously, right before the replace-confirmation
              // popup opened - that's what looked like the list "reloading".
              ;
              elementMyData.style.display = 'none'
              elementMyDataMy.style.display = 'grid' // or "block" depending on your layout
              backbuttonStoP.style.display = 'block'
              valueoffpdmoduleproducts.classList.add(
                'valueoffpdmoduleproducts-active'
              )
            }
          }
          backbuttonStoP.addEventListener('click', t => {
            backbuttonStoP.style.display = 'none'
            valueoffpdmoduleproducts.classList.remove(
              'valueoffpdmoduleproducts-active'
            )
            elementMyDataMy.style.display = 'none' // or "block" depending on your layout
            elementMyData.style.display = 'grid'
            elementMyDataMy.innerHTML = ''
          })

          // Client point 2: picking a Product in the Products tab only opens
          // its Skin list (selectProduct with UE=true lists the faces, it
          // does not touch the canvas), so it must not ask "Are you sure to
          // replace the product?". That confirmation now runs when a Skin is
          // picked (see the .skins-det click handler in part 6/6). This is
          // exactly the old "YES, PLEASE!" action, just without the popup.
          // Design-tab tiles load straight onto the canvas, so they keep
          // their confirmation below unchanged.
          if (parentDivId === 'ProductModule') {
            e.preventDefault()
            localStorage.setItem('UE', true)
            this.fpdInstance.selectProduct(
              Number(e.currentTarget.dataset.index),
              this.currentCategoryIndex
            )
            return
          }

          if (
            (e.preventDefault(),
            this.fpdInstance.mainOptions.swapProductConfirmation)
          ) {
            var n = t(
              this.fpdInstance.translator.getTranslation(
                'modules',
                'products_confirm_replacement'
              ),
              !1,
              'confirm',
              this.fpdInstance.container
            )
            const eBtn = n.querySelector('.fpd-confirm')
            eBtn.innerText = this.fpdInstance.translator.getTranslation(
              'modules',
              'products_confirm_button'
            )

            G(eBtn, ['click'], () => {
              if (eBtn.disabled) return
              eBtn.disabled = true
              ;
              ;
              this.fpdInstance.selectProduct(i, this.currentCategoryIndex)
              n.remove()
            })
          } else {
            ;
            const modal = t(
              this.fpdInstance.translator.getTranslation(
                'modules',
                'products_confirm_replacement'
              ),
              false,
              'confirm',
              this.fpdInstance.container
            )
            const confirmBtn = modal.querySelector('.fpd-confirm')
            confirmBtn.innerText = this.fpdInstance.translator.getTranslation(
              'modules',
              'products_confirm_button'
            )

            const target = e.currentTarget
            G(confirmBtn, ['click'], () => {
              if (confirmBtn.disabled) return
              confirmBtn.disabled = true
              modal.remove()
              ;
              localStorage.setItem('UE', true)
              ;
              this.fpdInstance.selectProduct(
                Number(target.dataset.index),
                this.currentCategoryIndex
              )
            })
          }
        })

        // ========== Append to Grid ==========
        this.container.querySelector('.fpd-grid').append(r)
      }
      window.FPDProductsModule = We
      window.FPDProductsModuleNew = Wes
      // ===== END CUSTOM (StyleFlip: "Design" tab products module) ========
      class Ye extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div data-moduleicon="type-outline" class="relative p-[10px]" data-defaulttext="Add Text" data-title="modules.text"> <div class="fpd-head" style="opacity:0"> <div class="fpd-input-back-search input-search-box !shadow-none border border-[#35475a33] border-solid !rounded-[8px] ml-[5px] w-[calc(100% - 22px)]"> <div class="fpd-back fpd-btn !bg-white"> <svg xmlns="http://www.w3.org/2000/svg" class="min-w-[24px] text-black relative top-[-2px]" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg> </div> <div class="fpd-input-search"> <input type="text" class="!text-sm placeholder-gray-500 !pl-2" placeholder="Search" /> <span class="fpd-icon-magnify"></span> </div> </div> </div><div class="fpd-add-text"> <textarea class="!bg-white hidden" data-defaulttext="Enter some text" placeholder="modules.text_input_placeholder"></textarea> <div class="fpd-btn-add-text fpd-btn !bg-[var(--theme-color)] w-[100%] text-center !text-sm !normal-case justify-center !mt-0"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99 5.5A1.5 1.5 0 0 1 6.49 4h11a1.5 1.5 0 0 1 1.5 1.5v1.85a.75.75 0 0 1-1.5 0V6a.5.5 0 0 0-.502-.5l-4.24.008.01 11.992a1 1 0 0 0 1 1h1.407a.75.75 0 0 1 0 1.5H8.852a.75.75 0 0 1 0-1.5h1.406a1 1 0 0 0 1-1l-.01-11.992-4.258-.007a.5.5 0 0 0-.5.5v1.377a.75.75 0 1 1-1.5 0V5.5Z" fill="currentColor"></path></svg><span class="ml-[5px]" data-defaulttext="Add Text">Add Text</span> <span class="fpd-price"></span> </div> </div> <div class="fpd-text-templates fpd-container fpd-scroll-area"> <div id="text-templates" class="fpd-grid fpd-grid-contain" #savedGrid></div><div class="fpd-grid fpd-padding"></div> </div> </div>'
        }
      }

      customElements.define('fpd-module-text', Ye)
      class Ge extends EventTarget {
        constructor (t, e) {
          if (
            (super(),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-module-text')),
            e.append(this.container),
            this.container
              .querySelector('.fpd-btn-add-text')
              .addEventListener('click', e => {
                const addTextBtn = e.currentTarget

                // Guard against double/rapid clicks: without this, an
                // unresponsive-looking button invites extra clicks, and
                // each one stacks another duplicate text object onto the
                // canvas, making every next render (and the next click)
                // progressively slower.
                if (addTextBtn.classList.contains('fpd-loading')) return

                let i = this.container.querySelector('textarea'),
                    n = i.value.trim()

                // If empty, use demo text
                if (!n) {
                  n = 'this is your demo'
                  i.value = n // Optional: show in the textarea too
                }

                // Clear the textarea right away for the next entry.
                i.value = ''

                if (!(t.currentViewInstance && n.length > 0)) return

                // Show the loading state and let the browser paint it
                // before doing the (synchronous) work below, otherwise the
                // spinner and the text addition happen in the same frame
                // and the button just looks frozen until it's done.
                addTextBtn.classList.add('fpd-loading')

                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    try {
                      const e = t.currentViewInstance.options;

                      let options = z(e.customTextParameters, {
                        textBox: Boolean(this.fpdInstance.mainOptions.customTextAsTextbox),
                        resizable: 1,
                        isCustom: 1,
                        curvable: 1,
                        _addToUZ: t.currentViewInstance.currentUploadZone,
                        _calcWidth: true,
                        colors: '#000',
                        fontFamily: 'Lobster',
                        fontSize: 50,
                        removable: true,
                        selectable: true,
                        editable: true,
                        hasControls: true,
                        evented: true,
                        transformable: true,
                        objectCaching: false,
                        // Position it ourselves below, right after the canvas so
                        // it lands at the bottom instead of dead-center.
                        autoCenter: false,
                      });

                      const canvas = t.currentViewInstance.fabricCanvas;
                      const element = canvas.addElement('text', n, n, options);

                      if (element) {
                        // Place the new text horizontally centered near the
                        // top of the stage instead of the canvas center.
                        const stageWidth = canvas.viewOptions.stageWidth
                        const topMargin = 100

                        element.setPositionByOrigin(
                          new St.fabric.Point(stageWidth / 2, topMargin),
                          'center',
                          'top'
                        )
                        element.setCoords()

                        canvas.setActiveObject(element)
                        if (typeof element.enterEditing === 'function') {
                          element.enterEditing() // force edit mode
                        }
                        canvas.renderAll()
                      }
                    } finally {
                      addTextBtn.classList.remove('fpd-loading')
                    }
                  })
                })
              }),
            G(
              this.container.querySelector('textarea'),
              ['input', 'change'],
              e => {
                const i = t.currentViewInstance.options
                let n = e.currentTarget.value,
                  s = i.customTextParameters.maxLength,
                  r = i.customTextParameters.maxLines
                ;(n = n.replace(FancyProductDesigner.forbiddenTextChars, '')),
                  t.mainOptions.disableTextEmojis &&
                    ((n = n.replace(FPDEmojisRegex, '')),
                    (n = n.replace(String.fromCharCode(65039), ''))),
                  0 != s && n.length > s && (n = n.substr(0, s)),
                  0 != r &&
                    n.split('\n').length > r &&
                    (n = n.replace(/([\s\S]*)\n/, '$1')),
                  (e.currentTarget.value = n)
              }
            ),
            G(t, ['viewSelect', 'secondaryModuleCalled'], e => {
              if (!t.currentViewInstance) return
              const i = t.currentViewInstance.options
              let n = null
              if (
                t.currentViewInstance.currentUploadZone &&
                this.container.parentNode.classList.contains(
                  'fpd-upload-zone-content'
                )
              ) {
                const e = t.currentViewInstance.fabricCanvas.getUploadZone(
                  t.currentViewInstance.currentUploadZone
                )
                W(e, 'price') && (n = e.price)
              }
              const s = W(i, 'customTextParameters.price', 0)
              null == n && s && (n = s)
              const r = this.container.querySelector('.fpd-btn > .fpd-price')
              r && (r.innerHTML = n ? ' - ' + t.formatPrice(n) : '')
            }),
            Array.isArray(t.mainOptions.textTemplates))
          ) {
            const savedContent = localStorage.getItem('savedContentText')
            const target = this.container.querySelector('#text-templates')

            if (savedContent && target) {
              const tempDiv = document.createElement('div')

              tempDiv.innerHTML = savedContent

              const categoryBlocks = tempDiv.querySelectorAll('.fpd-category')
              ;

              // ✅ Add this before `categoryBlocks.forEach(...)`
              const allTagsSet = new Set()

              // Gather all unique tags from all products
              document.querySelectorAll('.fpd-producttext').forEach(product => {
                ;
                const tags = product
                  .getAttribute('data-tags')
                  ?.split(',')
                  .map(tag => tag.trim())
                if (tags) tags.forEach(tag => allTagsSet.add(tag))
              })

              const searchWrappertext = document.createElement('div')
              searchWrappertext.className = 'flex items-center gap-0'

              //Search
              const filterContainerSearch = document.createElement('div')
              filterContainerSearch.className =
                'filter-controls mb-4 absolute top-0 left-0 ml-[15px] right-[11px] border border-[#35475a33] border-solid !rounded-[8px] mr-[10px]'

              const searchIcon = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
              )
              searchIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
              searchIcon.setAttribute('width', '24')
              searchIcon.setAttribute('height', '24')
              searchIcon.setAttribute('viewBox', '0 0 24 24')
              searchIcon.setAttribute(
                'class',
                'min-w-[24px] text-black relative top-[-2px] ml-[8px]'
              )

              const path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
              )
              path.setAttribute('fill', 'currentColor')
              path.setAttribute(
                'd',
                'M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z'
              )

              searchIcon.appendChild(path)

              const searchInput = document.createElement('input')
              searchInput.type = 'text'
              searchInput.placeholder = 'Search'
              searchInput.className =
                'border p-1 px-3 rounded !text-sm !mb-0 placeholder-gray-500'

              searchWrappertext.appendChild(searchIcon)
              searchWrappertext.appendChild(searchInput)

              filterContainerSearch.appendChild(searchWrappertext)

              // // Optional Reset Button
              const resetBtn = document.createElement('button')
              resetBtn.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="24" height="24" viewBox="0 0 24 24"
                                class="text-[#0d1216] hover:text-blue-600 transition duration-200 cursor-pointer">
                                <path d="M6.9 10.996h11.596a.75.75 0 0 1 0 1.5H6.9l4.377 4.377a.75.75 0 0 1-1.061 1.06l-4.95-4.95a1.75 1.75 0 0 1 0-2.474l4.95-4.95a.75.75 0 1 1 1.06 1.06L6.9 10.996z" 
                                    fill="currentColor">
                                </path>
                            </svg>
                            `
              resetBtn.className =
                'ml-2 px-2 py-1 bg-red-200 rounded text-sm hover:bg-red-300 hidden absolute top-[8px] left-0'
              resetBtn.addEventListener('click', () => {
                document
                  .querySelectorAll('.fpd-item.fpd-itemimg')
                  .forEach(el => {
                    el.style.display = 'block'
                  })
                document
                  .querySelectorAll('.fpd-tag-btn')
                  .forEach(btn => btn.classList.remove('!bg-[#40576d12]'))

                document.querySelectorAll('.box-contain-text').forEach(box => {
                  box.classList.remove('fpd-hidden')

                  const allItems = box.querySelectorAll('.fpd-item.fpd-itemimg')

                  allItems.forEach((item, index) => {
                    item.style.display = index < 3 ? 'block' : 'none' // Show first 3
                  })

                  // Optional: show the box only if it contains at least 1 visible item
                  const visibleItems = box.querySelectorAll(
                    '.fpd-item.fpd-itemimg:not([style*="display: none"])'
                  )
                  box.style.display = visibleItems.length > 0 ? 'flex' : 'none'
                })
                document
                  .querySelectorAll('.see-toggle-btn')
                  .forEach(boxbutton => {
                    boxbutton.classList.remove('fpd-hidden')
                    boxbutton.innerText = 'See All'
                  })
                resetBtn.classList.add('hidden')
                filterContainerSearch.style.width = ''
                filterContainerSearch.style.marginLeft = ''
              })


              // Insert arrows
              const leftArrow = document.createElement("button");
              leftArrow.className =
                "absolute left-0 z-[9] -translate-y-1/2 bg-gradient-to-l from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden top-1/2";
              leftArrow.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                  <path fill="currentColor" d="m14.784 16.381-4.204-4.204a.25.25 0 0 1 0-.354l4.204-4.204a.75.75 0 0 0-1.06-1.061l-4.205 4.204a1.75 1.75 0 0 0 0 2.475l4.204 4.205a.75.75 0 0 0 1.061-1.06"></path>
                </svg>
              `;

              const rightArrow = document.createElement("button");
              rightArrow.className =
                "absolute right-0 z-[9] -translate-y-1/2 bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden top-1/2";
              rightArrow.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                  <path fill="currentColor" d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"></path>
                </svg>
              `;
              const tagWrapperMain = document.createElement("div");
              tagWrapperMain.className = "relative top-[201px] flex items-center";
              // Create a tag filter UI
              const targetContainermain = document.createElement('div')
              targetContainermain.className =
                'w-full overflow-auto [scrollbar-width:none] scrollbar-hide'



              const tagContainerText = document.createElement('div')
              tagContainerText.className =
                'flex gap-2 mb-0 overflow-x-auto fpd-tag-filter flex-nowrap'

              allTagsSet.forEach(tag => {
                const tagButton = document.createElement('button')
                tagButton.className =
                  'fpd-tag-btn border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 rounded-[6px] text-sm text-[#0d1216] cursor-pointer hover:bg-[#40576d12] flex-none capitalize'
                tagButton.innerText = tag
                tagButton.setAttribute('data-tag', tag)

                tagButton.addEventListener('click', () => {
                  const selectedTag = tagButton.getAttribute('data-tag')

                  document
                    .querySelectorAll('.fpd-tag-btn')
                    .forEach(btn => btn.classList.remove('!bg-[#40576d12]'))
                  tagButton.classList.add('!bg-[#40576d12]')
                  ;
                  document
                    .querySelectorAll('.fpd-item.fpd-itemimg')
                    .forEach(productEl => {
                      ;
                      const tags = productEl.getAttribute('data-tags') || ''
                      productEl.style.display = tags.includes(selectedTag)
                        ? 'block'
                        : 'none'
                    })
                  document
                    .querySelectorAll('.box-contain-text')
                    .forEach(box => {
                      const visibleItems = box.querySelectorAll(
                        '.fpd-item.fpd-itemimg:not([style*="display: none"])'
                      )
                      box.style.display =
                        visibleItems.length > 0 ? 'flex' : 'none'
                    })

                  resetBtn.classList.remove('hidden')
                  filterContainerSearch.style.width = 'calc(100% - 60px)'
                  filterContainerSearch.style.marginLeft = '40px'
                })

                tagContainerText.appendChild(tagButton)
              })

              tagWrapperMain.appendChild(leftArrow)
              tagWrapperMain.appendChild(tagContainerText)
              tagWrapperMain.appendChild(rightArrow)
              
              targetContainermain.appendChild(resetBtn)
              let currentOffset = 0
              // Update arrow states
              function updateArrows () {
                const wrapperWidth = targetContainermain.offsetWidth
                const contentWidth = tagContainerText.scrollWidth
                ;
                ; 
                // Prevent scrolling beyond bounds
                if (currentOffset > 0) currentOffset = 0
                if (Math.abs(currentOffset) >= contentWidth - wrapperWidth) {
                  currentOffset = -1 * (contentWidth - wrapperWidth)
                }

                // Apply transform
                tagContainerText.style.transform = `translateX(${currentOffset}px)`

                // Enable or disable arrows
                leftArrow.disabled = currentOffset === 0
                rightArrow.disabled =
                  Math.abs(currentOffset) >= contentWidth - wrapperWidth - 1 // Allow 1px tolerance
              }

              // Scroll left
              leftArrow.onclick = () => {
                const tag = tagContainerText.querySelector('button')
                ;
                if (tag) {
                  const scrollAmount = tag.offsetWidth * 2 + 16
                  currentOffset += scrollAmount
                  updateArrows()
                }
              }

              // Scroll right
              rightArrow.onclick = () => {
                const tag = tagContainerText.querySelector('button')
                ;
                if (tag) {
                  const scrollAmount = tag.offsetWidth * 2 + 16
                  currentOffset -= scrollAmount
                  updateArrows()
                }
              }
              

              searchInput.addEventListener('input', () => {
                ;
                const query = searchInput.value.toLowerCase()
                document.querySelectorAll('.fpd-itemimg').forEach(el => {
                  const title =
                    el.getAttribute('data-title')?.toLowerCase() || ''
                  el.style.display = title.includes(query) ? 'block' : 'none'
                })
                document.querySelectorAll('.box-contain-text').forEach(box => {
                  const visibleItems = box.querySelectorAll(
                    '.fpd-item.fpd-itemimg:not([style*="display: none"])'
                  )
                  box.style.display = visibleItems.length > 0 ? 'flex' : 'none'
                })
              })

              // Append tag filter UI to top of your `target`
              targetContainermain.prepend(tagWrapperMain)
              // targetContainermain.prepend(tagContainerText)
              target.appendChild(filterContainerSearch)
              target.appendChild(targetContainermain)

              // ✅ Add this inside product creation loop for optional tag display under each product
              // const tagList = product.getAttribute('data-tags') || '';
              // if (tagList) {
              //     const tags = tagList.split(',').map(tag => tag.trim());
              //     const tagWrapperText = document.createElement('div');
              //     tagWrapperText.className = 'flex flex-wrap gap-1 mt-1 fpd-tags';

              //     tags.forEach(tag => {
              //         const tagLabel = document.createElement('span');
              //         tagLabel.className = 'inline-block px-1.5 py-0.5 text-xs bg-gray-100 rounded border';
              //         tagLabel.textContent = tag;
              //         tagWrapperText.appendChild(tagLabel);
              //     });

              //     newDiv.appendChild(tagWrapperText);
              // }

              categoryBlocks.forEach(categoryBlock => {
                const categoryName = categoryBlock.getAttribute('data-category') || 'Uncategorized';

                const categoryContainer = document.createElement('div');
                categoryContainer.className = 'relative box-contain-text';

                const categoryTitle = document.createElement('div');
                categoryTitle.className = 'mt-4 mb-2 font-semibold fpd-category-title text-md';
                categoryTitle.textContent = categoryName;

                categoryContainer.appendChild(categoryTitle);

                const products = categoryBlock.querySelectorAll('.fpd-product');

                products.forEach(product => {
                  const title = product.getAttribute('title') || 'Untitled';
                  const thumbnail = product.getAttribute('data-thumbnail') || '';
                  const tags = product.getAttribute('data-tags') || '';
                  const spans = product.querySelectorAll('span');

                  if (spans.length > 0) {
                    const newDiv = document.createElement('div');
                    newDiv.className = 'fpd-item fpd-itemimg group';
                    newDiv.setAttribute('data-title', title);
                    newDiv.setAttribute('data-type', 'text');
                    newDiv.setAttribute('data-thumbnail', thumbnail);
                    newDiv.setAttribute('data-tags', tags);

                    const picture = document.createElement('picture');
                    picture.setAttribute('data-img', title);
                    picture.style.backgroundImage = `url('${thumbnail}')`;
                    newDiv.appendChild(picture);

                    const dotBtn = document.createElement('button');
                    dotBtn.innerHTML = `⋯`;
                    dotBtn.className = 'fpd-dot-menu';
                    newDiv.appendChild(dotBtn);

                    const tagList = tags.split(',');
                    const tagContainer = document.createElement('div');
                    tagContainer.className = 'flex items-center my-2 gap-[10px] flex-wrap happy1';

                    const popup1 = document.createElement('div');
                    popup1.className = 'hidden fpd-popup'; // initially hidden

                    const popup = document.createElement('div');
                    popup.className = 'content-section bg-white border border-[#ccc] rounded-[6px] p-[10px] shadow-custom-light';
                    popup.innerHTML = `
                      <h2 class="text-[1rem] text-left font-bold">${title}</h2>
                      <h4 class="text-left mt-2 mb-2">StyleFlip</h4>
                    `;

                    tagList.forEach(tag => {
                      const tagEl = document.createElement('div');
                      tagEl.className =
                        'border border-solid border-[#ccc] px-[7px] py-[3px] bg-[#0d121600] rounded-[8px] shadow-[inset_0_0_0_1px_var(--Zya5eQ)] text-[#0d1216] capitalize';
                      tagEl.innerText = tag.trim();
                      tagContainer.appendChild(tagEl);
                    });

                    popup.appendChild(tagContainer);
                    popup1.appendChild(popup);
                    newDiv.appendChild(popup1);

                    dotBtn.addEventListener('click', e => {
                      e.stopPropagation();
                      e.preventDefault();
                      const parentActive = dotBtn.closest('.fpd-module-content');
                      ;
                      if (parentActive) {
                        parentActive.classList.add('backdrop-test');
                      }
                      // Toggle popup visibility
                      const isVisible = popup1.classList.contains('visible');

                      document.querySelectorAll('.fpd-popup.visible').forEach(p => {
                        p.classList.remove('visible');
                        p.classList.add('hidden');
                      });
                      
                      if (!isVisible) {
                        popup1.classList.remove('hidden');
                        popup1.classList.add('visible');
                      }

                      // Close on outside click
                      const closePopup = ev => {
                        if (!popup1.contains(ev.target) && ev.target !== dotBtn) {
                          popup1.classList.remove('visible');
                          popup1.classList.add('hidden');
                          document.removeEventListener('click', closePopup);
                        }
                      };
                      
                      setTimeout(() => {
                        document.addEventListener('click', closePopup);
                      }, 0); // Ensure popup1 is fully rendered before binding
                    });

                    // 🔁 Render span text items

                    spans.forEach(span => {
                      const spanTag = document.createElement('span');
                      spanTag.className = 'pankaj design1';
                      spanTag.innerText = span?.textContent || '';
                      newDiv.appendChild(spanTag);
                    });

                    newDiv.addEventListener('click', () => {
                        document.querySelector('.fpd-group-copy-by').classList.remove('fpd-hidden');
                        document.querySelector('.fpd-group-paste-by').classList.remove('fpd-hidden');
                        document.querySelector('.fpd-ungroup1')?.classList.remove('fpd-hidden')
                        document.querySelector('.fpd-ungroup')?.classList.add('fpd-hidden')
                        if (!t.currentViewInstance) return

                        const viewOptions = t.currentViewInstance.options
                        const innerSpans = newDiv.querySelectorAll('span')
                        const insertedTextObjects = []

                        const fabricCanvas =
                          t.currentViewInstance.fabricCanvas.canvas ||
                          t.currentViewInstance.fabricCanvas

                        innerSpans.forEach((innerSpan, index) => {
                          const textContent = innerSpan.textContent?.trim() || ''
                          const originalSpan = spans[index]
                          let parsedParams = {}

                          try {
                            const rawParams = originalSpan.getAttribute('data-parameters') || '{}'
                            parsedParams = JSON.parse(rawParams)
                          } catch (err) {
                            console.error('Invalid JSON in data-parameters', err)
                          }

                          if (parsedParams.text && parsedParams.text.trim() !== textContent) {
                            console.warn(
                              `Text mismatch at index: ${textContent} !== ${parsedParams.text}`
                            )
                            return
                          }

                          const props = {
                            ...parsedParams,
                            text: textContent,
                            isCustom: true,
                            textBox: Boolean(this.fpdInstance.mainOptions.customTextAsTextbox),
                            resizable: true,
                            boundingBox: 'base',
                            _addToUZ: t.currentViewInstance.currentUploadZone,
                            _calcWidth: true,
                            advancedEditing: false
                          }

                          // Save last 2 props to localStorage
                          let existingProps = []
                          try {
                            const data = JSON.parse(localStorage.getItem('propstext') || '[]')
                            existingProps = Array.isArray(data) ? data : []
                          } catch (e) {
                            existingProps = []
                          }
                          existingProps.push(props)
                          if (existingProps.length > 2) {
                            existingProps = existingProps.slice(-2)
                          }
                          localStorage.setItem('propstext', JSON.stringify(existingProps))

                          let styledProps =
                            typeof z === 'function'
                              ? z(viewOptions.customTextParameters, props)
                              : props

                          styledProps = {
                            ...styledProps,
                            autoCenter: false,
                            fill: props.colors || '#ff0000',
                            colors: props.colors || '#ff0000',
                            fontFamily: props.font || 'Arial',
                            fontSize: props.textSize || 24,
                            curved: props.curved || false,
                            curveSpacing: props.curveSpacing || 5,
                            curveRadius: props.curveRadius || 180,
                            curveReverse: props.curveReverse || false,
                            textAlign: 'left',
                            originX: 'left',
                            originY: 'top',
                            boundingBox: undefined,
                            top: parsedParams.top || 0,
                            left: parsedParams.left || 0
                          }

                          const fabricText = styledProps.curved
                            ? new fabric.CurvedText(textContent, styledProps)
                            : new fabric.Text(textContent, styledProps)

                          fabricText.set({
                            curvable: 1,
                            curved: props.curved || false,
                            curveReverse: props.curveReverse || false,
                            curveRadius: props.curveRadius || 0,
                            curveSpacing: props.curveSpacing || 0,
                            boundingBox: 'Base'
                          })

                          insertedTextObjects.push(fabricText)
                        })

                        if (insertedTextObjects.length > 0) {
                          const group = new fabric.Group(insertedTextObjects, {
                            selectable: true,
                            hasControls: true,
                            resizable: true,
                            draggable: true,
                            removable: true,
                            positioned: true,
                            textAlign: 'center',
                            autoCenter: true,
                            originX: 'center',
                            originY: 'center',
                            scaleX: 1,
                            scaleY: 1,
                            rotatable:1,
                            advancedEditing: false,
                            title: title + '' + Math.floor(Math.random() * 100000),
                          })

                          // Hide transform toolbar
                          const transformToolbar = document.querySelector('[data-panel="transform"]')
                          if (transformToolbar) {
                            transformToolbar.classList.add('fpd-hidden')
                          }

                          // Fit group inside stage (max 1000×1000)
                          const stageWidth = 1000
                          const stageHeight = 1000
                          const scaleX = stageWidth / group.width
                          const scaleY = stageHeight / group.height
                          const scale = Math.min(scaleX, scaleY, 1)
                          group.set({
                            scaleX: scale,
                            scaleY: scale,
                            left: stageWidth / 2,
                            top: stageHeight / 2,
                            originX: 'center',
                            originY: 'center',
                            boundingBox: 'Base',
                            lockUniScaling: true,
                          })

                          // Lock base image & set clipPath for group
                          const baseImage = fabricCanvas.getObjects().find(o => o.title === 'Overlay')
                          if (baseImage) {
                            baseImage.set({
                              selectable: false,
                              evented: false,
                              lockMovementX: true,
                              lockMovementY: true,
                              lockRotation: true,
                              lockScalingX: true,
                              lockScalingY: true
                            })
                            baseImage.moveTo(0)

                            group.clipPath = new fabric.Rect({
                              left: baseImage.left - (baseImage.width * baseImage.scaleX) / 2,
                              top: baseImage.top - (baseImage.height * baseImage.scaleY) / 2,
                              width: baseImage.width * baseImage.scaleX,
                              height: baseImage.height * baseImage.scaleY,
                              absolutePositioned: true
                            })
                          }

                          fabricCanvas.add(group)
                          fabricCanvas.setActiveObject(group)
                          fabricCanvas.requestRenderAll()
                          ;
                          const elements = this.fpdInstance.getElements(this.fpdInstance.currentViewIndex, 'all', false)
                          ;

                          // loop through and check
                          elements.forEach(el => {
                            ;
                            if(el._objects){
                              ;
                              // Find the layers list container
                              const layersList = document.querySelector('fpd-module-manage-layers .fpd-list');

                              if (layersList) {
                                // Create row element
                                const newRow = document.createElement('div');
                                newRow.className = "fpd-list-row !bg-white fpd-locked";
                                newRow.id = "layer-" + el.title.replace(/\s+/g, '-');  // use unique id if needed

                                // Inner HTML structure
                                newRow.innerHTML = `
                                <div class="fpd-cell-0"><span></span></div>
                                <div class="fpd-cell-1">${el.title}</div>
                                <div class="fpd-cell-2">
                                  <span class="fpd-lock-element"><span class="fpd-icon-unlocked"></span></span>
                                  <span class="fpd-visible-element"><span class="fa-solid fa-eye"></span></span>
                                  <span class="fpd-remove-element" style="cursor:pointer;">
                                    <span class="fa-solid fa-trash"></span>
                                  </span>
                                </div>
                              `;

                                // Append to the layers list
                                // layersList.appendChild(newRow);
                                // Insert at the top (before first child if exists)
                                if (layersList.firstChild) {
                                  layersList.insertBefore(newRow, layersList.firstChild);
                                } else {
                                  layersList.appendChild(newRow);
                                }

                                const removeBtn = newRow.querySelector(".fpd-remove-element");
                                if (removeBtn) {
                                  removeBtn.addEventListener("click", () => {
                                    const canvas = this.fpdInstance.currentViewInstance.fabricCanvas;

                                    // Remove element from Fabric.js canvas
                                    canvas.remove(el);
                                    canvas.requestRenderAll();

                                    // Remove the row from the panel
                                    newRow.remove();

                                    ;
                                  });
                                }
                                // 🔹 Lock button
                                const lockBtn = newRow.querySelector(".fpd-lock-element");
                                if (lockBtn) {
                                  lockBtn.addEventListener("click", () => {
                                    el.selectable = !el.selectable; // toggle lock
                                    if (el.selectable) {
                                      lockBtn.innerHTML = `<span class="fpd-icon-unlocked"></span>`;
                                      ;
                                    } else {
                                      lockBtn.innerHTML = `<span class="fpd-icon-locked"></span>`;
                                      ;
                                    }
                                    canvas.requestRenderAll();
                                  });
                                }
                                const visibleBtn = newRow.querySelector(".fpd-visible-element");
                                if (visibleBtn) {
                                  visibleBtn.addEventListener("click", () => {
                                    const canvas = this.fpdInstance.currentViewInstance.fabricCanvas;
                                    el.visible = !el.visible; // toggle visibility
                                    if (el.visible) {
                                      visibleBtn.innerHTML = `<span class="fa-solid fa-eye"></span>`;
                                      ;
                                    } else {
                                      visibleBtn.innerHTML = `<span class="fa-solid fa-eye-slash"></span>`;
                                      ;
                                    }
                                    canvas.requestRenderAll();
                                  });
                                }

                                ;
                              } else {
                                console.warn("Layers list not found in DOM ❌");
                              }

                            }
                            if (el.title === "Base") {
                              ;
                            }
                          });
                          ;
                          
                        //  this.fpdInstance.currentViewInstance.fabricCanvas.fire('elementAdd', { element: group });

                        }
                      })

                      


                    categoryContainer.appendChild(newDiv);
                  }
                });

                // ✅ "See All" toggle logic
                const fpdItems = categoryContainer.querySelectorAll('.fpd-item');
                const maxVisible = 3;

                if (fpdItems.length > maxVisible) {
                  fpdItems.forEach((item, index) => {
                    if (index >= maxVisible) item.classList.add('fpd-hidden');
                  });

                  const toggleBtn = document.createElement('button');
                  toggleBtn.className =
                    'cursor-pointer see-toggle-btn text-[#0d1216db] font-bold mt-2 absolute right-0 top-[7px]';
                  toggleBtn.innerText = 'See All';

                  toggleBtn.addEventListener('click', () => {
                    toggleBtn.classList.add('fpd-hidden');
                    fpdItems.forEach(item => {
                      item.classList.remove('fpd-hidden');
                      item.style.display = 'block';
                    });
                  });

                  categoryContainer.appendChild(toggleBtn);
                }

                target.appendChild(categoryContainer);
              });

            }
          }
        }
      }
      window.FPDTextsModule = Ge
      class qe extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div data-moduleicon="component" data-defaulttext="Elements" data-title="Elements"> <div class="fpd-head relative"><div id="icon-search-back-data" class="icon-search-back-data fpd-hidden absolute top-[8px] left-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-[#0d1216] hover:text-blue-600 transition duration-200 cursor-pointer"><path d="M6.9 10.996h11.596a.75.75 0 0 1 0 1.5H6.9l4.377 4.377a.75.75 0 0 1-1.061 1.06l-4.95-4.95a1.75 1.75 0 0 1 0-2.474l4.95-4.95a.75.75 0 1 1 1.06 1.06L6.9 10.996z" fill="currentColor"></path></svg></div> <div class="fpd-input-back-search input-search-box !shadow-none border border-[#35475a33] border-solid !rounded-[8px] ml-[5px] w-[calc(100% - 22px)]"> <div class="fpd-back fpd-btn !bg-white"> <svg xmlns="http://www.w3.org/2000/svg" class="min-w-[24px] text-black relative top-[-2px]" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg> </div> <div class="fpd-input-search"> <input type="text" class="!text-sm placeholder-gray-500 !pl-2" placeholder="Search" /> <span class="fpd-icon-magnify"></span> </div> </div> </div> <div class="fpd-scroll-area"> <div class="relative fpd-grid fpd-grid-contain fpd-padding one !flex !flex-col"> </div> </div>'
        }
      }
      // ===== CUSTOM (StyleFlip): parallel "Elements" module (fpd-module-designsnew), registered alongside the vendor's qe below ==
      class qet extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div data-moduleicon="component" data-defaulttext="Add Texts" data-title="Add Texts"> <div class="fpd-head"> <div class="fpd-input-back-search input-search-box !shadow-none border border-[#35475a33] border-solid !rounded-[8px] ml-[5px] w-[calc(100% - 22px)]"> <div class="fpd-back fpd-btn !bg-white"> <svg xmlns="http://www.w3.org/2000/svg" class="min-w-[24px] text-black relative top-[-2px]" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.2 16.34a7.5 7.5 0 1 1 1.38-1.45l4.2 4.2a1 1 0 1 1-1.42 1.41l-4.16-4.16zm-4.7.16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg> </div> <div class="fpd-input-search"> <input type="text" class="!text-sm placeholder-gray-500 !pl-2" placeholder="Search" /> <span class="fpd-icon-magnify"></span> </div> </div> </div> <div class="fpd-scroll-area"> <div class="relative fpd-grid fpd-grid-contain fpd-padding one !flex !flex-col"> </div> </div>'
        }
      }
      function Xe (t, e) {
        Je(t, e), e.add(t)
      }
      function Ze (t, e, i) {
        Je(t, e), e.set(t, i)
      }
      function Je (t, e) {
        if (e.has(t))
          throw new TypeError(
            'Cannot initialize the same private elements twice on an object'
          )
      }
      function Qe (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      function Ke (t, e) {
        return (function (t, e) {
          return e.get ? e.get.call(t) : e.value
        })(t, ti(t, e, 'get'))
      }
      function $e (t, e, i) {
        return (
          (function (t, e, i) {
            if (e.set) e.set.call(t, i)
            else {
              if (!e.writable)
                throw new TypeError('attempted to set read only private field')
              e.value = i
            }
          })(t, ti(t, e, 'set'), i),
          i
        )
      }
      function ti (t, e, i) {
        if (!e.has(t))
          throw new TypeError(
            'attempted to ' + i + ' private field on non-instance'
          )
        return e.get(t)
      }
      customElements.define('fpd-module-designs', qe)
      customElements.define('fpd-module-designsnew', qet)
      var ei = new WeakMap(),
        ii = new WeakMap(),
        ni = new WeakMap(),
        si = new WeakMap(),
        ri = new WeakMap(),
        ai = new WeakSet(),
        oi = new WeakSet(),
        li = new WeakSet(),
        ci = new WeakSet()
      class hi extends EventTarget {
        constructor (t, e) {
          let i =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : null
          super(),
            Xe(this, ci),
            Xe(this, li),
            Xe(this, oi),
            Xe(this, ai),
            Ze(this, ei, { writable: !0, value: '' }),
            Ze(this, ii, { writable: !0, value: !1 }),
            Ze(this, ni, { writable: !0, value: [] }),
            Ze(this, si, { writable: !0, value: null }),
            Ze(this, ri, { writable: !0, value: null }),
            $e(
              this,
              ei,
              t.translator
                .getTranslation('modules', 'designs_search_in', 'Search in')
                .toUpperCase()
            ),
            (this.fpdInstance = t),
            $e(this, ri, i),
            (this.container = document.createElement('fpd-module-designs')),
            e.append(this.container),
            i && (this.container.dataset.dynamicDesignsId = i),
            (this.headElem = this.container.querySelector('.fpd-head')),
            (this.gridElem = this.container.querySelector('.fpd-grid'))
          this.headElem
            .querySelector('.fpd-input-search input')
            .addEventListener('keyup', t => {
              ;
              const input = t.currentTarget
              const items = this.gridElem.querySelectorAll('.fpd-item')
              const categories = this.gridElem.querySelectorAll('.fpd-category')

              const query = input.value.toLowerCase().trim()

              for (let item of items) {
                const searchText = item.dataset.search || ''
                if (query === '' || searchText.includes(query)) {
                  item.classList.remove('fpd-hidden')
                } else {
                  item.classList.add('fpd-hidden')
                }
              }

              // Hide entire category if all its items are hidden
              for (let category of categories) {
                const visibleItems = category.querySelectorAll(
                  '.fpd-item:not(.fpd-hidden)'
                )
                if (visibleItems.length === 0) {
                  category.style.display = 'none' // or category.remove();
                } else {
                  category.style.display = '' // reset visibility
                }
              }
            }),
            G(this.headElem.querySelector('.fpd-back'), 'click', t => {
              this.gridElem.querySelectorAll('.fpd-category').length > 0 &&
                Ke(this, ni).pop()
              let e,
                i = this.fpdInstance.designs
              Ke(this, ni).forEach(t => {
                ;(e = i[t]), (i = e.category)
              }),
                $e(this, si, i),
                i && Qe(this, ai, di).call(this, Ke(this, si), e),
                void 0 === e && this.toggleCategories()
            })
          let n = !1
          G(t, ['designsSet'], e => {
            ;
            if (n) return
            n = !0
            const i = t.designs
            Array.isArray(i) &&
              0 !== i.length &&
              (i[0].hasOwnProperty('source')
                ? (this.container.classList.add('fpd-single-cat'),
                  Qe(this, li, fi).call(this, i))
                : i.length > 1 || i[0].category
                ? ($e(this, ii, !0), this.toggleCategories())
                : 1 === i.length &&
                  i[0].designs &&
                  (this.container.classList.add('fpd-single-cat'),
                  Qe(this, li, fi).call(this, i[0].designs)))
          }),
            G(t, 'viewSelect', () => {
              this.toggleCategories()
            })
        }
        toggleCategories () {
          if (!Ke(this, ii)) return
          $e(this, ni, []),
            this.container.classList.remove(
              'fpd-head-visible',
              'fpd-single-cat'
            ),
            $e(this, si, this.fpdInstance.designs),
            Qe(this, ai, di).call(this, Ke(this, si))
          let t = []
          if ('string' == typeof Ke(this, ri))
            t =
              this.fpdInstance.mainOptions.dynamicDesigns[Ke(this, ri)]
                .categories
          else if (this.fpdInstance.currentViewInstance) {
            const e = this.fpdInstance.currentElement
            t =
              e && e.uploadZone && e.designCategories
                ? this.fpdInstance.currentElement.designCategories
                : this.fpdInstance.currentViewInstance.options.designCategories
          }
          t = t.map(t => t.toLowerCase())
          var e = this.container.querySelectorAll('.fpd-category')
          if (t.length > 0) {
            let i = []
            for (let n of e)
              t.includes(n.dataset.title.toLowerCase())
                ? (n.classList.remove('fpd-hidden'), i.push(n))
                : n.classList.add('fpd-hidden')
            1 === i.length &&
              (this.container.classList.add('fpd-single-cat'), i[0].click())
          } else for (let t of e) t.classList.remove('fpd-hidden')
        }
      }
      function di (t, e) {
        ;(this.gridElem.innerHTML = ''),
          (this.headElem.querySelector('.fpd-input-search input').value = ''),
          this.container.classList.remove('fpd-designs-active'),
          this.container.classList.add('fpd-categories-active'),
          t.forEach((t, e) => {
            Qe(this, oi, ui).call(this, t)
          }),
          e &&
            (this.headElem
              .querySelector('.fpd-input-search input')
              .setAttribute(
                'placeholder',
                Ke(this, ei) + ' ' + e.title.toUpperCase()
              ),
            this.container.classList.add('fpd-head-visible'))
      }
      function ui (t) {
        // const e = document.createElement("div");
        // if (((e.className = "fpd-category fpd-item"), (e.dataset.title = t.title), (e.dataset.search = t.title.toLowerCase()), t.thumbnail)) {
        //     const i = document.createElement("picture");
        //     (i.dataset.img = t.thumbnail), e.append(i), this.fpdInstance.lazyBackgroundObserver.observe(i);
        //     const n = document.createElement("span");
        //     (n.innerText = t.title), e.append(n);
        // } else e.innerHTML = "<span>" + t.title + "</span>";
        // e.addEventListener("click", (t) => {
        //     alert("j")
        //     let e = t.currentTarget,
        //         i = Array.from(this.gridElem.querySelectorAll(".fpd-item")).indexOf(e),
        //         n = Ke(this, si)[i];
        //     n.category ? (Ke(this, ni).push(i), $e(this, si, n.category), Qe(this, ai, di).call(this, Ke(this, si), n)) : Qe(this, li, fi).call(this, n.designs, n.parameters),
        //         this.headElem.querySelector(".fpd-input-search input").setAttribute("placeholder", Ke(this, ei) + " " + e.dataset.search.toUpperCase());
        // }),
        //     this.gridElem.append(e);
        const tags = JSON.parse(
          localStorage.getItem('fpd-designs-tags') || '[]'
        )

        // Track current X offset
        let currentOffset = 0

        // Create outer wrapper (position relative for arrow buttons)
        const wrapper = document.createElement('div')
        wrapper.className = 'relative w-full mt-2 fpd-designs-tags'

        // Step 1: Create container with overflow hidden
        const container = document.createElement('div')
        container.className = 'w-full mt-2 overflow-hidden our-elements'

        // Step 2: Create flex wrapper that will slide using translateX
        const flexWrapper = document.createElement('div')
        flexWrapper.className =
          'flex gap-2 ml-[5px] transition-transform duration-300 ease-in-out'
        flexWrapper.style.transform = `translateX(${currentOffset}px)`

        // Step 3: Create tag elements
        tags.forEach(tag => {
          const tagDiv = document.createElement('div')
          tagDiv.className =
            'my-tag-element capitalize border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none whitespace-nowrap'
          tagDiv.innerText = tag
          tagDiv.addEventListener('click', () => {
            const containermodules = document.querySelector(
              '.fpd-module-content div[data-defaulttext="Elements"]'
            )
            if (containermodules) {
              const els = containermodules.querySelector(
                '#icon-search-back-data'
              )

              if (els) {
                // Remove hidden class
                els.classList.remove('fpd-hidden')
                els.style.setProperty('opacity', '1')
              }
              els.addEventListener('click', () => {
                ;
              })
            }
            document.querySelectorAll('.my-tag-element').forEach(tag => {
              tag.classList.remove('!bg-[#40576d12]')
            })
            tagDiv.classList.add('!bg-[#40576d12]')
            ;
            const matchedDesigns = []

            this.fpdInstance.designs.forEach(group => {
              if (Array.isArray(group.designs)) {
                const filtered = group.designs.filter(
                  design =>
                    Array.isArray(design.tags) && design.tags.includes(tag)
                )
                matchedDesigns.push(...filtered)
              }
            })

            ;
            ;
            ;

            document
              .querySelectorAll('.fpd-category.fpd-item-group')
              .forEach(el => {
                el.classList.add('fpd-hidden')
              })

            document.querySelectorAll('.main-div-first').forEach(div => {
              div.remove() // remove from DOM
            })
            // Show only matched ones
            const maindivfirst = document.createElement('div')
            maindivfirst.className = 'main-div-first'

            const maindiv = document.createElement('div')
            maindiv.className = 'flex flex-wrap'
            ;

            maindivfirst.innerHTML = ''
            matchedDesigns.forEach(design => {
              const div = document.createElement('div')
              div.className =
                'fpd-item fpd-hover-thumbnail position-relative fpd-draggable image-element flex items-center justify-start flex-col relative mt-[5px] mb-[5px] group flex-none basis-1/2'
              div.dataset.source = design.thumbnail
              div.dataset.title = design.title
              div.setAttribute('aria-label', design.title)
              div.dataset.search = design.title
                .toLowerCase()
                .replace(/\s+/g, ' ')

              const picture = document.createElement('picture')
              picture.dataset.img = design.thumbnail
              picture.className =
                'w-[100px] h-[100px] block bg-contain bg-no-repeat bg-center'
              picture.dataset.originwidth = design.width || 127
              picture.dataset.originheight = design.height || 167
              picture.style.backgroundImage = `url("${
                design.thumbnail || imgSrc
              }")`

              div.appendChild(picture)

              div.addEventListener('click', event => {
                ;
                const current = event.currentTarget
                ;
                const i = Array.from(
                  this.gridElem.querySelectorAll('.fpd-item')
                ).indexOf(current)
                const n = Ke(this, si)[i]

                if (current.classList.contains('image-element')) {
                  ;
                  const dataSource = current.dataset.source
                  const dataTitle = current.dataset.title
                  const parameters = current.parameters || {}

                  ;
                  this.fpdInstance.addCanvasDesign(
                    dataSource,
                    dataTitle,
                    parameters
                  )
                } else if (n.category) {
                  Ke(this, ni).push(i)
                  $e(this, si, n.category)
                  Qe(this, ai, di).call(this, Ke(this, si), n)
                } else if (n.designs) {
                  Qe(this, li, fi).call(this, n.designs, n.parameters)
                }

                //this.headElem.querySelector(".fpd-input-search input").setAttribute("placeholder", Ke(this, ei) + " " + current.dataset.search.toUpperCase());
              })

              // document.querySelectorAll('.fpd-category.fpd-item-group .fpd-grid.fpd-grid-contain').forEach(box => {
              //     const visibleItems = Array.from(
              //         box.querySelectorAll('.fpd-item.image-element')
              //     ).filter(item => !item.classList.contains('fpd-hidden'));

              //     box.parentElement.style.display = visibleItems.length > 0 ? 'block' : 'none';
              // });

              maindiv.appendChild(div)
            })
            maindivfirst.appendChild(maindiv)
            container.appendChild(maindivfirst)
            // You can add any custom logic here
          })

          flexWrapper.appendChild(tagDiv)

          const containermodules = document.querySelector(
            '.fpd-module-content div[data-defaulttext="Elements"]'
          )
          if (containermodules) {
            const els = containermodules.querySelector('#icon-search-back-data')

            els.addEventListener('click', () => {
              els.style.setProperty('opacity', '0')
              els.classList.add('fpd-hidden')
              ;
              document.querySelectorAll('.main-div-first').forEach(divss => {
                divss.remove()
              })
              document
                .querySelectorAll('.fpd-category.fpd-item-group')
                .forEach(el => {
                  el.classList.remove('fpd-hidden')
                })
              document.querySelectorAll('.my-tag-element').forEach(tag => {
                tag.classList.remove('!bg-[#40576d12]')
              })
            })
          }
        })

        // Step 4: Append sliding content to container
        container.appendChild(flexWrapper)

        // Step 5: Create left arrow
        const leftArrow = document.createElement('button')
        leftArrow.innerHTML = `
 <svg xmlns="http://www.w3.org/2000/svg" width="50" height="40" viewBox="0 0 24 24" fill="none">
   <path fill="currentColor" d="m14.8 16.382-4.205-4.205a.25.25 0 0 1 0-.354L14.8 7.618a.75.75 0 0 0-1.06-1.06l-4.206 4.204a1.75 1.75 0 0 0 0 2.475l4.206 4.205a.75.75 0 0 0 1.06-1.06"></path>
 </svg>
`
        leftArrow.className =
          'absolute left-2 -translate-y-1/2 z-[9] bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden mt-[16px]'
        leftArrow.disabled = true // initially disabled

        // Step 6: Create right arrow
        const rightArrow = document.createElement('button')
        rightArrow.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="50" height="40" viewBox="0 0 24 24" fill="none">
  <path fill="currentColor" d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"></path>
</svg>
`
        rightArrow.className =
          'absolute right-0 z-[9] mt-[-20px] -translate-y-1/2 bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden'

        // Update arrow states
        function updateArrows () {
          const wrapperWidth = container.offsetWidth
          const contentWidth = flexWrapper.scrollWidth
          ;
          // Prevent scrolling beyond bounds
          if (currentOffset > 0) currentOffset = 0
          if (Math.abs(currentOffset) >= contentWidth - wrapperWidth) {
            currentOffset = -1 * (contentWidth - wrapperWidth)
          }

          // Apply transform
          flexWrapper.style.transform = `translateX(${currentOffset}px)`

          // Enable or disable arrows
          leftArrow.disabled = currentOffset === 0
          rightArrow.disabled =
            Math.abs(currentOffset) >= contentWidth - wrapperWidth - 1 // Allow 1px tolerance
        }

        // Scroll left
        leftArrow.onclick = () => {
          const tag = flexWrapper.querySelector('div')
          ;
          if (tag) {
            const scrollAmount = tag.offsetWidth * 2 + 16
            currentOffset += scrollAmount
            updateArrows()
          }
        }

        // Scroll right
        rightArrow.onclick = () => {
          const tag = flexWrapper.querySelector('div')
          ;
          if (tag) {
            const scrollAmount = tag.offsetWidth * 2 + 16
            currentOffset -= scrollAmount
            updateArrows()
          }
        }

        // Step 5: Append everything
        container.appendChild(leftArrow)
        container.appendChild(flexWrapper)
        container.appendChild(rightArrow)

        const e = document.createElement('div')
        e.className = 'relative fpd-category fpd-item-group'
        e.dataset.title = t.title
        e.dataset.search = t.title.toLowerCase()

        // Heading
        const heading = document.createElement('h3')
        heading.className =
          'text-[0.9rem] font-bold p-[10px] text-[#0d1216db] capitalize'
        heading.innerText = t.title
        e.appendChild(heading)

        // Image container
        const visibleImagesContainer = document.createElement('div')
        visibleImagesContainer.className =
          'fpd-grid fpd-grid-contain fpd-padding'

        // Hidden image container
        const hiddenImagesContainer = document.createElement('div')
        hiddenImagesContainer.className = 'hidden fpd-thumbnails'
        hiddenImagesContainer.style.display = 'none'

        // Guard: make sure t.designs or t.images exist
        // console.log("t.designs", t);
        // console.log("t.designs", t.designs, "t.images", t.images, "t.category", t.category);
        let images = []

        if (t.designs || t.images) {
          images = t.designs || t.images
        } else if (t.category && Array.isArray(t.category)) {
          // Pull 3 designs from subcategories
          for (let subCat of t.category) {
            const subImages = subCat.designs || subCat.images || []
            for (let img of subImages) {
              if (images.length < 3) {
                images.push({
                  title: img.title || subCat.title || t.title,
                  source: img.source || img,
                  thumbnail: img.thumbnail || img.source || img,
                  width: img.width,
                  height: img.height
                })
              }
            }
            if (images.length >= 3) break
          }
        } else if (t.thumbnail) {
          images = [
            {
              title: t.title,
              source: t.thumbnail,
              thumbnail: t.thumbnail
            }
          ]
        }

        // images.forEach((imgSrc, index) => {
        //     const isDesign = !!imgSrc.source;

        //     const div = document.createElement("div");
        //     div.className = "fpd-item fpd-hover-thumbnail fpd-draggable" + (isDesign ? " image-element flex items-center justify-start flex-col relative mt-[5px] mb-[5px]" : "");

        //     div.dataset.source = imgSrc.thumbnail || imgSrc;
        //     div.dataset.title = imgSrc.title || t.title;
        //     div.setAttribute("aria-label", imgSrc.title || t.title);
        //     div.dataset.search = (imgSrc.title || t.title).toLowerCase().replace(/\s+/g, ' ');

        //     const picture = document.createElement("picture");
        //     picture.dataset.img = imgSrc.thumbnail || imgSrc;
        //     picture.className = "w-[100px] h-[100px] block bg-contain bg-no-repeat bg-center";
        //     picture.dataset.originwidth = imgSrc.width || 127;
        //     picture.dataset.originheight = imgSrc.height || 167;
        //     picture.style.backgroundImage = `url("${imgSrc.thumbnail || imgSrc}")`;

        //     div.appendChild(picture);

        //     // const span = document.createElement("span");
        //     // span.innerText = imgSrc.title || t.title;
        //     // div.appendChild(span);

        //     // Append to visible or hidden container
        //     if (index < 3) {
        //         visibleImagesContainer.appendChild(div);
        //     } else {
        //         hiddenImagesContainer.appendChild(div);
        //     }

        //     // Click logic (unchanged)
        //     div.addEventListener("click", (event) => {
        //         const current = event.currentTarget;
        //         console.log("current", current, "event",event);
        //         const i = Array.from(this.gridElem.querySelectorAll(".fpd-item")).indexOf(current);
        //         const n = Ke(this, si)[i];

        //         if (current.classList.contains("image-element")) {
        //             console.log("current",current.dataset);
        //             const dataSource = current.dataset.source;
        //             const dataTitle = current.dataset.title;
        //             const parameters = current.parameters || {};

        //             console.log("parameters",parameters,"this.fpdInstance",this.fpdInstance, "parameter",e);
        //             this.fpdInstance.addCanvasDesign(dataSource, dataTitle, parameters);
        //         } else if (n.category) {
        //             Ke(this, ni).push(i);
        //             $e(this, si, n.category);
        //             Qe(this, ai, di).call(this, Ke(this, si), n);
        //         } else if (n.designs) {
        //             Qe(this, li, fi).call(this, n.designs, n.parameters);
        //         }

        //         this.headElem.querySelector(".fpd-input-search input")
        //             .setAttribute("placeholder", Ke(this, ei) + " " + current.dataset.search.toUpperCase());
        //     });
        // });

        // Store all tooltip elements
        const allTooltips = []

        images.forEach((imgSrc, index) => {
          const isDesign = !!imgSrc.source

          const div = document.createElement('div')
          div.className =
            'fpd-item fpd-hover-thumbnail position-relative fpd-draggable image-element flex items-center justify-start flex-col relative mt-[5px] mb-[5px] group'
          div.dataset.source = imgSrc.thumbnail || imgSrc
          div.dataset.title = imgSrc.title || t.title
          div.setAttribute('aria-label', imgSrc.title || t.title)
          div.dataset.search = (imgSrc.title || t.title)
            .toLowerCase()
            .replace(/\s+/g, ' ')

          const picture = document.createElement('picture')
          picture.dataset.img = imgSrc.thumbnail || imgSrc
          picture.className =
            'w-[100px] h-[100px] block bg-contain bg-no-repeat bg-center'
          picture.dataset.originwidth = imgSrc.width || 127
          picture.dataset.originheight = imgSrc.height || 167
          picture.style.backgroundImage = `url("${imgSrc.thumbnail || imgSrc}")`

          // Create dot menu trigger
          const dots = document.createElement('div')
          dots.innerHTML = '⋯'
          // Was `hidden group-hover:block` (Tailwind's :hover-only reveal) —
          // on iOS that made the first tap on the item just resolve the
          // hover state (revealing dots) instead of firing its click, so
          // adding the element needed a second tap. Visibility is now
          // driven by .fpd-dot-menu-tapped (toggled on real tap, see
          // home.component.ts / styles.scss) instead of :hover, same fix
          // already applied to .fpd-dot-menu elsewhere.
          dots.className =
            'fpd-elements-dot-menu absolute top-0 right-0 z-10 px-2 text-lg font-bold text-black rounded-full cursor-pointer top-1 right-1 bg-opacity-40'

          // Tooltip on body (not inside the grid cell) so overflow/clipping
          // after copy/paste doesn't make ⋯ clicks look dead.
          const tooltip = document.createElement('div')
          tooltip.className =
            'fpd-doc-elements-tooltip fixed bg-white text-black text-sm p-2 rounded shadow-md hidden z-[9999] border border-[#ccc] border-solid rounded-[6px] shadow-custom-light'

          // Sample fallback tags if img.tags doesn't exist
          const tagsArray = imgSrc.tags || [
            'design',
            'button',
            'banner',
            'sign',
            'graphic'
          ]

          // Generate tag HTML dynamically
          const tagsHtml = tagsArray
            .map(
              tag => `
                            <div class="border border-solid border-[#ccc] px-[7px] py-[3px] bg-[#0d121600] rounded-[8px] shadow-[inset_0_0_0_1px_var(--Zya5eQ)] text-[#0d1216] capitalize capitalize">${tag}</div>
                        `
            )
            .join('')

          tooltip.innerHTML = `
                            <div class="content-section rounded-[6px] p-[10px] max-w-[224px]">
                                <strong class="text-[1rem]">${
                                  imgSrc.title || t.title
                                }</strong>
                                
                                <hr class="border-[1px] border-t border-solid border-gray-300 my-4 mt-2">
                                <div class="flex items-center my-2 gap-[10px] flex-wrap happy">
                                    ${tagsHtml}
                                </div>
                                <hr class="border-t border-[1px] border-solid border-gray-300 my-4">
                            </div>
                        `

          // Add tooltip to the global list
          allTooltips.push(tooltip)
          document.body.appendChild(tooltip)

          // Keep tooltip inside the viewport (landscape / narrow sheets
          // previously placed it at rect.right+8 and it opened off-screen,
          // so ⋯ taps looked dead).
          const placeElementsTooltip = () => {
            const rect = dots.getBoundingClientRect()
            tooltip.classList.remove('hidden')
            tooltip.style.visibility = 'hidden'
            tooltip.style.display = 'block'
            const tipW = tooltip.offsetWidth || 240
            const tipH = tooltip.offsetHeight || 160
            const pad = 8
            let left = rect.right + pad
            let top = rect.top
            if (left + tipW > window.innerWidth - pad) {
              left = Math.max(pad, rect.left - tipW - pad)
            }
            if (left < pad) left = pad
            if (top + tipH > window.innerHeight - pad) {
              top = Math.max(pad, window.innerHeight - tipH - pad)
            }
            if (top < pad) top = pad
            tooltip.style.left = `${Math.round(left)}px`
            tooltip.style.top = `${Math.round(top)}px`
            tooltip.style.visibility = 'visible'
          }

          let lastElementsTipToggle = 0
          const toggleElementsTooltip = e => {
            e.stopPropagation()
            e.preventDefault()
            // Debounce touchend+click double-fire on iOS
            const now = Date.now()
            if (now - lastElementsTipToggle < 400) return
            lastElementsTipToggle = now

            allTooltips.forEach(tip => {
              if (tip !== tooltip) {
                tip.classList.add('hidden')
                tip.style.display = ''
              }
            })
            const parent = e.currentTarget.closest('.fpd-active')
            if (parent) {
              parent.classList.toggle('backdrop-test')
              localStorage.setItem('fpdMenuClicked', 'true')
            }

            const willShow = tooltip.classList.contains('hidden')
            if (willShow) {
              placeElementsTooltip()
            } else {
              tooltip.classList.add('hidden')
              tooltip.style.display = ''
            }
          }

          // click + touchend: iOS sometimes eats the click after stopPropagation
          dots.addEventListener('click', toggleElementsTooltip)
          dots.addEventListener(
            'touchend',
            e => {
              if (e.cancelable) e.preventDefault()
              toggleElementsTooltip(e)
            },
            { passive: false }
          )

          // Hide tooltip if user taps outside (ignore taps on this tip / dots)
          document.addEventListener('click', ev => {
            if (
              tooltip.contains(ev.target) ||
              dots.contains(ev.target)
            ) {
              return
            }
            tooltip.classList.add('hidden')
            tooltip.style.display = ''
          })

          div.appendChild(picture)
          div.appendChild(dots)

          if (index < 3) {
            visibleImagesContainer.appendChild(div)
          } else {
            hiddenImagesContainer.appendChild(div)
          }

          // Your existing click logic unchanged...
          div.addEventListener('click', event => {
            // document.querySelector('fpd-element-toolbar')?.classList.add('fpd-show');
            // document.querySelector('.fpd-ungroup1')?.classList.add('fpd-hidden');
            ;
            const current = event.currentTarget
            ;
            const i = Array.from(
              this.gridElem.querySelectorAll('.fpd-item')
            ).indexOf(current)
            const n = Ke(this, si)[i]

            if (current.classList.contains('image-element')) {
              ;
              const dataSource = current.dataset.source
              const dataTitle = current.dataset.title
              const parameters = current.parameters || {}

              ;
              this.fpdInstance.addCanvasDesign(
                dataSource,
                dataTitle,
                parameters
              )
               document.querySelector('.fpd-ungroup1')?.classList.add('fpd-hidden');
            } else if (n.category) {
              Ke(this, ni).push(i)
              $e(this, si, n.category)
              Qe(this, ai, di).call(this, Ke(this, si), n)
            } else if (n.designs) {
              Qe(this, li, fi).call(this, n.designs, n.parameters)
            }

            //this.headElem.querySelector(".fpd-input-search input").setAttribute("placeholder", Ke(this, ei) + " " + current.dataset.search.toUpperCase());
          })
        })

        e.appendChild(visibleImagesContainer)
        e.appendChild(hiddenImagesContainer)

        // Store reference to all categories
        if (!this.allCategories) {
          this.allCategories = []
        }
        this.allCategories.push(e)

        // See All / See Less Button
        if (images.length > 2) {
          const toggleBtn = document.createElement('button')
          toggleBtn.innerText = 'See all'
          toggleBtn.classList.remove('see-less')
          toggleBtn.className =
            'fpd-see-all absolute top-[10px] right-[10px] text-[#0d1216db] font-bold'

          let isExpanded = false

          toggleBtn.addEventListener('click', () => {
            if (!isExpanded) {
              isExpanded = true

              // CASE 1: t has subcategories (Humans)
              if (t.category && Array.isArray(t.category)) {
                this.gridElem.innerHTML = ''
                ;
                // Add back button
                const backBtn = document.createElement('button')
                backBtn.innerText = '← Back'
                backBtn.className = 'block mb-3 ml-auto text-blue-600 underline'
                backBtn.addEventListener('click', () => {
                  ;
                  this.gridElem.innerHTML = ''
                  //   this.allCategories.forEach((cat) => this.gridElem.appendChild(cat));
                  const seenTitles = new Set()
                  const uniqueCategories = this.allCategories.filter(cat => {
                    const title = cat.getAttribute('data-title')
                    if (seenTitles.has(title)) return false
                    seenTitles.add(title)
                    return true
                  })

                  uniqueCategories.forEach(cat =>
                    this.gridElem.appendChild(cat)
                  )
                  ;
                })
                this.gridElem.appendChild(backBtn)

                // Render subcategories
                t.category.forEach(subCat => {
                  const subWrap = document.createElement('div')
                  subWrap.className =
                    'relative mb-6 fpd-category fpd-item-group'

                  const subHeading = document.createElement('h4')
                  subHeading.className =
                    'text-[0.85rem] font-semibold p-[10px] text-[#0d1216db]'
                  subHeading.innerText = subCat.title
                  subWrap.appendChild(subHeading)

                  const grid = document.createElement('div')
                  grid.className =
                    'grid grid-cols-3 auto-rows-[100px] gap-[5px] px-[10px]'
                  ;(subCat.designs || []).slice(0, 3).forEach(img => {
                    const div = document.createElement('div')
                    div.className =
                      'fpd-item fpd-hover-thumbnail fpd-draggable image-element flex items-center justify-start flex-col relative mt-[5px] mb-[5px]'
                    div.dataset.source = img.thumbnail
                    div.dataset.title = img.title
                    div.setAttribute('aria-label', img.title)
                    div.dataset.search = img.title.toLowerCase()

                    const picture = document.createElement('picture')
                    picture.className =
                      'w-[100px] h-[100px] block bg-contain bg-no-repeat bg-center'
                    picture.style.backgroundImage = `url("${img.thumbnail}")`

                    div.appendChild(picture)

                    div.addEventListener('click', () => {
                      this.fpdInstance.addCanvasDesign(
                        img.source,
                        img.title,
                        img.parameters || {}
                      )
                    })

                    grid.appendChild(div)
                  })

                  subWrap.appendChild(grid)

                  // Subcategory See All
                  if ((subCat.designs || []).length > 3) {
                    const subSeeAllBtn = document.createElement('button')
                    subSeeAllBtn.innerText = 'See all'
                    subSeeAllBtn.className =
                      'text-blue-600 underline ml-auto mt-2 block mr-[10px]'
                    subSeeAllBtn.addEventListener('click', () => {
                      // Clear the grid
                      this.gridElem.innerHTML = ''

                      // Back button
                      const backBtn = document.createElement('button')
                      backBtn.innerText = '← Back'
                      backBtn.className =
                        'block mb-3 ml-auto text-blue-600 underline'
                      backBtn.addEventListener('click', () => {
                        ;
                        this.gridElem.innerHTML = ''
                        //   this.allCategories.forEach((cat) => this.gridElem.appendChild(cat));
                        const seenTitles = new Set()
                        const uniqueCategories = this.allCategories.filter(
                          cat => {
                            const title = cat.getAttribute('data-title')
                            if (seenTitles.has(title)) return false
                            seenTitles.add(title)
                            return true
                          }
                        )

                        uniqueCategories.forEach(cat =>
                          this.gridElem.appendChild(cat)
                        )
                        ;
                        // Re-render all subcategories under the parent category (Humans)
                        //   toggleBtn.click(); // simulate original "See All" to return to subcategory preview
                      })
                      this.gridElem.appendChild(backBtn)

                      // Full subcategory block
                      const subWrapFull = document.createElement('div')
                      subWrapFull.className =
                        'relative mb-6 fpd-category fpd-item-group'

                      const fullHeading = document.createElement('h4')
                      fullHeading.className =
                        'text-[0.85rem] font-semibold p-[10px] text-[#0d1216db]'
                      fullHeading.innerText = subCat.title
                      subWrapFull.appendChild(fullHeading)

                      const fullGrid = document.createElement('div')
                      fullGrid.className =
                        'grid grid-cols-3 auto-rows-[100px] gap-[5px] px-[10px]'
                      ;(subCat.designs || []).forEach(img => {
                        const div = document.createElement('div')
                        div.className =
                          'fpd-item fpd-hover-thumbnail fpd-draggable image-element flex items-center justify-start flex-col relative mt-[5px] mb-[5px]'
                        div.dataset.source = img.thumbnail
                        div.dataset.title = img.title
                        div.setAttribute('aria-label', img.title)
                        div.dataset.search = img.title.toLowerCase()

                        const picture = document.createElement('picture')
                        picture.className =
                          'w-[100px] h-[100px] block bg-contain bg-no-repeat bg-center'
                        picture.style.backgroundImage = `url("${img.thumbnail}")`

                        div.appendChild(picture)

                        div.addEventListener('click', () => {
                          this.fpdInstance.addCanvasDesign(
                            img.source,
                            img.title,
                            img.parameters || {}
                          )
                        })

                        fullGrid.appendChild(div)
                      })

                      subWrapFull.appendChild(fullGrid)
                      this.gridElem.appendChild(subWrapFull)
                    })

                    subWrap.appendChild(subSeeAllBtn)
                  }

                  this.gridElem.appendChild(subWrap)
                })
              }

              // CASE 2: No subcategories (Love)
              else {
                // Reveal the rest of this category's images in place,
                // leaving the other categories visible below.
                hiddenImagesContainer.classList.remove('hidden')
                hiddenImagesContainer.classList.add(
                  '!grid',
                  'grid-cols-3',
                  'auto-rows-[100px]',
                  'gap-[5px]',
                  'mb-3',
                  'fpd-grid'
                )

                toggleBtn.classList.remove('see-less')
                toggleBtn.innerText = 'Hide'
              }
            }

            // Collapse view for both cases
            else {
              isExpanded = false

              if (t.category && Array.isArray(t.category)) {
                // Restore all categories (for Humans)
                this.gridElem.innerHTML = ''
                this.allCategories.forEach(cat =>
                  this.gridElem.appendChild(cat)
                )
              } else {
                // Collapse this category's extra images back (Love-type)
                hiddenImagesContainer.classList.add('hidden')
                hiddenImagesContainer.classList.remove(
                  '!grid',
                  'grid-cols-3',
                  'auto-rows-[100px]',
                  'gap-[5px]',
                  'mb-3'
                )
                toggleBtn.innerText = 'See all'
                toggleBtn.classList.remove('see-less')
              }
            }
          })

          e.appendChild(toggleBtn)
        }

        // Append everything to the grid
        this.gridElem.append(container)
        this.gridElem.appendChild(e)
      }
      function fi (t) {
        let e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        ;(this.gridElem.innerHTML = ''),
          (this.headElem.querySelector('.fpd-input-search input').value = ''),
          this.container.classList.remove('fpd-categories-active'),
          this.container.classList.add(
            'fpd-designs-active',
            'fpd-head-visible'
          ),
          t.forEach(t => {
            ;(t.parameters = z(e, t.parameters)), Qe(this, ci, pi).call(this, t)
          })
      }
      function pi (t) {
        t.thumbnail = void 0 === t.thumbnail ? t.source : t.thumbnail
        const e = tt(this.fpdInstance, this.container, t.parameters.price),
          i = $({
            url: t.source,
            thumbnailUrl: t.thumbnail,
            title: t.title,
            price: e,
            disablePrice: !Boolean(e)
          })
        ;(i.dataset.search = t.title.toLowerCase()),
          (i.parameters = t.parameters),
          i.addEventListener('click', t => {
            const e = t.currentTarget
            ;
            this.fpdInstance.addCanvasDesign(
              e.dataset.source,
              e.dataset.title,
              e.parameters
            )
          }),
          this.gridElem.append(i),
          this.fpdInstance.lazyBackgroundObserver.observe(
            i.querySelector('picture')
          )
      }
      window.FPDDesignsModule = hi
      class gi extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div data-moduleicon="cloud-upload" data-defaulttext="Add Image" data-title="modules.images"><i data-lucide="camera"></i> <div class="fpd-module-tabs"> <div data-context="upload" class="fpd-active fpd-tooltip" data-defaulttext="Uploads" title="modules.uploads"> <span class="fa-solid fa-upload"></span> </div>   <div data-context="pixabay" class="fpd-tooltip" aria-label="Pixabay"> <span class="fpd-icon-pixabay"></span> </div><div data-context="instagram" class="fpd-tooltip" aria-label="Instagram"> <span class="fpd-icon-instagram"></span> </div><div data-context="facebook" class="fpd-tooltip" aria-label="Facebook"> <span class="fpd-icon-facebook"></span> </div> <div data-context="qr-code" class="fpd-hidden fpd-tooltip" data-defaulttext="QR-Code" title="actions.qr_code"> <span class="fa-solid fa-qrcode"></span> </div> <div data-context="text2Img" class="fpd-hidden fpd-tooltip" data-defaulttext="Text to Images" title="modules.text_to_images"> <span class="fpd-icon-ai"></span> </div> </div> <div class="fpd-module-tabs-content"> <div data-context="upload" class="fpd-active"></div> <div data-context="facebook"></div> <div data-context="instagram"></div> <div data-context="pixabay"></div> <div data-context="qr-code"></div> <div data-context="text2Img"></div> </div> </div>'
        }
      }
      customElements.define('fpd-module-images', gi)
      class mi extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div class="fpd-upload-image !bg-white"> <span data-defaulttext="Drop images here">modules.upload_zone</span> <span class="fpd-btn !bg-[var(--theme-color)] w-[100%] text-center !text-sm !normal-case" data-defaulttext="Browse File">modules.browse_file</span><span>Only Images(jpg, jpeg, png, gif) files are allowed.</span> <span class="fpd-price"></span> </div> <input type="file" multiple="multiple" class="fpd-upload-input fpd-hidden" name="files[]" accept="image/jpeg,image/jpg,image/png,image/svg+xml,application/pdf"/> <div class="fpd-scroll-area"> <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div><div id="extracontainer-data" class="fpd-grid fpd-grid-cover fpd-photo-grid"></div> </div>'
        }
      }
      function vi (t, e) {
        yi(t, e), e.add(t)
      }
      function bi (t, e, i) {
        yi(t, e), e.set(t, i)
      }
      function yi (t, e) {
        if (e.has(t))
          throw new TypeError(
            'Cannot initialize the same private elements twice on an object'
          )
      }
      function xi (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      function wi (t, e) {
        return (function (t, e) {
          return e.get ? e.get.call(t) : e.value
        })(t, Si(t, e, 'get'))
      }
      function Ci (t, e, i) {
        return (
          (function (t, e, i) {
            if (e.set) e.set.call(t, i)
            else {
              if (!e.writable)
                throw new TypeError('attempted to set read only private field')
              e.value = i
            }
          })(t, Si(t, e, 'set'), i),
          i
        )
      }
      function Si (t, e, i) {
        if (!e.has(t))
          throw new TypeError(
            'attempted to ' + i + ' private field on non-instance'
          )
        return e.get(t)
      }
      customElements.define('fpd-module-uploads', mi)
      var Ti = new WeakMap(),
        Ei = new WeakMap(),
        Ai = new WeakMap(),
        Ii = new WeakMap(),
        Oi = new WeakMap(),
        ki = new WeakSet(),
        Mi = new WeakSet(),
        Pi = new WeakSet(),
        _i = new WeakSet(),
        Di = new WeakSet(),
        Li = new WeakSet(),
        Bi = new WeakSet(),
        Fi = new WeakSet(),
        ji = new WeakSet()
      class Ri extends EventTarget {
        constructor (t, e) {
          super(),
            vi(this, ji),
            vi(this, Fi),
            vi(this, Bi),
            vi(this, Li),
            vi(this, Di),
            vi(this, _i),
            vi(this, Pi),
            vi(this, Mi),
            vi(this, ki),
            bi(this, Ti, { writable: !0, value: void 0 }),
            bi(this, Ei, { writable: !0, value: 0 }),
            bi(this, Ai, { writable: !0, value: !1 }),
            bi(this, Ii, { writable: !0, value: [] }),
            bi(this, Oi, { writable: !0, value: 0 }),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-module-uploads')),
            e.append(this.container),
            (this.gridElem = this.container.querySelector('.fpd-grid'))
          // #extracontainer-data now exists - load previously uploaded images
          // immediately so the grid is ready when the Images tab is first shown.
          window.fpdReloadUploadedImages &&
            window.fpdReloadUploadedImages(!0)
          const i = this.container.querySelector('.fpd-upload-image')
          Ci(this, Ti, t.mainOptions.allowedImageTypes),
            wi(this, Ti).includes('jpeg') &&
              !wi(this, Ti).includes('jpg') &&
              wi(this, Ti).push('jpg')
          const n = this.container.querySelector('.fpd-upload-input')
          let s = []
          if (
            (wi(this, Ti).forEach(t => {
              'pdf' == t
                ? s.push('application/pdf')
                : ('svg' == t && (t += '+xml'), s.push('image/' + t))
            }),
            n.setAttribute('accept', s.join()),
            G(i, 'click', async t => {
              t.preventDefault(), n.click()
            }),
            G(n, 'change', t => {
              xi(this, ki, Ni).call(this, t.currentTarget.files)
            }),
            G(i, ['dragover', 'dragleave'], t => {
              t.stopPropagation(),
                t.preventDefault(),
                t.currentTarget.classList.toggle(
                  'fpd-hover',
                  'dragover' === t.type
                )
            }),
            G(i, 'drop', t => {
              t.stopPropagation(), t.preventDefault()
              const e = t.target.files || t.dataTransfer.files
              xi(this, ki, Ni).call(this, e)
            }),
            G(t, 'productCreate', t => {
              Ci(this, Ai, !1)
            }),
            // This used to also re-render every item cached in
            // localStorage['fpd_uploaded_images'] into this.gridElem here.
            // loadItems() (in the shared item-creator scope above) already
            // renders the same user's uploads from the backend
            // (/api/image/getByUserId) into the sibling #extracontainer-data
            // grid in the same scroll area - so every image ended up shown
            // twice (once from this local cache, once from the API fetch).
            // The API is the source of truth (see the cache-reconciliation
            // added to loadItems()), so this local re-render is disabled -
            // always false, so the block below never runs, while the click/
            // change/drag listeners registered above (unaffected by this)
            // still work as before.
            false)
          ) {
            const t = JSON.parse(
              window.localStorage.getItem('fpd_uploaded_images')
            )
            t.forEach(e => {
              xi(this, Bi, Yi).call(this, e.url, e.title)
              const i = new Image()
              ;(i.src = e.url),
                (i.onerror = () => {
                  t.forEach((e, i) => {
                    t.splice(i, 1)
                  })
                })
            }),
              window.localStorage.setItem(
                'fpd_uploaded_images',
                JSON.stringify(t)
              )
          }
        }
      }
      function Ni (e) {
        if (this.fpdInstance.mainOptions.uploadAgreementModal) {
          var i = t(
            this.fpdInstance.translator.getTranslation(
              'modules',
              'images_agreement'
            ),
            !1,
            'confirm',
            this.fpdInstance.container
          )
          const n = i.querySelector('.fpd-confirm')
          ;(n.innerText = this.fpdInstance.translator.getTranslation(
            'modules',
            'images_confirm_button'
          )),
            G(n, ['click'], () => {
              xi(this, Mi, Hi).call(this, e), i.remove()
            })
        } else xi(this, Mi, Hi).call(this, e)
      }
      function Hi (t) {
        Ci(this, Ei, 0), Ci(this, Oi, t.length)
        for (var e = 0; e < this.fpdInstance.viewInstances.length; ++e)
          this.fpdInstance.getElements(e).forEach(t => {
            t.uploadZone && wi(this, Ii).push({ uz: t.title, viewIndex: e })
          })
        ;(this.fpdInstance.loadingCustomImage = !0),
          Array.from(t).forEach((t, e) => {
            wi(this, Ti).includes(it(t.name)) &&
              xi(this, Pi, zi).call(this, t, 0 == e)
          }),
          this.container
            .querySelector('.fpd-upload-image')
            .classList.remove('fpd-hover'),
          (this.container.querySelector('.fpd-upload-input').value = '')
      }
      function zi (t, e) {
        const i =
          1024 *
          this.fpdInstance.mainOptions.customImageParameters.maxSize *
          1024
        if (t.size > i)
          return (
            n(
              this.fpdInstance.translator
                .getTranslation('misc', 'maximum_size_info')
                .replace('%filename', t.name)
                .replace(
                  '%mb',
                  this.fpdInstance.mainOptions.customImageParameters.maxSize
                )
            ),
            void (this.fpdInstance.loadingCustomImage = !1)
          )
        'application/pdf' === t.type
          ? xi(this, Di, Vi).call(this, t, e)
          : xi(this, _i, Wi).call(this, t, e)
      }
      function Wi (t) {
        let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
        const i = this.fpdInstance.mainOptions,
          s = new FileReader()
        ;(s.onload = s => {
          const r = s.currentTarget.result,
            a = xi(this, Bi, Yi).call(this, r, t.name)
          if (FancyProductDesigner.uploadsToServer) {
            if (!i.fileServerURL) {
              a?.remove();
              alert('You need to set the fileServerURL in the option, otherwise file uploading does not work!');
              return;
            }

            // Prevent duplicate bars
            if (!a.querySelector('.fpd-loading-bar')) {
              ;
              a.classList.add('fpd-loading');

              // Create the loading bar and progress manually for more control
              const loadingBar = document.createElement('div');
              loadingBar.className = 'fpd-loading-bar';

              const progress = document.createElement('div');
              progress.className = 'fpd-loading-progress';
              progress.style.width = '0%';
              // progress.style.transition = 'width 10s linear';

              loadingBar.appendChild(progress);
              a.appendChild(loadingBar);
              ;
              // Trigger transition
              requestAnimationFrame(() => {
                progress.style.width = '100%';
              });

              // Remove after 10 seconds
              setTimeout(() => {
                ;
                a.classList.remove('fpd-loading');
                loadingBar.remove();
              }, 10000);
            }
          } else {
            ;
            var l;
            a.classList.remove('fpd-loading');

            const loadingBar = a.querySelector('.fpd-loading-bar');
            if (loadingBar) loadingBar.remove();

            ;
            xi(this, Li, Ui).call(this, s, t.name);
            xi(this, Fi, Gi).call(this, a, e);
            Ci(this, Ei, ((l = wi(this, Ei)), ++l));
          }

          const o = new Image()
          ;
          // if(o){
          //   const loadingBar = document.querySelector('.fpd-loading-bar');
          //   if (loadingBar) {
          //     loadingBar.remove();
          //   }
          // };
          // const checkSrcInterval = setInterval(() => {
          //   if (o.src && o.src !== '') {
          //     console.log('Image src set:', o.src);

          //     // Remove the loading bar
          //     const loadingBar = document.querySelector('.fpd-loading-bar');
          //     if (loadingBar) {
          //       loadingBar.remove();
          //     }

          //     clearInterval(checkSrcInterval); // Stop checking
          //   }
          // }, 100); 
          const fpdItem = document.querySelector('.fpd-item.fpd-hover-thumbnail.ts');

          if (fpdItem) {
            const observer = new MutationObserver((mutationsList) => {
              for (const mutation of mutationsList) {
                if (
                  mutation.type === 'attributes' &&
                  mutation.attributeName === 'class'
                ) {
                  const stillLoading = fpdItem.classList.contains('fpd-loading');

                  if (!stillLoading) {
                    ;

                    // Remove loading bar
                    const loadingBar = fpdItem.querySelector('.fpd-loading-bar');
                    if (loadingBar) {
                      loadingBar.remove();
                    }

                    // Stop observing once complete
                    observer.disconnect();
                  }
                }
              }
            });

            // Observe for class attribute changes
            observer.observe(fpdItem, { attributes: true });
          }
          (o.onload = i => {
            const s = i.currentTarget
            let r = s.height,
              o = s.width
            ;
            if (et(this.fpdInstance, o, r))
              if (FancyProductDesigner.uploadsToServer) {
                const i = new FormData()
                // Field name/extra fields must match the backend's multer
                // config: upload.single("image") on /api/image/upload, plus
                // userId/title so the Image document it saves (alongside the
                // S3 upload) validates - the Image schema requires userId.
                i.append('image', t)
                i.append('userId', 70011)
                i.append('title', t.name)
                const s = new XMLHttpRequest()
                ;(s.responseType = 'json'),
                  (s.onreadystatechange = t => {
                    ;
                    if (s.readyState === XMLHttpRequest.DONE) {
                      const t = s.status
                      ;
                      if (0 === t || (t >= 200 && t < 400)) {
                        const t = s.response
                        ;
                        a.classList.remove('fpd-loading')
                        var i
                        t.image_src &&
                          (xi(this, Li, Ui).call(this, t.image_src, t.filename),
                          (a.dataset.source = t.image_src),
                          a.classList.remove('fpd-loading'),
                          a.querySelector('.fpd-loading-bar').remove(),
                          xi(this, Fi, Gi).call(this, a, e),
                          Ci(this, Ei, ((i = wi(this, Ei)), ++i)),
                          (a.xhr = null)),
                          (this.fpdInstance.loadingCustomImage = !1)
                        // Force a full reload of the uploads grid from
                        // /api/image/getByUserId right after a successful
                        // upload, instead of only updating this one
                        // placeholder item in place - see
                        // window.fpdReloadUploadedImages's definition
                        // (loadItems, ~line 20949) for why a global
                        // exposure was needed to reach it from here.
                        ;t.image_src && window.fpdReloadUploadedImages && window.fpdReloadUploadedImages(true);
                      }
                    }
                  }),
                  (s.upload.onprogress = t => {
                    ;
                    let e = t.total,
                      i = t.loaded,
                      n = parseInt((100 * i) / e)
                    a.querySelector('.fpd-loading-progress').style.width =
                      n + '%'
                  }),
                  (s.upload.onerror = t => {
                    ;(this.fpdInstance.loadingCustomImage = !1),
                      a.remove(),
                      n(
                        'Upload failed. Please try again or check your web console!'
                      )
                  }),
                  s.open('POST', this.fpdInstance.getFileServerURL()),
                  s.send(i),
                  (a.xhr = s)
              } else {
                var l
                xi(this, Li, Ui).call(this, s, t.name),
                  xi(this, Fi, Gi).call(this, a, e),
                  Ci(this, Ei, ((l = wi(this, Ei)), ++l))
              }
            else {
              ;
              a.classList.remove('fpd-loading')
              a.remove(),
                (this.fpdInstance.currentViewInstance.currentUploadZone = null)
            }
          }),
            (o.src = r)
        }),
          s.readAsDataURL(t)
      }
      function Vi (t) {
        this.fpdInstance.mainOptions
        const e = n(
            this.fpdInstance.translator.getTranslation(
              'modules',
              'images_pdf_upload_info'
            ),
            !1
          ),
          i = new FormData()
        i.append('pdf', t)
        const s = new XMLHttpRequest()
        ;(s.responseType = 'json'),
          (s.onreadystatechange = t => {
            if (s.readyState === XMLHttpRequest.DONE) {
              const t = s.status
              if (0 === t || (t >= 200 && t < 400)) {
                var i, n
                const t = s.response
                Ci(this, Oi, ((i = wi(this, Oi)), --i)),
                  t.pdf_images.forEach((t, e) => {
                    var i
                    const n = xi(this, Bi, Yi).call(
                      this,
                      t.image_url,
                      t.filename
                    )
                    xi(this, Fi, Gi).call(this, n, 0 == e),
                      xi(this, Li, Ui).call(this, t.image_url, t.filename),
                      Ci(this, Ei, ((i = wi(this, Ei)), ++i))
                  }),
                  e.remove(),
                  Ci(this, Oi, ((n = wi(this, Oi)), ++n)),
                  (this.fpdInstance.loadingCustomImage = !1)
              }
            }
          }),
          (s.upload.onerror = () => {
            ;(this.fpdInstance.loadingCustomImage = !1),
              e.remove(),
              n('Upload failed. Please try again or check your web console!')
          }),
          s.open('POST', this.fpdInstance.getFileServerURL()),
          s.send(i)
      }
      function Ui (t, e) {
        if (K()) {
          var i = window.localStorage.getItem('fpd_uploaded_images')
              ? JSON.parse(window.localStorage.getItem('fpd_uploaded_images'))
              : [],
            n = { url: t, title: e }
          i.push(n),
            window.localStorage.setItem(
              'fpd_uploaded_images',
              JSON.stringify(i)
            )
        }
      }
      function Yi (t, e) {
        const i = $({
          url: t,
          title: e,
          price: tt(this.fpdInstance, this.container),
          removable: !0
        })
        return (
          xi(this, ji, qi).call(this, i, t),
          this.gridElem.append(i),
          this.fpdInstance.lazyBackgroundObserver.observe(
            i.querySelector('picture')
          ),
          G(i, ['click'], t => {
            this.fpdInstance.loadingCustomImage ||
              this.fpdInstance._addGridItemToCanvas(
                t.currentTarget,
                {},
                void 0,
                !1
              )
          }),
          G(i.querySelector('.fa-trash'), 'click', t => {
            ;
            t.stopPropagation(), t.preventDefault()
            const e = Array.from(this.gridElem.children).indexOf(i)
            i.remove()
            // if (!i.classList.contains('fpd-loading')) {
            //   var n = JSON.parse(
            //     window.localStorage.getItem('fpd_uploaded_images')
            //   )
            //   console.log('delete image 1', n)
            //   n.splice(e, 1),
            //     window.localStorage.setItem(
            //       'fpd_uploaded_images',
            //       JSON.stringify(n)
            //     ),
            //     i.xhr && i.xhr.abort(),
            //     i.remove()
            // }
          }),
          i
        )
      }
      function Gi (t, e) {
        // Used to auto-place the first uploaded file straight onto the
        // canvas here (via _addGridItemToCanvas). That meant the image ended
        // up added twice whenever the user then also clicked the new
        // thumbnail themselves - the normal, expected way to place any grid
        // item (designs/products work the same way: click-to-add only, no
        // auto-add). Dropped so upload only populates the grid; clicking the
        // thumbnail is the single way an image reaches the canvas.
        wi(this, Ei) == wi(this, Oi) - 1 && Ci(this, Ai, !0)
      }
      function qi (t, e) {
        const i = this.fpdInstance.mainOptions.imageQualityRatings
        if (i && 'object' == typeof i) {
          let n = i.low ? i.low : null,
            s = i.mid ? i.mid : null,
            r = i.high ? i.high : null,
            a = 'fpd-icon-star',
            o = 'fpd-icon-star-outline'
          const l = new Image()
          ;(l.onload = () => {
            const e = document.createElement('div')
            let i
            if (
              ((e.className = 'fpd-image-quality-ratings'),
              t.append(e),
              n && 2 == n.length)
            ) {
              const t =
                  l.width < Number(n[0]) || l.height < Number(n[1]) ? o : a,
                s = document.createElement('span')
              ;(s.className = t),
                e.append(s),
                t == a &&
                  (i = this.fpdInstance.translator.getTranslation(
                    'misc',
                    'image_quality_rating_low'
                  ))
            }
            if (s && 2 == s.length) {
              const t =
                  l.width < Number(s[0]) || l.height < Number(s[1]) ? o : a,
                n = document.createElement('span')
              ;(n.className = t),
                e.append(n),
                t == a &&
                  (i = this.fpdInstance.translator.getTranslation(
                    'misc',
                    'image_quality_rating_mid'
                  ))
            }
            if (r && 2 == r.length) {
              const t =
                  l.width < Number(r[0]) || l.height < Number(r[1]) ? o : a,
                n = document.createElement('span')
              ;(n.className = t),
                e.append(n),
                t == a &&
                  (i = this.fpdInstance.translator.getTranslation(
                    'misc',
                    'image_quality_rating_high'
                  ))
            }
            i && (e.dataset.qualityLabel = i)
          }),
            (l.src = e)
        }
      }
      window.FPDUploadsModule = Ri
      class Xi extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div class="fpd-head"> <div class="fpd-facebook-login"> <fb:login-button data-max-rows="1" data-show-faces="false" data-scope="user_photos,instagram_basic" class="w-[100%]"> </fb:login-button> </div> <fpd-dropdown class="fpd-facebook-albums" placeholder="Select An Album" searchable></fpd-dropdown> </div> <div class="fpd-scroll-area"> <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div> </div>'
        }
      }
      function Zi (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function Ji (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      customElements.define('fpd-module-facebook-images', Xi)
      var Qi = new WeakSet(),
        Ki = new WeakSet(),
        $i = new WeakSet()
      class tn extends EventTarget {
        constructor (t, e) {
          super(),
            Zi(this, $i),
            Zi(this, Ki),
            Zi(this, Qi),
            (this.fpdInstance = t),
            (this.container = document.createElement(
              'fpd-module-facebook-images'
            )),
            e.append(this.container),
            (this.dropdown = this.container.querySelector('fpd-dropdown')),
            (this.dropdownList = this.container.querySelector(
              '.fpd-dropdown-list > .fpd-scroll-area'
            )),
            (this.gridElem = this.container.querySelector('.fpd-grid')),
            Ji(this, Qi, en).call(this)
        }
      }
      function en () {
        const t = document.createElement('script')
        ;(t.src = '//connect.facebook.com/en_US/sdk.js'),
          t.addEventListener('load', () => {
            FB.init({
              appId: this.fpdInstance.mainOptions.facebookAppId,
              autoLogAppEvents: !0,
              xfbml: !0,
              version: 'v16.0'
            }),
              FB.getLoginStatus(Ji(this, Ki, nn).bind(this)),
              FB.Event.subscribe(
                'auth.statusChange',
                Ji(this, Ki, nn).bind(this)
              )
          }),
          document.body.appendChild(t)
      }
      function nn (t) {
        ;
        'connected' === t.status &&
          (X(this.container, ['fpd-facebook-logged-in']),
          FB.api('/me/albums?fields=name,count,id', t => {
            ;
            const e = t.data
            ;
            e &&
              e.forEach(t => {
                const e = document.createElement('span')
                ;(e.className = 'fpd-item'),
                  (e.dataset.albumid = t.id),
                  (e.innerText = t.name),
                  e.addEventListener('click', t => {
                    this.dropdown.setAttribute(
                      'value',
                      t.currentTarget.innerText
                    ),
                      Ji(this, $i, sn).call(
                        this,
                        t.currentTarget.dataset.albumid
                      )
                  }),
                  this.dropdownList.append(e)
              }),
              Z(this.dropdown, ['fpd-on-loading'])
          }))
      }
      function sn (t) {
        ;(this.gridElem.innerHTML = ''),
          X(this.dropdown, ['fpd-on-loading']),
          FB.api('/' + t + '?fields=count', e => {
            const i = e.count
            FB.api(
              '/' + t + '?fields=photos.limit(' + i + ').fields(source,images)',
              t => {
                Z(this.dropdown, ['fpd-on-loading']),
                  t.error ||
                    t.photos.data.forEach(t => {
                      const e = t.images[0] ? t.images[0].source : t.source,
                        i = t.images[t.images.length - 1]
                          ? t.images[t.images.length - 1].source
                          : t.source,
                        n = $({
                          url: e,
                          thumbnailUrl: i,
                          title: t.id,
                          price: tt(this.fpdInstance, this.container)
                        })
                      G(n, ['click'], t => {
                        this.fpdInstance.loadingCustomImage ||
                          this.fpdInstance._addGridItemToCanvas(t.currentTarget)
                      }),
                        this.gridElem.append(n),
                        this.fpdInstance.lazyBackgroundObserver.observe(
                          n.querySelector('picture')
                        )
                    }),
                  this.fpdInstance.toggleSpinner(!1)
              }
            )
          })
      }
      class rn extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div class="fpd-scroll-area"> <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div> </div>'
        }
      }
      function an (t, e) {
        !(function (t, e) {
          if (e.has(t))
            throw new TypeError(
              'Cannot initialize the same private elements twice on an object'
            )
        })(t, e),
          e.add(t)
      }
      function on (t, e, i) {
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
      function ln (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      customElements.define('fpd-module-instagram-images', rn)
      var cn = new WeakSet(),
        hn = new WeakSet(),
        dn = new WeakSet()
      class un extends EventTarget {
        constructor (t, e) {
          super(),
            an(this, dn),
            an(this, hn),
            an(this, cn),
            on(this, 'accessToken', null),
            on(this, 'nextStack', null),
            on(this, 'loadingStack', !1),
            on(this, 'scrollArea', null),
            (this.fpdInstance = t),
            (this.container = document.createElement(
              'fpd-module-instagram-images'
            )),
            e.append(this.container),
            (this.gridElem = this.container.querySelector('.fpd-grid')),
            (this.scrollArea =
              this.container.querySelector('.fpd-scroll-area')),
            this.scrollArea.addEventListener(
              'scroll',
              ln(this, dn, gn).bind(this)
            )
        }
        authenticate () {
          const t = this.fpdInstance.mainOptions
          if (K()) {
            const t = window.localStorage.getItem('fpd_insta_access_token')
            if (!Q(t))
              return (this.accessToken = t), void ln(this, hn, pn).call(this)
          }
          let e = (window.screen.width - 700) / 2,
            i = (window.screen.height - 500) / 2,
            n = {
              app_id: t.instagramClientId,
              redirect_uri: t.instagramRedirectUri,
              scope:
                'user_profile,user_media,instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights',
              response_type: 'code'
            },
            s = new URLSearchParams(n).toString()
          var r = window.open(
              'https://www.instagram.com/oauth/authorize?force_reauth=true&client_id=1097562038908175&redirect_uri=https://sfdesigner-new.firebaseapp.com/&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights',
              'width=700,height=500,left=' + e + ',top=' + i
            ),
            a = setInterval(() => {
              r.closed && clearInterval(a)
              try {
                if (r.location && r.location.href) {
                  var t = new URL(r.location.href).searchParams.get('code')
                  t &&
                    ((t = t.replace('#_', '')),
                    ln(this, cn, fn).call(this, t),
                    r.close())
                }
              } catch (t) {}
            }, 500)
        }
      }
      function fn (t) {
        const e = this.fpdInstance.mainOptions
        this.fpdInstance.toggleSpinner(!0),
          Vt({
            url: e.instagramTokenUri,
            params: {
              code: t,
              client_app_id: e.instagramClientId,
              redirect_uri: e.instagramRedirectUri
            },
            onSuccess: t => {
              t.access_token
                ? (K() &&
                    window.localStorage.setItem(
                      'fpd_insta_access_token',
                      t.access_token
                    ),
                  (this.accessToken = t.access_token),
                  ln(this, hn, pn).call(this))
                : t.error_message && this.fpdInstance.toggleSpinner(!1)
            },
            onError: t => {
              this.fpdInstance.toggleSpinner(!1)
            }
          })
      }
      function pn () {
        let t =
            arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : 'https://graph.instagram.com/me/media',
          e = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
        ;(this.loadingStack = !0), this.fpdInstance.toggleSpinner(!0)
        let i = {
          url: t,
          onSuccess: t => {
            t.data &&
              ((this.nextStack =
                t.paging && t.paging.next ? t.paging.next : null),
              t.data.forEach(t => {
                if ('VIDEO' !== t.media_type) {
                  const e = $({
                    url: t.media_url,
                    thumbnailUrl: t.thumbnail_url
                      ? t.thumbnail_url
                      : t.media_url,
                    title: t.id,
                    price: tt(this.fpdInstance, this.container)
                  })
                  G(e, ['click'], t => {
                    this.fpdInstance.loadingCustomImage ||
                      this.fpdInstance._addGridItemToCanvas(t.currentTarget)
                  }),
                    this.gridElem.append(e),
                    this.fpdInstance.lazyBackgroundObserver.observe(
                      e.querySelector('picture')
                    )
                }
              })),
              this.fpdInstance.toggleSpinner(!1),
              (this.loadingStack = !1),
              ln(this, dn, gn).call(this)
          },
          onError: t => {
            t.response &&
              t.response.error &&
              t.response.error.code &&
              K() &&
              190 == t.response.error.code &&
              (window.localStorage.removeItem('fpd_insta_access_token'),
              (this.accessToken = null),
              this.authenticate()),
              this.fpdInstance.toggleSpinner(!1),
              (this.loadingStack = !1)
          }
        }
        e &&
          ((this.gridElem.innerHTML = ''),
          (i.params = {
            fields: 'id,caption,media_url,media_type',
            access_token: this.accessToken
          })),
          Vt(i)
      }
      function gn () {
        let t = this.scrollArea.scrollHeight
        ;(this.scrollArea.clientHeight + this.scrollArea.scrollTop + 100 > t ||
          this.gridElem.clientHeight < t) &&
          (null === this.nextStack ||
            this.loadingStack ||
            ln(this, hn, pn).call(this, this.nextStack, !1))
      }
      class mn extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div class="fpd-loader-wrapper"> <div class="fpd-loader"> <div class="fpd-loader-circle"></div> </div> </div> <div class="fpd-head"> <a href="https://pixabay.com/" target="_blank" class="fpd-pixabay-logo"> </a> <div class="fpd-input-search !bg-white"> <input type="text" data-defaulttext="Search in Pixabay library" placeholder="modules.pixabay_search"/> <span class="fpd-icon-magnify"></span> </div> </div> <div class="fpd-scroll-area"> <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div> </div>'
        }
      }
      customElements.define('fpd-module-pixabay-images', mn)
      class vn extends EventTarget {
        loadingStack = !1
        currentQuery = ''
        pixabayPage = 1
        constructor (t, e) {
          super(),
            (this.fpdInstance = t),
            (this.container = document.createElement(
              'fpd-module-pixabay-images'
            )),
            e.append(this.container),
            (this.gridElem = this.container.querySelector('.fpd-grid')),
            (this.loader = this.container.querySelector('.fpd-loader-wrapper'))
          const i = this.container.querySelector('.fpd-scroll-area')
          i.addEventListener('scroll', t => {
            let e = i.scrollHeight
            i.clientHeight + i.scrollTop + 100 > e &&
              (this.loadingStack ||
                (this.pixabayPage++, this.loadImages(void 0, !1)))
          }),
            G(this.container.querySelector('input'), ['keypress'], t => {
              13 == t.which &&
                ((this.pixabayPage = 1), this.loadImages(t.currentTarget.value))
            })
        }
        loadImages (t) {
          let e =
            !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
          if (this.currentQuery === t) return !1
          const i = this.fpdInstance.mainOptions
          ;(this.loadingStack = !0),
            (this.currentQuery = void 0 === t ? this.currentQuery : t)
          var n = i.pixabayHighResImages
              ? '&response_group=high_resolution'
              : '',
            s =
              'https://pixabay.com/api/?safesearch=true&key=' +
              i.pixabayApiKey +
              '&page=' +
              this.pixabayPage +
              '&per_page=40&min_width=' +
              i.customImageParameters.minW +
              '&min_height=' +
              i.customImageParameters.minH +
              n +
              '&q=' +
              encodeURIComponent(this.currentQuery) +
              '&lang=' +
              i.pixabayLang
          e && (this.gridElem.innerHTML = ''),
            Z(this.loader, ['fpd-hidden']),
            Vt({
              url: s,
              onSuccess: t => {
                ;
                X(this.loader, ['fpd-hidden']),
                  t.hits.length > 0 &&
                    t.hits.forEach(t => {
                      const e = $({
                        url: t.imageURL || t.largeImageURL || t.fullHDURL || t.webformatURL,
                        thumbnailUrl: t.webformatURL,
                        title: t.id ? t.id : t.id_hash,
                        price: tt(this.fpdInstance, this.container)
                      })

                      ;
                      G(e, ['click'], t => {
                        const item = t.currentTarget
                        if (!item) return
                        this.fpdInstance.addCanvasDesign(
                          item.dataset.source,
                          item.dataset.title
                        )
                      })
                      this.gridElem.append(e),
                        this.fpdInstance.lazyBackgroundObserver.observe(
                          e.querySelector('picture')
                        )
                    }),
                  (this.loadingStack = !1)
              },
              onError: t => {
                ;
                X(this.loader, ['fpd-hidden'])
              }
            })
        }
      }
      class bn extends HTMLElement {
        constructor () {
          super()
        }
        connectedCallback () {
          this.innerHTML =
            '<div class="fpd-head"> <div class="fpd-info" data-defaulttext="Describe your image">modules.text_to_images_info</div> <textarea placeholder="e.g. Beautiful sunset with a white sandy beach"></textarea> <span class="fpd-btn" data-defaulttext="Generate">modules.text_to_images_generate</span> </div> <div class="fpd-scroll-area"> <div class="fpd-grid fpd-grid-cover fpd-photo-grid"></div> </div>'
        }
      }
      function yn (t, e) {
        xn(t, e), e.add(t)
      }
      function xn (t, e) {
        if (e.has(t))
          throw new TypeError(
            'Cannot initialize the same private elements twice on an object'
          )
      }
      function wn (t, e, i) {
        if (!e.has(t))
          throw new TypeError('attempted to get private field on non-instance')
        return i
      }
      function Cn (t, e, i) {
        return (
          (function (t, e, i) {
            if (e.set) e.set.call(t, i)
            else {
              if (!e.writable)
                throw new TypeError('attempted to set read only private field')
              e.value = i
            }
          })(t, Sn(t, e, 'set'), i),
          i
        )
      }
      function Sn (t, e, i) {
        if (!e.has(t))
          throw new TypeError(
            'attempted to ' + i + ' private field on non-instance'
          )
        return e.get(t)
      }
      customElements.define('fpd-module-text-to-image', bn)
      var Tn = new WeakMap(),
        En = new WeakSet(),
        An = new WeakSet()
      class In extends EventTarget {
        constructor (t, e) {
          var i, n
          super(),
            yn(this, An),
            yn(this, En),
            (n = { writable: !0, value: !1 }),
            xn(this, (i = Tn)),
            i.set(this, n),
            (this.fpdInstance = t),
            (this.container = document.createElement(
              'fpd-module-text-to-image'
            )),
            e.append(this.container),
            (this.inputElem =
              this.container.querySelector('.fpd-head textarea')),
            (this.gridElem = this.container.querySelector('.fpd-grid')),
            this.container
              .querySelector('.fpd-head .fpd-btn')
              .addEventListener('click', e => {
                const i = e.currentTarget
                Q(this.inputElem.value) ||
                  (function (t, e) {
                    return (function (t, e) {
                      return e.get ? e.get.call(t) : e.value
                    })(t, Sn(t, e, 'get'))
                  })(this, Tn) ||
                  (Cn(this, Tn, !0),
                  i.classList.add('fpd-loading'),
                  Ut({
                    url: t.mainOptions.aiService.serverURL,
                    body: { service: 'text2Img', prompt: this.inputElem.value },
                    onSuccess: e => {
                      ;
                      e && e.images
                        ? (wn(this, An, kn).call(this, e.images),
                          e.images.forEach(t => {
                            if (K()) {
                              let e =
                                window.localStorage.getItem('fpd_ai_images')
                              ;(e = e ? JSON.parse(e) : []),
                                e.push(t),
                                window.localStorage.setItem(
                                  'fpd_ai_images',
                                  JSON.stringify(e)
                                )
                            }
                          }))
                        : t.aiRequestError(e.error),
                        Cn(this, Tn, !1),
                        i.classList.remove('fpd-loading')
                    },
                    onError: () => {
                      Cn(this, Tn, !1),
                        i.classList.remove('fpd-loading'),
                        t.aiRequestError.bind(t)
                    }
                  }))
              }),
            G(t, 'productCreate', wn(this, En, On).bind(this))
        }
      }
      function On () {
        this.gridElem.innerHTML = ''
        let t = window.localStorage.getItem('fpd_ai_images')
        K() && t && ((t = JSON.parse(t)), wn(this, An, kn).call(this, t))
      }
      function kn () {
        ;(arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : []
        ).forEach(t => {
          const e = $({
            url: t,
            title: nt(t),
            price: tt(this.fpdInstance, this.container),
            removable: !0
          })
          this.gridElem.prepend(e),
            this.fpdInstance.lazyBackgroundObserver.observe(
              e.querySelector('picture')
            ),
            G(e, ['click'], t => {
              this.fpdInstance.loadingCustomImage ||
                this.fpdInstance._addGridItemToCanvas(t.currentTarget)
            }),
            G(e.querySelector('.fa-trash'), 'click', t => {
              t.stopPropagation(), t.preventDefault()
              const i = Array.from(this.gridElem.children).indexOf(e)
              if (!e.classList.contains('fpd-loading')) {
                let t = JSON.parse(window.localStorage.getItem('fpd_ai_images'))
                t.splice(i, 1),
                  window.localStorage.setItem(
                    'fpd_ai_images',
                    JSON.stringify(t)
                  ),
                  e.xhr && e.xhr.abort(),
                  e.remove()
              }
            })
        })
      }
      window.FPDTextToImageModule = In
      class Mn extends EventTarget {
        constructor (t, e) {
          super(),
            (this.fpdInstance = t),
            (this.container = document.createElement('fpd-module-images')),
            e.append(this.container)
          const i = Array.from(
              this.container.querySelectorAll('.fpd-module-tabs > div')
            ),
            n = Array.from(
              this.container.querySelectorAll('.fpd-module-tabs-content > div')
            )
          let s = null,
            r = null
          G(i, 'click', t => {
            const e = t.currentTarget
            Z(i, ['fpd-active']),
              Z(n, ['fpd-active']),
              X(e, ['fpd-active']),
              X(
                n.find(t => t.dataset.context == e.dataset.context),
                ['fpd-active']
              ),
              'instagram' == e.dataset.context && s && !s.accessToken
                ? s.authenticate()
                : 'pixabay' == e.dataset.context && r && r.loadImages()
          })
          const a = t.mainOptions
          new Ri(
            t,
            n.find(t => 'upload' == t.dataset.context)
          ),
            G(t, ['viewSelect', 'secondaryModuleCalled'], e => {
              const i = tt(t, this.container),
                n = this.container.querySelectorAll('.fpd-price')
              n &&
                (J(n, ['fpd-hidden'], !Boolean(i)),
                n.forEach(t => {
                  t.innerHTML = i
                }))
            }),
            Q(a.facebookAppId) ||
              (new tn(
                t,
                n.find(t => 'facebook' == t.dataset.context)
              ),
              i
                .find(t => 'facebook' == t.dataset.context)
                .classList.remove('fpd-hidden')),
            Q(a.instagramClientId) ||
              ((s = new un(
                t,
                n.find(t => 'instagram' == t.dataset.context)
              )),
              i
                .find(t => 'instagram' == t.dataset.context)
                .classList.remove('fpd-hidden')),
            Q(a.pixabayApiKey) ||
              ((r = new vn(
                t,
                n.find(t => 'pixabay' == t.dataset.context)
              )),
              i
                .find(t => 'pixabay' == t.dataset.context)
                .classList.remove('fpd-hidden')),
            !Q(a.aiService.serverURL) &&
              a.aiService.text2Img &&
              (new In(
                t,
                n.find(t => 'text2Img' == t.dataset.context)
              ),
              i
                .find(t => 'text2Img' == t.dataset.context)
                .classList.remove('fpd-hidden')),
            new me(
              t,
              n.find(t => 'qr-code' == t.dataset.context)
            ),
            i.filter(t => !t.classList.contains('fpd-hidden')).length < 2 &&
              this.container.classList.add('fpd-hide-tabs')
        }
      }
      window.FPDImagesModule = Mn