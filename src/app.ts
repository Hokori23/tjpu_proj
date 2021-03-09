import express from 'express';
import expressJwt from 'express-jwt';

import {
  UserRouter,
  LessonRouter,
  SubjectRouter,
  SubscribeRouter
} from '@routes';
import { JWTKEY, WHITE_LIST } from '@utils';
import { config } from '@config';

const { appid, secret, baseURL } = config.serverConfig;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  expressJwt({
    secret: JWTKEY,
    algorithms: ['HS256'],
    requestProperty: 'auth'
  }).unless({
    path: WHITE_LIST
  })
);
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
app.use(`${baseURL}/user`, UserRouter);
app.use(`${baseURL}/lesson`, LessonRouter);
app.use(`${baseURL}/subject`, SubjectRouter);
app.use(`${baseURL}/subscribe`, SubscribeRouter);
app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
