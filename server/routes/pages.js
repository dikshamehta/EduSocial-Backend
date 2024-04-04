import express from "express";
import { getPages, getPage, getMembers, updatePage, deletePage, addEvent } from "../controllers/pages.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CRUD operations for pages

// Get all pages
router.get("/", getPages);

// Get a page by its ID
router.get("/:pageId", verifyToken, getPage);

// Get all members of a page
router.get("/:pageId/members", getMembers);

// Delete a page
router.delete("/:pageId", verifyToken, deletePage);

// Add event
router.patch("/:pageId", verifyToken, addEvent);

export default router;