//loading package

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../../CRUD.db');

//List out all of the student information

exports.findAll = function(callback) {

    let sql = `SELECT * FROM students`;

    db.all(sql, [], (err, student) => {
        if (err) {
            throw err;
        }
        console.log(student);
        callback(null, student);
    });

// close the database connection
    //db.close();
};

exports.save = function(student, callback){
    let sql = `INSERT INTO students(name,age,address,email,role) VALUES(?,?,?,?,?)`;
    let sql_login = `INSERT INTO login(username,password) VALUES(?,?)`;
    db.run(sql, [student.name, student.age, student.address, student.email, student.role], function(err) {
        db.run(sql_login, [student.email,student.password] , function(err) {
            if(err){
                callback(err)
            }
            else{
                console.log("update completed")
            }
        });
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

exports.deleteUser = function(email, callback){
    var sql_delete_student = `DELETE FROM students where email =?`;
    var sql_delete_login = `DELETE FROM login where username =?`;
    db.run(sql_delete_student, email, function(err) {
        if(err){
            callback(err)
        }else{
            db.run(sql_delete_login, email, function(err) {
                if(err){
                    callback(err)
                }else{
                    callback()
                }
            })
        }

    })

};

exports.authUser = function(user, callback) {
    let sql_pass = `SELECT password FROM login WHERE username= ?`;
    let name = user.username;
    if(user.username === undefined || user.password === undefined)
      callback(err);
    console.log(user);
    db.get(sql_pass, [name], function(err, pass) {
      try{
      if (user.password === pass.password) {
        callback(null, true, user.username)
      }else{
        callback(null, false)
      }}
      catch(err) {
        callback(err)
      }
    })
};


exports.addUser = function(user, callback) {
    var repr_email = /@uts\.edu\.au\b/i;
    var repr_name = /^([A-Za-z].*)/;
    var repr_password = /.*.{6,20}/;
    console.log(user);
    console.log(user.password);
    console.log("the username is:",user.name);
    if(user.age === undefined){
      callback("Can't age as blank", 1)
    }else if(user.name === undefined){
      callback("Can't leave username as blank", 1)
    }else if (user.name.match(repr_name) === null){
      callback("UserName Can't Support Number", 1)
    }else if(user.address === undefined){
      callback("Can't leave address as blank", 1)
    }else if(user.password.length <= 6 || user.password.length >= 20){
      callback("Password need  6 to 20 charactors", 1)
    }else if(user.age >= 70){
      callback("Age can't be higher to 70", 2)
    }else if(user.age <= 6){
      callback("Age can't be lower to 6", 2)
    }else if(repr_email.test(user.email)===true){
    let sql_student = `INSERT INTO students(name,age,address,email,role, like_status) VALUES(?,?,?,?,?,?)`;
    let sql_user = `INSERT INTO login(username,password) VALUES(?,?)`;
    let sql_search_exist_email = `select username from login where username = (?)`;
    db.get(sql_search_exist_email, [user.email], function(err, email_in_db) {
      if(email_in_db){
        callback("the User email already registed", 4)
      }else{
        console.log(email_in_db);
        db.run(sql_student, [user.name, user.age, user.address, user.email, 'User', 'false'], function (err) {
        db.run(sql_user, [user.email, user.password]);
        if (err) {
          callback("Can't register your information");
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid`);
        callback(null, 0, "Completed Registe Your Information");
      })}
    })
  }else{
        callback("Please use UTS email", 3)
    }
};



