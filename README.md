# svelte-router

## Installation

```bash
yarn add @fraserdarwent/svelte-router
```

## Usage

```html
<script>
  import Router from '@fraserdarwent/svelte-router';
  import VideosComponent from './videos-components.svelte';
  import PicturesComponent from './pictures-components.svelte';

  const routes = [
    {
      path: '/',
      component: HomeComponent,
      routes: [
        {
          path: '/videos',
          component: VideosComponent,
        },
        {
          path: '/pictures',
          component: PicturesComponent,
        },
      ],
    },
  ];
</script>

<div id="app">
  <Router {routes} />
</div>
```

### To Use Hash Routing Method

```html
<Router {routes} method="hash" />
```

### To Navigate

```html
<script>
  import {route} from '@fraserdarwent/svelte-router';
</script>
<button on:click={()=>{route('/videos')}}>Videos</button>
```
