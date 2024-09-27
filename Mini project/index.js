const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const jwtPassword = "mrinank";
const mongoose = require("mongoose");

//connecting database
mongoose.connect(
  "mongodb+srv://mrinank1318:mrinank13@cluster0.oih2q.mongodb.net/"
);

//writing the schema of data base
const Users = mongoose.model("Users", {
  name: String,
  email: String,
  username: String,
  password: String,
});

app.use(express.json());
//signup
app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const Name = req.body.name;
  const email = req.body.email;
  const user = new Users({
    name: Name,
    email: email,
    username: username,
    password: password,
  });
  user.save();
  res.json({
    msg: "saved successfully",
  });
});
//logins
app.post("/login", async function (req, res) {
  const credentials={
    username:req.body.username,
     password:req.body.password
  }
  //checking user is existing in the database or not
  const userExist = await Users.findOne({username:credentials.username}); //findOne function finds the user in the database db.collection.
  if (!userExist) {
    return res.status(404).json({
      msg: "Invalid user",
    });
  }
  //password verification
  if(!(userExist.password==credentials.password)){
    return res.json({
      msg:'password invalid'
     })
  }
  //creating a jwt token if user exist
  var token = jwt.sign(credentials,jwtPassword);
  return res.json({
    msg: "Logged in succesfully",
    token: token,
  });
});
//forget password
app.post("/forget",async function(req,res){
  const username=req.body.username
  const userExist = await Users.findOne({ username: username })
  if (!userExist) {
    return res.status(404).json({
      msg: "Invalid user",
    })
  }else{
    res.json({
     password:userExist.password
    })
  } 
})
//Creating server
app.listen(3000, function () {
  console.log("listening at 3000");
});
