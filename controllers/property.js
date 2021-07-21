const mongoose = require('mongoose');
const Property = require('../models/property');

exports.createProperty = (property) => {
  return Property.create(property).then((doc) => {
    console.log('Created Property:\n', doc);

    return doc;
  });
};

exports.addTypeToProperty = (propertyId, propertyTypeId) => {
  return Property.findByIdAndUpdate(
    propertyId,
    { propertyType: propertyTypeId },
    { new: true, useFindAndModify: false }
  );
};

exports.addAmenityToProperty = (propertyId, amenity) => {
    return Property.findByIdAndUpdate(
      propertyId,
      { $push: { amenities: amenity._id } },
      { new: true, useFindAndModify: false }
    );
};

exports.getPropertiesWithinType = (typeId) => {
    return Property.find({ propertyType: typeId }, 'name')
      .populate("propertyType", "-_id -__v -description");
  };