
export const loadModuleIfExists = (name)=> {
  require('./loaders');

  try {
    return require(name);
  } catch (err) {
    // if there is any issue with the module we should throw
    if (err.code !== 'MODULE_NOT_FOUND') {
      throw err;
    }
  }
};
