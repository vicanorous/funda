/**
 * Pollar Guaranteed FX Exchange Service
 * Institutional Treasury Engine supporting Nigerian Naira (NGN), USD, EUR, GBP, and HKD.
 */

export interface FxQuote {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  receivedAmount: number;
  marketMidRate: number;
  fundaSpreadPercent: number; // Institutional spread, e.g. 0.12%
  guaranteedRate: number;
  savedVsRetailBank: number;
  savingsCurrency: string;
  lockExpirySeconds: number;
  quoteId: string;
  timestamp: string;
}

export interface SupportedCurrency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', decimals: 2 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', decimals: 2 },
];

export class PollarExchangeService {
  // Base mid-market rates against USD (USD = 1.0)
  private static readonly RATES_TO_USD: Record<string, number> = {
    USD: 1.0,
    NGN: 1605.50, // 1 USD = 1,605.50 NGN
    EUR: 0.9240,  // 1 USD = 0.9240 EUR
    GBP: 0.7890,  // 1 USD = 0.7890 GBP
    HKD: 7.8225,  // 1 USD = 7.8225 HKD
  };

  private static readonly INSTITUTIONAL_SPREAD_PCT = 0.0012; // 0.12% wholesale spread
  private static readonly RETAIL_BANK_SPREAD_PCT = 0.0185;   // 1.85% commercial retail markup

  /**
   * Calculates mid-market rate between any two supported currencies
   */
  public static getMidMarketRate(from: string, to: string): number {
    const fromRate = this.RATES_TO_USD[from.toUpperCase()] || 1.0;
    const toRate = this.RATES_TO_USD[to.toUpperCase()] || 1.0;
    return toRate / fromRate;
  }

  /**
   * Generates a guaranteed institutional FX quote with 45-second lock
   */
  public static getQuote(from: string, to: string, amount: number): FxQuote {
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();
    const midRate = this.getMidMarketRate(fromUpper, toUpper);

    // Wholesale guaranteed rate applies the tight 0.12% institutional spread
    const guaranteedRate = midRate * (1 - this.INSTITUTIONAL_SPREAD_PCT);
    const retailBankRate = midRate * (1 - this.RETAIL_BANK_SPREAD_PCT);

    const receivedAmount = Number((amount * guaranteedRate).toFixed(2));
    const retailAmount = amount * retailBankRate;
    const savedAmount = Math.max(Number((receivedAmount - retailAmount).toFixed(2)), 0);

    const quoteId = `qte_plr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

    return {
      fromCurrency: fromUpper,
      toCurrency: toUpper,
      amount,
      receivedAmount,
      marketMidRate: Number(midRate.toFixed(4)),
      fundaSpreadPercent: 0.12,
      guaranteedRate: Number(guaranteedRate.toFixed(4)),
      savedVsRetailBank: savedAmount,
      savingsCurrency: toUpper,
      lockExpirySeconds: 45,
      quoteId,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Direct output calculation
   */
  public static calculateOutput(from: string, to: string, amount: number): number {
    const quote = this.getQuote(from, to, amount);
    return quote.receivedAmount;
  }

  /**
   * Currency formatting helper
   */
  public static formatAmount(amount: number, currency: string): string {
    const curr = SUPPORTED_CURRENCIES.find((c) => c.code === currency.toUpperCase());
    const symbol = curr?.symbol || `${currency} `;

    if (currency.toUpperCase() === 'NGN') {
      return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (currency.toUpperCase() === 'USD') {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (currency.toUpperCase() === 'EUR') {
      return `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (currency.toUpperCase() === 'GBP') {
      return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
