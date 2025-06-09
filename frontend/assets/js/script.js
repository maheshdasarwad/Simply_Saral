document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing page functionality');

    // Handle scheme category buttons with error checking
    const schemeButtons = document.querySelectorAll('.scheme-btn, .btn[href*="/schemes/"], .explore-btn');
    if (schemeButtons && schemeButtons.length > 0) {
        schemeButtons.forEach(button => {
            if (button && button.href) {
                button.addEventListener('click', function(e) {
                    console.log('Navigating to scheme:', button.href);
                    // Add loading state
                    const originalText = button.innerHTML;
                    button.style.opacity = '0.7';
                    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

                    // Reset after a short delay if navigation fails
                    setTimeout(() => {
                        button.style.opacity = '1';
                        button.innerHTML = originalText;
                    }, 3000);
                });
            }
        });
    }

    // Handle explore buttons specifically
    const exploreButtons = document.querySelectorAll('.explore-btn, .btn-primary[href*="/schemes/"]');
    if (exploreButtons && exploreButtons.length > 0) {
        exploreButtons.forEach(button => {
            if (button && button.href) {
                button.addEventListener('click', function(e) {
                    console.log('Exploring scheme:', button.href);
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
                    const link = card.querySelector('a');
                    if (link && link.href) {
                        window.location.href = link.href;
                    }
                });
            }
        });
    }

    // Handle read more buttons
    const readMoreButtons = document.querySelectorAll('.read-more-btn, .btn[href*="/schemes/"]');
    readMoreButtons.forEach(button => {
        if (button && button.href) {
            button.addEventListener('click', function(e) {
                console.log('Read more clicked:', button.href);
                // Ensure proper navigation
                if (!button.href.includes('undefined') && !button.href.includes('null')) {
                    window.location.href = button.href;
                } else {
                    e.preventDefault();
                    console.error('Invalid URL detected:', button.href);
                }
            });
        }
    });

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

    // Log any missing elements for debugging
    console.log('Page initialization complete');
});