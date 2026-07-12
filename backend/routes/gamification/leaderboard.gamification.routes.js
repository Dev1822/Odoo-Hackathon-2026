const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth.gamification');
const leaderboardController = require('../../controllers/gamification/leaderboard.gamification.controller');

router.get('/leaderboard', authenticate, leaderboardController.getLeaderboard);

module.exports = router;
