//loading package

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./CRUD.db');

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
//     db.close((err)=>{
//         if (err){
//             return console.error(err.message);
//         }
//         console.log('Close the DB connection.');
//     });
};

exports.AddMoudules = function(module, callback) {

    let sql = `INSERT INTO modules(name,coodinator,description) VALUES(?,?,?)`;
    db.run(sql, [module.name, module.coodinator, module.description], function(err) {
        if (err) {
            callback(err);
        }
        // get the last insert id
        console.log('A row has been inserted with rowid');
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

exports.deleteModules = function(module_id,callback){
    let sql = `DELETE FROM modules WHERE module_id = ?`;
    db.run(sql,[module_id],function (err) {
        if(err) {
            callback(err);
        }
        console.log('a row has been removed');
        callback();
    })
}

exports.chooseModules = function(user_mail, modules, callback) {
    var user_mail = user_mail;
    var modules = modules;
    chosenmodule(user_mail, function (err, ctime_ids) {
        if (err) {
            console.log("error callback")
        } else {
            console.log("choose modules", ctime_ids);
            currentmodules(modules, function (err, ntime_ids) {
                if (err) {
                    callback(err)
                } else {
                    console.log("current modules", ntime_ids);
                    alltime_ids = ctime_ids.concat(ntime_ids);
                    console.log(alltime_ids);
                    result = checkrepeat(alltime_ids);
                    console.log("result is :",result);
                    if(result === true){
                        console.log("input usermial is :",user_mail)
                        insertModulesId(user_mail, modules, function(err) {
                            if(err){
                                callback(err)
                            }else{
                                callback()
                            }
                        })
                    }
                }

            })
        }

    });

//    };
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

    function currentmodules(modules, callback) {
        console.log(typeof modules);
        console.log(modules);
        if(modules instanceof Object){
        var sql = `select time_id from modules_time where module_id in (` + modules.map(function () {
            return '?'
        }).join(',') + ')';}else{
            var sql = `select time_id from modules_time where module_id = ?`
        }
        db.all(sql, modules, function (err, time_ids) {
            if (err) {
                callback(err)
            } else {
                callback(null, time_ids)
            }

        })
    };

    function checkrepeat(list) {
        array = []
        for (var i in list) {
            console.log(list[i]['time_id'])
            array.unshift(list[i]['time_id'])
        }
        console.log(array);

        ojb2 = new Object();
        for (var j in array) {
            //console.log("round",d[i]);
            //console.log(ojb2[a[i]])
            if (ojb2[array[j]] === undefined) {
                ojb2[array[j]] = 1;
            } else {
                console.log("test:", ojb2[array[j]])
                ojb2[array[j]]++;
            }
        }

        console.log(ojb2)

        for (var k in ojb2) {
            if (ojb2[k] !== 1) {
                return false
            }
            else {
                return true
            }
        }
    }
    function insertModulesId(email, modules_ids,callback) {
            var email = email;
            var sql_student_id = `select student_id from students where email = ?`;
            db.all(sql_student_id, email, function(err, student_id) {
                if(err){
                    console.log("student_id can't be found")
                }else{
                        var sql = 'INSERT INTO student_modules_mapping(student_id, modules_id) VALUES (?,?)';
                        //console.log("Processing module inside Id",modules_id);
                        var student_id = student_id[0].student_id;
                        console.log("student_id :", student_id);
                    for (var modules_id in modules_ids){
                        var modules_id = modules_ids[modules_id];
                        db.run(sql, [parseInt(student_id), parseInt(modules_id)], function(err) {
                            if(err){
                                callback(err)
                            }else{
                                console.log("module_id inserted", modules_id)
                                callback()
                        }
                    })
                }
                }
            })
    }
};

