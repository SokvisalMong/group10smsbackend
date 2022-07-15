const informationRoutes = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");


// Retrieves a list of all informations
informationRoutes.route("/information").get(function (req, res) {
    let db_connect = dbo.getDb("sms");
    db_connect
        .collection("informations")
        .find({})
        .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        })
});

// Get a single information by id
informationRoutes.route("/information/:id").get(function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://group10:BwuhKs7WfjwoGDFK@dmbsgroup10.6dxs4.mongodb.net/?retryWrites=true&w=majority";

  MongoClient.connect(url, function( err, db) {
    if (err) throw err;
    var dbb = db.db("sms");
    let myquery = { _id: ObjectId( req.params.id )};
    dbb.collection("informations").findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  })
});

informationRoutes.route("/information/staff_id/:id").get(function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://group10:BwuhKs7WfjwoGDFK@dmbsgroup10.6dxs4.mongodb.net/?retryWrites=true&w=majority";

  MongoClient.connect(url, function( err, db) {
    if (err) throw err;
    var dbb = db.db("sms");
    let myquery = { staff_id: Number( req.params.id )};
    dbb.collection("informations").findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  })
});

// Create a new information
informationRoutes.route("/information/create").post(function (req, response) {
    let db_connect = dbo.getDb();
    let newInformation = ({
        staff_id: Number(req.body.staff_id),
        age: "",
        sex: "",
        name: {
           first_name: "",
           last_name: ""
        }
    });
  
    db_connect.collection("informations").insertOne(newInformation, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
    console.log("Information document created");
  });

// Update information by id
informationRoutes.route("/information/update/:id").post(function(req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id)};
    let updatedInformation = {
        $set: {
            staff_id: Number(req.body.staff_id),
            age: Number(req.body.age),
            sex: req.body.sex,
            name: {
              first_name: req.body.name.first_name,
              last_name: req.body.name.last_name
            }
        }
    };

    db_connect.collection("informations").updateOne(myquery, updatedInformation,function (err, res) {
      if (err) throw err;
      response.json(res);
    })
    console.log("Information document updated");
});

//  Delete an admin by id
informationRoutes.route("/information/delete/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect.collection("informations").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 information Document deleted");
        response.json(obj);
    });
});

module.exports = informationRoutes;
