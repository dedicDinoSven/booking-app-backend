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

LocationSchema.pre('save', function (next) {
	this.address = this.address.charAt(0).toUpperCase() + this.address.slice(1);
	this.city = this.city.charAt(0).toUpperCase() + this.city.slice(1);
	this.country = this.country.charAt(0).toUpperCase() + this.country.slice(1);

	next();
});

LocationSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = { Location, LocationSchema };
