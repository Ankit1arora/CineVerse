import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import '../styles/ReviewForm.css';

const ReviewForm = ({ movieTitle, onSubmit, onClose, isOpen = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', content: '', rating: 5 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={`Review "${movieTitle}"`}
      onClose={onClose}
      size="md"
    >
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating</label>
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="star-btn"
                onClick={() => handleRatingClick(star)}
              >
                <Star
                  size={28}
                  className={star <= formData.rating ? 'star-filled' : 'star-empty'}
                />
              </button>
            ))}
          </div>
          <span className="rating-display">{formData.rating}/5</span>
        </div>

        <div className="form-group">
          <label htmlFor="title">Review Title *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summarize your review"
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Your Review *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Share your thoughts about this movie..."
            required
            maxLength={1000}
            rows={6}
          />
        </div>

        <div className="form-actions">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={isSubmitting}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewForm;
