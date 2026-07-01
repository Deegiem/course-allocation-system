import request from 'supertest';
import app from '../../src/app';

describe('API Integration Tests', () => {
  describe('Health Check', () => {
    it('should return 200 OK with status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service', 'Course Allocation System');
    });
  });

  describe('Lecturer API', () => {
    it('should return 200 for GET /api/v1/lecturers', async () => {
      const response = await request(app)
        .get('/api/v1/lecturers')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Course API', () => {
    it('should return 200 for GET /api/v1/courses', async () => {
      const response = await request(app)
        .get('/api/v1/courses')
        .expect(200);

      expect(response.body).toHaveProperty('success');
    });
  });
});