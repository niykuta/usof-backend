import AdminJS from 'adminjs';
import { Database, Resource, Adapter } from '@adminjs/sql';
import dotenv from 'dotenv';

dotenv.config();

AdminJS.registerAdapter({
  Database,
  Resource,
});

async function createAdminJS() {
  try {
    const adminDb = await new Adapter('mysql2', {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }).init();

    const adminOptions = {
      rootPath: '/admin',
      resources: [
        {
          resource: adminDb.table('users'),
          options: {
            properties: {
              password: { isVisible: false },
              created_at: { isVisible: { edit: false, new: false } },
              updated_at: { isVisible: { edit: false, new: false } }
            }
          }
        },
        {
          resource: adminDb.table('posts'),
          options: {
            properties: {
              content: { type: 'textarea' },
              created_at: { isVisible: { edit: false, new: false } },
              updated_at: { isVisible: { edit: false, new: false } }
            }
          }
        },
        {
          resource: adminDb.table('comments'),
          options: {
            properties: {
              content: { type: 'textarea' },
              created_at: { isVisible: { edit: false, new: false } },
              updated_at: { isVisible: { edit: false, new: false } }
            }
          }
        },
        {
          resource: adminDb.table('categories'),
          options: {
            properties: {
              description: { type: 'textarea' },
              created_at: { isVisible: { edit: false, new: false } },
              updated_at: { isVisible: { edit: false, new: false } }
            }
          }
        },
        {
          resource: adminDb.table('sessions'),
          options: {}
        },
        {
          resource: adminDb.table('post_likes'),
          options: {}
        },
        {
          resource: adminDb.table('comment_likes'),
          options: {}
        },
        {
          resource: adminDb.table('favorites'),
          options: {}
        }
      ],
      branding: {
        companyName: 'USOF Admin Panel',
        logo: false,
        softwareBrothers: false
      },
      locale: {
        language: 'en',
        translations: {
          en: {
            labels: {
              users: 'Users',
              posts: 'Posts',
              comments: 'Comments',
              categories: 'Categories',
              sessions: 'Sessions',
              post_likes: 'Post Likes',
              comment_likes: 'Comment Likes',
              favorites: 'Favorites'
            }
          }
        }
      },
      dashboard: {
        handler: async (req, res, ctx) => {
          return {
            message: 'Welcome to USOF Admin Panel',
            note: 'Direct MySQL connection via @adminjs/sql'
          };
        }
      }
    };

    return new AdminJS(adminOptions);
  } catch (error) {
    console.error('Failed to initialize AdminJS with SQL adapter:', error.message);
    throw error;
  }
}

export default createAdminJS;