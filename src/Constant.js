let constantId = 0;

/**
 * Generates a string to be used as the prefix to a hash key for a Constant.
 * This is used to uniquely identify a Constant passed as a key to an
 * associative array.
 *
 * @return {string}
 */
function requestConstantId() {
  // Serial ID
  let id = constantId + 1;

  // If we've hit the max value for a number reset our ID to 0
  if (id === constantId) { id = 0; }

  // Set the constantId so we can continue productin serial IDs
  constantId = id;

  // We concatenate the serial ID with the current timestamp, this ensures that
  // when we return to 0 after hitting the maximum number value (which is highly
  // unlikely) that we still can generate unique IDs
  return `${id}-${new Date().getTime()}`;
}

/**
 * A Constant that identifies a Flux action
 *
 * @class
 */
class Constant {
  /**
   * Constructor
   * @param  {string} name The action name, it must correspond with a function
   *                       defined on the Actions instance.
   * @return {Constant}
   */
  constructor(name) {
    this.name = name;

    // Request an ID for our Constant
    this._hashKeyPrefix = requestConstantId();
  }

  /**
   * The value returned represents a unique identifier for use with associative
   * arrays.
   * @return {string}
   */
  toActionId() {
    // We use a combination of the generated hash key prefix and the action name
    // to uniquely identify this instance.
    return `[object Object] (${this._hashKeyPrefix}-${this.name})`;
  }
}

/**
 * A helper method that creats Constant instances.
 * @param  {...string} actionNames    A list of all actions to generate Constant
 *                                    instances for.
 * @return {Object<string, Constant>} An associative array of Constant instances
 *                                    keyed by the action names.
 */
Constant.createConstants = function (...actionNames) {
  let constants = {};

  for (let name of actionNames) {
    constants[name] = new Constant(name);
  }

  return constants;
};

export default Constant;