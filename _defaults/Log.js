/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Setup logger
 */
const Log = require('simple-node-logger').createSimpleLogger({
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

/**
 * Set log level from config
 */
Log.setLevel(dev ? 'trace' : 'info');

/**
 * Export the logger
 *
 * @type {logger}
 */
module.exports = Log;
