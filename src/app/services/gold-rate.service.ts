import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MetalPrice, KaratPrice } from '../interfaces/metal-price.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class GoldRateService {
  private goldPriceSubject = new BehaviorSubject<MetalPrice | null>(null);
  public goldPrice$ = this.goldPriceSubject.asObservable();
  
  private readonly GOLD_API_URL = 'https://api.gold-api.com/price/XAU';
  private readonly REFRESH_INTERVAL = 60000; // 60 seconds

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  /**
   * Start fetching gold prices at regular intervals
   */
  startFetchingGoldPrices(): void {
    // Initial fetch
    this.fetchGoldPrice().pipe(
      tap(data => this.updateGoldPrice(data)),
      catchError(error => {
        this.errorHandler.handleError('Failed to fetch gold price', error);
        return throwError(() => error);
      })
    ).subscribe();

    // Set up interval for regular updates
    interval(this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.fetchGoldPrice()),
      tap(data => this.updateGoldPrice(data)),
      catchError(error => {
        this.errorHandler.handleError('Failed to fetch gold price', error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Fetch gold price from API
   */
  private fetchGoldPrice(): Observable<MetalPrice> {
    return this.http.get<MetalPrice>(this.GOLD_API_URL);
  }

  /**
   * Update gold price with calculated change values
   */
  private updateGoldPrice(newPrice: MetalPrice): void {
    const currentPrice = this.goldPriceSubject.value;
    
    if (currentPrice) {
      newPrice.previousPrice = currentPrice.price;
      newPrice.priceChange = newPrice.price - currentPrice.price;
      newPrice.priceChangePercent = (newPrice.priceChange / currentPrice.price) * 100;
    }
    
    this.goldPriceSubject.next(newPrice);
  }

  /**
   * Calculate prices for different karats of gold
   */
  calculateKaratPrices(goldPrice: number): KaratPrice[] {
    return [
      { karat: 24, purity: 0.999, pricePerGram: goldPrice * 0.999 / 31.1035 },
      { karat: 22, purity: 0.916, pricePerGram: goldPrice * 0.916 / 31.1035 },
      { karat: 18, purity: 0.750, pricePerGram: goldPrice * 0.750 / 31.1035 },
      { karat: 14, purity: 0.585, pricePerGram: goldPrice * 0.585 / 31.1035 }
    ];
  }
}
