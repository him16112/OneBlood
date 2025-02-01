const mongoose = require('./db'); // Import the database connection

// Define the user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  phoneNo: String,
  address: String,
  bloodGroup: String,
  distance: Number,

  availability: [{
    date: Date,
  }],

  requests: [{
    date: Date,
  }]
});

const User = mongoose.model('users', userSchema);

module.exports = User;
