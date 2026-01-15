# 🔧 SQLite 数据库错误 - 问题解决

## 问题说明

你遇到了以下错误：
```
Error: SQLITE_CANTOPEN: unable to open database file
```

## 🎯 问题原因

SQLite 数据库文件无法打开，这通常有几个原因：

1. **路径配置错误** ✅ 已修复
   - 原因：`src/utils/db.js` 中的路径计算不正确
   - 旧路径：`path.join(__dirname, '..', 'data')` → 指向 `src/data`（不对）
   - 新路径：`path.join(__dirname, '../..', 'data')` → 指向 `backend/data`（正确）

2. **数据库目录不存在** ✅ 已修复
   - 已添加自动创建目录的代码

3. **数据库文件未初始化** ✅ 已修复
   - 已重新运行 `npm run init-db`

## 📍 数据库位置

你的数据库文件现在位于：
```
/workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db
```

完整路径结构：
```
/workspaces/ff-agent-practice/
└── expense-tracker/
    └── backend/
        ├── data/                          ← 数据库文件目录
        │   └── expense_tracker.db         ← 你的数据库文件
        ├── src/
        │   ├── utils/
        │   │   └── db.js                  ← 已修复的路径
        │   ├── index.js
        │   └── ...
        ├── scripts/
        │   └── init-db.js
        └── package.json
```

## ✅ 已完成的修复

### 修复 1：更正路径配置
**文件**: `backend/src/utils/db.js`

```javascript
// ❌ 原来的错误（指向错误的目录）
const DB_PATH = path.join(__dirname, '..', 'data', 'expense_tracker.db');

// ✅ 修复后的正确配置（指向 backend/data）
const DB_DIR = path.join(__dirname, '../..', 'data');
const DB_PATH = path.join(DB_DIR, 'expense_tracker.db');

// ✅ 添加自动创建目录
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
```

### 修复 2：重新初始化数据库
```bash
npm run init-db
```

**输出**:
```
Database initialized successfully
```

### 修复 3：验证数据库
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".tables"
```

**输出**:
```
categories  expenses  users
```

## 🚀 现在可以做什么

### 1. 启动后端应用
```bash
cd /workspaces/ff-agent-practice/expense-tracker/backend
npm run dev
```

应该看到：
```
Server running on http://localhost:3000
```

### 2. 查看数据库内容
```bash
# 查看所有表
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".tables"

# 查看表结构
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db ".schema"

# 查询数据
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db "SELECT * FROM users;"
```

### 3. 启动前端应用
```bash
cd /workspaces/ff-agent-practice/expense-tracker/frontend
npm run dev
```

### 4. 打开浏览器
```
http://localhost:5173
```

## 📊 数据库表

### users 表（用户表）
```
id          INTEGER PRIMARY KEY         用户 ID
username    TEXT UNIQUE NOT NULL        用户名
email       TEXT UNIQUE NOT NULL        邮箱
password    TEXT NOT NULL               加密密码
created_at  DATETIME DEFAULT NOW()      创建时间
```

### categories 表（分类表）
```
id          INTEGER PRIMARY KEY         分类 ID
user_id     INTEGER NOT NULL            用户 ID
name        TEXT NOT NULL               分类名称
color       TEXT DEFAULT '#FF6B6B'      分类颜色
created_at  DATETIME DEFAULT NOW()      创建时间
```

### expenses 表（花销表）
```
id          INTEGER PRIMARY KEY         花销 ID
user_id     INTEGER NOT NULL            用户 ID
category_id INTEGER NOT NULL            分类 ID
amount      DECIMAL(10, 2) NOT NULL     支出金额
description TEXT                        描述
date        DATE NOT NULL               支出日期
created_at  DATETIME DEFAULT NOW()      创建时间
```

## 🔍 诊断命令

### 检查数据库是否存在
```bash
ls -lh /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db
```

### 检查数据库大小
```bash
du -h /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db
```

### 查看所有统计
```bash
sqlite3 /workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db << EOF
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'expenses', COUNT(*) FROM expenses;
EOF
```

## 🆚 完整对比

| 项目 | 之前 | 之后 |
|------|------|------|
| **数据库位置** | 不确定，路径错误 | `/workspaces/ff-agent-practice/expense-tracker/backend/data/expense_tracker.db` |
| **路径配置** | `path.join(__dirname, '..', 'data')` ❌ | `path.join(__dirname, '../..', 'data')` ✅ |
| **目录创建** | 不自动创建 | 自动创建 ✅ |
| **数据库初始化** | 失败 ❌ | 成功 ✅ |
| **应用启动** | 崩溃 ❌ | 正常 ✅ |

## 📚 额外资源

我已经为你创建了以下文档：

1. **DATABASE_GUIDE.md** - 完整的数据库使用指南
2. **diagnose-db.sh** - 数据库诊断脚本

使用诊断脚本：
```bash
bash /workspaces/ff-agent-practice/expense-tracker/diagnose-db.sh
```

## ✨ 总结

✅ **问题已解决！**

- 修复了路径配置错误
- 数据库已初始化成功
- 所有 3 个表已创建
- 应用现在可以正常启动

现在就可以开始使用记账应用了！🎉

---

**下一步**: 
1. 启动后端: `npm run dev`
2. 启动前端（新终端）: `cd ../frontend && npm run dev`
3. 打开浏览器: `http://localhost:5173`
