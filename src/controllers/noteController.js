import { validationResult } from 'express-validator';
import Note from '../models/Note.js';
import { ApiError } from '../utils/errors.js';
import { Op } from 'sequelize';

export const getNotes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sort = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const where = { isDeleted: false };
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }

    const notes = await Note.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort, order.toUpperCase()]],
    });

    res.json({
      notes: notes.rows,
      total: notes.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(notes.count / limit),
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.isDeleted) {
      throw new ApiError(404, 'Note not found');
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }

    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, 'Validation Error', errors.array());
    }

    const note = await Note.findByPk(req.params.id);
    if (!note || note.isDeleted) {
      throw new ApiError(404, 'Note not found');
    }

    await note.update(req.body);
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note || note.isDeleted) {
      throw new ApiError(404, 'Note not found');
    }

    await note.update({ isDeleted: true });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};