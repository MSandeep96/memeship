import * as fs from 'fs';
import { join } from 'path';

const cacheFilePath = join(__dirname, 'cache.json');

class Cache {
  memesSent = new Map<string, Set<string>>();
  userIds = new Map<string, string>();

  getUserIdMapping = (username: string): string | undefined => {
    if (this.userIds.has(username)) {
      return this.userIds.get(username);
    }
    return undefined;
  };

  addUserIdMapping = (username: string, userid: string): void => {
    this.userIds.set(username, userid);
  };

  hasMemeBeenSent = (username: string, url: string): boolean => {
    if (this.memesSent.has(username)) {
      const userMemes = this.memesSent.get(username);
      return userMemes.has(url);
    }
    return false;
  };

  addMemeSent = (username: string, url: string): void => {
    if (!this.memesSent.has(username)) {
      this.memesSent.set(username, new Set());
    }
    const userMemes = this.memesSent.get(username);
    if (userMemes.size >= 30) {
      userMemes.delete(userMemes.values[0]); //delete first element
    }
    userMemes.add(url);
  };

  init = (): void => {
    if (fs.existsSync(cacheFilePath)) {
      try {
        const cache = JSON.parse(fs.readFileSync(cacheFilePath).toString());
        Object.entries(cache.memesSent).forEach(([username, memeUrls]) => {
          this.memesSent.set(username, new Set(memeUrls as string[]));
        });
        this.userIds = new Map(Object.entries(cache.userIds));
      } catch (e) {
        console.log('Failed to read cache');
      }
    }
  };

  deinit = (): void => {
    const cache = { memesSent: {}, userIds: {} };
    const memesSent = Object.fromEntries(this.memesSent);
    Object.entries(memesSent).forEach(([username, memesUrl]) => {
      cache.memesSent[username] = Array.from(memesUrl);
    });
    cache.userIds = Object.fromEntries(this.userIds);
    try {
      const cacheJson = JSON.stringify(cache);
      fs.writeFileSync(cacheFilePath, cacheJson);
    } catch (err) {
      console.log('Updating cache file failed');
    }
  };
}

export const cache = new Cache();
