const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate"); 
const farmer_Schemes_Model=require("./model/farmer_Schemes_Model.js");   
const women_Wel_Model=require("./model/women_Welf_Model.js");
const higher_Education=require("./model/higher_Education_Model.js");
const secondary_Education=require("./model/secondary_Education.js");
const primary_Education=require("./model/primary_Education.js");

app.engine("ejs", ejsMate); 
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const port = 4000;
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/PBL_DOCUMENTS");
}

main()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));


app.get("/", (req, res) => {
    res.render("./pages/new_home.ejs");
});

app.get("/schemes/:scheme",async (req,res)=>{
   let {scheme}=req.params;
   console.log(scheme);
   if(scheme=="farmer_Welfare"){
        const data=await farmer_Schemes_Model.find({});
        const name="Farmer's Welfare Scheme";
        res.render("./pages/farm_Scheme.ejs",{data,name});
   }
   else if(scheme=="women_Welfare"){
    const data=await women_Wel_Model.find({});
    const name="Women's Welfare Scheme";
    res.render("./pages/women_Scheme.ejs",{data,name});
   }
   else if(scheme=="higher_Education"){
    const data=await higher_Education.find({});
    const name="Higher Education Scheme";
    res.render("./pages/higher_Edu.ejs",{data,name});
   }
   else if(scheme=="primary_Education"){
    const data=await primary_Education.find({});
    const name="Primary Education Scheme";
    res.render("./pages/primary_Edu.ejs",{data,name});
   }
   else if(scheme=="secondary_Education"){
    const data=await secondary_Education.find({});
    const name="Secondary Education Scheme";
    res.render("./pages/secondary_Edu.ejs",{data,name});
   }
});

app.get("/schemes/farmer_Welfare/:id",async (req,res)=>{
    const {id}=req.params;
    const data=await farmer_Schemes_Model.findById(id);
    res.render("./pages/farm_sep_scheme.ejs",{data});

})

app.get("/schemes/women_Welfare/:id",async (req,res)=>{
    const {id}=req.params;
    const data=await women_Wel_Model.findById(id);
    res.render("./pages/women_sep_scheme.ejs",{data});

})

app.get("/schemes/higher_Education/:id",async (req,res)=>{
    const {id}=req.params;
    const data=await higher_Education.findById(id);
    res.render("./pages/higher_sep_scheme.ejs",{data});
})

app.get("/schemes/secondary_Education/:id",async (req,res)=>{
    const {id}=req.params;
    const data=await secondary_Education.findById(id);
    res.render("./pages/secondary_sep_scheme.ejs",{data});

})

app.get("/login", (req, res) => {
    res.render("./pages/login_Page.ejs");
});

app.get("/management", (req, res) => {
    res.render("./pages/ManagementPage.ejs");
});
app.get("/signup", (req, res) => {
    res.render("./pages/SignUpPage.ejs");
});


app.post("/login", (req, res) => {
    let {username,password}=req.body;
    console.log(username,password);
    res.send("Successfully login");
});

app.listen(process.env.port, () => {
    console.log(`Server running on port ${port}`);
});
