const config = {
  /**
   *
   * 后端配置
   *
   */
  serverConfig: {
    port: '8003',
    crypto: {
      // 每次分段加密的字符串最大长度（优先度高于cryptCount字段）
      onceCryptLength: 5,
      // 一次加密至多分段几次加密
      cryptCount: 5,
      // 返回值格式
      // 如果提供了 encoding，则返回字符串，否则返回 Buffer
      // 可选值：['hex', 'Base64', ...]
      digest: 'hex',
      // 用于cipher对称加密生成密钥的密码
      password: 'test'
    },
    jwtConfig: {
      // 密钥
      key: '726cc5f4245ff903154a100d638395b0',

      // 过期时间(单位:秒)
      expiresTime: 60 * 60 * 24 * 3
      // expiresTime: 1
    },
    // 主机
    host:
      // "https://api.hokori.online" ||
      'http://localhost/',
    // 完整URL为： nginx配置下的转发路径 `${location}`
    // baseURL: "/geekblog" || ""
    baseURL: '/tjpu',
    appid: 'wx770e5958e8d4975c',
    secret: '726cc5f4245ff903154a100d638395b0'
  },

  /**
   *
   * 数据库配置
   *
   */
  dataBaseConfig: {
    // 数据库名
    database: 'tjpu_proj',

    // 数据库账号
    user: 'tjpu_proj',

    // 密码
    password: 'zMAsKiaEiEWWx6pN',

    // options
    options: {
      // 数据库类别
      dialect: 'mysql',

      // 主机，如IP 或 'localhost'
      host: '101.201.239.229',

      // 端口, MySQL默认端口3306
      port: '3306',

      // 字符集
      charset: 'utf8mb4',

      // 连接池
      pool: {
        max: 20,
        min: 1,
        idle: 30000,
        acquire: 60000
      },

      // 时区
      timezone: '+08:00'
    }
  }
};
const { serverConfig } = config;
// 同义化配置
if (serverConfig.baseURL === '/') {
  serverConfig.baseURL = '';
}

// 处理以/结尾的URL
const DealWithURL = (url) => {
  if (/^https?:\/\/.*\/$/.test(url)) {
    return url.slice(0, url.length - 1);
  }
  return url;
};
serverConfig.host = DealWithURL(serverConfig.host);

module.exports = config;
