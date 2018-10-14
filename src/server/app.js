var express = require('express');
var route = require('./service/route');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('../../config/config');

var app = express();

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type,Authorization, Accept, X-Requested-With,x-csrf-token, x-access-token');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use('/node_modules/', express.static('./node_modules/'));
app.use('/public/', express.static('./public/'));
app.set('superSecret', config.secret);

app.engine('html', require('express-art-template'));

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(route);

app.listen(3000, function () {
    console.log("running .....")
});
