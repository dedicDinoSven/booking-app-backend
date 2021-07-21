const mongoose = require('mongoose');
const PropertyType = require('../models/propertyType');

exports.findPropertyTypeByName = (name) => {
    return PropertyType.findOne({
        name: name,
      }).exec();
}