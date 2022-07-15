const adminRoutes = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");


// Retrieves a list of all admins
adminRoutes.route("/admin").get(function (req, res) {
  let db_connect = dbo.getDb("sms");
  db_connect
    .collection("admins")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// Get a single admin by id
adminRoutes.route("/admin/:id").get(function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://group10:BwuhKs7WfjwoGDFK@dmbsgroup10.6dxs4.mongodb.net/?retryWrites=true&w=majority";

  MongoClient.connect(url, function( err, db) {
    if (err) throw err;
    var dbb = db.db("sms");
    let myquery = { _id: ObjectId( req.params.id )};
    dbb.collection("admins").findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  })
})

// Create a new admin
adminRoutes.route("/admin/create").post(function (req, response) {
  let db_connect = dbo.getDb();
  let newAdmin = ({
    admin_id: Number(req.body.admin_id),
    login: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
  });

  db_connect.collection("admins").insertOne(newAdmin, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// Update admin by id
adminRoutes.route("/admin/update/:id").post(function(req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id)};
  let updatedAdmin = ({
    $set: {
      admin_id: req.body.admin_id,
      login: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      }
    }
  });

  db_connect.collection("admins").updateOne(myquery, updatedAdmin, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
  console.log("admin document updated");
});

// Delete an admin by id
adminRoutes.route("/admin/delete/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};

  db_connect.collection("admins").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 admin Document deleted");
    response.json(obj);
  });
});

module.exports = adminRoutes;