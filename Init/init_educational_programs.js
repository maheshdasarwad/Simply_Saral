
const mongoose = require('mongoose');
const EducationalProgram = require('../backend/models/educationalProgram_Model');

const educationalProgramsData = [
    {
        title: "Skill India Digital Hub",
        programType: "Skill Development",
        category: "Digital Literacy",
        targetGroup: ["Students", "Unemployed Youth", "Working Professionals"],
        description: "A comprehensive digital platform offering free online courses, skill assessments, and certification programs across various sectors to enhance employability and entrepreneurship skills.",
        eligibility: {
            ageLimit: { min: 16, max: 45 },
            educationalQualification: "Minimum 10th standard",
            domicile: "Indian Citizen"
        },
        benefits: {
            financialAssistance: {
                amount: 5000,
                frequency: "One-time",
                paymentMode: "Direct Bank Transfer"
            },
            nonFinancialBenefits: [
                "Industry-recognized certificates",
                "Job placement assistance",
                "Entrepreneurship support",
                "Mentorship programs"
            ],
            certificationProvided: true,
            jobAssistance: true,
            internshipOpportunity: true
        },
        applicationProcess: {
            onlineSteps: [
                "Visit Skill India Digital platform",
                "Create user account with basic details",
                "Complete skill assessment test",
                "Choose desired course/program",
                "Upload required documents",
                "Start learning immediately"
            ],
            applicationUrl: "https://www.skillindiadigital.gov.in"
        },
        programDetails: {
            duration: "3-12 months",
            mode: "Online",
            curriculum: [
                "Digital Literacy Fundamentals",
                "Industry-specific Technical Skills",
                "Soft Skills and Communication",
                "Entrepreneurship Development",
                "Job Readiness Training"
            ],
            assessmentMethod: "Online tests and practical assignments"
        },
        implementingAgency: {
            name: "Ministry of Skill Development and Entrepreneurship",
            website: "https://www.skilldevelopment.gov.in",
            contactDetails: {
                phone: ["011-23061482"],
                email: "info@nsdcindia.org"
            }
        },
        statistics: {
            totalSeats: 100000,
            successRate: 85,
            placementRate: 70,
            averageSalary: 25000
        },
        status: "active"
    },
    {
        title: "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
        programType: "Skill Development",
        category: "Vocational Training",
        targetGroup: ["Unemployed Youth", "Rural Population"],
        description: "The flagship scheme of the Ministry of Skill Development & Entrepreneurship (MSDE) implemented by National Skill Development Corporation (NSDC).",
        eligibility: {
            ageLimit: { min: 18, max: 45 },
            educationalQualification: "No minimum education requirement",
            domicile: "Indian Citizen"
        },
        benefits: {
            financialAssistance: {
                amount: 8000,
                frequency: "One-time",
                paymentMode: "Direct Bank Transfer"
            },
            nonFinancialBenefits: [
                "Free skill training",
                "Industry-relevant certification",
                "Job placement support",
                "Post-training support"
            ],
            certificationProvided: true,
            jobAssistance: true
        },
        applicationProcess: {
            onlineSteps: [
                "Visit PMKVY official website",
                "Find training center near you",
                "Register for desired course",
                "Attend counseling session",
                "Start training program"
            ],
            applicationUrl: "https://www.pmkvyofficial.org"
        },
        programDetails: {
            duration: "150-300 hours",
            mode: "Offline",
            curriculum: [
                "Sector-specific technical skills",
                "Soft skills",
                "Basic computer literacy",
                "Entrepreneurship awareness"
            ]
        },
        implementingAgency: {
            name: "National Skill Development Corporation",
            website: "https://nsdcindia.org"
        },
        statistics: {
            totalSeats: 1000000,
            successRate: 75,
            placementRate: 60
        },
        status: "active"
    }
];

async function initializeEducationalPrograms() {
    try {
        await EducationalProgram.deleteMany({});
        await EducationalProgram.insertMany(educationalProgramsData);
        console.log('Educational programs data initialized successfully');
    } catch (error) {
        console.error('Error initializing educational programs data:', error);
    }
}

module.exports = { initializeEducationalPrograms, educationalProgramsData };
