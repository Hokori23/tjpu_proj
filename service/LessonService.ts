import moment from 'moment';

import { LessonAction as Action, WXAction } from '@action';
import { Lesson } from '@vo';
import { Restful, isUndef } from '@utils';

/**
 * 添加课堂
 * @param { Lesson } lesson
 */
const Create = async (lesson: Lesson): Promise<Restful> => {
  try {
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
    const existedLesson = await Action.Retrieve__ID(id);
    if (!existedLesson) {
      return new Restful(1, '该课堂不存在');
    }
    if (moment().isBefore(existedLesson.end_time)) {
      return new Restful(2, '该课堂还未结束, 不能删除');
    }
    return (await Action.Delete(id)) > 0
      ? new Restful(0, '删除课堂成功')
      : new Restful(3, '删除课堂失败');
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
