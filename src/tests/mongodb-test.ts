var mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

// Connection URL
const url: string = 'mongodb://localhost:27017';
// Database name
const dbName: string = 'mydb';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });

// Use connect method to connect to the Server
client.connect(function(err: any) {
  if(err){
    throw err
  }
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  
  // Do something ...
  findAllDocuments(db, function() {
    client.close();
  });
  
  client.close();
});

// Create an interface for metrics
interface Metric {
  timestamp: string;
  value: number;
}

//
// Functions
//

// Insert document
const insertDocument = function(db: any, callback: any) {
  // Get the documents collection
  const collection = db.collection('documents');
  
  // Insert some document
  const metric: Metric = {
    timestamp: new Date().getTime().toString(),
    value: 42
  }
  
  collection.insertOne(metric, function(err: any, result: any) {
    if(err) throw err
    console.log("Document inserted into the collection");
    callback(result);
  });
  
  // Show all documents
  findAllDocuments(db, function() {
    client.close();
  });
}

// Insert many documents
const insertManyDocuments = function(db: any, callback: any) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Insert some documents
  const metrics: Metric[] = [
    { timestamp: new Date().getTime().toString(), value: 11},
    { timestamp: new Date().getTime().toString(), value: 22},
    { timestamp: new Date().getTime().toString(), value: 22},
  ]
  collection.insertMany(
    metrics,
    function(err: any, result: any) {
      if(err)
        throw err
      console.log("Document inserted into the collection");
      callback(result);
  });
}

// Find all documents
const findAllDocuments = function(db: any, callback: any) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err: any, docs: object) {
    if(err)
      throw err
    console.log("Found the following documents");
    console.log(docs)
    callback(docs);
  });
}

// Find documents with queries
const findDocuments = function(db: any, callback: any) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Find some documents
  collection.find({'value': 42}).toArray(function(err: any, docs: object) {
    if(err)
      throw err
    console.log("Found the following documents");
    console.log(docs)
    callback(docs);
  });
}
