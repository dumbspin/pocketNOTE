const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Return all events sorted by date
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Create an event
// @route   POST /api/events
// @access  Public
router.post('/', async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
