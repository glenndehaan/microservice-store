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
const cart = require('./modules/cart');
const user = require('./modules/user');
const wishlist = require('./modules/wishlist');

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
 * Create local test storage
 */
if(dev) {
    client.get(`cart_ffffffff-ffff-ffff-ffff-ffffffffffff`, (err, cartRes) => {
        if (err) {
            return;
        }

        if (cartRes === null) {
            client.set(`cart_ffffffff-ffff-ffff-ffff-ffffffffffff`, JSON.stringify([]));
            client.set(`wishlist_ffffffff-ffff-ffff-ffff-ffffffffffff`, JSON.stringify([]));
        }
    });
}

/**
 * Let modules add endpoints
 */
cart(api, client);
user(api, client);
wishlist(api, client);

/**
 * Start the server
 */
api.init();
