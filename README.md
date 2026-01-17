# Recipe Website with Authentication

A modern recipe website built with React, Vite, Express, MongoDB, and JWT authentication.

## Features

- 🍳 Browse recipes from around the world
- 🔐 User authentication (signup/login) with JWT
- ❤️ Add recipes to favorites
- 📝 Create and manage recipe lists
- 👤 User profile management
- 🛡️ Admin panel for user management
- 📱 Responsive design
- 🎨 Modern UI with smooth animations

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Axios, Framer Motion
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **Styling:** CSS Modules, Responsive design

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd recipe-website
npm install
```

### 2. MongoDB Setup

#### Option A: Local MongoDB Installation (Windows)

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install MongoDB and start the MongoDB service
3. The default connection string `mongodb://localhost:27017/recipe-website` should work

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string from Atlas
4. Update `server.js` line 13 with your Atlas connection string:
   ```javascript
   mongoose.connect("your-atlas-connection-string-here");
   ```

### 3. Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb://localhost:27017/recipe-website
```

### 4. Start the Application

#### Development Mode (with hot reload)

```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

#### Production Build

```bash
# Build the frontend
npm run build

# Start the production server (serves both frontend and backend)
npm run server
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### User Management

- `GET /api/user/profile` - Get user profile (authenticated)
- `PUT /api/user/favorites` - Update user favorites (authenticated)
- `PUT /api/user/lists` - Update user lists (authenticated)

### Admin (Admin role required)

- `GET /api/admin/users` - Get all users

## User Roles

- **User:** Can browse recipes, add to favorites, create lists
- **Admin:** All user permissions + access to admin panel

### Creating an Admin User

To create an admin user, you can manually update a user's role in MongoDB:

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

## Project Structure

```
recipe-website/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── LoginSignupModal.jsx/css
│   │   ├── Navbar.jsx/css
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── RecipesPage.jsx/css
│   │   ├── UserPage.jsx/css
│   │   ├── AdminPanel.jsx/css
│   │   └── ...
│   ├── AuthContext.jsx     # Authentication context
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── server.js               # Express server
├── package.json
└── README.md
```

## Features Overview

### Authentication Flow

1. User clicks "Sign Up / Login" in navbar
2. Modal opens with tabs for Login and Signup
3. After successful authentication, JWT token is stored
4. Navbar updates to show user info and dropdown
5. Protected features become available

### Recipe Management

- Browse recipes with search and filters
- Add/remove from favorites (requires login)
- Create/manage recipe lists (requires login)
- View recipe details

### User Dashboard

- View favorite recipes
- Manage saved lists
- Remove items from favorites/lists

### Admin Panel

- View all users
- User statistics
- System management (expandable)

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run server       # Start backend server
npm run lint         # Run ESLint
```

### Code Style

- Uses ESLint for code linting
- CSS Modules for component styling
- Modern React patterns (hooks, context)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
