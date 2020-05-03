const log = require('node-log-simple');
require('svelte/register');

function testRender() {
  const Router = require('./Router.svelte').default;
  try {
    const { head, html, css } = Router.render({
      routes: [
        {
          path: '/',
          component: require('../HelloWorld/HelloWorld.svelte').default,
        },
      ],
    });
  } catch (error) {
    return `[Router] ${error}`;
  }
}

exports.run = function () {
  let tests = [];
  tests.push(testRender);
  return tests.map((test) => {
    return test();
  });
};
