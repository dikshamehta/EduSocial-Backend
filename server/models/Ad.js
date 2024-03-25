import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
    {
        companyname: {
            type: String,
            required: true
        },
        companywebsite: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        picture: {
            type: String,
            required: false
            
        },
    }
);

const Ad = mongoose.model("Ad", adSchema);
export default Ad;