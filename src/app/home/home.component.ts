import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  ViewChild,
  HostListener,
  ElementRef,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Title } from '@angular/platform-browser';

declare var FancyProductDesigner: any;
import $ from 'jquery';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { text } from 'node:stream/consumers';

interface TextSpan {
  text: string;
  parameters: {
    left: number;
    top: number;
    font: string;
    textSize: number;
    colors: string;
    curvable: number;
  };
}

interface Product {
  title: string;
  thumbnail: string;
  tags: string[];
  texts: TextSpan[];
}

interface Category {
  category: string;
  products: Product[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})


export class HomeComponent implements AfterViewInit {
  isBoxVisible = false;
  email: string = '';
  password: string = '';
  showLoginPopup = true;
  isLoggedIn: boolean = false;
  firstName: string = '';
  initialLetter: string = 'A';
  private savedContent: string = '';
  fontArrayStr: any;

  

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title
  ) {}
  @ViewChild('previewButton') previewButton!: ElementRef;
  @ViewChild('savedGrid', { static: false }) savedGrid!: ElementRef;

  designer: any;
  appOptions: any;
  activeImageTitle: string = '';
  groupedProducts: any;

  reversedManufacturerSlugMap: any = {
    apple: 'Apple',
    sony: 'Sony',
    'beats-by-dr-dre': 'Beats By Dr. Dre',
    pioneer: 'Pioneer',
  };

  getCategoryAndProductIndex(
    manufacturer: string,
    productTitle: string
  ): Promise<{
    categoryIndex: number;
    productIndex: number;
    childIndex: number;
  }> {
    console.log('🔍 Searching for:', manufacturer, productTitle);

    return new Promise((resolve, reject) => {
      this.http
        .get<any[]>('https://styleflip-backend-jdm5.ithemes.xyz/api/product/getAllProducts')
        .subscribe({
          next: (data) => {
            console.log('dddddddddddddddddddddddd', data);
            for (
              let categoryIndex = 0;
              categoryIndex < data.length;
              categoryIndex++
            ) {
              const categoryObj = data[categoryIndex];
              const productGroups = categoryObj.products;
              let flatProductIndex = 0;

              for (const group of productGroups) {
                for (let i = 0; i < group.length; i++) {
                  const product = group[i];
                  // console.log(
                  //   'compare',
                  //   product.manufacturer,
                  //   manufacturer,
                  //   this.slugify(product.title),
                  //   productTitle
                  // );
                  const isMatch =
                    product.manufacturer === manufacturer &&
                    this.slugify(product.title) === productTitle;

                  if (isMatch) {
                    console.log('✅ Found:', {
                      categoryIndex,
                      productIndex: flatProductIndex,
                      productId: product.product_id,
                      childIndex: i,
                    });

                    return resolve({
                      categoryIndex,
                      productIndex: flatProductIndex,
                      childIndex: i,
                    });
                  }
                }
                flatProductIndex++;
              }
            }

            // Not found
            resolve({ categoryIndex: -1, productIndex: -1, childIndex: -1 });
          },
          error: (err) => reject(err),
        });
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const fontArrayStr: any[] = [];
      console.log('reset done');
      localStorage.setItem('productLoader', 'done');

      fetch('https://styleflip-backend-jdm5.ithemes.xyz/api/font/getAllFonts')
      .then(res => res.json())
      .then(data => {
          console.log('font data is',data); // ✅ Logs just the array: []
          // You can use it directly
          this.fontArrayStr = data;
          localStorage.setItem('fontList', JSON.stringify(this.fontArrayStr));
        
      })
      .catch(err => {
        console.error('Error fetching fonts:', err);
      });

      
      const storedFonts = localStorage.getItem('fontList');
      const fontData = storedFonts ? JSON.parse(storedFonts) : null;

      if (fontData) {
        console.log('Retrieved font data:', fontData);
      }

      setTimeout(async () => {
        const manufacturerSlug =
          this.route.snapshot.paramMap.get('manufacturer') || '';
        const titleSlug = this.route.snapshot.paramMap.get('slug') || '';
        // const manufacturerSlug = params['manufacturer'];
        //       const titleSlug = params['slug'];
        console.log(
          'productIndex,categoryIndex,',
          this.reversedManufacturerSlugMap[manufacturerSlug],
          titleSlug
        );
       const pageTitle = `${
          titleSlug.trim() ? titleSlug.replace(/-/g, '') : 'Styleflip'
        } | ${manufacturerSlug.replace(/-/g, ' ')} - Design Your Product`;

        this.titleService.setTitle(pageTitle);
        let { categoryIndex, productIndex, childIndex }: any =
          await this.getCategoryAndProductIndex(
            this.reversedManufacturerSlugMap[manufacturerSlug],
            titleSlug
          );
        localStorage.setItem('productIndex', productIndex);
        localStorage.setItem('categoryIndex', categoryIndex);
        localStorage.setItem('childIndex', childIndex);

        console.log(
          productIndex,
          categoryIndex,
          childIndex,
          'productIndex,categoryIndex,',
          titleSlug,
          manufacturerSlug
        );

        'assets/data/products/product-categories.json'
        
        console.log("fontssssssssssss data is",fontData)
        

        // console.log(
        //   productIndex,
        //   categoryIndex,
        //   childIndex,
        //   'productIndex,categoryIndex,',
        //   titleSlug,
        //   manufacturerSlug
        // );

        const fpdTarget = document.getElementById('fpd-target');
        if (!fpdTarget) return;

        this.appOptions = {
          productsJSON: 'assets/data/products/product-categories.json',
          // productsJSON: 'https://styleflip-backend-jdm5.ithemes.xyz/api/productmeta/getAllProductMetas',
          productsJSON1: 'assets/data/products/product-categories-new.json',
          // designsJSON: 'assets/data/designs/design-categories.json',
          designsJSON:
            'https://styleflip-backend-jdm5.ithemes.xyz/api/element/getAllElements',
          langJSON: 'assets/data/langs/default.json',
          // layout: 'topbar',
          stageWidth: 2500,
          stageHeight: 1000,
          initialActiveModule: 'products',
          // toolbarPlacement: "inside-top",
          editorMode: false,
          smartGuides: true,
          imageEditor: true,
          customTextParameters: {
            colors: false,
            removable: true,
            resizable: true,
            draggable: true,
            rotatable: true,
            autoCenter: true,
            boundingBox: 'Base',
          },
          customImageParameters: {
            draggable: true,
            removable: true,
            resizable: true,
            rotatable: true,
            colors: '#000',
            autoCenter: true,
            boundingBox: 'Base',
            patterns: true,
            filters: true,
          },
          actions: {
            // 'top': ['download', 'share', 'print', 'save', 'preview-lightbox', 'paste'],
            top: [],
            // 'right': ['manage-layers', 'magnify-glass', 'zoom', 'reset-product', 'qr-code', 'ruler'],
            right: [],
            // 'bottom': ['zoom'],
            left: ['undo', 'redo', 'download', 'zoom', 'reset-product'],
            center: [],
            // 'center': ['download','preview-lightbox','paste','zoom','reset-product','qr-code','ruler']
          },
          selectedColor: '#f5f5f5',
          boundingBoxColor: '#005ede',
          outOfBoundaryColor: '#990000',
          cornerIconColor: '#000000',
          mainBarModules: [
            'products',
            'productsnew',
            'designs',
            'text',
            'images',
            'manage-layers',
            // 'text-layers',
            'save-load',
          ],
          patterns: [
            {
              title: 'Polka Dots',
              url: 'https://www.toptal.com/designers/subtlepatterns/patterns/polka-dots.png',
            },
            {
              title: 'Stripes',
              url: 'https://www.toptal.com/designers/subtlepatterns/patterns/diagonal-stripes.png',
            },
            {
              title: 'Wood Grain',
              url: 'https://www.toptal.com/designers/subtlepatterns/patterns/wood-pattern.png',
            },
          ],
          fonts: fontData,
          textTemplates: [
            {
              text: 'I love Styleflip',
              properties: {
                fontSize: 50,
                fontFamily: 'Bangers',
                fill: '#ff5722', // Vibrant orange
                stroke: '#000000', // Black outline
                strokeWidth: 2,
                shadow: 'rgba(0,0,0,0.3) 2px 2px 3px',
                curved: true, // Enable curved text
                curveSpacing: 5, // Space between letters
                curveRadius: 180, // Adjust radius of the curve
                curveReverse: false,
                curvable: 1,
                patterns: true,
              },
            },
            {
              text: 'Fun Times',
              properties: {
                fontSize: 80,
                fontFamily: 'Fredoka One',
                fill: '#3f51b5', // Blue
                stroke: '#010101',
                curvable: 1, // White outline
                strokeWidth: 3,
                shadow: 'rgba(255,255,255,0.5) 0px 0px 6px',
              },
            },
            {
              text: 'Creative Soul',
              properties: {
                fontSize: 70,
                fontFamily: 'Pacifico',
                fill: '#e91e63', // Pink
                stroke: '#ffc107', // Yellow outline
                curvable: 1,
                strokeWidth: 2,
                shadow: 'rgba(0,0,0,0.2) 1px 1px 4px',
              },
            },
            {
              text: 'Dream Big',
              properties: {
                fontSize: 98,
                fontFamily: 'Lobster',
                fill: '#4caf50', // Green
                stroke: '#ffffff', // White outline
                strokeWidth: 2,
                curvable: 1,
                shadow: 'rgba(0,0,0,0.4) 3px 3px 5px',
              },
            },
          ],
          fileServerURL: 'https://file.handler.php.stageprojects.xyz/',
          // fileServerURL: 'http://localhost/fpd/file-handler.php',
          uploadZone: {
            useDataURL: true, // ✅ allows upload directly in browser
          },
          facebookAppId: '325741021422456',
          instagramClientId: 'bbe4d544897b4fb0b1bae5a6b44a310b',
          instagramRedirectUri: 'assets/html/instagram_auth.html',
          instagramTokenUri: '',
          colorPickerPalette: [
            '#000',
            '#f4cccc',
            '#fce5cd',
            '#fff2cc',
            '#d9ead3',
            '#d0e0e3',
            '#cfe2f3',
            '#d9d2e9',
            '#ead1dc',
            '#5f27cd',
            '#222f3e',
            '#10ac84',
          ],
          pixabayApiKey: '3326084-d99995263eac7194c77ed7401',
          pixabayLang: 'en',
          pixabayHighResImages: false,
          elementParameters: {},

          lazyLoad: true,
          toolbarPlacement: 'smart',
          // imageParameters:{
          //   advancedEditing: true
          // }
        };

        this.designer = new FancyProductDesigner(
          this.document.querySelector('#clothing-designer'),
          this.appOptions
        );
        
       
        const dataofproducts = localStorage.getItem('fpdProductsJSON');
        console.log('dataofproducts', dataofproducts); 
        const canvas = this.designer?.currentViewInstance?.fabricCanvas;
       
        if (canvas) {
          canvas.selection = true;
          canvas.selectionKey = 'shiftKey';
          canvas.forEachObject((obj: any) => {
            obj.selectable = true;
            obj.evented = true;
          });
          canvas.renderAll();
        }

        // Enable multi-select on the Fabric.js canvas
        if (this.designer?.currentViewInstance?.fabricCanvas) {
          this.designer.currentViewInstance.fabricCanvas.selection = true;
        }

        // Optionally: Add a keyboard shortcut (Ctrl+G) to group selected objects
        window.addEventListener('keydown', (event: KeyboardEvent) => {
          if (
            event.ctrlKey &&
            event.key.toLowerCase() === 'g' &&
            this.designer?.currentViewInstance?.fabricCanvas
          ) {
            this.groupSelectedObjects();
            event.preventDefault();
          }
        });

        // ✅ Hook up buttons AFTER FPD is ready
        // $('#print-button').click(() => designer.print());

        // $('#preview-button').on('click', () => {
        //   alert('Opening preview...');
        //   console.log("jjjjj")
        //   designer.previewLightbox();
        // });
        // $('#save-button').click(() => {
        //   designer.getProduct().then((data: any) => {
        //     console.log('Saved Design Data:', data);
        //   });
        // });

        // 🔧 Get slugified brand/product name from route
        // const brandSlug = this.route.snapshot.paramMap.get('manufacturer')?.toLowerCase() || '';
        // const productSlug = this.route.snapshot.paramMap.get('slug')?.toLowerCase() || '';
        // console.log(brandSlug,productSlug , "1234productSlug.....",this.designer.container)

        // 🔧 Wait until FPD products are loaded
        // const productLoadInterval = setInterval(() => {
        // $(this.designer.container).on('fpdProductCreate', () => {
        // setTimeout(() => {
        //       const allProducts = $('.fpd-module-products .fpd-item');
        //   console.log("1234yes it si scaalled")

        //   // if (allProducts.length > 0) {
        //     // clearInterval(productLoadInterval);

        //     const matchingProduct = allProducts.filter((i, el) => {
        //       const title = $(el).data('title')?.toString().toLowerCase() || '';
        //       const manufacturer = $(el).data('manufacturer')?.toString().toLowerCase() || '';

        //       const titleSlug = this.slugify(title);
        //       const manufacturerSlug = this.slugify(manufacturer);

        //       return titleSlug === productSlug && manufacturerSlug === brandSlug;
        //     }).first();
        //     console.log(matchingProduct , "1234matchingProductmatchingProduct")

        //     if (matchingProduct.length > 0) {
        //       matchingProduct.trigger('click');
        //     } else {
        //       console.warn('Matching product not found in FPD. Loading first product.');
        //       allProducts.first().trigger('click');
        //     }
        //   // }
        //   console.log(allProducts , "1234matchingProductmatchingProduct")
        // // })
        // // }, 200);
        // }, 5000);

        // Inside ngAfterViewInit or wherever you initialize FPD
        //  const firstItem = $('.fpd-module-products .fpd-item').first();
        //  const title = firstItem.data('title');
        //  this.activeImageTitle = 'Apple Macbook Pro 16 2019 512GB SSD Storage';

        $(document).on('click', 'fpd-module-products .fpd-item', (event) => {
          localStorage.setItem('productIndex', '');
          localStorage.setItem('categoryIndex', '');
          console.log(event.currentTarget, 'click happen', event);
          const clickedTitle = $(event.currentTarget).data('title');
          console.log(clickedTitle, 'cllllllll', $(event.currentTarget));
          const manufacturer = $(event.currentTarget).data('manufacturer');
          // let updatedTarget = JSON.parse(JSON.stringify(event.target));
          console.log(event);
          let ob: any;

          try {
            ob = (Object.entries(event.target)[1][1] as any)['manufacturer'];
          } catch (error) {
            ob = 'apple'; // fallback
          }
          // console.log(event, Object.entries(event.target), 'Clicked:', ob, clickedTitle, 'Manufacturer:', manufacturer);

          const slug = this.slugify(clickedTitle);
          const manufacturerSlug = this.slugify(ob);
          console.log(
            manufacturer,
            'mamamam',
            localStorage.getItem('productLoader')
          );
          let productLoadervaalue = localStorage.getItem('productLoader');
          if (!productLoadervaalue || productLoadervaalue != '') {
            this.router.navigate([manufacturerSlug || 'apple', slug]);
          }
        });
      }, 300);

      
    }

    if (isPlatformBrowser(this.platformId)) {
      const waitForElements = () => {
        const hideIcon = this.document.querySelector(
          '.hide-icon'
        ) as HTMLElement;
        const mainBar = this.document.querySelector(
          'fpd-main-bar'
        ) as HTMLElement;

        if (hideIcon && mainBar) {
          console.log('Element found:', hideIcon, mainBar);

          // Click event — collapse
          hideIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event bubbling
            console.log('click happen');
            this.savedContent = mainBar.innerHTML;
            mainBar.style.maxWidth = '80px';
            mainBar.style.backgroundColor = '#f0f1f5';
            mainBar.classList.toggle('box-white-inactive');
            hideIcon.style.display = 'none'; // 👈 hide the icon
          });

          // Observe content changes — expand
          const contentObserver = new MutationObserver(() => {
            if (mainBar.innerHTML !== this.savedContent) {
              mainBar.style.maxWidth = '';
              mainBar.style.backgroundColor = '#fff';
              mainBar.classList.remove('box-white-inactive');
              hideIcon.style.display = 'flex'; // 👈 show icon again
            }
          });

          contentObserver.observe(mainBar, {
            childList: true,
            subtree: true,
            characterData: true,
          });

          // Observe class changes for fpd-active — expand
          const activeObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
              if (
                mutation.type === 'attributes' &&
                mutation.attributeName === 'class'
              ) {
                const target = mutation.target as HTMLElement;
                if (target.classList.contains('fpd-active')) {
                  console.log('fpd-active class detected on:', target);
                  var activeclick = localStorage.getItem('fpdMenuClicked');
                  console.log('activeclick', activeclick);
                  if (activeclick != 'true') {
                    document
                      .querySelectorAll('.fpd-popup.visible')
                      .forEach((el) => {
                        el.classList.remove('visible');
                      });

                    // Remove "backdrop-test" from elements that have it
                    document
                      .querySelectorAll('.backdrop-test')
                      .forEach((el) => {
                        el.classList.remove('backdrop-test');
                        // localStorage.getItem('fpdMenuClicked')
                      });
                  }
                  if (target.getAttribute('data-module') === 'designs') {
                    const el = document.getElementById('icon-search-back-data');
                    if (el) {
                      el.classList.add('fpd-hidden');
                    }
                  }
                  mainBar.style.maxWidth = '';
                  mainBar.style.backgroundColor = '#fff';
                  mainBar.classList.remove('box-white-inactive');
                  hideIcon.style.display = 'flex'; // 👈 show icon again
                }
              }
            }
          });

          // Observe children of fpd-main-bar
          mainBar.querySelectorAll('*').forEach((child) => {
            activeObserver.observe(child, {
              attributes: true,
              attributeFilter: ['class'],
            });
          });

          // Re-scan DOM every 1s for new children
          const childScanInterval = setInterval(() => {
            mainBar.querySelectorAll('*').forEach((child) => {
              activeObserver.observe(child, {
                attributes: true,
                attributeFilter: ['class'],
              });
            });
          }, 1000);
        } else {
          setTimeout(waitForElements, 300); // retry until elements exist
        }
      };

      waitForElements();
    }

    setTimeout(() => {
      const searchInput = document.getElementById(
        'searchInput'
      ) as HTMLInputElement;

      if (searchInput) {
        searchInput.addEventListener('keyup', () => {
          this.filterThumbnailsP(searchInput.value);
        });
      }

      const searchInputs = document.getElementById(
        'searchInputs'
      ) as HTMLInputElement;
      if (searchInputs) {
        searchInputs.addEventListener('keyup', () => {
          this.filterThumbnails(searchInputs.value);
        });
      }

      this.updateTagsFromDesignModule();
      const dropdownItems = document.querySelectorAll(
        'fpd-module-productsnew .fpd-dropdown-list .fpd-item'
      );
      console.log('Dropdown Items Found:', dropdownItems);

      dropdownItems.forEach((item) => {
        item.addEventListener('click', () => {
          const tagWrappertags = document.getElementById(
            'tag-wrapper-design-tags'
          );
          if (tagWrappertags) {
            tagWrappertags.remove();
            console.log('Removed tag-wrapper-design-tags');
          }
          this.updateTagsFromDesignModule();
          console.log('Tags updated from Design Module');
        });
      });
    }, 2000);

    setTimeout(() => {
      const checkAndHideDuplicateFpdItems = () => {
        const containers =
          this.document.querySelectorAll<HTMLElement>('.ProductModuleMy');
        console.log(
          '✅ Running deduplication check on containers:',
          containers
        );

        containers.forEach((container) => {
          const items = container.querySelectorAll<HTMLElement>('.fpd-item');
          const seenIndexes = new Set<string>();

          items.forEach((item) => {
            const index = item.getAttribute('data-index');
            if (!index) return;

            if (seenIndexes.has(index)) {
              item.style.display = 'none';
            } else {
              seenIndexes.add(index);
              item.style.display = ''; // Ensure visible
            }
          });
        });
      };

      // Step 1: Find .ProductModuleMy and observe inner DOM changes
      const productModule = this.document.querySelector('.ProductModuleMy');

      if (productModule) {
        const innerHtmlObserver = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              console.log('📦 Inner HTML changed: DOM children updated');
              checkAndHideDuplicateFpdItems();
            }
          }
        });

        // Step 2: Observe inner HTML (child elements) of the container
        innerHtmlObserver.observe(productModule, {
          childList: true, // Watch for direct child changes
          subtree: true, // Also look deep inside the tree
        });

        // Step 3: Run once initially
        checkAndHideDuplicateFpdItems();
      }

      this.moveBoldToPrimaryTools()
    }, 3000);
  }

  moveBoldToPrimaryTools(): void {
    const targetElement = document.getElementById('boldOutside');

    if (targetElement) {
      targetElement.addEventListener('click', (event) => {
          this.designer.currentViewInstance.fabricCanvas.setElementOptions({
            fontWeight:
              this.designer.currentViewInstance.fabricCanvas.getActiveObject().fontWeight === 'bold'
                ? 'normal'
                : 'bold',
          });

          targetElement.classList.toggle(
            'active',
            this.designer.currentViewInstance.fabricCanvas.getActiveObject().fontWeight === 'bold'
          );
      });
    }

    const targetElement2 = document.getElementById('fontItalic');
    if (targetElement2) {
      targetElement2.addEventListener('click', () => {
        this.designer.currentViewInstance.fabricCanvas.setElementOptions({
          fontStyle:
            this.designer.currentViewInstance.fabricCanvas.getActiveObject().fontStyle === 'italic'
              ? 'normal'
              : 'italic',
        });

        targetElement2.classList.toggle(
          'active',
          this.designer.currentViewInstance.fabricCanvas.getActiveObject().fontStyle === 'italic'
        );
      });
    }

    const targetElement3 = document.getElementById('UnderlineText');
    if (targetElement3) {
      targetElement3.addEventListener('click', () => {
        this.designer.currentViewInstance.fabricCanvas.setElementOptions({
          textDecoration:
            this.designer.currentViewInstance.fabricCanvas.getActiveObject().textDecoration === 'underline'
              ? 'normal'
              : 'underline',
        });

        targetElement3.classList.toggle(
          'active',
          this.designer.currentViewInstance.fabricCanvas.getActiveObject().textDecoration === 'underline'
        );
      });
    }

      const targetElement4 = document.getElementById('TextTransform');

      if (targetElement4) {
        targetElement4.addEventListener('click', () => {
          const obj = this.designer.currentViewInstance.fabricCanvas.getActiveObject();
          if (!obj || !obj.text) return;

          const spanIcon = targetElement4.querySelector('span');

          // Cycle through transform states
          const current = obj.textTransform || 'none';
          const next = current === 'none' ? 'uppercase' : current === 'uppercase' ? 'lowercase' : 'none';

          // Apply transform
          this.designer.currentViewInstance.fabricCanvas.setElementOptions({
            textTransform: next,
          });

          // Update icon
          if (spanIcon) {
            spanIcon.className = ''; // Remove previous icon class
            if (next === 'uppercase') {
              spanIcon.classList.add('fpd-icon-uppercase');
            } else if (next === 'lowercase') {
              spanIcon.classList.add('fpd-icon-lowercase');
            } else {
              spanIcon.classList.add('fpd-icon-text-transform');
            }
          }

          // Toggle 'active' class based on next transform state
          if (next === 'none') {
            targetElement4.classList.remove('active');
          } else {
            targetElement4.classList.add('active');
          }
        });

      }

      const alignButton = document.getElementById('textAlignCust');

      if (alignButton) {
        alignButton.addEventListener('click', () => {
          const span = alignButton.querySelector('span');
          const obj = this.designer.currentViewInstance.fabricCanvas.getActiveObject();
          if (!obj || !obj.text) return;

          const current = obj.textAlign || 'left';

          // Determine next alignment
          const next = current === 'left' ? 'center' : current === 'center' ? 'right' : 'left';

          // Set textAlign
          this.designer.currentViewInstance.fabricCanvas.setElementOptions({
            textAlign: next,
          });

          // Update icon class based on new alignment
          if (span) {
            span.className = ''; // Reset
            span.setAttribute('data-option', next);

            if (next === 'center') {
              span.classList.add('fpd-icon-format-align-center');
            } else if (next === 'right') {
              span.classList.add('fpd-icon-format-align-right');
            } else {
              span.classList.add('fpd-icon-format-align-left');
            }
          }


          const allAlignButtons = document.querySelectorAll('.fpd-align-button span');
          allAlignButtons.forEach(el => el.classList.remove('active'));

          if (span) {
            span.classList.add('active-icon');
          }
        });
      }


      const positionButton = document.getElementById('CenterTools');

      if (positionButton) {
        positionButton.addEventListener('click', (e) => {
          
            const target = e.currentTarget as HTMLElement;
             if (document.body.classList.contains('fpd-toolbar-transform-our')) {
                        document.body.classList.remove('fpd-toolbar-transform-our');
                        document.querySelector('.fpd-tool-transform')?.classList.remove('fpd-active');
                    }
            var hasClass = target.classList.contains('letter-spac-active');
            if(hasClass){
              // Step 1: Remove 'letter-spac-active' class from the clicked element
              target.classList.remove('letter-spac-active');
              const subPanel = document.querySelector('.fpd-sub-panel');
              if (!subPanel) return;

              // Step 2: Remove 'fpd-active' from any active children in sub-panel
              subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
                el.classList.remove('fpd-active');
              });

              return;
            }

            target.classList.add('letter-spac-active');
            // Step 1: Find the closest `.fpd-sub-panel` parent
            const subPanel = document.querySelector('.fpd-sub-panel');
            console.log("subPanel data is", subPanel)
            if (!subPanel) return;

            // Step 2: Remove 'fpd-active' from any active children in sub-panel
            subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
              el.classList.remove('fpd-active');
            });

            // Step 3: Find `.fpd-panel-position` inside the same sub-panel
            const positionPanel = subPanel.querySelector('.fpd-panel-position');
            if (positionPanel) {
              positionPanel.classList.add('fpd-active', 'fpd-pos-data-sec');
            }

            const elementtoolbar = document.querySelector('fpd-element-toolbar');
            console.log("djjjjj",elementtoolbar)
            if(elementtoolbar){
              elementtoolbar.classList.add('fpd-panel-visible')
            }
        });
      }


      // Move layer up in stack
      document.getElementById('TextMoveUp')?.addEventListener('click', () => {
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const obj = canvas.getActiveObject();
        console.log('Text Move Up clicked', canvas, obj);
        if (obj) {
          canvas.bringForward(obj); // Moves object one step up in layer
          canvas.requestRenderAll();
        }
      });

      // Move layer down in stack
      document.getElementById('TextMoveDown')?.addEventListener('click', () => {
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const obj = canvas.getActiveObject();
        console.log('Text Move Down clicked', canvas, obj);
        if (obj) {
          canvas.sendBackwards(obj); // Moves object one step down in layer
          canvas.requestRenderAll();
        }
      });


      const minusEl = document.getElementById('minusElement');
      const plusEl = document.getElementById('plusElement');

      if (minusEl) {
        minusEl.addEventListener('click', () => {
          const inputEl = document.querySelector('input[data-control="fontSize"]') as HTMLInputElement;
          if (inputEl) {
            let current = parseInt(inputEl.value) || 1;
            current = Math.max(1, current - 1); // Prevent going below 1
            inputEl.value = String(current);

            // Update canvas font size
            this.designer.currentViewInstance.fabricCanvas.setElementOptions({
              fontSize: current,
            });
          }
        });
      }

      if (plusEl) {
        plusEl.addEventListener('click', () => {
          const inputEl = document.querySelector('input[data-control="fontSize"]') as HTMLInputElement;
          if (inputEl) {
            let current = parseInt(inputEl.value) || 1;
            current = Math.min(200, current + 1); // Prevent going above 200
            inputEl.value = String(current);

            // Update canvas font size
            this.designer.currentViewInstance.fabricCanvas.setElementOptions({
              fontSize: current,
            });
          }
        });
      }

       /* code to add and remove class on click on layer move up icon */
      let fpdIconMoveUp = document.querySelector('.fpd-icon-move-up');
      fpdIconMoveUp?.addEventListener('click', () => {
        document.querySelector('.fpd-icon-move-up')?.classList.add('active-icon');
       setTimeout(() => {
          document.querySelector('.fpd-icon-move-up')?.classList.remove('active-icon');
        }, 1000)
      });
      /* code to add and remove class on click on layer move up icon */

      /* code to add and remove class on click on layer move up icon */
      let fpdIconMoveDown = document.querySelector('.fpd-icon-move-down');
      fpdIconMoveDown?.addEventListener('click', () => {
        document.querySelector('.fpd-icon-move-down')?.classList.add('active-icon');
       setTimeout(() => {
          document.querySelector('.fpd-icon-move-down')?.classList.remove('active-icon');
        }, 1000)
      });
      /* code to add and remove class on click on layer move up icon */

      let copiedObject: any = null;
      
      // COPY
      document.getElementById('copytext')?.addEventListener('click', (e) => {
        console.log("e.currentTarget",e.currentTarget)
        // if (e.currentTarget) {
        //   (e.currentTarget as HTMLElement).classList.add('active');
        // }
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const obj = canvas.getActiveObject();
        if (obj) {
          obj.clone((cloned: any) => {
            copiedObject = cloned;
            console.log('Copied object:', copiedObject);
            this.showToast('Copied successfully!');
          });
        }
        
      });

      // PASTE
      document.getElementById('pastetext')?.addEventListener('click', () => {
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        if (copiedObject) {
          // const e = this.designer.currentViewInstance.options;
          // copiedObject.clone((cloned: any) => {
          //   cloned.set({
          //     left: cloned.left + 10,
          //     top: cloned.top + 10,
          //     evented: true,
          //     selectable: true,
          //     removable: true,
          //     resizable: 1,
          //     transformable: true,
          //     editable: true,
          //     hasControls: true,
          //     textTransform: "none",
          //     isEditable: true,
          //     zChangeable: 1,
          //     boundingBox: "Base",
          //     boundingBoxMode: "clipping",
          //     copyable: true,
          //     draggable: true,
          //     lockScalingX: false,
          //     lockScalingY: false,
          //     lockUniScaling: true,
          //     colors: ['#000'],
          //     cornerSize: 24,
          //     textBox: false,
          //     rotatable: true,
          //     userAdded: true
          //   });

          //   const canvas = this.designer.currentViewInstance.fabricCanvas;

          //   // canvas.add(cloned);
          //   // canvas.setActiveObject(cloned);
          //   // canvas.renderAll();
          //   let n = 'happy text'
          //   const text = n;
          //   console.log("updated data", cloned  )
          //   this.designer.currentViewInstance.fabricCanvas.addElement('text', n, text, cloned);

            
          //   const objects = this.designer.currentViewInstance.fabricCanvas.getObjects();
          //   const element = objects[objects.length - 3]; 
          //   console.log("jsj",this.designer.currentViewInstance.fabricCanvas.setActiveObject)
          //   // Highlight/select the new element
          //   if (element && typeof this.designer.currentViewInstance.fabricCanvas.setActiveObject === 'function') {
          //       this.designer.currentViewInstance.fabricCanvas.setActiveObject(element);
          //       this.designer.currentViewInstance.fabricCanvas.renderAll();
          //   }

          //   // ✅ Trigger Fancy Product Designer events
          //   $(document).trigger('fpdRefreshLayers');
          //   $(document).trigger('elementAdd', [cloned]);

            
          // });
          this.designer.currentViewInstance.fabricCanvas.duplicateElement(
              this.designer.currentElement
            )

             this.showToast('Paste successfully!');

        }
      });

       document.getElementById('letter-spacing')?.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.classList.add('letter-spac-active');
           const subPanel = document.querySelector('.fpd-sub-panel');
            console.log("subPanel data is", subPanel)
            if (!subPanel) return;

            // Step 2: Remove 'fpd-active' from any active children in sub-panel
            subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
              el.classList.remove('fpd-active');
            });

            // Step 3: Find `.fpd-panel-position` inside the same sub-panel
            const positionPanel = subPanel.querySelector('.fpd-panel-text-size');
            if (positionPanel) {
              positionPanel.classList.add('fpd-active', 'fpd-letter-spacing-lineheight');
              this.document.body.classList.remove('fpd-tools-custom-data')
            }

            const elementtoolbar = document.querySelector('fpd-element-toolbar');
            console.log("djjjjj",elementtoolbar)
            if(elementtoolbar){
              elementtoolbar.classList.add('fpd-panel-visible')
            }
       });
       

       function setupShareButtonHandlersForAllMenus() {
  const shareMenus = document.querySelectorAll('.fpd-share-menussss');

  shareMenus.forEach((shareMenu) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'style'
        ) {
          const display = window.getComputedStyle(shareMenu as HTMLElement).display;
          if (display === 'block') {
            const shareBtn = shareMenu.querySelector('.fpd-share-link-btn');
            if (shareBtn) {
              // Prevent duplicate bindings
              shareBtn.removeEventListener('click', handleShareClick);
              shareBtn.addEventListener('click', handleShareClick, { once: true });
            }
          }
        }
      });
    });

    observer.observe(shareMenu, {
      attributes: true,
      attributeFilter: ['style'],
    });
  });
}

function handleShareClick(e: Event) {
  alert("check");
  e.stopPropagation();
  e.preventDefault();
  console.log('Share button clicked', e);

  const target = e.currentTarget as HTMLElement;

  // Traverse up to find closest `.fpd-item`
  const parentItem = target.closest('.fpd-item.fpd-hover-thumbnail.ts') as HTMLElement;

  if (!parentItem) {
    alert('Design element not found.');
    return;
  }

  const dataSource = parentItem.getAttribute('data-source');
  const dataTitle = parentItem.getAttribute('data-title');

  const storedData = localStorage.getItem('clothing-designer');

    let matchedData: any[] = [];

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);

        if (Array.isArray(parsedData)) {
          // Step 2: Find all items that match dataTitle
          matchedData = parsedData.filter(item => item.title === dataTitle);

          console.log("Matched Data of:", matchedData);
        } else {
          console.error("Data is not an array:", parsedData);
        }
      } catch (err) {
        console.error("Failed to parse localStorage data:", err);
      }
    } else {
      console.warn("No data found in localStorage for key:");
    }
    console.log("matchedData",matchedData, matchedData[0]?.design_id)
  if (!dataSource || !dataTitle) {
    alert('Missing design data.');
    return;
  }

  // API call to search product by title
fetch(`https://styleflip-backend-jdm5.ithemes.xyz/api/sharedproduct/search?title=${encodeURIComponent(dataTitle)}&design_id=${matchedData[0]?.design_id}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('Search API Response:', data);

    // Assuming API returns: { products: [{ _id: '...', title: '...' }, ...] }
    if (data && data.product && data.product.length > 0) {
      const firstProduct = data.product[0]; // Take the first matching product
      const urlBase = window.location.origin;
      const shareUrl = `${urlBase}/savedesign?design_id=${data.design_id}&title=${encodeURIComponent(data.title)}`;

      const urlField = document.querySelector('.fpd-share-link-url');
      const copyBtn = document.querySelector('.fpd-share-link-btn');

      if (urlField) urlField.textContent = shareUrl;

      if (navigator.clipboard && copyBtn) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy Link';
          }, 1200);
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

}

// Run after DOM is ready
setupShareButtonHandlersForAllMenus();



       const panel = document.getElementById('panel-text-size-data');

      if (panel) {
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'class'
            ) {
              const hasClass = panel.classList.contains('fpd-active');
              if (!hasClass) {
                this.document.getElementById('letter-spacing')?.classList.remove('letter-spac-active');
                console.log('Class "fpd-active" was removed from #panel-text-size-data');
                // ✅ Your condition logic here
              }
            }
          }
        });

        observer.observe(panel, { attributes: true });
      }


      const paneldata = document.querySelector('.fpd-panel-position');

      if (paneldata) {
        const observer = new MutationObserver((mutationsList) => {
          for (const mutation of mutationsList) {
            if (
              mutation.type === 'attributes' &&
              mutation.attributeName === 'class'
            ) {
              const hasClass = paneldata.classList.contains('fpd-active');
              if (!hasClass) {
                this.document.getElementById('CenterTools')?.classList.remove('letter-spac-active');
                console.log('Class "fpd-active" was removed from #panel-text-size-data');
                // ✅ Your condition logic here
              }
            }
          }
        });

        observer.observe(paneldata, { attributes: true });
      }

      document.addEventListener('click', function (event) {
          const productStage = document.querySelector('.fpd-product-stage');
          const viewStage = document.querySelector('.fpd-view-stage');
          const toolbar = document.querySelector('fpd-element-toolbar');
          

          // Check if the click is inside .fpd-product-stage but NOT inside .fpd-view-stage
          const clickedInsideProductStage = productStage?.contains(event.target as Node);
          const clickedInsideViewStage = viewStage?.contains(event.target as Node);

          if (clickedInsideProductStage && !clickedInsideViewStage) {
            // Hide or remove toolbar
            if (toolbar) {
              toolbar.classList.remove('fpd-show'); // If using Tailwind
              // toolbar.style.display = 'none'; // If not using Tailwind
              // lettspac?.classList.remove('letter-spac-active');
            }
          }
        });

    
    }

  slugify(title: string): string {
    return title
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[^\w\s-]/g, '') // Remove special chars
      ?.replace(/\s+/g, '-') // Replace spaces with -
      ?.replace(/--+/g, '-'); // Collapse hyphens
  }

  ngOnInit() {
    
    window.addEventListener('load', () => {
      fetch('https://styleflip-backend-jdm5.ithemes.xyz/api/product/getAllProducts')
        .then(res => res.json())
        .then(data => {
          console.log('Large products loaded:', data);
          console.log('', this.designer)
          localStorage.setItem('fpdProductsJSON', JSON.stringify(data));
          this.designer.product = data;
          console.log(this.designer.product, '1111111111111', this.designer)
        })
        .catch(err => console.error('Error loading large products:', err));
    });   


    const slug = this.route.snapshot.paramMap.get('slug');
    const manufacturer = this.route.snapshot.paramMap.get('manufacturer');
    console.log(this.route.snapshot.paramMap, 'Selected slug:', slug);
    const currentUrl = this.router.url;
    if (currentUrl.includes('savedesign')) {
      this.showFPDLoading(true);
      this.route.queryParams.subscribe(params => {
        const id = params['design_id'];
        const title = params['title'];

        console.log('Design Save Detected!');
        console.log('ID:', id);
        console.log('Title:', title);
        fetch(`https://styleflip-backend-jdm5.ithemes.xyz/api/sharedproduct/search?title=${encodeURIComponent(title)}&design_id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
              console.log("data is:", data)
              let existing = localStorage.getItem('clothing-designer');
              let parsed = existing ? JSON.parse(existing) : [];

              // ✅ Only push if localStorage is empty
              if (parsed.length === 0) {
                parsed.push(data);
                localStorage.setItem('clothing-designer', JSON.stringify(parsed));
              }
              const designTitleData = localStorage.getItem('clothing-designer');
              console.log("ddddddddddddddddddAnoooooo")
              let matchedDesign = null;
              if (designTitleData) {
                const parsedDesigns = JSON.parse(designTitleData);
                matchedDesign = parsedDesigns.find((i: any) => i.title === title);
              }

              if (matchedDesign) {
                setTimeout(() => {
                  console.log(matchedDesign, 'Matched Design:', this.designer);
                  this.designer.currentViewInstance.fabricCanvas.clear();
                  this.designer.loadProduct(matchedDesign.product)
                  this.showFPDLoading(false);
                  const gridContainer = document.querySelector('.fpd-saved-designs');
                  // if (gridContainer) {
                  //    this.designer.currentViewInstance.fabricCanvas.clear();
                  //   const savedDesigns = gridContainer.querySelector('.fpd-grid.fpd-grid-contain');
                  //   if (savedDesigns) {
                  //     // Step 3: Get all .fpd-item elements
                  //     const fpdItems = savedDesigns.querySelectorAll('.fpd-item');

                  //     fpdItems.forEach(item => {
                  //       const dataTitle = item.getAttribute('data-title');

                  //       if (dataTitle === matchedDesign.title) {
                  //         // Step 4: Match found, get outer HTML
                  //         const itemHTML = item.outerHTML;
                  //         console.log('Matched HTML:', itemHTML);
                  //         const s = itemHTML;
                  //         this.designer.fpdInstance.addSavedProduct(s)
                  //         // You can return or use this as needed
                  //       }
                  //     });
                  //   } else {
                  //     console.warn('.fpd-saved-designs not found inside .fpd-grid-contain');
                  //   }
                  // }

                  // this.designer.currentViewInstance.fabricCanvas.addElement('image', {
                  //   source: matchedDesign.thumbnail,
                  //   title: matchedDesign.title,
                  // });
                
                  // this.designer.currentViewInstance.fabricCanvas.addElement(
                  //   'image',
                  //           matchedDesign.thumbnail,
                  //           matchedDesign.title,
                  //           matchedDesign.product
                  // )
                  // this.designer.loadProduct(matchedDesign.product)
                  // this.designer?.currentViewInstance?.fabricCanvas?.clear();
                  // if (this.designer && matchedDesign && matchedDesign.product) {
                  //   console.log('Loading saved design:', matchedDesign.title);
                  //   const viewIndex = 0; // Or use a dynamic value from localStorage

                  //   const savedView = matchedDesign.product[viewIndex];

                  //   if (savedView && savedView.elements) {
                  //     console.log(savedView, 'Loading saved design inside:', savedView.title);
                  //     // Clear current canvas view
                  //     this.designer.currentViewInstance.fabricCanvas.clear();
                  //     // this.designer.currentViewInstance.fabricCanvas.addElements(savedView);  
                  //     // this.designer.currentViewInstance.fabricCanvas.renderAll();

                  //     savedView.elements.forEach((element: any) => {
                  //       this.designer.currentViewInstance.fabricCanvas.loadFromJSON(
                  //         element,
                  //         () => {
                  //           this.designer.currentViewInstance.fabricCanvas.renderAll();
                  //           console.log('Loaded element:', element);
                  //         }
                  //       );
                  //     });
                  //     // this.designer.fpdInstance.addView(JSON.parse(savedView), true)
                  //     // this.designer.mainOptions.getViewInstance().loadView(JSON.parse(savedView))
                  //     // this.designer.fpdInstance.addView({
                  //     //   title: savedView.title,
                  //     //   thumbnail: savedView.thumbnail,
                  //     //   elements: savedView.elements,
                  //     //   options: savedView.options
                  //     // })
                  //     // Load saved view into FPD
                  //     // this.designer.mainOptions.loadElementJSON(
                  //     //   savedView.elements,
                  //     //   () => {
                  //     //     console.log(`Loaded view "${savedView.title}" into canvas.`);
                  //     //     this.designer.currentViewInstance.fabricCanvas.renderAll();
                  //     //   },
                  //     //   viewIndex
                  //     // );
                  //   } else {
                  //     console.warn('No valid view data found in matchedDesign.product[0].');
                  //   }
                  // }
                  // this.designer?.currentViewInstance?.fabricCanvas?.setActiveObject(null);
                  // this.designer?.loadProduct(matchedDesign);
                  console.log('Matched Design:', matchedDesign);
                }, 10000);
              } else {
                console.log('No matching title found in designTitleData.');
              }
          });
        // 👉 You can now use id/title as needed
      });
    }
    console.log('Current URL:', currentUrl, 'local');
    if(slug === null){
      localStorage.setItem('selectedSlug', ''); 
    }
    else if(slug && slug !== 'undefined') {
      localStorage.setItem('selectedSlug', slug); 
      localStorage.setItem('selectedManufacturer', manufacturer || 'apple'); 
    }
    else{
      localStorage.setItem('selectedSlug', 'top-face-with-slipmat'); 
    }
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      this.showLoginPopup = false;
    }
    this.loadDesigns();
    
  }
  bottomMenu() {
    const sourceElement = document.getElementById('content-text');
    console.log('sourceElement', sourceElement);
    if (sourceElement) {
      const htmlContent = sourceElement.innerHTML;
      localStorage.setItem('savedContentText', htmlContent);
      localStorage.setItem('parentDivId', 'ProductModule');
      console.log('Content saved to localStorage');
      localStorage.setItem('valueofTitle', '');
    }
  }
  showToast(message: string = 'Copied successfully!') {
  let toast = document.getElementById('custom-toast') as HTMLElement | null;

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '70%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = '#fff';
    toast.style.padding = '10px 16px';
    toast.style.borderRadius = '6px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.4s ease, bottom 0.4s ease';
    toast.style.opacity = '0';
    toast.style.visibility = 'hidden';

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.visibility = 'visible';
  toast.style.opacity = '1';
  toast.style.top = '10px';
  toast.style.bottom = 'auto';

  setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0';
      toast.style.bottom = '30px';
      toast.style.visibility = 'hidden';
    }
  }, 2000);
}

  previewImage: string = '';
  showPreviewModal: boolean = false;
  preview() {
    if (
      this.designer &&
      this.designer.currentViewInstance &&
      this.designer.currentViewInstance.fabricCanvas
    ) {
      // Only export the current canvas (not all pages/views)
      const canvas = this.designer.currentViewInstance.fabricCanvas;
      const dataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: 1,
        enableRetinaScaling: true,
      });

      const image = new Image();
      image.src = dataUrl;

      image.onload = () => {
        // Create a div with background image
        const previewDiv = document.createElement('div');
        previewDiv.style.background = `url(${image.src})`;
        previewDiv.style.height = '90vh';
        previewDiv.style.width = '100%';
        previewDiv.style.backgroundSize = 'contain';
        previewDiv.style.backgroundRepeat = 'no-repeat';
        previewDiv.style.backgroundPosition = 'center';
        previewDiv.style.zIndex = '9999';
        previewDiv.style.position = 'fixed';
        previewDiv.style.top = '0';
        previewDiv.style.left = '0';
        previewDiv.style.backgroundColor = '#fff';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerText = '✖';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '20px';
        closeButton.style.right = '20px';
        closeButton.style.fontSize = '24px';
        closeButton.style.background = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';

        closeButton.onclick = () => {
          previewDiv.remove();
        };

        previewDiv.appendChild(closeButton);
        document.body.appendChild(previewDiv);
      };
    } else {
      console.error('Designer or current canvas is not ready.');
    }
  }
  showDropdown = false;

  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (
      this.dropdownWrapper &&
      !this.dropdownWrapper.nativeElement.contains(event.target)
    ) {
      this.showDropdown = false;
    }
  }

  filterThumbnails(searchTerm: string) {
    console.log('searchTerm', searchTerm);
    const parentDiv = document.querySelector(
      'div[data-moduleicon="layout-panel-left"]'
    );
    console.log('parentDiv', parentDiv);
    if (!parentDiv) return;

    const thumbnails = parentDiv.querySelectorAll(
      '.fpd-grid .fpd-item.fpd-hover-thumbnail'
    );
    console.log('parentDivdata', thumbnails);

    thumbnails.forEach((thumb: Element) => {
      const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
      console.log('title', title, 'searchTerm', searchTerm);
      const search = searchTerm.toLowerCase();

      (thumb as HTMLElement).style.display = title.includes(search)
        ? 'flex'
        : 'none';
    });
  }

  filterThumbnailsP(searchTerm: string) {
    console.log('searchTerm', searchTerm);
    const parentDiv = document.querySelector(
      'div[data-moduleicon="book-copy"]'
    );
    console.log('parentDiv', parentDiv);
    if (!parentDiv) return;

    const dataTitle = parentDiv.getAttribute('data-title');
    console.log('dataTitle', dataTitle);
    const thumbnails = parentDiv.querySelectorAll(
      '.fpd-grid.skins-data .fpd-item.fpd-hover-thumbnail'
    );
    console.log('parentDivdataif', thumbnails.length);
    if (!thumbnails || thumbnails.length === 0) {
      console.log('No thumbnails found in the parent div.');
      const thumbnails = parentDiv.querySelectorAll(
        '.fpd-grid.ProductModule .fpd-item.fpd-hover-thumbnail'
      );
      thumbnails.forEach((thumb: Element) => {
        const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
        console.log('title', title, 'searchTerm', searchTerm);
        const search = searchTerm.toLowerCase();

        (thumb as HTMLElement).style.display = title.includes(search)
          ? 'flex'
          : 'none';
      });
    } else {
      thumbnails.forEach((thumb: Element) => {
        const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
        console.log('title', title, 'searchTerm', searchTerm);
        const search = searchTerm.toLowerCase();

        (thumb as HTMLElement).style.display = title.includes(search)
          ? 'flex'
          : 'none';
      });
    }
  }

  openLoginPopup() {
    this.showLoginPopup = true;
  }

  closeLoginPopup() {
    this.showLoginPopup = false;
  }

  onLogin(event: Event) {
    event.preventDefault();

    const query = `
      mutation GenerateCustomerToken($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
          token
          __typename
        }
      }
    `;

    const variables = {
      email: this.email,
      password: this.password,
    };

    const payload = {
      query,
      variables,
    };

    this.http
      .post<any>('https://styleflip.v2.ithemes.xyz/graphql', payload)
      .subscribe({
        next: (response) => {
          const token = response?.data?.generateCustomerToken?.token;
          localStorage.setItem('authToken', token)
          if (token) {
            console.log('Login success:', token);
            localStorage.setItem('customerToken', token);
            this.getCustomerDetails(token); // optional
            this.isLoggedIn = true;
            this.showLoginPopup = false;
            this.closeLoginPopup();
          } else {
            alert('Login failed. No token returned.');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          alert('Invalid credentials or network issue.');
        },
      });
  }
  // onLogin(event: Event) {
  //   event.preventDefault();
  //   // Add your login logic here
  //   console.log('Login submitted');
  //   this.closeLoginPopup();
  // }
  getCustomerDetails(token: string) {
    const customerQuery = {
      query: `
      {
        customer {
          firstname
          lastname
          suffix
          email
          addresses {
            id
            firstname
            lastname
            street
            city
            region {
              region_code
              region
            }
            postcode
            country_code
            telephone
            default_billing
            default_shipping
          }
        }
      }
    `,
    };

    this.http
      .post<any>('https://styleflip.v2.ithemes.xyz/graphql', customerQuery, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 🔐 Use token in header
        },
      })
      .subscribe(
        (res) => {
          const customer = res.data?.customer;
          this.firstName = res.data?.customer?.firstname || '';
          this.initialLetter = this.firstName.charAt(0).toUpperCase();
          console.log(this.initialLetter, 'initialLetter');
        },
        (err) => {
          console.error('Customer fetch failed', err);
        }
      );
  }

  updateTagsFromDesignModule() {
    const allTagsSetD = new Set();
    console.log('Anoop Data 4 allTagsSet', allTagsSetD);
    document.querySelectorAll('#DesignModule .fpd-item').forEach((product) => {
      console.log('products-------929290000', product);
      const tags = product
        .getAttribute('data-tags')
        ?.split(',')
        .map((tag) => tag.trim());
      if (tags) tags.forEach((tag) => allTagsSetD.add(tag));
    });
    console.log('Anoop Data 4 allTagsSet---', allTagsSetD);
    const parentDiv = document.querySelector('div[data-title="Productsnew"]');
    console.log('Anoop Data 4 parentDiv', parentDiv);
    if (parentDiv) {
      let currentOffset = 0;

      // Create outer wrapper (position relative for arrow buttons)
      const tagWrapperMain = document.createElement('div');
      tagWrapperMain.className = 'relative w-full fpd-designs-tags mt-2';

      const tagWrapper = document.createElement('div');
      tagWrapper.className = 'flex gap-2 mt-2 ml-[5px] fixed md:top-[164px]';
      tagWrapper.id = 'tag-wrapper-design-tags';

      Array.from(allTagsSetD).forEach((tag) => {
        const tagButton = document.createElement('div');
        tagButton.className =
          'fpd-tag-btn capitalize border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none whitespace-nowrap';
        tagButton.innerText = tag as string;

        tagButton.addEventListener('click', () => {
          // Step 1: Highlight clicked tag and unhighlight others
          document
            .querySelectorAll('.fpd-tag-btn')
            .forEach((btn) => btn.classList.remove('!bg-[#40576d12]'));
          tagButton.classList.add('!bg-[#40576d12]');

          // Step 2: Filter visible .fpd-item based on tag
          const selectedTag = (tag as string).toLowerCase();
          const items = document.querySelectorAll('#DesignModule .fpd-item');

          items.forEach((item) => {
            const tagsAttr = item.getAttribute('data-tags') || '';
            const tagList = tagsAttr
              .split(',')
              .map((t) => t.trim().toLowerCase());
            (item as HTMLElement).style.display = tagList.includes(selectedTag)
              ? 'flex'
              : 'none';
          });

          // Step 3: Hide parent .box-contain-text if all children are hidden
          document
            .querySelectorAll('.box-contain-text')
            .forEach((container) => {
              const children = container.querySelectorAll('.fpd-item');
              const anyVisible = Array.from(children).some(
                (child) => (child as HTMLElement).style.display !== 'none'
              );
              (container as HTMLElement).style.display = anyVisible
                ? 'block'
                : 'none';
            });

          // Step 4: Show Reset Button and shrink search box
          const resetBtn = document.getElementById('fpd-reset-button');
          resetBtn?.classList.remove('hidden');

          const searchBox = document.querySelector(
            '#searchbox-design'
          ) as HTMLElement;
          if (searchBox) {
            searchBox.style.maxWidth = 'calc(100% - 44px)';
            searchBox.style.marginLeft = '0px';
          }
          const inputboxdiv = document.querySelector(
            '#fpd-reset-button'
          ) as HTMLElement;
          if (inputboxdiv) {
            inputboxdiv.style.display = 'block';
          }

          resetBtn?.addEventListener('click', () => {
            if (inputboxdiv) {
              inputboxdiv.style.display = 'none';
            }
            // Show all fpd-item elements
            document
              .querySelectorAll('.fpd-item.fpd-hover-thumbnail')
              .forEach((item) => {
                (item as HTMLElement).style.display = 'flex'; // or 'block' depending on your layout
              });

            // Show all parent .box-contain-text containers
            document
              .querySelectorAll('.box-contain-text')
              .forEach((container) => {
                (container as HTMLElement).style.display = 'block';
              });

            // Remove active class from all tag buttons
            document.querySelectorAll('.fpd-tag-btn').forEach((btn) => {
              btn.classList.remove('!bg-[#40576d12]');
            });

            // Hide the reset button again
            resetBtn.classList.add('hidden');

            // Reset search box width
            const searchBox = document.querySelector(
              '#searchbox-design'
            ) as HTMLElement;
            if (searchBox) {
              searchBox.style.maxWidth = 'calc(100% - 22px)';
              searchBox.style.marginLeft = '5px';
            }

            // Clear the search input value
            const searchInput = document.getElementById(
              'searchInput'
            ) as HTMLInputElement;
            if (searchInput) {
              searchInput.value = '';
            }
          });
        });

        tagWrapper.appendChild(tagButton);
      });

      parentDiv.appendChild(tagWrapper);

      // Step 5: Create left arrow
      const leftArrow = document.createElement('button');
      leftArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m14.8 16.382-4.205-4.205a.25.25 0 0 1 0-.354L14.8 7.618a.75.75 0 0 0-1.06-1.06l-4.206 4.204a1.75 1.75 0 0 0 0 2.475l4.206 4.205a.75.75 0 0 0 1.06-1.06"></path>
        </svg>
        `;
      leftArrow.className =
        'fixed md:left-[90px] md:top-[178px] z-[9] bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden';
      leftArrow.disabled = true; // initially disabled

      // Step 6: Create right arrow
      const rightArrow = document.createElement('button');
      rightArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"></path>
        </svg>
        `;
      rightArrow.className =
        'fixed md:left-[380px] md:top-[210px] z-[9] mt-[-20px] -translate-y-1/2 bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden';

      // Update arrow states
      function updateArrows() {
        const wrapperWidth = tagWrapperMain.offsetWidth;
        const contentWidth = tagWrapper.scrollWidth;

        // Prevent scrolling beyond bounds
        if (currentOffset > 0) currentOffset = 0;
        if (Math.abs(currentOffset) >= contentWidth - wrapperWidth) {
          currentOffset = -1 * (contentWidth - wrapperWidth);
        }

        // Apply transform
        tagWrapper.style.transform = `translateX(${currentOffset}px)`;

        // Enable or disable arrows
        leftArrow.disabled = currentOffset === 0;
        rightArrow.disabled =
          Math.abs(currentOffset) >= contentWidth - wrapperWidth - 1; // Allow 1px tolerance
      }

      // Scroll left
      leftArrow.onclick = () => {
        const tag = tagWrapper.querySelector('div');
        if (tag) {
          const scrollAmount = tag.offsetWidth * 2 + 16;
          currentOffset += scrollAmount;
          updateArrows();
        }
      };

      // Scroll right
      rightArrow.onclick = () => {
        const tag = tagWrapper.querySelector('div');
        if (tag) {
          const scrollAmount = tag.offsetWidth * 2 + 16;
          currentOffset -= scrollAmount;
          updateArrows();
        }
      };

      tagWrapperMain.appendChild(leftArrow);
      tagWrapperMain.appendChild(rightArrow);

      parentDiv.appendChild(tagWrapperMain);
    } else {
      console.warn('Div with data-title="Productsnew" not found.');
    }
  }

  groupSelectedObjects() {
    const canvas = this.designer?.currentViewInstance?.fabricCanvas;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    console.log(activeObject._objects.length, 'activeObject', activeObject);
    if (activeObject._objects.length > 1 && activeObject.type === 'activeSelection') {
      // Group the selected objects
      activeObject.toGroup();
      canvas.requestRenderAll();
    }
    else{
      alert('Please select at least 2 objects to group.');
    }
  }

  showBox(): void {
    this.isBoxVisible = true;
  }

  closeBox(): void {
    this.isBoxVisible = false;
  }
  downloadDesign(): void {
    if ((window as any).fpdInstance?.doAction) {
      (window as any).fpdInstance.doAction('download');
    } else {
      console.error('doAction function is not available on fpdInstance');
    }
  }

  onItemClick(item: string): void {
    console.log('Clicked:', item);
    this.closeBox(); // hide after any item is clicked
  }

  dowloadButton() {
    console.log('Download button clicked', this.designer.actionsBar);
    this.designer.actionsBar.doAction('download');
  }
  printDesign() {
    console.log('Print Design button clicked', this.designer.actionsBar);
    if (
      this.designer &&
      this.designer.currentViewInstance &&
      this.designer.currentViewInstance.fabricCanvas
    ) {
      const canvas = this.designer.currentViewInstance.fabricCanvas;
      const dataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: 1,
        enableRetinaScaling: true,
      });

      // Open a new window and print the image
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        // Create the document structure
        const doc = printWindow.document;
        doc.title = 'Print Design';

        // Add styles
        const style = doc.createElement('style');
        style.textContent = `
          body { margin: 0; text-align: center; background: #fff; }
          img { max-width: 100vw; max-height: 100vh; }
        `;
        doc.head.appendChild(style);

        // Add image
        const img = doc.createElement('img');
        img.src = dataUrl;
        img.onload = () => {
          printWindow.print();
          // printWindow.close();
        };
        doc.body.appendChild(img);
      }
    } else {
      console.error('Designer or current canvas is not ready.');
    }
  }
  saveDesign() {
    console.log('llllllllllllllllllllllllllll');
    if (
      this.designer &&
      this.designer.currentViewInstance &&
      this.designer.currentViewInstance.fabricCanvas
    ) {
      // Calculate multiplier for thumbnail (example: 300x300)
      const stageWidth =
       1800;
      const stageHeight =
        this.designer.currentViewInstance.options.stageHeight || 1000;
      const targetWidth = 300;
      const targetHeight = 300;
      // 'cover' logic: scale to cover the target area
      const scale = Math.max(
        targetWidth / stageWidth,
        targetHeight / stageHeight
      );

      this.designer.currentViewInstance.toDataURL(
        (thumbnail: string) => {
          const product = this.designer.getProduct
            ? this.designer.getProduct()
            : {};
          const title = (
            this.previewButton?.nativeElement.value || ''
          ).toString();

          const savedItem = {
            thumbnail,
            product,
            title,
          };

          // Save to localStorage if enabled
          if (product && this.designer.mainOptions?.saveActionBrowserStorage) {
            const storageKey =
              this.designer.container?.id || 'fpd-saved-designs';
            let savedList: any[] = [];
            try {
              savedList = JSON.parse(
                window.localStorage.getItem(storageKey) || '[]'
              );
            } catch {
              savedList = [];
            }
            savedList.push(savedItem);
            window.localStorage.setItem(storageKey, JSON.stringify(savedList));
          }

          // Dispatch custom event if needed
          if (product) {
            this.designer.dispatchEvent?.(
              new CustomEvent('actionSave', { detail: savedItem })
            );
            this.designer.doUnsavedAlert = false;
          }

          // Show success message
          this.showSuccessMessage('Design saved successfully!');
          this.loadSavedProducts(); // <-- Add this line
        },
        { multiplier: scale, format: 'png', backgroundColor: 'transparent' }
      );
    } else {
      console.error('Designer or current canvas is not ready.');
    }
  }

  addSavedProduct(item: { thumbnail: string; product: any; title: string }) {
    // Create a wrapper div for the saved product
    const wrapper = document.createElement('div');
    wrapper.className = 'fpd-item saved-design';
    wrapper.style.position = 'relative';

    // Thumbnail image
    const img = document.createElement('img');
    img.src = item.thumbnail;
    img.alt = item.title || 'Saved Design';
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    wrapper.appendChild(img);

    // Title
    const titleDiv = document.createElement('div');
    titleDiv.innerText = item.title || '';
    titleDiv.style.fontSize = '12px';
    titleDiv.style.marginTop = '4px';
    wrapper.appendChild(titleDiv);

    // Remove (trash) button
    const trashBtn = document.createElement('button');
    trashBtn.innerHTML = '🗑️';
    trashBtn.style.position = 'absolute';
    trashBtn.style.top = '2px';
    trashBtn.style.right = '2px';
    trashBtn.style.background = 'transparent';
    trashBtn.style.border = 'none';
    trashBtn.style.cursor = 'pointer';
    wrapper.appendChild(trashBtn);

    // Click to load product
    wrapper.addEventListener('click', () => {
      if (this.designer?.loadProduct) {
        this.designer.loadProduct(item.product);
        this.designer.currentProductIndex = -1;
      }
    });

    // Remove from localStorage and UI
    trashBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      const storageKey = this.designer?.container?.id || 'fpd-saved-designs';
      let savedList: any[] = [];
      try {
        savedList = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      } catch {
        savedList = [];
      }
      const index = Array.from(this.savedGrid.nativeElement.children).indexOf(
        wrapper
      );
      if (index > -1) {
        savedList.splice(index, 1);
        window.localStorage.setItem(storageKey, JSON.stringify(savedList));
      }
      wrapper.remove();
      // Optionally dispatch event
      this.designer?.dispatchEvent?.(
        new CustomEvent('actionLoad:Remove', {
          detail: { index, item: wrapper },
        })
      );
    });

    // Append to grid
    this.savedGrid.nativeElement.appendChild(wrapper);
  }

  loadSavedProducts() {
    // Clear current grid
    if (this.savedGrid?.nativeElement) {
      this.savedGrid.nativeElement.innerHTML = '';
    }
    const storageKey = this.designer?.container?.id || 'fpd-saved-designs';
    let savedList: any[] = [];
    try {
      savedList = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      console.log('Saved List:', savedList);
    } catch {
      savedList = [];
    }
    savedList.forEach((item) => this.addSavedProduct(item));
  }

  showSuccessMessage(message: string) {
    // Simple toast message, can be replaced with Angular Material Snackbar or similar
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#4caf50';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '6px';
    toast.style.fontSize = '16px';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  
  loadDesigns() {
    const apiUrl = 'https://styleflip-backend-jdm5.ithemes.xyz/api/text/getAllData'; // Replace with your real API

    this.http.get<Category[]>(apiUrl).subscribe({
      next: (data) => {
        console.log('Design data fetched:', data);
        const html = this.generateHTML(data);
        const container = document.getElementById('content-text');
        if (container) {
          container.innerHTML = html;
          // console.log('Design data loaded successfully:', html);
          this.bottomMenu();
        }
      },
      error: (err) => {
        console.error('Failed to fetch design data:', err);
      }
    });
  }

  generateHTML(data: Category[]): string {
    let html = '';

    for (const cat of data) {
      html += `<div class="fpd-category" data-category="${this.escapeHtml(cat.category)}">`;

      for (const product of cat.products) {
        const tags = product.tags.join(', ');
        
        const rawThumbnail = product.thumbnail?.trim();
        const safeThumbnail = rawThumbnail && rawThumbnail !== ''
          ? this.escapeHtml(rawThumbnail)
          : 'assets/images/designs/styleflip-logo.jpg';

        html += `<div class="fpd-product fpd-producttext" 
                    title="${this.escapeHtml(product.title)}"
                    data-thumbnail="${safeThumbnail}" 
                    data-tags="${this.escapeHtml(tags)}">`;

        for (const span of product.texts) {
          // console.log('Span Data:', span);
          const paramStr = JSON.stringify(span.parameters).replace(/"/g, '&quot;');
          html += `<span data-parameters='${paramStr}'>${this.escapeHtml(span.text)}</span>`;
        }

        html += `</div>`;
      }


      html += `</div>`;
    }

    return html;
    
  }

  escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }


  showFPDLoading(show: boolean) {
    const loader = document.getElementById('fpd-loader');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }
}
