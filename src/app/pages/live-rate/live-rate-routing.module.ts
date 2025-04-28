import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiveRatePage } from './live-rate.page';

const routes: Routes = [
  {
    path: '',
    component: LiveRatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LiveRatePageRoutingModule {}
