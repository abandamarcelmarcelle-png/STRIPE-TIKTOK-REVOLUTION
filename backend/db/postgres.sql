-- Create database
CREATE DATABASE stripe_tiktok;

-- Connect to database
\c stripe_tiktok

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  two_fa_secret VARCHAR(255),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255),
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  total_likes BIGINT DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  creator_token_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INT,
  width INT,
  height INT,
  views BIGINT DEFAULT 0,
  likes BIGINT DEFAULT 0,
  comments BIGINT DEFAULT 0,
  shares BIGINT DEFAULT 0,
  visibility VARCHAR(20) DEFAULT 'public',
  category VARCHAR(50),
  tags VARCHAR(255)[],
  collab_creators UUID[],
  music_id VARCHAR(255),
  music_title VARCHAR(255),
  music_artist VARCHAR(255),
  hashtags VARCHAR(50)[],
  processing_status VARCHAR(20) DEFAULT 'pending',
  processing_progress INT DEFAULT 0,
  ai_caption TEXT,
  ai_tags VARCHAR(50)[],
  engagement_score FLOAT DEFAULT 0,
  trending_rank INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE INDEX idx_videos_creator ON videos(creator_id);
CREATE INDEX idx_videos_created ON videos(created_at DESC);
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_videos_likes ON videos(likes DESC);
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_visibility ON videos(visibility);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  likes BIGINT DEFAULT 0,
  mention_ids UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_video ON comments(video_id);
CREATE INDEX idx_comments_creator ON comments(creator_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_video ON likes(video_id);

-- Follows table
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE INDEX idx_relationships_follower ON relationships(follower_id);
CREATE INDEX idx_relationships_following ON relationships(following_id);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_encrypted BYTEA,
  media_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Collab sessions table
CREATE TABLE collab_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  creator_ids UUID[] NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_collab_sessions_video ON collab_sessions(video_id);
CREATE INDEX idx_collab_sessions_creators ON collab_sessions USING gin(creator_ids);

-- Live streams table
CREATE TABLE live_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  stream_key VARCHAR(255) UNIQUE,
  stream_url TEXT,
  viewer_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'offline',
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_live_streams_creator ON live_streams(creator_id);
CREATE INDEX idx_live_streams_status ON live_streams(status);

-- Creator tokens (Web3)
CREATE TABLE creator_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  token_name VARCHAR(50),
  token_symbol VARCHAR(10),
  token_address VARCHAR(255) UNIQUE,
  blockchain VARCHAR(50),
  total_supply BIGINT,
  decimals INT DEFAULT 18,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_creator_tokens_creator ON creator_tokens(creator_id);
CREATE INDEX idx_creator_tokens_address ON creator_tokens(token_address);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Sessions table (for JWT)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  refresh_token_hash VARCHAR(255) UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
