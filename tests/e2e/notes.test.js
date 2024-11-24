import { test, expect } from '@playwright/test';
import Note from '../../src/models/Note.js';

test.describe('Notes App', () => {
  test.beforeEach(async ({ page }) => {
    await Note.destroy({ where: {}, force: true });
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should create a new note', async ({ page }) => {
    await page.fill('#title', 'Test Note');
    await page.fill('#content', 'Test Content');
    await page.fill('#tags', 'test,e2e');
    await page.click('#note-form button[type="submit"]');

    await page.waitForSelector('.note');
    const noteTitle = await page.textContent('.note h2');
    const noteContent = await page.textContent('.note p');
    const noteTags = (await page.textContent('.note .tags')).trim();

    expect(noteTitle).toBe('Test Note');
    expect(noteContent).toBe('Test Content');
    expect(noteTags).toBe('test, e2e');
  });

  test('should edit an existing note', async ({ page }) => {
    await page.fill('#title', 'Initial Title');
    await page.fill('#content', 'Initial Content');
    await page.fill('#tags', 'initial');
    await page.click('#note-form button[type="submit"]');

    await page.waitForSelector('.note');
    await page.click('.note button:has-text("Edit")');
    await page.fill('#update-title', 'Updated Title');
    await page.fill('#update-content', 'Updated Content');
    await page.fill('#update-tags', 'updated,modified');
    await page.click('#update-form button[type="submit"]');

    await page.waitForSelector('.note h2:has-text("Updated Title")');

    const noteTitle = await page.textContent('.note h2');
    const noteContent = await page.textContent('.note p');
    const noteTags = (await page.textContent('.note .tags')).trim();

    expect(noteTitle).toBe('Updated Title');
    expect(noteContent).toBe('Updated Content');
    expect(noteTags).toBe('updated, modified');
  });

  test('should delete a note with confirmation', async ({ page }) => {
    await page.fill('#title', 'Note to Delete');
    await page.fill('#content', 'This will be deleted');
    await page.click('#note-form button[type="submit"]');

    await page.waitForSelector('.note');
    await page.click('.note button:has-text("Delete")');
    await page.waitForSelector('#delete-modal');
    const modalTitle = await page.textContent('#delete-note-title');
    expect(modalTitle).toBe('Note to Delete');

    await page.click('#cancel-delete');
    const noteExists = await page.isVisible('.note');
    expect(noteExists).toBe(true);

    await page.click('.note button:has-text("Delete")');
    await page.click('#confirm-delete');
    await page.waitForSelector('.note', { state: 'hidden' });
    const noteDeleted = await page.isHidden('.note');
    expect(noteDeleted).toBe(true);
  });

  test('should handle pagination', async ({ page }) => {
    for (let i = 1; i <= 6; i++) {
      await page.fill('#title', `Note ${i}`);
      await page.fill('#content', `Content ${i}`);
      await page.click('#note-form button[type="submit"]');
      await page.waitForSelector(`.note h2:has-text("Note ${i}")`);
    }

    const notesOnFirstPage = await page.$$eval('.note', notes => notes.length);
    expect(notesOnFirstPage).toBe(5);
    const pageInfoFirstPage = await page.textContent('#page-info');
    expect(pageInfoFirstPage).toBe('Page 1 of 2');

    await page.click('#next-page');
    await page.waitForSelector('.note');
    const notesOnSecondPage = await page.$$eval('.note', notes => notes.length);
    expect(notesOnSecondPage).toBe(1);
    const pageInfoSecondPage = await page.textContent('#page-info');
    expect(pageInfoSecondPage).toBe('Page 2 of 2');

    await page.click('#prev-page');
    await page.waitForSelector('.note');
    const notesOnFirstPageAgain = await page.$$eval('.note', notes => notes.length);
    expect(notesOnFirstPageAgain).toBe(5);
    const pageInfoFirstPageAgain = await page.textContent('#page-info');
    expect(pageInfoFirstPageAgain).toBe('Page 1 of 2');
  });
});
