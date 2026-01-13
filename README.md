# PayWithCryptoCard Backend API Server

Complete backend API server for the PayWithCryptoCard platform with full Swagger documentation.

## 🌟 Features

- ✅ **RESTful API** with Express.js
- ✅ **MongoDB** with Mongoose ODM
- ✅ **JWT Authentication** with httpOnly cookies
- ✅ **Rate Limiting** for DDoS protection
- ✅ **Input Validation** with express-validator
- ✅ **Security Headers** with Helmet.js
- ✅ **Full Swagger/OpenAPI Documentation**
- ✅ **Modular Architecture** (src/modules/*)
- ✅ **TypeScript** for type safety

## 📡 API Endpoints

### Authentication (4 routes)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Deposits (4 routes)
- `GET /api/deposits/addresses` - Get crypto deposit addresses
- `POST /api/deposits` - Submit deposit request
- `GET /api/deposits/my-deposits` - Get user deposits
- `GET /api/deposits/:id` - Get deposit by ID

### Cards (6 routes)
- `POST /api/cards` - Create virtual card
- `GET /api/cards` - Get user cards
- `GET /api/cards/:id` - Get card by ID
- `POST /api/cards/:id/load` - Load card with funds
- `PATCH /api/cards/:id/freeze` - Freeze/unfreeze card
- `PATCH /api/cards/:id/terminate` - Terminate card

### Transactions (3 routes)
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/stats` - Get dashboard statistics
- `GET /api/transactions/:id` - Get transaction by ID

### Admin (13 routes)
- `GET /api/admin/dashboard` - Platform statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id/status` - Update user status
- `POST /api/admin/users/:id/balance` - Adjust user balance
- `GET /api/admin/deposits/pending` - Get pending deposits
- `PATCH /api/admin/deposits/:id/approve` - Approve deposit
- `PATCH /api/admin/deposits/:id/reject` - Reject deposit
- `GET /api/admin/cards` - List all cards
- `PATCH /api/admin/cards/:id/status` - Update card status
- `GET /api/admin/transactions` - List all transactions
- `GET /api/admin/settings` - Get platform settings
- `PUT /api/admin/settings` - Update platform settings

**Total: 30 API Endpoints**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6.0+
- npm or yarn

### Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Environment Configuration

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/paywithcrypto
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@paywithcryptocard.com
ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:3000

# Crypto deposit addresses
BTC_ADDRESS=bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
ETH_ADDRESS=0x71C7656EC7ab88b098defB751B7401B5f6d8976F
USDT_ERC20_ADDRESS=0x71C7656EC7ab88b098defB751B7401B5f6d8976F
USDT_TRC20_ADDRESS=TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf
XMR_ADDRESS=44AFFq5kSiGBoZ4NMDwYtN187rua5UdjnU8oYfYaUCSt5MVNVq2zSRf7FHBVPL7pKGFHLyKAhA8tQEyEYbkGiqz
```

### Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service
```

### Seed Database

```bash
npm run seed
```

This creates:
- Admin user (credentials from .env)
- Default platform settings

### Run Development Server

```bash
npm run dev
```

Server will start on http://localhost:5000

## 📚 API Documentation

Once the server is running, access the interactive Swagger documentation at:

**http://localhost:5000/api-docs**

### Swagger Features
- 📖 **Interactive API Testing** - Try out endpoints directly from the browser
- 🔐 **Authentication Support** - Log in once and test authenticated endpoints
- 📝 **Request/Response Schemas** - See expected data formats
- 🔍 **Search & Filter** - Find endpoints quickly
- 📥 **Try It Out** - Execute API calls with sample data
- ⏱️ **Request Duration** - See response times

### How to Use Swagger UI

1. **Open Authentication Section**
   - Click "Authorize" button
   - Login with: `POST /api/auth/login`
   - Token automatically saved for authenticated requests

2. **Test Public Endpoints**
   - No authentication needed
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"

3. **Test Protected Endpoints**
   - First login via `/api/auth/login`
   - Swagger saves your auth token automatically
   - All requests will include authentication

4. **Admin Endpoints**
   - Login as admin user
   - All admin endpoints accessible
   - Full platform management available

## 📁 Project Structure

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # MongoDB connection
│   │   ├── swagger.ts       # Swagger/OpenAPI config
│   │   └── index.ts         # App configuration
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   └── validator.ts     # Input validation
│   ├── models/              # Mongoose models
│   │   ├── User.ts
│   │   ├── Deposit.ts
│   │   ├── Card.ts
│   │   ├── Transaction.ts
│   │   └── AdminSettings.ts
│   ├── modules/             # Feature modules
│   │   ├── auth/            # Authentication
│   │   ├── deposit/         # Crypto deposits
│   │   ├── card/            # Virtual cards
│   │   ├── transaction/     # Transactions
│   │   └── admin/           # Admin panel
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   │   ├── jwt.ts
│   │   ├── errors.ts
│   │   ├── generateCardNumber.ts
│   │   └── seedAdmin.ts
│   ├── server.ts            # App entry point
│   └── seed.ts              # Database seed script
├── .env.example             # Environment template
├── nodemon.json             # Nodemon config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 🔒 Security Features

### Authentication
- **JWT Tokens** - Secure stateless authentication
- **HttpOnly Cookies** - Prevent XSS attacks
- **Password Hashing** - Bcrypt with 10 salt rounds
- **7-Day Expiration** - Token validity period

### Rate Limiting
- **100 requests** per 15 minutes per IP
- Applied to all `/api` routes
- Customizable in `.env`

### Input Validation
- Email format validation
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Enum validation for specific fields
- Range validation for numbers

### Security Headers
- Helmet.js middleware
- CORS protection
- Content-Type validation
- XSS protection

## 🗄️ Database Models

### User
```typescript
{
  email: string (unique)
  password: string (hashed)
  fullName: string
  role: 'user' | 'admin'
  balance: number
  isActive: boolean
  isEmailVerified: boolean
}
```

### Deposit
```typescript
{
  userId: ObjectId
  currency: 'BTC' | 'ETH' | 'USDT_ERC20' | 'USDT_TRC20' | 'XMR'
  amount: number
  txHash?: string
  walletAddress: string
  status: 'pending' | 'approved' | 'rejected'
}
```

### Card
```typescript
{
  userId: ObjectId
  cardNumber: string (16 digits)
  expiryDate: string (MM/YY)
  cvv: string (3 digits)
  cardHolder: string
  balance: number
  status: 'active' | 'frozen' | 'terminated'
  spendingLimit: number
}
```

### Transaction
```typescript
{
  userId: ObjectId
  cardId?: ObjectId
  type: 'deposit' | 'card_create' | 'card_load' | 'purchase' | 'withdrawal'
  amount: number
  balance: number
  status: 'pending' | 'completed' | 'failed'
  description: string
  metadata?: object
}
```

### AdminSettings
```typescript
{
  cryptoAddresses: {
    btc: string
    eth: string
    usdtErc20: string
    usdtTrc20: string
    xmr: string
  }
  minimumDeposit: number
  cardIssuanceFee: number
  isActive: boolean
}
```

## 🛠️ Development Scripts

```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run seed         # Seed database with admin user
```

## 🧪 Testing with Swagger

### Example Test Flow

1. **Register a User**
```
POST /api/auth/register
{
  "email": "test@example.com",
  "password": "Test123456",
  "fullName": "Test User"
}
```

2. **Login**
```
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "Test123456"
}
```
Note: Token automatically saved for subsequent requests

3. **Get Deposit Addresses**
```
GET /api/deposits/addresses
```

4. **Create Deposit**
```
POST /api/deposits
{
  "currency": "BTC",
  "amount": 0.001,
  "txHash": "abc123..."
}
```

5. **Create Virtual Card**
```
POST /api/cards
{
  "spendingLimit": 10000
}
```

## 🔐 Default Admin Credentials

```
Email: admin@paywithcryptocard.com
Password: Admin@123
```

**IMPORTANT:** Change these immediately after first login!

## 🌍 Supported Cryptocurrencies

- **Bitcoin (BTC)**
- **Ethereum (ETH)**
- **Tether (USDT)** - ERC20
- **Tether (USDT)** - TRC20
- **Monero (XMR)**

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🚦 Production Deployment

### Before Deploying

1. **Change JWT Secret**
   ```env
   JWT_SECRET=<generate_random_64_char_string>
   ```

2. **Set Production Environment**
   ```env
   NODE_ENV=production
   ```

3. **Use Production Database**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/paywithcrypto
   ```

4. **Update Frontend URL**
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

5. **Update Admin Credentials**
   ```env
   ADMIN_PASSWORD=<strong_password>
   ```

6. **Use Real Crypto Addresses**
   ```env
   BTC_ADDRESS=<your_actual_btc_address>
   ETH_ADDRESS=<your_actual_eth_address>
   ```

### Build & Start

```bash
npm run build
npm run start
```

## 📝 Environment Variables

See `.env.example` for complete list:

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection | mongodb://localhost:27017/paywithcrypto |
| JWT_SECRET | JWT signing key | (must set) |
| JWT_EXPIRE | Token expiration | 7d |
| FRONTEND_URL | CORS origin | http://localhost:3000 |
| ADMIN_EMAIL | Default admin email | admin@paywithcryptocard.com |
| ADMIN_PASSWORD | Default admin password | Admin@123 |
| BTC_ADDRESS | Bitcoin deposit address | - |
| ETH_ADDRESS | Ethereum deposit address | - |
| USDT_ERC20_ADDRESS | USDT ERC20 address | - |
| USDT_TRC20_ADDRESS | USDT TRC20 address | - |
| XMR_ADDRESS | Monero deposit address | - |

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod      # Linux

# Start MongoDB
brew services start mongodb-community
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Reset Database
```bash
# MongoDB shell
mongosh
use paywithcrypto
db.dropDatabase()
exit

# Re-seed
npm run seed
```

## 📖 Additional Documentation

- **Quick Start Guide:** `../QUICKSTART.md`
- **System Architecture:** `../ARCHITECTURE.md`
- **Build Summary:** `../BUILD_SUMMARY.md`
- **Diagrams:** `../DIAGRAMS.md`

## 💡 Phase 1 Notes

### Simulated (NOT real):
- Crypto deposits (manual approval)
- Virtual cards (simulated PAN/CVV)

### Real (Production-ready):
- User authentication
- Database operations
- Business logic
- Admin workflows
- Transaction recording

## 📞 Support

For issues or questions:
- Email: support@paywithcryptocard.com
- GitHub Issues: [Project Repository]

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ using Express, MongoDB, TypeScript, and Swagger**
