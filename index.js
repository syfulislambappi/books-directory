// dependencies
const http = require('http')
const reqResHandler = require('./handlers/reqResHandler')
const { createData, readData, updateData, deleteData } = require('./handlers/dataHandler')

// configuration
const port = 8080

// create server 
const server = http.createServer(reqResHandler)
server.listen(port, () => console.log(`server listening on port ${port}`))