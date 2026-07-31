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
  ) { }

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
    ;

    return new Promise((resolve, reject) => {
      this.http
        .get<any[]>('https://styleflip-backend-jdm5.ithemes.xyz/api/product/getAllProducts')
        .subscribe({
          next: (data) => {
            ;
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
                    ;

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
    ;
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

  targetBackUrl = 'https://www.styleflip.com/products/apple-macbook-13-nonunibody-custom-skins-covers';

  goBack() {
    // Current URL check kar
    if (window.location.href.includes('http://localhost:4200/apple/macbook-13-inch-non-unibody-2006-2009')) {
      // Live product page pe bhej
      window.location.href = this.targetBackUrl;
    } else {
      // Normal back
      window.history.back();
    }
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const fontArrayStr: any[] = [];
      ;
      localStorage.setItem('productLoader', 'done');

      fetch('https://styleflip-backend-jdm5.ithemes.xyz/api/font/getAllFonts')
        .then(res => res.json())
        .then(data => {
          ;
          this.fontArrayStr = data;
          localStorage.setItem('fontList', JSON.stringify(this.fontArrayStr));
        })
        .catch(err => {
          console.error('Error fetching fonts:', err);
        });

      const storedFonts = localStorage.getItem('fontList');
      const fontData = storedFonts ? JSON.parse(storedFonts) : null;

      if (fontData) {
        ;
      }

      setTimeout(async () => {
        const manufacturerSlug =
          this.route.snapshot.paramMap.get('manufacturer') || '';
        const titleSlug = this.route.snapshot.paramMap.get('slug') || '';

        ;

        const pageTitle = `${titleSlug.trim() ? titleSlug.replace(/-/g, '') : 'Styleflip'
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

        ;

        const fpdTarget = document.getElementById('fpd-target');
        if (!fpdTarget) return;

        ;

        $(document).on('click', 'fpd-module-products .fpd-item', (event) => {
          localStorage.setItem('productIndex', '');
          localStorage.setItem('categoryIndex', '');
          localStorage.setItem('childIndex', '');
          ;
          const clickedTitle = $(event.currentTarget).data('title');
          ;

          const manufacturer = $(event.currentTarget).data('manufacturer');
          let ob: any;

          try {
            ob = (Object.entries(event.target)[1][1] as any)['manufacturer'];
          } catch (error) {
            ob = 'apple';
          }

          const slug = this.slugify(clickedTitle);
          const manufacturerSlug = this.slugify(ob);
          ;
          let productLoadervaalue = localStorage.getItem('productLoader');
          // 'productLoader' is set to '' by FancyProductDesigner.js while it is
          // programmatically replaying a saved product selection on page load
          // (see the restore sequence in FancyProductDesigner.js that dispatches
          // synthetic clicks on '.ProductModule' items), and back to 'done' once
          // that's finished. Only navigate for real user clicks, not synthetic
          // ones fired during that automatic restore.
          if (productLoadervaalue === 'done') {
            this.router.navigate([manufacturerSlug || 'apple', slug]);
          }
        });

        // Designs items (pi() in FancyProductDesigner.js) and freshly-
        // uploaded-this-session items (Yi()) each get their own native
        // click-to-add-to-canvas listener attached directly on the element
        // when it's created - a broad document-level handler for every
        // .item-data-click used to duplicate that (fixed by removing it).
        // But items restored from the backend (loadItems(), fetched from
        // /api/image/getByUserId into #extracontainer-data) are built with
        // plain document.createElement calls that never attach any click
        // listener at all - so those never had a *redundant* handler, they
        // had *no* handler, and clicking them silently did nothing. Scope a
        // handler to just that container so only the items missing a native
        // listener are covered; addCanvasDesign() adds directly via
        // fabricCanvas.addElement (no re-upload round trip), unlike
        // _addGridItemToCanvas's default path which - for items outside
        // Yi()'s explicit-no-download call - re-uploads the already-hosted
        // S3 image through fileServerURL again before adding it, which is
        // both slow and now fails outright since our /api/image/upload
        // route only accepts an actual file, not a { url } reference.
        $(document).on('click', '#extracontainer-data .item-data-click', (event) => {
          event.stopPropagation();
          const clickedDiv = event.currentTarget as HTMLElement;
          const clothingDesignerElem = document.querySelector('#clothing-designer');
          if (!clothingDesignerElem) {
            console.error('Element #clothing-designer not found.');
            return;
          }
          const fpdvalue = (clothingDesignerElem as any).instance;
          const source = clickedDiv.getAttribute('data-source');
          const title = clickedDiv.getAttribute('data-title');
          const parameter = { removable: true, positioned: true, autoSelect: true, uniScalingUnlockable: true };
          fpdvalue.addCanvasDesign(source, title, parameter);
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
          ;

          hideIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            ;
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
                  ;
                  var activeclick = localStorage.getItem('fpdMenuClicked');
                  ;
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

          activeObserver.observe(mainBar, {
            attributes: true,
            attributeFilter: ['class'],
            subtree: true,
          });
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
      ;

      dropdownItems.forEach((item) => {
        item.addEventListener('click', () => {
          // updateTagsFromDesignModule() removes any stale .fpd-designs-tags
          // bar itself now, so no manual cleanup is needed here.
          this.updateTagsFromDesignModule();
          ;
        });
      });
    }, 2000);

    setTimeout(() => {
      const checkAndHideDuplicateFpdItems = () => {
        const containers =
          this.document.querySelectorAll<HTMLElement>('.ProductModuleMy');
        ;

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
              ;
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
      ;
      if (!btnOpacity || !panel || !sliderOpacity) return;


      btnOpacity.addEventListener('click', () => {
        if (targetSection) {
          const activeElem = targetSection.querySelector('.fpd-active');

          if (activeElem) {
            activeElem.classList.remove('fpd-active');
          }
        }
        ;
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
    setTimeout(() => {
      const backBtn = document.getElementById('backButton');
      if (backBtn) {
        ;
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          ;
          window.location.href = 'https://www.styleflip.com/products/apple-macbook-pro-13-with-retina-display-skins-custom-sticker-covers?variant=45181139386554';
        });
      } else {
        ;
      }
    }, 1000);

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
          ;
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
          ;
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
    ;
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
        ;
        if (document.querySelector('.fpd-panel-position')?.classList.contains('fpd-active')) {
          document.querySelector('fpd-element-toolbar')?.classList.remove('fpd-panel-visible', 'my-position');
        }
        if (document.body.classList.contains('fpd-toolbar-transform-our')) {
          document.body.classList.remove('fpd-toolbar-transform-our');
          document.querySelector('.fpd-tool-transform')?.classList.remove('fpd-active');
        }
        var hasClass = target.classList.contains('letter-spac-active');
        if (hasClass) {
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
        ;
        if (!subPanel) return;

        subPanel.querySelectorAll(':scope > .fpd-active').forEach(el => {
          el.classList.remove('fpd-active');
        });

        const positionPanel = subPanel.querySelector('.fpd-panel-position');
        if (positionPanel) {
          positionPanel.classList.add('fpd-active', 'fpd-pos-data-sec');
        }

        const elementtoolbar = document.querySelector('fpd-element-toolbar');
        ;
        ;
        if (elementtoolbar) {
          elementtoolbar.classList.add('fpd-panel-visible')
        }
      });
    }

    document.getElementById('TextMoveUp')?.addEventListener('click', () => {
      const canvas = this.designer.currentViewInstance.fabricCanvas;
      const obj = canvas.getActiveObject();
      ;
      if (!obj) return;

      const objects = canvas.getObjects();
      const overlayObj = objects.find((o: any) => o.title === 'Overlay');

      ;

      if (overlayObj) {
        const overlayIndex = objects.indexOf(overlayObj);
        const objIndex = objects.indexOf(obj);

        ;

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
      ;
      canvas.fire('object:modified', { target: obj });
      canvas.fire('elementModify', {
        element: obj,
        options: {}
      })

      canvas.requestRenderAll();

      ;
    });

    function moveLayerRowUp(elementId: string) {
      const list = document.querySelector('.fpd-list');
      if (!list) return;

      const row = document.getElementById(elementId);
      if (!row) return;

      const prevRow = row.previousElementSibling;

      if (!prevRow || prevRow.classList.contains('fpd-locked')) {
        ;
        return;
      }

      list.insertBefore(row, prevRow);

      ;
    }

    function moveLayerRowDown(elementId: string) {
      const list = document.querySelector('.fpd-list');
      if (!list) return;

      const row = document.getElementById(elementId);
      if (!row) return;

      const nextRow = row.nextElementSibling;
      if (!nextRow) return;

      list.insertBefore(nextRow, row);

      ;
    }

    document.getElementById('TextMoveDown')?.addEventListener('click', () => {
      const canvas = this.designer.currentViewInstance.fabricCanvas;
      const obj = canvas.getActiveObject();
      if (!obj) return;

      ;

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
      ;
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

        ;
        this.showToast('Curved text copied!');
        return;
      }

      obj.clone((cloned: any) => {
        copiedObject = {
          type: obj.type,
          object: cloned
        };
        ;
        this.showToast('Copied successfully!');
      });
    });

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        ;
        e.preventDefault();

        const canvas = this.designer.currentViewInstance.fabricCanvas;

        const obj = canvas.getActiveObject();
        ;

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
          ;
          this.showToast('Copied successfully!');
        });
      }
    });

    document.getElementById('pastetext')?.addEventListener('click', () => {
      const view = this.designer.currentViewInstance;
      const canvas = view.fabricCanvas;
      ;
      if (!copiedObject) return;

      if (copiedObject.type === 'curved-text') {
        const zoom = canvas.getZoom();

        const params = {
          ...copiedObject.params,
          scaleX: (copiedObject.scaleX || 1),
          scaleY: (copiedObject.scaleY || 1),
          left: (copiedObject.left || 500) + 20,
          top: (copiedObject.top || 500) + 20,
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
        const target = e.target as HTMLElement;
        const isTypingField =
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable);

        if (isTypingField) {
          return;
        }

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
      ;
      document.body.classList.remove('fpd-toolbar-transform-our');
      const target = e.currentTarget as HTMLElement;
      if (document.getElementById('letter-spacing')?.classList.contains('letter-spac-active')) {
        ;
        const elementtoolbar = document.querySelector('fpd-element-toolbar');
        if (elementtoolbar) {
          elementtoolbar.classList.remove('fpd-panel-visible')
        }
        document.getElementById('letter-spacing')?.classList.remove('letter-spac-active')
        return;
      }

      target.classList.add('letter-spac-active');
      const subPanel = document.querySelector('.fpd-sub-panel');
      ;
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
      ;
      ;
      if (elementtoolbar) {
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
      ;

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
            ;
          } else {
            console.error("Data is not an array:", parsedData);
          }
        } catch (err) {
          console.error("Failed to parse localStorage data:", err);
        }
      } else {
        console.warn("No data found in localStorage for key:");
      }
      ;
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
          ;

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
              ;
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
              ;
            }
          }
        }
      });

      observer.observe(paneldata, { attributes: true });
    }

    const elementToolbarForVisibility = document.querySelector('fpd-element-toolbar');

    if (elementToolbarForVisibility) {
      const syncEditorOpenClass = () => {
        document.body.classList.toggle(
          'fpd-editor-open',
          elementToolbarForVisibility.classList.contains('fpd-show')
        );
      };

      syncEditorOpenClass();

      const toolbarVisibilityObserver = new MutationObserver(syncEditorOpenClass);
      toolbarVisibilityObserver.observe(elementToolbarForVisibility, { attributes: true, attributeFilter: ['class'] });
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

    document.addEventListener("click", function (e: any) {
      ;
      const toolbar = e.target.closest("fpd-element-toolbar");
      if (!toolbar) return;
      ;

      if (e.target.classList.contains("fa-close")) {
        ;
        const transformSpac = document.querySelector('.fpd-tool-transform');
        let transformActive = transformSpac?.classList.contains('fpd-active');
        if (transformActive) {
          document.querySelector('.fpd-tool-transform')?.classList.remove('fpd-active');
        }
      }

      if (toolbar.classList.contains("fpd-show")) {
        const target = e.target.closest("[title], [data-panel]");
        ;
        if (!target) return;

        const value = target.getAttribute("title") || target.getAttribute("data-panel");
        ;
        if (!value) return;

        const newClass = "my-" + value.toLowerCase().replace(/\s+/g, '-');

        if (toolbar) {
          toolbar.classList.forEach((c: any) => {
            if (c.startsWith("my-")) toolbar.classList.remove(c);
          });
        }

        toolbar.classList.add(newClass);
      }
      else {
        toolbar.classList.forEach((c: any) => {
          if (c.startsWith("my-")) {
            ;
            toolbar.classList.remove(c);
          }
        });
      }

      ;
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
        const request = indexedDB.open("FPD_DB", 2);

        request.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains("products")) {
            db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
          }
          if (!db.objectStoreNames.contains("elements")) {
            db.createObjectStore("elements", { keyPath: "id", autoIncrement: true });
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

    async function saveToStore(storeName: string, data: any[]) {
      const db = await openDB();
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);

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

    async function getFromStore(storeName: string): Promise<any[]> {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }

    const saveProducts = (data: any[]) => saveToStore("products", data);
    const getProducts = () => getFromStore("products");
    const saveElements = (data: any[]) => saveToStore("elements", data);
    const getElements = () => getFromStore("elements");

    (window as any).getProducts = getProducts.bind(this);
    const storedFonts = localStorage.getItem('fontList');
    const fontData = storedFonts ? JSON.parse(storedFonts) : null;

    this.appOptions = {
      productsJSON: 'assets/data/products/product-categories.json',
      productsJSON1: 'assets/data/products/product-categories-new.json',
      // Points at the bundled local snapshot instead of the live API so the
      // Elements tab has something to render immediately on construction
      // (like productsJSON below). The real/fresh data is loaded from
      // IndexedDB cache (instant) and then the live API (background) right
      // after construction - see the designer.setupDesigns() calls below,
      // mirroring the products cache-then-refresh pattern.
      designsJSON: 'assets/data/designs/design-categories.json',
      langJSON: 'assets/data/langs/default.json',
      stageWidth: 2500,
      stageHeight: 700,
      initialActiveModule: 'products',
      editorMode: false,
      smartGuides: true,
      imageEditor: true,
      // Elements/Designs thumbnails load as plain <img> (no crossOrigin), so
      // the browser caches them as opaque. When the same URL is then loaded
      // onto the fabric canvas with crossOrigin:'anonymous', some browsers
      // serve that opaque cache entry and throw a CORS error even though the
      // server sends Access-Control-Allow-Origin fine. This appends a
      // cache-busting timestamp to the canvas load request so it bypasses
      // the stale non-CORS cache entry instead of colliding with it.
      imageLoadTimestamp: true,
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
        left: ['undo', 'redo', 'download', 'zoom', 'reset-product', 'preview-lightbox'],
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
      // Replaces the old third-party file.handler.php.stageprojects.xyz relay
      // with our own backend's S3 upload route (POST /api/image/upload,
      // multer-s3 -> styleflip-bucket, returns { image_src, filename }).
      // TODO: point this at the deployed backend URL before shipping - this
      // is the local dev server (node backend running on :4000) for now.
      fileServerURL: 'http://localhost:4000/api/image/upload',
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
    ;

    // Some product entries ship a locked background ("Base"/"Overlay") image
    // whose scaleX/scaleY was authored against a different reference size than
    // the stageWidth/stageHeight actually declared for that view (e.g. Toshiba's
    // "Lid" products: a 1560px-wide photo scaled for a 1000x1000 stage). That
    // makes the image wider/taller than the stage, so it bleeds off the left
    // and right edges instead of sitting inside the frame. Since these are
    // locked, non-interactive background layers, it's safe to shrink them to
    // fit inside the stage (preserving aspect ratio) and re-center them right
    // after they're added, without touching the product data itself.
    this.designer.addEventListener('elementAdd', (evt: any) => {
      const element = evt?.detail?.element;
      if (!element || element.type !== 'image') return;

      // Product mockups can have a "topped" (or upload-zone) layer meant to
      // always render above everything else (e.g. a laptop's keyboard/bezel
      // overlay, so an uploaded design reads as sitting under the glass
      // instead of pasted on top of it). The vendor canvas already re-asserts
      // that ordering via _bringToppedElementsToFront() on its own
      // 'object:added' fabric event, but for a freshly-uploaded image that
      // reorder wasn't taking effect until the user separately clicked/
      // selected the element (which happens to trigger the same reorder via
      // a different vendor code path). Call it again here, unconditionally,
      // so newly added images land in the correct stacking order immediately
      // rather than needing a click to "fix" it.
      const view = this.designer.currentViewInstance;
      if (view?.fabricCanvas?._bringToppedElementsToFront) {
        view.fabricCanvas._bringToppedElementsToFront();
        view.fabricCanvas.requestRenderAll();
      }

      if (!element.locked && !element.adminLocked) return;

      const stageWidth = view?.options?.stageWidth;
      const stageHeight = view?.options?.stageHeight;
      if (!stageWidth || !stageHeight) return;

      const boundsWidth = element.getScaledWidth();
      const boundsHeight = element.getScaledHeight();
      if (boundsWidth <= stageWidth && boundsHeight <= stageHeight) return;

      const fitScale = Math.min(
        stageWidth / boundsWidth,
        stageHeight / boundsHeight
      );

      element.set({
        scaleX: element.scaleX * fitScale,
        scaleY: element.scaleY * fitScale,
        left: stageWidth / 2,
        top: stageHeight / 2,
      });
      element.setCoords();
      view.fabricCanvas.requestRenderAll();
    });

    // Step 1: First load from IndexedDB (immediate display)
    ;
    const cachedProducts = await getProducts();

    if (cachedProducts && cachedProducts.length > 0) {
      ;
      this.designer.product = cachedProducts;
      this.showFPDLoading(false);
    } else {
      ;
      this.showFPDLoading(true);
    }

    // Step 2: Fetch fresh data from API (background update)
    ;
    fetch("https://styleflip-backend-jdm5.ithemes.xyz/api/product/getAllProducts")
      .then((res) => res.json())
      .then(async (freshData) => {
        ;

        // Update IndexedDB with fresh data
        await saveProducts(freshData);

        // Update designer with fresh data
        this.designer.product = freshData;
        ;

        this.showFPDLoading(false);

        // Optional: Show toast notification (uncomment if you have this method)
        // this.showToast("Products updated!");
      })
      .catch((err) => {
        console.error("❌ API fetch failed:", err);
        this.showFPDLoading(false);
      });

    // Elements tab (fpd-module-designs): same cache-first-then-refresh
    // treatment as products above. Without this, every visit re-downloads
    // and re-parses the full getAllElements payload before the Elements
    // grid can render anything, even though it rarely changes between visits.
    const cachedElements = await getElements();

    if (cachedElements && cachedElements.length > 0) {
      ;
      this.designer.setupDesigns(cachedElements);
    }

    fetch("https://styleflip-backend-jdm5.ithemes.xyz/api/element/getAllElements")
      .then((res) => res.json())
      .then(async (freshData) => {
        await saveElements(freshData);
        this.designer.setupDesigns(freshData);
        ;
      })
      .catch((err) => {
        console.error("❌ Elements API fetch failed:", err);
      });

    const slug = this.route.snapshot.paramMap.get('slug');
    const manufacturer = this.route.snapshot.paramMap.get('manufacturer');
    ;
    const currentUrl = this.router.url;

    if (currentUrl.includes('savedesign')) {
      this.showFPDLoading(true);
      this.route.queryParams.subscribe(params => {
        const id = params['design_id'];
        const title = params['title'];

        ;
        ;
        ;
        fetch(`https://styleflip-backend-jdm5.ithemes.xyz/api/sharedproduct/search?title=${encodeURIComponent(title)}&design_id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(response => response.json())
          .then(data => {
            ;
            let existing = localStorage.getItem('clothing-designer');
            let parsed = existing ? JSON.parse(existing) : [];

            if (parsed.length === 0) {
              parsed.push(data);
              localStorage.setItem('clothing-designer', JSON.stringify(parsed));
            }
            const designTitleData = localStorage.getItem('clothing-designer');
            ;
            let matchedDesign = null;
            if (designTitleData) {
              const parsedDesigns = JSON.parse(designTitleData);
              matchedDesign = parsedDesigns.find((i: any) => i.title === title);
            }

            if (matchedDesign) {
              setTimeout(() => {
                ;
                this.designer.currentViewInstance.fabricCanvas.clear();
                this.designer.loadProduct(matchedDesign.product)
                this.showFPDLoading(false);
                const gridContainer = document.querySelector('.fpd-saved-designs');
              }, 10000);
            } else {
              ;
            }
          });
      });
    }

    ;
    if (slug === null) {
      localStorage.setItem('selectedSlug', '');
    }
    else if (slug && slug !== 'undefined') {
      localStorage.setItem('selectedSlug', slug);
      localStorage.setItem('selectedManufacturer', manufacturer || 'apple');
    }
    else {
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

        ;

        // ✅ Call your function
        this.preview();

      },
      true // 🔥 capture phase (important)
    );

  }

  bottomMenu() {
    const sourceElement = document.getElementById('content-text');
    ;
    if (sourceElement) {
      const htmlContent = sourceElement.innerHTML;
      localStorage.setItem('savedContentText', htmlContent);
      localStorage.setItem('parentDivId', 'ProductModule');
      ;
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
    ;

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
    ;
    if (!parentDiv) return;

    const thumbnails = parentDiv.querySelectorAll('.fpd-grid .fpd-item.fpd-hover-thumbnail');
    ;

    thumbnails.forEach((thumb: Element) => {
      const labelEl = thumb.querySelector('.fpd-label');
      const title = labelEl?.getAttribute('title')?.toLowerCase()
        || labelEl?.textContent?.trim().toLowerCase()
        || '';
      ;
      const search = searchTerm.toLowerCase();

      const titleWords = title.split(' ');
      const matches = titleWords.some(word => word.startsWith(search));

      (thumb as HTMLElement).style.display = matches ? 'flex' : 'none';
    });
  }

  filterThumbnailsP(searchTerm: string) {
    ;

    if (searchTerm.length < 2) {
      const allThumbnails = document.querySelectorAll('.fpd-item.fpd-hover-thumbnail');
      ;
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

    ;

    let totalMatches = 0;
    let totalItems = 0;

    containers.forEach((container) => {
      const thumbnails = container.querySelectorAll('.fpd-item.fpd-hover-thumbnail');
      totalItems += thumbnails.length;

      thumbnails.forEach((thumb: Element) => {
        // 1. data-title attribute se text
        const dataTitle = thumb.getAttribute('data-title')?.toLowerCase() || '';

        // 2. .fpd-label div ke andar ka text bhi nikal lo
        const labelEl = thumb.querySelector('.fpd-label');
        const labelText = labelEl?.getAttribute('title')?.toLowerCase()
          || labelEl?.textContent?.trim().toLowerCase()
          || '';

        // Dono ko combine karke match karo
        const combinedTitle = `${dataTitle} ${labelText}`.trim();

        const matches = this.doesTitleMatchSearch(combinedTitle, search);

        if (matches) {
          totalMatches++;
          ;
        }

        (thumb as HTMLElement).style.display = matches ? 'flex' : 'none';
      });
    });

    ;

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
      ;
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
        closeButton.style.top = '90px';
        closeButton.style.right = '50px';
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
    ;

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
          ;
          const data = response?.data?.customerAccessTokenCreate;

          if (data?.customerAccessToken?.accessToken) {
            const token = data.customerAccessToken.accessToken;

            localStorage.setItem('customerToken', token);
            this.isLoggedIn = true;
            this.showLoginPopup = false;
            this.closeLoginPopup();

            ;
            this.getCustomerDetails(token);
          } else {
            const errorMsg =
              data?.customerUserErrors?.[0]?.message ||
              'Login failed. Invalid credentials.';
            alert(errorMsg);
          }
        },
        error: (err) => {
          ;
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
          ;
        },
        (err) => {
          console.error('Customer fetch failed', err);
        }
      );
  }

  updateTagsFromDesignModule() {
    const allTagsSetD = new Set();
    ;
    document.querySelectorAll('#DesignModule .fpd-item').forEach((product) => {
      ;
      const tags = product
        .getAttribute('data-tags')
        ?.split(',')
        .map((tag) => tag.trim());
      if (tags) tags.forEach((tag) => allTagsSetD.add(tag));
    });
    ;
    const parentDiv = document.querySelector('div[data-title="Productsnew"]');
    ;
    if (parentDiv) {
      // Each category selection called this function again to rebuild the tag
      // row, but only ever removed the inner #tag-wrapper-design-tags list —
      // the outer .fpd-designs-tags bar (which holds the left/right arrow
      // buttons) was left behind and a new one inserted alongside it. That
      // stacked one arrow bar per category click, pushing the skins grid
      // further down each time. Remove any previous bar(s) before building
      // the new one so only one ever exists.
      parentDiv
        .querySelectorAll('.fpd-designs-tags')
        .forEach((el) => el.remove());

      let currentOffset = 0;

      const tagWrapperMain = document.createElement('div');
      tagWrapperMain.className = 'relative w-full h-10 mt-2 overflow-hidden fpd-designs-tags';
      const tagWrapper = document.createElement('div');
      tagWrapper.className = 'flex absolute inset-0 items-center';
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

      tagWrapperMain.appendChild(tagWrapper);

      const leftArrow = document.createElement('button');
      leftArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m14.8 16.382-4.205-4.205a.25.25 0 0 1 0-.354L14.8 7.618a.75.75 0 0 0-1.06-1.06l-4.206 4.204a1.75 1.75 0 0 0 0 2.475l4.206 4.205a.75.75 0 0 0 1.06-1.06"></path>
        </svg>
        `;
      leftArrow.className =
        'absolute left-0 top-1/2 -translate-y-1/2 z-[9] bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden';
      leftArrow.disabled = true;

      const rightArrow = document.createElement('button');
      rightArrow.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path fill="currentColor" d="m9.216 7.619 4.204 4.204a.25.25 0 0 1 0 .354l-4.204 4.204a.75.75 0 0 0 1.06 1.061l4.205-4.204a1.75 1.75 0 0 0 0-2.475l-4.204-4.205a.75.75 0 0 0-1.061 1.06"></path>
        </svg>
        `;
      rightArrow.className =
        'absolute right-0 top-1/2 -translate-y-1/2 z-[9] bg-gradient-to-r from-white/0 to-white shadow p-0 rounded-full hover:bg-gray-100 disabled:hidden';

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

      const scrollArea = Array.from(parentDiv.children).find((el) =>
        el.classList.contains('fpd-scroll-area')
      );
      if (scrollArea) {
        parentDiv.insertBefore(tagWrapperMain, scrollArea);
      } else {
        parentDiv.appendChild(tagWrapperMain);
      }
    } else {
      console.warn('Div with data-title="Productsnew" not found.');
    }
  }

  groupSelectedObjects() {
    const canvas = this.designer?.currentViewInstance?.fabricCanvas;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    ;
    if (activeObject._objects.length > 1 && activeObject.type === 'activeSelection') {
      activeObject.toGroup();
      canvas.requestRenderAll();
    }
    else {
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
    ;
    this.closeBox();
  }

  dowloadButton() {
    this.closeFacebookOptions();
    ;
    this.designer.actionsBar.doAction('download');
  }

  printDesign() {
    ;
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
    ;
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

          ;

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

            const saveLoadModule = this.designer['moduleInstance_save-load'];
            if (saveLoadModule?.addSavedProduct) {
              saveLoadModule.addSavedProduct(savedItem);
            } else {
              this.loadSavedProducts();
            }
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
    ;
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
    ;
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
      ;

      const cartItem = {
        thumbnail: dataUrl,
        product,
        title,
      };

      var jsonString = JSON.stringify(cartItem);

      $.post('https://editor.styleflip.com/fpd/addtocart.php', {
        fpd_data: jsonString
      }, function (response) {
        ;
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
      ;
    } catch {
      savedList = [];
    }
    savedList.forEach((item) => this.addSavedProduct(item));
  }

  showSuccessMessage(message: string) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.top = '90px';
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
        ;
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

  ;
}