import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var FancyProductDesigner: any;
import $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const fpdTarget = document.getElementById('fpd-target');
        if (!fpdTarget) return;

        const appOptions = {
          productsJSON: 'assets/data/products/product-categories.json',
          designsJSON: 'assets/data/designs/design-categories.json',
          langJSON: 'assets/data/langs/default.json',
          // layout: 'topbar',
          stageWidth: 1200,
          stageHeight: 600,
          initialActiveModule: "products",
          toolbarPlacement: "inside-top",
          editorMode: false,
          smartGuides: true,
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
              boundingBox: "Base"
          },
          actions: {
              'top': ['download', 'share', 'print', 'save', 'preview-lightbox', 'paste'],
              'right': ['manage-layers', 'magnify-glass', 'zoom', 'reset-product', 'qr-code', 'ruler'],
              'bottom': ['undo', 'redo'],
              'left': [],
              'center': ['undo', 'redo','download','preview-lightbox','paste']
          },
          selectedColor: "#f5f5f5",
          boundingBoxColor: "#005ede",
          outOfBoundaryColor: "#990000",
          cornerIconColor: "#000000",
          mainBarModules: [
            'products',
            'images',
            'text',
            'designs',
            'manage-layers',
            'text-layers',
            'save-load'
          ],
          fonts: [
            { name: 'Roboto', url: 'google' },
            { name: 'Open Sans', url: 'google' },
            { name: 'Poppins', url: 'google' },
            { name: 'Lato', url: 'google' },
            { name: 'Oswald', url: 'google' },
            { name: 'Raleway', url: 'google' },
            { name: 'Montserrat', url: 'google' },
            { name: 'Playfair Display', url: 'google' },
            { name: 'Pacifico', url: 'google' },
            { name: 'Lobster', url: 'google' },
            { name: 'Bebas Neue', url: 'google' },
            { name: 'Dancing Script', url: 'google' },
            { name: 'Courier Prime', url: 'google' },
            { name: 'Caveat', url: 'google' },
            { name: 'Abril Fatface', url: 'google' },
            { name: 'Lobster', url: 'google' },
            {
              name: 'Aller',
              url: 'assets/fpd/fonts/Aller.ttf',
              variants: {
                'n7': 'assets/fpd/fonts/Aller__bold.ttf',
                'i4': 'assets/fpd/fonts/Aller__italic.ttf',
                'i7': 'assets/fpd/fonts/Aller__bolditalic.ttf'
              }
            },
            { name: 'Pacifico', url: 'assets/fpd/fonts/Pacifico.ttf' }
          ],
          textTemplates: [
            {
              text: "Text Template Content",
              properties: {
                fontSize: 30,
                fontFamily: "Lobster"
              }
            },
            {
              text: "Another Text Template",
              properties: {
                fontSize: 50,
                fontFamily: "Pacifico"
              }
            }
          ],
          fileServerURL: 'https://file.handler.php.stageprojects.xyz/',
          uploadZone: {
            useDataURL: true  // ✅ allows upload directly in browser
          },
          facebookAppId: '',
          instagramClientId: '',
          instagramRedirectUri: 'assets/html/instagram_auth.html',
          instagramTokenUri: '',
          colorPickerPalette: [
            "#000", "#f4cccc", "#fce5cd", "#fff2cc",
            "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9",
            "#ead1dc", '#5f27cd', '#222f3e', '#10ac84'
          ],
          pixabayApiKey: '',
          pixabayLang: 'en',
          pixabayHighResImages: false,
          elementParameters: {},
        };

        try {
          const designer = new FancyProductDesigner(document.querySelector("#clothing-designer"), appOptions);

          // ✅ Hook up buttons AFTER FPD is ready
          $('#print-button').click(() => designer.print());
          $('#download-button').click(() => designer.download('png'));
          $('#preview-button').click(() => designer.previewLightbox());
          $('#save-button').click(() => {
            designer.getProduct().then((data: any) => {
              console.log('Saved Design Data:', data);
            });
          });

        } catch (error) {
          console.error('FPD init failed:', error);
        }
      }, 300);
    }
  }
}
