import mongodb from 'mongodb'
import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/user'

const MongoClient = mongodb.MongoClient

var userOne = new User('john', 'john@email.com', 'iamjohn')
var userTwo = new User('bob', 'bob@email.com', 'iambob')
var metricsUserOne = [new Metric(new Date().toString(), 23), new Metric(new Date().toString(), 923841)]
var metricsUserTwo = [new Metric(new Date().toString(), 8234), new Metric(new Date().toString(), 5721)]

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if (err) throw err
  const db = client.db('mydb')
  
  new UserHandler(db).save(userOne, (err: Error | null) => {
    if (err) console.log(err)
  })
  
  new UserHandler(db).save(userTwo, (err: Error | null) => {
    if (err) console.log(err)
  })
  
  metricsUserOne.map(metric => {
    new MetricsHandler(db).save(metric, userOne.username, (err: any, result: any) => {
      if (err) console.log(err)
    })
  })
  
  metricsUserTwo.map(metric => {
    new MetricsHandler(db).save(metric, userTwo.username, (err: any, result: any) => {
      if (err) console.log(err)
    })
  })
  
  client.close()
})
