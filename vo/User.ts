import {
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin,
  Association,
  DataTypes,
  Model
} from 'sequelize';
import DB from '@database';

import { Socket } from '@vo';

class User extends Model {
  public id!: number | null;
  public openid!: string;
  public nickName!: string;
  public avatarUrl!: string;
  public country!: string;
  public province!: string | null;
  public city!: string | null;
  public gender!: number; // 性别*: { 0: 未知; 1: 男性; 2: 女性 }

  public realName!: string | null;
  public role!: number; // 身份: { 0: 未知; 1: 老师; 2: 学生}
  public grade!: number | null;

  public options!: string; // JSONObject
  /**
   * @description
   * // 针对学生的课堂匹配设置
   * type: number | null // { 0: 学业辅导, 1: 心理辅导 }
   * subject_id: Array<number> || [] // 已选中的课程标签（每次前端和后端做一个filter并更新字段，保证设置中每个标签的合法性）
   * days: Array<number> || [] // 匹配时间
   * hours: Array<number> || [] // 匹配时间
   *
   *
   *
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
   * days
   *
   */

  // TODO: 记得判断是否确定需要这段
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
      allowNull: false,
      defaultValue: 0,
      validate: {
        max: 2,
        min: 0
      },
      comment: '{ 0: 未知, 1: 老师, 2: 学生}'
    },
    grade: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        notNull: {
          msg: '年级不能为空'
        },
        notEmpty: {
          msg: '年级不能为空'
        }
      },
      comment: '年级'
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: `{
        "start_time": null,
        "end_time": null,
        "subject_id": []
      }`,
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
    sequelize: DB
  }
);

export default User;
