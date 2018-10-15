//loading package

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../../CRUD.db');

exports.findModules = function(callback) {

  let sql = `SELECT * FROM modules`;

  db.all(sql, [], (err, modules) => {
    if (err) {
      throw err;
    }
    console.log(modules);
    callback(null, modules);
  });

// close the database connection
  //db.close();
};

exports.listFavoritesModules = function(callback) {
  let sql = `SELECT module_id, name, coodinator, numberlikes FROM modules order by numberlikes DESC`;
  db.all(sql, [], (err, modules) => {
    if (err) {
      callback(err, 1);
    } else {
      callback(null, modules);
    }
  });
};

exports.likebuttonModule = function (user_mail, module_id, callback) {
  let sql_check_user_like = `SELECT like_status FROM students where email = ?`;
  let sql_update_likes = `UPDATE modules SET numberlikes = numberlikes + 1 where module_id = ?`;
  let sql_update_user_like = `UPDATE students SET like_status = 'true' where email = ?`;
  console.log("None Module_id", module_id);
  if(module_id.length !== 0){
  db.get(sql_check_user_like, [user_mail], function (err, like_status) {
    if(err){
      callback(err)
    }else{
      console.log("like status is :",like_status)
      if(like_status.like_status === 'true'){
        callback("You already vote before, only one chance", 1)
      }else if(like_status.like_status === 'false'){
        db.run(sql_update_likes, [module_id], function (err) {
          if(err){
            callback(err)
          }else{
            db.run(sql_update_user_like, [user_mail], function (err) {
              if(err){
                callback(err)
              }else{
                callback(null, 0)
              }

            })
          }
        })
      }
    }
  })}else{
    callback("You haven't Chosen a module", 1)
  }
};

exports.AddMoudules = function (module, callback) {

  let sql = `INSERT INTO modules(name,coodinator,description) VALUES(?,?,?)`;
  db.run(sql, [module.name, module.coodinator, module.description], function (err) {
    if (err) {
      callback(err);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid`);
    callback();
  });

  // close the database connection
  //db.close();
};

exports.chooseModules = function (user_mail, modules, callback) {
  var user_mail = user_mail;
  console.log(user_mail);
  var modules = modules;
  console.log(modules);
  chosenmodule(user_mail, function (err, ctime_ids) {
    if (err) {
      console.log("error callback")
    } else {
      console.log("choose modules", ctime_ids);
      currentmodules(modules, function (err, ntime_ids) {
        if (err) {
          callback("Please Input One Module", 1)
        } else {
          console.log("current modules times", ntime_ids);
          alltime_ids = ctime_ids.concat(ntime_ids);
          console.log("all of the time_ids in modules :" ,alltime_ids);
          result = checkrepeat(alltime_ids);
          console.log("result is :", result);
          if (result === true) {
            console.log("input usermial is :", user_mail)
            insertModulesId(user_mail, modules, function (err) {
              if (err) {
                callback(err)
              } else {
                callback(null, 0)
              }
            })
          } else {
            callback("Have Conflicted Courses Found", 1)
          }
        }

      })
    }

  });



  function chosenmodule(email, callback) {
    var sql = `SELECT mt.time_id FROM timetable as t join modules_time as mt on t.time_id = mt.time_id WHERE mt.module_id in (select m.module_id from students as s join student_modules_mapping as smm join modules as m on s.student_id = smm.student_id and smm.modules_id=m.module_id where s.email = ?)`
    db.all(sql, [email], function (err, time_ids) {
      if (err) {
        callback(err)
      } else {
        callback(null, time_ids)
      }
    })

  }

  function currentmodules(module, callback) {
    console.log(module);
    console.log("Current Modules are :" ,modules);
    if (modules.length !== 0) {
      var sql = `select time_id from modules_time where module_id = ?`
    db.all(sql, modules, function (err, time_ids) {
      if (err) {
        callback(err)
      } else {
        callback(null, time_ids)
      }
    })
  }else{
    callback("You Need to Choose One Module")
    }
  };

  function checkrepeat(list) {
    array = [];
    confliclist = [];
    for (var i in list) {
      console.log(list[i]['time_id'])
      array.unshift(list[i]['time_id'])
    }
    console.log(array);
    d = [];
    a = [];
    ojb2 = new Object();
    for (let j in array) {
      console.log("round", d[i]);
      console.log(ojb2[a[i]])
      if (ojb2[array[j]] === undefined) {
        ojb2[array[j]] = 1;
      } else {
        console.log("test:", ojb2[array[j]])
        ojb2[array[j]]++;
      }
    }
    console.log("all of the time_ids:" ,ojb2);
    result = true;
    for (let k in ojb2) {
      if (ojb2[k] !== 1) {
        return false
      }
    }
    return result;
  }

  function insertModulesId(email, module_id, callback) {
    var email = email;
    var sql_student_id = `select student_id from students where email = ?`;
    db.all(sql_student_id, email, function (err, student_id) {
      if (err) {
        console.log("student_id can't be found")
      } else {
        var sql = 'INSERT INTO student_modules_mapping(student_id, modules_id) VALUES (?,?)';
        //console.log("Processing module inside Id",modules_id);
        var student_id = student_id[0].student_id;
        console.log("student_id :", student_id);
        console.log("module_id :",  module_id)
        db.run(sql, [parseInt(student_id), parseInt(module_id)], function (err) {
            if (err) {
              callback(err)
            } else {
              console.log("module_id inserted", module_id)
              callback(null, "Module Insert Success")
            }
          })

      }
    })
  }
};
exports.delModules = function (modules_id, callback) {
  var modules_id = modules_id
  var sql_delete_module_id_smm = `DELETE FROM student_modules_mapping WHERE modules_id = ?`;
  var sql_delete_module_m = `DELETE FROM modules WHERE module_id = ?`;
  var sql_delete_module_mt = `DELETE FROM modules_time WHERE module_id = ?`;
  db.run(sql_delete_module_id_smm, modules_id, function (err) {
    if (err) {
      callback(err)
    } else {
      db.run(sql_delete_module_m, modules_id, function (err) {
        if (err) {
          callback(err)
        } else {
          db.run(sql_delete_module_mt, modules_id, function (err) {
            if (err) {
              callback(err)
            } else {
              //callback()
              console.log("delete the column")
            }
          });
          callback()
        }
      })
    }

  })

};

