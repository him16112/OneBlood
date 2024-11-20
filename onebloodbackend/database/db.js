const mongoose = require('mongoose');
require('dotenv').config();
const dbUri = process.env.DB_URI;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
})
.then(()=> console.log("Database Connected"))
.catch((err)=> console.log(err));



module.exports = mongoose;

