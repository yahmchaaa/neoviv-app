# NEOVIV - On-Demand IV Hydration Delivery App

NEOVIV is a mobile application that brings IV hydration therapy directly to your doorstep. Think Uber, but for IV therapy.

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: expo-router
- **Animations**: react-native-reanimated
- **Gestures**: react-native-gesture-handler
- **Backend**: Supabase (Auth + Database)
- **Payments**: Stripe

## Project Structure

```
neoviv-app/
├── src/
│   ├── assets/          # Images, fonts, and other static assets
│   ├── components/      # Reusable React components
│   ├── navigation/      # Navigation configuration (expo-router)
│   ├── screens/         # App screens (Splash, Login, Menu, Book, Confirmation)
│   ├── services/        # API and service functions
│   │   ├── auth.ts      # Supabase authentication
│   │   ├── orders.ts    # Order management
│   │   ├── drips.ts     # Drip/Menu fetching
│   │   └── stripe.ts    # Payment processing
│   ├── types/           # TypeScript type definitions
│   │   └── models.ts    # Data models (User, Order, Drip, Assignment)
│   └── lib/
│       └── supabase.ts  # Supabase client initialization
├── supabase/
│   └── schema.sql       # Database schema with RLS policies
├── screens/             # Expo Router screens (alternative structure)
└── app/                 # Expo Router app directory
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd neoviv-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in the Supabase SQL Editor
3. Copy your project URL and anon key to the `.env` file

### 5. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable key and add it to the `.env` file

### 6. Run the App

```bash
npx expo start
```

## Features (MVP)

- [x] Splash Screen
- [x] Login/Signup with Email & Password (Supabase Auth)
- [x] Service Menu (List of IV Drips)
- [x] Book Now (with location)
- [x] Order Confirmation (with ETA)
- [ ] Push Notifications
- [ ] Real-time Order Tracking
- [ ] Nurse/Therapist App
- [ ] Payment Processing with Stripe

## Brand Guidelines

- **Primary Color**: Teal `#00B09B`
- **Background**: Black
- **Font**: Baloo Bhai 2
- **Tagline**: "Drops of Life"

## Data Models

### User
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key (links to Supabase auth) |
| email | TEXT | User's email |
| full_name | TEXT | User's full name |
| phone | TEXT | Phone number |
| address | TEXT | Delivery address |
| latitude | NUMERIC | Address latitude |
| longitude | NUMERIC | Address longitude |

### Drip
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Drip name |
| description | TEXT | Detailed description |
| price | NUMERIC | Price in USD |
| duration_minutes | INTEGER | Treatment duration |
| benefits | TEXT[] | Array of benefits |
| ingredients | TEXT[] | Array of ingredients |
| image_url | TEXT | Product image URL |
| is_active | BOOLEAN | Availability flag |

### Order
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to users |
| drip_id | UUID | Foreign key to drips |
| status | TEXT | pending/confirmed/in_progress/completed/cancelled |
| delivery_address | TEXT | Delivery address |
| delivery_latitude | NUMERIC | Delivery latitude |
| delivery_longitude | NUMERIC | Delivery longitude |
| scheduled_time | TIMESTAMP | Scheduled delivery time |
| notes | TEXT | Special instructions |
| total_price | NUMERIC | Total order price |
| stripe_payment_id | TEXT | Stripe payment reference |

### Assignment
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | Foreign key to orders |
| nurse_id | UUID | Foreign key to users (nurse) |
| status | TEXT | pending/accepted/en_route/in_progress/completed |
| estimated_arrival | TIMESTAMP | ETA |
| started_at | TIMESTAMP | Treatment start time |
| completed_at | TIMESTAMP | Treatment completion time |

## API Services

### Authentication
```typescript
signUp(email, password)     // Create new account
signIn(email, password)      // Login
signOut()                   // Logout
getCurrentUser()            // Get current user
```

### Orders
```typescript
createOrder(orderData)      // Create new order
getOrders(userId)           // Get user's orders
getOrderWithDrip(orderId)   // Get order with drip details
updateOrderStatus(orderId, status) // Update order status
cancelOrder(orderId)        // Cancel an order
```

### Drips
```typescript
getDrips()                  // Get all active drips
getDripById(dripId)        // Get single drip details
```

### Payments
```typescript
initializePaymentSheet()    // Initialize Stripe
openPaymentSheet()          // Open payment sheet
```

## License

MIT
