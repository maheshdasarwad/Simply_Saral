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
app.use('/css', express.static(path.join(__dirname, "../frontend/assets/css")));
app.use('/js', express.static(path.join(__dirname, "../frontend/assets/js")));
app.use('/images', express.static(path.join(__dirname, "../frontend/assets/Image")));
app.use('/Image', express.static(path.join(__dirname, "../frontend/assets/Image")));

const port = process.env.PORT || 5000;

// Database connection
async function connectDB() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.log("MongoDB URI not found in environment variables. Please set MONGODB_URI in Secrets.");
        console.log("Server will start without database connection.");
        return false;
    }

    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        return true;
    } catch (error) {
        console.log("Failed to connect to database:", error.message);
        return false;
    }
}

connectDB()
    .then((connected) => {
        if (connected) {
            console.log("Database connected successfully");
        } else {
            console.log("Starting server without database connection");
        }
    })
    .catch((err) => console.log("Database connection error:", err));

// Routes
app.use("/schemes", schemeRoutes);
app.use("/auth", authRoutes);

// Add missing routes
app.get("/login", (req, res) => {
    res.render("pages/login_Page");
});

app.get("/signup", (req, res) => {
    res.render("pages/SignUpPage");
});

app.get("/management", (req, res) => {
    res.render("pages/ManagementPage");
});

app.get("/", (req, res) => {
    res.render("./pages/new_home.ejs");
});

// Add database status endpoint for debugging
app.get("/api/status", (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };

    res.json({
        server: 'running',
        database: statusMap[dbStatus] || 'unknown',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access your app at: http://0.0.0.0:${port}`);
});