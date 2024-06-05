const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

function gracefulShutdown() {
  console.log('Received signal to terminate. Shutting down gracefully...');
  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit(0);
  });

  // If after 10 seconds still not closed, force shutdown
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);

  // Close any open connections
  server.on('connection', (socket) => {
    socket.destroy();
  });
}

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
