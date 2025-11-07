// Main Navigation Script
// Handles mobile menu and page interactions

document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    setupSmoothScroll();
});

// Setup mobile hamburger menu
function setupMobileMenu() {
    const hamburgerButton = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.nav-menu');

    if (!hamburgerButton || !mobileMenu) return;

    // Toggle menu when hamburger clicked
    hamburgerButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        hamburgerButton.classList.toggle('active');
    });

    // Close menu when any link clicked
    const menuLinks = document.querySelectorAll('.nav-link');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            hamburgerButton.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const clickedInsideMenu = mobileMenu.contains(event.target);
        const clickedHamburger = hamburgerButton.contains(event.target);
        
        if (!clickedInsideMenu && !clickedHamburger) {
            mobileMenu.classList.remove('active');
            hamburgerButton.classList.remove('active');
        }
    });
}

// Setup smooth scrolling for anchor links
function setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Helper function to format dates in Portuguese
function formatDatePortuguese(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    return date.toLocaleDateString('pt-BR', options);
}

// Helper function to show error messages
function showErrorMessage(message, container) {
    if (!container) return;
    
    const errorBox = document.createElement('div');
    errorBox.className = 'error-message';
    errorBox.innerHTML = `
        <div class="error-content">
            <h4>Erro</h4>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(errorBox);
    
    // Remove error after 5 seconds
    setTimeout(function() {
        if (errorBox.parentNode) {
            errorBox.parentNode.removeChild(errorBox);
        }
    }, 5000);
}