// the starting file of the backend

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var route = require('./service/route');
var config = require('../../config/config');

var app = express();

// permit the Content-Type request header, to accept cross-region requests, allow CORS.
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

// configure the secret string
app.set('superSecret', config.secret);

// use node modules
app.use('/node_modules/', express.static('./node_modules/'));
// app.use('/public/', express.static('./public/'));

// use other packages to help resolve json files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

app.use(route);

// use port 3000 as the backend port
app.listen(3000, function () {
  console.log('running .....');
});
