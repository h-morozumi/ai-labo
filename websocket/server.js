const WebSocket = require('ws');
const Redis = require('ioredis');
const subscriber = new Redis();
const publisher = new Redis();

const wss = new WebSocket.Server({ port: 8080 });

async function subscribeStream(stream, listener) {
  let lastID = '$'

  while (true) {
    // Implement your own `try/catch` logic,
    // (For example, logging the errors and continue to the next loop)
    const reply = await subscriber.xread('BLOCK', '5000', 'COUNT', 100, 'STREAMS', stream, lastID);
    if (!reply) {
      continue;
    }

    const results = reply[0][1];
    const { length } = results;
    if (!results.length) {
      continue;
    }
    console.log(results)
    listener(results);
    lastID = results[length - 1][0];
  }
}

async function publishStream(stream, message) {
  await publisher.xadd(stream, '*', 'message', message);
}

// subscribeStream('mystream', console.log)

subscribeStream('mystream', function broadcast(results) {
  results.forEach(result => {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(result[1][1]);
      }
    });
  });
});

wss.on('connection', function connection(ws) {
  ws.on('message', async function incoming(message) {
    await publishStream('mystream', message);
    console.log('publish: ' + message);
  });
});
