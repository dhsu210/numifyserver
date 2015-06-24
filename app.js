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
var conString = process.env["DATABASE_URL"] || "postgres://localhost:5432/numifyserver";
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


// ************************************************************
// ******************* DATA LAYER *****************************
// ************************************************************

// Get all users out of database
app.get('/users', function (req, res) {
  console.log(db);
  db.query("SELECT id, name, email, user_created FROM users", function(err, result) {
    if (err) {
    	console.log(err);
      	res.status(500).send(err);
    } else {
    	console.log(result.rows);
      	res.send(result.rows);
    }
  })
});

// Get the last four dictations/number ratings that were entered into the database
app.get('/users/lastfour', function (req, res) {
  console.log(db);
  db.query("SELECT users.name, dictations.message, dictations.rating FROM users JOIN dictations ON users.id = dictations.user_id ORDER BY message_created DESC LIMIT 4 OFFSET 1", function(err, result) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			console.log(result.rows);
			res.send(result.rows);
		}
  })
});

// Get a particular user's ratings and dictations
app.get('/users/:id', function (req, res) {
		db.query("SELECT users.name, dictations.message, dictations.rating FROM dictations JOIN users ON users.id = dictations.user_id WHERE dictations.user_id = $1 ORDER BY message_created", [req.params.id], function(err, result) {
			if (err) {
				console.log(err);
			  	res.status(500).send(err);
			} else {
				console.log(result.rows);
			  	res.send(result.rows);
		}
	})
});

// Save a user's rating number and dictation into database
app.post('/users/:id', function(req, res) {
	console.log("this is the request.body")
	console.log(req.body)
	db.query("INSERT INTO dictations (message, rating, user_id, message_created) VALUES ($1, $2, $3, NOW())", [req.body.message, req.body.rating, req.params.id], function(err, result) {
	if (err) {
		console.log(err);
	  	res.status(500).send(err);
	} else {
		console.log(result)
	  	res.send(result);
	}
	});
});

// Save a user into database
app.post('/users', function(req, res) {
   console.log("this is the request.body")
   console.log(req.body)
   db.query("SELECT id, name, email FROM users WHERE name = $1 and email = $2", [req.body.name, req.body.email], function(err, result) {
       if (err) console.log(err); 
       if (result.rows.length > 0) {
           console.log("user exists");
           console.log(result.rows[0]);
           res.send(result.rows[0]);
       } else {
           db.query("INSERT INTO users (name, email, user_created) VALUES ($1, $2, NOW()) RETURNING id, name, email", [req.body.name, req.body.email], function(err, result) {
               if (err) {
                   console.log("this is not inserting")
                   console.log(err);
                   res.status(500).send(err);
               } else {
                   console.log("this is inserting new")
                   console.log(result);
                   res.send(result.rows[0]);
               }
           });
       } 
   });
});

//Start the actual server
var server = app.listen(process.env.PORT, function () {
	// server is actually running!
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
})
 