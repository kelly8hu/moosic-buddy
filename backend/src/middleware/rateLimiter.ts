import { Request, Response, NextFunction } from 'express';
import { RateLimitInfo } from '../types';

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitInfo>();

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10); // 1 hour
const RATE_LIMIT_CHAT_MAX = parseInt(process.env.RATE_LIMIT_CHAT_MAX || '50', 10);
const RATE_LIMIT_PHOTO_MAX = parseInt(process.env.RATE_LIMIT_PHOTO_MAX || '20', 10);
const RATE_LIMIT_DAILY_MAX = parseInt(process.env.RATE_LIMIT_DAILY_MAX || '200', 10);
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get or create rate limit info for an install ID
 */
function getRateLimitInfo(installId: string): RateLimitInfo {
  const now = Date.now();
  let info = rateLimitStore.get(installId);

  if (!info) {
    info = {
      installId,
      chatCount: 0,
      photoCount: 0,
      dailyCount: 0,
      lastReset: now,
    };
    rateLimitStore.set(installId, info);
  }

  // Reset hourly counts if window has passed
  if (now - info.lastReset >= RATE_LIMIT_WINDOW_MS) {
    info.chatCount = 0;
    info.photoCount = 0;
    info.lastReset = now;
  }

  // Reset daily count if 24 hours have passed
  const dailyResetTime = info.lastReset + DAILY_WINDOW_MS;
  if (now >= dailyResetTime) {
    info.dailyCount = 0;
  }

  return info;
}

/**
 * Rate limiter for chat endpoint
 */
export function chatRateLimiter(req: Request, res: Response, next: NextFunction) {
  const installId = req.headers['x-install-id'] as string;

  if (!installId) {
    return res.status(400).json({ error: 'X-Install-ID header is required' });
  }

  const info = getRateLimitInfo(installId);

  // Check daily limit first
  if (info.dailyCount >= RATE_LIMIT_DAILY_MAX) {
    const resetTime = new Date(info.lastReset + DAILY_WINDOW_MS);
    const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({
      error: 'Daily request limit exceeded',
      message: 'You\'ve asked lots of questions today! Take a break and come back tomorrow.',
    });
  }

  // Check chat limit
  if (info.chatCount >= RATE_LIMIT_CHAT_MAX) {
    const resetTime = new Date(info.lastReset + RATE_LIMIT_WINDOW_MS);
    const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'You\'ve asked lots of questions today! Take a break and come back tomorrow.',
    });
  }

  // Increment counters
  info.chatCount++;
  info.dailyCount++;
  rateLimitStore.set(installId, info);

  next();
}

/**
 * Rate limiter for photo check endpoint
 */
export function photoRateLimiter(req: Request, res: Response, next: NextFunction) {
  const installId = req.headers['x-install-id'] as string;

  if (!installId) {
    return res.status(400).json({ error: 'X-Install-ID header is required' });
  }

  const info = getRateLimitInfo(installId);

  // Check daily limit first
  if (info.dailyCount >= RATE_LIMIT_DAILY_MAX) {
    const resetTime = new Date(info.lastReset + DAILY_WINDOW_MS);
    const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({
      error: 'Daily request limit exceeded',
      message: 'You\'ve checked lots of worksheets today! Take a break and come back tomorrow.',
    });
  }

  // Check photo limit
  if (info.photoCount >= RATE_LIMIT_PHOTO_MAX) {
    const resetTime = new Date(info.lastReset + RATE_LIMIT_WINDOW_MS);
    const retryAfter = Math.ceil((resetTime.getTime() - Date.now()) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'You\'ve checked lots of worksheets today! Take a break and come back tomorrow.',
    });
  }

  // Increment counters
  info.photoCount++;
  info.dailyCount++;
  rateLimitStore.set(installId, info);

  next();
}

