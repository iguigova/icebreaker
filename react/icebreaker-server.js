// https://stackoverflow.com/questions/6084360/using-node-js-as-a-simple-web-server/23122981#23122981

var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname   // or whatever base directory you want

var port = process.env.PORT || 3000

var contentTypesByExtension = {
    '.html': "text/html",
    '.css':  "text/css",
    '.js':   "text/javascript"
};

http.createServer(function (request, response) {
    try {     
        var requestUrl = url.parse(request.url)
        
        // need to use path.normalize so people can't access directories underneath baseDirectory
        var fsPath = baseDirectory+path.normalize(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname)

        var fileStream = fs.createReadStream(fsPath)
        fileStream.pipe(response)
        fileStream.on('open', function() {
            
            var headers = {};
            var contentType = contentTypesByExtension[path.extname(fsPath)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            
             //response.writeHead(200)
        })
        fileStream.on('error',function(e) {
             response.writeHead(404)     // assume the file doesn't exist
             response.end()
        })
   } catch(e) {
        response.writeHead(500)
        response.end()     // end the response so browsers don't hang
        console.log(e.stack)
   }
}).listen(port)

console.log("listening on port " + port)
