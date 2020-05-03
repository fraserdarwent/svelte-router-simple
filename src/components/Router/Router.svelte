<script>
  const log = require("node-log-simple");

  export let routes;

  const pathname = window.location.pathname;

  function matchRoute(routes) {
    log.debug(`[Router] ${JSON.stringify(routes)}`);
    const match = routes.find(route => {
      // If prefix matches
      if (route.exact) {
        return pathname == route.exact;
      } else if (route.prefix) {
        return pathname.startsWith(route.prefix);
      }
    });
    // Return matching component or false
    return match && (matchRoute(match.routes) || match.component);
  }

  const component = matchRoute(routes);

  if (!component) {
    log.error("[Router] No matching route found");
  }

  function validateRoutes() {
    routes.flat(Infinity).forEach(route => {
      if (!route.component) {
        log.error(
          `[Router] Route "${route.prefix}" is missing required key "component"`
        );
      }
      if (route.exact && 0 < route.routes.length) {
        log.error(
          `[Router] Route "${route.exact}" of type "exact" should not have routes as they will be ignored`
        );
      }
    });
  }

  validateRoutes();
</script>

<div>
  <svelte:component this={component} />
</div>
