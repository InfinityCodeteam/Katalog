-- ============================================================
-- Katalog Curtains - Initial Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Models
CREATE TABLE IF NOT EXISTS models (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Model Images
CREATE TABLE IF NOT EXISTS model_images (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id  UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment       TEXT NOT NULL,
  is_approved   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (Our Work)
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Settings (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key   TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT ''
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_models_category ON models(category_id);
CREATE INDEX IF NOT EXISTS idx_model_images_model ON model_images(model_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE models       ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings     ENABLE ROW LEVEL SECURITY;

-- Public READ policies
CREATE POLICY "Public read categories"   ON categories   FOR SELECT USING (true);
CREATE POLICY "Public read models"       ON models       FOR SELECT USING (true);
CREATE POLICY "Public read model_images" ON model_images FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON reviews  FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read projects"     ON projects     FOR SELECT USING (true);
CREATE POLICY "Public read settings"     ON settings     FOR SELECT USING (true);

-- Public INSERT for reviews (submit review, not approved by default)
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (is_approved = false);

-- Admin full access (authenticated users)
CREATE POLICY "Admin all categories"   ON categories   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all models"       ON models       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all model_images" ON model_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all reviews"      ON reviews      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all projects"     ON projects     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all settings"     ON settings     FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Create storage buckets (run these manually in Supabase Dashboard → Storage)
-- Or use the SQL below if the storage extension is enabled:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('models',   'models',   true, 5242880, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']),
  ('projects', 'projects', true, 5242880, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']),
  ('settings', 'settings', true, 5242880, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read
CREATE POLICY "Public read models storage"   ON storage.objects FOR SELECT USING (bucket_id = 'models');
CREATE POLICY "Public read projects storage" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Public read settings storage" ON storage.objects FOR SELECT USING (bucket_id = 'settings');

-- Storage policies: authenticated write
CREATE POLICY "Admin write models storage"   ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'models'   AND auth.role() = 'authenticated');
CREATE POLICY "Admin write projects storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Admin write settings storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'settings' AND auth.role() = 'authenticated');
CREATE POLICY "Admin update models storage"  ON storage.objects FOR UPDATE USING (bucket_id = 'models'   AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete models storage"  ON storage.objects FOR DELETE USING (bucket_id = 'models'   AND auth.role() = 'authenticated');
CREATE POLICY "Admin update projects storage" ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete projects storage" ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND auth.role() = 'authenticated');
CREATE POLICY "Admin update settings storage" ON storage.objects FOR UPDATE USING (bucket_id = 'settings' AND auth.role() = 'authenticated');

-- ============================================================
-- SAMPLE DATA (optional - remove in production)
-- ============================================================

-- Sample categories
INSERT INTO categories (name) VALUES
  ('ستائر عصرية'),
  ('ستائر كلاسيكية'),
  ('ستائر غرفة المعيشة'),
  ('ستائر غرفة النوم'),
  ('ستائر غرفة الأطفال')
ON CONFLICT DO NOTHING;

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('store_name',     'كتالوج الستائر'),
  ('hero_slogan',    'أناقة لا مثيل لها في كل تفصيل'),
  ('whatsapp_number','201234567890'),
  ('phone_number',   '01234567890'),
  ('address',        'القاهرة، مصر'),
  ('facebook_url',   ''),
  ('instagram_url',  ''),
  ('hero_image_url', '')
ON CONFLICT (key) DO NOTHING;
