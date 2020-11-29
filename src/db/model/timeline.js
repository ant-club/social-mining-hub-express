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
      scoreChange: this.scoreChange,
    };
    return ret;
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
    scoreChange: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'timeline',
  });
  return Timeline;
}

export default model;
