# Zyora - E-Commerce Mobile Application 🛍️

A full-stack e-commerce mobile application built with React Native (Expo) and Node.js, featuring Stripe payment integration and Supabase authentication.

## 📱 Features

- **User Authentication** - Secure login/signup with Supabase
- **Product Catalog** - Browse products by categories
- **Shopping Cart** - Add/remove items with quantity management
- **Favorites** - Save products to wishlist
- **Order Management** - Track order history and payment status
- **Stripe Payments** - Secure payment processing
- **Responsive UI** - Beautiful, modern design with smooth animations

## 🏗️ Tech Stack

### Frontend (Client App)
- **React Native** with Expo
- **TypeScript**
- **Expo Router** for navigation
- **Zustand** for state management
- **Stripe React Native** for payments
- **Supabase** for authentication
- **React Native Reanimated** for animations

### Backend (Server)
- **Node.js** with Express
- **Stripe API** for payment processing
- **CORS** enabled

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator
- Stripe Account
- Supabase Account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ashpeak/Zyora.git
cd Zyora
```

### 2. Environment Variables Setup

#### **Client App Environment Variables**

Create a `.env` file in the `client-app` directory:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key

# Backend API URL (use ngrok URL for development)
EXPO_PUBLIC_BACKEND_API_URL=http://localhost:8000

# Stripe Publishable Key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# External API (Fake Store API for demo products)
API_URL=https://fakestoreapi.com
```

**Where to get these values:**

- **Supabase URL & Key**: Go to your [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API
- **Stripe Publishable Key**: Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys
- **Backend API URL**: For local development use `http://localhost:8000`, for production use your deployed server URL (or ngrok URL for testing)

#### **Server Environment Variables**

Create a `.env` file in the `server` directory:

```env
# Server Port
PORT=8000

# Stripe Secret Key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Optional: CORS origin (leave empty for development)
ORIGIN=
```

**Where to get these values:**

- **Stripe Secret Key**: Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys (Keep this SECRET!)

### 3. Install Dependencies

#### Install Client App Dependencies

```bash
cd client-app
npm install
```

#### Install Server Dependencies

```bash
cd ../server
npm install
```

### 4. Run the Application

#### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:8000`

#### (Optional) Expose Local Server with ngrok

For testing on physical devices:

```bash
cd server
npm run tunnel
```

Copy the ngrok URL and update `EXPO_PUBLIC_BACKEND_API_URL` in `client-app/.env`

#### Start the Mobile App

```bash
cd client-app
npx expo start
```

Options to run the app:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## 📁 Project Structure

```
Zyora/
├── client-app/                  # React Native mobile app
│   ├── app/                     # App screens (file-based routing)
│   │   ├── (tabs)/             # Tab navigation screens
│   │   │   ├── index.tsx       # Home screen
│   │   │   ├── shop.tsx        # Shop/Products screen
│   │   │   ├── cart.tsx        # Shopping cart
│   │   │   ├── profile.tsx     # User profile
│   │   │   ├── orders.tsx      # Order history
│   │   │   ├── favourite.tsx   # Favorites/Wishlist
│   │   │   ├── product/[id].tsx # Product details
│   │   │   ├── login.tsx       # Login screen
│   │   │   └── signup.tsx      # Signup screen
│   │   └── _layout.tsx         # Root layout
│   ├── components/             # Reusable components
│   ├── store/                  # Zustand state management
│   │   ├── authStore.ts       # Authentication state
│   │   ├── cartStore.ts       # Cart state
│   │   ├── favouriteStore.ts  # Favorites state
│   │   └── productStore.ts    # Products state
│   ├── lib/                    # Utilities and API clients
│   │   ├── supabase.ts        # Supabase client
│   │   └── api.ts             # API functions
│   ├── constants/              # Constants and theme
│   ├── assets/                 # Images, fonts
│   └── .env                    # Environment variables
│
├── server/                     # Node.js backend
│   ├── routes/                 # API routes
│   │   └── checkout.js        # Payment/checkout endpoints
│   ├── lib/                    # Server utilities
│   │   └── stripe.js          # Stripe client
│   ├── index.js               # Server entry point
│   └── .env                   # Server environment variables
│
├── .gitignore                 # Git ignore file
└── README.md                  # This file
```

## 🔑 Key Features Implementation

### Authentication
- Powered by [Supabase Authentication](https://supabase.com/docs/guides/auth)
- Secure session management with `expo-secure-store`
- Auto-refresh tokens

### State Management
- **Auth State**: `useAuthStore` in `store/authStore.ts`
- **Cart State**: `useCartStore` in `store/cartStore.ts` - Persisted with AsyncStorage
- **Favorites**: `useFavouriteStore` in `store/favouriteStore.ts` - Persisted with AsyncStorage
- **Products**: `useProductStore` in `store/productStore.ts`

### Payment Flow
1. User adds items to cart
2. Proceeds to checkout from `cart.tsx`
3. Backend creates Stripe Payment Intent via `/api/checkout`
4. Client initializes Stripe Payment Sheet using `stripePayment.tsx`
5. User completes payment
6. Order status updated in Supabase
7. User redirected to `orders.tsx`

## 🗄️ Supabase Database Setup

Create the following table in your Supabase project:

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_email TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 Customization

### Theme Colors
Edit `constants/theme.ts` to customize the app's color scheme.

### App Name & Icons
- Update app name in `app.json`
- Replace icons in `assets/images/`

## 📦 Build for Production

### Android APK

```bash
cd client-app
eas build --platform android
```

### iOS IPA

```bash
cd client-app
eas build --platform ios
```

## 🔒 Security Notes

- **Never commit `.env` files** - They are already in `.gitignore`
- **Use test keys** during development
- **Switch to production keys** before deploying
- **Keep Stripe Secret Key secure** - Never expose in client code
- **Validate all inputs** on the backend

## 🐛 Troubleshooting

### Backend not connecting?
- Check if server is running on port 8000
- Verify `EXPO_PUBLIC_BACKEND_API_URL` in client `.env`
- Use ngrok for testing on physical devices

### Stripe payments failing?
- Verify Stripe keys are correct (publishable in client, secret in server)
- Check Stripe Dashboard for error logs
- Ensure test mode is enabled during development

### Supabase auth issues?
- Verify Supabase URL and anon key
- Check if email confirmation is required in Supabase settings
- Review Supabase auth logs

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using React Native, Node.js, Stripe, and Supabase**
