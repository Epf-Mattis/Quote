const http = require('http');
const fs = require('fs');
const path = require('path');

function hazard(citations) {
  return citations[Math.floor(Math.random() * citations.length)];
}

http.createServer(function (req, res) {
  if (req.url === '/quote') {
    fs.readFile(path.join(__dirname, 'citations.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erreur de lecture du fichier');
        return;
      }

      const citations = JSON.parse(data).citations;

      const citationAleatoire = hazard(citations);

      
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html>
          <head>
            <title>Citation aléatoire</title>
          </head>
          <body>
            <h1>${citationAleatoire.citations}</h1>
            <p><strong>Auteur :</strong> ${citationAleatoire.author}</p>
            <p><strong>Époque :</strong> ${citationAleatoire.time}</p>
            <button onclick="window.location.reload()">Nouvelle citation</button>
          </body>
        </html>
      `);
    });
  } else {
    
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <head>
          <title>Erreur 404</title>
        </head>
        <body>
          <h1>404 - Page non trouvée</h1>
          <p>La page que vous cherchez n'existe pas. Allez à <a href="/quote">/quote</a>.</p>
        </body>
      </html>
    `);
  }
}).listen(8080);

console.log('Serveur : http://localhost:8080/quote');
