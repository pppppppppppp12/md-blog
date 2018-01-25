/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('document', {
    document_id: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.CHAR(60),
      allowNull: true
    },
    project_id: {
      type: DataTypes.CHAR(32),
      allowNull: true
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
    file_url: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    doc_id: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    stat: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'document'
  });
};
