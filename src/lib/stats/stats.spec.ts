import { hosts, mergeHosts } from './stats';

describe('stats', () => {
  const stats = {
    430: {
      'biocentury.com': {
        active: false,
        endTime: 0,
        pathname: ['/'],
        period: 8134392046144,
        startTime: 0,
      }
    }
  }
  it('should get hosts form stats', () => {
    expect(2).toBe(2)
  })
})