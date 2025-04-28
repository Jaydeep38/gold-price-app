import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JewelryPage } from './jewelry.page';

const routes: Routes = [
  {
    path: '',
    component: JewelryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JewelryPageRoutingModule {}
