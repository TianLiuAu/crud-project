const SQLITE3= require('sqlite3').verbose();
var db = new SQLITE3.Database('../../CRUD.db');

exports.findModules = function(callback) {
  var sqlFindModule = `SELECT * FROM modules`;

  db.all(sqlFindModule, [], (err, modules) => {
    if (err) {
      throw err;
    }
    console.log(modules);
    callback(null, modules);
  });
};

exports.listFavoritesModules = function(callback) {
  var sqlListFavorModules = `SELECT module_id, name, coodinator, numberlikes FROM modules ORDER BY numberlikes DESC`;

  db.all(sqlListFavorModules, [], (err, modules) => {
    if (err) {
      callback(err, 1);
    } else {
      callback(null, modules);
    }
  });
};

exports.likeButtonModule = function (user_mail, module_id, callback) {
  var sqlCheckUserLike = `SELECT like_status FROM students WHERE email = ?`;
  var sqlUpdateLike = `UPDATE modules SET numberlikes = numberlikes + 1 WHERE module_id = ?`;
  var sqlUpdateUserLike = `UPDATE students SET like_status = 'true' WHERE email = ?`;
  console.log('No module_id', module_id);

  if(module_id.length !== 0){
    db.get(sqlCheckUserLike, [user_mail], function (err, like_status) {
      if(err){
        callback(err);
      }else{
        if(like_status.like_status === 'true'){
          callback('You already vote before, only one chance', 1);
        }else if(like_status.like_status === 'false'){
          db.run(sqlUpdateLike, [module_id], function (err) {
            if(err){
              callback(err);
            }else{
              db.run(sqlUpdateUserLike, [user_mail], function (err) {
                if(err){
                  callback(err);
                }else{
                  callback(null, 0);
                }
              })
            }
          })
        }
      }
    })
  }else{
    callback('You have not chosen a module', 1);
  }
};

// exports.AddMoudules = function (module, callback) {
//   var sqlAddModule = `INSERT INTO modules(name,coodinator,description) VALUES(?,?,?)`;
//   db.run(sqlAddModule, [module.name, module.coodinator, module.description], function (err) {
//     if (err) {
//       callback(err);
//     }
//     console.log('A row has been inserted with row ID');
//     callback();
//   });
// };

exports.chooseModules = function (userMail, modules, callback) {
  var userMail = userMail;
  var modules = modules;

  chosenModule(userMail, function (err, currentTimeID) {
    if (err) {
      console.log('Error callback because of wrong user mail');
    } else {
      console.log('Choose modules', currentTimeID);
      currentModules(modules, function (err, newTimeID) {
        if (err) {
          callback('Please input one module', 1);
        } else {
          var allTimeID = currentTimeID.concat(newTimeID);
          var result = checkRepeat(allTimeID);

          if (result === true) {
            insertModulesId(userMail, modules, function (err) {
              if (err) {
                callback(err);
              } else {
                callback(null, 0);
              }
            })
          } else {
            callback('Conflicted courses have found', 1);
          }
        }
      })
    }
  });

  function chosenModule(email, callback) {
    var sqlChosenModule = `SELECT mt.time_id 
               FROM timetable AS t JOIN modules_time AS mt 
               ON t.time_id = mt.time_id 
               WHERE mt.module_id IN
                  (SELECT m.module_id 
                   FROM students AS s JOIN student_modules_mapping AS smm 
                   JOIN modules AS m ON s.student_id = smm.student_id AND smm.modules_id=m.module_id 
                   WHERE s.email = ?)`;

    db.all(sqlChosenModule, [email], function (err, timeID) {
      if (err) {
        callback(err);
      } else {
        callback(null, timeID);
      }
    })
  };

  function currentModules(module, callback) {
    if (modules.length !== 0) {
      var sqlCurrentModule = `SELECT time_id FROM modules_time WHERE module_id = ?`;
      db.all(sqlCurrentModule , modules, function (err, timeID) {
        if (err) {
          callback(err);
        } else {
          callback(null, timeID);
        }
      })
    } else {
      callback('You need to choose one module');
    }
  };

  function checkRepeat(list) {
    var array = [];
    var obj = new Object();
    var result = true;

    for (var index in list) {
      array.unshift(list[index]['time_id']);
    }

    for (var item in array) {
      if (obj[array[item]] === undefined) {
        obj[array[item]] = 1;
      } else {
        obj[array[item]]++;
      }
    }
    console.log('All of the time_ids:' ,obj);

    for (var element in obj) {
      if (obj[element] !== 1) {
        return false
      }
    }

    return result;
  };

  function insertModulesId(email, moduleID, callback) {
    var email = email;
    var sqlStudentID = `SELECT student_id FROM students WHERE email = ?`;

    db.all(sqlStudentID, email, function (err, studentID) {
      if (err) {
        console.log('student_id cannot be found');
      } else {
        var sqlStuModuleMap = `INSERT INTO student_modules_mapping(student_id, modules_id) VALUES (?,?)`;
        var studentID = studentID[0].student_id;
        console.log('student_id :', studentID);
        console.log('module_id :',  moduleID);
        db.run(sqlStuModuleMap, [parseInt(studentID), parseInt(moduleID)], function (err) {
          if (err) {
            callback(err);
          } else {
            console.log('Module ID inserted:', moduleID);
            callback(null, 'Module insert success');
          }
        })
      }
    })
  }
};

// exports.delModules = function (modulesID, callback) {
//   var modulesID = modulesID;
//   var sqlDeleteModuleIDSMM = `DELETE FROM student_modules_mapping WHERE modules_id = ?`;
//   var sqlDeleteModuleM = `DELETE FROM modules WHERE module_id = ?`;
//   var sqlDeleteModuleMT = `DELETE FROM modules_time WHERE module_id = ?`;
//
//   db.run(sqlDeleteModuleIDSMM, modulesID, function (err) {
//     if (err) {
//       callback(err);
//     } else {
//       db.run(sqlDeleteModuleM, modulesID, function (err) {
//         if (err) {
//           callback(err);
//         } else {
//           db.run(sqlDeleteModuleMT, modulesID, function (err) {
//             if (err) {
//               callback(err);
//             } else {
//               console.log('Delete the column');
//             }
//           });
//           callback();
//         }
//       })
//     }
//   })
// };

