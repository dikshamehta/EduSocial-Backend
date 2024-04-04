import mongoose from "mongoose";

const pageSchema = mongoose.Schema(
    {
        pageName: {
            type: String,
            required: true,
            min: 2,
            max: 75,
        },
        pageType: {        // Was thinking of having a drop down menu for this
            type: String,  // e.g., "School", "Class", "Event", etc.
            required: true,
        },
        pageDescription: {
            type: String,
            required: true,
        },
        pagePicturePath: {
            type: String,
            default: "",
            required: true,
        },
        pageMembers: {
            type: Array,
            default: [],
        },
        userId: { // The user who created the page
            type: String,
            default: "",
        },
        events: {
            type: Array,
            default: [],
            required: false,
        },
    },
    { timestamps: true }
);

const Page = mongoose.model("Page", pageSchema);

export default Page;