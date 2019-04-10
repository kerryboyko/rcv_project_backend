import dotenv from 'dotenv';

dotenv.config();

const config = process.env;
// if (process.env.NODE_ENV === 'test') {
//   config.MONGO_URL = `postgres://postgres:postgres@localhost:5432/freetyme_test`;
// }

export default config;
