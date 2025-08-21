// Excerpt from The Great American Caliphate
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

// Newsletter form handling (now using Substack embed)
function initializeNewsletterForm() {
    // Newsletter is now handled by Substack embed iframe
    // No JavaScript needed for the embedded form
}

// Contact form handling
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.submit-btn');
        const originalText = button.textContent;
        
        // Simulate form submission
        button.textContent = 'Sending...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Message Sent!';
            
            // Reset form
            form.reset();
            
            // Show success message
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            successMessage.style.color = '#4a9e4a';
            successMessage.style.marginTop = '1rem';
            successMessage.style.fontWeight = '500';
            successMessage.style.textAlign = 'center';
            
            // Remove any existing success message
            const existingMessage = form.parentNode.querySelector('.contact-success-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            successMessage.classList.add('contact-success-message');
            form.parentNode.appendChild(successMessage);
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                if (successMessage.parentNode) {
                    successMessage.remove();
                }
            }, 3000);
        }, 1500);
    });
}

// Social links (placeholder for now)
function initializeSocialLinks() {
    const instagramLink = document.getElementById('instagram-link');
    const substackLink = document.getElementById('substack-link');
    
    // Only add event listeners if elements exist
    if (instagramLink) {
        instagramLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Instagram link will be added when account is set up.');
        });
    }
    
    if (substackLink) {
        substackLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://sfacchine.substack.com', '_blank');
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

// Function to load Substack posts
async function loadSubstackPosts() {
    const blogPostsContainer = document.getElementById('blog-posts');
    const loadingMessage = document.getElementById('loading-message');
    const placeholder = document.getElementById('blog-placeholder');
    
    try {
        // Use a CORS proxy to fetch the RSS feed
        const proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=';
        const rssUrl = 'https://sfacchine.substack.com/feed';
        
        const response = await fetch(proxyUrl + encodeURIComponent(rssUrl));
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            // Clear loading message
            loadingMessage.style.display = 'none';
            
            // Display posts (limit to 5 most recent)
            const posts = data.items.slice(0, 5);
            
            posts.forEach(post => {
                const postElement = document.createElement('article');
                postElement.className = 'substack-post';
                
                // Create excerpt (first 200 chars of content, stripped of HTML)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content;
                const excerpt = tempDiv.textContent.substring(0, 200) + '...';
                
                // Format date
                const postDate = new Date(post.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                postElement.innerHTML = `
                    <h3><a href="${post.link}" target="_blank">${post.title}</a></h3>
                    <div class="substack-meta">
                        <span class="post-date">${postDate}</span>
                        <a href="${post.link}" target="_blank" class="read-more-link">Read on Substack →</a>
                    </div>
                    <p class="substack-excerpt">${excerpt}</p>
                `;
                
                blogPostsContainer.appendChild(postElement);
            });
        } else {
            // No posts found
            loadingMessage.style.display = 'none';
            placeholder.style.display = 'block';
        }
    } catch (error) {
        console.log('Could not load Substack posts:', error);
        // Show placeholder if RSS fails
        loadingMessage.style.display = 'none';
        placeholder.style.display = 'block';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
    
    initializeNavigation();
    initializeNewsletterForm();
    initializeContactForm();
    initializeSocialLinks();
    initializeSmoothScrolling();
    loadSubstackPosts(); // Load blog posts from Substack
    
    // Start typing animation on page load with a short delay
    setTimeout(() => {
        startTypingAnimation();
    }, 1000);
});

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
