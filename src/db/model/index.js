import thevar from './var';
import user from './user';
import socialAccount from './socialAccount';
import project from './project';
import mission from './mission';
import subMission from './subMission';
import userSubMission from './userSubMission';
import timeline from './timeline';

const Models = {};

function model(sequelize) {
  Models.Var = thevar(sequelize);
  Models.User = user(sequelize);
  Models.SocialAccount = socialAccount(sequelize);
  Models.Project = project(sequelize);
  Models.Mission = mission(sequelize);
  Models.SubMission = subMission(sequelize);
  Models.UserSubMission = userSubMission(sequelize);
  Models.Timeline = timeline(sequelize);
  // 关系
  Models.SocialAccount.belongsTo(Models.User, { foreignKey: 'userId', sourceKey: 'id', as: 'user' });
  Models.User.hasMany(Models.SocialAccount, { foreignKey: 'userId', sourceKey: 'id', as: 'socialAccounts' });

  Models.Mission.belongsTo(Models.Project, { foreignKey: 'projectId', sourceKey: 'id', as: 'project' });
  Models.Project.hasMany(Models.Mission, { foreignKey: 'projectId', sourceKey: 'id', as: 'missions' });

  Models.SubMission.belongsTo(Models.Mission, { foreignKey: 'missionId', sourceKey: 'id', as: 'mission' });
  Models.Mission.hasMany(Models.SubMission, { foreignKey: 'missionId', sourceKey: 'id', as: 'subMissions' });

  Models.UserSubMission.belongsTo(Models.SubMission, { foreignKey: 'subMissionId', sourceKey: 'id', as: 'subMission' });
  Models.UserSubMission.belongsTo(Models.User, { foreignKey: 'userId', sourceKey: 'id', as: 'user' });

  return Models;
}

export default model;
