const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");
//The HTTPS module provides a way of making Node.js transfer data over
//HTTP TLS/SSL protocol, which is the secure HTTP protocol.

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) { //GET request made to the root route
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) { //sending to the mailchimp server
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;


  const data = {
    members: [ //an array of objects
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data); //converts the javascript object to JSON string

  const url = "https://us14.api.mailchimp.com/3.0/lists/ea4f21a99d" //list id = ea4f21a99d

  const options = {
    method: "POST",
    auth: "shubhi1:6fb19b8cebfbc066c1cad09cc7c088a0-us14" //authentication key provided by mailchimp
  }

  const request = https.request(url, options, function(response) {
    //
     if(response.statusCode === 200){
       res.sendFile(__dirname+"/success.html");
     }
     else{
       res.sendFile(__dirname+"/failure.html");
     }
    response.on("data", function(data) {
      console.log(JSON.parse(data)); //console logs the details
    })

  })

request.write(jsonData); //adding the subscribers details
request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("The server is running on port 3000");
})

// API key mailchimp - 6fb19b8cebfbc066c1cad09cc7c088a0-us14
