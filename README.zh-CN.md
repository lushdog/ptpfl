# PTP免费种子下载

一个自动下载ptp免费种子的nodejs程序.

### 安装

依赖nodejs环境, 推荐使用nvm安装。

`wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash`
`source .profile`

然后安装nodejs

`nvm install stable`

安装pm2

`npm install pm2 -g`

下载代码

`git clone https://github.com/lushdog/ptpfl.git`

进入到ptpfl目录下, 安装依赖

`npm install`

修改配置文件: 复制`example.config.json`为`config.json`, 填上你的apiUser和apiKey(ptp网站edit-security)

### 运行(ptpfl目录下)

`pm2 start index.js --name "myapp"`

### 查看日志

`pm2 log myapp`

### 暂停

`pm2 stop myapp`

### 重启

`pm2 restart myapp`

### Discord 通知

需要在下载种子时收到通知的可以填上discordWebhookUrl, discord使用方法可以google

### 配置说明

```javascript
{
  "apiUser": "", // apiUser.
  "apiKey": "", // apiKey.
  "minseeders": -1, // 最少做种数. -1表示无限制.
  "maxseeders": -1, // 最大做种数. -1表示无限制.
  "minleechers": -1, // 最少下载数. -1表示无限制.
  "maxleechers": -1, // 最大下载数. -1表示无限制.
  "minsize": -1, // 种子最小大小（单位mb）. -1表示无限制.
  "maxsize": -1, // 种子最大大小（单位mb）. -1表示无限制.
  "maxAge": -1, // 种子上传最大时间（单位分钟）.
  "downloadPath": "/watch", // 下载软件的监控文件夹路径，种子文件下载到这里.(如果用docker启动请填'/watch')
  "discordWebhookUrl": "", // Discord机器人url, 可选.
  "interval": 15,// 运行间隔时间. 实测一个小时超过20次管理员有可能会发私信要求调整！！，所以不要设置低于3.
  "GoldenPopcorn": true, // 是否下载金种（会忽略所有其他条件）.
  "page": 1, // 爬的页数，50个种子为一页，有时候免费种子会超过一页。 爬取多页会重复调用ptp的api. 实测一个小时调用超过20次管理员有可能会发私信要求调整
  "matchByAgeAndMaxSeeders": [
    { "maxAge": 600, "maxSeeders": 5 },
    { "maxAge": 1200, "maxSeeders": 2 }
  ] // 见 上传时间和做种人数组合筛选
}
```

#### 上传时间和做种人数组合筛选

根据上传时间和做种人数组合筛选，因为有很多很老的种子加为免费种，做种人数很少，也有刷的价值。上边例子的过滤为: 上传10个小时以内，做种小于5; 上传20个小时以内, 做种小于5; 可以根据自己情况调整。

