import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js"; //Importing the functions from the user controller
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//CRUD operations
/* Read/GET */
router.get("/:id", verifyToken, getUser); //Get the user by their ID (e.g., localhost:5000/user/johndoe)
router.get("/:id/friends", verifyToken, getUserFriends); //Get the user's friends by their ID (e.g., localhost:5000/user/johndoe/friends)

/* Update/PATCH */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); //Add or remove a friend by their ID (e.g., localhost:5000/user/johndoe/jake)

export default router;