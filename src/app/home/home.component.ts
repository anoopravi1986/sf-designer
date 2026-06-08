import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  ViewChild,
  HostListener,
  ElementRef,
} from '@angular/core';
import { createIcons, icons, Variable } from 'lucide';
import { isPlatformBrowser, DOCUMENT, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { Title } from '@angular/platform-browser';

declare var FancyProductDesigner: any;
declare const lucide: any;
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
  private searchTimeout: any;
  showFacebookOptions = false;
  private lastFacebookType: 'post' | 'message' = 'post';
  private currentDesignId: string | null = null;
  @ViewChild('facebookDropdown') facebookDropdownRef!: ElementRef;
  
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

            resolve({ categoryIndex: -1, productIndex: -1, childIndex: -1 });
          },
          error: (err) => reject(err),
        });
    });
  }
// Mobile share dropdown toggle ke liye
showMobileShareDropdown = false;

toggleMobileShare() {
  this.showMobileShareDropdown = !this.showMobileShareDropdown;
  console.log('Mobile share toggled:', this.showMobileShareDropdown);
}

closeMobileShare() {
  this.showMobileShareDropdown = false;
}

@HostListener('document:click', ['$event'])
onClickOutsideMobileShare(event: Event) {
  setTimeout(() => {
    if (this.showMobileShareDropdown) {
      const target = event.target as HTMLElement;
      const shareButton = document.querySelector('.share-mobile-btn');
      const shareDropdown = document.querySelector('.mobile-share-dropdown');
      
      if (shareDropdown && !shareDropdown.contains(target) && !shareButton?.contains(target)) {
        this.showMobileShareDropdown = false;
      }
    }
  }, 100);
}
goBack() {
  window.history.back(); 
}
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const fontArrayStr: any[] = [];
      console.log('reset done');
      localStorage.setItem('productLoader', 'done');

      fetch('https://styleflip-backend-jdm5.ithemes.xyz/api/font/getAllFonts')
      .then(res => res.json())
      .then(data => {
          console.log('font data is',data);
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

        const fpdTarget = document.getElementById('fpd-target');
        if (!fpdTarget) return;

        console.log("fontssssssssssss data is",fontData)

        $(document).on('click', 'fpd-module-products .fpd-item', (event) => {
          localStorage.setItem('productIndex', '');
          localStorage.setItem('categoryIndex', '');
          console.log(event.currentTarget, 'click happen', event);
          const clickedTitle = $(event.currentTarget).data('title');
          console.log(clickedTitle, 'cllllllll', $(event.currentTarget));
          
          const manufacturer = $(event.currentTarget).data('manufacturer');
          let ob: any;

          try {
            ob = (Object.entries(event.target)[1][1] as any)['manufacturer'];
          } catch (error) {
            ob = 'apple';
          }

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

        $(document).on('click', '.item-data-click', (event) => {
          event.stopPropagation();
          const clickedDiv = event.currentTarget;
          const uploadParent = clickedDiv.closest('[data-context="upload"]');
          console.log('You clicked:', clickedDiv);
          console.log("djjd",this.designer.currentViewInstance);
          const clothingDesignerElem = document.querySelector('#clothing-designer');
          if (!clothingDesignerElem) {
            console.error('Element #clothing-designer not found.');
            return;
          }
          const fpdvalue = (clothingDesignerElem as any).instance;
          const viewvalue = clickedDiv.getAttribute("data-source");
          const viewtitle = clickedDiv.getAttribute("data-title");
          console.log("viewvalue",viewvalue, viewtitle)
          const parameter = {removable: true,positioned: true, autoSelect: true,uniScalingUnlockable: true};
          
          if(uploadParent.classList.contains('fpd-active')){

            fpdvalue.addCanvasDesign(
              viewvalue,
              viewtitle,
              parameter
            )
          }
        });

        $(document).on('click', '.item-data-click .fpd-three-dot-menu', (event) => {
            event.stopPropagation();
        });
        
        $(document).on('click', '.item-data-click .delete-button', (event) => {
            event.stopPropagation();
        })
       
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

          hideIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('click happen');
            this.savedContent = mainBar.innerHTML;
            mainBar.style.maxWidth = '80px';
            mainBar.style.backgroundColor = '#f0f1f5';
            mainBar.classList.toggle('box-white-inactive');
            hideIcon.style.display = 'none';
          });

          const contentObserver = new MutationObserver(() => {
            if (mainBar.innerHTML !== this.savedContent) {
              mainBar.style.maxWidth = '';
              mainBar.style.backgroundColor = '#fff';
              mainBar.classList.remove('box-white-inactive');
              hideIcon.style.display = 'flex';
            }
          });

          contentObserver.observe(mainBar, {
            childList: true,
            subtree: true,
            characterData: true,
          });

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

                    document
                      .querySelectorAll('.backdrop-test')
                      .forEach((el) => {
                        el.classList.remove('backdrop-test');
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
                  hideIcon.style.display = 'flex';
                }
              }
            }
          });

          mainBar.querySelectorAll('*').forEach((child) => {
            activeObserver.observe(child, {
              attributes: true,
              attributeFilter: ['class'],
            });
          });

          const childScanInterval = setInterval(() => {
            mainBar.querySelectorAll('*').forEach((child) => {
              activeObserver.observe(child, {
                attributes: true,
                attributeFilter: ['class'],
              });
            });
          }, 1000);
        } else {
          setTimeout(waitForElements, 300);
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
          clearTimeout(this.searchTimeout);
          this.searchTimeout = setTimeout(() => {
            this.filterThumbnailsP(searchInput.value);
          }, 300);
        });
      }

      const searchInputs = document.getElementById(
        'searchInputs'
      ) as HTMLInputElement;
      if (searchInputs) {
        searchInputs.addEventListener('keyup', () => {
          clearTimeout(this.searchTimeout);
          this.searchTimeout = setTimeout(() => {
            this.filterThumbnails(searchInputs.value);
          }, 300);
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
              item.style.display = '';
            }
          });
        });
      };

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

        innerHtmlObserver.observe(productModule, {
          childList: true,
          subtree: true,
        });

        checkAndHideDuplicateFpdItems();
      }

      this.moveBoldToPrimaryTools()
    }, 3000);
    createIcons({ icons });

    setTimeout(() => {

      const btnOpacity = document.getElementById('fpd-opacity-btn');
      const targetSection = document.querySelector('fpd-element-toolbar .fpd-sub-panel') as HTMLElement;
      const panel = document.getElementById('fpd-opacity-panel');
      const sliderOpacity = document.getElementById('fpd-opacity-range') as HTMLInputElement;
      console.log('Opacity elements:', { btnOpacity, panel, sliderOpacity });
      if (!btnOpacity || !panel || !sliderOpacity) return;
      

      btnOpacity.addEventListener('click', () => {
        if (targetSection) {
            const activeElem = targetSection.querySelector('.fpd-active');
            
            if (activeElem) {
                activeElem.classList.remove('fpd-active');
            }
        }
        console.log('Opacity button clicked, toggling panel. Current display:', panel.style.display);
        panel.style.display =
          panel.style.display === 'block' ? 'none' : 'block';
          if (panel.style.display === 'block') {
              btnOpacity.classList.add('fpd-active');
          } else {
              btnOpacity.classList.remove('fpd-active');
          }
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const obj = canvas.getActiveObject();
  
        if (obj) {
          sliderOpacity.value = obj.opacity ?? 1;
          var percent = (parseFloat(sliderOpacity.value) / parseFloat(sliderOpacity.max)) * 100;
          sliderOpacity.style.setProperty('--progress', percent + '%');
        }
      });
      function updateSliderProgress() {
        const percent = (parseFloat(sliderOpacity.value) / parseFloat(sliderOpacity.max)) * 100;
        sliderOpacity.style.setProperty('--progress', percent + '%');
      }
      sliderOpacity.addEventListener('input', () => {
        updateSliderProgress();
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const obj = canvas.getActiveObject();
        if (!obj) return;
  
        obj.set('opacity', parseFloat(sliderOpacity.value));
  
        canvas.requestRenderAll();
  
        canvas.fire('object:modified', { target: obj });
  
      });

      document.addEventListener('click', (e: any) => {
        if (
          !panel.contains(e.target) &&
          !btnOpacity.contains(e.target)
        ) {
          panel.style.display = 'none';
          btnOpacity.classList.remove('fpd-active');
        }
      });
    }, 5000);
  }
async deleteUploadedImage(designId: string, closeBtn?: HTMLElement, modalDiv?: HTMLElement): Promise<boolean> {
  // Show loading state on close button
  if (closeBtn) {
    const button = closeBtn as HTMLButtonElement;
    const originalText = button.innerHTML;
    button.innerHTML = `
      <div style="display:inline-block;width:16px;height:16px;border:2px solid white;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;"></div>
      Deleting...
    `;
    button.style.opacity = '0.7';
    button.style.cursor = 'not-allowed';
    button.disabled = true;
    
    try {
      const response = await fetch(`https://styleflip-backend-jdm5.ithemes.xyz/api/upload/design/${designId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Image deleted from server successfully');
        this.showToast('Design deleted from server');
        
        // Restore button briefly before closing
        button.innerHTML = '✓ Deleted!';
        setTimeout(() => {
          if (modalDiv) modalDiv.remove();
        }, 500);
        
        return true;
      } else {
        console.error('Failed to delete image:', result.error);
        button.innerHTML = originalText;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
        button.disabled = false;
        this.showToast('Failed to delete: ' + result.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      button.innerHTML = originalText;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
      button.disabled = false;
      this.showToast('Error deleting design');
      return false;
    }
  } else {
    // Original behavior without button UI update
    try {
      const response = await fetch(`https://styleflip-backend-jdm5.ithemes.xyz/api/upload/design/${designId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Image deleted from server successfully');
        this.showToast('Design deleted from server');
        return true;
      } else {
        console.error('Failed to delete image:', result.error);
        return false;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
}
  // ==================== SHARING FUNCTIONALITY ====================

  // Share to Facebook - Opens popup immediately with loading state
 async shareToFacebook(type: 'post' | 'message') {
  this.lastFacebookType = type;
  this.closeFacebookOptions();
  
  this.showFacebookShareModalWithLoading(type);
  
  try {
    const imageBlob = await this.getCurrentDesignBlob();
    const designTitle = this.activeImageTitle || `Design_${Date.now()}`;
    
    const formData = new FormData();
    formData.append('image', imageBlob, 'design.png');
    formData.append('title', designTitle);
    
    const API_URL = 'https://styleflip-backend-jdm5.ithemes.xyz/api/upload/upload';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // Store the design_id for deletion
      this.currentDesignId = result.design_id;
      
      const imageUrl = result.imageUrl;
      const shareText = `${imageUrl}`;
      
      this.updateFacebookModalWithData(shareText, imageUrl, type);
      
      const storageKey = this.designer.container?.id || 'fpd-saved-designs';
      let savedList: any[] = [];
      try {
        savedList = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      } catch {
        savedList = [];
      }
      savedList.push({
        thumbnail: result.imageUrl,
        product: this.designer.getProduct ? this.designer.getProduct() : {},
        title: designTitle,
        imageUrl: imageUrl,
        design_id: result.design_id
      });
      window.localStorage.setItem(storageKey, JSON.stringify(savedList));
      
    } else {
      throw new Error(result.error || 'Failed to get image URL');
    }
  } catch (error) {
    console.error('Facebook share error:', error);
    this.updateFacebookModalWithError(error as Error);
  }
}

showFacebookShareModalWithLoading(type: 'post' | 'message') {
  const shareTypeText = type === 'post' ? 'Feed Post' : 'Messenger';
  
  const modalHtml = `
    <div id="facebook-share-modal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:12px;padding:24px;max-width:500px;text-align:center;">
        <h3 style="margin-bottom:16px;color:#1877F2;">Share to Facebook ${shareTypeText}</h3>
        
        <div id="facebook-loading" style="text-align:center;padding:20px;">
          <div style="display:inline-block;width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #1877F2;border-radius:50%;animation:spin 1s linear infinite;"></div>
          <p style="margin-top:10px;">Uploading your design...</p>
        </div>
        
        <div id="facebook-content" style="display:none;">
          <p style="margin-bottom:16px;">Your design has been uploaded! Share this link on Facebook:</p>
          <div style="background:#f0f0f0;padding:12px;border-radius:8px;margin-bottom:16px;word-break:break-all;" id="share-text-container"></div>
          <div style="margin-bottom:16px;">
            <img id="share-image" src="" style="max-width:100%;max-height:200px;border-radius:8px;" />
          </div>
          <button id="open-facebook-${type}" style="background:#42B72A;color:white;border:none;padding:12px 24px;border-radius:8px;margin-bottom:12px;cursor:pointer;width:100%;">Open Facebook ${shareTypeText}</button>
        </div>
        
        <button id="close-facebook-modal" style="background:#e74c3c;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;width:100%;">Close</button>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = modalHtml;
  document.body.appendChild(modalDiv);
  
  (window as any).currentFacebookModal = modalDiv;
  
  const closeBtn = modalDiv.querySelector('#close-facebook-modal') as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.onclick = async () => {
      if (this.currentDesignId) {
        const deleted = await this.deleteUploadedImage(this.currentDesignId, closeBtn, modalDiv);
        if (deleted) {
          this.currentDesignId = null;
        } else {
          closeBtn.style.opacity = '1';
          closeBtn.style.cursor = 'pointer';
          closeBtn.disabled = false;
        }
      } else {
        modalDiv.remove();
        (window as any).currentFacebookModal = null;
      }
    };
  }
}

updateFacebookModalWithData(shareText: string, imageUrl: string, type: 'post' | 'message') {
  const modalDiv = (window as any).currentFacebookModal;
  if (!modalDiv || !document.body.contains(modalDiv)) return;
  
  const loadingDiv = modalDiv.querySelector('#facebook-loading');
  const contentDiv = modalDiv.querySelector('#facebook-content');
  const shareTextContainer = modalDiv.querySelector('#share-text-container');
  const shareImage = modalDiv.querySelector('#share-image');
  
  if (loadingDiv) loadingDiv.style.display = 'none';
  if (contentDiv) contentDiv.style.display = 'block';
  if (shareTextContainer) shareTextContainer.textContent = shareText;
  if (shareImage) (shareImage as HTMLImageElement).src = imageUrl;
  
  const openBtn = modalDiv.querySelector(`#open-facebook-${type}`);
  
  if (openBtn) {
    (openBtn as HTMLElement).onclick = () => {
      if (type === 'post') {
        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}&quote=${encodeURIComponent('Check out my custom design on Styleflip!')}`;
        window.open(fbShareUrl, '_blank', 'width=600,height=400');
      } else {
        const fbMessageUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(imageUrl)}&app_id=703796939215127&redirect_uri=${encodeURIComponent(window.location.href)}`;
        window.open(fbMessageUrl, '_blank', 'width=600,height=500');
      }
    };
  }
}

updateFacebookModalWithError(error: Error) {
  const modalDiv = (window as any).currentFacebookModal;
  if (!modalDiv || !document.body.contains(modalDiv)) return;
  
  const loadingDiv = modalDiv.querySelector('#facebook-loading');
  const contentDiv = modalDiv.querySelector('#facebook-content');
  
  if (loadingDiv) {
    loadingDiv.innerHTML = `
      <div style="color:#e74c3c;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p style="margin-top:10px;color:#e74c3c;">Error: ${error.message}</p>
        <button id="retry-facebook-share" style="margin-top:10px;background:#1877F2;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Retry</button>
      </div>
    `;
    
    const retryBtn = modalDiv.querySelector('#retry-facebook-share');
    if (retryBtn) {
      (retryBtn as HTMLElement).onclick = () => {
        modalDiv.remove();
        (window as any).currentFacebookModal = null;
        this.shareToFacebook(this.lastFacebookType);
      };
    }
  }
  
  if (contentDiv) contentDiv.style.display = 'none';
}

  // Share to Instagram - Opens popup immediately with loading state
async shareToInstagram() {
  this.closeFacebookOptions();
  
  this.showInstagramShareModalWithLoading();
  
  try {
    const imageBlob = await this.getCurrentDesignBlob();
    const designTitle = this.activeImageTitle || `Design_${Date.now()}`;
    
    const formData = new FormData();
    formData.append('image', imageBlob, 'design.png');
    formData.append('title', designTitle);
    
    const API_URL = 'https://styleflip-backend-jdm5.ithemes.xyz/api/upload/upload';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // Store the design_id for deletion
      this.currentDesignId = result.design_id;
      
      const imageUrl = result.imageUrl;
      const shareText = `${imageUrl}`;
      
      this.updateInstagramModalWithData(shareText, imageUrl);
      
      const storageKey = this.designer.container?.id || 'fpd-saved-designs';
      let savedList: any[] = [];
      try {
        savedList = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
      } catch {
        savedList = [];
      }
      savedList.push({
        thumbnail: result.imageUrl,
        product: this.designer.getProduct ? this.designer.getProduct() : {},
        title: designTitle,
        imageUrl: imageUrl,
        design_id: result.design_id
      });
      window.localStorage.setItem(storageKey, JSON.stringify(savedList));
      
    } else {
      throw new Error(result.error || 'Failed to get image URL');
    }
  } catch (error) {
    console.error('Instagram share error:', error);
    this.updateInstagramModalWithError(error as Error);
  }
}
showInstagramShareModalWithLoading() {
  const modalHtml = `
    <div id="instagram-share-modal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;">
      <div style="background:white;border-radius:12px;padding:24px;max-width:500px;text-align:center;">
        <h3 style="margin-bottom:16px;color:#E4405F;">Share to Instagram</h3>
        
        <div id="instagram-loading" style="text-align:center;padding:20px;">
          <div style="display:inline-block;width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #E4405F;border-radius:50%;animation:spin 1s linear infinite;"></div>
          <p style="margin-top:10px;">Uploading your design...</p>
        </div>
        
        <div id="instagram-content" style="display:none;">
          <p style="margin-bottom:16px;">
            <strong>Note : -</strong> First, click the Copy Link button. Then, open Instagram Web and send your design using the URL.
          </p>
          <div style="margin-bottom:16px;">
            <img id="instagram-share-image" src="" style="max-width:100%;max-height:200px;border-radius:8px;" />
          </div>
          <button id="copy-instagram-link" style="background:#E4405F;color:white;border:none;padding:12px 24px;border-radius:8px;margin-bottom:12px;cursor:pointer;width:100%;">Copy Link</button>
          <button id="open-instagram-web" style="background:#405DE6;color:white;border:none;padding:12px 24px;border-radius:8px;margin-bottom:12px;cursor:pointer;width:100%;">Open Instagram Web</button>
        </div>
        
        <button id="close-instagram-modal" style="background:#e74c3c;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;width:100%;">Close</button>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = modalHtml;
  document.body.appendChild(modalDiv);
  
  (window as any).currentInstagramModal = modalDiv;
  
  const closeBtn = modalDiv.querySelector('#close-instagram-modal') as HTMLButtonElement;
  if (closeBtn) {
    closeBtn.onclick = async () => {
      if (this.currentDesignId) {
        const deleted = await this.deleteUploadedImage(this.currentDesignId, closeBtn, modalDiv);
        if (deleted) {
          this.currentDesignId = null;
        } else {
          closeBtn.style.opacity = '1';
          closeBtn.style.cursor = 'pointer';
          closeBtn.disabled = false;
        }
      } else {
        modalDiv.remove();
        (window as any).currentInstagramModal = null;
      }
    };
  }
}

updateInstagramModalWithData(shareText: string, imageUrl: string) {
  const modalDiv = (window as any).currentInstagramModal;
  if (!modalDiv || !document.body.contains(modalDiv)) return;
  
  const loadingDiv = modalDiv.querySelector('#instagram-loading');
  const contentDiv = modalDiv.querySelector('#instagram-content');
  const shareImage = modalDiv.querySelector('#instagram-share-image');
  
  if (loadingDiv) loadingDiv.style.display = 'none';
  if (contentDiv) contentDiv.style.display = 'block';
  if (shareImage) (shareImage as HTMLImageElement).src = imageUrl;
  
  const copyBtn = modalDiv.querySelector('#copy-instagram-link');
  const openWebBtn = modalDiv.querySelector('#open-instagram-web');
  
  if (copyBtn) {
    (copyBtn as HTMLElement).onclick = async () => {
      await navigator.clipboard.writeText(shareText);
      (copyBtn as HTMLElement).textContent = 'Copied!';
      setTimeout(() => {
        (copyBtn as HTMLElement).textContent = 'Copy Link';
      }, 2000);
      this.showToast('Link copied to clipboard!');
    };
  }
  
  if (openWebBtn) {
    (openWebBtn as HTMLElement).onclick = () => {
      window.open('https://www.instagram.com', '_blank');
    };
  }
}

 updateInstagramModalWithError(error: Error) {
  const modalDiv = (window as any).currentInstagramModal;
  if (!modalDiv || !document.body.contains(modalDiv)) return;
  
  const loadingDiv = modalDiv.querySelector('#instagram-loading');
  const contentDiv = modalDiv.querySelector('#instagram-content');
  
  if (loadingDiv) {
    loadingDiv.innerHTML = `
      <div style="color:#e74c3c;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p style="margin-top:10px;color:#e74c3c;">Error: ${error.message}</p>
        <button id="retry-instagram-share" style="margin-top:10px;background:#E4405F;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">Retry</button>
      </div>
    `;
    
    const retryBtn = modalDiv.querySelector('#retry-instagram-share');
    if (retryBtn) {
      (retryBtn as HTMLElement).onclick = () => {
        modalDiv.remove();
        (window as any).currentInstagramModal = null;
        this.shareToInstagram();
      };
    }
  }
  
  if (contentDiv) contentDiv.style.display = 'none';
}

  closeFacebookOptions() {
    this.showFacebookOptions = false;
  }

  toggleFacebookOptions() {
    this.showFacebookOptions = !this.showFacebookOptions;
  }

  @HostListener('document:click', ['$event'])
  onClickOutsideFacebook(event: Event) {
    if (this.facebookDropdownRef && 
        !this.facebookDropdownRef.nativeElement.contains(event.target) &&
        this.showFacebookOptions) {
      this.showFacebookOptions = false;
    }
  }

  // Get current canvas image as Blob
  async getCurrentDesignBlob(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.designer && this.designer.currentViewInstance && this.designer.currentViewInstance.fabricCanvas) {
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const htmlCanvas = canvas.getElement();
        
        if (htmlCanvas && htmlCanvas.toBlob) {
          htmlCanvas.toBlob((blob: Blob | null) => {
            if (blob) {
              resolve(blob);
            } else {
              reject('Failed to convert canvas to blob');
            }
          }, 'image/png', 1);
        } else {
          const dataUrl = canvas.toDataURL({
            format: 'png',
            multiplier: 1,
            enableRetinaScaling: true,
          });
          const blob = this.dataURLtoBlob(dataUrl);
          resolve(blob);
        }
      } else {
        reject('Designer not ready');
      }
    });
  }

  dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // ==================== END OF SHARING FUNCTIONALITY ====================

  moveBoldToPrimaryTools(): void {
    console.log('Moving Bold to Primary Tools');
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

        const current = obj.textTransform || 'none';
        const next = current === 'none' ? 'uppercase' : current === 'uppercase' ? 'lowercase' : 'none';

        this.designer.currentViewInstance.fabricCanvas.setElementOptions({
          textTransform: next,
        });

        if (spanIcon) {
          spanIcon.className = '';
          if (next === 'uppercase') {
            spanIcon.classList.add('fpd-icon-uppercase');
          } else if (next === 'lowercase') {
            spanIcon.classList.add('fpd-icon-lowercase');
          } else {
            spanIcon.classList.add('fpd-icon-text-transform');
          }
        }

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

        const next = current === 'left' ? 'center' : current === 'center' ? 'right' : 'left';

        this.designer.currentViewInstance.fabricCanvas.setElementOptions({
          textAlign: next,
        });

        if (span) {
          span.className = '';
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
        console.log("target is aad",document.querySelector('.fpd-panel-position')?.classList);
        if (document.querySelector('.fpd-panel-position')?.classList.contains('fpd-active')) {
          document.querySelector('fpd-element-toolbar')?.classList.remove('fpd-panel-visible','my-position');
        }
        if (document.body.classList.contains('fpd-toolbar-transform-our')) {
          document.body.classList.remove('fpd-toolbar-transform-our');
          document.querySelector('.fpd-tool-transform')?.classList.remove('fpd-active');
        }
        var hasClass = target.classList.contains('letter-spac-active');
        if(hasClass){
          var toolbar = e.target ? (e.target as HTMLElement).closest("fpd-element-toolbar") : null;
          target.classList.remove('letter-spac-active');
          const subPanel = document.querySelector('.fpd-sub-panel');
          if (!subPanel) return;

          subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
            el.classList.remove('fpd-active');
          });
          if (toolbar) {
            toolbar.classList.forEach((c: any) => {
              if (toolbar && c.startsWith("my-")) toolbar.classList.remove(c);
            });
          }

          return;
        }

        target.classList.add('letter-spac-active');
        const subPanel = document.querySelector('.fpd-sub-panel');
        console.log("subPanel data is", subPanel)
        if (!subPanel) return;

        subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
          el.classList.remove('fpd-active');
        });

        const positionPanel = subPanel.querySelector('.fpd-panel-position');
        if (positionPanel) {
          positionPanel.classList.add('fpd-active', 'fpd-pos-data-sec');
        }

        const elementtoolbar = document.querySelector('fpd-element-toolbar');
        console.log("djjjjj",elementtoolbar)
        console.log("test test");
        if(elementtoolbar){
          elementtoolbar.classList.add('fpd-panel-visible')
        }
      });
    }

    document.getElementById('TextMoveUp')?.addEventListener('click', () => {
      const canvas = this.designer.currentViewInstance.fabricCanvas;
      const obj = canvas.getActiveObject();
      console.log('Text Move Up clicked, active object:', obj); 
      if (!obj) return;

      const objects = canvas.getObjects();
      const overlayObj = objects.find((o: any) => o.title === 'Overlay');

      console.log('Text Move Up clicked', obj, overlayObj);

      if (overlayObj) {
        const overlayIndex = objects.indexOf(overlayObj);
        const objIndex = objects.indexOf(obj);

        console.log('Overlay index:', overlayIndex, 'Object index:', objIndex);

        if (objIndex < overlayIndex - 1) {
          canvas.bringForward(obj);
          moveLayerRowUp(obj.id);
        } else {
          this.showToast('Not possible to move above Overlay layer!');
          return;
        }
      } else {
        canvas.bringForward(obj);
        moveLayerRowUp(obj.id);
      }

      obj.setCoords();
      console.log('✅ Layer moved up & layer panel notified 1', obj);
      canvas.fire('object:modified', { target: obj });
      canvas.fire('elementModify', {
        element: obj,
        options: {}
      })

      canvas.requestRenderAll();

      console.log('✅ Layer moved up & layer panel notified');
    });

    function moveLayerRowUp(elementId: string) {
      const list = document.querySelector('.fpd-list');
      if (!list) return;

      const row = document.getElementById(elementId);
      if (!row) return;

      const prevRow = row.previousElementSibling;

      if (!prevRow || prevRow.classList.contains('fpd-locked')) {
        console.log('Cannot move above Base');
        return;
      }

      list.insertBefore(row, prevRow);

      console.log('✅ DOM layer moved up');
    }

    function moveLayerRowDown(elementId: string) {
      const list = document.querySelector('.fpd-list');
      if (!list) return;

      const row = document.getElementById(elementId);
      if (!row) return;

      const nextRow = row.nextElementSibling;
      if (!nextRow) return;

      list.insertBefore(nextRow, row);

      console.log('✅ DOM layer moved down');
    }

    document.getElementById('TextMoveDown')?.addEventListener('click', () => {
      const canvas = this.designer.currentViewInstance.fabricCanvas;
      const obj = canvas.getActiveObject();
      if (!obj) return;

      console.log("Text Move Down clicked", obj);

      const baseObj = canvas.getObjects().find((o: any) => o.title === "Base");

      if (baseObj) {
        const baseIndex = canvas.getObjects().indexOf(baseObj);
        const objIndex = canvas.getObjects().indexOf(obj);

        if (objIndex > baseIndex + 1) {
          canvas.sendBackwards(obj);
          moveLayerRowDown(obj.id);
        } else {
          this.showToast("Reached just above base, not moving further down.");
        }
      } else {
        canvas.sendBackwards(obj);
        moveLayerRowDown(obj.id);
      }

      canvas.requestRenderAll();
      
    });

    const minusEl = document.getElementById('minusElement');
    const plusEl = document.getElementById('plusElement');

    if (minusEl) {
      minusEl.addEventListener('click', () => {
        const inputEl = document.querySelector('input[data-control="fontSize"]') as HTMLInputElement;
        if (inputEl) {
          let current = parseInt(inputEl.value) || 1;
          current = Math.max(1, current - 1);
          inputEl.value = String(current);

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
          current = Math.min(200, current + 1);
          inputEl.value = String(current);

          this.designer.currentViewInstance.fabricCanvas.setElementOptions({
            fontSize: current,
          });
        }
      });
    }

    let fpdIconMoveUp = document.querySelector('.fpd-icon-move-up');
    fpdIconMoveUp?.addEventListener('click', () => {
      document.querySelector('.fpd-icon-move-up')?.classList.add('active-icon');
      setTimeout(() => {
        document.querySelector('.fpd-icon-move-up')?.classList.remove('active-icon');
      }, 1000)
    });

    let fpdIconMoveDown = document.querySelector('.fpd-icon-move-down');
    fpdIconMoveDown?.addEventListener('click', () => {
      document.querySelector('.fpd-icon-move-down')?.classList.add('active-icon');
      setTimeout(() => {
        document.querySelector('.fpd-icon-move-down')?.classList.remove('active-icon');
      }, 1000)
    });

    let copiedObject: any = null;
    
    document.getElementById('copytext')?.addEventListener('click', (e) => {
      console.log("e.currentTarget",e.currentTarget)
      const canvas = this.designer.currentViewInstance.fabricCanvas;
      const obj = canvas.getActiveObject();

      if (!obj) return;

      if (obj.type === 'curved-text') {
        copiedObject = {
          type: 'curved-text',
          params: {
            ...obj.toObject(),
          }
        };

        console.log('Copied curved text params:', copiedObject);
        this.showToast('Curved text copied!');
        return;
      }

      obj.clone((cloned: any) => {
        copiedObject = {
          type: obj.type,
          object: cloned
        };
        console.log('Copied object:', copiedObject);
        this.showToast('Copied successfully!');
      });
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        console.log("Ctrl+C pressed",);
        e.preventDefault();

        const canvas = this.designer.currentViewInstance.fabricCanvas;

        const obj = canvas.getActiveObject();
        console.log("Ctrl+C pressed, active object:", obj, obj.type);
        
        if (!obj) return;

        if (obj.type === 'image') {
          if (!Array.isArray(obj.filters)) {
            obj.filters = [];
          }
        }

        obj.clone((cloned: any) => {
          if (cloned.type === 'image') {
            if (!Array.isArray(cloned.filters)) {
              cloned.filters = [];
            }
          }

          copiedObject = cloned;
          console.log('Copied via Ctrl+C:', copiedObject);
          this.showToast('Copied successfully!');
        });
      }
    });

    document.getElementById('pastetext')?.addEventListener('click', () => {
      const view = this.designer.currentViewInstance;
      const canvas = view.fabricCanvas;
      console.log("e.currentTarget copiedObjectdata",copiedObject)
      if (!copiedObject) return;

      if (copiedObject.type === 'curved-text') {
        const zoom = canvas.getZoom();

        const params = {
          ...copiedObject.params,
          scaleX: (copiedObject.scaleX || 1),
          scaleY: (copiedObject.scaleY || 1),
          left: (copiedObject.left || 500) + 20,
          top:  (copiedObject.top  || 500) + 20,
          angle: copiedObject.angle || 0,
          flipX: copiedObject.flipX || false,
          flipY: copiedObject.flipY || false,
          colors: copiedObject.colors || ['#000000'],
          originX: copiedObject.originX || 'center',
          originY: copiedObject.originY || 'center',
          curved: true,
          curvable: copiedObject.curvable || 1,
          selectable: true,
          evented: true,
          boundingBox: 'base',
          boundingBoxMode: 'clipping',
          hasControls: true,
          draggable: true,
          resizable: true,
          rotatable: true,
          removable: true,
          lockUniScaling: true,
          scalable: true,
          editable: true,
        };

        delete params.objects;
        delete params.clipPath;
        delete params.path;

        canvas.addElement(
          'curvedText',
          params.text,
          params.text,
          params
        );

        canvas.requestRenderAll();
        this.showToast('Curved text pasted ✔');
        return;
      }

      canvas.duplicateElement(this.designer.currentElement);
      this.showToast('Paste successfully!');
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();

        if (copiedObject) {
          this.designer.currentViewInstance.fabricCanvas.duplicateElement(
            this.designer.currentElement
          );
          this.showToast('Paste successfully!');
        }
      }
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        
        const canvas = this.designer?.currentViewInstance?.fabricCanvas;
        if (!canvas) return;
        
        const activeObject = canvas.getActiveObject();
        
        if (activeObject) {
          if (activeObject.type === 'activeSelection') {
            activeObject.forEachObject((obj: any) => {
              canvas.remove(obj);
            });
          } else {
            canvas.remove(activeObject);
          }
          
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          
          this.showToast('Item deleted successfully!');
        }
      }
    });

    document.getElementById('deletetext')?.addEventListener('click', () => {
      const canvas = this.designer?.currentViewInstance?.fabricCanvas;
      if (!canvas) return;
      
      const activeObject = canvas.getActiveObject();
      
      if (activeObject) {
        if (activeObject.type === 'activeSelection') {
          activeObject.forEachObject((obj: any) => {
            canvas.remove(obj);
          });
        } else {
          canvas.remove(activeObject);
        }
        
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        
        this.showToast('Item deleted successfully!');
      }
    });

    document.getElementById('letter-spacing')?.addEventListener('click', (e) => {
      console.log("e.currentTarget",e.currentTarget)
      document.body.classList.remove('fpd-toolbar-transform-our');
      const target = e.currentTarget as HTMLElement;
      if(document.getElementById('letter-spacing')?.classList.contains('letter-spac-active')){
        console.log("letter-spacing is active")
        const elementtoolbar = document.querySelector('fpd-element-toolbar');
        if(elementtoolbar){
          elementtoolbar.classList.remove('fpd-panel-visible')
        }
        document.getElementById('letter-spacing')?.classList.remove('letter-spac-active')
        return;
      }

      target.classList.add('letter-spac-active');
      const subPanel = document.querySelector('.fpd-sub-panel');
      console.log("subPanel data is", subPanel)
      if (!subPanel) return;

      subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
        el.classList.remove('fpd-active');
      });
      
      const positionPanel = subPanel.querySelector('.fpd-panel-text-size');
      if (positionPanel) {
        positionPanel.classList.add('fpd-active', 'fpd-letter-spacing-lineheight');
        this.document.body.classList.remove('fpd-tools-custom-data')
      }

      const elementtoolbar = document.querySelector('fpd-element-toolbar');
      console.log("djjjjj",elementtoolbar)
      console.log("test testsss");
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

      fetch(`https://styleflip-backend-jdm5.ithemes.xyz/api/sharedproduct/search?title=${encodeURIComponent(dataTitle)}&design_id=${matchedData[0]?.design_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log('Search API Response:', data);

          if (data && data.product && data.product.length > 0) {
            const firstProduct = data.product[0];
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
      
      const clickedInsideProductStage = productStage?.contains(event.target as Node);
      const clickedInsideViewStage = viewStage?.contains(event.target as Node);

      if (clickedInsideProductStage && !clickedInsideViewStage) {
        if (toolbar) {
          toolbar.classList.remove('fpd-show');
        }
      }
    });

    document.addEventListener("click", function (e:any) {
      console.log("Document clicked", e.target, e);
      const toolbar = e.target.closest("fpd-element-toolbar");
      if (!toolbar) return;
      console.log("toolbar is", toolbar);
     
      if(e.target.classList.contains("fa-close")) {
        console.log("e.target is", e.target);
        const transformSpac = document.querySelector('.fpd-tool-transform');
        let transformActive = transformSpac?.classList.contains('fpd-active');
        if(transformActive){
          document.querySelector('.fpd-tool-transform')?.classList.remove('fpd-active');
        }
      }
     
      if (toolbar.classList.contains("fpd-show")) {
        const target = e.target.closest("[title], [data-panel]");
        console.log("target is", target);
        if (!target) return;

        const value = target.getAttribute("title") || target.getAttribute("data-panel");
        console.log("target value is", value);
        if (!value) return;

        const newClass = "my-" + value.toLowerCase().replace(/\s+/g, '-');

        if (toolbar) {
          toolbar.classList.forEach((c:any) => {
            if (c.startsWith("my-")) toolbar.classList.remove(c);
          });
        }

        toolbar.classList.add(newClass);
      }
      else {
        toolbar.classList.forEach((c: any) => {
          if (c.startsWith("my-")) { 
            console.log("removing class", c);
            toolbar.classList.remove(c); 
          }
        });
      }

      console.log("Toolbar updated with class:", toolbar.className);
      document.body.classList.forEach(cls => {
        if (cls.startsWith('fpd-type-')) {
          document.body.classList.remove(cls);
        }
      });

      const typeClass = toolbar.className
        .split(' ')
        .find((cls: string) => cls.startsWith('fpd-type-'));

      if (typeClass) {
        document.body.classList.add(typeClass);
      }
    });
  }

  slugify(title: string): string {
    return title
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[^\w\s-]/g, '')
      ?.replace(/\s+/g, '-')
      ?.replace(/--+/g, '-');
  }

  async ngOnInit() {
    setTimeout(() => {
      lucide.createIcons(); 
    }, 5000);
    
    function openDB(): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("FPD_DB", 1);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("products")) {
            db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
          }
        };

        request.onsuccess = (event: any) => {
          resolve(event.target.result);
        };

        request.onerror = (event: any) => {
          reject(event.target.error);
        };
      });
    }

    async function saveProducts(data: any[]) {
      const db = await openDB();
      const tx = db.transaction("products", "readwrite");
      const store = tx.objectStore("products");

      store.clear();

      if (Array.isArray(data)) {
        data.forEach((item) => store.add(item));
      } else {
        store.add(data);
      }

      return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    }

    async function getProducts(): Promise<any[]> {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction("products", "readonly");
        const store = tx.objectStore("products");
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    (window as any).getProducts = getProducts.bind(this);
    const storedFonts = localStorage.getItem('fontList');
    const fontData = storedFonts ? JSON.parse(storedFonts) : null;
    
    this.appOptions = {
      productsJSON: 'assets/data/products/product-categories.json',
      productsJSON1: 'assets/data/products/product-categories-new.json',
      designsJSON: 'https://styleflip-backend-jdm5.ithemes.xyz/api/element/getAllElements',
      langJSON: 'assets/data/langs/default.json',
      stageWidth: 2500,
      stageHeight: 700,
      initialActiveModule: 'products',
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
        top: [],
        right: [],
        left: ['undo', 'redo', 'download','zoom', 'reset-product','preview-lightbox'],
        center: [],
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
            fill: '#ff5722',
            stroke: '#000000',
            strokeWidth: 2,
            shadow: 'rgba(0,0,0,0.3) 2px 2px 3px',
            curved: true,
            curveSpacing: 5,
            curveRadius: 180,
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
            fill: '#3f51b5',
            stroke: '#010101',
            curvable: 1,
            strokeWidth: 3,
            shadow: 'rgba(255,255,255,0.5) 0px 0px 6px',
          },
        },
        {
          text: 'Creative Soul',
          properties: {
            fontSize: 70,
            fontFamily: 'Pacifico',
            fill: '#e91e63',
            stroke: '#ffc107',
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
            fill: '#4caf50',
            stroke: '#ffffff',
            strokeWidth: 2,
            curvable: 1,
            shadow: 'rgba(0,0,0,0.4) 3px 3px 5px',
          },
        },
      ],
      fileServerURL: 'https://file.handler.php.stageprojects.xyz/',
      uploadZone: {
        useDataURL: true,
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
    };
    
    this.designer = new FancyProductDesigner(
      this.document.querySelector('#clothing-designer'),
      this.appOptions
    );
    console.log("designer is", this.designer);
    
   // Step 1: First load from IndexedDB (immediate display)
    console.log("📀 Loading from IndexedDB first...");
    const cachedProducts = await getProducts();

    if (cachedProducts && cachedProducts.length > 0) {
      console.log("✅ Loaded", cachedProducts.length, "products from IndexedDB");
      this.designer.product = cachedProducts;
      this.showFPDLoading(false);
    } else {
      console.log("⚠️ No cached data, showing loader");
      this.showFPDLoading(true);
    }

    // Step 2: Fetch fresh data from API (background update)
    console.log("🌐 Fetching fresh data from API...");
    fetch("https://styleflip-backend-jdm5.ithemes.xyz/api/product/getAllProducts")
      .then((res) => res.json())
      .then(async (freshData) => {
        console.log("📦 Fresh API data received:", freshData.length, "products");
        
        // Update IndexedDB with fresh data
        await saveProducts(freshData);
        
        // Update designer with fresh data
        this.designer.product = freshData;
        console.log("✅ Designer updated with fresh data");
        
        this.showFPDLoading(false);
        
        // Optional: Show toast notification (uncomment if you have this method)
        // this.showToast("Products updated!");
      })
      .catch((err) => {
        console.error("❌ API fetch failed:", err);
        this.showFPDLoading(false);
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
              }, 10000);
            } else {
              console.log('No matching title found in designTitleData.');
            }
          });
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


    document.addEventListener(
    'click',
    (event: any) => {

          const target = event.target?.closest('[data-action="preview-lightbox"]');

          if (!target) return;

          // ❌ Stop FPD default behavior
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          console.log('Custom Preview Triggered');

          // ✅ Call your function
          this.preview();

        },
        true // 🔥 capture phase (important)
      );

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

  filterThumbnails(searchTerm: string) {
    console.log('searchTerm', searchTerm);
    
    if (searchTerm.length < 2) {
      const parentDiv = document.querySelector('div[data-moduleicon="layout-panel-left"]');
      if (!parentDiv) return;

      const thumbnails = parentDiv.querySelectorAll('.fpd-grid .fpd-item.fpd-hover-thumbnail');
      thumbnails.forEach((thumb: Element) => {
        (thumb as HTMLElement).style.display = 'flex';
      });
      return;
    }

    const parentDiv = document.querySelector('div[data-moduleicon="layout-panel-left"]');
    console.log('parentDiv', parentDiv);
    if (!parentDiv) return;

    const thumbnails = parentDiv.querySelectorAll('.fpd-grid .fpd-item.fpd-hover-thumbnail');
    console.log('parentDivdata', thumbnails);

    thumbnails.forEach((thumb: Element) => {
      const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
      console.log('title', title, 'searchTerm', searchTerm);
      const search = searchTerm.toLowerCase();

      const titleWords = title.split(' ');
      const matches = titleWords.some(word => word.startsWith(search));
      
      (thumb as HTMLElement).style.display = matches ? 'flex' : 'none';
    });
  }

  filterThumbnailsP(searchTerm: string) {
    console.log('searchTerm', searchTerm);
    
    if (searchTerm.length < 2) {
      const allThumbnails = document.querySelectorAll('.fpd-item.fpd-hover-thumbnail');
      console.log('Showing all thumbnails (search too short)', allThumbnails.length);
      allThumbnails.forEach((thumb: Element) => {
        (thumb as HTMLElement).style.display = 'flex';
      });
      
      document.querySelectorAll('.box-contain-text').forEach((container) => {
        (container as HTMLElement).style.display = 'block';
      });
      return;
    }

    const search = searchTerm.toLowerCase().trim();
    
    const containers = [
      ...document.querySelectorAll('.fpd-grid.skins-data'),
      ...document.querySelectorAll('.fpd-grid.ProductModule'),
      ...document.querySelectorAll('.fpd-grid')
    ];
    
    console.log('Found containers to search:', containers.length);
     console.log('containers data ', containers);
    
    let totalMatches = 0;
    let totalItems = 0;
    
    containers.forEach((container) => {
      const thumbnails = container.querySelectorAll('.fpd-item.fpd-hover-thumbnail');
      totalItems += thumbnails.length;
        console.log('thumbnails data ', thumbnails);
      thumbnails.forEach((thumb: Element) => {
        const title = thumb.getAttribute('data-title')?.toLowerCase() || '';
        const matches = this.doesTitleMatchSearch(title, search);
          console.log('matches data ', matches);
        if (matches) {
          totalMatches++;
          console.log(`Match found: "${title}" for search "${search}"`);
        }
        
        (thumb as HTMLElement).style.display = matches ? 'flex' : 'none';
      });
    });
    
    console.log(`Search results: ${totalMatches} matches out of ${totalItems} items for "${search}"`);
    
    document.querySelectorAll('.box-contain-text').forEach((container) => {
      const children = container.querySelectorAll('.fpd-item');
      const anyVisible = Array.from(children).some(
        (child) => (child as HTMLElement).style.display !== 'none'
      );
      (container as HTMLElement).style.display = anyVisible ? 'block' : 'none';
    });
  }

  doesTitleMatchSearch(title: string, search: string): boolean {
    if (!search || search.length < 2) return true;
    
    const cleanTitle = title.toLowerCase().replace(/[^\w\s-]/g, ' ');
    
    const searchWords = search.split(/\s+/).filter(word => word.length > 0);
    
    if (searchWords.length === 1) {
      const searchWord = searchWords[0];
      
      const titleWords = cleanTitle.split(/\s+/);
      return titleWords.some(word => word.startsWith(searchWord));
    }
    
    return searchWords.every(searchWord => {
      const titleWords = cleanTitle.split(/\s+/);
      return titleWords.some(titleWord => titleWord.startsWith(searchWord));
    });
  }

  previewImage: string = '';
  showPreviewModal: boolean = false;
  
  preview() {
    if (document.getElementById('fpd-preview-modal')) {
      console.log('Preview already open');
      return;
    }
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

      const image = new Image();
      image.src = dataUrl;

      image.onload = () => {

        const previewDiv = document.createElement('div');
        previewDiv.id = 'fpd-preview-modal'; // 🔥 unique ID

        previewDiv.style.background = `url(${image.src})`;
        previewDiv.style.height = '100vh';
        previewDiv.style.width = '100%';
        previewDiv.style.backgroundSize = 'contain';
        previewDiv.style.backgroundRepeat = 'no-repeat';
        previewDiv.style.backgroundPosition = 'center';
        previewDiv.style.zIndex = '9999';
        previewDiv.style.position = 'fixed';
        previewDiv.style.top = '0';
        previewDiv.style.left = '0';
        previewDiv.style.backgroundColor = '#fff';

        // ❌ Close Button
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

  openLoginPopup() {
    this.showLoginPopup = true;
  }

  closeLoginPopup() {
    this.showLoginPopup = false;
  }

  onLogin(event: Event) {
    event.preventDefault();
    console.log('Attempting Shopify login for:', this.email);

    const payload = {
      query: `
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              accessToken
              expiresAt
            }
            customerUserErrors {
              message
            }
          }
        }
      `,
      variables: {
        input: {
          email: this.email,
          password: this.password
        }
      }
    };

    this.http
      .post<any>(
        'https://styleflip-store.myshopify.com/api/2024-01/graphql.json',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': '2e73a385a2189ddcf0c328bf1a1433bb',
          },
        }
      )
      .subscribe({
        next: (response) => {
          console.log('Shopify login response:', response);
          const data = response?.data?.customerAccessTokenCreate;

          if (data?.customerAccessToken?.accessToken) {
            const token = data.customerAccessToken.accessToken;

            localStorage.setItem('customerToken', token);
            this.isLoggedIn = true;
            this.showLoginPopup = false;
            this.closeLoginPopup();

            console.log('Shopify login success:', token);
            this.getCustomerDetails(token);
          } else {
            const errorMsg =
              data?.customerUserErrors?.[0]?.message ||
              'Login failed. Invalid credentials.';
            alert(errorMsg);
          }
        },
        error: (err) => {
          console.log('Shopify login error:', err);
          alert('Network error or Shopify API issue.');
        },
      });
  }

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
          Authorization: `Bearer ${token}`,
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

      const tagWrapperMain = document.createElement('div');
      tagWrapperMain.className = 'relative w-full mt-2 fpd-designs-tags';

      const tagWrapper = document.createElement('div');
      tagWrapper.className = 'flex gap-2 mt-2 ml-[5px] fixed md:top-[164px]';
      tagWrapper.id = 'tag-wrapper-design-tags';

      Array.from(allTagsSetD).forEach((tag) => {
        const tagButton = document.createElement('div');
        tagButton.className =
          'fpd-tag-btn capitalize border border-[#35475a33] border-solid pt-2 pb-2 pr-3 pl-3 text-sm text-[#0d1216] rounded-[6px] cursor-pointer hover:bg-[#40576d12] flex-none whitespace-nowrap';
        tagButton.innerText = tag as string;

        tagButton.addEventListener('click', () => {
          document
            .querySelectorAll('.fpd-tag-btn')
            .forEach((btn) => btn.classList.remove('!bg-[#40576d12]'));
          tagButton.classList.add('!bg-[#40576d12]');

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
            document
              .querySelectorAll('.fpd-item.fpd-hover-thumbnail')
              .forEach((item) => {
                (item as HTMLElement).style.display = 'flex';
              });

            document
              .querySelectorAll('.box-contain-text')
              .forEach((container) => {
                (container as HTMLElement).style.display = 'block';
              });

            document.querySelectorAll('.fpd-tag-btn').forEach((btn) => {
              btn.classList.remove('!bg-[#40576d12]');
            });

            resetBtn.classList.add('hidden');

            const searchBox = document.querySelector(
              '#searchbox-design'
            ) as HTMLElement;
            if (searchBox) {
              searchBox.style.maxWidth = 'calc(100% - 22px)';
              searchBox.style.marginLeft = '5px';
            }

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

      const leftArrow = document.createElement('button');
      leftArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m14.8 16.382-4.205-4.205a.25.25 0 0 1 0-.354L14.8 7.618a.75.75 0 0 0-1.06-1.06l-4.206 4.204a1.75 1.75 0 0 0 0 2.475l4.206 4.205a.75.75 0 0 0 1.06-1.06"></path>
        </svg>
        `;
      leftArrow.className =
        'fixed md:left-[90px] md:top-[178px] z-[9] bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden';
      leftArrow.disabled = true;

      const rightArrow = document.createElement('button');
      rightArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"></path>
        </svg>
        `;
      rightArrow.className =
        'fixed md:left-[380px] md:top-[210px] z-[9] mt-[-20px] -translate-y-1/2 bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden';

      function updateArrows() {
        const wrapperWidth = tagWrapperMain.offsetWidth;
        const contentWidth = tagWrapper.scrollWidth;

        if (currentOffset > 0) currentOffset = 0;
        if (Math.abs(currentOffset) >= contentWidth - wrapperWidth) {
          currentOffset = -1 * (contentWidth - wrapperWidth);
        }

        tagWrapper.style.transform = `translateX(${currentOffset}px)`;

        leftArrow.disabled = currentOffset === 0;
        rightArrow.disabled =
          Math.abs(currentOffset) >= contentWidth - wrapperWidth - 1;
      }

      leftArrow.onclick = () => {
        const tag = tagWrapper.querySelector('div');
        if (tag) {
          const scrollAmount = tag.offsetWidth * 2 + 16;
          currentOffset += scrollAmount;
          updateArrows();
        }
      };

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
      activeObject.toGroup();
      canvas.requestRenderAll();
    }
    else{
      alert('Please select at least 2 objects to group.jsjj');
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
    this.closeBox();
  }

  dowloadButton() {
    this.closeFacebookOptions();
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

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const doc = printWindow.document;
        doc.title = 'Print Design';

        const style = doc.createElement('style');
        style.textContent = `
          body { margin: 0; text-align: center; background: #fff; }
          img { max-width: 100vw; max-height: 100vh; }
        `;
        doc.head.appendChild(style);

        const img = doc.createElement('img');
        img.src = dataUrl;
        img.onload = () => {
          printWindow.print();
        };
        doc.body.appendChild(img);
      }
    } else {
      console.error('Designer or current canvas is not ready.');
    }
  }
  
  saveDesign(customTitle?: string) {
    console.log('llllllllllllllllllllllllllll');
    if (
      this.designer &&
      this.designer.currentViewInstance &&
      this.designer.currentViewInstance.fabricCanvas
    ) {
      const stageWidth = 1800;
      const stageHeight =
        this.designer.currentViewInstance.options.stageHeight || 1000;
      const targetWidth = 300;
      const targetHeight = 300;
      const scale = Math.max(
        targetWidth / stageWidth,
        targetHeight / stageHeight
      );

      this.designer.currentViewInstance.toDataURL(
        (thumbnail: string) => {
          const product = this.designer.getProduct
            ? this.designer.getProduct()
            : {};

          const title = customTitle || `Design_${Date.now()}`;

          console.log('Design Title:', title,product);

          const savedItem = {
            thumbnail,
            product,
            title,
          };

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

          if (product) {
            this.designer.dispatchEvent?.(
              new CustomEvent('actionSave', { detail: savedItem })
            );
            this.designer.doUnsavedAlert = false;
          }

          this.showSuccessMessage('Design saved successfully!');
        },
        { multiplier: scale, format: 'png', backgroundColor: 'transparent' }
      );
    } else {
      console.error('Designer or current canvas is not ready.');
    }
  }
  
  openTitlePopup() {
    const popup = document.getElementById('title-popup');
    const input = document.getElementById('design-title-input') as HTMLInputElement;
    const btn = document.getElementById('save-title-btn');
 const closeBtn = document.getElementById('close-title-popup-btn');
    if (!popup || !input || !btn) return;

    popup.style.display = 'flex';

    btn.onclick = () => {
      const value = input.value.trim();

      if (!value) {
        alert('Please enter a title');
        return;
      }

      popup.style.display = 'none';
      this.saveDesign(value);
      setTimeout(() => {
        this.loadSavedProducts();
      }, 100);
    };
     if (closeBtn) {
    closeBtn.onclick = () => {
      popup.style.display = 'none';
      input.value = '';
    };
  }

  // 👇 OPTIONAL: Click outside to close
  popup.onclick = (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
      input.value = '';
    }
  };
  }

  addSavedProduct(item: { thumbnail: string; product: any; title: string }) {
    console.log("item data",item)
    const wrapper = document.createElement('div');
    wrapper.className = 'fpd-item saved-design';
    wrapper.style.position = 'relative';

    const img = document.createElement('img');
    img.src = item.thumbnail;
    img.alt = item.title || 'Saved Design';
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    wrapper.appendChild(img);

    const titleDiv = document.createElement('div');
    titleDiv.innerText = item.title || '';
    titleDiv.style.fontSize = '12px';
    titleDiv.style.marginTop = '4px';
    wrapper.appendChild(titleDiv);

    const trashBtn = document.createElement('button');
    trashBtn.innerHTML = '🗑️';
    trashBtn.style.position = 'absolute';
    trashBtn.style.top = '2px';
    trashBtn.style.right = '2px';
    trashBtn.style.background = 'transparent';
    trashBtn.style.border = 'none';
    trashBtn.style.cursor = 'pointer';
    wrapper.appendChild(trashBtn);

    wrapper.addEventListener('click', () => {
      if (this.designer?.loadProduct) {
        this.designer.loadProduct(item.product);
        this.designer.currentProductIndex = -1;
      }
    });

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
      this.designer?.dispatchEvent?.(
        new CustomEvent('actionLoad:Remove', {
          detail: { index, item: wrapper },
        })
      );
    });
    console.log("dddddddd",this)
    this.savedGrid?.nativeElement.appendChild(wrapper);
  }

  addToCart() {
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
 
      const product = this.designer.getProduct ? this.designer.getProduct() : {};
      const title = (
        this.previewButton?.nativeElement.value || ''
      ).toString();
      console.log('Adding to cart:', { title, product, dataUrl });
 
      const cartItem = {
        thumbnail: dataUrl,
        product,
        title,
      };
 
      var jsonString = JSON.stringify(cartItem);
 
      $.post('https://editor.styleflip.com/fpd/addtocart.php', {
        fpd_data: jsonString
      }, function(response) {
        console.log('Data saved successfully');
      });
 
      this.showSuccessMessage('Design added to cart!');
    }
  }

  loadSavedProducts() {
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
    const apiUrl = 'https://styleflip-backend-jdm5.ithemes.xyz/api/text/getAllData';

    this.http.get<Category[]>(apiUrl).subscribe({
      next: (data) => {
        console.log('Design data fetched:', data);
        const html = this.generateHTML(data);
        const container = document.getElementById('content-text');
        if (container) {
          container.innerHTML = html;
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

function moveLayerRowUp(elementId: string) {
  const list = document.querySelector('.fpd-list');
  if (!list) return;

  const row = document.getElementById(elementId);
  if (!row) return;

  const prevRow = row.previousElementSibling;
  if (!prevRow) return;

  list.insertBefore(row, prevRow);

  console.log('✅ DOM layer moved up');
}