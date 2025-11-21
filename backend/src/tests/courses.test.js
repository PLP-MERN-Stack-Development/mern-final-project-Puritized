import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

let tutorToken = null;

beforeAll(async () => {
  await connectDB(process.env.MONGO_URI_TEST || process.env.MONGO_URI);
  await User.deleteMany({});
  await Course.deleteMany({});

  const tutor = new User({ name: 'Tutor', email: 'tutor@ex.com', passwordHash: 'tutorpass', role: 'tutor' });
  await tutor.save();
  const login = await request(app).post('/api/auth/login').send({ email: 'tutor@ex.com', password: 'tutorpass' });
  tutorToken = login.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

test('tutor can create course', async () => {
  const res = await request(app)
    .post('/api/courses')
    .set('Authorization', `Bearer ${tutorToken}`)
    .send({ title: 'New Course', description: 'Desc', price: 100 });
  expect(res.statusCode).toBe(201);
  expect(res.body.data.title).toBe('New Course');
});