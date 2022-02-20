const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),

    PUBLIC_PATH: Joi.string().optional().default(`${__dirname}/public/`).description("Filesystem path to public files"),

    SSH_HOST: Joi.string().required().description("Remote SSH host"),
    SSH_PORT: Joi.number().optional().default(22).description("Remote SSH port"),
    SSH_USER: Joi.string().required().description("SSH username for authentication"),
    SSH_PRIVATE_KEY: Joi.string().required().description("SSH private key for authentication"),

    HASH: Joi.string().optional().description("Hash string used to secure endpoint"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  publicPath: envVars.PUBLIC_PATH,
  hash: envVars.HASH,
  ssh: {
    host: envVars.SSH_HOST,
    port: envVars.SSH_PORT,
    user: envVars.SSH_USER,
    privateKey: envVars.SSH_PRIVATE_KEY,
    term: 'xterm-color',
    readyTimeout: 20000,
    keepaliveInterval: 120000,
    keepaliveCountMax: 10,
    allowedSubnets: [],
    algorithms: {
      kex: [
        'ecdh-sha2-nistp256',
        'ecdh-sha2-nistp384',
        'ecdh-sha2-nistp521',
        'diffie-hellman-group-exchange-sha256',
        'diffie-hellman-group14-sha1',
      ],
      cipher: [
        'aes128-ctr',
        'aes192-ctr',
        'aes256-ctr',
        'aes128-gcm',
        'aes128-gcm@openssh.com',
        'aes256-gcm',
        'aes256-gcm@openssh.com',
        'aes256-cbc',
      ],
      hmac: ['hmac-sha2-256', 'hmac-sha2-512', 'hmac-sha1'],
      compress: ['none', 'zlib@openssh.com', 'zlib'],
    },
  },
  terminal: {
    cursorBlink: true,
    scrollback: 10000,
    tabStopWidth: 8,
    bellStyle: 'sound',
  },
};