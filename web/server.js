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
 * Trust proxy
 */
app.enable('trust proxy');

/**
 * Set template engine
 */
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/template`);

/**
 * Serve static public dir
 */
app.use(express.static(`${__dirname}/public`));

/**
 * Request logger
 */
app.use((req, res, next) => {
    log.trace(`[WEB][REQUEST]: ${req.originalUrl}`);
    next();
});

/**
 * Configure routers
 */
app.get('/', (req, res) => {
    const files = assets();

    res.render('index', {
        protocol: req.get('host'),
        hostname: req.protocol,
        baseUrl: `${req.protocol}://${req.get('host')}/`,
        assets: {
            js: files["main.js"],
            css: files["main.css"]
        }
    });
});

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
    log.info(`[WEB] App is running on: 0.0.0.0:3000`);
});
