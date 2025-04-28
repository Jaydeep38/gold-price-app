import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'live-rate',
    pathMatch: 'full'
  },
  {
    path: 'live-rate',
    loadChildren: () => import('./pages/live-rate/live-rate.module').then( m => m.LiveRatePageModule)
  },
  {
    path: 'jewelry',
    loadChildren: () => import('./pages/jewelry/jewelry.module').then( m => m.JewelryPageModule)
  },
  {
    path: 'calculator',
    loadChildren: () => import('./pages/calculator/calculator.module').then( m => m.CalculatorPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
