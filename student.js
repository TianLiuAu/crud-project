/**
 * read all of student information
 * return: []
 *
 */
var fs = require('fs')

exports.findAll = function(callback) {
    fs.readFile('./data.json', function(err, data) {
        if(err){
            return callback(err)
        }
        callback(null, JSON.parse(data).student);
    })
};

