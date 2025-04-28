import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveRatePageRoutingModule } from './live-rate-routing.module';

import { LiveRatePage } from './live-rate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveRatePageRoutingModule
  ],
  declarations: [LiveRatePage]
})
export class LiveRatePageModule {}
