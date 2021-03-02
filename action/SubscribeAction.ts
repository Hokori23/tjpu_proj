import { Lesson, Subscribe } from '@vo';
import { Transaction } from 'sequelize/types';

/**
 * 订阅课堂
 * @param { Subscribe } subscribe
 * @param { Transaction } ?t
 */
const Create = (subscribe: Subscribe, t?: Transaction): Promise<Subscribe> => {
  return subscribe.save({ transaction: t });
};

/**
 * 取消订阅
 */
const Delete = (uid: number, lesson_id: number): Promise<number> => {
  return Subscribe.destroy({
    where: {
      uid,
      lesson_id
    }
  });
};
export default {
  Create,
  Delete
};
