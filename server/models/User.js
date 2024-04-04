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
        profilePrivacy: {
            type: Boolean,
            default: false,
        },
        emailPrivacy: {
            type: Boolean,
            default: false,
        },
        displayTag: {
            type: String,
            default: "",
        },
        recentPostOrder: {
            type: Boolean,
            default: false,
        },
        notifications: {
            type: Array,
            default: [],
        },
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
