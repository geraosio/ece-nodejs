import express = require('express')
import { Metric, MetricsHandler } from './metrics'
import mongodb from 'mongodb'

const path = require('path')
const app = express()
const port: string = process.env.PORT || '8080'
const MongoClient = mongodb.MongoClient // Create a new MongoClient
const bodyparser = require('body-parser')

// APP USE & SET

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

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

app.get('/documents', (req: any, res: any) => {
  if (req.body) {
    new MetricsHandler(db).getAll((err: any, docs: any) => {
      if (err) console.log(err)
      res.send(docs)
      console.log(docs)
    })
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
    const metric = new Metric("Metric", parseInt(req.body.value))
    new MetricsHandler(db).save(metric, (err: any, result: any) => {
      if (err) return res.status(500).json({error: err, result: result})
      res.status(201).json({error: err, result: true})
    })
  } else {
    return res.status(400).json({error: 'Wrong request parameter',})
  }
})

//
// DELETE
//

app.delete('/documents/:value', (req: any, res: any) => {
  if (req.body) {
    new MetricsHandler(db).deleteFromValue({'value': parseInt(req.params.value)}, (err: any, result: any) => {
      if (err) console.log(err)
      res.send(result)
      console.log(result)
    })
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
// Commented becuase we are now listening from the MongoClient.connect function
// app.listen(port, (err: Error) => {
//   if (err) {
//     throw err
//   }
//   console.log(`server is listening on port ${port}`)
// })
