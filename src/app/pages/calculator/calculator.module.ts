import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalculatorPageRoutingModule } from './calculator-routing.module';

import { CalculatorPage } from './calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalculatorPageRoutingModule
  ],
  declarations: [CalculatorPage]
})
export class CalculatorPageModule {}
