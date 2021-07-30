const Reservation = require('../models/reservation');

exports.createReservation = async (req, res) => {
	const propertyId = res.app.get('propertyId');
	try {
		const today = new Date().toLocaleDateString();
		const reservation = new Reservation({
			dateStart: req.body.dateStart || today,
			dateEnd: req.body.dateEnd || today,
			guest: req.user.id,
			numberOfGuests: req.body.numberOfGuests,
			property: propertyId,
		});

		await reservation.save();

		res.status(201).json(reservation);
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

exports.updateReservation = async (req, res) => {
	try {
		const id = req.params.id;
		const today = new Date().toLocaleDateString();

		const reservation = await Reservation.findByIdAndUpdate(
			id,
			{
				dateStart: req.body.dateStart || today,
				dateEnd: req.body.dateEnd || today,
				numberOfGuests: req.body.numberOfGuests,
			},
			{ new: true }
		)
			.lean()
			.exec();

		res.status(200).json(reservation);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.deleteReservation = async (req, res) => {
	try {
		const id = req.params.id;

		await Reservation.deleteOne({ _id: id }).lean().exec();

		res.json({ message: 'Reservation deleted successfully.' });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};
