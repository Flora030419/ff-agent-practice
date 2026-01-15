# 💰 记账应用 (Expense Tracker)

一个完整的前后端分离记账应用，支持用户登录、日常花销记录、分类统计和数据可视化。

## 🎯 核心功能

- ✅ 用户认证（注册/登录/登出）
- ✅ 记录日常花销（金额、分类、日期、备注）
- ✅ 花销分类管理
- ✅ 统计报表（按分类、按时间段）
- ✅ 数据可视化（图表展示）
- ✅ 多设备同步

## 📁 项目结构

```
expense-tracker/
├── frontend/               # Vue 3 前端应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── api/            # API 接口
│   │   └── App.vue
│   ├── package.json
│   └── vite.config.js
├── backend/                # Node.js 后端应用
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── middleware/     # 中间件
│   │   ├── utils/          # 工具函数
│   │   └── index.js        # 入口文件
│   ├── database.js         # SQLite 配置
│   ├── package.json
│   └── .env.example
└── docker-compose.yml      # Docker 部署配置
```

## 🚀 快速开始

### 1. 安装依赖

**后端**
```bash
cd backend
npm install
```

**前端**
```bash
cd frontend
npm install
```

### 2. 初始化数据库

```bash
cd backend
node scripts/init-db.js
```

### 3. 启动应用

**后端**
```bash
cd backend
npm run dev
```

**前端（新终端）**
```bash
cd frontend
npm run dev
```

## 📊 API 接口文档

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 花销接口
- `GET /api/expenses` - 获取花销列表
- `POST /api/expenses` - 新增花销
- `PUT /api/expenses/:id` - 编辑花销
- `DELETE /api/expenses/:id` - 删除花销

### 分类接口
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 新增分类
- `DELETE /api/categories/:id` - 删除分类

### 统计接口
- `GET /api/statistics/summary` - 获取总结统计
- `GET /api/statistics/by-category` - 按分类统计
- `GET /api/statistics/by-date` - 按日期统计

## 🔐 认证方式

使用 JWT（JSON Web Token）进行认证：
- 注册/登录时返回 `access_token`
- 后续请求在 `Authorization: Bearer <token>` 头中发送 token
- Token 过期时间：7天

## 💾 数据库结构

**users 表**
- id: 主键
- username: 用户名
- email: 邮箱
- password: 加密密码
- created_at: 创建时间

**categories 表**
- id: 主键
- user_id: 用户 ID
- name: 分类名称
- color: 分类颜色
- created_at: 创建时间

**expenses 表**
- id: 主键
- user_id: 用户 ID
- category_id: 分类 ID
- amount: 金额
- description: 描述
- date: 支出日期
- created_at: 创建时间

## 🛠️ 技术栈

**前端**
- Vue 3
- Vite
- Pinia（状态管理）
- Axios（HTTP 客户端）
- Chart.js（数据可视化）

**后端**
- Node.js + Express
- SQLite 3
- JWT（认证）
- bcryptjs（密码加密）

## 📝 开发指南

### 添加新的 API 接口

1. 在 `backend/src/routes/` 中创建路由
2. 在 `backend/src/controllers/` 中实现控制器逻辑
3. 在 `frontend/src/api/` 中创建 API 调用
4. 在 `frontend/src/pages/` 或 `components/` 中使用

### 修改数据库结构

编辑 `backend/scripts/init-db.js`，然后重新运行初始化脚本

## 🚀 部署

### Docker 部署

```bash
docker-compose up -d
```

应用将在 `http://localhost:5173`（前端）和 `http://localhost:3000`（后端）启动

## 📄 许可证

MIT
