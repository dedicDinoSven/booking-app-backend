const mongoose = require('mongoose');
const Location = require('../models/location').Location;

// create, findAll, findAll(criterium), findOne, findOne(criterium), update, delete, deleteAll

// create and save a new location
exports.createLocation = (location) => {
	const newLocation = new Location(location);

	newLocation.save((err, savedLocation) => {
		if (err) {
			console.log(err);
		}
		console.log('Created location:\n', savedLocation);
	});
};

exports.findAllLocations = () => {
	return Location.find().lean().exec();
};

// find single location with given id
exports.findLocationById = (id) => {
	return Location.findOne({ _id: id }).lean().exec();
};

// find single location with given address
exports.findLocationByAddress = (address) => {
	return Location.findOne({ address: address }).lean().exec();
};

// find all locations with given city
exports.findLocationsByCity = (city) => {
	return Location.find({ city: city }).lean().exec();
};

// find all locations with given zipCode
exports.findLocationsByZipCode = (zipCode) => {
	return Location.find({ zipCode: zipCode }).lean().exec();
};

// find all locations with given country
exports.findLocationsByCountry = (country) => {
	return Location.find({ country: country }).lean().exec();
};

// find single location with given lattitude and longitude
exports.findLocationByLatAndLng = (lat, lng) => {
	return Location.findOne({ lat: lat, lng: lng }).lean().exec();
};

// fale update i delete funkcije
exports.updateLocation = () => {

}