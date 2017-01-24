'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const requestProxy = require('express-request-proxy');
const app = express();
const PORT = process.env.PORT || 3000;
const conString = process.env.DATABASE_URL || 'postgres://localhost:5432';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'));
//***************************************************

app.post('/game/insert', (request, response) => {

  let client = new pg.Client(conString);

  client.connect(function(err) {
    if (err) console.error(err);

    client.query1(
      'CREATE TABLE IF NOT EXISTS games(' +
      'game_table_id INTEGER PRIMARY KEY, ' +
      'name VARCHAR(255) NOT NULL, ' +
      'gameId INTEGER NOT NULL, ' +
      'rank INTEGER, ' +
      'thumbnail VARCHAR(255));',
      function(err) {
        if (err) console.error(err);
        queryTwo();
      }
    );

    function queryTwo(){
      client.query(
      `INSERT INTO games(name, gameId, rank, thumbnail)
      VALUES ($1, $2, $3, $4);`,
      [request.body.name, request.body.gameId, request.body.rank, request.body.thumbnail],
      function(err) {

        if (err) console.error(err);
        client.end();
      });
    }
  })
  response.send('insert complete');
});
app.get('/bgg/*', proxyBgg);

function proxyBgg(request,response){
  console.log('bgg request', request.params[0]);
  (requestProxy({
    url: `https://bgg-json.azurewebsites.net/${request.params[0]}`,
  }))(request, response);
}

app.get('/game/all', function(request, response) {

  let client = new pg.Client(conString)

  client.connect(function(err) {
    if (err) console.error(err);

    client.query(
      'SELECT * FROM games',
      function(err, result) {
        if (err) console.error(err);
        response.send(result);
        client.end();
      }
    );
  })
});

//***************************************************
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));
