/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('project', {
    project_id: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      primaryKey: true
    },
    pid: {
      type: DataTypes.CHAR(32),
      allowNull: true,
      defaultValue: ''
    },
    name: {
      type: DataTypes.CHAR(60),
      allowNull: true,
      defaultValue: ''
    },
    owner_uid: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    rt: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    role: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    stat: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'project'
  });
};
