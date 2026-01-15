# Vercel 部署完整教程

## 📋 前置条件
- ✅ GitHub 账户
- ✅ Vercel 账户 (免费在 https://vercel.com 注册)
- ✅ 项目上传到 GitHub 仓库
- ✅ 本地已运行测试成功

---

## 🎯 部署流程概览

```
开发环境完成
    ↓
提交代码到 GitHub
    ↓
在 Vercel 中导入项目
    ↓
配置环境变量
    ↓
部署后端
    ↓
部署前端
    ↓
配置跨域和连接
    ↓
✅ 生产环境上线
```

---

## 🔧 第一步：准备代码

### 1.1 确保项目在 GitHub 上

```bash
# 初始化 Git（如果还没有）
cd /workspaces/ff-agent-practice/expense-tracker
git init

# 添加远程仓库 (替换 your-username 和 your-repo)
git remote add origin https://github.com/your-username/expense-tracker.git

# 提交所有文件
git add .
git commit -m "Production ready - configure for Vercel deployment"

# 推送到 GitHub
git push -u origin main
```

### 1.2 项目结构验证

```
expense-tracker/
├── backend/
│   ├── vercel.json              ✅ 已创建
│   ├── .env.production          ✅ 已创建
│   ├── package.json             ✅
│   ├── src/
│   │   ├── index.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── utils/db.js
│   └── data/
│
├── frontend/
│   ├── vercel.json              ✅ 已创建
│   ├── .env.production          ✅ 已创建
│   ├── package.json             ✅
│   ├── vite.config.js           ✅
│   └── src/
│
└── PRODUCTION_DEPLOYMENT.md     ✅ 已创建
```

---

## 🚀 第二步：部署后端到 Vercel

### 2.1 登录 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"
3. 选择用 GitHub 账户登录
4. 授权访问你的 GitHub 仓库

### 2.2 创建后端项目

1. **点击 "Add New..."** → **"Project"**
2. **选择你的仓库**
   ```
   选择: expense-tracker (或你的仓库名)
   ```
3. **配置项目**
   ```
   Project Name: expense-tracker-backend
   Framework: Other (Other - Node.js)
   Root Directory: ./backend
   ```
4. **点击 "Deploy"**

### 2.3 配置环境变量（后端）

部署完成后：

1. **进入项目** → **Settings**
2. **找到 "Environment Variables"**
3. **添加以下变量**:

| 变量名 | 值 | 说明 |
|------|-----|------|
| `NODE_ENV` | `production` | 环境标识 |
| `JWT_SECRET` | `生成的强密钥` | 见下文 |
| `CORS_ORIGIN` | `https://expense-tracker-frontend.vercel.app` | 前端URL（后面改） |
| `DATABASE_URL` | `数据库连接` | 见下文 |

#### 🔐 生成 JWT_SECRET

在终端执行：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

复制输出的值到 Vercel 中。

#### 🗄️ 配置 DATABASE_URL

**选项 A: 使用 Vercel PostgreSQL（推荐）**

1. 在 Vercel 项目中找到 **"Storage"**
2. 点击 **"Create Database"** → **"PostgreSQL"**
3. 按提示创建数据库
4. Vercel 会自动添加 `POSTGRES_URLCONNECTION` 环境变量
5. 添加新环境变量：
   ```
   DATABASE_URL = (复制 POSTGRES_URLCONNECTION 的值)
   ```

**选项 B: 使用外部数据库**

如 Neon、Supabase、MongoDB Atlas 等：

```bash
# 获取连接字符串后添加到 Vercel:
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### 2.4 验证后端部署

- 访问: `https://expense-tracker-backend.vercel.app`
- 应该看到: `{"message":"Expense Tracker API"}`

---

## 🎨 第三步：部署前端到 Vercel

### 3.1 创建前端项目

1. **在 Vercel 中** → **"Add New..."** → **"Project"**
2. **选择同一仓库**
3. **配置项目**
   ```
   Project Name: expense-tracker-frontend
   Framework: Vite
   Root Directory: ./frontend
   Build Command: npm run build
   Output Directory: dist
   ```
4. **点击 "Deploy"**

### 3.2 配置环境变量（前端）

1. **进入前端项目** → **Settings** → **Environment Variables**
2. **添加变量**:

| 变量名 | 值 |
|------|-----|
| `VITE_API_BASE_URL` | `https://expense-tracker-backend.vercel.app` |
| `VITE_APP_ENV` | `production` |

> ⚠️ 添加后需要重新部署，更新才会生效

### 3.3 重新部署前端

1. 进入前端项目
2. 点击 **"Deployments"**
3. 找到最新部署
4. 点击 **"..."** → **"Redeploy"**

---

## 🔗 第四步：配置跨域连接

### 4.1 更新后端 CORS

访问后端 Vercel 项目：

1. **Settings** → **Environment Variables**
2. **修改 `CORS_ORIGIN`** 为前端 URL:
   ```
   CORS_ORIGIN = https://expense-tracker-frontend.vercel.app
   ```
3. **重新部署**后端

### 4.2 更新前端 API 地址

如果前后端 URL 改变：

1. **Settings** → **Environment Variables**
2. **修改 `VITE_API_BASE_URL`**
3. **重新部署**

---

## 🧪 第五步：测试生产环境

### 5.1 访问应用

1. 打开: `https://expense-tracker-frontend.vercel.app`
2. 应该看到登录界面

### 5.2 测试功能

```
✅ 注册新账户
✅ 登录
✅ 添加收入/支出
✅ 查看统计图表
✅ 添加分类
✅ 修改/删除数据
```

### 5.3 检查浏览器控制台

```
F12 → Console
检查是否有错误信息
```

---

## 🆘 常见问题排查

### 问题 1: 部署后显示 404
```
原因: 前端构建失败或路由配置错误
解决:
1. 检查 Vercel Logs: Deployments → Logs
2. 确保 vite.config.js 配置正确
3. 重新部署
```

### 问题 2: API 连接失败
```
原因: CORS 或环境变量错误
解决:
1. 检查浏览器错误信息
2. 验证 VITE_API_BASE_URL 是否正确
3. 确认后端 CORS_ORIGIN 包含前端 URL
4. 都检查无误后重新部署
```

### 问题 3: 数据库连接错误
```
原因: DATABASE_URL 错误或数据库未初始化
解决:
1. 验证 DATABASE_URL 环境变量
2. 确认数据库用户名密码正确
3. 检查防火墙/网络设置
4. 查看后端日志
```

### 问题 4: 登录失败
```
原因: JWT_SECRET 错误或密码加密不一致
解决:
1. 确认 JWT_SECRET 一致性
2. 尝试注册新账户
3. 检查数据库中的用户记录
```

### 查看部署日志

**后端日志**:
```
后端项目 → Deployments → [选择部署] → Logs
```

**前端日志**:
```
前端项目 → Deployments → [选择部署] → Logs
```

---

## 🎯 环境变量速查表

### 后端 (.env.production)
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<生成的密钥>
JWT_EXPIRE=7d
CORS_ORIGIN=https://expense-tracker-frontend.vercel.app
DATABASE_URL=<数据库连接字符串>
```

### 前端 (.env.production)
```bash
VITE_API_BASE_URL=https://expense-tracker-backend.vercel.app
VITE_APP_ENV=production
```

---

## ✅ 部署检查清单

- [ ] 代码已提交到 GitHub
- [ ] 后端 vercel.json 已创建
- [ ] 前端 vercel.json 已创建
- [ ] 后端项目已在 Vercel 创建
- [ ] 后端环境变量已配置
- [ ] 前端项目已在 Vercel 创建
- [ ] 前端环境变量已配置
- [ ] 后端可访问 API
- [ ] 前端可访问页面
- [ ] 前后端可以通信
- [ ] 功能测试通过

---

## 🌐 自定义域名（可选）

### 添加自定义域名

1. **进入 Vercel 项目**
2. **Settings** → **Domains**
3. **输入你的域名**
4. **按提示配置 DNS**

示例:
```
expense-tracker.yourdomain.com
api.expense-tracker.yourdomain.com
```

---

## 📊 性能监控

Vercel 提供的免费监控功能：

1. **Analytics** - 查看访问统计
2. **Error Tracking** - 捕获运行时错误
3. **Logs** - 实时日志查看
4. **Performance** - 性能指标

---

## 🔄 后续更新部署

### 自动部署
```
任何 git push 都会自动触发部署：
git add .
git commit -m "Update features"
git push origin main
# Vercel 自动开始部署
```

### 手动部署
```bash
# 使用 Vercel CLI
vercel --prod
```

---

## 🎓 学习资源

- Vercel 文档: https://vercel.com/docs
- Node.js 在 Vercel: https://vercel.com/docs/runtimes/nodejs
- Vite 部署: https://vitejs.dev/guide/static-deploy.html
- PostgreSQL 初始化: 在首次连接时需要运行数据库初始化脚本

---

## 💡 最佳实践

1. **使用环境变量** - 不要硬编码敏感信息
2. **定期备份** - 定期导出生产数据
3. **监控日志** - 定期检查错误日志
4. **版本控制** - 使用语义版本号标记部署
5. **测试** - 在生产前进行充分测试

---

**现在开始部署吧！** 🚀

如有问题，查看以下资源：
- Vercel 文档: https://vercel.com/docs
- GitHub Issues: 提交问题到你的仓库
- 本指南的排查部分
