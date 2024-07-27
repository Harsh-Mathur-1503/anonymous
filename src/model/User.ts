import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username?: string; // Optional for Google users
    email: string;
    password?: string; // Optional for Google users
    verifyCode?: string; // Optional for Google users
    verifyCodeExpiry?: Date; // Optional for Google users
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
    provider: 'credentials' | 'google'; // 'credentials' or 'google'
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        trim: true,
        unique: true,
        required: [function() { return this.provider === 'credentials'; }, "Username is required for credentials users"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [function() { return this.provider === 'credentials'; }, "Password is required for credentials users"]
    },
    verifyCode: {
        type: String,
        required: [function() { return this.provider === 'credentials'; }, "Verify code is required for credentials users"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [function() { return this.provider === 'credentials'; }, "Verify code expiry is required for credentials users"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [messageSchema],
    provider: {
        type: String,
        enum: ['credentials', 'google'], // Include other providers if needed
        default: 'credentials'
    }
});

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema);

export default UserModel;
