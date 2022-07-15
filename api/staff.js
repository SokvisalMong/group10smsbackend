const staffRoutes = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

// Retrieves a list of all informations
staffRoutes.route("/").get(function (req, res) {
    let db_connect = dbo.getDb("sms");
    db_connect
        .collection("staffs")
        .find({})
        .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        })
});

// Get a single staff by id
staffRoutes.route("/staff/:id").get(function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://group10:BwuhKs7WfjwoGDFK@dmbsgroup10.6dxs4.mongodb.net/?retryWrites=true&w=majority";

  MongoClient.connect(url, function( err, db) {
    if (err) throw err;
    var dbb = db.db("sms");
    let myquery = { _id: ObjectId( req.params.id )};
    dbb.collection("staffs").findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  })
})

staffRoutes.route("/staff/staff_id/:id").get(function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://group10:BwuhKs7WfjwoGDFK@dmbsgroup10.6dxs4.mongodb.net/?retryWrites=true&w=majority";

  MongoClient.connect(url, function( err, db) {
    if (err) throw err;
    var dbb = db.db("sms");
    let myquery = { staff_id: Number( req.params.id )};
    dbb.collection("staffs").findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  })
})

// Create a new staff 
staffRoutes.route("/staff/create").post(function (req, response) { 
  let db_connect = dbo.getDb();
  let newStaff = {
    staff_id: Number(req.body.staff_id),
    staff_mobile: req.body.staff_mobile,
    staff_salary: Number(req.body.staff_salary),
    dept_id: req.body.dept_id
  };

  db_connect.collection("staffs").insertOne(newStaff, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
  console.log("Staff document created");
});

// Update staff by id
staffRoutes.route("/staff/update/:id").post(function(req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id)};
  let updatedStaff = {
    $set: {
      staff_id: Number(req.body.staff_id),
      staff_mobile: req.body.staff_mobile,
      staff_salary: Number(req.body.staff_salary),
      dept_id: req.body.dept_id
    }
  };

  db_connect.collection("staffs").updateOne(myquery, updatedStaff, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
  console.log("Staff document updated");
});

// Delete an staff by id
staffRoutes.route("/staff/delete/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};

  db_connect.collection("staffs").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 Staff Document deleted");
    response.json(obj);
  });
});

module.exports = staffRoutes;