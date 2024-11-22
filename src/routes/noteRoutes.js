import { Router } from 'express';
import { body } from 'express-validator';
import * as noteController from '../controllers/noteController.js';

const router = Router();

const noteValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.post('/', noteValidation, noteController.createNote);
router.put('/:id', noteValidation, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;