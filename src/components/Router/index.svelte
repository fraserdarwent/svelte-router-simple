<script context="module">
  import "array-flat-polyfill";

  export function go(pathname) {
    console.error(
      `[@fraserdarwent/svelte-router] Function "go" is deprecated and will be removed in future version, please use "route" instead`
    );
    route(pathname);
  }

  export function route(pathname) {
    window.history.pushState({}, "", pathname);
    window.dispatchEvent(new Event("pushState"));
  }

  export function getComponent(pathname, routes = []) {
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

  function getCurrentComponent(routes) {
    return getComponent(window.location.pathname, routes);
  }

  export function validateRoutes(routes) {
    const valid = routes.flat().every(route => {
      if (!route.component) {
        console.error(
          `[@fraserdarwent/svelte-router] Route "${route.prefix}" is missing required key "component"`
        );
        return false;
      }
      if (!route.exact && !route.prefix) {
        console.error(
          `[@fraserdarwent/svelte-router] All routes must have one of "exact" or "prefix"`
        );
        return false;
      }
      if (route.exact && route.routes && 0 < route.routes.length) {
        console.error(
          `[@fraserdarwent/svelte-router] Route "${route.exact}" of type "exact" should not have routes as they will be ignored`
        );
        return false;
      }
      return true;
    });
    return valid;
  }
</script>

<script>
  import { onMount } from "svelte";
  export let routes;

  let component;

  onMount(async () => {
    const validRoutes = validateRoutes(routes);
    if (validRoutes) {
      component = getCurrentComponent(routes);
      window.addEventListener("pushState", function() {
        component = getCurrentComponent(routes);
      });

      window.onpopstate = function(event) {
        component = getCurrentComponent(routes);
      };
    }
  });
</script>

<svelte:component this={component} />
