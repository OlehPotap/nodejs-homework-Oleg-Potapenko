const app = require('./app');
const mongoose = require('mongoose')


require('dotenv').config()

const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URL;

const start = async ()=> {

  const connection = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  
  connection
 .then(() => {
   app.listen(PORT, function () {
    console.log(`Database connection successful`)
   })
 })
 .catch((err) =>
   console.log(`Database connection faied, Error message: ${err.message}`),
 )
}

start()

// ======================================================================




