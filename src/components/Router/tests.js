require('svelte/register');

function testRender() {
  const Router = require('.').default;
  try {
    const {head, html, css} = Router.render({
      routes: [
        {
          path: '/',
          component: require('../HelloWorld').default,
        },
      ],
    });
  } catch (error) {
    return error;
  }
}

exports.run = function () {
  let tests = [];
  tests.push(testRender);
  return tests.map(test => {
    return test();
  });
};
