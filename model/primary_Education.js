const mongoose = require("mongoose");
const {Schema}=mongoose;

const primary_Edu_Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  importantLinks: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
  applicationProcess: {
    online: { type: String },
    offline: { type: String },
  },
  eligibilityCriteria: {
    ageLimit: { type: String },
    domicile: { type: String },
    incomeLimit: { type: String },
    categories: [String],
    schoolType: { type: String },
  },
  benefits: {
    freeEducation: { type: Boolean, default: true },
    privateSchoolReservation: { type: Number, default: 25 },
    infrastructureDevelopment: { type: Boolean, default: true },
    teacherTraining: { type: Boolean, default: true },
    nonDiscrimination: { type: Boolean, default: true },
  },
  requiredDocuments: [
    {
      type: { type: String, required: true },
      description: { type: String },
    },
  ],
  admissionRenewal: {
    annualProcess: { type: Boolean, default: true },
    renewalUntil: { type: String },
  },
  specialProvisions: {
    disabledStudents: { type: Boolean, default: false },
    girlStudents: { type: Boolean, default: false },
    ruralTribalSupport: { type: Boolean, default: false },
  },
  tracking: {
    admissionStatus: { type: String },
    grievanceRedressal: { type: String },
    fundDisbursement: { type: String },
  },
  contact: {
    helpline: { type: String },
    ministryContact: { type: String },
    emailSupport: { type: String },
    stateContacts: { type: String },
  },
  image:{type:String},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("primary_Edu", primary_Edu_Schema);
