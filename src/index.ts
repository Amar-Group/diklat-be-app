import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { loggerMiddleware } from './middleware/appToken';
import { originGuard, corsMiddleware } from './middleware/originGuard';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';
import userRoutes from './app/user/route/user.route';
import roleRoutes from './app/role/route/role.route';
import menuRoutes from './app/menu/route/menu.route';
import rolePermissionRoutes from './app/role_permission/route/role-permission.route';
import { apiReference } from '@scalar/hono-api-reference';
import {
  createOpenApiDocument,
  getServerUrl,
} from './docs/openapi';

const app = new Hono();

// Global Middleware
app.use('*', corsMiddleware);
app.use('*', originGuard);
app.use(logger());
app.use(loggerMiddleware);

// Welcome endpoint (Public)

app.get('/ninuu', (c) => {
  return c.json({
    success: true,
    message: 'Test',
  })
})

app.get('/', (c) => {
  return c.json({
    success: true,
    message: 'Welcome to Hono Backend Starter API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint (Public)
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// OpenAPI and Scalar reference (Public)
app.get('/openapi.json', (c) => {
  const baseUrl = getServerUrl(c.req.url);
  return c.json(createOpenApiDocument(baseUrl));
});

app.get('/docs', apiReference({
  spec: {
    url: '/openapi.json',
  },
} as any));

import companyRoutes from './app/company/route/company.route';
import courseRoutes from './app/course/route/course.route';
import { publicCatalogRouter } from './app/course/route/public-catalog.route';
import { instructorRouter } from './app/instructor/route/instructor.route';
import { participantRouter } from './app/participant/route/participant.route';
import { classRouter } from './app/class/route/class.route';
import { moduleRoutes } from './app/module/route/module.route';
import { materialRoutes } from './app/material/route/material.route';
import { sessionRoutes } from './app/session/route/session.route';
import { attendanceRoutes } from './app/attendance/route/attendance.route';
import { logisticRoutes } from './app/logistic/route/logistic.route';
import { quizRoutes } from './app/quiz/route/quiz.route';
import { questionRoutes } from './app/question/route/question.route';
import { invoiceRoutes } from './app/invoice/route/invoice.route';
import { evaluationRoutes } from './app/evaluation/route/evaluation.route';
import { certificateRoutes } from './app/certificate/route/certificate.route';

// API Routes - Feature based
// Note: User routes have public login endpoint, others require JWT
app.route('/api/users', userRoutes);
app.route('/api/roles', roleRoutes);
app.route('/api/menus', menuRoutes);
app.route('/api/role-permissions', rolePermissionRoutes);
app.route('/api/companies', companyRoutes);
app.route('/api/courses', courseRoutes);
app.route('/api/public', publicCatalogRouter);
app.route('/api/instructors', instructorRouter);
app.route('/api/participants', participantRouter);
app.route('/api/classes', classRouter);
app.route('/api/modules', moduleRoutes);
app.route('/api/materials', materialRoutes);
app.route('/api/sessions', sessionRoutes);
app.route('/api/attendances', attendanceRoutes);
app.route('/api/logistics', logisticRoutes);
app.route('/api/quizzes', quizRoutes);
app.route('/api/questions', questionRoutes);
app.route('/api/invoices', invoiceRoutes);
app.route('/api/evaluations', evaluationRoutes);
app.route('/api/certificates', certificateRoutes);

// Handlers
app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
