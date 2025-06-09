
const express = require('express');
const router = express.Router();

const farmer_Schemes_Model = require("../models/farmer_Schemes_Model.js");   
const women_Wel_Model = require("../models/women_Welf_Model.js");
const higher_Education = require("../models/higher_Education_Model.js");
const secondary_Education = require("../models/secondary_Education.js");
const primary_Education = require("../models/primary_Education.js");

router.get("/:scheme", async (req, res) => {
    let {scheme} = req.params;
    console.log(scheme);
    
    try {
        if(scheme == "farmer_Welfare") {
            const data = await farmer_Schemes_Model.find({}).timeout(10000);
            const name = "Farmer's Welfare Scheme";
            res.render("./pages/farm_Scheme.ejs", {data, name});
        }
        else if(scheme == "women_Welfare") {
            const data = await women_Wel_Model.find({}).timeout(10000);
            const name = "Women's Welfare Scheme";
            res.render("./pages/women_Scheme.ejs", {data, name});
        }
        else if(scheme == "higher_Education") {
            const data = await higher_Education.find({}).timeout(10000);
            const name = "Higher Education Scheme";
            res.render("./pages/higher_Edu.ejs", {data, name});
        }
        else if(scheme == "primary_Education") {
            const data = await primary_Education.find({}).timeout(10000);
            const name = "Primary Education Scheme";
            res.render("./pages/primary_Edu.ejs", {data, name});
        }
        else if(scheme == "secondary_Education") {
            const data = await secondary_Education.find({}).timeout(10000);
            const name = "Secondary Education Scheme";
            res.render("./pages/secondary_Edu.ejs", {data, name});
        }
        else {
            res.status(404).render("./pages/error.ejs", {message: "Scheme not found"});
        }
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).render("./pages/error.ejs", {message: "Database connection error. Please try again later."});
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
    const data = await secondary_Education.findById(id);
    res.render("./pages/secondary_sep_scheme.ejs", {data});
});

module.exports = router;
