
    
// Dark Mode Toggle Functionality
(function() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  
  function toggleDarkMode() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('darkMode', 'enabled');
    } else {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('darkMode', 'disabled');
    }
  }
  
  darkModeToggle.addEventListener('click', toggleDarkMode);
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
})();

// Back to Top Button Functionality
(function() {
  const backToTopButton = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// FAQ Accordion Functionality
(function() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Optionally close other FAQs for single-open behavior:
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });
})();

// Mobile Menu Toggle
(function() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navList = document.querySelector('.nav-list');
  mobileMenuToggle.addEventListener('click', () => {
    navList.style.display = (navList.style.display === 'flex' ? 'none' : 'flex');
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navList.style.display = 'flex';
    } else {
      navList.style.display = 'none';
    }
  });
})();

// Full-screen Image Modal Functionality
(function() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const captionText = document.getElementById('caption');
  const closeBtn = modal.querySelector('.close');
  
  document.querySelectorAll('.clickable-image').forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'block';
      modalImg.src = img.getAttribute('data-fullsrc') || img.src;
      captionText.textContent = img.alt || '';
    });
  });
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
})();
