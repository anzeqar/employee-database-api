const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("./middlewares/Logger");
const app = express();
const PORT = process.env.PORT || 5000;
const methodOverride = require("method-override");

app.use(methodOverride("_method"));

const path = require("path");

const fs = require("fs");
let employees;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use("/api/employees", require("./routes/api/employees"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.redirect("/create");
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Add an Employee", employees });
});

app.get("/read", (req, res) => {
  fs.readFile(path.join(__dirname, "EmployeeDB.json"), "utf-8", (err, data) => {
    if (err) throw err;
    if (data === undefined || data === []) {
      employees = data;
    } else {
      employees = JSON.parse(data);
    }
  });
  res.render("read", { title: "Read All Employee", employees });
});

app.get("/update", (req, res) => {
  res.render("update", { title: "Update an Employee", employees });
});

app.get("/delete", (req, res) => {
  res.render("delete", { title: "Delete an Employee", employees });
});
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
