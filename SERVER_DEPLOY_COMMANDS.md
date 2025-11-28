# 服务器部署命令

## 在服务器上执行以下命令：

```bash
cd /www/wwwroot/led-calculator-api

# 上传新文件（update-api-urls.sh 和 restore-local-urls.sh）
# 可以通过 Git 或 FTP 上传

# 给脚本添加执行权限
chmod +x update-api-urls.sh restore-local-urls.sh

# 更新 API URL 为生产环境
bash update-api-urls.sh

# 重启应用（如果需要）
pm2 restart led_calculator_api
```

## 说明

- **update-api-urls.sh**: 将所有 `localhost:3001` 替换为 `https://led-api.unilumin-gtm.com`
- **restore-local-urls.sh**: 恢复为本地开发环境的 URL（在本地开发时使用）

## 使用场景

### 部署到生产环境
```bash
bash update-api-urls.sh
```

### 恢复本地开发环境
```bash
bash restore-local-urls.sh
```

## 自动化部署

如果使用 Git 部署，可以在 `.git/hooks/post-merge` 中添加：

```bash
#!/bin/bash
if [ -f "update-api-urls.sh" ]; then
    bash update-api-urls.sh
fi
```

这样每次 `git pull` 后会自动更新 URL。
