import 'svelte/register.js';
import log from '@fraserdarwent/javascript-logger';
import assert from 'assert';
import {route, matchRoutes, validateRoutes, validateMethod} from './components/Router.svelte';

let tests = [];

global.Event = function Event(e) {
  this.e = e;
};

global.window = {
  history: {pushState: () => {}},
  dispatchEvent: () => {},
};

tests.push(function testInvalidMethod() {
  try {
    validateMethod('foo');
    return error;
  } catch (error) {}
});

tests.push(function validMethod() {
  try {
    validateMethod('path');
  } catch (error) {
    return error;
  }
});

tests.push(function validMethod() {
  try {
    validateMethod('hash');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthZero() {
  const routes = [
    {
      path: '/',
      component: 'true',
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/'), 'true');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthOne() {
  const routes = [
    {
      path: '/false',
      component: 'false',
    },
    {
      path: '/true',
      component: 'true',
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/true'), 'true');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthTwo() {
  const routes = [
    {
      path: '/true',
      component: 'false',
      routes: [
        {path: '/true', component: 'true'},
        {path: '/false', component: 'false'},
      ],
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/true/true'), 'true');
    assert.equal(matchRoutes(routes, '/true/false'), 'false');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthThree() {
  const routes = [
    {
      path: '/true',
      component: 'false',
      routes: [
        {
          path: '/*',
          component: 'false',
          routes: [{path: '/true', component: 'true'}],
        },
      ],
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/true/true/true'), 'true');
    assert.equal(matchRoutes(routes, '/true/true/false'), 'false');
    assert.equal(matchRoutes(routes, '/true/false/false'), 'false');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthThreeWildcard() {
  const routes = [
    {
      path: '/true',
      component: 'false',
      routes: [
        {
          path: '/*',
          component: 'true',
          routes: [{path: '/true', component: 'true'}],
        },
      ],
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/true/true/true'), 'true');
  } catch (error) {
    return error;
  }
});

const errors = tests.flatMap(test => {
  const error = test();
  if (error) {
    return `${test.name} ${error}`;
  }
});

const success = !errors.some(error => {
  if (error) {
    log.error(error);
    return true;
  }
});

process.exit(success ? 0 : 1);
