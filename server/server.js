const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ONLINE',
    service: 'Exam Hall Seat Optimizer API',
    timestamp: new Date(),
    database: 'MongoDB Atlas',
  });
});

// Mount Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/seating', require('./routes/seatingRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));

const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// API Directory Route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Exam Hall Seat Optimizer API is running',
    frontend: 'http://localhost:5173',
    endpoints: [
      '/api/health',
      '/api/students',
      '/api/rooms',
      '/api/exams',
      '/api/seating',
      '/api/analytics/dashboard',
      '/api/analytics/conflicts',
      '/api/analytics/rooms',
      '/api/analytics/students',
      '/api/seed/demo',
    ],
  });
});

// Non-API routes serve frontend SPA or redirect to Vite dev server
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.redirect('http://localhost:5173');
});

// 404 Route Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}. Access the web UI at http://localhost:5173/`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred',
  });
});

app.listen(PORT, () => {
  console.log(`[Exam Optimizer Server] Running on http://localhost:${PORT}`);
});
