import express from 'express';
import { getPollData, votePoll } from '../controllers/polls.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//CRUD operations

/* Read/GET */
router.get("/:id", verifyToken, getPollData); //Get poll data by its parents post's ID (e.g., localhost:5000/polls/123)

/* Update/PATCH */
router.patch("/:id", verifyToken, votePoll); //Vote on a poll by its parents post's ID (e.g., localhost:5000/polls/123)

export default router;