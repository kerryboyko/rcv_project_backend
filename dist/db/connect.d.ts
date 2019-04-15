import { Db } from 'mongodb';
declare const connect: (
  dbName?: string
) => Promise<{
  db: Db;
  dbClose: () => void;
}>;
export default connect;
//# sourceMappingURL=connect.d.ts.map
