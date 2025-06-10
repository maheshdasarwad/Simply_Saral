
const fs = require('fs');
const path = require('path');

class I18nService {
    constructor() {
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'hi', 'mr'];
        this.translations = {};
        this.loadTranslations();
    }

    loadTranslations() {
        // English translations (base)
        this.translations.en = {
            // Navigation
            nav: {
                home: 'Home',
                schemes: 'Schemes',
                about: 'About',
                contact: 'Contact',
                login: 'Login',
                signup: 'Sign Up',
                dashboard: 'Dashboard'
            },
            // Home page
            home: {
                title: 'Simply Saral - Government Schemes Made Simple',
                subtitle: 'Discover and apply for government schemes easily',
                searchPlaceholder: 'Search for schemes...',
                categories: 'Categories',
                popularSchemes: 'Popular Schemes',
                newSchemes: 'New Schemes'
            },
            // Schemes
            schemes: {
                farmerWelfare: 'Farmer Welfare',
                womenWelfare: 'Women Welfare',
                education: 'Education',
                health: 'Health',
                employment: 'Employment',
                eligibility: 'Eligibility',
                benefits: 'Benefits',
                apply: 'Apply Now',
                viewDetails: 'View Details',
                applicationProcess: 'Application Process'
            },
            // Filters
            filters: {
                category: 'Category',
                state: 'State',
                targetGroup: 'Target Group',
                allCategories: 'All Categories',
                allStates: 'All States'
            },
            // User dashboard
            dashboard: {
                myApplications: 'My Applications',
                bookmarkedSchemes: 'Bookmarked Schemes',
                notifications: 'Notifications',
                profile: 'Profile',
                appliedSchemes: 'Applied Schemes',
                pendingApplications: 'Pending Applications'
            },
            // Common terms
            common: {
                submit: 'Submit',
                cancel: 'Cancel',
                save: 'Save',
                edit: 'Edit',
                delete: 'Delete',
                loading: 'Loading...',
                error: 'Error occurred',
                success: 'Success',
                required: 'Required field'
            }
        };

        // Hindi translations
        this.translations.hi = {
            nav: {
                home: 'मुख्य पृष्ठ',
                schemes: 'योजनाएं',
                about: 'हमारे बारे में',
                contact: 'संपर्क',
                login: 'लॉगिन',
                signup: 'साइन अप',
                dashboard: 'डैशबोर्ड'
            },
            home: {
                title: 'सिंप्ली सरल - सरकारी योजनाएं आसान बनाई गईं',
                subtitle: 'सरकारी योजनाओं को आसानी से खोजें और आवेदन करें',
                searchPlaceholder: 'योजनाओं के लिए खोजें...',
                categories: 'श्रेणियां',
                popularSchemes: 'लोकप्रिय योजनाएं',
                newSchemes: 'नई योजनाएं'
            },
            schemes: {
                farmerWelfare: 'किसान कल्याण',
                womenWelfare: 'महिला कल्याण',
                education: 'शिक्षा',
                health: 'स्वास्थ्य',
                employment: 'रोजगार',
                eligibility: 'पात्रता',
                benefits: 'लाभ',
                apply: 'अभी आवेदन करें',
                viewDetails: 'विवरण देखें',
                applicationProcess: 'आवेदन प्रक्रिया'
            },
            filters: {
                category: 'श्रेणी',
                state: 'राज्य',
                targetGroup: 'लक्षित समूह',
                allCategories: 'सभी श्रेणियां',
                allStates: 'सभी राज्य'
            },
            dashboard: {
                myApplications: 'मेरे आवेदन',
                bookmarkedSchemes: 'बुकमार्क की गई योजनाएं',
                notifications: 'सूचनाएं',
                profile: 'प्रोफ़ाइल',
                appliedSchemes: 'आवेदित योजनाएं',
                pendingApplications: 'लंबित आवेदन'
            },
            common: {
                submit: 'जमा करें',
                cancel: 'रद्द करें',
                save: 'सहेजें',
                edit: 'संपादित करें',
                delete: 'हटाएं',
                loading: 'लोड हो रहा है...',
                error: 'त्रुटि हुई',
                success: 'सफलता',
                required: 'आवश्यक फ़ील्ड'
            }
        };

        // Marathi translations
        this.translations.mr = {
            nav: {
                home: 'मुख्य पान',
                schemes: 'योजना',
                about: 'आमच्याबद्दल',
                contact: 'संपर्क',
                login: 'लॉगिन',
                signup: 'साइन अप',
                dashboard: 'डॅशबोर्ड'
            },
            home: {
                title: 'सिंप्ली सरल - सरकारी योजना सोप्या केल्या',
                subtitle: 'सरकारी योजना सहज शोधा आणि अर्ज करा',
                searchPlaceholder: 'योजनांसाठी शोधा...',
                categories: 'प्रकार',
                popularSchemes: 'लोकप्रिय योजना',
                newSchemes: 'नवीन योजना'
            },
            schemes: {
                farmerWelfare: 'शेतकरी कल्याण',
                womenWelfare: 'महिला कल्याण',
                education: 'शिक्षण',
                health: 'आरोग्य',
                employment: 'रोजगार',
                eligibility: 'पात्रता',
                benefits: 'फायदे',
                apply: 'आता अर्ज करा',
                viewDetails: 'तपशील पहा',
                applicationProcess: 'अर्ज प्रक्रिया'
            },
            filters: {
                category: 'प्रकार',
                state: 'राज्य',
                targetGroup: 'लक्ष्यित गट',
                allCategories: 'सर्व प्रकार',
                allStates: 'सर्व राज्ये'
            },
            dashboard: {
                myApplications: 'माझे अर्ज',
                bookmarkedSchemes: 'बुकमार्क केलेल्या योजना',
                notifications: 'सूचना',
                profile: 'प्रोफाइल',
                appliedSchemes: 'अर्ज केलेल्या योजना',
                pendingApplications: 'प्रलंबित अर्ज'
            },
            common: {
                submit: 'सबमिट करा',
                cancel: 'रद्द करा',
                save: 'जतन करा',
                edit: 'संपादित करा',
                delete: 'हटवा',
                loading: 'लोड होत आहे...',
                error: 'त्रुटी झाली',
                success: 'यशस्वी',
                required: 'आवश्यक फील्ड'
            }
        };
    }

    setLanguage(language) {
        if (this.supportedLanguages.includes(language)) {
            this.currentLanguage = language;
            return true;
        }
        return false;
    }

    translate(key, language = null) {
        const lang = language || this.currentLanguage;
        const keys = key.split('.');
        let translation = this.translations[lang];

        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English if translation not found
                translation = this.translations.en;
                for (const fallbackKey of keys) {
                    if (translation && translation[fallbackKey]) {
                        translation = translation[fallbackKey];
                    } else {
                        return key; // Return key if no translation found
                    }
                }
                break;
            }
        }

        return translation || key;
    }

    // Middleware function for Express
    middleware() {
        return (req, res, next) => {
            // Set language from query parameter, header, or session
            const language = req.query.lang || 
                           req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 
                           req.session?.language || 
                           'en';

            this.setLanguage(language);
            
            // Add translation function to res.locals for use in templates
            res.locals.t = (key) => this.translate(key);
            res.locals.currentLanguage = this.currentLanguage;
            res.locals.supportedLanguages = this.supportedLanguages;
            
            next();
        };
    }

    // Get all translations for frontend
    getAllTranslations(language = null) {
        const lang = language || this.currentLanguage;
        return this.translations[lang] || this.translations.en;
    }

    // Add new translations dynamically
    addTranslation(language, key, value) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }
        
        const keys = key.split('.');
        let current = this.translations[language];
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    }
}

module.exports = I18nService;
