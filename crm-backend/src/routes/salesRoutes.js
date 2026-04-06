const express = require('express');
const router = express.Router();
const {
  getSales,
  getSaleById,
  createSale,
  updateSale,
} = require('../controllers/salesController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getSales)
  .post(protect, createSale);

router.route('/:id')
  .get(protect, getSaleById)
  .put(protect, updateSale);

module.exports = router;
