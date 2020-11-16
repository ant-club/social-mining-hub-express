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
  "JWT_SECRET": "忽略",
  "JWT_ADMIN_SECRET": "忽略",
  "PAY_TOKEN": "忽略",
  "DOMAIN": "忽略",
  "ADAPTOR_CONFIG": {
    "适配器配置1": "value",
    "适配器配置2": "value"
  }
}
```

### 适配器配置
各适配器的配置，均加在`ADAPTOR_CONFIG`项中即可。

#### BlockNativeEthereumAdaptor

准备工作：
1. 实现一个router，用来作为`blocknative`的webhook，将feedback直接推到适配器中，参照`block_native_callback`实现。
2. 在`blocknative`注册账户，并将第1步中实现的webhook添加到`blocknative`中。
3. 进行如下配置

BlockNative以太坊配置

```json
{
  "ADAPTOR_CONFIG": {
    "BN_KEY": "BlockNative Apikey",
    "BN_URL": "https://api.blocknative.com/address",
    "BN_ETH_NETWORK": "ETH网络"
  }
}
```

## API

### 所有请求

所有请求需在`header`中带上`x-api-key`，值为服务的`apikey`。`apikey`的格式为`XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX`。

### 获得apikey

`POST` `/api/v1/utils/key.json`

Request:
```json
{
  "webhook": "http://you/callback"
}
```

Response: 200
```json
{
  "success": true,
    "data": {
      "webhook": "http://you/callback",
      "apikey": "XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX"
    }
}
```

**`请注意`**：此接口必须有调用限制，可以加参数限制或者必要的User验证。

### 监听一个地址

`POST` `/api/v1/monitor/task.json`

Request:
```json
{
  "address": "TESTaddress",
  "symbol": "ETH",
  "blockchain": "ethereum"
}
```

其中`symbol`和`blockchain`选择其一即可，主要是为了防止`symbol`重复。

如果在参数中加入`"test": true`，将立即返回，并用测试数据出发一次webhook。

Response: 200
```json
{
  "success": true,
  "data": {
    "address": "0x0000000",
    "type": "tx",
    "symbol": "ETH",
    "blockchain": "ethereum",
    "monitored": true
  }
}
```

### 获得回调的webhook

本服务回调的webhook正确返回如下：

```json
{
  "success": true
}
```

回调数据如下：

转账信息：

pending
```javascript
{
  task: {
    address: '0xc85ae8b98a2325e3a7a209a577c15eb9cd583701',
    type: 'tx',
    symbol: 'ETH',
    blockchain: 'ethereum',
    monitored: true,
    apikey: {
      webhook: 'http://webhook',
      apikey: 'XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX'
    }
  },
  tx: {
    address: '0xc85ae8b98a2325e3a7a209a577c15eb9cd583701',
    blockchain: 'ethereum',
    network: 'goerli',
    status: 'pending',
    hash: '0x22bf0d8347b77f622105581f6deba4a0511f2801bf2b8b5bc8b9429ee90ca1e2',
    from: '0xb6cb15ef5b6f35a08fb7374664fb43989d0d5aef',
    to: '0xc85ae8b98a2325e3a7a209a577c15eb9cd583701',
    blockNumber: null,
    asset: 'ETH',
    value: '4000000000000000',
    decimals: 18,
    direction: 'incoming'
  }
}
```

confirmed
```javascript
{
  task: {
    address: '0xc85ae8b98a2325e3a7a209a577c15eb9cd583701',
    type: 'tx',
    symbol: 'ETH',
    blockchain: 'ethereum',
    monitored: true,
    apikey: {
      webhook: 'http://webhook',
      apikey: 'XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX'
    }
  },
  tx: {
    address: '0xc85ae8b98a2325e3a7a209a577c15eb9cd583701',
    blockchain: 'ethereum',
    network: 'goerli',
    status: 'confirmed',
    hash: '0x22bf0d8347b77f622105581f6deba4a0511f2801bf2b8b5bc8b9429ee90ca1e2',
    from: '0xb6cb15ef5b6f35a08fb7374664fb43989d0d5aef',
    to: '0xc85ae8b98a2325e3a7a209a577c15eb9cd583701',
    blockNumber: 3623189,
    asset: 'ETH',
    value: '4000000000000000',
    decimals: 18,
    direction: 'incoming'
  }
}
```

ERC20等token转账会在`tx`数据中多出`contractAddress`和`contractType`字段。

* 转账数量是`value / 10^decimals`。
* erc20代币要准确对应`contractAddress`来确保没有同样Symbol的代币混进来。
* `direction`参数表示对于`address`是转入还是转出，分别为`incoming`和`outgoing`，所以可以通过`outgoing`做警告。
