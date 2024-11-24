document.addEventListener('DOMContentLoaded', () => {
  const noteForm = document.getElementById('note-form');
  const updateForm = document.getElementById('update-form');
  const notesContainer = document.getElementById('notes-container');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const pageInfo = document.getElementById('page-info');
  const deleteModal = document.getElementById('delete-modal');
  const deleteNoteTitle = document.getElementById('delete-note-title');
  const cancelDeleteButton = document.getElementById('cancel-delete');
  const confirmDeleteButton = document.getElementById('confirm-delete');
  let noteToDelete = null;

  let currentPage = 1;
  const limit = 5;
  let currentNoteId = null;

  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, tags })
      });

      if (response.ok) {
        fetchNotes();
        noteForm.reset();
      } else {
        console.error('Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  });

  updateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('update-title').value;
    const content = document.getElementById('update-content').value;
    const tags = document.getElementById('update-tags').value.split(',').map(tag => tag.trim());

    try {
      const response = await fetch(`/api/notes/${currentNoteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, tags })
      });

      if (response.ok) {
        fetchNotes();
        updateForm.reset();
        updateForm.classList.add('hidden');
        noteForm.classList.remove('hidden');
      } else {
        console.error('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  });

  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchNotes();
    }
  });

  nextPageButton.addEventListener('click', () => {
    currentPage++;
    fetchNotes();
  });

  cancelDeleteButton.addEventListener('click', () => {
    deleteModal.classList.remove('active');
  });

  confirmDeleteButton.addEventListener('click', async () => {
    if (noteToDelete) {
      try {
        const response = await fetch(`/api/notes/${noteToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchNotes();
        } else {
          console.error('Failed to delete note');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      } finally {
        deleteModal.classList.remove('active');
      }
    }
  });

  async function fetchNotes() {
    try {
      const response = await fetch(`/api/notes?page=${currentPage}&limit=${limit}`);

      if (response.ok) {
        const data = await response.json();
        notesContainer.innerHTML = '';
        data.notes.forEach(note => addNoteToDOM(note));
        pageInfo.textContent = `Page ${data.currentPage} of ${data.totalPages}`;
        prevPageButton.disabled = data.currentPage === 1;
        nextPageButton.disabled = data.currentPage === data.totalPages;
      } else {
        console.error('Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  function addNoteToDOM(note) {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.content}</p>
      <div class="tags">${note.tags.join(', ')}</div>
      <button onclick="editNote('${note.id}', '${note.title}', '${note.content}', '${note.tags.join(', ')}')"><i class="fas fa-edit"></i> Edit</button>
      <button onclick="deleteNote('${note.id}', '${note.title}')"><i class="fas fa-trash"></i> Delete</button>
    `;
    notesContainer.appendChild(noteElement);
  }

  window.editNote = (id, title, content, tags) => {
    currentNoteId = id;
    document.getElementById('update-title').value = title;
    document.getElementById('update-content').value = content;
    document.getElementById('update-tags').value = tags;
    updateForm.classList.remove('hidden');
    noteForm.classList.add('hidden');
  };

  window.deleteNote = (id, title) => {
    noteToDelete = id;
    deleteNoteTitle.textContent = title;
    deleteModal.classList.add('active');
  };

  fetchNotes();
});
