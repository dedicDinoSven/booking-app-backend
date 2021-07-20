const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  dateStart: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  guest: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  reservationCreated: {
    type: Date,
    default: Date.now,
  },
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = { Reservation, ReservationSchema };
