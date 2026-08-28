const express = require('express');
const router = express.Router();
const { likeVideo, unlikeVideo, addComment, getComments, followUser, unfollowUser } = require('./controller');
const { authenticate } = require('../../middleware/auth');

router.post('/videos/:videoId/like', authenticate, likeVideo);
router.delete('/videos/:videoId/like', authenticate, unlikeVideo);
router.post('/videos/:videoId/comments', authenticate, addComment);
router.get('/videos/:videoId/comments', getComments);
router.post('/users/:userId/follow', authenticate, followUser);
router.delete('/users/:userId/follow', authenticate, unfollowUser);

module.exports = router;
