/**
 * 预请求快速结束中间件函数
 * @param req
 * @param res
 * @param next
 */
const SkipOptions = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // 预请求快速结束
    return res.status(200).end();
  }
  next();
};

export default SkipOptions