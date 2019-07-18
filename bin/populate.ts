import mongodb from 'mongodb'
import { Metric, MetricsHandler } from '../src/metrics'

const MongoClient = mongodb.MongoClient

var metrics = [new Metric(new Date().getTime().toString(), 11), new Metric(new Date().getTime().toString(), 12), new Metric(new Date().getTime().toString(), 13), new Metric(new Date().getTime().toString(), 14)]

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
