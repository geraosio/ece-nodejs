import mongodb from 'mongodb'
import { Metric, MetricsHandler } from '../src/metrics'

const MongoClient = mongodb.MongoClient

var metrics = [new Metric("metric", 11), new Metric("metric", 12), new Metric("metric", 13), new Metric("metric", 14)]

MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
  if (err) throw err
  const db = client.db('mydb')
  metrics.map(metric => {
    new MetricsHandler(db).save(metric, (err: any, result: any) => {
      if (err) console.log(err)
    })
  })
  client.close()
})
