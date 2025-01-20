import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5554;

export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';