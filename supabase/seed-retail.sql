-- Run this in your Supabase SQL Editor
-- Clear and seed retail/grocery inventory data with data for ALL routes

-- 1. Create purchase_orders table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'purchase_orders') THEN
        CREATE TABLE purchase_orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL NOT NULL,
            product_id UUID REFERENCES products(id) ON DELETE SET NULL,
            quantity INTEGER NOT NULL,
            status VARCHAR(50) DEFAULT 'Draft',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Allow SELECT for all" ON purchase_orders FOR SELECT USING (true);
        CREATE POLICY "Allow INSERT for authenticated" ON purchase_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        CREATE POLICY "Allow UPDATE for authenticated" ON purchase_orders FOR UPDATE USING (auth.role() = 'authenticated');
        CREATE POLICY "Allow DELETE for authenticated" ON purchase_orders FOR DELETE USING (auth.role() = 'authenticated');
        
        -- Create indexes
        CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
        CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
    END IF;
END $$;

-- 2. Clear existing data
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'transactions') THEN DELETE FROM transactions; END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'sales_orders') THEN DELETE FROM sales_orders; END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'purchase_orders') THEN DELETE FROM purchase_orders; END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN DELETE FROM products; END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'suppliers') THEN DELETE FROM suppliers; END IF;
END $$;

-- 3. Insert suppliers
INSERT INTO suppliers (name, email, phone, lead_time_days) VALUES
  ('Lagos Fresh Distributors', 'orders@lagosfresh.ng', '08012345678', 3),
  ('Abuja Grains & Provisions', 'sales@abujagrains.ng', '08023456789', 5),
  ('Ibadan Food Supplies', 'info@ibadanfoods.ng', '08034567890', 2),
  ('Port Harcourt Agro', 'ph@harcourtagro.ng', '08045678901', 4),
  ('Kano Commodity Center', 'kano@commodity.ng', '08056789012', 7);

-- 4. Insert products
INSERT INTO products (name, sku, category, stock_on_hand, reorder_point, unit_price, barcode, expiry_date, supplier_id, cost_price, unit) VALUES
  -- Beverages
  ('Maltina 35cl', 'BEV001', 'Beverages', 120, 30, 350, '5449000001234', NULL, (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 280, 'pack'),
  ('Coca Cola 50cl', 'BEV002', 'Beverages', 200, 50, 300, '5449000005678', NULL, (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 240, 'pack'),
  ('Pepsi 50cl', 'BEV003', 'Beverages', 150, 40, 300, '5449000009012', NULL, (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 245, 'pack'),
  ('Milo 400g', 'BEV004', 'Beverages', 80, 20, 950, '5449000012345', '2025-12-01', (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 800, 'tin'),
  ('Peak Milk 800g', 'BEV005', 'Beverages', 50, 15, 1200, '5449000023456', '2025-11-01', (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 980, 'tin'),

  -- Snacks
  ('Indomie Chicken Flavor', 'SNK001', 'Snacks', 300, 50, 250, '8998868901234', '2025-09-15', (SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), 180, 'pack'),
  ('Indomie Beef Flavor', 'SNK002', 'Snacks', 250, 50, 250, '8998868905678', '2025-09-15', (SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), 180, 'pack'),
  ('Gala Sausage Roll', 'SNK003', 'Snacks', 100, 25, 200, '5034567890123', '2025-07-01', (SELECT id FROM suppliers WHERE name = 'Ibadan Food Supplies'), 150, 'unit'),
  ('Oreo Biscuit Pack', 'SNK004', 'Snacks', 80, 20, 400, '5012345678901', '2025-11-01', (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 320, 'pack'),
  ('Milk Chocolate Bar', 'SNK005', 'Snacks', 60, 15, 250, '5012345678902', '2025-10-01', (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 180, 'unit'),

  -- Rice & Grains
  ('Rice 5kg (Local)', 'GRN001', 'Rice & Grains', 40, 10, 4500, 'NG123456789001', NULL, (SELECT id FROM suppliers WHERE name = 'Kano Commodity Center'), 4000, 'bag'),
  ('Rice 5kg (Imported)', 'GRN002', 'Rice & Grains', 25, 8, 5500, 'NG123456789002', NULL, (SELECT id FROM suppliers WHERE name = 'Kano Commodity Center'), 5000, 'bag'),
  ('Garri (Yellow) 5kg', 'GRN003', 'Rice & Grains', 50, 15, 2500, 'NG123456789003', NULL, (SELECT id FROM suppliers WHERE name = 'Ibadan Food Supplies'), 2100, 'bag'),
  ('Beans (Honey) 1kg', 'GRN004', 'Rice & Grains', 35, 10, 800, 'NG123456789004', NULL, (SELECT id FROM suppliers WHERE name = 'Ibadan Food Supplies'), 650, 'bag'),
  ('Semovita 5kg', 'GRN005', 'Rice & Grains', 30, 8, 2800, 'NG123456789005', NULL, (SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), 2400, 'bag'),

  -- Oil & Cooking
  ('Vegetable Oil 3L', 'OIL001', 'Oil & Cooking', 45, 12, 2200, 'NG987654321001', NULL, (SELECT id FROM suppliers WHERE name = 'Port Harcourt Agro'), 1900, 'bottle'),
  ('Palm Oil 5L', 'OIL002', 'Oil & Cooking', 30, 8, 3500, 'NG987654321002', NULL, (SELECT id FROM suppliers WHERE name = 'Port Harcourt Agro'), 3100, 'bottle'),
  ('Butter 500g', 'OIL003', 'Oil & Cooking', 25, 5, 1500, '5012345678903', '2025-08-01', (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 1200, 'pack'),

  -- Canned Goods
  ('Tomato Paste 400g', 'CAN001', 'Canned Goods', 80, 20, 600, '5443000001234', '2026-03-01', (SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), 480, 'tin'),
  ('Sardine 250g', 'CAN002', 'Canned Goods', 50, 15, 800, '5443000005678', '2026-01-01', (SELECT id FROM suppliers WHERE name = 'Port Harcourt Agro'), 650, 'tin'),
  ('Tuna 170g', 'CAN003', 'Canned Goods', 40, 10, 1000, '5443000009012', '2026-02-01', (SELECT id FROM suppliers WHERE name = 'Port Harcourt Agro'), 820, 'tin'),

  -- Detergents
  ('Detergent Powder 1kg', 'DET001', 'Detergents', 60, 15, 900, 'NG555123456001', NULL, (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 750, 'pack'),
  ('Detergent Liquid 750ml', 'DET002', 'Detergents', 45, 12, 650, 'NG555123456002', NULL, (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 520, 'bottle'),
  ('Bleach 750ml', 'DET003', 'Detergents', 35, 8, 400, 'NG555123456003', NULL, (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 300, 'bottle'),
  ('Toilet Soap 6pcs', 'DET004', 'Detergents', 100, 25, 800, 'NG555123456004', NULL, (SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), 650, 'pack'),

  -- Cosmetics (low stock for alerts)
  ('Hair Cream 300ml', 'COS001', 'Cosmetics', 8, 15, 1200, 'NG888123456001', '2025-12-01', (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 950, 'bottle'),
  ('Body Lotion 500ml', 'COS002', 'Cosmetics', 5, 10, 1800, 'NG888123456002', '2025-11-01', (SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), 1500, 'bottle'),
  ('Perfume 50ml', 'COS003', 'Cosmetics', 12, 5, 2500, 'NG888123456003', '2026-05-01', (SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), 2000, 'bottle');

-- 5. Insert Purchase Orders
INSERT INTO purchase_orders (supplier_id, product_id, quantity, status, created_at) VALUES
  ((SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), (SELECT id FROM products WHERE sku = 'BEV001'), 100, 'Pending', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), (SELECT id FROM products WHERE sku = 'BEV002'), 150, 'Fulfilled', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), (SELECT id FROM products WHERE sku = 'SNK001'), 200, 'Pending', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM suppliers WHERE name = 'Ibadan Food Supplies'), (SELECT id FROM products WHERE sku = 'GRN003'), 50, 'Fulfilled', NOW() - INTERVAL '7 days'),
  ((SELECT id FROM suppliers WHERE name = 'Kano Commodity Center'), (SELECT id FROM products WHERE sku = 'GRN001'), 30, 'Pending', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM suppliers WHERE name = 'Port Harcourt Agro'), (SELECT id FROM products WHERE sku = 'OIL001'), 40, 'Fulfilled', NOW() - INTERVAL '10 days'),
  ((SELECT id FROM suppliers WHERE name = 'Abuja Grains & Provisions'), (SELECT id FROM products WHERE sku = 'CAN001'), 60, 'Pending', NOW() - INTERVAL '1 day'),
  ((SELECT id FROM suppliers WHERE name = 'Lagos Fresh Distributors'), (SELECT id FROM products WHERE sku = 'COS002'), 20, 'Pending', NOW() - INTERVAL '4 days');

-- 6. Insert Sales Orders
INSERT INTO sales_orders (customer, product_id, quantity, total, status, created_at) VALUES
  ('John Adeyemi', (SELECT id FROM products WHERE sku = 'BEV001'), 3, 1050, 'Fulfilled', NOW() - INTERVAL '1 hour'),
  ('Mary Johnson', (SELECT id FROM products WHERE sku = 'SNK001'), 5, 1250, 'Fulfilled', NOW() - INTERVAL '3 hours'),
  ('Ahmed Bello', (SELECT id FROM products WHERE sku = 'GRN001'), 2, 9000, 'Pending', NOW() - INTERVAL '5 hours'),
  ('Sarah Okonkwo', (SELECT id FROM products WHERE sku = 'OIL001'), 1, 2200, 'Fulfilled', NOW() - INTERVAL '8 hours'),
  ('David Okafor', (SELECT id FROM products WHERE sku = 'DET001'), 2, 1800, 'Fulfilled', NOW() - INTERVAL '1 day'),
  ('Grace Eze', (SELECT id FROM products WHERE sku = 'BEV002'), 6, 1800, 'Fulfilled', NOW() - INTERVAL '2 days'),
  ('Michael Chukwu', (SELECT id FROM products WHERE sku = 'GRN003'), 4, 10000, 'Pending', NOW() - INTERVAL '3 days'),
  ('Joyce Nwosu', (SELECT id FROM products WHERE sku = 'CAN002'), 2, 1600, 'Fulfilled', NOW() - INTERVAL '4 days'),
  ('Patrick Igwe', (SELECT id FROM products WHERE sku = 'SNK002'), 8, 2000, 'Fulfilled', NOW() - INTERVAL '5 days'),
  ('Angela Obi', (SELECT id FROM products WHERE sku = 'OIL002'), 1, 3500, 'Pending', NOW() - INTERVAL '6 days'),
  ('Chidi Opara', (SELECT id FROM products WHERE sku = 'BEV004'), 2, 1900, 'Fulfilled', NOW() - INTERVAL '7 days'),
  ('Ngozi Uche', (SELECT id FROM products WHERE sku = 'SNK003'), 10, 2000, 'Fulfilled', NOW() - INTERVAL '8 days');

-- 7. Insert Transactions
INSERT INTO transactions (items, total, payment_method, created_at) VALUES
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'BEV001') || '", "quantity": 2, "price": 350}, {"product_id": "' || (SELECT id FROM products WHERE sku = 'SNK001') || '", "quantity": 4, "price": 250}]')::jsonb, 1500, 'cash', NOW() - INTERVAL '1 hour'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'GRN001') || '", "quantity": 1, "price": 4500}]')::jsonb, 4500, 'transfer', NOW() - INTERVAL '3 hours'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'OIL001') || '", "quantity": 2, "price": 2200}, {"product_id": "' || (SELECT id FROM products WHERE sku = 'CAN001') || '", "quantity": 3, "price": 600}]')::jsonb, 6200, 'cash', NOW() - INTERVAL '5 hours'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'SNK003') || '", "quantity": 5, "price": 200}]')::jsonb, 1000, 'cash', NOW() - INTERVAL '8 hours'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'DET001') || '", "quantity": 2, "price": 900}]')::jsonb, 1800, 'transfer', NOW() - INTERVAL '1 day'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'BEV002') || '", "quantity": 6, "price": 300}]')::jsonb, 1800, 'cash', NOW() - INTERVAL '1 day'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'GRN003') || '", "quantity": 2, "price": 2500}]')::jsonb, 5000, 'transfer', NOW() - INTERVAL '2 days'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'SNK001') || '", "quantity": 10, "price": 250}, {"product_id": "' || (SELECT id FROM products WHERE sku = 'SNK002') || '", "quantity": 5, "price": 250}]')::jsonb, 3750, 'cash', NOW() - INTERVAL '3 days'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'CAN002') || '", "quantity": 4, "price": 800}]')::jsonb, 3200, 'cash', NOW() - INTERVAL '4 days'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'OIL002') || '", "quantity": 1, "price": 3500}]')::jsonb, 3500, 'transfer', NOW() - INTERVAL '5 days'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'BEV004') || '", "quantity": 2, "price": 950}]')::jsonb, 1900, 'cash', NOW() - INTERVAL '6 days'),
  (('[{"product_id": "' || (SELECT id FROM products WHERE sku = 'DET002') || '", "quantity": 3, "price": 650}]')::jsonb, 1950, 'transfer', NOW() - INTERVAL '7 days');

-- 8. Verify all data
SELECT 'Products' as table_name, COUNT(*) as count FROM products
UNION ALL SELECT 'Suppliers', COUNT(*) FROM suppliers
UNION ALL SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL SELECT 'Sales Orders', COUNT(*) FROM sales_orders
UNION ALL SELECT 'Purchase Orders', COUNT(*) FROM purchase_orders;