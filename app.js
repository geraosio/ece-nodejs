const express = require('express')

const app = express()
const port = 8080

app.listen(port,
  () => console.log(`server listening on ${port}!`)
)

app.get('/', function(req, res) {
  res.send(`
    This app says hello, and if you tell it your name it sends a personalized message.\n
    To begin go to the path /hello/YourName.\n
    If you want to use spaces in your name you need to use %20 instead of the whitespace. For example to write John Doe you need to put John%20Doe.
  `)
})

app.get('/hello/:name', function(req, res) {
  if (req.params.name == "Gerardo") {
    res.send("Hello my name is Gerardo Osio. I'm studying at ECE!")
  } else {
    res.send('Hello ' + req.params.name)
  }
})

app.use(function (res, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!")
})
