INSERT IGNORE INTO users (login, password, full_name, email, email_verified, profile_picture, rating, role) VALUES
('admin', '$2b$10$8K1p/a0dClxnS7ZqBa6rGOIXPaF.C99YnBLZc.LxaUvNXBJEQhR2K', 'Administrator User', 'admin@usof.dev', TRUE, NULL, 100, 'admin'),
('johndoe', '$2b$10$8K1p/a0dClxnS7ZqBa6rGOIXPaF.C99YnBLZc.LxaUvNXBJEQhR2K', 'John Doe', 'john@usof.dev', TRUE, NULL, 85, 'user'),
('alice_dev', '$2b$10$8K1p/a0dClxnS7ZqBa6rGOIXPaF.C99YnBLZc.LxaUvNXBJEQhR2K', 'Alice Developer', 'alice@usof.dev', TRUE, NULL, 92, 'user'),
('bob_coder', '$2b$10$8K1p/a0dClxnS7ZqBa6rGOIXPaF.C99YnBLZc.LxaUvNXBJEQhR2K', 'Bob Coder', 'bob@usof.dev', TRUE, NULL, 67, 'user'),
('sarah_js', '$2b$10$8K1p/a0dClxnS7ZqBa6rGOIXPaF.C99YnBLZc.LxaUvNXBJEQhR2K', 'Sarah JavaScript', 'sarah@usof.dev', TRUE, NULL, 78, 'user'),
('mike_py', '$2b$10$8K1p/a0dClxnS7ZqBa6rGOIXPaF.C99YnBLZc.LxaUvNXBJEQhR2K', 'Mike Python', 'mike@usof.dev', TRUE, NULL, 55, 'user');

INSERT IGNORE INTO categories (title, description) VALUES
('JavaScript', 'Questions and discussions about JavaScript programming language'),
('Node.js', 'Server-side JavaScript runtime environment questions'),
('React', 'React library for building user interfaces'),
('Express', 'Fast, minimalist web framework for Node.js'),
('Database', 'Database design, queries, and optimization'),
('CSS', 'Cascading Style Sheets for web styling'),
('HTML', 'HyperText Markup Language fundamentals'),
('API', 'REST APIs, GraphQL, and web services');

INSERT IGNORE INTO posts (user_id, title, content, status) VALUES
(2, 'How to handle async operations in JavaScript?', 'I am struggling with understanding promises and async/await. Can someone explain the best practices?', 'active'),
(3, 'Best practices for Node.js error handling', 'What are the recommended patterns for handling errors in Node.js applications?', 'active'),
(4, 'React state management without Redux', 'Is there a way to manage complex state in React without using Redux?', 'active'),
(5, 'Express middleware execution order', 'How does Express determine the order of middleware execution?', 'active'),
(6, 'Database indexing strategies', 'What are the best practices for creating indexes in MySQL?', 'active'),
(2, 'CSS Grid vs Flexbox', 'When should I use CSS Grid over Flexbox?', 'active'),
(3, 'RESTful API design principles', 'What are the key principles to follow when designing REST APIs?', 'active');

INSERT IGNORE INTO post_categories (post_id, category_id) VALUES
(1, 1), (1, 2),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 8);

INSERT IGNORE INTO comments (post_id, user_id, content, status) VALUES
(1, 3, 'Promises are great for handling asynchronous operations. Use async/await for cleaner code.', 'active'),
(1, 4, 'You should also learn about Promise.all() and Promise.race() for advanced use cases.', 'active'),
(2, 5, 'Try using try-catch blocks with proper error middleware in Express.', 'active'),
(3, 6, 'Context API with useReducer can be a good alternative to Redux for simple cases.', 'active'),
(4, 2, 'Middleware order matters! They execute in the order they are defined.', 'active'),
(5, 3, 'Create indexes on columns that are frequently used in WHERE clauses.', 'active'),
(6, 4, 'Use Flexbox for one-dimensional layouts, Grid for two-dimensional.', 'active'),
(7, 5, 'Follow REST conventions: use proper HTTP methods and status codes.', 'active');

INSERT IGNORE INTO post_likes (post_id, user_id, type) VALUES
(1, 3, 'like'),
(1, 4, 'like'),
(1, 5, 'like'),
(2, 2, 'like'),
(2, 6, 'like'),
(3, 2, 'like'),
(3, 5, 'like'),
(4, 3, 'like'),
(4, 6, 'dislike'),
(5, 4, 'like'),
(6, 5, 'like'),
(7, 2, 'like'),
(7, 3, 'like');

INSERT IGNORE INTO comment_likes (comment_id, user_id, type) VALUES
(1, 2, 'like'),
(1, 4, 'like'),
(2, 3, 'like'),
(3, 2, 'like'),
(4, 3, 'like'),
(5, 4, 'like'),
(6, 2, 'like'),
(7, 3, 'like'),
(8, 4, 'like');