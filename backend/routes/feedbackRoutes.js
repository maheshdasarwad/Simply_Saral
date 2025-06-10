
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schemeId: { type: String, required: true },
    schemeType: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    isAnonymous: { type: Boolean, default: false },
    isHelpful: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'hidden', 'flagged'], default: 'active' }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Submit feedback
router.post('/submit', async (req, res) => {
    try {
        const { userId, schemeId, schemeType, rating, comment, isAnonymous } = req.body;

        // Validate required fields
        if (!userId || !schemeId || !schemeType || !rating) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: userId, schemeId, schemeType, rating' 
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5' 
            });
        }

        // Check if user already provided feedback for this scheme
        const existingFeedback = await Feedback.findOne({ userId, schemeId, schemeType });
        if (existingFeedback) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already provided feedback for this scheme' 
            });
        }

        // Create new feedback
        const feedback = new Feedback({
            userId,
            schemeId,
            schemeType,
            rating: parseInt(rating),
            comment: comment || '',
            isAnonymous: isAnonymous || false
        });

        await feedback.save();

        res.json({ 
            success: true, 
            message: 'Feedback submitted successfully',
            feedbackId: feedback._id 
        });
    } catch (error) {
        console.error('Feedback submission error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit feedback' 
        });
    }
});

// Get feedback for a scheme
router.get('/scheme/:schemeId/:schemeType', async (req, res) => {
    try {
        const { schemeId, schemeType } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const feedbacks = await Feedback.find({ 
            schemeId, 
            schemeType, 
            status: 'active' 
        })
        .populate('userId', 'username email', null, { strictPopulate: false })
        .sort({ timestamp: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        // Calculate rating statistics
        const ratingStats = await Feedback.aggregate([
            { $match: { schemeId, schemeType, status: 'active' } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    ratingDistribution: {
                        $push: '$rating'
                    }
                }
            }
        ]);

        // Calculate rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        if (ratingStats.length > 0) {
            ratingStats[0].ratingDistribution.forEach(rating => {
                distribution[rating]++;
            });
        }

        // Format feedback data
        const formattedFeedbacks = feedbacks.map(feedback => ({
            _id: feedback._id,
            rating: feedback.rating,
            comment: feedback.comment,
            timestamp: feedback.timestamp,
            isAnonymous: feedback.isAnonymous,
            user: feedback.isAnonymous ? null : {
                username: feedback.userId?.username || 'User',
                email: feedback.userId?.email
            }
        }));

        res.json({
            success: true,
            feedbacks: formattedFeedbacks,
            statistics: {
                averageRating: ratingStats.length > 0 ? ratingStats[0].averageRating : 0,
                totalReviews: ratingStats.length > 0 ? ratingStats[0].totalReviews : 0,
                distribution
            },
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil((ratingStats.length > 0 ? ratingStats[0].totalReviews : 0) / limit),
                hasNext: page * limit < (ratingStats.length > 0 ? ratingStats[0].totalReviews : 0)
            }
        });
    } catch (error) {
        console.error('Feedback fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch feedback' 
        });
    }
});

// Get user's feedback history
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid user ID' });
        }

        const feedbacks = await Feedback.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

        const total = await Feedback.countDocuments({ userId });

        res.json({
            success: true,
            feedbacks,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalFeedbacks: total
            }
        });
    } catch (error) {
        console.error('User feedback fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user feedback' 
        });
    }
});

// Update feedback
router.put('/update/:feedbackId', async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { rating, comment, userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
            return res.status(400).json({ success: false, message: 'Invalid feedback ID' });
        }

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        // Check if the user owns this feedback
        if (feedback.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this feedback' });
        }

        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { 
                rating: rating || feedback.rating,
                comment: comment !== undefined ? comment : feedback.comment
            },
            { new: true }
        );

        res.json({ 
            success: true, 
            message: 'Feedback updated successfully',
            feedback: updatedFeedback 
        });
    } catch (error) {
        console.error('Feedback update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update feedback' 
        });
    }
});

// Delete feedback
router.delete('/delete/:feedbackId', async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
            return res.status(400).json({ success: false, message: 'Invalid feedback ID' });
        }

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        // Check if the user owns this feedback
        if (feedback.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this feedback' });
        }

        await Feedback.findByIdAndDelete(feedbackId);

        res.json({ 
            success: true, 
            message: 'Feedback deleted successfully' 
        });
    } catch (error) {
        console.error('Feedback deletion error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete feedback' 
        });
    }
});

// Mark feedback as helpful
router.post('/helpful/:feedbackId', async (req, res) => {
    try {
        const { feedbackId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
            return res.status(400).json({ success: false, message: 'Invalid feedback ID' });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { isHelpful: true },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        res.json({ 
            success: true, 
            message: 'Marked as helpful' 
        });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to mark as helpful' 
        });
    }
});

// Get top rated schemes
router.get('/top-rated', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const topSchemes = await Feedback.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: { schemeId: '$schemeId', schemeType: '$schemeType' },
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            },
            { $match: { totalReviews: { $gte: 3 } } }, // At least 3 reviews
            { $sort: { averageRating: -1, totalReviews: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.json({
            success: true,
            topSchemes
        });
    } catch (error) {
        console.error('Top rated schemes error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch top rated schemes' 
        });
    }
});

// Admin: Flag inappropriate feedback
router.post('/flag/:feedbackId', async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const { reason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
            return res.status(400).json({ success: false, message: 'Invalid feedback ID' });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            { 
                status: 'flagged',
                flagReason: reason || 'Inappropriate content'
            },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }

        res.json({ 
            success: true, 
            message: 'Feedback flagged successfully' 
        });
    } catch (error) {
        console.error('Flag feedback error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to flag feedback' 
        });
    }
});

module.exports = router;
