import log from '@utils/log';
import { Models } from '@db/index';
import DB from '@const/DB.json';
import Sequelize from 'sequelize';

const { Mission } = Models;
const { Op } = Sequelize;

export default [{
  fireAt: '3 * * * * *',
  excute(fireDate) {
    const taskTag = 'state_mission_progressing';
    const now = new Date();

    Mission.update({
      state: DB.MISSION_STATE.progressing,
    }, {
      where: {
        startAt: {
          [Op.lte]: now,
        },
        endAt: {
          [Op.gte]: now,
        },
      },
    }).then(() => {
      log(taskTag, 'finish');
    });
  },
}, {
  fireAt: '3 * * * * *',
  excute(fireDate) {
    const taskTag = 'state_mission_finished';
    const now = new Date();

    Mission.update({
      state: DB.MISSION_STATE.finished,
    }, {
      where: {
        endAt: {
          [Op.lte]: now,
        },
      },
    }).then(() => {
      log(taskTag, 'finish');
    });
  },
}];
