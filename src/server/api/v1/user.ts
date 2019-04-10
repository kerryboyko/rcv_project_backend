import { Application, Request, Response } from 'express';
import { checkJwt } from '../../auth';
import axios from 'axios';
import config from '../../../config';
// import { omit } from 'lodash';

const userRoutes = (app: Application) => {
  // gets a profile
  app.get('/api/v1/profile', checkJwt, async (req: Request, res: Response) => {
    if (!req.headers.authorization) {
      res.status(403);
      return;
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
      const response = await axios.get(
        `${config.AUTH0_AUTHORIZATION_API_BASE}/userinfo`,
        {
          params: {
            access_token: accessToken,
          },
        }
      );
      console.log('/api/v1/profile, data from Auth0', response.data);
      // const record = await User.retrieveOrCreateUser(response.data);
      res.json(response.data);
    } catch (e) {
      console.log(e);
      res.send(e).status(500);
    }
  });

  // edits a profile
  app.post('/api/v1/profile', checkJwt, async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.headers.authorization) {
      res.status(403);
      return;
    }
    if (!req.body.profile) {
      res.status(401);
      return;
    }
    const { profile } = req.body;
    // const result: any = await User.updateProfile(
    //   'id',
    //   profile.id,
    //   omit(profile, ['id'])
    // );
    // console.log({ result });
    res.json(profile);
  });
};
export default userRoutes;
