# GitHub Setup Commands

## Step 1: Authenticate GitHub CLI
```bash
gh auth login
```

## Step 2: Create Repository and Push
```bash
cd "d:\antigravity projects\drive-school"
gh repo create drive-school --public --source=. --remote=origin --description "A Next.js-based landing page and booking system for a driving training center" --push
```

## Step 3: Create GitHub Project
```bash
gh project create --title "Drive School Landing Page" --body "Project board for driving school landing page development" --public
```

## Step 4: Create Milestones
```bash
# Phase 1: Frontend UI
gh api repos/:owner/:repo/milestones -X POST -f title="Phase 1: Frontend UI Components" -f description="Build landing page UI, booking flow, and admin interface" -f due_on="2026-02-15T00:00:00Z"

# Phase 2: Backend
gh api repos/:owner/:repo/milestones -X POST -f title="Phase 2: Backend Implementation" -f description="Database models, Firebase Auth, API routes, business logic" -f due_on="2026-02-28T00:00:00Z"

# Phase 3: Third-Party Integrations
gh api repos/:owner/:repo/milestones -X POST -f title="Phase 3: Third-Party Integrations" -f description="Google Calendar, Email (Nodemailer), Analytics" -f due_on="2026-03-15T00:00:00Z"

# Phase 4: Testing
gh api repos/:owner/:repo/milestones -X POST -f title="Phase 4: Testing" -f description="Unit tests, integration tests, E2E tests" -f due_on="2026-03-25T00:00:00Z"

# Phase 5: Deployment
gh api repos/:owner/:repo/milestones -X POST -f title="Phase 5: Deployment" -f description="Deploy to Vercel, configure environment variables, production testing" -f due_on="2026-03-31T00:00:00Z"
```

## Step 5: Create Issues

### Phase 1 Issues
```bash
# Landing Page Components
gh issue create --title "Build Landing Page Hero Section" --body "Create hero section with headline, CTA button, and trust indicators" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

gh issue create --title "Build Packages Section" --body "Create package cards for 15 days, 1 month, and pay-as-you-go plans" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

gh issue create --title "Build Testimonials Section" --body "Create testimonials video section with carousel/grid layout" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

gh issue create --title "Build Videos Section" --body "Create driving videos showcase with video player" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

gh issue create --title "Build Reviews Section" --body "Integrate Google Maps Reviews (150+ reviews)" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

# Booking Flow Components
gh issue create --title "Build Package Selector Component" --body "Create package selection with add to cart functionality" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

gh issue create --title "Build Booking Form Component" --body "Create booking form with Firebase Auth integration (email/password and Google OAuth)" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

gh issue create --title "Build Time Slot Picker Component" --body "Create time slot picker (7am-11:59am, exclude Fridays)" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

gh issue create --title "Build Booking Confirmation Component" --body "Create booking confirmation page with summary and next steps" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"

# Admin Interface
gh issue create --title "Build Admin Booking List Component" --body "Create admin interface to view and manage pending bookings" --milestone "Phase 1: Frontend UI Components" --label "enhancement,frontend"
```

### Phase 2 Issues
```bash
# Database Models
gh issue create --title "Create User Model" --body "Create Mongoose User model with Firebase UID, email, phone" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Create Booking Model" --body "Create Mongoose Booking model with user reference, package, time slot, status" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Create Package Model" --body "Create Mongoose Package model with name, duration, price" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

# Firebase Auth
gh issue create --title "Set up Firebase Client Configuration" --body "Initialize Firebase Auth client with email/password and Google OAuth providers" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Set up Firebase Admin SDK" --body "Initialize Firebase Admin SDK for server-side token verification" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Create Auth Context and Hooks" --body "Create React context and custom hooks for Firebase Auth state management" --milestone "Phase 2: Backend Implementation" --label "enhancement,frontend"

# API Routes
gh issue create --title "Create Auth Verify API Route" --body "Create /api/auth/verify endpoint for Firebase token verification" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Create Booking Create API Route" --body "Create /api/booking/create endpoint with validation and business logic" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Create Booking Slots API Route" --body "Create /api/booking/slots endpoint to get available time slots" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Create Admin Confirm API Route" --body "Create /api/admin/confirm endpoint for admin to confirm/reject bookings" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

# Business Logic
gh issue create --title "Implement Time Slot Validation" --body "Create utility functions for time slot validation (7am-11:59am, exclude Fridays)" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"

gh issue create --title "Implement Booking Status Workflow" --body "Create logic for booking status transitions (pending → confirmed/rejected)" --milestone "Phase 2: Backend Implementation" --label "enhancement,backend"
```

### Phase 3 Issues
```bash
# Google Calendar
gh issue create --title "Set up Google Calendar API Integration" --body "Initialize Google Calendar API client and service" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Implement Calendar Availability Check" --body "Create endpoint to check available time slots from Google Calendar" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Implement Calendar Event Creation" --body "Create calendar events when bookings are confirmed" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

# Email
gh issue create --title "Set up Nodemailer Email Service" --body "Configure Nodemailer with SMTP settings" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Create Email Templates" --body "Create email templates for booking confirmation and meetup address" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Implement Booking Confirmation Email" --body "Send email when booking is created" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Implement Meetup Address Email" --body "Send meetup address email when booking is confirmed" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

# Analytics
gh issue create --title "Set up Google Analytics 4" --body "Integrate Google Analytics 4 tracking" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Set up Meta Pixel" --body "Integrate Meta Pixel for Facebook/Instagram tracking" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Implement Meta Conversion API" --body "Set up server-side conversion tracking with Meta Conversion API" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"

gh issue create --title "Implement Analytics Event Tracking" --body "Track page views, package selections, booking completions, and sales" --milestone "Phase 3: Third-Party Integrations" --label "enhancement,integration"
```

### Phase 4 Issues
```bash
gh issue create --title "Write Unit Tests for Business Logic" --body "Create unit tests for time slot validation, booking status transitions, etc." --milestone "Phase 4: Testing" --label "enhancement,testing"

gh issue create --title "Write Integration Tests" --body "Create integration tests for booking flow and admin confirmation" --milestone "Phase 4: Testing" --label "enhancement,testing"

gh issue create --title "Write E2E Tests" --body "Create end-to-end tests for complete user journey" --milestone "Phase 4: Testing" --label "enhancement,testing"
```

### Phase 5 Issues
```bash
gh issue create --title "Set up Vercel Deployment" --body "Configure Vercel project and deployment settings" --milestone "Phase 5: Deployment" --label "enhancement,deployment"

gh issue create --title "Configure Environment Variables" --body "Set up all environment variables in Vercel" --milestone "Phase 5: Deployment" --label "enhancement,deployment"

gh issue create --title "Production Testing and Optimization" --body "Test production build, optimize performance, verify all features" --milestone "Phase 5: Deployment" --label "enhancement,deployment"
```
