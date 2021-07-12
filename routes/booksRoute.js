// dependencies
const fs = require('fs')
const { createData, deleteData, updateData, readData } = require('../handlers/dataHandler')

// Route method schema
const method = {}

// books Route
exports.booksRoute = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.indexOf(requestProperties.method) > -1) {
        method[requestProperties.method](requestProperties, callback)
    } else {
        callback(405, {message: 'method no allowed'})
    }
}

// post method
method.post = (requestProperties, callback) => {
    // Validating user inputs
    const bookId = typeof requestProperties.body.bookId === 'string' && requestProperties.body.bookId.trim().length > 0 ? requestProperties.body.bookId :false

    const bookName = typeof requestProperties.body.bookName === 'string' && requestProperties.body.bookName.trim().length > 0 ? requestProperties.body.bookName :false

    const authorName = typeof requestProperties.body.authorName === 'string' && requestProperties.body.authorName.trim().length > 0 ? requestProperties.body.authorName :false

    const shortDescription = typeof requestProperties.body.shortDescription === 'string' && requestProperties.body.shortDescription.trim().length > 0 ? requestProperties.body.shortDescription :false

    // user data object
    

    // create data in database
    if(bookId && bookName && authorName && shortDescription) {
        readData(bookId, err => {

            if(err) {
                const userData = {bookId ,bookName, authorName, shortDescription}
                createData(bookId, userData, err1 => {
                    if(!err1) {
                        callback(200, {message: 'booklist is created successfully'})
                    } else {
                        callback(500, {message: 'could not create booklist'})
                    }
                }) 
            } else {
                callback(500, {message: 'there was a problem in server side'})
            }
        })
    } else {
        callback(400, {message: 'you have a problem in your request', data: requestProperties})
    }
}

// get method
method.get = (requestProperties, callback) => {
    const bookId = typeof requestProperties.queryObject.bookId === 'string' && requestProperties.queryObject.bookId.trim().length > 0 ? requestProperties.queryObject.bookId : false

    if(bookId) {
        readData(bookId, (err, data) => {
            if(!err && data) {
                callback(200, data)
            } else {
                callback(404, {message: 'booklist not found'})
            }
        })
    } else {
        callback(404, {message: 'booklist not found'})
    }
}

// update method
method.put = (requestProperties, callback) => {
    // check user data
    const bookId = typeof requestProperties.body.bookId === 'string' && requestProperties.body.bookId.trim().length > 0 ? requestProperties.body.bookId : false

    const bookName = typeof requestProperties.body.bookName === 'string' && requestProperties.body.bookName.trim().length > 0 ? requestProperties.body.bookName :false

    const authorName = typeof requestProperties.body.authorName === 'string' && requestProperties.body.authorName.trim().length > 0 ? requestProperties.body.authorName :false

    const shortDescription = typeof requestProperties.body.shortDescription === 'string' && requestProperties.body.shortDescription.trim().length > 0 ? requestProperties.body.shortDescription :false

    // update the data
    if(bookId) {
        if(bookName || authorName || shortDescription) {
            readData(bookId, (err, dataObject) => {
                if(!err && dataObject) {
                    if(bookName) {
                        dataObject.bookName = bookName
                    }
                    if(authorName) {
                        dataObject.authorName = authorName
                    }
                    if(shortDescription) {
                        dataObject.shortDescription = shortDescription
                    }
                    updateData(bookId, dataObject, (err) => {
                        if(!err) {
                            callback(200, {message: 'booklist updated successfully'})
                        } else {
                            callback(500, {message: 'there is a problem in updating booklist'})
                        }
                    })
                } else {
                    callback(400, {message: 'you have a problem in your request'})
                }
            })
        }
    } else {
        callback(404, {message: 'booklist not found'})
    }
}

// delete method
method.delete = (requestProperties, callback) => {
    // check user data
    const bookId = typeof requestProperties.queryObject.bookId === 'string' && requestProperties.queryObject.bookId.trim().length > 0 ? requestProperties.queryObject.bookId : false

    // delete data
    if(bookId) {
        readData(bookId, (err, userData) => {
            if(!err && userData) {
                deleteData(bookId, err => {
                    if(!err) {
                        callback(200, {message: 'booklist deleted successfully'})
                    } else {
                        callback(500, {message: 'server side error'})
                    }
                })
            } else {
                callback(500, {message: 'server side error'})
            }
        })
    } else {
        callback(404, {message: 'booklist not found'})
    }
}