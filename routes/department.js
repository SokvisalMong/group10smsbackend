const departmentRoutes = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
//  const { MongoDBNamespace } = require("mongodb");
const dbo = require("../db/conn");


// Retrieves a list of all departments
departmentRoutes.route("/department").get(function (req, res) {
    let db_connect = dbo.getDb("sms");
    db_connect
        .collection("departments")
        .find({})
        .toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
        })
});

// Get a single department by id
departmentRoutes.route("/department/:id").get(function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://group10:BwuhKs7WfjwoGDFK@dmbsgroup10.6dxs4.mongodb.net/?retryWrites=true&w=majority";

  MongoClient.connect(url, function( err, db) {
    if (err) throw err;
    var dbb = db.db("sms");
    let myquery = { _id: ObjectId( req.params.id )};
    dbb.collection("departments").findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  })
})

// Create a new department
departmentRoutes.route("/department/create").post(function (req, response) {
    let db_connect = dbo.getDb();
    let newDepartment = {
        dept_id: req.body.dept_id,
        dept_name: req.body.dept_name,
        staffs: []
    };
  
    db_connect.collection("departments").insertOne(newDepartment, function (err, res) {
        if (err) throw err;
        response.json(res);
    });
    console.log("Department document created");
  });

// Update department by id
departmentRoutes.route("/department/update/:id").post(function(req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id)};
    let updatedDepartment = {
        $set: {
            dept_id: req.body.dept_id,
            dept_name: req.body.dept_name,
        }
    };

    db_connect.collection("departments").updateOne(myquery, updatedDepartment,function (err, res) {
      if (err) throw err;
      response.json(res);
    })
    console.log("Department document updated");
});

//Updating another staff into the department
departmentRoutes.route("/department/push/:id").post(function(req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newStaff = req.body.staff;

  db_connect.collection("departments").updateOne( myquery, { $push: { staffs: Number(newStaff)} }, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
})

//  Delete an admin by id
departmentRoutes.route("/department/delete/:id").delete((req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: ObjectId( req.params.id )};
    db_connect.collection("departments").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("1 Department Document deleted");
        response.json(obj);
    });
});

module.exports = departmentRoutes;
