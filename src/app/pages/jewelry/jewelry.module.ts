import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JewelryPageRoutingModule } from './jewelry-routing.module';

import { JewelryPage } from './jewelry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JewelryPageRoutingModule
  ],
  declarations: [JewelryPage]
})
export class JewelryPageModule {}
