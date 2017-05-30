var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var axios = require('axios');
var querystring = require('querystring');

require('dotenv').config();

var bodyParser = require('body-parser');
app.use( bodyParser.json() );

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

var instance = axios.create({
  baseURL: 'https://api.imgur.com/3/',
  headers: { 'Authorization': 'Client-ID ' + process.env.IMGUR_CLIENT_ID }
});

/* On a get request to /search/:query, run the following:
-----------------------------------------------------------
 * 1. Link to the baseURL above, add the gallery search url.
 * 2. Append the query (searchterm) from the front end input.
 * 3. Create a new get request with the entire URL.
 * 4. send the resulting data to the front end.
 * 5. use vue-resource $http.get() to grab the data.
 */
app.get('/search/:query', function(req, res) {
  const url = 'gallery/search/top/0/?' + querystring.stringify({ q: req.params.query });
  instance.get(url)
    .then(function (result) {
      res.send(result.data.data.filter(item => !item.is_album && !item.nsfw && !item.animated));
    })
    .catch(function (error) {
      console.log(error);
    })
  ;
});

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'production') {
  require('reload')(server, app);
}

server.listen(process.env.PORT, function () {
  console.log('Listening on port '.concat(process.env.PORT))
});
