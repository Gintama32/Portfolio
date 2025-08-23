let currentPage = 0;
const totalPages = document.querySelectorAll('.page').length;

// Function to handle horizontal page navigation
function scrollPage(direction) {
    // Update current page
    currentPage += direction;
    if(currentPage < 0) currentPage = 0;
    if(currentPage >= totalPages) currentPage = totalPages - 1;

    // Navigate to the page
    navigateToPage(currentPage);
}

// Function to go to a specific page
function goToPage(pageIndex) {
    currentPage = pageIndex;
    navigateToPage(currentPage);
}

// Function to handle page navigation and update UI
function navigateToPage(pageIndex) {
    // Smooth transition to the page
    document.querySelector('.container').style.transform = `translateX(-${pageIndex * 100}vw)`;
    
    // Update active dot indicator
    document.querySelectorAll('.nav-dot').forEach((dot, index) => {
        if (index === pageIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Reset scroll position of projects section to top when navigating to it
    if(pageIndex === 2) { // Projects is the third section (index 2)
        setTimeout(() => {
            document.getElementById('projects').scrollTop = 0;
        }, 100);
    }
}

// Prevent wheel scrolling on non-project sections
document.addEventListener('wheel', function(event) {
    // Only allow wheel scrolling on projects section when it's the current page
    if (currentPage === 2) {
        // Check if we're scrolling inside the projects section
        const projectsSection = document.getElementById('projects');
        if (event.target.closest('#projects')) {
            // Allow natural scrolling inside projects section
            return true;
        } else {
            // Prevent scrolling outside projects section
            event.preventDefault();
            return false;
        }
    } else {
        // Prevent any wheel scrolling on non-project pages
        event.preventDefault();
        return false;
    }
}, { passive: false }); // passive: false is required to use preventDefault()

// Handle touch events for mobile devices
document.addEventListener('touchmove', function(event) {
    // Only allow touch scrolling on projects section when it's the current page
    if (currentPage === 2) {
        if (!event.target.closest('#projects')) {
            event.preventDefault();
        }
    } else {
        // Prevent any touch scrolling on non-project pages
        event.preventDefault();
    }
}, { passive: false });

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Force scroll to top on page load
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    
    // Set initial state
    navigateToPage(currentPage);
    
    // Typing animation for home section
    if (document.querySelector('.highlight')) {
        const words = ["scalable", "efficient", "reliable", "high-performance", "optimized"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let highlightElement = document.querySelector('.highlight');
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Remove character
                highlightElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Add character
                highlightElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            // Determine if word is complete or empty
            if (!isDeleting && charIndex === currentWord.length) {
                // Word is complete, wait before deleting
                isDeleting = true;
                setTimeout(typeEffect, 1500);
                return;
            } else if (isDeleting && charIndex === 0) {
                // Word is deleted, move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(typeEffect, 500);
                return;
            }
            
            // Set typing speed
            const typingSpeed = isDeleting ? 80 : 150;
            setTimeout(typeEffect, typingSpeed);
        }
        
        // Start the typing animation
        setTimeout(typeEffect, 1000);
    }
    
    // Contact form submission with Formspree
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Fallback in case the Formspree library isn't loaded
        const formSubmit = window.FormspreeFormSubmit || function(options) {
            this.submit = function() {
                return fetch(options.form.action, {
                    method: 'POST',
                    body: new FormData(options.form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            };
        };
        
        // Initialize form handler
        const formspree = new formSubmit({
            form: contactForm,
            async: true,
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            
            // Submit the form using Formspree's library
            formspree.submit()
                .then(response => {
                    if (response.ok) {
                        // Get the name for personalized message
                        const name = document.getElementById('name').value;
                        
                        // Create success message
                        const successMsg = document.createElement('div');
                        successMsg.className = 'success-message';
                        successMsg.innerHTML = `
                            <i class="fas fa-check-circle"></i>
                            <p>Thanks ${name}! Your message has been sent successfully.</p>
                        `;
                        
                        // Replace form with success message
                        contactForm.innerHTML = '';
                        contactForm.appendChild(successMsg);
                    } else {
                        // Handle error
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                        alert('There was a problem sending your message. Please try again.');
                    }
                })
                .catch(error => {
                    // Handle network or other errors
                    console.error('Form submission error:', error);
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    alert('There was a problem connecting to the server. Please try again later.');
                });
        });
    }
});
