const log = require('node-log-simple');
const tests = [];
tests.push(require('./components/Router/tests.js'));
const errors = tests.map((test) => {
  return test.run();
});
const success = errors.some((error) => {
  if (error != '') {
    log.error(error);
  }
  return error;
});
process.exit(success ? 0 : 1);
