import Sequelize from 'sequelize';
import DB from '@const/DB.json';

const { Model } = Sequelize;

const types = Object.values(DB.TIMELINE_TYPE);
const models = Object.values(DB.TIMELINE_MODEL);

class Timeline extends Model {
  getData() {
    const ret = {
      id: this.id,
      userId: this.userId,
      type: this.type,
      relatedModel: this.relatedModel,
      relatedId: this.relatedId,
      relatedName: this.relatedName,
      scoreChange: this.scoreChange,
      createdAt: this.createdAt,
    };
    return ret;
  }

  getRelatedModel() {
    const { type } = this;
    if (
      type === DB.TIMELINE_TYPE.user_sub_mission_create
      || type === DB.TIMELINE_TYPE.user_sub_mission_create
    ) {
      const UserSubMission = Timeline.sequelize.model('user_sub_mission');
      const SubMission = Timeline.sequelize.model('sub_mission');
      const Mission = Timeline.sequelize.model('mission');
      return UserSubMission.findByPk(this.relatedId, {
        include: [{
          model: SubMission,
          include: [{
            model: Mission,
            as: 'mission',
            attributes: ['id', 'image', 'name'],
          }],
          as: 'subMission',
          attributes: ['id', 'provider', 'score', 'title'],
        }],
      });
    }
    return Promise.resolve(null);
  }

  updateRelatedName() {
    const { type } = this;
    return this.getRelatedModel().then((instance) => {
      if (
        type === DB.TIMELINE_TYPE.user_sub_mission_create
        || type === DB.TIMELINE_TYPE.user_sub_mission_create
      ) {
        const data = instance.getData();
        const relatedName = `${data.subMission.mission.name}-${data.subMission.title}`;
        this.relatedName = relatedName;
        return this.save();
      }
      return this;
    });
  }
}

function model(sequelize) {
  Timeline.init({
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM(...types),
      allowNull: false,
    },
    relatedModel: {
      type: Sequelize.ENUM(...models),
    },
    relatedId: {
      type: Sequelize.INTEGER,
    },
    relatedName: {
      type: Sequelize.STRING,
    },
    scoreChange: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'timeline',
    hooks: {
      afterCreate(instance) {
        instance.updateRelatedName();
      },
    },
  });
  return Timeline;
}

export default model;
