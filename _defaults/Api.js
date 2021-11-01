/**
 * Import vendor modules
 */
const express = require('express');

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
     */
    constructor(service = false, port = false) {
        if(!service) {
            throw new Error('[API] No service defined!');
        }

        if(!port) {
            throw new Error('[API] No port defined!');
        }

        // Set variables
        this.service = service;
        this.port = port;
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

        // Request logger
        this.app.use((req, res, next) => {
            log.trace(`[WEB][REQUEST]: ${req.originalUrl}`);
            next();
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
}

/**
 * Exports the API
 *
 * @type {Api}
 */
module.exports = Api;
