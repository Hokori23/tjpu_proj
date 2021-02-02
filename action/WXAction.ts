import axios from 'axios';
import { serverConfig } from '@config';
const { appid, secret } = serverConfig;

/**
 * 获取openid和session_key
 * @param { string } code
 */
const code2Session = (code: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    axios
      .get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code'
        }
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
export default {
  code2Session
};
