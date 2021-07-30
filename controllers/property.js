const Property = require('../models/property');
const Location = require('../models/location').Location;
const PropertyType = require('../models/propertyType');
const Amenity = require('../models/amenity');

const difference = require('../helpers').difference;

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
	try {
		const propertyType = await PropertyType.findOne({
			name: req.body.propertyType,
		})
			.lean()
			.exec();

		const location = new Location({
			address: req.body.address,
			city: req.body.city,
			zipCode: req.body.zipCode,
			country: req.body.country,
			lat: req.body.lat,
			lng: req.body.lng,
		});
		await location.save();

		let property = new Property({
			name: req.body.name,
			propertyType: propertyType._id,
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
		await property.save();

		const amenities = await Amenity.find({ name: req.body.amenities })
			.lean()
			.exec();
		const amenitiesIds = amenities.map((amenity) => {
			return amenity._id;
		});

		await Amenity.updateMany(
			{ _id: amenitiesIds },
			{ $push: { properties: property._id } }
		)
			.lean()
			.exec();
		property = await Property.findByIdAndUpdate(
			property._id,
			{ $push: { amenities: amenitiesIds } },
			{ new: true }
		)
			.lean()
			.exec();

		res.status(201).json(property);
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

exports.searchForProperties = async (req, res) => {
	
}

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

exports.getSingleProperty = async (req, res, next) => {
	const id = req.params.id;
	try {
		const property = await Property.findById(id)
			.populate('propertyType', '-__v -_id')
			.populate('host', '-__v -_id -password -is_active -dateJoined')
			.populate('amenities', '-__v -_id -properties')
			.lean()
			.exec();

		res.app.set('propertyId', id)

		res.status(200).json(property);
	} catch (err) {
		res.status(404).json({ message: err.message });
	};(req, res, next);
};

exports.updateProperty = async (req, res) => {
	try {
		const id = req.params.id;

		let property = await Property.findById(id).lean().exec();

		const propertyType = await PropertyType.findOne({
			name: req.body.propertyType,
		})
			.lean()
			.exec();

		let location = property.location;
		location = await Location.findByIdAndUpdate(
			location._id,
			{
				address: req.body.address,
				city: req.body.city,
				zipCode: req.body.zipCode,
				country: req.body.country,
				lat: req.body.lat,
				lng: req.body.lng,
			},
			{ new: true }
		)
			.lean()
			.exec();

		const oldAmenitiesIds = property.amenities;
		let newAmenities = await Amenity.find({ name: req.body.amenities })
			.lean()
			.exec();
		const newAmenitiesIds = newAmenities.map((amenity) => {
			return amenity._id;
		});

		const added = difference(newAmenitiesIds, oldAmenitiesIds);
		const removed = difference(oldAmenitiesIds, newAmenitiesIds);

		await Amenity.updateMany(
			{ '_id': added },
			{ $addToSet: { properties: id } }
		)
			.lean()
			.exec();

		await Amenity.updateMany({ '_id': removed }, { $pull: { properties: id } })
			.lean()
			.exec();

		property = await Property.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				propertyType: propertyType._id,
				bedrooms: req.body.bedrooms,
				beds: req.body.beds,
				bathrooms: req.body.bathrooms,
				pricePerNight: req.body.pricePerNight,
				amenities: newAmenitiesIds,
				maxGuests: req.body.maxGuests,
				location: location,
				description: req.body.description,
				freeCancel: req.body.freeCancel,
				imageUrls: req.body.imageUrls,
				host: req.user.id,
			},
			{ new: true }
		)
			.lean()
			.exec();

		res.status(200).json(property);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

exports.deleteProperty = async (req, res) => {
	try {
		const id = req.params.id;
		
		const property = await Property.findById(id).lean().exec();

		let location = property.location;
		location = await Location.findByIdAndDelete(location._id).lean().exec();

		let amenities = property.amenities;
		await Amenity.updateMany({ _id: amenities }, { $pull: { properties: id } })
			.lean()
			.exec();

		await Property.deleteOne({ _id: id }).lean().exec();

		res.json({ message: 'Property deleted successfully.' });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};
