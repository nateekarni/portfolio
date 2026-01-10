-- Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'Portfolio',
    site_description TEXT DEFAULT 'My Personal Portfolio',
    logo_text TEXT DEFAULT 'Portfolio',
    logo_image_url TEXT, -- If present, use this instead of icon+text
    favicon_url TEXT,
    meta_keywords TEXT DEFAULT 'portfolio, developer, fullstack',
    email_notification TEXT, -- For admin notifications
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Settings" ON site_settings;
CREATE POLICY "Public Read Settings" ON site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin All Settings" ON site_settings;
CREATE POLICY "Admin All Settings" ON site_settings FOR ALL USING (true);
