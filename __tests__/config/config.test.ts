import { Config } from '../../src/config/config';

describe('config date checks', () => {
  const config = new Config();
  config.timezoneOffset = '+0530';

  it('returns true if starthour is same as stopathour', () => {
    config.startHour = 9;
    config.stopAtHour = 9;
    expect(config.isActiveTime(new Date())).toBeTruthy();
  });

  it('returns valid values when starthour < stophour', () => {
    config.startHour = 9;
    config.stopAtHour = 14;
    const date = new Date();
    date.setHours(11);
    expect(config.isActiveTime(date)).toBeTruthy();
    date.setHours(16);
    expect(config.isActiveTime(date)).toBeFalsy();
    date.setHours(1);
    expect(config.isActiveTime(date)).toBeFalsy();
  });

  it('returns valid values when starthour > stophour', () => {
    config.startHour = 23;
    config.stopAtHour = 5;
    const date = new Date();
    date.setHours(11);
    expect(config.isActiveTime(date)).toBeFalsy();
    date.setHours(4);
    expect(config.isActiveTime(date)).toBeTruthy();
    date.setHours(7);
    expect(config.isActiveTime(date)).toBeFalsy();
  });
});
