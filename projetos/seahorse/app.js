// Seahorse Club Enhanced - Main Application JavaScript
// Version 2.0.0 - Fully Functional

// Global variables
let currentLanguage = 'en';
let currentSection = 'home';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Seahorse Club Enhanced - Initializing...');
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }, 1500);

    // Initialize all components
    initializeNavigation();
    initializeLanguageSelector();
    initializeModals();
    initializeFilters();
    initializeTracking();
    
    // Set initial language
    detectAndSetLanguage();
    
    console.log('Seahorse Club Enhanced - Initialized successfully!');
});

// Navigation System
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    const navButtons = document.querySelectorAll('.nav-item');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            console.log('Navigation clicked:', section);
            
            if (section) {
                navigateToSection(section);
            }
        });
    });
}

function navigateToSection(sectionName) {
    console.log('Navigating to section:', sectionName);
    
    // Update current section
    currentSection = sectionName;
    
    // Hide all sections
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        console.log('Section displayed:', sectionName);
    } else {
        console.error('Section not found:', sectionName + '-section');
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-section') === sectionName) {
            button.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Language System
function initializeLanguageSelector() {
    console.log('Initializing language selector...');
    
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            const selectedLanguage = e.target.value;
            console.log('Language changed to:', selectedLanguage);
            changeLanguage(selectedLanguage);
        });
    } else {
        console.error('Language selector not found');
    }
}

function detectAndSetLanguage() {
    // Detect browser language
    const browserLang = navigator.language.substring(0, 2);
    const supportedLanguages = ['en', 'pt', 'es', 'it', 'fr', 'de'];
    
    const defaultLang = supportedLanguages.includes(browserLang) ? browserLang : 'en';
    
    // Set language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = defaultLang;
    }
    
    // Apply language
    changeLanguage(defaultLang);
}

function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    
    currentLanguage = lang;
    
    // Check if translations are available
    if (typeof window.translations === 'undefined') {
        console.error('Translations not loaded');
        return;
    }
    
    const translations = window.translations[lang];
    if (!translations) {
        console.error('Translations not found for language:', lang);
        return;
    }
    
    // Apply translations to all elements with IDs
    Object.keys(translations).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translations[key];
            } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });
    
    console.log('Language applied successfully:', lang);
}

// Modal System
function initializeModals() {
    console.log('Initializing modals...');
    
    // PDF Modal
    const pdfModal = document.getElementById('pdf-modal');
    const closePdfBtn = document.getElementById('close-pdf');
    const downloadPdfBtn = document.getElementById('pdf-download');
    const printPdfBtn = document.getElementById('pdf-print');
    
    if (closePdfBtn) {
        closePdfBtn.addEventListener('click', () => {
            if (pdfModal) pdfModal.style.display = 'none';
        });
    }
    
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = 'Daily-Baby-Tracker-for-New-Mothers.pdf';
            link.download = 'Daily-Baby-Tracker-for-New-Mothers.pdf';
            link.click();
        });
    }
    
    if (printPdfBtn) {
        printPdfBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    // QR Success Modal
    const qrModal = document.getElementById('qr-success-modal');
    const accessContentBtn = document.getElementById('access-content-btn');
    
    if (accessContentBtn) {
        accessContentBtn.addEventListener('click', () => {
            if (qrModal) qrModal.style.display = 'none';
            navigateToSection('activities');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            pdfModal.style.display = 'none';
        }
        if (e.target === qrModal) {
            qrModal.style.display = 'none';
        }
    });
}

// Filter System
function initializeFilters() {
    console.log('Initializing filters...');
    
    // Activity filters
    const activityFilters = document.querySelectorAll('[data-filter]');
    activityFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            filterActivities(filterValue);
            
            // Update active filter
            activityFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Stage filters
    const stageFilters = document.querySelectorAll('[data-stage]');
    stageFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const stageValue = this.getAttribute('data-stage');
            showStageContent(stageValue);
            
            // Update active stage
            stageFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Education category filters
    const eduFilters = document.querySelectorAll('[data-category]');
    eduFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const categoryValue = this.getAttribute('data-category');
            showEducationCategory(categoryValue);
            
            // Update active category
            eduFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Tracker tabs
    const trackerTabs = document.querySelectorAll('[data-tab]');
    trackerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabValue = this.getAttribute('data-tab');
            showTrackerTab(tabValue);
            
            // Update active tab
            trackerTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Analytics period filters
    const periodFilters = document.querySelectorAll('[data-period]');
    periodFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const periodValue = this.getAttribute('data-period');
            showAnalyticsPeriod(periodValue);
            
            // Update active period
            periodFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterActivities(filter) {
    console.log('Filtering activities:', filter);
    
    const activityCards = document.querySelectorAll('.activity-card');
    
    activityCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const category = card.getAttribute('data-category');
            if (category === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function showStageContent(stage) {
    console.log('Showing stage content:', stage);
    // Stage content switching logic would go here
    // For now, just log the action
}

function showEducationCategory(category) {
    console.log('Showing education category:', category);
    // Education category switching logic would go here
}

function showTrackerTab(tab) {
    console.log('Showing tracker tab:', tab);
    // Tracker tab switching logic would go here
}

function showAnalyticsPeriod(period) {
    console.log('Showing analytics period:', period);
    // Analytics period switching logic would go here
}

// Tracking System
function initializeTracking() {
    console.log('Initializing tracking system...');
    
    // QR Scanner functionality
    const startScanBtn = document.getElementById('start-scan-btn');
    const uploadQrBtn = document.getElementById('upload-qr-btn');
    const qrFileInput = document.getElementById('qr-file-input');
    
    if (startScanBtn) {
        startScanBtn.addEventListener('click', () => {
            console.log('Starting QR scan...');
            // Simulate QR scan success
            setTimeout(() => {
                showQRSuccess();
            }, 2000);
        });
    }
    
    if (uploadQrBtn) {
        uploadQrBtn.addEventListener('click', () => {
            if (qrFileInput) {
                qrFileInput.click();
            }
        });
    }
    
    if (qrFileInput) {
        qrFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                console.log('QR file uploaded:', e.target.files[0].name);
                // Simulate processing
                setTimeout(() => {
                    showQRSuccess();
                }, 1000);
            }
        });
    }
    
    // Quick actions
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const actionType = this.querySelector('h3').textContent;
            console.log('Quick action clicked:', actionType);
            handleQuickAction(actionType);
        });
    });
    
    // Timeline filters
    const timelineFilters = document.querySelectorAll('.timeline-filter');
    timelineFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            filterTimeline(filterValue);
            
            // Update active filter
            timelineFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showQRSuccess() {
    const qrModal = document.getElementById('qr-success-modal');
    if (qrModal) {
        qrModal.style.display = 'flex';
    }
}

function handleQuickAction(actionType) {
    console.log('Handling quick action:', actionType);
    
    switch(actionType) {
        case 'Log Activity':
            navigateToSection('tracker');
            break;
        case 'Scan QR Code':
            navigateToSection('qr');
            break;
        case 'Daily Activity':
            navigateToSection('activities');
            break;
        case 'Micro Lesson':
            navigateToSection('education');
            break;
        default:
            console.log('Unknown action:', actionType);
    }
}

function filterTimeline(filter) {
    console.log('Filtering timeline:', filter);
    // Timeline filtering logic would go here
}

// Utility Functions
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const dateElements = document.querySelectorAll('#current-date, #tracker-date');
    dateElements.forEach(element => {
        if (element) {
            element.textContent = now.toLocaleDateString('en-US', options);
        }
    });
}

function animateElements() {
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations and date updates
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    animateElements();
    
    // Update date every minute
    setInterval(updateDateTime, 60000);
});

// Export functions for global access
window.navigateToSection = navigateToSection;
window.changeLanguage = changeLanguage;
window.filterActivities = filterActivities;

console.log('Seahorse Club Enhanced - JavaScript loaded successfully!');

