import mongoose, { Mongoose } from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


})
export const ChatMessage = mongoose.model("ChatMessage ", chatMessageSchema);