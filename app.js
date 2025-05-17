// app.js
const http = require('http');

const PORT = process.env.PORT || 3000;
const VERSION = process.env.VERSION || 'v1 (Blue)';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Nice App</title>
      <style>
        body {
          background-color: #f0f8ff;
          font-family: Arial, sans-serif;
          color: #333;
          text-align: center;
          padding-top: 100px;
        }
        h1 {
          color: #007BFF;
        }
        p {
          font-size: 1.2em;
        }
      </style>
    </head>
    <body>
      <h1>👋 Hello, Mehul!</h1>
      <p>Welcome to <strong>Nice App</strong></p>
      <p>Running version: <strong>${VERSION}</strong></p>
    </body>
    </html>
  `;

  res.end(html);
});

server.listen(PORT, () => {
  console.log(`🚀 Nice App is running at http://localhost:${PORT}`);
});
