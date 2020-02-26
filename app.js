var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
var mysql = require('mysql');
const bcrypt = require('bcrypt');

const users = express.Router()
var port = process.env.PORT || 3000
app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Veryx@123",
  database: "licence"
});
app.get('/test',(req,res)=>{
  res.send("success");
} )
app.post('/login', (req, res) => {
  con.query("SELECT password FROM user where username= ?", req.body.email, function (err, result, fields) {
    if (err) throw err;
    var obj = JSON.stringify(result);
    var json = JSON.parse(obj);
    var pd = json[0].password;

    if (bcrypt.compareSync(req.body.password, pd)) {
      res.send({ response: true, username: req.body.email });
    } else {
      res.send({ response: false,username: req.body.email  });
    }

  });
}
)

app.post('/insert', (req, res) => {
  let hash = bcrypt.hashSync(req.body.password, 3);
  var sql = "INSERT INTO user (username,password,firstname,lastname,organization,country) VALUES ('" + req.body.username + "','" + hash + "','" + req.body.firstname + "','" + req.body.lastname + "','" + req.body.organization + "','" + req.body.country + "')";
  res.setHeader("Content-Type", "text/json");
  con.query(sql, function (err, result) {
    if (err) { res.send({ response: false }); return; }
    console.log("1 record inserted");
    res.send({ response: true });
  });
}
)



app.listen(port, function () {
  console.log('Server is running on port: ' + port)
})
