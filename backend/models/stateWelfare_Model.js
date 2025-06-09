
const mongoose = require('mongoose');

const stateWelfareSchema = new mongoose.Schema({
    title: { type: String, required: true },
    state: { type: String, required: true },
    district: [String],
    programType: { 
        type: String, 
        enum: ['Health', 'Education', 'Employment', 'Housing', 'Agriculture', 'Women Welfare', 'Social Security', 'Other'],
        required: true 
    },
    targetBeneficiaries: {
        type: [String],
        enum: ['BPL Families', 'Women', 'Children', 'Elderly', 'Disabled', 'Farmers', 'Students', 'Unemployed Youth', 'Other']
    },
    description: { type: String, required: true },
    launchDate: Date,
    eligibility: {
        ageLimit: {
            min: Number,
            max: Number
        },
        incomeLimit: Number,
        residency: String,
        categories: [String],
        familySize: Number,
        landHolding: Number
    },
    benefits: {
        monetaryBenefit: {
            amount: Number,
            frequency: String,
            paymentMethod: String
        },
        nonMonetaryBenefits: [String],
        subsidies: [String],
        freeServices: [String]
    },
    applicationProcess: {
        applicationMode: { type: String, enum: ['Online', 'Offline', 'Both'] },
        onlinePortal: String,
        officeLocations: [String],
        documentsRequired: [String],
        processingTime: String,
        applicationFee: Number
    },
    implementationDetails: {
        nodal_ministry: String,
        implementingAgency: String,
        budget: Number,
        targetBeneficiaries: Number,
        achievedBeneficiaries: Number
    },
    applicationTracking: {
        trackingUrl: String,
        statusCheckProcess: [String],
        helplineNumbers: [String]
    },
    grievanceRedressal: {
        grievancePortal: String,
        complaintProcess: [String],
        escalationMatrix: [String]
    },
    successStories: [{
        beneficiaryName: String,
        location: String,
        story: String,
        impact: String
    }],
    relatedSchemes: [String],
    mediaGallery: {
        images: [String],
        videos: [String],
        documents: [String]
    },
    contactInformation: {
        toll_free_number: String,
        email: String,
        website: String,
        socialMedia: {
            facebook: String,
            twitter: String,
            youtube: String
        }
    },
    statistics: {
        totalApplications: Number,
        approvedApplications: Number,
        rejectedApplications: Number,
        pendingApplications: Number,
        totalDisbursed: Number
    },
    status: { 
        type: String, 
        enum: ['active', 'suspended', 'discontinued'], 
        default: 'active' 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

stateWelfareSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('StateWelfare', stateWelfareSchema);
