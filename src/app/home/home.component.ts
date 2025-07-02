import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewChild, HostListener, ElementRef } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

declare var FancyProductDesigner: any;
import $ from 'jquery';
import { filter } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  private savedContent: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: Document, private router: Router, private route:ActivatedRoute,
private http:HttpClient) {}
  @ViewChild('previewButton') previewButton!: ElementRef;

  designer: any;
  appOptions: any;
  activeImageTitle: string = '';
  groupedProducts:any;
  
reversedManufacturerSlugMap :any= {
  "apple": "Apple",
  "sony": "Sony",
  "beats-by-dr-dre": "Beats By Dr. Dre",
  "pioneer": "Pioneer"
};


getCategoryAndProductIndex(
  manufacturer: string,
  productTitle: string
): Promise<{ categoryIndex: number; productIndex: number; childIndex: number }> {
  console.log("🔍 Searching for:", manufacturer, productTitle);

  return new Promise((resolve, reject) => {
    this.http.get<any[]>('/assets/data/products/product-categories.json').subscribe({
      next: data => {
        for (let categoryIndex = 0; categoryIndex < data.length; categoryIndex++) {
          const categoryObj = data[categoryIndex];
          const productGroups = categoryObj.products;
          let flatProductIndex = 0;

          for (const group of productGroups) {
            for (let i = 0; i < group.length; i++) {
              const product = group[i];
console.log("compare" ,product.manufacturer ,manufacturer,this.slugify(product.title),productTitle)
              const isMatch =
                product.manufacturer === manufacturer &&
                this.slugify(product.title) === productTitle;

              if (isMatch) {
                console.log('✅ Found:', {
                  categoryIndex,
                  productIndex: flatProductIndex,
                  productId: product.product_id,
                  childIndex: i
                });

                return resolve({
                  categoryIndex,
                  productIndex: flatProductIndex,
                  childIndex: i
                });
              }

            }
            flatProductIndex++;
          }
        }

        // Not found
        resolve({ categoryIndex: -1, productIndex: -1, childIndex: -1 });
      },
      error: err => reject(err)
    });
  });
}



  ngAfterViewInit() {

    
    if (isPlatformBrowser(this.platformId)) {
      console.log("reset done")
                  localStorage.setItem("productLoader","done")

      setTimeout(async() => {

          const manufacturerSlug = this.route.snapshot.paramMap.get('manufacturer') || '';
  const titleSlug = this.route.snapshot.paramMap.get('slug') || '';
// const manufacturerSlug = params['manufacturer'];
//       const titleSlug = params['slug'];
      console.log("productIndex,categoryIndex,",this.reversedManufacturerSlugMap[manufacturerSlug], titleSlug)

      let {categoryIndex, productIndex , childIndex} :any=  await this.getCategoryAndProductIndex(this.reversedManufacturerSlugMap[manufacturerSlug], titleSlug);
      localStorage.setItem("productIndex",productIndex)
      localStorage.setItem("categoryIndex",categoryIndex)
      localStorage.setItem("childIndex",childIndex)


      console.log(productIndex,categoryIndex,childIndex,"productIndex,categoryIndex,",titleSlug,manufacturerSlug)

  

        const fpdTarget = document.getElementById('fpd-target');
        if (!fpdTarget) return;

        this.appOptions = {
          productsJSON: 'assets/data/products/product-categories.json',
          productsJSON1: 'assets/data/products/product-categories-new.json',
          // designsJSON: 'assets/data/designs/design-categories.json',
          designsJSON: 'https://styleflip-backend-jdm5.onrender.com/api/element/getAllElements',
          langJSON: 'assets/data/langs/default.json',
          // layout: 'topbar',
          stageWidth: 2000,
          stageHeight: 1000,
          initialActiveModule: "products",
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
              boundingBox: "Base"
          },
          customImageParameters: {
              draggable: true,
              removable: true,
              resizable: true,
              rotatable: true,
              colors: '#000',
              autoCenter: true,
              boundingBox: "Base",
              patterns: true,
              filters: true
          },
          actions: {
              // 'top': ['download', 'share', 'print', 'save', 'preview-lightbox', 'paste'],
              'top': [],
              // 'right': ['manage-layers', 'magnify-glass', 'zoom', 'reset-product', 'qr-code', 'ruler'],
              'right': [],
              // 'bottom': ['zoom'],
              'left': ['undo', 'redo', 'download','zoom', 'reset-product'],
              'center': []
              // 'center': ['download','preview-lightbox','paste','zoom','reset-product','qr-code','ruler']
          },
          selectedColor: "#f5f5f5",
          boundingBoxColor: "#005ede",
          outOfBoundaryColor: "#990000",
          cornerIconColor: "#000000",
          mainBarModules: [
            'products',
            'productsnew',
            'designs',
            'text',
            'images',
            'manage-layers',
            'text-layers',
            'save-load'
          ],
          patterns: [
            {
              title: 'Polka Dots',
              url: 'https://www.toptal.com/designers/subtlepatterns/patterns/polka-dots.png'
            },
            {
              title: 'Stripes',
              url: 'https://www.toptal.com/designers/subtlepatterns/patterns/diagonal-stripes.png'
            },
            {
              title: 'Wood Grain',
              url: 'https://www.toptal.com/designers/subtlepatterns/patterns/wood-pattern.png'
            }
          ],
          fonts: [
            { name: 'Roboto', url: 'google', variants: ['regular', 'italic', '700', '700italic'] },
            { name: 'Open Sans', url: 'google', variants: ['regular', 'italic', '700', '700italic'] },
            { name: 'Poppins', url: 'google', variants: ['regular', 'italic', '700', '700italic','bold', 'extrabold'] },
            { name: 'Lato', url: 'google', variants: ['regular', 'italic', '700', '700italic'] },
            { name: 'Oswald', url: 'google', variants: ['regular', '700'] }, // no italic available
            { name: 'Raleway', url: 'google', variants: ['regular', 'italic', '700', '700italic'] },
            { name: 'Montserrat', url: 'google', variants: ['regular', 'italic', '700', '700italic'] },
            { name: 'Playfair Display', url: 'google', variants: ['regular', 'italic', '700', '700italic'] },
            { name: 'Pacifico', url: 'google', variants: ['regular'] }, // only one style
            { name: 'Lobster', url: 'google', variants: ['regular'] }, // only one style
            { name: 'Bebas Neue', url: 'google', variants: ['regular'] }, // only one style
            { name: 'Dancing Script', url: 'google', variants: ['regular', '700'] }, // no italic
            { name: 'Courier Prime', url: 'google', variants: ['regular', 'italic', '700', '700italic'] },
            { name: 'Caveat', url: 'google', variants: ['regular', '700'] }, // no italic
            { name: 'Abril Fatface', url: 'google', variants: ['regular'] }
            // {
            //   name: 'Aller',
            //   url: 'assets/fpd/fonts/Aller.ttf',
            //   variants: {
            //     'n7': 'assets/fpd/fonts/Aller__bold.ttf',
            //     'i4': 'assets/fpd/fonts/Aller__italic.ttf',
            //     'i7': 'assets/fpd/fonts/Aller__bolditalic.ttf'
            //   }
            // },
            // { name: 'Pacifico', url: 'assets/fpd/fonts/Pacifico.ttf' }
          ],
          textTemplates: [
            {
              text: "I love Styleflip",
              properties: {
                fontSize: 50,
                fontFamily: "Bangers",
                fill: "#ff5722",              // Vibrant orange
                stroke: "#000000",            // Black outline
                strokeWidth: 2,
                shadow: "rgba(0,0,0,0.3) 2px 2px 3px",
                curved: true,                 // Enable curved text
                curveSpacing: 5,              // Space between letters
                curveRadius: 180,             // Adjust radius of the curve
                curveReverse: false,
                curvable: 1 ,
                patterns: true
              }
            },
            {
              text: "Fun Times",
              properties: {
                fontSize: 80,
                fontFamily: "Fredoka One",
                fill: "#3f51b5",              // Blue
                stroke: "#010101",
                curvable: 1,            // White outline
                strokeWidth: 3,
                shadow: "rgba(255,255,255,0.5) 0px 0px 6px"
              }
            },
            {
              text: "Creative Soul",
              properties: {
                fontSize: 70,
                fontFamily: "Pacifico",
                fill: "#e91e63",              // Pink
                stroke: "#ffc107",            // Yellow outline
                curvable: 1, 
                strokeWidth: 2,
                shadow: "rgba(0,0,0,0.2) 1px 1px 4px"
              }
            },
            {
              text: "Dream Big",
              properties: {
                fontSize: 98,
                fontFamily: "Lobster",
                fill: "#4caf50",              // Green
                stroke: "#ffffff",            // White outline
                strokeWidth: 2,
                curvable: 1, 
                shadow: "rgba(0,0,0,0.4) 3px 3px 5px"
              }
            }
          ],
          fileServerURL: 'https://file.handler.php.stageprojects.xyz/',
          // fileServerURL: 'http://localhost/fpd/file-handler.php',
          uploadZone: {
            useDataURL: true  // ✅ allows upload directly in browser
          },
          facebookAppId: '325741021422456',
          instagramClientId: 'bbe4d544897b4fb0b1bae5a6b44a310b',
          instagramRedirectUri: 'assets/html/instagram_auth.html',
          instagramTokenUri: '',
          colorPickerPalette: [
            "#000", "#f4cccc", "#fce5cd", "#fff2cc",
            "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9",
            "#ead1dc", '#5f27cd', '#222f3e', '#10ac84'
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





        
          
          // ✅ Hook up buttons AFTER FPD is ready
          // $('#print-button').click(() => designer.print());
          // $('#download-button').click(() => designer.download('png'));
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
                  localStorage.setItem("productIndex","")
      localStorage.setItem("categoryIndex","")
            console.log(event.currentTarget, "click happen", event);
            const clickedTitle = $(event.currentTarget).data('title');
            console.log(clickedTitle,'cllllllll', $(event.currentTarget))
            const manufacturer = $(event.currentTarget).data('manufacturer');
            // let updatedTarget = JSON.parse(JSON.stringify(event.target));
                        console.log(event,);
                  let ob: any;

                  try {
                    ob = (Object.entries(event.target)[1][1] as any)['manufacturer'];
                  } catch (error) {
                    ob = 'apple'; // fallback
                  }            
                  // console.log(event, Object.entries(event.target), 'Clicked:', ob, clickedTitle, 'Manufacturer:', manufacturer);

            const slug = this.slugify(clickedTitle);
            const manufacturerSlug = this.slugify(ob);
            console.log(manufacturer,'mamamam',localStorage.getItem("productLoader"))
            let productLoadervaalue = localStorage.getItem("productLoader")
            if((!productLoadervaalue || productLoadervaalue!="")){

            this.router.navigate([manufacturerSlug ||'apple', slug]);
           }
          });


           
      }, 300);

      setTimeout(() => {

        this.bottomMenu();
      }, 10);
    }



    if (isPlatformBrowser(this.platformId)) {
      const waitForElements = () => {
        const hideIcon = this.document.querySelector('.hide-icon') as HTMLElement;
        const mainBar = this.document.querySelector('fpd-main-bar') as HTMLElement;
    
        if (hideIcon && mainBar) {
          console.log("Element found:", hideIcon, mainBar);
    
          // Click event — collapse
          hideIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event bubbling
            console.log("click happen");
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
              if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target as HTMLElement;
                if (target.classList.contains('fpd-active')) {
                  console.log("fpd-active class detected on:", target);
                  var activeclick = localStorage.getItem('fpdMenuClicked')
                  console.log("activeclick", activeclick);
                  if (activeclick != 'true') {
                    
                    document.querySelectorAll('.fpd-popup.visible').forEach((el) => {
                      el.classList.remove('visible');
                    });

                    // Remove "backdrop-test" from elements that have it
                    document.querySelectorAll('.backdrop-test').forEach((el) => {
                      el.classList.remove('backdrop-test');
                      // localStorage.getItem('fpdMenuClicked')
                    });
                  }
                  if(target.getAttribute('data-module') === 'designs'){
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
          mainBar.querySelectorAll('*').forEach(child => {
            activeObserver.observe(child, { attributes: true, attributeFilter: ['class'] });
          });
    
          // Re-scan DOM every 1s for new children
          const childScanInterval = setInterval(() => {
            mainBar.querySelectorAll('*').forEach(child => {
              activeObserver.observe(child, { attributes: true, attributeFilter: ['class'] });
            });
          }, 1000);
    
        } else {
          setTimeout(waitForElements, 300); // retry until elements exist
        }
      };
    
      waitForElements();
    }
    
    setTimeout(() => {

      const searchInput = document.getElementById('searchInput') as HTMLInputElement;
      
      if (searchInput) {

        searchInput.addEventListener("keyup", () => {
          this.filterThumbnailsP(searchInput.value);
        });
      }
    


      const searchInputs = document.getElementById('searchInputs') as HTMLInputElement;
      if (searchInputs) {
        searchInputs.addEventListener('keyup', () => {
          this.filterThumbnails(searchInputs.value);
        });
      }


      
      this.updateTagsFromDesignModule();
      const dropdownItems = document.querySelectorAll('fpd-module-productsnew .fpd-dropdown-list .fpd-item');
      console.log("Dropdown Items Found:", dropdownItems);

      dropdownItems.forEach((item) => {
        item.addEventListener('click', () => {
          const tagWrappertags = document.getElementById('tag-wrapper-design-tags');
          if (tagWrappertags) {
            tagWrappertags.remove();
            console.log('Removed tag-wrapper-design-tags');
          }
          this.updateTagsFromDesignModule();
          console.log("Tags updated from Design Module");
        });
      });
      
    }, 2000);
       
    setTimeout(() => {

      const checkAndHideDuplicateFpdItems = () => {
        const containers = this.document.querySelectorAll<HTMLElement>(".ProductModuleMy");
        console.log("✅ Running deduplication check on containers:", containers);
  
        containers.forEach(container => {
          const items = container.querySelectorAll<HTMLElement>(".fpd-item");
          const seenIndexes = new Set<string>();
  
          items.forEach(item => {
            const index = item.getAttribute("data-index");
            if (!index) return;
  
            if (seenIndexes.has(index)) {
              item.style.display = "none";
            } else {
              seenIndexes.add(index);
              item.style.display = ""; // Ensure visible
            }
          });
        });
      };
  
      // Step 1: Find .ProductModuleMy and observe inner DOM changes
      const productModule = this.document.querySelector(".ProductModuleMy");
  
      if (productModule) {
        const innerHtmlObserver = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              console.log("📦 Inner HTML changed: DOM children updated");
              checkAndHideDuplicateFpdItems();
            }
          }
        });
  
        // Step 2: Observe inner HTML (child elements) of the container
        innerHtmlObserver.observe(productModule, {
          childList: true,  // Watch for direct child changes
          subtree: true     // Also look deep inside the tree
        });
  
        // Step 3: Run once initially
        checkAndHideDuplicateFpdItems();
      }
    },3000)




  
  
  }

slugify(title: string): string {
  return title?.toLowerCase()
    ?.trim()
    ?.replace(/[^\w\s-]/g, '')       // Remove special chars
    ?.replace(/\s+/g, '-')           // Replace spaces with -
    ?.replace(/--+/g, '-');          // Collapse hyphens
}


ngOnInit() {
  const slug = this.route.snapshot.paramMap.get('slug');
  console.log("Selected slug:", slug);
  
}

  bottomMenu(){
    const sourceElement = document.getElementById('content-text');
    console.log("sourceElement", sourceElement);
    if (sourceElement) {
      const htmlContent = sourceElement.innerHTML;
      localStorage.setItem('savedContentText', htmlContent);
      localStorage.setItem('parentDivId', 'ProductModule');
      console.log('Content saved to localStorage');
      localStorage.setItem("valueofTitle", '');
    }
  }
  previewImage: string = '';
showPreviewModal: boolean = false;
  preview(){
    if (this.designer && this.designer.getProductDataURL) {
      console.log("000", this.designer , "111", this.designer.getProductDataURL)
      this.designer.currentViewInstance.fabricCanvas.enableRuler = false;

      this.designer.getProductDataURL((dataUrl: string) => {
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
  
        // Restore the ruler setting
        this.designer.currentViewInstance.fabricCanvas.enableRuler = this.designer.mainOptions.rulerFixed;
        this.designer.currentViewInstance.fabricCanvas.renderAll();
      });
    } else {
      console.error('Designer is not ready or getProductDataURL is not available.');
    }
  }
  showDropdown = false;

  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.dropdownWrapper && !this.dropdownWrapper.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  
  filterThumbnails(searchTerm: string) {
    console.log("searchTerm", searchTerm);
    const parentDiv = document.querySelector('div[data-moduleicon="layout-panel-left"]');
    console.log("parentDiv", parentDiv);
    if (!parentDiv) return;

    const thumbnails = parentDiv.querySelectorAll(
      '.fpd-grid .fpd-item.fpd-hover-thumbnail'
    );
    console.log("parentDivdata", thumbnails);

    thumbnails.forEach((thumb: Element) => {
      const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
      console.log("title", title, "searchTerm", searchTerm);
      const search = searchTerm.toLowerCase();

      (thumb as HTMLElement).style.display = title.includes(search) ? 'flex' : 'none';
    });
    
  }

  filterThumbnailsP(searchTerm: string) {
    console.log("searchTerm", searchTerm);
    const parentDiv = document.querySelector('div[data-moduleicon="book-copy"]');
    console.log("parentDiv", parentDiv);
    if (!parentDiv) return;

    const dataTitle = parentDiv.getAttribute('data-title');
    console.log("dataTitle", dataTitle);
      const thumbnails = parentDiv.querySelectorAll(
        '.fpd-grid.skins-data .fpd-item.fpd-hover-thumbnail'
      );
      console.log("parentDivdataif", thumbnails.length);
      if (!thumbnails || thumbnails.length === 0) {
        console.log("No thumbnails found in the parent div.");
        const thumbnails = parentDiv.querySelectorAll(
        '.fpd-grid.ProductModule .fpd-item.fpd-hover-thumbnail'
        );
        thumbnails.forEach((thumb: Element) => {
          const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
          console.log("title", title, "searchTerm", searchTerm);
          const search = searchTerm.toLowerCase();
  
          (thumb as HTMLElement).style.display = title.includes(search) ? 'flex' : 'none';
        });
      }
      else{

        thumbnails.forEach((thumb: Element) => {
          const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
          console.log("title", title, "searchTerm", searchTerm);
          const search = searchTerm.toLowerCase();
  
          (thumb as HTMLElement).style.display = title.includes(search) ? 'flex' : 'none';
        });
      }
    
  }
 

  updateTagsFromDesignModule() {
    const allTagsSetD = new Set();
    console.log("Anoop Data 4 allTagsSet", allTagsSetD);
    document.querySelectorAll('#DesignModule .fpd-item').forEach(product => {
          console.log("products-------929290000", product)
          const tags = product.getAttribute('data-tags')?.split(',').map(tag => tag.trim());
          if (tags) tags.forEach(tag => allTagsSetD.add(tag));


          
      });
      console.log("Anoop Data 4 allTagsSet---", allTagsSetD);
      const parentDiv = document.querySelector('div[data-title="Productsnew"]');
      console.log("Anoop Data 4 parentDiv", parentDiv);
      if (parentDiv) {
        let currentOffset = 0;

        // Create outer wrapper (position relative for arrow buttons)
        const tagWrapperMain = document.createElement("div");
        tagWrapperMain.className = "relative w-full fpd-designs-tags mt-2";

        const tagWrapper = document.createElement('div');
        tagWrapper.className = 'flex gap-2 mt-2 ml-[5px] fixed md:top-[164px]';
        tagWrapper.id = 'tag-wrapper-design-tags';

        Array.from(allTagsSetD).forEach(tag => {
          const tagButton = document.createElement('div');
          tagButton.className = 'fpd-tag-btn capitalize border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none whitespace-nowrap';
          tagButton.innerText = tag as string;

          tagButton.addEventListener('click', () => {
            // Step 1: Highlight clicked tag and unhighlight others
            document.querySelectorAll('.fpd-tag-btn').forEach(btn => btn.classList.remove('!bg-[#40576d12]'));
            tagButton.classList.add('!bg-[#40576d12]');

            // Step 2: Filter visible .fpd-item based on tag
            const selectedTag = (tag as string).toLowerCase();
            const items = document.querySelectorAll('#DesignModule .fpd-item');

            items.forEach(item => {
              const tagsAttr = item.getAttribute('data-tags') || '';
              const tagList = tagsAttr.split(',').map(t => t.trim().toLowerCase());
              (item as HTMLElement).style.display = tagList.includes(selectedTag) ? 'flex' : 'none';
            });

            // Step 3: Hide parent .box-contain-text if all children are hidden
            document.querySelectorAll('.box-contain-text').forEach(container => {
              const children = container.querySelectorAll('.fpd-item');
              const anyVisible = Array.from(children).some(child => (child as HTMLElement).style.display !== 'none');
              (container as HTMLElement).style.display = anyVisible ? 'block' : 'none';
            });

            // Step 4: Show Reset Button and shrink search box
            const resetBtn = document.getElementById('fpd-reset-button');
            resetBtn?.classList.remove('hidden');

            const searchBox = document.querySelector('#searchbox-design') as HTMLElement;
            if (searchBox) {
              searchBox.style.maxWidth = 'calc(100% - 44px)';
              searchBox.style.marginLeft = '0px';
            }
            const inputboxdiv = document.querySelector('#fpd-reset-button') as HTMLElement;
            if (inputboxdiv) {
              inputboxdiv.style.display = 'block';
            }


            resetBtn?.addEventListener('click', () => {
              if (inputboxdiv) {
                inputboxdiv.style.display = 'none';
              }
              // Show all fpd-item elements
              document.querySelectorAll('.fpd-item.fpd-hover-thumbnail').forEach(item => {
                (item as HTMLElement).style.display = 'flex'; // or 'block' depending on your layout
              });

              // Show all parent .box-contain-text containers
              document.querySelectorAll('.box-contain-text').forEach(container => {
                (container as HTMLElement).style.display = 'block';
              });

              // Remove active class from all tag buttons
              document.querySelectorAll('.fpd-tag-btn').forEach(btn => {
                btn.classList.remove('!bg-[#40576d12]');
              });

              // Hide the reset button again
              resetBtn.classList.add('hidden');

              // Reset search box width
              const searchBox = document.querySelector('#searchbox-design') as HTMLElement;
              if (searchBox) {
                searchBox.style.maxWidth = 'calc(100% - 22px)';
                searchBox.style.marginLeft = '5px';
              }

              // Clear the search input value
              const searchInput = document.getElementById('searchInput') as HTMLInputElement;
              if (searchInput) {
                searchInput.value = '';
              }
            });
          });


          tagWrapper.appendChild(tagButton);
        });

        parentDiv.appendChild(tagWrapper);


        // Step 5: Create left arrow
        const leftArrow = document.createElement("button");
        leftArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m14.8 16.382-4.205-4.205a.25.25 0 0 1 0-.354L14.8 7.618a.75.75 0 0 0-1.06-1.06l-4.206 4.204a1.75 1.75 0 0 0 0 2.475l4.206 4.205a.75.75 0 0 0 1.06-1.06"></path>
        </svg>
        `;
        leftArrow.className = "fixed md:left-[90px] md:top-[178px] z-[9] bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden";
        leftArrow.disabled = true; // initially disabled

        // Step 6: Create right arrow
        const rightArrow = document.createElement("button");
        rightArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"></path>
        </svg>
        `;
        rightArrow.className = "fixed md:left-[380px] md:top-[210px] z-[9] mt-[-20px] -translate-y-1/2 bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden";

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
          rightArrow.disabled = Math.abs(currentOffset) >= (contentWidth - wrapperWidth - 1); // Allow 1px tolerance
        }

        // Scroll left
        leftArrow.onclick = () => {
          const tag = tagWrapper.querySelector("div");
          if (tag) {
            const scrollAmount = tag.offsetWidth * 2 + 16;
            currentOffset += scrollAmount;
            updateArrows();
          }
        };

        // Scroll right
        rightArrow.onclick = () => {
          const tag = tagWrapper.querySelector("div");
          if (tag) {
            const scrollAmount = tag.offsetWidth * 2 + 16;
            currentOffset -= scrollAmount;
            updateArrows();
          }
        };
        

        tagWrapperMain.appendChild(leftArrow);
        tagWrapperMain.appendChild(rightArrow);

        parentDiv.appendChild(tagWrapperMain)

      } else {
        console.warn('Div with data-title="Productsnew" not found.');
      }
  }


}
