# Seahorse Club - Architecture Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Component Design](#component-design)
4. [Data Architecture](#data-architecture)
5. [Internationalization Architecture](#internationalization-architecture)
6. [Performance Architecture](#performance-architecture)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)

## System Overview

The Seahorse Club Baby Development Tracker is a client-side web application built using modern web technologies with a focus on performance, accessibility, and user experience. The architecture follows a modular, component-based design pattern that ensures maintainability and scalability.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  HTML5 Semantic Markup │ CSS3 Grid/Flexbox │ Font Awesome   │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Core App Logic │ Event Handling │ State Management        │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Translation Service │ Storage Service │ Analytics Service  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  localStorage │ Session Storage │ IndexedDB (future)       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Presentation** | HTML5, CSS3, Font Awesome | User interface and visual design |
| **Application** | Vanilla JavaScript ES6+ | Core application logic |
| **Services** | Custom JavaScript modules | Business logic and utilities |
| **Data** | Browser localStorage | Client-side data persistence |
| **Build** | None (vanilla approach) | Direct browser execution |

## Frontend Architecture

### Module Structure

The frontend follows a modular architecture with clear separation of concerns:

```javascript
// Core Application Module
const SeahorseApp = {
  // Application state
  state: {
    currentSection: 'home',
    currentLanguage: 'en',
    currentDate: new Date(),
    trackerData: {},
    userProfile: {}
  },
  
  // Core methods
  init: function() { /* initialization logic */ },
  render: function() { /* rendering logic */ },
  update: function() { /* state update logic */ }
};

// Translation Module
const TranslationService = {
  translations: { /* language objects */ },
  currentLanguage: 'en',
  translate: function(key) { /* translation logic */ },
  changeLanguage: function(lang) { /* language switching */ }
};

// Storage Module
const StorageService = {
  save: function(key, data) { /* save to localStorage */ },
  load: function(key) { /* load from localStorage */ },
  clear: function() { /* clear storage */ }
};
```

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── LanguageSelector
│   ├── NotificationButton
│   ├── ProfileButton
│   └── Navigation
├── Main
│   ├── HomeSection
│   │   ├── HeroSection
│   │   ├── BabyProfile
│   │   ├── TodaySummary
│   │   ├── QuickActions
│   │   └── Insights
│   ├── QRScannerSection
│   │   ├── ScannerArea
│   │   ├── ScanResult
│   │   └── InfoCard
│   ├── LearningHubSection
│   │   ├── CycleSelector
│   │   └── CycleContent
│   ├── ActivitiesSection
│   │   ├── ActivityFilters
│   │   └── ActivityGrid
│   ├── EducationSection
│   │   ├── EducationTabs
│   │   └── EducationContent
│   ├── TrackerSection
│   │   ├── TrackerNavigation
│   │   ├── TrackerTabs
│   │   └── TrackerContent
│   └── AnalyticsSection
│       ├── AnalyticsFilters
│       └── AnalyticsGrid
└── Modals
    ├── ActivityModal
    ├── PDFModal
    └── NotificationsPanel
```

### Event System

The application uses a custom event system for component communication:

```javascript
// Event dispatcher
const EventBus = {
  events: {},
  
  on: function(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  
  emit: function(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  },
  
  off: function(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
};

// Usage example
EventBus.on('language-changed', function(newLanguage) {
  updateUI(newLanguage);
  saveLanguagePreference(newLanguage);
});

EventBus.emit('language-changed', 'es');
```

## Component Design

### Component Lifecycle

Each component follows a standardized lifecycle:

1. **Initialization**: Component setup and event binding
2. **Rendering**: DOM manipulation and content generation
3. **Update**: State changes and re-rendering
4. **Cleanup**: Event unbinding and resource cleanup

```javascript
// Component base class
class Component {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.state = {};
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.render();
  }
  
  bindEvents() {
    // Event binding logic
  }
  
  render() {
    // Rendering logic
  }
  
  update(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }
  
  destroy() {
    // Cleanup logic
  }
}

// Example component implementation
class TrackerComponent extends Component {
  init() {
    super.init();
    this.loadTrackerData();
  }
  
  bindEvents() {
    this.element.addEventListener('click', this.handleClick.bind(this));
    EventBus.on('date-changed', this.handleDateChange.bind(this));
  }
  
  render() {
    this.element.innerHTML = this.generateHTML();
    this.attachSubComponents();
  }
  
  handleClick(event) {
    // Click handling logic
  }
  
  handleDateChange(newDate) {
    this.update({ currentDate: newDate });
  }
}
```

### State Management

The application uses a centralized state management pattern:

```javascript
// Global state manager
const StateManager = {
  state: {
    user: {
      language: 'en',
      preferences: {}
    },
    baby: {
      profile: {},
      milestones: {},
      currentCycle: '3-6'
    },
    tracker: {
      currentDate: new Date(),
      data: {}
    },
    ui: {
      currentSection: 'home',
      modals: {},
      notifications: []
    }
  },
  
  subscribers: [],
  
  subscribe: function(callback) {
    this.subscribers.push(callback);
  },
  
  unsubscribe: function(callback) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  },
  
  setState: function(path, value) {
    // Deep set state value
    this.setNestedProperty(this.state, path, value);
    this.notifySubscribers();
    this.persistState();
  },
  
  getState: function(path) {
    // Deep get state value
    return this.getNestedProperty(this.state, path);
  },
  
  notifySubscribers: function() {
    this.subscribers.forEach(callback => callback(this.state));
  },
  
  persistState: function() {
    localStorage.setItem('seahorse-state', JSON.stringify(this.state));
  },
  
  loadState: function() {
    const saved = localStorage.getItem('seahorse-state');
    if (saved) {
      this.state = { ...this.state, ...JSON.parse(saved) };
    }
  }
};
```

## Data Architecture

### Data Models

The application uses well-defined data models for consistency:

```javascript
// Baby Profile Model
const BabyProfile = {
  id: String,
  name: String,
  birthDate: Date,
  gender: String, // 'male', 'female', 'other'
  currentCycle: String, // '0-3', '3-6', '6-9', '9-12'
  milestones: {
    [milestoneId]: {
      achieved: Boolean,
      achievedDate: Date,
      expectedDate: Date,
      notes: String
    }
  },
  preferences: {
    units: String, // 'metric', 'imperial'
    timezone: String,
    notifications: Boolean
  }
};

// Tracker Entry Model
const TrackerEntry = {
  id: String,
  date: Date,
  type: String, // 'sleep', 'feeding', 'diaper', 'mood', 'health'
  data: {
    // Type-specific data structure
    sleep: {
      startTime: String,
      endTime: String,
      duration: Number, // minutes
      quality: String, // 'deep', 'light', 'restless'
      location: String,
      notes: String
    },
    feeding: {
      time: String,
      type: String, // 'breast-left', 'breast-right', 'formula', 'solid'
      duration: Number, // minutes
      amount: Number, // ml/oz
      notes: String
    },
    diaper: {
      time: String,
      wet: Boolean,
      dirty: Boolean,
      color: String,
      consistency: String,
      notes: String
    },
    mood: {
      timeSlot: String,
      mood: String, // 'happy', 'content', 'fussy', 'crying', 'sleeping'
      intensity: Number, // 1-5 scale
      triggers: Array,
      notes: String
    },
    health: {
      time: String,
      type: String, // 'temperature', 'weight', 'length', 'medication'
      value: Number,
      unit: String,
      notes: String
    }
  },
  createdAt: Date,
  updatedAt: Date
};

// Activity Model
const Activity = {
  id: String,
  name: String,
  description: String,
  category: String, // 'sensory', 'motor', 'cognitive', 'social'
  ageRange: {
    min: Number, // weeks
    max: Number  // weeks
  },
  duration: Number, // minutes
  difficulty: String, // 'easy', 'medium', 'hard'
  materials: Array,
  instructions: Array,
  benefits: Array,
  tips: Array,
  variations: Array
};
```

### Data Validation

All data inputs are validated using a comprehensive validation system:

```javascript
// Validation rules
const ValidationRules = {
  required: (value) => value !== null && value !== undefined && value !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  date: (value) => !isNaN(Date.parse(value)),
  number: (value) => !isNaN(parseFloat(value)),
  range: (min, max) => (value) => value >= min && value <= max,
  length: (min, max) => (value) => value.length >= min && value.length <= max,
  pattern: (regex) => (value) => regex.test(value)
};

// Validator class
class Validator {
  constructor(rules) {
    this.rules = rules;
  }
  
  validate(data) {
    const errors = {};
    
    for (const field in this.rules) {
      const fieldRules = this.rules[field];
      const value = data[field];
      
      for (const rule of fieldRules) {
        if (!rule.validator(value)) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(rule.message);
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Usage example
const sleepEntryValidator = new Validator({
  startTime: [
    { validator: ValidationRules.required, message: 'Start time is required' },
    { validator: ValidationRules.pattern(/^\d{2}:\d{2}$/), message: 'Invalid time format' }
  ],
  quality: [
    { validator: ValidationRules.required, message: 'Sleep quality is required' },
    { validator: (value) => ['deep', 'light', 'restless'].includes(value), message: 'Invalid quality value' }
  ]
});
```

### Data Persistence

The application uses a layered persistence strategy:

```javascript
// Storage abstraction layer
class StorageAdapter {
  constructor(storageType = 'localStorage') {
    this.storage = window[storageType];
  }
  
  async save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      this.storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  }
  
  async load(key) {
    try {
      const serialized = this.storage.getItem(key);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error('Storage load error:', error);
      return null;
    }
  }
  
  async remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }
  
  async clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }
}

// Data repository pattern
class TrackerRepository {
  constructor() {
    this.storage = new StorageAdapter('localStorage');
    this.cache = new Map();
  }
  
  async saveEntry(entry) {
    // Validate entry
    const validation = this.validateEntry(entry);
    if (!validation.isValid) {
      throw new Error('Invalid entry data');
    }
    
    // Generate ID if not provided
    if (!entry.id) {
      entry.id = this.generateId();
    }
    
    // Add timestamps
    entry.createdAt = entry.createdAt || new Date();
    entry.updatedAt = new Date();
    
    // Save to storage
    const key = `tracker-entry-${entry.id}`;
    await this.storage.save(key, entry);
    
    // Update cache
    this.cache.set(entry.id, entry);
    
    return entry;
  }
  
  async loadEntry(id) {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    
    // Load from storage
    const key = `tracker-entry-${id}`;
    const entry = await this.storage.load(key);
    
    if (entry) {
      this.cache.set(id, entry);
    }
    
    return entry;
  }
  
  async loadEntriesByDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    const entries = [];
    
    // This would be more efficient with IndexedDB
    // For localStorage, we need to iterate through all keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('tracker-entry-')) {
        const entry = await this.loadEntry(key.replace('tracker-entry-', ''));
        if (entry && entry.date.startsWith(dateStr)) {
          entries.push(entry);
        }
      }
    }
    
    return entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}
```

## Internationalization Architecture

### Translation System

The internationalization system is built for scalability and performance:

```javascript
// Translation loader
class TranslationLoader {
  constructor() {
    this.cache = new Map();
    this.fallbackLanguage = 'en';
  }
  
  async loadTranslations(language) {
    if (this.cache.has(language)) {
      return this.cache.get(language);
    }
    
    try {
      // In a real application, this would load from external files
      const translations = await this.fetchTranslations(language);
      this.cache.set(language, translations);
      return translations;
    } catch (error) {
      console.warn(`Failed to load translations for ${language}, falling back to ${this.fallbackLanguage}`);
      return this.loadTranslations(this.fallbackLanguage);
    }
  }
  
  async fetchTranslations(language) {
    // This would typically fetch from a JSON file or API
    return translations[language] || translations[this.fallbackLanguage];
  }
}

// Translation interpolation
class TranslationInterpolator {
  interpolate(template, variables = {}) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }
  
  pluralize(template, count, variables = {}) {
    const forms = template.split('|');
    let form;
    
    if (count === 0 && forms[2]) {
      form = forms[2]; // zero form
    } else if (count === 1) {
      form = forms[0]; // singular form
    } else {
      form = forms[1] || forms[0]; // plural form
    }
    
    return this.interpolate(form, { ...variables, count });
  }
}

// Main translation service
class TranslationService {
  constructor() {
    this.loader = new TranslationLoader();
    this.interpolator = new TranslationInterpolator();
    this.currentLanguage = 'en';
    this.translations = {};
  }
  
  async setLanguage(language) {
    this.translations = await this.loader.loadTranslations(language);
    this.currentLanguage = language;
    this.notifyLanguageChange();
  }
  
  translate(key, variables = {}) {
    const keys = key.split('.');
    let value = this.translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value === 'string') {
      return this.interpolator.interpolate(value, variables);
    }
    
    return key;
  }
  
  translatePlural(key, count, variables = {}) {
    const template = this.translate(key, variables);
    return this.interpolator.pluralize(template, count, variables);
  }
  
  notifyLanguageChange() {
    EventBus.emit('language-changed', {
      language: this.currentLanguage,
      translations: this.translations
    });
  }
}
```

### Locale-Specific Formatting

```javascript
// Locale formatting service
class LocaleService {
  constructor(language = 'en') {
    this.language = language;
    this.locale = this.getLocale(language);
  }
  
  getLocale(language) {
    const localeMap = {
      'en': 'en-US',
      'es': 'es-ES',
      'pt': 'pt-BR',
      'it': 'it-IT',
      'fr': 'fr-FR',
      'de': 'de-DE'
    };
    return localeMap[language] || 'en-US';
  }
  
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat(this.locale, { ...defaultOptions, ...options })
      .format(new Date(date));
  }
  
  formatTime(date, options = {}) {
    const defaultOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat(this.locale, { ...defaultOptions, ...options })
      .format(new Date(date));
  }
  
  formatNumber(number, options = {}) {
    return new Intl.NumberFormat(this.locale, options).format(number);
  }
  
  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return this.translate('duration.hours_minutes', { hours, minutes: mins });
    } else {
      return this.translate('duration.minutes', { minutes: mins });
    }
  }
}
```

## Performance Architecture

### Optimization Strategies

The application implements several performance optimization strategies:

#### 1. Lazy Loading

```javascript
// Lazy component loader
class LazyLoader {
  constructor() {
    this.loadedComponents = new Set();
    this.observers = new Map();
  }
  
  observeComponent(element, componentName) {
    if (this.loadedComponents.has(componentName)) {
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadComponent(componentName, entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(element);
    this.observers.set(componentName, observer);
  }
  
  async loadComponent(componentName, element) {
    try {
      const component = await import(`./components/${componentName}.js`);
      component.default.init(element);
      this.loadedComponents.add(componentName);
    } catch (error) {
      console.error(`Failed to load component ${componentName}:`, error);
    }
  }
}
```

#### 2. Virtual Scrolling

```javascript
// Virtual scroll implementation for large lists
class VirtualScroll {
  constructor(container, itemHeight, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.renderItem = renderItem;
    this.items = [];
    this.visibleItems = [];
    this.scrollTop = 0;
    this.containerHeight = container.clientHeight;
    
    this.init();
  }
  
  init() {
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  setItems(items) {
    this.items = items;
    this.updateVisibleItems();
    this.render();
  }
  
  handleScroll() {
    this.scrollTop = this.container.scrollTop;
    this.updateVisibleItems();
    this.render();
  }
  
  handleResize() {
    this.containerHeight = this.container.clientHeight;
    this.updateVisibleItems();
    this.render();
  }
  
  updateVisibleItems() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.containerHeight / this.itemHeight) + 1,
      this.items.length
    );
    
    this.visibleItems = this.items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }
  
  render() {
    const totalHeight = this.items.length * this.itemHeight;
    const offsetY = this.visibleItems.length > 0 ? this.visibleItems[0].index * this.itemHeight : 0;
    
    this.container.innerHTML = `
      <div style="height: ${totalHeight}px; position: relative;">
        <div style="transform: translateY(${offsetY}px);">
          ${this.visibleItems.map(({ item, index }) => this.renderItem(item, index)).join('')}
        </div>
      </div>
    `;
  }
}
```

#### 3. Debouncing and Throttling

```javascript
// Performance utilities
class PerformanceUtils {
  static debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }
  
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  static memoize(func, keyGenerator = (...args) => JSON.stringify(args)) {
    const cache = new Map();
    return function(...args) {
      const key = keyGenerator(...args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }
}

// Usage examples
const debouncedSearch = PerformanceUtils.debounce(searchActivities, 300);
const throttledScroll = PerformanceUtils.throttle(handleScroll, 16); // ~60fps
const memoizedTranslation = PerformanceUtils.memoize(translateText);
```

## Security Architecture

### Client-Side Security Measures

```javascript
// Content Security Policy helper
class CSPHelper {
  static generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }
  
  static sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
  
  static validateURL(url) {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}

// Input sanitization
class InputSanitizer {
  static sanitizeText(input) {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  static sanitizeNumber(input, min = -Infinity, max = Infinity) {
    const num = parseFloat(input);
    if (isNaN(num)) return null;
    return Math.max(min, Math.min(max, num));
  }
  
  static sanitizeDate(input) {
    const date = new Date(input);
    if (isNaN(date.getTime())) return null;
    
    // Reasonable date range for baby tracking
    const minDate = new Date('2020-01-01');
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    if (date < minDate || date > maxDate) return null;
    return date;
  }
}

// Data encryption for sensitive information
class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
  }
  
  async generateKey() {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  async encrypt(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    
    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv
      },
      key,
      encodedData
    );
    
    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }
  
  async decrypt(encryptedData, key) {
    const { encrypted, iv } = encryptedData;
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: new Uint8Array(iv)
      },
      key,
      new Uint8Array(encrypted)
    );
    
    const decodedData = new TextDecoder().decode(decrypted);
    return JSON.parse(decodedData);
  }
}
```

## Deployment Architecture

### Build Process

```javascript
// Build configuration
const BuildConfig = {
  development: {
    minify: false,
    sourceMaps: true,
    debug: true,
    apiUrl: 'http://localhost:3000'
  },
  
  staging: {
    minify: true,
    sourceMaps: true,
    debug: false,
    apiUrl: 'https://staging-api.seahorseclub.com'
  },
  
  production: {
    minify: true,
    sourceMaps: false,
    debug: false,
    apiUrl: 'https://api.seahorseclub.com'
  }
};

// Environment detection
class Environment {
  static detect() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    } else if (hostname.includes('staging')) {
      return 'staging';
    } else {
      return 'production';
    }
  }
  
  static getConfig() {
    const env = this.detect();
    return BuildConfig[env];
  }
}
```

### Deployment Strategies

#### 1. Static Site Deployment

```yaml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. CDN Configuration

```javascript
// CDN optimization
class CDNOptimizer {
  static optimizeAssets() {
    // Preload critical resources
    const criticalResources = [
      '/styles.css',
      '/app.js',
      '/translations.js'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }
  
  static enableServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    }
  }
}
```

### Monitoring and Analytics

```javascript
// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    // Core Web Vitals
    this.measureCLS();
    this.measureFID();
    this.measureLCP();
    
    // Custom metrics
    this.measureLoadTime();
    this.measureInteractionTime();
  }
  
  measureCLS() {
    let clsValue = 0;
    let clsEntries = [];
    
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      }
      this.metrics.cls = clsValue;
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
  }
  
  measureFID() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime;
      }
    });
    
    observer.observe({ type: 'first-input', buffered: true });
  }
  
  measureLCP() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }
  
  measureLoadTime() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
    });
  }
  
  measureInteractionTime() {
    const startTime = performance.now();
    
    document.addEventListener('click', () => {
      const interactionTime = performance.now() - startTime;
      this.metrics.timeToInteraction = interactionTime;
    }, { once: true });
  }
  
  getMetrics() {
    return this.metrics;
  }
  
  sendMetrics() {
    // Send metrics to analytics service
    if (this.shouldSendMetrics()) {
      fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.metrics)
      });
    }
  }
  
  shouldSendMetrics() {
    return Environment.getConfig().debug === false;
  }
}
```

This architecture documentation provides a comprehensive overview of the Seahorse Club application's technical design, ensuring maintainability, scalability, and performance while adhering to modern web development best practices.

