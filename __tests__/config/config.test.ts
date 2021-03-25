import { Config } from '../../src/config/config';

describe('config date checks', () => {
  const config = new Config();

  it('returns true if starthour is same as stopathour', () => {
    config.startHour = 9;
    config.stopAtHour = 9;
    expect(config.checkIfBetween(new Date())).toBeTruthy();
  });

  it('returns valid values when starthour < stophour', () => {
    config.startHour = 9;
    config.stopAtHour = 14;
    const date = new Date();
    date.setHours(11);
    expect(config.checkIfBetween(date)).toBeTruthy();
    date.setHours(16);
    expect(config.checkIfBetween(date)).toBeFalsy();
    date.setHours(1);
    expect(config.checkIfBetween(date)).toBeFalsy();
  });

  it('returns valid values when starthour > stophour', () => {
    config.startHour = 23;
    config.stopAtHour = 5;
    const date = new Date();
    date.setHours(11);
    expect(config.checkIfBetween(date)).toBeFalsy();
    date.setHours(4);
    expect(config.checkIfBetween(date)).toBeTruthy();
    date.setHours(7);
    expect(config.checkIfBetween(date)).toBeFalsy();
  });
});
