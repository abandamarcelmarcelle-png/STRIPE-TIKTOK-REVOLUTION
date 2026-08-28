const db = require('../../db/connection');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../utils/logger');
const axios = require('axios');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Upload video
const upload = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const videoId = uuidv4();

    // Upload to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `videos/${videoId}`,
      Body: req.file.buffer,
      ContentType: 'video/mp4'
    };

    const s3Upload = await s3.upload(params).promise();

    // Create video record (processing)
    const result = await db.query(
      'INSERT INTO videos (id, creator_id, title, description, video_url, processing_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, video_url',
      [videoId, req.user.id, title, description, s3Upload.Location, 'processing']
    );

    // Trigger encoding (background job)
    // TODO: Queue to job processor (Bull, RQ, etc.)

    logger.info(`Video uploaded: ${videoId}`);

    res.status(201).json({
      videoId,
      videoUrl: s3Upload.Location,
      status: 'processing'
    });
  } catch (error) {
    next(error);
  }
};

// Publish video
const publish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, tags, collabCreators } = req.body;

    // Verify ownership
    const video = await db.query('SELECT creator_id FROM videos WHERE id = $1', [id]);
    if (video.rows[0].creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Generate AI caption & tags
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/caption`, {
      videoUrl: video.rows[0].video_url
    });

    // Update video
    const result = await db.query(
      'UPDATE videos SET category = $1, tags = $2, collab_creators = $3, ai_caption = $4, ai_tags = $5, processing_status = $6, published_at = NOW() WHERE id = $7 RETURNING *',
      [category, tags, collabCreators || [], aiResponse.data.caption, aiResponse.data.tags, 'completed', id]
    );

    logger.info(`Video published: ${id}`);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Get video
const getVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT v.*, u.username, u.avatar_url 
       FROM videos v 
       JOIN users u ON v.creator_id = u.id 
       WHERE v.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Increment views
    await db.query('UPDATE videos SET views = views + 1 WHERE id = $1', [id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Get feed (AI-ranked)
const getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Call AI service for recommendations
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/recommend`, {
      userId: req.user.id,
      limit,
      offset
    });

    res.json({
      videos: aiResponse.data.videos,
      page,
      limit,
      total: aiResponse.data.total
    });
  } catch (error) {
    next(error);
  }
};

// Get trending
const getTrending = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT * FROM videos 
       WHERE visibility = 'public' AND published_at IS NOT NULL 
       ORDER BY engagement_score DESC, views DESC 
       LIMIT 30`
    );

    res.json({ videos: result.rows });
  } catch (error) {
    next(error);
  }
};

// Delete video
const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const video = await db.query('SELECT creator_id FROM videos WHERE id = $1', [id]);
    if (video.rows[0].creator_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from S3
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `videos/${id}`
    }).promise();

    // Delete from DB
    await db.query('DELETE FROM videos WHERE id = $1', [id]);

    logger.info(`Video deleted: ${id}`);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  publish,
  getVideo,
  getFeed,
  getTrending,
  deleteVideo
};
