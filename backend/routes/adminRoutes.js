
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Import all models for admin management
const farmer_Schemes_Model = require('../models/farmer_Schemes_Model');
const women_Wel_Model = require('../models/women_Welf_Model');
const higher_Education = require('../models/higher_Education_Model');
const secondary_Education = require('../models/secondary_Education');
const primary_Education = require('../models/primary_Education');
const competitiveExam_Model = require('../models/competitiveExam_Model');
const educationalProgram_Model = require('../models/educationalProgram_Model');
const stateWelfare_Model = require('../models/stateWelfare_Model');
const User = require('../models/user_Model');

// Admin notification schema
const adminNotificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['scheme_update', 'new_scheme', 'system_update', 'maintenance'], default: 'system_update' },
    targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isGlobal: { type: Boolean, default: false },
    isRead: [{ userId: mongoose.Schema.Types.ObjectId, readAt: Date }],
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    scheduledFor: { type: Date },
    createdBy: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true }
});

const AdminNotification = mongoose.model('AdminNotification', adminNotificationSchema);

// System statistics schema
const systemStatsSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    totalSchemes: { type: Number, default: 0 },
    newSchemes: { type: Number, default: 0 },
    totalApplications: { type: Number, default: 0 },
    totalFeedbacks: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    popularSchemes: [{ schemeId: String, schemeType: String, views: Number }],
    updatedAt: { type: Date, default: Date.now }
});

const SystemStats = mongoose.model('SystemStats', systemStatsSchema);

// Get admin dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
    try {
        // Get user statistics
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ 
            lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } 
        });

        // Get scheme counts from different collections
        const farmerSchemes = await farmer_Schemes_Model.countDocuments();
        const womenSchemes = await women_Wel_Model.countDocuments();
        const higherEduSchemes = await higher_Education.countDocuments();
        const secondaryEduSchemes = await secondary_Education.countDocuments();
        const primaryEduSchemes = await primary_Education.countDocuments();
        const competitiveExams = await competitiveExam_Model.countDocuments();
        const educationalPrograms = await educationalProgram_Model.countDocuments();
        const stateWelfareSchemes = await stateWelfare_Model.countDocuments();

        const totalSchemes = farmerSchemes + womenSchemes + higherEduSchemes + 
                           secondaryEduSchemes + primaryEduSchemes + competitiveExams + 
                           educationalPrograms + stateWelfareSchemes;

        // Recent activity (last 7 days)
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        // Pending notifications
        const pendingNotifications = await AdminNotification.countDocuments({
            isActive: true,
            scheduledFor: { $lte: new Date() }
        });

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                newThisWeek: recentUsers
            },
            schemes: {
                total: totalSchemes,
                byCategory: {
                    farmer: farmerSchemes,
                    women: womenSchemes,
                    higherEducation: higherEduSchemes,
                    secondaryEducation: secondaryEduSchemes,
                    primaryEducation: primaryEduSchemes,
                    competitiveExams: competitiveExams,
                    educationalPrograms: educationalPrograms,
                    stateWelfare: stateWelfareSchemes
                }
            },
            notifications: {
                pending: pendingNotifications
            },
            lastUpdated: new Date()
        };

        res.json({ success: true, stats });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin statistics' });
    }
});

// Add new scheme with notification
router.post('/scheme/add', async (req, res) => {
    try {
        const { schemeType, schemeData, notifyUsers = true } = req.body;

        if (!schemeType || !schemeData) {
            return res.status(400).json({ 
                success: false, 
                message: 'Scheme type and data are required' 
            });
        }

        let newScheme;
        let modelName;

        // Add scheme to appropriate collection
        switch (schemeType) {
            case 'farmer_welfare':
                newScheme = new farmer_Schemes_Model({ ...schemeData, isNew: true });
                modelName = 'Farmer Welfare';
                break;
            case 'women_welfare':
                newScheme = new women_Wel_Model({ ...schemeData, isNew: true });
                modelName = 'Women Welfare';
                break;
            case 'higher_education':
                newScheme = new higher_Education({ ...schemeData, isNew: true });
                modelName = 'Higher Education';
                break;
            case 'secondary_education':
                newScheme = new secondary_Education({ ...schemeData, isNew: true });
                modelName = 'Secondary Education';
                break;
            case 'competitive_exam':
                newScheme = new competitiveExam_Model({ ...schemeData, isNew: true });
                modelName = 'Competitive Exam';
                break;
            case 'educational_program':
                newScheme = new educationalProgram_Model({ ...schemeData, isNew: true });
                modelName = 'Educational Program';
                break;
            case 'state_welfare':
                newScheme = new stateWelfare_Model({ ...schemeData, isNew: true });
                modelName = 'State Welfare';
                break;
            default:
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid scheme type' 
                });
        }

        await newScheme.save();

        // Create notification for new scheme
        if (notifyUsers) {
            const notification = new AdminNotification({
                title: `New ${modelName} Scheme Added`,
                message: `A new scheme "${schemeData.title}" has been added to ${modelName} category. Check it out now!`,
                type: 'new_scheme',
                isGlobal: true,
                priority: 'medium'
            });
            await notification.save();
        }

        res.json({ 
            success: true, 
            message: 'Scheme added successfully',
            schemeId: newScheme._id 
        });
    } catch (error) {
        console.error('Add scheme error:', error);
        res.status(500).json({ success: false, message: 'Failed to add scheme' });
    }
});

// Update existing scheme
router.put('/scheme/update/:schemeType/:schemeId', async (req, res) => {
    try {
        const { schemeType, schemeId } = req.params;
        const { updateData, notifyUsers = false } = req.body;

        if (!mongoose.Types.ObjectId.isValid(schemeId)) {
            return res.status(400).json({ success: false, message: 'Invalid scheme ID' });
        }

        let updatedScheme;
        let modelName;

        // Update scheme in appropriate collection
        switch (schemeType) {
            case 'farmer_welfare':
                updatedScheme = await farmer_Schemes_Model.findByIdAndUpdate(
                    schemeId, 
                    { ...updateData, updatedAt: new Date() }, 
                    { new: true }
                );
                modelName = 'Farmer Welfare';
                break;
            case 'women_welfare':
                updatedScheme = await women_Wel_Model.findByIdAndUpdate(
                    schemeId, 
                    { ...updateData, updatedAt: new Date() }, 
                    { new: true }
                );
                modelName = 'Women Welfare';
                break;
            case 'higher_education':
                updatedScheme = await higher_Education.findByIdAndUpdate(
                    schemeId, 
                    { ...updateData, updatedAt: new Date() }, 
                    { new: true }
                );
                modelName = 'Higher Education';
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid scheme type' });
        }

        if (!updatedScheme) {
            return res.status(404).json({ success: false, message: 'Scheme not found' });
        }

        // Create notification for scheme update
        if (notifyUsers) {
            const notification = new AdminNotification({
                title: `${modelName} Scheme Updated`,
                message: `The scheme "${updatedScheme.title}" has been updated with new information.`,
                type: 'scheme_update',
                isGlobal: true,
                priority: 'low'
            });
            await notification.save();
        }

        res.json({ 
            success: true, 
            message: 'Scheme updated successfully',
            scheme: updatedScheme 
        });
    } catch (error) {
        console.error('Update scheme error:', error);
        res.status(500).json({ success: false, message: 'Failed to update scheme' });
    }
});

// Create global notification
router.post('/notification/create', async (req, res) => {
    try {
        const { 
            title, 
            message, 
            type = 'system_update', 
            priority = 'medium',
            isGlobal = true,
            targetUsers = [],
            scheduledFor,
            expiresAt 
        } = req.body;

        if (!title || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and message are required' 
            });
        }

        const notification = new AdminNotification({
            title,
            message,
            type,
            priority,
            isGlobal,
            targetUsers: isGlobal ? [] : targetUsers,
            scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
            expiresAt: expiresAt ? new Date(expiresAt) : undefined
        });

        await notification.save();

        res.json({ 
            success: true, 
            message: 'Notification created successfully',
            notificationId: notification._id 
        });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ success: false, message: 'Failed to create notification' });
    }
});

// Get all notifications (admin view)
router.get('/notifications', async (req, res) => {
    try {
        const { page = 1, limit = 20, type, status } = req.query;

        const filter = {};
        if (type) filter.type = type;
        if (status === 'active') filter.isActive = true;
        if (status === 'expired') filter.expiresAt = { $lt: new Date() };

        const notifications = await AdminNotification.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AdminNotification.countDocuments(filter);

        res.json({
            success: true,
            notifications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalNotifications: total
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
});

// Delete notification
router.delete('/notification/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ success: false, message: 'Invalid notification ID' });
        }

        await AdminNotification.findByIdAndDelete(notificationId);

        res.json({ 
            success: true, 
            message: 'Notification deleted successfully' 
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete notification' });
    }
});

// Get active notifications for users
router.get('/notifications/active', async (req, res) => {
    try {
        const { userId } = req.query;

        const filter = {
            isActive: true,
            scheduledFor: { $lte: new Date() },
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: { $gt: new Date() } }
            ]
        };

        if (userId) {
            filter.$or = [
                { isGlobal: true },
                { targetUsers: userId }
            ];
        } else {
            filter.isGlobal = true;
        }

        const notifications = await AdminNotification.find(filter)
            .sort({ priority: -1, createdAt: -1 })
            .limit(10);

        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Get active notifications error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch active notifications' });
    }
});

// Mark notification as read by user
router.post('/notification/:notificationId/read', async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return res.status(400).json({ success: false, message: 'Invalid notification ID' });
        }

        await AdminNotification.findByIdAndUpdate(notificationId, {
            $addToSet: {
                isRead: { userId, readAt: new Date() }
            }
        });

        res.json({ 
            success: true, 
            message: 'Notification marked as read' 
        });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ success: false, message: 'Failed to mark notification as read' });
    }
});

// Get real-time updates for dashboard
router.get('/realtime/updates', async (req, res) => {
    try {
        const { lastCheck } = req.query;
        const checkTime = lastCheck ? new Date(lastCheck) : new Date(Date.now() - 60000); // Default: last 1 minute

        // Get new notifications since last check
        const newNotifications = await AdminNotification.countDocuments({
            createdAt: { $gt: checkTime },
            isActive: true
        });

        // Get new users since last check
        const newUsers = await User.countDocuments({
            createdAt: { $gt: checkTime }
        });

        // Check for scheme updates
        const hasSchemeUpdates = await Promise.all([
            farmer_Schemes_Model.findOne({ updatedAt: { $gt: checkTime } }),
            women_Wel_Model.findOne({ updatedAt: { $gt: checkTime } }),
            higher_Education.findOne({ updatedAt: { $gt: checkTime } })
        ]);

        const hasUpdates = newNotifications > 0 || newUsers > 0 || hasSchemeUpdates.some(update => update !== null);

        res.json({
            success: true,
            hasUpdates,
            updates: {
                newNotifications,
                newUsers,
                hasSchemeUpdates: hasSchemeUpdates.some(update => update !== null),
                lastChecked: new Date()
            }
        });
    } catch (error) {
        console.error('Real-time updates error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch real-time updates' });
    }
});

// System maintenance mode
router.post('/system/maintenance', async (req, res) => {
    try {
        const { isEnabled, message = 'System under maintenance. Please check back later.' } = req.body;

        if (isEnabled) {
            const notification = new AdminNotification({
                title: 'System Maintenance',
                message,
                type: 'maintenance',
                isGlobal: true,
                priority: 'critical'
            });
            await notification.save();
        }

        // In a real application, you might store this in a configuration collection
        // For now, we'll just send the response
        res.json({ 
            success: true, 
            message: `Maintenance mode ${isEnabled ? 'enabled' : 'disabled'}` 
        });
    } catch (error) {
        console.error('Maintenance mode error:', error);
        res.status(500).json({ success: false, message: 'Failed to update maintenance mode' });
    }
});

module.exports = router;
