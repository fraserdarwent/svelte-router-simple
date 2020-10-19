<script context="module">
  import 'array-flat-polyfill';

  let method = 'path';
  let fallback = null;

  export const go = function (pathname) {
    console.error(
      `[@fraserdarwent/svelte-router] Function "go" is deprecated and will be removed in future version, please use "route" instead`
    );
    route(pathname);
  };

  export const route = function (pathname) {
    switch (method) {
      case 'hash': {
        window.history.pushState({}, '', `#${pathname}`);
        break;
      }
      case 'path': {
        window.history.pushState({}, '', pathname);
        break;
      }
    }
    window.dispatchEvent(new Event('pushState'));
  };

  const matchRoute = function (route, pathname) {
    return route.path === '/*' || route.path === `/${pathname}`;
  };

  export const matchRoutes = function (routes = [], pathname, index = 1) {
    const pathParts = pathname.split('/');

    if (routes.length < 1) {
      return null;
    }
    const matched = routes.find(route => matchRoute(route, pathParts[index]));

    if (matched) {
      return matchRoutes(matched.routes, pathname, index + 1) || matched.component;
    }

    return fallback;
  };

  const matchLocation = function (routes) {
    let pathname = '/';
    switch (method) {
      case 'hash': {
        if (window.location.hash) {
          pathname = window.location.hash.substring(1, window.location.hash.length);
        }
        break;
      }
      case 'path': {
        pathname = window.location.pathname;
        break;
      }
    }

    return matchRoutes(routes, pathname);
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

  export const setMethod = function (m) {
    method = m;
  };

  export const setFallback = function (f) {
    fallback = f;
  };
</script>

<script>
  import {onMount} from 'svelte';
  export let routes;
  export let fallback;
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

    setMethod(method);

    setFallback(fallback);

    if (validRoutes) {
      component = matchLocation(routes);
      window.addEventListener('pushState', function () {
        component = matchLocation(routes);
      });

      window.addEventListener('hashchange', function () {
        component = matchLocation(routes);
      });

      window.onpopstate = function () {
        component = matchLocation(routes);
      };
    }
  });
</script>

<svelte:component this={component} />
