/**
 * Singleton Decorator
 * @param Classification class on which decorator apply 
 * @returns class with constructor
 */
export const Singleton = <T extends new (...args: any[]) => any>(Classification: T) => {
  let instance: T;

  return class {
    constructor(...args: any[]) {
      if (instance) {
        console.error("You cannot instantiate a singleton twice!");
        return instance;
      }

      instance = new Classification(...args);
      return instance;
    }
  } as T;
};

export default Singleton;
