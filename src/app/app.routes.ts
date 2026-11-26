import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DesignerComponent } from './designer/designer.component';
import { PrivacyComponent } from './privacy/privacy.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: ':manufacturer/:slug', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'savedesign', component: HomeComponent },

    { path : 'designer', component: DesignerComponent},
    { path : 'privacy', component: PrivacyComponent},
    // Any other path (wrong product link like /foo or /a/b/c) used to
    // match nothing and render a blank page. It opens the editor, which
    // shows "product not available" + related products for it.
    { path: '**', component: HomeComponent }
];
