const express = require('express')
const path = require('path')
const metrics = require('./metrics.js')

const app = express()
const port = 8080

app.use(express.static('public'))

app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
  res.render('pages/index')
})

app.get('/hello/:name', function(req, res) {
  if (req.params.name == "Gerardo") {
    res.render('')
    res.send("Hello my name is Gerardo Osio. I'm studying at ECE!")
  } else {
    res.render('pages/hello', {name: req.params.name})
  }
})

app.use(function (res, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!")
})

app.get('/metrics.json', (req, res) => {
  metrics.get((err, data) => {
    if (err) throw err
    res.status(200).json(data)
  })
})

app.listen(port,
  () => console.log(`server listening on ${port}!`)
)
