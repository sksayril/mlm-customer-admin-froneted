import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface RecentReviewsProps {
  reviews: Review[];
}

const RecentReviews: React.FC<RecentReviewsProps> = ({ reviews }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
        <button className="text-sm text-sky-600 hover:text-sky-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{review.userName}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-600 text-sm">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReviews;