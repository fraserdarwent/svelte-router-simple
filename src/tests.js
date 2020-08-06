const log = require("@fraserdarwent/javascript-logger");
log.setLevel(log.levels.DEBUG);
const tests = [];
tests.push(require("./components/Router/tests.js"));
const errors = tests.flatMap((test) => {
  return test.run();
});
const success = !errors.some((error) => {
  if (error) {
    log.error(error);
    return true;
  }
});
process.exit(success ? 0 : 1);
