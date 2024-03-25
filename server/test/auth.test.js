import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { register, login } from '../controllers/auth';
import User from '../models/User';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

describe('register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    const req = {
      body: {
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        picturePath: 'example.jpg',
        friends: [],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    bcrypt.genSalt.mockResolvedValue('salt123');
    bcrypt.hash.mockResolvedValue('hashedPassword123');

    User.mockReturnValueOnce({
      save: jest.fn().mockResolvedValue({
        _id: 'user123',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        picturePath: 'example.jpg',
        friends: [],
      }),
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'user123',
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      picturePath: 'example.jpg',
      friends: [],
    });
  });
});

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login an existing user', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const user = {
      _id: 'user123',
      email: 'test@example.com',
      password: 'hashedPassword123',
    };

    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token123');

    await login(req, res);

    console.log(res.status);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'token123',
      user: {
        _id: 'user123',
        email: 'test@example.com',
      },
    });
  });
});