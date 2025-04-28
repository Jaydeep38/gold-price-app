import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChargesConfig } from '../interfaces/metal-price.interface';

@Injectable({
  providedIn: 'root'
})
export class ChargesService {
  // Default values for GST and service charges
  private chargesSubject = new BehaviorSubject<ChargesConfig>({
    gst: 3, // 3% GST
    serviceCharge: 1.5, // 1.5% service charge
  });
  
  public charges$ = this.chargesSubject.asObservable();

  constructor() { }

  /**
   * Get the current charges configuration
   */
  getCharges(): ChargesConfig {
    return this.chargesSubject.value;
  }

  /**
   * Update charges configuration
   */
  updateCharges(newCharges: ChargesConfig): void {
    this.chargesSubject.next(newCharges);
  }

  /**
   * Calculate final price with GST and service charges
   * @param basePrice The base price in INR
   * @returns Final price after adding GST and service charges
   */
  calculateFinalPrice(basePrice: number): number {
    const charges = this.chargesSubject.value;
    const gstAmount = (basePrice * charges.gst) / 100;
    const serviceChargeAmount = (basePrice * charges.serviceCharge) / 100;
    
    return basePrice + gstAmount + serviceChargeAmount;
  }
} 