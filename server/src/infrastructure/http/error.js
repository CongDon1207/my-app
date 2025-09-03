// backend/src/infrastructure/http/error.js

// Express error-handling middleware (4 tham số)
export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Log thêm khi dev
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ErrorHandler]', err);
  }

  return res.status(status).json({
    success: false,
    error: {
      message,
      status,
    },
  });
}
