import { Restful } from "@utils";

enum CodeDictionary {
  JWT_ERROR__REQUIRED = 100,
  JWT_ERROR__EXPIRED = 101
}
const tokenCodeDictionary = {
  credentials_required: CodeDictionary.JWT_ERROR__REQUIRED,
  invalid_token: CodeDictionary.JWT_ERROR__EXPIRED
};
export default (err, req, res, next) => {
  if (err.name !== 'UnauthorizedError') {
    console.error('Error caught:', err);
  } else {
    err.code = tokenCodeDictionary[err.code];
  }
  res.status(err.status).json(new Restful(err.code, err?.inner?.message));
};
