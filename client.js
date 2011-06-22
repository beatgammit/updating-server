(function () {
	'use strict';

	var connect = require('connect'),
		ahr = require('ahr2'),
		fs = require('fs'),
		port = 2000,
		updateServer = 'http://localhost:3000',
		updateSleep = 1; // seconds to sleep between update checks

	function update() {
		ahr({
			'method': 'GET',
			'href': updateServer + '/update',
			'headers': {
				'Accept': 'application/tar'
			}
		}).when(function (err, req, data) {
			if (data) {
				if (data instanceof Buffer) {
					fs.writeFile('update.tar', data);
					console.log('Update succeeded!');
					return;
				} else {
					console.error('Unknown response type...');
				}
			} else if (err) {
				console.error(err);
			}

			setTimeout(update, updateSleep * 1000);
		});
	}
	
	function route(app) {
		app.options('/update/server', function (req, res) {
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': 'http://localhost'
			});
			res.end();
		});

		app.put('/update/server', function (req, res, next) {
			if (req.body && req.body['server']) {
				updateServer = req.body['server'];
				res.writeHead(204, {
					'Access-Control-Allow-Origin': 'http://localhost'
				});
				res.end();
				return;
			}

			res.writeHead(400, {
				'Access-Control-Allow-Origin': 'http://localhost'
			});
			res.end();
		});

		app.get('/update/server', function (req, res) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end('{"server": "' + updateServer + '"}');
		});

		app.get('/update/sleep', function (req, res) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end('{"seconds": ' + updateSleep + '}');
		});

		app.put('/update/sleep', function (req, res) {
			if (req.body && req.body.seconds) {
				if (typeof req.body.seconds === 'number') {
					this.updateSleep = req.body.seconds;
					res.writeHead(204);
					res.end();
					return;
				}
				console.log('Possibly mal-formed seconds:', req.body.seconds);
			}

			res.writeHead(400);
			res.end();
		});

		app.get('/cwd', function (req, res) {
			res.writeHead(200);
			res.end(process.cwd());
		});
	}

	connect(
		connect.bodyParser({keepExtensions: true}),
		connect.router(route),
		connect.static(__dirname)
	).listen(port, function () {
		console.log('Server listening on port ' + port);
		update();
	});
}());
