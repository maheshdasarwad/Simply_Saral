
const axios = require('axios');

class ChatbotService {
    constructor() {
        this.openaiApiKey = process.env.OPENAI_API_KEY;
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        
        // Scheme keywords for matching
        this.schemeKeywords = {
            'farmer': ['farmer', 'agriculture', 'kisan', 'crop', 'farming'],
            'women': ['women', 'beti', 'female', 'mahila', 'girl'],
            'education': ['education', 'scholarship', 'student', 'study', 'school', 'college'],
            'health': ['health', 'medical', 'ayushman', 'insurance'],
            'employment': ['job', 'employment', 'skill', 'training', 'rozgar']
        };
    }

    async processQuery(userQuery, context = {}) {
        try {
            // First try keyword matching for quick responses
            const keywordMatch = this.findSchemeByKeywords(userQuery);
            
            if (keywordMatch) {
                return {
                    success: true,
                    response: keywordMatch.response,
                    schemes: keywordMatch.schemes,
                    source: 'keyword_match'
                };
            }

            // If no keyword match, try AI services
            if (this.openaiApiKey) {
                return await this.queryOpenAI(userQuery, context);
            } else if (this.geminiApiKey) {
                return await this.queryGemini(userQuery, context);
            } else {
                return this.getFallbackResponse(userQuery);
            }

        } catch (error) {
            console.error('Chatbot service error:', error);
            return this.getFallbackResponse(userQuery);
        }
    }

    findSchemeByKeywords(query) {
        const queryLower = query.toLowerCase();
        
        // Check for eligibility queries
        if (queryLower.includes('eligible') || queryLower.includes('eligibility')) {
            if (queryLower.includes('pmay') || queryLower.includes('housing')) {
                return {
                    response: "For PM Awas Yojana eligibility: You must be a first-time homebuyer, belong to EWS/LIG/MIG category, and meet income criteria. Family income should be below ₹18 lakh annually.",
                    schemes: ['PM Awas Yojana']
                };
            }
            
            if (queryLower.includes('scholarship')) {
                return {
                    response: "Scholarship eligibility varies by category. For Post Matric Scholarships: Must belong to SC/ST/OBC category, family income below ₹2.5 lakh, and have passed 10th standard.",
                    schemes: ['Post Matric Scholarship']
                };
            }
        }

        // Check for category-based queries
        if (queryLower.includes('obc') && queryLower.includes('scholarship')) {
            return {
                response: "OBC students can apply for: 1) Post Matric Scholarship (income limit ₹1 lakh), 2) National Means-cum-Merit Scholarship, 3) Central Sector Scholarship. Visit our education schemes section for detailed information.",
                schemes: ['Post Matric Scholarship', 'National Means-cum-Merit Scholarship']
            };
        }

        // Check for scheme categories
        for (const [category, keywords] of Object.entries(this.schemeKeywords)) {
            if (keywords.some(keyword => queryLower.includes(keyword))) {
                return this.getCategoryResponse(category);
            }
        }

        return null;
    }

    getCategoryResponse(category) {
        const responses = {
            'farmer': {
                response: "Popular farmer schemes: 1) PM-Kisan Samman Nidhi (₹6,000/year), 2) PM Fasal Bima Yojana (crop insurance), 3) Kisan Credit Card (subsidized loans). Visit farmer welfare section for complete details.",
                schemes: ['PM-Kisan Samman Nidhi', 'PM Fasal Bima Yojana', 'Kisan Credit Card']
            },
            'women': {
                response: "Women welfare schemes: 1) Beti Bachao Beti Padhao (girl child welfare), 2) Swadhar Greh (shelter for women), 3) Ladli Behna Yojana (financial assistance). Check women welfare section for eligibility.",
                schemes: ['Beti Bachao Beti Padhao', 'Swadhar Greh', 'Ladli Behna Yojana']
            },
            'education': {
                response: "Education schemes available: 1) Post Matric Scholarships, 2) National Means-cum-Merit Scholarship, 3) Higher Education schemes. Filter by your category and state for relevant options.",
                schemes: ['Post Matric Scholarship', 'National Means-cum-Merit Scholarship']
            },
            'health': {
                response: "Health schemes: 1) Ayushman Bharat (₹5 lakh health coverage), 2) PMJAY (free treatment), 3) State health insurance schemes. Check eligibility based on your income.",
                schemes: ['Ayushman Bharat', 'PMJAY']
            },
            'employment': {
                response: "Employment schemes: 1) PMKVY (skill training with ₹8,000 reward), 2) MNREGA (100 days guaranteed work), 3) Startup India (funding support). Explore based on your skillset.",
                schemes: ['PMKVY', 'MNREGA', 'Startup India']
            }
        };

        return responses[category] || null;
    }

    async queryOpenAI(userQuery, context) {
        try {
            const prompt = `You are a helpful assistant for Indian government schemes. Answer this query about government schemes: "${userQuery}". 
            
            Provide specific, accurate information about eligibility, benefits, and application process. 
            If you don't have specific information, guide them to relevant scheme categories.
            Keep responses concise and actionable.`;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a knowledgeable assistant about Indian government schemes and programs.' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 200,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return {
                success: true,
                response: response.data.choices[0].message.content,
                source: 'openai'
            };
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw error;
        }
    }

    async queryGemini(userQuery, context) {
        try {
            const prompt = `Answer this query about Indian government schemes: "${userQuery}". 
            Provide specific information about eligibility, benefits, and application process in 150 words or less.`;

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            });

            return {
                success: true,
                response: response.data.candidates[0].content.parts[0].text,
                source: 'gemini'
            };
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }

    getFallbackResponse(query) {
        return {
            success: true,
            response: "I can help you find information about government schemes. Try asking about specific categories like 'farmer schemes', 'education scholarships', 'women welfare', or check eligibility for specific schemes like PM-Kisan or Ayushman Bharat. You can also browse our scheme categories for detailed information.",
            source: 'fallback',
            suggestions: [
                "Show me farmer schemes",
                "Am I eligible for scholarships?",
                "Women welfare programs",
                "Education schemes for students"
            ]
        };
    }

    // Method to get scheme suggestions based on user profile
    getSchemeSuggestions(userProfile) {
        const suggestions = [];
        
        if (userProfile.category === 'SC' || userProfile.category === 'ST') {
            suggestions.push('Post Matric Scholarship for SC/ST');
        }
        
        if (userProfile.occupation === 'farmer') {
            suggestions.push('PM-Kisan Samman Nidhi', 'PM Fasal Bima Yojana');
        }
        
        if (userProfile.income < 500000) {
            suggestions.push('Ayushman Bharat', 'PMAY');
        }
        
        return suggestions;
    }
}

module.exports = ChatbotService;
