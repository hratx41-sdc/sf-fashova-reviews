require('newrelic');
require('dotenv').config();
const cluster = require('cluster');
const cpuCount = require('os').cpus().length;
const express = require('express');

if (cluster.isMaster) {
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  const app = express();
  const port = process.env.PORT || 3001;
  const cors = require('cors');
  const bodyParser = require('body-parser');
  // const db = require('./mongodb.js'); //mongoDB
  const db = require('./psql.js'); //PostgresSQL
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.use(express.static('dist'));
  app.use(cors());
  
  // the colon symbolizes that whatever's after it is a parameter
  app.get('/api/reviews/:uuid', (req, res) => {
    const uuid = req.params.uuid
    if (!uuid) {
      res.status(404).end();
    }
    db.getReviewsByUuid(parseInt(uuid), (err, data) => {
      if (err) {
        console.log('There was an error running app.get', err);
        res.status(500).end();
      } else {
        res.status(200).send(data);
      }
    });
  });
  
  app.post('/api/reviews/', (req, res) => {
    const review = req.body;
    if (!review) {
      res.status(404).end();
    }
    db.insertReview(review, (err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.status(200).send('success');
      }
    });
  });
  
  app.put('/api/reviews/', (req, res) => {
    const review = req.body;
    if (!review) {
      res.status(404).end();
    }
    db.updateReview(review, (err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.status(200).send('success');
      }
    });
  });
  
  app.delete('/api/reviews/', (req, res) => {
    const review = parseInt(req.body.rid);
    if (!review) {
      res.status(404).end();
    }
    db.deleteReview(review, (err) => {
      if (err) {
        console.log(err);
        res.status(500).end();
      } else {
        res.status(200).send('success');
      }
    });
  });
  app.get('/loaderio-2ebf74fb664310f10b153ee0ac6816ee/', (req, res) => {
    res.status(200).send('loaderio-2ebf74fb664310f10b153ee0ac6816ee');
  });
  app.listen(port, () => console.log(`Listening on port ${port}!`));

}
