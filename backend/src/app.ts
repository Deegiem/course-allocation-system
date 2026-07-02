import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import your route files
import lecturerRoutes from './presentation/routes/lecturerRoutes';
import courseRoutes from './presentation/routes/courseRoutes';
import allocationRoutes from './presentation/routes/allocationRoutes';
import policyRoutes from './presentation/routes/policyRoutes';
import reportRoutes from './presentation/routes/reportRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://course-allocation-system-eta.vercel.app', // ← Your Vercel URL
];

// Middleware
app.use(helmet());
app.use(cors({ origin: 
  allowedOrigins,
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/lecturers', lecturerRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/allocations', allocationRoutes);
app.use('/api/v1/policies', policyRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Course Allocation System',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Course Allocation System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      lecturers: '/api/v1/lecturers',
      courses: '/api/v1/courses',
      allocations: '/api/v1/allocations',
      reports: '/api/v1/reports',
      policies: '/api/v1/policies'
    }
  });
});

// src/app.ts - Add this before the 404 handler
app.get('/api/debug/routes', (_req, res) => {
  const routes: string[] = [];
  
  const getRoutes = (stack: any[], basePath: string = '') => {
    for (const layer of stack) {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        routes.push(`${methods} ${basePath}${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle.stack) {
        const routerPath = layer.regexp.source
          .replace('\\/?(?=\\/|$)', '')
          .replace(/\\\//g, '/')
          .replace(/\^/g, '')
          .replace(/\?/g, '');
        getRoutes(layer.handle.stack, routerPath);
      }
    }
  };
  
  getRoutes(app._router.stack);
  res.json({ routes: routes.sort() });
});

// 404 handler - Return JSON instead of HTML
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist'
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API available at http://localhost:${PORT}/api/v1`);
});

export default app;