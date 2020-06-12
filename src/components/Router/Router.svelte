<script context="module">
  export function go(pathname) {
    window.history.pushState({}, "", pathname);
    window.dispatchEvent(new Event("pushState"));
  }
</script>

<script>
  import "array-flat-polyfill";
  import { onMount } from "svelte";
  export let routes;

  const log = require("node-log-simple");

  let component;

  onMount(async () => {
    findRoute();
    window.addEventListener("pushState", function() {
      findRoute();
    });

    window.onpopstate = function(event) {
      findRoute();
    };
  });

  function findRoute() {
    if (!validateRoutes()) {
      component = route(window.location.pathname, routes);
    } else {
    }
  }

  function route(pathname, routes = []) {
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
    routes.flat().every(route => {
      if (!route.component) {
        console.log(
          `[svelte-router-simple] Route "${route.prefix}" is missing required key "component"`
        );
        return false;
      }
      if (route.exact && route.routes && 0 < route.routes.length) {
        console.log(
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
