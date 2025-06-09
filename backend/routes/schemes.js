
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
            benefits: ["₹6,000 annual assistance", "Direct bank transfer", "Support for agricultural needs"]
        },
        {
            _id: '2',
            title: "Kisan Credit Card Scheme",
            description: "Credit support for agricultural and allied activities",
            launched_year: 1998,
            benefits: ["Easy credit access", "Flexible repayment", "Low interest rates"]
        }
    ],
    women_Welfare: [
        {
            _id: '1',
            title: "Beti Bachao Beti Padhao",
            description: "Scheme for girl child welfare and education",
            launched_year: 2015,
            benefits: ["Educational support", "Health awareness", "Gender equality promotion"]
        }
    ],
    higher_Education: [
        {
            _id: '1',
            title: "Post Matric Scholarship",
            description: "Financial assistance for higher education",
            benefits: ["Tuition fee support", "Maintenance allowance", "Book allowance"]
        }
    ],
    primary_Education: [
        {
            _id: '1',
            title: "Right to Education Act",
            description: "Free and compulsory education for children aged 6-14",
            benefits: ["Free education", "Mid-day meals", "Free textbooks"]
        }
    ],
    secondary_Education: [
        {
            _id: '1',
            title: "Sarva Shiksha Abhiyan",
            description: "Universal elementary education program",
            benefits: ["Quality education", "Infrastructure development", "Teacher training"]
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

router.get("/farmer_Welfare/:id", async (req, res) => {
    const {id} = req.params;
    const data = await farmer_Schemes_Model.findById(id);
    res.render("./pages/farm_sep_scheme.ejs", {data});
});

router.get("/women_Welfare/:id", async (req, res) => {
    const {id} = req.params;
    const data = await women_Wel_Model.findById(id);
    res.render("./pages/women_sep_scheme.ejs", {data});
});

router.get("/higher_Education/:id", async (req, res) => {
    const {id} = req.params;
    const data = await higher_Education.findById(id);
    res.render("./pages/higher_sep_scheme.ejs", {data});
});

router.get("/secondary_Education/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const data = await secondary_Education.findById(id);
        res.render("pages/secondary_sep_scheme", {data});
    } catch (error) {
        console.error("Error fetching secondary education scheme:", error);
        res.status(500).render("pages/error", {message: "Scheme details not available"});
    }
});

router.get("/primary_Education/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const data = await primary_Education.findById(id);
        res.render("pages/primary_sep_scheme", {data});
    } catch (error) {
        console.error("Error fetching primary education scheme:", error);
        res.status(500).render("pages/error", {message: "Scheme details not available"});
    }
});

module.exports = router;
