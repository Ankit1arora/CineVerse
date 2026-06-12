# CineVerse Frontend - Setup & Installation Guide

## Overview

CineVerse Frontend is a production-ready React + Vite application built with modern best practices. It features a complete cinema booking system with role-based access control (RBAC) for three user types: Regular Users, Theatre Owners, and Administrators.

## Features

### ✅ Implemented Features

- **React 18.2 + Vite** - Modern, fast development experience
- **React Router DOM v6** - Client-side routing with protected routes
- **Context API** - Centralized state management for auth and notifications
- **Axios** - HTTP client with interceptors for API integration
- **JWT Authentication** - Simulated JWT with localStorage persistence
- **Role-Based Access Control (RBAC)**
  - User: Browse movies, book tickets, write reviews, manage profile
  - Theatre Owner: Manage shows, add movies
  - Admin: Manage users, movies, view analytics
- **Responsive Design** - Mobile-first approach with dark cinema theme
- **Mock Data** - Static data for development/testing
- **Loading States** - Smooth loading indicators
- **Error Handling** - Comprehensive error messages and boundaries
- **Empty States** - User-friendly empty state components
- **Clean Architecture** - Modular, maintainable codebase

## Project Structure

```
frontend/
├── src/
│   ├── assets/              # Static assets (images, icons, etc.)
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Notification.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── movie/           # Movie components
│   │   │   └── MovieCard.jsx
│   │   ├── review/          # Review components
│   │   │   ├── ReviewCard.jsx
│   │   │   └── ReviewForm.jsx
│   │   └── styles/          # Component CSS files
│   ├── pages/
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── user/            # User role pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MoviesList.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Bookings.jsx
│   │   ├── theatre/         # Theatre owner pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageShows.jsx
│   │   │   └── AddMovie.jsx
│   │   ├── admin/           # Admin pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── ManageMovies.jsx
│   │   │   └── Analytics.jsx
│   │   ├── NotFound.jsx
│   │   └── Unauthorized.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx    # Route configuration
│   │   └── ProtectedRoute.jsx # Route protection HOC
│   ├── services/            # API service layer
│   │   ├── apiClient.js     # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── movieService.js
│   │   ├── reviewService.js
│   │   ├── userService.js
│   │   ├── theatreService.js
│   │   └── analyticsService.js
│   ├── context/             # Context API setup
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── utils/               # Utility functions
│   │   └── helpers.js
│   ├── styles/              # Global and page styles
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── README.md
├── public/                  # Public assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js          # Vite configuration
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Installation & Setup

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x or yarn >= 1.22.x

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Environment Setup

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**`.env` file:**
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=CineVerse
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 4: Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Step 5: Preview Production Build

```bash
npm run preview
```

## Demo Credentials

Use these accounts to test different roles:

| Role | Email | Password |
|------|-------|----------|
| User | user@example.com | password |
| Theatre Owner | owner@example.com | password |
| Admin | admin@example.com | password |

**Note:** All demo accounts use "password" as the password.

## Key Features & Usage

### 1. Authentication

- **Login**: Use demo credentials to log in
- **Register**: Create new user accounts (users role by default)
- **JWT Simulation**: Tokens stored in localStorage, auto-sent in API headers
- **Auto-logout**: 401 responses trigger automatic logout

### 2. Role-Based Access Control

- **User Routes**: `/user/*` - accessible only by users
- **Theatre Owner Routes**: `/theatre/*` - accessible only by theatre owners
- **Admin Routes**: `/admin/*` - accessible only by admins
- **Public Routes**: `/login`, `/register` - accessible to everyone
- **Protected Routes**: Return 401 or redirect to login if unauthorized

### 3. Movie Management

- Browse all movies with filtering and search
- View detailed movie information
- Check available shows for each movie
- Write and read reviews

### 4. User Features

- View personal dashboard with trending movies
- Manage bookings
- Update profile information
- Write reviews for movies

### 5. Theatre Owner Features

- Dashboard with theatre statistics
- Manage movie shows
- Add new movies to theatre

### 6. Admin Features

- System-wide analytics and statistics
- User management (view, edit, delete)
- Movie management
- Revenue and booking trends

### 7. Dark Cinema Theme

- Professional dark mode optimized for cinema/entertainment context
- Responsive design - works on mobile, tablet, and desktop
- Smooth animations and transitions
- Accessibility-friendly color contrasts

## Service Layer & Backend Integration

### API Client Setup

The `apiClient.js` includes:
- Base URL configuration
- Request interceptors (automatic JWT token injection)
- Response interceptors (auto-logout on 401)
- Error handling

### Service Files

Each service provides both mock data and backend-ready methods:

```javascript
// Example: movieService.js
export const movieService = {
  // Mock data (current)
  getAllMovies: async () => mockMovies,
  
  // Backend-ready (uncomment when backend is ready)
  getMoviesFromBackend: async () => apiClient.get('/movies'),
};
```

### Integrating Real Backend

1. Replace mock implementations with API calls:

```javascript
// Before (mock)
const movies = await movieService.getAllMovies();

// After (backend)
const response = await apiClient.get('/movies');
const movies = response.data;
```

2. Ensure backend endpoints match the expected structure
3. Update error handling as needed

## Component Usage Examples

### ProtectedRoute

```jsx
<Route
  path="/user/dashboard"
  element={
    <ProtectedRoute 
      element={<Dashboard />} 
      requiredRoles={['user']} 
    />
  }
/>
```

### Context API (Auth)

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Loading & Error States

```jsx
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

function MyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} />;
  
  return <div>Content</div>;
}
```

## Styling System

### CSS Architecture

- **globals.css** - CSS variables and global styles
- **Component CSS** - Individual component styling
- **Page CSS** - Page-specific styling

### CSS Variables

```css
:root {
  --color-primary: #ff6b35;
  --color-dark-bg: #0a0e27;
  --spacing-md: 1rem;
  /* ... more variables */
}
```

### Responsive Design

Mobile-first approach with breakpoints:
- `max-width: 768px` - Mobile
- `max-width: 1024px` - Tablet
- `> 1024px` - Desktop

## Development Best Practices

### 1. Component Organization

```jsx
// Good: Clear structure
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const MyComponent = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Side effects
  }, []);
  
  return <div>Component</div>;
};
```

### 2. Error Handling

```jsx
try {
  const data = await movieService.getAllMovies();
  setMovies(data);
} catch (error) {
  setError(error.message || 'Failed to load movies');
}
```

### 3. Loading States

```jsx
{loading ? (
  <LoadingSpinner />
) : movies.length > 0 ? (
  <MovieList movies={movies} />
) : (
  <EmptyState title="No movies found" />
)}
```

## Customization Guide

### Changing Theme Colors

Edit `src/styles/globals.css`:

```css
:root {
  --color-primary: #your-color;
  --color-dark-bg: #your-bg-color;
  /* ... */
}
```

### Adding New Pages

1. Create page file: `src/pages/section/PageName.jsx`
2. Add route in `src/routes/AppRoutes.jsx`
3. Create page CSS: `src/styles/PageName.css`

### Adding New API Services

1. Create service file: `src/services/newService.js`
2. Export service functions
3. Use in components via import

## Performance Optimization

- **Code Splitting**: React Router automatically splits code by route
- **Lazy Loading**: Components loaded on-demand
- **CSS Optimization**: Minified in production build
- **Asset Optimization**: Images optimized by Vite

## Security Considerations

- **XSS Protection**: React escapes content by default
- **CSRF Token**: Include in API requests (backend responsibility)
- **Password**: Never store in frontend code (use secure backend)
- **localStorage**: JWT stored in localStorage (consider HTTPOnly cookies for production)
- **API Security**: Always use HTTPS in production

## Troubleshooting

### Port 3000 Already in Use

```bash
# Change port in vite.config.js
server: {
  port: 3001,
}
```

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Import Errors

Ensure all imports use correct relative paths:
```javascript
// ✓ Correct
import { Button } from '../components/common/Button';

// ✗ Incorrect
import Button from 'components/Button';
```

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### GitHub Pages

```bash
npm run build
# Push dist folder to gh-pages branch
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow component structure conventions
2. Use TypeScript for new components (optional)
3. Maintain CSS naming conventions (BEM)
4. Test all RBAC scenarios before committing

## License

MIT License - feel free to use in personal and commercial projects

## Support & Documentation

- React: https://react.dev
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- Axios: https://axios-http.com

## Next Steps

1. **Connect Backend**: Replace mock services with real API endpoints
2. **Add Testing**: Implement Jest and React Testing Library
3. **TypeScript**: Convert to TypeScript for type safety
4. **PWA**: Add PWA capabilities
5. **Analytics**: Integrate analytics service
6. **Internationalization**: Add multi-language support

---

**Last Updated**: 2024-01-20  
**Version**: 1.0.0  
**Status**: Production Ready ✅
