# 🚀 MASTER PROMPT: STRIPE-TIKTOK-REVOLUTION
## Build a TikTok Killer with Stripe Design, Real-time Collaboration & AI

---

## 🎯 MISSION STATEMENT

Build an **immersive, real-time, multi-user video platform** that:
1. **Surpasses TikTok** with collaborative features & Web3 integration
2. **Maintains Stripe's premium design** (Blurple #635BFF, Inter font, minimal elegance)
3. **Prioritizes real-time experiences** (WebSocket, instant reactions, live collab)
4. **Implements advanced AI** (personalized recommendations, trend detection)
5. **Scales to millions** (microservices, CDN, edge computing)

---

## 📐 DESIGN SYSTEM (Stripe Identity)

### Colors
- **Primary (Blurple)**: `#635BFF` - Main CTAs, highlights
- **Secondary**: `#6366F1` - Accents
- **Background**: `#FFFFFF` or `#F8F9FB` - Clean, minimal
- **Text**: `#0F172A` - High contrast
- **Muted**: `#64748B` - Disabled, secondary text
- **Success**: `#10B981` - Like animations
- **Alert**: `#EF4444` - Warnings

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Inter Bold (700)
- **Body**: Inter Regular (400)
- **Captions**: Inter Medium (500)
- **Mono**: IBM Plex Mono (code, timestamps)

### Components
- **Cards**: Subtle shadow, rounded corners (12px)
- **Buttons**: Large tap targets (48px), smooth transitions
- **Inputs**: Minimal borders, clear focus states
- **FAB (Create Button)**: Floating Action Button, centered in nav, Blurple gradient

---

## ⚙️ CORE FEATURES

### 1️⃣ AUTHENTICATION (Complete)
```
✅ Email/Password signup & login
✅ Phone number verification (SMS)
✅ OAuth2 (Google, Apple, Discord)
✅ 2FA (TOTP, SMS backup codes)
✅ JWT with refresh tokens
✅ Profile creation (username, avatar, bio)
```

### 2️⃣ FEED & DISCOVERY (Immersive)
```
✅ Vertical swipe feed (TikTok-style)
✅ "For You" (AI-ranked algorithmic)
✅ "Following" (chronological from follows)
✅ "Explore" (trending, by category)
✅ "Live" (active live streams)
✅ Real-time like/comment counts (WebSocket)
✅ Double-tap like with animation
✅ Share directly to DMs
```

### 3️⃣ VIDEO CREATION (Advanced)
```
✅ Camera capture (15s, 60s, 3min)
✅ Upload from gallery
✅ Real-time collab (2-4 creators on one video)
✅ Video editor:
   - Trim, crop, rotate
   - Text overlay (animated)
   - Stickers (animated)
   - Music selection (licensed library)
   - Effects library (filters, transitions)
   - Speed adjustment
   - Sound levels
✅ AI captions (auto-generate from speech)
✅ AI tags (auto-suggest hashtags)
✅ Publish to multiple lanes/categories
✅ Schedule post for later
```

### 4️⃣ REAL-TIME COLLABORATION (Unique)
```
✅ Invite creators to collab on a video
✅ Synchronized video recording (WebSocket)
✅ Split-screen or picture-in-picture
✅ Shared editor workspace
✅ Live cursor/pointer visibility
✅ Version history (undo/redo sync'd)
✅ Permissions (can edit, can comment, view-only)
```

### 5️⃣ LIVE STREAMING (Premium)
```
✅ Go live from app
✅ Real-time chat (WebSocket)
✅ Interactive polls during stream
✅ Gift system (virtual gifting → creator earnings)
✅ Viewer count
✅ Replay available post-stream
✅ Co-host support
✅ Screen share (desktop)
```

### 6️⃣ SOCIAL INTERACTIONS (Real-time)
```
✅ Like (with animation) - synced instantly
✅ Comment (threaded)
✅ Reply to comment
✅ Mention @username (autocomplete)
✅ Hashtag search & trending
✅ Follow/Unfollow
✅ Block users
✅ Report content (moderation queue)
```

### 7️⃣ DIRECT MESSAGING (Private & Secure)
```
✅ End-to-end encrypted DMs
✅ Real-time message delivery
✅ Typing indicators
✅ Read receipts
✅ Media sharing (photos, videos, voice messages)
✅ Message search
✅ Group DMs
```

### 8️⃣ PROFILE & ANALYTICS
```
✅ Creator profile (bio, avatar, banner)
✅ Video grid (user's uploads)
✅ Follower/Following lists
✅ Creator Analytics Dashboard:
   - Total views, likes, comments
   - Watch time (total & per video)
   - Audience demographics
   - Trending videos
   - Revenue (if monetized)
```

### 9️⃣ CREATOR MARKETPLACE (Web3-Ready)
```
✅ Buy/sell creator beats (music)
✅ Effect templates library
✅ Transition packs
✅ Filter marketplace
✅ Creator token system (mint per video)
✅ Blockchain verification (NFT moments)
```

### 🔟 MONETIZATION
```
✅ Ad revenue sharing
✅ Tipping (viewers send $$)
✅ Virtual gifts during live streams
✅ Subscription (exclusive content)
✅ Creator fund payouts
```

---

## 🛠️ BACKEND ARCHITECTURE

### Microservices Structure

```javascript
// Service: auth-service (Node.js + Express)
POST /auth/signup         → Create account
POST /auth/login          → Verify & issue JWT
POST /auth/refresh        → Refresh token
POST /auth/logout         → Invalidate token
POST /auth/oauth          → Google/Apple login
POST /auth/2fa/setup      → Enable 2FA
POST /auth/2fa/verify     → Verify TOTP

// Service: video-service (Node.js + Express)
POST /videos/upload       → Upload file → encode → store S3
GET  /videos/:id          → Get video metadata
POST /videos/:id/publish  → Make public
DELETE /videos/:id        → Delete video
GET  /videos/feed         → Get ranked feed (calls AI service)
GET  /videos/trending     → Trending videos

// Service: social-service (Node.js + Express)
POST /videos/:id/like     → Add like (WebSocket sync)
DELETE /videos/:id/like   → Remove like
POST /videos/:id/comment  → Add comment
GET  /videos/:id/comments → Get comment thread
POST /users/:id/follow    → Follow user
DELETE /users/:id/follow  → Unfollow

// Service: messaging-service (Node.js + Socket.io)
Socket: connect           → User joins socket
Socket: send_message      → Real-time DM (encrypted)
Socket: typing_indicator  → Show "X is typing"
Socket: read_receipt      → Mark message as read

// Service: ai-service (Python + FastAPI)
POST /recommend           → Get personalized feed
POST /trending            → Get trending videos
POST /caption-gen         → Auto-generate captions
POST /tag-suggest         → Auto-suggest hashtags
POST /trend-predict       → Predict trending content

// Service: collab-service (Node.js + Socket.io)
Socket: create_session    → Start collab session
Socket: invite_creator    → Send collab invite
Socket: join_session      → Creator accepts
Socket: sync_recording    → Sync video capture data
Socket: sync_edit         → Sync editing changes
```

### Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Videos table
CREATE TABLE videos (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INT, -- seconds
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  visibility VARCHAR(20) DEFAULT 'public', -- public, private, followers
  category VARCHAR(50), -- trending, creative, debate, chill, remix
  tags VARCHAR(255)[],
  collab_creators UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Relationships table
CREATE TABLE relationships (
  id UUID PRIMARY KEY,
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_encrypted BYTEA, -- encrypted version
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Collab sessions table
CREATE TABLE collab_sessions (
  id UUID PRIMARY KEY,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  creator_ids UUID[] NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW()
);

-- Creator tokens (Web3)
CREATE TABLE creator_tokens (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  token_address VARCHAR(255) UNIQUE, -- Ethereum contract address
  total_supply BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Redis Cache Keys

```
feed:user:{user_id}           → Ranked video feed (30 min TTL)
session:{jwt_token}           → User session (24 hour TTL)
user:{user_id}:presence       → Online status (realtime)
video:{video_id}:likes        → Like count (real-time)
video:{video_id}:comments     → Comment count (real-time)
trending:videos               → Trending videos (1 hour TTL)
rate_limit:{ip}:{endpoint}    → Rate limit counter (1 min TTL)
```

---

## 🎨 FRONTEND ARCHITECTURE

### React Component Tree

```
App
├── AuthContext (JWT, user state)
├── SocketContext (WebSocket connection)
├── ThemeProvider (Stripe colors)
│
├── AuthPages
│   ├── Login
│   ├── SignUp
│   └── OAuthCallback
│
├── MainLayout
│   ├── NavBar
│   │   ├── Logo
│   │   ├── Tabs (Feed, Explore, Live)
│   │   ├── FAB (Create +)
│   │   └── UserMenu
│   │
│   ├── FeedScreen
│   │   ├── VideoFeed (vertical scroll, snap)
��   │   │   ├── VideoCard
│   │   │   │   ├── VideoPlayer
│   │   │   │   ├── VideoInfo (author, caption, tags)
│   │   │   │   └── ActionRail
│   │   │   │       ├── LikeButton (with animation)
│   │   │   │       ├── CommentButton
│   │   │   │       ├── ShareButton
│   │   │   │       └── BookmarkButton
│   │   │
│   │   ├── CommentSheet (bottom modal)
│   │   │   ├── CommentList
│   │   │   ├── CommentInput
│   │   │   └── ReplyThread
│   │   │
│   │   └── ShareSheet (bottom modal)
│   │       ├── DM List
│   │       └── Social share options
│   │
│   ├── CameraScreen (FAB → create)
│   │   ├── VideoCapture
│   │   │   ├── Camera preview
│   │   │   ├── Record button
│   │   │   └── Effects/Filters panel
│   │   │
│   │   ├── VideoEditor
│   │   │   ├── Timeline
│   │   │   ├── TextOverlay
│   │   │   ├── MusicPicker
│   │   │   ├── EffectsLibrary
│   │   │   └── Preview
│   │   │
│   │   ├── CollabInvite
│   │   │   ├── Search creators
│   │   │   ├── Pending invites
│   │   │   └── Active collaborators
│   │   │
│   │   └── PublishScreen
│   │       ├── Caption input
│   │       ├── Category select
│   │       ├── Tags input
│   │       └── Publish button
│   │
│   ├── ExploreScreen
│   │   ├── Trending section
│   │   ├── Categories (grid)
│   │   ├── SearchBar
│   │   └── HashtagTrends
│   │
│   ├── LiveScreen
│   │   ├── LivePlayer
│   │   ├── LiveChat
│   │   ├── VirtualGifts
│   │   ├── PollWidget
│   │   └── ViewerCount
│   │
│   ├── MessagingScreen
│   │   ├── ConversationList
│   │   └── ChatThread
│   │       ├── Messages
│   │       └── MessageInput
│   │
│   ├── ProfileScreen
│   │   ├── ProfileHeader
│   │   │   ├── Avatar
│   │   │   ├── Username
│   │   │   ├── FollowButton
│   │   │   └── Stats (followers, views, likes)
│   │   │
│   │   ├── AnalyticsTabs
│   │   │   ├── Overview
│   │   │   ├── Viewers
│   │   │   ├── Engagement
│   │   │   └── Revenue
│   │   │
│   │   └── VideoGrid
│   │
│   └── SettingsScreen
│       ├── Account settings
│       ├── Privacy settings
│       └── Notification settings
```

---

## 🚀 DEPLOYMENT

### Docker Compose (Local Development)
```yaml
version: '3.9'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: stripe_tiktok
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  auth-service:
    build: ./backend/services/auth-service
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  video-service:
    build: ./backend/services/video-service
    ports:
      - "3002:3002"
    depends_on:
      - postgres
      - redis

  social-service:
    build: ./backend/services/social-service
    ports:
      - "3003:3003"
    depends_on:
      - postgres

  messaging-service:
    build: ./backend/services/messaging-service
    ports:
      - "3004:3004"
    depends_on:
      - redis

  ai-service:
    build: ./ml-engine
    ports:
      - "8000:8000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend/web
    ports:
      - "5173:5173"
    depends_on:
      - auth-service
```

### Production (Kubernetes)
- Deploy each microservice in its own pod
- Use Ingress for routing
- Helm charts for templating
- Prometheus + Grafana for monitoring
- CloudFlare for CDN & DDoS protection

---

## ✅ TESTING CHECKLIST

### Unit Tests
- [ ] Auth service (signup, login, token refresh)
- [ ] Video service (upload, encoding, retrieval)
- [ ] Social service (like, comment, follow)
- [ ] AI service (recommendation accuracy)

### Integration Tests
- [ ] End-to-end auth flow
- [ ] Video upload → publish → appears in feed
- [ ] Real-time like/comment sync
- [ ] WebSocket messaging

### Load Tests
- [ ] Feed endpoint (1000 concurrent users)
- [ ] Video streaming (100 Mbps)
- [ ] WebSocket connections (10k concurrent)
- [ ] Database queries (< 100ms p95)

### Security Tests
- [ ] JWT expiration & refresh
- [ ] XSS prevention
- [ ] CSRF tokens
- [ ] SQL injection prevention
- [ ] Rate limiting
- [ ] DM encryption/decryption

---

## 📈 PERFORMANCE TARGETS

| Metric | Target | Tool |
|--------|--------|------|
| Feed load time | < 2s | Lighthouse |
| Video streaming start | < 3s | FFmpeg HLS |
| Like/comment sync | < 500ms | WebSocket |
| Search results | < 1s | Elasticsearch |
| P99 API latency | < 200ms | New Relic |
| Uptime | 99.95% | Status page |

---

## 🔍 MONITORING & OBSERVABILITY

- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Metrics**: Prometheus + Grafana
- **Tracing**: Jaeger (distributed tracing)
- **Error tracking**: Sentry
- **Synthetic monitoring**: Datadog

---

## 📚 Documentation

1. **API Documentation** (OpenAPI/Swagger)
2. **Component Library** (Storybook)
3. **Architecture Decision Records** (ADR)
4. **Developer Setup Guide**
5. **Contributing Guidelines**

---

## 🎯 PHASE ROLLOUT

### Phase 1: MVP (Weeks 1-4)
- Auth system
- Basic feed
- Video upload & publish
- Like/comment
- Follow system

### Phase 2: Real-time (Weeks 5-8)
- WebSocket messaging
- Real-time feed updates
- Live streaming basic
- Collaboration (2-creator beta)

### Phase 3: Advanced (Weeks 9-12)
- AI recommendations
- Creator marketplace
- Web3 integration
- Mobile native apps

### Phase 4: Scale (Weeks 13+)
- Global CDN optimization
- Advanced analytics
- Monetization features
- Creator fund distribution

---

## 🎊 SUCCESS CRITERIA

✅ **Feature Parity**: TikTok basic features + unique advantages
✅ **Performance**: < 2s feed load, < 500ms real-time sync
✅ **Scalability**: 1M+ concurrent users
✅ **Design**: Stripe's premium aesthetic throughout
✅ **Real-time**: WebSocket, live collab, instant reactions
✅ **Security**: End-to-end encryption, JWT auth, rate limiting
✅ **Web3-ready**: Creator tokens, NFT support

---

## 🚀 LET'S BUILD THIS!
