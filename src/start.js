/* eslint-disable no-console */
import { db, Models } from './db';
import app from './app';
import log from './utils/log';

const PORT = process.env.PORT || '3000';

db.authenticate().then(() => {
  console.log('Connect Database.');
  Object.keys(Models).forEach((key) => {
    if (key === 'Lottery') {
      Object.keys(Models[key]).forEach((lotteryKey) => {
        Models[key][lotteryKey].sync().then(() => {
          log(`${key}.${lotteryKey} table Sync.`);
        });
        Models[key][lotteryKey].Order.sync().then(() => {
          log(`${key}.${lotteryKey}.Order table Sync.`);
        });
      });
    } else {
      Models[key].sync().then(() => {
        log(`${key} table Sync.`);
      });
    }
  });

  app.listen(PORT, () => {
    log(`Example app listening on port ${PORT}`);
  });
});
