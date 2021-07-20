const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationSchema = require('./location');

const PropertySchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  propertyType: {
    type: Schema.Types.ObjectId,
    ref: 'PropertyType',
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  beds: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  maxGuests: {
    type: Number,
    required: true,
  },
  location: locationSchema,
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },
  freeCancellation: {
    type: Boolean,
    required: true,
  },
  amenities: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Amenity',
    },
  ],
  imageUrlList: [
    {
      type: String,
      required: true,
    },
  ],
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
