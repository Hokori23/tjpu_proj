import EXPRESS from 'express';
import moment from 'moment';

import { UserService as Service } from '@service';

import { Restful, checkIntegrity, SpawnJWT, isUndef, isDef } from '@utils';
import { User } from '@vo';

const ROUTER = EXPRESS.Router();

/**
 * @path /login
 */
ROUTER.post('/login', async (req, res, next) => {
  const { code, userInfo } = req.body;
  if (isUndef(code) || isUndef(userInfo)) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  const result = await Service.Login(code, userInfo);
  if (!result.code) {
    const { openid, id } = result.data;
    delete result.data.openid;

    /**
     * 设置JWT
     */
    res.set('Authorization', SpawnJWT(openid, id));
  }
  res.status(200).json(result);
  next();
});

/**
 * @path /retrieve
 */
ROUTER.get('/retrieve', async (req, res, next) => {
  const { code, id } = req.query;
  if (isDef(code)) {
    res.status(200).json(await Service.Retrieve__Code(code));
    return next();
  }
  if (isDef(id)) {
    res.status(200).json(await Service.Retrieve(code));
    return next();
  }
  res.status(200).json(new Restful(100, '参数错误'));
});

/**
 * @path /edit
 */
ROUTER.post('/edit', async (req, res, next) => {
  const user: any = User.build(req.body).toJSON();
  if (req.auth.id !== user.id || req.auth.openid !== user.openid) {
    return res.status(403).end()
  }
  if (isUndef(user) || !checkIntegrity(user, ['openid'])) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  res.status(200).json(await Service.Edit(user));
  next();
});

ROUTER.post('/test', (req, res, next) => {
  console.log(req.header);
  res.status(500).end();
});
export default ROUTER;
