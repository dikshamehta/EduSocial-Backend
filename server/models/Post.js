import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userUsername: {
            type: String,
            required: true,
        },
        userPicturePath: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        description: String,
        picturePath: {
            type: String,
            required: false,
        },
        videoPath: {
            type: String,
            required: false, 
        },
        pollData: {
            type: String,
            required: false,
        },
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: {
            type: [commentSchema],
            default: [],
        },
        displayTag: {
            type: String,
            default: "",
        }
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;