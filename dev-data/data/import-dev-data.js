const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// node dev-data/data/import-dev-data.js --import
if (process.argv[2] === '--import') {
  importData();
}

// node dev-data/data/import-dev-data.js --delete
if (process.argv[2] === '--delete') {
  deleteAllData();
}

console.log(process.argv);
