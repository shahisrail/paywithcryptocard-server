# Environment Configuration

## Current Setup

### Backend URL: `https://server-puce-mu.vercel.app`

### Frontend URL: `https://guileless-dodol-9404f4.netlify.app`

## Configuration Files

1. **`.env`** - Local development (current: using Vercel URL)
2. **`.env.example`** - Template for new developers
3. **`.env.production.example`** - Template for Vercel production

## Vercel Environment Variables

When deploying to Vercel, set these in your project settings:

### Required Variables
```
MONGODB_URI=mongodb+srv://test:test@cluster0.iavnhb8.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
FRONTEND_URL=https://guileless-dodol-9404f4.netlify.app
```

### Optional Variables (with defaults)
```
NODE_ENV=production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@paywithcrypto.com
ADMIN_PASSWORD=Admin@123
```

### Crypto Addresses
```
BTC_ADDRESS=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
ETH_ADDRESS=0x71C7656EC7ab88b098defB751B7401B5f6d8976F
USDT_ERC20_ADDRESS=0x71C7656EC7ab88b098defB751B7401B5f6d8976F
USDT_TRC20_ADDRESS=TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf
XMR_ADDRESS=44AFFq5kSiGBoZ4NMDwYtN187rua5UdjnU8oYfYaUCSt5MVNVq2zSRf7FHBVPL7pKGFHLyKAhA8tQEyEYbkGiqz
```

### Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## CORS Configuration

Your backend is configured to accept requests from `FRONTEND_URL`. Make sure this matches your deployed frontend URL.

Current CORS setting in `.env`:
```
FRONTEND_URL=https://guileless-dodol-9404f4.netlify.app
```

## Testing Endpoints

Once deployed, test these URLs:

- Health: `https://server-puce-mu.vercel.app/health`
- API Docs: `https://server-puce-mu.vercel.app/api-docs`
- Register: `https://server-puce-mu.vercel.app/api/auth/register`
- Login: `https://server-puce-mu.vercel.app/api/auth/login`

## Security Reminders

⚠️ **Before Production:**
1. Change `JWT_SECRET` to a strong, unique key
2. Change default admin credentials
3. Update crypto addresses to your actual wallets
4. Use MongoDB Atlas with strong password
5. Enable MongoDB IP whitelist for Vercel

## Frontend Integration

In your frontend, set the API base URL to:

```javascript
const API_BASE_URL = 'https://server-puce-mu.vercel.app/api';
```

**Frontend URL:** https://guileless-dodol-9404f4.netlify.app
**Backend URL:** https://server-puce-mu.vercel.app

Example fetch call:
```javascript
fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
})
```
