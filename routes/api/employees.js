const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
let employees;

fs.readFile(
  path.join(__dirname, "../../EmployeeDB.json"),
  "utf-8",
  (err, data) => {
    if (data === undefined || data === []) {
      employees = data;
    } else {
      employees = JSON.parse(data);
    }
  }
);

router.get("/", (req, res) => {
  res.json(employees);
});

router.get("/:id", (req, res) => {
  let found = employees.some((member) => member.id === req.params.id);
  if (found) {
    res.json(employees.filter((member) => member.id === req.params.id));
  } else {
    res.status(400).json({ msg: `No such member of id ${req.params.id}` });
  }
});

router.post("/", (req, res) => {
  let message = {
    id: randomUUID(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    dob: req.body.dob.slice(0, 10),
    age: Number(req.body.age),
    salary: Number(req.body.salary),
    department: req.body.department,
    email: req.body.email,
    location: req.body.location,
    isWorking: req.body.isWorking == "on" ? true : false,
  };
  if (employees.length > 0) {
    let found = employees.some((member) => member.id === message.id);
    while (found) {
      message.id = randomUUID();
      if (employees.some((member) => member.id !== message.id)) {
        break;
      }
    }
  }

  employees.push(message);
  fs.writeFile(
    path.join(__dirname, "../../EmployeeDB.json"),
    JSON.stringify(employees, null, 2),
    "utf-8",
    (err) => {
      if (err) throw err;
      console.log("file wrote to json");
    }
  );
  res.json({ msg: "employee added successfully", employees });
});

router.put("/:id", (req, res) => {
  console.log(req.params);
  let found = employees.some((member) => member.id === req.params.id);
  let updateMember = req.body;
  if (found) {
    employees.forEach((member) => {
      if (member.id === req.params.id) {
        member.firstName = updateMember.firstName
          ? updateMember.firstName
          : member.firstName;
        member.lastName = updateMember.lastName
          ? updateMember.lastName
          : member.lastName;
        member.gender = updateMember.gender
          ? updateMember.gender
          : member.gender;
        member.dob = updateMember.dob
          ? updateMember.dob.slice(0, 10)
          : member.dob;
        member.age = updateMember.age ? updateMember.age : member.age;
        member.salary = updateMember.salary
          ? updateMember.salary
          : member.salary;
        member.department = updateMember.department
          ? updateMember.department
          : member.department;
        member.email = updateMember.email ? updateMember.email : member.email;
        member.location = updateMember.location
          ? updateMember.location
          : member.location;
        member.isWorking = updateMember.isWorking
          ? updateMember.isWorking
          : member.isWorking;
        if (member.isWorking == "on") member.isWorking = true;
        fs.writeFile(
          path.join(__dirname, "../../EmployeeDB.json"),
          JSON.stringify(employees, null, 2),
          "utf-8",
          (err) => {
            if (err) throw err;
            console.log("file wrote to json");
          }
        );
        res.json({ msg: "Member updated Successfully", member });
      }
    });
  } else {
    res.status(400).json({ msg: `No such member of id ${req.params.id}` });
  }
});

router.delete("/:id", (req, res) => {
  console.log("delete");
  let found = employees.some((member) => member.id === req.params.id);
  if (found) {
    if (req.params.id == "b6f4ed3c-51fa-4a8e-b9b8-b3ca9a373e0a") {
      return res.status(400).json({ msg: "cannot delete sample employee" });
    }
    let mem = employees.filter((member) => member.id !== req.params.id);
    fs.writeFile(
      path.join(__dirname, "../../EmployeeDB.json"),
      JSON.stringify(mem, null, 2),
      "utf-8",
      (err) => {
        if (err) throw err;
        console.log("file wrote to json");
      }
    );
    res.json({
      msg: "Member deleted successfully",
      employees: mem,
    });
  } else {
    res.status(400).json({ msg: `No such member of id ${req.params.id}` });
  }
});
module.exports = router;
