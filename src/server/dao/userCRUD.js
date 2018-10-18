const SQLITE3 = require('sqlite3').verbose();
var db = new SQLITE3.Database('../../CRUD.db');

exports.authUser = function(user, callback) {
  var sql_pass = `SELECT password FROM login WHERE username= ?`;
  var name = user.username;

  if(user.username === undefined || user.password === undefined){
    callback('User login information is not right');
  }

  db.get(sql_pass, [name], function(err, pass) {
    try{
      if (user.password === pass.password) {
        callback(null, true, user.username);
      }else{
        callback(null, false);
      }}
    catch(err) {
      callback(err);
    }
  })
};

exports.addUser = function(user, callback) {
  var repr_email = /@uts\.edu\.au\b/i;
  var repr_name = /^([A-Za-z].*)/;

  if(user.age === undefined){
    callback('Cannot age as blank', 1);
  }else if(user.name === undefined){
    callback('Cannot leave username as blank', 1);
  }else if (user.name.match(repr_name) === null){
    callback('UserName can only be string', 1);
  }else if(user.address === undefined){
    callback('Cannot leave address as blank', 1);
  }else if(user.password.length < 6 || user.password.length > 20){
    callback('Password length needs between 6 to 20 characters', 1);
  }else if(user.age >= 70){
    callback('Age cannot be higher than 70', 2);
  }else if(user.age <= 6){
    callback('Age cannot be lower than 6', 2);
  }else if(repr_email.test(user.email)===true){
    var sql_student = `INSERT INTO students(name,age,address,email,role, like_status) VALUES(?,?,?,?,?,?)`;
    var sql_user = `INSERT INTO login(username,password) VALUES(?,?)`;
    var sql_search_exist_email = `SELECT username FROM login WHERE username = (?)`;

    db.get(sql_search_exist_email, [user.email], function(err, email_in_db) {
      if(email_in_db){
        callback('The User email already registered', 4);
      }else{
        db.run(sql_student, [user.name, user.age, user.address, user.email, 'User', 'false'], function (err) {
          db.run(sql_user, [user.email, user.password]);

          if (err) {
            callback('Cannot register your information');
          }

          console.log('A row has been inserted with row ID');
          callback(null, 0, "Completed register Your Information");
        })}
    })

  }else{
    callback('Please use UTS email', 3);
  }
};

exports.findModulesByUser = function(email, callback) {
  var name = email;
  var sql = `SELECT m.* 
             FROM students AS s JOIN student_modules_mapping AS smm JOIN modules AS m 
             ON s.student_id = smm.student_id AND smm.modules_id=m.module_id 
             WHERE s.email = ?`;

  db.all(sql, [name], (err, modules) => {
    if (err) {
      throw err;
    }
    console.log(modules);
    callback(null, modules);
  });
};

exports.findTimeByUser = function(email, callback) {
  var name = email;
  var sql = `SELECT mt.module_id, t.weekday, t.start_time, t.end_time 
             FROM timetable AS t JOIN modules_time AS mt ON t.time_id = mt.time_id 
             WHERE mt.module_id IN (
                   SELECT m.module_id 
                   FROM students AS s join student_modules_mapping AS smm join modules AS m 
                   ON s.student_id = smm.student_id AND smm.modules_id=m.module_id 
                   WHERE s.email = ?) 
             ORDER BY t.time_id`;

  db.all(sql, [name], (err, timetable) => {
    if (err) {
      throw err;
    }
    console.log(timetable);
    callback(null, timetable);
  });
};
