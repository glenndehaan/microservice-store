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
const api = new Api('product', 4001);

/**
 * Setup GET Product endpoint
 */
api.get('/', (req, res) => {
    res.send('Product OK!');
});

/**
 * Start the server
 */
api.init();
