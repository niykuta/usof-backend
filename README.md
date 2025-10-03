# USOF Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](LICENSE)

A RESTful API for a question and answer platform for professional and enthusiast programmers. Built with Node.js, Express, and MySQL.

**Repository**: [https://github.com/niykuta/usof-backend](https://github.com/niykuta/usof-backend)

## Features

### Core Functionality
- **User Management**: Registration, authentication, profile management with role-based access control
- **Posts**: Create, read, update, delete posts with category associations
- **Comments**: Nested commenting system on posts
- **Reactions**: Like/dislike system for posts and comments
- **Categories**: Organize posts by topics
- **Rating System**: Automatic user rating calculation based on post and comment reactions

### Advanced Features
- **Favorites**: Bookmark posts for quick access
- **Subscriptions**: Follow posts and receive notifications on updates
- **Notifications**: Real-time activity tracking for subscribed content
- **Email Verification**: Secure account verification via email
- **Password Reset**: Token-based password recovery
- **Admin Panel**: Full CRUD operations via AdminJS interface
- **File Uploads**: Avatar and image support
- **Advanced Filtering**: Sort and filter posts by date, rating, category, and status
- **Pagination**: Efficient data loading for large datasets

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MySQL 2
- **Authentication**: JWT with refresh tokens
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Email Service**: Resend
- **Admin Panel**: AdminJS
- **File Uploads**: Multer

## Architecture

- **Pattern**: MVC (Model-View-Controller)
- **Paradigm**: Object-Oriented Programming (OOP)
- **Principles**: SOLID
- **Security**: Role-based access control, input validation, secure password storage

## Project Structure

```
usof-backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── database/         # Database setup and SQL files
│   ├── middlewares/      # Custom middleware (auth, validation, error handling)
│   ├── models/           # Data models
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── server.js         # Application entry point
├── uploads/              # User uploaded files
├── .env                  # Environment variables
└── package.json          # Dependencies and scripts
```

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone https://github.com/niykuta/usof-backend.git
cd usof-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=usof_user
DB_PASSWORD=your_password
DB_NAME=usof

ROOT_PASSWORD=your_mysql_root_password

JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

EMAIL_FROM=noreply@usof.dev
RESEND_API_KEY=your_resend_api_key

ADMIN_EMAIL=admin@usof.dev
ADMIN_COOKIE_PASSWORD=your_admin_cookie_secret
```

4. Initialize the database
```bash
npm run db:init
```

This will:
- Create the database and user
- Set up all tables (users, posts, comments, likes, categories, etc.)
- Load mock data for testing

5. Start the development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run db:init` - Initialize database with tables and mock data
- `npm run db:reset` - Drop database and user (requires db:init after)

## Database Reset

To completely reset the database:
```bash
npm run db:reset
npm run db:init
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `GET /verify-email/:token` - Verify email address
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `POST /logout` - User logout
- `POST /password-reset` - Request password reset
- `POST /password-reset/:token` - Confirm password reset

### Users (`/api/users`)
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `GET /users/:id/favorites` - Get user's favorite posts
- `GET /users/:id/subscriptions` - Get user's subscribed posts
- `POST /users` - Create user (admin only)
- `PATCH /users/avatar` - Upload user avatar
- `PATCH /users/:id` - Update user data
- `DELETE /users/:id` - Delete user (admin only)

### Posts (`/api/posts`)
- `GET /posts` - Get all posts (with filtering and pagination)
- `GET /posts/:id` - Get post by ID
- `GET /posts/:id/comments` - Get post comments
- `GET /posts/:id/categories` - Get post categories
- `GET /posts/:id/like` - Get post likes
- `POST /posts` - Create post
- `POST /posts/:id/comments` - Add comment
- `POST /posts/:id/like` - Like/dislike post
- `POST /posts/:id/favorite` - Add to favorites
- `POST /posts/:id/subscribe` - Subscribe to post
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `DELETE /posts/:id/like` - Remove like
- `DELETE /posts/:id/favorite` - Remove from favorites
- `DELETE /posts/:id/subscribe` - Unsubscribe

### Comments (`/api/comments`)
- `GET /comments/:id` - Get comment by ID
- `GET /comments/:id/like` - Get comment likes
- `POST /comments/:id/like` - Like/dislike comment
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment
- `DELETE /comments/:id/like` - Remove like

### Categories (`/api/categories`)
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `GET /categories/:id/posts` - Get posts by category
- `POST /categories` - Create category (admin only)
- `PATCH /categories/:id` - Update category (admin only)
- `DELETE /categories/:id` - Delete category (admin only)

### Notifications (`/api/notifications`)
- `GET /notifications/:user_id` - Get all notifications
- `GET /notifications/:user_id/unread` - Get unread notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read

### Admin Panel
- Access at `http://localhost:3000/admin`
- Full CRUD operations for all entities
- User role management
- Post status management

## Testing

Import the Postman collection from `postman_collection.json` for comprehensive API testing. See `POSTMAN_TESTS.md` for detailed testing documentation.

### Test Credentials

Default users created with mock data:

```
Admin:
  login: admin
  password: password123
  email: admin@usof.dev

User:
  login: johndoe
  password: password123
  email: john@usof.dev
```

## Query Parameters

### Posts Filtering
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort by: rating, date (default: rating)
- `order` - Order: asc, desc (default: desc)
- `category` - Filter by category ID
- `status` - Filter by status: active, inactive
- `start_date` - Filter from date
- `end_date` - Filter to date

Example:
```
GET /api/posts?page=1&limit=10&sort=rating&order=desc&category=1&status=active
```

## Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Email verification for new accounts
- Token-based password reset
- Role-based access control (user, admin)
- Input validation with Zod schemas
- SQL injection prevention via parameterized queries
- XSS protection through input sanitization

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Code Style
- Clean, self-documenting code
- No inline comments
- Consistent naming conventions
- OOP principles and SOLID design

### Database Schema

Main entities:
- **users** - User accounts and profiles
- **posts** - User-created posts
- **comments** - Post comments
- **categories** - Post categories
- **post_categories** - Many-to-many relationship
- **post_likes** - Post reactions
- **comment_likes** - Comment reactions
- **favorites** - User bookmarked posts
- **subscriptions** - Post subscriptions
- **notifications** - User notifications
- **sessions** - Refresh token storage
- **password_resets** - Password reset tokens
- **email_verifications** - Email verification tokens

## License

MIT License

## Author

[niykuta](https://github.com/niykuta)
