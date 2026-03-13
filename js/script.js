/**
 * GTG Perfumes - Main JavaScript File
 * Handles all interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    function toggleMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        const isClickInside = navMenu.contains(event.target) || hamburger.contains(event.target);
        
        if (!isClickInside && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function() {
            const navMenu = document.getElementById('nav-menu');
            const hamburger = document.getElementById('hamburger');
            
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    function handleHeaderScroll() {
        const header = document.getElementById('header');
        
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);

    // ========================================
    // Image Gallery
    // ========================================
    const mainImage = document.getElementById('main-image');
    const galleryBackground = document.getElementById('gallery-background');
    const galleryDots = document.querySelectorAll('.gallery-dot');
    const images = [
        null,                     // First image: just background, no perfume
        'assets/p2.png',
        'assets/p3.png'
    ];
    
    const backgrounds = [
        'assets/Rectangle.png',  // Background for first image
        null,                     // Plain gray for p2.png
        null                      // Plain gray for p3.png
    ];
    
    let currentIndex = 0;

    function changeImage(index) {
        if (index < 0) {
            currentIndex = images.length - 1; // Loop to last
        } else if (index >= images.length) {
            currentIndex = 0; // Loop to first
        } else {
            currentIndex = index;
        }
        
        // Update background image
        if (backgrounds[currentIndex]) {
            galleryBackground.style.opacity = '0';
            setTimeout(() => {
                galleryBackground.src = backgrounds[currentIndex];
                galleryBackground.onload = () => {
                    galleryBackground.style.opacity = '1';
                };
            }, 200);
        } else {
            // Fade out background for plain gray
            galleryBackground.style.opacity = '0';
        }
        
        // Update main image with fade effect
        if (images[currentIndex]) {
            // Show perfume image
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = images[currentIndex];
                mainImage.onload = () => {
                    mainImage.style.opacity = '1';
                };
            }, 200);
        } else {
            // Hide perfume image (first image - just background)
            mainImage.style.opacity = '0';
        }
        
        // Update active dot
        galleryDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextImage() {
        changeImage(currentIndex + 1);
    }

    function prevImage() {
        changeImage(currentIndex - 1);
    }

    // Dot click events
    galleryDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            changeImage(index);
        });
    });

    // Thumbnail click events
    const thumbnails = document.querySelectorAll('.thumb');
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Map thumbnail index to main image index (cycle through p1, p2, p3)
            const imageIndex = index % images.length;
            
            // Remove active from all thumbnails first
            thumbnails.forEach(t => t.classList.remove('active'));
            // Add active only to the clicked thumbnail
            thumb.classList.add('active');
            
            // Then change the main image (this won't update thumbnails since we removed that logic)
            changeImage(imageIndex);
        });
    });

    // Keyboard navigation for gallery
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });

    // ========================================
    // Dynamic Cart Link
    // ========================================
    function updateCartLink() {
        const fragrance = document.querySelector('input[name="fragrance"]:checked');
        const type = document.querySelector('input[name="type"]:checked');
        const addToCartLink = document.getElementById('add-to-cart');
        
        if (fragrance && type) {
            const fragranceValue = fragrance.value;
            const typeValue = type.value;
            
            addToCartLink.href = `cart.html?fragrance=${fragranceValue}&type=${typeValue}`;
        }
    }

    // Add change listeners to radio buttons
    document.querySelectorAll('input[name="fragrance"]').forEach(radio => {
        radio.addEventListener('change', updateCartLink);
    });

    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateCartLink();
            toggleSubscription();
        });
    });

    // ========================================
    // Subscription Toggle
    // ========================================
    function toggleSubscription() {
        const type = document.querySelector('input[name="type"]:checked');
        const subSingle = document.getElementById('sub-single');
        const subDouble = document.getElementById('sub-double');
        
        // Hide all first
        subSingle.classList.add('hidden');
        subDouble.classList.add('hidden');
        
        // Show selected
        if (type.value === 'single') {
            subSingle.classList.remove('hidden');
        } else if (type.value === 'double') {
            subDouble.classList.remove('hidden');
        }
    }

    // ========================================
    // Accordion Toggle
    // ========================================
    function toggleAccordion(header) {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.icon');
        
        // Close all other accordions
        document.querySelectorAll('.accordion-header').forEach(h => {
            if (h !== header) {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
                h.querySelector('.icon').textContent = '+';
            }
        });
        
        // Toggle current
        header.classList.toggle('active');
        
        if (header.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
            icon.textContent = '−';
        } else {
            content.style.maxHeight = null;
            icon.textContent = '+';
        }
    }

    // ========================================
    // Subscription Plan Toggle (Single / Double) - Product Right Panel
    // ========================================
    function toggleSubscriptionPlan() {
        const selected = document.querySelector('input[name="subplan"]:checked');
        if (!selected) return;
        const val = selected.value;

        document.querySelectorAll('.plan-select-row').forEach(row => {
            row.classList.toggle('plan-select-row-active', row.getAttribute('data-plan') === val);
        });
        document.querySelectorAll('[data-plan-details]').forEach(panel => {
            panel.classList.toggle('plan-details-active', panel.getAttribute('data-plan-details') === val);
        });
    }

    document.querySelectorAll('input[name="subplan"]').forEach(r => {
        r.addEventListener('change', toggleSubscriptionPlan);
    });
    toggleSubscriptionPlan();

    // ========================================
    // Fragrance Card Selection (Original / Lily / Rose)
    // ========================================
    function bindFragranceCards() {
        const grids = document.querySelectorAll('.fragrance-grid');
        if (!grids.length) return;

        grids.forEach(grid => {
            const cards = grid.querySelectorAll('.fragrance-card');
            if (!cards.length) return;

            function syncActive() {
                cards.forEach(card => {
                    const input = card.querySelector('input[type="radio"]');
                    card.classList.toggle('fragrance-card-active', !!input && input.checked);
                });
            }

            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const input = card.querySelector('input[type="radio"]');
                    if (input) input.checked = true;
                    syncActive();
                });
            });

            grid.querySelectorAll('input[type="radio"]').forEach(r => {
                r.addEventListener('change', syncActive);
            });

            syncActive();
        });
    }

    bindFragranceCards();

    // ========================================
    // Percentage Counter Animation
    // ========================================
    function animateCounters() {
        const statCounts = document.querySelectorAll('.stat-count');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        statCounts.forEach(count => {
            observer.observe(count);
        });
    }

    function animateCounter(element, target) {
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

// ========================================
// Lazy Loading for Images (Continued)
// ========================================
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => img.src = img.src);
} else {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.src;
                imageObserver.unobserve(entry.target);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// Form Validation (Optional)
// ========================================
const productForm = document.getElementById('product-form');

if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fragrance = document.querySelector('input[name="fragrance"]:checked');
        const type = document.querySelector('input[name="type"]:checked');

        if (!fragrance || !type) {
            alert('Please select both fragrance and purchase type.');
            return;
        }

        // Simulate add to cart
        const cartLink = document.getElementById('add-to-cart');
        window.location.href = cartLink.href;
    });
}

// ========================================
// Newsletter Form Handler
// ========================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email && email.includes('@')) {
            alert('Thank you for subscribing!');
            emailInput.value = '';
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

// ========================================
// Parallax Effect for Hero (Optional)
// ========================================
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroPerfume = document.querySelector('.hero-perfume');
    
    if (heroPerfume) {
        heroPerfume.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ========================================
// Active Navigation Link Highlighting
// ========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-list a');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ========================================
// Add Active Class to Nav Links
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ========================================
// Console Log for Debugging
// ========================================
console.log('GTG Perfumes Website Loaded Successfully!');
console.log('All interactive features are ready to use.');

// ========================================
// Performance: Debounce Function
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Window Resize Handler
// ========================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Recalculate gallery dimensions if needed
        console.log('Window resized');
    }, 250);
});

// ========================================
// Preload Critical Images
// ========================================
function preloadImages() {
    const criticalImages = [
        'assets/base.png',
        'assets/bp1.png',
        'assets/p1.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

// ========================================
// Accessibility: Keyboard Navigation
// ========================================
document.addEventListener('keydown', function(e) {
    // Tab key for navigation
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});

// ========================================
// Error Handling
// ========================================
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// ========================================
// Page Load Complete
// ========================================
window.addEventListener('load', function() {
    console.log('All resources loaded successfully');
});

// ========================================
// Export Functions for External Use
// ========================================
window.toggleMenu = toggleMenu;
window.changeImage = changeImage;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.updateCartLink = updateCartLink;
window.toggleSubscription = toggleSubscription;
window.toggleAccordion = toggleAccordion;
window.animateCounters = animateCounters;

// Initialize counters observer
animateCounters();

});