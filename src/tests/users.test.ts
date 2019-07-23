import { expect } from 'chai'
import { User, UserHandler } from '../user'
import { Metric, MetricsHandler } from '../metrics'
import mongodb from 'mongodb'

var dbUsers: UserHandler
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

describe('User', () => {
  before((done) =>  {
    mongoAsync((client: any) => {
      clientDb = client
      db = clientDb.db('mydb')
      dbMet = new MetricsHandler(db)
      dbUsers = new UserHandler(db)
      done()
    })
  })

  after(() => {
    clientDb.close()
  })
  
  describe('/get', () => {
    it('should retrieve the user, Mac', function() {
      var mac = new User('Mac', 'mac@example.com', 'iammac')
      dbUsers.save(mac, function(err: Error | null) { })
      dbUsers.get(mac.username, (err: Error | null, result: User | null) => {
        expect(err).to.be.null
        expect(result).to.not.be.null
      })
    })
  })

  describe('/save', () =>  {
    it('should save the new user, Mac', function() {
      var mac = new User('Mac', 'mac@example.com', 'iammac')
      dbUsers.save(mac, (err: Error | null) => {
        expect(err).to.not.be.null
      })
    })
  })
  
  describe('/delete', () =>  {
    it('should delete a user, Mac', function() {
      var mac = new User('Mac', 'mac@example.com', 'iammac')
      dbUsers.save(mac, function(err: Error | null) { })
      dbUsers.delete('Mac', (err: Error | null, result?: any) => {
        expect(err).to.not.be.null
        expect(result).to.not.be.undefined
        expect(result).to.not.be.empty
      })
    })
  })
})
