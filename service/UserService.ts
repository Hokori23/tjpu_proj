import { UserAction as Action, WXAction } from '@action';
import { User } from '@vo';
import { Restful, md5Crypto, isUndef } from '@utils';

/**
 * 登录
 * @param { string } code
 * @param { any } userInfo
 */
const Login = async (code: string, userInfo: any): Promise<Restful> => {
  try {
    const { session_key, openid, errmsg } = await WXAction.code2Session(code);
    if (isUndef(openid)) {
      throw new Error(errmsg)
    }
    let user = User.build({ ...userInfo, openid });

    const existedUser = await Action.Retrieve__OpenID(openid);
    if (!existedUser) {
      user = await Action.Create(user);
    } else {
      user = existedUser;
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
    const existedUser = await Action.Retrieve__ID(<number>user.id);
    if (isUndef(existedUser)) {
      return new Restful(1, '账号不存在');
    }
    const newUser = await Action.Update(<User>existedUser, user);
    return new Restful(0, '编辑成功', newUser.toJSON());
  } catch (e) {
    return new Restful(99, `编辑失败, ${e.message}`);
  }
};

export default {
  Login,
  Retrieve,
  Retrieve__Page,
  Edit
};
