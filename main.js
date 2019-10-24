'use strict';

const https = require('https');
const url = require('url');
const fs = require('fs');
const cmd = require('child_process');
const os = require('os');

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
			key: fs.readFileSync(__dirname + '/keys/private.key'),
			cert: fs.readFileSync(__dirname + '/keys/certificate.cert')
		};

		let server = https.createServer(options);

		server.on('request', async (req, res) => {
			let parameter = url.parse(req.url, true).query;
			
			if(parameter.secret != '123456'){
				res.writeHead(401, { 'Content-Type': 'text/plain' });
				res.end('Wrong password');
				return;
			}
			
			if(!/^\d+$/.test(parameter.width) || !/^\d+$/.test(parameter.height) || !/^\d\.\d$/.test(parameter.zoom)){
				res.writeHead(400, { 'Content-Type': 'text/plain' });
				res.end('Format of size or zoom are invalid');
				return;	
			}
			
			if(!/^http[a-z0-9äöü\-\.\/\:]+$/.test(parameter.url)){
				res.writeHead(400, { 'Content-Type': 'text/plain' });
				res.end('URL ungültig');
				return;	
			}
			
			console.log('\x1b[36m%s\x1b[0m', 'Anfrage für ' + parameter.url); 
						
			try {
				let image =  await this.createScreenshot(parameter.url,parameter.width,parameter.height,parameter.zoom);
				res.writeHead(200,{'content-type':'image/png'});
				res.end(image);
			}
			catch (e) {
				res.writeHead(500, { 'Content-Type': 'text/plain' });
				res.end('Unknown error');
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
	async createScreenshot (site, width, height, zoom) {
		let tempFile = os.tmpdir() + '/screenshot' + (Math.floor(Math.random() * 10000) + 1) + '.png';

		await this.exec('"C:/Program Files (x86)/Google/Chrome/Application/chrome" --hide-scrollbars --headless --force-device-scale-factor=' + zoom + ' --log-level=1  --screenshot=' + tempFile + ' --window-size=' + width + ',' + height + ' ' + site);
		console.log('\x1b[36m%s\x1b[0m', 'Temp-Bild ' + tempFile);
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
				console.log('stout: ' + stdout);
				console.log('sterr: ' + stderr);
				
				if (error) 
					return reject(error)
				
				if (stderr) 
					return reject(stderr)
				
				resolve(stdout? stdout : stderr);
			});
		});
	}

	/**
	 * Get Image
	 * @param {String} path Path to image
	 * @returns {Promies}
	 */	
	getImageData(path){
		return new Promise(function(resolve, reject){
			fs.readFile(path, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});	
	}
}

let main = new Main();