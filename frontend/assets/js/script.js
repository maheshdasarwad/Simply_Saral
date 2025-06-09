
<old_str>document.addEventListener('DOMContentLoaded', function() {
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
});</old_str>
<new_str>document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing page functionality');
    
    // Handle scheme category buttons
    const schemeButtons = document.querySelectorAll('.scheme-btn, .btn[href*="/schemes/"]');
    if (schemeButtons && schemeButtons.length > 0) {
        schemeButtons.forEach(button => {
            if (button && button.href) {
                button.addEventListener('click', function(e) {
                    // Add loading state
                    button.style.opacity = '0.7';
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    console.log('Navigating to scheme:', button.href);
                });
            }
        });
    }

    // Handle explore buttons
    const exploreButtons = document.querySelectorAll('.explore-btn, .btn-primary[href*="/schemes/"]');
    if (exploreButtons && exploreButtons.length > 0) {
        exploreButtons.forEach(button => {
            if (button && button.href) {
                button.addEventListener('click', function(e) {
                    console.log('Exploring scheme:', button.href);
                    // Add visual feedback
                    button.innerHTML = '<i class="fas fa-arrow-right"></i> Exploring...';
                });
            }
        });
    }

    // Handle scheme cards
    const schemeCards = document.querySelectorAll('.scheme-card, .card[data-scheme]');
    if (schemeCards && schemeCards.length > 0) {
        schemeCards.forEach(card => {
            if (card) {
                card.addEventListener('click', function(e) {
                    const link = card.querySelector('a') || card.dataset.href;
                    if (link) {
                        window.location.href = typeof link === 'string' ? link : link.href;
                    }
                });
            }
        });
    }

    // Handle navigation menu items
    const navItems = document.querySelectorAll('.nav-link, .navbar-nav a');
    if (navItems && navItems.length > 0) {
        navItems.forEach(item => {
            if (item && item.href) {
                item.addEventListener('click', function(e) {
                    // Remove active class from all nav items
                    navItems.forEach(nav => nav.classList.remove('active'));
                    // Add active class to clicked item
                    item.classList.add('active');
                });
            }
        });
    }

    // Handle mobile menu toggle
    const mobileToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (mobileToggle && navbarCollapse) {
        mobileToggle.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Handle search functionality if present
    const searchInput = document.querySelector('input[type="search"], .search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.scheme-card, .card');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});</new_str>
