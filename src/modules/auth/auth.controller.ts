import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../../models/User';
import { generateToken } from '../../utils/jwt';
import { AuthRequest, AuthResponse } from '../../types';
import { AppError } from '../../utils/errors';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email as string,
      role: user.role as 'user' | 'admin',
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response: AuthResponse = {
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id.toString(),
        email: user.email as string,
        fullName: user.fullName as string,
        role: user.role as string,
        balance: user.balance as number,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    throw error;
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact support.', 403);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email as string,
      role: user.role as 'user' | 'admin',
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const response: AuthResponse = {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        email: user.email as string,
        fullName: user.fullName as string,
        role: user.role as string,
        balance: user.balance as number,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.clearCookie('token');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    throw error;
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id.toString(),
        email: user.email as string,
        fullName: user.fullName as string,
        role: user.role as string,
        balance: user.balance as number,
        isActive: user.isActive as boolean,
        isEmailVerified: user.isEmailVerified as boolean,
        createdAt: user.createdAt as Date,
      },
    });
  } catch (error) {
    throw error;
  }
};
