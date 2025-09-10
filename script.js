// Excerpt from The Model Muslim
const novelExcerpt = [
    { type: 'single', text: 'I couldn\'t do it. But my Awaz could hold what I could not name.\nSo I bent inward, bitter as a curse, and whispered: Inshallah.' }
];

// Typing animation variables
let currentSegment = 0;
let currentChar = 0;
let isTyping = false;
let typingSpeed = 35; // milliseconds per character (smoother)
let pauseBetweenSegments = 600; // pause between character and Awaz segments (shorter)

// Tab navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navButtons = document.querySelectorAll('.nav-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Handle header navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.getAttribute('data-tab'));
        });
    });
    
    // Handle navigation buttons in post-typing content
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(button.getAttribute('data-tab'));
        });
    });
    
    function switchTab(tabId) {
        // Remove active class from all nav links and tab contents
        navLinks.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to corresponding nav link
        const correspondingNavLink = document.querySelector(`.nav-link[data-tab="${tabId}"]`);
        if (correspondingNavLink) {
            correspondingNavLink.classList.add('active');
        }
        
        // Show corresponding tab content
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Start typing animation if home tab is selected
        if (tabId === 'home' && !isTyping) {
            startTypingAnimation();
        }
    }
}

// Typing animation
function startTypingAnimation() {
    if (isTyping) return;
    
    isTyping = true;
    
    const typingElement = document.getElementById('typing-text');
    const cursor = document.getElementById('cursor');
    
    if (!typingElement || !cursor) {
        console.error('Typing elements not found');
        return;
    }
    
    // Type the novel excerpt
    const fullText = novelExcerpt[0].text;
    let currentIndex = 0;
    
    typingElement.innerHTML = '';
    cursor.style.display = 'none'; // Hide separate cursor, use inline cursor
    
    function typeChar() {
        if (currentIndex < fullText.length) {
            const textSoFar = fullText.substring(0, currentIndex + 1);
            const nextPart = fullText.substring(currentIndex, currentIndex + 9);
            const currentChar = fullText[currentIndex];
            
            // Check if we're about to type "Inshallah" - add dramatic pause
            if (nextPart === 'Inshallah' && currentIndex > 0) {
                // Add dramatic pause before Inshallah
                setTimeout(() => {
                    continueWithInshallah();
                }, 800); // Shorter dramatic pause for smoother flow
                return;
            }
            
            // Add text with cursor, converting \n to <br>
            const formattedText = textSoFar.replace(/\n/g, '<br>');
            typingElement.innerHTML = formattedText + '<span class="cursor">|</span>';
            
            currentIndex++;
            
            // Check for sentence endings and add longer pauses
            let nextDelay = typingSpeed;
            if (currentChar === '.' || currentChar === '?' || currentChar === '!') {
                nextDelay = typingSpeed * 12; // Longer pause after sentences for more drama
            } else if (currentChar === '\n') {
                nextDelay = typingSpeed * 10; // Pause after line breaks for dramatic effect
            }
            
            setTimeout(typeChar, nextDelay);
        } else {
            // Animation complete - remove inline cursor
            typingElement.textContent = fullText.substring(0, currentIndex);
            isTyping = false;
            
            setTimeout(() => {
                revealPostTypingContent();
            }, 1500);
        }
    }
    
    function continueWithInshallah() {
        // Type "Inshallah" character by character in italics
        const beforeInshallah = fullText.substring(0, currentIndex);
        const inshallahWord = 'Inshallah';
        let inshallahIndex = 0;
        
        function typeInshallahChar() {
            if (inshallahIndex < inshallahWord.length) {
                const inshallahSoFar = inshallahWord.substring(0, inshallahIndex + 1);
                const afterInshallah = fullText.substring(currentIndex + inshallahWord.length);
                
                // Build the HTML with italicized and bold Inshallah as it's being typed
                const formattedBefore = beforeInshallah.replace(/\n/g, '<br>');
                typingElement.innerHTML = formattedBefore + '<em><strong>' + inshallahSoFar + '</strong></em><span class="cursor">|</span>';
                
                inshallahIndex++;
                currentIndex++;
                setTimeout(typeInshallahChar, typingSpeed * 1.5); // Smoother typing for Inshallah
            } else {
                // Animation complete after Inshallah - remove inline cursor
                const formattedBefore = beforeInshallah.replace(/\n/g, '<br>');
                typingElement.innerHTML = formattedBefore + '<em><strong>' + inshallahWord + '</strong></em>';
                isTyping = false;
                
                setTimeout(() => {
                    revealPostTypingContent();
                }, 800); // Smoother pause after Inshallah
            }
        }
        
        typeInshallahChar();
    }
    
    typeChar();
}

// Function to skip the typing animation
function skipIntro() {
    if (!isTyping) return; // Already completed
    
    // Stop the typing animation
    isTyping = false;
    
    // Complete the text instantly
    const typingElement = document.getElementById('typing-text');
    const cursor = document.getElementById('cursor');
    
    typingElement.innerHTML = '';
    
    // Add all segments instantly
    novelExcerpt.forEach((segment, index) => {
        const segmentElement = document.createElement('span');
        if (segment.type === 'awaz') {
            segmentElement.className = 'awaz-dialogue';
        } else if (segment.type === 'single') {
            segmentElement.className = 'single';
        } else {
            segmentElement.className = 'character-dialogue';
        }
        
        // Handle "Inshallah" formatting
        if (segment.text.includes('Inshallah')) {
            segmentElement.innerHTML = segment.text.replace('Inshallah', '<em><strong>Inshallah</strong></em>');
        } else {
            segmentElement.textContent = segment.text;
        }
        
        if (index > 0) {
            typingElement.appendChild(document.createElement('br'));
            typingElement.appendChild(document.createElement('br'));
        }
        
        typingElement.appendChild(segmentElement);
    });
    
    cursor.style.display = 'none';
    
    // Reveal content immediately
    setTimeout(() => {
        revealPostTypingContent();
    }, 500);
}

// Function to reveal content after typing animation completes
function revealPostTypingContent() {
    const postTypingContent = document.getElementById('post-typing-content');
    const header = document.querySelector('.header');
    const skipButton = document.getElementById('skip-intro-btn');
    const typingContainer = document.querySelector('.typing-container');
    const mainContent = document.querySelector('.main-content');
    
    // Hide skip button smoothly
    if (skipButton) {
        skipButton.style.opacity = '0';
        setTimeout(() => {
            skipButton.style.display = 'none';
        }, 300);
    }
    
    // Start the smooth transition sequence
    setTimeout(() => {
        // First, smoothly adjust the typing container
        typingContainer.style.transition = 'all 1.2s ease-out';
        typingContainer.style.minHeight = '200px';
        typingContainer.style.marginBottom = '0.5rem';
        
        // Simultaneously start showing the header
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
        
        // Adjust main content margin smoothly
        mainContent.style.transition = 'margin-top 1.2s ease-out';
        mainContent.style.marginTop = '100px';
        
        // After the container adjustment, show the content
        setTimeout(() => {
            postTypingContent.style.display = 'block';
            postTypingContent.style.opacity = '0';
            postTypingContent.style.transform = 'translateY(20px)';
            postTypingContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            
            // Trigger the content fade-in
            setTimeout(() => {
                postTypingContent.style.opacity = '1';
                postTypingContent.style.transform = 'translateY(0)';
                

            }, 50);
        }, 600); // Wait for container adjustment to nearly complete
        
    }, 200); // Small delay after typing completes
}

// Newsletter form handling (AJAX submission)
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    console.log('Newsletter form found:', newsletterForm); // Debug log
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            console.log('Form submitted!'); // Debug log
            e.preventDefault(); // Prevent default form submission
            
            const emailInput = newsletterForm.querySelector('.email-input');
            const submitBtn = newsletterForm.querySelector('.subscribe-btn');
            const originalBtnText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Get form data and convert to URL-encoded format
            const formData = new FormData(newsletterForm);
            const urlEncodedData = new URLSearchParams(formData).toString();
            
            // Submit via AJAX
            console.log('Submitting form data:', urlEncodedData); // Debug log
            fetch('/.netlify/functions/convertkit-webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: urlEncodedData
            })
            .then(response => {
                console.log('Response status:', response.status); // Debug log
                console.log('Response headers:', response.headers); // Debug log
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data); // Debug log
                if (data.success) {
                    // Show success message
                    emailInput.style.display = 'none';
                    submitBtn.style.display = 'none';
                    
                    const successMessage = document.createElement('div');
                    successMessage.innerHTML = '<p style="color: var(--accent-teal); font-weight: 600; margin: 0;">✓ Thank you for subscribing!</p>';
                    successMessage.style.textAlign = 'center';
                    successMessage.style.padding = '1rem';
                    
                    newsletterForm.appendChild(successMessage);
                } else {
                    // Show error message
                    submitBtn.textContent = 'Error - Try Again';
                    submitBtn.disabled = false;
                    
                    const errorMessage = document.createElement('div');
                    errorMessage.innerHTML = '<p style="color: #e74c3c; font-weight: 600; margin: 0;">❌ Something went wrong. Please try again.</p>';
                    errorMessage.style.textAlign = 'center';
                    errorMessage.style.padding = '1rem';
                    
                    newsletterForm.appendChild(errorMessage);
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                        if (errorMessage.parentNode) {
                            errorMessage.remove();
                        }
                    }, 3000);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.disabled = false;
                
                const errorMessage = document.createElement('div');
                errorMessage.innerHTML = `<p style="color: #e74c3c; font-weight: 600; margin: 0;">❌ Error: ${error.message}</p>`;
                errorMessage.style.textAlign = 'center';
                errorMessage.style.padding = '1rem';
                
                newsletterForm.appendChild(errorMessage);
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    if (errorMessage.parentNode) {
                        errorMessage.remove();
                    }
                }, 3000);
            });
        });
    }
}

// Contact form handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        const button = form.querySelector('.submit-btn');
        const originalText = button.textContent;
        
        // Show sending state
        button.textContent = 'Sending...';
        button.disabled = true;
        
        // Let Netlify handle the form submission
        // Show success message after a delay
        setTimeout(() => {
            button.textContent = 'Message Sent!';
            
            // Show success message
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            successMessage.style.color = 'var(--accent-teal)';
            successMessage.style.marginTop = '1rem';
            successMessage.style.fontWeight = '600';
            successMessage.style.textAlign = 'center';
            
            // Remove any existing success message
            const existingMessage = form.parentNode.querySelector('.contact-success-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            successMessage.classList.add('contact-success-message');
            form.parentNode.appendChild(successMessage);
            
            // Reset form and button after delay
            setTimeout(() => {
                form.reset();
                button.textContent = originalText;
                button.disabled = false;
                if (successMessage.parentNode) {
                    successMessage.remove();
                }
            }, 3000);
        }, 1000);
    });
}

// Social links (placeholder for now)
function initializeSocialLinks() {
    const instagramLink = document.getElementById('instagram-link');
    
    // Only add event listeners if elements exist
    if (instagramLink) {
        instagramLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Instagram link will be added when account is set up.');
        });
    }
}

// Smooth scrolling for better UX
function initializeSmoothScrolling() {
    // Add smooth transitions when switching tabs
    const style = document.createElement('style');
    style.textContent = `
        .tab-content {
            transition: opacity 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}



// Check if user should see cold open
function shouldShowColdOpen() {
    // Check if user came from a blog post or is navigating back
    const referrer = document.referrer;
    const currentUrl = window.location.href;
    
    // If coming from a blog post, don't show cold open
    if (referrer && referrer.includes('blog-post.html')) {
        return false;
    }
    
    // If user clicked "Back to Blog" from a blog post, don't show cold open
    const returningFromBlog = sessionStorage.getItem('returningFromBlog');
    if (returningFromBlog === 'true') {
        // Clear the flag after checking
        sessionStorage.removeItem('returningFromBlog');
        return false;
    }
    
    // Check if URL has #blog hash to navigate to blog tab
    if (window.location.hash === '#blog') {
        return false;
    }
    
    // If navigating back (browser back button), don't show cold open
    if (performance.navigation && performance.navigation.type === 2) {
        return false;
    }
    
    // Check session storage to see if user has already seen intro in this session
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    if (hasSeenIntro === 'true') {
        return false;
    }
    
    // Show cold open for first-time visitors or direct access to main domain
    return true;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...'); // Debug log
    
    const showColdOpen = shouldShowColdOpen();
    
    if (showColdOpen) {
        // Set up cold open - hide header initially
        const header = document.querySelector('.header');
        header.style.opacity = '0';
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'opacity 1s ease, transform 1s ease';
        
        // Adjust main content margin for cold open
        const mainContent = document.querySelector('.main-content');
        mainContent.style.marginTop = '0';
        
        // Create and add skip intro button
        createSkipIntroButton();
        
        // Mark that user has seen intro in this session
        sessionStorage.setItem('hasSeenIntro', 'true');
        
        // Start typing animation on page load with a short delay
        setTimeout(() => {
            startTypingAnimation();
        }, 1000);
    } else {
        // Skip cold open - show header immediately
        const header = document.querySelector('.header');
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
        
        // Adjust main content margin for normal view
        const mainContent = document.querySelector('.main-content');
        mainContent.style.marginTop = '80px';
        
        // Show home content immediately
        const homeTab = document.getElementById('home');
        if (homeTab) {
            homeTab.classList.add('active');
        }
        
        // Adjust typing container for normal layout (not full height)
        const typingContainer = document.querySelector('.typing-container');
        if (typingContainer) {
            typingContainer.style.minHeight = 'auto';
            typingContainer.style.padding = '2rem 0';
        }
        
        // Show the final typed text immediately since we're skipping the animation
        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            typingElement.innerHTML = novelExcerpt[0].text;
        }
        
        // Hide the cursor since we're not animating
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.display = 'none';
        }
        
        // Show the post-typing content immediately since we're skipping the animation
        const postTypingContent = document.getElementById('post-typing-content');
        if (postTypingContent) {
            postTypingContent.style.display = 'block';
        }
    }
    
    initializeNavigation();
    initializeNewsletterForm();
    initializeContactForm();
    initializeSocialLinks();
    initializeSmoothScrolling();
    
    // Check if we need to navigate to blog tab (from blog post or hash)
    const shouldNavigateToBlog = window.location.hash === '#blog' || sessionStorage.getItem('navigateToBlog') === 'true';
    
    if (shouldNavigateToBlog) {
        console.log('Navigating to blog tab');
        // Clear the navigation flag
        sessionStorage.removeItem('navigateToBlog');
        
        // Switch to blog tab immediately
        const navLinks = document.querySelectorAll('.nav-link');
        const tabContents = document.querySelectorAll('.tab-content');
        
        console.log('Found nav links:', navLinks.length, 'tab contents:', tabContents.length);
        
        // Remove active class from all nav links and tab contents
        navLinks.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to blog nav link
        const blogNavLink = document.querySelector('.nav-link[data-tab="blog"]');
        if (blogNavLink) {
            blogNavLink.classList.add('active');
            console.log('Activated blog nav link');
        } else {
            console.log('Blog nav link not found');
        }
        
        // Show blog tab content
        const blogTab = document.getElementById('blog');
        if (blogTab) {
            blogTab.classList.add('active');
            console.log('Activated blog tab content');
        } else {
            console.log('Blog tab content not found');
        }
        
        // Update URL without hash to prevent flash
        if (window.location.hash === '#blog') {
            history.replaceState(null, null, window.location.pathname);
        }
    }
});

// Also try to initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM still loading...'); // Debug log
} else {
    console.log('DOM already loaded, initializing immediately...'); // Debug log
    
    const showColdOpen = shouldShowColdOpen();
    
    if (showColdOpen) {
        // Set up cold open - hide header initially
        const header = document.querySelector('.header');
        header.style.opacity = '0';
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'opacity 1s ease, transform 1s ease';
        
        // Adjust main content margin for cold open
        const mainContent = document.querySelector('.main-content');
        mainContent.style.marginTop = '0';
        
        // Create and add skip intro button
        createSkipIntroButton();
        
        // Mark that user has seen intro in this session
        sessionStorage.setItem('hasSeenIntro', 'true');
        
        // Start typing animation
        startTypingAnimation();
    } else {
        // Skip cold open - show header immediately
        const header = document.querySelector('.header');
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
        
        // Adjust main content margin for normal view
        const mainContent = document.querySelector('.main-content');
        mainContent.style.marginTop = '80px';
        
        // Show home content immediately
        const homeTab = document.getElementById('home');
        if (homeTab) {
            homeTab.classList.add('active');
        }
        
        // Adjust typing container for normal layout (not full height)
        const typingContainer = document.querySelector('.typing-container');
        if (typingContainer) {
            typingContainer.style.minHeight = 'auto';
            typingContainer.style.padding = '2rem 0';
        }
        
        // Show the final typed text immediately since we're skipping the animation
        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            typingElement.innerHTML = novelExcerpt[0].text;
        }
        
        // Hide the cursor since we're not animating
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.style.display = 'none';
        }
        
        // Show the post-typing content immediately since we're skipping the animation
        const postTypingContent = document.getElementById('post-typing-content');
        if (postTypingContent) {
            postTypingContent.style.display = 'block';
        }
    }
    
    initializeNavigation();
    initializeNewsletterForm();
    initializeContactForm();
    initializeSocialLinks();
    initializeSmoothScrolling();
    
    // Check if we need to navigate to blog tab (from blog post or hash)
    const shouldNavigateToBlog = window.location.hash === '#blog' || sessionStorage.getItem('navigateToBlog') === 'true';
    
    if (shouldNavigateToBlog) {
        console.log('Navigating to blog tab');
        // Clear the navigation flag
        sessionStorage.removeItem('navigateToBlog');
        
        // Switch to blog tab immediately
        const navLinks = document.querySelectorAll('.nav-link');
        const tabContents = document.querySelectorAll('.tab-content');
        
        console.log('Found nav links:', navLinks.length, 'tab contents:', tabContents.length);
        
        // Remove active class from all nav links and tab contents
        navLinks.forEach(nav => nav.classList.remove('active'));
        tabContents.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to blog nav link
        const blogNavLink = document.querySelector('.nav-link[data-tab="blog"]');
        if (blogNavLink) {
            blogNavLink.classList.add('active');
            console.log('Activated blog nav link');
        } else {
            console.log('Blog nav link not found');
        }
        
        // Show blog tab content
        const blogTab = document.getElementById('blog');
        if (blogTab) {
            blogTab.classList.add('active');
            console.log('Activated blog tab content');
        } else {
            console.log('Blog tab content not found');
        }
        
        // Update URL without hash to prevent flash
        if (window.location.hash === '#blog') {
            history.replaceState(null, null, window.location.pathname);
        }
    }
}



// Create skip intro button
function createSkipIntroButton() {
    const skipButton = document.createElement('button');
    skipButton.id = 'skip-intro-btn';
    skipButton.innerHTML = 'Skip Intro →';
    skipButton.style.cssText = `
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(44, 44, 44, 0.8);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-family: 'Source Sans Pro', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 1001;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        opacity: 0;
    `;
    
    // Hover effects
    skipButton.addEventListener('mouseenter', () => {
        skipButton.style.background = 'rgba(44, 44, 44, 0.9)';
        skipButton.style.transform = 'translateX(-50%) translateY(-2px)';
    });
    
    skipButton.addEventListener('mouseleave', () => {
        skipButton.style.background = 'rgba(44, 44, 44, 0.8)';
        skipButton.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    skipButton.addEventListener('click', skipIntro);
    
    document.body.appendChild(skipButton);
    
    // Show button after a delay
    setTimeout(() => {
        skipButton.style.opacity = '1';
    }, 2000);
}

// Add intersection observer for animations (future enhancement)
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Observe elements that should animate in
    document.querySelectorAll('.newsletter-section, .social-links').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize intersection observer after a short delay
setTimeout(observeElements, 1000);

