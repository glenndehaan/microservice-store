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
const api = new Api('wishlist', 4006, version);

/**
 * Setup GET Wishlist endpoint
 */
api.get('/:user', (req, res) => {
    const user = req.params.user || false;

    fetch(dev ? `http://localhost:5000/wishlist/${user}` : `http://storage:5000/wishlist/${user}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if(data.status.success) {
                res.json(api.response(200, data.data, data.status));
            } else {
                res.status(404).json(api.response(404, {
                    error: data.data
                }, data.status));
            }
        }).catch((e) => {
            res.status(500).json(api.response(500, {
                error: e.message || false
            }));
        });
});

/**
 * Setup POST Wishlist add endpoint
 */
api.post('/:user/add', (req, res) => {
    const user = req.params.user || false;
    const id = req.body.id || false;

    if(!id) {
        res.json(api.response(412, {}));
        return;
    }

    fetch(dev ? `http://localhost:5000/wishlist/${user}/add` : `http://storage:5000/wishlist/${user}/add`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id.toString()
        })
    })
        .then(res => res.json())
        .then(data => {
            if(data.status.success) {
                res.json(api.response(200, data.data, data.status));
            } else {
                res.status(404).json(api.response(404, {
                    error: data.data
                }, data.status));
            }
        }).catch((e) => {
            res.status(500).json(api.response(500, {
                error: e.message || false
            }));
        });
});

/**
 * Setup POST Wishlist remove endpoint
 */
api.post('/:user/remove', (req, res) => {
    const user = req.params.user || false;
    const id = req.body.id || false;

    if(!id) {
        res.json(api.response(412, {}));
        return;
    }

    fetch(dev ? `http://localhost:5000/wishlist/${user}/remove` : `http://storage:5000/wishlist/${user}/remove`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id.toString()
        })
    })
        .then(res => res.json())
        .then(data => {
            if(data.status.success) {
                res.json(api.response(200, data.data, data.status));
            } else {
                res.status(404).json(api.response(404, {
                    error: data.data
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
