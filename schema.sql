-- ============ USERS ============
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'Active',
  joined TEXT
);

-- ============ FLIGHTS ============
CREATE TABLE IF NOT EXISTS flights (
  id SERIAL PRIMARY KEY,
  airline TEXT NOT NULL,
  flight_no TEXT,
  origin TEXT,              -- "LHR" (was 'from')
  destination TEXT,         -- "DXB" (was 'to')
  from_city TEXT,           -- "London Heathrow"
  to_city TEXT,             -- "Dubai International"
  from_terminal TEXT,       -- "Terminal 3 · LHR"
  to_terminal TEXT,         -- "Terminal 3 · DXB"
  country TEXT,             -- "UAE" (for search)
  depart TEXT,
  arrive TEXT,
  duration TEXT,
  stops TEXT,
  direct BOOLEAN DEFAULT false,
  aircraft TEXT,
  flight_date TEXT,         -- "May 15, 2026" (date is a reserved word, so flight_date)
  price INTEGER NOT NULL,
  seats INTEGER DEFAULT 0,
  schedule TEXT,
  status TEXT DEFAULT 'Active'
);

-- ============ HOTELS ============
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  country TEXT,             -- for search
  stars INTEGER,
  rating NUMERIC,
  review_count INTEGER DEFAULT 0,
  rooms_count INTEGER DEFAULT 0,   -- total rooms (admin field)
  price INTEGER NOT NULL,
  img_seed INTEGER,
  amenities TEXT,          -- comma-separated: "Pool,Spa,WiFi"
  status TEXT DEFAULT 'Active'
);

-- Rooms belong to a hotel (one hotel -> many rooms)
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
  type TEXT,
  size TEXT,
  guests INTEGER,
  price INTEGER,
  img_seed INTEGER
);

-- Hotel offers (one hotel -> many offers)
CREATE TABLE IF NOT EXISTS hotel_offers (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
  label TEXT               -- "🏊 Private Beach"
);

-- Hotel gallery image seeds (one hotel -> many seeds)
CREATE TABLE IF NOT EXISTS hotel_gallery (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
  seed INTEGER
);

-- ============ BUNDLES ============
CREATE TABLE IF NOT EXISTS bundles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  destination TEXT,        -- "Dubai, UAE"
  travelers TEXT,
  airline TEXT,
  flight_no TEXT,
  flight_label TEXT,       -- "Emirates · Direct"
  origin TEXT,             -- "LHR"
  dest_code TEXT,          -- "DXB"
  depart TEXT,
  arrive TEXT,
  duration TEXT,
  hotel_id INTEGER REFERENCES hotels(id),
  hotel_name TEXT,
  hotel_rating NUMERIC,
  hotel_reviews INTEGER,
  room_type TEXT,
  nights INTEGER,
  price INTEGER NOT NULL,
  original INTEGER,
  img_seed INTEGER,
  status TEXT DEFAULT 'Active'
);

-- Bundle itinerary steps (one bundle -> many steps)
CREATE TABLE IF NOT EXISTS bundle_timeline (
  id SERIAL PRIMARY KEY,
  bundle_id INTEGER REFERENCES bundles(id) ON DELETE CASCADE,
  step_order INTEGER,      -- to keep them in order
  time TEXT,
  label TEXT,
  type TEXT,               -- "flight" or "hotel"
  icon TEXT
);

-- Bundle price breakdown (one bundle -> many rows)
CREATE TABLE IF NOT EXISTS bundle_breakdown (
  id SERIAL PRIMARY KEY,
  bundle_id INTEGER REFERENCES bundles(id) ON DELETE CASCADE,
  item TEXT,
  price INTEGER            -- can be negative (discount)
);

-- ============ BOOKINGS ============
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  ref TEXT,
  user_email TEXT REFERENCES users(email),
  type TEXT,               -- "flight" / "hotel" / "bundle"
  item_id INTEGER,
  customer TEXT,
  trip TEXT,
  seat TEXT,
  room TEXT,
  booking_date TEXT,
  price INTEGER,
  status TEXT DEFAULT 'Confirmed'
);

-- ============ REVIEWS ============
-- One reviews table for flights/hotels/bundles (type says which)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  type TEXT,               -- "flight" / "hotel" / "bundle"
  item_id INTEGER,         -- which flight/hotel/bundle
  name TEXT,
  rating INTEGER,
  text TEXT,
  review_date TEXT
);