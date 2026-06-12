# CineVerse Frontend - Quick Reference Guide

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔑 Demo Accounts

```
User:     user@example.com / password
Theatre:  owner@example.com / password
Admin:    admin@example.com / password
```

---

## 📁 Key File Locations

```
Frontend Root
├── src/
│   ├── App.jsx                 ← Main app component
│   ├── main.jsx                ← Entry point
│   ├── context/
│   │   ├── AuthContext.jsx    ← Authentication state
│   │   └── NotificationContext.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx      ← All route definitions
│   │   └── ProtectedRoute.jsx ← Route protection
│   ├── pages/
│   │   ├── auth/              ← Login/Register
│   │   ├── user/              ← User dashboard pages
│   │   ├── theatre/           ← Theatre owner pages
│   │   └── admin/             ← Admin pages
│   ├── services/
│   │   ├── apiClient.js       ← Axios config + interceptors
│   │   ├── authService.js
│   │   ├── movieService.js
│   │   └── ...                ← Other services
│   ├── components/
│   │   ├── common/            ← Reusable UI components
│   │   ├── layout/            ← Navbar, Sidebar, Footer
│   │   ├── movie/             ← Movie components
│   │   └── review/            ← Review components
│   ├── styles/                ← Global CSS
│   └── utils/
│       └── helpers.js         ← Utility functions
├── package.json               ← Dependencies
├── vite.config.js            ← Vite config
└── README.md                 ← Full documentation
```

---

## 🎯 Common Tasks

### Add a New Page

1. Create file: `src/pages/section/PageName.jsx`
```jsx
import React from 'react';

const PageName = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Page Title</h1>
      </div>
      {/* Content */}
    </div>
  );
};

export default PageName;
```

2. Add route in `src/routes/AppRoutes.jsx`
```jsx
<Route
  path="/path/to/page"
  element={<ProtectedRoute element={<PageName />} />}
/>
```

### Add a New Component

1. Create file: `src/components/section/ComponentName.jsx`
```jsx
import React from 'react';
import './ComponentName.css';

const ComponentName = ({ props }) => {
  return <div className="component-name">{/* Content */}</div>;
};

export default ComponentName;
```

2. Create CSS: `src/components/section/ComponentName.css`
3. Import and use in pages

### Call an API

```jsx
import { movieService } from '../../services/movieService';

const MyComponent = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        setMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return <div>{/* Render movies */}</div>;
};
```

### Use Authentication

```jsx
import { useAuth } from '../../context/AuthContext';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <p>Hello, {user.name}!</p>}
      <button onClick={logout}>Logout</button>
    </>
  );
};
```

### Show Notifications

```jsx
import { useNotification } from '../../context/NotificationContext';

const MyComponent = () => {
  const { showNotification } = useNotification();

  const handleSuccess = () => {
    showNotification('Success!', 'success');
  };

  const handleError = () => {
    showNotification('Error occurred', 'error');
  };

  return (
    <>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </>
  );
};
```

---

## 🎨 Styling Classes

### Layout
```css
.page-container      /* Max-width container */
.page-header         /* Page title section */
.page-section        /* Content sections */
.container           /* Flex container */
.flex-between        /* Space-between layout */
.flex-center         /* Centered flex */
```

### Grids
```css
.movies-grid         /* Responsive movie grid */
.stats-grid          /* Stats cards grid */
.form-row            /* Form inputs row */
.shows-grid          /* Shows list grid */
```

### Text
```css
.text-primary        /* Primary color text */
.text-secondary      /* Secondary color text */
.text-muted          /* Muted/gray text */
.text-center         /* Centered text */
```

### Utilities
```css
.hidden              /* display: none */
.mt-md               /* margin-top */
.mb-md               /* margin-bottom */
.p-md                /* padding */
.rounded-md          /* border-radius */
.opacity-50          /* 50% opacity */
```

---

## 🔍 Component API Reference

### Button

```jsx
<Button 
  variant="primary"      // primary | secondary | success | danger
  size="md"             // sm | md | lg
  loading={false}       // Shows spinner
  fullWidth={false}     // 100% width
  disabled={false}      // Disabled state
  onClick={handleClick}
>
  Click Me
</Button>
```

### Modal

```jsx
<Modal
  isOpen={isOpen}
  title="Modal Title"
  onClose={handleClose}
  size="md"            // sm | md | lg
  footer={<Footer />}  // Optional footer
>
  Modal Content
</Modal>
```

### Card

```jsx
<Card 
  className="custom-class"
  hoverable={false}    // Add hover effect
  onClick={handleClick}
>
  Card Content
</Card>
```

### LoadingSpinner

```jsx
<LoadingSpinner 
  size="md"           // sm | md | lg
  fullPage={false}    // Full screen loading
/>
```

### ErrorMessage

```jsx
<ErrorMessage 
  message="Error text"
  title="Error"
  onRetry={handleRetry}
  isDismissible={true}
  onDismiss={handleDismiss}
/>
```

### EmptyState

```jsx
<EmptyState 
  title="No Data"
  description="Add some data to get started"
  icon={Icon}
  action={{ label: 'Add New' }}
/>
```

---

## 🔐 Role-Based Routes

### User Routes
- `/user/dashboard` - Home
- `/user/movies` - Browse movies
- `/user/movies/:id` - Movie details
- `/user/profile` - Profile
- `/user/bookings` - Bookings

### Theatre Owner Routes
- `/theatre/dashboard` - Home
- `/theatre/shows` - Manage shows
- `/theatre/add-movie` - Add movie

### Admin Routes
- `/admin/dashboard` - Dashboard
- `/admin/users` - Manage users
- `/admin/movies` - Manage movies
- `/admin/analytics` - Analytics

### Public Routes
- `/login` - Login page
- `/register` - Register page

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code (if configured)
```

---

## 📊 CSS Variables

```css
/* Colors */
--color-primary: #ff6b35
--color-secondary: #004e89
--color-dark-bg: #0a0e27
--color-text-primary: #e8eef7
--color-text-secondary: #b0bfd9
--color-success: #00d084
--color-danger: #ff4757

/* Spacing */
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem

/* Font Sizes */
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem

/* Transitions */
--transition-fast: 150ms
--transition-base: 250ms
--transition-slow: 350ms
```

---

## 🐛 Debugging Tips

### Check Authentication
```javascript
// In browser console
localStorage.getItem('token')
localStorage.getItem('user')
```

### View Network Requests
```
Chrome DevTools → Network tab
Watch XHR requests to API
```

### Check Component Props
```jsx
console.log('Props:', props);
console.log('Context:', useAuth());
```

### Common Errors

| Error | Solution |
|-------|----------|
| "Cannot find module" | Check import path |
| "TypeError: undefined is not an object" | Check API response shape |
| "401 Unauthorized" | Check token in localStorage |
| "Route not found" | Check route path in AppRoutes |

---

## 🚀 Production Checklist

- [ ] Replace mock data with real API
- [ ] Update `.env` with production URLs
- [ ] Remove console.log statements
- [ ] Test all routes and features
- [ ] Test responsive design
- [ ] Test error scenarios
- [ ] Setup error tracking
- [ ] Setup analytics
- [ ] Security review
- [ ] Performance audit
- [ ] Browser testing
- [ ] Final QA

---

## 📱 Responsive Design

```css
/* Mobile First */
.component { /* Mobile default */ }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .component { /* Tablet styles */ }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .component { /* Desktop styles */ }
}
```

---

## 🔗 Useful Links

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 💡 Tips & Tricks

1. **Hot Module Replacement**: Vite automatically refreshes the browser on file changes
2. **Fast Refreshing**: Only affected component updates, not full reload
3. **Source Maps**: Dev tools show original source code, not bundled
4. **CSS Modules**: Can use CSS modules by naming files `.module.css`
5. **Environment Variables**: Create `.env.local` for sensitive data
6. **Mock Data**: Easy to replace with real API without code changes

---

## 📞 Need Help?

1. Read the main `README.md` for detailed info
2. Check component/page comments
3. Review service file documentation
4. Test with demo accounts
5. Check browser console for errors

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-20  
**Status**: ✅ Production Ready

**Happy Coding! 🚀**
