import { Router, Request, Response } from 'express';
import multer from 'multer';
import { analyzePhotoWork } from '../services/openaiService';
import { photoRateLimiter } from '../middleware/rateLimiter';
import { PhotoCheckRequest } from '../types';

const router = Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only JPEG and PNG images
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
});

/**
 * POST /check-work - Photo Worksheet Analysis Endpoint
 */
router.post(
  '/check-work',
  photoRateLimiter,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      // Validate image
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      // Validate file size
      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(413).json({ error: 'Image file is too large. Maximum size is 2MB' });
      }

      // Validate problem type
      const { problemType } = req.body;
      if (!problemType || !['chord', 'interval', 'note', 'key-signature'].includes(problemType)) {
        return res.status(400).json({
          error: 'Problem type must be one of: chord, interval, note, key-signature',
        });
      }

      const request: PhotoCheckRequest = {
        image: req.file,
        problemType,
      };

      // Analyze image
      const response = await analyzePhotoWork(request);

      res.json(response);
    } catch (error) {
      console.error('Error in /check-work endpoint:', error);

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            error: 'File too large',
            message: 'Image file is too large. Maximum size is 2MB',
          });
        }
      }

      if (error instanceof Error) {
        // Check for OpenAI API errors
        if (error.message.includes('API key')) {
          return res.status(503).json({
            error: 'AI service configuration error',
            message: 'Our tutor is having trouble right now. Please try again later.',
          });
        }

        if (error.message.includes('rate limit') || error.message.includes('429')) {
          return res.status(503).json({
            error: 'AI service rate limit',
            message: 'Our tutor is very busy right now. Please try again in a moment.',
          });
        }

        if (error.message.includes('image') || error.message.includes('vision')) {
          return res.status(400).json({
            error: 'Image processing error',
            message: 'Couldn\'t understand the image. Please try taking a clearer photo.',
          });
        }
      }

      res.status(500).json({
        error: 'Internal server error',
        message: 'Our tutor is having trouble. Please try again.',
      });
    }
  }
);

export default router;

