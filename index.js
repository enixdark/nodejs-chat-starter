require('./bootstrap')
require('songbird')

let path = require('path')

// let MongoStore = require('connect-mongo')(session)
// let mongoose = require('mongoose')
let requireDir = require('require-dir')

let config = requireDir('./config', {recurse: true})
let port = process.env.PORT || 8000

let App = require('./app/app')

async function main() {
  let app = new App(config)

  await app.initialize(port).then(() => console.log(`Listening @ http://127.0.0.1:${port}`))
  .catch((e) => console.log(e.stack ? e.stack : e))
}


main()
// connect to the database
// mongoose.connect(app.config.database.url)

// set up our express middleware


// configure routes

// start server
// app.listen(port, () => console.log(`Listening @ http://127.0.0.1:${port}`))
