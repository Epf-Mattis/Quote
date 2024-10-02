const http = require('http');
const fs = require('fs');
const path = require('path');

let lastCitation = null; // Variable pour stocker la dernière citation affichée

function hazard(citations) {
  let citationAleatoire;
  
  // Continue de chercher une nouvelle citation jusqu'à ce qu'elle soit différente de la précédente
  do {
    citationAleatoire = citations[Math.floor(Math.random() * citations.length)];
  } while (citationAleatoire === lastCitation);
  
  lastCitation = citationAleatoire; // Mettre à jour la dernière citation affichée
  return citationAleatoire;
}

http.createServer(function (req, res) {
  if (req.url === '/quote') {
    // Lire le fichier citations.json avec encodage UTF-8
    fs.readFile(path.join(__dirname, 'citations.json'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erreur de lecture du fichier');
        return;
      }

      try {
        const citations = JSON.parse(data).citations;

        const citationAleatoire = hazard(citations); // Récupérer une citation aléatoire

        // Spécifier l'encodage UTF-8 dans l'en-tête de réponse
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <html>
            <head>
              <title>Citation aléatoire</title>
            </head>
            <body>
              <h1>${citationAleatoire}</h1>
              <button onclick="window.location.reload()">Nouvelle citation</button>
            </body>
          </html>
        `);
      } catch (parseError) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Erreur lors de l\'analyse du fichier JSON');
      }
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
