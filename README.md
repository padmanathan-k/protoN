# protoN for Social

protoN for Social is a MERN-based prototype for structured social conversation.

Instead of an endless feed, the platform organizes discussion as a tree:

- `Themes` group conversation spaces
- `Seeds` start the root idea
- `Reeds` grow the discussion as nested replies

The product is designed to feel simple, visual, and interactive while helping users explore ideas with more context than a traditional scroll-based social app.

## Product Vision

protoN for Social treats conversation like growth instead of noise.

- Users explore multiple themes at once
- Each discussion begins as a seed
- Replies stay connected in a recursive tree
- Users can contribute with text, image, video, or audio seeds
- The interface stays minimal, responsive, and beginner-friendly

## Core Features

- JWT-based authentication
- Login with `username or email`
- Theme creation with support for `custom`, `hybrid`, and `hierarchy` theme types
- Multi-theme selection from the home page
- Seed publishing under a selected theme
- Multimedia seed support:
  - image
  - video
  - audio
  - text-only
- Nested reed replies rendered recursively
- Upvote support for seeds and reeds
- Editable profile page with image upload
- `My Growth` contribution page
- `Nest` page for growers and growing
- Light and dark interface modes

## Tech Stack

### Frontend

- React
- React Router
- Context API
- Vite
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication

## Project Structure

```text
protoN for Social/
  README.md
  backend/
    .env.example
    package.json
    server.js
    src/
      app.js
      config/
        db.js
      controllers/
        authController.js
        themeController.js
        seedController.js
        reedController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
      models/
        User.js
        Theme.js
        Seed.js
        Reed.js
      routes/
        authRoutes.js
        themeRoutes.js
        seedRoutes.js
        reedRoutes.js
      services/
        feedService.js
      Utils/
        treeBuilder.js
        validators.js
  frontend/
    .env.example
    package.json
    index.html
    vite.config.js
    src/
      App.jsx
      index.jsx
      styles.css
      api/
        client.js
      components/
        AppShell.jsx
        AuthScene.jsx
        Login.jsx
        Register.jsx
      context/
        AppContext.jsx
      pages/
        Home.jsx
        Profile.jsx
        Growth.jsx
        Nest.jsx
```

## How the Platform Works

### 1. Authentication

Users can register and log in using:

- username + password
- email + password

The backend returns a JWT token and user profile data. The frontend stores the token locally and attaches it to protected requests.

### 2. Themes

Themes act like structured social spaces. A user can:

- create a theme
- select multiple themes
- clear selection
- explore all themes through Dive Mode

### 3. Seeds

Seeds are the main posts inside a theme. A seed can include:

- title
- content
- optional media

Media currently works in prototype style, using uploaded files converted into data URLs for preview and storage flow.

### 4. Reeds

Reeds are nested replies attached to:

- a seed
- another reed

This creates a recursive tree structure instead of a flat comment list.

### 5. Profile and Growth

Users can:

- edit their profile
- upload a profile image
- add headline, bio, and location
- explore their activity through `My Growth`
- view follower/following relationships in `Nest`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`

### Themes

- `GET /api/themes`
- `POST /api/themes`

### Seeds

- `GET /api/seeds/theme/:themeId`
- `POST /api/seeds`
- `GET /api/seeds/:seedId/tree`
- `POST /api/seeds/:seedId/upvote`

### Reeds

- `POST /api/reeds`
- `POST /api/reeds/:reedId/upvote`

## Database Models

### User

- username
- email
- password
- headline
- bio
- location
- avatarUrl

### Theme

- title
- description
- themeType
- createdBy

### Seed

- theme
- author
- title
- content
- mediaType
- mediaUrl
- upvotes

### Reed

- seed
- parentReed
- author
- content
- upvotes

## Run the App Locally

### 1. Backend env

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/proton-social
JWT_SECRET=replace-with-a-secret-key
```

### 2. Frontend env

Create `frontend/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 4. Start the backend

```bash
cd backend
npm run dev
```

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

### 6. Open the app

Visit:

[http://localhost:5173](http://localhost:5173)

## Run with Docker

The project now includes:

- [docker-compose.yml](C:/Users/Padmanathan%20K/Desktop/protoN%20for%20Social/docker-compose.yml)
- [backend/Dockerfile](C:/Users/Padmanathan%20K/Desktop/protoN%20for%20Social/backend/Dockerfile)
- [frontend/Dockerfile](C:/Users/Padmanathan%20K/Desktop/protoN%20for%20Social/frontend/Dockerfile)

### Start the full stack

```bash
docker compose up --build
```

### Open the app

- Frontend: [http://localhost:8080](http://localhost:8080)
- Backend API: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- MongoDB: `mongodb://localhost:27017`

### Stop containers

```bash
docker compose down
```

### Stop containers and remove MongoDB volume

```bash
docker compose down -v
```

## Docker Hub and GitHub Actions

The `CD` workflow can also build and push Docker images automatically on every push to `main`.

Add these GitHub Actions secrets in your repository:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Docker images will be published as:

- `pravinvk/proton-backend`
- `pravinvk/proton-frontend`

Recommended Docker Hub login locally:

```bash
echo YOUR_DOCKERHUB_TOKEN | docker login -u pravinvk --password-stdin
```

## Current Prototype Notes

- This is an MVP-style build, not a production deployment
- Multimedia upload is prototype-oriented and not backed by cloud storage
- The UI focuses on clarity, structured conversation, and interactive exploration
- The codebase is intentionally readable for MERN learners

## Future Enhancements

- Dedicated cloud media storage
- Follow system backed by persistent relationships
- Better analytics for growth and engagement
- Search across themes, seeds, and reeds
- Rich notifications
- More advanced moderation and permissions
