# Expense Tracker - 快速开始指南

## 📋 前置要求

- Node.js 16+
- npm 或 yarn
- SQLite 3（会自动安装）

## 🚀 开始使用

### 1️⃣ 安装后端依赖

```bash
cd backend
npm install
```

### 2️⃣ 初始化数据库

```bash
npm run init-db
```

这将创建必要的数据库表：
- `users` - 用户表
- `categories` - 花销分类表
- `expenses` - 花销记录表

### 3️⃣ 启动后端服务

```bash
npm run dev
```

后端将在 `http://localhost:3000` 启动

### 4️⃣ 安装前端依赖（新终端）

```bash
cd frontend
npm install
```

### 5️⃣ 启动前端应用

```bash
npm run dev
```

前端将在 `http://localhost:5173` 启动

### 6️⃣ 打开应用

在浏览器中访问 `http://localhost:5173`

## 📝 使用说明

### 注册新账户

1. 点击 "注册一个" 链接
2. 填写用户名、邮箱、密码
3. 点击 "注册"
4. 返回登录页面，使用新账户登录

### 记录花销

1. 登录后进入仪表板
2. 点击 "➕ 记录" 标签页
3. 选择分类、输入金额、日期和描述
4. 点击 "添加花销"

### 查看统计

1. 点击 "📊 统计" 标签页
2. 查看本月总支出和分类统计
3. 分类柱状图展示各类别支出占比

### 管理分类

1. 点击 "🏷️ 分类" 标签页
2. 添加新分类或删除不需要的分类
3. 为每个分类设置自定义颜色

## 🔑 默认分类

应用会自动为每个新用户创建以下默认分类：
- 🍔 食物
- 🚗 交通
- 🛍️ 购物
- 🎭 娱乐
- 📦 其他

## 📊 API 接口

### 认证接口

**注册**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**登录**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1
}
```

### 花销接口

**获取花销列表**
```bash
GET /api/expenses?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**添加花销**
```bash
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryId": 1,
  "amount": 50.00,
  "description": "午餐",
  "date": "2024-01-15"
}
```

**删除花销**
```bash
DELETE /api/expenses/{id}
Authorization: Bearer <token>
```

### 分类接口

**获取分类列表**
```bash
GET /api/categories
Authorization: Bearer <token>
```

**添加分类**
```bash
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "医疗",
  "color": "#FF6B6B"
}
```

### 统计接口

**获取总体统计**
```bash
GET /api/statistics/summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

Response:
```json
{
  "totalAmount": 1000.00,
  "expenseCount": 20
}
```

**按分类统计**
```bash
GET /api/statistics/by-category?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

Response:
```json
[
  {
    "id": 1,
    "name": "食物",
    "color": "#FF6B6B",
    "total": 500.00,
    "count": 10
  },
  ...
]
```

## 🔒 认证说明

- 所有 API 接口（除了 `/auth/register` 和 `/auth/login`）都需要在请求头中包含 JWT token
- Token 格式：`Authorization: Bearer <your_token_here>`
- Token 有效期：7 天

## 📁 项目结构详解

### 后端结构

```
backend/
├── src/
│   ├── controllers/        # 业务逻辑
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── categoryController.js
│   │   └── statisticsController.js
│   ├── routes/            # API 路由
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── statisticsRoutes.js
│   ├── middleware/        # 中间件
│   │   └── auth.js
│   ├── utils/             # 工具函数
│   │   ├── db.js
│   │   └── jwt.js
│   └── index.js           # 应用入口
├── scripts/
│   └── init-db.js         # 数据库初始化脚本
├── data/                  # 数据库文件
│   └── expense_tracker.db
├── package.json
└── .env.example
```

### 前端结构

```
frontend/
├── src/
│   ├── pages/             # 页面组件
│   │   ├── Login.vue
│   │   └── Dashboard.vue
│   ├── stores/            # Pinia 状态管理
│   │   ├── auth.js
│   │   ├── expense.js
│   │   └── category.js
│   ├── api/               # API 调用
│   │   ├── axios.js
│   │   └── index.js
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html
├── vite.config.js
└── package.json
```

## 🐛 常见问题

**Q: 数据库连接失败**
A: 确保已运行 `npm run init-db` 初始化数据库

**Q: 登录时收到 CORS 错误**
A: 检查后端是否正常运行在 `http://localhost:3000`

**Q: Token 过期了怎么办**
A: 需要重新登录获取新的 token

## 🚀 部署到生产环境

### 构建前端

```bash
cd frontend
npm run build
```

生成的文件在 `dist/` 目录中

### 启用 HTTPS

1. 生成 SSL 证书
2. 修改后端配置以使用 HTTPS
3. 更新前端 API 地址

### 修改密钥

编辑 `.env` 文件，修改 `JWT_SECRET` 为强密钥

```bash
JWT_SECRET=your_very_strong_and_random_secret_key_here_min_32_chars
```

## 📧 支持

有问题或建议？请创建 Issue 或联系开发者。

---

**开发技术栈：**
- 前端: Vue 3 + Vite
- 后端: Node.js + Express
- 数据库: SQLite 3
- 认证: JWT

**版本**: 1.0.0
**最后更新**: 2024 年 1 月
