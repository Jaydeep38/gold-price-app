export interface MetalPrice {
  name: string;
  price: number;
  symbol: string;
  updatedAt: string;
  updatedAtReadable: string;
  previousPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
}

export interface ConversionRate {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
}

export interface ChargesConfig {
  gst: number;
  serviceCharge: number;
}

export interface KaratPrice {
  karat: number;
  purity: number;
  pricePerGram: number;
} 