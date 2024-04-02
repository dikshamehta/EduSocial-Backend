import { ObjectId } from "mongodb";
import Poll from "../models/Poll.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

//This is where the logic for the CRUD operations will go

//3 functions: getFeedPosts, getUserPosts, likePost (createPost is in server/index.js)
//1. getFeedPosts - Get the feed posts (for home page)
//2. getUserPosts - Get the user's posts by their ID (for profile page)
//3. likePost - Like a post by its ID

/* Create/POST */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath, videoPath, pollData, displayTag } = req.body;
        // console.log(userId);
        // console.log(description);
        // console.log(picturePath);
        // console.log("search for user");

        const user = await User.findById(userId);
        // console.log("here!!!");
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            description,
            picturePath,
            videoPath,
            pollData,
            userPicturePath: user.picturePath,
            likes: {},
            comments: [],
            displayTag,
        });
        await newPost.save(); //Save new post

        if (pollData) {
            const newPollData = JSON.parse(pollData);

            const newPoll = new Poll({
                question: newPollData.question,
                options: newPollData.options.map((option) => {
                    return {
                        option,
                        votes: 0,
                    };
                }),
            });
            newPoll.parentId = newPost._id;

            await newPoll.save(); //Save new poll
        }
        // console.log("I am here!")
        // console.log(newPost);

        const posts = await Post.find(); //Get all the posts to send back to the front end

        //Delete all posts for users that are private using profilePrivacy = 1
        for (let i = 0; i < posts.length; i++) {
            const user = await User.findById(posts[i].userId);
            if (user.profilePrivacy === true) {
                posts.splice(i, 1);
                i--;
            }
        }

        //Reverse the array to show the most recent posts first
        posts.reverse();

        //Post Order
        // if (user.recentPostOrder === true && user.displayTag !== "") {
        //     for (let i = 0; i < posts.length; i++) {
        //         if (posts[i].displayTag === user.displayTag) {
        //             posts.unshift(posts.splice(i, 1)[0]);
        //         }
        //     }

        // }


        res.status(201).json(posts); //Return the new post, sends back to front end
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* Read/GET */
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find(); //Get all posts
        const { userId } = req.body; //Grab userId

        //Delete all posts for users that are private using profilePrivacy = 1
        for (let i = 0; i < posts.length; i++) {
            const user = await User.findById(posts[i].userId);
            if (user.profilePrivacy === true) {
                posts.splice(i, 1);
                i--;
            }
        }

        //Reverse the array to show the most recent posts first
        posts.reverse();

        //Post Order
        // currentUser = await User.findById(userId);
        // if (currentUser.recentPostOrder === true && currentUser.displayTag !== "") {
        //     for (let i = 0; i < posts.length; i++) {
        //         if (posts[i].displayTag === currentUser.displayTag) {
        //             posts.unshift(posts.splice(i, 1)[0]);
        //         }
        //     }

        // }
        

        



        res.status(200).json(posts); //Return all posts, sends back to front end
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params; //Grab userId
        const posts = await Post.find({ userId }); //Get all posts by userId

        //Reverse the array to show the most recent posts first
        posts.reverse();


        res.status(200).json(posts); //Return all user's posts, sends back to front end
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const { postId } = req.params; //Grab relevant post by id
        const post = await Post.findById(postId); //Get post by id
        res.status(200).json(post); //Return post, sends back to front end
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

/* Update/PATCH */
export const likePost = async (req, res) => {
    try {
        //Grabbing post information
        const { id } = req.params; //Grab relevant post by id
        const { userId } = req.body; //Grab userId from the body
        const post = await Post.findById(id); //Get post by id
        const isLiked = post.likes.get(userId); //Check if user has already liked the post

        if (isLiked) { //If user has already liked the post, unlike the post
            post.likes.delete(userId); //Delete user from likes
        } else {
            post.likes.set(userId, true); //If user has not liked the post, like the post
        }

        await post.save(); //Save updated post

        const updatedPost = await Post.findByIdAndUpdate( //Updating the front-end
            id,
            { like: post.likes },
            { new: true}
        );
        // console.log(post);
        // console.log(updatedPost);

        res.status(200).json(updatedPost); //Return updated post, sends back to front end
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const commentPost = async (req, res) => {
    try {
        //Grab post information
        const { id } = req.params; //Grab relevant post by id
        const { userId, userUsername, userPicturePath, comment } = req.body; //Grab userId, userPicturePath, and comment from the body
        const post = await Post.findById(id); //Get post by id
        const newComment = { userId, userUsername, userPicturePath, comment }; //Create new comment
        post.comments.push(newComment); //Add new comment to post

        await post.save(); //Save updated post

        const updatedPost = await Post.findById(id); //Get updated post
        res.status(200).json(updatedPost); //Return updated post, sends back to front end
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};