const express = require('express');
const router = express.Router();

const property = require('../controllers/property');

router.get('/create-new', property.getCreateProperty);

router.post('/create-new', property.createProperty);

router.get('/all', property.getAllProperties);

router.get('/all/city/:city', property.getAllPropertiesWithinCity);

router.get('/all/country/:country', property.getAllPropertiesWithinCountry);

router.get('/all/type/:type', property.getAllPropertiesWithinType);

router.get('/:id', property.getSingleProperty);

router.put('/:id', property.updateProperty);

router.delete('/:id', property.deleteProperty);

module.exports = router;
