import express from "express";
import { getPagePosts, likePagePost, commentPagePost } from "../controllers/pagePosts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//CRUD operations
router.get("/:pageId", getPagePosts);

router.patch("/:pageId/like", verifyToken, likePagePost);

router.post("/:pageId/comment", verifyToken, commentPagePost);

export default router;