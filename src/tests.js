import 'svelte/register.js';
import log from '@fraserdarwent/javascript-logger';
import assert from 'assert';
import {
  route,
  matchRoutes,
  validateRoutes,
  validateMethod,
  setFallback,
} from './components/Router.svelte';

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

tests.push(function testFallback() {
  setFallback('a');
  const routes = [
    {
      path: '/b',
      component: 'b',
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/a'), 'a');
  } catch (error) {
    return error;
  }
});

tests.push(function testWildcard() {
  const routes = [
    {
      path: '/a',
      component: 'a',
    },
    {
      path: '/*',
      component: 'b',
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/b'), 'b');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthZero() {
  const routes = [
    {
      path: '/',
      component: 'a',
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/'), 'a');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthOne() {
  const routes = [
    {
      path: '/a',
      component: 'a',
    },
    {
      path: '/b',
      component: 'b',
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/a'), 'a');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthTwo() {
  const routes = [
    {
      path: '/a',
      component: 'a',
      routes: [
        {path: '/b', component: 'b'},
        {path: '/c', component: 'c'},
      ],
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/a/b'), 'b');
    assert.equal(matchRoutes(routes, '/a/c'), 'c');
  } catch (error) {
    console.error('Failure');
    return error;
  }
});

tests.push(function testDepthThree() {
  const routes = [
    {
      path: '/a',
      component: 'a',
      routes: [
        {
          path: '/b',
          component: 'b',
          routes: [
            {
              path: '/c',
              component: 'c',
            },
          ],
        },
      ],
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/a/b/c'), 'c');
  } catch (error) {
    return error;
  }
});

tests.push(function testDepthThreeWildcard() {
  const routes = [
    {
      path: '/a',
      component: 'a',
      routes: [
        {
          path: '/*',
          component: 'b',
          routes: [{path: '/c', component: 'c'}],
        },
      ],
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(matchRoutes(routes, '/a/b/c'), 'c');
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
