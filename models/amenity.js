const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AmenitySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  properties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
  ],
});

const Amenity = mongoose.model('Amenity', AmenitySchema);

module.exports = Amenity;
