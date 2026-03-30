const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventsphere';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err.message));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expos', require('./routes/expos'));
app.use('/api/exhibitors', require('./routes/exhibitors'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/bookings', require('./routes/bookings'));

app.get('/', (req, res) => res.json({ message: 'EventSphere API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
