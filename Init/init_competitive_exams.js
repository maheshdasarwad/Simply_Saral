
const mongoose = require('mongoose');
const CompetitiveExam = require('../backend/models/competitiveExam_Model');

const competitiveExamsData = [
    {
        title: "UPSC Civil Services Examination",
        fullName: "Union Public Service Commission Civil Services Examination",
        conductingBody: "Union Public Service Commission (UPSC)",
        examType: "UPSC",
        description: "The UPSC Civil Services Examination is conducted annually by the Union Public Service Commission for recruitment to various Civil Services of the Government of India, including the Indian Administrative Service (IAS), Indian Foreign Service (IFS), and Indian Police Service (IPS).",
        eligibility: {
            ageLimit: { min: 21, max: 32 },
            educationalQualification: "Bachelor's degree from a recognized university",
            nationality: "Indian",
            attempts: 6
        },
        examPattern: {
            stages: ["Preliminary Examination", "Main Examination", "Interview"],
            subjects: ["General Studies", "CSAT", "Optional Subject", "Essay", "General Studies Papers I-IV"],
            totalMarks: 2025,
            duration: "3 stages over 1 year",
            mediumOfExam: ["English", "Hindi", "Regional Languages"]
        },
        applicationDetails: {
            applicationFee: {
                general: 100,
                obc: 100,
                scst: 0,
                pwd: 0
            },
            onlineApplicationUrl: "https://upsc.gov.in"
        },
        importantDates: {
            notificationDate: new Date('2024-02-14'),
            applicationStart: new Date('2024-02-14'),
            applicationEnd: new Date('2024-03-05'),
            examDate: new Date('2024-06-16'),
            resultDate: new Date('2024-07-15')
        },
        vacancies: {
            total: 1105,
            categoryWise: {
                general: 450,
                obc: 300,
                sc: 200,
                st: 100,
                pwd: 55
            }
        },
        preparationResources: {
            officialWebsite: "https://upsc.gov.in",
            syllabusUrl: "https://upsc.gov.in/syllabus",
            previousPapers: ["https://upsc.gov.in/previous-papers"],
            recommendedBooks: ["NCERT Books", "Laxmikanth Constitution", "Spectrum Modern History"],
            onlineCourses: ["BYJU'S", "Unacademy", "Vision IAS"]
        },
        contactInfo: {
            helplineNumbers: ["011-23385271", "011-23381125"],
            emailSupport: "webmaster.upsc@nic.in",
            address: "Dholpur House, Shahjahan Road, New Delhi-110069"
        },
        status: "active"
    },
    {
        title: "SSC CGL",
        fullName: "Staff Selection Commission Combined Graduate Level Examination",
        conductingBody: "Staff Selection Commission (SSC)",
        examType: "SSC",
        description: "SSC CGL is conducted for recruitment to various Group B and Group C posts in Ministries/Departments/Organizations of the Government of India.",
        eligibility: {
            ageLimit: { min: 18, max: 32 },
            educationalQualification: "Bachelor's degree from a recognized university",
            nationality: "Indian",
            attempts: 7
        },
        examPattern: {
            stages: ["Tier I", "Tier II", "Tier III", "Tier IV"],
            subjects: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English Comprehension"],
            totalMarks: 800,
            duration: "4 tiers over 6 months",
            mediumOfExam: ["English", "Hindi"]
        },
        applicationDetails: {
            applicationFee: {
                general: 100,
                obc: 100,
                scst: 0,
                pwd: 0
            },
            onlineApplicationUrl: "https://ssc.nic.in"
        },
        vacancies: {
            total: 17727,
            categoryWise: {
                general: 7500,
                obc: 4800,
                sc: 3200,
                st: 1600,
                pwd: 627
            }
        },
        preparationResources: {
            officialWebsite: "https://ssc.nic.in",
            syllabusUrl: "https://ssc.nic.in/syllabus",
            previousPapers: ["https://ssc.nic.in/previous-papers"]
        },
        contactInfo: {
            helplineNumbers: ["011-24364608", "011-24360540"],
            emailSupport: "sscnic@nic.in"
        },
        status: "active"
    }
];

async function initializeCompetitiveExams() {
    try {
        await CompetitiveExam.deleteMany({});
        await CompetitiveExam.insertMany(competitiveExamsData);
        console.log('Competitive exams data initialized successfully');
    } catch (error) {
        console.error('Error initializing competitive exams data:', error);
    }
}

module.exports = { initializeCompetitiveExams, competitiveExamsData };
