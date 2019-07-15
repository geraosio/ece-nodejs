const url = require('url')
const qs = require('querystring')

module.exports = {
  serverHandle: function (req, res) {
    const route = url.parse(req.url)
    const path = route.pathname
    const params = qs.parse(route.query)

    res.writeHead(200, {'Content-Type': 'text/plain'});

    
    if (path === '/') {
      res.write('This app says hello, and if you tell it your name it sends a personalized message.\n\n\n')
      res.write('To begin go to the path /hello?name=YourName.\n')
      res.write('If you want to use spaces in your name you need to use %20 instead of the whitespace. For example name=Your%20Name.\n')
    } else if (path === '/hello' && 'name' in params) {
      if (params['name'] === 'Gerardo') {
        res.write("Hello my name is Gerardo Osio. I'm studying at ECE!")
      } else {
        res.write('Hello ' + params['name'])
      }
    } else {
      res.write('404 Page not found')
    }
    
    res.end();
  }
}
