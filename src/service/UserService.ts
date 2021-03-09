import { UserAction as Action, WXAction } from '@action';
import { User } from '@models';
import { Restful, md5Crypto, isUndef } from '@utils';

/**
 * 登录
 * @param { string } code
 * @param { any } userInfo
 */
const Login = async (code: string, userInfo: any): Promise<Restful> => {
  try {
    const { session_key, openid, errmsg } = await WXAction.code2Session(code);
    console.log(openid, errmsg, 'request from wx\'s server');
    if (isUndef(openid)) {
      throw new Error(errmsg);
    }
    const { nickName, avatarUrl, country, province, city, gender } = userInfo;
    let user = {
      nickName,
      avatarUrl,
      country,
      province,
      city,
      gender,
      openid
    } as any;

    const existedUser = await Action.Retrieve__OpenID(openid);
    if (!existedUser) {
      user = await Action.Create(User.build(user));
    } else {
      user = await Action.Update(existedUser, user);
    }
    return new Restful(0, '登陆成功', user.toJSON());
  } catch (e) {
    return new Restful(99, `登陆失败, ${e.message}`);
  }
};

/**
 * 通过id查询单个用户
 * @param { string } id
 */
const Retrieve = async (id: string): Promise<Restful> => {
  try {
    const user = await Action.Retrieve__ID(Number(id));
    if (!user) {
      return new Restful(1, '账号不存在');
    }
    return new Restful(0, '查询成功', user.toJSON());
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 通过id查询单个用户
 * @param { string } id
 */
const Retrieve__Code = async (code: string): Promise<Restful> => {
  try {
    const { session_key, openid, errmsg } = await WXAction.code2Session(code);
    if (isUndef(openid)) {
      throw new Error(errmsg);
    }
    const user = await Action.Retrieve__OpenID(openid);
    if (!user) {
      return new Restful(1, '账号不存在');
    }
    return new Restful(0, '查询成功', user.toJSON());
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 分页遍历用户
 * @param { string } offset
 * @param { string } limit
 * @param { string } sortBy
 * @param { string } descending
 */
const Retrieve__Page = async (
  offset: string,
  limit: string,
  descending: string,
  sortBy?: string
): Promise<Restful> => {
  try {
    const users = await Action.Retrieve__Page(
      Number(offset),
      Number(limit),
      sortBy,
      !!Number(descending)
    );
    return new Restful(0, '查询成功', users);
  } catch (e) {
    return new Restful(99, `查询失败, ${e.message}`);
  }
};

/**
 * 编辑用户
 * @param { User } user
 */
const Edit = async (user: User): Promise<Restful> => {
  try {
    let existedUser = await Action.Retrieve__ID(<number>user.id);
    if (!existedUser) {
      return new Restful(1, '账号不存在');
    }

    if (existedUser.role !== user.role && existedUser.role) {
      return new Restful(2, '角色选中后便不能再次更改');
    }
    const newUser = await Action.Update(existedUser, user);
    return new Restful(0, '编辑成功', newUser.toJSON());
  } catch (e) {
    return new Restful(99, `编辑失败, ${e.message}`);
  }
};

export default {
  Login,
  Retrieve,
  Retrieve__Code,
  Retrieve__Page,
  Edit
};
