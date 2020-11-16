import thevar from './var';
import user from './user';

const Models = {};

function model(sequelize) {
  Models.Var = thevar(sequelize);
  Models.User = user(sequelize);
  // 关系
  // Models.Task.belongsTo(Models.Apikey, { as: 'apikey' });

  return Models;
}

export default model;
