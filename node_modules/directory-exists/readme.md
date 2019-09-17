# directory-exists [![Build Status](https://travis-ci.org/timmydoza/directory-exists.svg?branch=master)](https://travis-ci.org/timmydoza/directory-exists)

> Check if a directory exists - synchronously or asynchronously

## Install

```
$ npm install --save directory-exists
```

## Usage:
`directory` should be a string of a relative or absolute path.

### Asynchronous

##### With Callback:

```js
const directoryExists = require('directory-exists');

directoryExists(directory, (error, result) => {
  console.log(result); // result is a boolean
});
```

##### With Promise:
If no callback function is supplied, directoryExists returns a promise.

```js
const directoryExists = require('directory-exists');

directoryExists(directory).then(result => {
  console.log(result); // result is a boolean
});
```

##### Async/await:

```js
const directoryExists = require('directory-exists');

(async function() {
  const result = await directoryExists(directory);
  console.log(result);  // result is a boolean
})();
```

### Synchronous

```js
const directoryExists = require('directory-exists');

directoryExists.sync(directory); // retuns a boolean
```

## Why not use `fs.exists`?
Because asynchronous `fs.exists` is [deprecated](https://nodejs.org/api/fs.html#fs_fs_exists_path_callback). Synchronous `fs.existsSync` is still [fine](https://nodejs.org/api/fs.html#fs_fs_existssync_path) to use, but this library does both sync and async.

## License

MIT © timmydoza
