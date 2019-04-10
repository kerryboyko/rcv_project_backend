import runServer from './server/init';
import config from './config';

const { SERVER_PORT } = config;

const server = runServer(parseInt(SERVER_PORT as string, 10));

console.log(`App is running on port ${SERVER_PORT}`);

const shutDown = () => {
  console.log('Received kill signal, shutting down gracefully');
  server.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down'
    );
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
