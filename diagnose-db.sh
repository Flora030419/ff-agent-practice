#!/bin/bash

echo "🔍 数据库诊断脚本"
echo "=================================="
echo ""

# 检查数据库文件位置
echo "📁 数据库文件位置:"
echo "   /workspaces/ff-agent-practice/expense-tracker/data/expense_tracker.db"
echo ""

echo "✅ 检查数据库目录是否存在:"
if [ -d "/workspaces/ff-agent-practice/expense-tracker/data" ]; then
    echo "   ✓ data 目录存在"
else
    echo "   ✗ data 目录不存在"
fi
echo ""

echo "📄 检查数据库文件是否存在:"
if [ -f "/workspaces/ff-agent-practice/expense-tracker/data/expense_tracker.db" ]; then
    echo "   ✓ expense_tracker.db 文件存在"
    echo "   文件大小: $(ls -lh /workspaces/ff-agent-practice/expense-tracker/data/expense_tracker.db | awk '{print $5}')"
else
    echo "   ✗ expense_tracker.db 文件不存在"
    echo "   需要运行 npm run init-db 来初始化数据库"
fi
echo ""

echo "📊 目录内容:"
ls -la /workspaces/ff-agent-practice/expense-tracker/data/ 2>/dev/null || echo "   data 目录不存在或为空"
echo ""

echo "=================================="
echo "📝 修复步骤:"
echo ""
echo "1. 确保已修复 backend/src/utils/db.js"
echo "2. 运行初始化数据库:"
echo "   cd /workspaces/ff-agent-practice/expense-tracker/backend"
echo "   npm run init-db"
echo ""
echo "3. 然后启动后端:"
echo "   npm run dev"
echo ""

echo "=================================="
echo "🔗 有用的 SQLite 命令:"
echo ""
echo "# 查看所有表"
echo "sqlite3 /workspaces/ff-agent-practice/expense-tracker/data/expense_tracker.db '.tables'"
echo ""
echo "# 查看表结构"
echo "sqlite3 /workspaces/ff-agent-practice/expense-tracker/data/expense_tracker.db '.schema users'"
echo ""
echo "# 查询数据"
echo "sqlite3 /workspaces/ff-agent-practice/expense-tracker/data/expense_tracker.db 'SELECT * FROM users;'"
echo ""
