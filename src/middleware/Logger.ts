import moment from 'moment';
import chalk from 'chalk';

moment.locale('zh-cn');
const LoggerStart = (req, res, next) => {
  //   console.log(req.hostname);
  const URL = req.url;
  console.log(chalk.cyan(`请求: ${moment().format('llll')} --- ${URL}`));
  next();
};

const LoggerMiddle = (req, res, next) => {
  if (res.locals.isResponsed) {
    console.log(
      chalk.cyan(`${res.statusCode} - ${res.statusMessage}  ---------------------------
      `)
    );
  } else {
    return next();
  }
};

const LoggerEnd = (req, res, next) => {
  if (res.statusCode === 200) {
    res.statusMessage = 'OK';
  }
  console.log(
    chalk.cyan(`${res.statusCode} - ${res.statusMessage}  ---------------------------
    `)
  );
};
export { LoggerStart, LoggerMiddle, LoggerEnd };
export default { LoggerStart, LoggerMiddle, LoggerEnd };
