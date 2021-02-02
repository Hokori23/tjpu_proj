import express from 'express';
import expressJwt from 'express-jwt';

import { User as UserRouter } from '@routes';
import { JWTKEY, WHITE_LIST } from '@utils';
import { serverConfig } from '@config';

const { appid, secret, baseURL } = serverConfig;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  expressJwt({
    secret: JWTKEY,
    algorithms: ['HS256'],
    requestProperty: 'auth',
  }).unless({
    path: WHITE_LIST
  })
);

app.use(`${baseURL}/user`, UserRouter);

module.exports = app;
