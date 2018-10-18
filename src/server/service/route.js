var express = require('express');
var jwt = require('jsonwebtoken');

var userAPI= require('../dao/userCRUD');
var modulesAPI = require('../dao/modulesCRUD');
var auth = require('../auth/authCheck');

var router = express.Router();

router.post('/login/new', function (req, res) {
  userAPI.addUser(req.body, function (err, status) {
    console.log(status);
    if (status === 0) {
      res.status(200).json({success: true, message: "Register Success"})
    } else if (status === 1) {
      res.status(401).json({status: 401, message: err})
    } else if (status === 2) {
      res.status(401).json({status: 401, message: err})
    } else if (status === 3) {
      res.status(401).json({status: 401, message: err})
    } else if (status === 4) {
      res.status(401).json({status: 401, message: err})
    } else {
      res.status(401).json({status: 401, message: "Fill in Wrong data in Filed"})
    }
  });
});

router.post('/login', function (req, res) {
  userAPI.authUser(req.body, function (err, status, user_data) {
    if (err) {
      console.log(status);
      return res.status(301).json({
        success: false,
        status: 301,
        message: 'Invalid username and password',
      });
    }
    else if (status === false) {
      console.log(status);
      return res.status(301).json({
        success: false,
        status: 301,
        message: 'Password not matched',
      });
    } else if (status === true) {
      console.log(status);
      const payload = {
        username: user_data
      };
      var token = jwt.sign(payload, 'shhhhh', {
        expiresIn: 60 * 60 * 24
      });
      return res.status(200).json({
        success: true,
        message: 'You have successfully logged in',
        token: token,
      });
    }
  })
});

router.post('/verify', function (req, res) {
  console.log('received token :', req.body);
  auth.tokenVerify(req.body.token, function (err) {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token failed',
      })
    } else {
      return res.status(200).json({
        success: true,
        message: 'Token confirmed',
      })
    }
  })
});

router.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'shhhhh', function (err, decoded) {
      if (err) {
        return res.json({status: 403, success: false, message: 'Failed to authenticate token.'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      status: 403,
      success: false,
      message: 'No token provided',
    });
  }
});

router.get('/modules', function (req, res) {
  modulesAPI.findModules(function (err, modules) {
    if (err) {
      return res.status(500).send("Internal Server Error")
    }
    res.status(200).json({modules: modules})
  })
});

router.get('/user/modules/list/timetable', function (req, res) {
  var email = req.query.email;

  userAPI.findModulesByUser(email, function (err, modules) {
    console.log('Modules is : ', modules);
    userAPI.findTimeByUser(email, function (err, timetable) {
      console.log('Timetable is :', timetable);
      if (err) {
        res.status(500).json({success: false, message: 'Internal Server Error'});
      }
      res.status(200).json({success: true, email: email, modules: modules, times: timetable});
    })
  });
});

router.get('/user/modules:email', function (req, res) {
  var email = req.params.email;

  modulesAPI.findModules(function (err, modules) {
    if (err) {
      return res.status(401).json({success: false, status: 401, message: 'Cannot update due to internal server error'});
    } else {
      console.log('Sending email :', email);
      return res.status(200).json({success: true, email: email, modules: modules})
    }
  });
});

router.post('/modules/choose', function (req, res) {
  var email = req.body.email;
  var modules_ids = req.body.module_id;

  modulesAPI.chooseModules(email, modules_ids, function (err) {
    if (err) {
      res.status(401).json({success: false, message: err});
    } else {
      res.status(200).json({success: true, message: 'Update Success'});
    }
  })
});

router.get('/modules/favorite', function (req, res) {
  modulesAPI.listFavoritesModules(function (err, modules) {
    if (err) {
      res.status(401).json({success: false, message: err});
      console.log(err)
    } else {
      res.status(200).json({success: true, modules: modules});
      console.log(modules)
    }
  })
});

router.post('/modules/press/like', function (req, res) {
  var email = req.body.email;
  var module_id = req.body.module_id;

  modulesAPI.likeButtonModule(email, module_id, function (err, status) {
    if (err) {
      res.status(500).json({success: false, message: err});
    } else {
      res.status(200).json({success: true, message: 'Enjoy your Module'});
    }
  })
});

module.exports = router;
