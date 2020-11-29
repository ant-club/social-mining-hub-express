# 链上监控服务

本项目提供一种聚合型的多链异动监控转发服务。

## 配置

```json
{
  "NODE_ENV": "环境, DEV|PROD",
  "PORT": "服务端口",
  "DB_HOST": "数据库地址",
  "DB_NAME": "数据库名",
  "DB_USER": "数据库用户名",
  "DB_PASS": "数据库密码",
  "COOKIE_SECRET": "cookie密钥",
  "COOKIE_PREFIX": "cookie前缀",
  "UPLOAD_DIST": "上传文件本地地址",
  "UPLOAD_STATIC_PATH": "上传静态链接地址",
  "STATIC_HASH": "前端静态文件hash版本",

  "PASSPORT": {
    "FACEBOOK_APP_ID": "",
    "FACEBOOK_APP_SECRET": "",
    "FACEBOOK_CALLBACK_URL": "",
    "GITHUB_CLIENT_ID": "",
    "GITHUB_CLIENT_SECRET": "",
    "GITHUB_CALLBACK_URL": "",
    "YOUTUBE_CLIENT_ID": "",
    "YOUTUBE_CLIENT_SECRET": "",
    "YOUTUBE_CALLBACK_URL": "",
    "GOOGLE_CLIENT_ID": "",
    "GOOGLE_CLIENT_SECRET": "",
    "GOOGLE_CALLBACK_URL": "",
    "TELEGRAM_BOT_TOKEN": ""
  }
}
```

`PASSPORT`部分见`/docs/passport`。
