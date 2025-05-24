const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Complaint = require('../models/Complaint');
const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Map categories to departments
const categoryToDepartment = {
  water: 'Water Supply Department',
  electricity: 'Electricity Department',
  roads: 'Public Works Department',
  sanitation: 'Sanitation Department',
  other: 'General Administration'
};

// Submit a new complaint
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      address,
      email,
      phone,
      latitude,
      longitude
    } = req.body;

    // Create new complaint
    const complaint = new Complaint({
      title,
      description,
      category,
      address,
      location: {
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      photo: req.file ? `/uploads/${req.file.filename}` : null,
      contact: {
        email,
        phone
      },
      department: categoryToDepartment[category] || 'General Administration'
    });

    await complaint.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Complaint Received - Department Management System',
      html: `
        <h1>Your Complaint Has Been Received</h1>
        <p>Dear Citizen,</p>
        <p>We have received your complaint regarding "${title}".</p>
        <p>Complaint Details:</p>
        <ul>
          <li>Category: ${category}</li>
          <li>Description: ${description}</li>
          <li>Address: ${address}</li>
          <li>Status: Pending</li>
        </ul>
        <p>Your complaint has been forwarded to the ${complaint.department}.</p>
        <p>We will keep you updated on the progress of your complaint.</p>
        <p>Thank you for helping us improve our services.</p>
        <p>Best regards,<br>Department Management System</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Send notification to department head
    const departmentMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env[`${category.toUpperCase()}_DEPARTMENT_EMAIL`],
      subject: 'New Complaint Received',
      html: `
        <h1>New Complaint Received</h1>
        <p>A new complaint has been submitted that requires your attention.</p>
        <p>Complaint Details:</p>
        <ul>
          <li>Title: ${title}</li>
          <li>Category: ${category}</li>
          <li>Description: ${description}</li>
          <li>Address: ${address}</li>
          <li>Contact Email: ${email}</li>
          <li>Contact Phone: ${phone}</li>
        </ul>
        <p>Please review and take necessary action.</p>
      `
    };

    await transporter.sendMail(departmentMailOptions);

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      data: complaint
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit complaint',
      error: error.message
    });
  }
});

// Get all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaints',
      error: error.message
    });
  }
});

// Get a single complaint
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }
    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch complaint',
      error: error.message
    });
  }
});

// Update complaint status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Send status update email to complainant
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: complaint.contact.email,
      subject: 'Complaint Status Update',
      html: `
        <h1>Complaint Status Update</h1>
        <p>Dear Citizen,</p>
        <p>The status of your complaint "${complaint.title}" has been updated to: ${status}</p>
        <p>We will continue to keep you informed about any further updates.</p>
        <p>Thank you for your patience.</p>
        <p>Best regards,<br>Department Management System</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update complaint status',
      error: error.message
    });
  }
});

// Detect pothole in image
router.post('/detect-pothole', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Create form data for the Python service
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    // Call Python service for pothole detection
    const response = await axios.post('http://localhost:5001/detect', formData, {
      headers: {
        ...formData.getHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });

    // Clean up the uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temporary file:', err);
    });

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error detecting pothole:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect pothole',
      error: error.message
    });
  }
});

module.exports = router; 