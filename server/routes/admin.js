const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Upload = require('../models/Upload');
const authMiddleware = require('../middleware/auth');

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    next();
};

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/uploads', authMiddleware, adminMiddleware, async (req, res) => {
    const uploads = await Upload.find().populate('userId');
    res.json(uploads);
});

module.exports = router;