const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Create a note
// @route   POST /api/notes
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const note = await Note.create({
      title,
      content,
      category,
      tags
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json(note);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    await note.deleteOne();

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
