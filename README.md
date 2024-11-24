# Note-Taking API and Frontend

A robust note-taking application with a REST API built with Node.js, Express, and Sequelize, and a frontend built with HTML, CSS, and JavaScript.

## Features

- Complete CRUD operations for notes
- Soft delete functionality
- Search and filtering capabilities
- Pagination support
- Input validation
- Error handling
- MySQL database with Sequelize ORM
- User-friendly frontend interface
- unit and integration tests with Jest
- e2e tests with playwright

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

## Frontend

The frontend is served by the Express server from the `src/ui` directory. It is a simple HTML, CSS, and JavaScript application that interacts with the API to perform CRUD operations on notes.

## Development

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## Project Structure

```
tests/
├── integration/     # Integration tests
├── unit/            # Unit tests
└── e2e/             # End-to-end tests
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── ui/             # Frontend files
└── utils/          # Utility functions
```
## Testing

The project uses the Jest testing framework for unit and integration tests. To run the tests, use the following command:

```bash
npm test
```

The project also includes end-to-end tests using Playwright. To run the e2e tests, use the following command:

```bash
npm run test:e2e
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
the propose of this project is to learn how to build a REST API with Node.js, Express, and Sequelize for My students. feel free to use it in educational purposes.