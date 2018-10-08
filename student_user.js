//const module_time = require('./module_time')
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./CRUD.db');

exports.findModulesbyUser = function(email, callback) {

    let sql = `select m.* from students as s join student_modules_mapping as smm join modules as m on s.student_id = smm.student_id and smm.modules_id=m.module_id where s.email = ?`;
    let name = email;
    console.log("input email is :", email);
    db.all(sql, [name], (err, modules) => {
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

exports.findTimeByUser = function(email, callback) {
    let sql = `SELECT mt.module_id, t.weekday, t.start_time, t.end_time FROM timetable as t join modules_time as mt on t.time_id = mt.time_id WHERE mt.module_id in (select m.module_id from students as s join student_modules_mapping as smm join modules as m on s.student_id = smm.student_id and smm.modules_id=m.module_id where s.email = ?) order by t.time_id`
    let name = email;
    db.all(sql, [name], (err, timetable) => {
        if (err) {
            throw err;
        }
        console.log(timetable);
        callback(null, timetable);
    });
};



