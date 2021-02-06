import { Subject } from '@vo';

/**
 * 查询所有Subject
 */
const Retrieve__All = (type?: number): Promise<Array<Subject>> => {
  return Subject.findAll({
    where: type
      ? {
          type
        }
      : undefined
  });
};

/**
 * 创建Subject
 */
const Create = (subject: Subject): Promise<Subject> => {
  return subject.save();
};

export default { Retrieve__All, Create };
