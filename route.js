var fs = require('fs');
var express = require('express');
//var student_api = require('./student');
var student_api = require('./sqlite_crud');
var modules_api = require('./modules');
var modules_time_api = require('./module_time');
var user_modules = require('./student_user')
var router = express.Router();


// router.get('/students', function(req,res) {
//     // if (req.session.login == 1){
//         student_api.findAll(function (err, students) {
//             if(err){
//                 return res.status(500).send("Server Error")
//             }
//             res.send(students)
//             // res.render('index.html',{ student: students})
//         })
//     // }else{
//     //     res.redirect('/login')
//     // }
//     }
//
//     );

router.get('/students', function(req,res) {
        if (req.session.login == 1){
        student_api.findAll(function (err, students) {
            if(err){
                return res.status(500).send("Server Error")
            }
            res.render('index.html',{ student: students})
        })
        }else{
            res.redirect('/login')
        }
    }

);

router.get('/students/new', function(req, res) {
    if (req.session.login == 1) {
        res.render('new.html')
    }
    else{
        res.redirect('/login')
    }

});


router.post('/students/new', function(req, res) {
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

router.get('/student/delete', function(req,res){
    console.log(req.query)
    email = req.query.email
    student_api.deleteUser(email,function(err) {
        if(err){
            res.status(500).send("Internal Server Error")
        }else{
            res.redirect('/students')
        }

    })
});

router.get(['/','/login'], function(req, res) {
    res.render('login.html')
});


router.post('/login', function(req, res) {
    console.log(req.body);
    student_api.authUser(req.body, function(err, status, role) {
        if(err) {
            res.redirect("login",{error: "User Not Found"})
        }
        console.log("login role is :", role);
        console.log("login status is :", status);
        if(status === true && role.role ==='Admin') {
            req.session.login = '1';
            req.session.username = req.body.username;
            res.redirect("students");
        }
        else if(status === true && role.role ==='User') {
            req.session.login = '2';
            req.session.username = req.body.username;
            let URI_prefix = "?email="+req.body.username;
            res.redirect("userPage"+URI_prefix);
        }
        else
            res.redirect("login")

    })
});

router.get('/login/new', function(req, res) {
   res.render('register.html')
});

router.post('/login/new', function(req, res) {
    //res.render('register.html')
    student_api.addUser(req.body, function(err) {
        if(err){
            //res.send(err);
            res.redirect('/login/new');
        }
    });
    res.redirect("../login")
});

router.get('/modules', function(req, res) {
    if (req.session.login == 1){
        modules_api.findModules(function (err, modules) {
            if(err){
                return res.status(500).send("Server Error")
            }
            res.render('modules.html',{ modules: modules})
        })
    }else{
        res.redirect('/login')
    }

});

router.get('/modules/new', function(req, res) {
    if (req.session.login == 1){
    res.render('newmodules.html')
} else{
        res.redirect('/login')
    }

});

router.post('/modules/new', function(req, res) {
    //res.render('register.html')
    modules_api.AddMoudules(req.body, function(err) {
        if(err){
            res.status(500).send("Internal Server Error");
        }
    });
    res.redirect("/modules")
});


router.get('/modules/timetable', function(req,res) {
    if (req.session.login == 1){
    console.log("Module ID is :", req.query.module_id)
    res.render("timetablepicker.html",{module_id: req.query.module_id})
} else{
        res.redirect('/login')
    }
});

router.post('/modules/timetable/edit', function(req, res) {
    modules_time_api.updateTimetable(req.body, function(err) {
        if(err){
            res.status(500).send("Internal Server Error");
        }
    });
    res.redirect("/modules")
});

router.get('/modules/timetable/list', function(req,res) {
    if (req.session.login == 1){
    console.log("Module ID is :", req.query.module_id);
    console.log("Module Name is :", req.query.module_name);
    modules_time_api.listTime(req.query.module_id, function(err,time) {
        if(err){
            res.status(500).send("Interal Server Error")
        }else{
            res.render("module_time_list.html",{timetable: time})
        }

    });
} else{
        res.redirect('/login')
    }
});

router.get('/modules/timetable/delete',function (req,res) {
    // console.log(req.body);
    modules_api.deleteModules(req.query.module_id,function (err) {
        if(err){
            res.state(500).send("Internal Server Error");
        }
        // res.render('modules.html',{ modules: modules})
    });
    res.redirect("/modules")
});

router.get('/userPage', function(req,res) {
    console.log(req.query);
    var email = req.query.email;
    if (req.session.login == 2) {
        user_modules.findModulesbyUser(email, function(err, modules) {
            console.log("modules is : ",modules);
            user_modules.findTimeByUser(email, function(err, timetable) {
                console.log("timetable is :", timetable)
                if(err){
                    res.status(500).send("Internal Server Error")
                }
                res.render("userPage.html", {email:email, modules:modules, times:timetable})

            })
        });

    } else{
        res.redirect('/login')
    }
});

router.get('/user/modules', function(req, res) {
    var email = req.query.email;
    if(req.session.login == 2) {
        modules_api.findModules(function(err, modules) {
           if(err){
               return res.status(500).send("Internal Server Error")
           }else{
               console.log("sending email :" ,email);
               res.render('modules_select.html', {email:email, modules:modules})
           }
        });

    } else{
        res.redirect('/login')
    }
});

router.post('/modules/choose', function(req, res) {
    if(req.session.login == 2){
    var email = req.body.email;
    var modules_ids = req.body.module_id
    modules_api.chooseModules(email,modules_ids, function(err) {
        if(err){
            res.status(500).send("Inter Server Error")
        }else{
            user_modules.findModulesbyUser(email, function(err, modules) {
                console.log("modules is : ",modules);
                user_modules.findTimeByUser(email, function(err, timetable) {
                    console.log("timetable is :", timetable);
                    if(err){
                        res.status(500).send("Internal Server Error")
                    }
                    res.render("userPage.html", {email:email, modules:modules, times:timetable})

                })
            });
        }
    })
}else{
        res.redirect('/login')
    }
}
);

router.get('/testdata', function(req, res) {
    res.send("testing success")
})

module.exports = router;
