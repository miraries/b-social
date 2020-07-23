const express = require('express');
const controller = require('../controllers/comments.controller');
const router = express.Router();

router.get('posts/:postId/comments', controller.index);
router.post('posts/:postId/comments', controller.create);
router.delete('comments/:commentId', controller.destroy);

module.exports = router;