require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 5000;

// Database Connection
require('./config/db');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
