const express = require('express');
const { getPerfil, getDashboard, putSaldo, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.get('/:id', getPerfil);
router.get('/:id/dashboard', getDashboard);
router.put('/:id', putSaldo);
router.delete('/:id', deleteUser);

module.exports = router;
