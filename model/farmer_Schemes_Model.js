const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const farmerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    launched_year: { type: Number, default: 1998 },
    eligibility_criteria: {
        age_min: { type: Number, default: 18 },
        age_max: { type: Number, default: 75 },
        land_requirement_acres: { type: Number, default: 0.5 },
        repayment_capacity: { type: String }
    },
    important_links: [
        {
            title: { type: String },
            url: { type: String }
        }
    ],
    application_process: {
        offline_steps: [String],
        online_steps: [String]
    },
    documents_required: [
        {
            type: String,
            enum: ["Identity Proof", "Address Proof", "Land Ownership Proof", "Photographs", "Bank Account Details"]
        }
    ],
    loan_details: {
        short_term_credit: { type: Number, default: 300000 },
        interest_rate: { type: Number, default: 7 },
        subsidy_rate: { type: Number, default: 3 },
        loan_tenure: { type: String, default: "1 year (short-term)" }
    },
    benefits: [String],
    special_provisions: {
        dairy_farmers: { type: Boolean, default: true },
        fisheries: { type: Boolean, default: true }
    },
    helpline_numbers: {
        toll_free: { type: String },
        customer_service: [String]
    },
    research_insights: [
        {
            title: { type: String },
            source: { type: String }
        }
    ],
    created_at: { type: Date, default: Date.now },
    images: { type: "array", items: { type: "string" } }
});

module.exports =mongoose.model("FarmerSchemes", farmerSchema);
