
const mongoose = require('mongoose');

const educationalProgramSchema = new mongoose.Schema({
    title: { type: String, required: true },
    programType: { 
        type: String, 
        enum: ['Scholarship', 'Skill Development', 'Training Program', 'Certification Course', 'Other'],
        required: true 
    },
    category: {
        type: String,
        enum: ['Education', 'Skill Development', 'Vocational Training', 'Digital Literacy', 'Other'],
        required: true
    },
    targetGroup: {
        type: [String],
        enum: ['Students', 'Graduates', 'Working Professionals', 'Unemployed Youth', 'Women', 'Rural Population', 'Other']
    },
    description: { type: String, required: true },
    eligibility: {
        ageLimit: {
            min: Number,
            max: Number
        },
        educationalQualification: String,
        incomeLimit: Number,
        domicile: String,
        categories: [String],
        genderSpecific: String
    },
    benefits: {
        financialAssistance: {
            amount: Number,
            frequency: String,
            paymentMode: String
        },
        nonFinancialBenefits: [String],
        certificationProvided: Boolean,
        jobAssistance: Boolean,
        internshipOpportunity: Boolean
    },
    applicationProcess: {
        onlineSteps: [String],
        offlineSteps: [String],
        applicationUrl: String,
        documentsRequired: [String],
        applicationFee: Number
    },
    importantDates: {
        programStart: Date,
        applicationStart: Date,
        applicationEnd: Date,
        selectionProcess: Date,
        resultAnnouncement: Date
    },
    programDetails: {
        duration: String,
        mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'] },
        location: String,
        curriculum: [String],
        assessmentMethod: String
    },
    implementingAgency: {
        name: String,
        website: String,
        contactDetails: {
            phone: [String],
            email: String,
            address: String
        }
    },
    statistics: {
        totalSeats: Number,
        successRate: Number,
        placementRate: Number,
        averageSalary: Number
    },
    resources: {
        officialWebsite: String,
        brochureUrl: String,
        videoTutorials: [String],
        testimonials: [String]
    },
    faqSection: [{
        question: String,
        answer: String
    }],
    status: { 
        type: String, 
        enum: ['active', 'closed', 'upcoming'], 
        default: 'active' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

educationalProgramSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('EducationalProgram', educationalProgramSchema);
