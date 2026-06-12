import React from 'react';
import { Star } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import Card from '../common/Card';
import '../styles/ReviewCard.css';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  return (
    <Card className="review-card">
      <div className="review-header">
        <div className="review-user">
          <img src={review.userAvatar} alt={review.userName} className="user-avatar" />
          <div className="user-info">
            <h4>{review.userName}</h4>
            <span className="review-date">{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <div className="review-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={i < review.rating ? 'star-filled' : 'star-empty'}
            />
          ))}
        </div>
      </div>

      <h3 className="review-title">{review.title}</h3>
      <p className="review-content">{review.content}</p>

      <div className="review-footer">
        <span className="helpful-count">👍 {review.helpful} found this helpful</span>
        {onEdit && (
          <button className="review-action" onClick={onEdit}>
            Edit
          </button>
        )}
        {onDelete && (
          <button className="review-action delete" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </Card>
  );
};

export default ReviewCard;
