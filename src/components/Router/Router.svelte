<script context="module">
  export function go(pathname) {
    window.location.replace(pathname);
  }
</script>

<script>
  import { onMount } from "svelte";
  export let routes;

  const log = require("node-log-simple");

  // location.subscribe((value) => {
  //   setUrl(value.route);
  //   setView(value.route);
  // });

  let component;

  onMount(async () => {
    if (!validateRoutes()) {
      component = route(window.location.pathname, routes);
    } else {
      log.error("[svelte-router-simple] No matching route found");
    }
  });

  function route(pathname, routes = []) {
    log.debug(`[svelte-router-simple] Routing "${pathname}"`);
    function match(pathname, routes = []) {
      const matched = routes.find(route => {
        // If prefix matches
        if (route.exact) {
          return pathname == route.exact;
        } else if (route.prefix) {
          return pathname.startsWith(route.prefix);
        }
      });
      // Return matching component or false
      return matched && (match(pathname, matched.routes) || matched.component);
    }
    return match(pathname, routes);
  }

  function validateRoutes() {
    routes.flat(Infinity).every(route => {
      if (!route.component) {
        log.error(
          `[svelte-router-simple] Route "${route.prefix}" is missing required key "component"`
        );
        return false;
      }
      if (route.exact && route.routes && 0 < route.routes.length) {
        log.error(
          `[svelte-router-simple] Route "${route.exact}" of type "exact" should not have routes as they will be ignored`
        );
        return false;
      }
      return true;
    });
  }
</script>

<div>
  <svelte:component this={component} />
</div>
