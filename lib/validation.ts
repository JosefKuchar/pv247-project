import { z } from 'zod';

// Regex patterns for validation - shared across client and server
export const nameRegex = /^[\p{L}\p{M}\p{N} .'-]+$/u; // Unicode letters, marks, numbers, spaces, periods, hyphens, apostrophes
export const handlePattern = /^[a-zA-Z0-9_]{1,30}$/; // Letters, numbers, underscores only
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/; // At least one lowercase, uppercase, and digit

// Shared validation schemas
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .regex(nameRegex, 'Name contains invalid characters');

export const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(30, 'Display name must be 30 characters or less')
  .regex(nameRegex, 'Display name contains invalid characters');

export const handleSchema = z
  .string()
  .min(1, 'Handle is required')
  .max(30, 'Handle must be less than 30 characters')
  .regex(
    handlePattern,
    'Handle can only contain letters, numbers, and underscores',
  );

export const emailSchema = z.email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    passwordPattern,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  );

export const descriptionSchema = z
  .string()
  .max(150, 'Description must be 150 characters or less');

// Review description schema (different limits)
export const reviewDescriptionSchema = z
  .string()
  .max(2500, 'Description must be under 2,500 characters');

// Comment content schema
export const commentSchema = z
  .string()
  .min(1, 'Comment cannot be empty')
  .max(500, 'Comment must be 500 characters or less');

// Common field validation functions
export const validateName = (name: string): string | null => {
  if (!name || typeof name !== 'string') {
    return 'Name is required';
  }
  if (!nameRegex.test(name)) {
    return 'Name contains invalid characters';
  }
  return null;
};

export const validateHandle = (handle: string): string | null => {
  if (!handle || typeof handle !== 'string') {
    return 'Handle is required';
  }
  if (handle.length > 30) {
    return 'Handle must be less than 30 characters';
  }
  if (!handlePattern.test(handle)) {
    return 'Handle can only contain letters, numbers, and underscores';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email || typeof email !== 'string') {
    return 'Email is required';
  }
  try {
    emailSchema.parse(email);
    return null;
  } catch {
    return 'Please enter a valid email address';
  }
};

export const validatePassword = (password: string): string | null => {
  if (!password || typeof password !== 'string') {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (password.length > 128) {
    return 'Password must be less than 128 characters';
  }
  if (!passwordPattern.test(password)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
  }
  return null;
};
