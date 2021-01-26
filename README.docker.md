# 使用docker运行

首先新建配置文件config.json, 将example.config.json模版的配置复制进去然后修改
### 运行
`yourconfig`是配置文件的路径，`yourwatch`是下载软件监控文件夹

```bash
docker run --name ptpfl -d -v /yourconfig:/config -v /yourwatch:/watch trancelife/ptpfl
```

### 进入容器

```bash
docker exec -it ptpfl /bin/sh 
```
### 查看日志

```bash
 docker logs ptpfl -f
```
