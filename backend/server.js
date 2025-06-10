
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
const competitiveExam_Model = require("./models/competitiveExam_Model.js");
const educationalProgram_Model = require("./models/educationalProgram_Model.js");
const stateWelfare_Model = require("./models/stateWelfare_Model.js");
const user_Model = require("./models/user_Model.js");

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
    
    // Enhanced search results with more schemes
    const allResults = [
        {
            title: "PM-Kisan Samman Nidhi",
            description: "Direct income support scheme providing ₹6,000 annually to farmers",
            category: "Agriculture",
            url: "/schemes/farmer_Welfare"
        },
        {
            title: "Beti Bachao Beti Padhao",
            description: "Government scheme for girl child welfare and education",
            category: "Women Welfare",
            url: "/schemes/women_Welfare"
        },
        {
            title: "Post Matric Scholarship",
            description: "Financial assistance for higher education students",
            category: "Education",
            url: "/schemes/higher_Education"
        },
        {
            title: "National Means-cum-Merit Scholarship",
            description: "Scholarship for meritorious students from economically weaker sections",
            category: "Education",
            url: "/schemes/secondary_Education"
        },
        {
            title: "Pradhan Mantri Fasal Bima Yojana",
            description: "Crop insurance scheme for farmers",
            category: "Agriculture",
            url: "/schemes/farmer_Welfare"
        },
        {
            title: "Swadhar Greh Scheme",
            description: "Support for women in difficult circumstances",
            category: "Women Welfare",
            url: "/schemes/women_Welfare"
        },
        {
            title: "UPSC Civil Services Examination",
            description: "Premier competitive examination for administrative services",
            category: "Competitive Exams",
            url: "/schemes/competitive-exams"
        },
        {
            title: "Skill India Mission",
            description: "Skill development programs for employability",
            category: "Skill Development",
            url: "/schemes/educational-programs"
        }
    ];

    const filteredResults = allResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    res.json(filteredResults);
});

app.get("/api/schemes/filter", (req, res) => {
    const { category, targetGroup, location } = req.query;
    
    // Enhanced filtered schemes with more options
    const allSchemes = [
        {
            title: "Secondary Education Schemes",
            description: "Comprehensive schemes for secondary education including scholarships and infrastructure",
            category: "education",
            targetGroup: "students",
            location: "central",
            detailUrl: "/schemes/secondary_Education"
        },
        {
            title: "Higher Education Support",
            description: "Financial assistance and scholarships for college and university students",
            category: "education",
            targetGroup: "students",
            location: "central",
            detailUrl: "/schemes/higher_Education"
        },
        {
            title: "Women Welfare Programs",
            description: "Empowering women through various schemes and support programs",
            category: "women",
            targetGroup: "women",
            location: "central",
            detailUrl: "/schemes/women_Welfare"
        },
        {
            title: "Farmer Support Schemes",
            description: "Agricultural support, subsidies, and welfare programs for farmers",
            category: "farmer",
            targetGroup: "farmers",
            location: "central",
            detailUrl: "/schemes/farmer_Welfare"
        },
        {
            title: "Competitive Exam Guidance",
            description: "Resources and support for UPSC, SSC, and state competitive exams",
            category: "education",
            targetGroup: "youth",
            location: "central",
            detailUrl: "/schemes/competitive-exams"
        },
        {
            title: "Skill Development Programs",
            description: "Training and certification programs for various skills",
            category: "employment",
            targetGroup: "youth",
            location: "central",
            detailUrl: "/schemes/educational-programs"
        }
    ];

    let filtered = allSchemes;

    if (category) {
        filtered = filtered.filter(scheme => scheme.category === category);
    }
    if (targetGroup) {
        filtered = filtered.filter(scheme => scheme.targetGroup === targetGroup);
    }
    if (location) {
        filtered = filtered.filter(scheme => scheme.location === location);
    }

    res.json(filtered);
});

// New API routes for enhanced features
app.get("/api/applications/:id/status", (req, res) => {
    // Mock application status
    const mockApplication = {
        applicationId: req.params.id,
        schemeName: "Sample Scheme",
        status: "under_review",
        appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(),
        remarks: "Application is being processed"
    };
    
    res.json({ success: true, application: mockApplication });
});

app.post("/api/bookmarks/toggle", (req, res) => {
    // Mock bookmark toggle
    const { schemeId, schemeType } = req.body;
    res.json({ success: true, message: "Bookmark toggled successfully" });
});

app.post("/api/notifications/:id/read", (req, res) => {
    // Mock notification read
    res.json({ success: true, message: "Notification marked as read" });
});

app.get("/api/notifications/new", (req, res) => {
    // Mock new notifications check
    res.json({ hasNew: false, count: 0 });
});

app.get("/api/notifications/unread-count", (req, res) => {
    // Mock unread count
    res.json({ count: 0 });
});

app.post("/api/profile/update", (req, res) => {
    // Mock profile update
    res.json({ success: true, message: "Profile updated successfully" });
});

// Enhanced scheme routes
app.get("/schemes/competitive-exams", (req, res) => {
    const mockExams = [
        {
            title: "UPSC Civil Services Examination",
            description: "Premier examination for Indian Administrative Service and other central services",
            benefits: ["Administrative career", "Nation building opportunity", "High social status"],
            eligibility: "Graduate degree from recognized university",
            applicationDate: "February - March",
            examDate: "June (Prelims), October (Mains)"
        },
        {
            title: "SSC Combined Graduate Level Examination",
            description: "For Group B and Group C posts in central government",
            benefits: ["Government job security", "Good salary package", "Career growth"],
            eligibility: "Graduate degree",
            applicationDate: "April - May",
            examDate: "July - August"
        },
        {
            title: "State PSC Examinations",
            description: "State-level administrative services examinations",
            benefits: ["State administrative roles", "Local governance", "Regional development"],
            eligibility: "Graduate degree with state domicile",
            applicationDate: "Varies by state",
            examDate: "Varies by state"
        }
    ];
    res.render("pages/competitive_exams", { data: mockExams, name: "Competitive Examinations" });
});

app.get("/schemes/educational-programs", (req, res) => {
    const mockPrograms = [
        {
            title: "Skill India Mission",
            description: "Skill development programs for youth employability",
            benefits: ["Free training", "Industry certification", "Job placement assistance"],
            eligibility: "Age 15-45 years",
            applicationDate: "Year round",
            duration: "3-12 months"
        },
        {
            title: "Pradhan Mantri Kaushal Vikas Yojana",
            description: "Recognition of prior learning and skill certification",
            benefits: ["Skill certification", "Monetary reward", "Better employment"],
            eligibility: "No formal education required",
            applicationDate: "Continuous",
            duration: "Variable"
        },
        {
            title: "Digital India Skills Platform",
            description: "Digital literacy and IT skills training",
            benefits: ["Digital skills", "Online certification", "Career advancement"],
            eligibility: "Basic literacy",
            applicationDate: "Online registration",
            duration: "Self-paced"
        }
    ];
    res.render("pages/competitive_exams", { data: mockPrograms, name: "Educational Programs" });
});

app.get("/schemes/state-welfare", (req, res) => {
    const mockStatePrograms = [
        {
            title: "State Health Insurance Schemes",
            description: "Comprehensive health coverage for state residents",
            benefits: ["Medical treatment coverage", "Cashless hospitalization", "Family coverage"],
            eligibility: "State resident with income criteria",
            applicationDate: "Year round",
            coverage: "Up to ₹5 lakh per family"
        },
        {
            title: "State Employment Guarantee Schemes",
            description: "Rural employment guarantee programs",
            benefits: ["100 days guaranteed work", "Wage employment", "Rural development"],
            eligibility: "Rural household",
            applicationDate: "Continuous",
            wage: "As per state norms"
        },
        {
            title: "State Housing Schemes",
            description: "Affordable housing for economically weaker sections",
            benefits: ["Subsidized housing", "Construction assistance", "Infrastructure development"],
            eligibility: "Income and ownership criteria",
            applicationDate: "As per notifications",
            subsidy: "Varies by state"
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
