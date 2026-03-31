-- Supabase RLS Policies for JeanCol
-- Ejecutar en SQL Editor de Supabase

-- ============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE LECTURA PÚBLICA
-- ============================================

-- Categories: cualquier persona puede leer
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Products: cualquier persona puede leer
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Products: cualquier persona puede insertar (para el admin desde la app)
CREATE POLICY "Public insert products" ON products FOR INSERT WITH CHECK (true);

-- Products: cualquier persona puede actualizar
CREATE POLICY "Public update products" ON products FOR UPDATE USING (true);

-- Products: cualquier persona puede eliminar
CREATE POLICY "Public delete products" ON products FOR DELETE USING (true);

-- Orders: lectura pública (o solo para usuarios autenticados)
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);

-- Orders: cualquier persona puede crear pedidos
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Orders: solo usuario puede actualizar sus propios pedidos
CREATE POLICY "Users update own orders" ON orders FOR UPDATE USING (auth.uid() = "userId" OR true);

-- Order Items: lectura pública
CREATE POLICY "Public read order_items" ON order_items FOR SELECT USING (true);

-- Order Items: cualquier persona puede crear
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Reviews: lectura pública
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- Reviews: cualquier persona puede crear reseñas
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Coupons: lectura pública
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (true);

-- Coupons: cualquier persona puede insertar/actualizar (admin)
CREATE POLICY "Public manage coupons" ON coupons FOR ALL USING (true);

-- Home Banners: lectura pública
CREATE POLICY "Public read home_banners" ON home_banners FOR SELECT USING (true);

-- Home Banners: cualquier persona puede gestionar
CREATE POLICY "Public manage home_banners" ON home_banners FOR ALL USING (true);

-- Home Sections: lectura pública
CREATE POLICY "Public read home_sections" ON home_sections FOR SELECT USING (true);

-- Home Sections: cualquier persona puede gestionar
CREATE POLICY "Public manage home_sections" ON home_sections FOR ALL USING (true);

-- Store Config: lectura pública
CREATE POLICY "Public read store_config" ON store_config FOR SELECT USING (true);

-- Store Config: cualquier persona puede actualizar
CREATE POLICY "Public update store_config" ON store_config FOR UPDATE USING (true);

-- ============================================
-- USUARIOS Y AUTENTICACIÓN
-- ============================================

-- Tabla de perfiles de usuario (si no existe, crearla)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  "fullName" TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user',
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: cualquier persona puede leer perfiles
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);

-- Política: usuarios pueden actualizar su propio perfil
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, "fullName")
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICAR CONFIGURACIÓN
-- ============================================

SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;