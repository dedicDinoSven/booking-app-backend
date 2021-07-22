const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertyTypeSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: true,
	},
});

PropertyTypeSchema.method('toJSON', function () {
	const { __v, _id, ...object } = this.toObject();
	object.id = _id;
	return object;
});

const PropertyType = mongoose.model('PropertyType', PropertyTypeSchema);

module.exports = PropertyType;
