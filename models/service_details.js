const sequlize = require('sequelize');
const { DB } = require('../config/config.js');
const { DataTypes } = sequlize;

const ServiceDetails = DB.define('ServiceDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique:true,
  },
  service_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  included_tasks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cancellation_policy: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  scope_of_work: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hourly_rate_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: true
    }
  },
  flat_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      isDecimal: true
    }
  },
  currency: {
    type: DataTypes.CHAR(3),
    defaultValue:"USD",
    validate:{
        notEmpty:true
    }
  },
  coverage_area: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  somthings_requierd: {   // kept original spelling from your list
    type: DataTypes.TEXT,
    allowNull: true,
  },
  experiance_year: {      // kept original spelling from your list
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: true
    }
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
  tableName: 'service_details'
});

module.exports = ServiceDetails;
