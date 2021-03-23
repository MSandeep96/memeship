import fs from 'fs';
import path from 'path';

const cacheFilePath = path.join(__dirname, 'cache.json');

export class Cache{
  memesSent = new Map<string,Set<string>>();
  userIds = new Map<string,string>();

  getUserId = (username: string): string | void => {
    if(this.userIds.has(username)){
      return this.userIds.get(username);
    }
  }

  addUserId = (username: string, userid: string): void => {
    this.userIds.set(username, userid);
  }

  checkIfMemeSent = (username: string, url: string) :boolean => {
    if(this.memesSent.has(username)){
      const userMemes = this.memesSent.get(username);
      return userMemes.has(url);
    }
    return false;
  }

  addMemeUrl = (username:string, url:string):void => {
    if(this.memesSent.has(username)){
      const userMemes = this.memesSent.get(username);
      if(userMemes.size >= 30){
        userMemes.delete(userMemes.values[0]);  //delete first element
      }
      userMemes.add(url);
    }
  }

  init = (): void=> {
    if(fs.existsSync(cacheFilePath)){
      try{
        const cache = JSON.parse(fs.readFileSync(cacheFilePath).toString());
      }catch(e){
        console.log('Failed to read cache');
      }

    }
  }
}
