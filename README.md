# README #

API Server is built using NodeJS + ExpressJs + MySQL + Sequelize.
Bootstrap 4  is added using Gulp

### Features: ###
- NodeJs 8x
- ExpressJs 4x
- MySql 5.7
- SequelizeJs 4x
- Logging Support using bunyan & morgan
- Bootstrap 4x with scss support
- Gulp used to build the html,Bootstrap,css,js files

### Pre-requisite ###

Node.js -- version 8.11.2 LTS

### Installation - API Server ###

To install dependencies, please run
* $ npm install

To take build copy of html,bootstrap,etc., inside src folder.
* $ npm run build

Then start the node server, please run
* $ npm start

To run in watch mode for src folder,
* $ npm run watch

Front End URL : http://localhost:4040/
API URL : http://localhost:4040/api/v1/auth/login



### Folder Structure: ###
_protected  // application code are reside in this folder
 - api      // contians our api server codes
   - config  // contains all the needed app constanst + configuration files for api server
   - helpers // contains helper files which we used in our server   
   - middleware // contains middleware files which we used in our server
   - v1      //  this folder maintains the needed api server codes for version v1
    - auth   // this folder contains our application authentications
     - auth.controller.js
     - auth.route.js
    - shared  // this folder contains share modules/services.
     - services
       - user.service.js
       - index.js
       index.js
    - user    // User related routes, controllers, models are grouped in a folder for easier access with module approach
      - user.controller.js
      - user.model.js
      - user.role.model.js
      - user.route.js
    - model.js  // this file handles the db connection established using sequelizejs ORM
    - route.js  //contains our application routes
   .gitignore
db   // contains mysql schema files
logs // application logs are stored in this folder
public // contains the build files for web
src // contains the html,css,js assets files for web
.env // contains the environmental variables
.gitignore
.jshintrc
 index.js
 package.json


 
 





