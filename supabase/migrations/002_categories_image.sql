-- Add image_url column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Storage bucket for categories images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('categories', 'categories', true, 5242880, ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read categories storage"  ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Admin write categories storage"  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'categories' AND auth.role() = 'authenticated');
CREATE POLICY "Admin update categories storage" ON storage.objects FOR UPDATE USING (bucket_id = 'categories' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete categories storage" ON storage.objects FOR DELETE USING (bucket_id = 'categories' AND auth.role() = 'authenticated');
