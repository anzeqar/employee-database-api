const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PORT = process.env.PORT || 5000;
const methodOverride = require("method-override");
const path = require("path");

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/employees", require("./routes/api/employees"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.redirect("/create");
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Add an Employee" });
});

app.get("/read", (req, res) => {
  res.render("read", { title: "Read an Employee" });
});

app.get("/update", (req, res) => {
  res.render("update", { title: "Update an Employee" });
});

app.get("/delete", (req, res) => {
  res.render("delete", { title: "Delete an Employee" });
});
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT);
