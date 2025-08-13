-- Tạo bảng nếu chưa có
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- (Tùy chọn) xóa dữ liệu cũ để seed lại sạch
-- DELETE FROM tasks;

-- Chèn dữ liệu mẫu
INSERT INTO tasks (title, done) VALUES ('Học React', 0);
INSERT INTO tasks (title, done) VALUES ('Làm backend Node.js', 0);
INSERT INTO tasks (title, done) VALUES ('Kết nối với SQLite', 1);
INSERT INTO tasks (title, done) VALUES ('Tìm hiểu về Express.js', 0);
INSERT INTO tasks (title, done) VALUES ('Cấu hình proxy trong Vite', 1);
INSERT INTO tasks (title, done) VALUES ('Tạo UI React cơ bản', 0);
INSERT INTO tasks (title, done) VALUES ('Gọi API từ frontend', 0);
INSERT INTO tasks (title, done) VALUES ('Hoàn thiện CRUD backend', 1);
INSERT INTO tasks (title, done) VALUES ('Triển khai ứng dụng', 0);
INSERT INTO tasks (title, done) VALUES ('Viết tài liệu hướng dẫn', 0);
