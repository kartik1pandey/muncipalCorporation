const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Department = require('../models/Department');
const Forum = require('../models/Forum');

// User routes
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Department routes
router.get('/departments', async (req, res) => {
  try {
    const departments = await Department.find().populate('manager members');
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/departments', async (req, res) => {
  const department = new Department(req.body);
  try {
    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Forum routes
router.get('/forums', async (req, res) => {
  try {
    const forums = await Forum.find()
      .populate('department departments')
      .populate('topics.author')
      .populate('topics.posts.author');
    res.json(forums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/forums', async (req, res) => {
  const forum = new Forum(req.body);
  try {
    const newForum = await forum.save();
    res.status(201).json(newForum);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Forum topic routes
router.post('/forums/:forumId/topics', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }
    forum.topics.push(req.body);
    const updatedForum = await forum.save();
    res.status(201).json(updatedForum);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Forum post routes
router.post('/forums/:forumId/topics/:topicId/posts', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) {
      return res.status(404).json({ message: 'Forum not found' });
    }
    const topic = forum.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }
    topic.posts.push(req.body);
    const updatedForum = await forum.save();
    res.status(201).json(updatedForum);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 