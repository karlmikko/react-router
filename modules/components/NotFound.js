var Route = require('./Route');

function NotFound(props) {
  props.httpStatus = props.httpStatus || 404;
  props.path = props.path || "*";
  return Route(props);
}

module.exports = NotFound;