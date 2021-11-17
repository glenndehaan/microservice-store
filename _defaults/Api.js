/**
 * Import vendor modules
 */
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

/**
 * Import own modules
 */
const log = require('./Log');

/**
 * Import specs
 */
const statusCodes = require('./spec/status-codes.json');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * API Class
 */
class Api {
    /**
     * Constructor
     *
     * @param {string|boolean} service
     * @param {number|boolean} port
     * @param {string|boolean} version
     */
    constructor(service = false, port = false, version = false) {
        if(!service) {
            throw new Error('[API] No service defined!');
        }

        if(!port) {
            throw new Error('[API] No port defined!');
        }

        if(!version) {
            throw new Error('[API] No version defined!');
        }

        // Set variables
        this.service = service;
        this.port = port;
        this.version = version;
        this.serviceLabel = `${service.charAt(0).toUpperCase()}${service.slice(1)}`;
        this.app = express();

        // Set functions
        this.use = (...args) => this.app.use(...args);
        this.get = (...args) => this.app.get(...args);
        this.post = (...args) => this.app.post(...args);
        this.put = (...args) => this.app.put(...args);
        this.patch = (...args) => this.app.patch(...args);
        this.delete = (...args) => this.app.delete(...args);

        // Trust proxy
        this.app.enable('trust proxy');

        // Enable body parser support
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());

        // Enable cookie parser support
        this.app.use(cookieParser());

        // Request logger
        this.app.use((req, res, next) => {
            log.trace(`[EXPRESS][REQUEST](${req.method}): ${req.originalUrl}`);
            next();
        });

        // CORS fixer for local debugging
        this.app.use((req, res, next) => {
            if(dev) {
                res.set('Access-Control-Allow-Origin', '*');
                res.set('Access-Control-Allow-Headers', '*');
                res.set('Access-Control-Allow-Credentials', 'true');
            }

            next();
        });

        // X- Headers
        this.app.use((req, res, next) => {
            if(dev) {
                res.set('X-App', 'microservice-store');
                res.set('X-Service', `${this.service}`);
                res.set('X-Version', `${this.version}`);
            }

            next();
        });

        // Setup health check
        this.app.get('/_status', (req, res) => {
            res.json(this.response());
        });

        // Disable powered by header for security reasons
        this.app.disable('x-powered-by');

        // Log init
        log.info(`[${this.serviceLabel}] Service Initialized!`);
    }

    /**
     * Start express and bind to a port
     */
    init() {
        /**
         * Start listening on port
         */
        this.app.listen(this.port, '0.0.0.0', () => {
            log.info(`[${this.serviceLabel}] App is running on: 0.0.0.0:${this.port}`);
        });
    }

    /**
     * Defines the default response format
     *
     * @param {number} code
     * @param {object} data
     * @param {object|boolean} via
     */
    response(code = 200, data = {}, via = false) {
        const response = {
            status: {
                success: code < 400,
                code: code,
                message: statusCodes[code].phrase,
                description: statusCodes[code].description,
                spec: statusCodes[code].spec_href,
                version: this.version,
                host: os.hostname(),
                service: this.service
            },
            data: data
        };

        if(via) {
            response.status.via = via;
        }

        return response;
    }
}

/**
 * Exports the API
 *
 * @type {Api}
 */
module.exports = Api;
