require('../bootstrap')
require('songbird')
let path = require('path')
let express = require('express')
let morgan = require('morgan')
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let session = require('express-session')
let routes = require('./routes')
let browserify = require('browserify-middleware')
let Server = require('http').Server
let io = require('socket.io')
let cors = require('cors')
class App{

  constructor(config){
    let app = this.app = express()
    this.port = process.env.PORT || 8000
    this.app.config = { 
      database: config.database[process.env.NODE_ENV || "development"]
    }
    app.use(morgan('dev')) // log every request to the console
    app.use(cookieParser('ilovethenodejs')) // read cookies (needed for auth)
    app.use(bodyParser.json()) // get information from html forms
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.set('views', path.join(__dirname, '../views'))
    app.set('view engine', 'ejs') // set up ejs for templating

    // required for passport
    app.use(session({
      secret: 'ilovethenodejs',
      // store: new MongoStore({db: 'social-feeder'}),
      resave: true,
      saveUninitialized: true
    }))

    browserify.settings({transform: ['babelify']})
    app.use('/js/index.js', browserify('./public/js/index.js'))
    this.server = Server(app)
    this.io = io(this.server)
    routes(this.app)

    this.io.on('connection', socket => {
      console.log('a user connected')
      socket.on('disconnect', () => console.log('user disconnected'))

      socket.on('im', msg => {
                // im received
                console.log(msg)
                // echo im back
                this.io.emit('im', msg)
              })
    })
  }

  async initialize(port){
    await this.server.promise.listen(port)
    return this
  }


  // get app(){
  //   return this.app
  // }
}


module.exports = App
