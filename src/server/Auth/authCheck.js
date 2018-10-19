/**
* Authentication check module
* @module ../auth/authCheck
* @see ../auth/authCheck
*/

var jwt = require('jsonwebtoken');

/**
 * authentic if user have the right token to login
 * @param {string} token - the token that need to be verified.
 * @param {function} callback - return whether the verification successful or not
 */
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
