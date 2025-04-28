import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { MetalPrice, KaratPrice } from '../interfaces/metal-price.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SilverRateService {
  private silverPriceSubject = new BehaviorSubject<MetalPrice | null>(null);
  public silverPrice$ = this.silverPriceSubject.asObservable();
  
  private readonly SILVER_API_URL = 'https://api.gold-api.com/price/XAG';
  private readonly REFRESH_INTERVAL = 60000; // 60 seconds

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  /**
   * Start fetching silver prices at regular intervals
   */
  startFetchingSilverPrices(): void {
    // Initial fetch
    this.fetchSilverPrice().pipe(
      tap(data => this.updateSilverPrice(data)),
      catchError(error => {
        this.errorHandler.handleError('Failed to fetch silver price', error);
        return throwError(() => error);
      })
    ).subscribe();

    // Set up interval for regular updates
    interval(this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.fetchSilverPrice()),
      tap(data => this.updateSilverPrice(data)),
      catchError(error => {
        this.errorHandler.handleError('Failed to fetch silver price', error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Fetch silver price from API
   */
  private fetchSilverPrice(): Observable<MetalPrice> {
    return this.http.get<MetalPrice>(this.SILVER_API_URL);
  }

  /**
   * Update silver price with calculated change values
   */
  private updateSilverPrice(newPrice: MetalPrice): void {
    const currentPrice = this.silverPriceSubject.value;
    
    if (currentPrice) {
      newPrice.previousPrice = currentPrice.price;
      newPrice.priceChange = newPrice.price - currentPrice.price;
      newPrice.priceChangePercent = (newPrice.priceChange / currentPrice.price) * 100;
    }
    
    this.silverPriceSubject.next(newPrice);
  }

  /**
   * Calculate prices for different purities of silver
   */
  calculateSilverPurities(silverPrice: number): KaratPrice[] {
    return [
      { karat: 999, purity: 0.999, pricePerGram: silverPrice * 0.999 / 31.1035 },
      { karat: 925, purity: 0.925, pricePerGram: silverPrice * 0.925 / 31.1035 },
      { karat: 900, purity: 0.900, pricePerGram: silverPrice * 0.900 / 31.1035 },
      { karat: 800, purity: 0.800, pricePerGram: silverPrice * 0.800 / 31.1035 }
    ];
  }
} 