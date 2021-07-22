const mongoose = require('mongoose');
const Amenity = require('../models/amenity');

exports.findAmenityById = (id) => {
	return Amenity.findOne({ _id: id }).lean().exec();
};

exports.findAmenityByName = (name) => {
	return Amenity.findOne({ name: name }).lean().exec();
};

exports.addPropertyToAmenity = (amenityId, property) => {
	return Amenity.findByIdAndUpdate(
		amenityId,
		{ $push: { properties: property._id } },
		{ new: true, useFindAndModify: false }
	);
};


