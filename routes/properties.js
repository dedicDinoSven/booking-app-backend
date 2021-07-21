const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Amenity = require('../models/amenity');
const Location = require('../models/location').Location;
const Property = require('../models/property');
const PropertyType = require('../models/propertyType');
const Reservation = require('../models/reservation');
const User = require('../models/user');

router.get('/create-new', async (req, res, next) => {
  try {
    const amenities = await Amenity.find((err, result) => {
      if (err) return next(err);
    });

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

const createLocation = (location) => {
  return Location.create(location).then((docLoc) => {
    console.log('\n>> Created Location:\n', docLoc);
    return docLoc;
  });
};

const createProperty = (property) => {
  return Property.create(property).then((docProperty) => {
    console.log('\n>> Created Property:\n', docProperty);
    return docProperty;
  });
};

const addTypeToProperty = (propertyId, propertyTypeId) => {
  return Property.findByIdAndUpdate(
    propertyId,
    { propertyType: propertyTypeId },
    { new: true, useFindAndModify: false }
  );
};

const addAmenityToProperty = (propertyId, amenity) => {
  return Property.findByIdAndUpdate(
    propertyId,
    { $push: { amenities: amenity._id } },
    { new: true, useFindAndModify: false }
  );
};

const addPropertyToAmenity = (amenityId, property) => {
  return Amenity.findByIdAndUpdate(
    amenityId,
    { $push: { properties: property._id } },
    { new: true, useFindAndModify: false }
  );
};

const getPropertiesWithinType = (typeId) => {
  return Property.find({ propertyType: typeId })
    .populate("propertyType", "name -_id -_description")
    .select("name description");
};


router.post('/create-new', async (req, res, next) => {
  try {
    const location = await createLocation({
      address: 'Avde Cuka 1',
      city: 'Sarajevo',
      zipCode: '71000',
      country: 'BiH',
      lat: 41.123,
      lng: 27.213,
    });
    
    let property = await createProperty({
      name: 'Stan na dan Dobrinja',
      bedrooms: 3,
      beds: 5,
      bathrooms: 2,
      pricePerNight: 25,
      maxGuests: 9,
      location: location,
      description: 'opis neki',
      freeCancel: false,
      imageUrls: ['link1', 'link2', 'link3'],
      host: req.user._id,
    }) 

    // Find one propertyType whose `name` is 'Apartment', otherwise `null`
    const propertyType = await PropertyType.findOne({ name: 'Apartment' }).exec();
    let am1 = await Amenity.findOne({ name: 'Wifi' }).exec();
    let am2 = await Amenity.findOne({ name: 'TV' }).exec();
    let am3 = await Amenity.findOne({ name: 'Iron' }).exec();
    let am4 = await Amenity.findOne({ name: 'Kitchen' }).exec();

    property = await addTypeToProperty(property._id, propertyType._id);
    property = await addAmenityToProperty(property._id, am1);
    property = await addAmenityToProperty(property._id, am2);
    property = await addAmenityToProperty(property._id, am3);
    property = await addAmenityToProperty(property._id, am4);
    
    am1 = await addPropertyToAmenity(am1._id, property);
    am2 = await addPropertyToAmenity(am2._id, property);
    am3 = await addPropertyToAmenity(am3._id, property);
    am4 = await addPropertyToAmenity(am4._id, property);

    console.log("\n>> Property:\n", property);
    
    let properties = await getPropertiesWithinType(propertyType._id)
    console.log("\n>> all Properties within Type:\n", properties);

    res.json({ location: location, propertyType: propertyType, property: property });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
