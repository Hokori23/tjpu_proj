import { isDef } from '@utils';
import { Lesson, Subject, Subscribe, User } from '@vo';
import { start } from 'repl';
import { Op, Transaction } from 'sequelize';

/**
 * 添加课堂
 * @param { Lesson } lesson
 * @param { Transaction } ?t
 */
const Create = (lesson: Lesson, t?: Transaction): Promise<Lesson> => {
  return lesson.save({ transaction: t });
};

/**
 * 通过id查询单个课堂
 * @param { number } id
 */
const Retrieve__ID = (id: number): Promise<Lesson | null> => {
  return Lesson.findOne({
    where: {
      id
    },
    include: {
      model: User,
      attributes: {
        exclude: ['openid', 'options']
      }
    }
  });
};

/**
 * 通过uid查询单个课堂
 * @param { number } offset
 * @param { number } limit
 * @param { number } uid
 * @param { string } sortBy
 * @param { boolean } descending
 */
const Retrieve__UID = (
  offset: number,
  limit: number,
  uid: number,
  sortBy?: string,
  descending: boolean = false
): Promise<Array<Lesson | null>> => {
  return Lesson.findAll({
    offset,
    limit,
    where: { uid },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['openid', 'options']
        }
      },
      {
        model: Subject
      }
    ],
    order: sortBy ? [[sortBy, descending ? 'ASC' : 'DESC']] : undefined
  });
};

const Count__UID = (uid): Promise<number> => {
  return Lesson.count({
    where: {
      uid
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
    include: [
      {
        model: User,
        attributes: {
          exclude: ['openid', 'options']
        }
      },
      {
        model: Subject
      },
      {
        model: Subscribe
      }
    ],
    order: sortBy ? [[sortBy, descending ? 'ASC' : 'DESC']] : undefined
  });
};

/**
 * 遍历课堂（时间限制）
 * @param { number } offset
 * @param { number } limit
 * @param { number } start_time
 * @param { number } end_time
 * @param { Array<number> } subject_id
 * @param { string } sortBy
 * @param { boolean } descending
 */
const Retrieve__Page__WithTimeRange = (
  offset: number,
  limit: number,
  start_time: number,
  end_time: number,
  subject_id: Array<number>,
  sortBy?: string,
  descending: boolean = false
): Promise<Array<Lesson | null>> => {
  const start_timeOptions = {};
  if (start_time && end_time) {
    start_timeOptions[Op.between] = [start_time, end_time];
  } else if (start_time) {
    start_timeOptions[Op.gt] = start_time;
  } else {
    start_timeOptions[Op.lt] = end_time;
  }
  return Lesson.findAll({
    offset,
    limit,
    where: {
      start_time: start_timeOptions,
      subject_id: {
        [Op.or]: subject_id.map((value) => {
          return value;
        })
      }
    },
    include: [
      {
        model: User,
        attributes: {
          exclude: ['openid', 'options']
        }
      },
      {
        model: Subscribe
      }
    ],
    order: sortBy ? [[sortBy, descending ? 'ASC' : 'DESC']] : undefined
  });
};

const Count__Page__WithTimeRange = (
  start_time: number,
  end_time: number,
  subject_id: Array<number>
) => {
  const start_timeOptions = {};
  if (start_time && end_time) {
    start_timeOptions[Op.between] = [start_time, end_time];
  } else if (start_time) {
    start_timeOptions[Op.gt] = start_time;
  } else {
    start_timeOptions[Op.lt] = end_time;
  }
  return Lesson.count({
    where: {
      start_time: start_timeOptions,
      subject_id: {
        [Op.or]: subject_id.map((value) => {
          return value;
        })
      }
    }
  });
};

/**
 * 遍历课堂（已订阅）
 * @param { number } offset
 * @param { number } limit
 * @param { string } sortBy
 * @param { Array<number> } subject_id
 * @param { boolean } descending
 */
const Retrieve__Subscribe = (
  offset: number,
  limit: number,
  uid: number,
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
    include: [
      {
        model: Subscribe,
        where: {
          uid
        }
      },
      {
        model: Subject
      },
      {
        model: User
      }
    ],
    order: sortBy ? [[sortBy, descending ? 'ASC' : 'DESC']] : undefined
  });
};

const Count__Page = (subject_id: Array<number> = []) => {
  return Lesson.count({
    where: subject_id.length
      ? {
          [Op.or]: subject_id.map((value) => {
            return { subject_id: value };
          })
        }
      : undefined
  });
};

const Count__Subscribe = (uid: number, subject_id: Array<number> = []) => {
  return Lesson.count({
    where: subject_id.length
      ? {
          [Op.or]: subject_id.map((value) => {
            return { subject_id: value };
          })
        }
      : undefined,
    include: {
      model: Subscribe,
      where: {
        uid
      }
    }
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
  Retrieve__UID,
  Count__UID,
  Retrieve__Page,
  Retrieve__Page__WithTimeRange,
  Retrieve__Subscribe,
  Count__Page,
  Count__Page__WithTimeRange,
  Count__Subscribe,
  Update,
  Delete
};
