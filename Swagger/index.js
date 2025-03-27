
const express = require("express");
const swaggerJS = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")

const app = express();
const { NODE_ENV, PORT } = process.env

const servers = {
    development: `http://localhost:${PORT}`,
    CustomDev: `https://react.customdev.solutions:${PORT}`,
    Live: `https://api.laundry.com/`
  }

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'asdf asdf ',
            version: '1.0.0',
        },
        servers: [
            {
                url: servers[NODE_ENV]
            }
        ]
    },
    // apis: ['./Routes/Admin/Auth.js']
    apis: ['./index.js', './Routes/Admin/Auth.js']
}

const swaggerSpec = swaggerJS(options)

const swagger = {
    serve: swaggerUI.serve,
    setup: swaggerUI.setup(swaggerSpec)
}

module.exports = swagger

