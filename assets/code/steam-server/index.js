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

