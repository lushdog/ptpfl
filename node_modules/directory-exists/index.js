var fs = require('fs');
var resolvePath = require('path').resolve;

module.exports = function(directory, callback) {
  if (!directory || typeof directory !== 'string') {
    throw new TypeError('directory-exists expects a non-empty string as its first argument');
  }

  if (typeof callback === 'undefined') {

    return new Promise(function(resolve, reject) {
      fs.stat(resolvePath(directory), function(err, stat) {
        if (err) {
          return resolve(false);
        }
        resolve(stat.isDirectory());
      });
    });

  } else {

    fs.stat(resolvePath(directory), function(err, stat) {
      if (err) {
        return callback(null, false);
      }
      callback(null, stat.isDirectory());
    });
    
  }

};

module.exports.sync = function(directory) {
  if (!directory || typeof directory !== 'string') {
    throw new TypeError('directory-exists expects a non-empty string as its first argument');
  }

  try {
    return fs.statSync(resolvePath(directory)).isDirectory();
  } catch (e) {
    return false;
  }
};
