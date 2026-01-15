import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'expense_tracker.db');


if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true }); 
  console.log(`Created directory: ${DB_DIR}`);
}

export async function initDB() {
  try {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    await db.exec('PRAGMA foreign_keys = ON');
    console.log(`Successfully connected to database at: ${DB_PATH}`);
    return db;
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
    throw new Error(`DB initialization failed: ${err.message}`);
  }
}


export async function getDB() { 
  try {
    
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });
    await db.exec('PRAGMA foreign_keys = ON');
    return db;
  } catch (err) {
    console.error('Failed to get database connection:', err.message);
    throw new Error(`DB connection failed: ${err.message}`);
  }
}
