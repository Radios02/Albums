import express from 'express';
import { getAllAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } from '../controllers/albumControllers.js';

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:id', getAlbumById);
router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;