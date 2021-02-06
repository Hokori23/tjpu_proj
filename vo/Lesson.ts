import { DataTypes, Model } from 'sequelize';
import User from './User';
import DB from '@database';

class Lesson extends Model {
  public id!: number | null;
  public uid!: number; // 外键 User.id
  public room_id!: string; // 腾讯会议ID
  public subject_id!: number; // 外键 Subject.id
  public title!: string;
  public start_time!: number;
  public end_time!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lesson.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    uid: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: '老师id'
    },
    room_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: '腾讯会议ID不能为空'
        },
        notEmpty: {
          msg: '腾讯会议ID不能为空'
        }
      },
      comment: '腾讯会议ID'
    },
    subject_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      comment: 'Subject_id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: '课堂标题不能为空'
        },
        notEmpty: {
          msg: '课堂标题不能为空'
        }
      },
      comment: '课堂标题'
    },
    start_time: {
      type:DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: {
          msg: '课堂开始时间不能为空'
        },
        notEmpty: {
          msg: '课堂开始时间不能为空'
        }
      },
      comment: '课堂开始时间'
    },
    end_time: {
      type:DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: {
          msg: '课堂预计结束时间不能为空'
        },
        notEmpty: {
          msg: '课堂预计结束时间不能为空'
        }
      },
      comment: '课堂预计结束时间'
    }
  },
  {
    sequelize: DB
  }
);

export default Lesson;
