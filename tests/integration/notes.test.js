import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../../src/app.js';
import Note from '../../src/models/Note.js';

describe('Notes API', () => {
  beforeEach(async () => {
    await Note.destroy({ where: {}, force: true });
  });

  describe('GET /api/notes', () => {
    it('should return empty array when no notes exist', async () => {
      const response = await request(app).get('/api/notes');
      expect(response.status).toBe(200);
      expect(response.body.notes).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('should return paginated notes', async () => {
      // Create test notes
      await Note.bulkCreate([
        { title: 'Note 1', content: 'Content 1' },
        { title: 'Note 2', content: 'Content 2' },
        { title: 'Note 3', content: 'Content 3' }
      ]);

      const response = await request(app)
        .get('/api/notes')
        .query({ page: 1, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.notes.length).toBe(2);
      expect(response.body.total).toBe(3);
      expect(response.body.totalPages).toBe(2);
    });

    it('should filter notes by search term', async () => {
      await Note.bulkCreate([
        { title: 'Meeting notes', content: 'Content 1' },
        { title: 'Shopping list', content: 'Content 2' },
        { title: 'Ideas', content: 'Meeting tomorrow' }
      ]);

      const response = await request(app)
        .get('/api/notes')
        .query({ search: 'meeting' });

      expect(response.status).toBe(200);
      expect(response.body.notes.length).toBe(2);
    });

    it('should return notes sorted by title', async () => {
      await Note.bulkCreate([
        { title: 'B Note', content: 'Content B' },
        { title: 'A Note', content: 'Content A' },
        { title: 'C Note', content: 'Content C' }
      ]);

      const response = await request(app)
        .get('/api/notes')
        .query({ sort: 'title', order: 'ASC' });

      expect(response.status).toBe(200);
      expect(response.body.notes).toBeDefined();
      expect(response.body.notes.length).toBe(3);
      expect(response.body.notes[0].title).toBe('A Note');
      expect(response.body.notes[1].title).toBe('B Note');
      expect(response.body.notes[2].title).toBe('C Note');
    });

    it('should return notes with pagination', async () => {
      await Note.bulkCreate([
        { title: 'Note 1', content: 'Content 1' },
        { title: 'Note 2', content: 'Content 2' },
        { title: 'Note 3', content: 'Content 3' },
        { title: 'Note 4', content: 'Content 4' }
      ]);

      const response = await request(app)
        .get('/api/notes')
        .query({ page: 2, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.notes.length).toBe(2);
      expect(response.body.currentPage).toBe(2);
      expect(response.body.totalPages).toBe(2);
    });

    test('should return notes sorted by title', async () => {
      await Note.bulkCreate([
        { title: 'B Note', content: 'Content B' },
        { title: 'A Note', content: 'Content A' },
        { title: 'C Note', content: 'Content C' }
      ]);

      const response = await request(app)
        .get('/api/notes')
        .query({ sort: 'title', order: 'ASC' });

      if (response.status !== 200) {
        console.error('Error response:', response.body);
      }

      expect(response.status).toBe(200);
      expect(response.body.notes).toBeDefined();
      expect(response.body.notes.length).toBeGreaterThan(0);
      expect(response.body.notes[0].title).toBe('A Note');
      expect(response.body.notes[1].title).toBe('B Note');
      expect(response.body.notes[2].title).toBe('C Note');
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'Test Content',
        tags: ['test', 'example']
      };

      const response = await request(app)
        .post('/api/notes')
        .send(noteData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(noteData.title);
      expect(response.body.content).toBe(noteData.content);
      expect(response.body.tags).toEqual(noteData.tags);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should not create a note with invalid data', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({ title: '', content: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update an existing note', async () => {
      const note = await Note.create({
        title: 'Original Title',
        content: 'Original Content'
      });

      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content'
      };

      const response = await request(app)
        .put(`/api/notes/${note.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.content).toBe(updateData.content);
    });

    it('should return 404 for non-existent note', async () => {
      const response = await request(app)
        .put('/api/notes/999999')
        .send({ title: 'Test', content: 'Test' });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid update data', async () => {
      const note = await Note.create({
        title: 'Original Title',
        content: 'Original Content'
      });

      const response = await request(app)
        .put(`/api/notes/${note.id}`)
        .send({ title: '', content: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should soft delete a note', async () => {
      const note = await Note.create({
        title: 'To Delete',
        content: 'Delete me'
      });

      const response = await request(app)
        .delete(`/api/notes/${note.id}`);

      expect(response.status).toBe(204);

      // Verify soft delete
      const deletedNote = await Note.findByPk(note.id);
      expect(deletedNote.isDeleted).toBe(true);
    });

    it('should return 404 for non-existent note', async () => {
      const response = await request(app)
        .delete('/api/notes/999999');

      expect(response.status).toBe(404);
    });
  });
});