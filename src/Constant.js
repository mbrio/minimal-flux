let constantId = 0;

class Constant {
  constructor(name) {
    this.name = name;

    // We create a hash key by compositing an incrementing number with the time
    // and the name. This is needed when we use the Constant instance as a key
    // in an associative array.
    const id = constantId = constantId + 1;
    this._hashKeyPrefix = `${id}-${new Date().getTime()}`;
  }

  toString() {
    return `[object Object] (${this._hashKeyPrefix}-${this.name})`;
  }
}

Constant.createConstants = function (...constantNames) {
  let constants = {};

  for (let name of constantNames) {
    constants[name] = new Constant(name);
  }

  return constants;
};

export default Constant;