const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocationSchema = require('./location').LocationSchema;

const PropertySchema = new Schema({
	name: {
		type: String,
		required: true,
		maxLength: 50,
	},
	propertyType: {
		type: Schema.Types.ObjectId,
		ref: 'PropertyType',
	},
	bedrooms: {
		type: Number,
		required: true,
	},
	beds: {
		type: Number,
		required: true,
	},
	bathrooms: {
		type: Number,
		required: true,
	},
	pricePerNight: {
		type: Number,
		required: true,
	},
	maxGuests: {
		type: Number,
		required: true,
	},
	location: LocationSchema,
	description: {
		type: String,
		required: true,
		maxLength: 500,
	},
	freeCancel: {
		type: Boolean,
		required: true,
	},
	amenities: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Amenity',
		},
	],
	imageUrls: [
		{
			type: String,
			required: true,
		},
	],
	host: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	reservations: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Reservation'
		}
	],
	dateCreated: {
		type: Date,
		default: Date.now,
	},
});

PropertySchema.pre('save', function (next) {
	this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
	
	next();
});

PropertySchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
