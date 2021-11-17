/**
 * Exports the user endpoints
 *
 * @param api
 * @param redis
 */
module.exports = function cart(api, redis) {
    /**
     * Setup cart get endpoint
     */
    api.get('/cart/:user', (req, res) => {
        const user = req.params.user;

        redis.get(`cart_${user}`, (err, cartRes) => {
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
     * Setup cart add endpoint
     */
    api.post('/cart/:user/add', (req, res) => {
        const user = req.params.user;
        const id = req.body.id;
        const options = req.body.options;

        redis.get(`cart_${user}`, (err, cartRes) => {
            if(err) {
                res.status(500).json(500, api.response({
                    error: err
                }));

                return;
            }

            if(cartRes === null) {
                res.status(404).json(api.response(404, {}));
                return;
            }

            const cart = JSON.parse(cartRes);
            const filter = cart.filter((item) => {
                return item.id === id;
            });

            if(filter.length > 0) {
                res.status(409).json(api.response(409, {}));
                return;
            }

            cart.push({
                id,
                options
            });

            redis.set(`cart_${user}`, JSON.stringify(cart), (err) => {
                if(err) {
                    res.status(500).json(api.response(500, {
                        error: err
                    }));

                    return;
                }

                res.json(api.response(200, cart));
            });
        });
    });

    /**
     * Setup cart update endpoint
     */
    api.post('/cart/:user/update', (req, res) => {
        const user = req.params.user;
        const id = req.body.id;
        const options = req.body.options;

        redis.get(`cart_${user}`, (err, cartRes) => {
            if(err) {
                res.status(500).json(500, api.response({
                    error: err
                }));

                return;
            }

            if(cartRes === null) {
                res.status(404).json(api.response(404, {}));
                return;
            }

            const cart = JSON.parse(cartRes);
            const filter = cart.filter((item) => {
                return item.id === id;
            });

            if(filter < 1) {
                res.status(404).json(api.response(404, {}));
                return;
            }

            const newCart = cart.map((item) => {
                if(item.id === id) {
                    return {
                        id,
                        options
                    }
                }

                return item;
            });

            redis.set(`cart_${user}`, JSON.stringify(newCart), (err) => {
                if(err) {
                    res.status(500).json(api.response(500, {
                        error: err
                    }));

                    return;
                }

                res.json(api.response(200, newCart));
            });
        });
    });

    /**
     * Setup cart remove endpoint
     */
    api.post('/cart/:user/remove', (req, res) => {
        const user = req.params.user;
        const id = req.body.id;

        redis.get(`cart_${user}`, (err, cartRes) => {
            if(err) {
                res.status(500).json(500, api.response({
                    error: err
                }));

                return;
            }

            if(cartRes === null) {
                res.status(404).json(api.response(404, {}));
                return;
            }

            const cart = JSON.parse(cartRes);
            const filter = cart.filter((item) => {
                return item.id === id;
            });

            if(filter < 1) {
                res.status(404).json(api.response(404, {}));
                return;
            }

            const newCart = cart.filter((item) => {
                return item.id !== id;
            });

            redis.set(`cart_${user}`, JSON.stringify(newCart), (err) => {
                if(err) {
                    res.status(500).json(api.response(500, {
                        error: err
                    }));

                    return;
                }

                res.json(api.response(200, newCart));
            });
        });
    });
};
