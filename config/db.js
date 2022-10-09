const mongoose = require('mongoose');
// const db = 'mongodb://127.0.0.1:27017/siren_db';
const db = 'mongodb+srv://russellomar:pic19950918@cluster0.ivrpln7.mongodb.net/siren_cloud_db';
// const db = 'mongodb://localhost:27017/';

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
