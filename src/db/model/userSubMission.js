import Sequelize from 'sequelize';
import DB from '@const/DB.json';

const { Model } = Sequelize;

class UserSubMission extends Model {
  getData() {
    const ret = {
      id: this.id,
      userId: this.userId,
      subMissionId: this.subMissionId,
      link: this.link,
      image: this.image,
      state: this.state,
      score: this.score,
    };
    if (this.user) {
      ret.user = this.user.getData();
    }
    if (this.subMission) {
      ret.subMission = this.subMission.getData();
    }
    return ret;
  }
}

function model(sequelize) {
  UserSubMission.init({
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    subMissionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    link: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.ENUM('submitted', 'reject', 'finish'),
      allowNull: false,
      defaultValue: 'submitted',
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    indexes: [{
      unique: true,
      fields: ['userId', 'subMissionId'],
      name: 'ids',
    }],
    sequelize,
    modelName: 'user_sub_mission',
    hooks: {
      afterCreate: (instance) => {
        const Timeline = sequelize.model('timeline');

        Timeline.create({
          userId: instance.userId,
          type: DB.TIMELINE_TYPE.user_sub_mission_create,
          relatedModel: DB.TIMELINE_MODEL.user_sub_mission,
          relatedId: instance.id,
        });
      },
    },
  });
  return UserSubMission;
}

export default model;
