const express = require('express');
const sequelize = require('./models');
const routes = require('./routes');
const app = express();

app.use(express.json());
app.use('/api', routes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});