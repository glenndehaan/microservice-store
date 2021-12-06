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
const api = new Api('search', 4003, version);

/**
 * Setup GET Search endpoint
 */
api.get('/', (req, res) => {
    const {term} = req.query;

    if(typeof term === "undefined") {
        res.status(412).json(api.response(412, {}));
        return;
    }

    fetch(dev ? `http://localhost:3002/api/product` : `http://pim:3002/api/product`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) {
                const nameSearch = data.filter((item) => {
                    return item.name.toLowerCase().includes(term.toLowerCase());
                });
                const descriptionSearch = data.filter((item) => {
                    return item.description.toLowerCase().includes(term.toLowerCase());
                });

                const combined = [...nameSearch, ...descriptionSearch];

                const result = [];
                const map = new Map();
                for (const item of combined) {
                    if(!map.has(item.id)){
                        map.set(item.id, true);
                        result.push(item);
                    }
                }

                res.json(api.response(200, result));
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
