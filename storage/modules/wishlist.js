/**
 * Exports the user endpoints
 *
 * @param api
 * @param redis
 */
module.exports = function wishlist(api, redis) {
    /**
     * Setup wishlist get endpoint
     */
    api.get('/wishlist/:user', (req, res) => {
        const user = req.params.user;

        redis.get(`wishlist_${user}`, (err, wishListRes) => {
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

        redis.get(`wishlist_${user}`, (err, wishListRes) => {
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

            redis.set(`wishlist_${user}`, JSON.stringify(wishlist), (err) => {
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

        redis.get(`wishlist_${user}`, (err, wishListRes) => {
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

            redis.set(`wishlist_${user}`, JSON.stringify(wishlist), (err) => {
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
};
