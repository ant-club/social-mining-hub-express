import Sequelize from 'sequelize';

const { Model } = Sequelize;
const { UPLOAD_STATIC_PATH } = process.env;

const MISSION_STATE = {
  pending: 'pending',
  progressing: 'progressing',
  finished: 'finished',
};

class Mission extends Model {
  getData() {
    let state = MISSION_STATE.pending;
    const now = new Date();
    if (now > this.startAt) {
      state = MISSION_STATE.progressing;
    }
    if (now > this.endAt) {
      state = MISSION_STATE.finished;
    }

    const ret = {
      id: this.id,
      name: this.name,
      image: UPLOAD_STATIC_PATH + this.image,
      startAt: this.startAt,
      endAt: this.endAt,
      state,
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
  }, {
    sequelize,
    modelName: 'mission',
  });
  return Mission;
}

export default model;
