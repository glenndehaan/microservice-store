/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import own modules
 */
const Api = require(dev ? '../../_defaults/Api' : '/_defaults/Api');

/**
 * Define global variables
 */
const version = '1.0';

/**
 * Create new API service
 */
const api = new Api('cart', 4000, version);

/**
 * Setup GET Cart endpoint
 */
api.get('/', (req, res) => {
    res.json(api.response());
});

/**
 * Start the server
 */
api.init();
