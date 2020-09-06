require("svelte/register");
const log = require("@fraserdarwent/javascript-logger");
const { route, getComponent, validateRoutes } = require("./");
const assert = require("assert");

global.Event = function Event(e) {
  this.e = e;
};

global.window = {
  history: { pushState: () => {} },
  dispatchEvent: () => {},
};

function testDepthZero() {
  const routes = [
    {
      exact: "/",
      component: "test",
    },
  ];
  try {
    assert.ok(validateRoutes(routes));
    assert.equal(getComponent("/", routes), "test");
  } catch (error) {
    return error;
  }
}

function testDepthOne() {
  const Router = require(".").default;
  try {
    const { head, html, css } = Router.render({
      routes: [
        {
          path: "/hello-my-world",
          component: require("../HelloWorld").default,
        },
      ],
    });
  } catch (error) {
    return error;
  }
}

function testDepthTwo() {
  const Router = require(".").default;
  try {
    const { head, html, css } = Router.render({
      routes: [
        {
          path: "/hello/my-world",
          component: require("../HelloWorld").default,
        },
      ],
    });
  } catch (error) {
    return error;
  }
}

function testDepthThree() {
  const Router = require(".").default;
  try {
    const { head, html, css } = Router.render({
      routes: [
        {
          path: "/hello/my/world",
          component: require("../HelloWorld").default,
        },
      ],
    });
  } catch (error) {
    return error;
  }
}

function testDepthThreeWildcard() {
  const Router = require(".").default;
  try {
    const { head, html, css } = Router.render({
      routes: [
        {
          path: "/hello/*/world",
          component: require("../HelloWorld").default,
        },
      ],
    });
  } catch (error) {
    return error;
  }
}

exports.run = function () {
  let tests = [];
  tests.push(testDepthZero);
  tests.push(testDepthOne);
  tests.push(testDepthTwo);
  tests.push(testDepthThree);
  tests.push(testDepthThreeWildcard);
  return tests.map((test) => {
    return test();
  });
};
