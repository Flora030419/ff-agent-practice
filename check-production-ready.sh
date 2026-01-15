#!/bin/bash

# 🔍 生产环境配置检查脚本

echo "================================"
echo "🔍 生产环境配置检查"
echo "================================"
echo ""

# 检查目录结构
echo "📂 检查项目结构..."
echo ""

# 后端检查
echo "🔹 后端配置检查:"
if [ -f "backend/.env.production" ]; then
    echo "  ✅ backend/.env.production 存在"
else
    echo "  ❌ backend/.env.production 不存在"
fi

if [ -f "backend/vercel.json" ]; then
    echo "  ✅ backend/vercel.json 存在"
else
    echo "  ❌ backend/vercel.json 不存在"
fi

if [ -f "backend/package.json" ]; then
    echo "  ✅ backend/package.json 存在"
    # 检查启动脚本
    if grep -q '"start"' backend/package.json; then
        echo "  ✅ package.json 中有 start 脚本"
    else
        echo "  ⚠️  package.json 中没有 start 脚本"
    fi
else
    echo "  ❌ backend/package.json 不存在"
fi

echo ""

# 前端检查
echo "🔹 前端配置检查:"
if [ -f "frontend/.env.production" ]; then
    echo "  ✅ frontend/.env.production 存在"
else
    echo "  ❌ frontend/.env.production 不存在"
fi

if [ -f "frontend/vercel.json" ]; then
    echo "  ✅ frontend/vercel.json 存在"
else
    echo "  ❌ frontend/vercel.json 不存在"
fi

if [ -f "frontend/vite.config.js" ]; then
    echo "  ✅ frontend/vite.config.js 存在"
else
    echo "  ❌ frontend/vite.config.js 不存在"
fi

echo ""

# 文档检查
echo "🔹 文档检查:"
[ -f "PRODUCTION_DEPLOYMENT.md" ] && echo "  ✅ PRODUCTION_DEPLOYMENT.md" || echo "  ❌ PRODUCTION_DEPLOYMENT.md"
[ -f "VERCEL_DEPLOYMENT_GUIDE.md" ] && echo "  ✅ VERCEL_DEPLOYMENT_GUIDE.md" || echo "  ❌ VERCEL_DEPLOYMENT_GUIDE.md"
[ -f "DEPLOYMENT_QUICK_REFERENCE.md" ] && echo "  ✅ DEPLOYMENT_QUICK_REFERENCE.md" || echo "  ❌ DEPLOYMENT_QUICK_REFERENCE.md"

echo ""

# Git 检查
echo "🔹 Git 配置检查:"
if [ -d ".git" ]; then
    echo "  ✅ Git 仓库存在"
    if git remote -v | grep -q 'origin'; then
        echo "  ✅ 远程仓库 'origin' 已配置"
        echo "    $(git remote -v | head -1)"
    else
        echo "  ❌ 远程仓库 'origin' 未配置"
    fi
else
    echo "  ❌ 不是 Git 仓库，请运行: git init && git remote add origin <url>"
fi

echo ""

# 环境变量检查
echo "🔹 环境变量检查:"
echo ""
echo "  后端 (.env.production):"
if [ -f "backend/.env.production" ]; then
    grep -E "^[A-Z_]+" backend/.env.production | while read line; do
        key=$(echo "$line" | cut -d= -f1)
        echo "    - $key"
    done
else
    echo "    ⚠️  文件不存在"
fi

echo ""
echo "  前端 (.env.production):"
if [ -f "frontend/.env.production" ]; then
    grep -E "^VITE_|^APP_" frontend/.env.production | while read line; do
        key=$(echo "$line" | cut -d= -f1)
        echo "    - $key"
    done
else
    echo "    ⚠️  文件不存在"
fi

echo ""

# 部署前检查清单
echo "================================"
echo "📋 部署前检查清单"
echo "================================"
echo ""

echo "开发环境准备:"
[ -f "backend/.env" ] && echo "  ✅ backend/.env 存在" || echo "  ⚠️  backend/.env (可选)"
[ -f "frontend/.env" ] && echo "  ✅ frontend/.env 存在" || echo "  ⚠️  frontend/.env (可选)"

echo ""
echo "生产环境准备:"
[ -f "backend/.env.production" ] && echo "  ✅ backend/.env.production 存在" || echo "  ❌ backend/.env.production 缺失"
[ -f "backend/vercel.json" ] && echo "  ✅ backend/vercel.json 存在" || echo "  ❌ backend/vercel.json 缺失"
[ -f "frontend/.env.production" ] && echo "  ✅ frontend/.env.production 存在" || echo "  ❌ frontend/.env.production 缺失"
[ -f "frontend/vercel.json" ] && echo "  ✅ frontend/vercel.json 存在" || echo "  ❌ frontend/vercel.json 缺失"

echo ""
echo "代码管理:"
if [ -d ".git" ]; then
    echo "  ✅ Git 仓库已初始化"
    changes=$(git status --porcelain | wc -l)
    if [ $changes -eq 0 ]; then
        echo "  ✅ 所有变更已提交"
    else
        echo "  ⚠️  有 $changes 个文件未提交"
        echo "     运行: git add . && git commit -m 'Production ready' && git push"
    fi
else
    echo "  ❌ Git 仓库未初始化"
    echo "     运行: git init && git remote add origin <url>"
fi

echo ""
echo "================================"
echo "✅ 检查完成！"
echo "================================"
echo ""
echo "📖 相关文档:"
echo "  - PRODUCTION_DEPLOYMENT.md       配置详解"
echo "  - VERCEL_DEPLOYMENT_GUIDE.md     部署教程"
echo "  - DEPLOYMENT_QUICK_REFERENCE.md  快速参考"
echo ""
echo "🚀 下一步:"
echo "  1. 确保所有检查项都是 ✅"
echo "  2. 提交代码到 GitHub"
echo "  3. 访问 https://vercel.com 创建项目"
echo "  4. 按 VERCEL_DEPLOYMENT_GUIDE.md 进行部署"
echo ""
