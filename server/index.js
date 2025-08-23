// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tasksRouter = require('./routes/tasks');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route thử nghiệm (giữ nếu bạn đang dùng)
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js API' });
});

// Mount tasks router
app.use('/api/tasks', tasksRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
