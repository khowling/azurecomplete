const express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      https = require('https'),
      docDB = require('documentdb').DocumentClient,
      docClient = new docDB('https://demodb01.documents.azure.com:443/', {masterKey: 's3qefuNxTtlGjiITwZzioLrXvsl49JZdRzbkUMFQMzPVr6tC1bXP4wNNjuXvcQWiKAcHBhIcMd16b6UhfO8LAw=='});


docClient.createCollection("dbs/demodb", { id: "orders" }, (error, collection) => {
  console.log (`${JSON.stringify(error)}   ${JSON.stringify(collection)}`)
})

// Update stats from this node process in HASH_CURRENT_PROCESSES_KEY each second
var session = require('express-session');
var app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));


// This is requried if serving client app from react hot loader, and server from node (different ports)
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Authorization,Content-Type,Cache-Control");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  //res.header("Access-Control-Allow-Headers", "Authorization");
  //res.header("Access-Control-Allow-Headers", "application/json;charset=UTF-8");
  if (req.method === 'OPTIONS')
    res.send();
  else {
    next();
  }
});

app.get ('/customers', (req, res) => {
  docClient.queryDocuments ("dbs/demodb/colls/customer", {query: "SELECT * FROM root"}).toArray((error, resourcesList) => {
    console.log (`${JSON.stringify(error)}   ${JSON.stringify(resourcesList)}`)
    if (error) {
      res.status(500).json({error: `Something broke: ${JSON.stringify(error)}`})
    } else {
      res.json(resourcesList)
    }
  })
})

app.post ('/order', bodyParser.json(), (req, res) => {
  if (!req.body) return res.sendStatus(400)

  docClient.createDocument ("dbs/demodb/colls/orders", req.body, (error, doc) => {
    console.log (`${JSON.stringify(error)}   ${JSON.stringify(doc)}`)

/*
    var preq = https.request( {
      hostname: 'prod-02.westeurope.logic.azure.com',
      port: 443,
      path: '/workflows/cce191ac1fa74b89a8533853079a1477/triggers/manual/run?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JqOdyk3E4_wBgjXzHo_lQpeRTTdlK0bBST7HoXA0mA4',
      method: 'POST',
      headers: {
      "Content-Type": "application/json" 
      }
    }, (pres) => {
      console.log('statusCode:', pres.statusCode)
      console.log('headers:', pres.headers)
      if (pres.statusCode == 202) {
        res.json({tracking_id: pres.headers['x-ms-client-tracking-id']})
      } else {
        res.status(500).json({error: `Something broke: ${pres.statusCode}`})
      }
      pres.on('data', (d) => {
        console.log(`data ${d}`);
      });
    })
    preq.write(JSON.stringify(req.body));
    preq.end()

    preq.on('error', (e) => {
      console.error(e)
      res.status(500).json({error: `Something broke: ${e}`})
    })
*/
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;
