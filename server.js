const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
var mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

mongoose.connect(process.env.MONGO_CONNECT_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const index = require('./routes/index');
const userRoutes = require('./routes/user');
const paymentsRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/admin', adminRoutes);
// protects routes from being accessed - need to implement config/auth
// app.use(require('./config/auth'));
app.use('/', index);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}