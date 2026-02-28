import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'realtorconnect.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('customer', 'broker')),
      avatar TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS broker_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      bio TEXT,
      license_number TEXT,
      agency TEXT,
      years_experience INTEGER DEFAULT 0,
      specializations TEXT DEFAULT '[]',
      languages TEXT DEFAULT '[]',
      location_city TEXT,
      location_state TEXT,
      location_country TEXT DEFAULT 'India',
      commission_min REAL DEFAULT 1.0,
      commission_max REAL DEFAULT 3.0,
      commission_type TEXT DEFAULT 'percentage',
      total_deals INTEGER DEFAULT 0,
      properties_sold INTEGER DEFAULT 0,
      properties_rented INTEGER DEFAULT 0,
      avg_rating REAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      profile_complete INTEGER DEFAULT 0,
      headline TEXT,
      website TEXT,
      linkedin TEXT,
      instagram TEXT,
      cover_image TEXT,
      available_for TEXT DEFAULT '["Buy", "Sell", "Rent"]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      broker_id INTEGER NOT NULL,
      reviewer_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      title TEXT,
      comment TEXT,
      transaction_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (broker_id) REFERENCES broker_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(broker_id, reviewer_id)
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      broker_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      message TEXT,
      property_type TEXT,
      budget TEXT,
      location TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected', 'completed')),
      scheduled_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (broker_id) REFERENCES broker_profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS saved_brokers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      broker_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (broker_id) REFERENCES broker_profiles(id) ON DELETE CASCADE,
      UNIQUE(user_id, broker_id)
    );
  `);
}

export default getDb;
