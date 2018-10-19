/**
 * operations of module include find, list, choose and like
 * @module modulesAPI
 * @see module: '../dao/modulesCRUD'
 */

const SQLITE3= require('sqlite3').verbose();
var db = new SQLITE3.Database('../../CRUD.db');

/**
 * to find if module exist in the modules table in database
 * @param callback {function} - get the module data
 */
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

/**
 * to list module ranking by the number of likes
 * @param callback {function} - get the module data
 */
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

/**
 * the user can click like button to support a course, every user only have one time to click that
 * @param user_mail {string} - to get the user data by email
 * @param module_id {string} - to get the module data by id
 * @param callback {function} - to label the like parameter of user
 */
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
          // if the user had voted to the course before, he can't like vote to another course, every user only has one chance
          callback('You already vote before, only one chance', 1);
        }else if(like_status.like_status === 'false'){
          // update DB that user already like a course
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

/**
 * update database and send data to frontend when user choose a module
 * @param userMail {string} - to get the user information
 * @param modules {string} - to get the module information
 * @param callback - to get the result
 */
exports.chooseModules = function (userMail, modules, callback) {
  var userMail = userMail;
  var modules = modules;


  // call chosenModule method to get the module user already chose
  chosenModule(userMail, function (err, currentTimeID) {
    if (err) {
      console.log('Error callback because of wrong user mail');
    } else {
      console.log('Choose modules', currentTimeID);

      //call currentModules method to get the time id of the module
      currentModules(modules, function (err, newTimeID) {
        if (err) {
          callback('Please input one module', 1);
        } else {
          // add the newly selected course to to the user time id
          var allTimeID = currentTimeID.concat(newTimeID);

          // call checkRepeat function to see the time conflict
          var result = checkRepeat(allTimeID);

          if (result === true) {
            // call insertModulesId to get the module inserted into the user table
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

  /**
   * to find the course user already chose.
   * @param email {string} - get user data by email
   * @param callback {function} - get the result of operation
   */
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

  /**
   * to get the time id of current modules
   * @param module {string} - get module information by id
   * @param callback {function} - to get the operation result
   */
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

  /**
   * to check if the time id conflict or not
   * @param list {list} - the list of current module ids
   * @return {boolean} - to return the status of whether it's conflict or not
   */
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

  /**
   * to insert module id to the user table and user module mapping table
   * @param email {string} - get the user information
   * @param moduleID {string} - get the module id
   * @param callback {function} - the result of operations
   */
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


