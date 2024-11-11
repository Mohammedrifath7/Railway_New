const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png'];
  if (allowedTypes.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter }).single('file');

router.post('/', upload, async (req, res) => {
  try {
    const { phoneNumber, trainNumber, pnrNumber, problemDescription, type, incidentDate, incidentTime } = req.body;
    let filePath = req.file ? req.file.path : null;

    if (filePath) {
      const newFilePath = `uploads/${phoneNumber}${path.extname(req.file.originalname)}`;
      fs.renameSync(filePath, newFilePath);
      filePath = newFilePath;
    }

    const grievance = new Grievance({
      phoneNumber,
      trainNumber,
      pnrNumber,
      problemDescription,
      type,
      incidentDate,
      incidentTime,
      filePath
    });

    await grievance.save();

    if (type && type.trim() !== '') {
      const category = new Category({
        phoneNumber,
        pnrNumber,
        department: type
      });

      await category.save();
      return res.status(201).json({
        message: 'Grievance and category saved successfully without processing',
        department: type
      });
    }

    const captionText = problemDescription || filePath;

    const pythonProcess = spawn('python', ['newp.py', captionText]);

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString().split('\n');
      const department = output[1].replace('Department: ', '').trim();

      const category = new Category({
        phoneNumber,
        pnrNumber,
        department
      });

      category.save()
        .then(() => {
          res.status(201).json({
            message: 'Grievance saved and processed successfully',
            department
          });
        })
        .catch((error) => {
          console.error('Error saving category:', error);
          res.status(500).json({ message: 'Server Error' });
        });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python script error:', data.toString());
      res.status(500).json({ message: 'Error processing grievance' });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/categories', async (req, res) => {
  const { pnrNumber, phoneNumber } = req.query;

  try {
    const category = await Category.findOne({
      $or: [{ pnrNumber }, { phoneNumber }]
    });

    if (category) {
      return res.json({ department: category.department });
    } else {
      return res.status(404).json({ message: 'No department found for the given input.' });
    }
  } catch (error) {
    console.error('Error fetching department:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;