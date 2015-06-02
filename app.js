var pg = require('pg')
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// ******************************
// ****** INITIALIZATION ********
// ******************************

// Allows us to parse the incoming request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connects to postgres once, on server start
var conString = process.env.DATABASE_URL || "postgres://localhost/action";
var db;
pg.connect(conString, function(err, client) {
	if (err) {
		console.log(err);
	} else {
		db = client;
	}
});

// Homepage
app.get('/', function (req, res) {
  res.send('Numify API');
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
})

// ************************************************************
// ******************* DATA LAYER *****************************
// ************************************************************

// Save user rating numbers and dictations
app.post('/users', function(req, res) {
  db.query("INSERT INTO users (name, dictation, rating, created) VALUES ($1, $2, $3, NOW())", [req.body.name, req.body.dictation, req.body.rating], function(err, result) {
    if (err) {
      	res.status(500).send(err);
    } else {
    	console.log(result)
      	res.send(result);
    }
  });
});

// Get all users out of database
app.get('/users', function (req, res) {
  console.log(db);
  db.query("SELECT * FROM users", function(err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result.rows);
    }
  })
});

// Get users out of database
app.get('/users/:id', function (req, res) {
  console.log(db);
  db.query("SELECT name FROM users ORDER BY created", [req.body.name], function(err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result.rows);
    }
  })
});

//

//Start the actual server
var server = app.listen(process.env.PORT, function () {
	// server is actually running!
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
})
 