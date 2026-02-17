# Vercel Deployment Guide

## Prerequisites

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

## Environment Variables

Before deploying, make sure to set these environment variables in your Vercel project settings:

### Required
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Your frontend application URL

### Optional
- `PORT` - Server port (defaults to 4000)
- `NODE_ENV` - Environment (set to `production` automatically)
- `JWT_EXPIRE` - JWT expiration time (defaults to `7d`)

### Crypto Addresses (for deposits)
- `BTC_ADDRESS` - Bitcoin wallet address
- `ETH_ADDRESS` - Ethereum wallet address
- `USDT_ERC20_ADDRESS` - USDT ERC20 wallet address
- `USDT_TRC20_ADDRESS` - USDT TRC20 wallet address
- `XMR_ADDRESS` - Monero wallet address

### Admin Credentials
- `ADMIN_EMAIL` - Admin email (defaults to `admin@paywithcrypto.com`)
- `ADMIN_PASSWORD` - Admin password (defaults to `Admin@123`)

### Rate Limiting
- `RATE_LIMIT_WINDOW_MS` - Time window for rate limiting in ms (defaults to 900000 = 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (defaults to 100)

## Deployment Steps

### 1. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (for first time) or **Y** (for existing)
- What's your project's name? **paywithcryptocard-server**
- In which directory is your code located? **./**
- Want to override the settings? **N**

### 2. Set Environment Variables

Go to your Vercel dashboard:
1. Select your project
2. Go to **Settings** → **Environment Variables**
3. Add all the required variables from above

### 3. Redeploy

After setting environment variables, redeploy:
```bash
vercel --prod
```

## Important Notes

⚠️ **Database Connection**: Vercel serverless functions have a maximum execution time of 10 seconds (Hobby plan) or 60 seconds (Pro plan). For heavy database operations, consider:
- Using MongoDB Atlas (free tier available)
- Optimizing database queries
- Implementing caching strategies

⚠️ **Rate Limiting**: The `trust proxy` setting is already enabled in `src/server.ts` to work correctly with Vercel's proxy.

⚠️ **CORS**: Make sure to update `FRONTEND_URL` to match your deployed frontend URL.

## Testing Your Deployment

After deployment, test these endpoints:

1. **Health Check**: `https://your-app.vercel.app/health`
2. **API Documentation**: `https://your-app.vercel.app/api-docs`
3. **Auth**: `https://your-app.vercel.app/api/auth/register`

## Monitoring

- Check logs in Vercel Dashboard → **Logs**
- Monitor performance in **Analytics**
- Set up alerts for errors and deployments

## Troubleshooting

### Build Errors
- Ensure TypeScript compiles locally: `npm run build`
- Check that `dist/` folder is generated

### Runtime Errors
- Check environment variables are set correctly
- Verify MongoDB connection string is valid
- Check Vercel function logs

### Database Connection Issues
- Ensure MongoDB IP whitelist includes Vercel's IP ranges
- Check connection string format
- Verify database credentials

## Next Steps

1. Deploy your frontend application
2. Update `FRONTEND_URL` in backend environment variables
3. Set up custom domain (optional)
4. Configure monitoring and alerts
5. Set up CI/CD pipeline (optional)
