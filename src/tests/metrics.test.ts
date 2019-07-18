import { expect } from 'chai'
import { Metric, MetricsHandler } from '../metrics'
import mongodb from 'mongodb'

var dbMet: MetricsHandler
var db: any
var clientDb: any

var mongoAsync = (callback: any) => {
  const MongoClient = mongodb.MongoClient // Create a new MongoClient
  MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true }, (err: any, client: any) => {
    if(err) throw err
    callback(client)
  });
}

describe('Metrics', () => {
  before((done) =>  {
    mongoAsync((client: any) => {
      clientDb = client
      db = clientDb.db('mydb')
      dbMet = new MetricsHandler(db)
      done()
    })
  })

  after(() => {
    clientDb.close()
  })

  // ...
})

describe('/get', () =>  {
  it('should get empty array', function() {
    dbMet.get(function(err: Error | null, result?: Metric[]) {
      expect(err).to.be.null
      expect(result).to.not.be.undefined
      expect(result).to.be.empty
    })
  })
})
