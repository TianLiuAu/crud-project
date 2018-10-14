//loading package

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('../../CRUD.db');

exports.updateTimetable = function(module_time, callback) {
    let sql = `INSERT INTO modules_time(module_id, time_id) VALUES(?,?)`;
    var module_id = parseInt(module_time.module_id);
    var time_id = module_time.time_id;
    for (var i in time_id){
        db.run(sql, [module_id, parseInt(time_id[i])], function(err) {
            if(err){
                callback(err)
            }else{
                callback();
            }

        })
    }
};

exports.listTime = function(module_id, callback) {
    let sql_module = `SELECT mt.module_id, t.weekday, t.start_time, t.end_time FROM timetable as t join modules_time as mt on t.time_id = mt.time_id WHERE mt.module_id= ?`;
    db.all(sql_module, [module_id], (err, time) => {
        if (err) {
            throw err;
        }
        console.log(time);
        callback(null, time);
    });
};