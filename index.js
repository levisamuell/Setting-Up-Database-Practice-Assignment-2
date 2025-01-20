const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const User = require('./schema.js');
require('dotenv').config();

const app = express();
const port = 3010;
const mongoURL = process.env.mongoURI;

app.use(express.static('static'));
app.use(express.json());

mongoose.connect(mongoURL)
.then(() => console.log('Connected to database'))
.catch(err => console.log('Error connecting to database:',err));

app.post('/api/users', async (req, res) => {
  try{
    const userData = req.body;
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch(err) {
    if(err.name == 'ValidationError') {
      res.status(400).json({ message: 'Validation Error', details: err.message})
    } else {
      res.status(500).json({ message: 'Server error', details: err.message });
    }
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
