require('dotenv').config();

const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('mongoose connected'))
  .catch((err) => {
    console.error('\x1b[41m%s\x1b[0m', `mongoose failed to connect: ${err}`);
    mongoose.connection.close();
    process.exit(1);
  });

const model = mongoose.model(
  'Note',
  new mongoose.Schema({
    content: String,
    date: Date,
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
