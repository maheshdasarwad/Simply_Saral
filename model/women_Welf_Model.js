const mongoose = require("mongoose");
const { Schema } = mongoose;

const w_welSchema = new Schema({
  scheme_name: {
    type: String,
    maxlength: 100,
    required: true
  },
  launch_year: {
    type: Number,
    min: 1900,
    max: 2100,
    required: true
  },
  description:{
    type:String,
    required:true
  },
  government_initiative: {
    ministries_involved: [{
      type: String,
      maxlength: 100
    }],
    objectives: [{
      type: String,
      maxlength: 255
    }],
    key_methods: [{
      type: String,
      maxlength: 255
    }]
  },
  resources: {
    official_links: new Schema({
      main_website: { type: String, required: true },
      women_and_child_development: { type: String },
      press_information_bureau: { type: String }
    }),
    videos: new Schema({
      youtube_mygov: { type: String },
      youtube_dd_national: { type: String },
      national_commission_for_women: { type: String }
    }),
    documents_photos: [{ type: String, maxlength: 255 }],
    government_pdfs: new Schema({
      scheme_guidelines: { type: String },
      implementation_reports: { type: String },
      state_district_reports: { type: String }
    })
  },
  verification: {
    local_offices: [{ type: String, maxlength: 255 }],
    online_portals: [{ type: String }]
  },
  contact_information: {
    women_helpline: {
      type: String,
      match: /^[0-9]{3,5}$/,
      required: true
    },
    child_helpline: {
      type: String,
      match: /^[0-9]{3,5}$/,
      required: true
    },
    ministry_contact: {
      type: String,
      match: /^[0-9-]{10,15}$/
    },
    ncpcr_helpline: {
      type: String,
      match: /^[0-9-]{10,15}$/
    }
  },
  research_papers: {
    niti_aayog_reports: { type: String },
    national_digital_library: { type: String }
  },
  image:{ type: "array", items: { type: "string" } }
});

module.exports = mongoose.model("w_wel", w_welSchema);
