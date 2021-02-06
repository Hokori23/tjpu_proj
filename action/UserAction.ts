import { User } from '@vo';

/**
 * 添加用户
 * @param { User } user
 */
const Create = (user: User): Promise<User> => {
  return user.save();
};

/**
 * 通过openid查询单个用户
 * @param { string } openid
 * @param { boolean } safe
 */
const Retrieve__OpenID = (
  openid: string,
  safe: boolean = true
): Promise<User | null> => {
  return User.findOne({
    attributes: {
      exclude: safe ? ['socket', 'password'] : ['socket']
    },
    where: {
      openid
    }
  });
};

/**
 * 通过id查询单个用户
 * @param { number } id
 * @param { boolean } safe
 */
const Retrieve__ID = (
  id: number,
  safe: boolean = true
): Promise<User | null> => {
  return User.findOne({
    attributes: {
      exclude: safe ? ['socket', 'password'] : ['socket']
    },
    where: {
      id
    }
  });
};

/**
 * 遍历用户
 * @param { number } offset
 * @param { number } limit
 * @param { string } sortBy
 * @param { boolean } descending
 */
const Retrieve__Page = (
  offset: number,
  limit: number,
  sortBy?: string,
  descending: boolean = false
): Promise<Array<User | null>> => {
  return User.findAll({
    attributes: {
      exclude: ['socket', 'password']
    },
    offset,
    limit,
    order: sortBy ? [[sortBy, descending ? 'ASC' : 'DESC']] : undefined
  });
};

/**
 * 更新用户信息
 * @param { User } oldUser
 * @param { User } newUser
 */
const Update = (oldUser: User, newUser: User): Promise<User> => {
  return Object.assign(oldUser, newUser).save();
};

/**
 * 删除用户账号
 * @param { number } id
 */
const Delete = (id: number): Promise<number> => {
  return User.destroy({
    where: {
      id
    }
  });
};

export default {
  Create,
  Retrieve__OpenID,
  Retrieve__ID,
  Retrieve__Page,
  Update,
  Delete
};
