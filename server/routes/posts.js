import express from "express";
import { getFeedPosts, getUserPosts, likePost, commentPost, getPost } from "../controllers/posts.js";
import { getPollData, votePoll } from "../controllers/polls.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//CRUD operations

/* Read/GET */
router.get("/", verifyToken, getFeedPosts); //Get the feed posts (e.g., localhost:5000/posts)
router.get("/:userId", verifyToken, getUserPosts); //Get the user's posts by their ID (e.g., localhost:5000/posts/johndoe)
router.get("/:id", verifyToken, getPost); //Get a post by its ID (e.g., localhost:5000/posts/123)
router.get("/:id/poll", verifyToken, getPollData); //Get poll data by its parents post's ID (e.g., localhost:5000/posts/123/poll

/* Update/PATCH */
router.patch("/:id/like", verifyToken, likePost); //Like a post by its ID (e.g., localhost:5000/posts/123/like)
router.patch("/:id/poll", verifyToken, votePoll); //Vote on a poll by its parents post's ID (e.g., localhost:5000/posts/123/poll)

/* POST */
router.post("/:id/comment", verifyToken, commentPost); //Comment on a post by its ID (e.g., localhost:5000/posts/123/comment)

export default router;