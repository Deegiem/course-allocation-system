"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import your route files
const lecturerRoutes_1 = __importDefault(require("./presentation/routes/lecturerRoutes"));
const courseRoutes_1 = __importDefault(require("./presentation/routes/courseRoutes"));
const allocationRoutes_1 = __importDefault(require("./presentation/routes/allocationRoutes"));
const policyRoutes_1 = __importDefault(require("./presentation/routes/policyRoutes"));
const reportRoutes_1 = __importDefault(require("./presentation/routes/reportRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use('/api/v1/lecturers', lecturerRoutes_1.default);
app.use('/api/v1/courses', courseRoutes_1.default);
app.use('/api/v1/allocations', allocationRoutes_1.default);
app.use('/api/v1/policies', policyRoutes_1.default);
app.use('/api/v1/reports', reportRoutes_1.default);
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
// 404 handler - Return JSON instead of HTML
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        message: 'The requested API endpoint does not exist'
    });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
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
exports.default = app;
//# sourceMappingURL=app.js.map