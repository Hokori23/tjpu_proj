import { DataTypes, Model } from 'sequelize';
import User from './User';
import DB from '@database';

class Subscribe extends Model {
  public uid!: number; // 外键 User.id  primaryKey1
  public lesson_id!: number; // 外键 Lesson.id  primaryKey2

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subscribe.init(
  {
    uid: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      comment: 'Subscriber\'s id from User table'
    },
    lesson_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      comment: 'Lesson\'s id from Lesson table'
    },
  },
  {
    sequelize: DB
  }
);

export default Subscribe;
