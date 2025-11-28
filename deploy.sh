#!/bin/bash

# LED Calculator API 部署脚本
# 用于快速部署和更新应用

set -e

echo "======================================"
echo "LED Calculator API 部署脚本"
echo "======================================"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}错误: 未找到 Node.js，请先安装 Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: 未找到 npm${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm 版本: $(npm -v)${NC}"

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}警告: 未找到 PM2，正在安装...${NC}"
    npm install -g pm2
fi

echo -e "${GREEN}✓ PM2 已安装${NC}"

# 安装依赖
echo ""
echo "======================================"
echo "1. 安装项目依赖..."
echo "======================================"
npm install

# 更新 API URL 为生产环境
echo ""
echo "======================================"
echo "2. 更新 API URL..."
echo "======================================"
bash update-api-urls.sh

# 构建项目
echo ""
echo "======================================"
echo "3. 构建项目..."
echo "======================================"
npm run build

# 创建日志目录
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo -e "${GREEN}✓ 创建日志目录${NC}"
fi

# 检查是否已经在运行
if pm2 list | grep -q "led-calculator-api"; then
    echo ""
    echo "======================================"
    echo "4. 重启应用..."
    echo "======================================"
    pm2 restart led-calculator-api
    echo -e "${GREEN}✓ 应用已重启${NC}"
else
    echo ""
    echo "======================================"
    echo "4. 启动应用..."
    echo "======================================"
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "${GREEN}✓ 应用已启动${NC}"
fi

# 显示状态
echo ""
echo "======================================"
echo "部署完成！"
echo "======================================"
pm2 status

echo ""
echo -e "${GREEN}应用信息：${NC}"
echo "- 应用名称: led-calculator-api"
echo "- 运行端口: 3001"
echo "- 健康检查: http://localhost:3001/health"
echo "- API 文档: http://localhost:3001/docs"
echo ""
echo -e "${YELLOW}常用命令：${NC}"
echo "- 查看日志: pm2 logs led-calculator-api"
echo "- 重启应用: pm2 restart led-calculator-api"
echo "- 停止应用: pm2 stop led-calculator-api"
echo "- 查看状态: pm2 status"
echo ""
