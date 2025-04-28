import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  /**
   * Handle errors from API calls
   * @param message Custom error message
   * @param error The error object
   */
  handleError(message: string, error: any): void {
    console.error(`${message}:`, error);
    // In a production app, you might want to send this to a logging service
  }
}
