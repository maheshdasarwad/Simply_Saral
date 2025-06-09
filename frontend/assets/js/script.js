` tags.

```
<replit_final_file>
// Global navigation functions
window.navigateToScheme = function(category) {
    const categoryUrls = {
        'secondary': '/schemes/secondary',
        'higher': '/schemes/higher', 
        'farmer': '/schemes/farmer',
        'women': '/schemes/women',
        'primary': '/schemes/primary'
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
        }
    }, 300);
};

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        if (results.length > 0) {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" onclick="window.location.href='${result.url}'">
                    <h4>${result.title}</h4>
                    <p>${result.description.substring(0, 100)}...</p>
                    <span class="category-badge">${result.category}</span>
                </div>
            `).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            searchResults.style.display = 'block';
        }
    }
}

// Filter functionality
window.applyFilters = function() {
    const category = document.getElementById('categoryFilter')?.value || '';
    const targetGroup = document.getElementById('targetGroupFilter')?.value || '';
    const location = document.getElementById('locationFilter')?.value || '';

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (targetGroup) params.append('targetGroup', targetGroup);
    if (location) params.append('location', location);

    fetch(`/api/schemes/filter?${params.toString()}`)
        .then(response => response.json())
        .then(data => displayFilteredSchemes(data))
        .catch(error => console.error('Filter error:', error));
};

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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add event listeners for scheme cards
    const schemeCards = document.querySelectorAll('.scheme-card');
    schemeCards.forEach(card => {
        const exploreBtn = card.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                if (category) {
                    navigateToScheme(category);
                }
            });
        }
    });

    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            performSearch(e.target.value);
        });

        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            const searchResults = document.getElementById('searchResults');
            if (searchResults && !e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
    }

    // Initialize filter functionality
    const filterElements = document.querySelectorAll('#categoryFilter, #targetGroupFilter, #locationFilter');
    filterElements.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
});