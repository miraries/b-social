const express = require('express');
const controller = require('../controllers/user.controller');
const router = express.Router();

router.get('/', controller.index);
router.post('/:userId/follow', controller.follow);
router.post('/:userId/unfollow', controller.unfollow);

module.exports = router;