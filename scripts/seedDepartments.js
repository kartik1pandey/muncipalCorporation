const mongoose = require('mongoose');
const Department = require('../models/Department');
require('dotenv').config();

const departments = [
  { name: 'Road Construction Department', description: 'Handles road construction and maintenance.' },
  { name: 'Waste And Water Supply', description: 'Manages waste disposal and water supply.' },
  { name: 'Electricity Distribution', description: 'Responsible for electricity distribution and maintenance.' },
  { name: 'Raipur Development Authority', description: 'Urban planning and development for Raipur.' },
  { name: 'Smart City Mission Cell', description: 'Implements smart city initiatives.' },
  { name: 'Public Health Department', description: 'Oversees public health and sanitation.' }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  await Department.deleteMany({});
  await Department.insertMany(departments);
  console.log('Departments seeded!');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
}); 