// routes/stationRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StationMap = require('../models/StationMap');

const router = express.Router();

const uploadPath = './uploads/stationMaps';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { station_name, zone_name } = req.body;

    if (!req.file || !station_name || !zone_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newMap = new StationMap({
      stationName: station_name,
      zoneName: zone_name,
      filename: req.file.filename
    });

    await newMap.save();

    res.status(200).json({
      message: 'Station map uploaded and saved to MongoDB',
      filename: req.file.filename
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
