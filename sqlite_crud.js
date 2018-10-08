//loading package

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./CRUD.db');

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
//     db.close((err)=>{
//         if (err){
//             return console.error(err.message);
//         }
//         console.log('Close the DB connection.');
//     });
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
    // db.close((err)=>{
//         if (err){
//             return console.error(err.message);
//         }
//         console.log('Close the DB connection.');
//     });
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

exports.searchById = function(student, callback) {
    let sql = 'SELECT * '

};

exports.delete = function() {

};

exports.authUser = function(user, callback) {
    let sql_pass = `SELECT password FROM login WHERE username= ?`;
    let sql_role = `SELECT role FROM students WHERE email= ?`;
    let name = user.username;

    db.get(sql_pass, [name], function (err, pass) {
        db.get(sql_role, [name], function(err, role) {
        if (err) {
            callback(err)
            //return(err)
        }
        try {
            if (user.password === pass.password)
                callback(null, true, role);
                //console.log("true", role);
                //return true
            else
                callback(null, false);
                //return false
        }
        catch(err) {
            callback(null, false);

        }
        })
    });
};

exports.addUser = function(user, callback) {
    var repr = /@uts\.edu\.au\b/i;
    if(repr.test(user.email)===true){
    let sql_student = `INSERT INTO students(name,age,address,email,role) VALUES(?,?,?,?,?)`;
    let sql_user = `INSERT INTO login(username,password) VALUES(?,?)`;
    db.run(sql_student, [user.name, user.age, user.address, user.email, 'User'], function(err) {
        db.run(sql_user, [user.email, user.password]);
        if (err) {
            callback(err);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid`);
        callback();
    });
}else{
        callback("Please user UTS email")
    }
};



