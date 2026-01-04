import {config} from '../config';
import {open} from 'sqlite';
import {Database} from 'sqlite3';

// Initialize the database
export async function initializeDatabase() {
	const db = await open({
		filename: config.databaseDir,
		driver: Database,
	});

	// Create studies table if it doesn't exist
	await db.exec(`
    CREATE TABLE IF NOT EXISTS studies (
      id TEXT PRIMARY KEY,
      series TEXT NOT NULL,
      filename TEXT NOT NULL,
      result_path TEXT,
      models TEXT NOT NULL,
      class_label TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	return db;
}

// Get database instance
let db: Awaited<ReturnType<typeof initializeDatabase>> | null = null;

export async function getDatabase() {
	if (!db) {
		db = await initializeDatabase();
	}
	return db;
}
