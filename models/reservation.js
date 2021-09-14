const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
	dateStart: {
		type: Date,
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
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});

ReservationSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;
