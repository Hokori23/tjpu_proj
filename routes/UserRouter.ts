import EXPRESS from 'express';
import moment from 'moment';

import { UserService as Service } from '@service';

import { Restful, checkIntegrity, SpawnJWT, isUndef } from '@utils';

const ROUTER = EXPRESS.Router();

/**
 * @path /login
 */
ROUTER.post('/login', async (req, res, next) => {
  const { code, userInfo } = req.body;
  if (isUndef(code) || isUndef(userInfo)) {
    return res.status(200).json(new Restful(99, '参数错误'));
  }
  const result = await Service.Login(code, userInfo);
  if (!result.code) {
    const openid = result.data.openid;
    delete result.data.openid;

    /**
     * 设置JWT
     */
    res.set('Authorization', SpawnJWT(openid));
  }
  res.status(200).json(result);
});
export default ROUTER;
