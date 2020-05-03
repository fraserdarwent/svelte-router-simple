const log = require('node-log-simple');
require('svelte/register');

exports.run = function () {
  log.info('[Router] Running tests');

  const HelloWorld = require('../HelloWorld/HelloWorld.svelte').default;

  const Router = require('./Router.svelte').default;

  try {
    const { head, html, css } = Router.render({
      routes: [
        {
          path: '/',
          component: HelloWorld,
        },
      ],
    });
  } catch (error) {
    log.error('[Router] Test failed');
    log.error(`[Router] ${error}`);
  }
};
