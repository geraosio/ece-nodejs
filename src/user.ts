export class User {
  public username: string
  public email: string
  private password: string = ""
  
  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email
    
    if (!passwordHashed) {
      this.setPassword(password)
    } else {
      this.password = password
    }
  }
  
  static fromDatabase(username: string, value: any): User {
    console.log(value)
    return new User(username, value.email, value.password)
  }
  
  public setPassword(toSet: string): void {
    // Hash and set password
    this.password = toSet
  }
  
  public getPassword(): string {
    return this.password
  }
  
  public validatePassword(toValidate: string): boolean {
    return this.password === toValidate
  }
}

export class UserHandler {
  public database: any
  
  constructor(db: any) {
    this.database = db
  }
  
  public get(username: string, callback: (err: Error | null, result: User | null) => void) {
    const collection = this.database.collection('users')
    
    collection.findOne({username: username}, function(err: any, result: any) {
      if (err) return callback(err, result)
      if (result)
        callback(err, User.fromDatabase(username, result))
      else
        callback(err, null)
    })
  }
  
  public save(user: User, callback: (err: Error | null) => void) {
    const collection = this.database.collection('users')
    
    collection.insertOne(user, function (err: any, result: any) {
      if (err) return callback(err)
      console.log("User inserted into the collection")
      callback(err)
    })
  }
  
  public delete(username: string, callback: (err: Error | null, result?: any) => void) {
    const collection = this.database.collection('users')
    
    collection.removeOne({username: username}, function (err: any, result: any) {
      if (err) return callback(err, result)
      console.log("User " + username + " deleted from database")
      callback(err, result)
    })
  }
}
