export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_this',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendUrl: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
    : ['http://localhost:3000', 'https://paywithcryptocard.net'],

  crypto: {
    btc: process.env.BTC_ADDRESS || '',
    eth: process.env.ETH_ADDRESS || '',
    usdtErc20: process.env.USDT_ERC20_ADDRESS || '',
    usdtTrc20: process.env.USDT_TRC20_ADDRESS || '',
    usdcErc20: process.env.USDC_ERC20_ADDRESS || '',
    xmr: process.env.XMR_ADDRESS || '',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@paywithcrypto.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};
