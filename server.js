(function () {
	'use strict';

	var connect = require('connect'),
		port = 3000;
	
	function route(app) {
		app.get('/update', function (req, res, next) {
			console.log('Request update');

			res.setHeader('Content-Type', 'application/tar');
			req.url = '/update.tar';

			next();
		});
	}

	connect(
		connect.router(route),
		connect.static(__dirname)
	).listen(port, function () {
		console.log('Server listening on port ' + port);
	});
}());
