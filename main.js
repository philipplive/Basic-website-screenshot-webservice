'use strict';

const https = require('https');
const url = require('url');
const fs = require('fs');
const cmd = require('child_process');
const os = require('os');
const Command = require('./command.js');

/**
 * @class  Main
 */
class Main {
	constructor() {
		this.startServer();
	}

	/**
	 * Start server
	 */
	startServer() {
		let options = {
			key: fs.readFileSync(__dirname + '/cert/private.key'),
			cert: fs.readFileSync(__dirname + '/cert/certificate.cert')
		};

		let server = https.createServer(options);

		server.on('request', async (req, res) => {
			let parameter = url.parse(req.url, true).query;

			if (parameter.secret != '123456') {
				res.writeHead(401, { 'Content-Type': 'text/plain' });
				res.end('Wrong password');
				return;
			}

			if (!/^\d+$/.test(parameter.width) || !/^\d+$/.test(parameter.height) || !/^\d\.\d$/.test(parameter.zoom)) {
				res.writeHead(400, { 'Content-Type': 'text/plain' });
				res.end('Format of size or zoom are invalid');
				return;
			}

			if (!/^http[a-z0-9äöü\-\.\/\:]+$/.test(parameter.url)) {
				res.writeHead(400, { 'Content-Type': 'text/plain' });
				res.end('Url invalid');
				return;
			}

			console.log('\x1b[36m%s\x1b[0m', 'Request for ' + parameter.url);

			try {
				let image = await this.createScreenshot(parameter.url, parameter.width, parameter.height, parameter.zoom);
				res.writeHead(200, { 'content-type': 'image/png' });
				res.end(image);
			}
			catch (e) {
				res.writeHead(500, { 'Content-Type': 'text/plain' });
				res.end('Unknown error');
				throw e;
			}
		});

		server.listen(5512);
		console.log('\x1b[33m%s\x1b[0m', 'Start service on port 5512');
	}

	/**
	 * Create screenshot from website
	 * @param {String} site Website url
	 * @param {Int} width Width
	 * @param {Int} height Height
	 * @returns {String} Image
	 */
	async createScreenshot(site, width, height, zoom) {
		let tempFile = os.tmpdir() + '/screenshot' + (Math.floor(Math.random() * 10000) + 1) + '.png';
		let cmd = new Command('"%programfiles(x86)%/Google/Chrome/Application/chrome"');
		cmd.addParameter('--headless --hide-scrollbars');
		cmd.addParameters({
			 '--force-device-scale-factor': zoom,
			 '--screenshot': tempFile,
			 '--window-size': width + ',' + height,
			 '--log-level': '1'
		});
		cmd.addParameter(site);

		await this.exec(cmd.prints());
		console.log('\x1b[36m%s\x1b[0m', 'Temp-Image ' + tempFile);

		let image = await this.getImageData(tempFile);
		fs.unlink(tempFile, function (err) {
			if (err)
				console.log('\x1b[31m', err);
		});

		return image;
	}

	/**
	 * Execute CMD
	 * @param {String} cmd
	 * @returns {Promies}
	 */
	exec(cmd) {
		return new Promise((resolve, reject) => {
			let exec = require('child_process').exec;

			exec(cmd, (error, stdout, stderr) => {
				if (error)
					return reject(error)

				if (stderr)
					return reject(stderr)

				resolve(stdout ? stdout : stderr);
			});
		});
	}

	/**
	 * Get Image
	 * @param {String} path Path to image
	 * @returns {Promies}
	 */
	getImageData(path) {
		return new Promise(function (resolve, reject) {
			fs.readFile(path, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
	}
}

let main = new Main();