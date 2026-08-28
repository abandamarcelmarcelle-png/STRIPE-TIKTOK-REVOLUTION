import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import './FeedScreen.css';

function FeedScreen() {
  const [videos, setVideos] = React.useState([
    {
      id: 1,
      author: '@stripe_creator',
      caption: 'Welcome to STRIPE-TIKTOK! 🚀',
      thumbnail: 'https://via.placeholder.com/400x600?text=Video+1',
      likes: 1240,
      comments: 89,
      shares: 12,
      duration: '00:45'
    },
    {
      id: 2,
      author: '@ai_innovations',
      caption: 'Real-time collaboration in action',
      thumbnail: 'https://via.placeholder.com/400x600?text=Video+2',
      likes: 5430,
      comments: 234,
      shares: 56,
      duration: '01:23'
    }
  ]);

  return (
    <div className="feed-screen">
      <div className="feed-header">
        <h2>For You</h2>
      </div>

      <div className="videos-container">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <img src={video.thumbnail} alt={video.caption} />
            <div className="video-overlay">
              <div className="video-info">
                <h3>{video.author}</h3>
                <p>{video.caption}</p>
              </div>
              <div className="video-actions">
                <button className="action-btn">
                  <Heart size={20} />
                  <span>{video.likes}</span>
                </button>
                <button className="action-btn">
                  <MessageCircle size={20} />
                  <span>{video.comments}</span>
                </button>
                <button className="action-btn">
                  <Share2 size={20} />
                  <span>{video.shares}</span>
                </button>
                <button className="action-btn">
                  <Bookmark size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedScreen;
