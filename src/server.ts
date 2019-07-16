import express = require('express')
import { MetricsHandler } from './metrics'

const path = require('path')
const app = express()
app.use(express.static(path.join(__dirname, 'public')))
const port: string = process.env.PORT || '8080'

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')

app.get('/', (req: any, res: any) => {
  // res.write('Hello World')
  res.render('pages/index')
  // res.end()
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

app.use(function (req: any, res: any, next: any) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err: any, req: any, res: any, next: any) {
  console.error(err.stack);
  res.status(500).send("Something broke!")
})

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
