const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/aroundb');

const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '61b9ea4dcf40f641e2971c54',
  };

  next();
});

app.use(usersRoutes);
app.use(cardsRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'The requested resource was not found' });
});

app.listen(PORT);
