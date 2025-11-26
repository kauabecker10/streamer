const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Category = require('./Category');

const Movie = sequelize.define('Movie', {
  name: DataTypes.STRING,
  summary: DataTypes.STRING,
  keywords: DataTypes.STRING,
});

Movie.belongsTo(Category);

module.exports = Movie;