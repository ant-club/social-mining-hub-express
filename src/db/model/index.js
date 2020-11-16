import thevar from './var';

const Models = {};

function model(sequelize) {
  Models.Var = thevar(sequelize);
  // 关系
  // Models.Task.belongsTo(Models.Apikey, { as: 'apikey' });

  return Models;
}

export default model;
