# protoN for Social

protoN for Social is a beginner-friendly MERN prototype for structured social discussion. Instead of an endless feed, users move through a tree:

- `Themes` organize topics
- `Seeds` are root posts
- `Reeds` are nested replies under a seed or another reed

## Folder structure

```text
protoN for Social/
  README.md
  backend/
    package.json
    server.js
    src/
      app.js
      config/db.js
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
      utils/
        treeBuilder.js
  frontend/
    package.json
    index.html
    vite.config.js
    src/
      App.jsx
      index.jsx
      styles.css
      api/client.js
      components/
        Login.jsx
        Register.jsx
      context/AppContext.jsx
      pages/Home.jsx
```

## Backend implementation

### Models

- `User`: username, email, passwordHash
- `Theme`: title, description, createdBy
- `Seed`: theme, author, title, content, upvotes
- `Reed`: seed, parentReed, author, content, upvotes

### Controllers

- `authController.js`: register, login, get profile
- `themeController.js`: create and fetch themes
- `seedController.js`: create seeds, list by theme, fetch one seed with its reed tree, toggle upvote
- `reedController.js`: create nested reeds, toggle upvote

### Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/themes`
- `POST /api/themes`
- `GET /api/seeds/theme/:themeId`
- `POST /api/seeds`
- `GET /api/seeds/:seedId/tree`
- `POST /api/seeds/:seedId/upvote`
- `POST /api/reeds`
- `POST /api/reeds/:reedId/upvote`

## Frontend implementation

- `Login` and `Register` pages handle JWT auth
- `Home` shows the three-column dashboard
- left side: themes + create forms
- center: selected seed + recursive reed tree
- right side: theme seeds + simple top seeds ranking

The recursive tree is rendered by the `ReedNode` component in `Home.jsx`, which renders its own `children`.

## API flow

1. User registers or logs in
2. Backend returns JWT and user details
3. Frontend stores the token in localStorage and sends it on protected requests
4. User creates a theme
5. User creates a seed under a theme
6. User adds reeds to a seed or to another reed
7. Backend fetches all reeds for a seed and converts them into a nested tree with `treeBuilder.js`
8. Frontend renders that tree recursively

## Run instructions

### 1. Backend environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/proton-social
JWT_SECRET=replace-with-a-secret-key
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Start backend

```bash
cd backend
npm run dev
```

### 5. Start frontend

```bash
cd frontend
npm run dev
```

### 6. Open the app

Visit the local frontend URL, usually `http://localhost:5173`.

## Notes

- The UI stays intentionally minimal and prototype-focused
- Expand/collapse and upvote are included as optional lightweight extras
- This is modular enough to scale later, but still readable for MERN beginners
