const express = require("express");
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// Import models
const farmer_Schemes_Model = require("./models/farmer_Schemes_Model.js");   
const women_Wel_Model = require("./models/women_Welf_Model.js");
const higher_Education = require("./models/higher_Education_Model.js");
const secondary_Education = require("./models/secondary_Education.js");
const primary_Education = require("./models/primary_Education.js");

// Import routes
const schemeRoutes = require("./routes/schemes.js");
const authRoutes = require("./routes/auth.js");

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development
    crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.engine("ejs", ejsMate); 
app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "../frontend/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add JSON parsing
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

// API Routes for search and filtering
app.get("/api/search", (req, res) => {
    const query = req.query.q || '';
    
    // Mock search results for now
    const mockResults = [
        {
            title: "PM-Kisan Samman Nidhi",
            description: "Direct income support to farmers",
            category: "Agriculture",
            url: "/schemes/farmer_Welfare"
        },
        {
            title: "Beti Bachao Beti Padhao",
            description: "Scheme for girl child welfare",
            category: "Women Welfare",
            url: "/schemes/women_Welfare"
        },
        {
            title: "Post Matric Scholarship",
            description: "Financial assistance for higher education",
            category: "Education",
            url: "/schemes/higher_Education"
        }
    ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    res.json(mockResults);
});

app.get("/api/schemes/filter", (req, res) => {
    const { category, targetGroup, location } = req.query;
    
    // Mock filtered results
    const mockSchemes = [
        {
            title: "Secondary Education Schemes",
            description: "Comprehensive schemes for secondary education",
            category: "education",
            targetGroup: "students",
            detailUrl: "/schemes/secondary_Education"
        },
        {
            title: "Women Welfare Programs",
            description: "Empowering women through various schemes",
            category: "women",
            targetGroup: "women",
            detailUrl: "/schemes/women_Welfare"
        }
    ];

    const filtered = mockSchemes.filter(scheme => {
        if (category && scheme.category !== category) return false;
        if (targetGroup && scheme.targetGroup !== targetGroup) return false;
        return true;
    });

    res.json(filtered);
});

// New feature routes
app.get("/schemes/competitive-exams", (req, res) => {
    res.render("pages/competitive_exams");
});

app.get("/schemes/educational-programs", (req, res) => {
    const mockPrograms = [
        {
            title: "Skill India Mission",
            description: "Skill development programs for youth",
            benefits: ["Free training", "Certification", "Job placement assistance"]
        }
    ];
    res.render("pages/competitive_exams", { data: mockPrograms, name: "Educational Programs" });
});

app.get("/schemes/state-welfare", (req, res) => {
    const mockStatePrograms = [
        {
            title: "State Welfare Programs",
            description: "State-specific welfare initiatives",
            benefits: ["Regional support", "Local employment", "Community development"]
        }
    ];
    res.render("pages/competitive_exams", { data: mockStatePrograms, name: "State Welfare Programs" });
});

app.get("/dashboard", (req, res) => {
    res.render("pages/user_dashboard");
});

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