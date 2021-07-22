const express = require('express');
const router = express.Router();

const PropertyType = require('../models/propertyType');

const amenityController = require('../controllers/amenity');
const locationController = require('../controllers/location');
const propertyController = require('../controllers/property');
const propertyTypeController = require('../controllers/propertyType');
const reservationController = require('../controllers/reservation');

router.get('/create-new', propertyController.getCreateProperty);

router.post('/create-new', propertyController.createProperty);

router.get('/all', propertyController.getAllProperties);

router.get('/:city', propertyController.getAllPropertiesWithinCity);

module.exports = router;
