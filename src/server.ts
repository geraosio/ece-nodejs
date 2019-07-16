import express = require('express')
import { MetricsHandler } from './metrics'
import mongodb from 'mongodb'

const path = require('path')
const app = express()
const port: string = process.env.PORT || '8080'
const MongoClient = mongodb.MongoClient // Create a new MongoClient

//
// DB
//

var db: any

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true}, (err: any, client: any) => {
  if (err) throw err
  db = client.db('mydb')
  
  // Start the application after the databse connection is ready
  const port: string = process.env.PORT || '8115'
  app.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`server is listening on port ${port}`)
  })
})

// APP USE & SET

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')

//
// GET
//

app.get('/', (req: any, res: any) => {
  res.render('pages/index')
})

app.get('/metrics', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.get('/hello/:name', (req:any, res:any) => {
  if (req.params.name == "Gerardo") {
    res.send("Hello my name is Gerardo Osio. I'm studying at ECE!")
  } else {
    res.render('pages/hello', {name: req.params.name})
  }
})

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

//
// LISTEN
//

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
