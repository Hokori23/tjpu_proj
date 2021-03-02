import EXPRESS from 'express';

import { LessonService as Service } from '@service';

import { Restful, checkIntegrity, isUndef, isDef } from '@utils';
import { Lesson } from '@vo';

const ROUTER = EXPRESS.Router();

/**
 * @path /create
 */
ROUTER.post('/create', async (req, res, next) => {
  const lesson = Lesson.build(req.body);
  if (req.auth.id !== lesson.uid) {
    return res.status(403);
  }
  if (
    !checkIntegrity(lesson, [
      'uid',
      'room_id',
      'subject_id',
      'title',
      'content',
      'start_time',
      'end_time'
    ])
  ) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  res.status(200).json(await Service.Create(lesson));
  next();
});

/**
 * @path /retrieve
 * 如果有uid就单个查询
 * 没有就遍历
 */
ROUTER.post('/retrieve', async (req, res, next) => {
  const { uid, offset, limit, sortBy, descending, subject_id } = req.body;
  if (isUndef(offset) || isUndef(limit)) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  if (isDef(uid)) {
    return res
      .status(200)
      .json(
        await Service.Retrieve__UID(
          offset,
          limit,
          uid,
          sortBy,
          descending === 'true'
        )
      );
  }

  res
    .status(200)
    .json(
      await Service.Retrieve(
        offset,
        limit,
        sortBy,
        descending === 'true',
        subject_id
      )
    );
  next();
});

/**
 * @path /retrieve-time
 * 查询某个时间范围内的课堂
 */
ROUTER.post('/retrieve-time', async (req, res, next) => {
  console.log(req.body);
  const {
    offset,
    limit,
    sortBy,
    descending,
    subject_id,
    start_time,
    end_time
  } = req.body;
  if (
    isUndef(offset) ||
    isUndef(limit) ||
    (isUndef(start_time) && isUndef(end_time)) ||
    isUndef(subject_id) ||
    !subject_id.length
  ) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }

  res
    .status(200)
    .json(
      await Service.Retrieve__WithTimeRange(
        offset,
        limit,
        start_time,
        end_time,
        subject_id,
        sortBy,
        descending === 'true'
      )
    );
  next();
});

/**
 * @path /edit
 */
ROUTER.post('/edit', async (req, res, next) => {
  const lesson: any = Lesson.build(req.body).toJSON();
  if (req.auth.id !== lesson.uid) {
    return res.status(403);
  }
  if (
    !checkIntegrity(lesson, [
      'id',
      'uid',
      'room_id',
      'subject_id',
      'title',
      'content',
      'start_time',
      'end_time'
    ])
  ) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  res.status(200).json(await Service.Edit(lesson));
  next();
});

/**
 * @path /delete
 */
ROUTER.post('/delete', async (req, res, next) => {
  const { id } = req.body;
  if (isUndef(id)) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }
  res.status(200).json(await Service.Delete(id));
  next();
});

export default ROUTER;
