const express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      https = require('https'),
      docDB = require('documentdb').DocumentClient,
      DBNAME = 'demodb',
      docClient = new docDB('https://demodb01.documents.azure.com:443/', {masterKey: 's3qefuNxTtlGjiITwZzioLrXvsl49JZdRzbkUMFQMzPVr6tC1bXP4wNNjuXvcQWiKAcHBhIcMd16b6UhfO8LAw=='});


docClient.createCollection(`dbs/${DBNAME}`, { id: "orders" }, (error, collection) => {
  //console.log (`${JSON.stringify(error)}   ${JSON.stringify(collection)}`)
})

// Update stats from this node process in HASH_CURRENT_PROCESSES_KEY each second
var session = require('express-session');
var app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(__dirname + '/_static'));


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

app.get ('/:collection', (req, res) => {
  docClient.queryDocuments (`dbs/${DBNAME}/colls/${req.params.collection}`, {query: "SELECT * FROM root"}).toArray((error, resourcesList) => {
    console.log (`get: dbs/${DBNAME}/colls/${req.params.collection}`) //: ${JSON.stringify(error)}   ${JSON.stringify(resourcesList)}`)
    if (error) {
      res.status(500).json({error: `Something broke: ${JSON.stringify(error)}`})
    } else {
      res.json(resourcesList)
    }
  })
})

app.post ('/delorder', bodyParser.json(), (req, res) => {
  if (!req.body) return res.sendStatus(400)
  if (!Array.isArray(req.body.custId)) res.status(500).json({error: "custId needs to be an array of customer IDs"})

  let promises = []
  for (let cid of req.body.custId) {
    promises.push( new Promise( (resolve, reject) => {
      docClient.deleteDocument (`dbs/${DBNAME}/colls/orders/docs/${cid}`, {}, (error, order) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    }))
  }

  Promise.all(promises).then(() => res.json({"ok": 1}), (err) => res.status(500).json({error: `Something broke: ${JSON.stringify(err)}`}))
})

app.post ('/order', bodyParser.json(), (req, res) => {
  if (!req.body) return res.sendStatus(400)
  if (!Array.isArray(req.body.custId)) res.status(500).json({error: "custId needs to be an array of customer IDs"})

  let promises = []

  for (let cid of req.body.custId) {
    
    promises.push( new Promise( (resolve, reject) => {
      docClient.createDocument (`dbs/${DBNAME}/colls/orders`, {"custId": cid, "status": "QUEUED" ,"ref": req.body.ref}, (error, order) => {
        console.log (`createDocument: ${JSON.stringify(error)}   ${JSON.stringify(order)}`)

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
            resolve({tracking_id: pres.headers['x-ms-client-tracking-id']})
          } else {
            reject({error: `Something broke: ${pres.statusCode}`})
          }
          pres.on('data', (d) => {
            console.log(`data ${d}`);
          });
        })
        preq.write(JSON.stringify({orderId: order.id}));
        preq.end()

        preq.on('error', (e) => {
          console.error(e)
          reject({error: `Something broke: ${e}`})
        })

      })
    }))
  }
  Promise.all(promises).then((result) => res.json(result), (err) => res.status(500).json(err))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;
