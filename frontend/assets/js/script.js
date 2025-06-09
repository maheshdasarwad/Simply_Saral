
document.addEventListener('DOMContentLoaded', function() {
    // Safely handle interactive elements
    const interactiveElements = document.querySelectorAll('.interactive-element, .btn, .card, .scheme-card');
    
    if (interactiveElements && interactiveElements.length > 0) {
        interactiveElements.forEach(element => {
            if (element) {
                element.addEventListener('click', function(e) {
                    // Handle click events safely
                    console.log('Element clicked:', element);
                });
            }
        });
    }

    // Handle form submissions safely
    const forms = document.querySelectorAll('form');
    if (forms && forms.length > 0) {
        forms.forEach(form => {
            if (form) {
                form.addEventListener('submit', function(e) {
                    // Add form validation or AJAX handling here
                    console.log('Form submitted:', form);
                });
            }
        });
    }

    // Handle navigation links
    const navLinks = document.querySelectorAll('a[href^="/schemes"]');
    if (navLinks && navLinks.length > 0) {
        navLinks.forEach(link => {
            if (link) {
                link.addEventListener('click', function(e) {
                    // Smooth navigation or loading indicators
                    console.log('Navigation to:', link.href);
                });
            }
        });
    }

    // Check for any missing elements and log warnings
    const requiredElements = ['#main-content', '.header', '.navigation'];
    requiredElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Warning: Element ${selector} not found on page`);
        }
    });
});

// Global error handler for uncaught errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error caught:', e.error);
    // Prevent the error from breaking the page
    e.preventDefault();
});

// Handle AJAX errors if using fetch
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});
