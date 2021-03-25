import * as path from 'path';

export const configPath = path.join(__dirname, '..', '..', '..', 'config.json');
export const encryptConfigPath = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'config.encrypt'
);

export interface ConfigType {
  friends: {
    username: string;
    frequency: number; // once every 'frequency' hours
    subreddits: string[]; // ['aww','funny']  default ['memes', 'dankmemes']
  }[];
  //0-23 Starts sending memes after this
  startHour: number;
  //0-23 Stops sending memes after this  (same as startHour for always send memez)
  stopAtHour: number;
  // +0530  -0300 offset of your timezone so memes are sent in your timezone regardless of server time
  timezoneOffset: string;
}

export const defaultConfig: ConfigType = {
  friends: [
    {
      username: 'example',
      frequency: 2,
      subreddits: ['programmerhumor', 'memes', 'dankmemes'],
    },
  ],
  startHour: 8,
  stopAtHour: 1,
  timezoneOffset: '+0530',
};
