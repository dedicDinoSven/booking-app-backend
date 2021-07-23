const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AmenitySchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	properties: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Property',
		},
	],
});

AmenitySchema.pre('save', function (next) {
	this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
	next();
});

AmenitySchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const Amenity = mongoose.model('Amenity', AmenitySchema);

module.exports = Amenity;
