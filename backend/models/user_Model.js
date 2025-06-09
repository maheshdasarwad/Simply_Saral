
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    personalInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        dateOfBirth: Date,
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        profilePicture: String
    },
    credentials: {
        password: { type: String, required: true },
        lastLogin: Date,
        isEmailVerified: { type: Boolean, default: false },
        isPhoneVerified: { type: Boolean, default: false }
    },
    address: {
        state: String,
        district: String,
        city: String,
        pincode: String,
        fullAddress: String
    },
    demographics: {
        category: { 
            type: String, 
            enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'] 
        },
        annualIncome: Number,
        occupation: String,
        educationLevel: String,
        maritalStatus: String,
        familyMembers: Number
    },
    preferences: {
        interestedCategories: [String],
        languagePreference: { type: String, default: 'English' },
        notificationSettings: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        }
    },
    applicationHistory: [{
        schemeId: { type: mongoose.Schema.Types.ObjectId, refPath: 'applicationHistory.schemeType' },
        schemeType: { 
            type: String, 
            enum: ['farmer_Schemes_Model', 'women_Welf_Model', 'higher_Education', 'secondary_Education', 'primary_Education', 'CompetitiveExam', 'EducationalProgram', 'StateWelfare'] 
        },
        schemeName: String,
        applicationId: String,
        appliedDate: Date,
        status: { 
            type: String, 
            enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'on_hold'],
            default: 'draft'
        },
        documentsSubmitted: [String],
        lastUpdated: Date,
        remarks: String
    }],
    bookmarks: [{
        schemeId: { type: mongoose.Schema.Types.ObjectId, refPath: 'bookmarks.schemeType' },
        schemeType: String,
        schemeName: String,
        bookmarkedDate: { type: Date, default: Date.now }
    }],
    notifications: [{
        title: String,
        message: String,
        type: { 
            type: String, 
            enum: ['scheme_update', 'application_status', 'new_scheme', 'deadline_reminder', 'general'] 
        },
        isRead: { type: Boolean, default: false },
        createdDate: { type: Date, default: Date.now },
        relatedScheme: String
    }],
    activityLog: [{
        action: String,
        timestamp: { type: Date, default: Date.now },
        details: String,
        ipAddress: String
    }],
    recommendations: [{
        schemeId: String,
        schemeName: String,
        reason: String,
        score: Number,
        generatedDate: { type: Date, default: Date.now }
    }],
    accountSettings: {
        isActive: { type: Boolean, default: true },
        twoFactorEnabled: { type: Boolean, default: false },
        lastPasswordChange: Date,
        securityQuestions: [{
            question: String,
            answer: String
        }]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('credentials.password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.credentials.password = await bcrypt.hash(this.credentials.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.credentials.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
