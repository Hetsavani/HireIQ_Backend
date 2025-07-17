const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// const authRoutes = require('./routes/auth.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/errorHandler');
const quizRoutes = require('./routes/quiz.routes');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Error Handler
app.use(errorHandler);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error('MongoDB connection error:', err));
