const sequlize = require('sequelize');
const { DB } = require('../config/config.js');
const { DataTypes } = sequlize;

const UsedDetails = DB.define('UsedDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usage_duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  defects: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  accessories_included: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  customization: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'uuid'
    },
    onDelete: 'CASCADE',
    onUpdate:"CASCADE",
    validate: {
      notEmpty: true,
      notNull: true
    }
  }
}, {
  timestamps: true,
  freezeTableName: true,
  tableName: 'used_details'
});

module.exports = UsedDetails;
