import thevar from './var';
import user from './user';
import socialAccount, { SOCIAL_ACCOUNT_PROVIDER } from './socialAccount';

const Models = {};

function model(sequelize) {
  Models.Var = thevar(sequelize);
  Models.User = user(sequelize);
  Models.SocialAccount = socialAccount(sequelize);
  // 关系
  Models.SocialAccount.belongsTo(Models.User, { foreignKey: 'userId', sourceKey: 'id', as: 'user' });
  Models.User.hasMany(Models.SocialAccount, { foreignKey: 'userId', sourceKey: 'id', as: 'socialAccounts' });

  return Models;
}

export default model;
export {
  SOCIAL_ACCOUNT_PROVIDER,
};
