# telegram passport

## 开通

在telegram里，跟@BotFather对话，创建一个新的机器人，并且获得token。

创建一个承载页，用于承载telegram的embed按钮，见`view/auth_telegram.ejs`。

## 配置

```json
{
  "PASSPORT": {
    "TELEGRAM_BOT_TOKEN": "token"
  }
}
```
