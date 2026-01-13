import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../types';

export const generateToken = (payload: JwtPayload): string => {
  const secret: string = config.jwtSecret || 'fallback_secret_key_change_this';
  const expiresIn: string = config.jwtExpire || '7d';

  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const secret: string = config.jwtSecret || 'fallback_secret_key_change_this';
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
