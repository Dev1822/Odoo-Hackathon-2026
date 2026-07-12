require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(compression());

// Rate limiting disabled for testing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
require('./config/db');

// Import Routes
const socialRoutes = require('./routes/social.routes');
app.use('/api/v1/social', socialRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the backend API!' });
});

// Error Handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
