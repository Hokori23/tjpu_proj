import { Lesson } from '@vo';
import { Op } from 'sequelize';

/**
 * 添加课堂
 * @param { Lesson } lesson
 */
const Create = (lesson: Lesson): Promise<Lesson> => {
  return lesson.save();
};

/**
 * 通过id查询单个课堂
 * @param { number } id
 */
const Retrieve__ID = (id: number): Promise<Lesson | null> => {
  return Lesson.findOne({
    where: {
      id
    }
  });
};

/**
 * 遍历课堂
 * @param { number } offset
 * @param { number } limit
 * @param { string } sortBy
 * @param { Array<number> } subject_id
 * @param { boolean } descending
 */
const Retrieve__Page = (
  offset: number,
  limit: number,
  sortBy?: string,
  descending: boolean = false,
  subject_id: Array<number> = []
): Promise<Array<Lesson | null>> => {
  return Lesson.findAll({
    offset,
    limit,
    where: subject_id.length
      ? {
          [Op.or]: subject_id.map((value) => {
            return { subject_id: value };
          })
        }
      : undefined,
    order: sortBy ? [[sortBy, descending ? 'ASC' : 'DESC']] : undefined
  });
};

/**
 * 修改课堂信息
 * @param { Lesson } oldLesson
 * @param { Lesson } newLesson
 */
const Update = (oldLesson: Lesson, newLesson: Lesson): Promise<Lesson> => {
  return Object.assign(oldLesson, newLesson).save();
};

/**
 * 删除课堂信息
 * @param { number } id
 */
const Delete = (id: number): Promise<number> => {
  return Lesson.destroy({
    where: {
      id
    }
  });
};

export default {
  Create,
  Retrieve__ID,
  Retrieve__Page,
  Update,
  Delete
};
