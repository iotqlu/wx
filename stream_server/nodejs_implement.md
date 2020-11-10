# 使用 nodejs 实现文件下载的 Stream Server

## 创建 nodejs 工程

使用以下命令初始化 nodejs 工程, 工程参数使用默认即可.

```shell
mkdir stream-server
cd steam-server
npm init
```

## content-type 列表

下载 [`content_type_map.json`](../assets/code/stream-server/content_type_map.json) 文件, 保存到工程根目录下.

## index.js 实现 stream server

下载 [`index.js`](../assets/code/stream-server/index.js)文件, 覆盖或保存到工程根目录下.

或

复制以下代码,保存到`index.js`文件中.

```java
const http = require("http");
const url = require("url");
const port = process.env.PORT || 3000;

const { stat, createReadStream, existsSync,readFileSync } = require("fs");
const { promisify } = require("util");
const { pipeline } = require("stream");
const content_type_map = JSON.parse(readFileSync('content_type_map.json', 'utf-8'));

const fileInfo = promisify(stat);

http
  .createServer(async (req, res) => {

    var rs = req.url.match(/\/(.+\..+)/);

    var path = rs[1];
    try {
        if (existsSync(path)) {
          /** Calculate Size of file */
            const { size } = await fileInfo(path);
            const range = req.headers.range;
            console.log(path.match(/.+(\..+)/)[1])
            const content_type = content_type_map[path.match(/.+(\..+)/)[1]];

            /** Check for Range header */
            if (range) {
            /** Extracting Start and End value from Range Header */
            let [start, end] = range.replace(/bytes=/, "").split("-");
            start = parseInt(start, 10);
            end = end ? parseInt(end, 10) : size - 1;

            if (!isNaN(start) && isNaN(end)) {
                start = start;
                end = size - 1;
            }
            if (isNaN(start) && !isNaN(end)) {
                start = size - end;
                end = size - 1;
            }

            // Handle unavailable range request
            if (start >= size || end >= size) {
                // Return the 416 Range Not Satisfiable.
                res.writeHead(416, {
                "Content-Range": `bytes */${size}`
                });
                return res.end();
            }

            /** Sending Partial Content With HTTP Code 206 */
            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": content_type
            });

            let readable = createReadStream(path, { start: start, end: end });
            pipeline(readable, res, err => {
                console.log(err);
            });

            } else {

            res.writeHead(200, {
                "Content-Length": size,
                "Content-Type": content_type
            });

            let readable = createReadStream(path);
            pipeline(readable, res, err => {
                console.log(err);
            });

            }
        }
    } catch(err) {
        console.error(err);
    }
  })
  .listen(port, () => console.log("Running on 3000 port"));

```

### 运行

```
node index.js
```

将下载文件复制到工程根目录下, 或在根目录下的任意文件夹中.

示例:

工程根目录下的 1.mp3 文件访问地址是: http://localhost:3000/1.mp3

工程根目录下 video 目录中 1.mp4 文件访问地址是: http://localhost:3000/video/1.mp4
