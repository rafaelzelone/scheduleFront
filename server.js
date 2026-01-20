import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const certPath = path.join(__dirname, 'certs'); 
const options = {
  key: fs.readFileSync(path.join(certPath, 'private.key')),
  cert: fs.readFileSync(path.join(certPath, 'certificate.crt')),
  ca: fs.readFileSync(path.join(certPath, 'ca.crt')),
};

https.createServer(options, app).listen(443, () => {
  console.log('🚀 Servidor HTTPS rodando na porta 443');
});

import http from 'http';
http.createServer((req, res) => {
  res.writeHead(301, { Location: 'https://' + req.headers.host + req.url });
  res.end();
}).listen(80, () => {
  console.log('Redirecionando HTTP para HTTPS na porta 80');
});
