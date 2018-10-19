# Student Time Table
Student can use this application to choose class and check their time tables.
This is a nodejs project and use express.js to build the backend, and vue.js as the frontend.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites
npm and git should be installed on the server before installation.

# Installation
Change directory to where you downlaod the project, and then execute below steps:

npm install         // install dependency

cd /src/server    // start server, localhost:3000
node app.js

cd /src/client    // start client, localhost:8080
npm run dev

open the link http://localhost:8080 by your browser.

*If you meet below error1 when start server:
------------------------------------------------------------------------------------------------------------------------------
module.js:478
    throw err;
    ^

Error: Cannot find module '/home/ec2-user/crud-project/node_modules/sqlite3/lib/binding/node-v48-linux-x64/node_sqlite3.node'
    at Function.Module._resolveFilename (module.js:476:15)
    at Function.Module._load (module.js:424:25)
    at Module.require (module.js:504:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/home/ec2-user/crud-project/node_modules/sqlite3/lib/sqlite3.js:4:15)
    at Module._compile (module.js:577:32)
    at Object.Module._extensions..js (module.js:586:10)
    at Module.load (module.js:494:32)
    at tryModuleLoad (module.js:453:12)
    at Function.Module._load (module.js:445:3)
------------------------------------------------------------------------------------------------------------------------------
please run below command:
  npm install --save sqlite3
  
*If you meet below error2 when start server:
------------------------------------------------------------------------------------------------------------------------------
module.js:478
    throw err;
    ^

Error: Cannot find module 'bcrypt'
    at Function.Module._resolveFilename (module.js:476:15)
    at Function.Module._load (module.js:424:25)
    at Module.require (module.js:504:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/home/ec2-user/crud-project/src/server/dao/userCRUD.js:8:14)
    at Module._compile (module.js:577:32)
    at Object.Module._extensions..js (module.js:586:10)
    at Module.load (module.js:494:32)
    at tryModuleLoad (module.js:453:12)
    at Function.Module._load (module.js:445:3)
------------------------------------------------------------------------------------------------------------------------------
please run below command:
 npm install --save bcrypt

# Function
user can login/register/signout
user can choose new modules
user can check current selected modules
user can check the ranking of all modules
user can give one module a LIKE to support the modules(only one time)

# Running the tests
The testing part will coming soon.

# Version
Current Version is 1.0

# Authors
Tian Liu

# License
This project is licensed under the MIT License - see the LICENSE.md file for details
