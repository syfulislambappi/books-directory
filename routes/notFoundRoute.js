// not found route
exports.notFoundRoute = (requestProperties, callback) => {
    callback(404, {message: '404 page not found'})
}