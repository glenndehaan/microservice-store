/**
 * Import vendor modules
 */
const redis = require("redis");

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import own modules
 */
const Api = require(dev ? '../_defaults/Api' : '/_defaults/Api');

/**
 * Define global variables
 */
const version = '1.0';

/**
 * Create new API service
 */
const api = new Api('storage', 5000, version);

/**
 * Create redis connection
 */
const client = redis.createClient({
    host: dev ? '127.0.0.1' : 'redis',
    port: 6379
});

/**
 * Setup user add endpoint
 */
api.post('/user', (req, res) => {
    const user = req.body.user;

    client.set(`cart_${user}`, JSON.stringify([]), (err, cartRes) => {
        if(err) {
            res.status(500).json(api.response(500, {
                error: err
            }));

            return;
        }

        client.set(`wishlist_${user}`, JSON.stringify([]), (err, wishlistRes) => {
            if(err) {
                res.status(500).json(api.response(500, {
                    error: err
                }));

                return;
            }

            res.json(api.response(201, {
                result: {
                    cart: cartRes,
                    wishlist: wishlistRes
                }
            }));
        });
    });
});

/**
 * Setup cart get endpoint
 */
api.get('/cart/:user', (req, res) => {
    const user = req.params.user;

    client.get(`cart_${user}`, (err, cartRes) => {
        if(err) {
            res.status(500).json(api.response(500, {
                error: err
            }));

            return;
        }

        if(cartRes === null) {
            res.status(404).json(api.response(404, {}));
            return;
        }

        res.json(api.response(200, JSON.parse(cartRes)));
    });
});

/**
 * Setup wishlist get endpoint
 */
api.get('/wishlist/:user', (req, res) => {
    const user = req.params.user;

    client.get(`wishlist_${user}`, (err, wishListRes) => {
        if(err) {
            res.status(500).json(500, api.response({
                error: err
            }));

            return;
        }

        if(wishListRes === null) {
            res.status(404).json(api.response(404, {}));
            return;
        }

        res.json(api.response(200, JSON.parse(wishListRes)));
    });
});

/**
 * Setup wishlist add endpoint
 */
api.post('/wishlist/:user/add', (req, res) => {
    const user = req.params.user;
    const id = req.body.id;

    client.get(`wishlist_${user}`, (err, wishListRes) => {
        if(err) {
            res.status(500).json(500, api.response({
                error: err
            }));

            return;
        }

        if(wishListRes === null) {
            res.status(404).json(api.response(404, {}));
            return;
        }

        const wishlist = JSON.parse(wishListRes);

        if(wishlist.includes(id)) {
            res.status(409).json(api.response(409, {}));
            return;
        }

        wishlist.push(id);

        client.set(`wishlist_${user}`, JSON.stringify(wishlist), (err) => {
            if(err) {
                res.status(500).json(api.response(500, {
                    error: err
                }));

                return;
            }

            res.json(api.response(200, wishlist));
        });
    });
});

/**
 * Setup wishlist remove endpoint
 */
api.post('/wishlist/:user/remove', (req, res) => {
    const user = req.params.user;
    const id = req.body.id;

    client.get(`wishlist_${user}`, (err, wishListRes) => {
        if(err) {
            res.status(500).json(500, api.response({
                error: err
            }));

            return;
        }

        if(wishListRes === null) {
            res.status(404).json(api.response(404, {}));
            return;
        }

        const wishlist = JSON.parse(wishListRes);

        if(!wishlist.includes(id)) {
            res.status(404).json(api.response(404, {}));
            return;
        }

        wishlist.splice(wishlist.indexOf(id), 1);

        client.set(`wishlist_${user}`, JSON.stringify(wishlist), (err) => {
            if(err) {
                res.status(500).json(api.response(500, {
                    error: err
                }));

                return;
            }

            res.json(api.response(200, wishlist));
        });
    });
});

/**
 * Start the server
 */
api.init();
