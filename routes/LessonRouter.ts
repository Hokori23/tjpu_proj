import EXPRESS from 'express';

import { LessonService as Service } from '@service';

import { Restful, checkIntegrity, isUndef } from '@utils';
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
 */
ROUTER.get('/retrieve', async (req, res, next) => {
  const { offset, limit, sortBy, descending, subject_id } = req.query;
  if (isUndef(offset) || isUndef(limit)) {
    return res.status(200).json(new Restful(100, '参数错误'));
  }

  res
    .status(200)
    .json(
      await Service.Retrieve(offset, limit, sortBy, descending, subject_id)
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
