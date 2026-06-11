const express = require('express');
const { startGame, reveal, cashout } = require('../controllers/gameController');
const router = express.Router();

router.post('/start', startGame);
router.post('/:gameId/reveal', reveal);
router.post('/:gameId/cashout', cashout);

module.exports = router;
