require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
require('./config/db');

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the backend API!' });
});

// Import Routes (to be added)
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
