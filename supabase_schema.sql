-- Supabase SQL Schema for Jeancol Professional

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  "offerPrice" DECIMAL(12, 2),
  "offerEndDate" TIMESTAMP WITH TIME ZONE,
  discount INTEGER,
  category TEXT,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  video TEXT,
  stock INTEGER DEFAULT 0,
  sku TEXT,
  brand TEXT,
  material TEXT,
  weight TEXT,
  dimensions TEXT,
  "sizeGuideType" TEXT DEFAULT 'shoes',
  "isNew" BOOLEAN DEFAULT false,
  "isTrending" BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  "reviewsCount" INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  variations JSONB DEFAULT '[]',
  "hasVariations" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Product Variations Table
CREATE TABLE product_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "productId" UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  price DECIMAL(12, 2),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID, -- Optional if guest checkout is allowed
  "customerName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  shipping DECIMAL(12, 2) NOT NULL,
  discount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  "paymentMethod" TEXT NOT NULL,
  notes TEXT,
  "couponCode" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "orderId" UUID REFERENCES orders(id) ON DELETE CASCADE,
  "productId" UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT,
  color TEXT,
  image TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "productId" UUID REFERENCES products(id) ON DELETE CASCADE,
  "userId" UUID,
  "userName" TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Coupons Table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'percent', 'fixed'
  value DECIMAL(12, 2) NOT NULL,
  "minPurchase" DECIMAL(12, 2) DEFAULT 0,
  "maxDiscount" DECIMAL(12, 2),
  "validFrom" TIMESTAMP WITH TIME ZONE,
  "validUntil" TIMESTAMP WITH TIME ZONE,
  "isActive" BOOLEAN DEFAULT true,
  "usedCount" INTEGER DEFAULT 0,
  "maxUses" INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Home Banners Table
CREATE TABLE home_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  "buttonText" TEXT,
  "buttonLink" TEXT,
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- 9. Home Sections Table
CREATE TABLE home_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0
);

-- 10. Store Config Table
CREATE TABLE store_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT DEFAULT 'Jeancol Professional',
  logo TEXT,
  favicon TEXT,
  "primaryColor" TEXT DEFAULT '#000000',
  "contactEmail" TEXT,
  "contactPhone" TEXT,
  address TEXT,
  "instagramUrl" TEXT,
  "facebookUrl" TEXT,
  "whatsappUrl" TEXT,
  "isMaintenanceMode" BOOLEAN DEFAULT false,
  "heroTitle" TEXT,
  "heroSubtitle" TEXT,
  description TEXT,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert initial store config
INSERT INTO store_config (name) VALUES ('Jeancol Professional');

-- Functions for updatedAt
CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updatedAt
CREATE TRIGGER update_categories_updatedAt BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();
CREATE TRIGGER update_products_updatedAt BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();
CREATE TRIGGER update_orders_updatedAt BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();
CREATE TRIGGER update_store_config_updatedAt BEFORE UPDATE ON store_config FOR EACH ROW EXECUTE PROCEDURE update_updatedAt_column();
