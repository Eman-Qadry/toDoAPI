
const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyparser= require('body-parser');
const app = express();

const authRouter = require('./routes/user');
const taskRouter = require('./routes/task');

// Use JSON and URL-encoded middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer middleware for handling file uploads
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE, PUT, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/auth', authRouter);
app.use('/api/tasks', taskRouter);

// Error handling middleware
app.use((error, req, res, next) => {
   
    const status = error.statusCode || 500;
    const data = error.data;
    const message = error.message;
    res.status(status).json({
        message: message,
        data: data
    });
});

module.exports = app;
