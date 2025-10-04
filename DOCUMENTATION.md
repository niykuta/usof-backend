# USOF Backend - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Challenge Based Learning Journey](#challenge-based-learning-journey)
3. [Architecture & Design](#architecture--design)
4. [Technology Stack](#technology-stack)
5. [Installation Guide](#installation-guide)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Security Implementation](#security-implementation)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## Project Overview

**USOF Backend** is a RESTful API for a question and answer platform designed for professional and enthusiast programmers. The project implements a StackOverflow-like system where users can share problems, provide solutions, and build their reputation through community engagement.

### Key Features
- ✅ User authentication & authorization with JWT
- ✅ Role-based access control (User/Admin)
- ✅ Post creation with multi-category support
- ✅ Nested commenting system
- ✅ Like/Dislike reactions on posts and comments
- ✅ User rating system based on engagement
- ✅ Favorites and subscriptions
- ✅ Real-time notifications
- ✅ Email verification & password reset
- ✅ Admin panel with full CRUD operations
- ✅ Advanced filtering, sorting, and pagination
- ✅ File upload support for avatars and images

### Repository
[https://github.com/niykuta/usof-backend](https://github.com/niykuta/usof-backend)

---

## Challenge Based Learning Journey

This section documents the development process following the Challenge-Based Learning methodology.

### Stage 1: Engage

**Essential Question**: *How to help people exchange knowledge effectively?*

During this phase, research was conducted on:
- Existing Q&A platforms (StackOverflow, Quora, Reddit)
- API design best practices
- Database design for social platforms
- Authentication & authorization patterns
- File storage strategies

**Key Decisions Made**:
1. **Database Choice**: MySQL was selected for its:
   - Relational data modeling (perfect for posts, comments, users)
   - ACID compliance for data integrity
   - Wide community support and documentation
   - Excellent performance with proper indexing

2. **Admin Panel**: Chose AdminJS because:
   - Out-of-the-box CRUD operations
   - Built-in authentication
   - Customizable interface
   - SQL database support

3. **Email Service**: Selected Resend for:
   - Modern API design
   - Reliable delivery
   - Good developer experience

### Stage 2: Investigate

**Architecture Planning**:
- Adopted MVC pattern for clear separation of concerns
- Implemented OOP with SOLID principles
- Designed RESTful API following industry standards
- Planned scalable database schema with proper relationships

**Technology Research**:
- **Express 5**: Latest version with improved performance and error handling
- **JWT**: Industry standard for stateless authentication
- **Bcrypt**: Secure password hashing with salt
- **Zod**: Runtime type validation for request data
- **Multer**: Robust file upload handling

**Database Design Decisions**:
- Separate tables for likes on posts vs. comments (better performance)
- Junction table for post-category many-to-many relationship
- Dedicated tables for favorites, subscriptions, and notifications
- Token storage tables for email verification and password resets

### Stage 3: Act - Basic Implementation

**Phase 1: Foundation**
```
✓ Project structure setup (MVC pattern)
✓ Database connection and initialization scripts
✓ Basic error handling middleware
✓ Environment configuration
```

**Phase 2: Authentication System**
```
✓ User registration with email verification
✓ Login with JWT access/refresh tokens
✓ Password reset functionality
✓ Token refresh mechanism
✓ Session management
```

**Phase 3: Core Entities**
```
✓ User CRUD operations
✓ Post management
✓ Comment system
✓ Category management
✓ Like/Dislike system
```

**Phase 4: Authorization & Roles**
```
✓ Role-based middleware
✓ Resource ownership validation
✓ Admin-only routes protection
✓ User self-modification restrictions
```

**Phase 5: Admin Panel**
```
✓ AdminJS integration
✓ All entities accessible
✓ Custom authentication
✓ Data visualization
```

### Stage 4: Act - Creative Enhancements

**Advanced Features Implemented**:

1. **Favorites System**
   - Users can bookmark posts
   - Quick access endpoint for favorite posts
   - Many-to-many relationship implementation

2. **Subscription & Notifications**
   - Subscribe to posts for updates
   - Notifications on post changes
   - Notifications on new comments
   - Mark as read functionality
   - Unread count tracking

3. **Advanced Filtering**
   - Sort by rating, date
   - Filter by category, status
   - Date range filtering
   - Pagination with customizable page size

4. **User Rating System**
   - Automatic calculation based on likes
   - Updates on post/comment reactions
   - Displayed in user profiles

5. **File Upload System**
   - Avatar uploads for users
   - Image support in posts (prepared)
   - Local file storage
   - File type validation

### Challenges Faced & Solutions

**Challenge 1**: Email Verification in Development
- **Problem**: Testing email flows without sending real emails
- **Solution**: Implemented console logging for development environment + Resend for production

**Challenge 2**: Circular Dependencies
- **Problem**: Models and services referencing each other
- **Solution**: Restructured code to use dependency injection pattern

**Challenge 3**: Rating Calculation Performance
- **Problem**: Calculating user rating on every request was slow
- **Solution**: Implemented database triggers to auto-update ratings on like/dislike changes

**Challenge 4**: Refresh Token Security
- **Problem**: XSS attacks could steal tokens
- **Solution**: Implemented httpOnly cookies with CSRF protection considerations

---

## Architecture & Design

### MVC Pattern Implementation

```
┌─────────────────────────────────────────────┐
│              Client Request                  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│               Routes Layer                   │
│  - Define endpoints                          │
│  - Route to controllers                      │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│            Middleware Layer                  │
│  - Authentication                            │
│  - Authorization                             │
│  - Validation                                │
│  - Error handling                            │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│            Controllers Layer                 │
│  - Request handling                          │
│  - Response formatting                       │
│  - Call services                             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│             Services Layer                   │
│  - Business logic                            │
│  - Data validation                           │
│  - Call models                               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│              Models Layer                    │
│  - Database queries                          │
│  - Data access                               │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│             MySQL Database                   │
└─────────────────────────────────────────────┘
```

### SOLID Principles Application

1. **Single Responsibility Principle**
   - Each controller handles one entity
   - Services contain business logic only
   - Models handle database operations only

2. **Open/Closed Principle**
   - Middleware system is extensible
   - New routes can be added without modifying existing code
   - Validation schemas are composable

3. **Liskov Substitution Principle**
   - Error classes extend base Error
   - All models implement consistent interface

4. **Interface Segregation Principle**
   - Separate middleware for auth, validation, and error handling
   - Role-based middleware can be applied independently

5. **Dependency Inversion Principle**
   - Controllers depend on service abstractions
   - Database connection injected via config

### Project Structure

```
usof-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection configuration
│   │   ├── email.js             # Email service setup (Resend)
│   │   └── admin.js             # AdminJS configuration
│   │
│   ├── controllers/
│   │   ├── authController.js    # Authentication endpoints
│   │   ├── userController.js    # User management
│   │   ├── postController.js    # Post operations
│   │   ├── commentController.js # Comment operations
│   │   ├── categoryController.js # Category management
│   │   └── notificationController.js # Notifications
│   │
│   ├── database/
│   │   ├── init.js              # Database initialization script
│   │   ├── reset.js             # Database reset script
│   │   └── sql/
│   │       ├── schema.sql       # Table definitions
│   │       └── mock-data.sql    # Test data
│   │
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication
│   │   ├── authorize.js         # Role-based authorization
│   │   ├── validate.js          # Request validation
│   │   ├── errorHandler.js      # Global error handling
│   │   └── upload.js            # File upload handling
│   │
│   ├── models/
│   │   ├── User.js              # User data access
│   │   ├── Post.js              # Post data access
│   │   ├── Comment.js           # Comment data access
│   │   ├── Category.js          # Category data access
│   │   ├── Like.js              # Like data access
│   │   ├── Favorite.js          # Favorite data access
│   │   ├── Subscription.js      # Subscription data access
│   │   └── Notification.js      # Notification data access
│   │
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── postRoutes.js        # Post endpoints
│   │   ├── commentRoutes.js     # Comment endpoints
│   │   ├── categoryRoutes.js    # Category endpoints
│   │   └── notificationRoutes.js # Notification endpoints
│   │
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── userService.js       # User business logic
│   │   ├── postService.js       # Post business logic
│   │   ├── commentService.js    # Comment business logic
│   │   ├── categoryService.js   # Category business logic
│   │   ├── emailService.js      # Email operations
│   │   └── notificationService.js # Notification logic
│   │
│   ├── utils/
│   │   ├── jwt.js               # JWT helper functions
│   │   ├── validators.js        # Zod validation schemas
│   │   └── errors.js            # Custom error classes
│   │
│   └── server.js                # Application entry point
│
├── public/
│   └── uploads/
│       └── avatars/             # User avatar storage
│
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── package.json                 # Dependencies and scripts
├── postman_collection.json      # API test collection
└── README.md                    # Quick start guide
```

### Request Flow Algorithm

**Example: Creating a Post**

```
1. Client sends POST /api/posts
   ↓
2. Routes layer receives request
   ↓
3. Authentication middleware verifies JWT
   ↓
4. Validation middleware checks request body against schema
   ↓
5. Controller receives validated request
   ↓
6. Controller calls postService.createPost()
   ↓
7. Service validates business rules:
   - User is verified
   - Categories exist
   - Content is not empty
   ↓
8. Service calls Post.create()
   ↓
9. Model executes SQL INSERT query
   ↓
10. Model returns created post
    ↓
11. Service associates categories
    ↓
12. Service returns complete post data
    ↓
13. Controller formats response
    ↓
14. Response sent to client
```

### Authentication Flow

```
Registration:
1. User submits registration data
2. Validate input (email, password strength, unique login)
3. Hash password with bcrypt
4. Create user in database (email_verified = false)
5. Generate email verification token
6. Send verification email
7. Return success message

Email Verification:
1. User clicks link in email
2. Extract token from URL
3. Find token in database
4. Check expiration
5. Update user.email_verified = true
6. Delete token
7. Redirect to login

Login:
1. User submits credentials
2. Find user by login/email
3. Verify email is confirmed
4. Compare password hash
5. Generate access token (15min expiry)
6. Generate refresh token (7 days expiry)
7. Store refresh token in database
8. Return both tokens

Token Refresh:
1. User submits refresh token
2. Verify token signature
3. Check token exists in database
4. Generate new access token
5. Optionally rotate refresh token
6. Return new access token

Logout:
1. User submits refresh token
2. Delete token from database
3. Return success
```

---

## Technology Stack

### Backend Framework
- **Node.js** (v18+): JavaScript runtime
- **Express** (v5): Web application framework
  - Fast and minimalist
  - Robust routing
  - Extensive middleware ecosystem

### Database
- **MySQL** (v8+): Relational database
  - ACID compliance
  - Complex queries with JOINs
  - Transactions support
- **mysql2**: Node.js MySQL client
  - Promise support
  - Prepared statements
  - Connection pooling

### Authentication & Security
- **jsonwebtoken**: JWT implementation
- **bcrypt**: Password hashing
  - Salt rounds: 10
  - One-way encryption
- **Zod**: Runtime type validation
  - Type-safe schemas
  - Detailed error messages

### Email
- **Resend**: Email delivery service
  - Modern API
  - Template support
  - Delivery tracking

### Admin Panel
- **AdminJS**: Auto-generated admin interface
- **@adminjs/express**: Express adapter
- **@adminjs/sql**: SQL database adapter

### File Handling
- **Multer**: Multipart/form-data handling
  - File upload middleware
  - Storage configuration
  - File filtering

### Utilities
- **dotenv**: Environment variables
- **cookie-parser**: Cookie parsing
- **cors**: Cross-Origin Resource Sharing

### Development
- **nodemon**: Auto-restart on file changes

---

## Installation Guide

### Prerequisites

Before starting, ensure you have:
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MySQL** v8 or higher ([Download](https://dev.mysql.com/downloads/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

### Step 1: Clone Repository

```bash
git clone https://github.com/niykuta/usof-backend.git
cd usof-backend
```

Or download and extract the ZIP file.

### Step 2: Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`:
- Express, MySQL client, JWT, bcrypt, etc.
- Development dependencies (nodemon)

### Step 3: Configure Environment

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=usof_user
DB_PASSWORD=your_secure_password
DB_NAME=usof

# MySQL Root Password (for db initialization)
ROOT_PASSWORD=your_mysql_root_password

# JWT Secrets (generate random strings)
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
EMAIL_FROM=noreply@usof.dev
RESEND_API_KEY=re_your_resend_api_key

# Admin Panel
ADMIN_EMAIL=admin@usof.dev
ADMIN_COOKIE_PASSWORD=your_admin_cookie_secret
```

**Security Notes**:
- Use strong, random secrets for JWT
- Never commit `.env` to version control
- Use different secrets for production

### Step 4: Setup MySQL

Ensure MySQL server is running:

```bash
# Check MySQL status (macOS/Linux)
sudo systemctl status mysql

# Or (Windows, if MySQL service is installed)
net start MySQL80
```

### Step 5: Initialize Database

Run the initialization script:

```bash
npm run db:init
```

This script will:
1. Connect to MySQL using root credentials
2. Create database `usof`
3. Create user `usof_user` with appropriate privileges
4. Create all required tables
5. Insert mock data for testing

**Mock Data Includes**:
- 2 users (1 admin, 1 regular user)
- 5 categories
- 10 posts
- 20 comments
- Various likes, favorites, subscriptions

### Step 6: Start Development Server

```bash
npm run dev
```

You should see:
```
Server running on port 3000
Connected to database
Admin panel available at http://localhost:3000/admin
```

### Step 7: Verify Installation

Test the API:

```bash
curl http://localhost:3000/api/categories
```

You should receive a JSON response with categories.

Access admin panel:
```
http://localhost:3000/admin
```

Login with:
- Email: `admin@usof.dev`
- Password: `password123`

### Troubleshooting

**Database Connection Error**:
```
Error: Access denied for user 'usof_user'@'localhost'
```
Solution: Check `DB_PASSWORD` in `.env` matches the password in `init.js`

**Port Already in Use**:
```
Error: listen EADDRINUSE: address already in use :::3000
```
Solution: Change `PORT` in `.env` or stop the process using port 3000

**MySQL Not Running**:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
Solution: Start MySQL service

**Email Verification Tokens**:
- In development, tokens are logged to console
- In production, emails are sent via Resend

### Database Reset

To completely reset the database:

```bash
# This drops the database and user
npm run db:reset

# Reinitialize
npm run db:init
```

⚠️ **Warning**: This deletes all data!

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    users    │────────<│    posts     │>────────│ categories  │
└─────────────┘         └──────────────┘         └─────────────┘
      │                       │                          │
      │                       │                          │
      │                 ┌─────┴─────┐                    │
      │                 │           │                    │
      ▼                 ▼           ▼                    ▼
┌─────────────┐   ┌──────────┐   ┌──────────────┐   ┌──────────────────┐
│ post_likes  │   │ comments │   │  favorites   │   │ post_categories  │
└─────────────┘   └──────────┘   └──────────────┘   └──────────────────┘
                       │          ┌──────────────┐
                       │          │subscriptions │
                       ▼          └──────────────┘
                ┌──────────────┐       │
                │comment_likes │       ▼
                └──────────────┘  ┌──────────────┐
                                  │notifications │
                                  └──────────────┘
```

### Tables

#### users
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| login | VARCHAR(50) UNIQUE | Username |
| password | VARCHAR(255) | Bcrypt hashed password |
| full_name | VARCHAR(100) | User's real name |
| email | VARCHAR(100) UNIQUE | Email address |
| email_verified | BOOLEAN | Email confirmation status |
| profile_picture | VARCHAR(255) | Avatar file path |
| rating | INT DEFAULT 0 | Calculated from likes |
| role | ENUM('user', 'admin') | Access level |
| created_at | TIMESTAMP | Registration date |

#### posts
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| author_id | INT (FK → users) | Post creator |
| title | VARCHAR(255) | Post title |
| content | TEXT | Post body |
| status | ENUM('active', 'inactive') | Visibility |
| created_at | TIMESTAMP | Publication date |
| updated_at | TIMESTAMP | Last modification |

#### comments
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| author_id | INT (FK → users) | Comment creator |
| post_id | INT (FK → posts) | Associated post |
| content | TEXT | Comment text |
| status | ENUM('active', 'inactive') | Visibility |
| created_at | TIMESTAMP | Publication date |
| updated_at | TIMESTAMP | Last modification |

#### categories
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| title | VARCHAR(100) UNIQUE | Category name |
| description | TEXT | Category description |
| created_at | TIMESTAMP | Creation date |

#### post_categories (Junction Table)
| Column | Type | Description |
|--------|------|-------------|
| post_id | INT (FK → posts) | Post reference |
| category_id | INT (FK → categories) | Category reference |

**Composite Primary Key**: (post_id, category_id)

#### post_likes
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| author_id | INT (FK → users) | User who reacted |
| post_id | INT (FK → posts) | Target post |
| type | ENUM('like', 'dislike') | Reaction type |
| created_at | TIMESTAMP | Reaction date |

**Unique Constraint**: (author_id, post_id) - one reaction per user per post

#### comment_likes
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| author_id | INT (FK → users) | User who reacted |
| comment_id | INT (FK → comments) | Target comment |
| type | ENUM('like', 'dislike') | Reaction type |
| created_at | TIMESTAMP | Reaction date |

**Unique Constraint**: (author_id, comment_id)

#### favorites
| Column | Type | Description |
|--------|------|-------------|
| user_id | INT (FK → users) | User who favorited |
| post_id | INT (FK → posts) | Favorited post |
| created_at | TIMESTAMP | Favorite date |

**Composite Primary Key**: (user_id, post_id)

#### subscriptions
| Column | Type | Description |
|--------|------|-------------|
| user_id | INT (FK → users) | Subscriber |
| post_id | INT (FK → posts) | Subscribed post |
| created_at | TIMESTAMP | Subscription date |

**Composite Primary Key**: (user_id, post_id)

#### notifications
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| user_id | INT (FK → users) | Recipient |
| post_id | INT (FK → posts) | Related post |
| type | ENUM('post_update', 'new_comment') | Event type |
| message | TEXT | Notification text |
| is_read | BOOLEAN DEFAULT false | Read status |
| created_at | TIMESTAMP | Notification time |

#### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| user_id | INT (FK → users) | Session owner |
| refresh_token | VARCHAR(500) | JWT refresh token |
| expires_at | TIMESTAMP | Expiration time |
| created_at | TIMESTAMP | Session start |

#### password_resets
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| user_id | INT (FK → users) | User requesting reset |
| token | VARCHAR(255) UNIQUE | Reset token |
| expires_at | TIMESTAMP | Token expiration |
| created_at | TIMESTAMP | Request time |

#### email_verifications
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique identifier |
| user_id | INT (FK → users) | User to verify |
| token | VARCHAR(255) UNIQUE | Verification token |
| expires_at | TIMESTAMP | Token expiration |
| created_at | TIMESTAMP | Creation time |

### Indexes

For optimal query performance:

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_login ON users(login);

-- Posts
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created ON posts(created_at);

-- Comments
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);

-- Likes
CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
```

### Database Triggers

**Auto-update User Rating**:
```sql
-- Trigger on post_likes insert/update/delete
-- Recalculates user rating based on all post likes

-- Trigger on comment_likes insert/update/delete
-- Recalculates user rating based on all comment likes
```

---

## API Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication

Most endpoints require a JWT access token in the Authorization header:

```http
Authorization: Bearer <access_token>
```

### Standard Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

### Auth Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body**:
```json
{
  "login": "johndoe",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "email": "john@example.com"
}
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response** (201):
```json
{
  "success": true,
  "message": "User registered. Please verify your email."
}
```

---

#### Verify Email
```http
GET /api/auth/verify-email/:token
```

**Response** (200):
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

#### Login
```http
POST /api/auth/login
```

**Request Body**:
```json
{
  "login": "johndoe",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "login": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

#### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### Logout
```http
POST /api/auth/logout
```

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### Request Password Reset
```http
POST /api/auth/password-reset
```

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

#### Confirm Password Reset
```http
POST /api/auth/password-reset/:token
```

**Request Body**:
```json
{
  "newPassword": "NewSecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### User Endpoints

#### Get All Users (Admin Only)
```http
GET /api/users
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "login": "johndoe",
      "full_name": "John Doe",
      "email": "john@example.com",
      "profile_picture": "/uploads/avatars/1.jpg",
      "rating": 42,
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Get User by ID
```http
GET /api/users/:user_id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "login": "johndoe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "profile_picture": "/uploads/avatars/1.jpg",
    "rating": 42,
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Create User (Admin Only)
```http
POST /api/users
```

**Request Body**:
```json
{
  "login": "newuser",
  "password": "SecurePass123!",
  "full_name": "New User",
  "email": "newuser@example.com",
  "role": "user"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 5,
    "login": "newuser",
    "email": "newuser@example.com"
  }
}
```

---

#### Upload Avatar
```http
PATCH /api/users/avatar
Content-Type: multipart/form-data
```

**Form Data**:
- `avatar`: Image file (JPG, PNG, GIF)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "profile_picture": "/uploads/avatars/1-1234567890.jpg"
  }
}
```

---

#### Update User
```http
PATCH /api/users/:user_id
```

**Request Body**:
```json
{
  "full_name": "John Updated Doe",
  "email": "john.new@example.com"
}
```

**Permissions**:
- Users can update their own profile
- Admins can update any profile
- Only admins can change `role`

**Response** (200):
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

#### Delete User (Admin Only)
```http
DELETE /api/users/:user_id
```

**Response** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

#### Get User Favorites
```http
GET /api/users/:user_id/favorites
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "title": "How to implement JWT?",
      "author": "johndoe",
      "created_at": "2024-01-15T10:30:00.000Z",
      "likes": 15
    }
  ]
}
```

---

#### Get User Subscriptions
```http
GET /api/users/:user_id/subscriptions
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "title": "Best practices for REST APIs",
      "author": "janedoe",
      "subscribed_at": "2024-01-20T14:00:00.000Z"
    }
  ]
}
```

---

### Post Endpoints

#### Get All Posts
```http
GET /api/posts?page=1&limit=10&sort=rating&order=desc&category=1&status=active
```

**Query Parameters**:
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| page | number | Page number | 1 |
| limit | number | Posts per page (max 50) | 10 |
| sort | string | Sort by: `rating`, `date` | rating |
| order | string | Order: `asc`, `desc` | desc |
| category | number | Filter by category ID | - |
| status | string | Filter: `active`, `inactive` | active |
| start_date | string | Filter from date (YYYY-MM-DD) | - |
| end_date | string | Filter to date (YYYY-MM-DD) | - |

**Response** (200):
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "Understanding Async/Await",
        "content": "Detailed explanation...",
        "author": {
          "id": 2,
          "login": "johndoe",
          "profile_picture": "/uploads/avatars/2.jpg"
        },
        "categories": [
          { "id": 1, "title": "JavaScript" },
          { "id": 3, "title": "Async" }
        ],
        "likes": 25,
        "dislikes": 2,
        "comments_count": 8,
        "status": "active",
        "created_at": "2024-01-10T15:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

#### Get Post by ID
```http
GET /api/posts/:post_id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Understanding Async/Await",
    "content": "Full post content here...",
    "author": {
      "id": 2,
      "login": "johndoe",
      "rating": 150
    },
    "categories": [
      { "id": 1, "title": "JavaScript" }
    ],
    "likes": 25,
    "dislikes": 2,
    "status": "active",
    "created_at": "2024-01-10T15:30:00.000Z",
    "updated_at": "2024-01-10T15:30:00.000Z"
  }
}
```

---

#### Create Post
```http
POST /api/posts
```

**Request Body**:
```json
{
  "title": "How to use Redux Toolkit?",
  "content": "I'm struggling with Redux Toolkit setup...",
  "categories": [1, 2]
}
```

**Validation**:
- `title`: 10-255 characters
- `content`: minimum 20 characters
- `categories`: array of existing category IDs

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 15,
    "title": "How to use Redux Toolkit?",
    "author_id": 2,
    "status": "active",
    "created_at": "2024-01-25T10:00:00.000Z"
  }
}
```

---

#### Update Post
```http
PATCH /api/posts/:post_id
```

**Request Body**:
```json
{
  "title": "Updated title",
  "content": "Updated content",
  "categories": [1, 3],
  "status": "inactive"
}
```

**Permissions**:
- Authors can update their own posts (title, content, categories)
- Admins can update any post and change status

**Response** (200):
```json
{
  "success": true,
  "message": "Post updated successfully"
}
```

---

#### Delete Post
```http
DELETE /api/posts/:post_id
```

**Permissions**:
- Authors can delete their own posts
- Admins can delete any post

**Response** (200):
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

#### Get Post Comments
```http
GET /api/posts/:post_id/comments
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "content": "Great explanation!",
      "author": {
        "id": 3,
        "login": "janedoe",
        "profile_picture": "/uploads/avatars/3.jpg"
      },
      "likes": 5,
      "dislikes": 0,
      "status": "active",
      "created_at": "2024-01-11T09:00:00.000Z"
    }
  ]
}
```

---

#### Add Comment
```http
POST /api/posts/:post_id/comments
```

**Request Body**:
```json
{
  "content": "Thanks for sharing this!"
}
```

**Validation**:
- `content`: 1-1000 characters
- Post must be active

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 25,
    "post_id": 1,
    "content": "Thanks for sharing this!",
    "created_at": "2024-01-25T11:00:00.000Z"
  }
}
```

---

#### Get Post Categories
```http
GET /api/posts/:post_id/categories
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript",
      "description": "JavaScript programming"
    }
  ]
}
```

---

#### Get Post Likes
```http
GET /api/posts/:post_id/like
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "likes": 25,
    "dislikes": 2,
    "details": [
      {
        "user": "johndoe",
        "type": "like",
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### Like/Dislike Post
```http
POST /api/posts/:post_id/like
```

**Request Body**:
```json
{
  "type": "like"
}
```

**Values**: `like` or `dislike`

**Behavior**:
- Creates new reaction if none exists
- Updates existing reaction if type changed
- Deletes reaction if same type clicked again (toggle)

**Response** (200):
```json
{
  "success": true,
  "message": "Post liked successfully"
}
```

---

#### Remove Like
```http
DELETE /api/posts/:post_id/like
```

**Response** (200):
```json
{
  "success": true,
  "message": "Like removed successfully"
}
```

---

#### Add to Favorites
```http
POST /api/posts/:post_id/favorite
```

**Response** (200):
```json
{
  "success": true,
  "message": "Post added to favorites"
}
```

---

#### Remove from Favorites
```http
DELETE /api/posts/:post_id/favorite
```

**Response** (200):
```json
{
  "success": true,
  "message": "Post removed from favorites"
}
```

---

#### Subscribe to Post
```http
POST /api/posts/:post_id/subscribe
```

**Response** (200):
```json
{
  "success": true,
  "message": "Subscribed to post updates"
}
```

---

#### Unsubscribe from Post
```http
DELETE /api/posts/:post_id/subscribe
```

**Response** (200):
```json
{
  "success": true,
  "message": "Unsubscribed from post"
}
```

---

### Comment Endpoints

#### Get Comment by ID
```http
GET /api/comments/:comment_id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 5,
    "post_id": 1,
    "content": "Great explanation!",
    "author": {
      "id": 3,
      "login": "janedoe"
    },
    "likes": 5,
    "dislikes": 0,
    "status": "active",
    "created_at": "2024-01-11T09:00:00.000Z"
  }
}
```

---

#### Update Comment
```http
PATCH /api/comments/:comment_id
```

**Request Body**:
```json
{
  "content": "Updated comment text",
  "status": "inactive"
}
```

**Permissions**:
- Authors can update content
- Admins can update content and status

**Response** (200):
```json
{
  "success": true,
  "message": "Comment updated successfully"
}
```

---

#### Delete Comment
```http
DELETE /api/comments/:comment_id
```

**Permissions**:
- Authors can delete their own comments
- Admins can delete any comment

**Response** (200):
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

#### Get Comment Likes
```http
GET /api/comments/:comment_id/like
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "likes": 5,
    "dislikes": 1,
    "details": [
      {
        "user": "johndoe",
        "type": "like",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

#### Like/Dislike Comment
```http
POST /api/comments/:comment_id/like
```

**Request Body**:
```json
{
  "type": "like"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Comment liked successfully"
}
```

---

#### Remove Comment Like
```http
DELETE /api/comments/:comment_id/like
```

**Response** (200):
```json
{
  "success": true,
  "message": "Like removed successfully"
}
```

---

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "JavaScript",
      "description": "JavaScript programming language",
      "post_count": 45,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Get Category by ID
```http
GET /api/categories/:category_id
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "JavaScript",
    "description": "JavaScript programming language",
    "post_count": 45,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### Get Posts by Category
```http
GET /api/categories/:category_id/posts?page=1&limit=10
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "posts": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45
    }
  }
}
```

---

#### Create Category (Admin Only)
```http
POST /api/categories
```

**Request Body**:
```json
{
  "title": "TypeScript",
  "description": "TypeScript programming language"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": 8,
    "title": "TypeScript",
    "created_at": "2024-01-25T12:00:00.000Z"
  }
}
```

---

#### Update Category (Admin Only)
```http
PATCH /api/categories/:category_id
```

**Request Body**:
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Category updated successfully"
}
```

---

#### Delete Category (Admin Only)
```http
DELETE /api/categories/:category_id
```

**Response** (200):
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

⚠️ **Note**: Cannot delete category with associated posts

---

### Notification Endpoints

#### Get All Notifications
```http
GET /api/notifications/:user_id
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "type": "new_comment",
      "message": "New comment on your post 'Understanding Async/Await'",
      "post_id": 1,
      "is_read": false,
      "created_at": "2024-01-25T14:30:00.000Z"
    }
  ]
}
```

---

#### Get Unread Notifications
```http
GET /api/notifications/:user_id/unread
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "count": 3,
    "notifications": [...]
  }
}
```

---

#### Mark Notification as Read
```http
PATCH /api/notifications/:notification_id/read
```

**Response** (200):
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

#### Mark All as Read
```http
PATCH /api/notifications/read-all
```

**Response** (200):
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Security Implementation

### Password Security

**Hashing**:
- Algorithm: bcrypt
- Salt rounds: 10
- One-way encryption (cannot be reversed)

**Storage**:
```javascript
const hashedPassword = await bcrypt.hash(plainPassword, 10);
// Stored in database: $2b$10$xyz...
```

**Verification**:
```javascript
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

---

### JWT Authentication

**Access Token**:
- Expiry: 15 minutes
- Purpose: API authorization
- Payload:
  ```json
  {
    "userId": 1,
    "role": "user",
    "iat": 1234567890,
    "exp": 1234568790
  }
  ```

**Refresh Token**:
- Expiry: 7 days
- Purpose: Generate new access tokens
- Stored in database (revocable)
- Rotated on each refresh

**Token Verification Flow**:
```
1. Extract token from Authorization header
2. Verify signature using JWT_SECRET
3. Check expiration
4. Extract user data from payload
5. Attach user to request object
```

---

### Authorization Levels

**Public Routes** (no auth required):
- `GET /api/posts`
- `GET /api/posts/:id`
- `GET /api/categories`

**Authenticated Routes** (valid token):
- `POST /api/posts`
- `POST /api/comments`
- `PATCH /api/users/:id` (own profile)

**Admin Routes** (role = 'admin'):
- `POST /api/users`
- `DELETE /api/users/:id`
- `POST /api/categories`
- `PATCH /api/posts/:id/status`

**Resource Owner Routes**:
- `PATCH /api/posts/:id` (own posts)
- `DELETE /api/posts/:id` (own posts)
- `PATCH /api/comments/:id` (own comments)

---

### Input Validation

**Zod Schemas**:

```javascript
// Registration schema
const registerSchema = z.object({
  login: z.string()
    .min(3, "Login must be at least 3 characters")
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscore"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[a-z]/, "Must contain lowercase")
    .regex(/[0-9]/, "Must contain number"),
  email: z.string()
    .email("Invalid email format"),
  full_name: z.string()
    .min(2)
    .max(100)
});
```

**Validation Middleware**:
```javascript
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        errors: error.errors
      });
    }
  };
};
```

---

### SQL Injection Prevention

**Parameterized Queries**:

❌ **Vulnerable**:
```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

✅ **Safe**:
```javascript
const query = 'SELECT * FROM users WHERE email = ?';
const [rows] = await db.execute(query, [email]);
```

All database queries use parameterized statements.

---

### XSS Protection

**Input Sanitization**:
- HTML tags stripped from user input
- Special characters escaped
- Content-Type headers properly set

**Output Encoding**:
- JSON responses automatically escaped by Express
- No user-generated HTML rendered server-side

---

### CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

### Rate Limiting

**Recommended Implementation** (not included by default):

```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts'
});

app.use('/api/auth/login', authLimiter);
```

---

### Email Verification

**Purpose**: Prevent fake registrations

**Flow**:
1. Generate random token
2. Store in database with expiration (24 hours)
3. Send email with verification link
4. User clicks link
5. Token validated and user marked as verified

---

### Password Reset Security

**Flow**:
1. User requests reset
2. Generate random token
3. Store with expiration (1 hour)
4. Send email with reset link
5. User submits new password
6. Validate token, hash password, update database
7. Delete token

**Security Measures**:
- Tokens expire after 1 hour
- One-time use (deleted after use)
- Requires email ownership
- New password validation

---

## Testing

### Postman Collection

Import `postman_collection.json` for comprehensive testing.

**Features**:
- Pre-configured requests for all endpoints
- Environment variables auto-set by scripts
- Sequential test flows
- Test assertions

### Running Tests

1. **Import Collection**:
   - Open Postman
   - Import `postman_collection.json`

2. **Setup Environment**:
   - Create new environment
   - Add variable: `baseUrl` = `http://localhost:3000/api`

3. **Run Collection**:
   - Open Collection Runner
   - Select collection
   - Run all tests

### Test Credentials

**Admin**:
```
login: admin
password: password123
email: admin@usof.dev
```

**User**:
```
login: johndoe
password: password123
email: john@usof.dev
```

### Manual Testing Examples

**Test 1: User Registration & Login**

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "Test123!",
    "full_name": "Test User",
    "email": "test@example.com"
  }'

# 2. Check console for verification token

# 3. Verify email
curl http://localhost:3000/api/auth/verify-email/TOKEN

# 4. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "testuser",
    "password": "Test123!"
  }'

# Save the accessToken
```

**Test 2: Create and Like a Post**

```bash
# 1. Create post (use token from login)
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post content, it needs to be at least 20 characters long.",
    "categories": [1]
  }'

# 2. Like the post
curl -X POST http://localhost:3000/api/posts/1/like \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "like"}'
```

**Test 3: Filtering and Pagination**

```bash
# Get posts sorted by date, page 2
curl "http://localhost:3000/api/posts?page=2&limit=5&sort=date&order=desc"

# Get posts in JavaScript category
curl "http://localhost:3000/api/posts?category=1"

# Get posts from date range
curl "http://localhost:3000/api/posts?start_date=2024-01-01&end_date=2024-01-31"
```

---

## Deployment

### Production Checklist

- [ ] Change all secrets in `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database password
- [ ] Configure CORS for frontend domain
- [ ] Set up HTTPS
- [ ] Configure email service (Resend API key)
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Test all endpoints
- [ ] Enable rate limiting

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000

# Use remote database
DB_HOST=your-db-host.com
DB_USER=usof_user
DB_PASSWORD=strong_random_password
DB_NAME=usof

# Strong random secrets (64+ characters)
JWT_SECRET=your_very_long_random_secret_key
JWT_REFRESH_SECRET=your_very_long_refresh_secret_key

# Production email
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=re_your_production_api_key

# Your frontend URL
FRONTEND_URL=https://yourdomain.com
```

### Hosting Options

**Backend**:
- Heroku
- DigitalOcean App Platform
- AWS EC2 / Elastic Beanstalk
- Google Cloud Run
- Railway

**Database**:
- PlanetScale (MySQL)
- AWS RDS
- DigitalOcean Managed Database
- Railway

### Example: Deploy to Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   railway init
   ```

4. **Add MySQL**:
   ```bash
   railway add mysql
   ```

5. **Set Environment Variables**:
   ```bash
   railway variables set JWT_SECRET=your_secret
   railway variables set RESEND_API_KEY=your_key
   # ... set all variables
   ```

6. **Deploy**:
   ```bash
   railway up
   ```

7. **Run Database Init**:
   ```bash
   railway run npm run db:init
   ```

---

## Conclusion

This documentation covers the complete USOF Backend API implementation, from architecture to deployment. The project demonstrates:

- **Solid backend fundamentals**: MVC, OOP, SOLID principles
- **Security best practices**: JWT, bcrypt, input validation, SQL injection prevention
- **RESTful API design**: Consistent endpoints, proper HTTP methods and status codes
- **Advanced features**: Subscriptions, notifications, favorites, rating system
- **Production readiness**: Error handling, validation, admin panel, testing

For questions or issues, please open an issue on [GitHub](https://github.com/niykuta/usof-backend/issues).

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Author**: [niykuta](https://github.com/niykuta)
