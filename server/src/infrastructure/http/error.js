// backend/src/infrastructure/http/error.js
import { ZodError } from "zod";

const isProd = process.env.NODE_ENV === "production";

function zodIssues(err) {
  // Chắt lọc thông tin quan trọng từ ZodError
  return err.errors?.map(e => ({
    path: e.path,
    message: e.message,
    code: e.code,
  })) ?? [];
}

export default function errorHandler(err, _req, res, _next) {
  // Nếu headers đã gửi thì để Express xử lý tiếp
  if (res.headersSent) return;

  let status = 500;
  let message = "Internal Server Error";
  let issues = undefined;

  // 1) Zod validation error
  if (err instanceof ZodError) {
    status = 400;
    message = "Validation failed";
    issues = zodIssues(err);
  }
  // 2) JWT errors từ jsonwebtoken
  else if (err?.name === "TokenExpiredError") {
    status = 401;
    message = "Access token đã hết hạn";
  } else if (err?.name === "JsonWebTokenError" || err?.name === "NotBeforeError") {
    status = 401;
    message = "Access token không hợp lệ";
  }
  // 3) Lỗi có gán status thủ công (vd: requireAuth)
  else if (typeof err?.status === "number") {
    status = err.status;
    message = err.message || message;
  }
  // 4) Lỗi chung
  else {
    message = err?.message || message;
  }

  const payload = {
    success: false,
    error: {
      message,
      status,
      ...(issues ? { issues } : {}),
      // Chỉ show stack ở dev để debug
      ...(!isProd && err?.stack ? { stack: err.stack } : {}),
    },
  };

  res.status(status).json(payload);
}
