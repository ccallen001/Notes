require('dotenv').config();

const mongoose = require('mongoose');

const model = mongoose.model(
  'Note',
  new mongoose.Schema({
    content: {
      type: String,
      minLength: 5,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    important: Boolean
  }).set('toJSON', {
    transform: (_, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    }
  })
);

module.exports = model;
