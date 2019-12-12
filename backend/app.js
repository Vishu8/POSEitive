const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const usersRoutes = require('./routes/user');
const poseRoutes = require('./routes/pose');

const app = express();

mongoose.connect('mongodb+srv://WeBlaze:' + process.env.MONGO_ATLAS_PW + '@POSEitive-6c7ad.mongodb.net/poseitive?retryWrites=true&w=majority').then(() => {
  console.log('Connected to database!');
}).catch(() => {
  console.log('Connection failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors());
app.use(cors({
  exposedHeaders: ['Authorization'],
}));

app.use('/api/user', usersRoutes);
app.use('/api/pose', poseRoutes);

module.exports = app;
