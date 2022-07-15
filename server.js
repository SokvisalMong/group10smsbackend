const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

const staff = require('./api/staff');
const admin = require('./api/admin');
const department = require('./api/department');
const information = require('./api/information');
const project = require('./api/project');

app.use("./api/staff", staff);
app.use("./api/admin", admin);
app.use("./api/department", department);
app.use("./api/information", information);
app.use("./api/project", project);
// get driver connection
const dbo = require("./db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
 
  });
  console.log(`Server is running on port: ${port}`);
});