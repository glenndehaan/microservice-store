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
const api = new Api('search', 4002, version);

/**
 * Setup GET Search endpoint
 */
api.get('/', (req, res) => {
    const {term} = req.query;

    if(typeof term === "undefined") {
        res.status(412).json(api.response(412, {}));
        return;
    }

    const nameSearch = db.filter((item) => {
        return item.name.toLowerCase().includes(term.toLowerCase());
    });
    const descriptionSearch = db.filter((item) => {
        return item.description.toLowerCase().includes(term.toLowerCase());
    });

    res.json(api.response(200, [...nameSearch, ...descriptionSearch]));
});

/**
 * Start the server
 */
api.init();
