import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import app from '../../app.js';
import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

describe('Server Router', () => {
  describe('Public Routes', () => {
    beforeEach(async () => {
      await prisma.user.deleteMany({ where: { email: 'betty.scott@gmail.com' } });
    });

    it('Route /registration should return Registration', async () => {
      const response = await request(app)
        .post('/registration')
        .send({
          name: 'Betty Scott',
          email: 'betty.scott@gmail.com',
          password: 'T0@bc30P51!'
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 201,
        message: 'User registered successfully'
      });
    });
  });

  //   describe('Private Routes', () => {});
});
