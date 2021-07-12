// dependencies
const url = require('url')
const { StringDecoder } = require('string_decoder')
const routes = require('./routesHandler')
const { notFoundRoute } = require('../routes/notFoundRoute')

// Request Response Handler
function reqResHandler(req, res) {
    // Request Data
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    const queryObject = parsedUrl.query
    const headersObject = req.headers
    const method = req.method.toLowerCase()
    const requestProperties = {parsedUrl, path, trimmedPath, queryObject, headersObject, method}

    // Request body data
    const decoder = new StringDecoder('utf-8')
    let bufferData = ''
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundRoute
    req.on('data', (chunk) => {
        bufferData += decoder.write(chunk)
    })

    req.on('end', () => {
        requestProperties.body = JSON.parse(bufferData)
        chosenHandler(requestProperties, (statusCode, payload) => {
            // check the data
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500
            payload = typeof(payload) === 'object' ? payload : {}

            // convert object to string
            const payloadString = JSON.stringify(payload)

            // server functionalites
            res.setHeader('content-type', 'application/json')
            res.writeHead(statusCode)
            res.write(payloadString)
            res.end()
        })
    })
}

// export function
module.exports = reqResHandler