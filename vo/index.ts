import User from './User';
import Socket from './Socket';

Socket.belongsTo(User, { targetKey: 'id' });
User.hasOne(Socket, { sourceKey: 'id' });

export { User, Socket };
export default { User, Socket };
