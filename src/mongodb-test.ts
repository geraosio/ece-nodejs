import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient

// Connection URL
const url: string = 'mongodb://localhost:27017';
// Database name
const dbName: string = 'mydb';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true });
// Use connect method to connect to the Server
client.connect(function(err) {
  if(err){
    throw err
  }
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  // Do something ...
  client.close();
});
