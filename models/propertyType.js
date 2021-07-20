const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertyTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: 'True',
  },
  description: {
    type: String,
    required: true,
  },
});

const PropertyType = mongoose.model('PropertyType', PropertyTypeSchema);

module.exports = PropertyType;
