<div align="center">
  <img src="https://res.cloudinary.com/dgbreoalg/image/upload/q_auto/f_auto/v1746566762/growth_ggcqxd.png" alt="Easiventory Logo" width="80" />
  <h1 align="center">Easiventory</h1>
  <p align="center">
    <strong>AI-Powered Inventory Management System</strong>
    <br />
    Real-time stock control, order management, production tracking & analytics
    <br />
    for small and medium businesses in retail, manufacturing, and distribution.
  </p>
  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture-exegesis">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#database-schema">Database</a> •
    <a href="#development-guide">Development</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## What Is Easiventory?

Easiventory (a blend of "easy" + "inventory") is a full-stack web application that helps businesses track what they have in stock, who they buy from, what they sell, and what they manufacture -- all from one dashboard. It replaces spreadsheets and paper records with a live, single source of truth that everyone in the business can use.

The application is built for **three types of users**:

1. **Retail / wholesale businesses** that buy products and sell them to customers
2. **Manufacturing businesses** that turn raw materials into finished goods
3. **Distribution companies** that manage products across multiple suppliers and buyers

---

## Features

### Core Inventory Management
- **Product Catalog** -- Store product names, SKUs, categories, prices, and stock levels
- **Real-Time Stock Status** -- Products are automatically labeled as **in-stock**, **low-stock**, or **out-of-stock** based on their reorder points
- **Inventory Overview** -- Search and filter your entire product catalog by name, SKU, category, or stock status
- **Low Stock Alerts** -- Products that fall below their reorder threshold are flagged immediately

### Sales & Orders
- **Sales Orders** -- Create orders for customers, track them through Pending -> Fulfilled -> Archived lifecycle
- **Auto Stock Deduction** -- Fulfilling an order automatically reduces the product's stock level
- **Filter by Status** -- Toggle between Pending, Fulfilled, and Archived views

### Purchasing & Supply Chain
- **Supplier Management** -- Store supplier contact info and lead times
- **Purchase Orders** -- Create POs with supplier selection, send them, and receive stock
- **AI Reorder Suggestions** -- The system automatically detects products below reorder point and offers one-click PO creation

### Production Management
- **Kanban Production Board** -- Visual board with Planned / In Progress / Completed columns
- **Progress Tracking** -- Each production order shows a completion percentage
- **Bill of Materials (BOM)** -- Link production orders to the raw materials they consume

### Raw Materials
- **Material Catalog** -- Track raw materials by units (kg, m, L, pcs, rolls)
- **Supplier Linking** -- Each material can be linked to a supplier
- **Stock & Reorder Levels** -- Monitor material availability against reorder thresholds

### Analytics & Reports
- **Stock Health Bar Chart** -- Visual comparison of current stock vs. reorder points
- **Sales Velocity Line Chart** -- 30-day sales trend analysis
- **Top Products Ranking** -- See which products generate the most revenue
- **Purchase Order History** -- Track what you ordered and when
- **Dashboard KPIs** -- Total products, today's sales, weekly revenue, supplier count, low stock count

### AI Chatbot Assistant
- **Gemini-Powered** -- Integrated Google Gemini AI chatbot that understands natural language queries
- **Context-Aware** -- The chatbot has access to your products, transactions, and supplier data
- **Quick Insights** -- Pre-built buttons for Inventory Overview, Sales Summary, Top Products, Low Stock Alerts, and Daily Summary
- **Conversational Interface** -- Ask questions like "What's my total inventory value?" or "Which products are low on stock?"

### Authentication & Security
- **Email/Password Login** -- Standard sign-up and sign-in
- **Google OAuth** -- One-click sign-in with Google
- **Password Reset** -- Forgot password flow via email
- **Row Level Security** -- Database-level protection ensuring only authenticated users can modify data
- **Protected Routes** -- Unauthenticated users are redirected to the landing page

### User Experience
- **Dark/Light Mode** -- Full theme support (light, dark, or system-follow)
- **Keyboard Shortcut** -- Press the `D` key to toggle dark mode
- **Responsive Design** -- Works on desktop, tablet, and mobile
- **Collapsible Sidebar** -- Maximize screen space when needed
- **Toast Notifications** -- User-friendly success/error messages
- **Landing Page** -- Marketing site with hero, stats counter, features showcase, and testimonials carousel

---

## Tech Stack

| Layer | Technology | What It Does |
|-------|-----------|--------------|
| **Package Manager** | npm workspaces (v10.8.2) | Manages multiple packages in one repo |
| **Monorepo Tool** | Turborepo (v2.8.17) | Orchestrates builds, linting, and type-checking across packages |
| **Frontend Framework** | React 19 via Vite 7 | Fast, modern UI rendering |
| **Language** | TypeScript 5.9 (strict mode) | Type-safe JavaScript |
| **UI Components** | shadcn/ui + Radix Primitives | Accessible, reusable UI building blocks |
| **Styling** | Tailwind CSS v4 + CSS Variables | Utility-first styling with custom theming |
| **Routing** | React Router DOM v7 | Client-side navigation between pages |
| **Server State** | TanStack React Query v5 | Fetch, cache, and sync data from the database |
| **Backend / Database** | Supabase (PostgreSQL + Auth + Realtime) | Full backend-as-a-service |
| **AI** | Google Gemini (`gemini-3-flash-preview`) | Natural language chatbot assistant |
| **Charts** | Recharts v3 | Bar charts, line charts for reports |
| **Carousel** | Embla Carousel with Autoplay | Testimonial carousel on landing page |
| **Animations** | AOS (Animate on Scroll) | Scroll-triggered animations |
| **Deployment** | Vercel | Hosting with SPA rewrites |
| **Currency** | Nigerian Naira (NGN) | All monetary values in `₦` |
| **Formatting** | Prettier + Tailwind plugin | Consistent code style |
| **Linting** | ESLint 9 (flat config) | Code quality checks |

---

## Architecture (Exegesis)

This section explains the entire system from the ground up -- how every piece fits together, written so anyone can understand it.

### The Big Picture

Easiventory is a **single-page application (SPA)** built on a **monorepo** architecture. "Monorepo" means the frontend code, the shared UI components, and the database configuration all live in the same repository. Turborepo orchestrates them so they build and deploy together seamlessly.


### Frontend Architecture (The Part You See)

#### Entry Point (`main.tsx`)

The application starts here. It wraps the entire app with three providers:

1. **QueryClientProvider** -- From TanStack React Query. This is the brain that manages all data fetching from the database. It caches responses so pages don't re-fetch data they already have.
2. **ThemeProvider** -- Manages light/dark/system theme. Stores preference in `localStorage` and listens for system preference changes. Pressing the `D` key toggles the theme anywhere in the app.
3. **BrowserRouter** -- From React Router. This enables client-side navigation without full page reloads.
4. **InventoryProvider** -- A legacy React Context that provides all inventory data to any component that needs it, using the Context API pattern.

The app uses a **hybrid state management approach**: the newer pattern uses TanStack React Query hooks (in `hooks/` folder) for each entity type, while the older `InventoryContext` fetches everything at once. Both work because they query the same Supabase tables.

#### Routing (`App.tsx`)

The router defines two main sections:

1. **Public routes** (no auth needed):
   - `/` -- Landing/marketing page
   - `/auth/callback` -- OAuth redirect handler

2. **Protected routes** (auth required):
   - `/dashboard` -- Main dashboard with KPI cards and charts
   - `/dashboard/products` -- Product CRUD
   - `/dashboard/inventory` -- Stock level monitoring
   - `/dashboard/sales-orders` -- Sales order management
   - `/dashboard/purchase-orders` -- Purchase order management
   - `/dashboard/suppliers` -- Supplier management
   - `/dashboard/reports` -- Analytics and reports
   - `/settings` -- User settings

The `ProtectedRoute` component checks if a user has an active Supabase session. If not, it redirects to the landing page. It also subscribes to auth state changes so if the user logs out, they are immediately kicked back.

#### Pages (What Each Screen Does)

**Landing Page** -- Marketing homepage with hero section, animated stats, features grid, testimonials carousel, and login modal.

**Dashboard** -- Command center with KPI stat cards (products, sales, revenue, alerts), weekly sales bar chart, category breakdown, and real-time live updates.

**Products Page** -- Full CRUD interface with search, status filter, pagination, and responsive table/card layout.

**Inventory Overview** -- Stock level monitoring with status badges (in-stock, low-stock, out-of-stock), search, and filtering.

**Sales Orders** -- Create, fulfill, and archive customer orders with auto stock deduction on fulfillment.

**Purchase Orders** -- Supplier order management with Draft -> Sent -> Received lifecycle and AI reorder suggestions.

**Production Board** -- Kanban-style board with Planned / In Progress / Completed columns and progress tracking.

**Raw Materials** -- Material catalog with supplier linking, unit tracking (kg, m, L, pcs, rolls), and stock monitoring.

**Suppliers** -- Vendor management with name, email, phone, and lead time tracking.

**Reports** -- Analytics with stock health bar chart, 30-day sales velocity line chart, top products ranking, and PO history.

**Settings** -- User profile, theme selector, notification preferences, and data management.

### Backend Architecture (The Part You Don't See)

There is **no traditional backend server**. Easiventory uses **Supabase** as a Backend-as-a-Service (BaaS), which means Supabase provides:

1. **PostgreSQL Database** -- All data storage
2. **Authentication** -- User management and session handling
3. **Realtime** -- WebSocket subscriptions for live updates
4. **Row Level Security** -- Database-level access control
5. **REST API** -- Auto-generated from your database schema

The frontend talks directly to Supabase using the `supabase-js` SDK. This is called a **serverless architecture** -- there are no custom API endpoints to maintain.

#### Database Overview

The database uses 8 tables defined in `supabase/supabase/migrations/001_create_tables.sql`:

| Table | Purpose |
|-------|---------|
| `suppliers` | Vendor contact info and lead times |
| `products` | Product catalog with SKU, category, stock, price, and auto-updated status |
| `raw_materials` | Manufacturing inputs with unit tracking and supplier links |
| `production_orders` | Manufacturing jobs with status (Planned / In Progress / Completed) and progress |
| `production_order_materials` | Bill of Materials linking production orders to raw materials |
| `sales_orders` | Customer orders with status lifecycle (Pending / Fulfilled / Archived) |
| `purchase_orders` | Supplier orders with status lifecycle (Draft / Sent / Received) |
| `purchase_order_items` | Purchase order line items for raw materials |

#### Database Trigger (The Smart Part)

There is a **database trigger** called `update_product_status` that automatically sets the `status` column whenever `stock_on_hand` or `reorder_point` changes:
- If `stock_on_hand = 0` --> `out-of-stock`
- If `stock_on_hand <= reorder_point` --> `low-stock`
- Otherwise --> `in-stock`

This happens in the database itself, so even if you update stock directly in SQL, the status updates correctly. No application code needed.

#### Row Level Security (RLS)

Every table has RLS enabled with two policies:
- **SELECT**: Anyone can read data (even unauthenticated users) -- this allows the marketing dashboard to display public stats
- **INSERT / UPDATE / DELETE**: Only authenticated users can modify data

This means even though the Supabase client keys are exposed in the frontend code, no one can modify your data without logging in.

#### AI Chatbot - How It Works

The chatbot (`components/chatbot.tsx`) runs entirely in the browser:

1. When opened, it fetches all products, transactions, and suppliers using TanStack Query hooks
2. When the user asks a question or clicks a quick insight button, the app sends:
   - The user's message
   - A context object containing the business data (products, transactions, suppliers)
3. Google Gemini AI receives this context and generates a natural language response
4. The response is rendered in the chat panel with support for bold text

The bot can answer questions like:
- "What is my current inventory value?"
- "Show me my top selling products"
- "Which products need reordering?"
- "Give me a daily summary of my business"

#### Realtime Updates

The dashboard listens for database changes via Supabase Realtime WebSocket subscriptions. When any product or transaction changes, the dashboard's "last updated" timestamp refreshes automatically -- no page reload needed.

---

## Project Structure

```
easiventory/
├── apps/                          # Application packages
│   ├── .env                       # Environment variables (API keys, URLs)
│   └── web/                       # Main React application
│       ├── index.html             # HTML entry point
│       ├── components.json        # shadcn/ui configuration
│       ├── eslint.config.js       # ESLint flat config
│       ├── package.json           # Web app dependencies
│       ├── tsconfig.json          # TypeScript config with path aliases
│       ├── tsconfig.app.json      # App-specific TS config
│       ├── tsconfig.node.json     # Node/vite TS config
│       ├── vercel.json            # Vercel SPA rewrite rules
│       ├── vite.config.ts         # Vite build config
│       └── src/
│           ├── main.tsx           # App entry point (providers)
│           ├── App.tsx             # Router and auth protection
│           ├── components/        # Reusable UI components
│           │   ├── chatbot.tsx           # AI chatbot widget
│           │   ├── login-modal.tsx       # Auth modal
│           │   ├── theme-provider.tsx    # Theme context provider
│           │   ├── toaster.tsx           # Toast notification system
│           │   └── layout/
│           │       ├── app-layout.tsx         # Dashboard shell
│           │       ├── landing-layout.tsx     # Marketing page shell
│           │       ├── landing-navbar.tsx     # Landing page navbar
│           │       ├── landing-footer.tsx     # Landing page footer
│           │       ├── navbar.tsx             # Dashboard navbar
│           │       └── sidebar.tsx            # Dashboard sidebar
│           ├── context/
│           │   └── inventory-context.tsx      # Legacy global state
│           ├── data/
│           │   └── testimonials.ts            # Testimonial data
│           ├── hooks/                         # React Query hooks
│           │   ├── useProducts.ts
│           │   ├── useSuppliers.ts
│           │   ├── useSalesOrders.ts
│           │   ├── usePurchaseOrders.ts
│           │   ├── useProductionOrders.ts
│           │   ├── useRawMaterials.ts
│           │   ├── useTransactions.ts
│           │   └── useTheme.ts
│           ├── lib/
│           │   ├── auth.ts         # Authentication functions
│           │   ├── queryKeys.js    # Query key constants
│           │   └── supabase.ts     # Supabase client
│           ├── pages/                        # Page components
│           │   ├── landing-page.tsx
│           │   ├── auth-callback-page.tsx
│           │   ├── dashboard-page.tsx
│           │   ├── products-page.tsx
│           │   ├── inventory-overview-page.tsx
│           │   ├── sales-orders-page.tsx
│           │   ├── purchase-orders-page.tsx
│           │   ├── production-page.tsx
│           │   ├── raw-materials-page.tsx
│           │   ├── suppliers-page.tsx
│           │   ├── reports-page.tsx
│           │   └── settings-page.tsx
│           ├── styles/
│           │   └── animations.css   # Custom animations
│           └── types/
│               ├── aos.d.ts         # AOS type declarations
│               └── database.ts      # TypeScript interfaces
│
├── packages/
│   └── ui/                          # Shared UI component library
│       ├── components.json
│       ├── eslint.config.js
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.lint.json
│       └── src/
│           ├── styles/
│           │   └── globals.css      # Global styles + Tailwind + themes
│           ├── lib/
│           │   └── utils.ts         # cn() utility function
│           └── components/          # shadcn/ui components
│               ├── button.tsx
│               ├── badge.tsx
│               ├── input.tsx
│               ├── select.tsx
│               ├── dialog.tsx
│               ├── table.tsx
│               ├── tabs.tsx
│               ├── carousel.tsx
│               ├── alert-dialog.tsx
│               └── ...
│
├── supabase/                        # Database configuration
│   ├── README.md                    # Supabase setup guide
│   ├── seed-retail.sql              # Alternative seed data
│   └── supabase/
│       ├── config.toml              # Supabase local config
│       ├── migrations/
│       │   └── 001_create_tables.sql # Full database schema
│       └── seed.sql                 # Industrial seed data
│
├── package.json                     # Root monorepo config
├── turbo.json                       # Turborepo pipeline config
├── tsconfig.json                    # Base TypeScript config
├── .prettierrc                      # Prettier config
├── .prettierignore
└── .gitignore
```



## Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** >= 10.8.2
- A **Supabase** account (free tier works)
- A **Google Gemini API key** (free tier available)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd easiventory
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your Supabase project dashboard, go to **SQL Editor**
3. Run the migration file contents from `supabase/supabase/migrations/001_create_tables.sql` to create all tables, triggers, and RLS policies
4. (Optional) Run the seed data from `supabase/supabase/seed.sql` to populate sample data
5. In **Authentication > Settings**, enable email/password and Google OAuth sign-in
6. Copy your project URL and anon key from **Settings > API**

### 3. Configure Environment Variables

Create or edit `apps/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Run the Development Server

```bash
npm run dev
```

This starts both the Vite dev server (on port 5173 by default) and watches the UI package for changes. Open `http://localhost:5173` in your browser.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps for production |
| `npm run lint` | Run ESLint across all packages |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

---

## Development Guide

### Adding a New Page

1. Create the page component in `apps/web/src/pages/`
2. Add the route in `apps/web/src/App.tsx` inside the protected route group
3. Add a navigation item in `apps/web/src/components/layout/sidebar.tsx`
4. Create TanStack Query hooks in `apps/web/src/hooks/` if the page interacts with the database

### Adding a New Database Table

1. Add the CREATE TABLE statement to `supabase/supabase/migrations/001_create_tables.sql`
2. Add RLS policies for the new table
3. Add performance indexes
4. Run the migration in Supabase SQL Editor
5. Update `apps/web/src/types/database.ts` with TypeScript types
6. Create query hooks in `apps/web/src/hooks/`

### Styling

This project uses Tailwind CSS v4 with CSS custom properties for theming. The global stylesheet is at `packages/ui/src/styles/globals.css`. Key things to know:

- Use `@theme inline` to define custom design tokens
- Dark mode is triggered by the `.dark` class on `<html>`
- Color scheme uses CSS variables: `--background`, `--foreground`, `--primary`, etc.
- The `cn()` utility (from `packages/ui/lib/utils.ts`) merges Tailwind classes with `clsx` + `tailwind-merge`
- Custom animations are defined in `apps/web/src/styles/animations.css`

### Component Conventions

- Components use named exports (not default exports)
- shadcn/ui components live in `packages/ui/src/components/` and are imported via `@workspace/ui/components/button` (etc.)
- Page-level components go in `pages/`, reusable components in `components/`
- All monetary values are formatted in Nigerian Naira (NGN) using the `formatNGN` helper

---

## Deployment

The project is configured for deployment on **Vercel**:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set the root directory to `apps/web`
4. Configure the build command as `npm run build` (Turborepo handles the monorepo build)
5. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`
6. Deploy

The `vercel.json` file at `apps/web/vercel.json` contains SPA rewrite rules so all routes fall back to `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Security Notes

- The Supabase URL and anon key are exposed in the frontend code. This is by design -- Supabase anon keys are safe to expose because RLS policies protect your data. Only authenticated users can modify data.
- However, the Google Gemini API key is also exposed in the frontend. For production, consider:
  - Using a Vercel serverless function or Edge function as a proxy for AI requests
  - Restricting the API key to specific referrer URLs in Google AI Studio
- Never commit real credentials. Use environment variables and `.env` files.

---

## License

Private. All rights reserved.

---

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com) component library
- Database and auth by [Supabase](https://supabase.com)
- AI powered by [Google Gemini](https://ai.google.dev)
- Charts by [Recharts](https://recharts.org)
