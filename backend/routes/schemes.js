
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const farmer_Schemes_Model = require("../models/farmer_Schemes_Model.js");   
const women_Wel_Model = require("../models/women_Welf_Model.js");
const higher_Education = require("../models/higher_Education_Model.js");
const secondary_Education = require("../models/secondary_Education.js");
const primary_Education = require("../models/primary_Education.js");

// Fallback data when database is not available
const fallbackData = {
    farmer_Welfare: [
        {
            _id: '1',
            title: "PM-Kisan Samman Nidhi Yojana",
            description: "Direct income support to small and marginal farmers",
            launched_year: 2019,
            benefits: ["₹6,000 annual assistance", "Direct bank transfer", "Support for agricultural needs"],
            images: ["/images/farmer_welf/pm_Kisan_Samman.jpg"],
            eligibility_criteria: {
                age_min: 18,
                age_max: 75,
                land_requirement_acres: 2
            },
            important_links: [
                { title: "Official Website", url: "https://pmkisan.gov.in" },
                { title: "Video Guide", url: "https://youtube.com/pmkisan" }
            ],
            application_process: {
                offline_steps: ["Visit CSC center", "Fill application form", "Submit documents"],
                online_steps: ["Visit official website", "Register online", "Submit application"]
            },
            helpline_numbers: {
                toll_free: "155261"
            }
        }
    ],
    women_Welfare: [
        {
            _id: '1',
            title: "Beti Bachao Beti Padhao",
            scheme_name: "Beti Bachao Beti Padhao",
            description: "Scheme for girl child welfare and education",
            launched_year: 2015,
            benefits: ["Educational support", "Health awareness", "Gender equality promotion"],
            government_initiative: {
                objectives: ["Save girl child", "Educate girl child", "Protect girl child"]
            },
            resources: {
                official_links: {
                    main_website: "https://wcd.nic.in/bbbp-schemes"
                }
            },
            verification: {
                local_offices: ["Nearest Anganwadi center", "District administration office"],
                online_portals: ["Ministry of Women & Child Development portal"]
            },
            contact_information: {
                ministry_contact: "011-23382393"
            }
        }
    ],
    higher_Education: [
        {
            _id: '1',
            title: "Post Matric Scholarship",
            description: "Financial assistance for higher education",
            benefits: ["Tuition fee support", "Maintenance allowance", "Book allowance"],
            images: ["/Image/higher_Edu/POST.jpg"],
            importantLinks: [
                { name: "Official Website", url: "https://mahadbt.maharashtra.gov.in" }
            ],
            keyBenefits: {
                noRepayment: "Yes",
                tuitionFeeReimbursement: "100%",
                examFeeReimbursement: "100%"
            },
            application_process: {
                offline_steps: ["Visit college scholarship department", "Fill application form", "Submit documents"],
                online_steps: ["Register at mahadbt.maharashtra.gov.in", "Fill online application", "Upload documents"]
            }
        }
    ],
    primary_Education: [
        {
            _id: '1',
            title: "Right to Education Act",
            description: "Free and compulsory education for children aged 6-14",
            benefits: ["Free education", "Mid-day meals", "Free textbooks"],
            applicationProcess: {
                steps: ["Visit nearest government school", "Fill admission form", "Submit required documents"]
            }
        }
    ],
    secondary_Education: [
        {
            _id: '1',
            title: "Sarva Shiksha Abhiyan",
            description: "Universal elementary education program",
            benefits: ["Quality education", "Infrastructure development", "Teacher training"],
            image: "/Image/secondary_Edu/SSA.jpg",
            importantLinks: [
                { url: "https://samagrashiksha.education.gov.in" }
            ],
            eligibilityCriteria: {
                domicile: "Must be a resident of India",
                academicQualification: "Enrolled in secondary education",
                ageLimit: "6-14 years for elementary education",
                parentalIncomeLimit: "No specific income limit",
                attendanceRequirement: "Regular attendance required"
            },
            applicationProcess: {
                steps: ["Register at school", "Submit required documents", "Maintain regular attendance"]
            }
        }
    ]
};

router.get("/:scheme", async (req, res) => {
    let {scheme} = req.params;
    console.log(`Accessing scheme: ${scheme}`);
    
    try {
        let data = [];
        let name = "";
        
        // Check if database is connected
        const isDbConnected = mongoose.connection.readyState === 1;
        
        if(scheme == "farmer_Welfare") {
            name = "Farmer's Welfare Scheme";
            if (isDbConnected) {
                data = await farmer_Schemes_Model.find({}).timeout(5000);
            } else {
                data = fallbackData.farmer_Welfare;
                console.log("Using fallback data for farmer welfare");
            }
            res.render("pages/farm_Scheme", {data, name});
        }
        else if(scheme == "women_Welfare") {
            name = "Women's Welfare Scheme";
            if (isDbConnected) {
                data = await women_Wel_Model.find({}).timeout(5000);
            } else {
                data = fallbackData.women_Welfare;
                console.log("Using fallback data for women welfare");
            }
            res.render("pages/women_Scheme", {data, name});
        }
        else if(scheme == "higher_Education") {
            name = "Higher Education Scheme";
            if (isDbConnected) {
                data = await higher_Education.find({}).timeout(5000);
            } else {
                data = fallbackData.higher_Education;
                console.log("Using fallback data for higher education");
            }
            res.render("pages/higher_Edu", {data, name});
        }
        else if(scheme == "primary_Education") {
            name = "Primary Education Scheme";
            if (isDbConnected) {
                data = await primary_Education.find({}).timeout(5000);
            } else {
                data = fallbackData.primary_Education;
                console.log("Using fallback data for primary education");
            }
            res.render("pages/primary_Edu", {data, name});
        }
        else if(scheme == "secondary_Education") {
            name = "Secondary Education Scheme";
            if (isDbConnected) {
                data = await secondary_Education.find({}).timeout(5000);
            } else {
                data = fallbackData.secondary_Education;
                console.log("Using fallback data for secondary education");
            }
            res.render("pages/secondary_Edu", {data, name});
        }
        else {
            res.status(404).render("pages/error", {message: "Scheme not found"});
        }
    } catch (error) {
        console.error("Route error:", error);
        // Use fallback data on error
        let data = fallbackData[scheme] || [];
        let name = scheme.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " Scheme";
        
        if (scheme == "farmer_Welfare") {
            res.render("pages/farm_Scheme", {data: fallbackData.farmer_Welfare, name: "Farmer's Welfare Scheme"});
        } else if (scheme == "women_Welfare") {
            res.render("pages/women_Scheme", {data: fallbackData.women_Welfare, name: "Women's Welfare Scheme"});
        } else if (scheme == "higher_Education") {
            res.render("pages/higher_Edu", {data: fallbackData.higher_Education, name: "Higher Education Scheme"});
        } else if (scheme == "primary_Education") {
            res.render("pages/primary_Edu", {data: fallbackData.primary_Education, name: "Primary Education Scheme"});
        } else if (scheme == "secondary_Education") {
            res.render("pages/secondary_Edu", {data: fallbackData.secondary_Education, name: "Secondary Education Scheme"});
        } else {
            res.status(500).render("pages/error", {message: "Service temporarily unavailable. Please try again later."});
        }
    }
});

// Individual scheme detail routes
router.get("/farmer_Welfare/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data;
        
        if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
            data = await farmer_Schemes_Model.findById(id);
        }
        
        if (!data) {
            // Use fallback data for the first scheme
            data = fallbackData.farmer_Welfare[0];
        }
        
        res.render("pages/farm_sep_scheme", {data});
    } catch (error) {
        console.error("Error fetching farmer scheme:", error);
        const data = fallbackData.farmer_Welfare[0];
        res.render("pages/farm_sep_scheme", {data});
    }
});

router.get("/women_Welfare/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data;
        
        if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
            data = await women_Wel_Model.findById(id);
        }
        
        if (!data) {
            data = fallbackData.women_Welfare[0];
        }
        
        res.render("pages/women_sep_scheme", {data});
    } catch (error) {
        console.error("Error fetching women scheme:", error);
        const data = fallbackData.women_Welfare[0];
        res.render("pages/women_sep_scheme", {data});
    }
});

router.get("/higher_Education/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data;
        
        if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
            data = await higher_Education.findById(id);
        }
        
        if (!data) {
            data = fallbackData.higher_Education[0];
        }
        
        res.render("pages/higher_sep_scheme", {data});
    } catch (error) {
        console.error("Error fetching higher education scheme:", error);
        const data = fallbackData.higher_Education[0];
        res.render("pages/higher_sep_scheme", {data});
    }
});

router.get("/secondary_Education/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data;
        
        if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
            data = await secondary_Education.findById(id);
        }
        
        if (!data) {
            data = fallbackData.secondary_Education[0];
        }
        
        res.render("pages/secondary_sep_scheme", {data});
    } catch (error) {
        console.error("Error fetching secondary education scheme:", error);
        const data = fallbackData.secondary_Education[0];
        res.render("pages/secondary_sep_scheme", {data});
    }
});

router.get("/primary_Education/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data;
        
        if (isDbConnected && mongoose.Types.ObjectId.isValid(id)) {
            data = await primary_Education.findById(id);
        }
        
        if (!data) {
            data = fallbackData.primary_Education[0];
        }
        
        res.render("pages/primary_sep_scheme", {data});
    } catch (error) {
        console.error("Error fetching primary education scheme:", error);
        const data = fallbackData.primary_Education[0];
        res.render("pages/primary_sep_scheme", {data});
    }
});

module.exports = router;
