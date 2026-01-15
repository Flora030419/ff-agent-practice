#!/bin/bash

# 记账应用 - 一键启动脚本

echo "🚀 记账应用启动向导"
echo "================================"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

echo "✅ Node.js 已安装"

# 初始化后端
echo ""
echo "📦 安装后端依赖..."
cd backend
npm install

echo ""
echo "🗄️ 初始化数据库..."
npm run init-db

echo ""
echo "🚀 启动后端服务..."
npm run dev &
BACKEND_PID=$!

# 初始化前端
echo ""
echo "📦 安装前端依赖..."
cd ../frontend
npm install

echo ""
echo "🎨 启动前端应用..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "✅ 应用已启动！"
echo ""
echo "📍 前端: http://localhost:5173"
echo "📍 后端: http://localhost:3000"
echo ""
echo "🔑 默认测试账户:"
echo "   用户名: 任意"
echo "   密码: 任意"
echo ""
echo "⏹️  按 Ctrl+C 停止应用"
echo "================================"

# 等待进程
wait $BACKEND_PID $FRONTEND_PID
