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
const key = process.env.GHOST_KEY || '1a8839c5225b2cc599c9b28c85';

/**
 * Create new API service
 */
const api = new Api('content', 4001, version, {key});

/**
 * Setup GET Footer Content endpoint
 */
api.get('/footer', (req, res) => {
    fetch(dev ? `http://localhost:2368/ghost/api/v3/content/settings/?key=${key}` : `http://cms:2368/cms/ghost/api/v3/content/settings/?key=${key}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.settings && data.settings.secondary_navigation) {
                res.json(api.response(200, data.settings.secondary_navigation.map((link) => {
                    const url = link.url.replace(/\/$/, "");

                    return {
                        label: link.label,
                        url: url === '' ? '/' : url
                    }
                })));
            } else {
                res.status(404).json(api.response(404, {
                    error: data.errors
                }, data.status));
            }
        }).catch((e) => {
        res.status(500).json(api.response(500, {
            error: e.message || false
        }));
    });
});

/**
 * Setup GET Content endpoint
 */
api.get('/:slug', (req, res) => {
    const slug = req.params.slug || false;

    fetch(dev ? `http://localhost:2368/ghost/api/v3/content/pages/slug/${slug}/?key=${key}` : `http://cms:2368/cms/ghost/api/v3/content/pages/slug/${slug}/?key=${key}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.pages && data.pages.length > 0) {
                res.json(api.response(200, data.pages[0]));
            } else {
                res.status(404).json(api.response(404, {
                    error: data.errors
                }, data.status));
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
