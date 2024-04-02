import mongoose from "mongoose";

export const pollSchema = new mongoose.Schema(
    {
        parentId: {
            type: String,
            required: true,
        },
        question: {
            type: String,
            required: true,
        },
        options: [
            {
                option: {
                    type: String,
                    required: true,
                },
                votes: {
                    type: Number,
                    default: 0,
                    required: false,
                },
            }
        ],
        totalVotes: {
            type: Number,
            default: 0,
            required: false,
        },
        voters: [
            {
                type: String,
                required: false,
            }
        ]
    },
    { timestamps: true }
);

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;