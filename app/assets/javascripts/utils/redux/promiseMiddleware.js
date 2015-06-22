export default (next) => (action) => {
    const { promise, type, ...rest } = action;
    if (!promise) {
      return next(action);
    }
    next({ ...rest, type });
    return promise.then(
      (result) => next({ ...rest, result, type: `${type}-success` }),
      (error) => next({ ...rest, error, type: `${type}-failure` })
    );
  };
