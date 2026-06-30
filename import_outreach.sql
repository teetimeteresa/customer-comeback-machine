-- ============================================
-- Manual Outreach Log Import Script
-- Source files:
--   /home/team/shared/REPORTS/INNOVATION/instagram_dm_log.md
--   /home/team/shared/REPORTS/INNOVATION/association_outreach_log.md
--   /home/team/shared/OUTREACH_MESSAGES/ (11 files)
-- Created: 2026-06-19
-- Revised: 2026-06-25 (renamed table to manual_outreach_log)
-- ============================================

-- First, ensure the manual_outreach_log table exists
CREATE TABLE IF NOT EXISTS manual_outreach_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel TEXT NOT NULL,           -- 'instagram_dm', 'association', 'email_onboarding'
    target_name TEXT NOT NULL,       -- Business or association name
    niche TEXT,                      -- Med Spa, Auto, Cleaning, etc.
    city TEXT,
    contact_email TEXT,
    message_type TEXT,               -- 'warm_hug', 'connection_guard', 'membership_pitch'
    status TEXT NOT NULL DEFAULT 'ready',  -- 'sent', 'awaiting_reply', 'ready', 'blocked', 'contacted'
    date_sent TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSTAGRAM DM — Wave 1 (Sent Jun 11-12)
-- ============================================
INSERT OR IGNORE INTO manual_outreach_log (channel, target_name, niche, city, status, date_sent, message_type, notes)
VALUES
('instagram_dm', 'Austin Med Spa', 'Med Spa', 'Austin', 'awaiting_reply', '2026-06-11', 'connection_guard', 'DM sent. No reply yet. Day 7 follow-up scripted with calculator offer.'),
('instagram_dm', 'Cherry Medical Denver', 'Med Spa', 'Denver', 'awaiting_reply', '2026-06-12', 'connection_guard', 'DM sent. No reply yet. Day 7 follow-up ready.'),
('instagram_dm', 'VIVE Med Spa Denver', 'Med Spa', 'Denver', 'awaiting_reply', '2026-06-12', 'connection_guard', 'DM sent. No reply yet.'),
('instagram_dm', 'NakedMD Denver', 'Med Spa', 'Denver', 'awaiting_reply', '2026-06-12', 'connection_guard', 'DM sent. No reply yet.'),
('instagram_dm', 'Monaco MedSpa Miami', 'Med Spa', 'Miami', 'awaiting_reply', '2026-06-12', 'connection_guard', 'DM sent. No reply yet.');

-- ============================================
-- INSTAGRAM DM — Wave 2 (Ready to deploy)
-- ============================================
INSERT OR IGNORE INTO manual_outreach_log (channel, target_name, niche, city, status, message_type, notes)
VALUES
('instagram_dm', 'Maid in Miami', 'Cleaning', 'Miami', 'ready', 'warm_hug', '"Warm Hug" script crafted. Waiting for Instagram account access.'),
('instagram_dm', 'Dade Auto Repair', 'Auto', 'Miami', 'ready', 'connection_guard', '"Connection Guard" script ready.'),
('instagram_dm', 'Broward Auto Care', 'Auto', 'Miami', 'ready', 'connection_guard', '"Connection Guard" script ready.'),
('instagram_dm', 'South Lamar Cleaners', 'Cleaning', 'Austin', 'ready', 'warm_hug', '"Warm Hug" script ready.'),
('instagram_dm', 'Ultimate Fade Studio', 'Barber', 'Austin', 'ready', 'connection_guard', '"Connection Guard" script ready.');

-- ============================================
-- ASSOCIATION OUTREACH
-- ============================================
INSERT OR IGNORE INTO manual_outreach_log (channel, target_name, niche, city, status, date_sent, message_type, notes)
VALUES
('association', 'Greater Miami Chamber of Commerce', 'Chamber', 'Miami', 'ready', NULL, 'membership_pitch', '3,000+ members. miamichamber.com. Has Member Benefits page. LinkedIn + contact form ready.'),
('association', 'Austin Chamber of Commerce', 'Chamber', 'Austin', 'contacted', '2026-06-18', 'membership_pitch', '2,500+ members. Contact form submitted June 18. Owner HQ Mobile App included in pitch. Waiting for response.'),
('association', 'Denver Metro Chamber of Commerce', 'Chamber', 'Denver', 'blocked', NULL, 'membership_pitch', '3,000+ members. Cloudflare blocks automated contact form access. LinkedIn option only.'),
('association', 'Charlotte Regional Business Alliance', 'Chamber', 'Charlotte', 'blocked', NULL, 'membership_pitch', '2,000+ members. Domain parked/for sale (GoDaddy redirect). LinkedIn only.'),
('association', 'Miami-Dade Chamber of Commerce', 'Chamber', 'Miami', 'ready', NULL, 'membership_pitch', '1,500+ members. miamidadechamber.org. Beauty/salon heavy.'),
('association', 'Latin Chamber of Commerce', 'Chamber', 'Miami', 'ready', NULL, 'membership_pitch', 'camacol.org. Secondary target.'),
('association', 'Austin Independent Business Alliance', 'Chamber', 'Austin', 'ready', NULL, 'membership_pitch', 'ibaaustin.org. Secondary target.'),
('association', 'NC Auto Repair Association', 'Association', 'Charlotte', 'ready', NULL, 'membership_pitch', 'ncara.org. Secondary target.'),
('association', 'Colorado Auto Body Association', 'Association', 'Denver', 'ready', NULL, 'membership_pitch', 'cabacolorado.org. Secondary target.'),
('association', 'Mile High Small Business Alliance', 'Chamber', 'Denver', 'ready', NULL, 'membership_pitch', 'milehighbiz.org. Secondary target.');

-- ============================================
-- OUTREACH MESSAGES (Personalized Onboarding Emails)
-- from /home/team/shared/OUTREACH_MESSAGES/
-- ============================================
INSERT OR IGNORE INTO manual_outreach_log (channel, target_name, niche, contact_email, status, message_type, notes)
VALUES
('email_onboarding', 'Candlefish', 'Retail/Candle Making', 'info@candlefish.com', 'sent', 'onboarding_followup', 'Birthday Club fit. Simulated onboarding follow-up. May 26, 2026.'),
('email_onboarding', 'Black Tap Coffee', 'Coffee Shop', 'info@blacktapcoffee.com', 'sent', 'onboarding_followup', 'Win-back email focus. Simulated onboarding. May 26, 2026.'),
('email_onboarding', 'Sugar Bakeshop', 'Bakery', 'hello@sugarbakeshop.com', 'sent', 'onboarding_followup', 'Birthday Club focus. Simulated onboarding. May 26, 2026.'),
('email_onboarding', 'Indigo & Cotton', 'Retail/Clothing', 'info@indigoandcotton.com', 'sent', 'onboarding_followup', 'General onboarding checklist. May 26, 2026.'),
('email_onboarding', 'Caviar and Bananas', 'Restaurant/Cafe', NULL, 'sent', 'onboarding_followup', 'Onboarding follow-up. May 26, 2026.'),
('email_onboarding', 'Hampden Clothing', 'Retail/Clothing', NULL, 'sent', 'onboarding_followup', 'Onboarding follow-up. May 26, 2026.'),
('email_onboarding', 'Pink Dot Beauty Bar', 'Beauty/Salon', NULL, 'sent', 'onboarding_followup', 'Onboarding follow-up. May 26, 2026.'),
('email_onboarding', 'Revelator Coffee', 'Coffee Shop', NULL, 'sent', 'onboarding_followup', 'Onboarding follow-up. May 26, 2026.'),
('email_onboarding', 'Teresa Business', 'Business Services', NULL, 'sent', 'onboarding_followup', 'Onboarding follow-up. May 26, 2026.'),
('email_onboarding', 'The Daily', 'Restaurant/Cafe', NULL, 'sent', 'onboarding_followup', 'Onboarding follow-up. May 26, 2026.'),
('email_onboarding', 'Worthwhile', 'Retail', NULL, 'sent', 'onboarding_followup', 'Onboarding follow-up. May 26, 2026.');
