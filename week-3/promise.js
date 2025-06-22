const fs = require('fs').promises;

function readFilePromise(path) {
  return fs.readFile(path, 'utf8');
}

readFilePromise('example.txt')
  .then(data => {
    console.log('File content:', data);
  })
  .catch(err => {
    console.error('Error reading file:', err);
  });
