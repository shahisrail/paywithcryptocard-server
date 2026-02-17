# Frontend & Backend Integration Guide

## Deployed URLs

**Frontend (Netlify):** `https://guileless-dodol-9404f4.netlify.app`
**Backend (Vercel):** `https://server-puce-mu.vercel.app`

## Configuration Status

✅ **Backend CORS** - Configured to accept requests from your Netlify frontend
✅ **Frontend URL** - Set to `https://guileless-dodol-9404f4.netlify.app`
✅ **Backend URL** - `https://server-puce-mu.vercel.app`
✅ **Build** - Compiles successfully

## Frontend Setup

Add this to your frontend environment variables or config:

```javascript
const API_BASE_URL = 'https://server-puce-mu.vercel.app/api';
```

### Example API Calls

**Register User:**
```javascript
fetch('https://server-puce-mu.vercel.app/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass@123',
    fullName: 'John Doe'
  })
})
```

**Login:**
```javascript
fetch('https://server-puce-mu.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass@123'
  })
})
```

**Get User Profile:**
```javascript
fetch('https://server-puce-mu.vercel.app/api/auth/profile', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## Available API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

### Cards
- `GET /api/cards` - Get user cards
- `POST /api/cards` - Create new card
- `GET /api/cards/:id` - Get card details
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card

### Deposits
- `GET /api/deposits` - Get user deposits
- `POST /api/deposits` - Create deposit request
- `GET /api/deposits/addresses` - Get crypto addresses

### Transactions
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get transaction details

### Admin
- `GET /api/admin/settings` - Get admin settings
- `PUT /api/admin/settings` - Update admin settings
- `GET /api/admin/deposits` - Get all deposits
- `PUT /api/admin/deposits/:id` - Approve/reject deposit
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics

## Testing

1. **Health Check:**
   ```
   https://server-puce-mu.vercel.app/health
   ```

2. **API Documentation:**
   ```
   https://server-puce-mu.vercel.app/api-docs
   ```

3. **CORS Test:**
   Try calling the API from your Netlify frontend - it should work now!

## Important Notes

⚠️ **Credentials Mode:** Make sure your frontend fetch calls include `credentials: 'include'` for cookie-based auth

⚠️ **Environment Variables:** In production, set `FRONTEND_URL=https://guileless-dodol-9404f4.netlify.app` in your Vercel dashboard

⚠️ **MongoDB:** Ensure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0) for Vercel serverless functions

## Next Steps

1. ✅ Backend is configured and ready
2. 📝 Update Vercel environment variables with `FRONTEND_URL`
3. 🚀 Deploy backend: `vercel --prod`
4. 🔗 Test frontend-backend connection
5. ✅ Your full-stack app is live!

Need help? Check `DEPLOYMENT.md` for detailed deployment instructions.
