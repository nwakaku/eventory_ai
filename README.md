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

```
┌─────────────────────────────────────────────────┐
│                   BROWSER                        │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Landing Page│  │    Dashboard (Auth)       │  │
│  │ (public)    │  │  - Products / Inventory   │  │
│  │             │  │  - Sales / Purchase Ord   │  │
│  │             │  │  - Production / Reports   │  │
│  │             │  │  - Settings               │  │
│  └──────┬──────┘  └──────────┬───────────────┘  │
│         │                    │                   │
│         └────────┬───────────┘                   │
│                  │                               │
│         ┌────────▼────────┐                      │
│         │  React Router   │                      │
│         │  (client-side)  │                      │
│         └────────┬────────┘                      │
│                  │                               │
│         ┌────────▼────────┐                      │
│         │  TanStack React │                      │
│         │     Query       │  (caches DB data)    │
│         └────────┬────────┘                      │
└──────────────────┼───────────────────────────────┘
                   │
                   ▼
        ┌───────────────────┐
        │    Supabase SDK    │
        │  (supabase-js)     │
        └────────┬──────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │       SUPABASE          │
    │  ┌───────────────────┐  │
    │  │   PostgreSQL DB   │  │
    │  │  (8 tables +      │  │
    │  │   triggers + RLS) │  │
    │  ├───────────────────┤  │
    │  │  Auth Service     │  │
    │  │  (email/password  │  │
    │  │   + Google OAuth) │  │
    │  ├───────────────────┤  │
    │  │  Realtime         │  │
    │  │  (live updates    │  │
    │  │   via WebSocket)  │  │
    │  └───────────────────┘  │
    └─────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │   Google Gemini AI      │
    │  (chatbot assistant)    │
    └─────────────────────────┘
```

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

**Landing Page** (`landing-page.tsx` -- 706 lines)
The public face of the application. Contains:
- A hero section with headlines and CTA buttons
- Animated statistics counters (using `react-countup`)
- A features grid showing the main capabilities
- A dashboard mockup image
- An "integrations" section listing supported services
- A testimonials carousel (using Embla Carousel)
- A demo booking modal
- A login modal that supports email/password sign-up, sign-in, and Google OAuth

**Dashboard** (`dashboard-page.tsx` -- 544 lines)
The central command center. Shows:
- KPI stat cards: total products, today's sales (count), weekly revenue (in NGN), low stock items count, supplier count, monthly revenue
- A weekly sales bar chart (using Recharts)
- A category breakdown section
- Items that are about to expire or run out
- Real-time "last updated" timestamp that refreshes via Supabase Realtime subscriptions (WebSocket)
- Loading states and error handling throughout

**Products Page** (`products-page.tsx` -- 758 lines)
Full CRUD (Create, Read, Update, Delete) interface:
- Responsive table that shows product name, SKU, category, stock, price, status
- On mobile, switches to a card-based layout
- Search bar that filters by name, SKU, or category
- Status filter dropdown (all / in-stock / low-stock / out-of-stock)
- Pagination: 10 items per page
- Add/Edit modal with form validation
- Delete with confirmation dialog

**Inventory Overview** (`inventory-overview-page.tsx` -- 401 lines)
Monitors stock levels across all products:
- Search and status filter
- Color-coded status badges (green = in-stock, yellow = low-stock, red = out-of-stock)
- Pagination

**Sales Orders** (`sales-orders-page.tsx` -- 334 lines)
Manage customer orders:
- Tab-based filtering (All / Pending / Fulfilled / Archived)
- Create order modal with product dropdown (quantity auto-calculates total from product price)
- Fulfill action that updates the product's `stock_on_hand` (deducts quantity)
- Archive action for completed orders

**Purchase Orders** (`purchase-orders-page.tsx` -- 429 lines)
Manage supplier orders:
- AI Reorder Suggestions section that lists products where `stock_on_hand <= reorder_point`
- One-click "Create PO" from reorder suggestions
- Create PO modal with supplier and product selections
- Status lifecycle: Draft -> Sent -> Received
- Filtering by status

**Production Board** (`production-page.tsx` -- 323 lines)
Kanban-style board for manufacturing:
- Three columns: Planned, In Progress, Completed
- Each production order card shows product ID, quantity, and progress percentage
- Progress bar visualization
- Move orders forward or backward through stages
- Add and edit production orders

**Raw Materials** (`raw-materials-page.tsx` -- 466 lines)
Manage manufacturing inputs:
- Full CRUD with supplier linking
- Unit tracking (kg, m, L, pcs, rolls)
- Stock status: available / low / out-of-stock

**Suppliers** (`suppliers-page.tsx` -- 447 lines)
Manage vendor information:
- Full CRUD with name, email, phone, lead time
- Cards layout showing all supplier details
- Delete with confirmation

**Reports** (`reports-page.tsx` -- 525 lines)
Analytics and data visualization:
- Three tabs: Stock Health, Sales Velocity, Reorder History
- Stock Health: Bar chart comparing each product's current stock against its reorder point
- Sales Velocity: 30-day line chart of sales trends, plus top products ranking table
- Reorder History: Bar chart of supplier purchase orders over time
- All data computed from live database queries

**Settings** (`settings-page.tsx` -- 259 lines)
User account management:
- Profile section with user email
- Theme selector (light, dark, system)
- Notification preferences (placeholder)
- Data management (CSV export placeholders)
- Security section
- Danger zone for destructive actions

#### State Management: Two Approaches

The codebase uses **two different state management patterns** side by side:

**Approach 1: TanStack React Query Hooks (the newer pattern)**

Each entity type has its own hook file in `hooks/`:

| Hook File | What It Provides |
|-----------|-----------------|
| `useProducts.ts` | Fetch all, create, update, delete products |
| `useSuppliers.ts` | Fetch all, create, update, delete suppliers |
| `useRawMaterials.ts` | Fetch all, create, update, delete raw materials |
| `useProductionOrders.ts` | Fetch all, create, update, delete production orders |
| `useSalesOrders.ts` | Fetch all, create, update, delete sales orders |
| `usePurchaseOrders.ts` | Fetch all, create, update, delete purchase orders |
| `useTransactions.ts` | Fetch all transactions |
| `useTheme.ts` | Simple light/dark toggle via localStorage |

Each hook follows the same pattern:
- A `useGetAll*` query that fetches data from Supabase
- `useCreate*`, `useUpdate*`, `useDelete*` mutations
- On success, the mutation invalidates the query cache so the list automatically refreshes
- Error handling through the global QueryClient `onError` callback, which shows a toast notification

**Approach 2: React Context API (legacy)**

The `InventoryContext` (`context/inventory-context.tsx`) fetches ALL data at once when the app loads and stores it in React state. It also provides mutation functions for sales orders, purchase orders, and production orders with optimistic local state updates.

#### Layout Components

**App Layout** (`app-layout.tsx`):
- Sidebar (collapsible on desktop, overlay on mobile)
- Navbar with hamburger menu toggle on mobile
- `<Outlet />` for rendering child routes
- Floating ChatBot widget

**Sidebar** (`sidebar.tsx`):
- Navigation links to all dashboard pages
- Collapsible to icon-only mode on desktop
- Overlay drawer on mobile with backdrop
- Uses `NavLink` from React Router for active state highlighting
- Logo and brand name at top
- Settings link and collapse toggle at bottom

**ChatBot** (`chatbot.tsx` -- 418 lines):
- Floating button in bottom-right corner
- Opens a chat panel with:
  - Quick insight buttons (5 pre-built queries)
  - Text input for custom questions
  - Message history with user/assistant distinction
  - Bold text rendering in responses
- Uses Google Gemini AI directly from the browser
- Sends business data context (products, transactions, suppliers) with each query
- Response formatting includes NGN currency formatting

### Backend Architecture (The Part You Don't See)

There is **no traditional backend server**. Easiventory uses **Supabase** as a Backend-as-a-Service (BaaS), which means Supabase provides:

1. **PostgreSQL Database** -- All data storage
2. **Authentication** -- User management and session handling
3. **Realtime** -- WebSocket subscriptions for live updates
4. **Row Level Security** -- Database-level access control
5. **REST API** -- Auto-generated from your database schema

The frontend talks directly to Supabase using the `supabase-js` SDK. This is called a **serverless architecture** -- there are no custom API endpoints to maintain.

#### Database Schema (8 Tables)

The database is defined in `supabase/supabase/migrations/001_create_tables.sql`.

**suppliers** -- Who you buy from
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `name` | VARCHAR(255) | Supplier company name |
| `email` | VARCHAR(255) | Contact email (unique) |
| `phone` | VARCHAR(50) | Contact phone number |
| `lead_time_days` | INTEGER | Days between ordering and receiving |
| `created_at` | TIMESTAMPTZ | When the record was created |

**products** -- What you sell
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `name` | VARCHAR(255) | Product name |
| `sku` | VARCHAR(100) | Stock Keeping Unit (unique) |
| `category` | VARCHAR(100) | Product category |
| `stock_on_hand` | INTEGER | Current quantity in stock |
| `reorder_point` | INTEGER | Minimum stock before reordering |
| `unit_price` | DECIMAL(10,2) | Price per unit |
| `status` | VARCHAR(50) | in-stock / low-stock / out-of-stock (auto-updated) |
| `created_at` | TIMESTAMPTZ | When the record was created |

**raw_materials** -- What goes into production
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `name` | VARCHAR(255) | Material name |
| `sku` | VARCHAR(100) | Material SKU |
| `unit` | VARCHAR(50) | Unit of measure (kg, m, L, pcs, rolls) |
| `quantity_available` | INTEGER | Current stock |
| `reorder_level` | INTEGER | Minimum before reordering |
| `cost_per_unit` | DECIMAL(10,2) | Cost per unit |
| `supplier_id` | UUID (FK) | Links to suppliers table |
| `created_at` | TIMESTAMPTZ | When created |

**production_orders** -- Manufacturing jobs
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `product_id` | UUID (FK) | Links to products table |
| `quantity` | INTEGER | How many units to produce |
| `status` | VARCHAR(50) | Planned / In Progress / Completed |
| `completion_percent` | INTEGER | 0-100% progress |
| `created_at` | TIMESTAMPTZ | When created |

**production_order_materials** -- Bill of Materials (BOM)
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `production_order_id` | UUID (FK) | Links to production_orders |
| `raw_material_id` | UUID (FK) | Links to raw_materials |
| `quantity_required` | INTEGER | How much material needed |

**sales_orders** -- Customer orders
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `customer` | VARCHAR(255) | Customer name |
| `product_id` | UUID (FK) | Links to products table |
| `quantity` | INTEGER | How many units |
| `total` | DECIMAL(10,2) | Total price (qty * unit price) |
| `status` | VARCHAR(50) | Pending / Fulfilled / Archived |
| `created_at` | TIMESTAMPTZ | When ordered |

**purchase_orders** -- Supplier orders
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `supplier_id` | UUID (FK) | Links to suppliers table |
| `product_id` | UUID (FK, nullable) | Links to products table |
| `quantity` | INTEGER | How many units |
| `status` | VARCHAR(50) | Draft / Sent / Received |
| `created_at` | TIMESTAMPTZ | When created |

**purchase_order_items** -- PO line items for raw materials
| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID (auto) | Unique identifier |
| `purchase_order_id` | UUID (FK) | Links to purchase_orders |
| `raw_material_id` | UUID (FK) | Links to raw_materials |
| `quantity` | INTEGER | How much material |
| `cost_per_unit` | DECIMAL(10,2) | Cost per unit |

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

The dashboard uses Supabase Realtime to listen for changes:
```javascript
client
  .channel("products-dashboard")
  .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
    setLastUpdated(new Date())
  })
  .subscribe()
```

When any product or transaction changes in the database, the dashboard's "last updated" timestamp refreshes. This provides a live feel without polling.

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

---

## Data Flow: A Complete Walkthrough

Here is what happens when a user performs a common action -- for example, **creating a new product**:

1. User fills out the product form on the Products page and clicks "Save"
2. React calls `useCreateProduct().mutate(formData)`
3. The mutation function calls `supabase.from("products").insert(formData)`
4. Supabase receives the request, checks RLS (is this user authenticated?)
5. If authenticated, PostgreSQL inserts the row
6. The database trigger `trigger_update_product_status` fires, calculating the initial status
7. Supabase returns the new row to the frontend
8. TanStack Query's `onSuccess` callback invalidates the products query cache
9. All components using `useGetAllProducts()` automatically re-render with fresh data
10. The user sees the new product in the table immediately

For a **dashboard page load**:
1. User navigates to `/dashboard`
2. `DashboardPage` renders and calls `useGetAllProducts()`, `useGetAllTransactions()`, and `useGetAllSuppliers()`
3. TanStack Query checks its cache -- if data was fetched within the last 30 seconds, it returns cached data
4. If cache is stale, it fetches from Supabase
5. While fetching, the page shows loading spinners (from `isLoading` state)
6. When data arrives, KPI cards and charts render
7. Realtime subscriptions start -- if another user updates a product, the "last updated" timestamp refreshes

---

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
