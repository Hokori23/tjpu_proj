import moment from 'moment';

import { LessonAction as Action, UserAction } from '@action';
import { Lesson } from '@vo';
import { Restful, isUndef } from '@utils';

/**
 * 开设课堂
 * @param { Lesson } lesson
 */
const Create = async (lesson: Lesson): Promise<Restful> => {
  try {
    const user = await UserAction.Retrieve__ID(lesson.uid);
    if (!user) {
      return new Restful(1, '开设课堂失败, 用户不存在');
    }
    if (user.role !== 1) {
      return new Restful(2, '你不是老师，没有权限开设课堂');
    }
    return new Restful(
      0,
      `开设课堂成功`,
      (await Action.Create(lesson)).toJSON()
    );
  } catch (e) {
    return new Restful(99, `开设课堂失败, ${e.message}`);
  }
};

/**
 * 查询课堂
 * @param { number } offset
 * @param { number } limit
 * @param { string } sortBy
 * @param { Array<number> } subject_id
 * @param { boolean } descending
 */
const Retrieve = async (
  offset: number,
  limit: number,
  sortBy?: string,
  descending: boolean = false,
  subject_id: Array<number> = []
): Promise<Restful> => {
  try {
    return new Restful(
      0,
      '查询课堂信息成功',
      await Action.Retrieve__Page(
        Number(offset),
        Number(limit),
        sortBy,
        Boolean(descending),
        subject_id
      )
    );
  } catch (e) {
    return new Restful(99, `查询课堂信息失败, ${e.message}`);
  }
};

/**
 * 编辑课堂信息
 * @param { Lesson } lesson
 */
const Edit = async (lesson: Lesson): Promise<Restful> => {
  try {
    const user = await UserAction.Retrieve__ID(lesson.uid);
    if (!user) {
      return new Restful(1, '编辑课堂信息失败, 用户不存在');
    }
    if (user.role !== 1) {
      return new Restful(2, '你不是老师，没有权限编辑课堂信息');
    }
    const existedLesson = await Action.Retrieve__ID(<number>lesson.id);
    if (!existedLesson) {
      return new Restful(1, '该课堂不存在');
    }
    const newLesson = await Action.Update(existedLesson, lesson);
    return new Restful(0, '编辑课堂信息成功', newLesson.toJSON());
  } catch (e) {
    return new Restful(99, `编辑课堂信息失败, ${e.message}`);
  }
};

/**
 * 删除课堂
 * @param { number } id
 */
const Delete = async (id: number): Promise<Restful> => {
  try {
    const existedLesson = await Action.Retrieve__ID(Number(id));
    if (!existedLesson) {
      return new Restful(1, '该课堂不存在');
    }

    const user = await UserAction.Retrieve__ID(existedLesson.uid);
    if (!user) {
      return new Restful(2, '删除课堂失败, 用户不存在');
    }
    if (user.role !== 1) {
      return new Restful(3, '你不是老师，没有权限编辑课堂信息');
    }
    if (moment().isBefore(existedLesson.end_time)) {
      return new Restful(4, '该课堂还未结束, 不能删除');
    }
    return (await Action.Delete(id)) > 0
      ? new Restful(0, '删除课堂成功')
      : new Restful(5, '删除课堂失败');
  } catch (e) {
    return new Restful(99, `删除课堂失败, ${e.message}`);
  }
};

export default {
  Create,
  Retrieve,
  Edit,
  Delete
};
