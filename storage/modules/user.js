/**
 * Exports the user endpoints
 *
 * @param api
 * @param redis
 */
module.exports = function user(api, redis) {
    /**
     * Setup user add endpoint
     */
    api.post('/user', (req, res) => {
        const user = req.body.user;

        redis.set(`cart_${user}`, JSON.stringify([]), (err, cartRes) => {
            if(err) {
                res.status(500).json(api.response(500, {
                    error: err
                }));

                return;
            }

            redis.set(`wishlist_${user}`, JSON.stringify([]), (err, wishlistRes) => {
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
};
