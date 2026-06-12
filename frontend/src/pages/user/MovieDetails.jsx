import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { movieService } from '../../services/movieService';
import { reviewService } from '../../services/reviewService';
import { theatreService } from '../../services/theatreService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReviewCard from '../../components/review/ReviewCard';
import ReviewForm from '../../components/review/ReviewForm';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, reviewsData, showsData] = await Promise.all([
          movieService.getMovieById(id),
          reviewService.getMovieReviews(id),
          theatreService.getMovieShows(id),
        ]);
        
        setMovie(movieData);
        setReviews(reviewsData);
        setShows(showsData);
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewSubmit = async (formData) => {
    try {
      const newReview = await reviewService.addReview(id, formData);
      setReviews((prev) => [newReview, ...prev]);
      setShowReviewForm(false);
    } catch (error) {
      setError('Failed to submit review');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="movie-details-container">
      <button 
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="movie-backdrop">
        <img src={movie.backdrop} alt={movie.title} />
        <div className="backdrop-overlay" />
      </div>

      <div className="movie-details-content">
        <div className="movie-info">
          <img src={movie.poster} alt={movie.title} className="movie-poster" />
          
          <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>
            <p className="movie-director">Directed by {movie.director}</p>

            <div className="movie-metadata">
              <div className="metadata-item">
                <Star size={20} className="star" />
                <div>
                  <span className="label">Rating</span>
                  <span className="value">{movie.rating}/10</span>
                </div>
              </div>
              <div className="metadata-item">
                <Clock size={20} />
                <div>
                  <span className="label">Duration</span>
                  <span className="value">{movie.duration}min</span>
                </div>
              </div>
              <div className="metadata-item">
                <Users size={20} />
                <div>
                  <span className="label">Reviews</span>
                  <span className="value">{movie.reviews}</span>
                </div>
              </div>
            </div>

            <div className="movie-tags">
              {movie.genres.map((genre) => (
                <span key={genre} className="tag">{genre}</span>
              ))}
            </div>

            <p className="movie-description">{movie.description}</p>

            <div className="movie-details-grid">
              <div>
                <span className="detail-label">Cast</span>
                <p className="detail-value">{movie.cast.join(', ')}</p>
              </div>
              <div>
                <span className="detail-label">Language</span>
                <p className="detail-value">{movie.language}</p>
              </div>
              <div>
                <span className="detail-label">Budget</span>
                <p className="detail-value">{movie.budget}</p>
              </div>
              <div>
                <span className="detail-label">Box Office</span>
                <p className="detail-value">{movie.boxOffice}</p>
              </div>
            </div>

            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* Shows Section */}
        {shows.length > 0 && (
          <section className="shows-section">
            <h2>Available Shows</h2>
            <div className="shows-grid">
              {shows.map((show) => (
                <Card key={show.id} className="show-card">
                  <div className="show-header">
                    <h3>{show.theatreId}</h3>
                    <span className="format-badge">{show.format}</span>
                  </div>
                  <div className="show-details">
                    <p><strong>{show.showTime}</strong></p>
                    <p>Screen {show.screen}</p>
                    <p>{show.availableSeats}/{show.totalSeats} seats</p>
                    <p className="price">₹{show.price}</p>
                  </div>
                  <Button variant="primary" size="sm" fullWidth>
                    Book Now
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <section className="reviews-section">
          <h2>Reviews ({reviews.length})</h2>
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </section>
      </div>

      <ReviewForm
        isOpen={showReviewForm}
        movieTitle={movie.title}
        onSubmit={handleReviewSubmit}
        onClose={() => setShowReviewForm(false)}
      />
    </div>
  );
};

export default MovieDetails;
