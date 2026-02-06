const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// @route   GET /api/bookmarks
// @desc    Get all bookmarks
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/bookmarks/:id
// @desc    Get single bookmark
router.get('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/bookmarks
// @desc    Create new bookmark
router.post('/', async (req, res) => {
  const bookmark = new Bookmark({
    title: req.body.title,
    url: req.body.url,
    description: req.body.description,
    category: req.body.category,
    tags: req.body.tags
  });

  try {
    const newBookmark = await bookmark.save();
    res.status(201).json(newBookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/bookmarks/:id
// @desc    Update bookmark
router.put('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    if (req.body.title) bookmark.title = req.body.title;
    if (req.body.url) bookmark.url = req.body.url;
    if (req.body.description !== undefined) bookmark.description = req.body.description;
    if (req.body.category) bookmark.category = req.body.category;
    if (req.body.tags) bookmark.tags = req.body.tags;

    const updatedBookmark = await bookmark.save();
    res.json(updatedBookmark);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Delete bookmark
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await bookmark.deleteOne();
    res.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
