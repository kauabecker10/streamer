const Movie = require('../models/Movie');
const { Op } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.json(movie);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.search = async (req, res) => {
  // ?name=...&summary=...&keywords=...
  let { name, summary, keywords } = req.query;
  let where = {};

  if (name) where.name = { [Op.like]: `%${name}%` };
  if (summary) where.summary = { [Op.like]: `%${summary}%` };
  if (keywords) where.keywords = { [Op.like]: `%${keywords}%` };

  const movies = await Movie.findAll({ where });
  res.json(movies);
};