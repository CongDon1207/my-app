// backend/src/app.js
import express from 'express';
import { env } from './src/infrastructure/config/env.js';
import authRoutes from './src/domains/auth/api/auth.routes.js';
import homeRoutes from './src/domains/catalog/api/home.routes.js';

import errorHandler from "./src/infrastructure/http/error.js";

const app = express();
app.use(express.json());

// (tuỳ chọn) CORS cơ bản khi FE dev localhost:5173
// import cors from 'cors';
// app.use(cors({ origin: true, credentials: true }));

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }));

// Mount API theo prefix (.env: API_PREFIX="/api")
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/home`, homeRoutes);

// Error handling đặt cuối
app.use(errorHandler);

export default app;
