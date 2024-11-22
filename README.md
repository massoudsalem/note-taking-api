# Note-Taking API

A robust REST API for note management built with Node.js, Express, and Sequelize.

## Features

- Complete CRUD operations for notes
- Soft delete functionality
- Search and filtering capabilities
- Pagination support
- Input validation
- Error handling
- MySQL database with Sequelize ORM

## API Endpoints

- GET /api/notes - List all notes (with pagination)
- GET /api/notes/:id - Get a specific note
- POST /api/notes - Create a new note
- PUT /api/notes/:id - Update a note
- DELETE /api/notes/:id - Soft delete a note

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy .env.example to .env
   - Update database credentials

3. Create database:
   ```bash
   npm run create-db
   ```

4. Run migrations:
   ```bash
   npm run migrate
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── models/         # Database models
├── routes/         # API routes
└── utils/          # Utility functions
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
the propose of this project is to learn how to build a REST API with Node.js, Express, and Sequelize for My students. feel free to use it in educational purposes.