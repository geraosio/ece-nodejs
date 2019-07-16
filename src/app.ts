const express = require('express')
const path = require('path')
const metrics = require('./metrics.js')

const app = express()
const port = 8080

app.use(express.static('public'))

app.set('views', __dirname + "views")
app.set('view engine', 'ejs')

app.get('/', function(req: any, res: any) {
  res.render('../pages/index')
})

app.get('/hello/:name', function(req: any, res: any) {
  if (req.params.name == "Gerardo") {
    res.render('')
    res.send("Hello my name is Gerardo Osio. I'm studying at ECE!")
  } else {
    res.render('../pages/hello', {name: req.params.name})
  }
})

app.get('/metrics.json', (req: any, res: any) => {
  metrics.get((err: any, data: any) => {
    if (err) {
      throw err
    }
    res.status(200).json(data)
  })
})


app.use(function (req: any, res: any, next: any) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err: any, req: any, res: any, next: any) {
  console.error(err.stack);
  res.status(500).send("Something broke!")
})


app.listen(port,
  () => console.log(`server listening on ${port}!`)
)
