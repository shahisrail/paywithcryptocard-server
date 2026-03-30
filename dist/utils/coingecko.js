"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToUSD = exports.getCryptoPrice = exports.getCryptoPrices = void 0;
// CoinGecko API for crypto prices
const getCryptoPrices = async () => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usdt,tether&vs_currencies=usd');
        if (!response.ok) {
            throw new Error('Failed to fetch crypto prices');
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching crypto prices:', error);
        throw error;
    }
};
exports.getCryptoPrices = getCryptoPrices;
// Get price for specific cryptocurrency
const getCryptoPrice = async (currency) => {
    try {
        const prices = await (0, exports.getCryptoPrices)();
        const priceMap = {
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
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd');
            const data = await response.json();
            return data.monero?.usd || 0;
        }
        const price = prices[coinId]?.usd || 0;
        return price;
    }
    catch (error) {
        console.error('Error fetching crypto price:', error);
        throw error;
    }
};
exports.getCryptoPrice = getCryptoPrice;
// Convert crypto amount to USD
const convertToUSD = async (currency, amount) => {
    const price = await (0, exports.getCryptoPrice)(currency);
    return amount * price;
};
exports.convertToUSD = convertToUSD;
