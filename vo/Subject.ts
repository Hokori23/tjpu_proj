import { DataTypes, Model } from 'sequelize';
import DB from '@database';


class Subject extends Model {
  public id!: number | null;
  public name!: string;
  public type!: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    name: {
      type: DataTypes.STRING(255),
      unique: 'name',
      allowNull: false,
      validate: {
        notNull: {
          msg: '课程名不能为空'
        },
        notEmpty: {
          msg: '课程名不能为空'
        },
      },
      comment: '课程名'
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '课程类型不能为空'
        },
        notEmpty: {
          msg: '课程类型不能为空不能为空'
        },
        max: 1,
        min: 0
      },
      comment: '课程类型不能为空'
    },
  },
  {
    sequelize: DB,
  }
);

export default Subject;
