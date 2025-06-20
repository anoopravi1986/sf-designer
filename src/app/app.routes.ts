import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DesignerComponent } from './designer/designer.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: ':manufacturer/:slug', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path : 'designer', component: DesignerComponent}
];
