import { IStats } from '../../types';
import flatten from 'lodash.flatten';
import sum from 'lodash.sum';
import flow from 'lodash.flow';
import { convertToHours } from '../hours';

export const hosts = (stats: IStats) => {
  console.log({ stats })
  const mappedHosts = Object.keys(stats)
    .filter((key) => key !== 'date')
    .map((tabId) => {
      const hosts = stats[tabId];

      return Object.keys(hosts).map((hostName) => {
        return {
          hostName,
          period: hosts[hostName].period,
          pathName: hosts[hostName].pathname,
        };
      });
    });
  return flatten(mappedHosts);
};

export const mergeHosts = (
  hosts: { hostName: string; period: number; pathName: string[] }[],
) => {
  return Array.from(new Set(hosts.map(({ hostName }) => hostName))).map(
    (hostName) => {
      return {
        hostName: hostName,
        period: flow([sum, convertToHours])(
          hosts
            .filter((host) => host.hostName === hostName)
            .map((host) => host.period),
        ),
        pathName: flow([flatten])(
          hosts
            .filter((host) => host.hostName === hostName)
            .map((host) => host.pathName),
        ),
      };
    },
  );
};
