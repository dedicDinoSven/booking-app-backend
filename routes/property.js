const express = require('express');
const router = express.Router();

const passport = require('passport');
const property = require('../controllers/property');
const parser = require('../middleware/cloudinary');

router.get(
	'/create-new',
	passport.authenticate('jwt', { session: false }),
	property.getCreateProperty
);

router.post(
	'/create-new',
	passport.authenticate('jwt', { session: false }),
	parser.array('imageUrls'),
	property.createProperty
);

router.get('/', property.searchForProperties);

router.get('/all', property.getAllProperties);

router.get('/all/city/:city', property.getAllPropertiesWithinCity);

router.get('/all/country/:country', property.getAllPropertiesWithinCountry);

router.get('/all/type/:type', property.getAllPropertiesWithinType);

router.get('/:id', property.getSingleProperty);

router.put(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	property.updateProperty
);

router.delete(
	'/:id',
	passport.authenticate('jwt', { session: false }),
	property.deleteProperty
);

module.exports = router;
