const Video = require('../models/Video');

exports.create = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  const videos = await Video.findAll();
  res.json(videos);
};