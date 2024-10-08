const http = require('http');
const fs = require('fs');
const path = require('path');


const quotes = JSON.parse(fs.readFileSync('quotes.json', 'utf8'));


function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}


function searchQuotes(keyword) {
    return quotes.filter(q => q.quote.toLowerCase().includes(keyword.toLowerCase()));
}


const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/') {
        
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading the page');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (url.pathname === '/random-quote') {
        
        const quote = getRandomQuote();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(quote));
    } else if (url.pathname === '/search-quotes') {
        
        const keyword = url.searchParams.get('keyword');
        if (keyword) {
            const results = searchQuotes(keyword);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Keyword is required');
        }
    } else {
        
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404: Page Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
