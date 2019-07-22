export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}
  
export class MetricsHandler {
  private db: any
  
  constructor(db: any) {
    this.db = db
  }
  
  public save(metric: Metric, username: string, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('users')
    
    // Insert some document
    var insertionQuery = { $push: {"metrics": metric}}
    collection.updateOne({username: username}, insertionQuery, function(err: any, result: any) {
      if (err) return callback(err, result)
      console.log("Metric with value " + metric.value + " saved to user " + username + ".")
      callback(err, result)
    })
  }
  
  public getAll(callback: any) {
    const collection = this.db.collection('documents')
    
    collection.find({}).toArray(function(err: any, docs: object) {
      if (err) throw err
      callback(err, docs)
    })
  }
  
  public getFromValue(query: object, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')
    
    collection.find(query).toArray(function(err: any, docs: object) {
      if (err) throw err
      callback(err, docs);
    })
  }
  
  public getFromUser(username: string, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('users')
    
    collection.find({username: username}).toArray(function(err: any, result: object) {
        if(err) return callback(err, result)
        callback(err, result)
    });
  }
  
  // TODO: Can only delete the most recent metric
  public deleteFromUser(username: string, timestamp: any, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('users')
    
    collection.update({username: username}, { $pull: { metrics : { timestamp: timestamp } } }, function(err: any, result: any) {
        if (err) return callback(err, result)
        console.log("Metric with timestamp " + timestamp + " deleted from the current user")
        callback(err, result)
    });
  }
  
  public deleteFromValue(query: object, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')
    
    collection.remove(query, function(err: any, docs: object) {
      if (err) throw err
      callback(err, docs);
    })
  }
}
