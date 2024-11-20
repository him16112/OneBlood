const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/auth-demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
})
.then(()=> console.log("Database Connected"))
.catch((err)=> console.log(err));



module.exports = mongoose;

