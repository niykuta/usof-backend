# API Testing Guide

Complete Postman collection for testing the USOF backend API.

**Base URL**: `http://localhost:3000/api`

## Quick Start

### Prerequisites
1. Ensure MySQL is running
2. Reset the database: `npm run db:reset`
3. Start the server: `npm run dev`
4. Import `postman_collection.json` into Postman

### Running Tests
1. Open Postman and import the collection
2. Run the entire collection using the Collection Runner, OR
3. Run requests individually in sequence

### Test Credentials
```
Admin:
  login: admin
  password: password123

User:
  login: johndoe
  password: password123
```

### Expected Results
All tests pass when run in sequence.

## Collection Variables

Variables automatically set by tests:
- `baseUrl` - API base URL
- `accessToken` - User access token
- `adminToken` - Admin access token
- `refreshToken` - Refresh token
- `userId` - Created user ID
- `adminId` - Admin user ID
- `postId` - Created post ID
- `commentId` - Created comment ID
- `categoryId` - Created category ID
- `newUserId` - Admin-created user ID
- `multiCategoryPostId` - Multi-category post ID

## Auth Routes (`/api/auth`)

### Register
`POST /auth/register`
```json
{
  "login": "testuser",
  "password": "Password123!",
  "full_name": "Test User",
  "email": "test@example.com"
}
```

### Verify Email
`GET /auth/verify-email/:token`

### Login
`POST /auth/login`
```json
{
  "login": "testuser",
  "password": "Password123!"
}
```

### Refresh Token
`POST /auth/refresh`
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

### Logout
`POST /auth/logout`
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

### Request Password Reset
`POST /auth/password-reset`
```json
{
  "email": "test@example.com"
}
```

### Confirm Password Reset
`POST /auth/password-reset/:token`
```json
{
  "newPassword": "NewPassword123!"
}
```

## User Routes (`/api/users`)

All routes require authentication header: `Authorization: Bearer {{accessToken}}`

### Get All Users
`GET /users` (Admin only)

### Get User by ID
`GET /users/:user_id`

### Get User Favorites
`GET /users/:user_id/favorites`

### Get User Subscriptions
`GET /users/:user_id/subscriptions`

### Create User
`POST /users` (Admin only)
```json
{
  "login": "newuser",
  "password": "Password123!",
  "full_name": "New User",
  "email": "newuser@example.com",
  "role": "user"
}
```

### Upload Avatar
`PATCH /users/avatar`

Form data: `avatar` (file)

### Update User
`PATCH /users/:user_id`
```json
{
  "full_name": "Updated Name",
  "email": "updated@example.com"
}
```

### Delete User
`DELETE /users/:user_id` (Admin only)

## Post Routes (`/api/posts`)

### Get All Posts
`GET /posts?page=1&limit=10&sort=rating&order=desc&category=1&status=active`

### Get Post by ID
`GET /posts/:post_id`

### Get Post Comments
`GET /posts/:post_id/comments`

### Get Post Categories
`GET /posts/:post_id/categories`

### Get Post Likes
`GET /posts/:post_id/like`

### Create Post
`POST /posts` (Auth required)
```json
{
  "title": "Test Post",
  "content": "Post content",
  "categories": [1, 2]
}
```

### Add Comment
`POST /posts/:post_id/comments` (Auth required)
```json
{
  "content": "Comment text"
}
```

### Like Post
`POST /posts/:post_id/like` (Auth required)
```json
{
  "type": "like"
}
```

### Add to Favorites
`POST /posts/:post_id/favorite` (Auth required)

### Subscribe to Post
`POST /posts/:post_id/subscribe` (Auth required)

### Update Post
`PATCH /posts/:post_id` (Auth required)
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "active"
}
```

### Delete Post
`DELETE /posts/:post_id` (Auth required)

### Remove Like
`DELETE /posts/:post_id/like` (Auth required)

### Remove from Favorites
`DELETE /posts/:post_id/favorite` (Auth required)

### Unsubscribe
`DELETE /posts/:post_id/subscribe` (Auth required)

## Comment Routes (`/api/comments`)

All routes require authentication.

### Get Comment by ID
`GET /comments/:comment_id`

### Get Comment Likes
`GET /comments/:comment_id/like`

### Like Comment
`POST /comments/:comment_id/like`
```json
{
  "type": "like"
}
```

### Update Comment
`PATCH /comments/:comment_id`
```json
{
  "content": "Updated content"
}
```

### Delete Comment
`DELETE /comments/:comment_id`

### Remove Like
`DELETE /comments/:comment_id/like`

## Category Routes (`/api/categories`)

### Get All Categories
`GET /categories`

### Get Category by ID
`GET /categories/:category_id`

### Get Posts by Category
`GET /categories/:category_id/posts`

### Create Category
`POST /categories` (Admin only)
```json
{
  "title": "Technology",
  "description": "Posts about technology"
}
```

### Update Category
`PATCH /categories/:category_id` (Admin only)
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### Delete Category
`DELETE /categories/:category_id` (Admin only)

## Notification Routes (`/api/notifications`)

All routes require authentication.

### Get All Notifications
`GET /notifications/:user_id`

### Get Unread Notifications
`GET /notifications/:user_id/unread`

### Mark as Read
`PATCH /notifications/:notification_id/read`

### Mark All as Read
`PATCH /notifications/read-all`

## Testing Flow

Recommended test sequence:

1. Register user
2. Verify email
3. Login
4. Create category (admin)
5. Create post
6. Add comment
7. Like post/comment
8. Add to favorites
9. Subscribe to post
10. Test notifications
11. Update operations
12. Delete operations

## Notes

- Authentication uses Bearer tokens in header
- Admin routes require `role: 'admin'`
- File uploads use `multipart/form-data`
- Check console for verification tokens during development
