import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Film,
  Search,
  Star,
  Ticket,
  TrendingUp,
  ChevronRight,
  Play,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { movieService } from '../../services/movieService';
import '../../styles/Home.css';

/* ──────────────────────────────────────────
   SKELETON LOADING CARD
────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="movie-card-skeleton">
    <div className="skeleton-poster" />
    <div className="skeleton-info">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  </div>
);

/* ──────────────────────────────────────────
   MOVIE CARD
────────────────────────────────────────── */
const MovieCard = ({ movie, isAuthenticated, onBookClick }) => {
  const navigate = useNavigate();

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Not logged in → redirect to login
      navigate('/login', { state: { from: `/movie/${movie.id}` } });
    } else {
      navigate(`/user/movies/${movie.id}`);
    }
  };

  return (
    <Link
      to={`/user/movies/${movie.id}`}
      className="movie-card"
      onClick={(e) => {
        // Allow navigation to details page freely; book button handles auth
      }}
    >
      <div className="movie-card-poster">
        <img
          src={movie.poster}
          alt={movie.title}
          onError={(e) => {
            e.target.src = `https://placehold.co/300x450/151d3b/ff6b35?text=${encodeURIComponent(movie.title)}`;
          }}
        />
        {/* Rating badge */}
        <div className="movie-card-rating">
          <Star size={10} fill="currentColor" />
          {movie.rating}
        </div>
        {/* Hover overlay */}
        <div className="movie-card-overlay">
          <button className="movie-card-book-btn" onClick={handleBooking}>
            <Ticket size={14} />
            {isAuthenticated ? 'Book Ticket' : 'Login to Book'}
          </button>
        </div>
      </div>
      <div className="movie-card-info">
        <p className="movie-card-title">{movie.title}</p>
        <div className="movie-card-meta">
          <span className="movie-card-genre">{movie.genre}</span>
          <span className="movie-card-lang">{movie.language}</span>
        </div>
      </div>
    </Link>
  );
};

/* ──────────────────────────────────────────
   TRENDING ITEM
────────────────────────────────────────── */
const TrendingItem = ({ movie, rank, isAuthenticated }) => {
  const navigate = useNavigate();

  const handleBooking = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/movie/${movie.id}` } });
    } else {
      navigate(`/user/movies/${movie.id}`);
    }
  };

  return (
    <a
      href={`/user/movies/${movie.id}`}
      className="trending-item"
      onClick={(e) => {
        e.preventDefault();
        handleBooking(e);
      }}
    >
      <span className="trending-rank">#{rank}</span>
      <img
        className="trending-poster"
        src={movie.poster}
        alt={movie.title}
        onError={(e) => {
          e.target.src = `https://placehold.co/56x80/151d3b/ff6b35?text=${rank}`;
        }}
      />
      <div className="trending-info">
        <p className="trending-title">{movie.title}</p>
        <p className="trending-meta">
          {movie.director} · {movie.genre}
        </p>
      </div>
      <div className="trending-rating">
        <Star size={14} fill="currentColor" />
        {movie.rating}
      </div>
    </a>
  );
};

/* ──────────────────────────────────────────
   HOME PAGE
────────────────────────────────────────── */
const GENRES = ['All', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Crime', 'Adventure'];

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchQuery, setSearchQuery]       = useState('');
  const [searchResults, setSearchResults]   = useState([]);
  const [isSearching, setIsSearching]       = useState(false);
  const [activeGenre, setActiveGenre]       = useState('All');
  const [loading, setLoading]               = useState(true);

  /* ── Fetch initial data ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [all, trending] = await Promise.all([
          movieService.getAllMovies(),
          movieService.getTrendingMovies(),
        ]);
        setFeaturedMovies(all.slice(0, 8));
        setTrendingMovies(trending.slice(0, 5));
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ── Live search ── */
  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const results = await movieService.searchMovies(q);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
  }, []);

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    handleSearch(val);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  /* ── Genre filter ── */
  const filteredMovies =
    activeGenre === 'All'
      ? featuredMovies
      : featuredMovies.filter((m) =>
          m.genres?.includes(activeGenre.toLowerCase())
        );

  return (
    <div className="home-page">
      {/* ════════════════ HERO ════════════════ */}
      <section className="hero">
        <div className="hero-bg-overlay" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <Film size={14} />
            Your Ultimate Movie Booking Platform
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Book Your <span className="highlight">Perfect</span>
            <br />Movie Experience
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Discover the latest blockbusters, reserve your seats instantly, and
            enjoy a seamless cinema experience — all in one place.
          </p>

          {/* Search */}
          <div className="hero-search">
            <Search size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              className="hero-search-input"
              type="text"
              placeholder="Search movies, directors, genres..."
              value={searchQuery}
              onChange={onSearchChange}
              id="hero-search-input"
            />
            <button className="hero-search-btn" onClick={() => handleSearch(searchQuery)}>
              <Search size={14} />
              Search
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta">
            {isAuthenticated ? (
              <>
                <Link to="/user/movies" className="btn-primary-hero">
                  <Play size={18} />
                  Browse Movies
                </Link>
                <Link to="/user/bookings" className="btn-outline-hero">
                  <Ticket size={18} />
                  My Bookings
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary-hero">
                  <UserPlus size={18} />
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-outline-hero">
                  <LogIn size={18} />
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Movies Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Theatres</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Cities</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ SEARCH RESULTS ════════════════ */}
      {isSearching && (
        <div className="container search-results-section">
          <div className="search-results-header">
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>
                Search Results
              </h2>
              <p className="search-results-count">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "
                {searchQuery}"
              </p>
            </div>
            <button className="search-clear-btn" onClick={clearSearch}>
              Clear
            </button>
          </div>
          {searchResults.length > 0 ? (
            <div className="movies-grid">
              {searchResults.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="search-no-results">
              <Search size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p>No movies found. Try a different search term.</p>
            </div>
          )}
        </div>
      )}

      {/* ════════════════ FEATURED MOVIES ════════════════ */}
      {!isSearching && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-label">Now Showing</span>
                <h2 className="section-title">Featured Movies</h2>
              </div>
              <Link to="/user/movies" className="section-view-all">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            {/* Genre Filters */}
            <div className="genre-tags">
              {GENRES.map((g) => (
                <button
                  key={g}
                  className={`genre-tag ${activeGenre === g ? 'active' : ''}`}
                  onClick={() => setActiveGenre(g)}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="movies-grid">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                : filteredMovies.length > 0
                ? filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isAuthenticated={isAuthenticated}
                    />
                  ))
                : (
                  <p style={{ color: 'var(--color-text-muted)', gridColumn: '1/-1' }}>
                    No movies in this genre yet.
                  </p>
                )}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ TRENDING ════════════════ */}
      {!isSearching && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-wrap">
                <span className="section-label">
                  <TrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Hot Right Now
                </span>
                <h2 className="section-title">Trending This Week</h2>
              </div>
              <Link to="/user/movies" className="section-view-all">
                See All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="trending-list">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="movie-card-skeleton"
                      style={{ height: 88, borderRadius: 'var(--border-radius-lg)' }}
                    />
                  ))
                : trendingMovies.map((movie, idx) => (
                    <TrendingItem
                      key={movie.id}
                      movie={movie}
                      rank={idx + 1}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ UNAUTHENTICATED CTA BANNER ════════════════ */}
      {!isAuthenticated && !isSearching && (
        <section className="home-section" style={{ background: 'var(--color-dark-surface)' }}>
          <div className="container" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <Film size={48} style={{ color: 'var(--color-primary)', marginBottom: 16 }} />
            <h2 style={{ marginBottom: 8 }}>Ready to Book Your Seats?</h2>
            <p style={{ marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
              Create a free account to start booking tickets, saving favourites,
              and getting personalised recommendations.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn-primary-hero">
                <UserPlus size={18} /> Create Free Account
              </Link>
              <Link to="/login" className="btn-outline-hero">
                <LogIn size={18} /> Already have an account?
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
