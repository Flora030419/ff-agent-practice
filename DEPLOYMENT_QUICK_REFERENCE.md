# 🚀 测试 vs 生产：快速参考

## 📍 两个环境的位置

### 🏠 测试环境 (Development)
```
位置: 你的本地电脑
前端: http://localhost:5173
后端: http://localhost:3000
数据库: 本地文件 (backend/data/expense_tracker.db)
配置: backend/.env, frontend/.env
启动: npm run dev (各自文件夹)
```

### ☁️ 生产环境 (Production)
```
位置: Vercel 云服务器
前端: https://expense-tracker-frontend.vercel.app
后端: https://expense-tracker-backend.vercel.app
数据库: Vercel PostgreSQL 或其他云数据库
配置: Vercel 控制面板的 Environment Variables
启动: Git push → 自动部署
```

---

## 🔄 流程图

```
开发阶段
  ↓
npm run dev (本地测试)
  ↓
功能测试通过
  ↓
git commit 和 git push
  ↓
部署阶段
  ↓
Vercel 自动识别
  ↓
构建和部署
  ↓
生产环境上线
```

---

## 📋 配置文件对照

| 用途 | 文件位置 | 用途 |
|------|---------|------|
| 本地开发 | `backend/.env` | 开发服务器配置 |
| 生产部署 | `backend/.env.production` | Vercel 部署配置 |
| Vercel 配置 | `backend/vercel.json` | 部署规则 |
| | | |
| 本地开发 | `frontend/.env` | 开发服务器配置 |
| 生产部署 | `frontend/.env.production` | Vercel 部署配置 |
| Vercel 配置 | `frontend/vercel.json` | 部署规则 |

---

## ⚙️ 关键环境变量

### 后端

**测试环境** (`backend/.env`)
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=sqlite:./data/expense_tracker.db
```

**生产环境** (`backend/.env.production` 和 Vercel)
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<生成的强密钥>
CORS_ORIGIN=https://expense-tracker-frontend.vercel.app
DATABASE_URL=postgresql://...
```

### 前端

**测试环境** (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_ENV=development
```

**生产环境** (`frontend/.env.production` 和 Vercel)
```env
VITE_API_BASE_URL=https://expense-tracker-backend.vercel.app
VITE_APP_ENV=production
```

---

## 🎬 快速开始指南

### 开发环境快速启动

```bash
# 1. 启动后端
cd backend
npm install
npm run dev

# 2. 在新终端启动前端
cd frontend
npm install
npm run dev

# 3. 打开浏览器
访问 http://localhost:5173
```

### 部署到生产环境

```bash
# 1. 确保代码提交到 GitHub
git add .
git commit -m "Ready for production"
git push origin main

# 2. 登录 Vercel 网站
https://vercel.com

# 3. Import 项目
按 PRODUCTION_DEPLOYMENT.md 的步骤

# 4. 配置环境变量
在 Vercel 控制面板中设置

# 5. 部署完成
```

---

## 🔐 环境变量生成

### JWT_SECRET

```bash
# 方法 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 输出: abc123def456... (64 个字符)
# 复制这个值到 Vercel
```

---

## 📊 对比表

| 特性 | 测试环境 | 生产环境 |
|------|---------|---------|
| **访问方式** | localhost | 公网 URL |
| **数据库** | 本地 SQLite | 云 PostgreSQL |
| **HTTPS** | ❌ 无 | ✅ 自动 |
| **日志详细度** | 🔍 详细 DEBUG | 🔴 只 ERROR |
| **自动部署** | ❌ 手动启动 | ✅ Git push 触发 |
| **CDN 加速** | ❌ 无 | ✅ 有 |
| **SSL 证书** | ❌ 无 | ✅ 免费自动 |
| **备份** | ❌ 无 | ✅ 自动 |
| **性能监控** | ❌ 无 | ✅ 有 |
| **扩展性** | ✅ 足够 | ✅✅ 无限 |

---

## ✅ 测试清单

### 本地测试完成后检查
- [ ] 能登录
- [ ] 能添加支出
- [ ] 能查看统计
- [ ] 能修改数据
- [ ] 没有控制台错误

### 部署后检查
- [ ] 前端页面能打开
- [ ] 能登录
- [ ] 能添加支出
- [ ] 后端 API 能访问
- [ ] 数据能正确保存

---

## 🆘 快速故障排除

### 问题: 本地无法启动
```bash
# 1. 检查端口占用
lsof -i :3000
lsof -i :5173

# 2. 杀死进程
kill -9 <PID>

# 3. 重新启动
npm run dev
```

### 问题: 部署后 404
```
原因: 前端构建失败
解决:
1. 检查 Vercel Logs
2. 确认 vite.config.js
3. 重新部署
```

### 问题: 前后端无法通信
```
原因: CORS 或 API 地址错误
检查:
1. VITE_API_BASE_URL 是否正确
2. 后端 CORS_ORIGIN 是否包含前端 URL
3. 是否还在使用 localhost
```

---

## 📞 获取帮助

| 问题 | 查看文件 |
|------|---------|
| 部署步骤详解 | [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md) |
| 完整配置说明 | [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) |
| 数据库问题 | [DATABASE_GUIDE.md](DATABASE_GUIDE.md) |
| 常见错误 | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |

---

## 💾 文件清单

生产部署相关新增文件：

```
✅ backend/.env.production       生产环境变量
✅ backend/vercel.json           后端部署配置
✅ frontend/.env.production      前端生产变量
✅ frontend/vercel.json          前端部署配置
✅ PRODUCTION_DEPLOYMENT.md      部署详解
✅ VERCEL_DEPLOYMENT_GUIDE.md    Vercel 教程
✅ DEPLOYMENT_QUICK_REFERENCE.md 快速参考 (本文件)
```

---

## 🎯 下一步

1. **本地完整测试** ← 确保功能无问题
2. **代码提交 GitHub** ← git push origin main
3. **创建 Vercel 账户** ← https://vercel.com
4. **按步骤部署** ← 参考 VERCEL_DEPLOYMENT_GUIDE.md
5. **配置生产环境** ← 设置环境变量
6. **测试生产应用** ← 验证功能正常
7. **配置自定义域名** ← (可选)

---

**准备好了吗？开始部署吧！** 🚀

有问题？查看完整的 [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)
