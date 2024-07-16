'use strict';
const path = require('node:path');
const express = require('express');
const morgan = require('morgan');
const serveIndex = require('serve-index');
const { networkInterfaces } = require('os');

const PORT = 4000;

const app = express();

app.use(morgan('tiny'));
const dirPath = path.normalize(process.argv[2]);
app.use('/', express.static(dirPath));
app.use(
	'/',
	serveIndex(dirPath, {
		icons: true,
		stylesheet: path.join(__dirname, 'style.css'),
		view: 'details',
	})
);

const nets = networkInterfaces();
const addresses = {};
for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
		// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
		// 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
		const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
		if (net.family === familyV4Value && !net.internal) {
			if (!addresses[name]) {
				addresses[name] = [];
			}
			addresses[name].push(net.address);
		}
	}
}
console.log(addresses);
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
