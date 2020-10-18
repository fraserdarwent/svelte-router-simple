<script context="module">
  import 'array-flat-polyfill';

  export const go = function (pathname) {
    console.error(
      `[@fraserdarwent/svelte-router] Function "go" is deprecated and will be removed in future version, please use "route" instead`
    );
    route(pathname);
  };

  export const route = function (pathname) {
    window.history.pushState({}, '', pathname);
    window.dispatchEvent(new Event('pushState'));
  };

  const newPathname = function (route, pathname) {
    return pathname.substring(pathname.indexOf('/', 1), pathname.length);
  };

  const matchRoute = function (route, pathname) {
    console.log(`Matching route ${route.path} to ${pathname}`);

    if (route.path === '/*') {
      return true;
    }

    return pathname.startsWith(route.path);
  };

  export const matchRoutes = function (routes = [], pathname) {
    console.log(`Matching ${JSON.stringify(routes)} to ${pathname}`);

    if (routes.length < 1) {
      return null;
    }

    const matched = routes.find(route => matchRoute(route, pathname));

    if (matched) {
      console.log(`Matched ${JSON.stringify(matched)}`);
      pathname = newPathname(matched, pathname);
      return matchRoutes(matched.routes, pathname) || matched.component;
    }

    return null;
  };

  const matchLocation = function (routes) {
    return matchRoutes(routes, window.location.pathname);
  };

  export const validateRoutes = function (routes) {
    const valid = routes.flat().every(route => {
      // If route has no component
      if (!route.component) {
        console.error(
          `[@fraserdarwent/svelte-router] All routes must have required key "component"`
        );
        return false;
      }
      // If route has no exact or prefix
      if (!route.path) {
        console.error(`[@fraserdarwent/svelte-router] All routes must have required key "path"`);
        return false;
      }
      return true;
    });
    return valid;
  };

  export const validateMethod = function (method) {
    switch (method) {
      case 'path':
      case 'hash': {
        break;
      }
      default: {
        throw new Error(
          `[@fraserdarwent/svelte-router] Unknown method "${method}", falling back to "path"`
        );
      }
    }
  };
</script>

<script>
  import {onMount} from 'svelte';
  export let routes;
  export let method = 'path';

  let component;

  onMount(async function () {
    const validRoutes = validateRoutes(routes);

    try {
      validateMethod(method);
    } catch (error) {
      method = 'path';
      console.error(error.message);
    }

    if (validRoutes) {
      component = matchLocation(routes, method);
      window.addEventListener('pushState', function () {
        component = matchLocation(routes, method);
      });

      window.onpopstate = function (event) {
        component = matchLocation(routes, method);
      };
    }
  });
</script>

<svelte:component this={component} />
