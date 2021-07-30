const express = require('express');
const router = express.Router();

const reservation = require('../controllers/reservation');

router.post('/create-new', reservation.createReservation);

router.get('/:id', reservation.getSingleReservation);

router.put('/:id', reservation.updateReservation);

router.delete('/:id', reservation.deleteReservation);

module.exports = router;