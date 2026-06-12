import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { movieService } from '../../services/movieService';
import MovieCard from '../../components/movie/MovieCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { Film } from 'lucide-react';
import '../../styles/pages.css';
import '../../styles/MoviesList.css';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genres = ['all', 'sci-fi', 'action', 'drama', 'crime', 'thriller', 'adventure'];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await movieService.getAllMovies();
        setMovies(allMovies);
        setFilteredMovies(allMovies);
      } catch (error) {
        console.error('Failed to load movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let result = movies;

    if (selectedGenre !== 'all') {
      result = result.filter((movie) => movie.genres.includes(selectedGenre));
    }

    if (searchTerm) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(result);
  }, [searchTerm, selectedGenre, movies]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Movies</h1>
        <p>Browse and book your favorite movies</p>
      </div>

      <div className="movies-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="genre-filter">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredMovies.length > 0 ? (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No movies found"
          description="Try adjusting your filters"
          icon={Film}
        />
      )}
    </div>
  );
};

export default MoviesList;
