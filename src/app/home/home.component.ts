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
  // Whether the real product fetch (cache or fresh) has finished - gates
  // #fpd-loader-active-btn while step 2 is live so it can't be tapped
  // before there's actually something to show. See
  // updateProductsLoaderStep2State().
  private productsDataReady = false;
  private productsFinalWaitInterval: any;
  // Tracks which step's Continue button is currently live, since all 3
  // steps (and the final wait) now share one physical button element
  // (#fpd-loader-active-btn) instead of 3 separate buttons - see
  // setProductsLoaderStep().
  private currentProductsLoaderStep: 0 | 1 | 2 | 3 = 0;
  // Set true after the first Products-tab loader run completes in this app
  // session (in-memory only - resets on a real app relaunch, which is
  // exactly when the hang can recur). Gates the cosmetic 5s final wait in
  // finishProductsTabLoader() - see that method.
  private hasShownProductsLoaderFinalWait = false;
  // Set true after the first tap-loader run FINISHES (not just starts) in
  // this app session, on WHICHEVER bottom-nav tab (Products/Designs/
  // Elements/Add Text) the user happens to open first - see
  // finishProductsTabLoader() and the nav-item click listener in ngOnInit.
  // The iOS hang this works around isn't Products-specific, so the
  // mandatory 3-tap sequence is tied to "first tab opened this session",
  // not "first Products-tab open" specifically. Once true: Products always
  // falls back to the abbreviated single-tap version (even on its own
  // first visit, if some other tab already consumed the full sequence),
  // and Elements/Designs/Add Text show nothing more at all - only Products
  // keeps a lightweight repeat-visit touch. In-memory only - resets on a
  // real app relaunch, same as hasShownProductsLoaderFinalWait.
  private hasShownFirstEditorTabLoader = false;
  // Set by openTitlePopup() when it defers itself behind the first-session
  // loader (Save Design isn't a .fpd-nav-item, so it can't go through the
  // nav-click listener like the other 6 tabs - see openTitlePopup()).
  // Invoked - and always cleared - in stopProductsTabLoader(); only
  // actually invoked if hasShownFirstEditorTabLoader is true by then
  // (i.e. the loader that's stopping is a genuine completion via
  // finishProductsTabLoader, not the user abandoning it by switching
  // tabs mid-sequence - in that case this still gets cleared so a LATER,
  // unrelated tab's loader completion can't wrongly reopen the popup).
  private pendingLoaderCompletionCallback: (() => void) | null = null;
  // Whether the loader run currently in progress is the abbreviated
  // single-tap version (2nd+ Products-tab open this session) or the full
  // first-time 3-step version. Set in startProductsTabLoader(), read by the
  // #fpd-loader-active-btn click handler to decide whether a tap should
  // advance to step 2/3 or finish immediately.
  private isAbbreviatedProductsLoader = false;
  // Set by openSaveConfirmPopup()'s guard right before it triggers this
  // loader as the very first session action (Save tapped before any real
  // .fpd-nav-item tab was ever opened). The #fpd-loader-active-btn handler
  // below normally calls selectProductsCategory() on each tap so every tap
  // visibly does something for a genuine Products-tab open - but that has a
  // real side effect (opens the vendor's Products panel, at its
  // z-index:2147483647), which would then bury #save-confirm-popup/
  // #title-popup (z-index:99999) once the loader finishes, since no
  // .fpd-nav-item tab is actually meant to be open in this flow. Checked at
  // each tap to skip just that side effect while everything else about the
  // loader (three genuine physical taps, same UI) stays identical - cleared
  // in finishProductsTabLoader() once this loader run is done.
  private suppressLoaderCategorySelect = false;
  // Reset to false each time openTitlePopup() opens #title-popup, flipped to
  // true the first time #design-title-input gains focus - gates the 5s
  // "preparing your design" loader (#title-popup-loader) shown over the
  // whole popup box to a single trigger per popup-open, not once per click
  // while the user is already typing.
  private titlePopupLoaderShown = false;
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
    
    if (window.location.href.includes('http://localhost:4200/apple/macbook-13-inch-non-unibody-2006-2009')) {
      
      window.location.href = this.targetBackUrl;
    } else {
     
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

    // Products/Designs/Elements grid items (.fpd-item) each carry a
    // .fpd-dot-menu / .fpd-three-dot-menu that's only meant to appear once
    // the item's been tapped (see the .fpd-dot-menu-tapped rules in
    // styles.scss) rather than permanently, or via CSS :hover — hover-only
    // reveals are what caused the iOS "first tap resolves hover, second
    // tap actually clicks" bug on these grids in the first place. Toggling
    // a class here on tap keeps the menu hidden by default without
    // reintroducing that hover dependency.
    document.addEventListener('click', (e: any) => {
      const item = e.target?.closest?.('.fpd-item');
      // Clear sticky taps on siblings so only the current item shows ⋯
      document.querySelectorAll('.fpd-item.fpd-dot-menu-tapped').forEach((el) => {
        if (el !== item) el.classList.remove('fpd-dot-menu-tapped');
      });
      if (item?.querySelector(':scope > .fpd-dot-menu, :scope > .fpd-three-dot-menu, :scope > .fpd-elements-dot-menu')) {
        item.classList.add('fpd-dot-menu-tapped');
      }
    });

    // Mobile bottom nav (.fpd-nav-item, one per mainBarModules entry -
    // Products/Designs/Elements/Add Text/Image) is rebuilt by the vendor
    // library itself, so this is delegated on document rather than bound
    // once. Tapping Products shows the 3-step tap loader; tapping any other
    // tab (or Products again, restarting the window) always clears it first
    // so it can never outlive the tab it was shown for.
    //
    // Capture phase is required here: the vendor's own nav-item handler
    // (wr() in FancyProductDesigner.js) calls event.stopPropagation() as
    // its very first line, so a normal bubble-phase document listener
    // never sees this click at all - capture runs top-down before that
    // handler gets a chance to stop it.
    // Which bottom-nav tabs count as "an editor tab was opened" for the
    // mandatory first-session tap loader - every tab except Products,
    // which is handled separately below since it always runs the loader
    // (full or abbreviated), never skipped outright.
    const firstLoaderModules = ['productsnew', 'designs', 'text', 'images', 'manage-layers', 'save-load'];

    document.addEventListener('click', (e: any) => {
      const navItem = e.target?.closest?.('.fpd-nav-item[data-module]');
      if (!navItem) return;
      // wr() (same vendor file) treats a tap on an already-active nav item
      // as "close this panel", not "reopen it" - only an inactive ->
      // active transition is a genuine tab switch worth loading for.
      const isAlreadyActive = navItem.classList.contains('fpd-active');
      const module = navItem.dataset.module;

      // Reload the Images tab's Uploads grid from the backend every single
      // time it's opened (not just once per session like the tap-loader
      // above) - independent of the loader branching below, since this
      // should fire on every inactive -> active transition to Images
      // regardless of which loader branch (if any) also runs.
      // fpdReloadUploadedImages is the vendor's loadItems() exposed onto
      // window (see FancyProductDesigner.js ~line 21453) specifically so
      // it's callable from here; `true` bypasses its normal
      // once-per-session gate.
      if (!isAlreadyActive && module === 'images') {
        (window as any).fpdReloadUploadedImages?.(true);
      }

      if (isAlreadyActive) {
        this.stopProductsTabLoader();
      } else if (module === 'products') {
        // Always runs - full sequence the very first time this session
        // (on any tab), abbreviated single-tap every time after - see
        // startProductsTabLoader().
        this.startProductsTabLoader();
      } else if (!this.hasShownFirstEditorTabLoader && firstLoaderModules.includes(module)) {
        // Some other tab (Designs/Elements/Add Text/Image) is the very
        // first tab opened this session - run the same mandatory first-time loader
        // here instead, since the hang this works around isn't specific
        // to Products. Reuses startProductsTabLoader() as-is: the DOM
        // relocation/sizing is module-agnostic (see showFPDLoading /
        // recalculateLoaderHeight), and selectProductsCategory() calls
        // inside the tap handler just no-op harmlessly here since this
        // tab has no .fpd-product-categories dropdown - only the "real
        // tap" itself, not the category filter, was ever confirmed to
        // matter for the hang.
        this.startProductsTabLoader();
      } else {
        this.stopProductsTabLoader();
      }
    }, true);

    // The loader's 3-step tap sequence (see startProductsTabLoader) - each
    // button needs exactly one real physical tap, since that's the only
    // thing confirmed to fix [[ios_early_interaction_hang]]. No timers
    // involved, so there's nothing for these taps to fall out of sync with.
    // Each tap also applies a real category filter (selectProductsCategory)
    // so the tap isn't just a blank "continue" - the user sees the grid
    // actually filter/update as visible feedback for each of the 3 taps.
    // The category selection itself is still done via the same synthetic
    // dispatchEvent() technique as before (confirmed NOT to fix the hang on
    // its own) - what makes these taps count is that they're riding on a
    // genuine touch/click on our own button, not a synthetic click with no
    // real tap behind it at all.
    document.addEventListener('click', (e: any) => {
      // Continue and Skip (#fpd-loader-skip-btn, added 2026-08-24 per
      // client request - "dono button pe same kaam hona chahiye category
      // filter wala") both advance the loader identically - the real-tap
      // hang mitigation this loader exists for only cares that SOME real
      // button got tapped, not which one.
      if (!e.target?.closest?.('#fpd-loader-active-btn, #fpd-loader-skip-btn')) return;
      // 2nd+ open this session: one real tap + one category filter is
      // enough (see isAbbreviatedProductsLoader) - finish immediately
      // instead of advancing through step 2/3.
      if (this.isAbbreviatedProductsLoader) {
        if (!this.suppressLoaderCategorySelect) this.selectProductsCategory(1);
        this.finishProductsTabLoader();
        return;
      }
      // Index 0 is whatever category the dropdown already defaults to, so
      // selecting it produces no visible change - start from index 1 so
      // every one of these taps actually filters to something different.
      if (this.currentProductsLoaderStep === 1) {
        if (!this.suppressLoaderCategorySelect) this.selectProductsCategory(1);
        this.setProductsLoaderStep(2);
      } else if (this.currentProductsLoaderStep === 2) {
        // Native <button disabled> already refuses to dispatch click at
        // all, but guard here too in case that ever changes.
        if (!this.productsDataReady) return;
        if (!this.suppressLoaderCategorySelect) this.selectProductsCategory(2);
        this.setProductsLoaderStep(3);
      } else if (this.currentProductsLoaderStep === 3) {
        if (!this.suppressLoaderCategorySelect) this.selectProductsCategory(3);
        this.finishProductsTabLoader();
      }
    });

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

          // The mobile bottom-sheet nav bar (fpd-main-bar) renders at
          // z-index:999999999999 in the vendor CSS - our own loader
          // overlay can never out-z-index that from outside it (a past
          // attempt to raise the loader's z-index above the vendor's
          // draggable-dialog caused the editor to freeze/stop responding
          // to touch on real iPhones, see the revert note in styles.scss).
          // Moving the loader to live *inside* .fpd-module-content instead
          // sidesteps the whole z-index race: it just paints on top of
          // whichever module panel (Products/Designs/etc.) is currently
          // shown, and disappears with it the moment the panel itself is
          // hidden or closed, so it can never get stranded over the editor.
          const moduleContent = mainBar.querySelector(
            '.fpd-module-content'
          ) as HTMLElement;
          const loader = document.getElementById('fpd-loader');
          if (moduleContent && loader && loader.parentElement !== moduleContent) {
            moduleContent.style.position = 'relative';
            moduleContent.appendChild(loader);
          }

          // The category dropdown (.fpd-product-categories, "searchable")
          // is a real <input>, so tapping it to open the list also focuses
          // a text field and pops the on-screen keyboard on mobile - not
          // wanted here, the dropdown is only ever used to pick an item,
          // never to type. readonly stops the keyboard without blocking
          // focus/click, so the dropdown itself still opens normally.
          // Applied on mobile only, and re-applied via observer since
          // Products/Designs each have their own dropdown instance and not
          // all of them necessarily exist yet at this point.
          const applyCategoryInputReadonly = () => {
            if (window.innerWidth > 768) return;
            mainBar
              .querySelectorAll('.fpd-product-categories .fpd-dropdown-current')
              .forEach((el) => {
                const input = el as HTMLInputElement;
                if (!input.readOnly) input.readOnly = true;
              });
          };
          applyCategoryInputReadonly();
          const categoryInputObserver = new MutationObserver(applyCategoryInputReadonly);
          categoryInputObserver.observe(mainBar, { childList: true, subtree: true });

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
          // A single render pass (e.g. a grid populating with many items)
          // batches many childList mutations into one callback invocation.
          // Calling the full re-scan once per mutation record here (instead
          // of once per invocation) turned every batch of N DOM insertions
          // into N full .fpd-item re-scans — an O(n^2) cost that was cheap
          // enough to hide on the simulator's desktop CPU but heavy enough
          // to freeze/hang real devices while grids were populating.
          const hasChildListChange = mutations.some((mutation) => mutation.type === 'childList');
          if (hasChildListChange) {
            checkAndHideDuplicateFpdItems();
          }
        });

        innerHtmlObserver.observe(productModule, {
          childList: true,
          subtree: true,
        });

        checkAndHideDuplicateFpdItems();
      }

      this.moveBoldToPrimaryTools()
      this.mergeTextFormatIntoSecondaryTools()
      this.bindAddTextEditorActions()
      // Desktop Add Text only — separate file/classes; does not alter mobile ate
      this.bindDesktopAddTextEditorActions()
      this.applyDesktopAddTextEditorClasses()
      this.fixRotateAroundCenter()
      this.applyDocOptInToolbarClasses()
      // Re-stamp after FPD finishes layout-small / toolbar rebuilds
      setTimeout(() => this.applyDocOptInToolbarClasses(), 1000)
      setTimeout(() => this.applyDocOptInToolbarClasses(), 2500)
      setTimeout(() => this.applyDesktopAddTextEditorClasses(), 1000)
      setTimeout(() => this.applyDesktopAddTextEditorClasses(), 2500)
    }, 3000);
    createIcons({ icons });

    setTimeout(() => {

      const btnOpacity = document.getElementById('fpd-opacity-btn');
      const targetSection = document.querySelector('fpd-element-toolbar .fpd-sub-panel') as HTMLElement;
      const panel = document.getElementById('fpd-opacity-panel');
      const sliderOpacity = document.getElementById('fpd-opacity-range') as HTMLInputElement;
      const opacityToolbarEl = btnOpacity?.closest('fpd-element-toolbar') as HTMLElement | null;
      ;
      if (!btnOpacity || !panel || !sliderOpacity) return;

      // Text elements show the opacity icon inline with Bold/Italic/Underline/
      // Align (that row's own tools-group) instead of its own standalone row
      // above the toolbar, which is still used for image/shape elements. Move
      // the button node itself between the two homes whenever the selected
      // element type flips; the panel stays where it is since it always opens
      // as a full-width bottom sheet regardless of where its trigger button
      // lives (see the .fpd-opacity-open rules in styles.scss).
      const opacityOriginalParent = btnOpacity.parentElement;
      const textFormatGroup = document.getElementById('CenterTools')?.parentElement as HTMLElement | null;
      const primaryTools = opacityToolbarEl?.querySelector('.fpd-primary-tools') as HTMLElement | null;
      const colorTool = primaryTools?.querySelector('.fpd-tool-color') as HTMLElement | null;
      const isMobileLayout = () => window.matchMedia('(max-width: 768px)').matches;

      // On mobile, the button moves up into the font family/size/color row
      // (between the size stepper and the color swatch) instead of tagging
      // along at the end of the Bold/Italic/Underline/Align row — client
      // wanted it grouped with the other quick controls up top. Desktop
      // keeps the original tools-group placement untouched.
      const placeOpacityButton = () => {
        const elementType = opacityToolbarEl?.getAttribute('data-element-type');
        if (elementType === 'text' && isMobileLayout() && primaryTools && colorTool) {
          if (btnOpacity.nextElementSibling !== colorTool || btnOpacity.parentElement !== primaryTools) {
            primaryTools.insertBefore(btnOpacity, colorTool);
          }
        } else if (elementType === 'text' && textFormatGroup) {
          if (btnOpacity.parentElement !== textFormatGroup) {
            textFormatGroup.appendChild(btnOpacity);
          }
        } else if (opacityOriginalParent && btnOpacity.parentElement !== opacityOriginalParent) {
          opacityOriginalParent.insertBefore(btnOpacity, panel);
        }
      };

      placeOpacityButton();

      if (opacityToolbarEl) {
        new MutationObserver(placeOpacityButton).observe(opacityToolbarEl, {
          attributes: true,
          attributeFilter: ['data-element-type'],
        });
      }

      window.addEventListener('resize', placeOpacityButton);

      // On mobile, the panel is shown as a bottom-sheet in place of the
      // toolbar's icon row (see the .fpd-opacity-open rules in
      // styles.scss), same as every other tool panel. Desktop keeps the
      // panel's original floating-card display toggle.
      const closeOpacityPanel = () => {
        panel.style.display = 'none';
        btnOpacity.classList.remove('fpd-active');
        opacityToolbarEl?.classList.remove(
          'fpd-opacity-open',
          'fpd-doc-opacity-dock',
          'fpd-dee-opacity-open'
        );
      };

      // The chevron/down-arrow above the toolbar (vendor's `.fpd-close`)
      // normally collapses the whole element toolbar and deselects the
      // element (see the `G(... '.fpd-close' ...)` handler in
      // FancyProductDesigner.js) - every other tool panel avoids this by
      // swapping in `.fpd-close-sub-panel` while open, but the Opacity
      // flyout uses its own `fpd-opacity-open` class instead and never
      // makes that swap, so the chevron stayed wired to the whole-toolbar
      // close. Capture phase intercepts the click before the vendor's own
      // listener runs, same technique as the Products-tab loader's
      // capture-phase delegation (needed there because a vendor handler
      // calls stopPropagation() first - same precaution here).
      document.addEventListener(
        'click',
        (e: any) => {
          if (!opacityToolbarEl?.classList.contains('fpd-opacity-open')) return;
          if (!e.target?.closest?.('.fpd-close')) return;
          e.stopPropagation();
          e.preventDefault();
          closeOpacityPanel();
        },
        true
      );

      // Same control stack as Color > Fill opacity:
      //   .fpd-input > fpd-range-slider.fpd-progress + .fpd-slider-number
      let docRangeSlider: HTMLElement | null = null;
      let docRangeInput: HTMLInputElement | null = null;
      let docNumberInput: HTMLInputElement | null = null;

      const syncLegacyRange = (value: number) => {
        sliderOpacity.value = value.toFixed(2);
        const percent = (value / parseFloat(sliderOpacity.max || '1')) * 100;
        sliderOpacity.style.setProperty('--progress', percent + '%');
      };

      const syncDocSliderUi = (value: number) => {
        const v = value.toFixed(2);
        if (docRangeSlider) {
          docRangeSlider.setAttribute('value', v);
        }
        if (docRangeInput) {
          docRangeInput.value = v;
          docRangeInput.style.setProperty('--value', v);
          docRangeInput.style.setProperty('--min', '0');
          docRangeInput.style.setProperty('--max', '1');
        }
        if (docNumberInput) {
          docNumberInput.value = v;
        }
      };

      function updateSliderProgress() {
        const value = parseFloat(sliderOpacity.value);
        syncLegacyRange(value);
        syncDocSliderUi(value);
      }

      const setOpacityValue = (value: number, applyToObject = true) => {
        value = Math.min(1, Math.max(0, value));
        syncLegacyRange(value);
        syncDocSliderUi(value);
        // Desktop Element Editor sheet (fpd-dee-*) — sync only, no CSS edits
        const deeSync = (panel as any)._fpdDeeSyncOpacity as
          | ((v: number) => void)
          | undefined;
        deeSync?.(value);
        if (!applyToObject) return;
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const obj = canvas.getActiveObject();
        if (!obj) return;
        obj.set('opacity', value);
        canvas.requestRenderAll();
        canvas.fire('object:modified', { target: obj });
      };

      // Mobile-only: bottom sheet title + Color-identical slider/number row.
      // Reuses fpd-range-slider / fpd-slider-number so the thumb/track match
      // Color (and Transform) instead of the custom padded #fpd-opacity-range.
      if (window.matchMedia('(max-width: 768px)').matches) {
        panel.classList.add('fpd-doc-opacity-sheet');
        btnOpacity.classList.add('fpd-doc-labeled-opacity', 'fpd-doc-uniform-tool');
        if (!btnOpacity.querySelector('.fpd-doc-opacity-label')) {
          const lab = document.createElement('span');
          lab.className = 'fpd-doc-opacity-label';
          lab.textContent = 'Opacity';
          btnOpacity.appendChild(lab);
        } else {
          const lab = btnOpacity.querySelector(
            '.fpd-doc-opacity-label'
          ) as HTMLElement;
          lab.textContent = 'Opacity';
          btnOpacity.appendChild(lab);
        }

        // Drop the old custom +/- stepper if a prior session injected it
        panel.querySelector('.fpd-opacity-stepper-row')?.remove();

        let existingLabel = panel.querySelector(
          ':scope > span.fpd-label, .fpd-opacity-title-row > span.fpd-label'
        ) as HTMLElement | null;
        if (existingLabel) {
          existingLabel.classList.add('fpd-opacity-panel-title');
          existingLabel.textContent = 'Opacity';
          existingLabel.setAttribute('data-defaulttext', 'Opacity');
          if (!existingLabel.closest('.fpd-opacity-title-row')) {
            const titleRow = document.createElement('div');
            titleRow.className = 'fpd-opacity-title-row';
            panel.insertBefore(titleRow, existingLabel);
            titleRow.appendChild(existingLabel);
          }
        }

        let control = panel.querySelector(
          '.fpd-doc-opacity-control'
        ) as HTMLElement | null;
        if (!control) {
          control = document.createElement('div');
          // Same layout primitives as Color > Fill opacity (.fpd-input +
          // fpd-range-slider + .fpd-slider-number). Do NOT add
          // .fpd-tool-fill-opacity — mobile text rules hide that class
          // when it is not #fpd-opacity-panel itself.
          control.className = 'fpd-doc-opacity-control fpd-input';

          const fieldLabel = document.createElement('span');
          fieldLabel.className = 'fpd-label';
          fieldLabel.textContent = 'Opacity';
          fieldLabel.setAttribute('data-defaulttext', 'Opacity');

          const rangeSlider = document.createElement('fpd-range-slider');
          rangeSlider.className = 'fpd-progress';
          rangeSlider.id = 'fpd-doc-opacity-slider';
          rangeSlider.setAttribute('value', sliderOpacity.value || '1');
          rangeSlider.setAttribute('min', '0');
          rangeSlider.setAttribute('max', '1');
          rangeSlider.setAttribute('step', '0.01');

          const numberInput = document.createElement('input');
          numberInput.className = 'fpd-slider-number fpd-number';
          numberInput.type = 'number';
          numberInput.id = 'fpd-opacity-value';
          numberInput.min = '0';
          numberInput.max = '1';
          numberInput.step = '0.01';
          numberInput.value = sliderOpacity.value || '1';

          control.append(fieldLabel, rangeSlider, numberInput);
          panel.appendChild(control);
        }

        docRangeSlider = panel.querySelector(
          '#fpd-doc-opacity-slider'
        ) as HTMLElement | null;
        docNumberInput = panel.querySelector(
          '#fpd-opacity-value'
        ) as HTMLInputElement | null;

        // Hide the legacy raw range — Color uses fpd-range-slider instead
        sliderOpacity.classList.add('fpd-doc-opacity-range-legacy');
        sliderOpacity.setAttribute('aria-hidden', 'true');

        const bindDocSlider = () => {
          docRangeInput =
            (docRangeSlider?.querySelector(
              'input[type="range"]'
            ) as HTMLInputElement | null) || null;
          if (!docRangeInput || (docRangeInput as any)._fpdDocBound) return;
          (docRangeInput as any)._fpdDocBound = true;
          docRangeInput.addEventListener('input', () => {
            setOpacityValue(parseFloat(docRangeInput!.value));
          });
        };
        bindDocSlider();
        // Custom element may append its <input> after connectedCallback
        setTimeout(bindDocSlider, 0);
        setTimeout(bindDocSlider, 100);

        docNumberInput?.addEventListener('change', () => {
          setOpacityValue(parseFloat(docNumberInput!.value || '0'));
        });
        docNumberInput?.addEventListener('input', () => {
          const n = parseFloat(docNumberInput!.value);
          if (Number.isFinite(n)) {
            setOpacityValue(n);
          }
        });
      } else {
        // Desktop Element Editor — same mobile opacity look via fpd-dee-*
        // (separate from mobile fpd-doc-* and Add Text fpd-dte-*).
        this.ensureDesktopElementOpacitySheet(panel, setOpacityValue);
      }

      btnOpacity.addEventListener('click', (e) => {
        // Stop the document-level outside-click closer from treating this
        // same tap as an outside click (can close the sheet immediately).
        e.stopPropagation();
        // Add Text mobile: capture handler in bindAddTextEditorActions owns
        // the toggle — skip here so we don't open-then-immediately-close.
        if (
          opacityToolbarEl?.classList.contains('fpd-ate-editor') &&
          opacityToolbarEl?.classList.contains('fpd-layout-small')
        ) {
          return;
        }
        // Add Text desktop: bindDesktopAddTextEditorActions owns the toggle.
        if (
          opacityToolbarEl?.classList.contains('fpd-dte-editor') &&
          opacityToolbarEl?.classList.contains('fpd-layout-large')
        ) {
          return;
        }
        if (targetSection) {
          const activeElem = targetSection.querySelector('.fpd-active');

          if (activeElem) {
            activeElem.classList.remove('fpd-active');
          }
        }
        const willOpen =
          !opacityToolbarEl?.classList.contains('fpd-opacity-open') &&
          panel.style.display !== 'block';
        if (willOpen) {
          if (!isMobileLayout()) {
            this.ensureDesktopElementOpacitySheet(panel, setOpacityValue);
          }
          panel.style.display = 'block';
          btnOpacity.classList.add('fpd-active');
          opacityToolbarEl?.classList.add(
            'fpd-opacity-open',
            'fpd-doc-opacity-dock',
            'fpd-dee-opacity-open',
            'fpd-show'
          );
        } else {
          closeOpacityPanel();
        }
        const canvas = this.designer.currentViewInstance.fabricCanvas;
        const obj = canvas.getActiveObject();

        if (obj) {
          setOpacityValue(obj.opacity ?? 1, false);
        }
      });
      sliderOpacity.addEventListener('input', () => {
        setOpacityValue(parseFloat(sliderOpacity.value));
      });

      document.addEventListener('click', (e: any) => {
        if (!opacityToolbarEl?.classList.contains('fpd-opacity-open')) return;
        if (panel.contains(e.target) || btnOpacity.contains(e.target)) return;
        closeOpacityPanel();
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
        event.stopPropagation();
        const obj =
          this.designer.currentViewInstance.fabricCanvas.getActiveObject();
        if (!obj) return;
        const weight = String(obj.fontWeight || 'normal').toLowerCase();
        const next =
          weight === 'bold' || weight === '700' ? 'normal' : 'bold';
        this.designer.currentViewInstance.fabricCanvas.setElementOptions({
          fontWeight: next,
        });
        targetElement.classList.toggle('active', next === 'bold');
      });
    }

    const targetElement2 = document.getElementById('fontItalic');
    if (targetElement2) {
      targetElement2.addEventListener('click', (event) => {
        event.stopPropagation();
        const obj =
          this.designer.currentViewInstance.fabricCanvas.getActiveObject();
        if (!obj) return;
        const next = obj.fontStyle === 'italic' ? 'normal' : 'italic';
        this.designer.currentViewInstance.fabricCanvas.setElementOptions({
          fontStyle: next,
        });
        targetElement2.classList.toggle('active', next === 'italic');
      });
    }

    const targetElement3 = document.getElementById('UnderlineText');
    if (targetElement3) {
      targetElement3.addEventListener('click', (event) => {
        event.stopPropagation();
        // Fabric text uses boolean `underline`, not CSS `textDecoration`.
        const obj =
          this.designer.currentViewInstance.fabricCanvas.getActiveObject();
        if (!obj) return;
        const next = !obj.underline;
        this.designer.currentViewInstance.fabricCanvas.setElementOptions({
          underline: next,
        });
        targetElement3.classList.toggle('active', next);
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
        // Add Text mobile: capture handler opens the align sheet instead
        // of cycling left→center→right on each tap.
        const tb = alignButton.closest('fpd-element-toolbar');
        if (
          tb?.classList.contains('fpd-ate-editor') &&
          tb?.classList.contains('fpd-layout-small')
        ) {
          return;
        }

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
            // classList is a live collection — removing an item mid-forEach
            // shifts the remaining indices and silently skips the next
            // one (same bug already fixed for the other toolbar class-
            // sync handler below). Snapshot first so every "my-*" class
            // actually gets cleared.
            const staleMyClasses = Array.from(toolbar.classList as DOMTokenList).filter((c: any) => (c as string).startsWith('my-'));
            if (staleMyClasses.length) {
              toolbar.classList.remove(...staleMyClasses);
            }
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

          // The vendor toolbar hides the Align/Arrange tab spans (and the
          // tab header itself) between renders and only re-shows them from
          // its own selection-render pass. Since we're opening this panel
          // directly instead of going through that pass, force both tabs
          // (and their header) visible here too, otherwise Arrange can be
          // stuck hidden from a previous render.
          positionPanel.querySelectorAll('.fpd-panel-tabs, .fpd-panel-tabs [data-tab]').forEach(el => {
            el.classList.remove('fpd-hidden');
          });

          if (!positionPanel.querySelector('.fpd-panel-tabs [data-tab].fpd-active')) {
            (positionPanel.querySelector('.fpd-panel-tabs [data-tab]') as HTMLElement | null)?.click();
          }
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
      if (!obj) return;

      // Same path as Arrange layer-up — setElementOptions clamps vs Overlay.
      const nextZ = (obj.getZIndex?.() ?? canvas.getObjects().indexOf(obj)) + 1;
      const overlayObj = canvas.getObjects().find((o: any) => o.title === 'Overlay');
      if (overlayObj) {
        const overlayZ = overlayObj.getZIndex?.() ?? canvas.getObjects().indexOf(overlayObj);
        if (nextZ >= overlayZ) {
          this.showToast('Not possible to move above Overlay layer!');
          return;
        }
      }
      canvas.setElementOptions({ z: nextZ }, obj);
      moveLayerRowUp(obj.id);
      obj.setCoords();
      canvas.fire('object:modified', { target: obj });
      canvas.fire('elementModify', { element: obj, options: {} });
      canvas.requestRenderAll();
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

      // Same path as Arrange layer-down — setElementOptions clamps vs Base.
      const nextZ = (obj.getZIndex?.() ?? canvas.getObjects().indexOf(obj)) - 1;
      const baseObj = canvas.getObjects().find((o: any) => o.title === 'Base');
      if (baseObj) {
        const baseZ = baseObj.getZIndex?.() ?? canvas.getObjects().indexOf(baseObj);
        if (nextZ <= baseZ) {
          this.showToast('Reached just above base, not moving further down.');
          return;
        }
      }
      canvas.setElementOptions({ z: Math.max(0, nextZ) }, obj);
      moveLayerRowDown(obj.id);
      canvas.requestRenderAll();
    });

    const minusEl = document.getElementById('minusElement');
    const plusEl = document.getElementById('plusElement');

    if (minusEl) {
      minusEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const inputEl = document.querySelector('input[data-control="fontSize"]') as HTMLInputElement;
        if (inputEl) {
          let current = parseInt(inputEl.value) || 1;
          current = Math.max(1, current - 1);
          inputEl.value = String(current);
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));

          this.designer.currentViewInstance.fabricCanvas.setElementOptions({
            fontSize: current,
          });
        }
      });
    }

    if (plusEl) {
      plusEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const inputEl = document.querySelector('input[data-control="fontSize"]') as HTMLInputElement;
        if (inputEl) {
          let current = parseInt(inputEl.value) || 1;
          current = Math.min(200, current + 1);
          inputEl.value = String(current);
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));

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

      fetch(`/api/sharedproduct/search?title=${encodeURIComponent(dataTitle)}&design_id=${encodeURIComponent(matchedData[0]?.design_id ?? '')}`, {
        method: 'GET'
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
      const toolbar = e.target.closest("fpd-element-toolbar");
      if (!toolbar) return;

      if (e.target.classList.contains("fa-close")) {
        document.querySelector('.fpd-tool-transform.fpd-active')?.classList.remove('fpd-active');
      }

      // classList is a live collection — removing an item mid-forEach
      // shifts the remaining indices and silently skips the next one, so
      // a toolbar that picked up more than one stale "my-*" class in the
      // same tap only ever got the first removed. Snapshot to a plain
      // array first so every match actually gets cleared, instead of
      // "my-*" classes slowly accumulating on the toolbar over a session.
      const staleMyClasses = Array.from(toolbar.classList as DOMTokenList).filter((c: any) => (c as string).startsWith('my-'));
      if (staleMyClasses.length) {
        toolbar.classList.remove(...staleMyClasses);
      }

      if (toolbar.classList.contains("fpd-show")) {
        const target = e.target.closest("[title], [data-panel]");
        if (!target) return;

        const value = target.getAttribute("title") || target.getAttribute("data-panel");
        if (!value) return;

        toolbar.classList.add("my-" + value.toLowerCase().replace(/\s+/g, '-'));
      }

      const staleTypeClasses = Array.from(document.body.classList as DOMTokenList).filter((c: any) => (c as string).startsWith('fpd-type-'));
      if (staleTypeClasses.length) {
        document.body.classList.remove(...staleTypeClasses);
      }

      const typeClass = toolbar.className
        .split(' ')
        .find((cls: string) => cls.startsWith('fpd-type-'));

      if (typeClass) {
        document.body.classList.add(typeClass);
      }
    });
  }

  // Mobile "Add Text" toolbar had two separate icon rows stacked above each
  // other: the Bold/Italic/Underline/Align group, then the crop/rotate/
  // layer/duplicate group below it (the one with a working horizontal
  // slider). Client wants both merged into that one slider instead of two
  // stacked rows. Moving the actual icon nodes (not cloning) keeps their
  // already-bound click listeners working — CSS alone can't do this since
  // the two rows are separate sibling containers, not nested. Only affects
  // mobile layout; on a wider viewport the icons move back to their
  // original row so desktop is untouched.
  mergeTextFormatIntoSecondaryTools(): void {
    const textFormatGroup = document.getElementById('CenterTools')?.parentElement as HTMLElement | null;
    const originalPanel = textFormatGroup?.closest('.fpd-panel-text-format') as HTMLElement | null;
    const secondaryTools = document.getElementById('SecondaryIconBoxHeader') as HTMLElement | null;

    if (!textFormatGroup || !originalPanel || !secondaryTools) return;

    const icons = Array.from(textFormatGroup.children) as HTMLElement[];
    if (!icons.length) return;

    const isMobileLayout = () => window.matchMedia('(max-width: 768px)').matches;
    const isTextElementSelected = () => {
      const toolbar = document.querySelector('fpd-element-toolbar') as HTMLElement | null;
      return toolbar?.getAttribute('data-element-type') === 'text';
    };

    const placeTextFormatIcons = () => {
      // Text-only controls must not appear for image/group on mobile.
      if (isMobileLayout() && isTextElementSelected()) {
        if (icons[0].parentElement !== secondaryTools) {
          const insertionPoint = secondaryTools.firstElementChild;
          icons.forEach((icon) => secondaryTools.insertBefore(icon, insertionPoint));
          originalPanel.style.display = 'none';
        }
        icons.forEach((icon) => { icon.style.display = ''; });
      } else {
        if (icons[0].parentElement !== textFormatGroup) {
          icons.forEach((icon) => textFormatGroup.appendChild(icon));
        }
        originalPanel.style.display = isMobileLayout() ? 'none' : '';
        if (isMobileLayout() && !isTextElementSelected()) {
          icons.forEach((icon) => { icon.style.display = 'none'; });
        } else {
          icons.forEach((icon) => { icon.style.display = ''; });
        }
      }
    };

    placeTextFormatIcons();
    window.addEventListener('resize', () => {
      placeTextFormatIcons();
      this.applyDocOptInToolbarClasses();
    });
    const toolbar = document.querySelector('fpd-element-toolbar');
    if (toolbar) {
      // Ignore opacity sheet chrome class toggles — re-stamping mid-open
      // was collapsing the Opacity panel right after it opened.
      const opacityChrome = new Set([
        'fpd-opacity-open',
        'fpd-doc-opacity-dock',
      ]);
      new MutationObserver((mutations) => {
        const meaningful = mutations.some((m) => {
          if (m.type !== 'attributes') return true;
          if (m.attributeName !== 'class') return true;
          const el = m.target as HTMLElement;
          const prev = (m.oldValue || '').split(/\s+/).filter(Boolean);
          const next = Array.from(el.classList);
          const added = next.filter((c) => !prev.includes(c));
          const removed = prev.filter((c) => !next.includes(c));
          const delta = [...added, ...removed];
          return delta.some((c) => !opacityChrome.has(c));
        });
        if (!meaningful) return;
        placeTextFormatIcons();
        this.applyDocOptInToolbarClasses();
      }).observe(toolbar, {
        attributes: true,
        attributeFilter: ['data-element-type', 'class', 'data-fabric-type'],
        attributeOldValue: true,
      });
    }
    document.addEventListener('uiLayoutChange', () => {
      this.applyDocOptInToolbarClasses();
    });
  }

  /**
   * Stamp NEW opt-in classes only (fpd-doc-* for Element Editor,
   * fpd-ate-* for Add Text Editor). Uniform size + label under every
   * visible mobile tool icon. Desktop is cleared and left untouched.
   */
  applyDocOptInToolbarClasses(): void {
    const toolbar = document.querySelector(
      'fpd-element-toolbar'
    ) as HTMLElement | null;
    // Don't rebuild tool stamps while Opacity sheet is open — the class
    // mutation from opening used to re-enter here and kill the panel.
    if (toolbar?.classList.contains('fpd-opacity-open')) return;

    const container = document.querySelector('.fpd-container');
    // Follow FPD's layout-small (incl. phone landscape), not only CSS width —
    // otherwise labels are cleared when width > 768 even though the mobile
    // toolbar is still showing (Transform/Color appear unlabeled).
    const isMobileUi =
      !!toolbar?.classList.contains('fpd-layout-small') ||
      !!container?.classList.contains('fpd-layout-small') ||
      window.matchMedia('(max-width: 768px)').matches;

    const clearDocToolClasses = () => {
      document
        .querySelectorAll(
          '.fpd-doc-uniform-tool, .fpd-doc-tool-label, .fpd-doc-layer-group, .fpd-doc-btn-group, .fpd-doc-show-duplicate, .fpd-doc-size-tool, .fpd-doc-copy-paste-row'
        )
        .forEach((el) => {
          el.classList.remove(
            'fpd-doc-uniform-tool',
            'fpd-doc-tool-label',
            'fpd-doc-layer-group',
            'fpd-doc-btn-group',
            'fpd-doc-show-duplicate',
            'fpd-doc-size-tool',
            'fpd-doc-copy-paste-row'
          );
        });
    };

    const clearAteToolClasses = () => {
      document
        .querySelectorAll(
          '.fpd-ate-editor, .fpd-ate-uniform-tool, .fpd-ate-tool-label, .fpd-ate-layer-group, .fpd-ate-btn-group, .fpd-ate-show-duplicate, .fpd-ate-size-tool, .fpd-ate-size-wrap, .fpd-ate-copy-paste-row, .fpd-ate-tool-shell, .fpd-ate-labeled-opacity, .fpd-ate-fonts-scroll, .fpd-ate-font-panel, .fpd-ate-font-cell, .fpd-ate-font-preview, .fpd-ate-position-panel, .fpd-ate-position-align-grid, .fpd-ate-position-arrange-grid, .fpd-ate-position-tabs, .fpd-ate-position-tabs-content, .fpd-ate-color-panel, .fpd-ate-color-tabs-scroll'
        )
        .forEach((el) => {
          el.classList.remove(
            'fpd-ate-editor',
            'fpd-ate-uniform-tool',
            'fpd-ate-tool-label',
            'fpd-ate-layer-group',
            'fpd-ate-btn-group',
            'fpd-ate-show-duplicate',
            'fpd-ate-size-tool',
            'fpd-ate-size-wrap',
            'fpd-ate-copy-paste-row',
            'fpd-ate-tool-shell',
            'fpd-ate-labeled-opacity',
            'fpd-ate-fonts-scroll',
            'fpd-ate-font-panel',
            'fpd-ate-font-cell',
            'fpd-ate-font-preview',
            'fpd-ate-position-panel',
            'fpd-ate-position-align-grid',
            'fpd-ate-position-arrange-grid',
            'fpd-ate-position-tabs',
            'fpd-ate-position-tabs-content',
            'fpd-ate-color-panel',
            'fpd-ate-color-tabs-scroll'
          );
        });
      document
        .querySelectorAll('.fpd-ate-tool-caption, .fpd-ate-opacity-label')
        .forEach((el) => el.remove());
    };

    if (!toolbar) {
      if (!isMobileUi) {
        clearDocToolClasses();
        clearAteToolClasses();
      }
      return;
    }

    // Color Fill / Shadow field labels — image|group CSS hides ALL
    // span.fpd-label, so stamp + show via fpd-doc-color-* (new classes).
    // Must run for Element Editor (guitar/images), not only Add Text.
    this.stampColorPanelFieldLabels(toolbar);

    if (!isMobileUi) {
      clearDocToolClasses();
      clearAteToolClasses();
      return;
    }

    // Add Text Editor uses its own fpd-ate-* classes (mobile only).
    // Element Editor keeps fpd-doc-* — paths stay isolated.
    if (toolbar.getAttribute('data-element-type') === 'text') {
      clearDocToolClasses();
      // Also drop leftover Element-Editor caption nodes so they can't
      // stack under Add Text labels (Bold/Bold, Opacity/Opacity).
      toolbar
        .querySelectorAll(
          '.fpd-doc-tool-caption, .fpd-doc-opacity-label'
        )
        .forEach((el) => el.remove());
      this.applyAddTextEditorClasses(toolbar);
      return;
    }

    clearAteToolClasses();

    const ensureCaption = (el: Element, text: string) => {
      const existingLabel = el.querySelector(
        ':scope > .fpd-label'
      ) as HTMLElement | null;
      if (existingLabel) {
        existingLabel.classList.add('fpd-mtl-bold-black');
        if (text) {
          existingLabel.textContent = text;
          return;
        }
        const def = existingLabel.getAttribute('data-defaulttext');
        if (
          def &&
          (!existingLabel.textContent ||
            existingLabel.textContent.trim().startsWith('toolbar.'))
        ) {
          existingLabel.textContent = def;
        }
        return;
      }

      let cap = el.querySelector(
        ':scope > .fpd-doc-tool-caption'
      ) as HTMLElement | null;
      const dataSpan = el.querySelector(
        ':scope > span[data-defaulttext]'
      ) as HTMLElement | null;

      if (!cap && dataSpan) {
        dataSpan.classList.add('fpd-doc-tool-caption', 'fpd-mtl-bold-black');
        const def = dataSpan.getAttribute('data-defaulttext') || text;
        dataSpan.textContent = text || def;
        return;
      }

      if (!cap) {
        cap = document.createElement('span');
        cap.className = 'fpd-doc-tool-caption fpd-mtl-bold-black';
        cap.textContent = text;
        el.appendChild(cap);
        return;
      }

      cap.classList.add('fpd-mtl-bold-black');
      if (text) {
        cap.textContent = text;
      } else if (
        !cap.textContent ||
        cap.textContent.trim().startsWith('toolbar.')
      ) {
        /* keep existing */
      }
    };

    const stampUniform = (el: Element, caption?: string) => {
      el.classList.add('fpd-doc-uniform-tool', 'fpd-doc-tool-label');
      if (caption) {
        ensureCaption(el, caption);
        return;
      }
      if (el.querySelector(':scope > .fpd-label')) {
        ensureCaption(el, '');
        return;
      }
      const title =
        (el as HTMLElement).getAttribute('title') ||
        (el as HTMLElement).getAttribute('data-defaulttext') ||
        '';
      if (title) ensureCaption(el, title);
    };

    toolbar.querySelectorAll('.fpd-tool-duplicate').forEach((el) => {
      el.classList.add('fpd-doc-show-duplicate');
      stampUniform(el, 'Duplicate');
    });

    // Opacity — same icon-above / label-below layout as every other tool
    const opacityBtn = toolbar.querySelector(
      '#fpd-opacity-btn'
    ) as HTMLElement | null;
    if (opacityBtn) {
      opacityBtn.classList.add('fpd-doc-labeled-opacity', 'fpd-doc-uniform-tool');
      let opLab = opacityBtn.querySelector(
        '.fpd-doc-opacity-label'
      ) as HTMLElement | null;
      if (!opLab) {
        opLab = document.createElement('span');
        opLab.className = 'fpd-doc-opacity-label fpd-mtl-bold-black';
        opLab.textContent = 'Opacity';
        opacityBtn.appendChild(opLab);
      } else {
        opLab.classList.add('fpd-mtl-bold-black');
        opLab.textContent = 'Opacity';
        opacityBtn.appendChild(opLab);
      }
    }

    [
      // Element editor requested labels (1, 2, 4)
      ['.fpd-tool-color', 'Color'],
      ['.fpd-tool-transform', 'Transform'],
      ['.fpd-tool-position', 'Align'], // Align icon (opens Align/Arrange panel)
      ['.fpd-tool-reset', 'Reset'],
      ['.fpd-tool-remove', 'Remove'],
      ['.fpd-tool-duplicate', 'Duplicate'],
      // Other tools that already use the same stamp path
      ['.fpd-tool-font-family', 'Font'],
      ['.fpd-tool-edit-text', 'Edit Text'],
      ['.fpd-tool-text-format', 'Format'],
      ['.fpd-tool-curved-text', 'Curved Text'],
      ['.fpd-tool-advanced-editing', 'Edit Image'],
      ['.fpd-tool-remove-bg', 'Remove BG'],
      ['.fpd-tool-text-bold', 'Bold'],
      ['.fpd-tool-text-italic', 'Italic'],
      ['.fpd-tool-text-underline', 'Underline'],
      ['.fpd-tool-text-transform', 'Text'],
      ['#TextTransform', 'Text'],
      ['#letter-spacing', 'Spacing'],
      // Group Text (⌘ four-square icon): group multiple text elements
      ['.fpd-ungroup', 'Group'],
      // Ungroup Text: split a grouped text set back apart
      ['.fpd-ungroup1', 'Ungroup'],
    ].forEach(([sel, caption]) => {
      toolbar.querySelectorAll(sel).forEach((el) => {
        // Skip if vendor currently hides this state of the toggle
        if (getComputedStyle(el).display === 'none') return;
        stampUniform(el, caption as string);
      });
    });

    // Size stepper — wider cell + Size label
    toolbar
      .querySelectorAll(
        '.fpd-tool-text-size.fpd-tool-text-size-customize, .fpd-primary-tools .fpd-tool-text-size'
      )
      .forEach((el) => {
        el.classList.add('fpd-doc-size-tool');
        ensureCaption(el, 'Size');
      });

    // Arrange icons (layer up / down)
    toolbar.querySelectorAll('.fpd-tool-layer-depth').forEach((group) => {
      group.classList.add('fpd-doc-layer-group');
      group
        .querySelectorAll(
          ':scope > [data-do], :scope > #TextMoveUp, :scope > #TextMoveDown'
        )
        .forEach((btn) => {
          const isUp =
            btn.id === 'TextMoveUp' ||
            btn.getAttribute('data-do') === 'layer-up';
          // Arrange controls in the Element editor toolbar
          stampUniform(btn, isUp ? 'Up' : 'Down');
        });
    });

    toolbar
      .querySelectorAll('.fpd-tool-text-align, .fpd-tool-position-align')
      .forEach((group) => {
        group.classList.add('fpd-doc-btn-group');
        group
          .querySelectorAll(':scope > [data-do], :scope > div')
          .forEach((btn) => {
            const doAttr = (btn as HTMLElement).getAttribute('data-do') || '';
            const title =
              (btn as HTMLElement).getAttribute('title') ||
              doAttr.replace(/^align-/, '') ||
              'Align';
            stampUniform(
              btn,
              title.charAt(0).toUpperCase() + title.slice(1)
            );
          });
      });

    // Copy / Paste — remove shared outer box; each is a separate tool cell
    toolbar.querySelectorAll('.groupby-text').forEach((group) => {
      group.classList.add('fpd-doc-copy-paste-row');
      const copy = group.querySelector('.fpd-group-copy-by');
      const paste = group.querySelector('.fpd-group-paste-by');
      if (copy && getComputedStyle(copy).display !== 'none') {
        stampUniform(copy, 'Copy');
      }
      if (paste && getComputedStyle(paste).display !== 'none') {
        stampUniform(paste, 'Paste');
      }
    });
  }

  /**
   * Desktop Add Text only — stamp fpd-dte-editor when layout-large text.
   * No DOM reparenting. No MutationObserver. Clears itself on mobile.
   */
  applyDesktopAddTextEditorClasses(): void {
    const tb = document.querySelector(
      'fpd-element-toolbar'
    ) as HTMLElement | null;
    if (!tb) return;

    const isDesktopText =
      tb.classList.contains('fpd-layout-large') &&
      !tb.classList.contains('fpd-layout-small') &&
      !tb.classList.contains('fpd-ate-editor') &&
      tb.getAttribute('data-element-type') === 'text' &&
      !window.matchMedia('(max-width: 768px)').matches &&
      !document
        .querySelector('.fpd-container')
        ?.classList.contains('fpd-layout-small');

    if (!isDesktopText) {
      tb.classList.remove('fpd-dte-editor');
      tb.querySelector('#fpd-opacity-btn')?.classList.remove(
        'fpd-dte-opacity-btn'
      );
      return;
    }

    tb.classList.add('fpd-dte-editor');
    tb.querySelector('#fpd-opacity-btn')?.classList.add('fpd-dte-opacity-btn');
    const panel = tb.querySelector(
      '#fpd-opacity-panel'
    ) as HTMLElement | null;
    if (panel) this.ensureDesktopOpacitySheet(panel);
  }

  /**
   * Desktop opacity UI — same layout as mobile Color opacity sheet
   * (title + 1.00 box + fpd-range-slider), using NEW fpd-dte-* classes only.
   * Does not modify mobile fpd-doc-* markup or existing CSS files.
   */
  ensureDesktopOpacitySheet(panel: HTMLElement): void {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    if (panel.classList.contains('fpd-doc-opacity-sheet')) return;

    panel.classList.add('fpd-dte-opacity-sheet');

    const legacyRange = panel.querySelector(
      '#fpd-opacity-range'
    ) as HTMLInputElement | null;

    let existingLabel = panel.querySelector(
      ':scope > span.fpd-label, .fpd-opacity-title-row > span.fpd-label, .fpd-dte-opacity-title-row > span.fpd-label'
    ) as HTMLElement | null;
    if (existingLabel) {
      existingLabel.classList.add('fpd-dte-opacity-panel-title');
      existingLabel.textContent = 'Opacity';
      existingLabel.setAttribute('data-defaulttext', 'Opacity');
      if (
        !existingLabel.closest('.fpd-dte-opacity-title-row') &&
        !existingLabel.closest('.fpd-opacity-title-row')
      ) {
        const titleRow = document.createElement('div');
        titleRow.className = 'fpd-dte-opacity-title-row';
        panel.insertBefore(titleRow, existingLabel);
        titleRow.appendChild(existingLabel);
      } else {
        existingLabel
          .closest('.fpd-opacity-title-row')
          ?.classList.add('fpd-dte-opacity-title-row');
      }
    }

    let control = panel.querySelector(
      '.fpd-dte-opacity-control'
    ) as HTMLElement | null;
    if (!control) {
      control = document.createElement('div');
      control.className = 'fpd-dte-opacity-control fpd-input';

      const fieldLabel = document.createElement('span');
      fieldLabel.className = 'fpd-label';
      fieldLabel.textContent = 'Opacity';
      fieldLabel.setAttribute('data-defaulttext', 'Opacity');

      const rangeSlider = document.createElement('fpd-range-slider');
      rangeSlider.className = 'fpd-progress';
      rangeSlider.id = 'fpd-dte-opacity-slider';
      rangeSlider.setAttribute('value', legacyRange?.value || '1');
      rangeSlider.setAttribute('min', '0');
      rangeSlider.setAttribute('max', '1');
      rangeSlider.setAttribute('step', '0.01');

      const numberInput = document.createElement('input');
      numberInput.className = 'fpd-slider-number fpd-number fpd-dte-opacity-value';
      numberInput.type = 'number';
      numberInput.id = 'fpd-dte-opacity-value';
      numberInput.min = '0';
      numberInput.max = '1';
      numberInput.step = '0.01';
      numberInput.value = legacyRange?.value || '1';

      control.append(fieldLabel, rangeSlider, numberInput);
      panel.appendChild(control);
    }

    if (legacyRange) {
      legacyRange.classList.add('fpd-dte-opacity-range-legacy');
      legacyRange.setAttribute('aria-hidden', 'true');
    }

    const setOpacityValue = (value: number) => {
      value = Math.min(1, Math.max(0, value));
      const v = value.toFixed(2);
      const sliderEl = panel.querySelector(
        '#fpd-dte-opacity-slider'
      ) as HTMLElement | null;
      const numEl = panel.querySelector(
        '#fpd-dte-opacity-value'
      ) as HTMLInputElement | null;
      const rangeInput = sliderEl?.querySelector(
        'input[type="range"]'
      ) as HTMLInputElement | null;
      sliderEl?.setAttribute('value', v);
      if (rangeInput) {
        rangeInput.value = v;
        rangeInput.style.setProperty('--value', v);
        rangeInput.style.setProperty('--min', '0');
        rangeInput.style.setProperty('--max', '1');
      }
      if (numEl) numEl.value = v;
      if (legacyRange) {
        legacyRange.value = v;
        const percent = (value / parseFloat(legacyRange.max || '1')) * 100;
        legacyRange.style.setProperty('--progress', percent + '%');
      }
      const canvas = this.designer?.currentViewInstance?.fabricCanvas;
      const obj = canvas?.getActiveObject?.();
      if (!canvas || !obj) return;
      obj.set('opacity', value);
      canvas.requestRenderAll();
      canvas.fire('object:modified', { target: obj });
    };

    const bindDteSlider = () => {
      const rangeInput = panel.querySelector(
        '#fpd-dte-opacity-slider input[type="range"]'
      ) as HTMLInputElement | null;
      if (!rangeInput || (rangeInput as any)._fpdDteBound) return;
      (rangeInput as any)._fpdDteBound = true;
      rangeInput.addEventListener('input', () => {
        setOpacityValue(parseFloat(rangeInput.value));
      });
    };
    bindDteSlider();
    setTimeout(bindDteSlider, 0);
    setTimeout(bindDteSlider, 100);

    const numEl = panel.querySelector(
      '#fpd-dte-opacity-value'
    ) as HTMLInputElement | null;
    if (numEl && !(numEl as any)._fpdDteBound) {
      (numEl as any)._fpdDteBound = true;
      const onNum = () => {
        const n = parseFloat(numEl.value);
        if (Number.isFinite(n)) setOpacityValue(n);
      };
      numEl.addEventListener('change', onNum);
      numEl.addEventListener('input', onNum);
    }

    // Sync UI to active object without applying (caller may pass value)
    (panel as any)._fpdDteSyncOpacity = (value: number) => {
      const v = Math.min(1, Math.max(0, value)).toFixed(2);
      const sliderEl = panel.querySelector(
        '#fpd-dte-opacity-slider'
      ) as HTMLElement | null;
      const rangeInput = sliderEl?.querySelector(
        'input[type="range"]'
      ) as HTMLInputElement | null;
      sliderEl?.setAttribute('value', v);
      if (rangeInput) {
        rangeInput.value = v;
        rangeInput.style.setProperty('--value', v);
        rangeInput.style.setProperty('--min', '0');
        rangeInput.style.setProperty('--max', '1');
      }
      if (numEl) numEl.value = v;
      if (legacyRange) {
        legacyRange.value = v;
        const percent =
          (parseFloat(v) / parseFloat(legacyRange.max || '1')) * 100;
        legacyRange.style.setProperty('--progress', percent + '%');
      }
    };
  }

  /**
   * Desktop Element Editor opacity — match mobile Color opacity sheet.
   * NEW fpd-dee-* classes only. Does not touch mobile fpd-doc-* or Add Text
   * fpd-dte-* sheets / CSS.
   */
  ensureDesktopElementOpacitySheet(
    panel: HTMLElement,
    setOpacityValue?: (value: number, applyToObject?: boolean) => void
  ): void {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    // Leave mobile / Add Text sheets alone
    if (panel.classList.contains('fpd-doc-opacity-sheet')) return;
    if (panel.classList.contains('fpd-dte-opacity-sheet')) return;

    panel.classList.add('fpd-dee-opacity-sheet');

    const legacyRange = panel.querySelector(
      '#fpd-opacity-range'
    ) as HTMLInputElement | null;

    let existingLabel = panel.querySelector(
      ':scope > span.fpd-label, .fpd-dee-opacity-title-row > span.fpd-label'
    ) as HTMLElement | null;
    if (existingLabel) {
      existingLabel.classList.add('fpd-dee-opacity-panel-title');
      existingLabel.textContent = 'Opacity';
      existingLabel.setAttribute('data-defaulttext', 'Opacity');
      if (!existingLabel.closest('.fpd-dee-opacity-title-row')) {
        const titleRow = document.createElement('div');
        titleRow.className = 'fpd-dee-opacity-title-row';
        panel.insertBefore(titleRow, existingLabel);
        titleRow.appendChild(existingLabel);
      }
    }

    let control = panel.querySelector(
      '.fpd-dee-opacity-control'
    ) as HTMLElement | null;
    if (!control) {
      control = document.createElement('div');
      control.className = 'fpd-dee-opacity-control fpd-input';

      const fieldLabel = document.createElement('span');
      fieldLabel.className = 'fpd-label';
      fieldLabel.textContent = 'Opacity';
      fieldLabel.setAttribute('data-defaulttext', 'Opacity');

      const rangeSlider = document.createElement('fpd-range-slider');
      rangeSlider.className = 'fpd-progress';
      rangeSlider.id = 'fpd-dee-opacity-slider';
      rangeSlider.setAttribute('value', legacyRange?.value || '1');
      rangeSlider.setAttribute('min', '0');
      rangeSlider.setAttribute('max', '1');
      rangeSlider.setAttribute('step', '0.01');

      const numberInput = document.createElement('input');
      numberInput.className =
        'fpd-slider-number fpd-number fpd-dee-opacity-value';
      numberInput.type = 'number';
      numberInput.id = 'fpd-dee-opacity-value';
      numberInput.min = '0';
      numberInput.max = '1';
      numberInput.step = '0.01';
      numberInput.value = legacyRange?.value || '1';

      control.append(fieldLabel, rangeSlider, numberInput);
      panel.appendChild(control);
    }

    if (legacyRange) {
      legacyRange.classList.add('fpd-dee-opacity-range-legacy');
      legacyRange.setAttribute('aria-hidden', 'true');
    }

    const applyValue =
      setOpacityValue ||
      ((value: number) => {
        value = Math.min(1, Math.max(0, value));
        const canvas = this.designer?.currentViewInstance?.fabricCanvas;
        const obj = canvas?.getActiveObject?.();
        if (!canvas || !obj) return;
        obj.set('opacity', value);
        canvas.requestRenderAll();
        canvas.fire('object:modified', { target: obj });
      });

    const syncUiOnly = (value: number) => {
      const v = Math.min(1, Math.max(0, value)).toFixed(2);
      const sliderEl = panel.querySelector(
        '#fpd-dee-opacity-slider'
      ) as HTMLElement | null;
      const rangeInput = sliderEl?.querySelector(
        'input[type="range"]'
      ) as HTMLInputElement | null;
      const numEl = panel.querySelector(
        '#fpd-dee-opacity-value'
      ) as HTMLInputElement | null;
      sliderEl?.setAttribute('value', v);
      if (rangeInput) {
        rangeInput.value = v;
        rangeInput.style.setProperty('--value', v);
        rangeInput.style.setProperty('--min', '0');
        rangeInput.style.setProperty('--max', '1');
      }
      if (numEl) numEl.value = v;
      if (legacyRange) {
        legacyRange.value = v;
        const percent =
          (parseFloat(v) / parseFloat(legacyRange.max || '1')) * 100;
        legacyRange.style.setProperty('--progress', percent + '%');
      }
    };

    (panel as any)._fpdDeeSyncOpacity = (value: number) => {
      syncUiOnly(value);
    };

    const bindDeeSlider = () => {
      const rangeInput = panel.querySelector(
        '#fpd-dee-opacity-slider input[type="range"]'
      ) as HTMLInputElement | null;
      if (!rangeInput || (rangeInput as any)._fpdDeeBound) return;
      (rangeInput as any)._fpdDeeBound = true;
      rangeInput.addEventListener('input', () => {
        applyValue(parseFloat(rangeInput.value), true);
      });
    };
    bindDeeSlider();
    setTimeout(bindDeeSlider, 0);
    setTimeout(bindDeeSlider, 100);

    const numEl = panel.querySelector(
      '#fpd-dee-opacity-value'
    ) as HTMLInputElement | null;
    if (numEl && !(numEl as any)._fpdDeeBound) {
      (numEl as any)._fpdDeeBound = true;
      const onNum = () => {
        const n = parseFloat(numEl.value);
        if (Number.isFinite(n)) applyValue(n, true);
      };
      numEl.addEventListener('change', onNum);
      numEl.addEventListener('input', onNum);
    }
  }

  /**
   * Desktop Add Text click binder — completely separate from mobile ate.
   * Document capture; gated to layout-large + fpd-dte-editor.
   * No MutationObserver (that froze the app previously).
   */
  bindDesktopAddTextEditorActions(): void {
    if ((document as any)._fpdDteActionsBound) return;
    (document as any)._fpdDteActionsBound = true;

    const getCanvas = () =>
      this.designer?.currentViewInstance?.fabricCanvas ?? null;
    const getObj = () => getCanvas()?.getActiveObject?.() ?? null;

    const isDteDesktop = (toolbar: HTMLElement | null) =>
      !!toolbar &&
      toolbar.classList.contains('fpd-dte-editor') &&
      toolbar.classList.contains('fpd-layout-large') &&
      !toolbar.classList.contains('fpd-layout-small') &&
      !toolbar.classList.contains('fpd-ate-editor') &&
      toolbar.getAttribute('data-element-type') === 'text' &&
      !window.matchMedia('(max-width: 768px)').matches;

    window.addEventListener('resize', () =>
      this.applyDesktopAddTextEditorClasses()
    );
    document.addEventListener('uiLayoutChange', () =>
      this.applyDesktopAddTextEditorClasses()
    );

    document.addEventListener(
      'click',
      (e: Event) => {
        const raw = e.target as HTMLElement | null;
        if (!raw) return;

        // Lazy stamp so desktop tools work even before delayed timeouts.
        const maybeTb = raw.closest(
          'fpd-element-toolbar'
        ) as HTMLElement | null;
        if (maybeTb?.classList.contains('fpd-layout-large')) {
          this.applyDesktopAddTextEditorClasses();
        }

        const toolbar = maybeTb;
        if (!isDteDesktop(toolbar) || !toolbar) return;

        const opacityBtn = raw.closest(
          '#fpd-opacity-btn'
        ) as HTMLElement | null;
        if (
          opacityBtn &&
          opacityBtn.closest('.fpd-tools-nav') &&
          !opacityBtn.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const panel = toolbar.querySelector(
            '#fpd-opacity-panel'
          ) as HTMLElement | null;
          if (!panel) return;
          const isOpen =
            toolbar.classList.contains('fpd-opacity-open') ||
            panel.style.display === 'block';
          if (isOpen) {
            panel.style.display = 'none';
            opacityBtn.classList.remove('fpd-active');
            toolbar.classList.remove(
              'fpd-opacity-open',
              'fpd-doc-opacity-dock',
              'fpd-dte-opacity-open'
            );
          } else {
            toolbar
              .querySelector('.fpd-sub-panel')
              ?.querySelectorAll(':scope > .fpd-active')
              .forEach((el) => el.classList.remove('fpd-active'));
            toolbar.classList.remove('fpd-panel-visible');
            this.ensureDesktopOpacitySheet(panel);
            panel.style.display = 'block';
            opacityBtn.classList.add('fpd-active');
            toolbar.classList.add(
              'fpd-opacity-open',
              'fpd-dte-opacity-open',
              'fpd-show'
            );
            const obj = getObj();
            if (obj) {
              const value = Math.min(1, Math.max(0, obj.opacity ?? 1));
              const sync = (panel as any)._fpdDteSyncOpacity as
                | ((v: number) => void)
                | undefined;
              sync?.(value);
            }
          }
          return;
        }

        const sizeBtn = raw.closest(
          '#minusElement, #plusElement, .fpd-tool-text-size-customize-icon'
        ) as HTMLElement | null;
        if (sizeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const inputEl = toolbar.querySelector(
            'input[data-control="fontSize"]'
          ) as HTMLInputElement | null;
          if (!canvas || !inputEl) return;
          let current = parseInt(inputEl.value, 10) || 1;
          const isMinus =
            sizeBtn.id === 'minusElement' ||
            sizeBtn.classList.contains('minus');
          current = isMinus
            ? Math.max(1, current - 1)
            : Math.min(200, current + 1);
          inputEl.value = String(current);
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
          const obj = getObj();
          canvas.setElementOptions({ fontSize: current }, obj);
          return;
        }

        const bold = raw.closest(
          '#boldOutside, .fpd-tool-text-bold'
        ) as HTMLElement | null;
        if (
          bold &&
          bold.closest('.fpd-tools-nav') &&
          !bold.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj) return;
          const weight = String(obj.fontWeight || 'normal').toLowerCase();
          const next =
            weight === 'bold' || weight === '700' ? 'normal' : 'bold';
          canvas.setElementOptions({ fontWeight: next }, obj);
          bold.classList.toggle('active', next === 'bold');
          bold.classList.toggle('fpd-enabled', next === 'bold');
          return;
        }

        const italic = raw.closest(
          '#fontItalic, .fpd-tool-text-italic'
        ) as HTMLElement | null;
        if (
          italic &&
          italic.closest('.fpd-tools-nav') &&
          !italic.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj) return;
          const next = obj.fontStyle === 'italic' ? 'normal' : 'italic';
          canvas.setElementOptions({ fontStyle: next }, obj);
          italic.classList.toggle('active', next === 'italic');
          italic.classList.toggle('fpd-enabled', next === 'italic');
          return;
        }

        const underline = raw.closest(
          '#UnderlineText, .fpd-tool-text-underline'
        ) as HTMLElement | null;
        if (
          underline &&
          underline.closest('.fpd-tools-nav') &&
          !underline.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj) return;
          const next = !obj.underline;
          canvas.setElementOptions({ underline: next }, obj);
          underline.classList.toggle('active', next);
          underline.classList.toggle('fpd-enabled', next);
          return;
        }

        const textTransform = raw.closest(
          '#TextTransform, .fpd-tool-text-transform'
        ) as HTMLElement | null;
        if (
          textTransform &&
          textTransform.closest('.fpd-tools-nav') &&
          !textTransform.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj || obj.text == null) return;
          const spanIcon = textTransform.querySelector(
            'span:not(.fpd-label):not(.fpd-ate-tool-caption)'
          );
          const current = obj.textTransform || 'none';
          const next =
            current === 'none'
              ? 'uppercase'
              : current === 'uppercase'
                ? 'lowercase'
                : 'none';
          canvas.setElementOptions({ textTransform: next }, obj);
          if (spanIcon) {
            spanIcon.className =
              next === 'uppercase'
                ? 'fpd-icon-uppercase'
                : next === 'lowercase'
                  ? 'fpd-icon-lowercase'
                  : 'dd fpd-icon-text-transform tts';
          }
          textTransform.classList.toggle('active', next !== 'none');
          return;
        }
      },
      true
    );
  }

  /**
   * Capture-phase delegation for Add Text mobile tools.
   * Direct listeners on nodes can miss taps after merge/stamp, and
   * body .fpd-hidden { pointer-events:none } was swallowing Size/Bold
   * hits. One toolbar-level handler keeps every icon working.
   */
  bindAddTextEditorActions(): void {
    const toolbar = document.querySelector(
      'fpd-element-toolbar'
    ) as HTMLElement | null;
    if (!toolbar || (toolbar as any)._fpdAteActionsBound) return;
    (toolbar as any)._fpdAteActionsBound = true;

    const getCanvas = () =>
      this.designer?.currentViewInstance?.fabricCanvas ?? null;
    const getObj = () => getCanvas()?.getActiveObject?.() ?? null;

    const isAteMobile = () =>
      toolbar.classList.contains('fpd-ate-editor') &&
      toolbar.classList.contains('fpd-layout-small');

    toolbar.addEventListener(
      'click',
      (e: Event) => {
        if (!isAteMobile()) return;
        const raw = e.target as HTMLElement | null;
        if (!raw) return;

        // Opacity — handle in capture so the document outside-click closer
        // and mid-open class re-stamps cannot immediately collapse it.
        const opacityBtn = raw.closest('#fpd-opacity-btn') as HTMLElement | null;
        if (
          opacityBtn &&
          opacityBtn.closest('.fpd-tools-nav') &&
          !opacityBtn.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const panel = toolbar.querySelector(
            '#fpd-opacity-panel'
          ) as HTMLElement | null;
          if (!panel) return;

          const isOpen =
            toolbar.classList.contains('fpd-opacity-open') ||
            panel.style.display === 'block';

          if (isOpen) {
            panel.style.display = 'none';
            opacityBtn.classList.remove('fpd-active');
            toolbar.classList.remove(
              'fpd-opacity-open',
              'fpd-doc-opacity-dock'
            );
          } else {
            const subPanel = toolbar.querySelector('.fpd-sub-panel');
            subPanel
              ?.querySelectorAll(':scope > .fpd-active')
              .forEach((el) => el.classList.remove('fpd-active'));
            toolbar.classList.remove('fpd-panel-visible');
            panel.style.display = 'block';
            opacityBtn.classList.add('fpd-active');
            toolbar.classList.add(
              'fpd-opacity-open',
              'fpd-doc-opacity-dock',
              'fpd-show'
            );
            const canvas = getCanvas();
            const obj = getObj();
            const slider = panel.querySelector(
              '#fpd-opacity-range'
            ) as HTMLInputElement | null;
            if (obj && slider) {
              const value = Math.min(1, Math.max(0, obj.opacity ?? 1));
              slider.value = value.toFixed(2);
              slider.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }
          return;
        }

        // Size +/- (must run even when wrapped in .fpd-hidden)
        const sizeBtn = raw.closest(
          '#minusElement, #plusElement, .fpd-tool-text-size-customize-icon'
        ) as HTMLElement | null;
        if (sizeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const inputEl = toolbar.querySelector(
            'input[data-control="fontSize"]'
          ) as HTMLInputElement | null;
          if (!canvas || !inputEl) return;
          let current = parseInt(inputEl.value, 10) || 1;
          const isMinus =
            sizeBtn.id === 'minusElement' ||
            sizeBtn.classList.contains('minus');
          current = isMinus
            ? Math.max(1, current - 1)
            : Math.min(200, current + 1);
          inputEl.value = String(current);
          inputEl.dispatchEvent(new Event('input', { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
          canvas.setElementOptions({ fontSize: current });
          return;
        }

        const bold = raw.closest(
          '#boldOutside, .fpd-tool-text-bold'
        ) as HTMLElement | null;
        if (
          bold &&
          bold.closest('.fpd-tools-nav') &&
          !bold.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj) return;
          const weight = String(obj.fontWeight || 'normal').toLowerCase();
          const next =
            weight === 'bold' || weight === '700' ? 'normal' : 'bold';
          canvas.setElementOptions({ fontWeight: next }, obj);
          bold.classList.toggle('active', next === 'bold');
          bold.classList.toggle('fpd-enabled', next === 'bold');
          return;
        }

        const italic = raw.closest(
          '#fontItalic, .fpd-tool-text-italic'
        ) as HTMLElement | null;
        if (
          italic &&
          italic.closest('.fpd-tools-nav') &&
          !italic.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj) return;
          const next = obj.fontStyle === 'italic' ? 'normal' : 'italic';
          canvas.setElementOptions({ fontStyle: next }, obj);
          italic.classList.toggle('active', next === 'italic');
          italic.classList.toggle('fpd-enabled', next === 'italic');
          return;
        }

        const underline = raw.closest(
          '#UnderlineText, .fpd-tool-text-underline'
        ) as HTMLElement | null;
        if (
          underline &&
          underline.closest('.fpd-tools-nav') &&
          !underline.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj) return;
          const next = !obj.underline;
          canvas.setElementOptions({ underline: next }, obj);
          underline.classList.toggle('active', next);
          underline.classList.toggle('fpd-enabled', next);
          return;
        }

        const textTransform = raw.closest(
          '#TextTransform, .fpd-tool-text-transform'
        ) as HTMLElement | null;
        if (
          textTransform &&
          textTransform.closest('.fpd-tools-nav') &&
          !textTransform.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          const canvas = getCanvas();
          const obj = getObj();
          if (!canvas || !obj || obj.text == null) return;
          const spanIcon = textTransform.querySelector(
            'span:not(.fpd-ate-tool-caption):not(.fpd-label)'
          );
          const current = obj.textTransform || 'none';
          const next =
            current === 'none'
              ? 'uppercase'
              : current === 'uppercase'
                ? 'lowercase'
                : 'none';
          canvas.setElementOptions({ textTransform: next }, obj);
          if (spanIcon) {
            spanIcon.className =
              next === 'uppercase'
                ? 'fpd-icon-uppercase'
                : next === 'lowercase'
                  ? 'fpd-icon-lowercase'
                  : 'dd fpd-icon-text-transform tts';
          }
          textTransform.classList.toggle('active', next !== 'none');
          return;
        }

        const spacing = raw.closest('#letter-spacing') as HTMLElement | null;
        if (
          spacing &&
          spacing.closest('.fpd-tools-nav') &&
          !spacing.closest('.fpd-sub-panel')
        ) {
          e.preventDefault();
          e.stopPropagation();
          document.body.classList.remove('fpd-toolbar-transform-our');
          if (spacing.classList.contains('letter-spac-active')) {
            toolbar.classList.remove('fpd-panel-visible');
            spacing.classList.remove('letter-spac-active');
            return;
          }
          spacing.classList.add('letter-spac-active');
          const subPanel = toolbar.querySelector('.fpd-sub-panel');
          if (!subPanel) return;
          subPanel.querySelectorAll(':scope > .fpd-active').forEach((el) => {
            el.classList.remove('fpd-active');
          });
          const sizePanel = subPanel.querySelector('.fpd-panel-text-size');
          if (sizePanel) {
            sizePanel.classList.add(
              'fpd-active',
              'fpd-letter-spacing-lineheight'
            );
            document.body.classList.remove('fpd-tools-custom-data');
          }
          toolbar.classList.add('fpd-panel-visible');
          return;
        }

        // Text Align (Left) — open sheet with Left/Center/Right/Justify
        const textAlignBtn = raw.closest(
          '#textAlignCust, .fpd-tool-text-align'
        ) as HTMLElement | null;
        if (
          textAlignBtn &&
          textAlignBtn.closest('.fpd-tools-nav') &&
          !textAlignBtn.closest('.fpd-sub-panel') &&
          !raw.closest('.fpd-ate-text-align-sheet')
        ) {
          e.preventDefault();
          e.stopPropagation();
          this.toggleAteTextAlignSheet(toolbar, textAlignBtn);
          return;
        }

        // Option inside the ate text-align sheet
        const alignOpt = raw.closest(
          '.fpd-ate-text-align-option'
        ) as HTMLElement | null;
        if (alignOpt && alignOpt.closest('.fpd-ate-text-align-sheet')) {
          e.preventDefault();
          e.stopPropagation();
          const option = alignOpt.getAttribute('data-option') || 'left';
          this.applyAteTextAlign(toolbar, option);
          return;
        }
      },
      true
    );
  }

  /** Build / return the Add Text mobile text-align bottom sheet. */
  ensureAteTextAlignSheet(toolbar: HTMLElement): HTMLElement | null {
    const subPanel = toolbar.querySelector(
      ':scope > .fpd-sub-panel'
    ) as HTMLElement | null;
    if (!subPanel) return null;

    let sheet = subPanel.querySelector(
      ':scope > .fpd-ate-text-align-sheet'
    ) as HTMLElement | null;
    if (sheet) return sheet;

    sheet = document.createElement('div');
    sheet.className = 'fpd-ate-text-align-sheet';
    sheet.innerHTML = `
      <div class="fpd-ate-text-align-title">Align</div>
      <div class="fpd-ate-text-align-options" data-control="textAlign">
        <div class="fpd-ate-text-align-option" data-option="left" role="button" tabindex="0">
          <span class="fpd-icon-format-align-left"></span>
          <span class="fpd-ate-text-align-option-label">Left</span>
        </div>
        <div class="fpd-ate-text-align-option" data-option="center" role="button" tabindex="0">
          <span class="fpd-icon-format-align-center"></span>
          <span class="fpd-ate-text-align-option-label">Center</span>
        </div>
        <div class="fpd-ate-text-align-option" data-option="right" role="button" tabindex="0">
          <span class="fpd-icon-format-align-right"></span>
          <span class="fpd-ate-text-align-option-label">Right</span>
        </div>
        <div class="fpd-ate-text-align-option" data-option="justify" role="button" tabindex="0">
          <span class="fpd-icon-format-align-justify"></span>
          <span class="fpd-ate-text-align-option-label">Justify</span>
        </div>
      </div>
    `;
    subPanel.appendChild(sheet);
    return sheet;
  }

  syncAteTextAlignSheet(toolbar: HTMLElement, current?: string): void {
    const sheet = toolbar.querySelector(
      '.fpd-ate-text-align-sheet'
    ) as HTMLElement | null;
    if (!sheet) return;
    const align =
      current ||
      String(
        this.designer?.currentViewInstance?.fabricCanvas?.getActiveObject?.()
          ?.textAlign || 'left'
      );
    sheet.querySelectorAll('.fpd-ate-text-align-option').forEach((el) => {
      el.classList.toggle(
        'fpd-ate-text-align-option-active',
        el.getAttribute('data-option') === align
      );
    });
  }

  applyAteTextAlign(toolbar: HTMLElement, option: string): void {
    const canvas = this.designer?.currentViewInstance?.fabricCanvas;
    const obj = canvas?.getActiveObject?.();
    if (!canvas || !obj) return;

    canvas.setElementOptions({ textAlign: option }, obj);
    this.syncAteTextAlignSheet(toolbar, option);

    const trigger = toolbar.querySelector(
      '#textAlignCust'
    ) as HTMLElement | null;
    const span = trigger?.querySelector(
      'span:not(.fpd-ate-tool-caption):not(.fpd-label)'
    ) as HTMLElement | null;
    if (span) {
      span.className =
        option === 'center'
          ? 'fpd-icon-format-align-center'
          : option === 'right'
            ? 'fpd-icon-format-align-right'
            : option === 'justify'
              ? 'fpd-icon-format-align-justify'
              : 'fpd-icon-format-align-left';
      span.setAttribute('data-option', option);
      span.classList.add('active-icon');
    }
  }

  toggleAteTextAlignSheet(
    toolbar: HTMLElement,
    trigger: HTMLElement
  ): void {
    const sheet = this.ensureAteTextAlignSheet(toolbar);
    if (!sheet) return;

    const subPanel = toolbar.querySelector('.fpd-sub-panel');
    const isOpen = sheet.classList.contains('fpd-active');

    // Close opacity if it was open
    const opacityPanel = toolbar.querySelector(
      '#fpd-opacity-panel'
    ) as HTMLElement | null;
    if (opacityPanel) opacityPanel.style.display = 'none';
    toolbar.classList.remove('fpd-opacity-open', 'fpd-doc-opacity-dock');
    toolbar
      .querySelector('#fpd-opacity-btn')
      ?.classList.remove('fpd-active');

    document.body.classList.remove('fpd-toolbar-transform-our');
    toolbar
      .querySelector('#letter-spacing')
      ?.classList.remove('letter-spac-active');
    toolbar
      .querySelector('#CenterTools')
      ?.classList.remove('letter-spac-active');

    subPanel?.querySelectorAll(':scope > .fpd-active').forEach((el) => {
      el.classList.remove('fpd-active');
    });

    if (isOpen) {
      toolbar.classList.remove('fpd-panel-visible', 'my-position');
      trigger.classList.remove('fpd-active', 'fpd-ate-text-align-open');
      return;
    }

    sheet.classList.add('fpd-active');
    trigger.classList.add('fpd-active', 'fpd-ate-text-align-open');
    toolbar.classList.add('fpd-panel-visible', 'fpd-show');
    this.syncAteTextAlignSheet(toolbar);
  }

  /**
   * Restore Color Fill / Stroke / Shadow field labels (Opacity, Blur,
   * Offset X/Y). Vendor CSS hides every span.fpd-label for image|group;
   * we stamp fpd-doc-color-* and show them from fpd-ate-color-panel.css
   * without editing styles.scss.
   */
  stampColorPanelFieldLabels(toolbar: HTMLElement): void {
    const colorFieldLabels: Array<[string, string]> = [
      ['.fpd-tool-fill-opacity', 'Opacity'],
      ['.fpd-tool-stroke-width', 'Stroke Width'],
      ['.fpd-tool-shadow-blur', 'Blur'],
      ['.fpd-tool-shadow-offsetX', 'Offset X'],
      ['.fpd-tool-shadow-offsetY', 'Offset Y'],
    ];

    toolbar.querySelectorAll('.fpd-panel-color').forEach((panel) => {
      panel.classList.add('fpd-doc-color-panel');
      colorFieldLabels.forEach(([sel, caption]) => {
        panel.querySelectorAll(sel).forEach((field) => {
          field.classList.add('fpd-doc-color-field');
          let lab = field.querySelector(
            ':scope > .fpd-label'
          ) as HTMLElement | null;
          if (!lab) {
            lab = document.createElement('span');
            lab.className = 'fpd-label';
            field.insertBefore(lab, field.firstChild);
          }
          lab.classList.add('fpd-doc-color-field-label');
          lab.textContent = caption;
          lab.setAttribute('data-defaulttext', caption);
        });
      });
    });
  }

  /**
   * Add Text Editor (mobile) — stamp isolated fpd-ate-* classes so the
   * text toolbar matches Element Editor layout without touching fpd-doc-*
   * or styles.scss. Only runs when data-element-type="text" + layout-small.
   */
  applyAddTextEditorClasses(toolbar: HTMLElement): void {
    toolbar.classList.add('fpd-ate-editor');

    // Only stamp the outer tool strip — never sub-panel contents
    // (Align grid, font list, etc. break when given 68×76 cells).
    const toolsNav = toolbar.querySelector(
      ':scope > .fpd-tools-nav'
    ) as HTMLElement | null;
    const stampRoot = toolsNav || toolbar;

    // Undo any prior mistaken stamps inside sub-panels.
    toolbar.querySelectorAll('.fpd-sub-panel [class*="fpd-ate-"]').forEach((el) => {
      el.classList.remove(
        'fpd-ate-uniform-tool',
        'fpd-ate-tool-label',
        'fpd-ate-layer-group',
        'fpd-ate-btn-group',
        'fpd-ate-show-duplicate',
        'fpd-ate-size-tool',
        'fpd-ate-size-wrap',
        'fpd-ate-copy-paste-row',
        'fpd-ate-tool-shell',
        'fpd-ate-labeled-opacity',
        'fpd-ate-font-cell'
      );
      el.querySelectorAll(':scope > .fpd-ate-tool-caption, :scope > .fpd-ate-opacity-label')
        .forEach((n) => n.remove());
    });

    // Font list must scroll when a family (e.g. Lobster) expands variants.
    toolbar
      .querySelectorAll('.fpd-panel-font-family .fpd-fonts-list')
      .forEach((el) => el.classList.add('fpd-ate-fonts-scroll'));
    toolbar
      .querySelectorAll('.fpd-panel-font-family.fpd-active, .fpd-panel-font-family')
      .forEach((el) => el.classList.add('fpd-ate-font-panel'));

    // Center tool → Align/Arrange position sheet (layout via ate CSS only).
    toolbar.querySelectorAll('.fpd-panel-position').forEach((panel) => {
      panel.classList.add('fpd-ate-position-panel');
      panel
        .querySelectorAll('.fpd-tool-position-align')
        .forEach((grid) => grid.classList.add('fpd-ate-position-align-grid'));
      panel
        .querySelectorAll('.fpd-tool-layer-depth')
        .forEach((grid) => grid.classList.add('fpd-ate-position-arrange-grid'));
      panel
        .querySelectorAll('.fpd-panel-tabs')
        .forEach((tabs) => tabs.classList.add('fpd-ate-position-tabs'));
      panel
        .querySelectorAll('.fpd-panel-tabs-content')
        .forEach((content) =>
          content.classList.add('fpd-ate-position-tabs-content')
        );
    });

    // Color panel (Fill / Stroke / Shadow): enable Shadow-tab scroll +
    // safer Stroke Width range for text (outline, not a solid blob).
    // Field labels (Opacity / Blur / Offset) via stampColorPanelFieldLabels.
    this.stampColorPanelFieldLabels(toolbar);
    toolbar.querySelectorAll('.fpd-panel-color').forEach((panel) => {
      panel.classList.add('fpd-ate-color-panel');
      panel
        .querySelectorAll(':scope > .fpd-panel-tabs-content.fpd-scroll-area')
        .forEach((content) =>
          content.classList.add('fpd-ate-color-tabs-scroll')
        );
      panel
        .querySelectorAll(
          'fpd-range-slider[data-control="strokeWidth"], input.fpd-slider-number[data-control="strokeWidth"]'
        )
        .forEach((el) => {
          el.setAttribute('max', '5');
          const cur = parseFloat(
            (el as HTMLInputElement).value ||
              el.getAttribute('value') ||
              '0'
          );
          if (Number.isFinite(cur) && cur > 5) {
            if (el.tagName === 'INPUT') {
              (el as HTMLInputElement).value = '5';
            }
            el.setAttribute('value', '5');
          }
        });
    });

    // Preview the selected face in the Font dropdown (vendor only sets .value).
    const syncFontPreview = () => {
      const fontInput = stampRoot.querySelector(
        '.fpd-tool-font-family fpd-dropdown > input.fpd-dropdown-current'
      ) as HTMLInputElement | null;
      if (!fontInput) return;
      fontInput.classList.add('fpd-ate-font-preview');
      const face = (fontInput.value || '').trim();
      if (face) {
        fontInput.style.fontFamily = `"${face.replace(/"/g, '')}", sans-serif`;
      }
      fontInput
        .closest('.fpd-tool-font-family')
        ?.classList.add('fpd-ate-font-cell');
    };
    syncFontPreview();
    if (!(toolbar as any)._fpdAteFontPreviewBound) {
      (toolbar as any)._fpdAteFontPreviewBound = true;
      // FPD assigns input.value in JS (no input event) — re-sync after taps.
      toolbar.addEventListener(
        'click',
        () => setTimeout(syncFontPreview, 0),
        true
      );
      stampRoot
        .querySelector('.fpd-tool-font-family fpd-dropdown')
        ?.addEventListener('input', syncFontPreview, true);
    }

    // Strip every prior caption so we never stack Bold/Bold or Opacity/Opacity.
    stampRoot
      .querySelectorAll(
        '.fpd-ate-tool-caption, .fpd-ate-opacity-label, .fpd-doc-tool-caption, .fpd-doc-opacity-label'
      )
      .forEach((el) => el.remove());
    stampRoot
      .querySelectorAll('.fpd-label.fpd-ate-caption-active')
      .forEach((el) => el.classList.remove('fpd-ate-caption-active'));

    const ensureAteCaption = (el: Element, text: string) => {
      // Prefer a single vendor .fpd-label when present.
      const existingLabel = el.querySelector(
        ':scope > .fpd-label'
      ) as HTMLElement | null;
      if (existingLabel) {
        if (text) existingLabel.textContent = text;
        existingLabel.classList.add(
          'fpd-ate-caption-active',
          'fpd-mtl-bold-black'
        );
        // Remove any extra sibling labels/captions that may have accumulated.
        el.querySelectorAll(
          ':scope > .fpd-ate-tool-caption, :scope > .fpd-ate-opacity-label, :scope > .fpd-doc-tool-caption, :scope > .fpd-doc-opacity-label'
        ).forEach((n) => n.remove());
        el.querySelectorAll(':scope > .fpd-label').forEach((lab, i) => {
          if (i === 0) return;
          (lab as HTMLElement).classList.remove(
            'fpd-ate-caption-active',
            'fpd-mtl-bold-black'
          );
        });
        return;
      }

      let cap = el.querySelector(
        ':scope > .fpd-ate-tool-caption'
      ) as HTMLElement | null;

      if (!cap) {
        cap = document.createElement('span');
        cap.className = 'fpd-ate-tool-caption fpd-mtl-bold-black';
        el.appendChild(cap);
      }
      cap.classList.add('fpd-mtl-bold-black');
      cap.textContent = text;

      // Keep exactly one caption child.
      el.querySelectorAll(':scope > .fpd-ate-tool-caption').forEach((n, i) => {
        if (i > 0) n.remove();
      });
    };

    const stampAte = (el: Element, caption?: string) => {
      el.classList.add('fpd-ate-uniform-tool', 'fpd-ate-tool-label');
      if (caption) {
        ensureAteCaption(el, caption);
        return;
      }
      if (el.querySelector(':scope > .fpd-label')) {
        ensureAteCaption(el, '');
        return;
      }
      const title =
        (el as HTMLElement).getAttribute('title') ||
        (el as HTMLElement).getAttribute('data-defaulttext') ||
        '';
      if (title && !title.startsWith('toolbar.')) ensureAteCaption(el, title);
      else if (title.startsWith('toolbar.')) {
        const def = (el as HTMLElement).getAttribute('data-defaulttext');
        if (def) ensureAteCaption(el, def);
      }
    };

    const stamped = new Set<Element>();
    const stampOnce = (el: Element, caption?: string) => {
      if (stamped.has(el)) return;
      if (getComputedStyle(el).display === 'none') return;
      stamped.add(el);
      stampAte(el, caption);
    };

    stampRoot.querySelectorAll('.fpd-tool-duplicate').forEach((el) => {
      el.classList.add('fpd-ate-show-duplicate');
      stampOnce(el, 'Duplicate');
    });

    const opacityBtn = stampRoot.querySelector(
      '#fpd-opacity-btn'
    ) as HTMLElement | null;
    if (opacityBtn) {
      opacityBtn.classList.add(
        'fpd-ate-labeled-opacity',
        'fpd-ate-uniform-tool',
        'fpd-ate-tool-label'
      );
      opacityBtn
        .querySelectorAll(
          ':scope > .fpd-doc-opacity-label, :scope > .fpd-ate-opacity-label, :scope > .fpd-doc-tool-caption, :scope > .fpd-ate-tool-caption'
        )
        .forEach((n) => n.remove());
      const opLab = document.createElement('span');
      opLab.className = 'fpd-ate-opacity-label fpd-mtl-bold-black';
      opLab.textContent = 'Opacity';
      opacityBtn.appendChild(opLab);
      stamped.add(opacityBtn);
    }

    (
      [
        ['.fpd-tool-color', 'Color'],
        ['.fpd-tool-transform', 'Transform'],
        ['.fpd-tool-position', 'Align'],
        ['.fpd-tool-reset', 'Reset'],
        ['.fpd-tool-remove', 'Remove'],
        ['.fpd-tool-duplicate', 'Duplicate'],
        ['.fpd-tool-font-family', 'Font'],
        ['.fpd-tool-edit-text', 'Edit Text'],
        ['.fpd-tool-curved-text', 'Curved Text'],
        ['.fpd-tool-text-bold', 'Bold'],
        ['.fpd-tool-text-italic', 'Italic'],
        ['.fpd-tool-text-underline', 'Underline'],
        ['#TextTransform', 'Text'],
        ['.fpd-tool-text-transform', 'Text'],
        ['#letter-spacing', 'Spacing'],
        ['.fpd-ungroup', 'Group'],
        ['.fpd-ungroup1', 'Ungroup'],
      ] as [string, string][]
    ).forEach(([sel, caption]) => {
      stampRoot.querySelectorAll(sel).forEach((el) => stampOnce(el, caption));
    });

    // Size +/- outer wrap + Size label
    stampRoot
      .querySelectorAll(
        '#minusCust.flex-plus-minus-icon, .fpd-primary-tools .flex-plus-minus-icon'
      )
      .forEach((wrap) => {
        if (getComputedStyle(wrap).display === 'none') return;
        wrap.classList.add('fpd-ate-size-wrap');
      });
    stampRoot
      .querySelectorAll(
        '.fpd-tool-text-size.fpd-tool-text-size-customize, .fpd-primary-tools .fpd-tool-text-size, .fpd-ate-size-wrap .fpd-tool-text-size'
      )
      .forEach((el) => {
        el.classList.add('fpd-ate-size-tool');
        ensureAteCaption(el, 'Size');
      });

    // Layer Up / Down
    stampRoot.querySelectorAll('.fpd-tool-layer-depth').forEach((group) => {
      group.classList.add('fpd-ate-layer-group');
      group
        .querySelectorAll(
          ':scope > [data-do], :scope > #TextMoveUp, :scope > #TextMoveDown'
        )
        .forEach((btn) => {
          const isUp =
            btn.id === 'TextMoveUp' ||
            btn.getAttribute('data-do') === 'layer-up';
          stampOnce(btn, isUp ? 'Up' : 'Down');
        });
    });

    // Align / Center — outer toolbar cells only (never .fpd-tool-position-align
    // inside the Align panel — that grid needs all Left/Center/Right options).
    stampRoot
      .querySelectorAll('#textAlignCust, #CenterTools')
      .forEach((group) => {
        group.classList.add('fpd-ate-btn-group');
        const label =
          group.id === 'CenterTools'
            ? 'Center'
            : group.id === 'textAlignCust'
              ? 'Align'
              : 'Align';
        stampOnce(group, label);
      });

    // Prefetch the text-align bottom sheet so the first tap opens instantly.
    this.ensureAteTextAlignSheet(toolbar);

    // Spacing — stamp the .extra-icon shell as the 68×76 cell (same as siblings)
    stampRoot.querySelectorAll('.extra-icon').forEach((shell) => {
      const spacing = shell.querySelector('#letter-spacing');
      if (!spacing) return;
      if (shell.querySelector('#copytext, #pastetext')) return;
      shell.classList.add('fpd-ate-tool-shell');
      stampOnce(shell, 'Spacing');
    });

    // Copy / Paste — open row; each icon is its own labeled cell
    stampRoot
      .querySelectorAll('.groupby-text, .extra-icon-main-div-box')
      .forEach((group) => {
        group.classList.add('fpd-ate-copy-paste-row');
        const copy =
          group.querySelector('.fpd-group-copy-by') ||
          group.querySelector('#copytext')?.closest('.extra-icon') ||
          group.querySelector('#copytext');
        const paste =
          group.querySelector('.fpd-group-paste-by') ||
          group.querySelector('#pastetext')?.closest('.extra-icon') ||
          group.querySelector('#pastetext');
        if (copy) stampOnce(copy, 'Copy');
        if (paste) stampOnce(paste, 'Paste');
      });

    // Final pass: each stamped cell keeps ONE caption; drop text-only
    // duplicate spans (the Bold/Bold + Opacity/Opacity bug).
    stampRoot.querySelectorAll('.fpd-ate-uniform-tool').forEach((cell) => {
      const captions = Array.from(
        cell.querySelectorAll(
          ':scope > .fpd-ate-tool-caption, :scope > .fpd-ate-opacity-label, :scope > .fpd-label.fpd-ate-caption-active'
        )
      ) as HTMLElement[];
      captions.slice(1).forEach((n) => n.remove());

      Array.from(cell.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          node.textContent = '';
        }
      });

      // Text-only leftover spans that aren't the icon and aren't the caption
      cell.querySelectorAll(':scope > span').forEach((span) => {
        const s = span as HTMLElement;
        if (
          s.classList.contains('fpd-ate-tool-caption') ||
          s.classList.contains('fpd-ate-opacity-label') ||
          s.classList.contains('fpd-ate-caption-active') ||
          s.classList.contains('fpd-current-fill') ||
          s.classList.contains('fpd-current-color') ||
          s.className.includes('fpd-icon') ||
          s.classList.contains('dd') ||
          s.querySelector('svg') ||
          s.id === 'copytext' ||
          s.id === 'pastetext' ||
          s.id === 'letter-spacing'
        ) {
          return;
        }
        // Bare text span competing with our caption → remove
        if ((s.textContent || '').trim() && !s.querySelector('*')) {
          s.remove();
        }
      });
    });
  }

  // The Transform panel's Rotate control sets fabric's `angle` directly
  // (FancyProductDesigner.js's setElementOptions does a plain e.set()), and
  // every fabric object defaults to originX/originY 'left'/'top'. Unlike
  // dragging the on-canvas rotate handle — which fabric internally pivots
  // around the object's center — setting `angle` that way spins the element
  // around its top-left corner instead. Re-anchor the object to its previous
  // center after every change so the Rotate slider/number input visually
  // pivots around the center too, regardless of the object's origin.
  fixRotateAroundCenter(): void {
    const recenterAfterAngleChange = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el || !el.closest('[data-control="angle"]')) return;

      const canvas = this.designer?.currentViewInstance?.fabricCanvas;
      const obj = canvas?.getActiveObject();
      if (!obj) return;

      const center = obj.getCenterPoint();
      // Deferred so it runs after the vendor's own listener (registered
      // directly on the input/slider) has already applied the new angle —
      // our listener is capture-phase so it fires first and can only grab
      // the pre-change center, not correct the post-change position yet.
      setTimeout(() => {
        obj.setPositionByOrigin(center, obj.originX, obj.originY);
        obj.setCoords();
        canvas.requestRenderAll();
      }, 0);
    };

    document.addEventListener('input', (e) => recenterAfterAngleChange(e.target), true);
    document.addEventListener('change', (e) => recenterAfterAngleChange(e.target), true);
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
      fileServerURL: 'https://styleflip-backend-jdm5.ithemes.xyz/api/image/upload',
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

    // selectProduct()'s initial call (triggered by
    // mainOptions.loadFirstProductInStage) picks this.products (Products
    // tab) vs this.productsnew (Designs tab) based on localStorage
    // 'parentDivId', which otherwise still holds whatever tab was last
    // clicked in a previous session. Forcing it to 'DesignModule' here,
    // before the designer is constructed, makes every fresh page load land
    // on a Designs-tab product by default; a real tab click later in the
    // session still overwrites it as before.
    localStorage.setItem('parentDivId', 'DesignModule');

    this.designer = new FancyProductDesigner(
      this.document.querySelector('#clothing-designer'),
      this.appOptions
    );
    ;

    // The zoom slider (.fpd-zoom-wrapper) is only ever built by the vendor
    // lazily, the first time someone taps the "zoom" action icon
    // (FancyProductDesigner.js's doAction('zoom') branch, ~line 27718) - the
    // mobile zoom action icon itself is hidden separately
    // (div[data-pos="left"] .fpd-btn[aria-label="Zoom"] in src/styles.scss,
    // pre-existing), so mobile can otherwise never reach it manually.
    // Calling the exact same doAction('zoom') the icon's own click handler
    // calls makes it appear immediately on both desktop and mobile instead
    // of waiting for that first tap.
    //
    // Self-heals by polling forever (not just until the first success) for
    // ".fpd-zoom-wrapper missing + a real view exists" and recreating it,
    // rather than a one-shot poll-then-call - the vendor's own actions-bar
    // class has a `reset()` that `.remove()`s any existing
    // `.fpd-zoom-wrapper` on certain internal events (its constructor wires
    // `G(t, ['viewSelect'], t => this.reset())`, ~line 27556) and a one-shot
    // version loses that race on desktop (confirmed via a real
    // headless-browser repro - see [[styleflip_zoom_slider_auto_show]]).
    // Polling forever self-heals regardless of what removes it or why, and
    // correctly keeps the slider's displayed value in sync with whichever
    // view is current (doAction('zoom') reads the CURRENT view's zoom when
    // it rebuilds) - it's a no-op most ticks once the slider's already
    // there (`if (zoomWrapper) return` in the vendor code itself).
    setInterval(() => {
      if (
        this.designer?.actionsBar &&
        this.designer?.currentViewInstance &&
        !this.designer.mainWrapper?.container?.querySelector('.fpd-zoom-wrapper')
      ) {
        this.designer.actionsBar.doAction('zoom');
      }
    }, 800);

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
      this.productsDataReady = true;
      this.updateProductsLoaderStep2State();
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
        this.productsDataReady = true;
        this.updateProductsLoaderStep2State();

        // Optional: Show toast notification (uncomment if you have this method)
        // this.showToast("Products updated!");
      })
      .catch((err) => {
        console.error("❌ API fetch failed:", err);
        this.showFPDLoading(false);
        // Don't leave the Products-tab loader's step-2 button permanently
        // disabled if the fetch genuinely fails - the cached copy (if any)
        // is already applied above, so there's still something to show.
        this.productsDataReady = true;
        this.updateProductsLoaderStep2State();
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
        fetch(`/api/sharedproduct/search?title=${encodeURIComponent(title)}&design_id=${encodeURIComponent(id ?? '')}`, {
          method: 'GET'
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

  // #save-confirm-popup and #title-popup both live at the top level of
  // home.component.html (siblings of #fpd-loader's ORIGINAL spot, outside
  // #clothing-designer entirely) with z-index:99999 - fine normally, but
  // fpd-main-bar (the mobile bottom-sheet nav bar) renders at
  // z-index:2147483647 (max 32-bit value, already the ceiling - nothing can
  // be raised above it, see the loader relocation comments elsewhere in
  // this file for the same constraint). Whenever a real tab panel happens
  // to be open underneath - including right after the mandatory tap-loader,
  // which is why this is called from both popup functions below, mobile
  // only (same reasoning as startProductsTabLoader's own desktop bail-out;
  // fpd-main-bar isn't the active layout there) - these popups would render
  // with display:flex but be completely invisible behind it. Appending as
  // fpd-main-bar's own last child (a sibling of .fpd-module-content, not
  // nested inside it) makes them paint on top by DOM order within that same
  // maxed-out stacking context instead of trying to out-z-index it - the
  // same trick the loader uses. position:fixed still measures against the
  // true viewport here since fpd-main-bar has no transform/filter of its
  // own (confirmed - a transformed ancestor would otherwise break that).
  private ensurePopupAboveMainBar(popup: HTMLElement) {
    if (window.innerWidth > 768) return;
    const mainBar = document.querySelector('fpd-main-bar');
    if (mainBar && popup.parentElement !== mainBar) {
      mainBar.appendChild(popup);
    }
  }

  // Shown when the header Save icon (mobile topbar + desktop button) is
  // tapped, before the real save popup opens. Yes hands off to the real
  // save flow (openTitlePopup), Cancel just dismisses.
  openSaveConfirmPopup() {
    // If a PRIOR call into this function had to move #fpd-loader out to
    // document.body (see the guard below - only happens when Save is the
    // very first tap this session, before any real tab has ever opened
    // .fpd-module-content), put it back home now that this function is
    // running again (either the deferred loader just finished, or Save was
    // tapped a 2nd time). waitForElements() (ngOnInit) only ever relocates
    // it into module-content ONCE, early in the page lifecycle - without
    // this, every LATER genuine .fpd-nav-item tap's loader (still the same
    // shared #fpd-loader element, abbreviated 1-tap version after the
    // first) would keep rendering from body instead of its z-index-safe
    // home for the rest of the session.
    const strandedLoader = document.getElementById('fpd-loader');
    if (strandedLoader && strandedLoader.parentElement === document.body) {
      const mainBarEl = document.querySelector('fpd-main-bar') as HTMLElement | null;
      const moduleContentEl = mainBarEl?.querySelector('.fpd-module-content') as HTMLElement | null;
      if (moduleContentEl) {
        moduleContentEl.style.position = 'relative';
        moduleContentEl.appendChild(strandedLoader);

        // Defensive cleanup, not the primary fix (see
        // suppressLoaderCategorySelect below for that) - if Products ended
        // up open here anyway, close it back to the same collapsed state it
        // was in before Save was tapped. fpd-main-bar renders at
        // z-index:2147483647 (the max possible 32-bit value - already the
        // ceiling, which is exactly why the loader has to live inside it
        // rather than try to out-z-index it), so a left-open tab panel
        // would completely bury #save-confirm-popup/#title-popup
        // (z-index:99999, home.component.scss) - display:flex set, but
        // invisible underneath it.
        moduleContentEl.style.display = 'none';
        mainBarEl?.querySelectorAll('.fpd-nav-item.fpd-active').forEach((el) => {
          el.classList.remove('fpd-active');
        });
      }
    }

    // Same mandatory first-session tap-loader guard openTitlePopup() used to
    // apply itself back when Save called it directly - moved one level
    // earlier so it now runs BEFORE this confirm popup instead of between
    // it and the real save popup. Without this, tapping Save as the very
    // first thing this mobile session would show this confirm popup, then
    // tapping Yes would silently swap it for the full-screen tap loader
    // instead of the actual save popup - confusing/looks broken since the
    // loader looks nothing like "the save popup" the user just confirmed.
    // Deferring to openSaveConfirmPopup() itself (not openTitlePopup()
    // directly) means once the loader completes, the user sees the confirm
    // popup as normal, and by the time Yes is tapped hasShownFirstEditorTabLoader
    // is already true so openTitlePopup()'s own matching guard no-ops.
    if (window.innerWidth <= 768 && !this.hasShownFirstEditorTabLoader) {
      this.pendingLoaderCompletionCallback = () => this.openSaveConfirmPopup();
      // waitForElements() (ngOnInit) relocates #fpd-loader inside
      // .fpd-module-content specifically so it inherits fpd-main-bar's
      // z-index instead of trying to out-z-index the vendor's own dialog
      // from outside it (see that comment - a past attempt at the latter
      // froze real iPhones). That relocation assumes SOME tab's panel is
      // genuinely open/rendered, which is true for every other caller of
      // startProductsTabLoader() (all reached via an actual .fpd-nav-item
      // tap). Save is a plain header button, not a tab - if it's the very
      // first thing tapped this session, no module-content is open yet, so
      // it's sitting at display:none and everything relocated inside it
      // (including our loader, regardless of its own inline styles)
      // collapses to an invisible 0x0 box. Since no tab is open, there's
      // also no vendor dialog actually on screen to compete z-index with -
      // safe to fall back to the loader's ORIGINAL plain top-level spot
      // (modest z-index:9999 from home.component.scss, not trying to beat
      // the vendor's extreme value) for just this one case.
      const loaderEl = document.getElementById('fpd-loader');
      if (loaderEl && loaderEl.parentElement !== document.body) {
        document.body.appendChild(loaderEl);
      }
      // No real tab is meant to open here - see suppressLoaderCategorySelect's
      // own declaration comment for why this matters (the tap handler would
      // otherwise open the Products panel as a side effect of each tap).
      this.suppressLoaderCategorySelect = true;
      this.startProductsTabLoader();
      return;
    }
    const popup = document.getElementById('save-confirm-popup');
    const yesBtn = document.getElementById('save-confirm-yes-btn');
    const cancelBtn = document.getElementById('save-confirm-cancel-btn');
    if (!popup || !yesBtn || !cancelBtn) return;

    this.ensurePopupAboveMainBar(popup);
    popup.style.display = 'flex';

    yesBtn.onclick = () => {
      popup.style.display = 'none';
      this.openTitlePopup();
    };
    cancelBtn.onclick = () => {
      popup.style.display = 'none';
    };
    popup.onclick = (e) => {
      if (e.target === popup) {
        popup.style.display = 'none';
      }
    };
  }

  openTitlePopup() {
    // Save Design isn't wired through the .fpd-nav-item click listener
    // (it's a plain button/custom popup, not one of the 7 mainBarModules
    // tabs), so it needs its own check for "is this the very first thing
    // opened this session" - defer to the same first-session tap loader
    // used by the other tabs, then re-enter this same function once it
    // completes (by which point hasShownFirstEditorTabLoader is true, so
    // this guard is skipped and the popup opens normally).
    if (window.innerWidth <= 768 && !this.hasShownFirstEditorTabLoader) {
      this.pendingLoaderCompletionCallback = () => this.openTitlePopup();
      this.startProductsTabLoader();
      return;
    }
    const popup = document.getElementById('title-popup');
    const input = document.getElementById('design-title-input') as HTMLInputElement;
    const btn = document.getElementById('save-title-btn');
    const closeBtn = document.getElementById('close-title-popup-btn');
    const preparingLoader = document.getElementById('title-popup-loader');
    if (!popup || !input || !btn) return;

    this.ensurePopupAboveMainBar(popup);
    popup.style.display = 'flex';

    // Fresh popup-open - re-arm the one-time "preparing your design" loader
    // (see titlePopupLoaderShown's declaration comment).
    this.titlePopupLoaderShown = false;
    if (preparingLoader) {
      preparingLoader.style.display = 'none';
    }
    input.onfocus = () => {
      if (this.titlePopupLoaderShown || !preparingLoader) return;
      this.titlePopupLoaderShown = true;
      preparingLoader.style.display = 'flex';
      setTimeout(() => {
        preparingLoader.style.display = 'none';
      }, 5000);
    };

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
    if (!loader) return;
    if (show) {
      this.recalculateLoaderHeight();
    }
    loader.style.display = show ? 'flex' : 'none';
  }

  // #fpd-loader lives inside .fpd-module-content (see waitForElements),
  // which sizes itself via the vendor's own
  // `height: calc(100% - var(--fpd-sidebar-nav-width))` rule - that chain
  // silently collapses to a much shorter box than the visible panel in the
  // mobile layout, which is why content inside it rendered pinned near the
  // top instead of centered. Measuring the real rendered height of
  // fpd-main-bar (the whole bottom-sheet, tab row included so the dimmed
  // backdrop covers that too) and setting it explicitly sidesteps that
  // calc() chain entirely.
  //
  // This isn't a one-time calculation: selectProductsCategory() changes the
  // visible category mid-flow, which changes how many product rows render
  // and therefore the panel's actual height. A value measured once at the
  // very first tap goes stale by the time later steps show new content, so
  // this gets re-measured before every step transition, not just on the
  // initial show.
  private recalculateLoaderHeight() {
    const loader = document.getElementById('fpd-loader');
    if (!loader) return;
    const mainBar = loader.closest('fpd-main-bar') as HTMLElement | null;
    // Full mainBar height, not minus the bottom .fpd-navigation tab row -
    // the dimmed backdrop is meant to cover that row too now, not stop
    // just above it.
    const contentHeight = mainBar ? mainBar.getBoundingClientRect().height : 0;
    // mainBar can still measure 0 here if the vendor widget hasn't finished
    // its own initial layout yet (a real race, not tab-dependent - seen even
    // several seconds after page load in testing) - most likely to be hit
    // when the Save button (openSaveConfirmPopup's guard) fires this as the
    // very first session action, since unlike a .fpd-nav-item tap it isn't
    // preceded by the vendor's own tab-switch work settling mainBar's
    // layout first. Previously this silently left loader.style.height
    // unset in that case, collapsing the whole overlay (and its Continue
    // button) to an invisible 0x0 box - falling back to the viewport height
    // guarantees a real, visible size either way; the real mainBar height
    // is still used whenever it's actually available, unchanged from before.
    loader.style.height = (contentHeight > 0 ? contentHeight : window.innerHeight) + 'px';
  }

  // Drives the Products-tab loader (mobile shows a 3-step tap sequence
  // instead of the shimmer-text design - see .fpd-loader-step-btn in
  // home.component.scss). No timers/countdowns here on purpose: both a
  // passive countdown and synthetic dispatchEvent() clicks (tried and
  // confirmed by the user NOT to fix [[ios_early_interaction_hang]]) were
  // dead ends. The editor kept hanging right after either one, but a REAL
  // manual tap fixed it instantly every time - meaning this is a native
  // WebKit touch/gesture-recognizer settling issue that only an actual
  // touch going through UIKit's gesture pipeline can resolve. So this asks
  // for exactly that: 3 sequential buttons, one real tap each.
  private startProductsTabLoader() {
    // This whole tap-popup exists only to work around the iOS
    // WKWebView-only hang - desktop was never affected, so skip it there
    // entirely rather than relying on CSS alone to hide it. The card's
    // positioning/background/etc. only exist inside the mobile media
    // query, so without this check the popup would still get force-shown
    // via the inline style.display below, just unstyled, on desktop.
    if (window.innerWidth > 768) return;
    this.showFPDLoading(true);
    // Once the mandatory first-session loader has completed on ANY tab
    // (see hasShownFirstEditorTabLoader), skip straight to the abbreviated
    // single-tap flow whenever this runs again - see
    // isAbbreviatedProductsLoader.
    this.isAbbreviatedProductsLoader = this.hasShownFirstEditorTabLoader;
    this.setProductsLoaderStep(1);
  }

  // Step 1/2/3 copy shown in #fpd-loader-active-text - see setProductsLoaderStep().
  private readonly productsLoaderStepCopy: Record<1 | 2 | 3, string> = {
    1: 'This tool is used to create your own self-design right on your device.',
    2: 'This device shows multiple categories - filter and browse through all of them.',
    3: "Now let's load the overlay images so you can preview them on your product.",
  };

  // Steps 1/2/3 and the final wait all live inside ONE card
  // (#fpd-loader-active-card) and share the same button pair
  // (#fpd-loader-active-btn/#fpd-loader-skip-btn, in #fpd-loader-step-btn-row)
  // - only the text and the button-row-vs-spinner visibility change between
  // them. This replaced 4 separately-positioned elements specifically so
  // the popup and the final spinner can never end up in different spots on
  // screen: there's only one box to position, reused for every step.
  private setProductsLoaderStep(step: 0 | 1 | 2 | 3) {
    this.currentProductsLoaderStep = step;
    const cardEl = document.getElementById('fpd-loader-active-card') as HTMLElement | null;
    const textEl = document.getElementById('fpd-loader-active-text') as HTMLElement | null;
    const btnRowEl = document.getElementById('fpd-loader-step-btn-row') as HTMLElement | null;
    const finalWait = document.getElementById('fpd-loader-final-wait');
    // The card itself defaults to display:none (see .fpd-loader-step-card
    // in home.component.scss) - it needs to be shown here since nothing
    // else does it now that there's only one shared card instead of one
    // per step. The white card panel/shadow only makes sense behind actual
    // text + a button (steps 1-3) - for the plain spinner "Loading..."
    // wait (step 0) it's cleared back to transparent so just the spinner
    // and text float over the dimmed backdrop, no white box.
    if (cardEl) {
      cardEl.style.display = 'flex';
      cardEl.style.background = step === 0 ? 'transparent' : '';
      cardEl.style.boxShadow = step === 0 ? 'none' : '';
    }
    if (step === 0) {
      if (textEl) textEl.style.display = 'none';
      if (btnRowEl) btnRowEl.style.display = 'none';
      if (finalWait) finalWait.style.display = 'flex';
    } else {
      if (textEl) {
        textEl.style.display = 'block';
        textEl.textContent = this.productsLoaderStepCopy[step];
      }
      if (btnRowEl) btnRowEl.style.display = 'flex';
      if (finalWait) finalWait.style.display = 'none';
    }
    this.updateProductsLoaderStep2State();
    this.recalculateLoaderHeight();
  }

  // Step 2 ("Load Products") stays disabled until the real product fetch
  // (see the getProducts()/fetch() flow earlier in this file) has actually
  // finished - tapping it before there's real data to show would just be
  // another blank tap. Native <button disabled> both blocks clicks and
  // renders visibly grayed out (see .fpd-loader-step-btn:disabled).
  private updateProductsLoaderStep2State() {
    const disabled = this.currentProductsLoaderStep === 2 && !this.productsDataReady;
    const btn = document.getElementById('fpd-loader-active-btn') as HTMLButtonElement | null;
    const skipBtn = document.getElementById('fpd-loader-skip-btn') as HTMLButtonElement | null;
    if (btn) btn.disabled = disabled;
    if (skipBtn) skipBtn.disabled = disabled;
  }

  // Step 3 doesn't hand off to the editor immediately - it shows a plain
  // 5s loading indicator (with a visible 5-4-3-2-1 countdown) first, no
  // buttons, nothing to tap: by this point all 3 required real taps have
  // already happened, so there's no hang-fix reason left to gate this
  // behind another tap; it's purely cosmetic. Single setInterval drives
  // both the countdown text and the dismissal in the same tick, same
  // "one timer, not two" fix as the Products-tab loader itself learned
  // the hard way (see [[styleflip_products_tab_loader]] history).
  //
  // Only runs on the FIRST tap-loader completion per app session, on
  // whichever tab that happens to be - repeat runs (hasShownProductsLoaderFinalWait
  // already true) skip straight to stopProductsTabLoader() instead, since
  // the 5s wait is pure polish and doesn't need repeating every time.
  private finishProductsTabLoader() {
    this.hasShownFirstEditorTabLoader = true;
    this.setProductsLoaderStep(0);

    if (this.hasShownProductsLoaderFinalWait) {
      this.stopProductsTabLoader();
      return;
    }
    this.hasShownProductsLoaderFinalWait = true;

    const finalWait = document.getElementById('fpd-loader-final-wait');
    if (finalWait) finalWait.style.display = 'flex';

    clearInterval(this.productsFinalWaitInterval);
    let remaining = 5;
    const countdownEl = document.getElementById('fpd-loader-final-countdown');
    if (countdownEl) countdownEl.textContent = String(remaining);
    this.productsFinalWaitInterval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0) {
        const el = document.getElementById('fpd-loader-final-countdown');
        if (el) el.textContent = String(remaining);
        return;
      }
      clearInterval(this.productsFinalWaitInterval);
      this.stopProductsTabLoader();
    }, 1000);
  }

  private stopProductsTabLoader() {
    clearInterval(this.productsFinalWaitInterval);
    this.showFPDLoading(false);
    // Always clear, same reasoning as pendingLoaderCompletionCallback below -
    // whether this loader run just genuinely finished or was abandoned
    // mid-sequence, it shouldn't affect any LATER, real .fpd-nav-item tab's
    // loader run.
    this.suppressLoaderCategorySelect = false;
    // See pendingLoaderCompletionCallback's declaration comment: only
    // actually run it on a genuine completion (hasShownFirstEditorTabLoader
    // was just set true by finishProductsTabLoader right before this
    // ran), not on abandonment (switching tabs mid-sequence also reaches
    // this function, but hasShownFirstEditorTabLoader is still false in
    // that case) - always clear it either way.
    if (this.pendingLoaderCompletionCallback) {
      const callback = this.pendingLoaderCompletionCallback;
      this.pendingLoaderCompletionCallback = null;
      if (this.hasShownFirstEditorTabLoader) callback();
    }
  }

  // Applies a real category filter as visible feedback for a loader-step
  // tap (see the document click listener above). Same synthetic-selection
  // technique as the saved-design restore flow elsewhere in this file
  // (search "Simulate actual category selection logic") - set the visible
  // dropdown value, fire input/change, then dispatch a click on the actual
  // category item so the vendor's own selection handler runs and the grid
  // re-renders for that category.
  private selectProductsCategory(index: number) {
    const categoryItems = Array.from(
      document.querySelectorAll('.fpd-product-categories .fpd-item')
    ) as HTMLElement[];
    const dropdownInput = document.querySelector(
      '.fpd-product-categories .fpd-dropdown-current'
    ) as HTMLInputElement | null;
    const item = categoryItems[index];
    if (!item || !dropdownInput) return;
    dropdownInput.value = item.textContent || '';
    dropdownInput.dispatchEvent(new Event('input', { bubbles: true }));
    dropdownInput.dispatchEvent(new Event('change', { bubbles: true }));
    item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
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