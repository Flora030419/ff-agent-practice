# 📊 SQLite 数据库使用指南

## 🔍 数据库位置

你的数据库文件位于：
```
/workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db
```

## 📁 目录结构

```
expense-tracker/
└── backend/
    ├── data/
    │   └── expense_tracker.db      ← 你的数据库文件在这里
    ├── src/
    ├── scripts/
    ├── package.json
    └── ...
```

## ✅ 检查数据库

### 方法 1：使用诊断脚本
```bash
bash /workspaces/ff-agent-practice/expense-tracker/diagnose-db.sh
```

### 方法 2：使用 SQLite 命令行

**查看所有表**
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".tables"
```

**查看表结构**
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".schema users"
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".schema categories"
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".schema expenses"
```

**查询用户数据**
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db "SELECT id, username, email FROM users;"
```

**查询分类数据**
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db "SELECT * FROM categories;"
```

**查询花销数据**
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db "SELECT * FROM expenses;"
```

## 📊 数据库表结构

### users 表（用户表）
```sql
CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  username    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,                  -- 加密密码
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### categories 表（分类表）
```sql
CREATE TABLE categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  name        TEXT NOT NULL,
  color       TEXT DEFAULT '#FF6B6B',
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, name)
);
```

### expenses 表（花销表）
```sql
CREATE TABLE expenses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date        DATE NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

## 🔧 常用 SQLite 命令

### 打开数据库交互式界面
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db
```

进入后，可以执行 SQL 命令：

```sql
-- 查看所有表
.tables

-- 查看表结构
.schema

-- 查看具体表的结构
.schema users

-- 查询数据
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM expenses;

-- 统计数据
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as category_count FROM categories;
SELECT COUNT(*) as expense_count FROM expenses;

-- 退出
.quit
或
.exit
```

## 🚀 完整工作流

### 1. 初始化数据库
```bash
cd /workspaces/ff-agent-practice/expense-tracker/backend
npm run init-db
```

输出应该显示：
```
Database initialized successfully
```

### 2. 验证数据库创建
```bash
ls -lh /workspaces/ff-agent-practice/expense-tracker/backend/data/
```

你应该看到 `expense_tracker.db` 文件。

### 3. 检查表是否创建
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".tables"
```

应该显示：
```
categories  expenses  users
```

### 4. 启动后端应用
```bash
npm run dev
```

### 5. 启动前端应用（新终端）
```bash
cd ../frontend
npm install
npm run dev
```

### 6. 打开浏览器并使用
```
http://localhost:5173
```

## 🐛 常见问题

### Q: 数据库文件在哪里？
**A:** 在 `/workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db`

### Q: 如何查看数据库内容？
**A:** 使用 SQLite 命令行工具：
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db
```

### Q: 如何重新初始化数据库？
**A:** 
```bash
# 删除现有数据库
rm /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db

# 重新初始化
npm run init-db
```

### Q: 如何导出数据？
**A:**
```bash
# 导出为 CSV
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".mode csv" ".output data.csv" "SELECT * FROM expenses;" ".quit"
```

### Q: 如何执行 SQL 查询？
**A:**
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db "SELECT COUNT(*) FROM users;"
```

## 📈 监控数据库增长

```bash
# 查看文件大小
ls -lh /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db

# 查看所有数据统计
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db << EOF
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses;
EOF
```

## 🔒 数据库备份

### 备份数据库
```bash
cp /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db \
   /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db.backup
```

### 恢复数据库
```bash
cp /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db.backup \
   /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db
```

## 🎓 学习资源

- SQLite 官方文档: https://www.sqlite.org/docs.html
- SQLite 命令参考: https://www.sqlite.org/cli.html
- SQL 教程: https://www.w3schools.com/sql/

---

**提示：** 数据库是 SQLite，这是一个轻量级的文件数据库，不需要额外的数据库服务器。所有数据都存储在单个文件中。
