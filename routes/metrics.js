const express = require('express');
const client = require('prom-client');

const router = express.Router();
const { collectDefaultMetrics } = client;

collectDefaultMetrics({ timeout: 5000 });

const counter = new client.Counter({
  name: 'railmate_api_http_requests',
  help: 'metric_help',
  labelNames: ['route', 'type'],
});

router.get('/', (req, res) => {
  counter.inc({ route: '/metrics', type: 'get' });
  res.set('Content-Type', client.register.contentType);
  res.end(client.register.metrics());
});

module.exports = {
  router,
  client,
  counter,
};
