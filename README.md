# Node.js Project

## Introduction

Website that receives a ```name``` parameter and says hello + the name passed as parameter.

## Installation

To be able to run the web server you must have node.js and npm installed.
To check if you have it installed run:
```
node -v
```
If by running this command it doesn't show you the version number, install it by following the instructions in [https://nodejs.org/](https://nodejs.org/).

After having node install
```
npm install
```

Now after that make sure you have MongoDB installed in your computer and have the mongo server running. To download and install it follow the instruction from the MongoDB official page [https://www.mongodb.com/](https://www.mongodb.com/download-center/community).

After installing MongoDB start the database by running the following command
```
mongod
```


## Usage

Now you can start the web server in the terminal using the following command:
```
npm start
```

To see the website in the browser go to ```localhost:8115/``` and create a new account or you can run ```npm run populate``` to populate the app with test users and metrics.

To see the credentials of these test users see the file [/bin/populate.ts](https://github.com/geraosio/ece-nodejs/blob/master/bin/populate.ts).

## Contributors
[geraosio](https://github.com/geraosio)
