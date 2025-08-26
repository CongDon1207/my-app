// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const tasksRouter = require('./routes/tasks');
const { errorHandler } = require('./middlewares/errorHandler');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js API' });
});

app.use('/api/tasks', tasksRouter);

// Error handler cuối
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
