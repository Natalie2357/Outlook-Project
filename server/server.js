const https = require('https');
const hostname = '127.0.0.1';
const port = 443;
const fs = require('fs');
var certOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}

const server = https.createServer(certOptions, (req, res) => {
  const url = req.url.substring(1).split('?')[0];
  if (url == 'data') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      var data = Buffer.concat(chunks).toString();
      try {
        data = JSON.parse(data);
        console.log(JSON.stringify(data));
      } catch (e) { }
      res.end('thanks')
    })
    return;
  }
  if (url.endsWith('html'))
    res.setHeader('Content-Type', 'text/html');
  else if (url.endsWith('jpg')) {
    res.setHeader('Content-Type', 'image/jpeg');
    const read = fs.createReadStream(url)
    read.pipe(res);
    return;
  }
  else if (url.endsWith('js'))
    res.setHeader('Content-Type', 'text/javascript');
  else if (url.endsWith('css'))
    res.setHeader('Content-Type', 'text/css')
  fs.readFile(url, (data, err) => {
    if (err) return res.end(err.toString());
    if (!data) return res.end('')
    res.end(data.toString());
  });
});
server.listen(port, hostname, console.log);
// const http = require('http');
// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
// if(req.url == '/index.html'){
//   res.setHeader('Content-Type', 'text/html');
// return res.end(require('fs').readFileSync('index.html'));
// }
//  const chunks = [];
//    req.on('data', chunk => chunks.push(chunk));
//    req.on('end', () => {
//   var data = Buffer.concat(chunks).toString();
//   try{
// data = JSON.parse(data);
//   console.log(JSON.stringify(data));
// }catch{}
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/json');
//   res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//   if(true)//parseInt(data.Size) > 6000)
//     res.end('http://localhost:3000/index.html');
//   else
//     res.end('');
//   })

// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });