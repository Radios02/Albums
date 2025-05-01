import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import albums from '../data/albumData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../data/database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Adatbázis inicializálása
const initializeDb = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS albums (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                releaseDate INTEGER NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Albums table created or already exists.');
            }
        });
        albums.forEach((album) => {
            db.run(
                `INSERT INTO albums (title, artist, releaseDate) VALUES (?, ?, ?)`,
                [album.title, album.artist, album.releaseDate],
                (err) => {
                    if (err) {
                        if (err.message.includes('UNIQUE constraint failed')) {
                            console.log(`Album "${album.title}" already exists.`);
                        } else {
                            console.error('Error inserting data:', err.message);
                        }
                    } else {
                        console.log(`Album "${album.title}" added to the database.`);
                    }
                }
            );
        });
    });
};

// Promise-alapú wrapper függvények
const dbRun = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

const dbGet = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const dbAll = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Exportálás
export { db, initializeDb, dbRun, dbGet, dbAll };