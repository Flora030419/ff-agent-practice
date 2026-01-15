# 💰 记账应用 - 完整实现方案

## 📌 项目概述

这是一个**完整的前后端分离记账应用**，支持用户认证、日常花销记录、分类管理和统计分析。

**核心特性：**
- ✅ JWT 用户认证系统
- ✅ RESTful API 设计
- ✅ 多设备数据同步
- ✅ 实时统计报表
- ✅ 分类管理
- ✅ 数据可视化（柱状图）

---

## 🏗️ 架构设计

### 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器                            │
├─────────────────────────────────────────────────────────┤
│  前端应用 (Vue 3 + Vite)                               │
│  ├─ Login.vue          (登录/注册页面)                 │
│  ├─ Dashboard.vue      (主应用仪表板)                  │
│  ├─ Pinia Store        (状态管理)                      │
│  └─ Axios API Client   (HTTP 客户端)                  │
├─────────────────────────────────────────────────────────┤
│                    HTTP/JWT Token                       │
├─────────────────────────────────────────────────────────┤
│  后端 API (Node.js + Express)                         │
│  ├─ /api/auth/*        (认证接口)                     │
│  ├─ /api/expenses/*    (花销接口)                     │
│  ├─ /api/categories/*  (分类接口)                     │
│  └─ /api/statistics/*  (统计接口)                     │
├─────────────────────────────────────────────────────────┤
│  SQLite 数据库                                         │
│  ├─ users             (用户表)                        │
│  ├─ categories        (分类表)                        │
│  └─ expenses          (花销表)                        │
└─────────────────────────────────────────────────────────┘
```

### 数据流向

```
用户登录
  ↓
获取 JWT Token
  ↓
携带 Token 请求 API
  ↓
后端验证 Token
  ↓
数据库查询/更新
  ↓
返回结果
  ↓
前端更新 UI
```

---

## 🗂️ 完整文件结构

```
expense-tracker/
│
├── 📄 README.md                          # 项目文档
├── 📄 QUICKSTART.md                      # 快速开始指南
├── 📄 IMPLEMENTATION.md                  # 本文件
├── 📄 docker-compose.yml                 # Docker 部署配置
├── 🔧 start.sh                           # 启动脚本
│
├── 🔙 backend/                           # 后端应用
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js        # 用户认证逻辑
│   │   │   ├── expenseController.js     # 花销操作逻辑
│   │   │   ├── categoryController.js    # 分类操作逻辑
│   │   │   └── statisticsController.js  # 统计逻辑
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js            # 认证路由
│   │   │   ├── expenseRoutes.js         # 花销路由
│   │   │   ├── categoryRoutes.js        # 分类路由
│   │   │   └── statisticsRoutes.js      # 统计路由
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js                  # JWT 验证中间件
│   │   │
│   │   ├── utils/
│   │   │   ├── db.js                    # 数据库操作函数
│   │   │   └── jwt.js                   # JWT 工具函数
│   │   │
│   │   └── index.js                     # Express 应用入口
│   │
│   ├── scripts/
│   │   └── init-db.js                   # 数据库初始化脚本
│   │
│   ├── data/
│   │   └── expense_tracker.db           # SQLite 数据库文件
│   │
│   ├── package.json
│   └── .env.example
│
├── 🎨 frontend/                          # 前端应用
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.vue                # 登录/注册页面
│   │   │   └── Dashboard.vue            # 主仪表板
│   │   │
│   │   ├── stores/
│   │   │   ├── auth.js                  # 认证状态管理
│   │   │   ├── expense.js               # 花销状态管理
│   │   │   └── category.js              # 分类状态管理
│   │   │
│   │   ├── api/
│   │   │   ├── axios.js                 # Axios 配置与拦截器
│   │   │   └── index.js                 # API 接口定义
│   │   │
│   │   ├── App.vue                      # 根组件
│   │   ├── main.js                      # 应用入口
│   │   └── router.js                    # 路由配置
│   │
│   ├── index.html                       # HTML 模板
│   ├── vite.config.js                   # Vite 配置
│   └── package.json
│
└── 📚 文档/
    ├── API 文档
    ├── 开发指南
    └── 部署指南
```

---

## 🔐 认证系统

### 工作流程

```
1. 用户注册
   ├─ 提交用户名、邮箱、密码
   ├─ 后端验证输入
   ├─ 密码加密（bcryptjs）
   ├─ 保存到数据库
   └─ 创建默认分类

2. 用户登录
   ├─ 提交用户名、密码
   ├─ 数据库查询用户
   ├─ 验证密码（bcryptjs 比较）
   ├─ 生成 JWT Token
   └─ 返回 token 给客户端

3. 后续请求
   ├─ 客户端在请求头中包含 Token
   ├─ 服务器验证 Token 有效性
   ├─ 从 Token 中提取 userId
   └─ 执行操作并返回结果
```

### JWT Token 结构

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": 1,
  "iat": 1705315200,      // 签发时间
  "exp": 1705920000       // 过期时间（7天后）
}

Signature: HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

---

## 💾 数据库设计

### 数据表结构

#### 1. users 表
```sql
CREATE TABLE users (
  id          INTEGER PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,           -- 加密后的密码
  created_at  DATETIME DEFAULT NOW()
);
```

#### 2. categories 表
```sql
CREATE TABLE categories (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER NOT NULL,        -- 用户 ID
  name        TEXT NOT NULL,
  color       TEXT DEFAULT '#FF6B6B',
  created_at  DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, name)                -- 同一用户的分类名唯一
);
```

#### 3. expenses 表
```sql
CREATE TABLE expenses (
  id          INTEGER PRIMARY KEY,
  user_id     INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  amount      DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date        DATE NOT NULL,
  created_at  DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### 数据关系图

```
┌─────────────┐
│   users     │
│  id (PK)    │
│  username   │
│  email      │
│  password   │
└─────────────┘
      │
      │ (1:N)
      │
┌─────────────────────┐
│   categories        │
│  id (PK)            │
│  user_id (FK)       │
│  name               │
│  color              │
└─────────────────────┘
      │
      │ (1:N)
      │
┌──────────────────────┐
│   expenses           │
│  id (PK)             │
│  user_id (FK)        │
│  category_id (FK)    │
│  amount              │
│  description         │
│  date                │
└──────────────────────┘
```

---

## 🎯 核心功能实现

### 1. 用户认证

**后端实现** (`authController.js`)：
```javascript
// 注册流程
register() {
  1. 验证输入数据
  2. 检查用户名/邮箱是否已存在
  3. 加密密码 (bcryptjs.hash)
  4. 保存用户到数据库
  5. 为新用户创建默认分类
  6. 返回成功信息
}

// 登录流程
login() {
  1. 验证用户名和密码
  2. 从数据库查询用户
  3. 比对密码 (bcryptjs.compare)
  4. 生成 JWT Token
  5. 返回 token 给客户端
}
```

**前端实现** (`auth.js store`)：
```javascript
// 登录状态管理
store {
  token        // JWT token
  userId       // 用户 ID
  username     // 用户名
  isLoggedIn   // 登录状态
}

// 调用认证 API
login() {
  1. 向服务器发送登录请求
  2. 获取返回的 token
  3. 保存到 localStorage
  4. 更新状态
}
```

### 2. 花销记录

**操作流程**：
```
添加花销
├─ 用户选择分类
├─ 输入金额、日期、描述
├─ 后端验证分类是否属于该用户
├─ 验证数据有效性
├─ 插入数据库
└─ 返回新记录 ID

查询花销
├─ 支持按日期范围过滤
├─ 支持按分类过滤
├─ 返回分类和花销信息
└─ 前端展示列表

更新花销
├─ 只能更新该用户的花销
├─ 支持部分更新
└─ 更新完成后返回成功

删除花销
├─ 验证花销所有权
├─ 从数据库删除
└─ 返回删除结果
```

### 3. 分类管理

**操作流程**：
```
添加分类
├─ 验证分类名不重复
├─ 为分类设置颜色
├─ 保存到数据库
└─ 更新前端列表

删除分类
├─ 验证分类不被使用
├─ 删除分类记录
└─ 更新列表

获取分类
├─ 查询该用户所有分类
├─ 按创建时间排序
└─ 返回分类列表
```

### 4. 统计分析

**统计类型**：

**按月统计**
```
Query: SELECT SUM(amount), COUNT(id) 
       FROM expenses 
       WHERE user_id = ? AND date BETWEEN startDate AND endDate

Result: {
  totalAmount: 5000.00,
  expenseCount: 45
}
```

**按分类统计**
```
Query: SELECT c.id, c.name, c.color, SUM(e.amount), COUNT(e.id)
       FROM categories c
       LEFT JOIN expenses e ON c.id = e.category_id
       WHERE c.user_id = ? AND e.date BETWEEN startDate AND endDate
       GROUP BY c.id

Result: [
  { id: 1, name: '食物', color: '#FF6B6B', total: 2000, count: 20 },
  { id: 2, name: '交通', color: '#4ECDC4', total: 800, count: 10 }
]
```

**按日期统计**
```
Query: SELECT date, SUM(amount), COUNT(id)
       FROM expenses
       WHERE user_id = ? AND date BETWEEN startDate AND endDate
       GROUP BY date

Result: [
  { date: '2024-01-01', total: 100, count: 5 },
  { date: '2024-01-02', total: 150, count: 6 }
]
```

---

## 🎨 前端界面

### 页面结构

```
Login/Register 页面
├─ 登录表单
│  ├─ 用户名输入框
│  ├─ 密码输入框
│  └─ 登录按钮
├─ 注册表单
│  ├─ 用户名输入框
│  ├─ 邮箱输入框
│  ├─ 密码输入框
│  ├─ 确认密码输入框
│  └─ 注册按钮
└─ 表单切换

Dashboard 主页面
├─ 导航栏
│  ├─ 应用名称
│  ├─ 欢迎信息
│  └─ 登出按钮
│
├─ 标签页导航
│  ├─ 📊 统计
│  ├─ ➕ 记录
│  ├─ 📝 列表
│  └─ 🏷️ 分类
│
├─ 📊 统计页面
│  ├─ 统计卡片
│  │  ├─ 总支出
│  │  └─ 记录数
│  └─ 分类柱状图
│     ├─ 分类名称
│     ├─ 金额柱子
│     └─ 精确金额
│
├─ ➕ 记录页面
│  ├─ 分类下拉框
│  ├─ 金额输入
│  ├─ 日期选择
│  ├─ 描述输入
│  └─ 添加按钮
│
├─ 📝 列表页面
│  ├─ 花销卡片（网格布局）
│  │  ├─ 分类与颜色指示
│  │  ├─ 描述文本
│  │  ├─ 金额（加粗）
│  │  ├─ 日期
│  │  └─ 删除按钮
│  └─ 空状态提示
│
└─ 🏷️ 分类页面
   ├─ 添加分类表单
   │  ├─ 分类名称输入
   │  ├─ 颜色选择器
   │  └─ 添加按钮
   └─ 分类列表
      ├─ 分类项
      │  ├─ 颜色指示
      │  ├─ 分类名称
      │  └─ 删除按钮
      └─ 网格布局
```

### 响应式设计

```
桌面版 (1200px+)
├─ 支出卡片: 2 列
├─ 花销列表: 网格布局
└─ 充分的内边距

平板版 (768px - 1199px)
├─ 支出卡片: 1 列
├─ 花销列表: 网格布局
└─ 中等内边距

手机版 (< 768px)
├─ 支出卡片: 1 列
├─ 花销列表: 单列
└─ 紧凑的内边距
```

---

## 🔌 API 端点详解

### 认证接口

```
POST /api/auth/register
  请求体: { username, email, password, confirmPassword }
  响应: { message, userId }
  错误: 用户名/邮箱已存在, 密码不匹配, 字段验证

POST /api/auth/login
  请求体: { username, password }
  响应: { message, token, userId }
  错误: 用户不存在, 密码错误

POST /api/auth/logout
  响应: { message }
```

### 花销接口

```
GET /api/expenses
  查询参数: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&categoryId=ID
  响应: [{ id, amount, description, date, categoryName, ... }]
  需要认证: 是

POST /api/expenses
  请求体: { categoryId, amount, description, date }
  响应: { id, message }
  需要认证: 是

PUT /api/expenses/:id
  请求体: { categoryId?, amount?, description?, date? }
  响应: { message }
  需要认证: 是

DELETE /api/expenses/:id
  响应: { message }
  需要认证: 是
```

### 分类接口

```
GET /api/categories
  响应: [{ id, name, color }]
  需要认证: 是

POST /api/categories
  请求体: { name, color? }
  响应: { id, message }
  需要认证: 是

DELETE /api/categories/:id
  响应: { message }
  需要认证: 是
```

### 统计接口

```
GET /api/statistics/summary
  查询参数: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  响应: { totalAmount, expenseCount }
  需要认证: 是

GET /api/statistics/by-category
  查询参数: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  响应: [{ id, name, color, total, count }]
  需要认证: 是

GET /api/statistics/by-date
  查询参数: ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  响应: [{ date, total, count }]
  需要认证: 是
```

---

## 🚀 部署指南

### 开发环境运行

```bash
# 1. 后端
cd backend
npm install
npm run init-db
npm run dev          # 运行在 localhost:3000

# 2. 前端（新终端）
cd frontend
npm install
npm run dev          # 运行在 localhost:5173
```

### 生产环境部署

**1. 前端打包**
```bash
cd frontend
npm run build
# 生成 dist/ 目录，包含静态文件
```

**2. 后端部署**
- 设置环境变量（JWT_SECRET 等）
- 运行 `npm install --production`
- 使用 PM2 或其他进程管理器运行
- 配置 Nginx 反向代理

**3. 数据库**
- 确保 SQLite 文件有写权限
- 定期备份数据库

**4. SSL/HTTPS**
- 配置 HTTPS 证书
- 更新 CORS 允许列表

---

## 📊 性能优化

### 前端优化
- ✅ 代码分割（路由级别）
- ✅ 图片懒加载
- ✅ 状态管理（Pinia）
- ✅ API 缓存

### 后端优化
- ✅ 数据库索引
- ✅ 连接池
- ✅ 查询优化
- ✅ 响应压缩

### 数据库优化
```sql
-- 已创建的索引
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

---

## 🔒 安全注意事项

### 已实现的安全措施

1. **密码加密**
   - 使用 bcryptjs 进行密码哈希
   - 盐值迭代次数: 10

2. **JWT 认证**
   - Token 有效期: 7 天
   - 签名算法: HS256
   - 敏感操作需要验证

3. **输入验证**
   - 检查必填字段
   - 验证数据类型
   - SQL 注入防护（预prepared statement）

4. **CORS 防护**
   - 限制来源域名
   - 只允许特定的 HTTP 方法

### 安全建议

1. **生产环境**
   - 使用强 JWT_SECRET（至少 32 字符）
   - 启用 HTTPS
   - 设置 CORS 为具体域名

2. **数据保护**
   - 定期备份数据库
   - 使用数据库加密
   - 限制 API 请求频率

3. **用户隐私**
   - 不要在日志中记录密码
   - 实现账户锁定机制
   - 定期审计访问日志

---

## 🧪 测试场景

### 注册流程
```
1. 成功注册
   └─ 用户创建，默认分类添加成功

2. 用户名重复
   └─ 返回 400 错误

3. 邮箱重复
   └─ 返回 400 错误

4. 密码不匹配
   └─ 返回 400 错误

5. 密码过短
   └─ 返回 400 错误
```

### 添加花销
```
1. 成功添加
   └─ 返回记录 ID，前端显示成功

2. 分类不存在
   └─ 返回 404 错误

3. 金额为空
   └─ 返回 400 错误

4. 日期格式错误
   └─ 返回 400 错误
```

### 统计查询
```
1. 按月查询
   └─ 返回该月总支出

2. 按分类查询
   └─ 返回所有分类的支出汇总

3. 跨月查询
   └─ 返回指定日期范围内的数据
```

---

## 🔄 数据流示例

### 添加花销的完整流程

```
┌─ 前端 UI ────────────────────────────────┐
│ 用户填写: 分类=食物, 金额=50, 日期=今天 │
│ 点击"添加花销"按钮                       │
└──────────────────────────────────────────┘
           │
           ▼
┌─ Pinia Store ─────────────────────────────┐
│ addExpense({                              │
│   categoryId: 1,                          │
│   amount: 50,                             │
│   date: '2024-01-15'                      │
│ })                                        │
└──────────────────────────────────────────┘
           │
           ▼
┌─ API 客户端 ───────────────────────────────┐
│ POST /api/expenses                         │
│ Headers: {                                 │
│   'Authorization': 'Bearer <token>'        │
│ }                                          │
│ Body: { categoryId, amount, date }         │
└──────────────────────────────────────────┘
           │
           ▼
┌─ Express 路由 ─────────────────────────────┐
│ authMiddleware(req, res, next)             │
│ ├─ 验证 token                             │
│ └─ 设置 req.userId                        │
└──────────────────────────────────────────┘
           │
           ▼
┌─ 控制器逻辑 ───────────────────────────────┐
│ createExpense()                            │
│ ├─ 验证输入数据                           │
│ ├─ 检查分类所有权                         │
│ └─ 准备数据                               │
└──────────────────────────────────────────┘
           │
           ▼
┌─ 数据库操作 ───────────────────────────────┐
│ INSERT INTO expenses VALUES(...)           │
│ 返回: { lastID: 123 }                      │
└──────────────────────────────────────────┘
           │
           ▼
┌─ API 响应 ─────────────────────────────────┐
│ {                                          │
│   "id": 123,                               │
│   "message": "Expense created successfully"│
│ }                                          │
└──────────────────────────────────────────┘
           │
           ▼
┌─ 前端处理 ─────────────────────────────────┐
│ fetchExpenses()                            │
│ ├─ 重新加载花销列表                       │
│ ├─ 刷新统计数据                           │
│ └─ 显示成功提示                           │
└──────────────────────────────────────────┘
           │
           ▼
┌─ UI 更新 ──────────────────────────────────┐
│ ✅ 新花销显示在列表中                     │
│ ✅ 统计数据已更新                         │
│ ✅ 用户看到成功消息                       │
└──────────────────────────────────────────┘
```

---

## 🎓 学习要点

通过这个项目，可以学习：

1. **前端开发**
   - Vue 3 组合式 API
   - Pinia 状态管理
   - Vite 构建工具
   - 响应式设计

2. **后端开发**
   - Express.js 框架
   - REST API 设计
   - JWT 认证
   - 数据库操作

3. **数据库**
   - SQLite 基础
   - SQL 查询优化
   - 数据关系设计
   - 索引创建

4. **工程实践**
   - 前后端分离
   - 中间件模式
   - 错误处理
   - API 文档编写

---

## 📈 后续扩展方向

### 短期
- [ ] 添加数据导出功能（CSV/Excel）
- [ ] 记账标签系统
- [ ] 预算提醒功能
- [ ] 数据分析图表

### 中期
- [ ] 移动端适配（React Native/Flutter）
- [ ] 多人共享账本
- [ ] 复杂统计报表
- [ ] 自动分类建议

### 长期
- [ ] AI 智能分析
- [ ] 投资理财功能
- [ ] 社区分享功能
- [ ] 企业版本

---

## 📝 版本历史

**v1.0.0** (2024-01-15)
- ✅ 核心功能完成
- ✅ 用户认证系统
- ✅ 花销记录和管理
- ✅ 分类管理
- ✅ 基础统计功能
- ✅ 前后端分离架构

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

**祝你开发愉快！** 🚀

需要帮助？提交 Issue 或联系开发者。
