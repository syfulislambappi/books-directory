// dependencies
const fs = require('fs')
const path = require('path')

// base path
const basepath = path.join(__dirname, '../.database/books/')

// create data
exports.createData = (file, data, callback) => {
    fs.open(basepath+file+'.json', 'wx', (err, fd) => {
        if(!err && fd) {
            // conver buffer data to string data
            const stringData = JSON.stringify(data)
            fs.writeFile(fd, stringData, err => {
                if(!err && stringData) {
                    fs.close(fd, err => {
                        if(!err && fd) {
                            callback(false)
                        } else {
                            callback('there is a problem in closing file')
                        }
                    })
                } else {
                    callback('there is a problem in creating file')
                }
            })
        } else {
            callback('file is already existed')
        }
    })
}

// update data
exports.updateData = (file, data, callback) => {
    fs.open(basepath+file+'.json', 'r+', (err, fd) => {
        if(!err && fd) {
            // conver buffer data to string data
            const stringData = JSON.stringify(data)
            fs.ftruncate(fd, err => {
                if(!err && fd) {
                    fs.writeFile(fd, stringData, err => {
                        if(!err && fd) {
                            fs.close(fd, err => {
                                if(!err && fd) {
                                    callback(false)
                                } else {
                                    callback('there is a problem in closing file')
                                }
                            })
                        } else {
                            callback('there is a problem in updating file')
                        }
                    })
                } else {
                    callback('there was a problem in truncating file')
                }
            })
        } else {
            callback('file doesn\'t exist')
        }
    })
}

// read data
exports.readData = (file, callback) => {
    fs.readFile(basepath+file+'.json', 'utf-8', (err, data) => {
        if(!err && data) {
            const parseData = JSON.parse(data)
            callback(err, parseData)
        } else {
            callback('file may not exists')
        }
    })
}

exports.deleteData = (file, callback) => {
    fs.unlink(basepath+file+'.json', (err) => {
        if(!err) {
            callback(false)
        } else {
            callback('there is a problem in deleting file')
        }
    })
}
