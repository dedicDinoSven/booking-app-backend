const mongoose = require('mongoose');
const Property = require('../models/property');
const Location = require('../models/location').Location;
const PropertyType = require('../models/propertyType');
const Amenity = require('../models/amenity');

exports.getCreateProperty = async (req, res) => {
	try {
		const amenities = await Amenity.find().lean().exec();
		const types = await PropertyType.find({}, 'name description').lean().exec();

		res.status(201).json({ amenities: amenities, types: types });
	} catch (err) {
		res.status(409).json({ message: err.message });
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
		const properties = await Property.find().lean().exec();

		res.status(201).json(properties);
	} catch (err) {
		res.status(409).json({ message: err.message })
	}
};

exports.getAllPropertiesWithinCity = async (req, res) => {
	const city = req.params.city;

	try {
		const properties = await Property.find({ 'location.city': city }).lean().exec();

		res.status(201).json(properties);
	} catch (err) {
		res.status(409).json({ message: err.message});
	}
}

exports.getPropertiesWithinType = (typeId) => {
	return Property.find({ propertyType: typeId }, 'name').populate(
		'propertyType',
		'-_id -__v -description'
	);
};
