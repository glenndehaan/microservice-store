/**
 * Import base packages
 */
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Import own packages
 */
const log = require(dev ? '../_defaults/Log' : '/_defaults/Log');

/**
 * Set global variables
 */
const dbPath = dev ? `${__dirname}/db` : '/db';

/**
 * Check if database exists
 */
if (!fs.existsSync(`${dbPath}/product.json`)) {
    log.info(`[Pim][DB] Initialized: ${dbPath}/product.json`);
    fs.writeFileSync(`${dbPath}/product.json`, fs.readFileSync(`${__dirname}/db/product.source.json`));
}
if (!fs.existsSync(`${dbPath}/stock.json`)) {
    log.info(`[Pim][DB] Initialized: ${dbPath}/stock.json`);
    fs.writeFileSync(`${dbPath}/stock.json`, fs.readFileSync(`${__dirname}/db/stock.source.json`));
}

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
 * Setup body-parser
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * Request logger
 */
app.use((req, res, next) => {
    log.trace(`[Pim][REQUEST]: ${req.originalUrl}`);
    next();
});

/**
 * Serve static public dir
 */
app.use(express.static(`${__dirname}/public`));

/**
 * Configure routers
 */
app.get('/api/product', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(`${dbPath}/product.json`, 'utf-8')));
});
app.get('/api/stock', (req, res) => {
    res.json(JSON.parse(fs.readFileSync(`${dbPath}/stock.json`, 'utf-8')));
});
app.post('/api/product', (req, res) => {
    fs.writeFileSync(`${dbPath}/product.json`, JSON.stringify(req.body));
    res.send('OK');
});
app.post('/api/stock', (req, res) => {
    fs.writeFileSync(`${dbPath}/stock.json`, JSON.stringify(req.body));
    res.json('OK');
});
app.get('/', (req, res) => {
    res.render('index', {});
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
app.listen(3002, '0.0.0.0', () => {
    log.info(`[Pim] App is running on: 0.0.0.0:3002`);
});
