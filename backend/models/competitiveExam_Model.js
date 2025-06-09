
const mongoose = require('mongoose');

const competitiveExamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    fullName: { type: String, required: true },
    conductingBody: { type: String, required: true },
    examType: { 
        type: String, 
        enum: ['UPSC', 'SSC', 'State PSC', 'Banking', 'Railway', 'Defense', 'Other'],
        required: true 
    },
    description: { type: String, required: true },
    eligibility: {
        ageLimit: {
            min: Number,
            max: Number
        },
        educationalQualification: String,
        nationality: { type: String, default: 'Indian' },
        attempts: Number
    },
    examPattern: {
        stages: [String],
        subjects: [String],
        totalMarks: Number,
        duration: String,
        mediumOfExam: [String]
    },
    applicationDetails: {
        applicationFee: {
            general: Number,
            obc: Number,
            scst: Number,
            pwd: Number
        },
        onlineApplicationUrl: String,
        offlineApplicationProcess: [String]
    },
    importantDates: {
        notificationDate: Date,
        applicationStart: Date,
        applicationEnd: Date,
        examDate: Date,
        resultDate: Date
    },
    syllabus: {
        prelimsTopics: [String],
        mainsTopics: [String],
        interviewTopics: [String]
    },
    vacancies: {
        total: Number,
        categoryWise: {
            general: Number,
            obc: Number,
            sc: Number,
            st: Number,
            pwd: Number
        }
    },
    preparationResources: {
        officialWebsite: String,
        syllabusUrl: String,
        previousPapers: [String],
        recommendedBooks: [String],
        onlineCourses: [String]
    },
    successTips: [String],
    contactInfo: {
        helplineNumbers: [String],
        emailSupport: String,
        address: String
    },
    notifications: [{
        title: String,
        message: String,
        date: Date,
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    }],
    status: { 
        type: String, 
        enum: ['active', 'closed', 'upcoming'], 
        default: 'active' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

competitiveExamSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CompetitiveExam', competitiveExamSchema);
