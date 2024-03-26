import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    getUserFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    changeSettings,
} from "../controllers/users.js"; //Importing the functions from the user controller
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//CRUD operations
/* Read/GET */
router.get("/:id", verifyToken, getUser); //Get the user by their ID (e.g., localhost:5000/user/johndoe)
router.get("/:id/friends", verifyToken, getUserFriends); //Get the user's friends by their ID (e.g., localhost:5000/user/johndoe/friends)
router.get("/:id/friendRequests", verifyToken, getUserFriendRequests); //Get the user's friend requests by their ID (e.g., localhost:5000/user/johndoe/friendRequests)

/* Update/PATCH */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); //Add or remove a friend by their ID (e.g., localhost:5000/user/johndoe/jake)
router.patch("/:id/:friendId/accept", verifyToken, acceptFriendRequest); //Accept a friend request by their ID
router.patch("/:id/:friendId/decline", verifyToken, declineFriendRequest); //Decline a friend request by their ID
router.put("/:id/changeSettings", verifyToken, changeSettings); //Change user settings by their ID

export default router;