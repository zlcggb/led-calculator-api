#!/bin/bash

# 恢复本地开发环境的 API URL

LOCAL_URL="http://localhost:3001"

echo "======================================"
echo "恢复本地开发环境 URL"
echo "======================================"

# 如果有备份文件，直接恢复
if [ -f "api-reference.html.backup" ]; then
    cp api-reference.html.backup api-reference.html
    echo "✓ 已从备份恢复 api-reference.html"
else
    # 否则手动替换
    sed -i "s|https://led-api.unilumin-gtm.com|${LOCAL_URL}|g" api-reference.html
    echo "✓ 已更新 api-reference.html"
fi

if [ -f "test-page.html.backup" ]; then
    cp test-page.html.backup test-page.html
    echo "✓ 已从备份恢复 test-page.html"
else
    sed -i "s|let apiBaseUrl = .*|let apiBaseUrl = '${LOCAL_URL}';|g" test-page.html
    echo "✓ 已更新 test-page.html"
fi

echo ""
echo "======================================"
echo "恢复完成！"
echo "======================================"
echo "本地开发 URL: ${LOCAL_URL}"
echo ""
