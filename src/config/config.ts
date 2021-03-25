import { encryptor } from '../util/cipher';
import * as fs from 'fs';
import { ConfigType, encryptConfigPath } from './constants';

export class Config implements ConfigType {
  friends: {
    username: string;
    frequency: number; // once every 'frequency' hours
    // once every 'frequency' hours
    subreddits: string[]; // ['aww','funny']  default ['memes', 'dankmemes']
  }[];
  startHour: number;
  stopAtHour: number;
  timezoneOffset: string;

  init() {
    try {
      if (!fs.existsSync(encryptConfigPath)) {
        throw new Error(
          `Error encrypted config doesn't exist. Please refer readme.md about generating config.`
        );
      }
      const encConfig = fs.readFileSync(encryptConfigPath).toString();
      const config = JSON.parse(encryptor.decrypt(encConfig));
      Object.assign(this, config);
    } catch (err) {
      console.log(err);
      console.log(`Error reading config`);
      process.exit(1);
    }
  }

  isActiveTime = (time: Date) => {
    const offsetTime = this.offsetTime(time);
    if (this.startHour === this.stopAtHour) {
      return true;
    }
    if (this.startHour < this.stopAtHour) {
      return (
        this.startHour <= offsetTime.getHours() &&
        offsetTime.getHours() <= this.stopAtHour
      );
    }
    return (
      this.startHour <= offsetTime.getHours() ||
      this.stopAtHour >= offsetTime.getHours()
    );
  };

  offsetTime = (time: Date): Date => {
    const timezone = +this.timezoneOffset;
    const offset = Math.floor(timezone / 100) * 60 + (timezone % 100);
    const finalOffset = time.getTimezoneOffset() + offset;
    time.setMinutes(time.getMinutes() + finalOffset);
    return time;
  };
}
export const config = new Config();
