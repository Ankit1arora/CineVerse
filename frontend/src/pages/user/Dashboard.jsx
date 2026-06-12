import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { movieService } from '../../services/movieService';
import MovieCard from '../../components/movie/MovieCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Film } from 'lucide-react';
import '../../styles/pages.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const movies = await movieService.getTrendingMovies();
        setTrendingMovies(movies);
      } catch (error) {
        console.error('Failed to load trending movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Discover and book your favorite movies</p>
      </div>

      <section className="page-section">
        <h2>Trending Now</h2>
        {loading ? (
          <LoadingSpinner />
        ) : trendingMovies.length > 0 ? (
          <div className="movies-grid">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <EmptyState title="No movies found" icon={Film} />
        )}
      </section>

      <section className="page-section stats">
        <div className="stat-card">
          <h3>Your Bookings</h3>
          <p className="stat-number">5</p>
        </div>
        <div className="stat-card">
          <h3>Reviews</h3>
          <p className="stat-number">12</p>
        </div>
        <div className="stat-card">
          <h3>Favorites</h3>
          <p className="stat-number">8</p>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
