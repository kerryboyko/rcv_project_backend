import { MongoClient, Db } from 'mongodb';
import config from '../config';

const DEFAULT_DB = 'rcv_test';

const connect = (
  dbName: string = DEFAULT_DB
): Promise<{ db: Db; dbClose: () => void }> =>
  new Promise((resolve, reject) => {
    const client = new MongoClient(
      config.MONGO_URL || 'mongodb://localhost:27017',
      { useNewUrlParser: true }
    );
    client.connect((err: any) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const connection = client.db(dbName);
        resolve({ db: connection, dbClose: () => client.close() });
      }
    });
  });

export default connect;
