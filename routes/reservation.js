const express = require('express');
const router = express.Router();

const reservation = require('../controllers/reservation');

// prvobitna
router.post('/create-new', reservation.createReservation);

//po id-u property-a
router.post('/create-new/:id', reservation.createReservationById);

router.get('/:id', reservation.getSingleReservation);

router.put('/:id', reservation.updateReservation);

router.delete('/:id', reservation.deleteReservation);

module.exports = router;