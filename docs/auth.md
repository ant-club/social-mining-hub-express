# 鉴权管理

## cookie解析

用户完成钱包登录后（或时），通过鉴权API获得cookie，cookie键为`{COOKIE_PREFIX}_auth_address`，此cookie用于其他各类需要跨接口传递信息的逻辑。
