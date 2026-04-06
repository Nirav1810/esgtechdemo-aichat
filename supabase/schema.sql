-- ============================================================
-- ESG AI - Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        UNIQUE NOT NULL,
  password    TEXT        NOT NULL,
  name        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CHATS
CREATE TABLE IF NOT EXISTS chats (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  page_type   TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);

-- CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
  id                          SERIAL      PRIMARY KEY,
  chat_id                     UUID        NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role                        TEXT        NOT NULL,
  content                     TEXT        NOT NULL,
  timestamp                   TIMESTAMPTZ DEFAULT NOW(),
  generated_image_data_url    TEXT,
  generated_image_mime_type   TEXT,
  generated_image_model       TEXT,
  "order"                     INTEGER     DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages(chat_id);

-- CHAT MESSAGE ATTACHMENTS
CREATE TABLE IF NOT EXISTS chat_message_attachments (
  id               SERIAL  PRIMARY KEY,
  message_id       INTEGER NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  name             TEXT,
  size             FLOAT,
  kind             TEXT,
  preview_data_url TEXT
);

-- EMISSION SUMMARIES
CREATE TABLE IF NOT EXISTS emission_summaries (
  id                  SERIAL  PRIMARY KEY,
  fiscal_year         TEXT    UNIQUE NOT NULL,
  total_emissions     FLOAT   NOT NULL DEFAULT 0,
  scope1_value        FLOAT   NOT NULL DEFAULT 0,
  scope1_status       TEXT    DEFAULT 'Data available',
  scope2_value        FLOAT   NOT NULL DEFAULT 0,
  scope2_status       TEXT    DEFAULT 'Data available',
  scope3_value        FLOAT   NOT NULL DEFAULT 0,
  scope3_status       TEXT    DEFAULT 'Data available',
  scope1_percentage   FLOAT   DEFAULT 0,
  scope2_percentage   FLOAT   DEFAULT 0,
  scope3_percentage   FLOAT   DEFAULT 0,
  top_emitters        TEXT[]  DEFAULT '{}',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- EMISSION MONTHLY
CREATE TABLE IF NOT EXISTS emission_monthly (
  id          SERIAL  PRIMARY KEY,
  fiscal_year TEXT    NOT NULL,
  scope       INTEGER NOT NULL,
  month       TEXT    NOT NULL,
  stationary  FLOAT   DEFAULT 0,
  mobile      FLOAT   DEFAULT 0,
  fugitive    FLOAT   DEFAULT 0,
  renewable   FLOAT   DEFAULT 0,
  imported    FLOAT   DEFAULT 0,
  electricity FLOAT   DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fiscal_year, scope, month)
);
CREATE INDEX IF NOT EXISTS idx_emission_monthly_year ON emission_monthly(fiscal_year);

-- EMISSION CATEGORIES
CREATE TABLE IF NOT EXISTS emission_categories (
  id          SERIAL  PRIMARY KEY,
  fiscal_year TEXT    NOT NULL,
  scope       INTEGER DEFAULT 3,
  category    TEXT    NOT NULL,
  value       FLOAT   NOT NULL,
  color       TEXT    DEFAULT '#6366f1',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fiscal_year, category)
);
CREATE INDEX IF NOT EXISTS idx_emission_categories_year ON emission_categories(fiscal_year);

-- EMISSION RECORDS
CREATE TABLE IF NOT EXISTS emission_records (
  id               SERIAL  PRIMARY KEY,
  fiscal_year      TEXT    NOT NULL,
  scope            INTEGER NOT NULL,
  category         TEXT    NOT NULL,
  subcategory      TEXT    DEFAULT '',
  date             TEXT    NOT NULL,
  entry_period     TEXT    NOT NULL,
  site_name        TEXT    NOT NULL,
  unit_of_measure  TEXT    NOT NULL,
  consumption      FLOAT   DEFAULT 0,
  source           TEXT    DEFAULT '',
  emission_factor  FLOAT   DEFAULT 0,
  name_of_country  TEXT,
  heat_source      TEXT,
  fuel_type        TEXT,
  commute_type     TEXT,
  vehicle_type     TEXT,
  food_type        TEXT,
  type_of_goods    TEXT,
  loop             TEXT,
  generation       FLOAT,
  flight_type      TEXT,
  passenger_class  TEXT,
  transport_mode   TEXT,
  hotel_country    TEXT,
  room_nights      FLOAT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_emission_records_year ON emission_records(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_emission_records_year_scope ON emission_records(fiscal_year, scope, category);
