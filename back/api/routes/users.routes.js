const express = require('express');
const controller = require('../controllers/users.controller');
const router = express.Router();

router.get('/', controller.index);
router.get('/profile', controller.profile);
router.post('/:userId/follow', controller.follow);
router.post('/:userId/unfollow', controller.unfollow);

module.exports = router;