/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('idcenter', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    k: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'idcenter'
  });
};
