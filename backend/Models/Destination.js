const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    country: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    image: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      trim: true,
      default: 'General'
    }
  },
  {
    timestamps: true
  }
);

destinationSchema.index(
  { name: 1, country: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  'Destination',
  destinationSchema
);