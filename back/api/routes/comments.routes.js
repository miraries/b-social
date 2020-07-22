const express = require('express');
const controller = require('../controllers/comments.controller');
const router = express.Router();

router.get('/:postId/comments', controller.index);
router.post('/:postId/comments', controller.create);
router.delete('/:commentId', controller.destroy);

module.exports = router;