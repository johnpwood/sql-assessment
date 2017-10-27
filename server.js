const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , massive = require('massive');

const mainCtrl = require('./mainCtrl');

const app = express();

app.use(bodyParser.json())
app.use(cors());

// You need to complete the information below to connect
// to the assessbox database on your postgres server.
massive({
    host: 'localhost',
    port: 5432,
    database: 'assessbox',
    user: 'postgres',
    password: 'secret'
}).then( db => {
  app.set('db', db);

  // Initialize user table and vehicle table.
  db.init_tables.user_create_seed().then( response => {
    console.log('User table init');
    db.init_tables.vehicle_create_seed().then( response => {
      console.log('Vehicle table init');
    })
  })

})


// ===== Build enpoints below ============

app.get('/api/users', function(req, res, next){
    app.get('db').selectAllUsers().then(response => {
	res.send(response);
    })
})
    .get('/api/vehicles', (req, res, next) => {
	app.get('db').selectAllVehicles().then(response => {
	    res.send(response)
	})
    })
    .post('/api/users', (req, res, next) => { 
	app.get('db').insertUser([req.body.name, req.body.email]).then(response => {
	    res.send(response);
	})
    })
    .post('/api/vehicles', (req, res, next) => {
	let b = req.body
	app.get('db').insertVehicle([b.make, b.model, b.year, b.owner_id]).then(response => {
	    res.send(response);
	})
    })
    .get('/api/user/:userId/vehiclecount', (req, res, next) => {
	app.get('db').getUsersVehicleCount([req.params.userId]).then(response => {
	    res.send([{count: response.length}]);
	})
    })
    .get('/api/user/:userId/vehicle', (req, res, next) => {
	app.get('db').getUsersVehicles([req.params.userId]).then(response => {
	    res.send(response);
	})
    })
    .get('/api/vehicle', (req, res, next) => {
	if(req.query.userEmail){
	    app.get('db').getVehiclesByEmail([req.query.userEmail]).then(response => {
		res.send(response);
	    })
	}
	if(req.query.userFirstStart){
	    app.get('db').getVehiclesByFirstName([req.query.userFirstStart + "%"]).then(response => {
		res.send(response);
	    })
	}
    })
    .get('/api/newervehiclesbyyear', (req, res, next)  => {
	app.get('db').getVehiclesByYear().then(response => {
	    res.send(response)
	})
    })
    .put('/api/vehicle/:vehicleId/user/:userId', (req, res, next) => {
	app.get('db').run(`UPDATE vehicles SET owner_id = ${req.params.userId} WHERE id = ${req.params.vehicleId} RETURNING *`).then(response => {
	    res.send(response);
	})
															 
    })
    .delete('/api/vehicle/:vehicleId', (req, res, next) => {
	app.get('db').run(`DELETE FROM vehicles WHERE id = ${req.params.vehicleId} RETURNING *`).then(response => {
	    res.send(response)
	})
    })
					  

// ===== Do not change port ===============
const port = 3000;
app.listen(port, () => {
  console.log('Listening on port: ', port);
})
