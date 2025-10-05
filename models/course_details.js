const sequlize = require('sequelize');
const { DB } = require('../config/config.js');
const { DataTypes } = sequlize;

const CourseDetails = DB.define('CourseDetails', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instructor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  syllabus: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  certificate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      isBoolean(value) {
        if (typeof value !== "boolean") {
          throw new Error("certificate must be a boolean");
        }
      }
    }
  },
  prerequires: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  platform: {
    type: DataTypes.STRING,
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
  tableName: 'course_details'
});

module.exports = CourseDetails;
