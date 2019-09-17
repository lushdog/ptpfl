var chai = require('chai');
var expect = chai.expect;

var directoryExists = require(__dirname + '/../index.js');

var ERROR_MSG = 'directory-exists expects a non-empty string as its first argument';

describe('The directoryExists function (callback)', function() {
  it('return true if a directory exists and is a directory', function(done) {
    directoryExists(__dirname, function(error, result) {
      expect(error).to.be.null;
      expect(result).to.eql(true);
      setImmediate(done);
    });
  });

  it('should return false if path does not exist', function(done) {
    directoryExists(__dirname + '/fakeDirectory', function(error, result) {
      expect(error).to.be.null;
      expect(result).to.eql(false);
      setImmediate(done);
    });
  });

  it('should return false if path is a file', function(done) {
    directoryExists(__dirname + '/directory-exists-test.js', function(error, result) {
      expect(error).to.be.null;
      expect(result).to.eql(false);
      setImmediate(done);
    });
  });

  it('should throw an error if the directory argument is an empty string', function() {
    var badFn = function() {
      directoryExists('', function() {});
    }
    expect(badFn).to.throw(TypeError, ERROR_MSG);
  });

  it('should throw an error if the directory argument not a string', function() {
    var badFnNumber = function() {
      directoryExists(1234, function() {});
    }

    var badFnFunction = function() {
      directoryExists(function() {});
    }

    var badFnUndefined = function() {
      directoryExists();
    }
    expect(badFnNumber).to.throw(TypeError, ERROR_MSG);
    expect(badFnFunction).to.throw(TypeError, ERROR_MSG);
    expect(badFnUndefined).to.throw(TypeError, ERROR_MSG);

  });
});

describe('The directoryExists function (promise)', function() {
  it('return true if a directory exists and is a directory', function(done) {
    directoryExists(__dirname).then(function(result) {
      expect(result).to.eql(true);
      setImmediate(done);
    });
  });

  it('should return false if path does not exist', function(done) {
    directoryExists(__dirname + '/fakeDirectory').then(function(result) {
      expect(result).to.eql(false);
      setImmediate(done);
    });
  });

  it('should return false if path is a file', function(done) {
    directoryExists(__dirname + '/directory-exists-test.js').then(function(result) {
      expect(result).to.eql(false);
      setImmediate(done);
    });
  });

});

describe('The directoryExists.sync function', function() {
  it('return true if a directory exists and is a directory', function() {
    var result = directoryExists.sync(__dirname);
    expect(result).to.eql(true);
  });

  it('should return false if path does not exist', function() {
    var result = directoryExists.sync(__dirname + '/fakeDirectory');
    expect(result).to.eql(false);
  });

  it('should return false if path is a file', function() {
    var result = directoryExists.sync(__dirname + '/directory-exists-test.js');
    expect(result).to.eql(false);
  });

  it('should throw an error if the directory argument is an empty string', function() {
    var badFn = function() {
      directoryExists.sync('');
    }
    expect(badFn).to.throw(TypeError, ERROR_MSG);
  });

  it('should throw an error if the directory argument not a string', function() {
    var badFnNumber = function() {
      directoryExists.sync(1234);
    }

    var badFnFunction = function() {
      directoryExists.sync(function() {});
    }

    var badFnUndefined = function() {
      directoryExists.sync();
    }
    expect(badFnNumber).to.throw(TypeError, ERROR_MSG);
    expect(badFnFunction).to.throw(TypeError, ERROR_MSG);
    expect(badFnUndefined).to.throw(TypeError, ERROR_MSG);

  });
});
