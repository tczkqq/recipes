const express = require('express');
const session = require('express-session');
const app = express();
const fs = require('fs');
const cors = require('cors');

const port = 3000;
const secretKey = "TomaszJarnutowskiZ610"

const usersDir = './db/users.json';
const recipesDir = './db/recipes.json';

//CORS Middleware
app.use(function (req, res, next) {
//Enabling CORS
res.header("Access-Control-Allow-Origin", "http://127.0.0.1:4200");
res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
res.header("Access-Control-Allow-Credentials", "true");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
next();
});




app.use(express.json())
app.use(session({
    secret: secretKey,
    name: 'uniqueSessionID',
    saveUninitialized: true,
    resave: false
}));



app.get('/api', (req, res) => {
  res.send('Tomasz Jarnutowski Z610')
});


//Recipe
app.post("/api/addRecipe", (req, res) => {
  if (!isAuthorized(req)) return res.sendStatus(401);
  let rawdata = fs.readFileSync(recipesDir);
  let recipes = JSON.parse(rawdata);
  const id = recipes['lastId'] += 1;
  recipes['recipes'][id] = req.body;
  recipes["lastId"] = id;
  newData = JSON.stringify(recipes);
  fs.writeFile(recipesDir, newData, err => {}); 
  return res.json({id: id});
});
 

app.get("/api/getRecipe/:id", (req, res) => {
  const rawdata = fs.readFileSync(recipesDir);
  const recipes = JSON.parse(rawdata);
  const recipe = recipes['recipes'][req.params.id];
  if (typeof recipe === 'undefined') 
    return res.sendStatus(404);  
  return res.json(recipe);
});


app.get("/api/getRecipes", (req, res) => {
  const rawdata = fs.readFileSync(recipesDir);
  let recipes = JSON.parse(rawdata)['recipes'];
  if (typeof req.query.only !== 'undefined') {
    for (let key in recipes) {
      if (recipes[key.toString()]['type'] !== req.query.only) {
        delete recipes[key];
      }
    }
  }
  if (typeof req.query.dif !== 'undefined') {
    for (let key in recipes) {
      if (recipes[key.toString()]['difficulty'] !== +req.query.dif) {
        delete recipes[key];
      }
    }
  }
  if (typeof req.query.author !== 'undefined') {
    for (let key in recipes) {
      if (recipes[key.toString()]['author'] !== req.query.author) {
        delete recipes[key];
      }
    }
  }
  return res.json(recipes);  
});


app.delete("/api/deleteRecipe/:id", (req, res) => {
  if (!isAdmin(req)) return res.sendStatus(401);
  const rawdata = fs.readFileSync(recipesDir);
  const recipes = JSON.parse(rawdata);
  const recipe = recipes['recipes'][req.params.id];
  if (typeof recipe === 'undefined') 
    return res.sendStatus(404);  
  
  delete recipes['recipes'][req.params.id];
  newData = JSON.stringify(recipes);
  fs.writeFile(recipesDir, newData, err => {
  });
  return res.json(recipes);
});



// Users
app.post("/api/register", (req, res) => {
  let rawdata = fs.readFileSync(usersDir);
  let users = JSON.parse(rawdata);
  const username = req.body["username"];
  const password = req.body["password"];
  const name = req.body["name"];
  if (password === '' || username === '' || name === '') {
    return res.sendStatus(400);
  }

  if (users.hasOwnProperty(username)) {
    return res.sendStatus(409);
  }

  users[username] = {
    "name" : name,
    "password" : password,
    "type": 2
  }

  var newData = JSON.stringify(users);
  fs.writeFile(usersDir, newData, err => {}); 

  req.session.loggedIn = true;
  req.session.username = username; 
  req.session.type = users[username]['type']; 

  return res.json( {
    "name": users[username]['name'],
    "type": users[username]['type'],
  });
});


app.post("/api/login", (req, res) => {
  let rawdata = fs.readFileSync(usersDir);
  let users = JSON.parse(rawdata);
  const username = req.body["username"];
  const password = req.body["password"];
  if (
    users.hasOwnProperty(username) &&
    users[username]['password'] === password
    ) {
      req.session.loggedIn = true;
      req.session.username = username; 
      req.session.type = users[username]['type']; 
      return res.json( {
        "name": users[username]['name'],
        "type": users[username]['type'],
      });
    }
  

  return res.sendStatus(400);
});


app.get("/api/logout", (req, res) => {
  req.session.destroy((err)=>{})
  res.sendStatus(200);
});


app.get("/api/getUser/:username", (req, res) => {
  let rawdata = fs.readFileSync(usersDir);
  let users = JSON.parse(rawdata);
  const username = req.params.username;
  if (users.hasOwnProperty(username)) {
      user = {
        "name": users[username].name,
        "type": users[username].type
      }
      return res.json(user);
  }

  return res.sendStatus(404);
});


app.get("/api/getUsers", (req, res) => {
  let rawdata = fs.readFileSync(usersDir);
  let users = JSON.parse(rawdata);
  let output = [];
  for (let key in users) {
    output.push(users[key]['name']);
  }
  return res.json(output);
});


// Comments
app.post("/api/addComment/:id", (req, res) => {
  if (!isAuthorized(req)) return res.sendStatus(401);
  const rawdata = fs.readFileSync(recipesDir);
  const recipes = JSON.parse(rawdata);
  let recipe = recipes['recipes'][req.params.id];
  if (typeof recipe === 'undefined') 
     return res.sendStatus(404);  

  const comments = recipe['comments'];
  if (comments.length>=5) 
    return res.sendStatus(403);
  
  recipes['recipes'][req.params.id]['comments'].push(req.body)
  const newData = JSON.stringify(recipes);
  fs.writeFile(recipesDir, newData, err => {});
  return res.json(recipes['recipes'][req.params.id]);
});


app.get("/api/getComments/:id", (req, res) => {
  const rawdata = fs.readFileSync(recipesDir);
  const recipes = JSON.parse(rawdata);
  const recipe = recipes['recipes'][req.params.id];
  if (typeof recipe === 'undefined') 
    return res.sendStatus(404);  
  return res.json(recipe['comments']);
});


app.delete("/api/deleteComment/:id/:cid", (req, res) => {
  if (!isAdmin(req)) return res.sendStatus(401);
  const rawdata = fs.readFileSync(recipesDir);
  const recipes = JSON.parse(rawdata);
  const recipe = recipes['recipes'][req.params.id];
  if (typeof recipe === 'undefined') 
    return res.sendStatus(404);  

  delete recipes['recipes'][req.params.id]['comments'][req.params.cid];
  recipes['recipes'][req.params.id]['comments'] = recipes['recipes'][req.params.id]['comments'].filter(function (e) {return e != null;});
  newData = JSON.stringify(recipes);
  fs.writeFile(recipesDir, newData, err => {
  });
  return res.json(recipes['recipes'][req.params.id]);
});




app.listen(port, () => {
  console.log(`Tomasz Jarnutowski Z610 | http://localhost:${port}`)
})



// Tools
function isAuthorized(req) {
    if (!isSessionInitialized(req)) return false;
    
    return req.session.loggedIn;
}

function isSessionInitialized(req) {
  if (
      typeof(req.session.loggedIn) === 'undefined' ||
      typeof(req.session.username) === 'undefined' ||
      typeof(req.session.type) === 'undefined'
  ) return false;

  return true;
}

function isAdmin(req) {
    if (
        !isSessionInitialized(req) ||
        !isAuthorized(req)
    ) return false;
    return req.session.type == '1';
}

