/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import own modules
 */
const Api = require(dev ? '../../_defaults/Api' : '/_defaults/Api');
const db = require('./data.json');

/**
 * Define global variables
 */
const version = '1.0';

/**
 * Create new API service
 */
const api = new Api('stock', 4003, version);

/**
 * Setup GET Stock endpoint
 */
api.get('/', (req, res) => {
    res.json(api.response(200, db));
});

/**
 * Setup GET Stock detail endpoint
 */
api.get('/:slug', (req, res) => {
    const {slug} = req.params;
    const data = db.filter((item) => {
        return item.slug === slug;
    });
    const statusCode = data.length < 1 ? 404 : 200;

    res.status(statusCode).json(api.response(statusCode, data));
});

/**
 * Start the server
 */
api.init();
