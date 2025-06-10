
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user_Model');

// Get user profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findByIdAndUpdate(
            userId, 
            { $set: updateData }, 
            { new: true, select: '-password' }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
});

// Get scheme suggestions based on user profile
router.get('/suggestions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const suggestions = await generateSchemeSuggestions(user);
        res.json({ success: true, suggestions });
    } catch (error) {
        console.error('Suggestions error:', error);
        res.status(500).json({ success: false, message: 'Failed to get suggestions' });
    }
});

// Auto-suggest schemes based on partial profile data
router.post('/auto-suggest', async (req, res) => {
    try {
        const { age, category, income, occupation, state, education } = req.body;
        
        const profileData = {
            age: parseInt(age) || 0,
            category: category || '',
            income: parseInt(income) || 0,
            occupation: occupation || '',
            state: state || '',
            education: education || ''
        };

        const suggestions = await generateAutoSuggestions(profileData);
        res.json({ success: true, suggestions });
    } catch (error) {
        console.error('Auto-suggest error:', error);
        res.status(500).json({ success: false, message: 'Failed to generate suggestions' });
    }
});

// Track scheme visit
router.post('/track-visit', async (req, res) => {
    try {
        const { userId, schemeId, schemeType } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                visitedSchemes: {
                    schemeId,
                    schemeType,
                    visitedAt: new Date()
                }
            },
            $set: { lastLogin: new Date() }
        });

        res.json({ success: true, message: 'Visit tracked successfully' });
    } catch (error) {
        console.error('Track visit error:', error);
        res.status(500).json({ success: false, message: 'Failed to track visit' });
    }
});

// Track scheme application
router.post('/track-application', async (req, res) => {
    try {
        const { userId, schemeId, schemeType, applicationId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                appliedSchemes: {
                    schemeId,
                    schemeType,
                    applicationId,
                    appliedAt: new Date(),
                    status: 'submitted'
                }
            }
        });

        res.json({ success: true, message: 'Application tracked successfully' });
    } catch (error) {
        console.error('Track application error:', error);
        res.status(500).json({ success: false, message: 'Failed to track application' });
    }
});

// Get user activity summary
router.get('/activity/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('visitedSchemes appliedSchemes lastLogin');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const activity = {
            totalVisited: user.visitedSchemes?.length || 0,
            totalApplied: user.appliedSchemes?.length || 0,
            lastLogin: user.lastLogin,
            recentVisits: user.visitedSchemes?.slice(-5) || [],
            pendingApplications: user.appliedSchemes?.filter(app => app.status === 'submitted') || []
        };

        res.json({ success: true, activity });
    } catch (error) {
        console.error('Activity fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch activity' });
    }
});

// Helper function to generate scheme suggestions
async function generateSchemeSuggestions(user) {
    const suggestions = [];

    // Age-based suggestions
    if (user.age && user.age >= 18 && user.age <= 40) {
        suggestions.push({
            title: 'PM-Kisan Samman Nidhi',
            reason: 'Age eligible for farmer support scheme',
            category: 'Agriculture',
            priority: 'high'
        });
    }

    // Category-based suggestions
    if (user.category === 'SC' || user.category === 'ST') {
        suggestions.push({
            title: 'Post Matric Scholarship for SC/ST',
            reason: 'Category-specific educational support',
            category: 'Education',
            priority: 'high'
        });
    }

    if (user.category === 'OBC') {
        suggestions.push({
            title: 'OBC Scholarship Schemes',
            reason: 'OBC category educational benefits',
            category: 'Education',
            priority: 'medium'
        });
    }

    // Income-based suggestions
    if (user.income && user.income < 100000) {
        suggestions.push({
            title: 'Ayushman Bharat Yojana',
            reason: 'Low income eligible for health insurance',
            category: 'Health',
            priority: 'high'
        });
    }

    if (user.income && user.income < 300000) {
        suggestions.push({
            title: 'PM Awas Yojana',
            reason: 'Income eligible for housing scheme',
            category: 'Housing',
            priority: 'medium'
        });
    }

    // Occupation-based suggestions
    if (user.occupation === 'farmer' || user.occupation === 'agriculture') {
        suggestions.push(
            {
                title: 'PM Fasal Bima Yojana',
                reason: 'Crop insurance for farmers',
                category: 'Agriculture',
                priority: 'high'
            },
            {
                title: 'Kisan Credit Card',
                reason: 'Credit facility for farmers',
                category: 'Agriculture',
                priority: 'medium'
            }
        );
    }

    if (user.occupation === 'student') {
        suggestions.push({
            title: 'National Scholarship Portal',
            reason: 'Educational support for students',
            category: 'Education',
            priority: 'high'
        });
    }

    // Gender-based suggestions
    if (user.gender === 'female') {
        suggestions.push({
            title: 'Beti Bachao Beti Padhao',
            reason: 'Women empowerment scheme',
            category: 'Women Welfare',
            priority: 'medium'
        });
    }

    return suggestions.slice(0, 8); // Return top 8 suggestions
}

// Helper function for auto-suggestions based on partial data
async function generateAutoSuggestions(profileData) {
    const suggestions = [];

    // Education-based suggestions
    if (profileData.education === 'graduate' || profileData.education === 'postgraduate') {
        suggestions.push({
            title: 'Higher Education Scholarships',
            description: 'Financial assistance for higher education',
            eligibilityMatch: 90,
            category: 'Education'
        });
    }

    if (profileData.education === '10th' || profileData.education === '12th') {
        suggestions.push({
            title: 'Secondary Education Support',
            description: 'Scholarships and support for school students',
            eligibilityMatch: 85,
            category: 'Education'
        });
    }

    // State-specific suggestions
    if (profileData.state === 'Maharashtra') {
        suggestions.push({
            title: 'Ladki Bahin Yojana',
            description: 'Maharashtra state scheme for women',
            eligibilityMatch: 80,
            category: 'Women Welfare'
        });
    }

    // Income-based quick suggestions
    if (profileData.income < 200000) {
        suggestions.push(
            {
                title: 'BPL Category Schemes',
                description: 'Multiple schemes for below poverty line families',
                eligibilityMatch: 95,
                category: 'General'
            },
            {
                title: 'Free Ration Scheme',
                description: 'Food security under PMGKAY',
                eligibilityMatch: 90,
                category: 'Food Security'
            }
        );
    }

    // Age-specific suggestions
    if (profileData.age >= 60) {
        suggestions.push({
            title: 'Senior Citizen Schemes',
            description: 'Various benefits for senior citizens',
            eligibilityMatch: 85,
            category: 'Senior Citizen'
        });
    }

    if (profileData.age >= 18 && profileData.age <= 35) {
        suggestions.push({
            title: 'Skill Development Programs',
            description: 'PMKVY and other skill training schemes',
            eligibilityMatch: 80,
            category: 'Employment'
        });
    }

    return suggestions.sort((a, b) => b.eligibilityMatch - a.eligibilityMatch).slice(0, 6);
}

module.exports = router;
