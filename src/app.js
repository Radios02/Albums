import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDb, dbAll, dbRun } from './util/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
// Adatbázis inicializálása
initializeDb();

// Statikus fájlok kiszolgálása
app.use(express.static(path.join(__dirname, '../view')));

// Főoldal kiszolgálása
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/index.html'));
});

app.get('/albums', async (req, res) => {
    try {
        const albums = await dbAll('SELECT * FROM albums');
        res.json(albums);
    } catch (err) {
        console.error('Error fetching albums:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/albums', async (req, res) => {
    const { title, artist, releaseDate } = req.body;

    try {
        await dbRun(
            'INSERT INTO albums (title, artist, releaseDate) VALUES (?, ?, ?)',
            [title, artist, releaseDate]
        );
        res.status(201).json({ message: 'Album added' });
    } catch (err) {
        console.error('Error adding album:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/albums/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await dbRun('DELETE FROM albums WHERE id = ?', [id]);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }
        res.status(200).json({ message: 'Album deleted' });
    } catch (err) {
        console.error('Error deleting album:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.put('/albums/:id', async (req, res) => {
    const { id } = req.params;
    const { title, artist, releaseDate} = req.body;

    try {
        const result = await dbRun(
            'UPDATE albums SET title = ?, artist = ?, releaseDate = ? WHERE id = ?',
            [title, artist, releaseDate, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Album not found' });
        }

        res.status(200).json({ message: 'Album updated' });
    } catch (err) {
        console.error('Error editing album:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});