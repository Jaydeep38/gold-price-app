# Fancy Jewellers App

A real-time gold and silver price tracking application built with Ionic and Angular.

## Features

- Real-time gold and silver price tracking
- Automatic price updates every 60 seconds
- USD to INR currency conversion
- Price calculation for different karats and purities
- Display of prices with GST and service charges
- Responsive UI with tabs for easy navigation

## API Integrations

- Gold Price API: `https://api.gold-api.com/price/XAU`
- Silver Price API: `https://api.gold-api.com/price/XAG`
- Currency Conversion: `https://open.er-api.com/v6/latest/USD`

## Project Structure

The project follows a modular structure:

```
src/
├── app/
│   ├── interfaces/      # TypeScript interfaces
│   ├── pages/           # Page components
│   ├── services/        # Service classes for API calls and calculations
│   └── ...
├── assets/             # Static assets
├── environments/       # Environment configuration
└── ...
```

## Services

- `GoldRateService` - Fetches gold prices and calculates karat prices
- `SilverRateService` - Fetches silver prices and calculates purity prices
- `CurrencyService` - Handles USD to INR conversion
- `ChargesService` - Calculates GST and service charges

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- Ionic CLI (v6.x or later)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   ionic serve
   ```

### Building for Production

To build for production:

```
ionic build --prod
```

## License

This project is licensed under the MIT License. 