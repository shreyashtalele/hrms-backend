import { config } from './config/env.js';
import { connectDB } from './config/database.js';
import app from './app.js';

// Connect to MongoDB
await connectDB();

// Start server
const server = app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
    console.log(`Health check: http://localhost:${config.PORT}/health`);
});

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated!');
    });
});