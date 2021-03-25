import * as fs from 'fs';
import { join } from 'path';
import { encryptor } from '../util/cipher';

const cacheFilePath = join(__dirname, '..', '..', '..', 'cache.encrypt');

class Cache {
  memesSent = new Map<string, Set<string>>();
  userIds = new Map<string, string>();
  triggerNo = 0;

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
        const encryptedCache = fs.readFileSync(cacheFilePath).toString();
        const cache = JSON.parse(encryptor.decrypt(encryptedCache));
        Object.entries(cache.memesSent).forEach(([username, memeUrls]) => {
          this.memesSent.set(username, new Set(memeUrls as string[]));
        });
        this.userIds = new Map(Object.entries(cache.userIds));
        if (cache.triggerNo !== undefined) this.triggerNo = cache.triggerNo + 1;
      } catch (e) {
        console.log('Failed to read cache');
      }
    }
  };

  deinit = (): void => {
    const cache = { memesSent: {}, userIds: {}, triggerNo: this.triggerNo };
    if (this.triggerNo > 750) {
      cache.triggerNo = 0; //reset after 750 triggers
    }
    const memesSent = Object.fromEntries(this.memesSent);
    Object.entries(memesSent).forEach(([username, memesUrl]) => {
      cache.memesSent[username] = Array.from(memesUrl);
    });
    cache.userIds = Object.fromEntries(this.userIds);
    try {
      const cacheJson = JSON.stringify(cache);
      const encryptedCache = encryptor.encrypt(cacheJson);
      fs.writeFileSync(cacheFilePath, encryptedCache);
    } catch (err) {
      console.log('Updating cache file failed');
    }
  };
}

export const cache = new Cache();
