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
const profileRoutes = require("./routes/profileRoutes.js");
const feedbackRoutes = require("./routes/feedbackRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

// Import modules
const ChatbotService = require("./modules/chatbot.js");
const I18nService = require("./modules/i18n.js");

// Initialize services
const chatbotService = new ChatbotService();
const i18nService = new I18nService();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.set("views", path.join(__dirname, "../frontend/views"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
        console.log("WARNING: MongoDB URI not found in environment variables.");
        console.log("INFO: Server will continue with fallback data - no database features.");
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

// Add i18n middleware
app.use(i18nService.middleware());

// Routes
app.use("/schemes", require("./routes/schemes"));
app.use("/auth", require("./routes/auth"));
app.use("/api/profile", profileRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Fixed scheme routes with proper title passing
app.get('/competitive-exams', async (req, res) => {
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
                    conductingBody: "Union Public Service Commission"
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
        res.render("pages/competitive_exams", { 
            exams: data, 
            name: "Competitive Examinations",
            title: "Competitive Exams - Simply Saral"
        });
    } catch (error) {
        console.error("ERROR: Failed to load competitive exams:", error);
        res.status(500).render("pages/error", { 
            message: "Failed to load competitive examinations. Please try again later.",
            error: error.message,
            title: "Error - Simply Saral"
        });
    }
});

app.get('/educational-programs', async (req, res) => {
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
        res.render("pages/competitive_exams", { 
            exams: data, 
            name: "Educational Programs",
            title: "Educational Programs - Simply Saral"
        });
    } catch (error) {
        console.error("ERROR: Failed to load educational programs:", error);
        res.status(500).render("pages/error", { 
            message: "Failed to load educational programs. Please try again later.",
            error: error.message,
            title: "Error - Simply Saral"
        });
    }
});

app.get('/state-welfare', async (req, res) => {
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
        res.render("pages/competitive_exams", { 
            exams: data, 
            name: "State Welfare Programs",
            title: "State Welfare Programs - Simply Saral"
        });
    } catch (error) {
        console.error("ERROR: Failed to load state welfare programs:", error);
        res.status(500).render("pages/error", { 
            message: "Failed to load state welfare programs. Please try again later.",
            error: error.message,
            title: "Error - Simply Saral"
        });
    }
});

// Chatbot API endpoint
app.post("/api/chatbot", async (req, res) => {
    try {
        const { query, userId, context = {} } = req.body;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: 'Query is required and must be a string' 
            });
        }

        console.log("DEBUG: Chatbot query received:", query);
        const response = await chatbotService.processQuery(query, context);

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            try {
                await user_Model.findByIdAndUpdate(userId, {
                    $push: {
                        chatHistory: {
                            query,
                            response: response.response,
                            timestamp: new Date()
                        }
                    }
                });
            } catch (trackError) {
                console.error("Failed to track chat history:", trackError);
            }
        }

        res.json(response);
    } catch (error) {
        console.error("Chatbot API error:", error);
        res.status(500).json({
            success: false,
            message: "Chatbot service temporarily unavailable",
            error: error.message
        });
    }
});

// Language switching endpoint
app.post("/api/language", (req, res) => {
    const { language } = req.body;

    if (i18nService.setLanguage(language)) {
        res.json({ 
            success: true, 
            message: 'Language updated successfully',
            currentLanguage: language,
            translations: i18nService.getAllTranslations(language)
        });
    } else {
        res.status(400).json({ 
            success: false, 
            message: 'Unsupported language',
            supportedLanguages: i18nService.supportedLanguages
        });
    }
});

// Get translations for frontend
app.get("/api/translations/:language?", (req, res) => {
    const { language } = req.params;
    const translations = i18nService.getAllTranslations(language);

    res.json({
        success: true,
        language: language || i18nService.currentLanguage,
        translations,
        supportedLanguages: i18nService.supportedLanguages
    });
});

// API Routes for search and filtering
app.get("/api/search", (req, res) => {
    console.log("DEBUG: Search API called with query:", req.query.q);
    const query = req.query.q || '';

    try {
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
                title: "UPSC Civil Services Examination",
                description: "Premier competitive examination for administrative services",
                category: "Competitive Exams",
                url: "/competitive-exams"
            },
            {
                title: "Skill India Mission",
                description: "Comprehensive skill development programs for employability",
                category: "Skill Development",
                url: "/educational-programs"
            },
            {
                title: "Ayushman Bharat Yojana",
                description: "Health insurance scheme providing ₹5 lakh coverage per family",
                category: "Health",
                url: "/state-welfare"
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

// Page routes
app.get("/dashboard", (req, res) => {
    res.render("pages/user_dashboard", { title: "Dashboard - Simply Saral" });
});

app.get("/login", (req, res) => {
    res.render("pages/login_Page", { title: "Login - Simply Saral" });
});

app.get("/signup", (req, res) => {
    res.render("pages/SignUpPage", { title: "Sign Up - Simply Saral" });
});

app.get("/management", (req, res) => {
    res.render("pages/ManagementPage", { title: "Management - Simply Saral" });
});

app.get("/", (req, res) => {
    res.render("pages/new_home", { title: "Simply Saral - Government Schemes Made Simple" });
});

// Database status endpoint
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