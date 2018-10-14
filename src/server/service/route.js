var fs = require('fs');
var express = require('express');
//var student_api = require('./student');
var student_api = require('../dao/sqlite_crud');
var modules_api = require('../dao/modules');
var modules_time_api = require('../dao/module_time');
var user_modules = require('../dao/student_user');
var auth = require('../Auth/authCheck');
var jwt = require('jsonwebtoken');


var router = express.Router();

router.post('/login/new', function (req, res) {
  student_api.addUser(req.body, function (err, status) {
    console.log(status);
    if(status===0){
      res.status(200).json({success:true, message:"Register Success"})
    }else if(status===1){
      res.status(401).json({status:401, message:err})
    }else if(status===2){
      res.status(401).json({status:401, message:err})
    }else if(status===3){
      res.status(401).json({status:401, message:err})
    }else if(status===4){
      res.status(401).json({status:401, message:err})
    }else{
      res.status(401).json({status:401, message:"Fill in Wrong data in Filed"})
    }
  });
});

router.post('/login', function (req, res) {
  console.log(req.body);
  student_api.authUser(req.body, function (err, status, user_data) {
    if (err) {
      console.log(status);
      return res.status(301).json({
        success: false,
        status: 301,
        message: "Invalid username and password.",
      });
    }
    else if(status === false){
      console.log(status)
      return res.status(301).json({
        success: false,
        status: 301,
        message: "password not matched",
      });
    }else if(status === true){
      console.log(status);
      const payload = {
        username: user_data
      };
      var token = jwt.sign(payload, 'shhhhh', {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
      });
      return res.status(200).json({
        success: true,
        message: "You have succesfully logged in.",
        token: token
      });
    }
    //console.log("login role is :", role);
    //console.log("login status is :", status);
  })
});

router.post('/verify', function (req, res) {
  console.log("received token :" ,req.body);
  auth.tokenVerify(req.body.token, function(err){
    if(err){
      return res.status(403).json({
        success: false,
        message: "token failed"
      })
    }else{
      return res.status(200).json({
        success: true,
        message: "token confirmed"
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
      message: 'No token provided.'
    });
  }
});


router.get('/students', function (req, res) {
    student_api.findAll(function (err, students) {
      if (err) {
        return res.status(500).send("Server Error")
      }

      res.send({success: true,students: students})
    })
  }
);

router.get('/students/new', function (req, res) {
  if (req.session.login == 1) {
    res.render('new.html')
  }
  else {
    res.redirect('/login')
  }

});

router.post('/students/new', function (req, res) {
  //1. get req.data
  //2. process
  //3. update file
  //var student = JSON.parse(req.body)
  console.log(req.body);
  student_api.save(req.body, function (err) {
    if (err) {
      return res.status(500).send("Server Error")
    }
    res.redirect('/students');
  })
});

router.get('/student/delete/:email_id', function (req, res) {
  console.log(req.params.email_id)
  email = req.params.email_id;
  student_api.deleteUser(email, function (err) {
    if (err) {
      res.status(500).send("Internal Server Error")
    } else {
      //res.redirect('/students')
      res.send({status: 0})
    }

  })
});

router.get('/login/new', function (req, res) {
  res.render('register.html')
});

router.get('/modules', function (req, res) {
    modules_api.findModules(function (err, modules) {
      if (err) {
        return res.status(500).send("Internal Server Error")
      }
      res.status(200).json({modules: modules})
    })
});

router.get('/modules/new', function (req, res) {
  if (req.session.login == 1) {
    res.render('newmodules.html')
  } else {
    res.redirect('/login')
  }

});

router.post('/modules/new', function (req, res) {
  //res.render('register.html')
  if (req.session.login == 1) {
    modules_api.AddMoudules(req.body, function (err) {
      if (err) {
        res.status(500).send("Internal Server Error");
      }
    });
    res.redirect("/modules")
  } else {
    res.redirect('/login')
  }
});

router.get('/modules/timetable', function (req, res) {
  if (req.session.login == 1) {
    console.log("Module ID is :", req.query.module_id)
    res.render("timetablepicker.html", {module_id: req.query.module_id})
  } else {
    res.redirect('/login')
  }
});

router.post('/modules/timetable/edit', function (req, res) {
  modules_time_api.updateTimetable(req.body, function (err) {
    if (err) {
      res.status(500).send("Internal Server Error");
    }
  });
  res.redirect("/modules")
});

router.get('/modules/timetable/list', function (req, res) {
  if (req.session.login == 1) {
    console.log("Module ID is :", req.query.module_id);
    console.log("Module Name is :", req.query.module_name);
    modules_time_api.listTime(req.query.module_id, function (err, time) {
      if (err) {
        res.status(500).send("Interal Server Error")
      } else {
        res.render("module_time_list.html", {timetable: time})
      }

    });
  } else {
    res.redirect('/login')
  }
});

router.get('/user/modules/list/timetable', function (req, res) {
  console.log(req.query);
  var email = req.query.email;
  //if (req.session.login == 2) {
    user_modules.findModulesbyUser(email, function (err, modules) {
      console.log("modules is : ", modules);
      user_modules.findTimeByUser(email, function (err, timetable) {
        console.log("timetable is :", timetable);
        if (err) {
          res.status(500).json({success:false, message:"Internal Server Error"});
        }
        res.status(200).json({success:true, email: email, modules: modules, times: timetable});

      })
    });

  //} else {
  //  res.redirect('/login')
  //}
});

router.get('/user/modules:email', function (req, res) {
    console.log(req.params.email)
    email = req.params.email;
    modules_api.findModules(function (err, modules) {
      if (err) {
        return res.status(401).json({success: false, status:401, message:"Can't update due to internal server error"})
      } else {
        console.log("sending email :", email);
        return res.status(200).json({success: true,email: email, modules: modules})
      }
    });
});

router.post('/modules/choose', function (req, res) {
      var email = req.body.email;
      var modules_ids = req.body.module_id;
      modules_api.chooseModules(email, modules_ids, function(err) {
        if (err) {
          res.status(401).json({success: false, message: err})
        } else {
          res.status(200).json({success: true, message: "Update Success"})
        }
            })
          });

router.get('/modules/favorite', function (req, res){
  modules_api.listFavoritesModules(function(err, modules) {
    if(err){
      res.status(401).json({success: false, message: err})
      console.log(err)
    }else{
      res.status(200).json({success: true, modules:modules});
      console.log(modules)
      }
  })
});

router.post('/modules/press/like', function (req, res) {
  var email = req.body.email;
  var module_id = req.body.module_id;
  modules_api.likebuttonModule(email, module_id, function (err, status) {
    if(err){
      res.status(500).json({success: false, message: err})
    }else {
      res.status(200).json({success: true, message: "Enjoy your Module"})
    }
  })
});

router.get('/modules/del', function (req, res) {
    //if (req.session.login == 1) {
      console.log("going to deltet : ", req.query.module_id);
      var module_id = req.query.module_id;
      modules_api.delModules(module_id, function (err) {
        if (err) {
          res.status(500).send("Inter Server Error")
        } else {
          res.redirect('/modules')
        }
      })

    //} else {
    //  res.redirect('/login')
    //}
  }
)


module.exports = router;
