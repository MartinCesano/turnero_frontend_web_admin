import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./template/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'list-products',
        loadComponent: () => import('./template/products-abm/products-abm.component').then(m => m.ProductsABMComponent)
      },
      {path: 'form-products',
        loadComponent: () => import('./template/form-products/form-products.component').then(m => m.FormProductsComponent)
      }     
    ],
    
    canActivate: [AuthGuardService],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
