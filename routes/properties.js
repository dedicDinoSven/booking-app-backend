const express = require('express');
const router = express.Router();

const PropertyType = require('../models/propertyType');

const amenityController = require('../controllers/amenity');
const locationController = require('../controllers/location');
const propertyController = require('../controllers/property');
const propertyTypeController = require('../controllers/propertyType');
const reservationController = require('../controllers/reservation');

router.get('/create-new', async (req, res, next) => {
  try {
    const amenities = await amenityController.findAllAmenities();
    const types = await PropertyType.find(
      {},
      'name description',
      (err, result) => {
        if (err) return next(err);
      }
    );

    return res.json({ user: req.user, amenities: amenities, types: types });
  } catch (err) {
    return next(err);
  }
});

router.post('/create-new', async (req, res, next) => {
  try {
    const location = await locationController.createLocation({
      address: req.body.address,
      city: req.body.city,
      zipCode: req.body.zipCode,
      country: req.body.country,
      lat: req.body.lat,
      lng: req.body.lng,
    });

    let property = await propertyController.createProperty({
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

    const propertyType = await propertyTypeController.findPropertyTypeByName(
      req.body.propertyType
    );
    property = await propertyController.addTypeToProperty(
      property._id,
      propertyType._id
    );

    const amenities = req.body.amenities;
    for (let i = 0; i < amenities.length; ++i) {
      amenities[i] = await amenityController.findAmenityByName(amenities[i]);
      property = await propertyController.addAmenityToProperty(
        property._id,
        amenities[i]
      );
      amenities[i] = await amenityController.addPropertyToAmenity(
        amenities[i]._id,
        property
      );
    }

    res.json({ message: 'Property created successfully', property: property });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
