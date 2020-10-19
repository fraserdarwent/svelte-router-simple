# svelte-router

## Installation

```bash
yarn add @fraserdarwent/svelte-router
```

## Usage

```html
<script>
  import Router from '@fraserdarwent/svelte-router';
  import VideosComponent from './videos-component.svelte';
  import PicturesComponent from './pictures-component.svelte';
  import DogPicturesComponent from './dog-pictures-component.svelte';
  import CatPicturesComponent from './cat-pictures-component.svelte';
  import HomeComponent from './home-component.svelte';
  import FourOFour from './404.svelte';

  const routes = [
    {
      path: '/',
      component: HomeComponent,
    },
    {
      path: '/videos',
      component: VideosComponent,
    },
    {
      path: '/pictures',
      component: PicturesComponent,
      routes: [
        {
          // Effective route is /pictures/components
          path: '/dogs',
          component: DogPicturesComponent,
        },
        {
          // Effective route is /pictures/cats
          path: '/cats',
          component: CatPicturesComponent,
        },
      ],
    },
  ];
</script>

<div id="app">
  <Router {routes} fallback="{FourOFour}" />
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

### Setting A Fallback

A fallback component can be specified for when no route is matched

#### Using Fallback

```html
<script>
  import Router from '@fraserdarwent/svelte-router';
  import FourOFour from './404.svelte';

  const routes = [];
</script>

<div id="app">
  <Router {routes} fallback="{FourOFour}" />
</div>
```

#### Using Wildcard

```html
<script>
  import Router from '@fraserdarwent/svelte-router';
  import HomeComponent from './home-component.svelte';
  import FourOFour from './404.svelte';

  const routes = [
    {
      path: '/',
      component: HomeComponent,
    },
    {
      path: '/*',
      component: FourOFour,
    },
  ];
</script>

<div id="app">
  <Router {routes} />
</div>
```
