/* ---Imports---- */
const express = require('express')
require('./db')
const routes = require('./routes')
const cors = require('cors')


/* ------Express initialization------ */

const app = express()

/* -----Middlewares----- */

app.use(cors())
app.use(express.json())

/* -----Routes----- */

routes(app)

/* -----Listening----- */

const port = process.env.PORT ? process.env.PORT : 8083

app.listen(port, ()=>{
    console.log(`listening on http://localhost:${port}`)
})