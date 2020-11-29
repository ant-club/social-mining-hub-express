import Sequelize from 'sequelize';

const { Model } = Sequelize;
const { UPLOAD_STATIC_PATH } = process.env;

class Project extends Model {
  getData() {
    const ret = {
      name: this.name,
      image: UPLOAD_STATIC_PATH + this.image,
    };
    return ret;
  }
}

function model(sequelize) {
  Project.init({
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'project',
  });
  return Project;
}

export default model;
