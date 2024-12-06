import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'capturar',
    loadComponent: () => import('./pages/capturar/capturar.page').then( m => m.CapturarPage)
  },
  {
    path: 'posts',
    loadComponent: () => import('./pages/posts/posts.page').then( m => m.PostsPage)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then( m => m.ProductsPage)
  }
];
