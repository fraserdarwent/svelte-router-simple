<script>
  export let routes;
  let component = routes[0].component;
</script>

<div>
  <svelte:component this={component} />
</div>
