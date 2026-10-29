
/*
 * FancyProductDesigner - part 6/6: main engine class & boot
 * ---------------------------------------------------------------------
 * The main FancyProductDesigner orchestrator class (product/view
 * loading, options, event wiring) and the final boot sequence that
 * assigns window.FancyProductDesigner.
 */

      class Ho extends EventTarget {
        constructor (t) {
          let e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          if (
            (super(),
            yo(this, No),
            yo(this, Ro),
            yo(this, jo),
            yo(this, Fo),
            yo(this, Bo),
            yo(this, Lo),
            yo(this, Do),
            yo(this, _o),
            yo(this, Po),
            yo(this, Mo),
            yo(this, ko),
            Co(this, 'container', null),
            Co(this, 'mainOptions', {}),
            Co(this, 'currentViewInstance', null),
            Co(this, 'currentViewIndex', 0),
            Co(this, 'products', []),
            Co(this, 'productsnew', []),
            Co(this, 'designs', []),
            Co(this, 'designsnew', []),
            Co(this, 'modalContainer', document.body),
            Co(this, 'currentCategoryIndex', 0),
            Co(this, 'currentProductIndex', 0),
            Co(this, 'viewInstances', []),
            Co(this, 'productViews', null),
            Co(this, 'currentElement', null),
            Co(this, 'productCreated', !1),
            Co(this, 'colorLinkGroups', {}),
            Co(this, 'globalCustomElements', []),
            Co(this, 'doUnsavedAlert', !1),
            Co(this, 'currentPrice', 0),
            Co(this, 'singleProductPrice', 0),
            Co(this, 'pricingRulesPrice', 0),
            Co(this, 'watermarkImg', null),
            Co(this, 'currentLayouts', []),
            Co(this, 'orderQuantity', 1),
            Co(this, 'bulkVariations', null),
            Co(this, 'industryType', null),
            Co(this, 'loadingCustomImage', !1),
            Co(this, 'lazyBackgroundObserver', null),
            Co(this, 'draggedPlaceholder', null),
            Co(this, 'mouseOverCanvas', !1),
            Co(this, 'firstProductCreated', !1),
            xo(this, Io, { writable: !0, value: 0 }),
            xo(this, Oo, { writable: !0, value: 0 }),
            Co(this, 'inTextField', !1),
            Co(this, '_order', {}),
            !t)
          )
            return void console.log('No DOM element found for FPD.')
          ;(this.lazyBackgroundObserver = new IntersectionObserver(t => {
            t.forEach(t => {
              t.isIntersecting &&
                ((function (t) {
                  let e =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : null
                  if (t) {
                    t.classList.add('fpd-on-loading')
                    var i = new Image()
                    ;(i.src = e || t.dataset.img),
                      (i.onload = function () {
                        ;(t.dataset.originwidth = this.width),
                          (t.dataset.originheight = this.height),
                          t.classList.remove('fpd-on-loading'),
                          (t.style.backgroundImage = 'url("' + this.src + '")')
                      }),
                      (i.onerror = function () {
                        t.parentNode.remove()
                      })
                  }
                })(t.target),
                this.lazyBackgroundObserver.unobserve(t.target))
            })
          })),
            (this.container = t),
            (this.container.instance = this),
            (this.mainOptions = dt.merge(dt.defaults, e))
          let i = {}
          Object.keys(this.mainOptions.hexNames).forEach(t => {
            i[t.toLowerCase()] = this.mainOptions.hexNames[t]
          }),
            (this.mainOptions.hexNames = i),
            (this.mainOptions.textParameters.direction =
              window.getComputedStyle(
                document.body || document.documentElement
              ).direction),
            'rtl' == this.mainOptions.textParameters.direction &&
              (this.mainOptions.textParameters.textAlign = 'right'),
            'advanced' == this.mainOptions.cornerControlsStyle &&
              (At(),
              window.document.fonts &&
                document.fonts
                  .load('16px FontFPD')
                  .then(() => {
                    // The corner control icons (copy/delete/rotate/resize)
                    // are drawn on the canvas with this icon font. If it
                    // wasn't loaded yet when a control was first rendered,
                    // the icons show up blank until something else forces
                    // a re-render. Re-render as soon as the font is ready
                    // so they appear immediately instead of needing extra
                    // clicks.
                    this.currentViewInstance &&
                      this.currentViewInstance.fabricCanvas.renderAll()
                  })
                  .catch(() => {})),
            (t.classList.contains('fpd-off-canvas') ||
              t.classList.contains('fpd-topbar')) &&
              (this.mainOptions.toolbarPlacement = 'smart'),
            Array.isArray(this.mainOptions.pricingRules) &&
              this.mainOptions.pricingRules.length &&
              (this.pricingRulesInstance = new bt(this)),
            this.mainOptions.editorMode &&
              X(document.body, ['fpd-editor-mode']),
            (this.translator = new Yt()),
            this.translator.loadLangJSON(
              this.mainOptions.langJSON,
              Ao(this, ko, zo).bind(this)
            )
        }
        setupProducts () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []
          ;
          const groupedCategories = t.map(item => ({
            category: item.category,
            subcategory: item.subcategory
          }));
          ;
          // Save to localStorage
          localStorage.setItem('fpd-grouped-categories', '');
          localStorage.setItem('fpd-grouped-categories', JSON.stringify(groupedCategories));
            (this.products = []),
            t.forEach(t => {
              t.hasOwnProperty('category')
                ? t.products.forEach(e => {
                    this.addProduct(e, t.category)
                  })
                : this.addProduct(t)
            })
          if (typeof window !== 'undefined') {
            //   let loc =  window.localStorage.getitem('indexofProduct');
            //   console.log(loc,'locccccccc')
          }

          // this.mainOptions.loadFirstProductInStage && t.length > 0 ? this.selectProduct(0) : this.toggleSpinner(!1),
          q(this, 'productsSet', {})
          ;
        }
        setupProductsNew () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []
          ;(this.productsnew = [])

          t.forEach(tItem => {
            const category = tItem.category

            if (tItem.hasOwnProperty('category')) {
              tItem.products.forEach(product => {
                // Check if category already exists
                const existingCategory = this.productsnew.find(
                  p => p.category === category
                )

                if (existingCategory) {
                  existingCategory.products.push(product)
                  if (
                    !existingCategory.subcategory &&
                    tItem.subcategory
                  ) {
                    existingCategory.subcategory = tItem.subcategory
                  }
                } else {
                  this.productsnew.push({
                    category: category,
                    subcategory: tItem.subcategory,
                    products: [product]
                  })
                }
              })
            } else {
              // Handle case where tItem is directly a product (no category)
              this.addProductNew(tItem)
            }
          })

          ;
          this.mainOptions.loadFirstProductInStage && t.length > 0
              ? this.selectProduct(0)
              : this.toggleSpinner(!1),
            q(this, 'productsSet', {})
        }
        get product () {
          return this._productSource
        }
        set product (t) {
          this._productsLoadToken = (this._productsLoadToken || 0) + 1
          this._productSource = t
          this.setupProducts(Array.isArray(t) ? t : [])
        }

        setupDesigns (t) {
          ;(this.designs = t), q(this, 'designsSet', {})
        }
        addProductNew (t, e) {
          ;
          var i = Ao(this, _o, Uo).call(this, e)
          ;
          void 0 === e
            ? this.productsnew.push(t)
            : (!1 === i &&
                ((i = this.productsnew.length),
                (this.productsnew[i] = { category: e, products: [] })),
              this.productsnew[i].products.push(t)),
            q(this, 'productAddNew', { views: t, category: e, catIndex: i })
        }
        addProduct (t, e) {
          ;
          var i = Ao(this, _o, Uo).call(this, e)
          void 0 === e
            ? this.products.push(t)
            : (!1 === i &&
                ((i = this.products.length),
                (this.products[i] = { category: e, products: [] })),
              this.products[i].products.push(t)),
            q(this, 'productAdd', { views: t, category: e, catIndex: i })
        }

        selectProduct (t, e) {
          ;
          const fpdInstance = this.container.instance
          // Store to variable
          // this.fpdInstance = fpdInstance;
          if (e == undefined) {
            this.currentCategoryIndex = 0
          } else {
            this.currentCategoryIndex = e
          }
          // this.currentCategoryIndex = e;
          this.currentProductIndex = t
          ;
          let i
          const savedId = localStorage.getItem('parentDivId')
          ;
          if (savedId === 'ProductModule') {
            ;
            To(this, Io, To(this, Oo, 0)),
              (this.currentCategoryIndex =
                void 0 === e ? this.currentCategoryIndex : e),
              (i =
                this.products &&
                this.products.length &&
                this.products[0].category
                  ? this.products[this.currentCategoryIndex].products
                  : this.products),
              (this.currentProductIndex = t),
              t < 0
                ? (this.currentProductIndex = 0)
                : t > i.length - 1 && (this.currentProductIndex = i.length - 1)
            ;
            const n = i[this.currentProductIndex]
            // const n = i[0];
            let valueofTitle = localStorage.getItem('valueofTitle')
            ;
            if (
              valueofTitle === null ||
              valueofTitle === 'undefined' ||
              valueofTitle === ''
            ) {
              ;
              const n = i[this.currentProductIndex]
              ;

              ;

              ;
              if (n.length > 1) {
                if (valueofTitle === null || valueofTitle === 'undefined') {
                  ;
                } else {
                  ;
                }
              }
              let valueofUE = localStorage.getItem('UE')
              let facesListed = false
              if (valueofUE === 'true') {
                const container = document.querySelector('.ProductModuleMy')
                ;
                if (container && Array.isArray(n) && n.length >= 1) {
                  facesListed = true
                  const productModuleEl = document.querySelector('.ProductModule')
                  const backbuttonStoP = document.getElementById('backbuttonStoP')
                  const productsModuleEl = document.querySelector('fpd-module-products')
                  if (productModuleEl) productModuleEl.style.display = 'none'
                  container.style.display = 'grid'
                  if (backbuttonStoP) backbuttonStoP.style.display = 'block'
                  if (productsModuleEl) productsModuleEl.classList.add('valueoffpdmoduleproducts-active')
                }
                n.forEach((e, i) => {
                  ;
                  if (container) {
                    let n = e.thumbnail,
                      s = e.title ? e.title : e.productTitle,
                      pr = e.price ? e.price : 10,
                      th = e.manufacturer ? e.manufacturer : 'Styleflip',
                      sct = e.subcategorytype ? e.subcategorytype : 'General'
                    const r = document.createElement('div')
                    r.className =
                      'mt-1 fpd-item fpd-hover-thumbnail text skins-det'
                    r.dataset.title = s
                    r.dataset.index = i
                    r.dataset.source = n
                    r.dataset.index = i
                    r.dataset.manufacturer = th

                    const a = document.createElement('picture')
                    a.className = 'flex'
                    a.dataset.img = n
                    a.style.backgroundImage = `url("${n}")`
                    r.append(a)

                    // ========== Append Product Name Label ==========
                    const label = document.createElement('div')
                    label.className =
                      'fpd-label text-center mt-0 text-xs text-gray-700 truncate max-w-[130px] overflow-hidden whitespace-nowrap mb-1 h-[30px]'
                    label.title = s
                    label.textContent = s
                    r.append(label)

                    const manufacturer = document.createElement('div')
                    manufacturer.className =
                      'fpd-label text-center mt-0 text-xs font-bold text-gray-900 truncate max-w-[130px] overflow-hidden whitespace-nowrap h-[30px] mb-2'
                    manufacturer.productTitle = pr
                    manufacturer.textContent = '$' + pr
                    r.append(manufacturer)

                    container.appendChild(r)

                    r.addEventListener('click', e => {
                      if (e.isTrusted) window.__fpdUserInteracted = true
                      document.body.classList.add('popup-open-hide-body');
                      try {
                      ;
                      ;
                      ;
                      let valueofTitleActiveDatais = window.localStorage.getItem('valueofTitleActiveDatais');
                      ;
                      let clickedTitleProdcutInside = window.localStorage.getItem('clickedTitleProdcutInside');
                      ;
                      let valueofTitle = e?.srcElement.dataset.title;
                      const matchedProducts = fpdInstance.products.filter(product => {
                        return product.category === valueofTitleActiveDatais;
                      });
                      const matchedProductsdata = matchedProducts[0]?.products || [];
                      const flatProducts = matchedProductsdata.flat();
                      const sortedProducts = flatProducts.find(item =>
                          item?.productTitle === clickedTitleProdcutInside &&
                          item?.title === valueofTitle
                        );

                      ;
                      ;
                      ;
                      localStorage.setItem('valueofTitle', valueofTitle)
                      // e = sortedProducts ? sortedProducts : e;
                      if (
                        (e.preventDefault(),
                        fpdInstance.mainOptions.swapProductConfirmation)
                      ) {
                        var n = t(
                          fpdInstance.translator.getTranslation(
                            'modules',
                            'products_confirm_replacement'
                          ),
                          !1,
                          'confirm',
                          this.fpdInstance.container
                        )
                        const eBtn = n.querySelector('.fpd-confirm')
                        eBtn.innerText = fpdInstance.translator.getTranslation(
                          'modules',
                          'products_confirm_button'
                        )

                        G(eBtn, ['click'], () => {
                          ;
                          fpdInstance.selectProduct(
                            i,
                            this.currentCategoryIndex
                          )
                          n.remove()
                        })
                      } else {
                        ;
                        localStorage.setItem('rdatasetindex', r.dataset.index)
                        fpdInstance.selectProduct(
                          Number(r.dataset.index),
                          this.currentCategoryIndex
                        )
                        // const modal = t(
                        //     fpdInstance.translator.getTranslation("modules", "products_confirm_replacement"),
                        //     false,
                        //     "confirm",
                        //     fpdInstance.container
                        // );
                        // const confirmBtn = modal.querySelector(".fpd-confirm");
                        // confirmBtn.innerText = fpdInstance.translator.getTranslation("modules", "products_confirm_button");

                        // const target = e.currentTarget;
                        // G(confirmBtn, ["click"], () => {
                        //     modal.remove();
                        //     console.log("Anoop Data 5-1");
                        //     localStorage.setItem('UE', true);
                        //     fpdInstance.selectProduct(Number(target.dataset.index), this.currentCategoryIndex);
                        // });
                      }
                      } catch (err) {
                        console.error('Error while swapping product face:', err);
                      } finally {
                      setTimeout(() => {
                        document.body.classList.remove('popup-open-hide-body');
                      }, 2000);
                      }
                      //  const i = Array.from(r.querySelectorAll(".fpd-item")).indexOf(s);
                      // fpdInstance.selectView(i), this.reset();
                    })

                    // ========== Append to Grid ==========
                    // this.container.querySelector(".fpd-grid").append(r);
                  }
                })
              }
              localStorage.setItem('dataskins', JSON.stringify(n))
              ;
              if (!facesListed) {
                this.loadProduct(n, this.mainOptions.replaceInitialElements)
              }
            } else {
              // n = i[this.currentProductIndex]
              ;
              const flatArray = i.flat() // Flatten the nested structure
              ;
              let clickedTitleProdcutInside = window.localStorage.getItem('clickedTitleProdcutInside');
              p = [flatArray.find(
                    item =>
                      item.title === valueofTitle &&
                      item.productTitle === clickedTitleProdcutInside
                  )];
              ;
              if (p[0] === undefined || p[0] === null) {
                p = [flatArray.find(item => item.productTitle === valueofTitle)]
                ;
              }
              // p = this.sortedProducts ? this.sortedProducts : p;
              ;
              this.loadProduct(p, this.mainOptions.replaceInitialElements)
            }
          } else if (savedId === 'DesignModule') {
            // Design-tab products (this.productsnew) aren't grouped into
            // face/variant lists the way this.products is - they load
            // directly onto the canvas, same as the products tab's
            // catch-all fallback below (which this branch mirrors).
            ;
            To(this, Io, To(this, Oo, 0)),
              (this.currentCategoryIndex =
                void 0 === e ? this.currentCategoryIndex : e),
              (i =
                this.productsnew &&
                this.productsnew.length &&
                this.productsnew[0].category
                  ? this.productsnew[this.currentCategoryIndex]?.products
                  : this.productsnew),
              (this.currentProductIndex = t),
              t < 0
                ? (this.currentProductIndex = 0)
                : t > i.length - 1 && (this.currentProductIndex = i.length - 1)
            ;
            const n = i[this.currentProductIndex]
            ;
            this.loadProduct(n, this.mainOptions.replaceInitialElements)
          } else {
            ;
            To(this, Io, To(this, Oo, 0)),
              (this.currentCategoryIndex =
                void 0 === e ? this.currentCategoryIndex : e),
              (i =
                this.productsnew &&
                this.productsnew.length &&
                this.productsnew[0].category
                  ? this.productsnew[this.currentCategoryIndex]?.products
                  : this.productsnew),
              (this.currentProductIndex = t),
              t < 0
                ? (this.currentProductIndex = 0)
                : t > i.length - 1 && (this.currentProductIndex = i.length - 1)
            const n = i[this.currentProductIndex]
            ;
            this.loadProduct(n, this.mainOptions.replaceInitialElements)
          }
        }
        loadProduct (t) {
          ;
          let valueofdataindex
          // let e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          //     i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
          // t &&
          //     (q(this, "productSelect", { product: t }),
          //     this.toggleSpinner(!0),
          //     (this.productCreated = !1),
          //     (this.colorLinkGroups = {}),
          //     (this.globalCustomElements = []),
          //     e ? (this.globalCustomElements = this.getCustomElements()) : (this.doUnsavedAlert = !1),
          //     (this.fixedElements = this.getFixedElements()),
          //     this.reset(),
          //     console.log("sjjjjjjjjjjj",t),
          //     t.forEach((t, e) => {
          //         i && (t.options = dt.merge(this.mainOptions, t.options));
          //         const n = {};
          //         N(t.options) &&
          //             Ht.relevantOptions.forEach((e) => {
          //                 void 0 !== t.options[e] && (n[e] = t.options[e]);
          //             }),
          //             (t.options = n);
          //     }),
          //     (this.productViews = t),
          //     To(this, Io, To(this, Oo, 0)),
          //     t.forEach((t, e) => {
          //         To(this, Io, So(this, Io) + t.elements.length);
          //     }),
          //     valueofdataindex = localStorage.setItem("rdatasetindex",r.dataset.index),
          //     G(this, "viewCreate", Ao(this, Do, Yo)),
          //     t && this.addView(t[0]));

          let e =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2]

          if (t) {
            // Dispatch productSelect event
            q(this, 'productSelect', { product: t })

            // Show spinner and reset core states
            this.toggleSpinner(true)
            this.productCreated = false
            this.colorLinkGroups = {}
            this.globalCustomElements = []

            // Optionally load global custom elements
            if (e) {
              this.globalCustomElements = this.getCustomElements()
            } else {
              this.doUnsavedAlert = false
            }

            // Fixed elements + reset state
            this.fixedElements = this.getFixedElements()
            this.reset()

            ;

            const targetTitleOfUrl = localStorage.getItem('selectedSlug')
            let matchedIndex = 0;
            if (t && Array.isArray(t) && typeof targetTitleOfUrl === 'string' && targetTitleOfUrl) {
              const compareTitle = targetTitleOfUrl.replace(/-/g, ' ').toLowerCase().trim();
              for (let i = 0; i < t.length; i++) {
                const productTitle = t[i].title?.toLowerCase().trim();
                ;
                if (productTitle === compareTitle) {
                  ;
                  matchedIndex = i;
                  break;
                }
              }
            }
            ;
            localStorage.setItem('rdatasetindex', matchedIndex.toString());


            // Merge and clean each view's options
            t.forEach((view, index) => {
              if (i) {
                view.options = dt.merge(this.mainOptions, view.options)
              }

              const cleanedOptions = {}
              if (N(view.options)) {
                Ht.relevantOptions.forEach(optKey => {
                  if (view.options[optKey] !== undefined) {
                    cleanedOptions[optKey] = view.options[optKey]
                  }
                })
              }

              view.options = cleanedOptions
            })

            // Store product views in instance
            this.productViews = t

            // Track total elements across all views
            To(this, Io, To(this, Oo, 0))
            t.forEach(view => {
              To(this, Io, So(this, Io) + view.elements.length)
            })

            // Trigger 'viewCreate' event
            G(this, 'viewCreate', Ao(this, Do, Yo))

            // ✅ Load specific view from localStorage (if available)
            const viewIndexRaw = localStorage.getItem('rdatasetindex')
            const viewIndex = parseInt(viewIndexRaw, 10)
            ;
            if (!isNaN(viewIndex) && t[viewIndex]) {
              ;
              this.addView(t[viewIndex])
            } else {
              ;
              this.addView(t[0])
            }

            // Optional: clear after use
            // localStorage.removeItem("rdatasetindex");
          }
        }

        addView (t) {
          ;
          let e = {}
          Ht.relevantOptions.forEach(t => {
            let i = this.mainOptions[t]
            e[t] = N(i) ? { ...i } : i
          }),
            (t.options = N(t.options) ? z(e, t.options) : e),
            (document.body.dataset.fpdIndustryType = ''),
            (this.industryType = null),
            0 == this.viewInstances.length &&
              t.options.industry &&
              t.options.industry.type &&
              ((this.industryType = t.options.industry.type),
              (document.body.dataset.fpdIndustryType = this.industryType))
          let i = new Ht(
            this.productStage,
            t,
            Ao(this, Fo, Xo).bind(this),
            this.mainOptions.fabricCanvasOptions
          )
          i.fabricCanvas.on({
            'mouse:move': t => {
              this.mouseOverCanvas = !t.target || t.target
            },
            'mouse:out': t => {
              this.mouseOverCanvas = !1
            },
            beforeElementAdd: t => {
              if (
                (t.params,
                this.mainBar &&
                  this.uiManager &&
                  'small' == this.uiManager.currentLayout &&
                  this.mainBar.toggleContentDisplay(!1),
                !this.productCreated)
              ) {
                var e
                To(this, Oo, ((e = So(this, Oo)), ++e))
                const i =
                  t.title + '<br>' + String(So(this, Oo)) + '/' + So(this, Io)
                this.mainLoader.querySelector('.fpd-loader-text').innerHTML = i
              }
              q(this, 'beforeElementAdd', { element: t })
            },
            elementAdd: t => {
              t.selected = true;
              let { element: e } = t
              if (e) {
                // e.autoSelect = true;
                // e.uniScalingUnlockable = true;
                // e.selectable = true;
                if(e.getType() == 'text') {e.removable = true}
                if (e.getType() == 'image' & e.draggable == '0') {
                  ;
                  const scaleX = e.canvas.width / e.width;
                  const scaleY = e.canvas.width / e.height;
                  const scale = Math.min(scaleX, scaleY);
                  e.scaleX = scale;
                  e.scaleY = scale;
                  e.selected = true;
                }
                
                if (
                  (this.productCreated &&
                    'image' == e.getType() &&
                    e.isCustom &&
                    this.toggleSpinner(!1),
                  !this.mainOptions.editorMode &&
                    e.replace &&
                    e.replaceInAllViews &&
                    this.viewInstances.forEach((t, i) => {
                      this.currentViewIndex != i &&
                        t.fabricCanvas.getElementByReplace(e.replace) &&
                        !e._replaceAdded &&
                        t.fabricCanvas.addElement(
                          e.getType(),
                          e.source,
                          e.title,
                          { ...e.originParams, _replaceAdded: !0 }
                        )
                    }),
                  // console.log("elementAdd", e, "us", this.viewInstances),
                  e.colorLinkGroup &&
                    e.colorLinkGroup.length > 0 &&
                    !this.mainOptions.editorMode)
                ) {
                  var n = this.getViewIndexByWrapper(i.fabricCanvas.wrapperEl)
                  if (this.colorLinkGroups.hasOwnProperty(e.colorLinkGroup))
                    if (
                      (this.colorLinkGroups[e.colorLinkGroup].elements.push({
                        id: e.id,
                        viewIndex: n
                      }),
                      'object' == typeof e.colors)
                    ) {
                      const t = this.mainOptions.replaceColorsInColorGroup
                        ? e.colors
                        : this.colorLinkGroups[e.colorLinkGroup].colors.concat(
                            e.colors
                          )
                      this.colorLinkGroups[e.colorLinkGroup].colors = U(t)
                    } else
                      (1 !== e.colors && !0 !== e.colors) ||
                        (this.colorLinkGroups[e.colorLinkGroup].colors = [
                          '#000'
                        ])
                  else
                    (this.colorLinkGroups[e.colorLinkGroup] = {
                      elements: [{ id: e.id, viewIndex: n }],
                      colors: []
                    }),
                      'object' == typeof e.colors
                        ? (this.colorLinkGroups[e.colorLinkGroup].colors =
                            e.colors)
                        : (1 !== e.colors && !0 !== e.colors) ||
                          (this.colorLinkGroups[e.colorLinkGroup].colors = [
                            '#000'
                          ])
                }
                this.productCreated &&
                  this.mainOptions.hideDialogOnAdd &&
                  this.mainBar &&
                  this.mainBar.toggleContentDisplay(!1),
                  q(this, 'elementAdd', { element: e }),
                  q(this, 'viewCanvasUpdate', { viewInstance: i })
              } else this.toggleSpinner(!1)
            },
            elementRemove: t => {
              let { element: e } = t
              const n = this.fixedElements.findIndex(
                t => t.element.title == e.title
              )
              ;-1 != n && this.fixedElements.splice(n, 1),
                q(this, 'elementRemove', { element: e }),
                q(this, 'viewCanvasUpdate', { viewInstance: i })
            },
            elementSelect: t => {
              let { element: e } = t
              if (
                ((this.currentElement = e),
                Ao(this, jo, Zo).call(this),
                e && !e._ignore && this.currentViewInstance)
              ) {
                if (e.uploadZone && !this.mainOptions.editorMode) {
                  let t = z(
                    this.currentViewInstance.options.customAdds,
                    e.customAdds || {}
                  )
                  return void setTimeout(() => {
                    ;(this.currentViewInstance.currentUploadZone = e.title),
                      this.mainBar.toggleUploadZonePanel(!0, t)
                  }, 100)
                }
                this.currentViewInstance.currentUploadZone &&
                  this.mainBar.toggleUploadZonePanel(!1)
              }
              q(this, 'elementSelect', {}),
                this.mainOptions.openTextInputOnSelect &&
                  e &&
                  'text' === e.getType() &&
                  e.editable &&
                  this.toolbar &&
                  this.toolbar.container
                    .querySelector('.fpd-tool-edit-text')
                    .click(),
                Ao(this, Ro, Jo).call(this)
            },
            multiSelect: t => {
              let { activeSelection: e } = t
              q(this, 'multiSelect', { activeSelection: e })
            },
            elementCheckContainemt: t => {
              let { target: e, boundingBoxMode: i } = t
              'inside' === i && Ao(this, jo, Zo).call(this)
            },
            elementFillChange: t => {
              let { element: e, colorLinking: n } = t
              if (
                this.productCreated &&
                n &&
                e.colorLinkGroup &&
                e.colorLinkGroup.length > 0
              ) {
                const t = this.colorLinkGroups[e.colorLinkGroup]
                t &&
                  t.elements &&
                  t.elements.forEach(t => {
                    ;
                    if (e.id != t.id) {
                      const i = this.viewInstances[
                        t.viewIndex
                      ].fabricCanvas.getElementByID(t.id)
                      i && i.changeColor(e.fill, !1)
                    }
                  })
              }
              q(this, 'elementFillChange', { element: e, colorLinking: n }),
                q(this, 'viewCanvasUpdate', { viewInstance: i }),
                this.applyTextLinkGroup(e, { fill: e.fill })
            },
            elementChange: t => {
              let { element: e, type: i } = t
              Ao(this, jo, Zo).call(this),
                'scaling' === i && Ao(this, Ro, Jo).call(this, e),
                q(this, 'elementChange', { type: i, element: e })
            },
            elementModify: t => {
              let { element: e, options: n } = t
              Ao(this, jo, Zo).call(this),
                this.applyTextLinkGroup(e, n),
                Ao(this, Ro, Jo).call(this, e),
                q(this, 'elementModify', { options: n, element: e }),
                q(this, 'viewCanvasUpdate', { viewInstance: i })
            },
            'text:changed': t => {
              let { target: e } = t
              this.applyTextLinkGroup(e, { text: e.text })
            },
            'history:append': () => {
              Ao(this, Lo, Go).call(this, 'append')
            },
            'history:clear': () => {
              Ao(this, Lo, Go).call(this, 'clear')
            },
            'history:undo': () => {
              Ao(this, Lo, Go).call(this, 'undo')
            },
            'history:redo': () => {
              Ao(this, Lo, Go).call(this, 'redo')
            }
          }),
            G(i, 'priceChange', t => {
              this.calculatePrice()
            }),
            i.init()

            
        }
        doAutoSelect () {
          if (this.currentViewInstance.locked) return
          let t = null
          this.currentViewInstance.fabricCanvas.getObjects().forEach(e => {
            e.autoSelect && !e.hasUploadZone && (t = e)
          }),
            t &&
              setTimeout(() => {
                this.currentViewInstance.fabricCanvas
                  .setActiveObject(t)
                  .renderAll()
              }, 500)
        }
        aiRequestError (t) {
          n(t), this.toggleSpinner(!1)
        }
        calcElementDPI (t) {
          return t &&
            !t.uploadZone &&
            t.isBitmap() &&
            H(this.currentViewInstance.options.output, ['width', 'height']) &&
            H(this.currentViewInstance.options.printingBox, [
              'left',
              'top',
              'width',
              'height'
            ])
            ? Math.ceil(
                (25.4 * this.currentViewInstance.options.printingBox.width) /
                  this.currentViewInstance.options.output.width /
                  t.scaleX
              )
            : null
        }
        calcDisplaySize (t) {
          let e = this.mainOptions.rulerUnit,
            i = 'cm' == e ? 10 : 1,
            n = 1,
            s = 1,
            r = null
          H(this.currentViewInstance.options.printingBox, [
            'left',
            'top',
            'width',
            'height'
          ]) && H(this.currentViewInstance.options.output, ['width', 'height'])
            ? ((r = this.calcElementDPI(t)),
              'px' != e &&
                ((n =
                  this.currentViewInstance.options.output.width /
                  this.currentViewInstance.options.printingBox.width),
                (s =
                  this.currentViewInstance.options.output.height /
                  this.currentViewInstance.options.printingBox.height)))
            : ((i = 1), (e = 'px'))
          let a = parseInt(t.width * t.scaleX * n)
          a = parseInt(a / i)
          let o = parseInt(t.height * t.scaleY * s)
          return (o = parseInt(o / i)), { width: a, height: o, unit: e, dpi: r }
        }
        applyTextLinkGroup (t) {
          let e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          if (t && !Q(t.textLinkGroup)) {
            const i = this.mainOptions.textLinkGroupProps || []
            this.viewInstances.forEach(n => {
              n.fabricCanvas.getObjects().forEach(s => {
                s !== t &&
                  'text' === s.getType() &&
                  s.textLinkGroup === t.textLinkGroup &&
                  ('string' == typeof e.text &&
                    (s.set('text', t.text),
                    s.fire('changed'),
                    q(this, 'textLinkApply', {
                      element: s,
                      options: { text: t.text }
                    })),
                  Object.keys(t)
                    .filter(t => i.includes(t))
                    .forEach(e => {
                      s.set(e, t[e]),
                        q(this, 'textLinkApply', {
                          element: s,
                          options: { [e]: t[e] }
                        })
                    }),
                  n.fabricCanvas.renderAll())
              })
            })
          }
        }
        getViewIndexByWrapper (t) {
          return Array.from(
            this.productStage.querySelectorAll('.fpd-view-stage')
          ).indexOf(t)
        }
        toggleSpinner () {
          let t =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0],
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : ''
          return (
            !!this.mainLoader &&
            ((this.mainLoader.querySelector('.fpd-loader-text').innerText = e),
            this.mainLoader.classList.toggle('fpd-hidden', !t),
            this.mainLoader)
          )
        }
        selectView () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
          if (this.viewInstances.length <= 0) return
          this.currentViewInstance &&
            this.currentViewInstance.fabricCanvas &&
            this.currentViewInstance.fabricCanvas.resetZoom(),
            (this.currentViewIndex = t),
            t < 0
              ? (this.currentViewIndex = 0)
              : t > this.viewInstances.length - 1 &&
                (this.currentViewIndex = this.viewInstances.length - 1),
            this.currentViewInstance &&
              this.currentViewInstance.fabricCanvas &&
              this.currentViewInstance.fabricCanvas.clearHistory(),
            (this.currentViewInstance =
              this.viewInstances[this.currentViewIndex]),
            this.deselectElement()
          const e = this.productStage.querySelectorAll('.fpd-view-stage')
          X(e, ['fpd-hidden']),
            Z(e.item(this.currentViewIndex), ['fpd-hidden']),
            J(
              document.body.querySelectorAll(
                '.fpd-btn[data-action="previous-view"], .fpd-btn[data-action="next-view"]'
              ),
              ['fpd-hidden'],
              this.viewInstances.length <= 1
            ),
            J(
              document.body.querySelectorAll('fpd-views-nav'),
              ['fpd-hidden'],
              this.viewInstances.length <= 1 &&
                !this.mainOptions.enableDynamicViews
            ),
            J(
              document.body.querySelectorAll(
                '.fpd-btn[data-action="previous-view"], .fpd-view-prev'
              ),
              ['fpd-disabled'],
              0 == this.currentViewIndex
            ),
            J(
              document.body.querySelectorAll(
                '.fpd-btn[data-action="next-view"], .fpd-view-next'
              ),
              ['fpd-disabled'],
              this.currentViewIndex === this.viewInstances.length - 1
            ),
            Ao(this, Bo, qo).call(this),
            (this.currentViewInstance.fabricCanvas.snapToGrid = !1),
            (this.currentViewInstance.fabricCanvas.enableRuler =
              this.mainOptions.rulerFixed),
            this.currentViewInstance.fabricCanvas.resetSize(),
            q(this, 'viewSelect')
        }
        getElements (t) {
          let e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 'all',
            i =
              !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
          ;(t = void 0 === t || isNaN(t) ? -1 : t), i && this.deselectElement()
          let n = []
          if (-1 === t)
            for (var s = 0; s < this.viewInstances.length; ++s)
              n = n.concat(this.viewInstances[s].fabricCanvas.getElements(e, i))
          else {
            if (!this.viewInstances[t]) return []
            n = this.viewInstances[t].fabricCanvas.getElements(e, i)
          }
          return n
        }
        getCustomElements () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'all',
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : -1,
            i =
              !(arguments.length > 2 && void 0 !== arguments[2]) ||
              arguments[2],
            n = []
          return (
            this.getElements(e, t, i).forEach(t => {
              if (t.isCustom) {
                const e = this.getViewIndexByWrapper(t.canvas.wrapperEl)
                n.push({ element: t, viewIndex: e })
              }
            }),
            n
          )
        }
        getFixedElements () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : 'all',
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : -1,
            i =
              !(arguments.length > 2 && void 0 !== arguments[2]) ||
              arguments[2],
            n = []
          return (
            this.getElements(e, t, i).forEach(t => {
              if (t.fixed) {
                const e = this.getViewIndexByWrapper(t.canvas.wrapperEl)
                n.push({ element: t, viewIndex: e })
              }
            }),
            n
          )
        }
        reset () {
          null !== this.productViews &&
            (this.removeEventListener('viewCreate', Ao(this, Do, Yo)),
            this.deselectElement(),
            this.currentViewInstance &&
              this.currentViewInstance.fabricCanvas.resetZoom(),
            (this.currentViewIndex =
              this.currentPrice =
              this.singleProductPrice =
              this.pricingRulesPrice =
                0),
            (this.currentViewInstance =
              this.productViews =
              this.currentElement =
                null),
            this.viewInstances.forEach(t => {
              t.fabricCanvas.dispose()
            }),
            (this.productStage.innerHTML = ''),
            (this.viewInstances = []),
            q(this, 'clear'),
            q(this, 'priceChange'))
        }
        deselectElement () {
          this.currentViewInstance &&
            this.currentViewInstance.fabricCanvas &&
            (this.currentViewInstance.fabricCanvas.deselectElement(),
            (this.currentElement = null))
        }
        addCustomImage (t, e) {
          let i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {},
            s = arguments.length > 3 ? arguments[3] : void 0
          s = void 0 === s ? this.currentViewIndex : s
          const r = new Image()
          ;(r.crossOrigin = 'anonymous'),
            (r.src = t),
            this.toggleSpinner(
              !0,
              this.translator.getTranslation('misc', 'loading_image')
            ),
            X(this.viewsNav.container, ['fpd-disabled']),
            (r.onload = () => {
              this.loadingCustomImage = !1
              let n = r.height,
                a = r.width,
                o = this.currentViewInstance.options.customImageParameters
              if (!et(this, a, n)) return this.toggleSpinner(!1), !1
              let l = { isCustom: !0, isCustomImage: !0 }
              r.src.includes('.svg') && !o.colors && (l.colors = !0)
              let c = z(o, l)
              ;(c = z(c, i)),
                this.viewInstances[s].fabricCanvas.addElement(
                  'image',
                  t,
                  e,
                  c,
                  s
                ),
                Z(this.viewsNav.container, ['fpd-disabled'])
            }),
            (r.onerror = () => {
              Z(this.viewsNav.container, ['fpd-disabled']),
                n('Image could not be loaded!')
            })
        }
        _addGridItemToCanvas (t) {
          let e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            i = arguments.length > 2 ? arguments[2] : void 0,
            n =
              !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3]
          if (!this.currentViewInstance) return
          i = void 0 === i ? this.currentViewIndex : i
          const s = z(
            { _addToUZ: this.currentViewInstance.currentUploadZone },
            e
          )
          this.productCreated &&
            this.mainOptions.hideDialogOnAdd &&
            this.mainBar &&
            this.mainBar.toggleContentDisplay(!1),
            this._addCanvasImage(t.dataset.source, t.dataset.title, s, i, n)
        }
        _addCanvasImage (t, e) {
          let i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {},
            n = arguments.length > 3 ? arguments[3] : void 0,
            s =
              !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4]
          this.currentViewInstance &&
            ((n = void 0 === n ? this.currentViewIndex : n),
            Ho.uploadsToServer && s
              ? this._downloadRemoteImage(t, e, i)
              : ((this.loadingCustomImage = !0),
                this.addCustomImage(t, e, i, n)))
        }
        _downloadRemoteImage (t, e) {
          let i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {},
            s =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : null
          if (!this.mainOptions.fileServerURL)
            return void alert(
              'You need to set the fileServerURL in the option, otherwise file uploading does not work!'
            )
          ;(this.loadingCustomImage = !0),
            this.toggleSpinner(
              !0,
              this.translator.getTranslation('misc', 'loading_image')
            ),
            X(this.viewsNav.container, ['fpd-disabled'])
          const r = new FormData()
          r.append('url', t)
          const a = t => {
            Z(this.viewsNav.container, ['fpd-disabled']),
              this.toggleSpinner(!1),
              n(t)
          }
          Ut({
            url: this.getFileServerURL(),
            body: r,
            onSuccess: t => {
              t && t.image_src
                ? s
                  ? s({ url: t.image_src })
                  : this.addCustomImage(
                      t.image_src,
                      t.filename ? t.filename : e,
                      i
                    )
                : s
                ? s({ error: t.image_src })
                : a(t.error)
            },
            onError: a
          })
        }
        addCanvasDesign (t, e) {
          ;
          ;
          let i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
          this.currentViewInstance &&
            (this.toggleSpinner(
              !0,
              this.translator.getTranslation('misc', 'loading_image')
            ),
            // (i = z(this.currentViewInstance.options.customImageParameters, i)),
            // Always add copyable
            (i = z(
              {
                ...this.currentViewInstance.options.customImageParameters,
                copyable: true,
                lockUniScaling: true,
                autoSelect: true,
                title:
                  e && typeof e === 'object' && e.title
                    ? e.title
                    : typeof e === 'string' && e
                    ? e
                    : 'Custom Element'
              },
              i
            )),
            document.querySelector('.fpd-ungroup1')?.classList.add('fpd-hidden'),
            (i.isCustom = !0),
            this.currentViewInstance.currentUploadZone &&
              (i._addToUZ = this.currentViewInstance.currentUploadZone),
            this.productCreated &&
              this.mainOptions.hideDialogOnAdd &&
              this.mainBar &&
              this.mainBar.toggleContentDisplay(!1),
            Array.isArray(i.relatedViewImages) && i.relatedViewImages.length > 0
              ? ((i.replaceInAllViews = !1),
                this.viewInstances[0].fabricCanvas.addElement('image', t, e, i),
                i.relatedViewImages.forEach(t => {
                  !Q(t.viewIndex) &&
                    !Q(t.url) &&
                    !Q(t.title) &&
                    t.viewIndex > 0 &&
                    this.viewInstances[t.viewIndex] &&
                    this.viewInstances[t.viewIndex].fabricCanvas.addElement(
                      'image',
                      t.url,
                      t.title,
                      { replaceInAllViews: !1, replace: i.replace }
                    )
                }))
              : this.currentViewInstance.fabricCanvas.addElement(
                  'image',
                  t,
                  e,
                  i
                ))
        }
        toggleResponsive (t) {
          return (
            (t =
              void 0 === t
                ? this.container.classList.contains('fpd-not-responsive')
                : t),
            J(this.container, ['fpd-not-responsive'], !t),
            this.viewInstances.forEach((e, i) => {
              ;(e.options.responsive = t),
                i == this.currentViewIndex && e.fabricCanvas.resetSize()
            }),
            t
          )
        }
        getProduct () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
            e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            i = !1,
            s =
              'all' == this.mainOptions.customizationRequiredRule
                ? 'every'
                : 'some'
          if (
            ((i = this.viewInstances[s](t => t.fabricCanvas.isCustomized)),
            e && !i)
          )
            return (
              n(
                this.translator.getTranslation(
                  'misc',
                  'customization_required_info'
                )
              ),
              !1
            )
          this.deselectElement(),
            this.currentViewInstance.fabricCanvas.resetZoom(),
            (this.doUnsavedAlert = !1)
          let r = []
          return (
            this.getElements().forEach(t => {
              t.isOut &&
                'inside' === t.boundingBoxMode &&
                !t.__editorMode &&
                (n(
                  t.title +
                    ': ' +
                    this.translator.getTranslation(
                      'misc',
                      'out_of_bounding_box'
                    )
                ),
                (r = !1))
            }),
            !1 !== r &&
              (this.viewInstances.forEach((e, i) => {
                const n = {
                  title: e.title,
                  thumbnail: e.thumbnail,
                  elements: e.fabricCanvas.getElementsJSON(t),
                  options: e.options,
                  names_numbers: e.names_numbers,
                  mask: e.mask,
                  locked: e.locked
                }
                0 == i &&
                  this.productViews[0].hasOwnProperty('productTitle') &&
                  (n.productTitle = this.productViews[0].productTitle),
                  r.push(n)
              }),
              r)
          )
        }
        getProductDataURL () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : () => {},
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : []
          if (
            ((e.onlyExportable =
              void 0 !== e.onlyExportable && e.onlyExportable),
            (e.enableRetinaScaling =
              void 0 !== e.enableRetinaScaling && e.enableRetinaScaling),
            (e.watermarkImg = this.watermarkImg),
            0 === this.viewInstances.length)
          )
            return void t('')
          this.currentViewInstance.fabricCanvas.resetZoom()
          const n = document.createElement('canvas')
          let s = new fabric.Canvas(n, {
              containerClass: 'fpd-hidden fpd-hidden-canvas',
              enableRetinaScaling: !1
            }),
            r = 0,
            a = e.multiplier ? e.multiplier : 1,
            o =
              2 == i.length
                ? this.viewInstances.slice(i[0], i[1])
                : this.viewInstances
          const l = i => {
              i.toDataURL(n => {
                fabric.Image.fromURL(
                  n,
                  n => {
                    s.add(n),
                      r > 0 &&
                        (n.set('top', s.getHeight()),
                        s.setDimensions({
                          height: s.getHeight() + i.options.stageHeight * a
                        })),
                      r++,
                      r < o.length
                        ? l(o[r])
                        : (delete e.multiplier,
                          setTimeout(function () {
                            t(s.toDataURL(e)),
                              s.dispose(),
                              this.currentViewInstance &&
                                this.currentViewInstance.fabricCanvas.resetSize()
                          }, 100))
                  },
                  { crossOrigin: 'anonymous' }
                )
              }, e),
                i.options.stageWidth * a > s.getWidth() &&
                  s.setDimensions({ width: i.options.stageWidth * a })
            },
            c = o[0]
          s.setDimensions({
            width: c.options.stageWidth * a,
            height: c.options.stageHeight * a
          }),
            l(c)
        }
        getViewsDataURL () {
          let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : () => {},
            e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {}
          e.watermarkImg = this.watermarkImg
          let i = []
          this.currentViewInstance.fabricCanvas.resetZoom()
          for (var n = 0; n < this.viewInstances.length; ++n)
            this.viewInstances[n].toDataURL(e => {
              i.push(e), i.length === this.viewInstances.length && t(i)
            }, e)
        }
        print () {
          this.getViewsDataURL(t => {
            let e = [],
              i = 0
            for (var n = 0; n < t.length; ++n) {
              let s = new Image()
              ;(s.src = t[n]),
                (s.onload = () => {
                  if ((e.push(s), i++, i == t.length)) {
                    const i = window.open(
                      '',
                      '',
                      'width=' +
                        e[0].width +
                        ',height=' +
                        e[0].height * t.length +
                        ',location=no,menubar=no,scrollbars=yes,status=no,toolbar=no'
                    )
                    ot(
                      i,
                      this.translator.getTranslation(
                        'misc',
                        'popup_blocker_alert'
                      )
                    ),
                      (i.document.title = 'Print Image')
                    for (var n = 0; n < e.length; ++n)
                      i.document.body.append(e[n])
                    setTimeout(() => {
                      i.print()
                    }, 1e3)
                  }
                })
            }
          })
        }
        getUsedFonts () {
          let t = [],
            e = []
          return (
            this.getElements(-1, 'all', !1).forEach(i => {
              if ('text' === i.getType() && -1 === t.indexOf(i.fontFamily)) {
                var n = { name: i.fontFamily },
                  s = this.mainOptions.fonts.find(t => t.name == i.fontFamily)
                s &&
                  (s.url && (n.url = s.url),
                  s.variants &&
                    Object.keys(s.variants).forEach(n => {
                      var r = i.fontFamily
                      'n7' == n
                        ? (r += ' Bold')
                        : 'i4' == n
                        ? (r += ' Italic')
                        : 'i7' == n && (r += ' Bold Italic'),
                        t.push(r),
                        e.push({ name: r, url: s.variants[n] })
                    })),
                  t.push(i.fontFamily),
                  e.push(n)
              }
            }),
            e
          )
        }
        getViewsSVG (t) {
          let e = []
          for (var i = 0; i < this.viewInstances.length; ++i)
            e.push(this.viewInstances[i].toSVG(t, this.getUsedFonts()))
          return e
        }
        getUsedColors () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : -1
          var e = []
          return (
            this.getElements(t, 'all', !1).forEach(t => {
              const i = t.isColorizable()
              i &&
                ('svg' === i && 'group' === t.type
                  ? t.getObjects().forEach(t => {
                      o(t.fill).isValid() && e.push(o(t.fill).toHexString())
                    })
                  : o(t.fill).isValid() && e.push(o(t.fill).toHexString()))
            }),
            U(e)
          )
        }
        removeView () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
          this.viewInstances[t].fabricCanvas.wrapperEl.remove(),
            this.viewInstances.splice(t, 1),
            this.viewInstances.length > 0 &&
              (t == this.currentViewIndex
                ? this.selectView(0)
                : this.selectView(t)),
            q(this, 'viewRemove', { viewIndex: t }),
            this.calculatePrice()
        }
        setOrderQuantity () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1
          ;(t = '' == t || t < 0 ? 1 : t),
            (this.orderQuantity = t),
            this.calculatePrice()
        }
        getOrder () {
          let t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
          return (
            (this._order.product = this.getProduct(
              t.onlyEditableElements,
              t.customizationRequired
            )),
            (this._order.usedFonts = this.getUsedFonts()),
            (this._order.usedColors = []),
            this.getUsedColors().forEach(t => {
              let e =
                  this.mainOptions.hexNames[t.replace('#', '').toLowerCase()],
                i = { hex: t }
              e && (i.name = e), this._order.usedColors.push(i)
            }),
            q(this, 'getOrder', {}),
            this._order
          )
        }
        getPrintOrderData () {
          let t =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0],
            e = {
              used_fonts: this.getUsedFonts(),
              svg_data: [],
              custom_images: []
            }
          return (
            t &&
              this.viewInstances.forEach(t => {
                e.svg_data.push({
                  svg: t.toSVG({ respectPrintingBox: !0 }),
                  output: t.options.output
                })
              }),
            this.getCustomElements('image').forEach(t => {
              e.custom_images.includes(t.element.source) ||
                e.custom_images.push(t.element.source)
            }),
            e
          )
        }
        calculatePrice () {
          let t =
              !(arguments.length > 0 && void 0 !== arguments[0]) ||
              arguments[0],
            e =
              !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
          Ao(this, No, Qo).call(this)
          let i = this.singleProductPrice
          return (
            (this.currentPrice = i),
            (i += this.pricingRulesPrice),
            t && (i *= this.orderQuantity),
            i % 1 != 0 && (i = Number(i.toFixed(2))),
            (this.currentPrice = i),
            e && q(this, 'priceChange'),
            this.currentPrice
          )
        }
        formatPrice (t) {
          return ht(t, this.mainOptions.priceFormat)
        }
        getFileServerURL () {
          let t = new URL(this.mainOptions.fileServerURL)
          return (
            'engraving' == W(this.viewInstances[0].options, 'industry.type') &&
              (W(this.viewInstances[0].options, 'industry.opts.negative')
                ? t.searchParams.set('filter', 'threshold_negative')
                : t.searchParams.set('filter', 'threshold')),
            t.href
          )
        }
      }
      function zo () {
        Lt(this, t => {
          ;(this.mainOptions.fonts = t),
            setTimeout(() => {
              ;(this.uiManager = new po(this)),
                this.uiManager.addEventListener(
                  'ready',
                  Ao(this, Mo, Wo).bind(this)
                ),
                this.uiManager.init()
            }, 1)
        })
      }
      async function Wo () {
        // const savedJson = localStorage.getItem('fpdProductsJSON');
        ;
        const bundledProductsUrl = this.mainOptions.productsJSON
        let savedJson = null
        try {
          savedJson = await getProducts("Products");
        } catch (err) {
          console.error('Failed to read cached products:', err)
        }
        const productsAlreadyLoaded =
          Array.isArray(this.products) && this.products.length > 0
        if (!productsAlreadyLoaded) {
          const hasCachedProducts =
            Array.isArray(savedJson) && savedJson.length > 0
          this.mainOptions.productsJSON = hasCachedProducts
            ? savedJson
            : bundledProductsUrl
        }
        ;
        q(this, 'ready', {}),
          (this.warningsWrapper =
            this.container.querySelector('.fpd-warnings')),
          !productsAlreadyLoaded &&
          this.mainOptions.productsJSON &&
            ('object' == typeof this.mainOptions.productsJSON
              ? this.setupProducts(this.mainOptions.productsJSON)
              : ((this._productsRequestToken =
                  this._productsLoadToken =
                    (this._productsLoadToken || 0) + 1),
                Vt({
                  url: this.mainOptions.productsJSON,
                  onSuccess: t => {
                    if (this._productsRequestToken !== this._productsLoadToken)
                      return
                    ;
                    const processed = []

                    t.forEach(item => {
                      if (item.subcategory.trim() === '') {
                        processed.push({
                          category: item.category,
                          subcategory: ''
                        })
                      } else {
                        const subcats = item.subcategory
                          .split(',')
                          .map(s => s.trim())
                        subcats.forEach(sub => {
                          processed.push({
                            category: item.category,
                            subcategory: sub
                          })
                        })
                      }
                    })

                    // Save to localStorage
                    localStorage.setItem('fpd-category-subcategories',JSON.stringify(processed))

                    ;

                    const grouped = {}

                    processed.forEach(({ category, subcategory }) => {
                      if (!grouped[category]) {
                        grouped[category] = []
                      }
                      if (subcategory.trim()) {
                        grouped[category].push(subcategory.trim())
                      }
                    })

                    // Convert grouped object to desired array
                    ;
                    const result = Object.entries(grouped).map(
                      ([category, subcategories]) => ({
                        category,
                        subcategory: subcategories.join(', ')
                      })
                    )

                    // Save to localStorage if needed

                    ;
                    // localStorage.setItem('fpd-grouped-categories',JSON.stringify(result))
                    localStorage.setItem('fpd-grouped-categories-number', 0)
                    this.setupProducts(t)
                  },
                  onError: () => {
                    alert(
                      'Products JSON could not be loaded. Please check that your URL is correct! URL: ' +
                        this.mainOptions.productsJSON
                    )
                  }
                })))
        this.mainOptions.productsJSON1 &&
          ('object' == typeof this.mainOptions.productsJSON1
            ? this.setupProductsNew(this.mainOptions.productsJSON1)
            : Vt({
                url: this.mainOptions.productsJSON1,
                onSuccess: t => {
                  ;
                  const processed = []

                  t.forEach(item => {
                    if (item.subcategory.trim() === '') {
                      processed.push({
                        category: item.category,
                        subcategory: ''
                      })
                    } else {
                      const subcats = item.subcategory
                        .split(',')
                        .map(s => s.trim())
                      subcats.forEach(sub => {
                        processed.push({
                          category: item.category,
                          subcategory: sub
                        })
                      })
                    }
                  })

                  // Save to localStorage
                  localStorage.setItem(
                    'fpd-category-subcategories',
                    JSON.stringify(processed)
                  )

                  ;

                  const grouped = {}

                  processed.forEach(({ category, subcategory }) => {
                    if (!grouped[category]) {
                      grouped[category] = []
                    }
                    if (subcategory.trim()) {
                      grouped[category].push(subcategory.trim())
                    }
                  })

                  // Convert grouped object to desired array
                  const result = Object.entries(grouped).map(
                    ([category, subcategories]) => ({
                      category,
                      subcategory: subcategories.join(', ')
                    })
                  )

                  // Save to localStorage if needed

                  ;
                  // localStorage.setItem('fpd-grouped-categories',JSON.stringify(result))
                  localStorage.setItem('fpd-grouped-categories-number', 0)
                  this.setupProductsNew(t)
                },
                onError: () => {
                  alert(
                    'Products JSON could not be loaded. Please check that your URL is correct! URL: ' +
                      this.mainOptions.productsJSON
                  )
                }
              })),
          this.mainOptions.designsJSON &&
            ('object' == typeof this.mainOptions.designsJSON
              ? this.setupDesigns(this.mainOptions.designsJSON)
              : Vt({
                  url: this.mainOptions.designsJSON,
                  onSuccess: t => {
                    ;
                    // const allTags = t.forEach(categoryObj => {
                    //     const tags = categoryObj.designs.flatMap(d => d.tags);
                    //     const uniqueTags = [...new Set(tags)];
                    //     console.log("uniqueTags",uniqueTags)
                    // })
                    const allTags = t.flatMap(categoryObj =>
                      categoryObj.designs.flatMap(d => d.tags)
                    )
                    const uniqueAllTags = [...new Set(allTags)]
                    ;
                    localStorage.setItem(
                      'fpd-designs-tags',
                      JSON.stringify(uniqueAllTags)
                    )
                    this.setupDesigns(t)
                  },
                  onError: () => {
                    alert(
                      'Design JSON could not be loaded. Please check that your URL is correct! URL: ' +
                        this.mainOptions.designsJSON
                    )
                  }
                })),
          this.mainOptions.keyboardControl &&
            G(document, 'keydown', t => {
              if (
                this.currentViewInstance &&
                this.currentViewInstance.fabricCanvas
              ) {
                const e = this.currentViewInstance,
                  i = t.target.nodeName,
                  n = e.fabricCanvas.getActiveObject()
                if (n && !['TEXTAREA', 'INPUT'].includes(i)) {
                  switch (t.which) {
                    case 8:
                      n.removable && e.fabricCanvas.removeElement(n)
                      break
                    case 37:
                      n.draggable &&
                        e.fabricCanvas.setElementOptions({ left: n.left - 1 })
                      break
                    case 38:
                      n.draggable &&
                        e.fabricCanvas.setElementOptions({ top: n.top - 1 })
                      break
                    case 39:
                      n.draggable &&
                        e.fabricCanvas.setElementOptions({ left: n.left + 1 })
                      break
                    case 40:
                      n.draggable &&
                        e.fabricCanvas.setElementOptions({ top: n.top + 1 })
                      break
                    default:
                      return
                  }
                  t.preventDefault()
                }
              }
            }),
          this.mainOptions.watermark &&
            fabric.Image.fromURL(
              this.mainOptions.watermark,
              (t, e) => {
                e || (this.watermarkImg = t)
              },
              { crossOrigin: 'anonymous' }
            ),
          this.mainOptions.unsavedProductAlert &&
            (window.onbeforeunload = () => {
              if (this.doUnsavedAlert) return ''
            })
        let t = 0
        if (
          (window.addEventListener('resize', e => {
            window.innerWidth === t ||
              this.inTextField ||
              ((t = window.innerWidth),
              this.currentElement &&
                !['INPUT', 'TEXTAREA'].includes(document.activeElement) &&
                this.deselectElement(),
              this.currentViewInstance &&
                setTimeout(() => {
                  this.currentViewInstance.fabricCanvas.resetSize()
                }, 100))
          }),
          G(
            this,
            ['productCreate', 'layoutElementsAdded'],
            Ao(this, Po, Vo).bind(this)
          ),
          G(this, ['productCreate', 'modalDesignerOpen'], t => {
            ;((!this.firstProductCreated && !this.mainOptions.modalMode) ||
              (!this.firstProductCreated && 'modalDesignerOpen' === t.type)) &&
              (this.mainOptions.autoOpenInfo &&
                this.actionsBar &&
                this.actionsBar.doAction('info'),
              this.guidedTour &&
                (K()
                  ? 'yes' !== window.localStorage.getItem('fpd-gt-closed') &&
                    this.guidedTour.start()
                  : this.guidedTour.start())),
              (this.firstProductCreated =
                this.mainOptions.modalMode && 'modalDesignerOpen' === t.type)
          }),
          G(
            document.body,
            ['focusin', 'blur'],
            t => {
              ;['TEXTAREA', 'INPUT'].includes(t.target.nodeName) &&
                (this.inTextField = 'focusin' == t.type)
            },
            !0
          ),
          G(
            document.body,
            ['mouseup', 'touchend'],
            t => {
              let e = Array.from(document.querySelectorAll('.fpd-container'))
              !Boolean(e.find(e => e.contains(t.target))) &&
                this.mainOptions.deselectActiveOnOutside &&
                this.deselectElement()
            },
            !0
          ),
          this.mainOptions.dragDropImagesToUploadZones)
        ) {
          let t = null
          G(document.body, ['mousedown', 'touchstart'], e => {
            if (1 == e.which) {
              const i = e.target
              i.classList.contains('fpd-draggable') &&
                ((t = i),
                (this.draggedPlaceholder = document.createElement('div')),
                (this.draggedPlaceholder.className =
                  'fpd-dragged-image fpd-shadow-1 fpd-hidden'),
                (this.draggedPlaceholder.style.backgroundImage = `url("${
                  i.querySelector('picture').dataset.img
                }")`),
                document.body.append(this.draggedPlaceholder))
            }
          }),
            G(document.body, ['mousemove'], e => {
              this.draggedPlaceholder &&
                ((this.draggedPlaceholder.style.left =
                  e.pageX - 0.5 * t.offsetWidth + 'px'),
                (this.draggedPlaceholder.style.top =
                  e.pageY - 0.5 * t.offsetHeight + 'px'),
                Z(this.draggedPlaceholder, ['fpd-hidden']),
                setTimeout(() => {
                  this.draggedPlaceholder &&
                    X(this.draggedPlaceholder, ['fpd-animate'])
                }, 1),
                e.stopPropagation(),
                e.preventDefault())
            }),
            G(document.body, ['mouseup'], e => {
              this.draggedPlaceholder &&
                (this.draggedPlaceholder.remove(),
                (this.draggedPlaceholder = null)),
                !this.loadingCustomImage &&
                  t &&
                  this.mouseOverCanvas &&
                  this._addGridItemToCanvas(
                    t,
                    this.mouseOverCanvas.uploadZone
                      ? { _addToUZ: this.mouseOverCanvas.title }
                      : {}
                  ),
                (t = null),
                (this.mouseOverCanvas = !1)
            })
        }
        'string' == typeof this.mainOptions.editorMode && new bo(this)
      }
      function Vo () {
        const t = this.globalCustomElements.concat(this.fixedElements)
        if (!t.length) return
        let e = 0
        const i = t => {
            const e = this.viewInstances[t.viewIndex]
            if (e) {
              const i = t.element
              if (!e.fabricCanvas.getElementByTitle(i.title)) {
                let t = Object.keys(this.mainOptions.elementParameters)
                t =
                  'text' === i.getType()
                    ? t.concat(Object.keys(this.mainOptions.textParameters))
                    : t.concat(Object.keys(this.mainOptions.imageParameters))
                let n = i.getElementJSON(!1, t)
                n._printingBox && delete n.boundingBox,
                  e.fabricCanvas.addElement(i.getType(), i.source, i.title, n)
              }
            } else n()
          },
          n = () => {
            e++,
              e < t.length ? i(t[e]) : this.removeEventListener('elementAdd', n)
          }
        G(this, 'elementAdd', n), t[0] && i(t[0])
      }
      function Uo (t) {
        var e = this.products.findIndex(e => e.category === t)
        return -1 !== e && e
      }
      function Yo () {
        if (this.viewInstances.length < this.productViews.length)
          this.addView(this.productViews[this.viewInstances.length])
        else {
          this.removeEventListener('viewCreate', Ao(this, Do, Yo)),
            this.toggleSpinner(!1),
            this.selectView(0),
            !this.mainOptions.editorMode &&
              this.currentViewInstance &&
              this.currentViewInstance.fabricCanvas.wrapperEl.offsetParent &&
              this.doAutoSelect(),
            (this.productCreated = !0)
          const t = this.productViews[0].options.layouts
          'string' == typeof t
            ? Vt({
                url: t,
                onSuccess: t => {
                  ;(this.currentLayouts = t), q(this, 'layoutsSet', {})
                },
                onError: () => {
                  alert(
                    'Layouts JSON could not be loaded. Please check that your URL is correct! URL: ' +
                      this.mainOptions.layouts
                  )
                }
              })
            : Array.isArray(t) &&
              ((this.currentLayouts = t), q(this, 'layoutsSet', {})),
            q(this, 'productCreate')
        }
      }
      function Go (t) {
        ;['undo', 'redo'].includes(t) &&
          this.currentViewInstance.fabricCanvas._renderPrintingBox(),
          q(this, 'historyAction', { type: t }),
          Ao(this, Bo, qo).call(this)
      }

      function qo () {
        if (this.currentViewInstance) {
          const t = this.currentViewInstance.fabricCanvas.historyUndo,
            e = this.currentViewInstance.fabricCanvas.historyRedo
          t.length && (this.doUnsavedAlert = !0),
            t &&
              (J(
                document.body.querySelectorAll('.fpd-btn[data-action="undo"]'),
                ['fpd-disabled'],
                0 == t.length
              ),
              J(
                document.body.querySelectorAll('.fpd-btn[data-action="redo"]'),
                ['fpd-disabled'],
                0 == e.length
              ))
        }
      }
      function Xo (t) {
        t.fabricCanvas.wrapperEl.parentNode &&
          (this.viewInstances.push(t),
          t.fabricCanvas.on('sizeUpdate', t => {
            let { canvasHeight: e } = t,
              i = e + 'px'
            ;(this.productStage.style.height = i),
              this.container.classList.contains('fpd-sidebar') &&
                ((this.mainBar.container.style.height = i),
                e != this.mainWrapper.container.offsetHeight &&
                  (this.mainBar.container.style.height =
                    this.mainWrapper.container.offsetHeight + 'px'))
          }),
          t.names_numbers &&
            t.names_numbers.length > 1 &&
            t.changePrice(
              (t.names_numbers.length - 1) * t.options.namesNumbersEntryPrice,
              '+'
            ),
          q(this, 'viewCreate', { viewInstance: t }),
          t.fabricCanvas.onHistory(),
          t.fabricCanvas.clearHistory())
      }
      function Zo () {
        if (!this.mainTooltip) return
        const t = this.currentElement
        if (this.productCreated && t && !t.uploadZone && !t.__editorMode) {
          if (t.isOut && 'inside' === t.boundingBoxMode) {
            const t = this.translator.getTranslation(
              'misc',
              'out_of_bounding_box',
              'Move element inside the boundary!'
            )
            ;(this.mainTooltip.innerHTML = t),
              this.mainTooltip.classList.add('fpd-show')
          } else if (this.mainOptions.sizeTooltip) {
            const e = this.calcDisplaySize(t)
            let i = e.width + 'x' + e.height + e.unit
            e.dpi && (i += ' | DPI:' + e.dpi),
              (this.mainTooltip.innerHTML = i),
              this.mainTooltip.classList.add('fpd-show')
          } else this.mainTooltip.classList.remove('fpd-show')
          if (this.mainTooltip.classList.contains('fpd-show')) {
            const e = t.oCoords,
              i =
                this.currentViewInstance.fabricCanvas.wrapperEl.getBoundingClientRect()
            let n = i.left + e.mt.x - this.mainTooltip.clientWidth / 2,
              s = i.top + e.mt.y - this.mainTooltip.clientHeight - 20
            const r = this.container.getBoundingClientRect()
            s < r.top && (s = r.top - this.mainTooltip.clientHeight),
              (s = s < 0 ? 0 : s),
              (this.mainTooltip.style.left = n + 'px'),
              (this.mainTooltip.style.top = s + 'px')
          }
        } else this.mainTooltip.classList.remove('fpd-show')
      }
      function Jo () {
        // StyleFlip: do not show the low-resolution / DPI warning when
        // uploading or selecting custom images.
        if (!this.warningsWrapper || this.mainOptions.editorMode) return
        this.warningsWrapper.innerHTML = ''
        if (this.productCreated && this.currentElement) {
          q(this, 'imageDPIWarningOff', {
            element: this.currentElement,
            dpi: this.calcElementDPI(this.currentElement)
          })
        }
      }
      function Qo () {
        ;(this.currentPrice = this.singleProductPrice = 0),
          this.viewInstances.forEach(t => {
            t.locked || (this.singleProductPrice += t.truePrice)
          })
      }

      Co(Ho, 'version', '6.3.5'),
        Co(Ho, 'forbiddenTextChars', /<|>/g),
        Co(Ho, 'proxyFileServer', ''),
        Co(Ho, 'uploadsToServer', !0),
        Co(Ho, 'additionalModules', {}),
        (window.FancyProductDesigner = Ho),
        (window.FPDEmojisRegex =
          /(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F/g)
    })()
})()
/*!
 * vanilla-picker v2.12.2
 * https://vanilla-picker.js.org
 *
 * Copyright 2017-2023 Andreas Borgen (https://github.com/Sphinxxxx), Adam Brooks (https://github.com/dissimulate)
 * Released under the ISC license.
 */

/*! Fabric.js Copyright 2008-2015, Printio (Juriy Zaytsev, Maxim Chernyak) */
