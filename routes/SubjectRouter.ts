import EXPRESS from 'express';

import { Subject } from '@vo';
import { Restful } from '@utils';

const ROUTER = EXPRESS.Router();

/**
 * @path /retrieve
 */
ROUTER.get('/retrieve', async (req, res, next) => {
  try {
    res
      .status(200)
      .json(new Restful(0, '查询课堂类型成功', await Subject.findAll()));
  } catch (e) {
    res.status(200).json(new Restful(99, '查询课堂类型失败'));
    return;
  }
  next();
});

/**
 * @path /retrieve-category
 */
ROUTER.get('/retrieve-category', async (req, res, next) => {
  try {
    const result = await Subject.findAll();
    res
      .status(200)
      .json(
        new Restful(0, '查询课堂类型成功', [
          result.filter((subject) => subject.type),
          result.filter((subject) => !subject.type)
        ])
      );
  } catch (e) {
    res.status(200).json(new Restful(99, '查询课堂类型失败'));
    return;
  }
  next();
});

export default ROUTER;
