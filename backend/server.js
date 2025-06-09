
const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");

// Import models
const farmer_Schemes_Model = require("./models/farmer_Schemes_Model.js");   
const women_Wel_Model = require("./models/women_Welf_Model.js");
const higher_Education = require("./models/higher_Education_Model.js");
const secondary_Education = require("./models/secondary_Education.js");
const primary_Education = require("./models/primary_Education.js");

// Import routes
const schemeRoutes = require("./routes/schemes.js");
const authRoutes = require("./routes/auth.js");

app.engine("ejs", ejsMate); 
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "../frontend/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend/assets")));

const port = process.env.PORT || 4000;

// Database connection
async function connectDB() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.log("MongoDB URI not found in environment variables. Please set MONGODB_URI in Secrets.");
        return;
    }
    await mongoose.connect(mongoURI);
}

connectDB()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));

// Routes
app.use('/schemes', schemeRoutes);
app.use('/auth', authRoutes);

app.get("/", (req, res) => {
    res.render("./pages/new_home.ejs");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
