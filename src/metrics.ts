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
  
  public save(metric: Metric, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')
    
    // Insert some document
    collection.insertOne(metric, function(err: any, result: any) {
      if (err) return callback(err, result)
      console.log("Document inserted into the collection")
      callback(err, result)
    })
  }
  
  static get(callback: (error: Error | null, result?: Metric[]) => void) {
    const result = [
      new Metric('2013-11-04 14:00 UTC', 12),
      new Metric('2013-11-04 14:30 UTC', 15)
    ]
    callback(null, result)
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
  
  public deleteFromValue(query: object, callback: (err: Error | null, result?: any) => void) {
    const collection = this.db.collection('documents')
    
    collection.remove(query, function(err: any, docs: object) {
      if (err) throw err
      callback(err, docs);
    })
  }
}
