
// Dashboard navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items and tab contents
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Show corresponding tab content
            const targetTab = this.getAttribute('href').substring(1);
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Application status tracking
    const trackButtons = document.querySelectorAll('.track-application');
    trackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const applicationId = this.getAttribute('data-app-id');
            trackApplication(applicationId);
        });
    });
    
    // Bookmark functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const schemeId = this.getAttribute('data-scheme-id');
            const schemeType = this.getAttribute('data-scheme-type');
            toggleBookmark(schemeId, schemeType, this);
        });
    });
    
    // Notification management
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            markNotificationAsRead(this);
        });
    });
    
    // Initialize notification updates
    setInterval(checkForNewNotifications, 60000); // Check every minute
});

// Track application status
async function trackApplication(applicationId) {
    try {
        const response = await fetch(`/api/applications/${applicationId}/status`);
        const data = await response.json();
        
        if (data.success) {
            showApplicationStatusModal(data.application);
        } else {
            showAlert('Error fetching application status', 'error');
        }
    } catch (error) {
        console.error('Error tracking application:', error);
        showAlert('Error tracking application', 'error');
    }
}

// Toggle bookmark status
async function toggleBookmark(schemeId, schemeType, button) {
    try {
        const response = await fetch('/api/bookmarks/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                schemeId: schemeId,
                schemeType: schemeType
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            button.classList.toggle('bookmarked');
            const icon = button.querySelector('i');
            if (button.classList.contains('bookmarked')) {
                icon.className = 'fas fa-bookmark';
                showAlert('Scheme bookmarked successfully', 'success');
            } else {
                icon.className = 'far fa-bookmark';
                showAlert('Bookmark removed successfully', 'success');
            }
        } else {
            showAlert('Error updating bookmark', 'error');
        }
    } catch (error) {
        console.error('Error toggling bookmark:', error);
        showAlert('Error updating bookmark', 'error');
    }
}

// Mark notification as read
async function markNotificationAsRead(notificationElement) {
    const notificationId = notificationElement.getAttribute('data-notification-id');
    
    try {
        const response = await fetch(`/api/notifications/${notificationId}/read`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            notificationElement.classList.add('read');
            updateNotificationBadge();
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Check for new notifications
async function checkForNewNotifications() {
    try {
        const response = await fetch('/api/notifications/new');
        const data = await response.json();
        
        if (data.hasNew) {
            updateNotificationBadge();
            showNewNotificationToast(data.count);
        }
    } catch (error) {
        console.error('Error checking for new notifications:', error);
    }
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        fetch('/api/notifications/unread-count')
            .then(response => response.json())
            .then(data => {
                if (data.count > 0) {
                    badge.textContent = data.count;
                    badge.style.display = 'inline';
                } else {
                    badge.style.display = 'none';
                }
            });
    }
}

// Show application status modal
function showApplicationStatusModal(application) {
    const modalHtml = `
        <div class="status-modal-overlay">
            <div class="status-modal">
                <div class="modal-header">
                    <h3>Application Status</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="status-info">
                        <h4>${application.schemeName}</h4>
                        <p><strong>Application ID:</strong> ${application.applicationId}</p>
                        <p><strong>Current Status:</strong> <span class="status-badge ${application.status}">${application.status.toUpperCase()}</span></p>
                        <p><strong>Applied Date:</strong> ${new Date(application.appliedDate).toLocaleDateString()}</p>
                        <p><strong>Last Updated:</strong> ${new Date(application.lastUpdated).toLocaleDateString()}</p>
                        ${application.remarks ? `<p><strong>Remarks:</strong> ${application.remarks}</p>` : ''}
                    </div>
                    <div class="status-timeline">
                        <h5>Application Timeline</h5>
                        <!-- Timeline would be populated based on application history -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Close modal functionality
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.querySelector('.status-modal-overlay').remove();
    });
    
    document.querySelector('.status-modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Show alert notifications
function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type}">
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;
    
    const alertContainer = document.querySelector('.alert-container') || createAlertContainer();
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    // Auto-remove alert after 5 seconds
    const alert = alertContainer.lastElementChild;
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.remove();
        }
    }, 5000);
    
    // Close button functionality
    alert.querySelector('.alert-close').addEventListener('click', function() {
        alert.remove();
    });
}

// Create alert container if it doesn't exist
function createAlertContainer() {
    const container = document.createElement('div');
    container.className = 'alert-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
}

// Show new notification toast
function showNewNotificationToast(count) {
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
        <i class="fas fa-bell"></i>
        <span>You have ${count} new notification${count > 1 ? 's' : ''}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4a90e2;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
    
    // Click to dismiss
    toast.addEventListener('click', () => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    });
}

// Profile form submission
function updateProfile() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            
            try {
                const response = await fetch('/api/profile/update', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAlert('Profile updated successfully', 'success');
                } else {
                    showAlert('Error updating profile', 'error');
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                showAlert('Error updating profile', 'error');
            }
        });
    }
}

// Initialize profile update on page load
document.addEventListener('DOMContentLoaded', updateProfile);
