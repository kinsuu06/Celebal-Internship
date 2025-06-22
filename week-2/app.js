const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const fileName = query.filename;
  const filePath = path.join(__dirname, 'files', fileName);

  const dirPath = path.join(__dirname, 'files');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  if (pathname === '/create') {
    if (!fileName || !query.content) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Missing filename or content.');
    }

    fs.writeFile(filePath, query.content, (err) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error creating file.');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`File '${fileName}' created successfully.`);
    });

  } else if (pathname === '/read') {
    if (!fileName) {
      res.writeHead(400);
      return res.end('Missing filename.');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('File not found.');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`Contents of '${fileName}':\n\n${data}`);
    });

  } else if (pathname === '/delete') {
    if (!fileName) {
      res.writeHead(400);
      return res.end('Missing filename.');
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(404);
        return res.end('File not found or cannot be deleted.');
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`File '${fileName}' deleted successfully.`);
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Invalid route. Use /create, /read, or /delete.');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
