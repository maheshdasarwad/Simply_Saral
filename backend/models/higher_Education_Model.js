const mongoose=require("mongoose");
const {Schema}=mongoose;
const tuitionFeeReimbursementSchema = new Schema({
  title: { type: "string" },
  description: { type: "string" },
  importantLinks: [
    { name: { type: "string" }, url: { type: "string" } }
  ],
  applicationProcessVideo: {
    title: { type: "string" },
    url: { type: "string" }
  },
  application_process: {
    offline_steps: [String],
    online_steps: [String]
},
  sampleDocuments: [
    { name: { type: "string" }, url: { type: "string" } },
    { name: { type: "string" }, description: { type: "string" } }
  ],
  officialGovernmentPDFs: [
    { name: { type: "string" }, url: { type: "string" } }
  ],
  crossVerification: {
    applicationStatus: { type: "string" },
    correctionWindow: { type: "string" }
  },
  helplineNumbers: [
    { name: { type: "string" }, contact: { type: "string" } }
  ],
  researchInsights: [
    { name: { type: "string" }, url: { type: "string" } }
  ],
  eligibilityCriteria: {
    domicile: { type: "string" },
    academicQualification: { type: "string" },
    category: { type: "array", items: { type: "string" } },
    incomeLimit: { type: "array", items: { type: "string" } },
    attendanceRequirement: { type: "string" },
    notAvailingOtherScholarships: { type: "boolean" }
  },
  keyBenefits: {
    tuitionFeeReimbursement: { type: "string" },
    examFeeReimbursement: { type: "string" },
    noRepayment: { type: "string" }
  },
  documentsRequired: { type: "array", items: { type: "string" } },
  scholarshipAmountAndRenewal: {
    tuitionFee: { type: "string" },
    examFee: { type: "string" },
    renewalProcess: { type: "array", items: { type: "string" } }
  },
  specialProvisions: {
    femaleStudents: { type: "string" },
    disabledStudents: { type: "string" },
    meritIncentives: { type: "string" }
  },
  trackingBenefits: {
    applicationStatus: { type: "string" },
    grievanceRedressal: { type: "string" },
    fundDisbursementUpdates: { type: "string" }
  },
  images: { type: "array", items: { type: "string" } }
});
  
module.exports=mongoose.model("high_edu",tuitionFeeReimbursementSchema);
  
