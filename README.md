# svelte-router

## Installation

```bash
yarn add @fraserdarwent/svelte-router
```

## Usage

```html
<script>
  import Router from '@fraserdarwent/svelte-router';
  import HomeComponent from './home-component.svelte';
  import AllPicturesComponent from './all-pictures-component.svelte';
  import AllDogPicturesComponent from './all-dog-pictures-component.svelte';
  import AllCatPicturesComponent from './all-cat-pictures-component.svelte';
  import SpecificCatPicturesComponent from './specific-cat-pictures-component.svelte';

  const routes = [
    {
      // Effective route is /
      path: '/',
      component: HomeComponent,
    },
    {
      // Effective route is /pictures
      path: '/pictures',
      component: AllPicturesComponent,
      routes: [
        {
          // Effective route is /pictures/dogs
          path: '/dogs',
          component: AllDogPicturesComponent,
        },
        {
          // Effective route is /pictures/cats
          path: '/cats',
          component: AllCatPicturesComponent,
          routes: [
            {
              // Effective route is /pictures/cats/*
              path: '/*',
              component: SpecificCatPicturesComponent,
            },
          ],
        },
      ],
    },
  ];
</script>

<div id="app">
  <Router {routes} />
</div>
```

### Navigating

Use the `route` method

```html
<script>
  import {route} from '@fraserdarwent/svelte-router';
</script>
<button on:click={()=>{route('/videos')}}>Videos</button>
```

### Setting A Fallback

A fallback component can be specified for when no route is matched

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

### Routing Methods

#### Path

Router defaults to path routing method

### To Use Hash Routing Method

#### Hash

```html
<Router {routes} method="hash" />
```
