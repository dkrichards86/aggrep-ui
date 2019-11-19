export const isBlank = value => value === '';
export const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);