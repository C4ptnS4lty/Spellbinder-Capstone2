// routes/deckRoutes.js
import express from 'express';
import { fetchAllDecks } from '../controllers/deckController.js';

const router = express.Router();

router.get('/', fetchAllDecks);

export default router;
