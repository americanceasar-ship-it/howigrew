# HowiGrew.com - Administrator Operation Manual

## Table of Contents
1. [System Overview](#system-overview)
2. [Admin Dashboard Access](#admin-dashboard-access)
3. [User Management](#user-management)
4. [Course Management](#course-management)
5. [Video Management](#video-management)
6. [Payment & Subscription Management](#payment--subscription-management)
7. [Community Management](#community-management)
8. [Analytics & Monitoring](#analytics--monitoring)
9. [System Commands](#system-commands)
10. [Security Features](#security-features)
11. [Troubleshooting](#troubleshooting)
12. [API Endpoints Reference](#api-endpoints-reference)

---

## System Overview

HowiGrew.com is a comprehensive Learning Management System (LMS) designed for global real estate education, specifically focused on wholesaling methodologies. The platform provides:

- **Multi-language support**: 6 languages including Mandarin Chinese
- **Real-time analytics**: Platform statistics and user engagement tracking
- **Advanced user management**: Role-based access control (Student, Instructor, Admin, Mentor)
- **Subscription management**: Multiple membership tiers with Stripe integration
- **Community features**: Forums, webinars, mentorship system
- **Course delivery**: Video lessons, progress tracking, certificates

### Technology Stack
- **Frontend**: React 18 with TypeScript, Wouter routing, TanStack Query
- **Backend**: Node.js with Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM (hosted on Neon Database)
- **Payments**: Stripe integration for subscriptions and payments
- **Authentication**: JWT-based with secure session management
- **Monitoring**: Comprehensive security and performance monitoring

---

## Admin Dashboard Access

### Login Requirements
- **Admin Role**: Must have `role: "admin"` in the users table
- **URL**: `/admin-dashboard`
- **Authentication**: JWT token required in localStorage as `auth_token`

### Dashboard Sections
1. **Overview**: Real-time statistics and key metrics
2. **User Management**: Search, create, edit, and manage users
3. **Analytics**: Detailed platform analytics and performance metrics
4. **Security Audit**: Security monitoring and threat assessment
5. **Course Management**: Create and manage courses (if instructor role)
6. **System Metrics**: Server performance and resource monitoring

---

## User Management

### User Search & Filtering
Access the database search functionality to find users:

**Search Criteria:**
- **Text Search**: Name, email, or ID
- **Role Filter**: All, Student, Instructor, Admin, Mentor
- **Membership Filter**: All, Basic, Premium, Lifetime
- **Status Filter**: Active/Inactive users

**Commands:**
```bash
# Access via API
GET /api/admin/database?search=john&role=student&membershipType=premium&limit=50
```

### User Creation
Create new users with specific roles and memberships:

**Required Fields:**
- Name (minimum 2 characters)
- Email (must be unique)
- Password (minimum 6 characters)
- Role (student, instructor, admin, mentor)
- Membership Type (basic, premium, lifetime)
- Email Verification Status

**API Endpoint:**
```bash
POST /api/admin/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "hashed_password",
  "role": "student",
  "membershipType": "premium",
  "emailVerified": true,
  "isActive": true
}
```

### User Modification
Edit existing user accounts:

**Editable Fields:**
- Name and contact information
- Role assignment (with restrictions)
- Membership type upgrade/downgrade
- Account status (active/inactive)
- Email verification status

**Safety Features:**
- Admins cannot demote themselves
- Admins cannot delete their own accounts
- All changes are logged for audit trail

**API Endpoint:**
```bash
PATCH /api/admin/users/{userId}
Authorization: Bearer <admin_token>
```

### User Deletion
**Soft Delete System**: Users are deactivated rather than permanently deleted.

**Command:**
```bash
DELETE /api/admin/users/{userId}
Authorization: Bearer <admin_token>
```

---

## Course Management

### Course Structure
**Hierarchy:**
1. **Courses**: Top-level learning containers
2. **Sections**: Grouped lessons within courses
3. **Lessons**: Individual learning units with video/text content
4. **Progress Tracking**: Per-user completion tracking

### Course Creation & Management
**Course Properties:**
- Title, description, and thumbnails
- Instructor assignment
- Difficulty level (Beginner, Intermediate, Advanced)
- Pricing and currency
- Language and subtitle support
- Publishing status (Draft, Published, Archived)

**Access Control:**
- Public/Private visibility
- Membership tier requirements
- Individual lesson access (Free/Premium)

### Course Analytics
Track course performance:
- Enrollment numbers
- Completion rates
- Average ratings
- Revenue generated
- User engagement metrics

---

## Video Management

### YouTube Integration Overview
The platform uses YouTube as the primary video hosting service for all course content. This provides:
- **Optimized Performance**: YouTube's global CDN ensures fast video delivery worldwide
- **Mobile Optimization**: Automatic quality adaptation and mobile-friendly playback
- **SEO Benefits**: Videos on your YouTube channel improve search rankings and discoverability
- **Cost Efficiency**: No bandwidth or storage costs for video hosting
- **Accessibility**: Built-in captions, keyboard navigation, and screen reader support

### Video Upload Process

#### Step 1: Upload to YouTube
1. **Access YouTube Studio**: Go to [studio.youtube.com](https://studio.youtube.com)
2. **Create/Upload Video**: Click "CREATE" → "Upload Video"
3. **Configure Video Settings**:
   - **Title**: Use descriptive titles like "Real Estate Wholesaling - Lesson 1: Market Analysis"
   - **Description**: Include course name, lesson number, and key learning points
   - **Visibility**: Set to "Unlisted" for course content (prevents random discovery while allowing direct access)
   - **Thumbnail**: Upload custom thumbnails that match your course branding
   - **End Screens**: Add end screens to promote other lessons or encourage subscriptions

#### Step 2: Get YouTube URL
1. **Copy Video URL**: After upload, copy the full YouTube URL
   - Format: `https://www.youtube.com/watch?v=VIDEO_ID`
   - Example: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

#### Step 3: Add Video to Course Lesson

**Via Admin Dashboard:**
1. **Navigate**: Go to `/admin-dashboard` → "Course Management"
2. **Select Course**: Click "Manage Content" on the target course
3. **Edit Lesson**: Click "Edit" on the lesson you want to add video to
4. **Add Video URL**: 
   - Locate the "Video URL" field in the lesson form
   - Paste the complete YouTube URL
   - Ensure the URL is valid and accessible

**Via Course Creation Form:**
1. **Navigate**: Go to `/admin-dashboard` → "Create New Course"
2. **Create Sections**: Add course sections using the section management tools
3. **Add Lessons**: For each lesson:
   - Enter lesson title and description
   - Paste YouTube URL in the "Video URL (optional)" field
   - Set duration (in minutes)
   - Mark as "Free Preview" if applicable

### Video URL Format Requirements

**Supported YouTube URL Formats:**
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

**Database Storage:**
- Field: `videoUrl` (VARCHAR, nullable)
- Validation: Must be a valid URL format
- Processing: System automatically extracts video ID for player integration

### Interactive Video Features

The platform enhances YouTube videos with interactive learning elements:

#### Chapter Navigation
- **Automatic Chapters**: System creates chapters based on lesson duration
- **Custom Timestamps**: Add specific chapter markers in lesson notes
- **Jump Navigation**: Students can click to jump to specific video timestamps

#### Contextual Learning Notes
- **Timed Notes**: Add notes that appear at specific video timestamps
- **Note Types**: 
  - Tips (yellow): General advice and best practices
  - Important (red): Critical information to remember
  - Definitions (blue): Technical term explanations
  - Examples (green): Real-world case studies

#### Progress Tracking
- **Video Completion**: Tracks percentage watched (unlocks quiz at 90%)
- **Chapter Progress**: Individual chapter completion tracking
- **Time Spent**: Records actual viewing time for analytics

#### Quiz Integration
- **Auto-Unlock**: Quiz becomes available after 90% video completion
- **Immediate Feedback**: Students get instant results and explanations
- **Progress Requirements**: Must pass quiz to mark lesson as complete

### Adding Interactive Elements

#### Method 1: Via Lesson Content Editor
1. **Edit Lesson**: Access lesson editing in Course Management
2. **Add Notes Section**: Use the rich text editor to add timestamped notes:
```markdown
**Important Note at 2:30**: Remember to always verify property ownership before making offers.

**Definition at 5:45**: ARV (After Repair Value) - The estimated value of a property after all repairs and improvements are completed.
```

#### Method 2: Via Database Updates
For advanced users, interactive elements can be added directly via API:

```bash
# Add lesson notes
PATCH /api/courses/{courseId}/lessons/{lessonId}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "notes": [
    {
      "timestamp": 150,
      "type": "tip",
      "title": "Pro Tip",
      "content": "Always research comparable sales in the area",
      "autoShow": true
    }
  ]
}
```

### Video Performance Analytics

#### YouTube Analytics Integration
Monitor video performance through:
1. **YouTube Studio**: Native analytics for views, engagement, retention
2. **Platform Analytics**: Completion rates, quiz scores, student progress
3. **Combined Metrics**: Correlation between video engagement and course completion

#### Key Metrics to Track
- **Video Completion Rate**: Percentage of students who finish videos
- **Average View Duration**: How long students actually watch
- **Chapter Drop-off Points**: Where students tend to stop watching
- **Quiz Performance**: Correlation between video watching and quiz scores
- **Engagement Patterns**: Peak viewing times and devices used

### Video Content Guidelines

#### Technical Specifications
- **Resolution**: Minimum 1080p (1920x1080) for professional quality
- **Aspect Ratio**: 16:9 widescreen format
- **Audio Quality**: Clear, consistent audio levels throughout
- **Length Guidelines**: 10-15 minutes optimal (current lessons are 20-45 min - consider breaking into shorter segments)

#### Content Structure Recommendations
1. **Introduction** (30 seconds): Lesson overview and objectives
2. **Main Content** (8-12 minutes): Core teaching material with examples
3. **Summary** (1-2 minutes): Key takeaways and next steps
4. **Call-to-Action** (30 seconds): Encourage completion of lesson quiz

#### SEO Optimization for YouTube
- **Keywords**: Include relevant real estate and wholesaling terms in titles/descriptions
- **Consistency**: Upload videos on a regular schedule
- **Engagement**: Encourage comments and interaction to boost algorithm performance
- **Playlists**: Organize videos into course-specific playlists on your channel

### Troubleshooting Video Issues

#### Common Problems and Solutions

**Video Not Loading:**
- Verify YouTube URL is correct and video is not private
- Check if video is region-restricted
- Ensure video is not deleted from YouTube

**Poor Video Quality:**
- YouTube automatically adjusts quality based on connection speed
- Students can manually select quality in YouTube player settings
- Consider uploading higher resolution source videos

**Interactive Elements Not Showing:**
- Check if lesson has associated notes in the database
- Verify timestamps are within video duration
- Ensure user has proper access permissions

**Progress Not Tracking:**
- Confirm video URL is properly formatted in database
- Check if student is logged in with valid session
- Verify progress tracking API endpoints are functioning

#### Diagnostic Commands
```bash
# Check lesson video configuration
GET /api/courses/{courseId}/lessons/{lessonId}
Authorization: Bearer <admin_token>

# Verify video URL accessibility
curl -I "https://www.youtube.com/watch?v=VIDEO_ID"

# Test progress tracking
POST /api/student/lessons/{lessonId}/progress
Authorization: Bearer <student_token>
Content-Type: application/json
{
  "status": "in_progress",
  "progressPercentage": 50
}
```

### Video Management Best Practices

#### Content Organization
1. **Consistent Naming**: Use clear, descriptive video titles that match lesson names
2. **Logical Sequence**: Ensure video order matches course lesson progression
3. **Version Control**: Keep backup copies of video files for re-uploading if needed
4. **Accessibility**: Add closed captions for all videos (YouTube auto-generates, but manual review recommended)

#### Student Engagement Optimization
1. **Hook Early**: Capture attention in first 15 seconds
2. **Visual Variety**: Use screen sharing, slides, and real examples
3. **Interactive Prompts**: Pause points where students should take notes or practice
4. **Clear CTAs**: Direct students to complete quizzes and move to next lessons

#### Performance Monitoring
1. **Weekly Review**: Check completion rates and drop-off points
2. **Student Feedback**: Monitor quiz performance to identify confusing topics
3. **Content Updates**: Replace or supplement videos with poor engagement
4. **Analytics Correlation**: Compare YouTube metrics with platform completion data

---

## Payment & Subscription Management

### Stripe Integration
**Configuration Required:**
- `STRIPE_SECRET_KEY` environment variable
- Webhook endpoints configured in Stripe dashboard

### Membership Tiers
1. **Basic**: Free access to limited content
2. **Premium**: Monthly/annual subscription with full access
3. **Lifetime**: One-time payment for permanent access

### Promotional Codes
**Code Types:**
- **Course Access**: Free access to specific courses
- **Membership Upgrade**: Free membership tier upgrades
- **Discount Codes**: Percentage or fixed amount discounts

**Management Commands:**
```bash
# Create promotional code
POST /api/admin/promotional-codes
{
  "code": "WELCOME50",
  "type": "discount",
  "discountType": "percentage",
  "discountValue": 50,
  "maxUses": 100,
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### Direct Membership Grants
Grant access without requiring payment:
- Course access grants
- Membership upgrades
- Partnership agreements
- Review incentives

---

## Community Management

### Forum System
**Post Types:**
- General discussions
- Course-specific questions
- Success stories
- Q&A sessions

**Moderation Features:**
- Post approval system
- User reporting
- Content filtering
- Pinned posts

### Webinar Management
**Webinar Features:**
- Scheduled live sessions
- Attendee registration limits
- Automatic reminder systems
- Recording availability

**Commands:**
```bash
# Create webinar
POST /api/webinars
{
  "title": "Market Analysis Masterclass",
  "description": "Learn advanced property analysis techniques",
  "scheduledDate": "2024-03-15T18:00:00Z",
  "duration": 90,
  "maxAttendees": 100
}
```

### Mentorship System
**Mentor Management:**
- Mentor profile verification
- Session scheduling system
- Rating and review system
- Payment processing

**Access Requirements:**
- Premium, All-Access, or Lifetime membership required
- Background-checked mentors only

---

## Analytics & Monitoring

### Platform Statistics
**Real-time Metrics:**
- Total registered users
- Active enrollments
- Course completion rates
- Revenue analytics
- Global reach (countries served)
- Support availability status

**API Access:**
```bash
GET /api/platform-stats
# Returns live statistics with 2-minute cache
```

### User Analytics
**Tracking Data:**
- Login frequency and patterns
- Course progression
- Engagement metrics
- Support ticket history
- Payment history

### Security Monitoring
**Automated Alerts:**
- Failed login attempts
- Unusual access patterns
- High memory usage
- Slow query performance
- Error rate spikes

---

## System Commands

### Database Operations
**Schema Management:**
```bash
# Push schema changes to database
npm run db:push

# View database structure
# Access via /api/admin/database endpoint
```

### Application Control
**Development Mode:**
```bash
# Start development server
npm run dev

# Server runs on port 5000 (frontend + backend)
# Environment: NODE_ENV=development
```

**Production Deployment:**
```bash
# Build application
npm run build

# Start production server
npm run start

# Environment: NODE_ENV=production
```

### Cache Management
**Cache Operations:**
```bash
# Cache warm-up (automatic in production)
# Platform stats cached for 2 minutes
# User sessions cached for 5 minutes
# Static assets cached with appropriate headers
```

### Monitoring Commands
**System Health:**
```bash
# Check API status
GET /api/status

# Get detailed metrics (admin only)
GET /api/metrics
Authorization: Bearer <admin_token>

# Security audit
GET /api/admin/security-audit
Authorization: Bearer <admin_token>
```

---

## Security Features

### Authentication & Authorization
**JWT Token System:**
- 24-hour token expiration
- Secure token storage
- Role-based access control
- Session management

### Rate Limiting
**Protection Levels:**
- **Authentication endpoints**: 5 attempts per 15 minutes
- **Admin endpoints**: Enhanced rate limiting
- **Upload endpoints**: File size and type restrictions
- **API endpoints**: General rate limiting

### Data Protection
**Security Measures:**
- Password hashing with bcrypt (12 rounds)
- SQL injection prevention via parameterized queries
- XSS protection with content security policies
- CORS configuration for secure cross-origin requests

### Monitoring & Logging
**Security Logging:**
- All admin actions logged
- Failed authentication attempts tracked
- Performance monitoring for anomalies
- Memory usage monitoring with automatic cleanup

---

## Troubleshooting

### Common Issues

#### High Memory Usage
**Symptoms:**
- Server responses slowing down
- Memory usage above 400MB

**Resolution:**
```bash
# Automatic garbage collection triggers at 400MB
# Manual garbage collection (if enabled):
# global.gc() called automatically

# Monitor memory:
GET /api/admin/system-metrics
```

#### Database Connection Issues
**Symptoms:**
- API returning 503 errors
- Database queries timing out

**Diagnostic Commands:**
```bash
# Check database status
GET /api/status

# Verify connection string
echo $DATABASE_URL
```

#### Authentication Problems
**Symptoms:**
- Users unable to log in
- Token validation failing

**Resolution:**
```bash
# Check JWT token format
# Verify user exists in database
# Check rate limiting status
# Review security logs
```

### Performance Optimization
**Slow Query Monitoring:**
- Queries over 2000ms automatically logged
- Database indexes optimized for common queries
- Pagination implemented for large result sets

**Cache Strategy:**
- Platform statistics: 2-minute cache
- Static assets: Browser caching enabled
- Database queries: Intelligent caching middleware

---

## API Endpoints Reference

### Authentication Endpoints
```bash
POST /api/auth/register      # User registration
POST /api/auth/login         # User login
POST /api/auth/logout        # User logout
POST /api/auth/verify-email  # Email verification
POST /api/auth/forgot-password    # Password reset request
POST /api/auth/reset-password     # Password reset confirmation
GET  /api/auth/me           # Get current user info
```

### Admin Endpoints
```bash
GET    /api/admin/users           # List all users
POST   /api/admin/users           # Create new user
PATCH  /api/admin/users/{id}      # Update user
DELETE /api/admin/users/{id}      # Delete user (soft delete)
GET    /api/admin/database        # Search database
GET    /api/admin/analytics       # Platform analytics
GET    /api/admin/security-audit  # Security report
GET    /api/admin/system-metrics  # System performance
```

### Course Endpoints
```bash
GET    /api/courses              # List courses
GET    /api/courses/{id}         # Get course details
POST   /api/courses              # Create course (instructor+)
PATCH  /api/courses/{id}         # Update course (instructor+)
DELETE /api/courses/{id}         # Delete course (admin)
GET    /api/courses/{id}/sections # Get course sections
GET    /api/courses/{id}/lessons  # Get course lessons
```

### Student Endpoints
```bash
GET    /api/student/enrollments           # User's enrollments
GET    /api/student/courses/{id}/content  # Course content
GET    /api/student/lessons/{id}/progress # Lesson progress
POST   /api/student/lessons/{id}/progress # Update progress
```

### Community Endpoints
```bash
GET    /api/community/posts         # Forum posts
POST   /api/community/posts         # Create post
GET    /api/webinars               # List webinars
POST   /api/webinars               # Create webinar (admin)
POST   /api/webinars/{id}/register # Register for webinar
```

### Mentorship Endpoints
```bash
GET    /api/mentors                    # List mentors
GET    /api/mentorship/sessions        # User's mentorship sessions
POST   /api/mentorship/book           # Book mentorship session
POST   /api/mentorship/feedback       # Submit session feedback
```

### File Upload Endpoints
```bash
POST   /api/upload/course-image       # Upload course images (instructor+)
GET    /api/files/{fileName}          # Serve uploaded files
```

### System Endpoints
```bash
GET    /api/status            # API health check
GET    /api/platform-stats    # Public platform statistics
GET    /api/metrics           # System metrics (admin only)
```

---

## Environment Variables

### Required Configuration
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key-here

# Payments
STRIPE_SECRET_KEY=sk_test_or_live_key

# Object Storage (optional)
PUBLIC_OBJECT_SEARCH_PATHS=/path/to/public/assets
PRIVATE_OBJECT_DIR=/path/to/private/files

# Email (for production)
EMAIL_SERVICE_API_KEY=your-email-service-key

# Environment
NODE_ENV=development|production
PORT=5000
```

### Security Configuration
```bash
# Session Security
SESSION_SECRET=secure-random-string

# Rate Limiting
MAX_AUTH_ATTEMPTS=5
RATE_LIMIT_WINDOW=900000  # 15 minutes

# File Upload Limits
MAX_FILE_SIZE=50MB  # For course images
MAX_REQUEST_SIZE=10MB  # For API requests
```

---

## Maintenance Procedures

### Daily Tasks
1. **Monitor system metrics** via `/api/admin/system-metrics`
2. **Review security audit** via `/api/admin/security-audit`
3. **Check error logs** for any critical issues
4. **Verify backup completion** (database backups)

### Weekly Tasks
1. **Review user analytics** and growth metrics
2. **Update course content** as needed
3. **Process mentor applications** and verifications
4. **Review and approve community posts** if moderation enabled

### Monthly Tasks
1. **Performance optimization** review
2. **Security patch updates** for dependencies
3. **Database maintenance** and optimization
4. **Content strategy review** based on analytics

---

## Support & Escalation

### Issue Severity Levels

**Critical (Immediate Response Required):**
- Complete system outage
- Security breach detected
- Payment processing failures
- Data corruption issues

**High (Within 4 hours):**
- Major feature unavailable
- Performance degradation affecting all users
- Authentication system issues

**Medium (Within 24 hours):**
- Minor feature issues
- Individual user problems
- Content upload problems

**Low (Within 72 hours):**
- Enhancement requests
- Documentation updates
- Cosmetic issues

### Contact Information
- **Technical Issues**: admin@howigrew.com
- **Security Concerns**: security@howigrew.com
- **Emergency Contact**: [Emergency contact method]

---

*This manual was generated on August 10, 2025. Please ensure you have the most current version before performing administrative tasks.*