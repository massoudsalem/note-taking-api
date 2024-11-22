import { jest } from '@jest/globals';
import Note from '../../src/models/Note.js';

describe('Note Model', () => {
  it('should create a note with valid data', async () => {
    const noteData = {
      title: 'Test Note',
      content: 'Test Content',
      tags: ['test']
    };

    const note = await Note.create(noteData);
    expect(note.title).toBe(noteData.title);
    expect(note.content).toBe(noteData.content);
    expect(note.tags).toEqual(noteData.tags);
    expect(note.isDeleted).toBe(false);
  });

  it('should not create a note without title', async () => {
    const noteData = {
      content: 'Test Content'
    };

    await expect(Note.create(noteData)).rejects.toThrow();
  });

  it('should not create a note with empty title', async () => {
    const noteData = {
      title: '',
      content: 'Test Content'
    };

    await expect(Note.create(noteData)).rejects.toThrow();
  });

  it('should create a note with default empty tags array', async () => {
    const noteData = {
      title: 'Test Note',
      content: 'Test Content'
    };

    const note = await Note.create(noteData);
    expect(note.tags).toEqual([]);
  });
});