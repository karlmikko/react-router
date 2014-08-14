var React = require('react/addons');
var ActiveStore = require('../stores/ActiveStore');
var Path = require('../helpers/Path');
var makePath = require('../helpers/makePath');
var Transition = require('../helpers/Transition');
var copyProperties = require('react/lib/copyProperties');
var RouteStore = require('../stores/RouteStore');
var PathStore = require('../stores/PathStore');
var TitleStore = require('../stores/TitleStore');
var ServerLocation = require('../locations/ServerLocation');
var Promise = require('es6-promise').Promise;
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

var renderRoutesToString = function (routes, fullPath, staticMarkup) {

  return new Promise(function (resolve, reject) {
    var query = Path.extractQuery(fullPath) || {};
    var initialData = {};
    var promises = [];
    var httpStatus = 200;

    var matches = routes.constructor.match(fullPath, routes);

    if (!matches) {
      var error = new Error("Not route matched path.");
      error.status = error.httpStatus = 404;
      throw err;
    }

    if (matches.length) {
      //check matches for redirect and httpStatus
      for (var i=0; i<matches.length; i++) {
        var match = matches[i];
        var props = match.route.props;
        
        if (props.httpStatus > 0 && props.httpStatus < 999)
          httpStatus = props.httpStatus;
        
        if (props.handler.willTransitionTo) {
          var transition = new Transition(fullPath);
          props.handler.willTransitionTo(transition, match.params, match.query);
          if (transition.isCancelled) {
            //register routes for replaceWith called by handleCancelledTransition
            RouteStore.unregisterAllRoutes();
            React.Children.forEach(routes.props.children, function (child) {
              RouteStore.registerRoute(child);
            });
            //should throw and be caught by Promise if doesn't result in throw then carry on
            routes.constructor.handleCancelledTransition(transition);
          }
        }
      }

      //Loop over all matches getInitalAsyncState and apply
      for (var i=0; i<matches.length; i++) {
        (function () {
          var j = i;
          var promise = new Promise(function (resolve, reject) {
            var statics = matches[j].route.props.handler;
            if (statics.getInitialAsyncState) {
              statics.getInitialAsyncState(fullPath, query, function (state) {
                initialData[j] = state;
              }).then(resolve);
            } else {
              resolve();
            }
          });
          promises.push(promise);
        })();
      }
    }

    Promise.all(promises).then(function (data) {

      RouteStore.unregisterAllRoutes();
      TitleStore.clearStore();

      var newRoutes = React.addons.cloneWithProps(routes, {
        location: ServerLocation,
        initialPath: fullPath, 
        initialData: initialData
      });

      var html;
      if (!staticMarkup) {
        var initialDataScript = '<script type="text/javascript">window.__ReactRouter_initialData=' + JSON.stringify(initialData) + ';</script>';
        html = React.renderComponentToString(newRoutes) + initialDataScript;
      } else {
        html = React.renderComponentToStaticMarkup(newRoutes)
      }

      var title = TitleStore.getTitle() || "";

      RouteStore.unregisterAllRoutes();
      TitleStore.clearStore();

      resolve({
        title: title,
        html: html,
        status: httpStatus,
        httpStatus: httpStatus
      });
    }).catch(reject);
  });
};

module.exports = renderRoutesToString;