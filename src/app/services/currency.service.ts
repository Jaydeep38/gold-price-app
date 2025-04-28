import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ConversionRate } from '../interfaces/metal-price.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private conversionRateSubject = new BehaviorSubject<number>(85); // Default fallback rate
  public conversionRate$ = this.conversionRateSubject.asObservable();
  
  private readonly EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest/USD';
  private readonly REFRESH_INTERVAL = 3600000; // 1 hour (exchange rates don't change frequently)

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  /**
   * Start fetching currency conversion rates at regular intervals
   */
  startFetchingConversionRates(): void {
    // Initial fetch
    this.fetchConversionRate().pipe(
      tap(data => this.updateConversionRate(data)),
      catchError(error => {
        this.errorHandler.handleError('Failed to fetch conversion rate', error);
        return throwError(() => error);
      })
    ).subscribe();

    // Set up interval for regular updates
    interval(this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.fetchConversionRate()),
      tap(data => this.updateConversionRate(data)),
      catchError(error => {
        this.errorHandler.handleError('Failed to fetch conversion rate', error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Fetch USD to INR conversion rate
   */
  private fetchConversionRate(): Observable<any> {
    return this.http.get<any>(this.EXCHANGE_API_URL);
  }

  /**
   * Update the conversion rate
   */
  private updateConversionRate(data: any): void {
    if (data && data.rates && data.rates.INR) {
      this.conversionRateSubject.next(data.rates.INR);
    }
  }

  /**
   * Convert USD to INR
   */
  convertUsdToInr(usdAmount: number): number {
    const rate = this.conversionRateSubject.value;
    return usdAmount * rate;
  }
} 