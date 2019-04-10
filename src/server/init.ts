import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { checkJwt, checkRole } from './auth';

import userRoutes from './api/v1/user';

const runServer = (port: number) => {
  const app: express.Application = express();
  app.use(bodyParser.json());

  /* PREFLIGHT / CORS */
  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
  });

  app.use(bodyParser.json({ type: 'application/*+json' }));
  app.use(morgan('dev'));
  /* PUBLIC ROUTES */
  app.get('/public', (_, res) => {
    res.json({
      message: 'Hello from a public API!',
    });
  });

  /* PRIVATE ROUTES */
  app.get('/private', checkJwt, (_, res) => {
    res.json({
      message: 'Hello from a private API!',
    });
  });

  /* PRIVATE ROLED ROUTES */
  app.get('/admin', checkJwt, checkRole('admin'), (_, res) => {
    res.json({
      message: 'Hello from an admin-only API!',
    });
  });

  /* API Routes */
  userRoutes(app);

  return app.listen(port);
};

export default runServer;
