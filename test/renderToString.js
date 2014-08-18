var express = require('express');
var request = require('supertest');
var expect = require('expect');
var cheerio = require('cheerio');

var React = require('react');
var Router = require('../index');
var Routes = Router.Routes;
var Route = Router.Route;
var Redirect = Router.Redirect;

var App = React.createClass({
	displayName: "App",
	render: function () {
		return this.props.activeRouteHandler();
	}
});

var HelloWorld = React.createClass({
	displayName: 'HelloWorld',
	render: function () {
		return React.DOM.div(null, "Hello World!");
	}
});

var CatchAll = React.createClass({
	displayName: 'CatchAll',
	render: function () {
		return React.DOM.div(null, "CatchAll!");
	}
});

var ErrorRoute = React.createClass({
	displayName: 'ErrorRoute',
	render: function () {
		throw new Error("ErrorRoute");
	}
});

describe("serverside rendering", function(){

	var routes = Routes(null, 
		Route({handler:App}, 
			Route({name:'hello', handler: HelloWorld}),
			Route({name:'error', handler: ErrorRoute}),
			Redirect({from:"redirect", to:"hello"})
		)
	);

	it("should render the HelloWorld component for the /hello path", function(done){
		requestWithRoutes(routes).get('/hello')
		.expect(200)
		.end(function (err, res) {
			var doc = cheerio.load(res.text);
			expect(doc("div").html()).toBe("Hello World!");
			done();
		});
	});

	it("should redirect for <Redirect/> Route", function(done){
		requestWithRoutes(routes).get('/redirect')
		.expect(302)
		.end(function (err, res) {
			expect(res.header.location).toBe("/hello");
			done();
		});
	});

	it("should expect 404 for no matching Route", function(done){
		requestWithRoutes(routes).get('/not-found')
		.expect(404)
		.end(done);
	});

	it("should expect 500 for error Route", function(done){
		requestWithRoutes(routes).get('/error')
		.expect(500)
		.end(done);
	});

});


function requestWithRoutes (routes){
	var app = express();

	app.use(function (req, res, next) {
		if (req.originalUrl == "/favicon.ico")
			return next();

		Router.renderRoutesToString(routes, req.originalUrl).then(function (data) {
			var body = '<!DOCTYPE html><html><head><title>' + data.title + '</title></head><body>' + data.html + '</body></html>';
			res.status(data && data.httpStatus || 200).send(body);

		}).catch(function (err) {
			console.log(err);

		    if (err.httpStatus == 302 && err.location) {
		      return res.redirect(err.location);
		    }

		    if(err.httpStatus == 404){
		    	return next();
		    }

			next(err);
		});
	});

	return request(app);
}
