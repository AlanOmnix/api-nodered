const mongo_host = process.env.DB_URI ? process.env.DB_URI : 'mongodb://localhost/api-node-red'

module.exports = { mongo_host }