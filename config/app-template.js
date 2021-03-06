import { HOST, PORT, ENV } from './env';

// Wordpress
export const SITE_NAME = 'Starward';
export const WP_URL = 'http://localhost/starward_wp';
export const WP_API = `${WP_URL}/wp-json`;
export const WP_AUTH = new Buffer('username:password').toString('base64');
export const POSTS_PER_PAGE = 10;
export const HOME_SLUG = 'home';
export const BLOG_SLUG = 'blog';
export const CATEGORY_SLUG = 'category';
export const AUTHOR_SLUG = 'author';
export const SEARCH_SLUG = 'search';

// Starward
export const baseURL = `http://${HOST}:${PORT}`;

// Redis
export const REDIS_PREFIX = null; // change me to your project name, for example: 'starward-'

// GraphQL
export const ROOT_API = `${baseURL}/api`;

// General
export const isProduction = ENV === 'production';
export const isDebug = ENV === 'development';
export const isClient = typeof window !== 'undefined';
export const serversideStateCharacterBlacklistRegex = /\u2028/g;
