import Sequelize from 'sequelize';
import DB from '@const/DB.json';

const { Model } = Sequelize;
const { UPLOAD_STATIC_PATH } = process.env;

const states = Object.values(DB.MISSION_STATE);

const MISSION_STATE = {
  pending: 'pending',
  progressing: 'progressing',
  finished: 'finished',
};

class Mission extends Model {
  getData() {
    const ret = {
      id: this.id,
      name: this.name,
      image: UPLOAD_STATIC_PATH + this.image,
      startAt: this.startAt,
      endAt: this.endAt,
      state: this.state,
    };
    if (this.subMissions) {
      ret.subMissions = this.subMissions.map((c) => c.getData());
    }
    return ret;
  }
}

function model(sequelize) {
  Mission.init({
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    startAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    state: {
      type: Sequelize.ENUM(...states),
      allowNull: false,
      defaultValue: DB.MISSION_STATE.pending,
    },
  }, {
    sequelize,
    modelName: 'mission',
  });
  return Mission;
}

export default model;
