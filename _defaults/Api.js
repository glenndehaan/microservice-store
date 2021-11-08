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
 * API Class
 */
class Api {
    /**
     * Constructor
     *
     * @param service
     * @param port
     * @param version
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
     * @param data
     * @param message
     * @param code
     * @param via
     */
    response(data = {}, message = 'OK', code = 200, via = false) {
        const response = {
            status: {
                success: code < 400,
                message: message,
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
