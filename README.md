# svelte-router

## Installation

```bash
yarn add svelte-router-simple
```

## Usage

```javascript
  import Router from "svelte-router-simple";

  const routes = [
    {
      exact: "/", // Specify an exact path match
      component: HomeComponent
    },
    {
      prefix: "/", // Specify a prefix path match, and attempt to match child routes
      component: NotFound, // Used if no child routes match
      routes: [
        { exact: "/videos", component: VideosComponents },
        { exact: "/pictures", component: PicturesComponent },
      ],
    },
  ];
</script>

<div id="app">
  <Router {routes} />
</div>
```
