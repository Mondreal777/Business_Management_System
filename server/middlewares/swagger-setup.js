// Libraries
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const basePath = '/api';

module.exports = (app) => {
    // add swagger definitions
    const version = '1.0';
    const title = 'BMS Online POS API Documentation';
    const options = {
        explorer: true,
        swaggerDefinition: {
            openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
            info: {
                title, // Title (required)
                description: 'Collection of all APIs used by the BMS App.',
                version, // Version (required)
            },
            servers: [
                {
                    // url: `${basePath}/${version}`, // TODO: Implement once we have versioning
                    url: `${basePath}`,
                },
            ],
        },
        // Path to the API docs
        apis: ['./routes/**/*.route.js', './swagger/**/*.yml'],
    };

    const swaggerSpec = swaggerJSDoc(options);

    // UI
    app.use('/api/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, { customSiteTitle: title, }));

    // JSON format
    app.get('/api/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};