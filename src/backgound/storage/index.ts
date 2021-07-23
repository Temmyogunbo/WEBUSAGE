import { addTab, updateTab, reActivateHost, database, getAllKeys, getStats } from './index-db';
import { set, get } from './storage';

export const Storage = {
  addTab,
  updateTab,
  reActivateHost,
  database,
  set,
  get,
  getAllKeys,
  getStats,
};
