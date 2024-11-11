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
    startDate: {
        type: String,
        required: false
    },
    startTime: {
        type: String,
        required: false
    },
    endDate: {
        type: String,
        required: false
    },
    endTime: {
        type: String,
        required: false
    },
})

const Message = mongoose.model("Messages", messageSchema)

export default Message