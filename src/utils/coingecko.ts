interface CryptoPrice {
  usd: number;
}

interface CoinGeckoResponse {
  [key: string]: CryptoPrice;
}

// CoinGecko API for crypto prices
export const getCryptoPrices = async (): Promise<CoinGeckoResponse> => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usdt,tether&vs_currencies=usd'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }

    const data = await response.json() as CoinGeckoResponse;

    return data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
};

// Get price for specific cryptocurrency
export const getCryptoPrice = async (currency: string): Promise<number> => {
  try {
    const prices = await getCryptoPrices();

    const priceMap: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      USDT_ERC20: 'usdt',
      USDT_TRC20: 'usdt',
      XMR: 'monero',
    };

    const coinId = priceMap[currency];
    if (!coinId) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    // For USDT, return 1 (stablecoin)
    if (currency.includes('USDT')) {
      return 1;
    }

    if (coinId === 'monero') {
      // Fetch Monero separately
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd'
      );
      const data = await response.json() as CoinGeckoResponse;
      return data.monero?.usd || 0;
    }

    const price = prices[coinId]?.usd || 0;
    return price;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw error;
  }
};

// Convert crypto amount to USD
export const convertToUSD = async (
  currency: string,
  amount: number
): Promise<number> => {
  const price = await getCryptoPrice(currency);
  return amount * price;
};
