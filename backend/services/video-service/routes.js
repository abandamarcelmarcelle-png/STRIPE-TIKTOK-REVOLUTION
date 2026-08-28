const express = require('express');
const router = express.Router();
const { upload, publish, getVideo, getFeed, getTrending, deleteVideo } = require('./controller');
const { authenticate } = require('../../middleware/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

router.post('/upload', authenticate, uploadMiddleware.single('video'), upload);
router.post('/:id/publish', authenticate, publish);
router.get('/:id', getVideo);
router.get('/feed/for-you', authenticate, getFeed);
router.get('/feed/trending', getTrending);
router.delete('/:id', authenticate, deleteVideo);

module.exports = router;
