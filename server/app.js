// backend/src/app.js
import express from "express";
import { env } from "./src/infrastructure/config/env.js";
import authRoutes from "./src/domains/auth/api/auth.routes.js";
import homeRoutes from "./src/domains/catalog/api/home.routes.js";
import productsRoutes, { catalogRouter } from "./src/domains/catalog/api/products.routes.js";
import errorHandler from "./src/infrastructure/http/error.js";

const app = express();
app.use(express.json());

// (optional) enable basic CORS when FE runs on localhost:5173
// import cors from 'cors';
// app.use(cors({ origin: true, credentials: true }));

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// Mount API using prefix (.env: API_PREFIX="/api")
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/home`, homeRoutes);
app.use(`${env.API_PREFIX}/products`, productsRoutes);
app.use(`${env.API_PREFIX}/catalog`, catalogRouter);

// Error handling should stay last
app.use(errorHandler);

export default app;
