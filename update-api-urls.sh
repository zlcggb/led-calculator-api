#!/bin/bash

# 更新 API URL 脚本
# 用于在部署到生产环境时，将文档中的 localhost 替换为实际域名

PRODUCTION_DOMAIN="https://led-api.unilumin-gtm.com"

echo "======================================"
echo "更新 API 文档中的域名"
echo "======================================"

# 备份原文件
cp api-reference.html api-reference.html.backup
cp test-page.html test-page.html.backup

echo "✓ 已备份原文件"

# 替换 api-reference.html 中的 localhost
sed -i "s|http://localhost:3001|${PRODUCTION_DOMAIN}|g" api-reference.html
sed -i "s|https://YOUR_DOMAIN|${PRODUCTION_DOMAIN}|g" api-reference.html
sed -i "s|YOUR_DOMAIN|led-api.unilumin-gtm.com|g" api-reference.html

echo "✓ 已更新 api-reference.html"

# 替换 test-page.html 中的 apiBaseUrl
sed -i "s|let apiBaseUrl = .*|let apiBaseUrl = '${PRODUCTION_DOMAIN}';|g" test-page.html

echo "✓ 已更新 test-page.html"

echo ""
echo "======================================"
echo "更新完成！"
echo "======================================"
echo "生产域名: ${PRODUCTION_DOMAIN}"
echo ""
echo "如需恢复本地开发环境，运行:"
echo "  bash restore-local-urls.sh"
echo ""
