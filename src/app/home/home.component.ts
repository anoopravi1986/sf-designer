import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewChild, HostListener, ElementRef } from '@angular/core';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';

declare var FancyProductDesigner: any;
import $ from 'jquery';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  private savedContent: string = '';
  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: Document) {}
  @ViewChild('previewButton') previewButton!: ElementRef;

  designer: any;
  appOptions: any;
  activeImageTitle: string = '';


  ngAfterViewInit() {

    
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {

        const fpdTarget = document.getElementById('fpd-target');
        if (!fpdTarget) return;

        this.appOptions = {
          productsJSON: 'assets/data/products/product-categories.json',
          productsJSON1: 'assets/data/products/product-categories-new.json',
          designsJSON: 'assets/data/designs/design-categories.json',
          langJSON: 'assets/data/langs/default.json',
          // layout: 'topbar',
          stageWidth: 1200,
          stageHeight: 600,
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
        
           // Inside ngAfterViewInit or wherever you initialize FPD
           const firstItem = $('.fpd-module-products .fpd-item').first();
           const title = firstItem.data('title');
           this.activeImageTitle = 'Apple Macbook Pro 16 2019 512GB SSD Storage';
         
           $(document).on('click', 'fpd-module-products .fpd-item', (event) => {
             const clickedTitle = $(event.currentTarget).data('title');
             this.activeImageTitle = clickedTitle;
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
                  hideIcon.style.display = 'inline-block'; // 👈 show icon again
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

      const searchInput = document.querySelector<HTMLInputElement>("fpd-module-products .fpd-input-search input");
      const templateContainer = document.querySelector<HTMLElement>("#ProductModule");
        console.log("searchInput", searchInput, "templateContainer", templateContainer);
      if (!searchInput || !templateContainer) return;
    
      searchInput.addEventListener("keyup", () => {
        const keyword = searchInput.value.toLowerCase();
    
        const items = templateContainer.querySelectorAll<HTMLElement>(".fpd-item");
        items.forEach((item) => {
          const title = item.dataset['title']?.toLowerCase() || "";
          item.style.display = title.includes(keyword) ? "block" : "none";
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

  

 


}
