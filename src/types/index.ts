export interface Chrome {
  tabs: any;
}

interface ITabStats {
  [tabId: string]: {
    [hostName: string]: {
      pathname: string[];
      startTime: number;
      endTime: number;
      active: boolean;
      period: number;
    };
  };
}
export type IStats = ITabStats & {
  date: string;
};

export enum IdleState {
  idle = 'idle',
  locked = 'locked',
  active = 'active',
}
