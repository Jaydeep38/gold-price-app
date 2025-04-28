import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, combineLatest, takeUntil, interval } from 'rxjs';
import { KaratPrice, MetalPrice } from '../../interfaces/metal-price.interface';
import { GoldRateService } from '../../services/gold-rate.service';
import { SilverRateService } from '../../services/silver-rate.service';
import { CurrencyService } from '../../services/currency.service';
import { ChargesService } from '../../services/charges.service';
import { Router } from '@angular/router';

interface CoinPrice {
  weight: number;
  price: number;
}

@Component({
  selector: 'app-live-rate',
  templateUrl: './live-rate.page.html',
  styleUrls: ['./live-rate.page.scss'],
  standalone: false,
})
export class LiveRatePage implements OnInit, OnDestroy {
  selectedTab: 'gold' | 'silver' = 'gold';
  showingCoins: boolean = false;
  
  goldPrice: MetalPrice | null = null;
  silverPrice: MetalPrice | null = null;
  usdToInrRate: number = 85; // Default fallback value
  
  goldPrices: KaratPrice[] = [];
  silverPrices: KaratPrice[] = [];
  
  finalGoldPriceInr: number = 0;
  finalSilverPriceInr: number = 0;
  
  goldCoins: CoinPrice[] = [];
  silverCoins: CoinPrice[] = [];
  
  private destroy$ = new Subject<void>();
  private refreshInterval = 30000; // 30 seconds

  constructor(
    private goldService: GoldRateService,
    private silverService: SilverRateService,
    private currencyService: CurrencyService,
    private chargesService: ChargesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadInitialData();
    
    // Set up interval for refreshing data every 30 seconds
    interval(this.refreshInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.selectedTab === 'gold') {
          this.loadGoldData();
        } else {
          this.loadSilverData();
        }
        this.currencyService.startFetchingConversionRates();
      });
  }
  
  loadInitialData() {
    // Start fetching data for the initial tab
    if (this.selectedTab === 'gold') {
      this.loadGoldData();
    } else {
      this.loadSilverData();
    }
    
    // Always load the currency rate
    this.currencyService.startFetchingConversionRates();
  }
  
  loadGoldData() {
    this.goldService.startFetchingGoldPrices();
    
    // Subscribe to gold price updates
    combineLatest([
      this.goldService.goldPrice$,
      this.currencyService.conversionRate$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([goldPrice, usdToInrRate]) => {
      if (goldPrice) {
        this.goldPrice = goldPrice;
        this.usdToInrRate = usdToInrRate;
        
        // Calculate gold prices for different karats
        this.goldPrices = this.goldService.calculateKaratPrices(goldPrice.price);
        
        // Calculate final price with GST and service charges
        const baseGoldPriceInr = this.currencyService.convertUsdToInr(goldPrice.price);
        this.finalGoldPriceInr = this.chargesService.calculateFinalPrice(baseGoldPriceInr);
        
        // Calculate coin prices
        this.calculateGoldCoinPrices();
      }
    });
  }
  
  loadSilverData() {
    this.silverService.startFetchingSilverPrices();
    
    // Subscribe to silver price updates
    combineLatest([
      this.silverService.silverPrice$,
      this.currencyService.conversionRate$
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([silverPrice, usdToInrRate]) => {
      if (silverPrice) {
        this.silverPrice = silverPrice;
        this.usdToInrRate = usdToInrRate;
        
        // Calculate silver prices for different purities
        this.silverPrices = this.silverService.calculateSilverPurities(silverPrice.price);
        
        // Calculate final price with GST and service charges
        const baseSilverPriceInr = this.currencyService.convertUsdToInr(silverPrice.price);
        this.finalSilverPriceInr = this.chargesService.calculateFinalPrice(baseSilverPriceInr);
        
        // Calculate coin prices
        this.calculateSilverCoinPrices();
      }
    });
  }
  
  calculateGoldCoinPrices() {
    if (!this.goldPrice) return;
    
    // 24K gold price per gram in INR
    const goldPricePerGram = this.currencyService.convertUsdToInr(this.goldPrice.price) * 0.999 / 31.1035;
    
    // Common gold coin weights
    this.goldCoins = [
      { weight: 1, price: goldPricePerGram * 1 },
      { weight: 2, price: goldPricePerGram * 2 },
      { weight: 5, price: goldPricePerGram * 5 },
      { weight: 8, price: goldPricePerGram * 8 },
      { weight: 10, price: goldPricePerGram * 10 }
    ];
  }
  
  calculateSilverCoinPrices() {
    if (!this.silverPrice) return;
    
    // 999 silver price per gram in INR
    const silverPricePerGram = this.currencyService.convertUsdToInr(this.silverPrice.price) * 0.999 / 31.1035;
    
    // Common silver coin weights
    this.silverCoins = [
      { weight: 10, price: silverPricePerGram * 10 },
      { weight: 20, price: silverPricePerGram * 20 },
      { weight: 50, price: silverPricePerGram * 50 },
      { weight: 100, price: silverPricePerGram * 100 },
      { weight: 1000, price: silverPricePerGram * 1000 }
    ];
  }
  
  segmentChanged(event: any) {
    this.selectedTab = event.detail.value;
    this.showingCoins = false; // Reset to standard view when switching tabs
    
    // Load data for the selected tab
    if (this.selectedTab === 'gold') {
      // Only load if not already loaded
      if (!this.goldPrice) {
        this.loadGoldData();
      }
    } else {
      // Only load if not already loaded
      if (!this.silverPrice) {
        this.loadSilverData();
      }
    }
  }
  
  showCoinRates(metal: 'gold' | 'silver') {
    this.showingCoins = true;
  }
  
  showStandardRates() {
    this.showingCoins = false;
  }
  
  doRefresh(event: any) {
    // Refresh the current tab's data
    if (this.selectedTab === 'gold') {
      this.loadGoldData();
    } else {
      this.loadSilverData();
    }
    
    // Also refresh currency rates
    this.currencyService.startFetchingConversionRates();
    
    // Complete the refresher
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  
  navigateToPage(page: string) {
    this.router.navigateByUrl(`/${page}`);
  }

  /**
   * Get CSS class based on price change
   */
  getPriceChangeClass(priceChange: number | undefined): string {
    if (!priceChange) return '';
    return priceChange > 0 ? 'price-up' : priceChange < 0 ? 'price-down' : '';
  }
  
  /**
   * Format price change with + or - sign
   */
  formatPriceChange(priceChange: number | undefined): string {
    if (!priceChange) return '0';
    const sign = priceChange > 0 ? '+' : '';
    return `${sign}${Math.abs(priceChange).toFixed(2)}`;
  }
  
  /**
   * Calculate 24K gold price in INR for 1 Tola (10 grams)
   */
  get24KGoldPrice(): number {
    if (!this.goldPrice) return 0;
    
    // Gold price is typically in USD per troy ounce
    // 1 troy ounce = 31.1035 grams
    // 1 Tola = 10 grams (traditional Indian unit)
    
    // For 24K gold (99.9% pure)
    // Most current gold price ~$2,375 per ounce
    const goldPricePerOunceUsd = this.goldPrice.price || 2375; // Default if missing
    const exchangeRate = this.usdToInrRate || 83; // Default exchange rate
    
    // Standard calculation for 10g price in INR:
    // (USD price per oz) × (INR/USD rate) × (10g/31.1035g) × (purity)
    // For example: 2375 × 83 × (10/31.1035) × 0.999 ≈ 91,289 INR
    
    return (goldPricePerOunceUsd * exchangeRate * 10 * 0.999) / 31.1035;
  }
  
  /**
   * Format price change in INR with + or - sign
   */
  formatPriceChangeInr(priceChange: number | undefined): string {
    if (!priceChange) return '0';
    
    // Convert USD price change to INR
    const changeInInr = priceChange * (this.usdToInrRate || 83);
    
    // Calculate for 10g (standard Indian measurement)
    // The price change is per ounce, so we need to convert to per 10g
    const changeInInrPer10g = (changeInInr * 10) / 31.1035;
    
    const sign = changeInInrPer10g > 0 ? '+' : '';
    return `${sign}${Math.abs(changeInInrPer10g).toFixed(2)}`;
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
