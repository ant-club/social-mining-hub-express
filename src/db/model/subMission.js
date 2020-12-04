import Sequelize from 'sequelize';
import DB from '@const/DB.json';

const { Model } = Sequelize;

const provider = Object.values(DB.SOCIAL_ACCOUNT_PROVIDER);

class SubMission extends Model {
  getData() {
    const ret = {
      id: this.id,
      title: this.title,
      description: this.description,
      provider: this.provider,
      score: this.score,
      missionId: this.missionId,
    };
    if (this.mission) {
      ret.mission = this.mission.getData();
    }
    return ret;
  }
}

function model(sequelize) {
  SubMission.init({
    missionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(1000),
      allowNull: false,
    },
    provider: {
      type: Sequelize.ENUM(...provider),
      allowNull: false,
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'sub_mission',
  });
  return SubMission;
}

export default model;
