# GitHub Setup Script for Drive School Project
# Run this after: gh auth login

Write-Host "Setting up GitHub repository, project, milestones, and issues..." -ForegroundColor Green

# Get current directory
$repoPath = Get-Location
$repoName = "drive-school"

# Step 1: Create Repository and Push
Write-Host "`nStep 1: Creating GitHub repository..." -ForegroundColor Yellow
gh repo create $repoName --public --source=. --remote=origin --description "A Next.js-based landing page and booking system for a driving training center" --push

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create repository. Make sure you're authenticated: gh auth login" -ForegroundColor Red
    exit 1
}

# Get owner from git remote
$remoteUrl = git remote get-url origin
if ($remoteUrl -match "github.com[:/]([^/]+)/") {
    $owner = $matches[1]
    Write-Host "Detected owner: $owner" -ForegroundColor Green
} else {
    Write-Host "Could not detect owner. Please set OWNER variable." -ForegroundColor Red
    exit 1
}

# Step 2: Create GitHub Project
Write-Host "`nStep 2: Creating GitHub project..." -ForegroundColor Yellow
$projectOutput = gh project create --title "Drive School Landing Page" --body "Project board for driving school landing page development" --public --format json
$projectId = ($projectOutput | ConvertFrom-Json).id
Write-Host "Created project with ID: $projectId" -ForegroundColor Green

# Step 3: Create Milestones
Write-Host "`nStep 3: Creating milestones..." -ForegroundColor Yellow

$milestones = @(
    @{title="Phase 1: Frontend UI Components"; description="Build landing page UI, booking flow, and admin interface"; due="2026-02-15"},
    @{title="Phase 2: Backend Implementation"; description="Database models, Firebase Auth, API routes, business logic"; due="2026-02-28"},
    @{title="Phase 3: Third-Party Integrations"; description="Google Calendar, Email (Nodemailer), Analytics"; due="2026-03-15"},
    @{title="Phase 4: Testing"; description="Unit tests, integration tests, E2E tests"; due="2026-03-25"},
    @{title="Phase 5: Deployment"; description="Deploy to Vercel, configure environment variables, production testing"; due="2026-03-31"}
)

$milestoneMap = @{}

foreach ($milestone in $milestones) {
    Write-Host "Creating milestone: $($milestone.title)" -ForegroundColor Cyan
    $milestoneJson = @{
        title = $milestone.title
        description = $milestone.description
        due_on = "$($milestone.due)T00:00:00Z"
    } | ConvertTo-Json
    
    $milestoneOutput = gh api repos/$owner/$repoName/milestones -X POST --input - <<< $milestoneJson
    $milestoneId = ($milestoneOutput | ConvertFrom-Json).number
    $milestoneMap[$milestone.title] = $milestoneId
    Write-Host "  Created milestone #$milestoneId" -ForegroundColor Green
}

# Step 4: Create Issues
Write-Host "`nStep 4: Creating issues..." -ForegroundColor Yellow

# Phase 1 Issues
$phase1Issues = @(
    @{title="Build Landing Page Hero Section"; body="Create hero section with headline, CTA button, and trust indicators"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Packages Section"; body="Create package cards for 15 days, 1 month, and pay-as-you-go plans"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Testimonials Section"; body="Create testimonials video section with carousel/grid layout"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Videos Section"; body="Create driving videos showcase with video player"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Reviews Section"; body="Integrate Google Maps Reviews (150+ reviews)"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Package Selector Component"; body="Create package selection with add to cart functionality"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Booking Form Component"; body="Create booking form with Firebase Auth integration (email/password and Google OAuth)"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Time Slot Picker Component"; body="Create time slot picker (7am-11:59am, exclude Fridays)"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Booking Confirmation Component"; body="Create booking confirmation page with summary and next steps"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"},
    @{title="Build Admin Booking List Component"; body="Create admin interface to view and manage pending bookings"; milestone="Phase 1: Frontend UI Components"; labels="enhancement,frontend"}
)

# Phase 2 Issues
$phase2Issues = @(
    @{title="Create User Model"; body="Create Mongoose User model with Firebase UID, email, phone"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Create Booking Model"; body="Create Mongoose Booking model with user reference, package, time slot, status"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Create Package Model"; body="Create Mongoose Package model with name, duration, price"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Set up Firebase Client Configuration"; body="Initialize Firebase Auth client with email/password and Google OAuth providers"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Set up Firebase Admin SDK"; body="Initialize Firebase Admin SDK for server-side token verification"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Create Auth Context and Hooks"; body="Create React context and custom hooks for Firebase Auth state management"; milestone="Phase 2: Backend Implementation"; labels="enhancement,frontend"},
    @{title="Create Auth Verify API Route"; body="Create /api/auth/verify endpoint for Firebase token verification"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Create Booking Create API Route"; body="Create /api/booking/create endpoint with validation and business logic"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Create Booking Slots API Route"; body="Create /api/booking/slots endpoint to get available time slots"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Create Admin Confirm API Route"; body="Create /api/admin/confirm endpoint for admin to confirm/reject bookings"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Implement Time Slot Validation"; body="Create utility functions for time slot validation (7am-11:59am, exclude Fridays)"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"},
    @{title="Implement Booking Status Workflow"; body="Create logic for booking status transitions (pending → confirmed/rejected)"; milestone="Phase 2: Backend Implementation"; labels="enhancement,backend"}
)

# Phase 3 Issues
$phase3Issues = @(
    @{title="Set up Google Calendar API Integration"; body="Initialize Google Calendar API client and service"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Implement Calendar Availability Check"; body="Create endpoint to check available time slots from Google Calendar"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Implement Calendar Event Creation"; body="Create calendar events when bookings are confirmed"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Set up Nodemailer Email Service"; body="Configure Nodemailer with SMTP settings"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Create Email Templates"; body="Create email templates for booking confirmation and meetup address"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Implement Booking Confirmation Email"; body="Send email when booking is created"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Implement Meetup Address Email"; body="Send meetup address email when booking is confirmed"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Set up Google Analytics 4"; body="Integrate Google Analytics 4 tracking"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Set up Meta Pixel"; body="Integrate Meta Pixel for Facebook/Instagram tracking"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Implement Meta Conversion API"; body="Set up server-side conversion tracking with Meta Conversion API"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"},
    @{title="Implement Analytics Event Tracking"; body="Track page views, package selections, booking completions, and sales"; milestone="Phase 3: Third-Party Integrations"; labels="enhancement,integration"}
)

# Phase 4 Issues
$phase4Issues = @(
    @{title="Write Unit Tests for Business Logic"; body="Create unit tests for time slot validation, booking status transitions, etc."; milestone="Phase 4: Testing"; labels="enhancement,testing"},
    @{title="Write Integration Tests"; body="Create integration tests for booking flow and admin confirmation"; milestone="Phase 4: Testing"; labels="enhancement,testing"},
    @{title="Write E2E Tests"; body="Create end-to-end tests for complete user journey"; milestone="Phase 4: Testing"; labels="enhancement,testing"}
)

# Phase 5 Issues
$phase5Issues = @(
    @{title="Set up Vercel Deployment"; body="Configure Vercel project and deployment settings"; milestone="Phase 5: Deployment"; labels="enhancement,deployment"},
    @{title="Configure Environment Variables"; body="Set up all environment variables in Vercel"; milestone="Phase 5: Deployment"; labels="enhancement,deployment"},
    @{title="Production Testing and Optimization"; body="Test production build, optimize performance, verify all features"; milestone="Phase 5: Deployment"; labels="enhancement,deployment"}
)

$allIssues = $phase1Issues + $phase2Issues + $phase3Issues + $phase4Issues + $phase5Issues

foreach ($issue in $allIssues) {
    $milestoneId = $milestoneMap[$issue.milestone]
    Write-Host "Creating issue: $($issue.title)" -ForegroundColor Cyan
    gh issue create --title $issue.title --body $issue.body --milestone $milestoneId --label $issue.labels --repo "$owner/$repoName"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Created issue" -ForegroundColor Green
    } else {
        Write-Host "  Failed to create issue" -ForegroundColor Red
    }
}

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "Repository: https://github.com/$owner/$repoName" -ForegroundColor Cyan
Write-Host "Project ID: $projectId" -ForegroundColor Cyan
