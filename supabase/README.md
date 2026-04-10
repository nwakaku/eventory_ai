# Supabase Backend Setup

## Quick Setup (No CLI Required)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned (2-3 minutes)

### 2. Get API Keys

1. Go to **Project Settings → API**
2. Copy the **Project URL** and **anon public** key
3. Create `.env` file in `apps/web/`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Migration SQL

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the SQL from `supabase/supabase/migrations/001_create_tables.sql`
3. Click **Run**

### 4. Run Seed SQL

1. In **SQL Editor**, copy the SQL from `supabase/supabase/seed.sql`
2. Click **Run**

---

## With Supabase CLI (Alternative)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
npx supabase login

# Link to project
cd supabase
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push

# Seed data
npx supabase db seed
```

---

## Table Structure

| Table                        | Description                       |
| ---------------------------- | --------------------------------- |
| `suppliers`                  | Supplier information              |
| `products`                   | Product catalog with stock levels |
| `raw_materials`              | Raw materials linked to suppliers |
| `production_orders`          | Manufacturing orders              |
| `production_order_materials` | Bill of Materials                 |
| `sales_orders`               | Customer orders                   |
| `purchase_orders`            | Supplier purchase orders          |
| `purchase_order_items`       | PO line items                     |

---

## Example API Queries

```javascript
import { supabase } from '@/lib/supabase'

// Fetch all products
const { data } = await supabase.from('products').select('*')

// Fetch products with low stock
const { data } = await supabase
  .from('products')
  .select('*')
  .lte('stock_on_hand', supabase.rpc('reorder_point'))

// Create order
await supabase
  .from('sales_orders')
  .insert([{ customer: 'Acme', product_id: '...', quantity: 5 }])

// Update stock
await supabase
  .from('products')
  .update({ stock_on_hand: 100 })
  .eq('id', productId)
```

---

## Environment Variables

Required in `apps/web/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
