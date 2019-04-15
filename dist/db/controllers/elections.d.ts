import { IElection } from '../../types';
export declare const dbCreateElection: (data: IElection) => Promise<string>;
export declare const dbRetrieveElection: (electionID: string) => Promise<any>;
export declare const dbUpdateElection: (
  electionID: string,
  changes: any
) => Promise<import('mongodb').FindAndModifyWriteOpResultObject<any>>;
export declare const dbCastVote: (
  electionID: string,
  voterId: string,
  vote: string[]
) => Promise<import('mongodb').FindAndModifyWriteOpResultObject<any>>;
declare const _default: {
  dbCreateElection: (data: IElection) => Promise<string>;
  dbRetrieveElection: (electionID: string) => Promise<any>;
  dbUpdateElection: (
    electionID: string,
    changes: any
  ) => Promise<import('mongodb').FindAndModifyWriteOpResultObject<any>>;
  dbCastVote: (
    electionID: string,
    voterId: string,
    vote: string[]
  ) => Promise<import('mongodb').FindAndModifyWriteOpResultObject<any>>;
};
export default _default;
//# sourceMappingURL=elections.d.ts.map
