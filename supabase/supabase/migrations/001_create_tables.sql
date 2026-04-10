-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SUPPLIERS TABLE
-- =====================================================
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  lead_time_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  stock_on_hand INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  unit_price DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'in-stock',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RAW MATERIALS TABLE
-- =====================================================
CREATE TABLE raw_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  unit VARCHAR(50) NOT NULL,
  quantity_available INTEGER DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  cost_per_unit DECIMAL(10, 2) DEFAULT 0,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PRODUCTION ORDERS TABLE
-- =====================================================
CREATE TABLE production_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'Planned',
  completion_percent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production order materials (BOM - Bill of Materials)
CREATE TABLE production_order_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  production_order_id UUID REFERENCES production_orders(id) ON DELETE CASCADE NOT NULL,
  raw_material_id UUID REFERENCES raw_materials(id) ON DELETE CASCADE NOT NULL,
  quantity_required INTEGER NOT NULL,
  UNIQUE(production_order_id, raw_material_id)
);

-- =====================================================
-- SALES ORDERS TABLE
-- =====================================================
CREATE TABLE sales_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer VARCHAR(255) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL NOT NULL,
  quantity INTEGER NOT NULL,
  total DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PURCHASE ORDERS TABLE
-- =====================================================
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase order items (for materials)
CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE NOT NULL,
  raw_material_id UUID REFERENCES raw_materials(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  cost_per_unit DECIMAL(10, 2) DEFAULT 0,
  UNIQUE(purchase_order_id, raw_material_id)
);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update product status based on stock levels
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_on_hand = 0 THEN
    NEW.status := 'out-of-stock';
  ELSIF NEW.stock_on_hand <= NEW.reorder_point THEN
    NEW.status := 'low-stock';
  ELSE
    NEW.status := 'in-stock';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update product status
CREATE TRIGGER trigger_update_product_status
  BEFORE INSERT OR UPDATE OF stock_on_hand, reorder_point
  ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_status();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_order_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- SUPPLIERS POLICIES
CREATE POLICY "Allow SELECT for all" ON suppliers
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON suppliers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON suppliers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON suppliers
  FOR DELETE USING (auth.role() = 'authenticated');

-- PRODUCTS POLICIES
CREATE POLICY "Allow SELECT for all" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- RAW MATERIALS POLICIES
CREATE POLICY "Allow SELECT for all" ON raw_materials
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON raw_materials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON raw_materials
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON raw_materials
  FOR DELETE USING (auth.role() = 'authenticated');

-- PRODUCTION ORDERS POLICIES
CREATE POLICY "Allow SELECT for all" ON production_orders
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON production_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON production_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON production_orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- PRODUCTION ORDER MATERIALS POLICIES
CREATE POLICY "Allow SELECT for all" ON production_order_materials
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON production_order_materials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON production_order_materials
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON production_order_materials
  FOR DELETE USING (auth.role() = 'authenticated');

-- SALES ORDERS POLICIES
CREATE POLICY "Allow SELECT for all" ON sales_orders
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON sales_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON sales_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON sales_orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- PURCHASE ORDERS POLICIES
CREATE POLICY "Allow SELECT for all" ON purchase_orders
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON purchase_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON purchase_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON purchase_orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- PURCHASE ORDER ITEMS POLICIES
CREATE POLICY "Allow SELECT for all" ON purchase_order_items
  FOR SELECT USING (true);

CREATE POLICY "Allow INSERT for authenticated" ON purchase_order_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow UPDATE for authenticated" ON purchase_order_items
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow DELETE for authenticated" ON purchase_order_items
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_raw_materials_supplier ON raw_materials(supplier_id);
CREATE INDEX idx_production_orders_product ON production_orders(product_id);
CREATE INDEX idx_production_orders_status ON production_orders(status);
CREATE INDEX idx_sales_orders_product ON sales_orders(product_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
