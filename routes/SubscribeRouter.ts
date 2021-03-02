import EXPRESS from 'express';

import { LessonAction, SubscribeAction as Action } from '@action';
import { checkIntegrity, isUndef, Restful } from '@utils';
import moment from 'moment';
import { Subscribe } from '@vo';

const ROUTER = EXPRESS.Router();

/**
 * @path /retrieve
 */
ROUTER.get('/retrieve', async (req, res, next) => {
  try {
    const { uid, offset, limit, sortBy, descending } = req.query;
    console.log(req.query);
    if (isUndef(uid) || isUndef(offset) || isUndef(limit)) {
      return res.status(200).json(new Restful(100, '参数错误'));
    }
    const values = await Promise.all([
      LessonAction.Retrieve__Subscribe(
        Number(offset),
        Number(limit),
        Number(uid),
        sortBy,
        descending === 'true'
      ),
      LessonAction.Count__Subscribe(uid)
    ]);
    const result = {
      lessons: values[0].map((lesson: any) => {
        lesson = lesson?.toJSON();
        return {
          ...lesson,
          formatted_start_time: moment(lesson?.start_time).format(
            'YYYY/MM/YY HH:mm'
          ),
          formatted_end_time: moment(lesson?.end_time).format(
            'YYYY/MM/YY HH:mm'
          )
        };
      }),
      count: values[1]
    };
    res.status(200).json(new Restful(0, '查询订阅课堂信息成功', result));
  } catch (e) {
    res.status(200).json(new Restful(99, `查询订阅课堂信息失败, ${e.message}`));
    return;
  }
  next();
});

/**
 * @path /create
 */
ROUTER.post('/create', async (req, res, next) => {
  const subscribe = Subscribe.build(req.body);
  if (!checkIntegrity(subscribe, ['uid', 'lesson_id'])) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  try {
    res
      .status(200)
      .json(new Restful(0, '订阅课堂成功', await Action.Create(subscribe)));
  } catch (e) {
    res.status(200).json(new Restful(99, `订阅课堂失败, ${e.message}`));
    return;
  }
  next();
});

/**
 * @path /delete
 */
ROUTER.post('/delete', async (req, res, next) => {
  const { uid, lesson_id } = req.body;
  console.log(uid, lesson_id);
  if (isUndef(uid) || isUndef(lesson_id)) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  try {
    await Action.Delete(uid, lesson_id);
    res.status(200).json(new Restful(0, '取消订阅成功'));
  } catch (e) {}
  next();
});
export default ROUTER;
