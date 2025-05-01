// filepath: src/controllers/albumControllers.js
import { dbAll, dbGet, dbRun } from '../util/database.js';

const getAllAlbums = async (req, res) => {
    try {
        const albums = await dbAll('SELECT * FROM albums');
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { getAllAlbums };

export const getAlbumById = async (req, res) => {
    const sql = "SELECT * FROM albums WHERE id = ?";
    const albumData = await dbGet(sql, [req.params.id]);
    if (!albumData) {
        return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json(albumData);
};

export const createAlbum = async (req, res) => {
    const { title, artist, releaseDate } = req.body;
    if (!title || !artist || !releaseDate) {
        return res.status(400).json({ message: 'Missing data' });
    }
    const sql = "INSERT INTO albums (title, artist, releaseDate) VALUES (?, ?, ?)";
    const albumData = await dbRun(sql, [title, artist, releaseDate]);
    res.status(201).json({ id: albumData.lastID, title, artist, releaseDate });
};

export const updateAlbum = async (req, res) => {
    const { title, artist, releaseDate } = req.body;
    const sql = "UPDATE albums SET title = ?, artist = ?, releaseDate = ? WHERE id = ?";
    const albumData = await dbRun(sql, [title, artist, releaseDate, req.params.id]);
    if (albumData.changes === 0) {
        return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json({ id: req.params.id, title, artist, releaseDate });
};

export const deleteAlbum = async (req, res) => {
    const sql = "DELETE FROM albums WHERE id = ?";
    const albumData = await dbRun(sql, [req.params.id]);
    if (albumData.changes === 0) {
        return res.status(404).json({ message: 'Album not found' });
    }
    res.status(200).json({ message: 'Album deleted' });
};