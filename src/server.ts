import express = require('express')
import { Metric, MetricsHandler } from './metrics'
import mongodb from 'mongodb'
import { User, UserHandler } from './user'
import session = require('express-session')
import ConnectMongo = require('connect-mongo')
var moment = require('moment'); // To use Moment JS in index.ejs

const path = require('path')
const app = express()
const port: string = process.env.PORT || '8080'
const MongoClient = mongodb.MongoClient // Create a new MongoClient
const bodyparser = require('body-parser')
const MongoStore = ConnectMongo(session)
const authRouter = express.Router()
const userRouter = express.Router()
const userCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

//
// AUTH ROUTER
//


authRouter.get('/login', function (req: any, res: any) {
  res.render('user/login')
})

authRouter.get('/signup', function (req: any, res: any) {
  res.render('user/signup')
})

authRouter.get('/logout', function (req: any, res: any) {
  if (req.session.loggedIn) {
    delete req.session.loggedIn
    delete req.session.user
  }
  res.redirect('/login')
})

authRouter.post('/login', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result === null || !result.validatePassword(req.body.password)) {
      console.log(req.body.username + " succesfully logged in!")
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})



//
// USER ROUTER
//

// User creation and retrieval
userRouter.post('/', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result) {
      res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err)
          next(err)
        else
          res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.post('/signup', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result: User | null) {
    if (err) next(err)
    if (result) {
      res.status(409).send("User already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err)
          next(err)
        else
          res.redirect('/')
      })
    }
  })
})

// APP USE & SET

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(session({
  secret: 'user session',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: 'mongodb://localhost/mydb'})
}))
app.use(authRouter)
app.use(userRouter)
app.locals.moment = require('moment'); // To use Moment JS in index.ejs

//
// DB
//

var db: any
var dbUser: any

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true}, (err: any, client: any) => {
  if (err) throw err
  
  db = client.db('mydb')
  dbUser = new UserHandler(db)
  
  // Start the application after the databse connection is ready
  const port: string = process.env.PORT || '8115'
  app.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`server is listening on port ${port}`)
  })
})

//
// GET
//

app.get('/', userCheck, (req: any, res: any) => {
  new MetricsHandler(db).getFromUser(req.session.user.username, (err: any, result: any) => {
    if (err) res.status(500).json({error: err, result: result})
    res.render('pages/index', {user: req.session.user, metrics: result[0].metrics, moment: moment})
  })
})

app.get('/metrics', (req: any, res: any) => {
  if (req.session.user) {
    new MetricsHandler(db).getFromUser(req.session.user.username, (err: any, result: any) => {
      if (err) res.status(500).json({error: err, result: result})
      res.status(201).json({error: err, result: result})
    })
  } else {
    res.redirect('/login')
  }
})

app.get('/documents/:value', (req: any, res: any) => {
  if (req.body) {
    new MetricsHandler(db).getFromValue({'value': parseInt(req.params.value)}, (err: any, result: any) => {
      if (err) console.log(err)
      res.send(result)
      console.log(result)
    })
  }
})

//
// POST
//

app.post('/metrics', (req: any, res: any) => {
  if (req.body) {
    const metric = new Metric(new Date().getTime().toString(), parseInt(req.body.metric_value))
    new MetricsHandler(db).save(metric, req.session.user.username, (err: any, result: any) => {
      if (err) return res.status(500).json({error: err, result: result})
      res.status(201).redirect('/')
    })
  } else {
    return res.status(400).json({error: 'Wrong request parameter',})
  }
})

app.post('/delete_current_user', (req: any, res: any) => {
  var username = req.session.user.username
  new UserHandler(db).delete(username, (err: any, result: any) => {
    if (err) res.status(201).json({error: err, result: true})
  })
  res.redirect('/logout')
})

//
// DELETE
//

app.delete('/metrics/:timestamp', (req: any, res: any) => {
  if (req.session.user) {
    new MetricsHandler(db).deleteFromUser(req.session.user.username, req.params.timestamp, (err: any, result: any) => {
      if (err) res.status(500).json({error: err, result: result})
      console.log(result)
      res.redirect('/')
    })
  } else {
    res.redirect('/login')
  }
})

// userRouter.get('/:username', (req: any, res: any, next: any) => {
//   dbUser.get(req.params.username, function (err: Error | null, result: User | null) {
//     if (err || result === undefined)
//       res.status(404).send("User not found!")
//     else
//       res.status(200).json(result)
//   })
// })

//
// ERRORS
//

app.use(function (req: any, res: any, next: any) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err: any, req: any, res: any, next: any) {
  console.error(err.stack);
  res.status(500).send("Something broke!")
})
