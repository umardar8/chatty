import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
    },
    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true,
    },
    content: {
        type: String,
        required: function() {
            return this.messageType==="text"
        },
    },
    fileUrl: {
        type: String,
        required: function() {
            return this.messageType==="file"
        },
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    location: {
        type: Object,
        required: false,
    },
    startTime: {
        type: Date,
        required: false,
    },
    startDate: {
        type: Date,
        required: false,
    },
    endTime: {
        type: Date,
        required: false,
    },
    endDate: {
        type: Date,
        required: false,
    }
})

const Message = mongoose.model("Messages", messageSchema)

export default Message