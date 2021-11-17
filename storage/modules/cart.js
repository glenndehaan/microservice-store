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
};
