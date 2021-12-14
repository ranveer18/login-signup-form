const express = require("express");
const path = require("path");
const app = express();
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

require("./db/conn");
const Rgister = require("./models/models");
const Register = require("./models/models");
const port = process.env.PORT || 3000;

app.use(express.json());
// app.use(express.static("./public"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});
app.post("/", async (req, res) => {
  try {
    const password = req.body.fpassword;
    const cpassword = req.body.password2;
    if (password === cpassword) {
      const registerEmployee = new Register({
        fname: req.body.fname,
        femail: req.body.femail,
        username: req.body.username,
        fpassword: req.body.fpassword,
        password2: cpassword,
      });

      const token = await registerEmployee.generateAuthtoken();

      const registered = await registerEmployee.save();
      res.status(201).send("registerd Successful");
    } else {
      res.send("invalid login");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
// login check
app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.fpassword;
    const mailuser = await Register.findOne({ username: username });
    const isMatch = await bcrypt.compare(password, mailuser.fpassword);

    const token = await mailuser.generateAuthtoken();

    if (isMatch) {
      res.status(201).send("login successful");
    } else {
      res.send("invalid login");
    }
  } catch (error) {
    res.status(400).send("invalid username");
  }
});
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
