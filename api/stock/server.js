/**
 * Import vendor modules
 */
const fetch = require('node-fetch');

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
const api = new Api('stock', 4004, version);

/**
 * Setup GET Stock endpoint
 */
api.get('/', (req, res) => {
    fetch(dev ? `http://localhost:3002/api/stock` : `http://pim:3002/api/stock`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) {
                res.json(api.response(200, data));
            } else {
                res.status(404).json(api.response(404, {
                    error: data
                }));
            }
        }).catch((e) => {
            res.status(500).json(api.response(500, {
                error: e.message || false
            }));
        });
});

/**
 * Setup GET Stock detail endpoint
 */
api.get('/:slug', (req, res) => {
    const {slug} = req.params;

    fetch(dev ? `http://localhost:3002/api/stock` : `http://pim:3002/api/stock`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) {
                const filteredData = data.filter((item) => {
                    return item.slug === slug;
                });
                const statusCode = filteredData.length < 1 ? 404 : 200;
                const result = filteredData.length < 1 ? {} : filteredData[0];

                res.status(statusCode).json(api.response(statusCode, result));
            } else {
                res.status(404).json(api.response(404, {
                    error: data
                }));
            }
        }).catch((e) => {
            res.status(500).json(api.response(500, {
                error: e.message || false
            }));
        });
});

/**
 * Start the server
 */
api.init();
