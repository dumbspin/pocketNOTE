const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// @desc    Get all bookmarks
// @route   GET /api/bookmarks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @desc    Create a bookmark
// @route   POST /api/bookmarks
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, url, category } = req.body;

    const bookmark = await Bookmark.create({
      title,
      url,
      category
    });

    res.status(201).json(bookmark);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @desc    Delete a bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ success: false, error: 'Bookmark not found' });
    }

    await bookmark.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
