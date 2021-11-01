/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import own modules
 */
const Api = require(dev ? '../../_defaults/Api' : '/_defaults/Api');

/**
 * Create new API service
 */
const api = new Api('stock', 4003);

/**
 * Setup GET Stock endpoint
 */
api.get('/', (req, res) => {
    res.send('Stock OK!');
});

/**
 * Start the server
 */
api.init();
