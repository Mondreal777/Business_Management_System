(async () => {
    try {
        // Libraries
        require('dotenv').config();
        const path = require('path');
        const express = require('express');
        const bodyParser = require('body-parser');
        const corsMiddleware = require('cors');
        const NodeCache = require('node-cache');
        const conf = require('./config/config');

        // Global variables
        global.nodeCache = new NodeCache();

        // Routes
        const routes = require('./routes');

        // Loggers
        // NOTE: Will be used after creating logger helper
        const logger = require('./util/loggers/logger');
        const errorHandler = require('./util/loggers/errors');

        // Middlewares
        // NOTE: This will be used for middlewares/swagger docs
        const {
            morganLogger
        } = require('./middlewares/morgan-logger');
        const swaggerSetup = require('./middlewares/swagger-setup');

        const app = express();
        app.disable('x-powered-by');
        app.use(bodyParser.json({limit: '50mb', extended: true}));
        app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
        app.use(bodyParser.text({ limit: '200mb' }));
        app.use(express.static(path.join(__dirname, '/public')));

        const env = process.env.environment;

         // Do not allow CORS if not in development
         const allowedOrigins = async () => {
            return env === 'development' ? '*' : /\.development\.com$/;
        };
        
        const cors = corsMiddleware({
            maxAge: 5, // Optional
            origin: await allowedOrigins(),
            allowHeaders: ['Authorization']
        });

        app.use(cors);

        // Middleware to integrate morgan to the default logger
        app.use(morganLogger);

        if (env !== 'production') {
            // Load the swagger documentation
			swaggerSetup(app);
        } else {
            app.use('/api/api-docs', (req, res, next) => {
                res.status(404).send("Not Found");
            });
            app.use('/api/api-docs.json', (req, res, next) => {
                res.status(404).send("Not Found");
            });
        }

        routes(app);

        // Error handling
        errorHandler(app);
        app.listen(process.env.PORT || 8085, () => {
            logger.info(`bms API server is running on port: ${process.env.PORT || 8085}`);
            // console.log(`bms API is running on port: ${conf.serverConfig.port || 3000}`);
        });
    } catch (e) {
        console.log(e);
        // Do nothing
    }
})();