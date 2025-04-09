const mongoose = require("mongoose");
const {Schema}=mongoose;

const secondary_Edu_Schema = new Schema({
    title: { type: String },
    description: { type: String },
    importantLinks: [{ name: String, url: String }],
    applicationProcess: {
        videoLink: String,
        steps: [String]
    },
    documentsAndForms: {
        registrationForm: String,
        requiredDocuments: [String]
    },
    officialGovernmentPDFs: [{ name: String, url: String }],
    crossVerification: {
        enrollmentStatus: String,
        correctionWindow: String
    },
    helpline: {
        nsdcHelpline: String,
        educationMinistryContact: String,
        emailSupport: String,
        stateOffices: String
    },
    researchInsights: [{ name: String, url: String }],
    applicationMethods: [{
        method: String,
        steps: [String]
    }],
    eligibilityCriteria: {
        domicile: String,
        academicQualification: String,
        ageLimit: String,
        parentalIncomeLimit: String,
        attendanceRequirement: String
    },
    benefits: [String],
    requiredDocuments: [String],
    vocationalTraining: {
        levels: [{
            classLevel: String,
            description: String
        }],
        certification: String,
        renewalProcess: [String]
    },
    specialProvisions: [{
        category: String,
        benefits: [String]
    }],
    trackingAndBenefits: [{
        category: String,
        url: String
    }],
    image: { type: String }
});

module.exports = mongoose.model("secondary_Edu", secondary_Edu_Schema);
