var express = require('express');
var jwt = require('jsonwebtoken');

var userAPI= require('../dao/userCRUD');
var modulesAPI = require('../dao/modulesCRUD');
var auth = require('../auth/authCheck');

// create a new router
var router = express.Router();

/**
 * this route to /login/new, the page used when a new user register
 * response with status code and message
 * @method post
 * @return status status code and message
 */
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

/**
 * this route to /login, user login authentication with username and password
 * if the input information is not right, will return error message
 * if the input information is right, a token will be generate for this user
 * @method post
 * @return verification status code and message
 */
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
      const PAYLOAD = {
        username: user_data
      };
      var token = jwt.sign(PAYLOAD, 'shhhhh', {
        // token will expire in 24 hours
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

/**
 * verify if the user have the token to navigate to another web page
 * to check if the token is right or not
 * @method post
 * @return token status code and message
 */
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

/**
 * verify if the user have the token to navigate to another web page
 * to check if the user is authorized
 * @return verification status code and message
 */
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

/**
 * navigate to /modules
 * @param dirPath string, the path of the directory
 * @method get
 * @return error message if it occurs; or,
 *         module data in json format
 */
router.get('/modules', function (req, res) {
  modulesAPI.findModules(function (err, modules) {
    if (err) {
      return res.status(500).send("Internal Server Error")
    }
    res.status(200).json({modules: modules})
  })
});

/**
 * navigate to /user/modules/list/timetable
 * @param dirPath string, the path of the directory
 * @method get
 * @return error message if it occurs; or,
 *         the find result, email of the user and the user's module and timetable data in json format
 */
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

/**
 * navigate to user/modules:email
 * @param dirPath string, the path of the directory
 * @method get
 * @return error message if it occurs; or,
 *         the status, email and the user's module data in json format
 */
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

/**
 * navigate to /modules/choose
 * @param dirPath string, the path of the directory
 * @method post
 * @return error message if it occurs; or,
 *         the status and message in json format
 */
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

/**
 * navigate to /modules/favorite
 * @param dirPath string, the path of the directory
 * @method get
 * @return error message if it occurs; or,
 *         the status and module data in json format
 */
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

/**
 * navigate to /modules/press/like
 * @param dirPath string, the path of the directory
 * @method post
 * @return error message if it occurs; or
 *         the status and message in json format
 */
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
