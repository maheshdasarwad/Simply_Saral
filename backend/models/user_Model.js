const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Profile information for auto-suggestions
    profile: {
        age: Number,
        category: {
            type: String,
            enum: ['General', 'SC', 'ST', 'OBC', 'EWS', 'Other']
        },
        income: Number,
        occupation: String,
        state: String,
        district: String,
        education: {
            type: String,
            enum: ['Below 10th', '10th', '12th', 'Graduate', 'Post Graduate', 'Diploma', 'Other']
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        },
        maritalStatus: {
            type: String,
            enum: ['single', 'married', 'divorced', 'widowed']
        }
    },
    // Activity tracking
    visitedSchemes: [{
        schemeId: String,
        schemeType: String,
        visitedAt: { type: Date, default: Date.now }
    }],
    appliedSchemes: [{
        schemeId: String,
        schemeType: String,
        applicationId: String,
        appliedAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['submitted', 'under_review', 'approved', 'rejected'],
            default: 'submitted'
        }
    }],
    bookmarkedSchemes: [{
        schemeId: String,
        schemeType: String,
        bookmarkedAt: { type: Date, default: Date.now }
    }],
    // User preferences
    language: {
        type: String,
        enum: ['en', 'hi', 'mr'],
        default: 'en'
    },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
        push: { type: Boolean, default: true },
        schemeUpdates: { type: Boolean, default: true },
        newSchemes: { type: Boolean, default: true }
    },
    // Chat history for chatbot
    chatHistory: [{
        query: String,
        response: String,
        timestamp: { type: Date, default: Date.now }
    }],
    lastLogin: Date,
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    phoneNumber: String
}, { timestamps: true });

// Add indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'profile.state': 1 });
userSchema.index({ 'profile.category': 1 });
userSchema.index({ lastLogin: -1 });

module.exports = mongoose.model("User", userSchema);