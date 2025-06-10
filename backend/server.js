
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

// Database connection with enhanced logging
async function connectDB() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.log("WARNING: MongoDB URI not found in environment variables.");
        console.log("INFO: Server will continue with fallback data - no database features.");
        console.log("INFO: To enable database features, set MONGODB_URI in Secrets.");
        return false;
    }

    console.log("INFO: Attempting to connect to MongoDB...");
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("SUCCESS: Connected to MongoDB successfully");
        return true;
    } catch (error) {
        console.error("ERROR: Failed to connect to database:", error.message);
        console.log("INFO: Server will continue with fallback data");
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
    console.log("DEBUG: Search API called with query:", req.query.q);
    const query = req.query.q || '';
    
    try {
        // Expanded search results with 20+ schemes
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
                description: "Crop insurance scheme protecting farmers against crop losses",
                category: "Agriculture",
                url: "/schemes/farmer_Welfare"
            },
            {
                title: "Swadhar Greh Scheme",
                description: "Support for women in difficult circumstances with shelter and rehabilitation",
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
                description: "Comprehensive skill development programs for employability",
                category: "Skill Development",
                url: "/schemes/educational-programs"
            },
            {
                title: "Ayushman Bharat Yojana",
                description: "Health insurance scheme providing ₹5 lakh coverage per family",
                category: "Health",
                url: "/schemes/state-welfare"
            },
            {
                title: "NEET UG 2024",
                description: "National medical entrance examination for MBBS/BDS admissions",
                category: "Competitive Exams",
                url: "/schemes/competitive-exams"
            },
            {
                title: "JEE Main 2024",
                description: "Joint entrance examination for engineering college admissions",
                category: "Competitive Exams",
                url: "/schemes/competitive-exams"
            },
            {
                title: "SSC CGL Examination",
                description: "Staff Selection Commission combined graduate level examination",
                category: "Competitive Exams",
                url: "/schemes/competitive-exams"
            },
            {
                title: "Startup India Seed Fund",
                description: "Financial support for startups with up to ₹20 lakh funding",
                category: "Entrepreneurship",
                url: "/schemes/educational-programs"
            },
            {
                title: "Stand Up India",
                description: "Bank loans for SC/ST and women entrepreneurs (₹10 lakh to ₹1 crore)",
                category: "Entrepreneurship",
                url: "/schemes/educational-programs"
            },
            {
                title: "PM SVANidhi Scheme",
                description: "Micro-credit facility for street vendors affected by COVID-19",
                category: "Employment",
                url: "/schemes/educational-programs"
            },
            {
                title: "PMKVY (Pradhan Mantri Kaushal Vikas Yojana)",
                description: "Skill certification with monetary rewards up to ₹8,000",
                category: "Skill Development",
                url: "/schemes/educational-programs"
            },
            {
                title: "Digital India Skills Platform",
                description: "Free digital literacy and IT skills training with certification",
                category: "Digital Literacy",
                url: "/schemes/educational-programs"
            },
            {
                title: "Mahatma Gandhi NREGA",
                description: "Rural employment guarantee providing 100 days of work annually",
                category: "Employment",
                url: "/schemes/state-welfare"
            },
            {
                title: "PM Awas Yojana (Gramin)",
                description: "Housing assistance of ₹1.2-1.3 lakh for rural families",
                category: "Housing",
                url: "/schemes/state-welfare"
            },
            {
                title: "Ladli Behna Yojana",
                description: "₹1,250 monthly financial assistance for women (MP state scheme)",
                category: "Women Welfare",
                url: "/schemes/state-welfare"
            },
            {
                title: "PM Garib Kalyan Anna Yojana",
                description: "Free food grains distribution - 5kg wheat/rice per person",
                category: "Food Security",
                url: "/schemes/state-welfare"
            },
            {
                title: "Kisan Credit Card",
                description: "Short-term credit facility for farmers with subsidized interest rates",
                category: "Agriculture",
                url: "/schemes/farmer_Welfare"
            },
            {
                title: "Sarva Shiksha Abhiyan",
                description: "Universal elementary education program with infrastructure development",
                category: "Education",
                url: "/schemes/secondary_Education"
            }
        ];

        const filteredResults = allResults.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        console.log("DEBUG: Search found", filteredResults.length, "results for query:", query);
        res.json(filteredResults);
    } catch (error) {
        console.error("ERROR: Search API failed:", error);
        res.status(500).json({ error: "Search service temporarily unavailable" });
    }
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

// Enhanced scheme routes with logging
app.get("/schemes/competitive-exams", async (req, res) => {
    console.log("DEBUG: Accessing competitive exams route");
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data = [];

        if (isDbConnected) {
            console.log("DEBUG: Database connected, fetching competitive exams from DB");
            data = await competitiveExam_Model.find({}).timeout(5000);
            console.log("DEBUG: Found", data.length, "competitive exams in database");
        }

        if (!data || data.length === 0) {
            console.log("DEBUG: Using fallback data for competitive exams");
            data = [
                {
                    title: "UPSC Civil Services Examination",
                    description: "Premier examination for Indian Administrative Service and other central services",
                    benefits: ["Administrative career", "Nation building opportunity", "High social status"],
                    eligibility: "Graduate degree from recognized university",
                    applicationDate: "February - March",
                    examDate: "June (Prelims), October (Mains)",
                    examType: "UPSC",
                    conductingBody: "Union Public Service Commission",
                    syllabus: {
                        prelimsTopics: ["General Studies", "CSAT"],
                        mainsTopics: ["Essay", "General Studies I-IV", "Optional Subject"],
                        interviewTopics: ["Personality Test", "Current Affairs"]
                    }
                },
                {
                    title: "SSC Combined Graduate Level Examination",
                    description: "For Group B and Group C posts in central government",
                    benefits: ["Government job security", "Good salary package", "Career growth"],
                    eligibility: "Graduate degree",
                    applicationDate: "April - May",
                    examDate: "July - August",
                    examType: "SSC",
                    conductingBody: "Staff Selection Commission"
                },
                {
                    title: "NTA JEE Main 2024",
                    description: "National Testing Agency Joint Entrance Examination for engineering admissions",
                    benefits: ["Engineering college admission", "IIT JEE Advanced qualification", "NIT admission"],
                    eligibility: "12th pass with PCM",
                    applicationDate: "November - December",
                    examDate: "January & April sessions",
                    examType: "Engineering",
                    conductingBody: "National Testing Agency"
                },
                {
                    title: "NEET UG 2024",
                    description: "National Eligibility cum Entrance Test for medical admissions",
                    benefits: ["MBBS admission", "BDS admission", "AYUSH courses"],
                    eligibility: "12th pass with PCB",
                    applicationDate: "February - March",
                    examDate: "May",
                    examType: "Medical",
                    conductingBody: "National Testing Agency"
                },
                {
                    title: "State PSC Examinations",
                    description: "State-level administrative services examinations",
                    benefits: ["State administrative roles", "Local governance", "Regional development"],
                    eligibility: "Graduate degree with state domicile",
                    applicationDate: "Varies by state",
                    examDate: "Varies by state",
                    examType: "State PSC",
                    conductingBody: "State Public Service Commissions"
                }
            ];
        }

        console.log("DEBUG: Rendering competitive exams page with", data.length, "items");
        res.render("pages/competitive_exams", { data, name: "Competitive Examinations" });
    } catch (error) {
        console.error("ERROR: Failed to load competitive exams:", error);
        res.status(500).render("pages/error", { 
            message: "Failed to load competitive examinations. Please try again later.",
            error: error.message
        });
    }
});

app.get("/schemes/educational-programs", async (req, res) => {
    console.log("DEBUG: Accessing educational programs route");
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data = [];

        if (isDbConnected) {
            console.log("DEBUG: Database connected, fetching educational programs from DB");
            data = await educationalProgram_Model.find({}).timeout(5000);
            console.log("DEBUG: Found", data.length, "educational programs in database");
        }

        if (!data || data.length === 0) {
            console.log("DEBUG: Using fallback data for educational programs");
            data = [
                {
                    title: "Skill India Mission",
                    description: "Comprehensive skill development programs for youth employability and entrepreneurship",
                    benefits: ["Free training", "Industry certification", "Job placement assistance", "Entrepreneurship support"],
                    eligibility: "Age 15-45 years",
                    applicationDate: "Year round",
                    duration: "3-12 months",
                    programType: "Skill Development",
                    category: "Skill Development",
                    targetGroup: ["Unemployed Youth", "Working Professionals"]
                },
                {
                    title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
                    description: "Recognition of prior learning and skill certification program",
                    benefits: ["Skill certification", "Monetary reward up to ₹8,000", "Better employment opportunities"],
                    eligibility: "No formal education required",
                    applicationDate: "Continuous",
                    duration: "Variable (150-300 hours)",
                    programType: "Certification Course",
                    category: "Skill Development"
                },
                {
                    title: "Digital India Skills Platform",
                    description: "Digital literacy and IT skills training for digital empowerment",
                    benefits: ["Digital skills", "Online certification", "Career advancement", "Free courses"],
                    eligibility: "Basic literacy",
                    applicationDate: "Online registration open",
                    duration: "Self-paced",
                    programType: "Training Program",
                    category: "Digital Literacy"
                },
                {
                    title: "PM SVANidhi Scheme",
                    description: "Micro-credit facility for street vendors affected by COVID-19",
                    benefits: ["Collateral-free loans", "Digital payment rewards", "Credit score improvement"],
                    eligibility: "Street vendors with certificate",
                    applicationDate: "Ongoing",
                    duration: "Loan tenure: 1 year",
                    programType: "Financial Support",
                    category: "Employment"
                },
                {
                    title: "Startup India Seed Fund Scheme",
                    description: "Financial support to startups for proof of concept and prototype development",
                    benefits: ["Up to ₹20 lakh funding", "Mentorship support", "Market validation"],
                    eligibility: "DPIIT recognized startups",
                    applicationDate: "Continuous",
                    duration: "Up to 2 years",
                    programType: "Financial Support",
                    category: "Entrepreneurship"
                },
                {
                    title: "Stand Up India",
                    description: "Bank loans for SC/ST and women entrepreneurs",
                    benefits: ["₹10 lakh to ₹1 crore loans", "Handholding support", "Credit guarantee"],
                    eligibility: "SC/ST/Women entrepreneurs",
                    applicationDate: "Ongoing",
                    duration: "Loan tenure: 7 years",
                    programType: "Financial Support",
                    category: "Entrepreneurship"
                }
            ];
        }

        console.log("DEBUG: Rendering educational programs page with", data.length, "items");
        res.render("pages/competitive_exams", { data, name: "Educational Programs" });
    } catch (error) {
        console.error("ERROR: Failed to load educational programs:", error);
        res.status(500).render("pages/error", { 
            message: "Failed to load educational programs. Please try again later.",
            error: error.message
        });
    }
});

app.get("/schemes/state-welfare", async (req, res) => {
    console.log("DEBUG: Accessing state welfare programs route");
    try {
        const isDbConnected = mongoose.connection.readyState === 1;
        let data = [];

        if (isDbConnected) {
            console.log("DEBUG: Database connected, fetching state welfare programs from DB");
            data = await stateWelfare_Model.find({}).timeout(5000);
            console.log("DEBUG: Found", data.length, "state welfare programs in database");
        }

        if (!data || data.length === 0) {
            console.log("DEBUG: Using fallback data for state welfare programs");
            data = [
                {
                    title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
                    description: "Comprehensive health insurance scheme for economically vulnerable families",
                    benefits: ["₹5 lakh health coverage per family", "Cashless hospitalization", "1,400+ medical packages"],
                    eligibility: "SECC database beneficiaries",
                    applicationDate: "Year round",
                    coverage: "Up to ₹5 lakh per family per year",
                    programType: "Health Insurance",
                    targetGroup: ["Below Poverty Line families"]
                },
                {
                    title: "Mahatma Gandhi NREGA",
                    description: "Rural employment guarantee scheme providing 100 days of wage employment",
                    benefits: ["100 days guaranteed work", "₹200+ daily wage", "Rural infrastructure development"],
                    eligibility: "Rural household adults",
                    applicationDate: "Continuous registration",
                    wage: "₹200-300 per day (state-wise)",
                    programType: "Employment Guarantee",
                    targetGroup: ["Rural Population"]
                },
                {
                    title: "Pradhan Mantri Awas Yojana (Gramin)",
                    description: "Housing for all in rural areas with financial assistance",
                    benefits: ["₹1.2-1.3 lakh housing assistance", "Toilet and LPG connection", "Technical support"],
                    eligibility: "Rural BPL families without pucca house",
                    applicationDate: "As per state notifications",
                    subsidy: "₹1,20,000 - ₹1,30,000",
                    programType: "Housing Scheme"
                },
                {
                    title: "Ladli Behna Yojana (Madhya Pradesh)",
                    description: "Financial assistance scheme for women empowerment",
                    benefits: ["₹1,250 monthly financial assistance", "Direct bank transfer", "Women empowerment"],
                    eligibility: "Women aged 21-60 years, family income < ₹2.5 lakh",
                    applicationDate: "Ongoing registration",
                    amount: "₹1,250 per month",
                    programType: "Financial Assistance",
                    targetGroup: ["Women"]
                },
                {
                    title: "Mukhyamantri Kisan Samman Nidhi (Various States)",
                    description: "State-level farmer income support schemes",
                    benefits: ["Additional financial support", "Crop insurance", "Agricultural input subsidies"],
                    eligibility: "Small and marginal farmers",
                    applicationDate: "Varies by state",
                    amount: "₹2,000-6,000 annually",
                    programType: "Agricultural Support"
                },
                {
                    title: "Free Ration Scheme (PM Garib Kalyan Anna Yojana)",
                    description: "Free food grains distribution to vulnerable families",
                    benefits: ["5 kg wheat/rice per person", "1 kg pulses per family", "Free distribution"],
                    eligibility: "NFSA beneficiaries",
                    applicationDate: "Automatic coverage",
                    coverage: "80 crore beneficiaries",
                    programType: "Food Security"
                }
            ];
        }

        console.log("DEBUG: Rendering state welfare programs page with", data.length, "items");
        res.render("pages/competitive_exams", { data, name: "State Welfare Programs" });
    } catch (error) {
        console.error("ERROR: Failed to load state welfare programs:", error);
        res.status(500).render("pages/error", { 
            message: "Failed to load state welfare programs. Please try again later.",
            error: error.message
        });
    }
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
    console.log(`✅ SERVER STARTED SUCCESSFULLY`);
    console.log(`🌐 Port: ${port}`);
    console.log(`🔗 Access URL: http://0.0.0.0:${port}`);
    console.log(`📊 Database Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Fallback Mode'}`);
    console.log(`🚀 All API endpoints are ready!`);
});
