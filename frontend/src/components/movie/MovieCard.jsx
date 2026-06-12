import React from 'react';
import { Star, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import '../styles/MovieCard.css';

const MovieCard = ({ movie, onClick }) => {
  return (
    <Card className="movie-card" hoverable>
      <div className="movie-card-image">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-overlay">
          <Link 
            to={`/user/movies/${movie.id}`}
            className="movie-card-action"
            onClick={onClick}
          >
            View Details
          </Link>
        </div>
      </div>
      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-director">{movie.director}</p>
        
        <div className="movie-card-meta">
          <div className="movie-meta-item">
            <Star size={16} className="star" />
            <span>{movie.rating}/10</span>
          </div>
          <div className="movie-meta-item">
            <Clock size={16} />
            <span>{movie.duration}m</span>
          </div>
        </div>

        <div className="movie-card-genre">
          {movie.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="genre-tag">{genre}</span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default MovieCard;
