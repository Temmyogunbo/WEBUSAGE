import { openDB } from 'idb';
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  DATABASE_STORE,
} from '../../constants';
import { Tracker } from '../../lib/tracker';
import uniq from 'lodash.uniq';
import { IStats, IdleState } from '../../types';

export const open = async () => {
  return openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade: async (db) => {
      if (!db.objectStoreNames.contains(DATABASE_STORE)) {
        console.log(`The store ${DATABASE_STORE} does not exist`);
        console.log(`Creating store ${DATABASE_STORE} already`);

        const statStore = db.createObjectStore(DATABASE_STORE, {
          keyPath: 'date',
        });
        statStore.createIndex('date', 'date');
        console.log(`Finished creating store`);
      }
      console.log(`The store ${DATABASE_STORE} already exist`);
    },
  });
};

export const database = open();

export const addTab = async ({
  key,
  currentTab,
}: {
  key: string;
  currentTab: any;
}) => {
  const db = await database;
  const startTime = Tracker.startTime();
  const url = new URL(currentTab.url);
  const stats = (await db.get(DATABASE_STORE, key)) as IStats;

  if (stats) {
    const tab = stats[currentTab.id];
    const hasTab = Object.keys(stats).includes(`${currentTab.id}`);

    if (hasTab) {
      console.log('after parsing tabs', tab, currentTab.id);
      const host = tab[url.hostname];
      const hosts = stats[currentTab.id];

      const hasHost = Object.keys(hosts).includes(`${url.hostname}`);

      if (hasHost) {
        console.log(`Host ${url.hostname} already exist`);
        console.log(
          `Adding a new pathname, ${url.pathname}, for the host, ${url.hostname}`,
        );
        await db.delete(DATABASE_STORE, key);
        return await db.add(DATABASE_STORE, {
          ...stats,
          [currentTab.id]: {
            ...hosts,
            [url.hostname]: {
              pathname: uniq([...host.pathname, url.pathname]),
              startTime: host.startTime,
              endTime: 0,
              active: true,
              period: host.period,
            },
          },
        });
      } else {
        console.log(`Host ${url.hostname} does not exist`);
        console.log(
          `Creating host, ${url.hostname}, inside tab ${currentTab.id}`,
        );
        await db.delete(DATABASE_STORE, key);
        return await db.add(DATABASE_STORE, {
          ...stats,
          [currentTab.id]: {
            ...hosts,
            [url.hostname]: {
              pathname: [url.pathname],
              startTime,
              endTime: 0,
              period: 0,
              active: true,
            },
          },
        });
      }
    } else {
      console.log(`Tab ${currentTab.id} does not exist`);
      console.log(`Adding new Tab ${currentTab.id}`);

      await db.delete(DATABASE_STORE, key);
      return await db.add(DATABASE_STORE, {
        ...stats,
        [currentTab.id]: {
          [url.hostname]: {
            pathname: [url.pathname],
            startTime,
            endTime: 0,
            period: 0,
            active: true,
          },
        },
      });
    }
  } else {
    console.log(`Key ${key} does not exist in ${DATABASE_STORE} store`);
    console.log(`Adding new Key ${key} to the store ${DATABASE_STORE}`);

    return await db.add(DATABASE_STORE, {
      date: key,
      [currentTab.id]: {
        [url.hostname]: {
          pathname: [url.pathname],
          startTime,
          endTime: 0,
          period: 0,
          active: true,
        },
      },
    });
  }
};

export const updateTab = async ({
  key,
  currentTab,
  idle = false,
}: {
  key: string;
  currentTab: any;
  idle?: boolean;
}) => {
  const db = await database;
  const endTime = Tracker.endTime();
  const url = new URL(currentTab.url);
  const stats = (await db.get(DATABASE_STORE, key)) as IStats;

  if (stats) {
    // switch of time for all other hosts
    const tabIds = Object.keys(stats).filter((key) => key !== 'date');

    const mappedTabs = tabIds
      .map((id) => {
        const hosts = stats[id];
        const mappedHosts = Object.keys(hosts)
          .map((hostName) => {
            const host = hosts[hostName];
            console.log({ host })
            if ((host.active && hostName !== url.hostname) || idle) {
              const newHost = {
                pathname: [...host.pathname],
                active: false,
                startTime: 0,
                endTime: 0,
                period: host.period + Tracker.period(host.startTime, endTime),
              };

              return {
                [hostName]: newHost,
              };
            }
            return {
              [hostName]: {
                pathname: host.pathname,
                active: host.active,
                startTime: host.startTime,
                endTime: host.endTime,
                period: host.period,
              },
            };
          })
          .reduce((accum, currVal) => ({ ...currVal, ...accum }), {});
        return { [id]: mappedHosts };
      })
      .reduce((accum, currVal) => {
        return { ...currVal, ...accum };
      }, {});

    console.log('Switching off all other tabs');

    await db.delete(DATABASE_STORE, key);
    return await db.add(DATABASE_STORE, {
      date: key,
      ...mappedTabs,
    });
  }
  return null;
};

export const reActivateHost = async ({
  key,
  currentTab,
}: {
  key: string;
  currentTab: any;
}) => {
  const db = await database;
  const startTime = Tracker.startTime();
  const url = new URL(currentTab.url);
  const stats = (await db.get(DATABASE_STORE, key)) as IStats;

  if (stats) {
    const tab = stats[currentTab.id];
    const hasTab = Object.keys(stats).includes(`${currentTab.id}`);

    if (hasTab) {
      const host = tab[url.hostname];
      const hosts = stats[currentTab.id];

      const hasHost = Object.keys(hosts).includes(`${url.hostname}`);

      if (hasHost) {
        console.log(`Reactivating the host ${url.hostname}`);
        await db.delete(DATABASE_STORE, key);
        return await db.add(DATABASE_STORE, {
          ...stats,
          [currentTab.id]: {
            ...hosts,
            [url.hostname]: {
              pathname: uniq([...host.pathname, url.pathname]),
              startTime,
              endTime: 0,
              active: true,
              period: host.period,
            },
          },
        });
      }
    }
  }
  return null;
};

export const getAllKeys = async () => {
  const db = await database;
  return await db.getAllKeys(DATABASE_STORE);
}

export const getStats = async (key: string) => {
  const db = await database;

  return await db.get(DATABASE_STORE, key);
}