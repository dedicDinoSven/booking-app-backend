const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
	address: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	zipCode: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	lat: {
		type: Number,
		required: true,
	},
	lng: {
		type: Number,
		required: true,
	},
});

LocationSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = { Location, LocationSchema };
