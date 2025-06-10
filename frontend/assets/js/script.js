// Global navigation functions
window.navigateToScheme = function(category) {
    const categoryUrls = {
        'secondary': '/schemes/secondary_Education',
        'higher': '/schemes/higher_Education', 
        'farmer': '/schemes/farmer_Welfare',
        'women': '/schemes/women_Welfare',
        'primary': '/schemes/primary_Education',
        'competitive': '/competitive-exams',
        'educational': '/educational-programs',
        'state': '/state-welfare'
    };

    if (categoryUrls[category]) {
        window.location.href = categoryUrls[category];
    }
};

// Enhanced search functionality
let searchTimeout;
window.performSearch = function(query) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (query.length > 2) {
            fetch(`/api/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => displaySearchResults(data))
                .catch(error => console.error('Search error:', error));
        } else {
            const searchResults = document.getElementById('searchResults');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
        }
    }, 300);
};

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No results found</div>';
    } else {
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="window.location.href='${result.url}'">
                <h4>${result.title}</h4>
                <p>${result.description}</p>
                <span class="category">${result.category}</span>
            </div>
        `).join('');
    }
    searchResults.style.display = 'block';
}

function displayFilteredSchemes(schemes) {
    const schemesContainer = document.getElementById('schemesContainer');
    if (schemesContainer) {
        schemesContainer.innerHTML = schemes.map(scheme => `
            <div class="scheme-card">
                <div class="scheme-icon">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h3>${scheme.title}</h3>
                <p>${scheme.description.substring(0, 150)}...</p>
                <button class="explore-btn" onclick="window.location.href='${scheme.detailUrl}'">
                    Explore <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `).join('');
    }
}

// DOM Content Loaded event handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded successfully');

    // Mobile menu toggle - safe initialization
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
        });
    }

    // Search functionality - safe initialization
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput ? searchInput.value : '';
            if (query) {
                performSearch(query);
            }
        });
    }

    // Close search results when clicking outside
    document.addEventListener('click', function(event) {
        const searchResults = document.getElementById('searchResults');
        const searchContainer = document.querySelector('.search-container');

        if (searchResults && searchContainer && !searchContainer.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Filter functionality - safe initialization
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            applyFilters();
        });
    }

    if (locationFilter) {
        locationFilter.addEventListener('change', function() {
            applyFilters();
        });
    }

    // Initialize smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');

    const category = categoryFilter ? categoryFilter.value : '';
    const location = locationFilter ? locationFilter.value : '';

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (location) params.append('location', location);

    fetch(`/api/schemes/filter?${params.toString()}`)
        .then(response => response.json())
        .then(data => displayFilteredSchemes(data))
        .catch(error => console.error('Filter error:', error));
}

// Error handling for missing elements
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});