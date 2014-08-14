API: `NotFound` (component)
===========================

Configures a `catch-all` route in the current nested route.

When on the server `data.httpStatus` will be 404. See 
[Routes.renderComponentToString](/docs/api/Router.md#renderroutestostringroutes-originalurl-options).

Props
-----

This uses the same props as [Route]:/docs/api/components/Route.md

### `path`

This is optionally set. If missing the resulting `path` is `*`.

Example
-------

```xml
<!--
  Note: <NotFound /> is placed at the end of hierarchy.

  In this example the <App /> handler will still be triggered 
-->
<Routes>
  <Route handler={App}>
    <Route name="contact" handler={Contact}/>
    <Route name="about-user" path="about/:userId" handler={UserProfile}/>
    <NotFound handler={NotFoundHandler} />
  </Route>
</Routes>
```

```xml
<!--
  To not trigger the <App /> handler place <NotFound /> outside
  the route.
-->
<Routes>
  <Route handler={App}>
    <Route name="contact" handler={Contact}/>
    <Route name="about-user" path="about/:userId" handler={UserProfile}/>
  </Route>
  <NotFound handler={NotFoundHandler} />
</Routes>
```
