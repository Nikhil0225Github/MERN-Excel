const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Upload = require('../models/Uploadjs');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const newUpload = new Upload({
            userId: req.user.id,
            filename: req.file.filename,
            data,
        });
        await newUpload.save();
        res.json({ message: 'File uploaded and parsed', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/history', authMiddleware, async (req, res) => {
    try {
        const uploads = await Upload.find({ userId: req.user.id });
        res.json(uploads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;