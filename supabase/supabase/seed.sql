-- =====================================================
-- SEED DATA FOR ENVENTORY
-- =====================================================

-- =====================================================
-- SUPPLIERS (3 realistic suppliers)
-- =====================================================
INSERT INTO suppliers (id, name, email, phone, lead_time_days) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Steel Co Ltd', 'james@steelco.com', '+1 555-0123', 7),
  ('22222222-2222-2222-2222-222222222222', 'Aluminum Inc', 'sarah@aluminum.com', '+1 555-0124', 5),
  ('33333333-3333-3333-3333-333333333333', 'Copper World', 'mike@copperworld.com', '+1 555-0125', 10),
  ('44444444-4444-4444-4444-444444444444', 'Plastics Direct', 'lisa@plastics.com', '+1 555-0126', 3),
  ('55555555-5555-5555-5555-555555555555', 'Rubber Solutions', 'tom@rubbersol.com', '+1 555-0127', 4);

-- =====================================================
-- PRODUCTS (10 products with varied stock levels)
-- =====================================================
INSERT INTO products (id, name, sku, category, stock_on_hand, reorder_point, unit_price, status) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'Industrial Pump A200', 'PMP-001', 'Pumps', 145, 50, 299.99, 'in-stock'),
  ('aaaa2222-2222-2222-2222-222222222222', 'Valve Assembly V50', 'VLV-050', 'Valves', 89, 30, 149.99, 'in-stock'),
  ('aaaa3333-3333-3333-3333-333333333333', 'Motor Unit M-100', 'MTR-100', 'Motors', 23, 25, 599.99, 'low-stock'),
  ('aaaa4444-4444-4444-4444-444444444444', 'Control Panel CP-7', 'CTL-007', 'Controls', 67, 20, 899.99, 'in-stock'),
  ('aaaa5555-5555-5555-5555-555555555555', 'Sensor Array S-25', 'SNS-025', 'Sensors', 5, 15, 249.99, 'low-stock'),
  ('aaaa6666-6666-6666-6666-666666666666', 'Hydraulic Cylinder HC-12', 'HYD-012', 'Hydraulics', 34, 20, 459.99, 'in-stock'),
  ('aaaa7777-7777-7777-7777-777777777777', 'Pressure Gauge PG-50', 'GGE-050', 'Gauges', 12, 25, 89.99, 'low-stock'),
  ('aaaa8888-8888-8888-8888-888888888888', 'Flow Meter FM-100', 'GGE-100', 'Gauges', 0, 10, 199.99, 'out-of-stock'),
  ('aaaa9999-9999-9999-9999-999999999999', 'Gearbox Assembly GB-5', 'GRB-005', 'Transmissions', 56, 15, 749.99, 'in-stock'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Heat Exchanger HX-200', 'HEX-200', 'Thermal', 18, 10, 1299.99, 'in-stock');

-- =====================================================
-- RAW MATERIALS (8 materials)
-- =====================================================
INSERT INTO raw_materials (id, name, sku, unit, quantity_available, reorder_level, cost_per_unit, supplier_id) VALUES
  ('bbbb1111-1111-1111-1111-111111111111', 'Steel Rod 10mm', 'MAT-001', 'kg', 45, 100, 2.50, '11111111-1111-1111-1111-111111111111'),
  ('bbbb2222-2222-2222-2222-222222222222', 'Copper Wire 2mm', 'MAT-002', 'kg', 78, 150, 8.50, '33333333-3333-3333-3333-333333333333'),
  ('bbbb3333-3333-3333-3333-333333333333', 'Aluminum Sheet 3mm', 'MAT-003', 'kg', 120, 200, 4.20, '22222222-2222-2222-2222-222222222222'),
  ('bbbb4444-4444-4444-4444-444444444444', 'ABS Pellets', 'MAT-004', 'kg', 250, 400, 1.80, '44444444-4444-4444-4444-444444444444'),
  ('bbbb5555-5555-5555-5555-555555555555', 'Rubber Gaskets', 'MAT-005', 'pcs', 340, 500, 0.75, '55555555-5555-5555-5555-555555555555'),
  ('bbbb6666-6666-6666-6666-666666666666', 'Brass Fittings', 'MAT-006', 'pcs', 890, 300, 1.25, '33333333-3333-3333-3333-333333333333'),
  ('bbbb7777-7777-7777-7777-777777777777', 'Stainless Steel Sheet', 'MAT-007', 'kg', 180, 250, 6.80, '11111111-1111-1111-1111-111111111111'),
  ('bbbb8888-8888-8888-8888-888888888888', 'PVC Pellets', 'MAT-008', 'kg', 95, 150, 1.45, '44444444-4444-4444-4444-444444444444');

-- =====================================================
-- PRODUCTION ORDERS (5 orders across all statuses)
-- =====================================================
INSERT INTO production_orders (id, product_id, quantity, status, completion_percent, created_at) VALUES
  ('cccc1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 10, 'Planned', 0, NOW() - INTERVAL '5 days'),
  ('cccc2222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 25, 'In Progress', 60, NOW() - INTERVAL '3 days'),
  ('cccc3333-3333-3333-3333-333333333333', 'aaaa3333-3333-3333-3333-333333333333', 5, 'In Progress', 35, NOW() - INTERVAL '2 days'),
  ('cccc4444-4444-4444-4444-444444444444', 'aaaa4444-4444-4444-4444-444444444444', 15, 'Completed', 100, NOW() - INTERVAL '7 days'),
  ('cccc5555-5555-5555-5555-555555555555', 'aaaa5555-5555-5555-5555-555555555555', 20, 'Planned', 0, NOW() - INTERVAL '1 day');

-- Production Order Materials (Bill of Materials)
INSERT INTO production_order_materials (production_order_id, raw_material_id, quantity_required) VALUES
  ('cccc1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 50),
  ('cccc1111-1111-1111-1111-111111111111', 'bbbb5555-5555-5555-5555-555555555555', 20),
  ('cccc2222-2222-2222-2222-222222222222', 'bbbb3333-3333-3333-3333-333333333333', 75),
  ('cccc2222-2222-2222-2222-222222222222', 'bbbb4444-4444-4444-4444-444444444444', 30),
  ('cccc3333-3333-3333-3333-333333333333', 'bbbb1111-1111-1111-1111-111111111111', 40),
  ('cccc4444-4444-4444-4444-444444444444', 'bbbb3333-3333-3333-3333-333333333333', 45),
  ('cccc5555-5555-5555-5555-555555555555', 'bbbb2222-2222-2222-2222-222222222222', 25);

-- =====================================================
-- SALES ORDERS (6 orders across all statuses)
-- =====================================================
INSERT INTO sales_orders (id, customer, product_id, quantity, total, status, created_at) VALUES
  ('dddd1111-1111-1111-1111-111111111111', 'Acme Corp', 'aaaa1111-1111-1111-1111-111111111111', 5, 1499.95, 'Pending', NOW() - INTERVAL '1 day'),
  ('dddd2222-2222-2222-2222-222222222222', 'Tech Industries', 'aaaa2222-2222-2222-2222-222222222222', 10, 1499.90, 'Pending', NOW() - INTERVAL '2 days'),
  ('dddd3333-3333-3333-3333-333333333333', 'Global Motors', 'aaaa4444-4444-4444-4444-444444444444', 3, 2699.97, 'Fulfilled', NOW() - INTERVAL '5 days'),
  ('dddd4444-4444-4444-4444-444444444444', 'BuildRight Inc', 'aaaa1111-1111-1111-1111-111111111111', 8, 2399.92, 'Fulfilled', NOW() - INTERVAL '7 days'),
  ('dddd5555-5555-5555-5555-555555555555', 'MediCare Plus', 'aaaa6666-6666-6666-6666-666666666666', 4, 1839.96, 'Fulfilled', NOW() - INTERVAL '10 days'),
  ('dddd6666-6666-6666-6666-666666666666', 'Energy Solutions Ltd', 'aaaa9999-9999-9999-9999-999999999999', 2, 2599.98, 'Archived', NOW() - INTERVAL '15 days');

-- =====================================================
-- PURCHASE ORDERS (4 orders across all statuses)
-- =====================================================
INSERT INTO purchase_orders (id, supplier_id, product_id, quantity, status, created_at) VALUES
  ('eeee1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NULL, 200, 'Sent', NOW() - INTERVAL '3 days'),
  ('eeee2222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', NULL, 300, 'Draft', NOW() - INTERVAL '1 day'),
  ('eeee3333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', NULL, 400, 'Received', NOW() - INTERVAL '10 days'),
  ('eeee4444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', NULL, 500, 'Sent', NOW() - INTERVAL '2 days');

-- Purchase Order Items (for raw materials)
INSERT INTO purchase_order_items (purchase_order_id, raw_material_id, quantity, cost_per_unit) VALUES
  ('eeee1111-1111-1111-1111-111111111111', 'bbbb1111-1111-1111-1111-111111111111', 200, 2.50),
  ('eeee2222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-222222222222', 300, 8.50),
  ('eeee3333-3333-3333-3333-333333333333', 'bbbb3333-3333-3333-3333-333333333333', 400, 4.20),
  ('eeee4444-4444-4444-4444-444444444444', 'bbbb4444-4444-4444-4444-444444444444', 500, 1.80);

-- =====================================================
-- UPDATE RAW MATERIALS STOCK AFTER RECEIVED POs
-- =====================================================
UPDATE raw_materials 
SET quantity_available = quantity_available + 400
WHERE id = 'bbbb3333-3333-3333-3333-333333333333';

-- =====================================================
-- VERIFICATION QUERIES (optional - for testing)
-- =====================================================

-- SELECT 'Suppliers:' as info, COUNT(*) as count FROM suppliers
-- UNION ALL
-- SELECT 'Products:', COUNT(*) FROM products
-- UNION ALL
-- SELECT 'Raw Materials:', COUNT(*) FROM raw_materials
-- UNION ALL
-- SELECT 'Production Orders:', COUNT(*) FROM production_orders
-- UNION ALL
-- SELECT 'Sales Orders:', COUNT(*) FROM sales_orders
-- UNION ALL
-- SELECT 'Purchase Orders:', COUNT(*) FROM purchase_orders;
