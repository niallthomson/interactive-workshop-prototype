const express = require('express');
const helmet = require('helmet');
//const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const config = require('./config/config');
const morgan = require('./config/morgan');
const util = require('./util/auth')
//const { errorConverter, errorHandler } = require('./middlewares/error');
const http = require('http');

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  path: '/ssh/ws',
  serveClient: false,
});
const appSocket = require('./lib/ssh');

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
//app.use(helmet());

app.use(compression());

app.use('/healthcheck', require('express-healthcheck')());

app.use(util.auth);

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.static(config.publicPath));

io.on('connection', function(socket) {
  appSocket(socket)
});

// convert error to ApiError, if needed
//app.use(errorConverter);

// handle error
//app.use(errorHandler);

module.exports = server;