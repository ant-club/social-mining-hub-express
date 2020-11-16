import ERROR from '../const/ERROR.json';

function check(target, arg) {
  const val = target[arg];
  let varResult = true;
  if (!val) varResult = false;
  if (val && val.length === 0) varResult = false;
  return varResult;
}

function argsCheck(...args) {
  return function wrapper(req, res, next) {
    const { method } = req;
    let target;
    if (method.toUpperCase() === 'GET') {
      target = { ...req.query };
    } else {
      target = { ...req.body };
    }
    let result = true;
    args.forEach((arg) => {
      let varResult = false;
      if (typeof arg === 'string') {
        varResult = check(target, arg);
      } else if (typeof arg === 'object' && arg.length > 0) {
        varResult = arg.map((aarg) => check(target, aarg)).reduce((a, b) => a || b, false);
      }
      result = result && varResult;
    });
    if (result) {
      next();
    } else {
      const ret = {
        success: false,
        error: {
          code: ERROR.ARGS_NEEDED.code,
          message: ERROR.ARGS_NEEDED.message,
        },
      };
      res.send(ret);
    }
  };
}

export default argsCheck;
