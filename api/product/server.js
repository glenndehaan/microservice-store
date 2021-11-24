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
const api = new Api('product', 4002, version);

/**
 * Setup GET Product endpoint
 */
api.get('/', (req, res) => {
    res.json(api.response(200, db));
});

/**
 * Setup GET Product detail endpoint
 */
api.get('/:slug', (req, res) => {
    const {slug} = req.params;
    const data = db.filter((item) => {
        return item.slug === slug;
    });
    const statusCode = data.length < 1 ? 404 : 200;
    const result = data.length < 1 ? {} : data[0];

    res.status(statusCode).json(api.response(statusCode, result));
});

/**
 * Start the server
 */
api.init();
