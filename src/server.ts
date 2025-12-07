/**
 * LED Calculator API Server
 * Main entry point for the Express application
 * Requirements: 5.3, 6.1, 6.2
 */

import express, { Application } from 'express';
import path from 'path';
import { loggerMiddleware } from './middleware/logger';
import { i18nMiddleware } from './middleware/i18n';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { createCorsMiddleware, getCorsConfig } from './middleware/cors';
import { calculatorRoutes, previewRoutes } from './routes';

// Server configuration interface
interface ServerConfig {
  port: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Load configuration from environment
const config: ServerConfig = {
  port: parseInt(process.env.PORT || '3001', 10),
  logLevel: (process.env.LOG_LEVEL as ServerConfig['logLevel']) || 'info',
};

const app: Application = express();

// Apply CORS middleware - Requirements: 6.1, 6.2
// Configurable via environment variables:
// - CORS_ORIGINS: Comma-separated list of allowed origins or '*' for all
// - CORS_METHODS: Comma-separated list of allowed HTTP methods
// - CORS_ALLOWED_HEADERS: Comma-separated list of allowed headers
// - CORS_MAX_AGE: Max age for preflight cache in seconds
app.use(createCorsMiddleware());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware - Requirements: 5.2
app.use(loggerMiddleware);

// i18n middleware - Requirements: 4.1, 4.2
// Parses Accept-Language header and attaches language preference to request
app.use(i18nMiddleware);

// Serve static files from public directory
app.use('/static', express.static(path.join(__dirname, '..', 'public')));

// Serve Vue frontend app (built version)
const frontendPath = path.join(__dirname, '..', 'public', 'docs-app');
app.use('/app', express.static(frontendPath));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ 
    success: true,
    data: {
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
    },
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/calculate', calculatorRoutes);
app.use('/api/preview', previewRoutes);

// Redirect root to Vue app
app.get('/', (_req, res) => {
  res.redirect('/app/');
});

// Serve test page explicitly
app.get('/test', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'test-page.html'));
});

// Serve API reference documentation
app.get('/docs', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'api-reference.html'));
});

app.get('/api-reference', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'api-reference.html'));
});

// Serve Vue integration guide (legacy HTML)
app.get('/vue-integration', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'vue-integration.html'));
});

// Vue Frontend App routes - serve index.html for SPA routing
// All /app/* routes should serve the Vue app's index.html
app.get('/app/*', (_req, res) => {
  const indexPath = path.join(__dirname, '..', 'public', 'docs-app', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If Vue app is not built yet, redirect to legacy test page
      res.redirect('/');
    }
  });
});

// 404 handler for undefined routes
app.use(notFoundHandler);

// Error handling middleware - Requirements: 5.1
app.use(errorHandler);

// Start server - Requirements: 5.3
const startServer = (): void => {
  const corsConfig = getCorsConfig();
  app.listen(config.port, () => {
    console.log(`[Server] LED Calculator API running on port ${config.port}`);
    console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[Server] CORS origins: ${Array.isArray(corsConfig.origins) ? corsConfig.origins.join(', ') : corsConfig.origins}`);
    console.log(`[Server] CORS methods: ${corsConfig.methods.join(', ')}`);
  });
};

// Only start server if this file is run directly (not imported for testing)
if (require.main === module) {
  startServer();
}

export { app, startServer, config };
export default app;
