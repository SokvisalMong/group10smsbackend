const projectRoutes = require("express").Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");


// Retrieves a list of all projects
projectRoutes.route("/project").get(function (req, res) {
  let db_connect = dbo.getDb("sms");
  db_connect
    .collection("projects")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// Get a single project by id
projectRoutes.route("/project/:id").get(function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb+srv://group10:BwuhKs7WfjwoGDFK@dmbsgroup10.6dxs4.mongodb.net/?retryWrites=true&w=majority";

  MongoClient.connect(url, function( err, db) {
    if (err) throw err;
    var dbb = db.db("sms");
    let myquery = { _id: ObjectId( req.params.id )};
    dbb.collection("projects").findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
      
    });
  })
})

// Create a new project
projectRoutes.route("/project/create").post(function (req, response) {
  let db_connect = dbo.getDb();

  let newProject = {
    project_id: Number(req.body.project_id),
    project_name: req.body.project_name,
    timetable: {
      start: new Date(req.body.start),
      end: "",
      duration: Number(0)
    },
    staffs: []
  };

  db_connect.collection("projects").insertOne(newProject, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
  console.log("New Project created");
});

// Update project by id
projectRoutes.route("/project/update/:id").post(function(req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id)};
  var star = new Date(req.body.timetable.start);
  var en = new Date(req.body.timetable.end);
  let updatedProject = {
    $set: {
      project_id: Number(req.body.project_id),
      project_name: req.body.project_name,
      timetable: {
        start: new Date(req.body.timetable.start),
        end: new Date(req.body.timetable.end),
        duration: Number((en.getTime() - star.getTime()) / (1000 * 3600 * 24))
      }
    }
  };

  db_connect.collection("projects").updateOne(myquery, updatedProject, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
  console.log("Project document updated");
});


//Updating staff into a project
projectRoutes.route("/project/push/:id").post(function(req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newStaff = req.body.staff;

  db_connect.collection("projects").updateOne( myquery, { $push: { staffs: Number(newStaff)} }, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
})


// Delete an admin by id
projectRoutes.route("/project/delete/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};

  db_connect.collection("projects").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 Project Document deleted");
    response.json(obj);
  });
});

module.exports = projectRoutes;