# Personal Book Tracker API

[![CI](https://github.com/couswall/personal-book-tracker-api/actions/workflows/ci.yml/badge.svg)](https://github.com/couswall/personal-book-tracker-api/actions/workflows/ci.yml)

A REST API for tracking your reading. Search books through the Google Books API, organize them into bookshelves, log your reading progress, set a yearly reading challenge, and see it all summarized on a dashboard.

Built with **Express 5**, **TypeScript**, **Prisma** and **PostgreSQL**, following Clean Architecture.

## Features

- **Authentication** — register, login, logout. Short-lived access token (15 min) plus a 7-day refresh token stored in an `httpOnly` cookie.
- **Book search** — search and fetch book details from the Google Books API.
- **Bookshelves** — every user gets *Read*, *Currently Reading* and *To Be Read* shelves. Add, move and remove books between them.
- **Reading progress** — track progress by page or by percentage.
- **Reading challenge** — set a yearly goal of books to read and check your progress or history.
- **Dashboard** — a single endpoint that summarizes shelves, challenge progress and reading activity.
- **API docs** — interactive Swagger UI at `/api-docs`.
- **Structured logging** — with [pino](https://getpino.io); sensitive fields (`password`, `token`, `authorization`) are redacted.

## Tech Stack

| Area      | Tools                                         |
| --------- | --------------------------------------------- |
| Runtime   | Node.js 22, TypeScript                        |
| Framework | Express 5                                     |
| Database  | PostgreSQL, Prisma ORM                        |
| Auth      | jsonwebtoken, bcryptjs, cookie-parser         |
| HTTP      | Axios (Google Books API)                      |
| Docs      | swagger-ui-express                            |
| Logging   | pino, pino-pretty                             |
| Testing   | Jest, ts-jest, Supertest                      |
| Quality   | ESLint, Prettier, Husky, lint-staged          |
| CI        | GitHub Actions                                |

## Getting Started

### Prerequisites

- Node.js 22+
- A running PostgreSQL instance (one database for development, one for tests)
- A [Google Books API key](https://developers.google.com/books/docs/v1/using#APIKey)

### Installation

```bash
git clone https://github.com/couswall/personal-book-tracker-api.git
cd personal-book-tracker-api
npm install
```

### Configure environment variables

Copy the template and fill in the values:

```bash
cp .env.template .env
```

| Variable               | Required | Description                                                                      |
| ---------------------- | -------- | -------------------------------------------------------------------------------- |
| `PORT`                 | Yes      | Port the server listens on (e.g. `3000`)                                         |
| `PUBLIC_PATH`          | Yes      | Folder for static files (e.g. `public`)                                          |
| `POSTGRES_URL`         | Yes      | PostgreSQL connection string                                                     |
| `JWT_SEED`             | Yes      | Secret used to sign access tokens                                                |
| `JWT_REFRESH_SEED`     | Yes      | Secret used to sign refresh tokens (use a different value from `JWT_SEED`)       |
| `BOOKS_API`            | Yes      | Google Books base URL: `https://www.googleapis.com/books/v1`                     |
| `GOOGLE_BOOKS_API_KEY` | Yes      | Your Google Books API key                                                        |
| `LOG_LEVEL`            | No       | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`. Default: `info`  |
| `NODE_ENV`             | No       | `development`, `production` or `test`. Default: `development` (pretty logs)      |

The template also lists `POSTGRES_USER`, `POSTGRES_DB`, `POSTGRES_PORT` and `POSTGRES_PASSWORD`, which are handy if you run Postgres in a container.

For tests, create a `.env.test` file with the same variables, pointing `POSTGRES_URL` at a **separate test database**.

### Set up the database

```bash
npx prisma migrate dev     # apply migrations to your dev database
npx prisma generate        # generate the Prisma client (output: generated/prisma)
```

### Run the server

```bash
npm run dev                # development, with hot reload
npm start                  # build to dist/ and run in production mode
```

Then open **http://localhost:&lt;PORT&gt;/api-docs** to explore the API.

## API Overview

All routes except `/api/auth/*` require an access token:

```
Authorization: Bearer <accessToken>
```

| Method   | Endpoint                                   | Description                                          |
| -------- | ------------------------------------------ | ---------------------------------------------------- |
| `POST`   | `/api/auth/register`                       | Create an account                                    |
| `POST`   | `/api/auth/login`                          | Log in; returns an access token, sets refresh cookie |
| `POST`   | `/api/auth/refresh`                        | Get a new access token using the refresh cookie      |
| `POST`   | `/api/auth/logout`                         | Clear the refresh cookie                             |
| `GET`    | `/api/book/search`                         | Search books                                         |
| `GET`    | `/api/book/bookById/:bookId`               | Get a book's details                                 |
| `GET`    | `/api/bookshelf/me`                        | Get your bookshelves and their books                 |
| `GET`    | `/api/bookshelf/bookStatus/:apiBookId`     | See which of your shelves contain a book             |
| `POST`   | `/api/bookshelfBook/addToBookshelf`        | Add a book to a shelf                                |
| `PUT`    | `/api/bookshelfBook/updateBookshelf`       | Move a book to another shelf                         |
| `PUT`    | `/api/bookshelfBook/updateReadingProgress` | Update reading progress (page or percentage)         |
| `DELETE` | `/api/bookshelfBook/:bookshelfBookId`      | Remove a book from a shelf                           |
| `GET`    | `/api/readingChallenge`                    | Your reading challenge history                       |
| `GET`    | `/api/readingChallenge/current`            | Progress for the current year's challenge            |
| `GET`    | `/api/readingChallenge/:year`              | Progress for a given year's challenge                |
| `POST`   | `/api/readingChallenge`                    | Create a reading challenge                           |
| `PATCH`  | `/api/readingChallenge/:year`              | Update a challenge's goal                            |
| `DELETE` | `/api/readingChallenge/:year`              | Delete a challenge                                   |
| `GET`    | `/api/dashboard`                           | Reading summary for the logged-in user               |

Full request and response schemas are in the Swagger UI at `/api-docs`.

### How authentication works

1. `login` returns a **15-minute access token** in the response body and sets a **7-day refresh token** as an `httpOnly` cookie (scoped to `/api/auth`).
2. The client sends the access token in the `Authorization` header.
3. When it expires, the client calls `POST /api/auth/refresh` (the cookie is sent automatically) to get a new one.
4. `logout` clears the cookie.

CORS is configured for a frontend at `http://localhost:5173` with credentials enabled.

## Project Structure

The code follows Clean Architecture, split into four layers:

```
src/
├── app.ts               # Entry point
├── config/              # Adapters (JWT, bcrypt, Axios, logger), env vars, Swagger specs
├── data/                # Prisma client setup
├── domain/              # Business rules — no framework code
│   ├── entities/        # Domain models
│   ├── dtos/            # Input validation
│   ├── use-cases/       # Application logic
│   ├── datasources/     # Abstract datasource interfaces
│   ├── repositories/    # Abstract repository interfaces
│   └── errors/          # CustomError
├── infrastructure/      # Prisma/HTTP implementations of datasources and repositories
└── presentation/        # Express routes, controllers and middlewares
prisma/                  # Schema and migrations
tests/                   # Jest tests, mirroring src/
```

**Request flow:** route → controller → DTO validation → use case → repository → datasource (Prisma or Google Books).

## Testing

Tests run against a real PostgreSQL test database defined in `.env.test`. Each test command applies pending migrations to that database first.

```bash
npm test                   # run all tests
npm run test:watch         # watch mode
npm run test:coverage      # with coverage report (output: coverage/)
```

Logs are silenced during tests.

## Scripts

| Script                        | Description                                    |
| ----------------------------- | ---------------------------------------------- |
| `npm run dev`                 | Start the dev server with hot reload           |
| `npm run build`               | Compile TypeScript to `dist/`                  |
| `npm start`                   | Build and run the compiled server              |
| `npm test`                    | Apply test migrations and run Jest             |
| `npm run test:watch`          | Run Jest in watch mode                         |
| `npm run test:coverage`       | Run Jest with coverage                         |
| `npm run lint`                | Run ESLint                                     |
| `npm run lint:fix`            | Run ESLint and auto-fix                        |
| `npm run prisma:migrate:test` | Apply migrations to the test database          |

A Husky pre-commit hook runs ESLint and Prettier on staged files.

## Continuous Integration

GitHub Actions runs on every push and pull request to `main` and `development`. It starts a PostgreSQL 16 service, then runs lint, build and the full test suite, and uploads the coverage report as an artifact.

## License

ISC
