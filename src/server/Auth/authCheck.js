var jwt = require('jsonwebtoken');

exports.tokenVerify = function(token, callback){
  jwt.verify(token, 'shhhhh', function(err, decoded) {
    if(err) {
        callback(err);
    }else{
      console.log(decoded);
      callback(null, {success:true});
    }
  })
};
