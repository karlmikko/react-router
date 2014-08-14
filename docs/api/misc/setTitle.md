API: `setTitle` (string)
==========================

The string passed to `setTitle` will be assigned to 
`document.title` on the nextTick. If multiple calls
to `setTitle` are made in the same event loop, only
the last value is set.

On the server side see `data.title` in 
[Routes.renderComponentToString](/docs/api/Router.md#renderroutestostringroutes-originalurl-options).