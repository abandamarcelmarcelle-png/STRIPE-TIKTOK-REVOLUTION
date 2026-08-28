const db = require('../../db/connection');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');

// Like video
const likeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    // Check if already liked
    const existing = await db.query(
      'SELECT id FROM likes WHERE user_id = $1 AND video_id = $2',
      [userId, videoId]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Already liked' });
    }

    // Insert like
    await db.query(
      'INSERT INTO likes (id, user_id, video_id) VALUES ($1, $2, $3)',
      [uuidv4(), userId, videoId]
    );

    // Update like count
    await db.query('UPDATE videos SET likes = likes + 1 WHERE id = $1', [videoId]);

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Unlike video
const unlikeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;

    await db.query('DELETE FROM likes WHERE user_id = $1 AND video_id = $2', [userId, videoId]);
    await db.query('UPDATE videos SET likes = GREATEST(0, likes - 1) WHERE id = $1', [videoId]);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Add comment
const addComment = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { text, parentCommentId } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      'INSERT INTO comments (id, video_id, creator_id, parent_comment_id, text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [uuidv4(), videoId, userId, parentCommentId || null, text]
    );

    await db.query('UPDATE videos SET comments = comments + 1 WHERE id = $1', [videoId]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Get comments
const getComments = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await db.query(
      `SELECT c.*, u.username, u.avatar_url FROM comments c
       JOIN users u ON c.creator_id = u.id
       WHERE c.video_id = $1 AND c.parent_comment_id IS NULL
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [videoId, limit, offset]
    );

    res.json({ comments: result.rows });
  } catch (error) {
    next(error);
  }
};

// Follow user
const followUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    if (userId === followerId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    await db.query(
      'INSERT INTO relationships (id, follower_id, following_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [uuidv4(), followerId, userId]
    );

    await db.query('UPDATE users SET follower_count = follower_count + 1 WHERE id = $1', [userId]);
    await db.query('UPDATE users SET following_count = following_count + 1 WHERE id = $1', [followerId]);

    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Unfollow user
const unfollowUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    await db.query(
      'DELETE FROM relationships WHERE follower_id = $1 AND following_id = $2',
      [followerId, userId]
    );

    await db.query('UPDATE users SET follower_count = GREATEST(0, follower_count - 1) WHERE id = $1', [userId]);
    await db.query('UPDATE users SET following_count = GREATEST(0, following_count - 1) WHERE id = $1', [followerId]);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  likeVideo,
  unlikeVideo,
  addComment,
  getComments,
  followUser,
  unfollowUser
};
