import dotenv from 'dotenv';
dotenv.config();

export const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/hrms',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
    OFFICE_START_TIME: process.env.OFFICE_START_TIME || '09:30',
    OFFICE_END_TIME: process.env.OFFICE_END_TIME || '18:00',
    WEEKEND_DAYS: process.env.WEEKEND_DAYS ? process.env.WEEKEND_DAYS.split(',') : ['saturday', 'sunday'],
};