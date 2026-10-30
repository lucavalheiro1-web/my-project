# Seahorse Club - Deployment Guide

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Static Hosting Deployment](#static-hosting-deployment)
4. [CDN Configuration](#cdn-configuration)
5. [Domain and SSL Setup](#domain-and-ssl-setup)
6. [Performance Optimization](#performance-optimization)
7. [Monitoring and Analytics](#monitoring-and-analytics)
8. [Backup and Recovery](#backup-and-recovery)
9. [Troubleshooting](#troubleshooting)

## Deployment Overview

The Seahorse Club Baby Development Tracker is a client-side web application that can be deployed to any static hosting service. This guide covers multiple deployment strategies, from simple static hosting to enterprise-grade CDN deployments.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    CDN Layer                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Cloudflare │ │   AWS       │ │   Google    │           │
│  │   Edge       │ │   CloudFront│ │   Cloud CDN │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Origin Server                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Netlify   │ │   Vercel    │ │   GitHub    │           │
│  │             │ │             │ │   Pages     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Supported Deployment Platforms

| Platform | Difficulty | Cost | Features | Best For |
|----------|------------|------|----------|----------|
| **Netlify** | Easy | Free/Paid | Auto-deploy, Forms, Functions | Small to medium projects |
| **Vercel** | Easy | Free/Paid | Auto-deploy, Edge Functions | React/Next.js projects |
| **GitHub Pages** | Easy | Free | Git integration | Open source projects |
| **AWS S3 + CloudFront** | Medium | Pay-as-go | Full AWS ecosystem | Enterprise applications |
| **Google Cloud Storage** | Medium | Pay-as-go | Google Cloud integration | Google ecosystem |
| **Azure Static Web Apps** | Medium | Free/Paid | Azure integration | Microsoft ecosystem |

## Pre-Deployment Checklist

### Code Quality Verification

```bash
# 1. Run linting checks
npm run lint

# 2. Run tests (if available)
npm run test

# 3. Check for security vulnerabilities
npm audit

# 4. Validate HTML
# Use W3C Markup Validator or html-validate

# 5. Check accessibility
# Use axe-core or Lighthouse accessibility audit

# 6. Performance audit
# Use Lighthouse or WebPageTest
```

### File Optimization

```bash
# 1. Minify CSS (if not using build tools)
npx clean-css-cli -o styles.min.css styles.css

# 2. Minify JavaScript (if not using build tools)
npx terser app.js -o app.min.js

# 3. Optimize images
npx imagemin "*.{jpg,png}" --out-dir=optimized

# 4. Compress files
gzip -k *.{html,css,js}
```

### Environment Configuration

Create environment-specific configuration files:

```javascript
// config/production.js
const productionConfig = {
  environment: 'production',
  debug: false,
  analytics: {
    enabled: true,
    trackingId: 'GA_TRACKING_ID'
  },
  api: {
    baseUrl: 'https://api.seahorseclub.com'
  },
  features: {
    serviceWorker: true,
    offlineMode: true
  }
};

// config/staging.js
const stagingConfig = {
  environment: 'staging',
  debug: true,
  analytics: {
    enabled: false
  },
  api: {
    baseUrl: 'https://staging-api.seahorseclub.com'
  },
  features: {
    serviceWorker: false,
    offlineMode: false
  }
};
```

### Security Headers Configuration

```javascript
// security-headers.js
const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'"
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=(self)',
    'microphone=()',
    'geolocation=()',
    'payment=()'
  ].join(', ')
};
```

## Static Hosting Deployment

### Netlify Deployment

#### Method 1: Drag and Drop

1. **Build the project** (if using build tools):
   ```bash
   npm run build
   ```

2. **Visit Netlify Dashboard**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up or log in
   - Drag and drop your project folder

3. **Configure settings**:
   - Set custom domain (optional)
   - Configure redirects and headers

#### Method 2: Git Integration

1. **Create `netlify.toml`**:
   ```toml
   [build]
     publish = "."
     command = "echo 'No build command needed for static site'"
   
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
   
   [[headers]]
     for = "*.css"
     [headers.values]
       Cache-Control = "public, max-age=31536000"
   
   [[headers]]
     for = "*.js"
     [headers.values]
       Cache-Control = "public, max-age=31536000"
   
   [[headers]]
     for = "*.pdf"
     [headers.values]
       Cache-Control = "public, max-age=86400"
   ```

2. **Connect Git repository**:
   - Push code to GitHub/GitLab/Bitbucket
   - Connect repository in Netlify dashboard
   - Configure auto-deploy on push

### Vercel Deployment

#### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to configure project
```

#### Method 2: Git Integration

1. **Create `vercel.json`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "**/*",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "X-XSS-Protection",
             "value": "1; mode=block"
           }
         ]
       }
     ]
   }
   ```

2. **Connect repository**:
   - Import project from Git in Vercel dashboard
   - Configure deployment settings

### GitHub Pages Deployment

#### Method 1: GitHub Actions

1. **Create `.github/workflows/deploy.yml`**:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       
       steps:
       - name: Checkout
         uses: actions/checkout@v3
       
       - name: Setup Node.js
         uses: actions/setup-node@v3
         with:
           node-version: '18'
           cache: 'npm'
       
       - name: Install dependencies
         run: npm ci
       
       - name: Build
         run: npm run build
       
       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         if: github.ref == 'refs/heads/main'
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

2. **Configure GitHub Pages**:
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as source
   - Push to main branch to trigger deployment

#### Method 2: Direct Upload

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Select "Deploy from a branch"
   - Choose main branch and root folder

2. **Upload files**:
   - Commit and push all files to main branch
   - GitHub Pages will automatically serve the content

### AWS S3 + CloudFront Deployment

#### Step 1: Create S3 Bucket

```bash
# Create S3 bucket
aws s3 mb s3://seahorse-club-app

# Configure bucket for static website hosting
aws s3 website s3://seahorse-club-app \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public read access
aws s3api put-bucket-policy \
  --bucket seahorse-club-app \
  --policy file://bucket-policy.json
```

**bucket-policy.json**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::seahorse-club-app/*"
    }
  ]
}
```

#### Step 2: Upload Files

```bash
# Sync files to S3
aws s3 sync . s3://seahorse-club-app \
  --exclude "*.git/*" \
  --exclude "node_modules/*" \
  --exclude "*.md" \
  --cache-control "public, max-age=31536000" \
  --metadata-directive REPLACE

# Set specific cache control for HTML files
aws s3 cp index.html s3://seahorse-club-app/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --metadata-directive REPLACE
```

#### Step 3: Create CloudFront Distribution

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json**:
```json
{
  "CallerReference": "seahorse-club-2024",
  "Comment": "Seahorse Club Baby Tracker",
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-seahorse-club-app",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-seahorse-club-app",
        "DomainName": "seahorse-club-app.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_All"
}
```

## CDN Configuration

### Cloudflare Setup

1. **Add Domain to Cloudflare**:
   - Sign up at cloudflare.com
   - Add your domain
   - Update nameservers at your domain registrar

2. **Configure Page Rules**:
   ```
   Rule 1: *.seahorseclub.com/*
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month
   - Browser Cache TTL: 1 month
   
   Rule 2: seahorseclub.com/index.html
   - Cache Level: Bypass
   - Browser Cache TTL: 2 hours
   ```

3. **Enable Security Features**:
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - HSTS: Enable
   - Security Level: Medium
   - Bot Fight Mode: On

### Cache Optimization

```javascript
// Service Worker for advanced caching
const CACHE_NAME = 'seahorse-club-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/translations.js',
  '/Daily-Baby-Tracker-for-New-Mothers.pdf'
];

const CACHE_STRATEGIES = {
  // Cache first for static assets
  static: 'cache-first',
  // Network first for API calls
  api: 'network-first',
  // Stale while revalidate for images
  images: 'stale-while-revalidate'
};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different types of requests
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  } else if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(fetch(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetch(request);
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match(request);
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(response => {
    const cache = caches.open(CACHE_NAME);
    cache.then(c => c.put(request, response.clone()));
    return response;
  });
  
  return cached || fetchPromise;
}
```

## Domain and SSL Setup

### Custom Domain Configuration

#### DNS Configuration

```
# A Records (for root domain)
Type: A
Name: @
Value: [Your hosting provider's IP]
TTL: 300

# CNAME Records (for www subdomain)
Type: CNAME
Name: www
Value: your-site.netlify.app
TTL: 300

# CNAME for CDN
Type: CNAME
Name: cdn
Value: your-distribution.cloudfront.net
TTL: 300
```

#### SSL Certificate Setup

**Let's Encrypt (Free)**:
```bash
# Using Certbot
sudo certbot --nginx -d seahorseclub.com -d www.seahorseclub.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

**Cloudflare SSL**:
- Automatic SSL provisioning
- Universal SSL certificates
- Advanced Certificate Manager (paid)

### HTTPS Enforcement

```nginx
# Nginx configuration
server {
    listen 80;
    server_name seahorseclub.com www.seahorseclub.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seahorseclub.com www.seahorseclub.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Serve static files
    location / {
        root /var/www/seahorse-club;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Don't cache HTML files
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
}
```

## Performance Optimization

### Image Optimization

```bash
# Install optimization tools
npm install -g imagemin-cli imagemin-webp imagemin-avif

# Convert images to modern formats
imagemin images/*.{jpg,png} --out-dir=images/optimized --plugin=webp
imagemin images/*.{jpg,png} --out-dir=images/optimized --plugin=avif

# Generate responsive images
for file in images/*.jpg; do
  convert "$file" -resize 320x "${file%.*}-320w.jpg"
  convert "$file" -resize 640x "${file%.*}-640w.jpg"
  convert "$file" -resize 1024x "${file%.*}-1024w.jpg"
done
```

### Code Splitting Implementation

```javascript
// Dynamic imports for code splitting
class ComponentLoader {
  constructor() {
    this.loadedComponents = new Map();
  }
  
  async loadComponent(name) {
    if (this.loadedComponents.has(name)) {
      return this.loadedComponents.get(name);
    }
    
    try {
      const module = await import(`./components/${name}.js`);
      this.loadedComponents.set(name, module.default);
      return module.default;
    } catch (error) {
      console.error(`Failed to load component ${name}:`, error);
      throw error;
    }
  }
  
  async loadOnIntersection(element, componentName) {
    const observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          try {
            const Component = await this.loadComponent(componentName);
            Component.init(entry.target);
            observer.unobserve(entry.target);
          } catch (error) {
            console.error('Component loading failed:', error);
          }
        }
      }
    }, { threshold: 0.1 });
    
    observer.observe(element);
  }
}

// Usage
const loader = new ComponentLoader();

// Load components when they come into view
document.querySelectorAll('[data-component]').forEach(element => {
  const componentName = element.dataset.component;
  loader.loadOnIntersection(element, componentName);
});
```

### Resource Preloading

```html
<!-- Critical resource preloading -->
<link rel="preload" href="/styles.css" as="style">
<link rel="preload" href="/app.js" as="script">
<link rel="preload" href="/translations.js" as="script">

<!-- Font preloading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style">

<!-- Prefetch for likely next pages -->
<link rel="prefetch" href="/tracker">
<link rel="prefetch" href="/activities">

<!-- DNS prefetch for external resources -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//fonts.gstatic.com">
```

## Monitoring and Analytics

### Performance Monitoring

```javascript
// Core Web Vitals monitoring
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    this.observeCLS();
    this.observeFID();
    this.observeLCP();
    this.observeFCP();
    this.observeTTFB();
  }
  
  observeCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.cls = clsValue;
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
  }
  
  observeFID() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.fid = entry.processingStart - entry.startTime;
      }
    });
    
    observer.observe({ type: 'first-input', buffered: true });
  }
  
  observeLCP() {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }
  
  observeFCP() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
        }
      }
    });
    
    observer.observe({ type: 'paint', buffered: true });
  }
  
  observeTTFB() {
    const observer = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.ttfb = entry.responseStart - entry.requestStart;
      }
    });
    
    observer.observe({ type: 'navigation', buffered: true });
  }
  
  getMetrics() {
    return this.metrics;
  }
  
  sendMetrics() {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      Object.entries(this.metrics).forEach(([metric, value]) => {
        gtag('event', metric, {
          event_category: 'Web Vitals',
          value: Math.round(value),
          non_interaction: true
        });
      });
    }
  }
}

// Initialize monitoring
const monitor = new PerformanceMonitor();

// Send metrics after page load
window.addEventListener('load', () => {
  setTimeout(() => monitor.sendMetrics(), 1000);
});
```

### Error Tracking

```javascript
// Error tracking and reporting
class ErrorTracker {
  constructor() {
    this.init();
  }
  
  init() {
    // Global error handler
    window.addEventListener('error', this.handleError.bind(this));
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    
    // Custom error reporting
    this.setupCustomErrorReporting();
  }
  
  handleError(event) {
    const error = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.reportError(error);
  }
  
  handlePromiseRejection(event) {
    const error = {
      message: event.reason?.message || 'Unhandled Promise Rejection',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.reportError(error);
  }
  
  setupCustomErrorReporting() {
    // Override console.error to capture custom errors
    const originalError = console.error;
    console.error = (...args) => {
      originalError.apply(console, args);
      
      const error = {
        message: args.join(' '),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        type: 'console.error'
      };
      
      this.reportError(error);
    };
  }
  
  reportError(error) {
    // Store locally for debugging
    const errors = JSON.parse(localStorage.getItem('app-errors') || '[]');
    errors.push(error);
    
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.splice(0, errors.length - 50);
    }
    
    localStorage.setItem('app-errors', JSON.stringify(errors));
    
    // Send to external service (if configured)
    if (this.shouldReportError(error)) {
      this.sendToErrorService(error);
    }
  }
  
  shouldReportError(error) {
    // Don't report errors in development
    if (window.location.hostname === 'localhost') {
      return false;
    }
    
    // Don't report certain types of errors
    const ignoredMessages = [
      'Script error',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded'
    ];
    
    return !ignoredMessages.some(msg => error.message.includes(msg));
  }
  
  async sendToErrorService(error) {
    try {
      // Example: Send to Sentry, LogRocket, or custom endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      });
    } catch (e) {
      // Silently fail - don't create error loops
      console.warn('Failed to report error:', e);
    }
  }
}

// Initialize error tracking
new ErrorTracker();
```

### Analytics Integration

```javascript
// Google Analytics 4 integration
function initializeAnalytics() {
  // Load GA4
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID', {
    // Enhanced measurement
    enhanced_measurement: true,
    // Custom parameters
    custom_map: {
      'custom_parameter_1': 'baby_age_weeks'
    }
  });
  
  // Track custom events
  trackCustomEvents();
}

function trackCustomEvents() {
  // Track tracker entries
  document.addEventListener('tracker-entry-added', (event) => {
    gtag('event', 'tracker_entry_added', {
      event_category: 'engagement',
      event_label: event.detail.type,
      value: 1
    });
  });
  
  // Track milestone achievements
  document.addEventListener('milestone-achieved', (event) => {
    gtag('event', 'milestone_achieved', {
      event_category: 'engagement',
      event_label: event.detail.milestone,
      baby_age_weeks: event.detail.ageWeeks
    });
  });
  
  // Track QR code scans
  document.addEventListener('qr-code-scanned', (event) => {
    gtag('event', 'qr_code_scanned', {
      event_category: 'engagement',
      event_label: 'subscription_box',
      value: 1
    });
  });
  
  // Track language changes
  document.addEventListener('language-changed', (event) => {
    gtag('event', 'language_changed', {
      event_category: 'user_preference',
      event_label: event.detail.language
    });
  });
}

// Initialize if not in development
if (window.location.hostname !== 'localhost') {
  initializeAnalytics();
}
```

## Backup and Recovery

### Automated Backup Strategy

```bash
#!/bin/bash
# backup-deployment.sh

# Configuration
BACKUP_DIR="/backups/seahorse-club"
S3_BUCKET="seahorse-club-backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="seahorse-club-backup-$DATE"

# Create backup directory
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

# Backup source code
git archive --format=tar.gz --output="$BACKUP_DIR/$BACKUP_NAME/source-code.tar.gz" HEAD

# Backup configuration files
cp -r config/ "$BACKUP_DIR/$BACKUP_NAME/"
cp netlify.toml "$BACKUP_DIR/$BACKUP_NAME/"
cp vercel.json "$BACKUP_DIR/$BACKUP_NAME/"

# Create deployment manifest
cat > "$BACKUP_DIR/$BACKUP_NAME/deployment-manifest.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "$(git rev-parse HEAD)",
  "branch": "$(git rev-parse --abbrev-ref HEAD)",
  "environment": "$ENVIRONMENT",
  "files": [
    $(find . -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.pdf" | jq -R . | paste -sd,)
  ]
}
EOF

# Compress backup
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" "s3://$S3_BUCKET/deployments/"

# Clean up local backup
rm -rf "$BACKUP_DIR/$BACKUP_NAME"

# Keep only last 30 backups
aws s3 ls "s3://$S3_BUCKET/deployments/" | sort | head -n -30 | awk '{print $4}' | xargs -I {} aws s3 rm "s3://$S3_BUCKET/deployments/{}"

echo "Backup completed: $BACKUP_NAME.tar.gz"
```

### Disaster Recovery Plan

```bash
#!/bin/bash
# disaster-recovery.sh

# Configuration
BACKUP_S3_BUCKET="seahorse-club-backups"
RECOVERY_DIR="/tmp/seahorse-club-recovery"
DEPLOYMENT_TARGET="production"

# Function to restore from backup
restore_from_backup() {
  local backup_name=$1
  
  echo "Starting disaster recovery process..."
  echo "Restoring from backup: $backup_name"
  
  # Create recovery directory
  mkdir -p "$RECOVERY_DIR"
  cd "$RECOVERY_DIR"
  
  # Download backup from S3
  aws s3 cp "s3://$BACKUP_S3_BUCKET/deployments/$backup_name" .
  
  # Extract backup
  tar -xzf "$backup_name"
  
  # Get backup directory name
  backup_dir=$(basename "$backup_name" .tar.gz)
  cd "$backup_dir"
  
  # Extract source code
  tar -xzf source-code.tar.gz
  
  # Verify backup integrity
  if [ ! -f "index.html" ] || [ ! -f "app.js" ]; then
    echo "ERROR: Backup appears to be corrupted"
    exit 1
  fi
  
  # Deploy to staging first for verification
  echo "Deploying to staging for verification..."
  deploy_to_staging
  
  # Wait for user confirmation
  read -p "Staging deployment successful. Deploy to production? (y/N): " confirm
  if [[ $confirm == [yY] ]]; then
    deploy_to_production
  else
    echo "Recovery cancelled by user"
    exit 1
  fi
  
  # Clean up
  cd /
  rm -rf "$RECOVERY_DIR"
  
  echo "Disaster recovery completed successfully"
}

deploy_to_staging() {
  # Deploy to staging environment
  netlify deploy --dir=. --site=staging-site-id
}

deploy_to_production() {
  # Deploy to production environment
  netlify deploy --dir=. --site=production-site-id --prod
}

# List available backups
list_backups() {
  echo "Available backups:"
  aws s3 ls "s3://$BACKUP_S3_BUCKET/deployments/" | awk '{print $4}' | sort -r | head -20
}

# Main script
case "$1" in
  "list")
    list_backups
    ;;
  "restore")
    if [ -z "$2" ]; then
      echo "Usage: $0 restore <backup-name>"
      echo "Use '$0 list' to see available backups"
      exit 1
    fi
    restore_from_backup "$2"
    ;;
  *)
    echo "Usage: $0 {list|restore <backup-name>}"
    exit 1
    ;;
esac
```

## Troubleshooting

### Common Deployment Issues

#### Issue 1: Build Failures

**Symptoms**:
- Deployment fails during build process
- Missing dependencies errors
- Build timeout errors

**Solutions**:
```bash
# Check Node.js version compatibility
node --version
npm --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for security vulnerabilities
npm audit
npm audit fix

# Increase build timeout (Netlify)
# Add to netlify.toml:
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"
```

#### Issue 2: SSL Certificate Problems

**Symptoms**:
- SSL certificate not provisioning
- Mixed content warnings
- Certificate expiration errors

**Solutions**:
```bash
# Force SSL certificate renewal (Let's Encrypt)
sudo certbot renew --force-renewal

# Check certificate status
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Verify DNS propagation
dig yourdomain.com
nslookup yourdomain.com

# Check for mixed content
# Use browser dev tools or online tools like:
# https://www.whynopadlock.com/
```

#### Issue 3: Performance Issues

**Symptoms**:
- Slow page load times
- Poor Core Web Vitals scores
- High bounce rates

**Solutions**:
```bash
# Analyze bundle size
npx webpack-bundle-analyzer dist/static/js/*.js

# Optimize images
npx imagemin src/images/* --out-dir=dist/images

# Enable compression
# Add to .htaccess (Apache):
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Check Core Web Vitals
npx lighthouse https://yourdomain.com --view
```

#### Issue 4: Caching Problems

**Symptoms**:
- Old content still showing after deployment
- CSS/JS not updating
- Inconsistent behavior across users

**Solutions**:
```bash
# Clear CDN cache (Cloudflare)
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "Authorization: Bearer API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Add cache busting to assets
# Update file names with hash:
# styles.css -> styles.abc123.css
# app.js -> app.def456.js

# Set proper cache headers
# For static assets (1 year):
Cache-Control: public, max-age=31536000, immutable

# For HTML files (no cache):
Cache-Control: no-cache, no-store, must-revalidate
```

### Monitoring and Alerting

```bash
# Health check script
#!/bin/bash
# health-check.sh

DOMAIN="https://seahorseclub.com"
ALERT_EMAIL="admin@seahorseclub.com"

# Check if site is accessible
response=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN")

if [ "$response" != "200" ]; then
  echo "ALERT: Site is down! HTTP status: $response"
  echo "Site is down! HTTP status: $response" | mail -s "Site Down Alert" "$ALERT_EMAIL"
  exit 1
fi

# Check Core Web Vitals
lighthouse_score=$(npx lighthouse "$DOMAIN" --output=json --quiet | jq '.categories.performance.score')

if (( $(echo "$lighthouse_score < 0.9" | bc -l) )); then
  echo "WARNING: Performance score below 90%: $lighthouse_score"
  echo "Performance degraded: $lighthouse_score" | mail -s "Performance Alert" "$ALERT_EMAIL"
fi

# Check SSL certificate expiration
cert_expiry=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
expiry_timestamp=$(date -d "$cert_expiry" +%s)
current_timestamp=$(date +%s)
days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))

if [ "$days_until_expiry" -lt 30 ]; then
  echo "WARNING: SSL certificate expires in $days_until_expiry days"
  echo "SSL certificate expires in $days_until_expiry days" | mail -s "SSL Expiry Alert" "$ALERT_EMAIL"
fi

echo "Health check completed successfully"
```

### Rollback Procedures

```bash
#!/bin/bash
# rollback.sh

# Configuration
CURRENT_DEPLOYMENT_ID=""
PREVIOUS_DEPLOYMENT_ID=""
SITE_ID="your-netlify-site-id"

# Function to rollback Netlify deployment
rollback_netlify() {
  echo "Rolling back Netlify deployment..."
  
  # Get current deployment
  current=$(netlify api listSiteDeploys --data='{"site_id":"'$SITE_ID'"}' | jq -r '.[0].id')
  
  # Get previous successful deployment
  previous=$(netlify api listSiteDeploys --data='{"site_id":"'$SITE_ID'"}' | jq -r '.[] | select(.state=="ready") | .id' | sed -n '2p')
  
  if [ -z "$previous" ]; then
    echo "ERROR: No previous deployment found"
    exit 1
  fi
  
  # Restore previous deployment
  netlify api restoreSiteDeploy --data='{"site_id":"'$SITE_ID'","deploy_id":"'$previous'"}'
  
  echo "Rollback completed. Previous deployment $previous is now live."
}

# Function to rollback Vercel deployment
rollback_vercel() {
  echo "Rolling back Vercel deployment..."
  
  # Get deployments
  deployments=$(vercel ls --json)
  
  # Get previous deployment URL
  previous_url=$(echo "$deployments" | jq -r '.[1].url')
  
  if [ -z "$previous_url" ]; then
    echo "ERROR: No previous deployment found"
    exit 1
  fi
  
  # Promote previous deployment
  vercel promote "$previous_url"
  
  echo "Rollback completed. Previous deployment is now live."
}

# Function to rollback AWS S3 + CloudFront
rollback_aws() {
  echo "Rolling back AWS deployment..."
  
  # Restore from backup
  aws s3 sync "s3://seahorse-club-backups/previous-deployment/" "s3://seahorse-club-app/" --delete
  
  # Invalidate CloudFront cache
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
  
  echo "Rollback completed. Cache invalidation in progress."
}

# Main rollback logic
case "$1" in
  "netlify")
    rollback_netlify
    ;;
  "vercel")
    rollback_vercel
    ;;
  "aws")
    rollback_aws
    ;;
  *)
    echo "Usage: $0 {netlify|vercel|aws}"
    exit 1
    ;;
esac

# Send notification
echo "Rollback completed at $(date)" | mail -s "Deployment Rollback Notification" "admin@seahorseclub.com"
```

This comprehensive deployment guide ensures that the Seahorse Club application can be successfully deployed, monitored, and maintained across various hosting platforms while maintaining high performance, security, and reliability standards.

