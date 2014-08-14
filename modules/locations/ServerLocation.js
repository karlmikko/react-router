var invariant = require('react/lib/invariant');

var _lastPath;
var _currentPath = '/';

/**
 * Location handler that does not require a DOM.
 */
var ServerLocation = {

  push: function (path) {
    _lastPath = _currentPath;
    _currentPath = path;
  },

  replace: function (path) {
    _currentPath = path;
  },

  pop: function () {
    invariant(
      _lastPath != null,
      'You cannot use ServerLocation to go back more than once'
    );

    _currentPath = _lastPath;
    _lastPath = null;
  },

  getCurrentPath: function () {
    return _currentPath;
  },

  toString: function () {
    return '<ServerLocation>';
  }

};

module.exports = ServerLocation;
