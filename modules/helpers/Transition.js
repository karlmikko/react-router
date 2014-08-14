var copyProperties = require('react/lib/copyProperties');
var transitionTo = require('../helpers/transitionTo');

function Transition(path) {
  this.path = path;
  this.cancelReason = null;
  this.isCancelled = false;
}

copyProperties(Transition.prototype, {

  abort: function () {
    this.cancelReason = new Abort();
    this.isCancelled = true;
  },

  redirect: function (to, params, query) {
    this.cancelReason = new Redirect(to, params, query);
    this.isCancelled = true;
  },

  retry: function () {
    transitionTo(this.path);
  }

});

function Abort() {}

function Redirect(to, params, query) {
  this.to = to;
  this.params = params;
  this.query = query;
}

Transition.Abort = Abort;
Transition.Redirect = Redirect;

module.exports = Transition;