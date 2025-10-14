export const Validators = {
  paramCount(expected: number) {
    return (args: string[]) => {
      return args.length !== expected
        ? `Expected ${expected} arguments, but got ${args.length}.`
        : null;
    };
  },

  oneOf(validValues: string[]) {
    return (args: string[]) => {
      const [value] = args;
      if (!value) {return 'Missing value.';}
      if (!validValues.includes(value.toLowerCase())) {
        return `Invalid value "${value}". Expected one of: ${validValues.join(', ')}.`;
      }
      return null;
    };
  },

  numberArgs(positions: number[]) {
    return (args: string[]) => {
      for (const pos of positions) {
        const val = args[pos];
        if (val === undefined || isNaN(Number(val))) {
          return `Argument ${pos + 1} must be a number. Found: "${val}".`;
        }
      }
      return null;
    };
  },

  numberInRange(positions: number[], min: number, max: number) {
    return (args: string[]) => {
      for (const pos of positions) {
        const value = args[pos];
        const num = Number(value);
        if (num < min || num > max) {
          return `Argument at position ${pos + 1} must be a number between ${min} and ${max}.`;
        }
      }
      return null;
    };
  },

  nonEmptyArgs() {
    return (args: string[]) => {
      if (args.length === 0) {return 'Expected at least one argument.';}
      if (args.some(arg => !arg.trim())) {return 'Arguments cannot be empty.';}
      return null;
    };
  },

  noArgs() {
    return (args: string[]) => {
      if (args.length !== 0) {return 'Expected no arguments.';}
      return null;
    };
  },

  chain(...validators: ((args: string[]) => string | null)[]) {
    return (args: string[]) => {
      for (const validate of validators) {
        const result = validate(args);
        if (result) {return result;}
      }
      return null;
    };
  }
};
