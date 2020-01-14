export const isBlank = (value: string):boolean => value === '';
export const isEmail = (value: string):boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);