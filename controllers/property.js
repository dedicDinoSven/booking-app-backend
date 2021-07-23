const mongoose = require('mongoose');
const Property = require('../models/property');
const Location = require('../models/location').Location;
const PropertyType = require('../models/propertyType');
const Amenity = require('../models/amenity');

exports.getCreateProperty = async (req, res) => {
	try {
		const amenities = await Amenity.find().lean().exec();
		const types = await PropertyType.find({}, 'name description').lean().exec();

		res.status(200).json({ amenities: amenities, types: types });
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.createProperty = async (req, res) => {
	const location = new Location({
		address: req.body.address,
		city: req.body.city,
		zipCode: req.body.zipCode,
		country: req.body.country,
		lat: req.body.lat,
		lng: req.body.lng,
	});

	let property = new Property({
		name: req.body.name,
		bedrooms: req.body.bedrooms,
		beds: req.body.beds,
		bathrooms: req.body.bathrooms,
		pricePerNight: req.body.pricePerNight,
		maxGuests: req.body.maxGuests,
		location: location,
		description: req.body.description,
		freeCancel: req.body.freeCancel,
		imageUrls: req.body.imageUrls,
		host: req.user.id,
	});

	let amenities = req.body.amenities;

	try {
		const propertyType = await PropertyType.findOne({
			name: req.body.propertyType,
		})
			.lean()
			.exec();

		await location.save();
		await property.save();
		property = await Property.findByIdAndUpdate(
			property._id,
			{ propertyType: propertyType._id },
			{ new: true }
		);

		for (let i = 0; i < amenities.length; ++i) {
			amenities[i] = await Amenity.findOne({ name: amenities[i] })
				.lean()
				.exec();
			property = await Property.findByIdAndUpdate(
				property._id,
				{ $push: { amenities: amenities[i]._id } },
				{ new: true }
			);
			amenities[i] = await Amenity.findByIdAndUpdate(
				amenities[i]._id,
				{ $push: { properties: property._id } },
				{ new: true }
			);
		}

		res.status(201).json(property);
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

exports.getAllProperties = async (req, res) => {
	try {
		const properties = await Property.find()
			.populate('propertyType', '-__v -_id')
			.populate('host', '-__v -_id -password -is_active -dateJoined')
			.populate('amenities', '-__v -_id -properties')
			.lean()
			.exec();

		res.status(200).json(properties);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.getAllPropertiesWithinCity = async (req, res) => {
	let city = req.params.city;
	city = city.charAt(0).toUpperCase() + city.slice(1);

	try {
		const properties = await Property.find({ 'location.city': city })
			.populate('propertyType', '-__v -_id')
			.populate('host', '-__v -_id -password -is_active -dateJoined')
			.populate('amenities', '-__v -_id -properties')
			.lean()
			.exec();

		res.status(201).json(properties);
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

exports.getAllPropertiesWithinCountry = async (req, res) => {
	let country = req.params.country;
	country = country.charAt(0).toUpperCase() + country.slice(1);

	try {
		const properties = await Property.find({ 'location.country': country })
			.populate('propertyType', '-__v -_id')
			.populate('host', '-__v -_id -password -is_active -dateJoined')
			.populate('amenities', '-__v -_id -properties')
			.lean()
			.exec();

		res.status(200).json(properties);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.getAllPropertiesWithinType = async (req, res) => {
	let type = req.params.type;
	type = type.charAt(0).toUpperCase() + type.slice(1);

	try {
		const propertyType = await PropertyType.findOne({ name: type })
			.lean()
			.exec();

		const properties = await Property.find({ propertyType: propertyType._id })
			.populate('propertyType', '-__v -_id')
			.populate('host', '-__v -_id -password -is_active -dateJoined')
			.populate('amenities', '-__v -_id -properties')
			.lean()
			.exec();

		res.status(200).json(properties);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.getSingleProperty = async (req, res) => {
	const id = req.params.id;

	try {
		const property = await Property.findById(id)
			.populate('propertyType', '-__v -_id')
			.populate('host', '-__v -_id -password -is_active -dateJoined')
			.populate('amenities', '-__v -_id -properties')
			.lean()
			.exec();

		res.status(200).json(property);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.updateProperty = async (req, res) => {

};

exports.deleteProperty = async (req, res) => {
	const id = req.params.id;

	try {
		const property = await Property.findById(id).lean().exec();

		let location = property.location;
		location = await Location.findByIdAndDelete(location._id).lean().exec();

		let amenities = property.amenities;
		for (let i = 0; i < amenities.length; ++i) {
			amenities[i] = await Amenity.findByIdAndUpdate(
				amenities[i]._id,
				{ $pull: { properties: id } },
				{ new: true }
			);
		}

		const x = await Property.deleteOne({ _id: id });
		
		res.json({ message: 'Property deleted successfully.' });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};
