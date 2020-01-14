const STORAGE_PREFIX = 'aggrep_storage';

const generate_storage_key = (key:string):string => `${STORAGE_PREFIX}_${key}`;

export const loadSetting = (key:string):object|null => {
  const storedData = localStorage.getItem(generate_storage_key(key));

  if (storedData) {
    return JSON.parse(storedData);
  }

  return null;
};

export const saveSetting = (key:string, newData:any):void => {
  localStorage.setItem(generate_storage_key(key),  JSON.stringify(newData));
};

export const removeSetting = (key:string):void => {
  localStorage.removeItem(generate_storage_key(key));
};