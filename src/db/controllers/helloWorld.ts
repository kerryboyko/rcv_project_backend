import connect from '../connect';
import { Collection, InsertWriteOpResult } from 'mongodb';

export const insertDocuments = (...docs: any[]): Promise<InsertWriteOpResult> =>
  new Promise((resolve, reject) => {
    connect('helloworld').then(({ db, dbClose }) => {
      const collection: Collection = db.collection('helloWorldTest');
      collection.insertMany(docs, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `Inserted ${result.result.n} documents in the connection`
          );
          dbClose();
          resolve(result);
        }
      });
    });
  });

export default {
  insertDocuments
}
