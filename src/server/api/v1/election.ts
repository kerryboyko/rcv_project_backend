import { Application, Request, Response } from 'express';
import { IElection } from '../../../types';
import {
  dbCreateElection,
  dbRetrieveElection,
  dbCastVote,
} from '../../../db/controllers/elections';
import pick from 'lodash/pick';

const electionRoutes = (app: Application) => {
  // eventually this will have checkJWT & checkRole.
  app.post('/api/v1/elections/create', async (req: Request, res: Response) => {
    const election: IElection = req.body;
    try {
      const insertedID: string = await dbCreateElection(election);
      const retrievedElection = await dbRetrieveElection(insertedID);
      res.status(200).send({ ...retrievedElection, _id: insertedID });
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.get(
    '/api/v1/elections/:electionID',
    async (req: Request, res: Response) => {
      try {
        const election = await dbRetrieveElection(req.params.electionID);
        res.status(200).send({ ...election });
      } catch (err) {
        res.status(500).send(err);
      }
    }
  );

  app.post(
    '/api/v1/elections/:electionID/vote',
    async (req: Request, res: Response) => {
      const { voterId, vote } = req.body;
      const { electionID } = req.params;
      try {
        const ballotCast = await dbCastVote(electionID, voterId, vote);
        res.status(200).send({
          ...pick(ballotCast.value, [
            'electionStatus',
            'electionType',
            'pollsOpen',
            'pollsClose',
            'resultsVisibility',
            'seats',
            'title',
            'subtitle',
          ]),
          voterId,
          vote,
          electionID,
        });
      } catch (err) {
        res.status(500).send(err);
      }
    }
  );
  return app;
};

export default electionRoutes;
