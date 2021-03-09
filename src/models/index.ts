import User from './User';
import Socket from './Socket';
import Lesson from './Lesson';
import Subject from './Subject';
import Subscribe from './Subscribe';

/**
 * Socket : User
 * 1 : 1
 */
Socket.belongsTo(User, { targetKey: 'id' });
User.hasOne(Socket, { sourceKey: 'id' });

/**
 * Lesson : User
 * N : 1
 */
Lesson.belongsTo(User, {
  foreignKey: 'uid',
  onDelete: 'SET NULL'
});
User.hasMany(Lesson, {
  sourceKey: 'id',
  foreignKey: 'uid'
});

/**
 * Lesson : Subject
 * N : 1
 */
Lesson.belongsTo(Subject, {
  foreignKey: 'subject_id',
  onDelete: 'SET NULL'
});
Subject.hasMany(Lesson, {
  sourceKey: 'id',
  foreignKey: 'subject_id'
});

/**
 * Subscribe : User
 * N : 1
 * -------------
 * Subscribe: Lesson
 * N : 1
 */
Subscribe.belongsTo(User, {
  foreignKey: 'uid',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Subscribe.belongsTo(Lesson, {
  foreignKey: 'lesson_id',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE'
});
Lesson.hasMany(Subscribe, { sourceKey: 'id', foreignKey: 'lesson_id' });

export { User, Socket, Lesson, Subject, Subscribe };
export default { User, Socket, Lesson, Subject, Subscribe };
