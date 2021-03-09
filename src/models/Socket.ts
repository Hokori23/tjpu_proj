import { DataTypes, Model } from 'sequelize';
import DB from '@database';

class Socket extends Model {
  public id!: number | null;
  public openid!: number;
  public ip!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Socket.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '自增字段（主键）'
    },
    openid: {
      type: DataTypes.STRING(255),
      unique: 'openid',
      allowNull: false,
      validate: {
        notNull: {
          msg: 'OpenID不能为空'
        },
        notEmpty: {
          msg: 'OpenID不能为空'
        }
      },
      comment: 'OpenID'
    },
    ip: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'IP不能为空'
        },
        notEmpty: {
          msg: 'IP不能为空'
        },
        len: {
          args: [7, 15],
          msg: 'IP长度应为7至15字符'
        }
      },
      comment: 'IP'
    }
  },
  {
    sequelize: DB
  }
);

export default Socket;
