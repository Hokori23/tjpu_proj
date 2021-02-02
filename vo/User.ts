import {
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin,
  Association,
  DataTypes,
  Model
} from 'sequelize';
import DB from '@database';

import { Socket } from '@vo';

interface UserAttributes {
  id: number | null;
  openid: number; //OpenID
  nickName: string; // 用户名*
  avatarUrl: string; // 头像*
  country: string | null; // 国家*
  province: string | null; // 省份*
  city: string | null; // 城市*
  gender: number; // 性别*: { 0: 未知; 1: 男性; 2: 女性 }

  realName: string | null; // 真实姓名
  role: number | null; // 身份: { 0: 志愿者; 1: 需求者}
  grade: string | null; // 年级 如：研一、大一、高一等

  eduType: number; // { 0: 学业辅导; 1: 心理辅导 }
  options: string; // JSONObject
  /**
   * @description
   *
   * 学业辅导：
   *   数学
   *   英语
   *   语文
   *   .etc
   *
   * 心理辅导：
   *   学习类问题
   *   人际关系类问题
   *   青春期心理问题
   *   挫折适应问题
   *
   */
  socket: Socket;

  createdAt: Date;
  updatedAt: Date;
}

class User extends Model implements UserAttributes {
  public id!: number | null;
  public openid!: number;
  public nickName!: string;
  public avatarUrl!: string;
  public country!: string;
  public province!: string | null;
  public city!: string | null;
  public gender!: number;

  public realName!: string | null;
  public role!: number;
  public grade!: string | null;

  public eduType!: number;
  public options!: string;

  public socket!: Socket;
  public static associations: {
    socket: Association<User, Socket>;
  };
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getSocket!: HasOneGetAssociationMixin<Socket>;
  public createSocket!: HasOneCreateAssociationMixin<Socket>;
}

User.init(
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
    nickName: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户名不能为空'
        },
        notEmpty: {
          msg: '用户名不能为空'
        },
        len: {
          args: [2, 20],
          msg: '用户名长度应为2至20字符'
        }
      },
      comment: '用户名'
    },
    avatarUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: '头像路径不能为空'
        },
        notEmpty: {
          msg: '头像路径不能为空'
        }
      },
      comment: '头像路径'
    },
    country: {
      type: DataTypes.STRING(50),
      comment: '国家'
    },
    province: {
      type: DataTypes.STRING(50),
      comment: '省份'
    },
    city: {
      type: DataTypes.STRING(50),
      comment: '城市'
    },
    gender: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        max: 2,
        min: 0
      },
      comment: '性别'
    },
    realName: {
      type: DataTypes.STRING(20),
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: '真实姓名不能为空'
      //   },
      //   notEmpty: {
      //     msg: '真实姓名不能为空'
      //   }
      // },
      comment: '真实姓名'
    },
    role: {
      type: DataTypes.TINYINT.UNSIGNED,
      // allowNull: false,
      // validate: {
      //   max: 1,
      //   min: 0
      // },
      comment: '身份'
    },
    grade: {
      type: DataTypes.STRING(20),
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: '年级不能为空'
      //   },
      //   notEmpty: {
      //     msg: '年级不能为空'
      //   }
      // },
      comment: '年级'
    },
    eduType: {
      type: DataTypes.TINYINT.UNSIGNED,
      // allowNull: false,
      // validate: {
      //   max: 1,
      //   min: 0
      // },
      comment: '{ 0: 学业辅导; 1: 心理辅导 }'
    },
    options: {
      type: DataTypes.TEXT,
      // allowNull: false,
      // validate: {
      //   notNull: {
      //     msg: '辅导设置不能为空'
      //   },
      //   notEmpty: {
      //     msg: '辅导设置不能为空'
      //   }
      // },
      comment: '辅导设置'
    }
  },
  {
    sequelize: DB,
    tableName: 'user'
  }
);

export default User;
