// private
const SSH = require('ssh2').Client;
const config = require('../config/config');
const logger = require('../config/logger');
var fs = require('fs');

// var fs = require('fs')
// var hostkeys = JSON.parse(fs.readFileSync('./hostkeyhashes.json', 'utf8'))
let termCols;
let termRows;

async function setupConnection(socket) {
  function debug(message) {
    //logger.debug(message)
  }

  function handleError(myFunc, err) {
    let theError;
    // we just want the first error of the session to pass to the client
    const firstError = err ? err.message : undefined;
    theError = firstError ? `: ${firstError}` : '';
    // log unsuccessful login attempt
    if (err && err.level === 'client-authentication') {
      logger.error('Authentication failure')
    } else {
      // eslint-disable-next-line no-console
      logger.error('Logout')
      if (err) {
        logger.error(err ? err.message : '');
      }
    }
    socket.emit('handleError', `SSH ${myFunc}${theError}`);
    socket.disconnect(true);
  }

  const conn = new SSH();
  socket.on('geometry', (cols, rows) => {
    termCols = cols;
    termRows = rows;
  });
  conn.on('banner', (data) => {
    // need to convert to cr/lf for proper formatting
    socket.emit('data', data.replace(/\r?\n/g, '\r\n').toString('utf-8'));
  });

  conn.on('ready', () => {
    logger.info(`Login: user=${config.ssh.user} from=${socket.handshake.address} host=${config.ssh.host} port=${config.ssh.port} sessionID=${socket.request.sessionID}/${socket.id} mrhsession=none term=${config.ssh.term}`);
    socket.emit('setTerminalOpts', {
      cursorBlink: config.terminal.cursorBlink,
      scrollback: config.terminal.scrollback,
      tabStopWidth: config.terminal.tabStopWidth,
      bellStyle: config.terminal.bellStyle,
    });
    conn.shell(
      {
        term: config.ssh.term,
        cols: termCols,
        rows: termRows,
      },
      (err, stream) => {
        if (err) {
          handleError(`EXEC ERROR${err}`);
          conn.end();
          return;
        }
        socket.on('data', (data) => {
          stream.write(data);
        });
        socket.on('resize', (data) => {
          stream.setWindow(data.rows, data.cols);
        });
        socket.on('disconnecting', (reason) => {
          logger.info(`Remote server disconnecting: ${reason}`);
        });
        socket.on('disconnect', (reason) => {
          logger.info(`Remote server disconnected: ${reason}`);
          const errMsg = { message: reason };
          handleError('CLIENT SOCKET DISCONNECT', errMsg);
          conn.end();
        });
        socket.on('error', (errMsg) => {
          handleError('SOCKET ERROR', errMsg);
          conn.end();
        });

        stream.on('data', (data) => {
          socket.emit('data', data.toString('utf-8'));
        });
        stream.on('close', (code, signal) => {
          const errMsg = {
            message:
              code || signal
                ? (code ? `CODE: ${code}` : '') +
                  (code && signal ? ' ' : '') +
                  (signal ? `SIGNAL: ${signal}` : '')
                : undefined,
          };
          handleError('STREAM CLOSE', errMsg);
          conn.end();
        });
        stream.stderr.on('data', (data) => {
          logger.error(`Remote srderr: ${data}`);
        });
      }
    );
  });

  conn.on('end', (err) => {
    handleError('CONN END BY HOST', err);
  });
  conn.on('close', (err) => {
    handleError('CONN CLOSE', err);
  });
  conn.on('error', (err) => {
    handleError('CONN ERROR', err);
  });
  conn.on('keyboard-interactive', (name, instructions, instructionsLang, prompts, finish) => {
    logger.error("conn.on('keyboard-interactive')");
    finish([config.ssh.password]);
  });

  var privateKey = fs.readFileSync(config.ssh.privateKey,{ encoding: 'utf8' });

  conn.connect({
    host: config.ssh.host,
    port: config.ssh.port,
    localAddress: null,
    localPort: null,
    username: config.ssh.user,
    password: null,
    privateKey: privateKey,
    tryKeyboard: true,
    algorithms: config.ssh.algorithms,
    readyTimeout: config.ssh.readyTimeout,
    keepaliveInterval: config.ssh.keepaliveInterval,
    keepaliveCountMax: config.ssh.keepaliveCountMax,
    debug: debug,
  });
}

// public
module.exports = function appSocket(socket) {
  setupConnection(socket);
};
