import moment from 'moment';

import { LessonAction as Action, UserAction, SubscribeAction } from '@action';
import { Lesson, Subscribe } from '@models';
import { Restful } from '@utils';
import DB from '@database';

/**
 * 开设课堂
 * @param { Lesson } lesson
 */
const Create = async (lesson: Lesson): Promise<Restful> => {
  const t = await DB.transaction();
  try {
    const user = await UserAction.Retrieve__ID(lesson.uid);
    if (!user) {
      return new Restful(1, '开设课堂失败, 用户不存在');
    }
    if (user.role !== 1) {
      return new Restful(2, '你不是老师，没有权限开设课堂');
    }
    lesson = await Action.Create(lesson, t);

    await SubscribeAction.Create(
      Subscribe.build({
        uid: lesson.uid,
        lesson_id: lesson.id
      }),
      t
    );
    await t.commit();
    return new Restful(0, `开设课堂成功`, lesson.toJSON());
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
  const subjectMap = {};
  subject_id.forEach((id, idx) => {
    subjectMap[id] = idx;
  });
  try {
    const values = await Promise.all([
      Action.Retrieve__Page(
        Number(offset),
        Number(limit),
        sortBy,
        Boolean(descending),
        subject_id
      ),
      Action.Count__Page(subject_id)
    ]);
    const result = {
      lessons: values[0]
        .map((lesson: any) => {
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
        })
        .sort((a, b) => subjectMap[a.subject_id] - subjectMap[b.subject_id]),
      count: values[1]
    };
    return new Restful(0, '查询课堂信息成功', result);
  } catch (e) {
    return new Restful(99, `查询课堂信息失败, ${e.message}`);
  }
};

/**
 * 查询课堂（时间限制）
 * @param { number } offset
 * @param { number } limit
 * @param { string } sortBy
 * @param { Array<number> } subject_id
 * @param { boolean } descending
 */
const Retrieve__WithTimeRange = async (
  offset: number,
  limit: number,
  start_time: number,
  end_time: number,
  subject_id: Array<number>, // 决定了优先顺序
  sortBy?: string,
  descending: boolean = false
): Promise<Restful> => {
  const subjectMap = {};
  subject_id.forEach((id, idx) => {
    subjectMap[id] = idx;
  });
  try {
    const values = await Promise.all([
      Action.Retrieve__Page__WithTimeRange(
        Number(offset),
        Number(limit),
        Number(start_time),
        Number(end_time),
        subject_id,
        sortBy,
        Boolean(descending)
      ),
      Action.Count__Page__WithTimeRange(start_time, end_time, subject_id)
    ]);
    const result = {
      lessons: values[0]
        .map((lesson: any) => {
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
        })
        .sort((a, b) => subjectMap[a.subject_id] - subjectMap[b.subject_id]),
      count: values[1]
    };
    return new Restful(0, '查询课堂信息成功', result);
  } catch (e) {
    console.log(e);
    return new Restful(99, `查询课堂信息失败, ${e.message}`);
  }
};

/**
 * 查询某uid的查询课堂
 * @param { number } uid
 */
const Retrieve__UID = async (
  offset: number,
  limit: number,
  uid: number,
  sortBy?: string,
  descending: boolean = false
): Promise<Restful> => {
  try {
    const values = await Promise.all([
      Action.Retrieve__UID(
        Number(offset),
        Number(limit),
        Number(uid),
        sortBy,
        Boolean(descending)
      ),
      Action.Count__UID(Number(uid))
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
    return new Restful(0, '查询课堂信息成功', result);
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
  Retrieve__WithTimeRange,
  Retrieve__UID,
  Edit,
  Delete
};
