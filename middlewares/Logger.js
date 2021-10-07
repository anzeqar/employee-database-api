const moment = require("moment");
const path = require("path");
const fs = require("fs");

const logger = (req, res, next) => {
  let log = `${req.protocol}://${req.get("host")}${
    req.originalUrl
  } @ ${moment().format()}`;
  fs.readFile(path.join(__dirname, "../", "logs.txt"), "utf-8", (err, data) => {
    if (err) throw err;
    let dataAppend = data;
    fs.writeFile(
      path.join(__dirname, "../", "logs.txt"),
      dataAppend + "\n" + log,
      (err) => {
        if (err) throw err;
        console.log("logged url");
      }
    );
  });
  next();
};

module.exports = logger;
