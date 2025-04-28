import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoldRateService } from '../../services/gold-rate.service';
import { CurrencyService } from '../../services/currency.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
  standalone: false,
})
export class CalculatorPage implements OnInit {
  currentGoldRate: number = 0;
  selectedQuality: string = '24K';
  selectedMakingCharge: number = 10;
  weight: number = 0;
  
  // Calculation results
  showResults: boolean = false;
  totalPrice: number = 0;
  
  // Quality purity values
  qualityPurity = {
    '24K': 0.999,
    '22K': 0.916,
    '20K': 0.833,
    '18K': 0.750
  };

  constructor(
    private router: Router,
    private goldService: GoldRateService,
    private currencyService: CurrencyService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.getCurrentGoldRate();
  }

  getCurrentGoldRate() {
    this.goldService.goldPrice$.subscribe(goldPrice => {
      if (goldPrice) {
        // Get the current USD to INR exchange rate
        this.currencyService.conversionRate$.subscribe(rate => {
          const exchangeRate = rate || 83; // Default to 83 if not available
          
          // Gold price is typically in USD per troy ounce
          // 1 troy ounce = 31.1035 grams
          // 1 Tola = 10 grams (traditional Indian unit)
          const goldPricePerOunceUsd = goldPrice.price;
          
          // Standard calculation for 10g price in INR:
          // (USD price per oz) × (INR/USD rate) × (10g/31.1035g) × (purity)
          // For 24K (99.9% pure gold)
          this.currentGoldRate = (goldPricePerOunceUsd * exchangeRate * 10 * 0.999) / 31.1035;
        });
      }
    });
  }

  selectQuality(quality: string) {
    this.selectedQuality = quality;
    // Hide results when changing quality
    this.showResults = false;
  }

  selectMakingCharge(charge: number) {
    this.selectedMakingCharge = charge;
    // Hide results when changing making charge
    this.showResults = false;
  }

  navigateToPage(page: string) {
    this.router.navigateByUrl(`/${page}`);
  }

  calculatePrice() {
    if (!this.weight || this.weight <= 0) {
      this.showAlert('Error', 'Please enter a valid weight.');
      return;
    }

    // Calculate base gold price based on quality and weight
    const purity = this.qualityPurity[this.selectedQuality as keyof typeof this.qualityPurity];
    const baseGoldPrice = this.currentGoldRate * purity * (this.weight / 10);
    
    // Calculate making charges
    const makingCharge = baseGoldPrice * (this.selectedMakingCharge / 100);
    
    // Add GST (assume 3%)
    const gst = (baseGoldPrice + makingCharge) * 0.03;
    
    // Total price
    this.totalPrice = baseGoldPrice + makingCharge + gst;
    
    // Show results section
    this.showResults = true;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }
}
