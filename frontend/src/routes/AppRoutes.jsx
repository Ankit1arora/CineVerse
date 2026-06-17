import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Home
import HomePage from '../pages/user/HomePage';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import MoviesList from '../pages/user/MoviesList';
import MovieDetails from '../pages/user/MovieDetails';
import UserProfile from '../pages/user/Profile';
import Bookings from '../pages/user/Bookings';

// Theatre Owner Pages
import TheatreDashboard from '../pages/theatre/Dashboard';
import ManageShows from '../pages/theatre/ManageShows';
import AddMovie from '../pages/theatre/AddMovie';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageMovies from '../pages/admin/ManageMovies';
import Analytics from '../pages/admin/Analytics';

// Common Pages
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Home (public) ── */}
      <Route path="/" element={<HomePage />} />

      {/* ── Auth (public) ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Public movie browsing (no auth required) ── */}
      {/* Unauthenticated users can view; booking inside enforces auth */}
      <Route path="/movies" element={<MoviesList />} />
      <Route path="/movie/:id" element={<MovieDetails />} />

      {/* ── Booking alias (protected) ── */}
      <Route
        path="/booking"
        element={<ProtectedRoute element={<Bookings />} requiredRoles={['user']} />}
      />

      {/* ── User Routes (protected) ── */}
      <Route
        path="/user/dashboard"
        element={<ProtectedRoute element={<UserDashboard />} requiredRoles={['user']} />}
      />
      <Route
        path="/user/movies"
        element={<ProtectedRoute element={<MoviesList />} requiredRoles={['user']} />}
      />
      <Route
        path="/user/movies/:id"
        element={<ProtectedRoute element={<MovieDetails />} requiredRoles={['user']} />}
      />
      <Route
        path="/user/profile"
        element={<ProtectedRoute element={<UserProfile />} requiredRoles={['user']} />}
      />
      <Route
        path="/user/bookings"
        element={<ProtectedRoute element={<Bookings />} requiredRoles={['user']} />}
      />

      {/* ── Theatre Owner Routes ── */}
      <Route
        path="/theatre/dashboard"
        element={<ProtectedRoute element={<TheatreDashboard />} requiredRoles={['theatre_owner']} />}
      />
      <Route
        path="/theatre/shows"
        element={<ProtectedRoute element={<ManageShows />} requiredRoles={['theatre_owner']} />}
      />
      <Route
        path="/theatre/add-movie"
        element={<ProtectedRoute element={<AddMovie />} requiredRoles={['theatre_owner']} />}
      />

      {/* ── Admin Routes ── */}
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={['admin']} />}
      />
      <Route
        path="/admin/users"
        element={<ProtectedRoute element={<ManageUsers />} requiredRoles={['admin']} />}
      />
      <Route
        path="/admin/movies"
        element={<ProtectedRoute element={<ManageMovies />} requiredRoles={['admin']} />}
      />
      <Route
        path="/admin/analytics"
        element={<ProtectedRoute element={<Analytics />} requiredRoles={['admin']} />}
      />

      {/* ── 404 catch-all (must be last) ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
