// DOM Elements
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('themeToggle');

// Mobile Menu Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Dark Mode Toggle
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .service-card, .about-content, .contact-content').forEach(el => {
    observer.observe(el);
});

// Add scroll-based header styling
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scrolling down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scrolling up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Hero Title Animation
const dynamicText = document.querySelector('.dynamic-text');
const words = ['Ideas', 'Businesses', 'Technology', 'Digital Reality'];
let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeText() {
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
        dynamicText.textContent = currentWord.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        dynamicText.textContent = currentWord.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    if (!isDeleting && currentCharIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeText, 2000); // Wait before deleting
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        setTimeout(typeText, 500); // Wait before typing next word
    } else {
        setTimeout(typeText, isDeleting ? 100 : 200); // Faster when deleting
    }
}

// Start the typing animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    typeText();
});

// Services Slider
const servicesGrid = document.querySelector('.services-grid');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let isDragging = false;
let startX;
let scrollLeft;
let touchStartX = 0;
let touchEndX = 0;

function updateSlider() {
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    // Scroll to current slide
    const slideWidth = servicesGrid.offsetWidth;
    servicesGrid.scrollTo({
        left: slideWidth * currentSlide,
        behavior: 'smooth'
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % dots.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + dots.length) % dots.length;
    updateSlider();
}

// Touch event handlers
servicesGrid.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - servicesGrid.offsetLeft;
    scrollLeft = servicesGrid.scrollLeft;
    touchStartX = e.touches[0].clientX;
});

servicesGrid.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - servicesGrid.offsetLeft;
    const walk = (x - startX) * 1.5; // Reduced multiplier for smoother dragging
    servicesGrid.scrollLeft = scrollLeft - walk;
});

servicesGrid.addEventListener('touchend', (e) => {
    isDragging = false;
    const slideWidth = servicesGrid.offsetWidth;
    const newSlide = Math.round(servicesGrid.scrollLeft / slideWidth);
    
    if (newSlide !== currentSlide) {
        currentSlide = newSlide;
        updateSlider();
    }

    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
});

// Handle dot clicks
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

function handleSwipe() {
    const swipeThreshold = 30; // Reduced threshold for easier swipes
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            prevSlide();
        } else {
            nextSlide();
        }
    }
} 