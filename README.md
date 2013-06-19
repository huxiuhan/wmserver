未名世界
====

未名世界是一个基于LBS的移动网络游戏，这是它的后台部分。
using [pomelo](https://github.com/NetEase/pomelo) and NodeJS.

###配置

- 安装node.js(>=0.8)，推荐使用nvm(node version manager)安装。
- 使用npm安装pomelo(0.4)，`npm install pomelo -g`
- 在项目文件夹下使用`sh npm-install.sh`命令进行依赖包安装。

###运行

在game-server文件夹下使用`pomelo start`命令启动服务器。

###数据生成(seeding)

在shared文件夹下依次运行`node seeds.js`与`node seeds-mission.js`即可

###测试

使用web版的简单客户端可以进行测试，进入web-server文件夹下运行`node app.js`可以开启web服务器，访问[http://0.0.0.0:3001](#)即可进行功能测试，并且附带有部分自动化单元测试。

###更改设置

在进行以上操作时，有可能涉及到对服务器端口、地址的修改。对于game-server，都可以在game-server/config/servers.json下面找到。对于web-server，可以在web-server/public/js/client.js下面找到相应的修改位置。
