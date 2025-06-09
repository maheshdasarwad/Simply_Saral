
const mongoose = require('mongoose');
require('dotenv').config();

// Import initialization functions
const { initializeFarmerData } = require('./init_Farmer_data');
const { initializeWomenWelfareData } = require('./init_women_wel');
const { initializeHigherEducationData } = require('./init_higher_Edu');
const { initializeSecondaryEducationData } = require('./init_Secondary_Edu');
const { initializePrimaryEducationData } = require('./init_Primary_Edu');
const { initializeCompetitiveExams } = require('./init_competitive_exams');
const { initializeEducationalPrograms } = require('./init_educational_programs');

async function connectDB() {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/simply_saral';
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Database connected successfully');
        return true;
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
        return false;
    }
}

async function initializeAllData() {
    console.log('Starting data initialization...');
    
    const connected = await connectDB();
    if (!connected) {
        console.log('Cannot initialize data without database connection');
        return;
    }

    try {
        // Initialize all data in sequence
        console.log('Initializing Farmer Schemes...');
        await initializeFarmerData();
        
        console.log('Initializing Women Welfare Schemes...');
        await initializeWomenWelfareData();
        
        console.log('Initializing Higher Education Schemes...');
        await initializeHigherEducationData();
        
        console.log('Initializing Secondary Education Schemes...');
        await initializeSecondaryEducationData();
        
        console.log('Initializing Primary Education Schemes...');
        await initializePrimaryEducationData();
        
        console.log('Initializing Competitive Exams...');
        await initializeCompetitiveExams();
        
        console.log('Initializing Educational Programs...');
        await initializeEducationalPrograms();
        
        console.log('All data initialized successfully!');
        
        // Display statistics
        const stats = await getDataStatistics();
        console.log('\n=== Data Statistics ===');
        Object.entries(stats).forEach(([collection, count]) => {
            console.log(`${collection}: ${count} records`);
        });
        
    } catch (error) {
        console.error('Error during data initialization:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

async function getDataStatistics() {
    const farmer_Schemes_Model = require('../backend/models/farmer_Schemes_Model');
    const women_Welf_Model = require('../backend/models/women_Welf_Model');
    const higher_Education = require('../backend/models/higher_Education_Model');
    const secondary_Education = require('../backend/models/secondary_Education');
    const primary_Education = require('../backend/models/primary_Education');
    const CompetitiveExam = require('../backend/models/competitiveExam_Model');
    const EducationalProgram = require('../backend/models/educationalProgram_Model');

    return {
        'Farmer Schemes': await farmer_Schemes_Model.countDocuments(),
        'Women Welfare': await women_Welf_Model.countDocuments(),
        'Higher Education': await higher_Education.countDocuments(),
        'Secondary Education': await secondary_Education.countDocuments(),
        'Primary Education': await primary_Education.countDocuments(),
        'Competitive Exams': await CompetitiveExam.countDocuments(),
        'Educational Programs': await EducationalProgram.countDocuments()
    };
}

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeAllData();
}

module.exports = { initializeAllData, getDataStatistics };
