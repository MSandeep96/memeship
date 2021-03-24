export interface Config {
  friends: {
    username: string;
    frequency: {
      d?: number; //every d days
      h?: number; //every h hours
      m?: number; //every m minutes
    };
    subreddits: string[]; // ['aww','funny']  default ['memes', 'dankmemes']
  }[];
  //0-23 Starts sending memes after this
  startHour: number;
  //0-23 Stops sending memes after this  (same as startHour for always send memez)
  stopAtHour: number;
  // +0530  -0300 offset of your timezone so memes are sent in your timezone regardless of server time
  timezoneOffset: string;
}

export const config: Config = {
  friends: [
    {
      username: 'jsdsz1996',
      frequency: { h: 3 },
      subreddits: ['programmerhumor', 'memes', 'dankmemes'],
    },
    {
      username: 'animesharma08',
      frequency: { h: 3 },
      subreddits: ['programmerhumor', 'memes', 'dankmemes'],
    },
  ],
  startHour: 8,
  stopAtHour: 1,
  timezoneOffset: '+0530',
};
