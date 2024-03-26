import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 2,
            max: 75,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 75,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 75,
        },
        email: {
            type: String,
            required: true,
            max: 255,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 1024,
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
        friendRequests: {
            type: Array,
            default: [],
        },
        blockedUsers: {
            type: Array,
            default: [],
        },
        contentDisplay: {
            type: Number,
            default: 0,
        },
        profilePrivacy: {
            type: Number,
            default: 0,
        },
        emailPrivacy: {
            type: Number,
            default: 0,
        },
        displayTag: {
            type: Number,
            default: 0,
        }
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
