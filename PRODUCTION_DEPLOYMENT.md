# 🚀 生产环境配置和 Vercel 部署指南

## 🏗️ 环境分类

### 开发环境 (Development)
```
位置: 本地机器
端口: 前端 5173，后端 3000
数据库: 本地 SQLite
特点: 快速热更新，详细日志
```

### 生产环境 (Production)
```
位置: Vercel (云平台)
端口: 自动分配
数据库: Vercel 提供的数据库或外部数据库
特点: 优化性能，最小日志
```

---

## 📦 项目结构

```
expense-tracker/
├── backend/                          # 后端应用
│   ├── .env.example                  # 环境变量模板
│   ├── .env                          # 开发环境变量 (本地)
│   ├── .env.production               # 生产环境变量 (Vercel)
│   ├── package.json
│   ├── vercel.json                   # Vercel 配置 (新建)
│   └── src/
│
├── frontend/                         # 前端应用
│   ├── .env                          # 开发环境变量 (本地)
│   ├── .env.production               # 生产环境变量 (Vercel)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│
└── vercel.json                       # 项目级 Vercel 配置
```

---

## ⚙️ 配置文件准备

### 1. 后端开发环境 (.env)

**文件**: `backend/.env`

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key-12345
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=sqlite:./data/expense_tracker.db
```

**创建方法**:
```bash
cd /workspaces/ff-agent-practice/expense-tracker/backend
cp .env.example .env
```

### 2. 后端生产环境 (.env.production)

**文件**: `backend/.env.production`

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=your-very-long-and-secure-secret-key-min-32-chars
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.vercel.app
DATABASE_URL=your_database_connection_string
```

### 3. 前端开发环境 (.env)

**文件**: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
```

### 4. 前端生产环境 (.env.production)

**文件**: `frontend/.env.production`

```env
VITE_API_BASE_URL=https://your-backend-domain.vercel.app
VITE_APP_ENV=production
```

---

## 🌐 Vercel 部署配置

### 方案 1: 分开部署（推荐）

#### 1a. 后端部署到 Vercel

**创建文件**: `backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "JWT_SECRET": "@jwt_secret",
    "CORS_ORIGIN": "@cors_origin"
  }
}
```

**创建文件**: `backend/package.json` (修改 start 脚本)

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "init-db": "node scripts/init-db.js"
  }
}
```

#### 1b. 前端部署到 Vercel

**创建文件**: `frontend/vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url"
  }
}
```

### 方案 2: 整合部署

**创建文件**: 项目根目录 `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "frontend/dist"
      }
    },
    {
      "src": "backend/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ]
}
```

---

## 🔐 环境变量设置

### Vercel 控制台设置

1. **登录 Vercel**: https://vercel.com
2. **进入项目设置**
3. **Settings → Environment Variables**
4. **添加以下变量**:

#### 后端环境变量
```
NODE_ENV                production
JWT_SECRET              (生成强随机密钥)
CORS_ORIGIN             https://your-frontend-domain.vercel.app
DATABASE_URL            (数据库连接字符串)
```

#### 前端环境变量
```
VITE_API_BASE_URL       https://your-backend-domain.vercel.app
VITE_APP_ENV            production
```

---

## 🗄️ 生产数据库配置

### 选项 1: Vercel PostgreSQL（推荐）

1. **在 Vercel 中添加 Postgres**
2. **获取连接字符串**
3. **修改后端代码以支持 PostgreSQL**

### 选项 2: 外部数据库

**支持的数据库**:
- PostgreSQL
- MySQL
- MongoDB
- Firebase

**连接字符串格式**:
```
postgresql://user:password@host:port/database
mysql://user:password@host:port/database
mongodb://user:password@host:port/database
```

### 选项 3: 继续使用 SQLite

在 Vercel 上使用 SQLite 需要特殊处理（因为 Vercel 无服务器函数是无状态的）：

**使用 SQLite Cloud 或 Neon**:
```env
DATABASE_URL=https://api.sqlitecloud.io/your-api-key
```

---

## 📝 部署步骤

### 步骤 1: 准备代码

```bash
# 确保所有代码都提交到 Git
cd /workspaces/ff-agent-practice/expense-tracker

git add .
git commit -m "Production ready"
git push origin main
```

### 步骤 2: 创建后端项目（Vercel）

```bash
# 方法 1: 使用 Vercel CLI
npm install -g vercel
cd backend
vercel

# 方法 2: 在 Vercel 网站上
# 1. 连接 GitHub 账户
# 2. Import 项目
# 3. 选择 backend 文件夹
# 4. 配置环境变量
# 5. 部署
```

### 步骤 3: 创建前端项目（Vercel）

```bash
cd ../frontend
vercel

# 或在网站上重复步骤 2
```

### 步骤 4: 配置环境变量

**在 Vercel 项目设置中**:

```
后端项目:
  JWT_SECRET = [生成强密钥]
  CORS_ORIGIN = https://[前端-domain].vercel.app
  NODE_ENV = production

前端项目:
  VITE_API_BASE_URL = https://[后端-domain].vercel.app
  VITE_APP_ENV = production
```

### 步骤 5: 修改前端 API 地址

更新 `frontend/src/api/axios.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
```

### 步骤 6: 部署

```bash
# 自动部署 (任何 git push 都会触发)
git push origin main

# 或手动部署
vercel --prod
```

---

## 🔍 测试 vs 生产对比

| 方面 | 测试环境 | 生产环境 |
|------|---------|---------|
| **位置** | 本地 localhost | Vercel 云 |
| **端口** | 3000, 5173 | 自动分配 |
| **数据库** | 本地 SQLite | 云数据库 |
| **日志级别** | DEBUG | ERROR 只 |
| **缓存** | 禁用 | 启用 |
| **CORS** | localhost:5173 | production domain |
| **SSL** | 无 | 自动 HTTPS |
| **性能** | 未优化 | 优化 |

---

## 🎯 快速部署清单

- [ ] 创建 `.env` 文件（本地开发）
- [ ] 创建 `.env.production` 文件
- [ ] 创建 `vercel.json` 配置文件
- [ ] 修改 `package.json` 的 start 脚本
- [ ] 所有代码提交到 Git
- [ ] 连接 Vercel 账户
- [ ] 创建后端项目
- [ ] 创建前端项目
- [ ] 设置环境变量
- [ ] 测试部署
- [ ] 配置自定义域名（可选）

---

## 🚨 常见问题

### Q: 部署后数据库连接失败
**A**: 检查 Vercel 环境变量中的 DATABASE_URL 是否正确

### Q: CORS 错误
**A**: 确保 CORS_ORIGIN 环境变量是前端的正确 URL

### Q: SQLite 在 Vercel 上不工作
**A**: Vercel 是无状态的，SQLite 文件每次部署都会重置。使用云数据库或 SQLite Cloud。

### Q: 如何查看生产环境日志
**A**: 在 Vercel 控制面板的 Deployments → [部署] → Logs

### Q: 如何回滚到之前的版本
**A**: Vercel 自动保存所有部署，可在 Deployments 中选择回滚

---

## 📚 下一步

1. **设置自动部署** - 连接 GitHub 实现自动 CI/CD
2. **配置自定义域名** - 使用自己的域名
3. **添加数据库** - 连接生产数据库
4. **监控和日志** - 设置错误追踪 (Sentry)
5. **性能优化** - 配置 CDN 和缓存

---

**准备好部署了吗？** 🚀

