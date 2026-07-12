const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth');
const leaderboardController = require('../../controllers/gamification/leaderboard.controller');

router.get('/leaderboard', authenticate, leaderboardController.getLeaderboard);

module.exports = router;
