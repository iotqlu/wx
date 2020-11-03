---
sort: 1
---

## 服务端应用开发

本次实验使用 NodeJS 实现服务端功能实现，并连接 MySQL 数据库，从数据库中读取数据，通过 API 接品返回数据。

### 安装 NodeJS

#### Windows

可以从 NodeJS 官方网站 [https://nodejs.org](https://nodejs.org) 下载 [Windows 版本的安装包](https://nodejs.org/en/#home-downloadhead)，安装 NodeJS。

#### MacOS

可以从 NodeJS 官方网站 [https://nodejs.org](https://nodejs.org) 下载 [MacOS 版本的安装包](https://nodejs.org/en/#home-downloadhead)，安装 NodeJS。

或者，可以使用下面的脚本通过 Bash 下载安装包：

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

其它备选方案：

- 使用[Homebrew](https://brew.sh)

```bash
brew install node
```

- 使用[MacPorts](https://www.macports.org/):

```bash
port install nodejs<major version>

# Example
port install nodejs7
```

#### Linux

针对基于 Debian 和 Ubuntu 的 Linux 发行版本，Node.js 的安装文件可以从 [NodeSource](https://github.com/nodesource/distributions/blob/master/README.md) 下载。

````tip
Node.js 安装完成后，可以通过以下命令验证 Node.js 是否安装成功。

```bash
node -v
```

如果 Node.js 安装成功，上面的命令应该返回 Node.js 的版本号，如：`v15.0.1`。

````

### 创建 Node.js 应用

#### 创建工程目录

如：wx_iot。

```bash
mkdir wx_iot
cd wx_iot
```

#### 初始化工程

使用以下命令初始化工程目录。

```bash
npm init
```

可以选填相关配置项，或者直接按回车键(⮐)选择默认值，最后输入`yes`确认。

```tip
可以使用`tree`命令查看目录结构。

可以看到目录中自动生成了一个`package.json`文件。
```

```console
$ tree
.
└── package.json

0 directories, 1 file
```

#### Hello World 示例

在`wx_iot`目录下创建`index.js`文件，输入下面的代码。

```js
console.log("Hello World!");
```

使用`node`命令执行`index.js`文件

```console
$ node index.js
Hello World!
```

```tip
如果`node index.js`命令能正确的输出`Hello World!`，说明`node`开发环境配置正常。
```

#### 安装 Express

使用 `npm` 命令安装 `express` 库，并添加到依赖列表中。

```sh
npm install express --save
```

以上命令如果执行成功，会在`package.json`文件 `dependencies`对应的值中，自动添加一行记录，如：`"express": "^4.17.1"`。

```tip
在`wx_iot`目录中第一次执行`npm install package`命令后，在`wx_iot`目录中会自动生成`node_modules`目录用于存放工程依赖的库文件。
```

#### Express 实现 Hello World

修改`index.js`文件:

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

使用`node`命令运行`index.js`文件，打印以下信息说明`Express`服务成功启动，并监听`3000`端口；访问根目录(`/`)或路由，应用会返回`Hello World!`，访问其它路径，应用会返回`404 Not Found`错误。

```console
$ node index.js
Example app listening at http://localhost:3000
```

使用浏览器访问 [http:localhost:3000](http://localhost:3000)，会显示打印`Hello World!`的页面。

### 实现 REST API

#### 添加测试数据

在`index.js`文件中添加静态测试数据。

```javascript
...
const port = 3000;
/* 注意代码添加的位置 */
const metrics = [
  {
    instance: "192.168.0.111",
    metric_type: "cpu_usage",
    value: 0.98,
    created_at: "2020-10-10 00:00:01",
  },
  {
    instance: "192.168.0.111",
    metric_type: "cpu_usage",
    value: 0.88,
    created_at: "2020-10-10 00:01:01",
  },
  {
    instance: "192.168.0.111",
    metric_type: "cpu_usage",
    value: 0.77,
    created_at: "2020-10-10 00:02:01",
  },
];
/* 注意代码添加的位置 */
app.get("/", (req, res) => {
...
```

测试数据字段描述如下：

| 字段        | 描述         |
| :---------- | :----------- |
| instance    | 主机 ID      |
| metric_type | 指标         |
| value       | 指标值       |
| created_at  | 指标采集时间 |

#### 实现 GET `/metrics` API

实现`GET`方式获取`metrics`数据的方法，路由路径为：`/metrics`。

```javascript
app.get("/metrics", (req, res) => {
  res.send(metrics);
});
```

#### 测试 GET `/metrics` API

使用`ctrl+c`退出`node index.js`启动的服务，再次执行`node index.js`命令启动服务，确保修改生效。

使用浏览器访问 [http://localhost:3000/metrics](http://localhost:3000/metrics)，会返回 JSON 格式的 metrics 数据。

```console
[{"instance":"192.168.0.111","metric_type":"cpu_usage","value":0.98,"created_at":"2020-10-10 00:00:01"},
{"instance":"192.168.0.111","metric_type":"cpu_usage","value":0.88,"created_at":"2020-10-10 00:01:01"},
{"instance":"192.168.0.111","metric_type":"cpu_usage","value":0.77,"created_at":"2020-10-10 00:02:01"}]
```

### 安装 MySQL 8

#### 在 Windows 操作系统上安装 MySQL 8

在 Windows 操作系统上安装 MySQL8 推荐的也是最简单的方法是，下载并安装 Windows 版本的安装文件，然后配置 MySQL 服务器。

- 从 [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)下载并执行安装文件。

```note
web-community版本的安装文件体积小，未捆绑任何MySQL应用程序，只下载安装你选择的MySQL产品，跟标准版本的安装文件有所不同。

```

- 选择 MySQL 产品的安装类型。有以下选项可供选择：

  - 开发者（默认项）：提供了一种安装类型，包括：指定版本的 MySQL 服务器；其它与 MySQL 开发相关的工具，如 MySQL Workbench。
  - 服务器：仅安装指定版本的 MySQL 服务器，不安装其它产品。
  - 定制：允许用户指定任意版本的 MySQL 服务器和其它产品。

- 安装 MySQL 服务实例（或产品），然后选择以下一个可用性级别为服务实例进行服务配置。

  - 独立 MySQL 服务或者经典 MySQL 备份服务（默认项）：适用于不需要高可用性的服务实例配置。
  - InnoDB 集群：这个选项基于 MySQL 组备份策略提供了两种配置选项：
    - 在本机的沙盒 InnoDB 集群中配置多个服务实例（仅适用于测试）
    - 创建一个 InnoDB 集群并且配置一个种子实例，或者，在已有的 InnoDB 集群中添加一个新的服务实例

- 安装屏幕提示完成安装过程。

```note
在以上安装过程中，直接选择默认项（开发者模式，独立 MySQL 服务或者经典 MySQL 备份服务），能够满足大多数开发环境需求。
```

```note
如果在安装过程中，将mysql配置为系统服务，那么系统重启后会自动启动mysql服务。
```

#### 在 MacOS 操作系统上安装 MySQL

下载安装 MacOS 版本的安装文件，或使用`brew install mysql`命令安装。

### 创建数据库 wx_iot

#### 连接和断开 MySQL

MySQL8 安装成功后，可以在命令行终端中使用`mysql -h host -u user -p`命令连接 MySQL 服务。

```shell
shell> mysql -h 127.0.0.1 -u root -p
Enter password: ********
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 25338 to server version: 8.0.24-standard

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql>
```

host 和 user 分别表示 MySQL 服务运行的主机名和 MySQL 账号的用户名(默认为：root)，如果是连接本机 MySQL 服务，可以省略`-h`参数，直接使用`mysql -u user -p`连接 MySQL 连接即可。

```tip
本机mysql服务的root账号，默认密码可能为空，直接回车(⮐)即可。
```

MySQL 连接成功后，可以随时使用`quit`或`\q`命令断开连接。

```shell
mysql>quit
Bye
```

#### 创建库和用户

连接 MySQL，使用`create database`命令创建数据库，`wx_iot`是本次实验选择使用的数据库名。

```shell
mysql> CREATE DATABASE wx_iot;
```

创建用户`wx_iot`，密码默认为`yoursecretpassword`。

```shell
mysql> CREATE USER `wx_iot`@`localhost` IDENTIFIED WITH mysql_native_password BY 'yoursecretpassword';
```

```warning
MySQL 8版本默认使用了一种新的授权插件，叫[caching_sha2_password](https://dev.mysql.com/doc/refman/8.0/en/sha256-pluggable-authentication.html)，对比MySQL 5.7版本默认使用的是另一种，叫[mysql_native_password](https://dev.mysql.com/doc/refman/5.7/en/native-pluggable-authentication.html)。目前[Node.js社区](https://npmjs.org)的mysql驱动尚未兼容MySQL 8的`caching_sha2_password`授权插件，所以本次实验在创建用户时需要指定使用`mysql_native_password`授权插件。
```

授权用户 wx_iot 访问数据库 wx_iot。

```shell
mysql> grant all on wx_iot.* to 'wx_iot'@'localhost';
```

现在可以使用`quit`或`\q`命令退出当前连接，然后使用`mysql -u wx_iot -p`命令切换用户连接 mysql。

### 初始化表结构

选择使用 wx_iot 数据库。

```shell
mysql> USE wx_iot;
Database changed
```

使用下面的 SQL 语句创建表`metrics`。

```sql
CREATE TABLE `wx_iot`.`metrics`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `instance` varchar(255) NULL,
  `metric_type` varchar(255) NULL,
  `value` float NULL,
  `created_at` timestamp NULL,
  PRIMARY KEY (`id`)
);
```

或使用 MySQL Workbench 工具连接数据库并创建表。

### 导入测试数据

可以使用下面的 SQL 语句添加测试数据。

```shell
mysql> INSERT INTO metrics
       VALUES (1, '192.168.0.111', 'cpu_usage', 0.98, '2020-10-10 00:00:01'),
       (2, '192.168.0.111', 'cpu_usage', 0.88, '2020-10-10 00:01:01'),
       (3, '192.168.0.111', 'cpu_usage', 0.77, '2020-10-10 00:02:01');
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0
```

或使用 MySQL Workbench 工具添加数据。

### 在 Node.js 工程中连接 MySQL 数据库

#### 安装 mysql 依赖库

使用`npm install mysql`命令添加`mysql`库

```shell
npm install mysql
```

添加成功后，`package.json`文件中会添加`mysql`依赖库。

```
"dependencies": {
    "express": "^4.17.1",
    "mysql": "^2.18.1"
  }
```

#### 引用 mysql 库

在`index.js`文件中添加`mysql`变量声明。

```javascript
const express = require("express");
/* 注意代码添加的位置 */
const mysql = require("mysql");
```

#### 修改 GET `\metrics` API 方法，从 mysql 数据库中获取数据

创建 mysql 连接

```javascript
app.get("/metrics", (req, res) => {
  /* 注意代码添加的位置 */
  var connection = mysql.createConnection({
    host: "localhost",
    user: "wx_iot",
    password: "yoursecretpassword",
    database: "wx_iot",
  });
  /* 注意代码添加的位置 */
  res.send(metrics);
});
```

删除`index.js`中原有`metrics`变量声明，获取`metrics`表数据并返回。

```javascript
app.get("/metrics", (req, res) => {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "wx_iot",
    password: "yoursecretpassword",
    database: "wx_iot",
  });
  connection.connect();

  /* 注意代码添加的位置 */
  var metrics = [];

  connection.query("SELECT * FROM metrics", function (error, results, fields) {
    if (error) throw error;
    results.forEach((result) => {
      metrics.push({
        id: result.id,
        instance: result.instance,
        metric_type: result.metric_type,
        value: result.value,
        created_at: result.created_at,
      });
    });
    res.send(metrics);
  });

  connection.end();
  /* 注意代码添加的位置 */
});
```

代码讲解：

`connection.connect();`创建 mysql 数据库的连接，在数据库操作完成后一定要使用`connection.end();`断开连接。

`connection.query()`方法接受两个参数，第一个参数是要执行的 sql 语句，在本例中是`SELECT * FROM metrics`，表示从`metrics`表中取出全部数据；第二参数是回调方法，即执行完 sql 语句后调用的方法，回调方法有三个参数，第一个是错误信息，第二个是返回的数组类型的数据集结果，第三个是数据集对应的字段。

`results.forEach(t=>{})`方法可以遍历返回的数据集，保存到`metrics`变量中。

`res.send(metrics);`方法返回`metrics`变量数据。

```warning
`connection.query()`方法的执行是异步操作，所以`res.send(metrics);`方法必须放在`connection.query()`方法的回调方法中执行，
```

最终修改后的`index.js`文件代码如下所示：

```javascript
const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/metrics", (req, res) => {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "wx_iot",
    password: "yoursecretpassword",
    database: "wx_iot",
  });
  connection.connect();

  var metrics = [];

  connection.query("SELECT * FROM metrics", function (error, results, fields) {
    if (error) throw error;
    results.forEach((result) => {
      metrics.push({
        id: result.id,
        instance: result.instance,
        metric_type: result.metric_type,
        value: result.value,
        created_at: result.created_at,
      });
    });
    res.send(metrics);
  });

  connection.end();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

使用`ctrl+c`和`node index.js`命令重启 node.js 服务，在浏览器中访问[http://localhost:3000/metrics](http://localhost:3000/metrics)，验证返回结果。

```warning
如果在执行过程中，如果你遇到以下错误信息：

code: 'ER_NOT_SUPPORTED_AUTH_MODE',

errno: 1251,

sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',

说明 wx_iot 用户使用的授权方法(如：`caching_sha2_password`)与 node.js 不兼容，解决办法：

使用 root 用户连接 mysql，然后修改 wx_iot 用户的授权方法为 mysql_native_password。

shell> mysql -u root -p

mysql> ALTER USER \`wx_iot\`@\`localhost\` IDENTIFIED WITH mysql_native_password;

```

```tip
更详细的mysql库的使用说明请参考 [https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql)
```
