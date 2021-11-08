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
const api = new Api('cart', 4000, version);

/**
 * Setup GET Cart endpoint
 */
api.get('/:user', (req, res) => {
    const user = req.params.user || false;

    fetch(dev ? `http://localhost:5000/cart/${user}` : `http://storage:5000/cart/${user}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.status.success) {
                res.json(api.response(data.data, 'OK', 200, data.status));
            } else {
                res.status(404).json(api.response({
                    error: data.data
                }, 'Not Found', 404, data.status));
            }
        }).catch((e) => {
            res.status(500).json(api.response({
                error: e.message || false
            }, 'Server Error', 500));
        });
});

/**
 * Start the server
 */
api.init();
