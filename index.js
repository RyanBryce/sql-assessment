var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://ryanbryce@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init")
    });
    app.get('/api/users', (req, res, next) => {
      db.get_all_users([], (err, users) => {
        res.json(users)
      })
    });
    app.get('/api/vehicles', (req, res, next) => {
      db.get_all_vehicles([], (err, vehicles) => {
        res.json(vehicles)
      })
    })
    app.post('/api/users', (req, res, next) => {
      let fn = req.body.firstname
      let ln = req.body.lastname
      let email = req.body.email
      db.new_user([fn, ln, email], (err, newUser) => {
        res.json(newUser)
      })
    });
    app.post('/api/vehicles', (req, res, next) => {
      let make = req.body.make
      let model = req.body.model
      let year = req.body.year
      let oId = req.body.ownerId

      db.add_new_vehicle([make, model, year, oId], (err, newVeh) => {
        res.json(newVeh)
      })
    });
    app.get('/api/user/:userId/vehiclecount', (req, res, next) => {
      let id = parseInt(req.params.userId)
      db.count_user_vehicle([id], (err, howMany) => {
        res.json({count: howMany[0].count})
      })
    });
    app.get('/api/user/:userId/vehicle', (req, res, next) => {
      db.get_vehicle_by_id([req.params.userId], (err, vehicles) => {
        res.json(vehicles)
      })
    });
    app.get('/api/vehicle', (req, res, next) => {
     if (req.query.UserEmail){
       db.get_vehicle_by_email([req.query.UserEmail], (err, vehicle) => {
         res.json(vehicle);
       })
     }else if(req.query.userFirstStart){
       db.get_vehicles_by_firstname([req.query.userFirstStart+"%"], (err, vehicle) => {
         res.json(vehicle);
       })
     }else{
       res.status(404).json("Wrong Query Parameters")
     }
    });
    app.get('/api/newervehiclesbyyear',(req, res, next) => {
      db.get_vehicles_by_year([], (err, vehicles) => {
        res.json(vehicles);
      });
    });
    app.put('/api/vehicle/:vehicleId/user/:userId',(req, res, next) => {
      db.change_ownership([req.params.vehicleId, req.params.userId], (err, newOwner) => {
       res.json(newOwner);
      })
    });
    app.delete('/api/user/:userId/vehicle/:vehicleId',(req, res, next) => {
      db.delete_ownership(req.params.userId, req.params.vehicleId, (err, noOwner) => {
        res.json(noOwner);
      });
    });
    app.delete('/api/vehicle/:vehicleId', (req, res, next) => {
      db.delete_vehicle([req.params.vehicleId], (err, deleted) => {
        res.json(deleted);
      })
    });
})

app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})

module.exports = app;
