/**
 * Import base packages
 */
const express = require('express');
const app = express();

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import own packages
 */
const log = require(dev ? '../_defaults/Log' : '/_defaults/Log');
const assets = require('./assets');

/**
 * Define SPA renderer
 */
const spa = (req, res) => {
    const files = assets();

    res.render('index', {
        protocol: req.get('host'),
        hostname: req.protocol,
        baseUrl: `${req.protocol}://${req.get('host')}/`,
        cartApi: dev ? 'http://localhost:4000' : '/api/cart',
        productApi: dev ? 'http://localhost:4001' : '/api/product',
        searchApi: dev ? 'http://localhost:4002' : '/api/search',
        stockApi: dev ? 'http://localhost:4003' : '/api/stock',
        userApi: dev ? 'http://localhost:4004' : '/api/user',
        wishlistApi: dev ? 'http://localhost:4005' : '/apis/wishlist',
        assets: {
            js: files["main.js"],
            css: files["main.css"]
        }
    });
};

/**
 * Trust proxy
 */
app.enable('trust proxy');

/**
 * Set template engine
 */
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/template`);

/**
 * Request logger
 */
app.use((req, res, next) => {
    log.trace(`[Web][REQUEST]: ${req.originalUrl}`);
    next();
});

/**
 * Serve static public dir
 */
app.use(express.static(`${__dirname}/public`));

/**
 * Configure routers
 */
app.get('/', (req, res) => spa(req, res));
app.get('/product/:slug', (req, res) => spa(req, res));

/**
 * Setup default 404 message
 */
app.use((req, res) => {
    res.status(404);
    res.send('Not Found!')
});

/**
 * Disable powered by header for security reasons
 */
app.disable('x-powered-by');

/**
 * Start listening on port
 */
app.listen(3000, '0.0.0.0', () => {
    log.info(`[Web] App is running on: 0.0.0.0:3000`);
});
