import { Subscribe } from '@vo';

/**
 * 订阅课堂
 * @param { Subscribe } subscribe
 */
const Create = (subscribe: Subscribe): Promise<Subscribe> => {
  return subscribe.save();
};

/**
 * 取消订阅
 */
const Delete = (subscribe: Subscribe): Promise<number> => {
  return Subscribe.destroy({
    where: subscribe.toJSON()
  });
};

export default {
  Create,
  Delete
};
